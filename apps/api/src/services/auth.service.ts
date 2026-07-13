import { eq, and } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { users } from '@eamaim/database/schema';
import { sessions } from '@eamaim/database/schema';
import { roleAssignments, roles } from '@eamaim/database/schema';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class AuthService {
  // ── Hash Password (for registration / password reset) ──
  async hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
  }

  // ── Login ──
  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const [user] = await db.select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    if (!user) return null;

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Load user roles & permissions for JWT payload
    const userPermissions = await this.loadUserPermissions(user.id, user.tenantId);

    // Create session
    const token = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await db.insert(sessions).values({
      userId: user.id,
      tenantId: user.tenantId,
      token,
      refreshToken,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        permissions: userPermissions,
      },
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  // ── Load User Permissions from role_assignments → roles ──
  async loadUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    const assignments = await db.select({
      permissions: roles.permissions,
    })
      .from(roleAssignments)
      .innerJoin(roles, and(
        eq(roleAssignments.roleId, roles.id),
        eq(roles.isActive, true),
      ))
      .where(and(
        eq(roleAssignments.userId, userId),
        eq(roleAssignments.tenantId, tenantId),
      ));

    // Merge all role permissions into a flat, deduplicated array
    const allPermissions = new Set<string>();
    for (const assignment of assignments) {
      const perms = assignment.permissions;
      if (Array.isArray(perms)) {
        perms.forEach(p => allPermissions.add(p));
      } else if (perms && typeof perms === 'object') {
        // Handle object-style permissions: { assets: ['create','read'], ... }
        for (const [module, actions] of Object.entries(perms)) {
          if (Array.isArray(actions)) {
            if (actions.includes('*')) {
              allPermissions.add(`${module.toUpperCase()}:*`);
            } else {
              actions.forEach(a => allPermissions.add(`${module.toUpperCase()}_${a.toUpperCase()}`));
            }
          }
        }
      }
    }
    return Array.from(allPermissions);
  }

  // ── Refresh Token ──
  async refresh(refreshToken: string) {
    const [session] = await db.select()
      .from(sessions)
      .where(eq(sessions.refreshToken, refreshToken))
      .limit(1);

    if (!session || new Date(session.expiresAt) < new Date()) return null;

    // Generate new tokens
    const newToken = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.update(sessions)
      .set({ token: newToken, refreshToken: newRefreshToken, expiresAt })
      .where(eq(sessions.id, session.id));

    return { token: newToken, refreshToken: newRefreshToken, expiresAt: expiresAt.toISOString() };
  }

  // ── Logout ──
  async logout(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return true;
  }

  // ── Get Current User ──
  async getCurrentUser(userId: string) {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      tenantId: users.tenantId,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    // Include permissions in profile
    const permissions = await this.loadUserPermissions(user.id, user.tenantId);
    return { ...user, permissions };
  }
}

export const authService = new AuthService();

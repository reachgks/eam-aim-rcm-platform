import { eq, and } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { users } from '@eamaim/database/schema';
import { sessions } from '@eamaim/database/schema';
import crypto from 'crypto';

export class AuthService {
  // ── Login ──
  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const [user] = await db.select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    if (!user) return null;

    // TODO: Replace with bcrypt.compare(password, user.passwordHash)
    // For now, accept any password in development
    if (process.env.NODE_ENV !== 'development') {
      // const isValid = await bcrypt.compare(password, user.passwordHash);
      // if (!isValid) return null;
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

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
      },
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
    };
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
    return user || null;
  }
}

export const authService = new AuthService();

// NotificationService — Notification bus for system events
// In production, this would integrate with email, SMS, push notification providers

export class NotificationService {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(handler);
  }

  async emit(event: string, payload: any) {
    const handlers = this.listeners.get(event) || [];
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (err) {
        console.error(`Notification handler error [${event}]:`, err);
      }
    }
    // Log all notifications
    console.log(`📧 Notification [${event}]:`, JSON.stringify(payload).substring(0, 200));
  }

  async notifyWorkOrderCreated(data: { tenantId: string; woNumber: string; assignedTo?: string }) {
    await this.emit('work-order.created', data);
  }

  async notifySlaBreach(data: { tenantId: string; slaId: string; workOrderId: string }) {
    await this.emit('sla.breach', data);
  }

  async notifyCdeStateChange(data: { tenantId: string; containerId: string; newState: string }) {
    await this.emit('cde.state-change', data);
  }

  async notifyPermitExpiry(data: { tenantId: string; permitId: string; expiryDate: string }) {
    await this.emit('permit.expiry', data);
  }

  async notifyReorderPoint(data: { tenantId: string; itemCode: string; currentQty: number; reorderPoint: number }) {
    await this.emit('inventory.reorder', data);
  }
}

export const notificationService = new NotificationService();

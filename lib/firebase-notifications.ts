/**
 * Firebase Cloud Messaging (FCM) Push Notification Service
 * Handles real-time notifications for check-ins, waivers, and tournament updates
 */

export interface NotificationPayload {
  title: string;
  body: string;
  type: 'check_in_reminder' | 'waiver_deadline' | 'tournament_update' | 'general';
  data?: Record<string, string>;
  timestamp: Date;
}

export interface NotificationPreferences {
  checkInReminders: boolean;
  waiverDeadlines: boolean;
  tournamentUpdates: boolean;
  generalNotifications: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationPayload['type'];
  read: boolean;
  timestamp: Date;
  data?: Record<string, string>;
}

/**
 * Firebase Notifications Service Class
 */
export class FirebaseNotificationsService {
  private apiKey: string;
  private projectId: string;
  private messagingSenderId: string;
  private notifications: PushNotification[] = [];

  constructor(apiKey: string, projectId: string, messagingSenderId: string) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.messagingSenderId = messagingSenderId;
  }

  /**
   * Send check-in reminder notification
   */
  async sendCheckInReminder(
    userId: string,
    tournamentName: string,
    timeRemaining: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: 'Check-In Reminder',
      body: `Don't forget to check in for ${tournamentName}. ${timeRemaining} remaining.`,
      type: 'check_in_reminder',
      data: {
        tournamentName,
        timeRemaining,
        userId,
      },
      timestamp: new Date(),
    };

    return this.sendNotification(userId, payload);
  }

  /**
   * Send waiver signing deadline notification
   */
  async sendWaiverDeadlineReminder(
    userId: string,
    tournamentName: string,
    daysRemaining: number
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: 'Waiver Signing Deadline',
      body: `Please sign your waiver for ${tournamentName}. ${daysRemaining} day(s) remaining.`,
      type: 'waiver_deadline',
      data: {
        tournamentName,
        daysRemaining: daysRemaining.toString(),
        userId,
      },
      timestamp: new Date(),
    };

    return this.sendNotification(userId, payload);
  }

  /**
   * Send tournament update notification
   */
  async sendTournamentUpdate(
    userId: string,
    tournamentName: string,
    updateMessage: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: 'Tournament Update',
      body: `${tournamentName}: ${updateMessage}`,
      type: 'tournament_update',
      data: {
        tournamentName,
        updateMessage,
        userId,
      },
      timestamp: new Date(),
    };

    return this.sendNotification(userId, payload);
  }

  /**
   * Send general notification
   */
  async sendGeneralNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title,
      body,
      type: 'general',
      data,
      timestamp: new Date(),
    };

    return this.sendNotification(userId, payload);
  }

  /**
   * Send notification to user
   */
  private async sendNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      // Simulate sending notification to Firebase
      // In production, this would call Firebase Cloud Messaging API
      const notification: PushNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: payload.title,
        body: payload.body,
        type: payload.type,
        read: false,
        timestamp: payload.timestamp,
        data: payload.data,
      };

      this.notifications.push(notification);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: string, limit: number = 50): PushNotification[] {
    return this.notifications.slice(0, limit);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => {
      n.read = true;
    });
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex((n) => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(
    callback: (notification: PushNotification) => void
  ): () => void {
    // In production, this would use Firebase Realtime Database or Firestore listeners
    // For now, return an unsubscribe function
    return () => {
      // Unsubscribe logic
    };
  }
}

export default FirebaseNotificationsService;

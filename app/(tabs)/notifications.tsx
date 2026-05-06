import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import { PushNotification } from '@/lib/firebase-notifications';

export default function NotificationsScreen() {
  const colors = useColors();
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: '1',
      title: 'Check-In Reminder',
      body: "Don't forget to check in for Spring Classic 7v7. 2 hours remaining.",
      type: 'check_in_reminder',
      read: false,
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      data: { tournamentName: 'Spring Classic 7v7' },
    },
    {
      id: '2',
      title: 'Waiver Signing Deadline',
      body: 'Please sign your waiver for Gulf Coast Showcase. 1 day(s) remaining.',
      type: 'waiver_deadline',
      read: false,
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      data: { tournamentName: 'Gulf Coast Showcase' },
    },
    {
      id: '3',
      title: 'Tournament Update',
      body: 'Spring Classic 7v7: Your team has been seeded #3 in the 18U bracket.',
      type: 'tournament_update',
      read: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      data: { tournamentName: 'Spring Classic 7v7' },
    },
    {
      id: '4',
      title: 'Tournament Update',
      body: 'Gulf Coast Showcase: Game 1 results are now available.',
      type: 'tournament_update',
      read: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      data: { tournamentName: 'Gulf Coast Showcase' },
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'check_in_reminder':
        return '📋';
      case 'waiver_deadline':
        return '📝';
      case 'tournament_update':
        return '🏆';
      default:
        return '📢';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-3xl font-bold text-foreground">Notifications</Text>
              {unreadCount > 0 && (
                <View
                  className="bg-primary rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-background font-bold text-sm">{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-muted">Stay updated on tournaments and events</Text>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setFilter('all')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor:
                    filter === 'all' ? colors.primary : colors.surface,
                },
              ]}
              className="flex-1 rounded-lg p-3 items-center border border-border"
            >
              <Text
                className={cn(
                  'font-semibold',
                  filter === 'all' ? 'text-background' : 'text-foreground'
                )}
              >
                All
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter('unread')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor:
                    filter === 'unread' ? colors.primary : colors.surface,
                },
              ]}
              className="flex-1 rounded-lg p-3 items-center border border-border"
            >
              <Text
                className={cn(
                  'font-semibold',
                  filter === 'unread' ? 'text-background' : 'text-foreground'
                )}
              >
                Unread
              </Text>
            </Pressable>
          </View>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <Pressable
              onPress={handleMarkAllAsRead}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface rounded-lg p-3 border border-border"
            >
              <Text className="text-center text-sm font-semibold text-primary">
                Mark all as read
              </Text>
            </Pressable>
          )}

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <View className="bg-surface rounded-lg p-8 items-center justify-center">
              <Text className="text-2xl mb-2">📭</Text>
              <Text className="text-foreground font-semibold">No notifications</Text>
              <Text className="text-muted text-sm mt-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'Check back later for updates'}
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {filteredNotifications.map((notification) => (
                <Pressable
                  key={notification.id}
                  onPress={() => handleMarkAsRead(notification.id)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: notification.read
                        ? colors.surface
                        : colors.background,
                    },
                  ]}
                  className={cn('rounded-lg p-4 border', notification.read ? 'border-border' : 'border-primary')}
                >
                  <View className="flex-row gap-3">
                    {/* Icon */}
                    <Text className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </Text>

                    {/* Content */}
                    <View className="flex-1 gap-1">
                      <View className="flex-row justify-between items-start gap-2">
                        <Text className="font-semibold text-foreground flex-1">
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                          />
                        )}
                      </View>
                      <Text className="text-sm text-muted">{notification.body}</Text>
                      <Text className="text-xs text-muted mt-1">
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>

                    {/* Delete Button */}
                    <Pressable
                      onPress={() => handleDelete(notification.id)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                      className="p-2"
                    >
                      <Text className="text-lg">✕</Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

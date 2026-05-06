/**
 * Notification Template System
 * 
 * Tournament Host feature for creating reusable notification templates
 * and scheduling them for specific tournament milestones.
 * 
 * Milestones:
 * - Registration Opens
 * - Registration Closes
 * - Roster Revisions Open
 * - Roster Revisions Close
 * - Check-In Starts
 * - Check-In Ends
 * - Games Begin
 * - Tournament Ends
 * - Results Posted
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface NotificationTemplate {
  id: string;
  name: string;
  milestone: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: Date;
  usageCount: number;
}

const MILESTONES = [
  { value: 'registration_opens', label: 'Registration Opens' },
  { value: 'registration_closes', label: 'Registration Closes' },
  { value: 'roster_revisions_open', label: 'Roster Revisions Open' },
  { value: 'roster_revisions_close', label: 'Roster Revisions Close' },
  { value: 'checkin_starts', label: 'Check-In Starts' },
  { value: 'checkin_ends', label: 'Check-In Ends' },
  { value: 'games_begin', label: 'Games Begin' },
  { value: 'tournament_ends', label: 'Tournament Ends' },
  { value: 'results_posted', label: 'Results Posted' },
];

export default function NotificationTemplates() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // TODO: Fetch templates from API
      // const response = await fetch('/api/notification-templates');
      // const data = await response.json();
      // setTemplates(data);

      // Mock data
      setTemplates([
        {
          id: '1',
          name: 'Registration Reminder',
          milestone: 'registration_closes',
          title: 'Registration Closing Soon',
          message: 'Registration closes in 24 hours. Register your team now!',
          isActive: true,
          createdAt: new Date('2026-05-01'),
          usageCount: 12,
        },
        {
          id: '2',
          name: 'Check-In Reminder',
          milestone: 'checkin_starts',
          title: 'Check-In is Now Open',
          message: 'Check-in is open. Please check in your players before games begin.',
          isActive: true,
          createdAt: new Date('2026-05-02'),
          usageCount: 8,
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load templates');
      console.error('Load templates error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName || !selectedMilestone || !notificationTitle || !notificationMessage) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch('/api/notification-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          milestone: selectedMilestone,
          title: notificationTitle,
          message: notificationMessage,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      Alert.alert('Success', 'Template created successfully');
      resetForm();
      setShowCreateModal(false);
      loadTemplates();
    } catch (error) {
      Alert.alert('Error', 'Failed to create template');
      console.error('Create template error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    if (!templateName || !selectedMilestone || !notificationTitle || !notificationMessage) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch(`/api/notification-templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          milestone: selectedMilestone,
          title: notificationTitle,
          message: notificationMessage,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      Alert.alert('Success', 'Template updated successfully');
      resetForm();
      setShowEditModal(false);
      loadTemplates();
    } catch (error) {
      Alert.alert('Error', 'Failed to update template');
      console.error('Update template error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert('Delete Template', 'Are you sure you want to delete this template?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await fetch(`/api/notification-templates/${templateId}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error('Failed to delete template');
            }

            Alert.alert('Success', 'Template deleted successfully');
            loadTemplates();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete template');
            console.error('Delete template error:', error);
          }
        },
      },
    ]);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setSelectedMilestone(template.milestone);
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
    setIsActive(template.isActive);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setTemplateName('');
    setSelectedMilestone('');
    setNotificationTitle('');
    setNotificationMessage('');
    setIsActive(true);
    setEditingTemplate(null);
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Notification Templates
            </Text>
            <Text className="text-base text-muted">
              Create reusable templates for tournament milestones
            </Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="bg-primary rounded-lg py-4 items-center justify-center"
          >
            <Text className="text-background font-semibold text-base">
              Create New Template
            </Text>
          </TouchableOpacity>

          {/* Templates List */}
          <View className="gap-3">
            {templates.length === 0 ? (
              <View className="bg-surface rounded-lg p-6 border border-border items-center justify-center gap-2">
                <Text className="text-lg font-semibold text-foreground">
                  No Templates Yet
                </Text>
                <Text className="text-sm text-muted">
                  Create your first notification template to get started
                </Text>
              </View>
            ) : (
              templates.map((template) => (
                <View
                  key={template.id}
                  className="bg-surface rounded-lg p-4 border border-border gap-3"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-semibold text-foreground">
                        {template.name}
                      </Text>
                      <View className="flex-row gap-2 items-center">
                        <View
                          className={cn(
                            'px-2 py-1 rounded',
                            template.isActive
                              ? 'bg-success bg-opacity-20'
                              : 'bg-muted bg-opacity-20'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-xs font-semibold',
                              template.isActive ? 'text-success' : 'text-muted'
                            )}
                          >
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted">
                          {MILESTONES.find((m) => m.value === template.milestone)?.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="gap-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {template.title}
                    </Text>
                    <Text className="text-sm text-muted">{template.message}</Text>
                  </View>

                  <View className="flex-row justify-between items-center text-xs text-muted">
                    <Text>Used {template.usageCount} times</Text>
                    <Text>{template.createdAt.toLocaleDateString()}</Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEditTemplate(template)}
                      className="flex-1 bg-primary bg-opacity-20 rounded-lg py-2 items-center"
                    >
                      <Text className="text-primary font-semibold text-sm">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteTemplate(template.id)}
                      className="flex-1 bg-error bg-opacity-20 rounded-lg py-2 items-center"
                    >
                      <Text className="text-error font-semibold text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Info Card */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-sm font-semibold text-foreground">
              How It Works:
            </Text>
            <View className="gap-1">
              <Text className="text-sm text-muted">
                1. Create a template with your message
              </Text>
              <Text className="text-sm text-muted">
                2. Select the tournament milestone to trigger it
              </Text>
              <Text className="text-sm text-muted">
                3. Template automatically sends at the right time
              </Text>
              <Text className="text-sm text-muted">
                4. Reuse across multiple tournaments
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal || showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
        }}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4 max-h-4/5">
            <Text className="text-2xl font-bold text-foreground">
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </Text>

            <ScrollView className="gap-4">
              {/* Template Name */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Template Name
                </Text>
                <TextInput
                  placeholder="e.g., Registration Reminder"
                  value={templateName}
                  onChangeText={setTemplateName}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Milestone Selection */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Tournament Milestone
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {MILESTONES.map((milestone) => (
                      <TouchableOpacity
                        key={milestone.value}
                        onPress={() => setSelectedMilestone(milestone.value)}
                        className={cn(
                          'px-3 py-2 rounded-lg border-2',
                          selectedMilestone === milestone.value
                            ? 'bg-primary border-primary'
                            : 'bg-surface border-border'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-xs font-semibold whitespace-nowrap',
                            selectedMilestone === milestone.value
                              ? 'text-background'
                              : 'text-foreground'
                          )}
                        >
                          {milestone.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Notification Title */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Notification Title
                </Text>
                <TextInput
                  placeholder="e.g., Registration Closing Soon"
                  value={notificationTitle}
                  onChangeText={setNotificationTitle}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Notification Message */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Notification Message
                </Text>
                <TextInput
                  placeholder="Enter your message"
                  value={notificationMessage}
                  onChangeText={setNotificationMessage}
                  multiline
                  numberOfLines={4}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Active Toggle */}
              <View className="flex-row justify-between items-center bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm font-semibold text-foreground">Active</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pt-4">
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={saveLoading}
                onPress={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                {saveLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-background font-semibold">
                    {editingTemplate ? 'Update' : 'Create'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

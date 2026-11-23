import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationBadgeType, NotificationItem } from './NotificationsScreen';

export type MessageTypeOption = 'Service reminder' | 'Other message' | 'System notice';
export type RecurrenceOption = 'Once' | 'Daily' | 'Weekly' | 'Monthly';
export type PriorityOption = 'Low' | 'Normal' | 'High';

export type NotificationDraftData = {
  messageType: MessageTypeOption;
  recipient: string;
  channels: string;
  vehicleAssociation: string;
  title: string;
  message: string;
  date: string;
  time: string;
  recurrence: RecurrenceOption;
  priority: PriorityOption;
};

const MESSAGE_TYPES: MessageTypeOption[] = [
  'Service reminder',
  'Other message',
  'System notice',
];

const CHANNEL_OPTIONS = [
  'Email + in-app',
  'In-app only',
  'Email only',
  'SMS + in-app',
];

const RECURRENCE_OPTIONS: RecurrenceOption[] = ['Once', 'Daily', 'Weekly', 'Monthly'];
const PRIORITY_OPTIONS: PriorityOption[] = ['Low', 'Normal', 'High'];

const DEFAULT_NOTIFICATION_FORM: NotificationDraftData = {
  messageType: 'Service reminder',
  recipient: 'Kaveesha P.',
  channels: 'Email + in-app',
  vehicleAssociation: 'WP ABC-1234 · Toyota Aqua',
  title: 'Your Toyota Aqua is due for service',
  message:
    'A periodic engine service is due at 86,000 km. Book with Perera Auto Works to keep your verified history current.',
  date: '24 Sep 2026',
  time: '09:00 AM',
  recurrence: 'Once',
  priority: 'High',
};

type FormErrors = {
  recipient?: string;
  title?: string;
  message?: string;
  date?: string;
  time?: string;
};

type OpenDropdown = 'channels' | 'recurrence' | 'priority' | null;

export type CreateNotificationScreenProps = {
  initialDraft?: NotificationDraftData | null;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: (draft: NotificationDraftData) => void;
  onSave: (notification: NotificationItem) => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onMenuPress?: () => void;
};

const mapPriorityToBadge = (
  priority: PriorityOption,
  messageType: MessageTypeOption
): NotificationBadgeType => {
  if (priority === 'High') {
    return 'High priority';
  }
  if (messageType === 'Service reminder') {
    return 'Reminder';
  }
  if (messageType === 'System notice') {
    return 'Action required';
  }
  return 'Verified';
};

const getChannelPreviewLabel = (channels: string): string => {
  if (channels === 'Email + in-app') {
    return 'Email + AutoCare app';
  }
  return channels;
};

export const CreateNotificationScreen: React.FC<CreateNotificationScreenProps> = ({
  initialDraft,
  onBack,
  onCancel,
  onSaveDraft,
  onSave,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onMenuPress,
}) => {
  const seed = initialDraft ?? DEFAULT_NOTIFICATION_FORM;

  const [messageType, setMessageType] = useState<MessageTypeOption>(seed.messageType);
  const [recipient, setRecipient] = useState<string>(seed.recipient);
  const [channels, setChannels] = useState<string>(seed.channels);
  const [vehicleAssociation, setVehicleAssociation] = useState<string>(
    seed.vehicleAssociation
  );
  const [title, setTitle] = useState<string>(seed.title);
  const [message, setMessage] = useState<string>(seed.message);
  const [date, setDate] = useState<string>(seed.date);
  const [time, setTime] = useState<string>(seed.time);
  const [recurrence, setRecurrence] = useState<RecurrenceOption>(seed.recurrence);
  const [priority, setPriority] = useState<PriorityOption>(seed.priority);

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleDropdown = (target: Exclude<OpenDropdown, null>) => {
    setOpenDropdown((prev) => (prev === target ? null : target));
  };

  const handleSaveDraft = () => {
    setErrors({});
    onSaveDraft({
      messageType,
      recipient: recipient.trim(),
      channels,
      vehicleAssociation: vehicleAssociation.trim(),
      title: title.trim(),
      message: message.trim(),
      date: date.trim(),
      time: time.trim(),
      recurrence,
      priority,
    });
  };

  const handleSave = () => {
    const trimmedRecipient = recipient.trim();
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();
    const trimmedDate = date.trim();
    const trimmedTime = time.trim();
    const trimmedVehicle = vehicleAssociation.trim();

    const nextErrors: FormErrors = {};

    if (!trimmedRecipient) {
      nextErrors.recipient = 'Recipient is required.';
    }
    if (!trimmedTitle) {
      nextErrors.title = 'Title is required.';
    }
    if (!trimmedMessage) {
      nextErrors.message = 'Message is required.';
    }
    if (!trimmedDate) {
      nextErrors.date = 'Schedule date is required.';
    }
    if (!trimmedTime) {
      nextErrors.time = 'Schedule time is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const badge = mapPriorityToBadge(priority, messageType);
    const subtitleParts = [trimmedVehicle, trimmedRecipient].filter(Boolean);
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      section: 'today',
      title: trimmedTitle,
      subtitle: subtitleParts.join(' · ') || trimmedMessage,
      badge,
      timestamp: trimmedTime,
      icon:
        priority === 'High'
          ? 'alert-circle-outline'
          : messageType === 'Service reminder'
          ? 'time-outline'
          : 'notifications-outline',
    };

    onSave(newNotification);
  };

  const hasValidationErrors = Object.values(errors).some(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. WHITE HEADER */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
          accessible
          accessibilityLabel="AutoCare 360 Logo"
        />

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerIconButton, styles.headerIconButtonActive]}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications" size={20} color="#0056A2" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => onMenuPress?.()}
            activeOpacity={0.7}
            accessibilityLabel="Menu"
          >
            <Ionicons name="menu-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 2. PAGE TOP */}
          <View style={styles.pageHeaderSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={16} color="#0056A2" />
              <Text style={styles.backButtonText}>Back to Notifications</Text>
            </TouchableOpacity>

            <View style={styles.topHeaderRow}>
              <Text style={styles.pageTitle}>Create a notification</Text>

              <View style={styles.topActionButtons}>
                <TouchableOpacity
                  style={styles.draftButton}
                  onPress={handleSaveDraft}
                  activeOpacity={0.8}
                >
                  <Text style={styles.draftButtonText}>Save draft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveTopButton}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveTopButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.pageSubtitle}>
              Schedule a reminder or operational message for an owner or workshop team.
            </Text>
          </View>

          {/* 3. MESSAGE TYPE CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Message type</Text>
            <View style={styles.pillsWrap}>
              {MESSAGE_TYPES.map((typeOption) => {
                const isSelected = messageType === typeOption;
                return (
                  <Pressable
                    key={typeOption}
                    style={[styles.typePill, isSelected ? styles.typePillActive : null]}
                    onPress={() => setMessageType(typeOption)}
                  >
                    <Text
                      style={[
                        styles.typePillText,
                        isSelected ? styles.typePillTextActive : null,
                      ]}
                    >
                      {typeOption}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 4. RECIPIENT AND CHANNEL CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recipient and channel</Text>
            <View style={styles.divider} />

            {/* RECIPIENT */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>RECIPIENT</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.recipient ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={16}
                  color="#94a3b8"
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter recipient name"
                  placeholderTextColor="#94a3b8"
                  value={recipient}
                  onChangeText={(val) => {
                    setRecipient(val);
                    clearFieldError('recipient');
                  }}
                  accessibilityLabel="Recipient"
                />
              </View>
              {errors.recipient ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.recipient}</Text>
                </View>
              ) : null}
            </View>

            {/* CHANNELS */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>CHANNELS</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('channels')}
                accessibilityRole="button"
                accessibilityLabel="Channels"
              >
                <View style={styles.selectorLeft}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color="#94a3b8"
                    style={styles.inputLeftIcon}
                  />
                  <Text style={styles.selectorValue}>{channels}</Text>
                </View>
                <Ionicons
                  name={
                    openDropdown === 'channels'
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={17}
                  color="#64748b"
                />
              </Pressable>

              {openDropdown === 'channels' ? (
                <View style={styles.dropdownMenu}>
                  {CHANNEL_OPTIONS.map((option, idx) => {
                    const isSelected = option === channels;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < CHANNEL_OPTIONS.length - 1
                            ? styles.dropdownItemBorder
                            : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setChannels(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected ? styles.dropdownItemTextSelected : null,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected ? (
                          <Ionicons name="checkmark" size={16} color="#0056A2" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* VEHICLE ASSOCIATION */}
            <View style={styles.formGroupLast}>
              <Text style={styles.fieldLabel}>VEHICLE ASSOCIATION</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="car-outline"
                  size={16}
                  color="#94a3b8"
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. WP ABC-1234 · Toyota Aqua"
                  placeholderTextColor="#94a3b8"
                  value={vehicleAssociation}
                  onChangeText={setVehicleAssociation}
                  accessibilityLabel="Vehicle Association"
                />
              </View>
            </View>
          </View>

          {/* 5. MESSAGE CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Message</Text>
            <View style={styles.divider} />

            {/* TITLE */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>TITLE</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.title ? styles.inputWrapperError : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Notification title"
                  placeholderTextColor="#94a3b8"
                  value={title}
                  onChangeText={(val) => {
                    setTitle(val);
                    clearFieldError('title');
                  }}
                  accessibilityLabel="Notification Title"
                />
              </View>
              {errors.title ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.title}</Text>
                </View>
              ) : null}
            </View>

            {/* MESSAGE */}
            <View style={styles.formGroupLast}>
              <Text style={styles.fieldLabel}>MESSAGE</Text>
              <View
                style={[
                  styles.multilineWrapper,
                  errors.message ? styles.inputWrapperError : null,
                ]}
              >
                <TextInput
                  style={styles.multilineInput}
                  placeholder="Write reminder or operational message..."
                  placeholderTextColor="#94a3b8"
                  value={message}
                  onChangeText={(val) => {
                    setMessage(val);
                    clearFieldError('message');
                  }}
                  multiline
                  textAlignVertical="top"
                  accessibilityLabel="Notification Message"
                />
              </View>
              {errors.message ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.message}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* 6. SCHEDULE CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Schedule</Text>
            <View style={styles.divider} />

            <View style={styles.twoColRow}>
              {/* DATE */}
              <View style={styles.twoColItem}>
                <Text style={styles.fieldLabel}>DATE</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.date ? styles.inputWrapperError : null,
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color="#94a3b8"
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="24 Sep 2026"
                    placeholderTextColor="#94a3b8"
                    value={date}
                    onChangeText={(val) => {
                      setDate(val);
                      clearFieldError('date');
                    }}
                    accessibilityLabel="Schedule Date"
                  />
                </View>
                {errors.date ? (
                  <Text style={styles.compactErrorText}>{errors.date}</Text>
                ) : null}
              </View>

              {/* TIME */}
              <View style={styles.twoColItem}>
                <Text style={styles.fieldLabel}>TIME</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.time ? styles.inputWrapperError : null,
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color="#94a3b8"
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="09:00 AM"
                    placeholderTextColor="#94a3b8"
                    value={time}
                    onChangeText={(val) => {
                      setTime(val);
                      clearFieldError('time');
                    }}
                    accessibilityLabel="Schedule Time"
                  />
                </View>
                {errors.time ? (
                  <Text style={styles.compactErrorText}>{errors.time}</Text>
                ) : null}
              </View>
            </View>

            {/* RECURRENCE */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>RECURRENCE</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('recurrence')}
                accessibilityRole="button"
                accessibilityLabel="Recurrence"
              >
                <Text style={styles.selectorValue}>{recurrence}</Text>
                <Ionicons
                  name={
                    openDropdown === 'recurrence'
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={17}
                  color="#64748b"
                />
              </Pressable>

              {openDropdown === 'recurrence' ? (
                <View style={styles.dropdownMenu}>
                  {RECURRENCE_OPTIONS.map((option, idx) => {
                    const isSelected = option === recurrence;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < RECURRENCE_OPTIONS.length - 1
                            ? styles.dropdownItemBorder
                            : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setRecurrence(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected ? styles.dropdownItemTextSelected : null,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected ? (
                          <Ionicons name="checkmark" size={16} color="#0056A2" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* PRIORITY */}
            <View style={styles.formGroupLast}>
              <Text style={styles.fieldLabel}>PRIORITY</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('priority')}
                accessibilityRole="button"
                accessibilityLabel="Priority"
              >
                <Text style={styles.selectorValue}>{priority}</Text>
                <Ionicons
                  name={
                    openDropdown === 'priority'
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={17}
                  color="#64748b"
                />
              </Pressable>

              {openDropdown === 'priority' ? (
                <View style={styles.dropdownMenu}>
                  {PRIORITY_OPTIONS.map((option, idx) => {
                    const isSelected = option === priority;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < PRIORITY_OPTIONS.length - 1
                            ? styles.dropdownItemBorder
                            : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setPriority(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected ? styles.dropdownItemTextSelected : null,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected ? (
                          <Ionicons name="checkmark" size={16} color="#0056A2" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          {/* 7. DELIVERY PREVIEW CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery preview</Text>
            <View style={styles.previewBox}>
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>
                  {messageType.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.previewTitle}>
                {title.trim() || 'Your Toyota Aqua is due for service'}
              </Text>

              {message.trim() ? (
                <Text style={styles.previewExcerpt} numberOfLines={2}>
                  {message.trim()}
                </Text>
              ) : null}

              <View style={styles.previewDivider} />

              <View style={styles.previewFooterRow}>
                <Text style={styles.previewFooterText}>
                  {date.trim() || '24 Sep 2026'} · {time.trim() || '09:00 AM'}
                </Text>
                <Text style={styles.previewFooterChannel}>
                  {getChannelPreviewLabel(channels)}
                </Text>
              </View>
            </View>
          </View>

          {/* 8. DELIVERY READINESS CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery readiness</Text>
            <View style={styles.divider} />

            <View style={styles.readinessList}>
              <View style={styles.readinessRow}>
                <Ionicons name="checkmark-circle" size={17} color="#16a34a" />
                <Text style={styles.readinessText}>Recipient has verified email</Text>
              </View>

              <View style={styles.readinessRow}>
                <Ionicons name="checkmark-circle" size={17} color="#16a34a" />
                <Text style={styles.readinessText}>Vehicle is linked</Text>
              </View>

              <View style={styles.readinessRow}>
                <Ionicons name="checkmark-circle" size={17} color="#16a34a" />
                <Text style={styles.readinessText}>Quiet hours respected</Text>
              </View>
            </View>
          </View>

          {/* Validation Summary Notice */}
          {hasValidationErrors ? (
            <View style={styles.summaryErrorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
              <Text style={styles.summaryErrorText}>
                Please fill in all required fields highlighted above before saving.
              </Text>
            </View>
          ) : null}

          {/* Bottom Form Actions */}
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity
              style={styles.cancelBottomButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBottomButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBottomButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
              <Text style={styles.saveBottomButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 9. BOTTOM NAVIGATION (NO TAB ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onVehiclesPress}
          activeOpacity={0.7}
        >
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onRecordsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBar: {
    height: 58,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLogo: {
    height: 36,
    width: 152,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerIconButtonActive: {
    backgroundColor: '#ebf5ff',
    borderColor: '#bfdbfe',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  pageHeaderSection: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  topActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  draftButton: {
    height: 34,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  saveTopButton: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#0056A2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveTopButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 14,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  typePillActive: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typePillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 14,
  },
  formGroupLast: {
    marginBottom: 2,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#64748b',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
  },
  inputWrapperError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 13,
    padding: 0,
  },
  multilineWrapper: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 72,
    color: '#0f172a',
    fontSize: 13,
    lineHeight: 19,
    padding: 0,
  },
  inlineErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  inlineErrorText: {
    fontSize: 11.5,
    color: '#dc2626',
    fontWeight: '500',
    flex: 1,
  },
  compactErrorText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 4,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  twoColItem: {
    flex: 1,
  },
  selectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemSelected: {
    backgroundColor: '#ebf5ff',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  previewBox: {
    backgroundColor: '#f8fcff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 14,
  },
  previewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
  },
  previewBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#0056A2',
  },
  previewTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 5,
  },
  previewExcerpt: {
    fontSize: 12,
    lineHeight: 17,
    color: '#475569',
    marginBottom: 10,
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#dbeafe',
    marginBottom: 10,
  },
  previewFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  previewFooterText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  previewFooterChannel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  readinessList: {
    gap: 10,
  },
  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readinessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  summaryErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 7,
  },
  summaryErrorText: {
    flex: 1,
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  cancelBottomButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBottomButtonText: {
    color: '#475569',
    fontSize: 13.5,
    fontWeight: '700',
  },
  saveBottomButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBottomButtonText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  bottomTabBar: {
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default CreateNotificationScreen;

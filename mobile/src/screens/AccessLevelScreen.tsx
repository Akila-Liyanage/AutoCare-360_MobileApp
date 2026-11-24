import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleItem } from './VehiclesScreen';

export type AccessLevelOption = 'view' | 'review';

export type AccessLevelStep1Data = {
  recipientName: string;
  recipientEmail: string;
  vehicle: string;
  accessLevel: AccessLevelOption;
};

export interface AccessLevelScreenProps {
  selectedVehicle?: VehicleItem | null;
  vehicles?: VehicleItem[];
  initialDraft?: AccessLevelStep1Data | null;
  onBackPress?: (currentDraft: AccessLevelStep1Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: AccessLevelStep1Data) => void;
  onSaveDraftPress?: (draft: AccessLevelStep1Data) => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type ValidationErrors = Partial<
  Record<'recipientName' | 'recipientEmail' | 'vehicle' | 'accessLevel', string>
>;

interface AccessOptionConfig {
  id: AccessLevelOption;
  title: string;
  badge?: string;
  description: string;
  points: string[];
}

const DEFAULT_VEHICLE_LABEL = 'WP ABC-1234 · Toyota Aqua';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACCESS_OPTIONS: AccessOptionConfig[] = [
  {
    id: 'view',
    title: 'View only',
    badge: 'Recommended',
    description: 'Recipient can view the selected protected records.',
    points: [
      'View approved vehicle records',
      'No record changes',
      'No approval decisions',
    ],
  },
  {
    id: 'review',
    title: 'Review',
    description:
      'Recipient can review selected records and provide a review decision.',
    points: [
      'View selected records',
      'Review submitted information',
      'Record a review outcome locally',
    ],
  },
];

function formatOwnerVehicleLabel(vehicle: VehicleItem): string {
  return `${vehicle.registration} · ${vehicle.name}`;
}

export const AccessLevelScreen: React.FC<AccessLevelScreenProps> = ({
  selectedVehicle,
  vehicles = [],
  initialDraft,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onContinuePress,
  onSaveDraftPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const vehicleOptions = useMemo(() => {
    const list: string[] = [DEFAULT_VEHICLE_LABEL];
    if (selectedVehicle) {
      const selectedLabel = formatOwnerVehicleLabel(selectedVehicle);
      if (!list.includes(selectedLabel)) {
        list.unshift(selectedLabel);
      }
    }
    vehicles.forEach((v) => {
      const label = formatOwnerVehicleLabel(v);
      if (!list.includes(label)) {
        list.push(label);
      }
    });
    return list;
  }, [selectedVehicle, vehicles]);

  const initialVehicle =
    initialDraft?.vehicle ||
    (selectedVehicle
      ? formatOwnerVehicleLabel(selectedVehicle)
      : DEFAULT_VEHICLE_LABEL);

  const [recipientName, setRecipientName] = useState<string>(
    initialDraft?.recipientName ?? 'N. Fernando · Ceylinco Insurance'
  );
  const [recipientEmail, setRecipientEmail] = useState<string>(
    initialDraft?.recipientEmail ?? 'inspection@ceylinco.lk'
  );
  const [vehicle, setVehicle] = useState<string>(initialVehicle);
  const [accessLevel, setAccessLevel] = useState<AccessLevelOption>(
    initialDraft?.accessLevel ?? 'view'
  );

  const [vehicleDropdownOpen, setVehicleDropdownOpen] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildPayload = (): AccessLevelStep1Data => ({
    recipientName: recipientName.trim(),
    recipientEmail: recipientEmail.trim(),
    vehicle: vehicle.trim(),
    accessLevel,
  });

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!recipientName.trim()) {
      nextErrors.recipientName = 'Recipient name or entity is required.';
    }
    if (!recipientEmail.trim()) {
      nextErrors.recipientEmail = 'Recipient email address is required.';
    } else if (!EMAIL_REGEX.test(recipientEmail.trim())) {
      nextErrors.recipientEmail = 'Please enter a valid email address.';
    }
    if (!vehicle.trim()) {
      nextErrors.vehicle = 'Please select a vehicle.';
    }
    if (accessLevel !== 'view' && accessLevel !== 'review') {
      nextErrors.accessLevel = 'Please select an access level.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    setVehicleDropdownOpen(false);
    if (!validateForm()) {
      return;
    }
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setVehicleDropdownOpen(false);
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
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
            style={styles.headerIconButton}
            onPress={() => onNotificationsPress?.()}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={21} color="#0f172a" />
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

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. BACK + PAGE INTRO */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.(buildPayload())}
          activeOpacity={0.7}
          accessibilityLabel="Back to Secure Sharing Hub"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-6 · ACCESS PERMISSIONS</Text>
          <Text style={styles.pageTitle}>Access level</Text>
          <Text style={styles.pageSubtitle}>
            Choose how this recipient can use the selected vehicle records.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 1 of 3 · Access level</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
          </View>
        </View>

        {/* 4. RECIPIENT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="person-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Recipient</Text>
          </View>

          <View style={styles.divider} />

          {/* NAME / ENTITY */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NAME / ENTITY</Text>
            <View
              style={[
                styles.inputBox,
                errors.recipientName ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="business-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={recipientName}
                onChangeText={(text) => {
                  setRecipientName(text);
                  setDraftSaved(false);
                  clearFieldError('recipientName');
                }}
                placeholder="N. Fernando · Ceylinco Insurance"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Recipient name or entity"
              />
            </View>
            {errors.recipientName ? (
              <Text style={styles.errorText}>{errors.recipientName}</Text>
            ) : null}
          </View>

          {/* EMAIL */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <View
              style={[
                styles.inputBox,
                errors.recipientEmail ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={recipientEmail}
                onChangeText={(text) => {
                  setRecipientEmail(text);
                  setDraftSaved(false);
                  clearFieldError('recipientEmail');
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="inspection@ceylinco.lk"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Recipient email"
              />
            </View>
            {errors.recipientEmail ? (
              <Text style={styles.errorText}>{errors.recipientEmail}</Text>
            ) : null}
          </View>
        </View>

        {/* 5. VEHICLE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-sport-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>VEHICLE</Text>
          <TouchableOpacity
            style={[
              styles.selectorBox,
              errors.vehicle ? styles.inputErrorBorder : null,
            ]}
            onPress={() => setVehicleDropdownOpen((prev) => !prev)}
            activeOpacity={0.8}
            accessibilityLabel="Select vehicle"
          >
            <Text style={styles.selectorText} numberOfLines={1}>
              {vehicle}
            </Text>
            <Ionicons
              name={vehicleDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748b"
            />
          </TouchableOpacity>
          {errors.vehicle ? (
            <Text style={styles.errorText}>{errors.vehicle}</Text>
          ) : null}

          {vehicleDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              {vehicleOptions.map((option, idx) => {
                const isSelected = option === vehicle;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      idx < vehicleOptions.length - 1
                        ? styles.dropdownOptionBorder
                        : null,
                      isSelected ? styles.dropdownOptionSelected : null,
                    ]}
                    onPress={() => {
                      setVehicle(option);
                      setVehicleDropdownOpen(false);
                      setDraftSaved(false);
                      clearFieldError('vehicle');
                    }}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected ? styles.dropdownOptionTextSelected : null,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={17} color="#0056A2" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* 6. CHOOSE ACCESS LEVEL CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="key-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Choose access level</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.optionsList}>
            {ACCESS_OPTIONS.map((option) => {
              const isSelected = accessLevel === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected ? styles.optionCardSelected : null,
                  ]}
                  onPress={() => {
                    setAccessLevel(option.id);
                    setDraftSaved(false);
                    clearFieldError('accessLevel');
                  }}
                  activeOpacity={0.82}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View style={styles.optionHeaderRow}>
                    <View style={styles.optionTitleGroup}>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected ? styles.radioOuterSelected : null,
                        ]}
                      >
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <Text
                        style={[
                          styles.optionTitle,
                          isSelected ? styles.optionTitleSelected : null,
                        ]}
                      >
                        {option.title}
                      </Text>
                    </View>

                    {option.badge ? (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>
                          {option.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>

                  <View style={styles.optionPointsList}>
                    {option.points.map((point) => (
                      <View key={point} style={styles.optionPointRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={isSelected ? '#0056A2' : '#64748b'}
                        />
                        <Text style={styles.optionPointText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {errors.accessLevel ? (
            <Text style={styles.errorText}>{errors.accessLevel}</Text>
          ) : null}
        </View>

        {/* 7. SELECTED PERMISSION SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Selected permission</Text>
          <View style={styles.summaryDivider} />

          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Recipient</Text>
              <Text style={styles.summaryValue}>
                {recipientName.trim() || '—'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>{vehicle || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Access</Text>
              <Text style={[styles.summaryValue, styles.summaryAccentValue]}>
                {accessLevel === 'view' ? 'View only' : 'Review'}
              </Text>
            </View>
          </View>
        </View>

        {/* 8. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue to records</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveDraftButton}
            onPress={handleSaveDraft}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={16} color="#0056A2" />
            <Text style={styles.saveDraftButtonText}>Save draft</Text>
          </TouchableOpacity>

          {draftSaved ? (
            <View style={styles.draftHintRow}>
              <Ionicons name="checkmark-circle" size={14} color="#15803d" />
              <Text style={styles.draftHintText}>Draft saved locally</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 9. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onHomePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Home"
        >
          <Ionicons name="home-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onVehiclesPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Vehicles"
        >
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSharingPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Sharing"
        >
          <Ionicons name="share-social" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Sharing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onHealthPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Health"
        >
          <Ionicons name="pulse-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Health</Text>
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
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  pageIntro: {
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: '#0056A2',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  stepSection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 13,
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 9,
  },
  stepProgressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepSegment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  stepSegmentActive: {
    backgroundColor: '#0056A2',
  },
  stepSegmentInactive: {
    backgroundColor: '#dbeafe',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#475569',
    marginBottom: 6,
  },
  inputBox: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
    padding: 0,
  },
  selectorBox: {
    minHeight: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  dropdownOptionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownOptionTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  inputErrorBorder: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 5,
  },
  optionsList: {
    gap: 11,
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.4,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    padding: 14,
  },
  optionCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#0056A2',
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },
  optionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    flexShrink: 0,
  },
  radioOuterSelected: {
    borderColor: '#0056A2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0056A2',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  optionTitleSelected: {
    color: '#004684',
  },
  recommendedBadge: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  recommendedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  optionDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  optionPointsList: {
    gap: 6,
  },
  optionPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  optionPointText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  summaryList: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  summaryAccentValue: {
    color: '#0056A2',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  continueButton: {
    height: 48,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  saveDraftButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDraftButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  draftHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 2,
  },
  draftHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  bottomTabBar: {
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
});

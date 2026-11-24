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

export type ProtectedViewingStep1Data = {
  recipientName: string;
  recipientEmail: string;
  vehicle: string;
  purpose: string;
  expiresIn: string;
};

export interface ProtectedViewingSetupScreenProps {
  selectedVehicle?: VehicleItem | null;
  vehicles?: VehicleItem[];
  initialDraft?: ProtectedViewingStep1Data | null;
  onBackPress?: (currentDraft: ProtectedViewingStep1Data) => void;
  onContinuePress?: (data: ProtectedViewingStep1Data) => void;
  onSaveDraftPress?: (draft: ProtectedViewingStep1Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type ValidationErrors = Partial<
  Record<
    'recipientName' | 'recipientEmail' | 'vehicle' | 'purpose' | 'expiresIn',
    string
  >
>;

const DEFAULT_VEHICLE_LABEL = 'WP ABC-1234 · Toyota Aqua';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PURPOSE_OPTIONS: string[] = [
  'Insurance inspection',
  'Vehicle verification',
  'Service review',
  'Ownership verification',
];

const EXPIRY_OPTIONS: string[] = ['24 hours', '48 hours', '72 hours', '7 days'];

function formatOwnerVehicleLabel(vehicle: VehicleItem): string {
  return `${vehicle.registration} · ${vehicle.name}`;
}

export const ProtectedViewingSetupScreen: React.FC<
  ProtectedViewingSetupScreenProps
> = ({
  selectedVehicle,
  vehicles = [],
  initialDraft,
  onBackPress,
  onContinuePress,
  onSaveDraftPress,
  onNotificationsPress,
  onMenuPress,
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
  const [purpose, setPurpose] = useState<string>(
    initialDraft?.purpose ?? 'Insurance inspection'
  );
  const [expiresIn, setExpiresIn] = useState<string>(
    initialDraft?.expiresIn ?? '48 hours'
  );

  const [vehicleDropdownOpen, setVehicleDropdownOpen] =
    useState<boolean>(false);
  const [purposeDropdownOpen, setPurposeDropdownOpen] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [stepSavedNotice, setStepSavedNotice] = useState<boolean>(false);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildPayload = (): ProtectedViewingStep1Data => ({
    recipientName: recipientName.trim(),
    recipientEmail: recipientEmail.trim(),
    vehicle: vehicle.trim(),
    purpose: purpose.trim(),
    expiresIn: expiresIn.trim(),
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
    if (!purpose.trim()) {
      nextErrors.purpose = 'Please select an access purpose.';
    }
    if (!expiresIn.trim()) {
      nextErrors.expiresIn = 'Please select an access duration.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    setVehicleDropdownOpen(false);
    setPurposeDropdownOpen(false);
    if (!validateForm()) {
      setStepSavedNotice(false);
      return;
    }
    const payload = buildPayload();
    setDraftSaved(false);
    setStepSavedNotice(true);
    onContinuePress?.(payload);
  };

  const handleSaveDraft = () => {
    setVehicleDropdownOpen(false);
    setPurposeDropdownOpen(false);
    setStepSavedNotice(false);
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
          accessibilityLabel="Back to Protected Data Sharing Overview"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-7 · PROTECTED VIEWING</Text>
          <Text style={styles.pageTitle}>Protected viewing setup</Text>
          <Text style={styles.pageSubtitle}>
            Define who will receive protected access and how long it should
            remain available.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 1 of 3 · Viewing setup</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={styles.stepSegment} />
            <View style={styles.stepSegment} />
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

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NAME / ENTITY</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.recipientName ? styles.inputError : null,
              ]}
              value={recipientName}
              onChangeText={(text) => {
                setRecipientName(text);
                setDraftSaved(false);
                setStepSavedNotice(false);
                clearFieldError('recipientName');
              }}
              placeholder="Enter recipient name or organization"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words"
            />
            {errors.recipientName ? (
              <Text style={styles.errorText}>{errors.recipientName}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.recipientEmail ? styles.inputError : null,
              ]}
              value={recipientEmail}
              onChangeText={(text) => {
                setRecipientEmail(text);
                setDraftSaved(false);
                setStepSavedNotice(false);
                clearFieldError('recipientEmail');
              }}
              placeholder="recipient@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.recipientEmail ? (
              <Text style={styles.errorText}>{errors.recipientEmail}</Text>
            ) : null}
          </View>
        </View>

        {/* 5. VEHICLE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>VEHICLE</Text>
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              errors.vehicle ? styles.inputError : null,
            ]}
            onPress={() => {
              setPurposeDropdownOpen(false);
              setVehicleDropdownOpen((prev) => !prev);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownValue} numberOfLines={1}>
              {vehicle || 'Select a vehicle'}
            </Text>
            <Ionicons
              name={vehicleDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748b"
            />
          </TouchableOpacity>

          {vehicleDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              {vehicleOptions.map((option, idx) => {
                const isSelected = option === vehicle;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      idx < vehicleOptions.length - 1
                        ? styles.dropdownItemBorder
                        : null,
                      isSelected ? styles.dropdownItemSelected : null,
                    ]}
                    onPress={() => {
                      setVehicle(option);
                      setVehicleDropdownOpen(false);
                      setDraftSaved(false);
                      setStepSavedNotice(false);
                      clearFieldError('vehicle');
                    }}
                    activeOpacity={0.75}
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
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#0056A2"
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {errors.vehicle ? (
            <Text style={styles.errorText}>{errors.vehicle}</Text>
          ) : null}
        </View>

        {/* 6. ACCESS PURPOSE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="briefcase-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access purpose</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>PURPOSE</Text>
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              errors.purpose ? styles.inputError : null,
            ]}
            onPress={() => {
              setVehicleDropdownOpen(false);
              setPurposeDropdownOpen((prev) => !prev);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownValue} numberOfLines={1}>
              {purpose || 'Select purpose'}
            </Text>
            <Ionicons
              name={purposeDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748b"
            />
          </TouchableOpacity>

          {purposeDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              {PURPOSE_OPTIONS.map((option, idx) => {
                const isSelected = option === purpose;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      idx < PURPOSE_OPTIONS.length - 1
                        ? styles.dropdownItemBorder
                        : null,
                      isSelected ? styles.dropdownItemSelected : null,
                    ]}
                    onPress={() => {
                      setPurpose(option);
                      setPurposeDropdownOpen(false);
                      setDraftSaved(false);
                      setStepSavedNotice(false);
                      clearFieldError('purpose');
                    }}
                    activeOpacity={0.75}
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
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#0056A2"
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {errors.purpose ? (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          ) : null}
        </View>

        {/* 7. ACCESS DURATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access duration</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>EXPIRES IN</Text>
          <View style={styles.durationChipsGrid}>
            {EXPIRY_OPTIONS.map((option) => {
              const isSelected = option === expiresIn;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.durationChip,
                    isSelected ? styles.durationChipActive : null,
                  ]}
                  onPress={() => {
                    setExpiresIn(option);
                    setDraftSaved(false);
                    setStepSavedNotice(false);
                    clearFieldError('expiresIn');
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'time-outline'}
                    size={15}
                    color={isSelected ? '#0056A2' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.durationChipText,
                      isSelected ? styles.durationChipTextActive : null,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {errors.expiresIn ? (
            <Text style={styles.errorText}>{errors.expiresIn}</Text>
          ) : null}
        </View>

        {/* 8. LIVE VIEWING SETUP SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryTitleRow}>
              <Ionicons name="shield-checkmark" size={16} color="#0056A2" />
              <Text style={styles.summaryTitle}>Viewing setup</Text>
            </View>

            <View style={styles.summaryStatusBadge}>
              <View style={styles.summaryStatusDot} />
              <Text style={styles.summaryStatusText}>Protected</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRows}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Recipient</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {recipientName.trim() || 'Not specified'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {vehicle.trim() || 'Not selected'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Purpose</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {purpose.trim() || 'Not selected'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Expires</Text>
              <Text style={styles.summaryAccentValue}>
                {expiresIn.trim() || 'Not selected'}
              </Text>
            </View>
          </View>
        </View>

        {/* 9. ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              Continue to data visibility
            </Text>
            <Ionicons name="arrow-forward" size={17} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSaveDraft}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={16} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>Save draft</Text>
          </TouchableOpacity>

          {draftSaved ? (
            <View style={styles.feedbackBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#15803d" />
              <Text style={styles.feedbackBannerText}>Draft saved locally</Text>
            </View>
          ) : null}

          {stepSavedNotice ? (
            <View style={styles.stepReadyBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.stepReadyBannerText}>
                Step 1 saved locally — ready for data visibility.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 10. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
    width: 142,
    height: 36,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    paddingVertical: 4,
    paddingRight: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0056A2',
  },
  pageIntro: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: '#0056A2',
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 19,
  },
  stepSection: {
    gap: 7,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  stepProgressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepSegment: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
  },
  stepSegmentActive: {
    backgroundColor: '#0056A2',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#e6f0f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#64748b',
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  dropdownTrigger: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemSelected: {
    backgroundColor: '#eff6ff',
  },
  dropdownItemText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  durationChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    width: '48%',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  durationChipActive: {
    borderColor: '#0056A2',
    backgroundColor: '#eff6ff',
  },
  durationChipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  durationChipTextActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  summaryTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  summaryStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  summaryStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#dbeafe',
    marginVertical: 10,
  },
  summaryRows: {
    gap: 7,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  summaryAccentValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
    textAlign: 'right',
  },
  actionsSection: {
    gap: 10,
    marginTop: 2,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0056A2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0056A2',
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  feedbackBannerText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803d',
  },
  stepReadyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  stepReadyBannerText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0056A2',
  },
  bottomTabBar: {
    height: 62,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
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

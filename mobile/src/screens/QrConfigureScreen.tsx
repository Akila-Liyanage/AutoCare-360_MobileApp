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

export type QrConfigData = {
  purpose: string;
  vehicle: string;
  selectedRecords: string;
  expiresIn: string;
  maxScans: string;
  requireViewerName: boolean;
  requireOtp: boolean;
};

export interface QrConfigureScreenProps {
  selectedVehicle?: VehicleItem | null;
  vehicles?: VehicleItem[];
  initialDraft?: QrConfigData | null;
  onBackPress?: (currentDraft: QrConfigData) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: QrConfigData) => void;
  onSaveDraftPress?: (draft: QrConfigData) => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type ValidationErrors = Partial<
  Record<
    'purpose' | 'vehicle' | 'selectedRecords' | 'expiresIn' | 'maxScans',
    string
  >
>;

const DEFAULT_VEHICLE_LABEL = 'WP ABC-1234 · Toyota Aqua';

const PURPOSE_OPTIONS: string[] = [
  'Insurance inspection',
  'Vehicle verification',
  'Service review',
  'Ownership verification',
];

const RECORD_SCOPE_OPTIONS: string[] = [
  '21 Sep service · 15 May service · emissions report',
  'Complete service history',
  'Latest verified service only',
  'Maintenance + emissions records',
];

const EXPIRY_OPTIONS: string[] = ['24 hours', '48 hours', '72 hours', '7 days'];

function formatOwnerVehicleLabel(vehicle: VehicleItem): string {
  return `${vehicle.registration} · ${vehicle.name}`;
}

function isPositiveInteger(raw: string): boolean {
  return /^[1-9]\d*$/.test(raw.trim());
}

export const QrConfigureScreen: React.FC<QrConfigureScreenProps> = ({
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

  const [purpose, setPurpose] = useState<string>(
    initialDraft?.purpose ?? PURPOSE_OPTIONS[0]
  );
  const [vehicle, setVehicle] = useState<string>(initialVehicle);
  const [selectedRecords, setSelectedRecords] = useState<string>(
    initialDraft?.selectedRecords ?? RECORD_SCOPE_OPTIONS[0]
  );
  const [expiresIn, setExpiresIn] = useState<string>(
    initialDraft?.expiresIn ?? '48 hours'
  );
  const [maxScans, setMaxScans] = useState<string>(
    initialDraft?.maxScans ?? '10'
  );
  const [requireViewerName, setRequireViewerName] = useState<boolean>(
    initialDraft?.requireViewerName ?? true
  );
  const [requireOtp, setRequireOtp] = useState<boolean>(
    initialDraft?.requireOtp ?? true
  );

  const [openDropdown, setOpenDropdown] = useState<
    'purpose' | 'vehicle' | 'records' | 'expiry' | null
  >(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const validMaxScans = isPositiveInteger(maxScans) ? maxScans.trim() : null;

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildPayload = (): QrConfigData => ({
    purpose: purpose.trim(),
    vehicle: vehicle.trim(),
    selectedRecords: selectedRecords.trim(),
    expiresIn: expiresIn.trim(),
    maxScans: maxScans.trim(),
    requireViewerName,
    requireOtp,
  });

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!purpose.trim()) {
      nextErrors.purpose = 'Please select a QR purpose.';
    }
    if (!vehicle.trim()) {
      nextErrors.vehicle = 'Please select a vehicle.';
    }
    if (!selectedRecords.trim()) {
      nextErrors.selectedRecords = 'Please select a record scope.';
    }
    if (!expiresIn.trim()) {
      nextErrors.expiresIn = 'Please select an expiry duration.';
    }
    if (!maxScans.trim()) {
      nextErrors.maxScans = 'Maximum scans is required.';
    } else if (!isPositiveInteger(maxScans)) {
      nextErrors.maxScans = 'Enter a positive whole number (e.g. 10).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGenerateQr = () => {
    setOpenDropdown(null);
    if (!validateForm()) {
      return;
    }
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setOpenDropdown(null);
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
          <Text style={styles.eyebrow}>BR-5 · QR SHARING</Text>
          <Text style={styles.pageTitle}>Configure QR access</Text>
          <Text style={styles.pageSubtitle}>
            Create a protected QR code for temporary access to selected vehicle
            records.
          </Text>
        </View>

        {/* 3. QR PURPOSE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="qr-code-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>QR purpose</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>PURPOSE</Text>
          <TouchableOpacity
            style={[
              styles.selectorBox,
              errors.purpose ? styles.inputErrorBorder : null,
            ]}
            onPress={() =>
              setOpenDropdown((prev) => (prev === 'purpose' ? null : 'purpose'))
            }
            activeOpacity={0.8}
            accessibilityLabel="Select QR purpose"
          >
            <Text style={styles.selectorText} numberOfLines={1}>
              {purpose}
            </Text>
            <Ionicons
              name={openDropdown === 'purpose' ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748b"
            />
          </TouchableOpacity>
          {errors.purpose ? (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          ) : null}

          {openDropdown === 'purpose' ? (
            <View style={styles.dropdownMenu}>
              {PURPOSE_OPTIONS.map((option, idx) => {
                const isSelected = option === purpose;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      idx < PURPOSE_OPTIONS.length - 1
                        ? styles.dropdownOptionBorder
                        : null,
                      isSelected ? styles.dropdownOptionSelected : null,
                    ]}
                    onPress={() => {
                      setPurpose(option);
                      setOpenDropdown(null);
                      setDraftSaved(false);
                      clearFieldError('purpose');
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

        {/* 4. VEHICLE & RECORDS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-sport-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle &amp; records</Text>
          </View>

          <View style={styles.divider} />

          {/* VEHICLE */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>VEHICLE</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.vehicle ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'vehicle' ? null : 'vehicle'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select vehicle"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {vehicle}
              </Text>
              <Ionicons
                name={openDropdown === 'vehicle' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.vehicle ? (
              <Text style={styles.errorText}>{errors.vehicle}</Text>
            ) : null}

            {openDropdown === 'vehicle' ? (
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
                        setOpenDropdown(null);
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

          {/* SELECTED RECORDS */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>SELECTED RECORDS</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.selectedRecords ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'records' ? null : 'records'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select record scope"
            >
              <Text style={styles.selectorText}>{selectedRecords}</Text>
              <Ionicons
                name={openDropdown === 'records' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.selectedRecords ? (
              <Text style={styles.errorText}>{errors.selectedRecords}</Text>
            ) : null}

            {openDropdown === 'records' ? (
              <View style={styles.dropdownMenu}>
                {RECORD_SCOPE_OPTIONS.map((option, idx) => {
                  const isSelected = option === selectedRecords;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        idx < RECORD_SCOPE_OPTIONS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => {
                        setSelectedRecords(option);
                        setOpenDropdown(null);
                        setDraftSaved(false);
                        clearFieldError('selectedRecords');
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
        </View>

        {/* 5. ACCESS DURATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access duration</Text>
          </View>

          <View style={styles.divider} />

          {/* EXPIRES IN */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EXPIRES IN</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.expiresIn ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) => (prev === 'expiry' ? null : 'expiry'))
              }
              activeOpacity={0.8}
              accessibilityLabel="Select expiry duration"
            >
              <Text style={styles.selectorText}>{expiresIn}</Text>
              <Ionicons
                name={openDropdown === 'expiry' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.expiresIn ? (
              <Text style={styles.errorText}>{errors.expiresIn}</Text>
            ) : null}

            {openDropdown === 'expiry' ? (
              <View style={styles.dropdownMenu}>
                {EXPIRY_OPTIONS.map((option, idx) => {
                  const isSelected = option === expiresIn;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        idx < EXPIRY_OPTIONS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => {
                        setExpiresIn(option);
                        setOpenDropdown(null);
                        setDraftSaved(false);
                        clearFieldError('expiresIn');
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

          {/* MAXIMUM SCANS */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>MAXIMUM SCANS</Text>
            <View
              style={[
                styles.inputBox,
                errors.maxScans ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="scan-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={maxScans}
                onChangeText={(text) => {
                  setMaxScans(text);
                  setDraftSaved(false);
                  if (text.trim() && !isPositiveInteger(text)) {
                    setErrors((prev) => ({
                      ...prev,
                      maxScans: 'Enter a positive whole number (e.g. 10).',
                    }));
                  } else {
                    clearFieldError('maxScans');
                  }
                }}
                keyboardType="number-pad"
                placeholder="10"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Maximum scans"
              />
            </View>
            {errors.maxScans ? (
              <Text style={styles.errorText}>{errors.maxScans}</Text>
            ) : (
              <Text style={styles.helperText}>
                QR automatically locks when this scan limit is reached.
              </Text>
            )}
          </View>
        </View>

        {/* 6. VIEWER VERIFICATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>Viewer verification</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => {
              setRequireViewerName((prev) => !prev);
              setDraftSaved(false);
            }}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: requireViewerName }}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Require viewer name</Text>
            </View>

            <View
              style={[
                styles.switchTrack,
                requireViewerName ? styles.switchTrackOn : styles.switchTrackOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  requireViewerName ? styles.switchThumbOn : null,
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => {
              setRequireOtp((prev) => !prev);
              setDraftSaved(false);
            }}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: requireOtp }}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Require OTP verification</Text>
            </View>

            <View
              style={[
                styles.switchTrack,
                requireOtp ? styles.switchTrackOn : styles.switchTrackOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  requireOtp ? styles.switchThumbOn : null,
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.helperNoteBox}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#475569"
              style={styles.helperNoteIcon}
            />
            <Text style={styles.helperNoteText}>
              Identity checks apply every time the QR code is opened.
            </Text>
          </View>
        </View>

        {/* 7. QR ACCESS SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderSpread}>
            <Text style={styles.cardTitle}>QR access summary</Text>
            <View style={styles.protectedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#15803d" />
              <Text style={styles.protectedBadgeText}>Protected</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Purpose:</Text>
              <Text style={styles.summaryValue}>{purpose || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle:</Text>
              <Text style={styles.summaryValue}>{vehicle || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Expires:</Text>
              <Text style={styles.summaryValue}>{expiresIn || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Scans:</Text>
              <Text style={styles.summaryValue}>
                {validMaxScans ? `${validMaxScans} maximum` : '—'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Viewer name:</Text>
              <Text style={styles.summaryValue}>
                {requireViewerName ? 'Required' : 'Optional'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>OTP:</Text>
              <Text style={styles.summaryValue}>
                {requireOtp ? 'Required' : 'Off'}
              </Text>
            </View>
          </View>
        </View>

        {/* 8. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleGenerateQr}
            activeOpacity={0.85}
          >
            <Ionicons name="qr-code-outline" size={17} color="#ffffff" />
            <Text style={styles.continueButtonText}>Generate QR</Text>
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
    marginBottom: 16,
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
  cardHeaderSpread: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
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
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
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
  selectorBox: {
    minHeight: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
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
    lineHeight: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownOptionTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    padding: 0,
  },
  inputErrorBorder: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 6,
  },
  helperText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#64748b',
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextCol: {
    flex: 1,
    minWidth: 0,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
    flexShrink: 0,
  },
  switchTrackOn: {
    backgroundColor: '#0056A2',
  },
  switchTrackOff: {
    backgroundColor: '#cbd5e1',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  helperNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 12,
  },
  helperNoteIcon: {
    marginTop: 1,
  },
  helperNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#475569',
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
    flexShrink: 0,
  },
  protectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
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

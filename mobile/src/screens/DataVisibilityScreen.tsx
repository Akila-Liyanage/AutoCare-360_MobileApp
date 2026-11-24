import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProtectedViewingStep1Data } from './ProtectedViewingSetupScreen';

export type ProtectedViewingStep2Data = {
  showVehicleIdentity: boolean;
  showServiceHistory: boolean;
  showMaintenanceRecords: boolean;
  showEmissionsReports: boolean;
  showOwnershipRecords: boolean;
  showExpenseRecords: boolean;
  showDocuments: boolean;
  maskSensitiveDetails: boolean;
};

export interface DataVisibilityScreenProps {
  step1Data?: ProtectedViewingStep1Data | null;
  initialDraft?: ProtectedViewingStep2Data | null;
  onBackPress?: (currentDraft: ProtectedViewingStep2Data) => void;
  onContinuePress?: (data: ProtectedViewingStep2Data) => void;
  onSaveDraftPress?: (draft: ProtectedViewingStep2Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type RecordVisibilityKey =
  | 'showServiceHistory'
  | 'showMaintenanceRecords'
  | 'showEmissionsReports'
  | 'showOwnershipRecords'
  | 'showExpenseRecords'
  | 'showDocuments';

interface RecordVisibilityOption {
  key: RecordVisibilityKey;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const RECORD_VISIBILITY_OPTIONS: RecordVisibilityOption[] = [
  {
    key: 'showServiceHistory',
    title: 'Service history',
    description: 'Verified service entries and workshop visits.',
    icon: 'construct-outline',
  },
  {
    key: 'showMaintenanceRecords',
    title: 'Maintenance records',
    description: 'Scheduled maintenance, repairs and replaced parts.',
    icon: 'build-outline',
  },
  {
    key: 'showEmissionsReports',
    title: 'Emissions reports',
    description: 'Verified emissions tests and inspection reports.',
    icon: 'leaf-outline',
  },
  {
    key: 'showOwnershipRecords',
    title: 'Ownership records',
    description: 'Ownership details and transfer history entries.',
    icon: 'swap-horizontal-outline',
  },
  {
    key: 'showExpenseRecords',
    title: 'Expense records',
    description: 'Vehicle expense ledger and cost summaries.',
    icon: 'wallet-outline',
  },
  {
    key: 'showDocuments',
    title: 'Attached documents',
    description: 'Uploaded receipts, invoices and supporting files.',
    icon: 'document-attach-outline',
  },
];

export const DataVisibilityScreen: React.FC<DataVisibilityScreenProps> = ({
  step1Data,
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
  const [showVehicleIdentity, setShowVehicleIdentity] = useState<boolean>(
    initialDraft?.showVehicleIdentity ?? true
  );
  const [showServiceHistory, setShowServiceHistory] = useState<boolean>(
    initialDraft?.showServiceHistory ?? true
  );
  const [showMaintenanceRecords, setShowMaintenanceRecords] = useState<boolean>(
    initialDraft?.showMaintenanceRecords ?? true
  );
  const [showEmissionsReports, setShowEmissionsReports] = useState<boolean>(
    initialDraft?.showEmissionsReports ?? true
  );
  const [showOwnershipRecords, setShowOwnershipRecords] = useState<boolean>(
    initialDraft?.showOwnershipRecords ?? false
  );
  const [showExpenseRecords, setShowExpenseRecords] = useState<boolean>(
    initialDraft?.showExpenseRecords ?? false
  );
  const [showDocuments, setShowDocuments] = useState<boolean>(
    initialDraft?.showDocuments ?? false
  );
  const [maskSensitiveDetails, setMaskSensitiveDetails] = useState<boolean>(
    initialDraft?.maskSensitiveDetails ?? true
  );

  const [validationError, setValidationError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [stepSavedNotice, setStepSavedNotice] = useState<boolean>(false);

  const recipientLabel =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const vehicleLabel = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const purposeLabel = step1Data?.purpose || 'Insurance inspection';
  const expiresLabel = step1Data?.expiresIn || '48 hours';

  const recordToggleMap: Record<RecordVisibilityKey, boolean> = useMemo(
    () => ({
      showServiceHistory,
      showMaintenanceRecords,
      showEmissionsReports,
      showOwnershipRecords,
      showExpenseRecords,
      showDocuments,
    }),
    [
      showServiceHistory,
      showMaintenanceRecords,
      showEmissionsReports,
      showOwnershipRecords,
      showExpenseRecords,
      showDocuments,
    ]
  );

  const enabledCategoryLabels = useMemo(() => {
    const labels: string[] = [];
    if (showVehicleIdentity) labels.push('Vehicle identity');
    if (showServiceHistory) labels.push('Service history');
    if (showMaintenanceRecords) labels.push('Maintenance records');
    if (showEmissionsReports) labels.push('Emissions reports');
    if (showOwnershipRecords) labels.push('Ownership records');
    if (showExpenseRecords) labels.push('Expense records');
    if (showDocuments) labels.push('Attached documents');
    return labels;
  }, [
    showVehicleIdentity,
    showServiceHistory,
    showMaintenanceRecords,
    showEmissionsReports,
    showOwnershipRecords,
    showExpenseRecords,
    showDocuments,
  ]);

  const buildPayload = (): ProtectedViewingStep2Data => ({
    showVehicleIdentity,
    showServiceHistory,
    showMaintenanceRecords,
    showEmissionsReports,
    showOwnershipRecords,
    showExpenseRecords,
    showDocuments,
    maskSensitiveDetails,
  });

  const resetBanners = () => {
    setDraftSaved(false);
    setStepSavedNotice(false);
  };

  const handleToggleVehicleIdentity = (nextVal: boolean) => {
    setShowVehicleIdentity(nextVal);
    resetBanners();
    if (nextVal) {
      setValidationError(null);
    }
  };

  const handleToggleRecordCategory = (key: RecordVisibilityKey) => {
    resetBanners();
    setValidationError(null);
    switch (key) {
      case 'showServiceHistory':
        setShowServiceHistory((prev) => !prev);
        break;
      case 'showMaintenanceRecords':
        setShowMaintenanceRecords((prev) => !prev);
        break;
      case 'showEmissionsReports':
        setShowEmissionsReports((prev) => !prev);
        break;
      case 'showOwnershipRecords':
        setShowOwnershipRecords((prev) => !prev);
        break;
      case 'showExpenseRecords':
        setShowExpenseRecords((prev) => !prev);
        break;
      case 'showDocuments':
        setShowDocuments((prev) => !prev);
        break;
    }
  };

  const handleSelectAll = () => {
    setShowVehicleIdentity(true);
    setShowServiceHistory(true);
    setShowMaintenanceRecords(true);
    setShowEmissionsReports(true);
    setShowOwnershipRecords(true);
    setShowExpenseRecords(true);
    setShowDocuments(true);
    setValidationError(null);
    resetBanners();
  };

  const handleMinimumAccess = () => {
    setShowVehicleIdentity(true);
    setShowServiceHistory(true);
    setShowMaintenanceRecords(true);
    setShowEmissionsReports(true);
    setShowOwnershipRecords(false);
    setShowExpenseRecords(false);
    setShowDocuments(false);
    setMaskSensitiveDetails(true);
    setValidationError(null);
    resetBanners();
  };

  const handleContinue = () => {
    if (enabledCategoryLabels.length === 0) {
      setValidationError('Select at least one data category to continue.');
      setStepSavedNotice(false);
      return;
    }
    setValidationError(null);
    setDraftSaved(false);
    setStepSavedNotice(true);
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setStepSavedNotice(false);
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
  };

  const contextRows: Array<{ label: string; value: string; accent?: boolean }> =
    [
      { label: 'Recipient', value: recipientLabel },
      { label: 'Vehicle', value: vehicleLabel },
      { label: 'Purpose', value: purposeLabel },
      { label: 'Expires', value: expiresLabel, accent: true },
    ];

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
      >
        {/* 2. BACK + PAGE INTRO */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.(buildPayload())}
          activeOpacity={0.7}
          accessibilityLabel="Back to Protected Viewing Setup"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-7 · PROTECTED VIEWING</Text>
          <Text style={styles.pageTitle}>Data visibility</Text>
          <Text style={styles.pageSubtitle}>
            Choose exactly what the protected viewer can see.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 2 of 3 · Data visibility</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={styles.stepSegment} />
          </View>
        </View>

        {/* 4. VIEWING CONTEXT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="eye-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Viewing context</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {contextRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    row.accent ? styles.detailAccentValue : null,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. QUICK PRESET ACTIONS (SELECT ALL / MINIMUM ACCESS) */}
        <View style={styles.presetRow}>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={handleSelectAll}
            activeOpacity={0.75}
          >
            <Ionicons name="checkmark-done-outline" size={15} color="#0056A2" />
            <Text style={styles.presetButtonText}>Select all</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetButton}
            onPress={handleMinimumAccess}
            activeOpacity={0.75}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#0056A2"
            />
            <Text style={styles.presetButtonText}>Minimum access</Text>
          </TouchableOpacity>
        </View>

        {/* 6. VEHICLE INFORMATION VISIBILITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle information</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => handleToggleVehicleIdentity(!showVehicleIdentity)}
            activeOpacity={0.8}
          >
            <View style={styles.switchTextCol}>
              <Text style={styles.toggleTitle}>Vehicle identity</Text>
              <Text style={styles.toggleDescription}>
                Registration number, make and model.
              </Text>
            </View>

            <Switch
              value={showVehicleIdentity}
              onValueChange={handleToggleVehicleIdentity}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={showVehicleIdentity ? '#0056A2' : '#f8fafc'}
            />
          </TouchableOpacity>
        </View>

        {/* 7. VISIBLE RECORDS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="folder-open-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Visible records</Text>
          </View>

          <View style={styles.divider} />

          {RECORD_VISIBILITY_OPTIONS.map((item, idx) => {
            const isSelected = recordToggleMap[item.key];
            return (
              <View key={item.key}>
                <TouchableOpacity
                  style={styles.recordRow}
                  onPress={() => handleToggleRecordCategory(item.key)}
                  activeOpacity={0.78}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    style={[
                      styles.recordIconBox,
                      isSelected ? styles.recordIconBoxActive : null,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={isSelected ? '#0056A2' : '#64748b'}
                    />
                  </View>

                  <View style={styles.recordTextCol}>
                    <Text style={styles.toggleTitle}>{item.title}</Text>
                    <Text style={styles.toggleDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkboxBox,
                      isSelected ? styles.checkboxBoxChecked : null,
                    ]}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {idx < RECORD_VISIBILITY_OPTIONS.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 8. SENSITIVE INFORMATION PROTECTION CARD */}
        <View
          style={[
            styles.card,
            maskSensitiveDetails ? styles.protectionCardActive : null,
          ]}
        >
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.cardIconBox,
                  maskSensitiveDetails ? styles.cardIconBoxSuccess : null,
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={maskSensitiveDetails ? '#15803d' : '#0056A2'}
                />
              </View>
              <Text style={styles.cardTitle}>Sensitive information</Text>
            </View>

            <View
              style={[
                styles.maskStatusPill,
                maskSensitiveDetails
                  ? styles.maskStatusPillOn
                  : styles.maskStatusPillOff,
              ]}
            >
              <Text
                style={[
                  styles.maskStatusText,
                  maskSensitiveDetails
                    ? styles.maskStatusTextOn
                    : styles.maskStatusTextOff,
                ]}
              >
                {maskSensitiveDetails ? 'Protected' : 'Unmasked'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => {
              setMaskSensitiveDetails((prev) => !prev);
              resetBanners();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.switchTextCol}>
              <Text style={styles.toggleTitle}>Mask sensitive details</Text>
              <Text style={styles.toggleDescription}>
                Hide unnecessary personal or internal information from the
                protected viewer.
              </Text>
            </View>

            <Switch
              value={maskSensitiveDetails}
              onValueChange={(val) => {
                setMaskSensitiveDetails(val);
                resetBanners();
              }}
              trackColor={{ false: '#cbd5e1', true: '#86efac' }}
              thumbColor={maskSensitiveDetails ? '#15803d' : '#f8fafc'}
            />
          </TouchableOpacity>
        </View>

        {/* 9. VISIBILITY SUMMARY CARD */}
        <View
          style={[
            styles.summaryCard,
            enabledCategoryLabels.length === 0 ? styles.summaryCardWarn : null,
          ]}
        >
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryTitleRow}>
              <Ionicons
                name={
                  enabledCategoryLabels.length === 0
                    ? 'alert-circle'
                    : 'shield-checkmark'
                }
                size={16}
                color={
                  enabledCategoryLabels.length === 0 ? '#dc2626' : '#0056A2'
                }
              />
              <Text style={styles.summaryTitle}>Viewer will see</Text>
            </View>

            <Text style={styles.summaryCountText}>
              {enabledCategoryLabels.length}{' '}
              {enabledCategoryLabels.length === 1
                ? 'data category visible'
                : 'data categories visible'}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          {enabledCategoryLabels.length > 0 ? (
            <View style={styles.chipsWrap}>
              {enabledCategoryLabels.map((label) => (
                <View key={label} style={styles.selectedChip}>
                  <Ionicons name="checkmark-circle" size={13} color="#0056A2" />
                  <Text style={styles.selectedChipText}>{label}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyWarningBox}>
              <Ionicons name="warning-outline" size={15} color="#dc2626" />
              <Text style={styles.emptyWarningText}>
                Select at least one data category to continue.
              </Text>
            </View>
          )}

          <View style={styles.sensitiveSummaryRow}>
            <Text style={styles.sensitiveSummaryLabel}>Sensitive details</Text>
            <View
              style={[
                styles.sensitiveBadge,
                maskSensitiveDetails
                  ? styles.sensitiveBadgeMasked
                  : styles.sensitiveBadgeVisible,
              ]}
            >
              <Ionicons
                name={maskSensitiveDetails ? 'lock-closed' : 'eye-outline'}
                size={12}
                color={maskSensitiveDetails ? '#15803d' : '#b45309'}
              />
              <Text
                style={[
                  styles.sensitiveBadgeText,
                  maskSensitiveDetails
                    ? styles.sensitiveBadgeTextMasked
                    : styles.sensitiveBadgeTextVisible,
                ]}
              >
                {maskSensitiveDetails ? 'Masked' : 'Visible'}
              </Text>
            </View>
          </View>
        </View>

        {validationError ? (
          <View style={styles.inlineErrorBanner}>
            <Ionicons name="alert-circle" size={16} color="#dc2626" />
            <Text style={styles.inlineErrorText}>{validationError}</Text>
          </View>
        ) : null}

        {/* 10. ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              Continue to protected viewer
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
                Step 2 saved locally — ready for protected viewer.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 11. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
  protectionCardActive: {
    borderColor: '#bbf7d0',
    backgroundColor: '#fcfffd',
  },
  cardHeaderSpread: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#e6f0f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconBoxSuccess: {
    backgroundColor: '#dcfce7',
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
  detailsList: {
    gap: 9,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  detailAccentValue: {
    color: '#0056A2',
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  presetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056A2',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchTextCol: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  toggleDescription: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 4,
  },
  recordIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordIconBoxActive: {
    backgroundColor: '#eff6ff',
  },
  recordTextCol: {
    flex: 1,
    gap: 2,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    borderColor: '#0056A2',
    backgroundColor: '#0056A2',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 9,
  },
  maskStatusPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },
  maskStatusPillOn: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  maskStatusPillOff: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  maskStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  maskStatusTextOn: {
    color: '#15803d',
  },
  maskStatusTextOff: {
    color: '#b45309',
  },
  summaryCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryCardWarn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
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
  summaryCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#dbeafe',
    marginVertical: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0056A2',
  },
  emptyWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  emptyWarningText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#dc2626',
  },
  sensitiveSummaryRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sensitiveSummaryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  sensitiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },
  sensitiveBadgeMasked: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  sensitiveBadgeVisible: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  sensitiveBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  sensitiveBadgeTextMasked: {
    color: '#15803d',
  },
  sensitiveBadgeTextVisible: {
    color: '#b45309',
  },
  inlineErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  inlineErrorText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#dc2626',
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

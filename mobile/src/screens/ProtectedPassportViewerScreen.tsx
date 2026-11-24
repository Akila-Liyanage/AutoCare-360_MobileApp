import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProtectedViewingStep1Data } from './ProtectedViewingSetupScreen';
import { ProtectedViewingStep2Data } from './DataVisibilityScreen';

export interface ProtectedPassportViewerScreenProps {
  step1Data?: ProtectedViewingStep1Data | null;
  step2Data?: ProtectedViewingStep2Data | null;
  onBackPress?: () => void;
  onEditVisibilityPress?: () => void;
  onContinuePress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

interface SampleServiceRow {
  id: string;
  date: string;
  title: string;
  workshop: string;
  mileage: string;
}

interface SampleMaintenanceRow {
  id: string;
  title: string;
  meta: string;
}

interface SampleDocumentRow {
  id: string;
  title: string;
  date: string;
}

const SAMPLE_SERVICE_HISTORY: SampleServiceRow[] = [
  {
    id: 'srv-1',
    date: '21 Sep 2026',
    title: 'Periodic engine service',
    workshop: 'Perera Auto Works',
    mileage: '85,240 km',
  },
  {
    id: 'srv-2',
    date: '15 May 2026',
    title: 'Brake inspection',
    workshop: 'AutoCare Service Centre',
    mileage: '81,920 km',
  },
];

const SAMPLE_MAINTENANCE_RECORDS: SampleMaintenanceRow[] = [
  {
    id: 'mnt-1',
    title: 'Engine oil & filter',
    meta: 'Completed · 21 Sep 2026',
  },
  {
    id: 'mnt-2',
    title: 'Brake inspection',
    meta: 'Completed · 15 May 2026',
  },
  {
    id: 'mnt-3',
    title: 'Next service',
    meta: '90,000 km',
  },
];

const SAMPLE_DOCUMENTS: SampleDocumentRow[] = [
  {
    id: 'doc-1',
    title: 'Service invoice',
    date: '21 Sep 2026',
  },
  {
    id: 'doc-2',
    title: 'Emissions certificate',
    date: '12 Aug 2026',
  },
];

function splitVehicleParts(raw: string): {
  registration: string;
  makeModel: string;
} {
  const parts = raw.split(' · ').map((part) => part.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return {
      registration: parts[0],
      makeModel: parts.slice(1).join(' · '),
    };
  }
  return {
    registration: raw || 'WP ABC-1234',
    makeModel: 'Toyota Aqua',
  };
}

export const ProtectedPassportViewerScreen: React.FC<
  ProtectedPassportViewerScreenProps
> = ({
  step1Data,
  step2Data,
  onBackPress,
  onEditVisibilityPress,
  onContinuePress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [preparedLocally, setPreparedLocally] = useState<boolean>(false);
  const [previewMessageDocId, setPreviewMessageDocId] = useState<string | null>(
    null
  );

  const recipientName =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const vehicleRaw = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const purpose = step1Data?.purpose || 'Insurance inspection';
  const expiresIn = step1Data?.expiresIn || '48 hours';

  const { registration, makeModel } = useMemo(
    () => splitVehicleParts(vehicleRaw),
    [vehicleRaw]
  );

  const visibility: ProtectedViewingStep2Data = useMemo(
    () =>
      step2Data ?? {
        showVehicleIdentity: true,
        showServiceHistory: true,
        showMaintenanceRecords: true,
        showEmissionsReports: true,
        showOwnershipRecords: false,
        showExpenseRecords: false,
        showDocuments: false,
        maskSensitiveDetails: true,
      },
    [step2Data]
  );

  const visibleCategoryCount = useMemo(() => {
    let count = 0;
    if (visibility.showVehicleIdentity) count += 1;
    if (visibility.showServiceHistory) count += 1;
    if (visibility.showMaintenanceRecords) count += 1;
    if (visibility.showEmissionsReports) count += 1;
    if (visibility.showOwnershipRecords) count += 1;
    if (visibility.showExpenseRecords) count += 1;
    if (visibility.showDocuments) count += 1;
    return count;
  }, [visibility]);

  const hiddenCategoryNames = useMemo(() => {
    const hidden: string[] = [];
    if (!visibility.showVehicleIdentity) hidden.push('Vehicle identity');
    if (!visibility.showServiceHistory) hidden.push('Service history');
    if (!visibility.showMaintenanceRecords) hidden.push('Maintenance records');
    if (!visibility.showEmissionsReports) hidden.push('Emissions reports');
    if (!visibility.showOwnershipRecords) hidden.push('Ownership records');
    if (!visibility.showExpenseRecords) hidden.push('Expense records');
    if (!visibility.showDocuments) hidden.push('Attached documents');
    return hidden;
  }, [visibility]);

  const handleToggleConfirm = () => {
    const next = !confirmed;
    setConfirmed(next);
    setPreparedLocally(false);
    if (next) {
      setConfirmError(null);
    }
  };

  const handlePrepareProtectedAccess = () => {
    if (!confirmed) {
      setConfirmError('Confirm the protected viewer before continuing.');
      setPreparedLocally(false);
      return;
    }
    setConfirmError(null);
    setPreparedLocally(true);
    onContinuePress?.();
  };

  const viewerAccessRows: Array<{ label: string; value: string }> = [
    { label: 'Visible categories', value: String(visibleCategoryCount) },
    {
      label: 'Sensitive details',
      value: visibility.maskSensitiveDetails ? 'Masked' : 'Visible',
    },
    { label: 'Purpose', value: purpose },
    { label: 'Expiry', value: expiresIn },
    { label: 'Protection', value: 'Owner-controlled' },
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
          onPress={() => onBackPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Back to Data Visibility"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-7 · PROTECTED VIEWING</Text>
          <Text style={styles.pageTitle}>Protected passport viewer</Text>
          <Text style={styles.pageSubtitle}>
            Preview exactly what this recipient will be able to see.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 3 of 3 · Protected viewer</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          </View>
        </View>

        {/* 4. PROTECTED VIEWER BANNER */}
        <LinearGradient
          colors={['#002B54', '#00427D', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#bae6fd" />
              <Text style={styles.bannerBadgeText}>Protected viewer</Text>
            </View>

            <View style={styles.bannerIconCircle}>
              <Ionicons name="lock-closed" size={16} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.bannerTitle}>Limited vehicle passport access</Text>
          <Text style={styles.bannerHelper}>
            Only the data selected by the owner is visible in this preview.
          </Text>

          <View style={styles.bannerMetaBox}>
            <View style={styles.bannerMetaRow}>
              <Text style={styles.bannerMetaLabel}>Recipient</Text>
              <Text style={styles.bannerMetaValue} numberOfLines={1}>
                {recipientName}
              </Text>
            </View>

            <View style={styles.bannerMetaRow}>
              <Text style={styles.bannerMetaLabel}>Purpose</Text>
              <Text style={styles.bannerMetaValue} numberOfLines={1}>
                {purpose}
              </Text>
            </View>

            <View style={styles.bannerMetaRow}>
              <Text style={styles.bannerMetaLabel}>Expires</Text>
              <Text style={styles.bannerMetaValue}>{expiresIn}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* SENSITIVE DETAILS MODE BADGE */}
        <View style={styles.maskBadgeRow}>
          <View
            style={[
              styles.maskModeBadge,
              visibility.maskSensitiveDetails
                ? styles.maskModeBadgeMasked
                : styles.maskModeBadgeVisible,
            ]}
          >
            <Ionicons
              name={
                visibility.maskSensitiveDetails ? 'lock-closed' : 'eye-outline'
              }
              size={13}
              color={visibility.maskSensitiveDetails ? '#15803d' : '#b45309'}
            />
            <Text
              style={[
                styles.maskModeBadgeText,
                visibility.maskSensitiveDetails
                  ? styles.maskModeBadgeTextMasked
                  : styles.maskModeBadgeTextVisible,
              ]}
            >
              {visibility.maskSensitiveDetails
                ? 'Sensitive details masked'
                : 'Full selected details visible'}
            </Text>
          </View>
        </View>

        {/* 5. VEHICLE PASSPORT HERO */}
        {visibility.showVehicleIdentity ? (
          <View style={styles.vehicleHeroCard}>
            <View style={styles.vehicleHeroTopRow}>
              <View style={styles.vehicleHeroIdentity}>
                <View style={styles.vehicleIconCircle}>
                  <Ionicons name="car-sport-outline" size={22} color="#0056A2" />
                </View>

                <View style={styles.vehicleTextCol}>
                  <Text style={styles.vehicleRegText}>{registration}</Text>
                  <Text style={styles.vehicleModelText}>{makeModel}</Text>
                </View>
              </View>

              <View style={styles.protectedStatusBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#15803d" />
                <Text style={styles.protectedStatusText}>Protected</Text>
              </View>
            </View>

            <View style={styles.vehicleHeroDivider} />

            <View style={styles.vehicleHeroFooter}>
              <Text style={styles.vehiclePassportMetaLabel}>
                Chassis / VIN ref
              </Text>
              <Text style={styles.vehiclePassportMetaValue}>
                {visibility.maskSensitiveDetails
                  ? 'NHP10-••••••'
                  : 'NHP10-23648102'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.hiddenVehicleCard}>
            <View style={styles.hiddenVehicleIconBox}>
              <Ionicons name="lock-closed" size={20} color="#475569" />
            </View>
            <View style={styles.hiddenVehicleTextCol}>
              <Text style={styles.hiddenVehicleTitle}>
                Vehicle identity hidden by owner
              </Text>
              <Text style={styles.hiddenVehicleSub}>
                Registration and vehicle model are withheld from this viewer.
              </Text>
            </View>
          </View>
        )}

        {/* 6. SERVICE HISTORY SECTION (DYNAMIC) */}
        {visibility.showServiceHistory ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="construct-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Service history</Text>
            </View>

            <View style={styles.divider} />

            {SAMPLE_SERVICE_HISTORY.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceRowTop}>
                    <Text style={styles.serviceTitle}>{item.title}</Text>
                    <Text style={styles.serviceDate}>{item.date}</Text>
                  </View>
                  <View style={styles.serviceRowBottom}>
                    <Text style={styles.serviceMeta}>{item.workshop}</Text>
                    <Text style={styles.serviceMileage}>{item.mileage}</Text>
                  </View>
                </View>
                {idx < SAMPLE_SERVICE_HISTORY.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* 7. MAINTENANCE RECORDS SECTION (DYNAMIC) */}
        {visibility.showMaintenanceRecords ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="build-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Maintenance records</Text>
            </View>

            <View style={styles.divider} />

            {SAMPLE_MAINTENANCE_RECORDS.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.detailRow}>
                  <Text style={styles.itemTitleText}>{item.title}</Text>
                  <Text style={styles.itemMetaText}>{item.meta}</Text>
                </View>
                {idx < SAMPLE_MAINTENANCE_RECORDS.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* 8. EMISSIONS REPORTS SECTION (DYNAMIC) */}
        {visibility.showEmissionsReports ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderSpread}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardIconBoxSuccess}>
                  <Ionicons name="leaf-outline" size={17} color="#15803d" />
                </View>
                <Text style={styles.cardTitle}>Emissions reports</Text>
              </View>

              <View style={styles.protectedStatusBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#15803d" />
                <Text style={styles.protectedStatusText}>Valid</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Latest test</Text>
                <Text style={styles.detailSuccessValue}>Passed</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>12 Aug 2026</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailSuccessValue}>Valid</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* 9. OWNERSHIP SECTION (DYNAMIC + MASKING) */}
        {visibility.showOwnershipRecords ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Ownership</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current owner</Text>
                <Text style={styles.detailValue}>
                  {visibility.maskSensitiveDetails ? 'N. F******' : 'N. Fernando'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact reference</Text>
                <Text style={styles.detailValue}>
                  {visibility.maskSensitiveDetails
                    ? '•••• ••• 482'
                    : 'Verified local profile'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ownership status</Text>
                <Text style={styles.detailSuccessValue}>Verified</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* 10. EXPENSE SUMMARY SECTION (DYNAMIC) */}
        {visibility.showExpenseRecords ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="wallet-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Expense summary</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service expenses</Text>
                <Text style={styles.detailValue}>LKR 83,400</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maintenance YTD</Text>
                <Text style={styles.detailValue}>LKR 146,900</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* 11. ATTACHED DOCUMENTS SECTION (DYNAMIC + SAFE PREVIEW) */}
        {visibility.showDocuments ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="document-attach-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Attached documents</Text>
            </View>

            <View style={styles.divider} />

            {SAMPLE_DOCUMENTS.map((doc, idx) => (
              <View key={doc.id}>
                <View style={styles.docRow}>
                  <View style={styles.docTextCol}>
                    <Text style={styles.itemTitleText}>{doc.title}</Text>
                    <Text style={styles.docDateText}>{doc.date}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => setPreviewMessageDocId(doc.id)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="eye-outline" size={14} color="#0056A2" />
                    <Text style={styles.previewButtonText}>Preview</Text>
                  </TouchableOpacity>
                </View>

                {previewMessageDocId === doc.id ? (
                  <View style={styles.docNoticeBox}>
                    <Ionicons
                      name="information-circle-outline"
                      size={14}
                      color="#475569"
                    />
                    <Text style={styles.docNoticeText}>
                      Document preview not connected.
                    </Text>
                  </View>
                ) : null}

                {idx < SAMPLE_DOCUMENTS.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* SUBTLE HIDDEN BY OWNER PLACEHOLDER (ONLY CATEGORY NAMES, ZERO DATA LEAK) */}
        {hiddenCategoryNames.length > 0 ? (
          <View style={styles.hiddenSummaryCard}>
            <View style={styles.hiddenSummaryHeader}>
              <Ionicons name="lock-closed-outline" size={15} color="#64748b" />
              <Text style={styles.hiddenSummaryTitle}>Hidden by owner</Text>
            </View>
            <View style={styles.hiddenChipsWrap}>
              {hiddenCategoryNames.map((name) => (
                <View key={name} style={styles.hiddenChip}>
                  <Ionicons name="eye-off-outline" size={12} color="#64748b" />
                  <Text style={styles.hiddenChipText}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* 12. VIEWER ACCESS SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBoxSuccess}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color="#15803d"
                />
              </View>
              <Text style={styles.cardTitle}>Viewer access</Text>
            </View>

            <View style={styles.protectedStatusBadge}>
              <View style={styles.protectedDot} />
              <Text style={styles.protectedStatusText}>Protected</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {viewerAccessRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 13. CONFIRMATION CHECKBOX CARD */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.checkboxRow,
              confirmError ? styles.checkboxRowError : null,
            ]}
            onPress={handleToggleConfirm}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmed }}
          >
            <View
              style={[
                styles.checkboxBox,
                confirmed ? styles.checkboxBoxChecked : null,
              ]}
            >
              {confirmed ? (
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>
              I confirm this preview matches what the recipient should see.
            </Text>
          </TouchableOpacity>

          {confirmError ? (
            <Text style={styles.errorText}>{confirmError}</Text>
          ) : null}
        </View>

        {/* 14. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrepareProtectedAccess}
            activeOpacity={0.85}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={styles.primaryButtonText}>
              Prepare protected access
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onEditVisibilityPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>Edit data visibility</Text>
          </TouchableOpacity>

          {preparedLocally ? (
            <View style={styles.preparedBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.preparedBannerText}>
                Protected access prepared locally — backend access not created.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 15. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
  bannerCard: {
    borderRadius: 16,
    padding: 16,
    gap: 9,
    shadowColor: '#002B54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(186, 230, 253, 0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bannerBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#e0f2fe',
  },
  bannerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  bannerHelper: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#dbeafe',
  },
  bannerMetaBox: {
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  bannerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  bannerMetaLabel: {
    fontSize: 12,
    color: '#bfdbfe',
    fontWeight: '500',
  },
  bannerMetaValue: {
    fontSize: 12.5,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  maskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maskModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderWidth: 1,
  },
  maskModeBadgeMasked: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  maskModeBadgeVisible: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  maskModeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  maskModeBadgeTextMasked: {
    color: '#15803d',
  },
  maskModeBadgeTextVisible: {
    color: '#b45309',
  },
  vehicleHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  vehicleHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  vehicleHeroIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTextCol: {
    flex: 1,
    gap: 2,
  },
  vehicleRegText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.2,
  },
  vehicleModelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  vehicleHeroDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 11,
  },
  vehicleHeroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  vehiclePassportMetaLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  vehiclePassportMetaValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.4,
  },
  hiddenVehicleCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hiddenVehicleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenVehicleTextCol: {
    flex: 1,
    gap: 2,
  },
  hiddenVehicleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  hiddenVehicleSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  protectedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  protectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  protectedStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
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
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#dcfce7',
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
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 9,
  },
  serviceRow: {
    gap: 4,
  },
  serviceRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  serviceTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  serviceDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0056A2',
  },
  serviceRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  serviceMeta: {
    fontSize: 12.5,
    color: '#64748b',
    flex: 1,
  },
  serviceMileage: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  detailsList: {
    gap: 9,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  detailSuccessValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
    textAlign: 'right',
  },
  itemTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'right',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  docTextCol: {
    flex: 1,
    gap: 2,
  },
  docDateText: {
    fontSize: 12,
    color: '#64748b',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056A2',
  },
  docNoticeBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  docNoticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  hiddenSummaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  hiddenSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hiddenSummaryTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748b',
  },
  hiddenChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hiddenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  hiddenChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 10,
    borderRadius: 11,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxRowError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxChecked: {
    borderColor: '#0056A2',
    backgroundColor: '#0056A2',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  errorText: {
    marginTop: 7,
    fontSize: 12,
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
  preparedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  preparedBannerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0056A2',
    lineHeight: 17.5,
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

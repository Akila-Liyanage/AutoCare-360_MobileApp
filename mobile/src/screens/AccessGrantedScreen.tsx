import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessLevelStep1Data } from './AccessLevelScreen';
import { SelectedRecordsStep2Data } from './SelectedRecordsScreen';

export interface AccessGrantedScreenProps {
  step1Data?: AccessLevelStep1Data | null;
  step2Data?: SelectedRecordsStep2Data | null;
  onBackPress?: () => void;
  onDonePress?: () => void;
  onViewDetailsPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

const LOCAL_PERMISSION_REFERENCE = 'AC360-ACCESS-0926';

export const AccessGrantedScreen: React.FC<AccessGrantedScreenProps> = ({
  step1Data,
  step2Data,
  onBackPress,
  onDonePress,
  onViewDetailsPress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const recipientName =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const recipientEmail = step1Data?.recipientEmail || 'inspection@ceylinco.lk';
  const vehicle = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const accessLevelLabel =
    step1Data?.accessLevel === 'review' ? 'Review' : 'View only';

  const selectedCategoryLabels = useMemo(() => {
    const data: SelectedRecordsStep2Data = step2Data ?? {
      serviceHistory: true,
      maintenanceRecords: true,
      emissionsReports: true,
      ownershipRecords: false,
      expenseRecords: false,
      notes: '',
    };
    const labels: string[] = [];
    if (data.serviceHistory) labels.push('Service history');
    if (data.maintenanceRecords) labels.push('Maintenance records');
    if (data.emissionsReports) labels.push('Emissions reports');
    if (data.ownershipRecords) labels.push('Ownership records');
    if (data.expenseRecords) labels.push('Expense records');
    return labels;
  }, [step2Data]);

  const savedNote = step2Data?.notes?.trim() || '';

  const handleShareAccessSummary = async () => {
    try {
      const recordsText =
        selectedCategoryLabels.length > 0
          ? selectedCategoryLabels.join(', ')
          : 'Selected vehicle records';
      await Share.share({
        message: [
          'AutoCare 360 access summary',
          `Recipient: ${recipientName}`,
          `Vehicle: ${vehicle}`,
          `Access level: ${accessLevelLabel}`,
          `Records: ${recordsText}`,
        ].join('\n'),
      });
    } catch {
      // Safe no-op if native share sheet is dismissed or unavailable
    }
  };

  const recipientRows: Array<{ label: string; value: string; accent?: boolean }> =
    [
      { label: 'Name / entity', value: recipientName },
      { label: 'Email', value: recipientEmail },
      { label: 'Vehicle', value: vehicle },
      { label: 'Access level', value: accessLevelLabel, accent: true },
    ];

  const permissionStatusRows: Array<{
    label: string;
    value: string;
    success?: boolean;
  }> = [
    { label: 'Status', value: 'Prepared locally', success: true },
    { label: 'Access level', value: accessLevelLabel },
    { label: 'Record scope', value: 'Selected records only' },
    { label: 'Recipient', value: 'Named recipient' },
    { label: 'Protection', value: 'Protected access', success: true },
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
          accessibilityLabel="Back to Review Permission"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-6 · ACCESS PERMISSIONS</Text>
          <Text style={styles.pageTitle}>Access granted</Text>
          <Text style={styles.pageSubtitle}>
            Protected access has been prepared for this recipient.
          </Text>
        </View>

        {/* 3. PROMINENT SUCCESS HERO CARD */}
        <View style={styles.successHeroCard}>
          <View style={styles.heroIconHalo}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="shield-checkmark" size={28} color="#ffffff" />
            </View>
          </View>

          <View style={styles.protectedBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#15803d" />
            <Text style={styles.protectedBadgeText}>Protected access</Text>
          </View>

          <Text style={styles.heroTitle}>Access prepared</Text>
          <Text style={styles.heroHelper}>
            This frontend session is ready with the selected permission settings.
          </Text>

          <View style={styles.localNoticePill}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#475569"
            />
            <Text style={styles.localNoticeText}>
              Backend permission has not been created.
            </Text>
          </View>
        </View>

        {/* 4. RECIPIENT SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="person-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Recipient</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {recipientRows.map((row) => (
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

        {/* 5. SHARED RECORDS SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="folder-open-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Shared records</Text>
            </View>

            <View style={styles.countPill}>
              <Text style={styles.countPillText}>
                {selectedCategoryLabels.length}{' '}
                {selectedCategoryLabels.length === 1
                  ? 'record category'
                  : 'record categories'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.chipsWrap}>
            {selectedCategoryLabels.map((label) => (
              <View key={label} style={styles.selectedChip}>
                <Ionicons name="checkmark-circle" size={13} color="#15803d" />
                <Text style={styles.selectedChipText}>{label}</Text>
              </View>
            ))}
          </View>

          {savedNote ? (
            <View style={styles.noteBlock}>
              <Text style={styles.noteBlockLabel}>Access note</Text>
              <Text style={styles.noteBlockValue}>{savedNote}</Text>
            </View>
          ) : null}
        </View>

        {/* 6. PERMISSION STATUS CARD */}
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
              <Text style={styles.cardTitle}>Permission status</Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>Prepared locally</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {permissionStatusRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    row.success ? styles.detailSuccessValue : null,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7. COMPACT LOCAL REFERENCE SECTION */}
        <View style={styles.referenceCard}>
          <View style={styles.referenceTopRow}>
            <Text style={styles.referenceLabel}>Permission reference</Text>
            <View style={styles.localRefBadge}>
              <Text style={styles.localRefBadgeText}>Local reference</Text>
            </View>
          </View>

          <View style={styles.referenceCodeRow}>
            <Ionicons name="document-text-outline" size={15} color="#0056A2" />
            <Text style={styles.referenceCodeText}>
              {LOCAL_PERMISSION_REFERENCE}
            </Text>
          </View>

          <Text style={styles.referenceHelper}>
            Frontend display identifier only.
          </Text>
        </View>

        {/* 8. ACTION BUTTONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onDonePress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onViewDetailsPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>
              View permission details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareAccessSummary}
            activeOpacity={0.75}
          >
            <Ionicons name="share-outline" size={16} color="#334155" />
            <Text style={styles.shareButtonText}>Share access summary</Text>
          </TouchableOpacity>
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
  successHeroCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroIconHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#15803d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  protectedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 5,
  },
  heroHelper: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 18.5,
    marginBottom: 12,
  },
  localNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  localNoticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
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
  detailsList: {
    gap: 10,
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
    flexShrink: 0,
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
  detailSuccessValue: {
    color: '#15803d',
    fontWeight: '700',
  },
  countPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  countPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#166534',
  },
  noteBlock: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 11,
    gap: 3,
  },
  noteBlockLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  noteBlockValue: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 18.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  statusPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  referenceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 7,
  },
  referenceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  referenceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  localRefBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  localRefBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  referenceCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  referenceCodeText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
    letterSpacing: 0.6,
  },
  referenceHelper: {
    fontSize: 11.5,
    color: '#64748b',
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
    gap: 7,
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
  shareButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
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

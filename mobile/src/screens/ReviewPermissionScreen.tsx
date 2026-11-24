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
import { Ionicons } from '@expo/vector-icons';
import { AccessLevelStep1Data } from './AccessLevelScreen';
import { SelectedRecordsStep2Data } from './SelectedRecordsScreen';

export interface ReviewPermissionScreenProps {
  step1Data?: AccessLevelStep1Data | null;
  step2Data?: SelectedRecordsStep2Data | null;
  onBackPress?: () => void;
  onEditAccessLevelPress?: () => void;
  onEditSelectedRecordsPress?: () => void;
  onGrantAccessPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

export const ReviewPermissionScreen: React.FC<ReviewPermissionScreenProps> = ({
  step1Data,
  step2Data,
  onBackPress,
  onEditAccessLevelPress,
  onEditSelectedRecordsPress,
  onGrantAccessPress,
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

  const handleToggleConfirm = () => {
    const next = !confirmed;
    setConfirmed(next);
    setPreparedLocally(false);
    if (next) {
      setConfirmError(null);
    }
  };

  const handleGrantAccess = () => {
    if (!confirmed) {
      setConfirmError('Confirm permission before continuing.');
      setPreparedLocally(false);
      return;
    }
    setConfirmError(null);
    setPreparedLocally(true);
    onGrantAccessPress?.();
  };

  const recipientRows: Array<{ label: string; value: string; accent?: boolean }> =
    [
      { label: 'Name / entity', value: recipientName },
      { label: 'Email', value: recipientEmail },
      { label: 'Vehicle', value: vehicle },
      { label: 'Access level', value: accessLevelLabel, accent: true },
    ];

  const permissionDetailRows: Array<{ label: string; value: string }> = [
    { label: 'Access mode', value: accessLevelLabel },
    { label: 'Record scope', value: 'Selected records only' },
    { label: 'Recipient identity', value: 'Named recipient' },
    { label: 'Vehicle', value: vehicle },
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
          accessibilityLabel="Back to Selected Records"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-6 · ACCESS PERMISSIONS</Text>
          <Text style={styles.pageTitle}>Review permission</Text>
          <Text style={styles.pageSubtitle}>
            Review who will receive access and exactly what they can see.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 3 of 3 · Review permission</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          </View>
        </View>

        {/* 4. RECIPIENT SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="person-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Recipient</Text>
            </View>

            <TouchableOpacity
              style={styles.editLinkButton}
              onPress={() => onEditAccessLevelPress?.()}
              activeOpacity={0.75}
            >
              <Text style={styles.editLinkText}>Edit access level</Text>
            </TouchableOpacity>
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

        {/* 5. SELECTED RECORDS SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="folder-open-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Selected records</Text>
            </View>

            <TouchableOpacity
              style={styles.editLinkButton}
              onPress={() => onEditSelectedRecordsPress?.()}
              activeOpacity={0.75}
            >
              <Text style={styles.editLinkText}>Edit selected records</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.selectedCountText}>
            {selectedCategoryLabels.length} record{' '}
            {selectedCategoryLabels.length === 1 ? 'category' : 'categories'}{' '}
            selected
          </Text>

          <View style={styles.chipsWrap}>
            {selectedCategoryLabels.map((label) => (
              <View key={label} style={styles.selectedChip}>
                <Ionicons name="checkmark-circle" size={13} color="#0056A2" />
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

        {/* 6. PERMISSION DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>Permission details</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {permissionDetailRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.protectionNoticeBox}>
            <Ionicons
              name="lock-closed"
              size={16}
              color="#0056A2"
              style={styles.protectionIcon}
            />
            <View style={styles.protectionTextCol}>
              <Text style={styles.protectionNoticeTitle}>Protected access</Text>
              <Text style={styles.protectionNoticeBody}>
                Only the selected records are included in this permission.
              </Text>
            </View>
          </View>
        </View>

        {/* 7. CONFIRMATION CARD */}
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
              I confirm this recipient may access the selected vehicle records.
            </Text>
          </TouchableOpacity>

          {confirmError ? (
            <Text style={styles.errorText}>{confirmError}</Text>
          ) : null}

          <Text style={styles.helperText}>
            You can review or revoke access later from the sharing area.
          </Text>
        </View>

        {/* 8. PRIMARY & EDIT ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.grantButton}
            onPress={handleGrantAccess}
            activeOpacity={0.85}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color="#ffffff"
            />
            <Text style={styles.grantButtonText}>Grant access</Text>
          </TouchableOpacity>

          {preparedLocally ? (
            <View style={styles.preparedBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.preparedBannerText}>
                Access prepared locally — backend permission not created.
              </Text>
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
  editLinkButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: '#ebf5ff',
    flexShrink: 0,
  },
  editLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  detailsList: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  detailAccentValue: {
    color: '#0056A2',
  },
  selectedCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004684',
  },
  noteBlock: {
    marginTop: 13,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 11,
  },
  noteBlockLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  noteBlockValue: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1e293b',
    fontWeight: '500',
  },
  protectionNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    padding: 11,
    gap: 9,
    marginTop: 14,
  },
  protectionIcon: {
    marginTop: 1,
  },
  protectionTextCol: {
    flex: 1,
  },
  protectionNoticeTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#004684',
    marginBottom: 2,
  },
  protectionNoticeBody: {
    fontSize: 12,
    lineHeight: 17,
    color: '#334155',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 11,
    padding: 12,
  },
  checkboxRowError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  checkboxBox: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#0f172a',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 7,
  },
  helperText: {
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#64748b',
    marginTop: 9,
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  grantButton: {
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
  grantButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  preparedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  preparedBannerText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#004684',
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

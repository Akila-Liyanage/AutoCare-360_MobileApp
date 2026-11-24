import React, { useMemo, useState } from 'react';
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
import { ProtectedViewingStep1Data } from './ProtectedViewingSetupScreen';
import { ProtectedViewingStep2Data } from './DataVisibilityScreen';

export interface ProtectedAccessReadyScreenProps {
  step1Data?: ProtectedViewingStep1Data | null;
  step2Data?: ProtectedViewingStep2Data | null;
  onBackPress?: () => void;
  onDonePress?: () => void;
  onViewPassportPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

const LOCAL_PROTECTED_REFERENCE = 'AC360-PROTECT-0926';

export const ProtectedAccessReadyScreen: React.FC<
  ProtectedAccessReadyScreenProps
> = ({
  step1Data,
  step2Data,
  onBackPress,
  onDonePress,
  onViewPassportPress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const [revokedLocally, setRevokedLocally] = useState<boolean>(false);

  const recipientName =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const recipientEmail = step1Data?.recipientEmail || 'inspection@ceylinco.lk';
  const vehicle = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const purpose = step1Data?.purpose || 'Insurance inspection';
  const expiresIn = step1Data?.expiresIn || '48 hours';

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

  const enabledCategoryLabels = useMemo(() => {
    const labels: string[] = [];
    if (visibility.showVehicleIdentity) labels.push('Vehicle identity');
    if (visibility.showServiceHistory) labels.push('Service history');
    if (visibility.showMaintenanceRecords) labels.push('Maintenance records');
    if (visibility.showEmissionsReports) labels.push('Emissions reports');
    if (visibility.showOwnershipRecords) labels.push('Ownership records');
    if (visibility.showExpenseRecords) labels.push('Expense records');
    if (visibility.showDocuments) labels.push('Attached documents');
    return labels;
  }, [visibility]);

  const sensitiveLabel = visibility.maskSensitiveDetails ? 'Masked' : 'Visible';

  const handleShareAccessSummary = async () => {
    try {
      await Share.share({
        message: [
          'AutoCare 360 protected access summary',
          `Recipient: ${recipientName}`,
          `Vehicle: ${vehicle}`,
          `Purpose: ${purpose}`,
          `Expiry: ${expiresIn}`,
          `Visible categories: ${enabledCategoryLabels.length}`,
          `Sensitive details: ${sensitiveLabel}`,
        ].join('\n'),
      });
    } catch {
      // Safe no-op if native share sheet is dismissed or unavailable
    }
  };

  const recipientRows: Array<{ label: string; value: string; accent?: boolean }> =
    [
      { label: 'Recipient', value: recipientName },
      { label: 'Email', value: recipientEmail },
      { label: 'Vehicle', value: vehicle },
      { label: 'Purpose', value: purpose },
      { label: 'Expires', value: expiresIn, accent: true },
    ];

  const protectionStatusRows: Array<{
    label: string;
    value: string;
    tone?: 'default' | 'green' | 'blue' | 'danger';
  }> = [
    {
      label: 'Status',
      value: revokedLocally ? 'Revoked locally' : 'Prepared locally',
      tone: revokedLocally ? 'danger' : 'green',
    },
    { label: 'Viewer access', value: 'Owner-controlled', tone: 'blue' },
    {
      label: 'Sensitive details',
      value: sensitiveLabel,
      tone: visibility.maskSensitiveDetails ? 'green' : 'default',
    },
    { label: 'Download access', value: 'Protected viewer only', tone: 'blue' },
    { label: 'Expiry', value: expiresIn, tone: 'default' },
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
          accessibilityLabel="Back to Protected Passport Viewer"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-7 · PROTECTED VIEWING</Text>
          <Text style={styles.pageTitle}>Protected access ready</Text>
          <Text style={styles.pageSubtitle}>
            Your protected viewing configuration is ready.
          </Text>
        </View>

        {/* 3. PROMINENT SUCCESS HERO CARD */}
        <View
          style={[
            styles.successHeroCard,
            revokedLocally ? styles.revokedHeroCard : null,
          ]}
        >
          <View
            style={[
              styles.heroIconHalo,
              revokedLocally ? styles.heroIconHaloRevoked : null,
            ]}
          >
            <View
              style={[
                styles.heroIconCircle,
                revokedLocally ? styles.heroIconCircleRevoked : null,
              ]}
            >
              <Ionicons
                name={revokedLocally ? 'close-circle' : 'shield-checkmark'}
                size={28}
                color="#ffffff"
              />
            </View>
          </View>

          <View
            style={[
              styles.protectedBadge,
              revokedLocally ? styles.revokedBadge : null,
            ]}
          >
            <Ionicons
              name={revokedLocally ? 'close-circle' : 'checkmark-circle'}
              size={13}
              color={revokedLocally ? '#dc2626' : '#15803d'}
            />
            <Text
              style={[
                styles.protectedBadgeText,
                revokedLocally ? styles.revokedBadgeText : null,
              ]}
            >
              {revokedLocally ? 'Revoked locally' : 'Protected access'}
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            {revokedLocally
              ? 'Viewing access revoked'
              : 'Viewing access prepared'}
          </Text>
          <Text style={styles.heroHelper}>
            The selected vehicle data and visibility rules are ready in this
            frontend session.
          </Text>

          <View style={styles.localNoticePill}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={revokedLocally ? '#b91c1c' : '#475569'}
            />
            <Text
              style={[
                styles.localNoticeText,
                revokedLocally ? styles.localNoticeTextDanger : null,
              ]}
            >
              {revokedLocally
                ? 'Protected access revoked locally — backend not updated.'
                : 'Backend access has not been created.'}
            </Text>
          </View>
        </View>

        {/* 4. ACCESS RECIPIENT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="person-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access recipient</Text>
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

        {/* 5. VISIBLE DATA CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="eye-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Visible data</Text>
            </View>

            <View style={styles.countPill}>
              <Text style={styles.countPillText}>
                {enabledCategoryLabels.length}{' '}
                {enabledCategoryLabels.length === 1
                  ? 'data category visible'
                  : 'data categories visible'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.chipsWrap}>
            {enabledCategoryLabels.map((label) => (
              <View key={label} style={styles.selectedChip}>
                <Ionicons name="checkmark-circle" size={13} color="#15803d" />
                <Text style={styles.selectedChipText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sensitiveSummaryRow}>
            <Text style={styles.detailLabel}>Sensitive details</Text>
            <View
              style={[
                styles.sensitiveBadge,
                visibility.maskSensitiveDetails
                  ? styles.sensitiveBadgeMasked
                  : styles.sensitiveBadgeVisible,
              ]}
            >
              <Ionicons
                name={
                  visibility.maskSensitiveDetails
                    ? 'lock-closed'
                    : 'eye-outline'
                }
                size={12}
                color={visibility.maskSensitiveDetails ? '#15803d' : '#b45309'}
              />
              <Text
                style={[
                  styles.sensitiveBadgeText,
                  visibility.maskSensitiveDetails
                    ? styles.sensitiveBadgeTextMasked
                    : styles.sensitiveBadgeTextVisible,
                ]}
              >
                {sensitiveLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. PROTECTION STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.cardIconBoxSuccess,
                  revokedLocally ? styles.cardIconBoxDanger : null,
                ]}
              >
                <Ionicons
                  name={
                    revokedLocally
                      ? 'close-circle-outline'
                      : 'shield-checkmark-outline'
                  }
                  size={17}
                  color={revokedLocally ? '#dc2626' : '#15803d'}
                />
              </View>
              <Text style={styles.cardTitle}>Protection status</Text>
            </View>

            <View
              style={[
                styles.statusPill,
                revokedLocally ? styles.statusPillDanger : null,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  revokedLocally ? styles.statusDotDanger : null,
                ]}
              />
              <Text
                style={[
                  styles.statusPillText,
                  revokedLocally ? styles.statusPillTextDanger : null,
                ]}
              >
                {revokedLocally ? 'Revoked locally' : 'Prepared locally'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {protectionStatusRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    row.tone === 'green' ? styles.detailSuccessValue : null,
                    row.tone === 'blue' ? styles.detailAccentValue : null,
                    row.tone === 'danger' ? styles.detailDangerValue : null,
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
            <Text style={styles.referenceLabel}>
              Protected access reference
            </Text>
            <View style={styles.localRefBadge}>
              <Text style={styles.localRefBadgeText}>Local reference</Text>
            </View>
          </View>

          <View style={styles.referenceCodeRow}>
            <Ionicons name="document-text-outline" size={15} color="#0056A2" />
            <Text style={styles.referenceCodeText}>
              {LOCAL_PROTECTED_REFERENCE}
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
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onViewPassportPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>
              View protected passport
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

          {!revokedLocally ? (
            <TouchableOpacity
              style={styles.revokeButton}
              onPress={() => setRevokedLocally(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="ban-outline" size={15} color="#dc2626" />
              <Text style={styles.revokeButtonText}>
                Revoke protected access
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.revokedBanner}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.revokedBannerText}>
                Protected access revoked locally — backend not updated.
              </Text>
            </View>
          )}
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
  revokedHeroCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
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
  heroIconHaloRevoked: {
    backgroundColor: '#fee2e2',
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
  heroIconCircleRevoked: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
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
  revokedBadge: {
    borderColor: '#fecaca',
  },
  protectedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  revokedBadgeText: {
    color: '#dc2626',
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
    flexShrink: 1,
  },
  localNoticeTextDanger: {
    color: '#b91c1c',
    fontWeight: '600',
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
    flexWrap: 'wrap',
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
  cardIconBoxDanger: {
    backgroundColor: '#fee2e2',
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
  detailDangerValue: {
    color: '#dc2626',
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
  sensitiveSummaryRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  statusPillDanger: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  statusDotDanger: {
    backgroundColor: '#dc2626',
  },
  statusPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  statusPillTextDanger: {
    color: '#dc2626',
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
  revokeButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  revokeButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#dc2626',
  },
  revokedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  revokedBannerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#b91c1c',
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

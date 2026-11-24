import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SecureLinkStep1Data } from './SecureLinkRecipientScreen';
import { SecureLinkStep2Data } from './SecureLinkProtectionScreen';

export interface SecureLinkReadyScreenProps {
  step1Data?: SecureLinkStep1Data | null;
  step2Data?: SecureLinkStep2Data | null;
  onBackPress?: () => void;
  onDonePress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

const LOCAL_SHARE_LINK = 'autocare.lk/s/AC9-K7Q-26';

export const SecureLinkReadyScreen: React.FC<SecureLinkReadyScreenProps> = ({
  step1Data,
  step2Data,
  onBackPress,
  onDonePress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [revokedLocally, setRevokedLocally] = useState<boolean>(false);

  const recipientName =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const recipientEmail = step1Data?.recipientEmail || 'inspection@ceylinco.lk';
  const vehicle = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const selectedRecords =
    step1Data?.selectedRecords ||
    '21 Sep service · 15 May service · emissions report';

  const expiresIn = step2Data?.expiresIn || '48 hours';
  const maxViews = step2Data?.maxViews || '10';
  const requireViewerName = step2Data?.requireViewerName ?? true;
  const requireOtp = step2Data?.requireOtp ?? true;
  const allowDownload = step2Data?.allowDownload ?? false;

  const handleCopyLink = () => {
    setLinkCopied(true);
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `AutoCare 360 verified vehicle history for ${vehicle}: https://${LOCAL_SHARE_LINK}`,
      });
    } catch {
      // Safe no-op if native share sheet is dismissed or unavailable
    }
  };

  const handleRevokeLink = () => {
    setRevokedLocally(true);
    setLinkCopied(false);
  };

  const recipientRows: Array<{ label: string; value: string }> = [
    { label: 'Name / entity', value: recipientName },
    { label: 'Email', value: recipientEmail },
    { label: 'Vehicle', value: vehicle },
    { label: 'Records', value: selectedRecords },
  ];

  const protectionRows: Array<{ label: string; value: string }> = [
    { label: 'Expires in', value: expiresIn },
    { label: 'Maximum views', value: maxViews },
    { label: 'Viewer name', value: requireViewerName ? 'Required' : 'Optional' },
    { label: 'OTP verification', value: requireOtp ? 'Required' : 'Off' },
    { label: 'Downloads', value: allowDownload ? 'Allowed' : 'Blocked' },
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
          accessibilityLabel="Back to Protection"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-5 · SECURE LINK</Text>
          <Text style={styles.pageTitle}>Link ready</Text>
          <Text style={styles.pageSubtitle}>
            Your protected vehicle history link is ready to share.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 3 of 3 · Link ready</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          </View>
        </View>

        {/* 4. PROMINENT SECURE LINK SUCCESS CARD */}
        <LinearGradient
          colors={['#003566', '#004684', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linkHeroCard}
        >
          <View style={styles.linkHeroTopRow}>
            <View
              style={[
                styles.createdPill,
                revokedLocally ? styles.revokedPill : null,
              ]}
            >
              <Ionicons
                name={revokedLocally ? 'close-circle' : 'checkmark-circle'}
                size={13}
                color={revokedLocally ? '#dc2626' : '#15803d'}
              />
              <Text
                style={[
                  styles.createdPillText,
                  revokedLocally ? styles.revokedPillText : null,
                ]}
              >
                {revokedLocally ? 'Revoked locally' : 'Secure link created'}
              </Text>
            </View>

            <View style={styles.heroIconBadge}>
              <Ionicons name="link-outline" size={18} color="#bae6fd" />
            </View>
          </View>

          <View style={styles.urlBox}>
            <Ionicons name="lock-closed" size={15} color="#bae6fd" />
            <Text style={styles.urlText}>{LOCAL_SHARE_LINK}</Text>
          </View>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyLink}
            activeOpacity={0.85}
          >
            <Ionicons
              name={linkCopied ? 'checkmark-circle' : 'copy-outline'}
              size={16}
              color={linkCopied ? '#15803d' : '#004684'}
            />
            <Text
              style={[
                styles.copyButtonText,
                linkCopied ? styles.copyButtonTextCopied : null,
              ]}
            >
              {linkCopied ? 'Link copied' : 'Copy link'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* 5. RECIPIENT SUMMARY CARD */}
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
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. PROTECTION SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Protection</Text>
            </View>

            <View style={styles.protectedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#15803d" />
              <Text style={styles.protectedBadgeText}>Protected</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {protectionRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7. ACCESS STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="pulse-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access status</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  revokedLocally ? styles.statusRevoked : styles.statusActive,
                ]}
              >
                {revokedLocally ? 'Revoked locally' : 'Active'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Views used</Text>
              <Text style={styles.detailValue}>0 / {maxViews}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expires</Text>
              <Text style={styles.detailValue}>24 Sep 2026 · 6:00 PM</Text>
            </View>
          </View>
        </View>

        {/* 8. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareLink}
            activeOpacity={0.85}
          >
            <Ionicons name="share-outline" size={17} color="#ffffff" />
            <Text style={styles.shareButtonText}>Share link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => onDonePress?.()}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.revokeButton}
            onPress={handleRevokeLink}
            activeOpacity={0.8}
          >
            <Ionicons name="ban-outline" size={16} color="#dc2626" />
            <Text style={styles.revokeButtonText}>Revoke link</Text>
          </TouchableOpacity>

          {revokedLocally ? (
            <View style={styles.revokedNoticeBox}>
              <Ionicons name="alert-circle" size={15} color="#b91c1c" />
              <Text style={styles.revokedNoticeText}>
                Link revoked locally — backend not updated.
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
  linkHeroCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#003566',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  linkHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  createdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  revokedPill: {
    backgroundColor: '#fee2e2',
  },
  createdPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  revokedPillText: {
    color: '#dc2626',
  },
  heroIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    gap: 8,
    marginBottom: 14,
  },
  urlText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  copyButton: {
    height: 42,
    backgroundColor: '#ffffff',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  copyButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#004684',
  },
  copyButtonTextCopied: {
    color: '#15803d',
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
  statusActive: {
    color: '#15803d',
  },
  statusRevoked: {
    color: '#dc2626',
  },
  actionsSection: {
    gap: 10,
    marginTop: 2,
    marginBottom: 4,
  },
  shareButton: {
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
  shareButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  doneButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  revokeButton: {
    height: 44,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  revokeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  revokedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 7,
  },
  revokedNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
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

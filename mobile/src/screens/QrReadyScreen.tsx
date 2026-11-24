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
import { Ionicons } from '@expo/vector-icons';
import { QrConfigData } from './QrConfigureScreen';

export interface QrReadyScreenProps {
  qrConfig?: QrConfigData | null;
  onBackPress?: () => void;
  onDonePress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

const LOCAL_QR_CODE = 'AC360-QR-0492';

// Deterministic 13x13 decorative QR visual matrix (local preview only)
const QR_PREVIEW_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
];

export const QrReadyScreen: React.FC<QrReadyScreenProps> = ({
  qrConfig,
  onBackPress,
  onDonePress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const [saveNotice, setSaveNotice] = useState<boolean>(false);
  const [revokedLocally, setRevokedLocally] = useState<boolean>(false);

  const purpose = qrConfig?.purpose || 'Insurance inspection';
  const vehicle = qrConfig?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const selectedRecords =
    qrConfig?.selectedRecords ||
    '21 Sep service · 15 May service · emissions report';
  const expiresIn = qrConfig?.expiresIn || '48 hours';
  const maxScans = qrConfig?.maxScans || '10';
  const requireViewerName = qrConfig?.requireViewerName ?? true;
  const requireOtp = qrConfig?.requireOtp ?? true;

  const protectionSummaryLabel =
    requireViewerName && requireOtp
      ? 'Viewer name + OTP'
      : requireViewerName
      ? 'Viewer name only'
      : requireOtp
      ? 'OTP only'
      : 'Standard access';

  const handleShareQr = async () => {
    try {
      await Share.share({
        message: `AutoCare 360 protected QR access\nPurpose: ${purpose}\nVehicle: ${vehicle}\nCode: ${LOCAL_QR_CODE}`,
      });
    } catch {
      // Safe no-op if native share sheet is dismissed or unavailable
    }
  };

  const handleSaveQr = () => {
    setSaveNotice(true);
  };

  const handleRevokeQr = () => {
    setRevokedLocally(true);
    setSaveNotice(false);
  };

  const accessDetailRows: Array<{ label: string; value: string }> = [
    { label: 'Purpose', value: purpose },
    { label: 'Vehicle', value: vehicle },
    { label: 'Records', value: selectedRecords },
    { label: 'Expires in', value: expiresIn },
    { label: 'Maximum scans', value: maxScans },
    { label: 'Viewer name', value: requireViewerName ? 'Required' : 'Optional' },
    { label: 'OTP verification', value: requireOtp ? 'Required' : 'Off' },
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
          accessibilityLabel="Back to Configure QR Access"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-5 · QR SHARING</Text>
          <Text style={styles.pageTitle}>QR ready</Text>
          <Text style={styles.pageSubtitle}>
            Your protected vehicle record QR code is ready to share.
          </Text>
        </View>

        {/* 3. SUCCESS CARD + QR VISUAL */}
        <View style={styles.qrHeroCard}>
          <View
            style={[
              styles.createdBadge,
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
                styles.createdBadgeText,
                revokedLocally ? styles.revokedBadgeText : null,
              ]}
            >
              {revokedLocally ? 'Revoked locally' : 'Protected QR created'}
            </Text>
          </View>

          <Text style={styles.heroPurpose}>{purpose}</Text>
          <Text style={styles.heroVehicle}>{vehicle}</Text>

          {/* Square Deterministic Local QR Visual */}
          <View
            style={[
              styles.qrFrame,
              revokedLocally ? styles.qrFrameRevoked : null,
            ]}
            accessible
            accessibilityLabel={`Decorative local QR preview for code ${LOCAL_QR_CODE}`}
          >
            <View style={styles.qrGrid}>
              {QR_PREVIEW_MATRIX.map((row, rowIdx) => (
                <View key={`row-${rowIdx}`} style={styles.qrRow}>
                  {row.map((cell, colIdx) => (
                    <View
                      key={`cell-${rowIdx}-${colIdx}`}
                      style={[
                        styles.qrCell,
                        cell === 1 ? styles.qrCellDark : styles.qrCellLight,
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.codePill}>
            <Ionicons name="qr-code-outline" size={14} color="#0056A2" />
            <Text style={styles.codePillText}>{LOCAL_QR_CODE}</Text>
          </View>

          <Text style={styles.qrHelper}>
            Scan to open protected vehicle records.
          </Text>
          <Text style={styles.qrPreviewDisclaimer}>
            Local visual preview only — server QR token not generated.
          </Text>
        </View>

        {/* 4. ACCESS DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-text-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access details</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {accessDetailRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. ACCESS STATUS CARD */}
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
              <Text style={styles.cardTitle}>Access status</Text>
            </View>

            <View style={styles.protectedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#15803d" />
              <Text style={styles.protectedBadgeText}>Protected</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text
                style={[
                  styles.detailValue,
                  revokedLocally ? styles.statusRevoked : styles.statusActive,
                ]}
              >
                {revokedLocally ? 'Revoked locally' : 'Active locally'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scans used:</Text>
              <Text style={styles.detailValue}>0 / {maxScans}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Protection:</Text>
              <Text style={styles.detailValue}>{protectionSummaryLabel}</Text>
            </View>
          </View>
        </View>

        {/* 6. ACTION BUTTONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareQr}
            activeOpacity={0.85}
          >
            <Ionicons name="share-outline" size={17} color="#ffffff" />
            <Text style={styles.shareButtonText}>Share QR</Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              style={styles.saveQrButton}
              onPress={handleSaveQr}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={16} color="#0056A2" />
              <Text style={styles.saveQrButtonText}>Save QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => onDonePress?.()}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          {saveNotice ? (
            <View style={styles.infoNoticeBox}>
              <Ionicons
                name="information-circle-outline"
                size={15}
                color="#0056A2"
              />
              <Text style={styles.infoNoticeText}>
                QR prepared locally — file export not configured.
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.revokeButton}
            onPress={handleRevokeQr}
            activeOpacity={0.8}
          >
            <Ionicons name="ban-outline" size={16} color="#dc2626" />
            <Text style={styles.revokeButtonText}>Revoke QR</Text>
          </TouchableOpacity>

          {revokedLocally ? (
            <View style={styles.revokedNoticeBox}>
              <Ionicons name="alert-circle" size={15} color="#b91c1c" />
              <Text style={styles.revokedNoticeText}>
                QR revoked locally — backend not updated.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 7. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
  qrHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#003566',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  createdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    marginBottom: 10,
  },
  revokedBadge: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  createdBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  revokedBadgeText: {
    color: '#dc2626',
  },
  heroPurpose: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
  },
  heroVehicle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrFrame: {
    padding: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0056A2',
    borderRadius: 16,
    marginBottom: 14,
  },
  qrFrameRevoked: {
    borderColor: '#fca5a5',
    opacity: 0.55,
  },
  qrGrid: {
    width: 156,
    height: 156,
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrCell: {
    flex: 1,
  },
  qrCellDark: {
    backgroundColor: '#0f172a',
  },
  qrCellLight: {
    backgroundColor: '#ffffff',
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
    marginBottom: 8,
  },
  codePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
    letterSpacing: 0.6,
  },
  qrHelper: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 4,
  },
  qrPreviewDisclaimer: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
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
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveQrButton: {
    flex: 1,
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
  saveQrButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  doneButton: {
    flex: 1,
    height: 46,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  infoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 7,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#004684',
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

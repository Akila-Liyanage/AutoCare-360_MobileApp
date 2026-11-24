import React from 'react';
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

export interface SecureSharingHubScreenProps {
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onActiveLinkPress?: () => void;
  onQrActivityPress?: () => void;
  onCreateLinkPress?: () => void;
  onCreateQrPress?: () => void;
  onManageAccessPress?: () => void;
  onProtectedSharingPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

interface RecentQrCodeItem {
  id: string;
  title: string;
  meta: string;
  tone: 'expired' | 'revoked';
}

const RECENT_QR_CODES: RecentQrCodeItem[] = [
  {
    id: 'qr-hist-1',
    title: 'Insurance inspection · Expired',
    meta: '19 Sep 2026 · 7 / 10 scans',
    tone: 'expired',
  },
  {
    id: 'qr-hist-2',
    title: 'Vehicle verification · Revoked',
    meta: '08 Sep 2026 · 2 / 5 scans',
    tone: 'revoked',
  },
];

export const SecureSharingHubScreen: React.FC<SecureSharingHubScreenProps> = ({
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onActiveLinkPress,
  onQrActivityPress,
  onCreateLinkPress,
  onCreateQrPress,
  onManageAccessPress,
  onProtectedSharingPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
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
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-5 · SECURE DATA SHARING</Text>
          <Text style={styles.pageTitle}>Secure sharing</Text>
          <Text style={styles.pageSubtitle}>
            Control who sees your verified vehicle history.
          </Text>
        </View>

        {/* 3. ACTIVE SECURE LINK CARD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onActiveLinkPress?.()}
          activeOpacity={0.82}
          accessibilityLabel="Active secure link"
        >
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="link-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Active secure link</Text>
            </View>

            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeBadgeText}>Secure · Active</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.linkBodyRow}>
            <View style={styles.linkTextCol}>
              <Text style={styles.itemTitle}>Toyota Aqua verified history</Text>

              <View style={styles.linkUrlPill}>
                <Ionicons name="lock-closed" size={12} color="#0056A2" />
                <Text style={styles.linkUrlText}>autocare.lk/s/AC9-K7Q-26</Text>
              </View>

              <View style={styles.metaLine}>
                <Ionicons name="person-outline" size={13} color="#64748b" />
                <Text style={styles.metaText}>
                  N. Fernando · Ceylinco Insurance
                </Text>
              </View>

              <View style={styles.metaLine}>
                <Ionicons name="time-outline" size={13} color="#64748b" />
                <Text style={styles.metaText}>
                  Expires 24 Sep 2026 · 6:00 PM
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94a3b8"
              style={styles.rowChevron}
            />
          </View>
        </TouchableOpacity>

        {/* 4. QR ACTIVITY CARD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onQrActivityPress?.()}
          activeOpacity={0.82}
          accessibilityLabel="QR activity"
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="qr-code-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>QR activity</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.linkBodyRow}>
            <View style={styles.linkTextCol}>
              <Text style={styles.itemTitle}>Insurance inspection</Text>
              <Text style={styles.qrSpecsText}>
                WP ABC-1234 · 10 scans allowed · 48 hours
              </Text>

              <View style={styles.helperStrip}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#0056A2"
                />
                <Text style={styles.helperStripText}>
                  Viewer name + OTP required on every visit.
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94a3b8"
              style={styles.rowChevron}
            />
          </View>
        </TouchableOpacity>

        {/* 5. RECENT QR CODES CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Recent QR codes</Text>
          </View>

          <View style={styles.divider} />

          {RECENT_QR_CODES.map((item, idx) => {
            const isExpired = item.tone === 'expired';
            return (
              <View key={item.id}>
                <View style={styles.recentQrRow}>
                  <View
                    style={[
                      styles.recentStatusIconBox,
                      isExpired
                        ? styles.recentIconExpiredBg
                        : styles.recentIconRevokedBg,
                    ]}
                  >
                    <Ionicons
                      name={isExpired ? 'time-outline' : 'close-circle-outline'}
                      size={17}
                      color={isExpired ? '#b45309' : '#dc2626'}
                    />
                  </View>

                  <View style={styles.recentQrTextCol}>
                    <Text style={styles.recentQrTitle}>{item.title}</Text>
                    <Text style={styles.recentQrMeta}>{item.meta}</Text>
                  </View>
                </View>

                {idx < RECENT_QR_CODES.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 5B. ACCESS PERMISSIONS ENTRY CARD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onManageAccessPress?.()}
          activeOpacity={0.82}
          accessibilityLabel="Manage access permissions"
        >
          <View style={styles.linkBodyRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="key-outline" size={17} color="#0056A2" />
            </View>
            <View style={styles.linkTextCol}>
              <Text style={styles.cardTitle}>Manage access permissions</Text>
              <Text style={styles.recentQrMeta}>
                Configure view-only or review access per recipient.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94a3b8"
              style={styles.rowChevron}
            />
          </View>
        </TouchableOpacity>

        {/* 5C. PROTECTED DATA SHARING ENTRY CARD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onProtectedSharingPress?.()}
          activeOpacity={0.82}
          accessibilityLabel="Protected data sharing"
        >
          <View style={styles.linkBodyRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <View style={styles.linkTextCol}>
              <Text style={styles.cardTitle}>Protected data sharing</Text>
              <Text style={styles.recentQrMeta}>
                Set up controlled viewing for selected vehicle records.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94a3b8"
              style={styles.rowChevron}
            />
          </View>
        </TouchableOpacity>

        {/* 6. PRIMARY ACTIONS */}
        <View style={styles.primaryActionsRow}>
          <TouchableOpacity
            style={styles.createLinkButton}
            onPress={() => onCreateLinkPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="link-outline" size={17} color="#ffffff" />
            <Text style={styles.createLinkButtonText}>Create link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createQrButton}
            onPress={() => onCreateQrPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={17} color="#0056A2" />
            <Text style={styles.createQrButtonText}>Create QR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 7. SECONDARY OWNER SUBMODULE BOTTOM NAV (HOME / VEHICLES / SHARING / HEALTH) */}
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
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 5,
    flexShrink: 0,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 11,
  },
  linkBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkTextCol: {
    flex: 1,
    minWidth: 0,
  },
  rowChevron: {
    flexShrink: 0,
  },
  itemTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 7,
  },
  linkUrlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 5,
    marginBottom: 9,
    maxWidth: '100%',
  },
  linkUrlText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056A2',
    flexShrink: 1,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
    flexShrink: 1,
  },
  qrSpecsText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 9,
  },
  helperStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 6,
  },
  helperStripText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
    color: '#475569',
  },
  recentQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  recentStatusIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recentIconExpiredBg: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  recentIconRevokedBg: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  recentQrTextCol: {
    flex: 1,
    minWidth: 0,
  },
  recentQrTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  recentQrMeta: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  primaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
    marginBottom: 4,
  },
  createLinkButton: {
    flex: 1,
    height: 46,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  createLinkButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  createQrButton: {
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
  createQrButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
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

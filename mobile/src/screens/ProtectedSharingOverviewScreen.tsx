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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export interface ProtectedSharingOverviewScreenProps {
  onBackPress?: () => void;
  onSetupProtectedViewingPress?: () => void;
  onActiveProtectedAccessPress?: () => void;
  onViewSharingHubPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

interface ProtectionSummaryRow {
  label: string;
  value: string;
  tone: 'default' | 'green' | 'blue';
}

interface ProtectionControlItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const CURRENT_PROTECTION_ROWS: ProtectionSummaryRow[] = [
  {
    label: 'Vehicle',
    value: 'WP ABC-1234 · Toyota Aqua',
    tone: 'default',
  },
  {
    label: 'Viewer identity',
    value: 'Required',
    tone: 'green',
  },
  {
    label: 'OTP verification',
    value: 'Required',
    tone: 'green',
  },
  {
    label: 'Downloads',
    value: 'Blocked',
    tone: 'blue',
  },
  {
    label: 'Access duration',
    value: '48 hours',
    tone: 'blue',
  },
];

const PROTECTION_CONTROLS: ProtectionControlItem[] = [
  {
    id: 'selective-visibility',
    icon: 'eye-outline',
    title: 'Selective visibility',
    description: 'Only approved record categories are shown.',
  },
  {
    id: 'viewer-verification',
    icon: 'person-circle-outline',
    title: 'Viewer verification',
    description: 'Require viewer identity before access.',
  },
  {
    id: 'time-limited-access',
    icon: 'time-outline',
    title: 'Time-limited access',
    description: 'Access can expire automatically.',
  },
  {
    id: 'download-protection',
    icon: 'lock-closed-outline',
    title: 'Download protection',
    description: 'Keep documents inside the protected viewer.',
  },
];

export const ProtectedSharingOverviewScreen: React.FC<
  ProtectedSharingOverviewScreenProps
> = ({
  onBackPress,
  onSetupProtectedViewingPress,
  onActiveProtectedAccessPress,
  onViewSharingHubPress,
  onNotificationsPress,
  onMenuPress,
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
          accessibilityLabel="Back to Secure Sharing Hub"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-7 · PROTECTED VIEWING</Text>
          <Text style={styles.pageTitle}>Protected data sharing</Text>
          <Text style={styles.pageSubtitle}>
            Control how selected vehicle records can be viewed outside your
            account.
          </Text>
        </View>

        {/* 3. PROTECTION HERO CARD */}
        <LinearGradient
          colors={['#002B54', '#00427D', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#bae6fd" />
              <Text style={styles.heroBadgeText}>Protected viewing</Text>
            </View>

            <View style={styles.heroIconCircle}>
              <Ionicons name="lock-closed" size={18} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Share records without exposing your full vehicle history
          </Text>
          <Text style={styles.heroDescription}>
            Choose what a recipient can see, how long access lasts, and which
            protection checks apply.
          </Text>
        </LinearGradient>

        {/* 4. CURRENT PROTECTION SUMMARY CARD */}
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
              <Text style={styles.cardTitle}>Current protection</Text>
            </View>

            <View style={styles.protectedPill}>
              <View style={styles.protectedDot} />
              <Text style={styles.protectedPillText}>Protected</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {CURRENT_PROTECTION_ROWS.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                {row.tone === 'green' ? (
                  <View style={styles.greenStatusChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#15803d"
                    />
                    <Text style={styles.greenStatusText}>{row.value}</Text>
                  </View>
                ) : row.tone === 'blue' ? (
                  <View style={styles.blueStatusChip}>
                    <Text style={styles.blueStatusText}>{row.value}</Text>
                  </View>
                ) : (
                  <Text style={styles.detailValue}>{row.value}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 5. PROTECTION CONTROLS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="options-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Protection controls</Text>
          </View>

          <View style={styles.divider} />

          {PROTECTION_CONTROLS.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.controlRow}>
                <View style={styles.controlIconBox}>
                  <Ionicons name={item.icon} size={17} color="#0056A2" />
                </View>

                <View style={styles.controlTextCol}>
                  <Text style={styles.controlTitle}>{item.title}</Text>
                  <Text style={styles.controlDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>

              {idx < PROTECTION_CONTROLS.length - 1 ? (
                <View style={styles.rowDivider} />
              ) : null}
            </View>
          ))}
        </View>

        {/* 6. ACTIVE PROTECTED ACCESS CARD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onActiveProtectedAccessPress?.()}
          activeOpacity={0.82}
          accessibilityLabel="Active protected access"
        >
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBoxSuccess}>
                <Ionicons name="lock-closed-outline" size={17} color="#15803d" />
              </View>
              <Text style={styles.cardTitle}>Active protected access</Text>
            </View>

            <View style={styles.activeLocalBadge}>
              <View style={styles.protectedDot} />
              <Text style={styles.activeLocalBadgeText}>
                Protected · Active locally
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.activeBodyRow}>
            <View style={styles.activeTextCol}>
              <Text style={styles.activeItemTitle}>Insurance inspection</Text>
              <Text style={styles.activeVehicleText}>
                WP ABC-1234 · Toyota Aqua
              </Text>

              <View style={styles.activeMetaGroup}>
                <View style={styles.metaLine}>
                  <Text style={styles.metaPrefix}>Recipient:</Text>
                  <Text style={styles.metaValue}>
                    N. Fernando · Ceylinco Insurance
                  </Text>
                </View>

                <View style={styles.metaLine}>
                  <Text style={styles.metaPrefix}>Status:</Text>
                  <Text style={styles.metaValueSuccess}>
                    Protected · Active locally
                  </Text>
                </View>

                <View style={styles.metaLine}>
                  <Text style={styles.metaPrefix}>Expiry:</Text>
                  <Text style={styles.metaValue}>48 hours</Text>
                </View>
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

        {/* 7. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onSetupProtectedViewingPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={styles.primaryButtonText}>
              Set up protected viewing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              onViewSharingHubPress
                ? onViewSharingHubPress()
                : onSharingPress?.()
            }
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>View sharing hub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 8. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
  heroCard: {
    borderRadius: 16,
    padding: 18,
    gap: 10,
    shadowColor: '#002B54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(186, 230, 253, 0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#e0f2fe',
  },
  heroIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#dbeafe',
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
  protectedPill: {
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
  protectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  protectedPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  detailsList: {
    gap: 10,
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
  greenStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  greenStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  blueStatusChip: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  blueStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056A2',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    paddingVertical: 4,
  },
  controlIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  controlTextCol: {
    flex: 1,
    gap: 2,
  },
  controlTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  controlDescription: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 9,
  },
  activeLocalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeLocalBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  activeBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeTextCol: {
    flex: 1,
    gap: 3,
  },
  activeItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  activeVehicleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
    marginBottom: 4,
  },
  activeMetaGroup: {
    gap: 4,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  metaPrefix: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  metaValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  metaValueSuccess: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803d',
  },
  rowChevron: {
    marginLeft: 4,
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

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
import { VehicleItem } from './VehiclesScreen';

export interface MaintenanceForecastScreenProps {
  selectedVehicle?: VehicleItem | null;
  onBackPress?: () => void;
  onHealthPassportPress?: () => void;
  onHealthMetricsPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type ForecastPriority = 'Medium' | 'Routine' | 'Low';

interface ForecastItem {
  id: string;
  title: string;
  priority: ForecastPriority;
  recommended: string;
  reason: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface TimelineEntry {
  id: string;
  milestone: string;
  items: string[];
  tone: 'now' | 'amber' | 'blue' | 'green';
}

const UPCOMING_ITEMS: ForecastItem[] = [
  {
    id: 'fc-battery',
    title: 'Battery inspection',
    priority: 'Medium',
    recommended: 'Within 1,500 km',
    reason: 'Battery health is lower than other monitored areas.',
    icon: 'battery-half-outline',
  },
  {
    id: 'fc-brakes',
    title: 'Brake inspection',
    priority: 'Medium',
    recommended: 'At next scheduled service',
    reason: 'Brake health should continue to be monitored.',
    icon: 'disc-outline',
  },
  {
    id: 'fc-oil',
    title: 'Engine oil & filter',
    priority: 'Routine',
    recommended: 'At 90,000 km',
    reason: 'Scheduled periodic maintenance.',
    icon: 'water-outline',
  },
  {
    id: 'fc-tyres',
    title: 'Tyre inspection',
    priority: 'Low',
    recommended: 'Within 4,000–5,000 km',
    reason: 'Routine wear and alignment check.',
    icon: 'ellipse-outline',
  },
];

const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'tl-now',
    milestone: 'Now',
    items: ['85,240 km'],
    tone: 'now',
  },
  {
    id: 'tl-1500',
    milestone: '+1,500 km',
    items: ['Battery inspection'],
    tone: 'amber',
  },
  {
    id: 'tl-90000',
    milestone: '90,000 km',
    items: ['Engine oil & filter', 'Brake inspection'],
    tone: 'blue',
  },
  {
    id: 'tl-5000',
    milestone: '+5,000 km',
    items: ['Tyre inspection'],
    tone: 'green',
  },
];

const FORECAST_BASIS_FACTORS: string[] = [
  'Current odometer',
  'Recent service history',
  'Sample health metrics',
  'Maintenance interval',
  'Condition trend',
];

function getPriorityPalette(priority: ForecastPriority) {
  if (priority === 'Medium') {
    return {
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
      iconBg: '#fef3c7',
    };
  }
  if (priority === 'Routine') {
    return {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#0056A2',
      iconBg: '#e6f0f9',
    };
  }
  return {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#15803d',
    iconBg: '#dcfce7',
  };
}

function getTimelineDotColor(tone: TimelineEntry['tone']): string {
  switch (tone) {
    case 'now':
      return '#0f172a';
    case 'amber':
      return '#d97706';
    case 'blue':
      return '#0056A2';
    case 'green':
      return '#16a34a';
  }
}

export const MaintenanceForecastScreen: React.FC<
  MaintenanceForecastScreenProps
> = ({
  selectedVehicle,
  onBackPress,
  onHealthPassportPress,
  onHealthMetricsPress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const registration = selectedVehicle?.registration || 'WP ABC-1234';
  const vehicleModel = selectedVehicle?.name || 'Toyota Aqua';
  const currentOdometer = selectedVehicle?.mileage || '85,240 km';

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
          <Text style={styles.eyebrow}>BR-9 · AI VEHICLE HEALTH</Text>
          <Text style={styles.pageTitle}>Maintenance forecast</Text>
          <Text style={styles.pageSubtitle}>
            Preview upcoming maintenance needs based on sample vehicle condition
            data.
          </Text>
        </View>

        {/* 3. VEHICLE CONTEXT CARD */}
        <View style={styles.card}>
          <View style={styles.contextTopRow}>
            <View style={styles.contextVehicleGroup}>
              <View style={styles.vehicleIconBox}>
                <Ionicons name="car-sport-outline" size={20} color="#0056A2" />
              </View>
              <View style={styles.contextTextCol}>
                <Text style={styles.contextReg}>{registration}</Text>
                <Text style={styles.contextModel}>{vehicleModel}</Text>
              </View>
            </View>

            <View style={styles.samplePill}>
              <Text style={styles.samplePillText}>Sample forecast</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contextGrid}>
            <View style={styles.contextGridRow}>
              <View style={styles.contextMetaItem}>
                <Text style={styles.contextMetaLabel}>Current odometer</Text>
                <Text style={styles.contextMetaValue}>{currentOdometer}</Text>
              </View>
              <View style={styles.contextMetaItem}>
                <Text style={styles.contextMetaLabel}>Overall health</Text>
                <Text style={styles.contextMetaValueBlue}>86 / 100</Text>
              </View>
            </View>

            <View style={styles.contextGridRow}>
              <View style={styles.contextMetaItem}>
                <Text style={styles.contextMetaLabel}>Status</Text>
                <Text style={styles.contextMetaValueGreen}>Good condition</Text>
              </View>
              <View style={styles.contextMetaItem}>
                <Text style={styles.contextMetaLabel}>Last updated</Text>
                <Text style={styles.contextMetaValue}>23 Sep 2026</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. NEXT MAINTENANCE HERO CARD */}
        <LinearGradient
          colors={['#002B54', '#00427D', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleGroup}>
              <Ionicons name="calendar-outline" size={16} color="#bae6fd" />
              <Text style={styles.heroEyebrow}>Next recommended service</Text>
            </View>

            <View style={styles.heroPriorityBadge}>
              <View style={styles.heroPriorityDot} />
              <Text style={styles.heroPriorityText}>Priority: Medium</Text>
            </View>
          </View>

          <Text style={styles.heroMileage}>90,000 km</Text>

          <View style={styles.heroStatsBox}>
            <View style={styles.heroStatRow}>
              <Text style={styles.heroStatLabel}>Estimated remaining</Text>
              <Text style={styles.heroStatValue}>4,760 km</Text>
            </View>
            <View style={styles.heroStatRow}>
              <Text style={styles.heroStatLabel}>Estimated timing</Text>
              <Text style={styles.heroStatValue}>Approx. 2–3 months</Text>
            </View>
            <View style={styles.heroStatRow}>
              <Text style={styles.heroStatLabel}>Priority</Text>
              <Text style={styles.heroStatAmber}>Medium</Text>
            </View>
          </View>

          <View style={styles.heroProgressWrap}>
            <View style={styles.heroProgressTrack}>
              <View style={[styles.heroProgressFill, { width: '76%' }]} />
            </View>
            <Text style={styles.heroProgressNote}>
              Local demonstration estimate based on sample odometer interval.
            </Text>
          </View>
        </LinearGradient>

        {/* 5. UPCOMING MAINTENANCE ITEMS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="build-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Upcoming maintenance</Text>
          </View>

          <View style={styles.divider} />

          {UPCOMING_ITEMS.map((item, idx) => {
            const palette = getPriorityPalette(item.priority);
            return (
              <View key={item.id}>
                <View style={styles.forecastItemBlock}>
                  <View style={styles.forecastItemTopRow}>
                    <View style={styles.forecastTitleRow}>
                      <View
                        style={[
                          styles.itemIconBox,
                          { backgroundColor: palette.iconBg },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={16}
                          color={palette.text}
                        />
                      </View>
                      <Text style={styles.forecastItemTitle}>{item.title}</Text>
                    </View>

                    <View
                      style={[
                        styles.priorityChip,
                        {
                          backgroundColor: palette.bg,
                          borderColor: palette.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityChipText,
                          { color: palette.text },
                        ]}
                      >
                        {item.priority}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recommendedRow}>
                    <Ionicons name="time-outline" size={13} color="#0056A2" />
                    <Text style={styles.recommendedText}>
                      Recommended: {item.recommended}
                    </Text>
                  </View>

                  <Text style={styles.reasonText}>{item.reason}</Text>
                </View>

                {idx < UPCOMING_ITEMS.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 6. MAINTENANCE TIMELINE CARD (PURE RN VIEWS) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="git-commit-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Maintenance timeline</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.timelineContainer}>
            {TIMELINE_ENTRIES.map((entry, idx) => {
              const isLast = idx === TIMELINE_ENTRIES.length - 1;
              const dotColor = getTimelineDotColor(entry.tone);
              return (
                <View key={entry.id} style={styles.timelineRow}>
                  <View style={styles.timelineRailCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        { backgroundColor: dotColor },
                      ]}
                    />
                    {!isLast ? <View style={styles.timelineLine} /> : null}
                  </View>

                  <View
                    style={[
                      styles.timelineContentBox,
                      isLast ? styles.timelineContentBoxLast : null,
                    ]}
                  >
                    <Text
                      style={[styles.timelineMilestone, { color: dotColor }]}
                    >
                      {entry.milestone}
                    </Text>
                    {entry.items.map((line) => (
                      <Text key={line} style={styles.timelineItemText}>
                        {line}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 7. PRIORITY SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="stats-chart-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Priority summary</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.prioritySummaryRow}>
            <View style={styles.prioritySummaryBox}>
              <Text style={styles.prioritySummaryCount}>0</Text>
              <View style={styles.chipHigh}>
                <Text style={styles.chipHighText}>High</Text>
              </View>
            </View>

            <View
              style={[
                styles.prioritySummaryBox,
                styles.prioritySummaryBoxAmber,
              ]}
            >
              <Text style={styles.prioritySummaryCountAmber}>2</Text>
              <View style={styles.chipMedium}>
                <Text style={styles.chipMediumText}>Medium</Text>
              </View>
            </View>

            <View
              style={[
                styles.prioritySummaryBox,
                styles.prioritySummaryBoxBlue,
              ]}
            >
              <Text style={styles.prioritySummaryCountBlue}>2</Text>
              <View style={styles.chipLow}>
                <Text style={styles.chipLowText}>Routine / Low</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 8. FORECAST INSIGHT CARD */}
        <View style={styles.insightCard}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.insightIconBox}>
                <Ionicons name="sparkles-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Forecast insight</Text>
            </View>

            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>
                Sample forecast insight
              </Text>
            </View>
          </View>

          <View style={styles.insightDivider} />

          <Text style={styles.insightBodyText}>
            Battery condition and brake wear are the main areas to monitor
            before the next scheduled service. Routine engine oil and tyre
            checks remain on the normal maintenance cycle.
          </Text>
        </View>

        {/* 9. FORECAST BASIS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="information-circle-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>Forecast basis</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.basisList}>
            {FORECAST_BASIS_FACTORS.map((factor) => (
              <View key={factor} style={styles.basisItem}>
                <Ionicons name="checkmark-circle" size={14} color="#0056A2" />
                <Text style={styles.basisItemText}>{factor}</Text>
              </View>
            ))}
          </View>

          <View style={styles.basisNoticeBox}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#475569"
            />
            <Text style={styles.basisNoticeText}>
              This screen uses local demonstration data only and is not a live
              diagnostic recommendation.
            </Text>
          </View>
        </View>

        {/* 10. ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onHealthPassportPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="pulse-outline" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              Back to health passport
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onHealthMetricsPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="analytics-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>View health metrics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 11. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (HEALTH ACTIVE) */}
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
          <Ionicons name="share-social-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Sharing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onHealthPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Health"
        >
          <Ionicons name="pulse" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Health</Text>
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
  contextTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  contextVehicleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  vehicleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextTextCol: {
    gap: 1,
  },
  contextReg: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  contextModel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  samplePill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  samplePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  contextGrid: {
    gap: 10,
  },
  contextGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contextMetaItem: {
    flex: 1,
    gap: 2,
  },
  contextMetaLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  contextMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  contextMetaValueBlue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
  },
  contextMetaValueGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  heroCard: {
    borderRadius: 18,
    padding: 17,
    gap: 12,
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
    flexWrap: 'wrap',
  },
  heroTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dbeafe',
  },
  heroPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fef3c7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroPriorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d97706',
  },
  heroPriorityText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#b45309',
  },
  heroMileage: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroStatsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 7,
  },
  heroStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  heroStatLabel: {
    fontSize: 12.5,
    color: '#bfdbfe',
    fontWeight: '500',
  },
  heroStatValue: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  heroStatAmber: {
    fontSize: 13,
    color: '#fde68a',
    fontWeight: '800',
  },
  heroProgressWrap: {
    gap: 6,
  },
  heroProgressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#fbbf24',
  },
  heroProgressNote: {
    fontSize: 11.5,
    color: '#dbeafe',
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  forecastItemBlock: {
    gap: 7,
  },
  forecastItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  forecastTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  itemIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forecastItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  priorityChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  priorityChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recommendedText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  reasonText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  timelineContainer: {
    paddingLeft: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineRailCol: {
    width: 16,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  timelineContentBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 3,
  },
  timelineContentBoxLast: {
    marginBottom: 0,
  },
  timelineMilestone: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  timelineItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  prioritySummaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prioritySummaryBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  prioritySummaryBoxAmber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  prioritySummaryBoxBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  prioritySummaryCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#334155',
  },
  prioritySummaryCountAmber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#b45309',
  },
  prioritySummaryCountBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0056A2',
  },
  chipHigh: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipHighText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  chipMedium: {
    backgroundColor: '#fef3c7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipMediumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  chipLow: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipLowText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  insightCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  insightIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBadge: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  insightBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0056A2',
  },
  insightDivider: {
    height: 1,
    backgroundColor: '#dbeafe',
    marginVertical: 11,
  },
  insightBodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1e293b',
    fontWeight: '500',
  },
  basisList: {
    gap: 8,
    marginBottom: 12,
  },
  basisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  basisItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  basisNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
  },
  basisNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17.5,
    color: '#475569',
    fontWeight: '500',
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

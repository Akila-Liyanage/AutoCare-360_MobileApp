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

export interface HealthMetricsScreenProps {
  selectedVehicle?: VehicleItem | null;
  onBackPress?: () => void;
  onMaintenanceForecastPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type MetricStatus = 'Good' | 'Monitor' | 'Attention soon';

interface CoreHealthMetric {
  id: string;
  title: string;
  score: number;
  status: MetricStatus;
  insight: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface AdditionalHealthMetric {
  id: string;
  title: string;
  score: number;
  status: 'Good';
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface MonitorItem {
  id: string;
  title: string;
  priority: string;
  guidance: string;
}

const CORE_HEALTH_METRICS: CoreHealthMetric[] = [
  {
    id: 'engine',
    title: 'Engine health',
    score: 92,
    status: 'Good',
    insight: 'Engine condition remains stable after the latest periodic service.',
    icon: 'speedometer-outline',
  },
  {
    id: 'brakes',
    title: 'Brake health',
    score: 84,
    status: 'Monitor',
    insight:
      'Brake wear is acceptable but should be reviewed at the next service.',
    icon: 'disc-outline',
  },
  {
    id: 'battery',
    title: 'Battery health',
    score: 78,
    status: 'Attention soon',
    insight: 'Battery condition is trending lower than other monitored areas.',
    icon: 'battery-half-outline',
  },
  {
    id: 'tyres',
    title: 'Tyre health',
    score: 88,
    status: 'Good',
    insight: 'Tyre condition is within the current sample target range.',
    icon: 'ellipse-outline',
  },
];

const ADDITIONAL_METRICS: AdditionalHealthMetric[] = [
  {
    id: 'fluids',
    title: 'Fluids',
    score: 90,
    status: 'Good',
    icon: 'water-outline',
  },
  {
    id: 'emissions',
    title: 'Emissions',
    score: 95,
    status: 'Good',
    icon: 'leaf-outline',
  },
  {
    id: 'service-compliance',
    title: 'Service compliance',
    score: 93,
    status: 'Good',
    icon: 'checkmark-done-outline',
  },
];

const ITEMS_TO_MONITOR: MonitorItem[] = [
  {
    id: 'mon-battery',
    title: 'Battery',
    priority: 'Priority: Medium',
    guidance: 'Review within next service interval.',
  },
  {
    id: 'mon-brakes',
    title: 'Brakes',
    priority: 'Priority: Medium',
    guidance: 'Continue monitoring wear indicators.',
  },
];

const TREND_POINTS: Array<{ label: string; score: number; current?: boolean }> =
  [
    { label: 'Previous', score: 82 },
    { label: 'Current', score: 86, current: true },
  ];

function getStatusPalette(status: MetricStatus) {
  if (status === 'Good') {
    return {
      bar: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
      iconBg: '#dcfce7',
    };
  }
  if (status === 'Monitor') {
    return {
      bar: '#0056A2',
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#0056A2',
      iconBg: '#e6f0f9',
    };
  }
  return {
    bar: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
    iconBg: '#fef3c7',
  };
}

export const HealthMetricsScreen: React.FC<HealthMetricsScreenProps> = ({
  selectedVehicle,
  onBackPress,
  onMaintenanceForecastPress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const registration = selectedVehicle?.registration || 'WP ABC-1234';
  const vehicleModel = selectedVehicle?.name || 'Toyota Aqua';

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
          accessibilityLabel="Back to AI Health Passport"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-9 · AI VEHICLE HEALTH</Text>
          <Text style={styles.pageTitle}>Health metrics</Text>
          <Text style={styles.pageSubtitle}>
            Detailed condition indicators for your selected vehicle.
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
              <Text style={styles.samplePillText}>Sample health assessment</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contextMetaGrid}>
            <View style={styles.contextMetaItem}>
              <Text style={styles.contextMetaLabel}>Overall health</Text>
              <Text style={styles.contextMetaValueBlue}>86 / 100</Text>
            </View>
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

        {/* 4. PROMINENT OVERALL HEALTH SCORE SECTION (PURE RN VISUAL) */}
        <LinearGradient
          colors={['#002B54', '#00427D', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overallScoreCard}
        >
          <View style={styles.overallScoreTopRow}>
            <View style={styles.overallRingOuter}>
              <View style={styles.overallRingInner}>
                <Text style={styles.overallRingNumber}>86</Text>
                <Text style={styles.overallRingMax}>/100</Text>
              </View>
            </View>

            <View style={styles.overallScoreInfo}>
              <View style={styles.overallStatusBadge}>
                <View style={styles.overallStatusDot} />
                <Text style={styles.overallStatusText}>Good</Text>
              </View>
              <Text style={styles.overallTitle}>Overall health</Text>
              <Text style={styles.overallScoreFraction}>86 / 100</Text>
              <Text style={styles.overallSub}>
                Combined preview score across key vehicle systems.
              </Text>
            </View>
          </View>

          <View style={styles.overallMeterWrap}>
            <View style={styles.overallMeterTrack}>
              <View style={[styles.overallMeterFill, { width: '86%' }]} />
            </View>
            <View style={styles.overallMeterLabels}>
              <Text style={styles.overallMeterScale}>0</Text>
              <Text style={styles.overallMeterScale}>50</Text>
              <Text style={styles.overallMeterScale}>100</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 5. CORE HEALTH METRICS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="pulse-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Core health metrics</Text>
          </View>

          <View style={styles.divider} />

          {CORE_HEALTH_METRICS.map((metric, idx) => {
            const palette = getStatusPalette(metric.status);
            return (
              <View key={metric.id}>
                <View style={styles.coreMetricBlock}>
                  <View style={styles.coreMetricHeader}>
                    <View style={styles.coreMetricTitleRow}>
                      <View
                        style={[
                          styles.metricIconBox,
                          { backgroundColor: palette.iconBg },
                        ]}
                      >
                        <Ionicons
                          name={metric.icon}
                          size={16}
                          color={palette.text}
                        />
                      </View>
                      <Text style={styles.coreMetricTitle}>{metric.title}</Text>
                    </View>

                    <View style={styles.coreMetricScoreGroup}>
                      <Text style={styles.coreMetricScore}>
                        {metric.score}%
                      </Text>
                      <View
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: palette.bg,
                            borderColor: palette.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusChipText,
                            { color: palette.text },
                          ]}
                        >
                          {metric.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${metric.score}%`,
                          backgroundColor: palette.bar,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.metricInsight}>{metric.insight}</Text>
                </View>

                {idx < CORE_HEALTH_METRICS.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 6. ADDITIONAL METRICS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="layers-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Additional indicators</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.additionalList}>
            {ADDITIONAL_METRICS.map((item) => {
              const palette = getStatusPalette(item.status);
              return (
                <View key={item.id} style={styles.additionalItem}>
                  <View style={styles.additionalTopRow}>
                    <View style={styles.additionalLabelRow}>
                      <Ionicons name={item.icon} size={15} color="#334155" />
                      <Text style={styles.additionalTitle}>{item.title}</Text>
                    </View>

                    <View style={styles.coreMetricScoreGroup}>
                      <Text style={styles.additionalScore}>{item.score}%</Text>
                      <View
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: palette.bg,
                            borderColor: palette.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusChipText,
                            { color: palette.text },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${item.score}%`,
                          backgroundColor: palette.bar,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 7. CONDITION TREND CARD (LIGHTWEIGHT PURE RN VISUAL) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="trending-up-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Condition trend</Text>
            </View>

            <View style={styles.subtleBadge}>
              <Text style={styles.subtleBadgeText}>Sample trend</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.trendStatsRow}>
            <View style={styles.trendStatBox}>
              <Text style={styles.trendStatLabel}>Previous assessment</Text>
              <Text style={styles.trendStatValue}>82</Text>
            </View>

            <View style={styles.trendStatBox}>
              <Text style={styles.trendStatLabel}>Current assessment</Text>
              <Text style={styles.trendStatValueBlue}>86</Text>
            </View>

            <View style={[styles.trendStatBox, styles.trendDeltaBox]}>
              <Text style={styles.trendStatLabel}>Trend</Text>
              <Text style={styles.trendDeltaValue}>+4</Text>
            </View>
          </View>

          <View style={styles.trendBarsContainer}>
            {TREND_POINTS.map((point) => (
              <View key={point.label} style={styles.trendBarRow}>
                <Text style={styles.trendBarLabel}>{point.label}</Text>
                <View style={styles.trendBarTrack}>
                  <View
                    style={[
                      styles.trendBarFill,
                      {
                        width: `${point.score}%`,
                        backgroundColor: point.current ? '#16a34a' : '#94a3b8',
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.trendBarScore,
                    point.current ? styles.trendBarScoreCurrent : null,
                  ]}
                >
                  {point.score}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 8. ITEMS TO MONITOR CARD */}
        <View style={styles.monitorCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.monitorIconBox}>
              <Ionicons name="alert-circle-outline" size={17} color="#b45309" />
            </View>
            <Text style={styles.cardTitle}>Items to monitor</Text>
          </View>

          <View style={styles.monitorDivider} />

          {ITEMS_TO_MONITOR.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.monitorRow}>
                <View style={styles.monitorRowTop}>
                  <Text style={styles.monitorItemTitle}>{item.title}</Text>
                  <View style={styles.amberPriorityPill}>
                    <Text style={styles.amberPriorityText}>
                      {item.priority}
                    </Text>
                  </View>
                </View>
                <Text style={styles.monitorItemGuidance}>{item.guidance}</Text>
              </View>

              {idx < ITEMS_TO_MONITOR.length - 1 ? (
                <View style={styles.monitorDivider} />
              ) : null}
            </View>
          ))}
        </View>

        {/* 9. HOW THIS SCORE IS CALCULATED CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>How this score is calculated</Text>
            </View>

            <View style={styles.subtleBadge}>
              <Text style={styles.subtleBadgeText}>Demo calculation</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.explanationText}>
            This frontend preview combines sample condition indicators for
            engine, brakes, battery, tyres, service history, and maintenance
            status.
          </Text>
        </View>

        {/* 10. ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onMaintenanceForecastPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar-outline" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              View maintenance forecast
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onBackPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>
              Back to health passport
            </Text>
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
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  contextMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  contextMetaItem: {
    flex: 1,
    gap: 2,
  },
  contextMetaLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  contextMetaValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  contextMetaValueBlue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0056A2',
  },
  contextMetaValueGreen: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803d',
  },
  overallScoreCard: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: '#002B54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  overallScoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  overallRingOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: '#4ade80',
    borderRightColor: '#38bdf8',
    backgroundColor: 'rgba(0, 43, 84, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallRingNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 28,
  },
  overallRingMax: {
    fontSize: 11,
    fontWeight: '700',
    color: '#bae6fd',
  },
  overallScoreInfo: {
    flex: 1,
    gap: 3,
  },
  overallStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 2,
  },
  overallStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  overallStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  overallTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dbeafe',
  },
  overallScoreFraction: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  overallSub: {
    fontSize: 12,
    color: '#bfdbfe',
    lineHeight: 16.5,
  },
  overallMeterWrap: {
    gap: 5,
  },
  overallMeterTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  overallMeterFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ade80',
  },
  overallMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overallMeterScale: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#bae6fd',
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
  coreMetricBlock: {
    gap: 8,
  },
  coreMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  coreMetricTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  metricIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreMetricTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  coreMetricScoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  coreMetricScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  metricInsight: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  additionalList: {
    gap: 12,
  },
  additionalItem: {
    gap: 6,
  },
  additionalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  additionalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  additionalTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  additionalScore: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtleBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  subtleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  trendStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  trendStatBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 3,
  },
  trendDeltaBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  trendStatLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  trendStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334155',
  },
  trendStatValueBlue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0056A2',
  },
  trendDeltaValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15803d',
  },
  trendBarsContainer: {
    gap: 9,
  },
  trendBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trendBarLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  trendBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  trendBarScore: {
    width: 26,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'right',
  },
  trendBarScoreCurrent: {
    color: '#15803d',
  },
  monitorCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  monitorIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorDivider: {
    height: 1,
    backgroundColor: '#fde68a',
    marginVertical: 11,
  },
  monitorRow: {
    gap: 4,
  },
  monitorRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  monitorItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  amberPriorityPill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  amberPriorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  monitorItemGuidance: {
    fontSize: 12.5,
    color: '#78350f',
    lineHeight: 18,
  },
  explanationText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19.5,
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

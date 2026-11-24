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
import { VehicleItem } from './VehiclesScreen';

export interface AIHealthPassportScreenProps {
  selectedVehicle?: VehicleItem | null;
  vehicles?: VehicleItem[];
  onHealthMetricsPress?: () => void;
  onMaintenanceForecastPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

interface HealthCategoryMetric {
  id: string;
  label: string;
  score: number;
  status: 'Good' | 'Monitor' | 'Attention soon';
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface HealthEventItem {
  id: string;
  date: string;
  title: string;
  outcome: string;
  tone: 'positive' | 'monitor';
}

interface SampleHealthProfile {
  key: string;
  registration: string;
  model: string;
  overallScore: number;
  conditionLabel: string;
  shortStatus: string;
  lastUpdated: string;
  categories: HealthCategoryMetric[];
  insightBadge: string;
  insightText: string;
  nextServiceKm: string;
  currentOdometerKm: string;
  estimatedRemainingKm: string;
  priority: 'Low' | 'Medium' | 'High';
  events: HealthEventItem[];
}

const DEFAULT_HEALTH_PROFILE: SampleHealthProfile = {
  key: 'default-aqua',
  registration: 'WP ABC-1234',
  model: 'Toyota Aqua',
  overallScore: 86,
  conditionLabel: 'Good condition',
  shortStatus: 'Good',
  lastUpdated: '23 Sep 2026',
  categories: [
    {
      id: 'engine',
      label: 'Engine',
      score: 92,
      status: 'Good',
      icon: 'speedometer-outline',
    },
    {
      id: 'brakes',
      label: 'Brakes',
      score: 84,
      status: 'Monitor',
      icon: 'disc-outline',
    },
    {
      id: 'battery',
      label: 'Battery',
      score: 78,
      status: 'Attention soon',
      icon: 'battery-half-outline',
    },
    {
      id: 'tyres',
      label: 'Tyres',
      score: 88,
      status: 'Good',
      icon: 'ellipse-outline',
    },
  ],
  insightBadge: '2 items to monitor',
  insightText:
    'Your vehicle is currently in good condition. Battery health and upcoming brake maintenance should be monitored before the next scheduled service.',
  nextServiceKm: '90,000 km',
  currentOdometerKm: '85,240 km',
  estimatedRemainingKm: '4,760 km',
  priority: 'Medium',
  events: [
    {
      id: 'evt-1',
      date: '21 Sep 2026',
      title: 'Periodic engine service',
      outcome: 'Improved engine health',
      tone: 'positive',
    },
    {
      id: 'evt-2',
      date: '12 Aug 2026',
      title: 'Emissions test',
      outcome: 'Passed',
      tone: 'positive',
    },
    {
      id: 'evt-3',
      date: '15 May 2026',
      title: 'Brake inspection',
      outcome: 'Monitoring recommended',
      tone: 'monitor',
    },
  ],
};

function buildSampleProfileForVehicle(
  vehicle: VehicleItem,
  index: number
): SampleHealthProfile {
  if (index % 2 === 0) {
    return {
      ...DEFAULT_HEALTH_PROFILE,
      key: vehicle.id,
      registration: vehicle.registration,
      model: vehicle.name,
      overallScore: 86,
      conditionLabel: 'Good condition',
      shortStatus: 'Good',
      currentOdometerKm: vehicle.mileage || '85,240 km',
    };
  }
  return {
    ...DEFAULT_HEALTH_PROFILE,
    key: vehicle.id,
    registration: vehicle.registration,
    model: vehicle.name,
    overallScore: 90,
    conditionLabel: 'Good condition',
    shortStatus: 'Good',
    categories: [
      {
        id: 'engine',
        label: 'Engine',
        score: 94,
        status: 'Good',
        icon: 'speedometer-outline',
      },
      {
        id: 'brakes',
        label: 'Brakes',
        score: 89,
        status: 'Good',
        icon: 'disc-outline',
      },
      {
        id: 'battery',
        label: 'Battery',
        score: 83,
        status: 'Monitor',
        icon: 'battery-half-outline',
      },
      {
        id: 'tyres',
        label: 'Tyres',
        score: 91,
        status: 'Good',
        icon: 'ellipse-outline',
      },
    ],
    insightBadge: '1 item to monitor',
    insightText:
      'Your vehicle is in strong overall condition. Battery health should be reviewed at the next scheduled service visit.',
    nextServiceKm: '50,000 km',
    currentOdometerKm: vehicle.mileage || '42,100 km',
    estimatedRemainingKm: '7,900 km',
    priority: 'Low',
  };
}

export const AIHealthPassportScreen: React.FC<AIHealthPassportScreenProps> = ({
  selectedVehicle,
  vehicles = [],
  onHealthMetricsPress,
  onMaintenanceForecastPress,
  onNotificationsPress,
  onMenuPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const vehicleProfiles = useMemo<SampleHealthProfile[]>(() => {
    const list: SampleHealthProfile[] = [DEFAULT_HEALTH_PROFILE];
    const seenRegs = new Set<string>([DEFAULT_HEALTH_PROFILE.registration]);

    const orderedVehicles: VehicleItem[] = [];
    if (selectedVehicle) {
      orderedVehicles.push(selectedVehicle);
    }
    vehicles.forEach((v) => {
      if (!orderedVehicles.some((existing) => existing.id === v.id)) {
        orderedVehicles.push(v);
      }
    });

    orderedVehicles.forEach((v, idx) => {
      if (!seenRegs.has(v.registration)) {
        seenRegs.add(v.registration);
        list.push(buildSampleProfileForVehicle(v, idx));
      }
    });
    return list;
  }, [selectedVehicle, vehicles]);

  const initialKey = useMemo(() => {
    if (selectedVehicle) {
      const matched = vehicleProfiles.find(
        (p) => p.registration === selectedVehicle.registration
      );
      if (matched) return matched.key;
    }
    return DEFAULT_HEALTH_PROFILE.key;
  }, [selectedVehicle, vehicleProfiles]);

  const [activeKey, setActiveKey] = useState<string>(initialKey);
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const activeProfile = useMemo(
    () =>
      vehicleProfiles.find((p) => p.key === activeKey) ??
      vehicleProfiles[0] ??
      DEFAULT_HEALTH_PROFILE,
    [vehicleProfiles, activeKey]
  );

  const getStatusColors = (status: HealthCategoryMetric['status']) => {
    if (status === 'Good') {
      return {
        bar: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        text: '#15803d',
      };
    }
    if (status === 'Monitor') {
      return {
        bar: '#0056A2',
        bg: '#eff6ff',
        border: '#bfdbfe',
        text: '#0056A2',
      };
    }
    return {
      bar: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
    };
  };

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
        {/* 2. PAGE INTRO */}
        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-9 · AI VEHICLE HEALTH</Text>
          <Text style={styles.pageTitle}>AI health passport</Text>
          <Text style={styles.pageSubtitle}>
            Understand your vehicle&apos;s current condition and upcoming
            maintenance needs.
          </Text>
        </View>

        {/* 3. LOCAL VEHICLE SELECTOR */}
        {vehicleProfiles.length > 1 ? (
          <View style={styles.selectorWrapper}>
            <TouchableOpacity
              style={styles.vehicleSelectorButton}
              onPress={() => setSelectorOpen((prev) => !prev)}
              activeOpacity={0.8}
              accessibilityLabel="Select vehicle"
            >
              <View style={styles.selectorLeft}>
                <View style={styles.selectorIconBox}>
                  <Ionicons name="car-outline" size={16} color="#0056A2" />
                </View>
                <Text style={styles.selectorValue} numberOfLines={1}>
                  {activeProfile.registration} · {activeProfile.model}
                </Text>
              </View>
              <Ionicons
                name={selectorOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>

            {selectorOpen ? (
              <View style={styles.selectorDropdown}>
                {vehicleProfiles.map((profile, idx) => {
                  const isSelected = profile.key === activeProfile.key;
                  return (
                    <TouchableOpacity
                      key={profile.key}
                      style={[
                        styles.selectorOption,
                        idx < vehicleProfiles.length - 1
                          ? styles.selectorOptionBorder
                          : null,
                        isSelected ? styles.selectorOptionActive : null,
                      ]}
                      onPress={() => {
                        setActiveKey(profile.key);
                        setSelectorOpen(false);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.selectorOptionText,
                          isSelected ? styles.selectorOptionTextActive : null,
                        ]}
                      >
                        {profile.registration} · {profile.model}
                      </Text>
                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#0056A2"
                        />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 4. VEHICLE HEALTH HERO + CIRCULAR SCORE VISUAL */}
        <LinearGradient
          colors={['#002B54', '#00427D', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroVehicleInfo}>
              <Text style={styles.heroReg}>{activeProfile.registration}</Text>
              <Text style={styles.heroModel}>{activeProfile.model}</Text>
            </View>

            <View style={styles.conditionBadge}>
              <View style={styles.conditionDot} />
              <Text style={styles.conditionBadgeText}>
                {activeProfile.conditionLabel}
              </Text>
            </View>
          </View>

          {/* Centered Ring-Style Health Score (Pure RN Views, No Chart Lib) */}
          <View style={styles.scoreVisualWrap}>
            <View style={styles.scoreRingOuter}>
              <View style={styles.scoreRingAccent}>
                <View style={styles.scoreRingInner}>
                  <View style={styles.scoreNumberRow}>
                    <Text style={styles.scoreNumber}>
                      {activeProfile.overallScore}
                    </Text>
                    <Text style={styles.scoreMax}>/100</Text>
                  </View>
                  <Text style={styles.scoreLabel}>Overall health</Text>
                  <View style={styles.scoreStatusPill}>
                    <Text style={styles.scoreStatusText}>
                      {activeProfile.shortStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.heroFooterRow}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="calendar-outline" size={13} color="#bae6fd" />
              <Text style={styles.heroMetaText}>
                Last updated: {activeProfile.lastUpdated}
              </Text>
            </View>

            <View style={styles.previewTag}>
              <Text style={styles.previewTagText}>Local health preview</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 5. KEY HEALTH AREAS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="pulse-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Vehicle health</Text>
            </View>

            <Text style={styles.sampleHintText}>Sample health assessment</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricsList}>
            {activeProfile.categories.map((cat) => {
              const palette = getStatusColors(cat.status);
              return (
                <View key={cat.id} style={styles.metricItem}>
                  <View style={styles.metricTopRow}>
                    <View style={styles.metricLabelGroup}>
                      <Ionicons name={cat.icon} size={16} color="#334155" />
                      <Text style={styles.metricLabel}>{cat.label}</Text>
                    </View>

                    <View style={styles.metricRightGroup}>
                      <Text style={styles.metricPercent}>{cat.score}%</Text>
                      <View
                        style={[
                          styles.metricStatusBadge,
                          {
                            backgroundColor: palette.bg,
                            borderColor: palette.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.metricStatusText,
                            { color: palette.text },
                          ]}
                        >
                          {cat.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(100, Math.max(0, cat.score))}%`,
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

        {/* 6. AI HEALTH INSIGHT CARD */}
        <View style={styles.insightCard}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.insightIconBox}>
                <Ionicons name="sparkles-outline" size={17} color="#0056A2" />
              </View>
              <View>
                <Text style={styles.cardTitle}>AI health insight</Text>
                <Text style={styles.insightSubLabel}>Sample AI insight</Text>
              </View>
            </View>

            <View style={styles.monitorBadge}>
              <Ionicons name="alert-circle-outline" size={13} color="#b45309" />
              <Text style={styles.monitorBadgeText}>
                {activeProfile.insightBadge}
              </Text>
            </View>
          </View>

          <View style={styles.insightDivider} />

          <Text style={styles.insightBodyText}>
            {activeProfile.insightText}
          </Text>
        </View>

        {/* 7. MAINTENANCE OUTLOOK CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="build-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Maintenance outlook</Text>
            </View>

            <View
              style={[
                styles.priorityBadge,
                activeProfile.priority === 'Low'
                  ? styles.priorityBadgeLow
                  : styles.priorityBadgeMedium,
              ]}
            >
              <Text
                style={[
                  styles.priorityBadgeText,
                  activeProfile.priority === 'Low'
                    ? styles.priorityTextLow
                    : styles.priorityTextMedium,
                ]}
              >
                Priority: {activeProfile.priority}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next recommended service</Text>
              <Text style={styles.detailAccentValue}>
                {activeProfile.nextServiceKm}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current odometer</Text>
              <Text style={styles.detailValue}>
                {activeProfile.currentOdometerKm}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated remaining</Text>
              <Text style={styles.detailValue}>
                {activeProfile.estimatedRemainingKm}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Priority</Text>
              <Text
                style={[
                  styles.detailValue,
                  activeProfile.priority === 'Low'
                    ? styles.priorityTextLow
                    : styles.priorityTextMedium,
                ]}
              >
                {activeProfile.priority}
              </Text>
            </View>
          </View>
        </View>

        {/* 8. RECENT HEALTH EVENTS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Recent health events</Text>
          </View>

          <View style={styles.divider} />

          {activeProfile.events.map((evt, idx) => {
            const isPositive = evt.tone === 'positive';
            return (
              <View key={evt.id}>
                <View style={styles.eventRow}>
                  <View
                    style={[
                      styles.eventIconBox,
                      isPositive
                        ? styles.eventIconPositive
                        : styles.eventIconMonitor,
                    ]}
                  >
                    <Ionicons
                      name={
                        isPositive ? 'checkmark-circle' : 'alert-circle-outline'
                      }
                      size={16}
                      color={isPositive ? '#15803d' : '#b45309'}
                    />
                  </View>

                  <View style={styles.eventTextCol}>
                    <View style={styles.eventTopLine}>
                      <Text style={styles.eventTitle}>{evt.title}</Text>
                      <Text style={styles.eventDate}>{evt.date}</Text>
                    </View>
                    <Text
                      style={[
                        styles.eventOutcome,
                        isPositive
                          ? styles.eventOutcomePositive
                          : styles.eventOutcomeMonitor,
                      ]}
                    >
                      {evt.outcome}
                    </Text>
                  </View>
                </View>

                {idx < activeProfile.events.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 9. ACTION BUTTONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onHealthMetricsPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="analytics-outline" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>View health metrics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onMaintenanceForecastPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={17} color="#0056A2" />
            <Text style={styles.secondaryButtonText}>
              View maintenance forecast
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 10. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (HEALTH ACTIVE) */}
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
    paddingTop: 16,
    paddingBottom: 28,
    gap: 14,
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
  selectorWrapper: {
    gap: 6,
  },
  vehicleSelectorButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  selectorIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  selectorDropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
  },
  selectorOption: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectorOptionActive: {
    backgroundColor: '#eff6ff',
  },
  selectorOptionText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
  },
  selectorOptionTextActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 18,
    padding: 18,
    gap: 16,
    shadowColor: '#002B54',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroVehicleInfo: {
    flex: 1,
    gap: 2,
  },
  heroReg: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  heroModel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#dbeafe',
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  conditionBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  scoreVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  scoreRingOuter: {
    width: 146,
    height: 146,
    borderRadius: 73,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
  },
  scoreRingAccent: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 6,
    borderColor: '#4ade80',
    borderRightColor: '#38bdf8',
    backgroundColor: 'rgba(0, 43, 84, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.8,
  },
  scoreMax: {
    fontSize: 13,
    fontWeight: '700',
    color: '#bae6fd',
    marginLeft: 2,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dbeafe',
  },
  scoreStatusPill: {
    marginTop: 3,
    backgroundColor: 'rgba(74, 222, 128, 0.22)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  scoreStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#bbf7d0',
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroMetaText: {
    fontSize: 12,
    color: '#dbeafe',
    fontWeight: '500',
  },
  previewTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  previewTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e0f2fe',
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  sampleHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  metricsList: {
    gap: 13,
  },
  metricItem: {
    gap: 6,
  },
  metricTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metricLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  metricRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricPercent: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricStatusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metricStatusText: {
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
  insightSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  monitorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  monitorBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
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
  priorityBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  priorityBadgeMedium: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  priorityBadgeLow: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  priorityBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  priorityTextMedium: {
    color: '#b45309',
  },
  priorityTextLow: {
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
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
  },
  detailAccentValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0056A2',
    textAlign: 'right',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 3,
  },
  eventIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  eventIconPositive: {
    backgroundColor: '#f0fdf4',
  },
  eventIconMonitor: {
    backgroundColor: '#fffbeb',
  },
  eventTextCol: {
    flex: 1,
    gap: 2,
  },
  eventTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  eventTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  eventDate: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  eventOutcome: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  eventOutcomePositive: {
    color: '#15803d',
  },
  eventOutcomeMonitor: {
    color: '#b45309',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 9,
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

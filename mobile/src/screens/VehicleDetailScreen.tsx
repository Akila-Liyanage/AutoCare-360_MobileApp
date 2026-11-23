import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { VehicleItem } from './VehiclesScreen';
import { DEFAULT_OWNER_PROFILE, OwnerProfileData } from './EditProfileScreen';

export type VehicleDetailScreenProps = {
  vehicle: VehicleItem;
  ownerProfile?: OwnerProfileData;
  onBack: () => void;
  onHomePress: () => void;
  onRecordsPress?: () => void;
  onProfilePress: () => void;
  onViewCompleteHistoryPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

type ServiceHistoryRow = {
  id: string;
  title: string;
  meta: string;
  cost: string;
  status: 'VERIFIED';
};

const RECENT_SERVICE_HISTORY: ServiceHistoryRow[] = [
  {
    id: 'srv-1',
    title: 'Annual safety & electronics diagnostics',
    meta: '14 Aug 2026 · Apex Tech Service Center · 82,410 km',
    cost: 'LKR 28,500',
    status: 'VERIFIED',
  },
  {
    id: 'srv-2',
    title: 'Cabin filter & AC service',
    meta: '12 Jul 2026 · Apex Tech Service Center · 80,840 km',
    cost: 'LKR 12,000',
    status: 'VERIFIED',
  },
  {
    id: 'srv-3',
    title: 'Tyre safety check & rotation',
    meta: '04 May 2026 · Perera Auto Works · 77,920 km',
    cost: 'LKR 8,500',
    status: 'VERIFIED',
  },
];

const formatMileage = (mileage?: string): string => {
  if (!mileage) {
    return '82,410 km';
  }
  const numeric = Number(mileage.replace(/[^\d]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return `${mileage} km`;
  }
  return `${numeric.toLocaleString()} km`;
};

export const VehicleDetailScreen: React.FC<VehicleDetailScreenProps> = ({
  vehicle,
  ownerProfile = DEFAULT_OWNER_PROFILE,
  onBack,
  onHomePress,
  onRecordsPress,
  onProfilePress,
  onViewCompleteHistoryPress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const displayMileage = formatMileage(vehicle.mileage);
  const ownerName = vehicle.ownerName || ownerProfile.fullName || 'David Silva';
  const region = ownerProfile.primaryRegion || 'Colombo, Sri Lanka';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. WHITE HEADER */}
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
        {/* 2. TOP SECTION */}
        <View style={styles.pageHeaderSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={16} color="#0056A2" />
            <Text style={styles.backButtonText}>Back to Vehicles</Text>
          </TouchableOpacity>

          <View style={styles.topBadgeRow}>
            <View style={styles.statusBadgeGreen}>
              <Ionicons name="checkmark-circle" size={11} color="#15803d" />
              <Text style={styles.statusBadgeGreenText}>{vehicle.status}</Text>
            </View>
            <View style={styles.passportBadgeBlue}>
              <Ionicons name="shield-checkmark" size={11} color="#0056A2" />
              <Text style={styles.passportBadgeBlueText}>
                PASSPORT {vehicle.passportStatus}
              </Text>
            </View>
          </View>

          <Text style={styles.pageTitle}>{vehicle.name}</Text>
          <Text style={styles.pageSubtitle}>
            {vehicle.registration} · {displayMileage}
          </Text>
        </View>

        {/* 3. VEHICLE IMAGE / HERO AREA */}
        <LinearGradient
          colors={['#0056A2', '#0891b2', '#0d9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Image
            source={require('../../assets/bg-fade.png')}
            style={styles.heroBgOverlay}
            resizeMode="cover"
          />

          <View style={styles.heroTopRow}>
            <View style={styles.heroPlatePill}>
              <Ionicons name="card-outline" size={12} color="#ffffff" />
              <Text style={styles.heroPlateText}>{vehicle.registration}</Text>
            </View>

            <View style={styles.heroScorePill}>
              <Ionicons name="shield-checkmark" size={12} color="#86efac" />
              <Text style={styles.heroScorePillText}>Trust 92 / 100</Text>
            </View>
          </View>

          <View style={styles.heroVisualCenter}>
            <View style={styles.heroCarCircle}>
              <Ionicons name="car-sport" size={56} color="#ffffff" />
            </View>
            <Text style={styles.heroVehicleName}>{vehicle.name}</Text>
            <Text style={styles.heroVehicleSub}>
              Digital Vehicle Passport · Universal VMR
            </Text>
          </View>

          <View style={styles.heroSpecsRow}>
            <View style={styles.heroSpecItem}>
              <Text style={styles.heroSpecLabel}>Year</Text>
              <Text style={styles.heroSpecValue}>{vehicle.year}</Text>
            </View>

            <View style={styles.heroSpecDivider} />

            <View style={styles.heroSpecItem}>
              <Text style={styles.heroSpecLabel}>Fuel</Text>
              <Text style={styles.heroSpecValue}>{vehicle.fuel}</Text>
            </View>

            <View style={styles.heroSpecDivider} />

            <View style={styles.heroSpecItem}>
              <Text style={styles.heroSpecLabel}>Mileage</Text>
              <Text style={styles.heroSpecValue}>{displayMileage}</Text>
            </View>
          </View>

          {vehicle.vin || vehicle.color || vehicle.transmission ? (
            <View style={styles.heroExtraTagsRow}>
              {vehicle.color ? (
                <View style={styles.heroExtraTag}>
                  <Text style={styles.heroExtraTagText}>{vehicle.color}</Text>
                </View>
              ) : null}
              {vehicle.transmission ? (
                <View style={styles.heroExtraTag}>
                  <Text style={styles.heroExtraTagText}>{vehicle.transmission}</Text>
                </View>
              ) : null}
              {vehicle.vin ? (
                <View style={styles.heroExtraTag}>
                  <Text style={styles.heroExtraTagText} numberOfLines={1}>
                    VIN: {vehicle.vin}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </LinearGradient>

        {/* 4. STATUS SUMMARY CARDS */}
        <View style={styles.statusCardsRow}>
          <View style={styles.statusSummaryCard}>
            <View style={styles.statusCardHeader}>
              <View style={styles.statusIconGreen}>
                <Ionicons name="checkmark-done-outline" size={16} color="#15803d" />
              </View>
              <Text style={styles.statusCardLabel}>Service status</Text>
            </View>
            <Text style={styles.statusCardValueGreen}>Up to date</Text>
          </View>

          <View style={styles.statusSummaryCard}>
            <View style={styles.statusCardHeader}>
              <View style={styles.statusIconBlue}>
                <Ionicons name="wallet-outline" size={16} color="#0056A2" />
              </View>
              <Text style={styles.statusCardLabel}>Lifetime service cost</Text>
            </View>
            <Text style={styles.statusCardValueBlue}>LKR 169,000</Text>
          </View>
        </View>

        {/* 5. OWNERSHIP & CRYPTOGRAPHIC INTEGRITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="lock-closed-outline" size={17} color="#0056A2" />
            <Text style={styles.cardTitle}>
              Ownership &amp; cryptographic integrity
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Registered owner</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="checkmark-circle" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>{ownerName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inlineRow}>
            <Text style={styles.detailLabel}>Owner since</Text>
            <Text style={styles.inlineValue}>15 May 2026</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inlineRow}>
            <Text style={styles.detailLabel}>Registration region</Text>
            <Text style={styles.inlineValue}>{region}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inlineRow}>
            <Text style={styles.detailLabel}>Ledger root hash</Text>
            <Text style={styles.inlineValueMono}>0x8f9e...2b7c</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Consensus status</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="shield-checkmark" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>VALID</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>Fully compliant</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.inlineRow, styles.rowLast]}>
            <Text style={styles.detailLabel}>Last integrity check</Text>
            <Text style={styles.inlineValue}>30 Sep 2026 · 09:40</Text>
          </View>
        </View>

        {/* 6. TRUST SCORE CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trust score</Text>
          <Text style={styles.cardSubtitle}>Passport confidence</Text>

          <View style={styles.trustCenter}>
            <View style={styles.scoreOuterRing}>
              <View style={styles.scoreInnerCircle}>
                <Text style={styles.scoreNumber}>92</Text>
                <Text style={styles.scoreOutOf}>/ 100</Text>
              </View>
            </View>

            <View style={styles.integrityPill}>
              <Ionicons name="shield-checkmark" size={13} color="#15803d" />
              <Text style={styles.integrityPillText}>Excellent integrity</Text>
            </View>

            <Text style={styles.trustSupportingText}>
              18 of 19 source checks verified from certified service and telemetry records.
            </Text>
          </View>

          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>Verification coverage</Text>
            <Text style={styles.progressPercent}>92%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '92%' }]} />
          </View>
        </View>

        {/* 7. RECENT SERVICE HISTORY CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent service history</Text>
          <Text style={styles.cardSubtitle}>
            Certified records appended by verified garages.
          </Text>

          <View style={styles.divider} />

          {RECENT_SERVICE_HISTORY.map((record, index) => (
            <View key={record.id}>
              <View style={styles.serviceRow}>
                <View style={styles.serviceTopLine}>
                  <Text style={styles.serviceTitle}>{record.title}</Text>
                  <View style={styles.statusBadgeGreen}>
                    <Ionicons name="checkmark-circle" size={10} color="#15803d" />
                    <Text style={styles.statusBadgeGreenText}>{record.status}</Text>
                  </View>
                </View>

                <Text style={styles.serviceMeta}>{record.meta}</Text>
                <Text style={styles.serviceCost}>{record.cost}</Text>
              </View>

              {index < RECENT_SERVICE_HISTORY.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </View>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.viewHistoryButton}
            onPress={() => onViewCompleteHistoryPress?.()}
            activeOpacity={0.8}
          >
            <Text style={styles.viewHistoryButtonText}>View complete history</Text>
            <Ionicons name="arrow-forward" size={15} color="#0056A2" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 8. BOTTOM NAVIGATION */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="car" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onRecordsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Profile</Text>
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
    paddingTop: 16,
    paddingBottom: 26,
  },
  pageHeaderSection: {
    marginBottom: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
  },
  topBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 3,
  },
  statusBadgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  passportBadgeBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 3,
  },
  passportBadgeBlueText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#0056A2',
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  pageSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  heroCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  heroBgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  heroPlatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  heroPlateText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  heroScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  heroScorePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroVisualCenter: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 14,
  },
  heroCarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroVehicleName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  heroVehicleSub: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textAlign: 'center',
  },
  heroSpecsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  heroSpecItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroSpecDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  heroSpecLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.78)',
    fontWeight: '600',
    marginBottom: 2,
  },
  heroSpecValue: {
    fontSize: 12.5,
    color: '#ffffff',
    fontWeight: '800',
  },
  heroExtraTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  heroExtraTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroExtraTagText: {
    fontSize: 10.5,
    color: '#ffffff',
    fontWeight: '600',
  },
  statusCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statusSummaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  statusIconGreen: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconBlue: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCardLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  statusCardValueGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16a34a',
  },
  statusCardValueBlue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0056A2',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    marginTop: 3,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  detailRow: {
    paddingVertical: 11,
  },
  detailTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13.5,
    color: '#0f172a',
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: 10,
  },
  rowLast: {
    paddingBottom: 2,
  },
  inlineValue: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  inlineValueMono: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  trustCenter: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreOuterRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#ebf5ff',
    borderWidth: 8,
    borderColor: '#0056A2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scoreInnerCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0056A2',
    lineHeight: 36,
  },
  scoreOutOf: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  integrityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
    marginBottom: 10,
  },
  integrityPillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803d',
  },
  trustSupportingText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0056A2',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#16a34a',
  },
  serviceRow: {
    paddingVertical: 12,
  },
  serviceTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 18,
  },
  serviceMeta: {
    fontSize: 11.5,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 4,
  },
  serviceCost: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 14,
  },
  viewHistoryButtonText: {
    fontSize: 13,
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
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
});

export default VehicleDetailScreen;

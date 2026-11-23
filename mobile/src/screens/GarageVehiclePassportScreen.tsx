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
import {
  GARAGE_VEHICLE_RECORDS,
  GarageVehicleRecord,
  GarageVehicleRecordStatus,
} from './GarageVehicleRecordsScreen';

export interface GarageVehiclePassportScreenProps {
  vehicle?: GarageVehicleRecord | null;
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onAddServiceRecordPress?: (vehicleId: string) => void;
  onViewFullHistoryPress?: (vehicleId: string) => void;
  onTransferOwnershipPress?: (vehicleId: string) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

interface VehiclePassportExtras {
  vin: string;
  year: string;
  fuelType: string;
  currentMileage: string;
  ownershipSince: string;
  nextService: string;
  trustScore: string;
}

interface ServiceHistoryItem {
  id: string;
  date: string;
  service: string;
  garage: string;
  amount: string;
}

const VEHICLE_PASSPORT_EXTRAS: Record<string, VehiclePassportExtras> = {
  'veh-wp-abc-1234': {
    vin: 'NHP10-23648102',
    year: '2018',
    fuelType: 'Hybrid',
    currentMileage: '85,240 km',
    ownershipSince: '12 Mar 2023',
    nextService: 'Due at 90,000 km',
    trustScore: '98%',
  },
  'veh-wp-cbd-5521': {
    vin: 'MH55S-10489231',
    year: '2019',
    fuelType: 'Mild Hybrid',
    currentMileage: '42,100 km',
    ownershipSince: '08 Nov 2022',
    nextService: 'Due at 47,000 km',
    trustScore: '91%',
  },
  'veh-wp-cde-9080': {
    vin: 'RU3-12894560',
    year: '2017',
    fuelType: 'Hybrid',
    currentMileage: '112,450 km',
    ownershipSince: '19 Jul 2021',
    nextService: 'Due at 112,000 km',
    trustScore: '94%',
  },
};

const DEFAULT_EXTRAS: VehiclePassportExtras = {
  vin: 'NHP10-23648102',
  year: '2018',
  fuelType: 'Hybrid',
  currentMileage: '85,240 km',
  ownershipSince: '12 Mar 2023',
  nextService: 'Due at 90,000 km',
  trustScore: '98%',
};

const RECENT_SERVICE_HISTORY: ServiceHistoryItem[] = [
  {
    id: 'hist-1',
    date: '21 Sep 2026',
    service: 'Periodic engine service',
    garage: 'Perera Auto Works',
    amount: 'LKR 83,400',
  },
  {
    id: 'hist-2',
    date: '02 Jun 2026',
    service: 'Brake inspection',
    garage: 'Apex Tech Service Center',
    amount: 'LKR 28,500',
  },
  {
    id: 'hist-3',
    date: '10 Feb 2026',
    service: 'AC & cabin filter service',
    garage: 'Perera Auto Works',
    amount: 'LKR 12,000',
  },
];

const STATUS_MAPPING: Record<
  GarageVehicleRecordStatus,
  {
    heroBadgeLabel: string;
    heroBadgeBg: string;
    heroBadgeColor: string;
    heroBadgeIcon: React.ComponentProps<typeof Ionicons>['name'];
    serviceStatusLabel: string;
    serviceStatusBg: string;
    serviceStatusBorder: string;
    serviceStatusColor: string;
    ownerStatusLabel: string;
    ownershipChipLabel: string;
    ownershipChipIsPositive: boolean;
  }
> = {
  verified: {
    heroBadgeLabel: 'Verified',
    heroBadgeBg: '#dcfce7',
    heroBadgeColor: '#15803d',
    heroBadgeIcon: 'checkmark-circle',
    serviceStatusLabel: 'Up to date',
    serviceStatusBg: '#f0fdf4',
    serviceStatusBorder: '#bbf7d0',
    serviceStatusColor: '#15803d',
    ownerStatusLabel: 'Verified owner',
    ownershipChipLabel: 'Ownership verified',
    ownershipChipIsPositive: true,
  },
  'pending-link': {
    heroBadgeLabel: 'Pending link',
    heroBadgeBg: '#ffedd5',
    heroBadgeColor: '#c2410c',
    heroBadgeIcon: 'link-outline',
    serviceStatusLabel: 'Owner link pending',
    serviceStatusBg: '#fffbeb',
    serviceStatusBorder: '#fde68a',
    serviceStatusColor: '#b45309',
    ownerStatusLabel: 'Pending owner link',
    ownershipChipLabel: 'Owner link pending',
    ownershipChipIsPositive: false,
  },
  'service-due': {
    heroBadgeLabel: 'Service due',
    heroBadgeBg: '#fef3c7',
    heroBadgeColor: '#b45309',
    heroBadgeIcon: 'alert-circle-outline',
    serviceStatusLabel: 'Service due',
    serviceStatusBg: '#fffbeb',
    serviceStatusBorder: '#fde68a',
    serviceStatusColor: '#b45309',
    ownerStatusLabel: 'Verified owner',
    ownershipChipLabel: 'Ownership verified',
    ownershipChipIsPositive: true,
  },
};

export const GarageVehiclePassportScreen: React.FC<
  GarageVehiclePassportScreenProps
> = ({
  vehicle,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onAddServiceRecordPress,
  onViewFullHistoryPress,
  onTransferOwnershipPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const activeVehicle = vehicle ?? GARAGE_VEHICLE_RECORDS[0];
  const extras = VEHICLE_PASSPORT_EXTRAS[activeVehicle.id] ?? DEFAULT_EXTRAS;
  const statusInfo = STATUS_MAPPING[activeVehicle.status];

  const identityRows: Array<{ label: string; value: string }> = [
    { label: 'Registration number', value: activeVehicle.registration },
    { label: 'Make & model', value: activeVehicle.model },
    { label: 'VIN / chassis', value: extras.vin },
    { label: 'Year', value: extras.year },
    { label: 'Fuel type', value: extras.fuelType },
    { label: 'Current mileage', value: extras.currentMileage },
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
          accessibilityLabel="Back to Vehicle Records"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>GARAGE / VEHICLE PASSPORT</Text>
          <Text style={styles.pageTitle}>Vehicle passport</Text>
          <Text style={styles.pageSubtitle}>
            Verified vehicle identity, ownership and service history.
          </Text>
        </View>

        {/* 3. VEHICLE HERO CARD */}
        <LinearGradient
          colors={['#003566', '#004684', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.heroStatusPill,
                { backgroundColor: statusInfo.heroBadgeBg },
              ]}
            >
              <Ionicons
                name={statusInfo.heroBadgeIcon}
                size={13}
                color={statusInfo.heroBadgeColor}
              />
              <Text
                style={[
                  styles.heroStatusPillText,
                  { color: statusInfo.heroBadgeColor },
                ]}
              >
                {statusInfo.heroBadgeLabel}
              </Text>
            </View>

            <View style={styles.heroCarBadge}>
              <Ionicons name="car-sport-outline" size={19} color="#bae6fd" />
            </View>
          </View>

          <Text style={styles.heroRegistration}>
            {activeVehicle.registration}
          </Text>
          <Text style={styles.heroModel}>{activeVehicle.model}</Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaCol}>
              <Text style={styles.heroMetaLabel}>Owner</Text>
              <Text style={styles.heroMetaValue} numberOfLines={1}>
                {activeVehicle.owner}
              </Text>
            </View>

            <View style={styles.heroMetaDivider} />

            <View style={styles.heroMetaCol}>
              <Text style={styles.heroMetaLabel}>Last service</Text>
              <Text style={styles.heroMetaValue} numberOfLines={1}>
                {activeVehicle.lastService}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 4. PASSPORT IDENTITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="card-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle identity</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {identityRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. OWNERSHIP CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="person-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Verified ownership</Text>
            </View>

            <View
              style={[
                styles.ownershipChip,
                statusInfo.ownershipChipIsPositive
                  ? styles.ownershipChipGreen
                  : styles.ownershipChipAmber,
              ]}
            >
              <Ionicons
                name={
                  statusInfo.ownershipChipIsPositive
                    ? 'checkmark-circle'
                    : 'time-outline'
                }
                size={12}
                color={
                  statusInfo.ownershipChipIsPositive ? '#15803d' : '#b45309'
                }
              />
              <Text
                style={[
                  styles.ownershipChipText,
                  statusInfo.ownershipChipIsPositive
                    ? styles.ownershipChipTextGreen
                    : styles.ownershipChipTextAmber,
                ]}
              >
                {statusInfo.ownershipChipLabel}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current owner</Text>
              <Text style={styles.detailValue}>{activeVehicle.owner}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Owner status</Text>
              <Text style={styles.detailValue}>
                {statusInfo.ownerStatusLabel}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ownership since</Text>
              <Text style={styles.detailValue}>{extras.ownershipSince}</Text>
            </View>
          </View>
        </View>

        {/* 6. SERVICE STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="construct-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Service status</Text>
            </View>

            <View
              style={[
                styles.serviceStatusPill,
                {
                  backgroundColor: statusInfo.serviceStatusBg,
                  borderColor: statusInfo.serviceStatusBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.serviceStatusPillText,
                  { color: statusInfo.serviceStatusColor },
                ]}
              >
                {statusInfo.serviceStatusLabel}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last service</Text>
              <Text style={styles.detailValue}>
                {activeVehicle.lastService}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service status</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: statusInfo.serviceStatusColor },
                ]}
              >
                {statusInfo.serviceStatusLabel}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Garage</Text>
              <Text style={styles.detailValue}>Perera Auto Works</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next service</Text>
              <Text style={styles.detailValue}>{extras.nextService}</Text>
            </View>
          </View>
        </View>

        {/* 7. PASSPORT INTEGRITY CARD */}
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
              <Text style={styles.cardTitle}>Passport integrity</Text>
            </View>

            <View style={styles.verifiedPassportBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#15803d" />
              <Text style={styles.verifiedPassportBadgeText}>
                Verified passport
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.trustRow}>
            <View style={styles.trustRingOuter}>
              <View style={styles.trustRingInner}>
                <Text style={styles.trustScoreValue}>{extras.trustScore}</Text>
                <Text style={styles.trustScoreCaption}>Trust</Text>
              </View>
            </View>

            <View style={styles.trustCopyCol}>
              <Text style={styles.trustHeading}>Trust score</Text>
              <Text style={styles.trustDescription}>
                Vehicle identity and service records are consistent across the
                current Garage passport data.
              </Text>
            </View>
          </View>
        </View>

        {/* 8. RECENT SERVICE HISTORY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Recent service history</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.historyList}>
            {RECENT_SERVICE_HISTORY.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.historyRow}>
                  <View style={styles.historyLeftCol}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={styles.historyService}>{item.service}</Text>
                    <Text style={styles.historyGarage}>{item.garage}</Text>
                  </View>

                  <Text style={styles.historyAmount}>{item.amount}</Text>
                </View>

                {idx < RECENT_SERVICE_HISTORY.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.fullHistoryButton}
            onPress={() => onViewFullHistoryPress?.(activeVehicle.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.fullHistoryButtonText}>
              View full service history
            </Text>
            <Ionicons name="chevron-forward" size={15} color="#0056A2" />
          </TouchableOpacity>
        </View>

        {/* 9. GARAGE ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => onAddServiceRecordPress?.(activeVehicle.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionButtonText}>
              + Add service record
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => onTransferOwnershipPress?.(activeVehicle.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color="#0056A2"
            />
            <Text style={styles.secondaryActionButtonText}>
              Transfer / ownership info
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 10. GARAGE BOTTOM NAVIGATION (VEHICLES ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onGaragePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Garage"
        >
          <Ionicons name="construct-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Garage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onVehiclesPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Vehicles"
        >
          <Ionicons name="car" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onJobsPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Jobs"
        >
          <Ionicons name="clipboard-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onBillingPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Billing"
        >
          <Ionicons name="receipt-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Billing</Text>
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
  heroCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#003566',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  heroStatusPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  heroCarBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRegistration: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  heroModel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#e0f2fe',
    marginBottom: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  heroMetaCol: {
    flex: 1,
    minWidth: 0,
  },
  heroMetaDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginHorizontal: 12,
  },
  heroMetaLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#bae6fd',
    marginBottom: 2,
  },
  heroMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
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
  ownershipChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
    flexShrink: 0,
  },
  ownershipChipGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  ownershipChipAmber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  ownershipChipText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  ownershipChipTextGreen: {
    color: '#15803d',
  },
  ownershipChipTextAmber: {
    color: '#b45309',
  },
  serviceStatusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 0,
  },
  serviceStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedPassportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
    flexShrink: 0,
  },
  verifiedPassportBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  trustRingOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 6,
    borderColor: '#0056A2',
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustScoreValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#003566',
  },
  trustScoreCaption: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0056A2',
  },
  trustCopyCol: {
    flex: 1,
    minWidth: 0,
  },
  trustHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  trustDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
  },
  historyList: {
    marginBottom: 14,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  historyLeftCol: {
    flex: 1,
    minWidth: 0,
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0056A2',
    marginBottom: 2,
  },
  historyService: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  historyGarage: {
    fontSize: 12,
    color: '#64748b',
  },
  historyAmount: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 0,
  },
  fullHistoryButton: {
    height: 40,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  fullHistoryButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  primaryActionButton: {
    height: 48,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryActionButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  secondaryActionButtonText: {
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

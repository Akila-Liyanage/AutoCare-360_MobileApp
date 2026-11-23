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

export type VehicleItem = {
  id: string;
  name: string;
  registration: string;
  year: string;
  fuel: string;
  status: 'VERIFIED';
  passportStatus: 'ACTIVE';
  make?: string;
  model?: string;
  category?: string;
  transmission?: string;
  color?: string;
  vin?: string;
  engineNumber?: string;
  mileage?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
};

export const MOCK_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-1',
    name: 'Toyota Corolla',
    registration: 'CAB-4582',
    year: '2022',
    fuel: 'Petrol',
    status: 'VERIFIED',
    passportStatus: 'ACTIVE',
  },
  {
    id: 'veh-2',
    name: 'Honda Vezel',
    registration: 'CAA-9821',
    year: '2021',
    fuel: 'Hybrid',
    status: 'VERIFIED',
    passportStatus: 'ACTIVE',
  },
];

export type VehiclesScreenProps = {
  vehicles?: VehicleItem[];
  onHomePress: () => void;
  onRecordsPress?: () => void;
  onProfilePress: () => void;
  onAddVehiclePress?: () => void;
  onViewVehiclePress?: (vehicle: VehicleItem) => void;
  onViewPassportPress?: (vehicle: VehicleItem) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

export const VehiclesScreen: React.FC<VehiclesScreenProps> = ({
  vehicles = MOCK_VEHICLES,
  onHomePress,
  onRecordsPress,
  onProfilePress,
  onAddVehiclePress,
  onViewVehiclePress,
  onViewPassportPress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const registeredCount = vehicles.length;
  const verifiedPassportsCount = vehicles.filter(
    (item) => item.passportStatus === 'ACTIVE'
  ).length;
  const activeAlertsCount = 0;

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
        {/* 2. PAGE INTRO + ADD VEHICLE CTA */}
        <View style={styles.pageHeaderSection}>
          <Text style={styles.pageEyebrow}>VEHICLE MANAGEMENT</Text>

          <View style={styles.titleActionRow}>
            <Text style={styles.pageTitle}>My Vehicles</Text>

            <TouchableOpacity
              style={styles.addVehicleButton}
              onPress={() => onAddVehiclePress?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={styles.addVehicleButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pageSubtitle}>
            Manage your registered vehicles and access their AutoCare 360 digital passports.
          </Text>
        </View>

        {/* 3. VEHICLE SUMMARY / COUNT */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{registeredCount}</Text>
            <Text style={styles.summaryLabel}>Registered Vehicles</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
              {verifiedPassportsCount}
            </Text>
            <Text style={styles.summaryLabel}>Verified Passports</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, styles.summaryValueMuted]}>
              {activeAlertsCount}
            </Text>
            <Text style={styles.summaryLabel}>Active Alerts</Text>
          </View>
        </View>

        {/* 4. VEHICLE CARDS OR EMPTY STATE */}
        {vehicles.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="car-outline" size={32} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No vehicles registered yet.</Text>
            <Text style={styles.emptySubtitle}>
              Register your first vehicle to create an AutoCare 360 Digital Vehicle Passport.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => onAddVehiclePress?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={16} color="#ffffff" />
              <Text style={styles.emptyAddButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                {/* Card Top Row: Icon + Name/Plate + Status Badge */}
                <View style={styles.vehicleTopRow}>
                  <View style={styles.vehicleIconBox}>
                    <Ionicons name="car-sport" size={26} color="#0056A2" />
                  </View>

                  <View style={styles.vehicleTitleCol}>
                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                    <View style={styles.registrationRow}>
                      <Text style={styles.registrationLabel}>Registration:</Text>
                      <Text style={styles.registrationPlate}>
                        {vehicle.registration}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusBadgeGreen}>
                    <Ionicons name="checkmark-circle" size={11} color="#15803d" />
                    <Text style={styles.statusBadgeGreenText}>{vehicle.status}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Metadata Grid */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Year</Text>
                    <Text style={styles.metaValue}>{vehicle.year}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Fuel</Text>
                    <Text style={styles.metaValue}>{vehicle.fuel}</Text>
                  </View>

                  <View style={styles.metaItemRight}>
                    <Text style={styles.metaLabel}>Digital Passport</Text>
                    <View style={styles.passportBadgeGreen}>
                      <Ionicons name="shield-checkmark" size={11} color="#15803d" />
                      <Text style={styles.passportBadgeGreenText}>
                        {vehicle.passportStatus}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Card Actions */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cardPrimaryButton}
                    onPress={() => onViewVehiclePress?.(vehicle)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="car-outline" size={15} color="#ffffff" />
                    <Text style={styles.cardPrimaryButtonText}>View Vehicle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cardSecondaryButton}
                    onPress={() => onViewPassportPress?.(vehicle)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="qr-code-outline" size={15} color="#0056A2" />
                    <Text style={styles.cardSecondaryButtonText}>View Passport</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 5. BOTTOM NAVIGATION */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
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
    paddingTop: 18,
    paddingBottom: 24,
  },
  pageHeaderSection: {
    marginBottom: 16,
  },
  pageEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#0056A2',
    marginBottom: 4,
  },
  titleActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 4,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  addVehicleButtonText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0056A2',
    marginBottom: 2,
  },
  summaryValueGreen: {
    color: '#16a34a',
  },
  summaryValueMuted: {
    color: '#475569',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 13,
  },
  cardsList: {
    gap: 14,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  vehicleIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTitleCol: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 3,
  },
  registrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  registrationLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  registrationPlate: {
    fontSize: 12,
    color: '#0056A2',
    fontWeight: '700',
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
    alignSelf: 'flex-start',
  },
  statusBadgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 8,
  },
  metaItem: {
    flex: 1,
  },
  metaItemRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  passportBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
    gap: 3,
  },
  passportBadgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
  },
  cardPrimaryButton: {
    flex: 1,
    height: 38,
    backgroundColor: '#0056A2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  cardSecondaryButton: {
    flex: 1,
    height: 38,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardSecondaryButtonText: {
    color: '#0056A2',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 8,
    gap: 6,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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

export default VehiclesScreen;

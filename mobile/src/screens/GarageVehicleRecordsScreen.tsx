import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type GarageVehicleRecordStatus =
  | 'verified'
  | 'pending-link'
  | 'service-due';

export type GarageVehicleRecord = {
  id: string;
  registration: string;
  model: string;
  owner: string;
  lastService: string;
  status: GarageVehicleRecordStatus;
};

export interface GarageVehicleRecordsScreenProps {
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onViewPassportPress?: (vehicleId: string) => void;
  onAddRecordPress?: (vehicleId: string) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

export const GARAGE_VEHICLE_RECORDS: GarageVehicleRecord[] = [
  {
    id: 'veh-wp-abc-1234',
    registration: 'WP ABC-1234',
    model: 'Toyota Aqua',
    owner: 'Kaveesha P.',
    lastService: '21 Sep 2026',
    status: 'verified',
  },
  {
    id: 'veh-wp-cbd-5521',
    registration: 'WP CBD-5521',
    model: 'Suzuki Wagon R',
    owner: 'Nadeesha S.',
    lastService: '02 Sep 2026',
    status: 'pending-link',
  },
  {
    id: 'veh-wp-cde-9080',
    registration: 'WP CDE-9080',
    model: 'Honda Vezel',
    owner: 'Ruwan D.',
    lastService: '18 Jul 2026',
    status: 'service-due',
  },
];

const STATUS_BADGE_CONFIG: Record<
  GarageVehicleRecordStatus,
  {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    bg: string;
    border: string;
    color: string;
  }
> = {
  verified: {
    label: 'Verified',
    icon: 'checkmark-circle',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#15803d',
  },
  'pending-link': {
    label: 'Pending link',
    icon: 'link-outline',
    bg: '#fff7ed',
    border: '#fed7aa',
    color: '#c2410c',
  },
  'service-due': {
    label: 'Service due',
    icon: 'alert-circle-outline',
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#b45309',
  },
};

export const GarageVehicleRecordsScreen: React.FC<
  GarageVehicleRecordsScreenProps
> = ({
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onViewPassportPress,
  onAddRecordPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return GARAGE_VEHICLE_RECORDS;
    }
    return GARAGE_VEHICLE_RECORDS.filter(
      (record) =>
        record.registration.toLowerCase().includes(query) ||
        record.model.toLowerCase().includes(query) ||
        record.owner.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. BACK + PAGE INTRO */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Back to Garage Overview"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>GARAGE / VEHICLES</Text>
          <Text style={styles.pageTitle}>Vehicle records</Text>
          <Text style={styles.pageSubtitle}>
            Find a vehicle passport or add a service record.
          </Text>
        </View>

        {/* 3. VEHICLE SEARCH */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Find a vehicle</Text>
          <View style={styles.searchInputWrap}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#64748b"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search registration or owner"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search registration or owner"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                style={styles.clearIconButton}
                onPress={() => setSearchQuery('')}
                activeOpacity={0.7}
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 4. RECORDS SECTION */}
        <View style={styles.recordsHeaderRow}>
          <Text style={styles.recordsHeading}>Records</Text>
          <View style={styles.recordsCountPill}>
            <Text style={styles.recordsCountText}>
              {filteredRecords.length}{' '}
              {filteredRecords.length === 1 ? 'vehicle' : 'vehicles'}
            </Text>
          </View>
        </View>

        {filteredRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="car-outline" size={24} color="#64748b" />
            </View>
            <Text style={styles.emptyTitle}>
              No matching vehicle records found.
            </Text>
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
              activeOpacity={0.8}
            >
              <Text style={styles.clearSearchButtonText}>Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recordsList}>
            {filteredRecords.map((record) => {
              const badge = STATUS_BADGE_CONFIG[record.status];
              return (
                <View key={record.id} style={styles.recordCard}>
                  {/* Top row: registration + model left, status badge right */}
                  <View style={styles.recordTopRow}>
                    <View style={styles.recordTitleCol}>
                      <Text style={styles.recordRegistration}>
                        {record.registration}
                      </Text>
                      <Text style={styles.recordModel}>{record.model}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: badge.bg,
                          borderColor: badge.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={badge.icon}
                        size={12}
                        color={badge.color}
                      />
                      <Text
                        style={[styles.statusBadgeText, { color: badge.color }]}
                      >
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Owner & last service metadata */}
                  <View style={styles.metaBox}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Owner</Text>
                      <Text style={styles.metaValue} numberOfLines={1}>
                        {record.owner}
                      </Text>
                    </View>

                    <View style={styles.metaDivider} />

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Last service</Text>
                      <Text style={styles.metaValue} numberOfLines={1}>
                        {record.lastService}
                      </Text>
                    </View>
                  </View>

                  {/* Side-by-side actions */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.viewPassportButton}
                      onPress={() => onViewPassportPress?.(record.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={15}
                        color="#0056A2"
                      />
                      <Text
                        style={styles.viewPassportButtonText}
                        numberOfLines={1}
                      >
                        View Passport
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.addRecordButton}
                      onPress={() => onAddRecordPress?.(record.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.addRecordButtonText} numberOfLines={1}>
                        + Add Record
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* 5. GARAGE BOTTOM NAVIGATION (VEHICLES ACTIVE) */}
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
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 18,
  },
  searchLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    color: '#0f172a',
    padding: 0,
  },
  clearIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  recordsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recordsHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  recordsCountPill: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  recordsCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  recordsList: {
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 15,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  recordTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  recordRegistration: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  recordModel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
    flexShrink: 0,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    minWidth: 0,
  },
  metaDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewPassportButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  viewPassportButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  addRecordButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  addRecordButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 14,
  },
  clearSearchButton: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  clearSearchButtonText: {
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

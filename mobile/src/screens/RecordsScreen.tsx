import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type RecordFilter = 'All' | 'Service' | 'Inspection' | 'Maintenance' | 'Ownership';

type RecordCategory = Exclude<RecordFilter, 'All'>;

type VehicleRecordItem = {
  id: string;
  title: string;
  vehicle: string;
  date: string;
  category: RecordCategory;
  garage?: string;
  mileage?: string;
  amount?: string;
  status: 'VERIFIED' | 'PASSED';
};

const FILTER_OPTIONS: RecordFilter[] = [
  'All',
  'Service',
  'Inspection',
  'Maintenance',
  'Ownership',
];

const SUMMARY_METRICS: Array<{
  label: string;
  value: string;
  accentColor: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
}> = [
  {
    label: 'Total Records',
    value: '12',
    accentColor: '#0056A2',
    icon: 'document-text-outline',
    iconBg: '#ebf5ff',
  },
  {
    label: 'Verified Services',
    value: '9',
    accentColor: '#16a34a',
    icon: 'construct-outline',
    iconBg: '#f0fdf4',
  },
  {
    label: 'Inspections',
    value: '2',
    accentColor: '#0891b2',
    icon: 'clipboard-outline',
    iconBg: '#e0f7fa',
  },
  {
    label: 'Other Records',
    value: '1',
    accentColor: '#475569',
    icon: 'shield-checkmark-outline',
    iconBg: '#f1f5f9',
  },
];

const STATIC_RECORDS: VehicleRecordItem[] = [
  {
    id: 'rec-1',
    title: 'Annual safety & electronics diagnostics',
    vehicle: 'Toyota Camry 2022',
    date: '14 Aug 2026',
    category: 'Service',
    garage: 'Apex Tech Service Center',
    mileage: '82,410 km',
    amount: 'LKR 28,500',
    status: 'VERIFIED',
  },
  {
    id: 'rec-2',
    title: 'Cabin filter & AC service',
    vehicle: 'Toyota Camry 2022',
    date: '12 Jul 2026',
    category: 'Service',
    garage: 'Apex Tech Service Center',
    mileage: '80,840 km',
    amount: 'LKR 12,000',
    status: 'VERIFIED',
  },
  {
    id: 'rec-3',
    title: 'Tyre safety check & rotation',
    vehicle: 'Honda CR-V 2020',
    date: '04 May 2026',
    category: 'Maintenance',
    garage: 'Perera Auto Works',
    mileage: '77,920 km',
    amount: 'LKR 8,500',
    status: 'VERIFIED',
  },
  {
    id: 'rec-4',
    title: 'Digital passport ownership verification',
    vehicle: 'Tesla Model S Plaid',
    date: '15 May 2026',
    category: 'Ownership',
    status: 'VERIFIED',
  },
  {
    id: 'rec-5',
    title: 'Vehicle inspection',
    vehicle: 'Toyota Camry 2022',
    date: '03 Mar 2026',
    category: 'Inspection',
    status: 'PASSED',
  },
];

const getCategoryVisual = (
  category: RecordCategory
): {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
} => {
  switch (category) {
    case 'Service':
      return { icon: 'construct-outline', color: '#0056A2', bg: '#ebf5ff' };
    case 'Inspection':
      return { icon: 'clipboard-outline', color: '#0891b2', bg: '#e0f7fa' };
    case 'Maintenance':
      return { icon: 'build-outline', color: '#0d9488', bg: '#f0fdfa' };
    case 'Ownership':
      return { icon: 'shield-checkmark-outline', color: '#16a34a', bg: '#f0fdf4' };
  }
};

export type RecordsScreenProps = {
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onProfilePress: () => void;
  onMaintenanceHistoryPress?: () => void;
  onTransferRecordsPress?: () => void;
  onExpenseTrackingPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

export const RecordsScreen: React.FC<RecordsScreenProps> = ({
  onHomePress,
  onVehiclesPress,
  onProfilePress,
  onMaintenanceHistoryPress,
  onTransferRecordsPress,
  onExpenseTrackingPress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<RecordFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return STATIC_RECORDS.filter((record) => {
      const matchesFilter =
        selectedFilter === 'All' || record.category === selectedFilter;
      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        record.title.toLowerCase().includes(normalizedQuery) ||
        record.vehicle.toLowerCase().includes(normalizedQuery) ||
        (record.garage?.toLowerCase().includes(normalizedQuery) ?? false) ||
        record.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [selectedFilter, searchQuery]);

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
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. PAGE INTRO */}
        <View style={styles.pageHeaderSection}>
          <Text style={styles.pageEyebrow}>VEHICLE RECORDS</Text>
          <View style={styles.titleActionRow}>
            <Text style={styles.pageTitle}>Records</Text>
            <TouchableOpacity
              style={styles.historyActionButton}
              onPress={() => onMaintenanceHistoryPress?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="time-outline" size={14} color="#ffffff" />
              <Text style={styles.historyActionButtonText}>
                View maintenance history
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pageSubtitle}>
            View verified maintenance, service, inspection and digital passport history for your vehicles.
          </Text>

          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity
              style={styles.transferSecondaryButton}
              onPress={() => onTransferRecordsPress?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="swap-horizontal-outline" size={14} color="#0056A2" />
              <Text style={styles.transferSecondaryButtonText}>
                Transfer vehicle records
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transferSecondaryButton}
              onPress={() => onExpenseTrackingPress?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="wallet-outline" size={14} color="#0056A2" />
              <Text style={styles.transferSecondaryButtonText}>
                Expense tracking
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. SUMMARY CARDS (2x2 COMPACT GRID) */}
        <View style={styles.summaryGrid}>
          {SUMMARY_METRICS.map((metric) => (
            <View key={metric.label} style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View style={[styles.summaryIconBox, { backgroundColor: metric.iconBg }]}>
                  <Ionicons name={metric.icon} size={16} color={metric.accentColor} />
                </View>
                <Text style={[styles.summaryValue, { color: metric.accentColor }]}>
                  {metric.value}
                </Text>
              </View>
              <Text style={styles.summaryLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* 4. SEARCH INPUT */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={17}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search records"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search records"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 5. FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          style={styles.filtersScroll}
        >
          {FILTER_OPTIONS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive ? styles.filterChipTextActive : null,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 6. RECORD LIST */}
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={28} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No matching records found.</Text>
            <Text style={styles.emptySubtitle}>
              Try a different keyword or switch back to All records.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedFilter('All');
                setSearchQuery('');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recordsList}>
            {filteredRecords.map((record) => {
              const visual = getCategoryVisual(record.category);
              return (
                <View key={record.id} style={styles.recordCard}>
                  {/* Top row: Icon + Title + Status Badge */}
                  <View style={styles.recordTopRow}>
                    <View style={[styles.recordIconBox, { backgroundColor: visual.bg }]}>
                      <Ionicons name={visual.icon} size={20} color={visual.color} />
                    </View>

                    <View style={styles.recordHeaderTextCol}>
                      <View style={styles.recordTitleBadgeRow}>
                        <Text style={styles.recordTitle}>{record.title}</Text>
                        <View style={styles.statusBadgeGreen}>
                          <Ionicons name="checkmark-circle" size={10} color="#15803d" />
                          <Text style={styles.statusBadgeGreenText}>{record.status}</Text>
                        </View>
                      </View>

                      <View style={styles.vehicleRow}>
                        <Ionicons name="car-outline" size={13} color="#0056A2" />
                        <Text style={styles.vehicleText}>{record.vehicle}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Middle metadata: Date + Garage / Type */}
                  <View style={styles.metaGrid}>
                    <View style={styles.metaPair}>
                      <Text style={styles.metaLabel}>Date</Text>
                      <Text style={styles.metaValue}>{record.date}</Text>
                    </View>

                    <View style={styles.metaPairRight}>
                      <Text style={styles.metaLabel}>
                        {record.garage ? 'Garage' : 'Type'}
                      </Text>
                      <Text style={styles.metaValueRight} numberOfLines={2}>
                        {record.garage || record.category}
                      </Text>
                    </View>
                  </View>

                  {/* Optional Mileage / Amount Footer */}
                  {record.mileage || record.amount ? (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.footerRow}>
                        {record.mileage ? (
                          <View style={styles.mileagePill}>
                            <Ionicons name="speedometer-outline" size={13} color="#475569" />
                            <Text style={styles.mileageText}>{record.mileage}</Text>
                          </View>
                        ) : (
                          <View />
                        )}

                        {record.amount ? (
                          <Text style={styles.amountText}>{record.amount}</Text>
                        ) : null}
                      </View>
                    </>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* 7. BOTTOM NAVIGATION */}
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
          onPress={onVehiclesPress}
          activeOpacity={0.7}
        >
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="document-text" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Records</Text>
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
    paddingBottom: 26,
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  historyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 11,
    height: 34,
    borderRadius: 8,
    gap: 5,
  },
  historyActionButtonText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  transferSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 11,
    height: 32,
    borderRadius: 8,
    gap: 5,
  },
  transferSecondaryButtonText: {
    color: '#0056A2',
    fontSize: 11.5,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 14,
  },
  summaryCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
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
  filtersScroll: {
    marginBottom: 14,
  },
  filtersRow: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  recordsList: {
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recordIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordHeaderTextCol: {
    flex: 1,
  },
  recordTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  recordTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 19,
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
    gap: 3,
  },
  statusBadgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0056A2',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  metaGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  metaPair: {
    flexShrink: 0,
  },
  metaPairRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
  },
  metaValueRight: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    gap: 8,
  },
  mileagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  mileageText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0056A2',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
  },
  resetButton: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 12.5,
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

export default RecordsScreen;

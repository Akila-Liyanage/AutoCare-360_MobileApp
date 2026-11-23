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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HistoryFilterTab = 'all' | 'verified' | 'self';

type WorkPerformedItem = {
  task: string;
  note: string;
};

type MaintenanceRecord = {
  id: string;
  title: string;
  detailTitle: string;
  amount: string;
  dateAndMileage: string;
  source: 'verified' | 'self';
  badgeLabel: 'Verified' | 'Self-Reported';
  ledgerId: string;
  certificationLabel: string;
  garageName: string;
  garageMeta: string;
  technician: string;
  vin: string;
  workPerformed: WorkPerformedItem[];
  invoiceNumber: string;
  paymentMethod: string;
  invoiceFileName: string;
  invoiceFileMeta: string;
};

const MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 'mh-1',
    title: 'Cabin Filter & AC Service',
    detailTitle: 'Cabin Filter & AC Service Record',
    amount: 'LKR 12000.00',
    dateAndMileage: 'Aug 12, 2025 · 34,102 mi',
    source: 'verified',
    badgeLabel: 'Verified',
    ledgerId: '0xf23b486b8882 ... e4a02293',
    certificationLabel: 'Cryptographically Certified',
    garageName: 'Apex Tech Service Center',
    garageMeta: 'Certified Garage Partner #APX-928',
    technician: 'Technician: Sarah Chen',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'Replaced High-Efficiency Cabin Microfilter',
        note: 'OEM Certified Tesla Part',
      },
      {
        task: 'Full Evaporator Core Disinfection & Flush',
        note: 'Authorized Service Agent Program',
      },
      {
        task: 'Odometer Audit Points Logged',
        note: 'Ledger Update Confirmed',
      },
    ],
    invoiceNumber: 'Invoice #INV-2025-0812',
    paymentMethod: 'Paid via Visa ending 4242',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Cryptographic PDF (1.2 MB)',
  },
  {
    id: 'mh-2',
    title: 'Tesla Safety Check',
    detailTitle: 'Tesla Safety Check Record',
    amount: 'LKR 10000.00',
    dateAndMileage: 'May 04, 2025 · 28,450 mi',
    source: 'verified',
    badgeLabel: 'Verified',
    ledgerId: '0x91c4a07e19b3 ... 77d1904f',
    certificationLabel: 'Cryptographically Certified',
    garageName: 'Apex Tech Service Center',
    garageMeta: 'Certified Garage Partner #APX-928',
    technician: 'Technician: Nuwan Perera',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'High-Voltage Battery & Thermal Loop Inspection',
        note: 'Diagnostics Passed',
      },
      {
        task: 'Suspension, Steering & ADAS Sensor Check',
        note: 'Factory Spec Verified',
      },
      {
        task: 'Odometer Audit Points Logged',
        note: 'Ledger Update Confirmed',
      },
    ],
    invoiceNumber: 'Invoice #INV-2025-0504',
    paymentMethod: 'Paid via Visa ending 4242',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Cryptographic PDF (980 KB)',
  },
  {
    id: 'mh-3',
    title: 'Brake Calibration & Pads',
    detailTitle: 'Brake Calibration & Pads Record',
    amount: 'LKR 45000.00',
    dateAndMileage: 'Jan 19, 2025 · 22,110 mi',
    source: 'verified',
    badgeLabel: 'Verified',
    ledgerId: '0x4a78de20c519 ... 30b8c612',
    certificationLabel: 'Cryptographically Certified',
    garageName: 'Perera Auto Works',
    garageMeta: 'Certified Garage Partner #PAW-412',
    technician: 'Technician: Kasun Silva',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'Replaced Front & Rear Ceramic Brake Pads',
        note: 'OEM Certified Parts',
      },
      {
        task: 'Regenerative & Hydraulic Brake Calibration',
        note: 'Bench Tested',
      },
      {
        task: 'Brake Fluid Moisture Verification',
        note: 'Ledger Update Confirmed',
      },
    ],
    invoiceNumber: 'Invoice #INV-2025-0119',
    paymentMethod: 'Paid via Visa ending 4242',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Cryptographic PDF (1.4 MB)',
  },
  {
    id: 'mh-4',
    title: 'Front Motor Coolant Flush',
    detailTitle: 'Front Motor Coolant Flush Record',
    amount: 'LKR 32000.00',
    dateAndMileage: 'Oct 12, 2024 · 14,800 mi',
    source: 'verified',
    badgeLabel: 'Verified',
    ledgerId: '0x7c15fe99a402 ... 91e4a77b',
    certificationLabel: 'Cryptographically Certified',
    garageName: 'Apex Tech Service Center',
    garageMeta: 'Certified Garage Partner #APX-928',
    technician: 'Technician: Sarah Chen',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'Drained & Flushed Front Drive Unit Coolant Loop',
        note: 'OEM Dielectric Coolant',
      },
      {
        task: 'Thermal Valve Pressure & Leak Test',
        note: 'Passed 100% Spec',
      },
      {
        task: 'Odometer Audit Points Logged',
        note: 'Ledger Update Confirmed',
      },
    ],
    invoiceNumber: 'Invoice #INV-2024-1012',
    paymentMethod: 'Paid via Visa ending 4242',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Cryptographic PDF (1.1 MB)',
  },
  {
    id: 'mh-5',
    title: 'Wiper Blade Replacement',
    detailTitle: 'Wiper Blade Replacement Record',
    amount: 'LKR 4500.00',
    dateAndMileage: 'Sep 02, 2024 · 12,950 mi',
    source: 'self',
    badgeLabel: 'Self-Reported',
    ledgerId: '0x2d80ac41b112 ... 66f9012e',
    certificationLabel: 'Owner Logged Entry',
    garageName: 'Owner Self-Reported Entry',
    garageMeta: 'Logged by Vehicle Owner',
    technician: 'Recorded by: David Silva',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'Installed Front All-Weather Aero Wiper Blades',
        note: 'Owner Receipt Logged',
      },
      {
        task: 'Refilled Windshield Washer Reservoir',
        note: 'Self-Reported Note',
      },
    ],
    invoiceNumber: 'Receipt #OWN-2024-0902',
    paymentMethod: 'Paid via Card ending 4242',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Uploaded Receipt PDF (420 KB)',
  },
  {
    id: 'mh-6',
    title: 'Tire Pressure & Sealant Check',
    detailTitle: 'Tire Pressure & Sealant Check Record',
    amount: 'LKR 2200.00',
    dateAndMileage: 'Jun 15, 2024 · 9,800 mi',
    source: 'self',
    badgeLabel: 'Self-Reported',
    ledgerId: '0x6b11fe03d409 ... 12c7448a',
    certificationLabel: 'Owner Logged Entry',
    garageName: 'Owner Self-Reported Entry',
    garageMeta: 'Logged by Vehicle Owner',
    technician: 'Recorded by: David Silva',
    vin: '5YJ3E1EA1NF204819',
    workPerformed: [
      {
        task: 'Checked All 4 Tire Pressures & Tread Depth',
        note: '42 PSI Balanced',
      },
      {
        task: 'Verified Emergency Tire Repair Kit Expiry',
        note: 'Self-Reported Note',
      },
    ],
    invoiceNumber: 'Receipt #OWN-2024-0615',
    paymentMethod: 'Paid via Cash',
    invoiceFileName: 'certified-invoice.pdf',
    invoiceFileMeta: 'Uploaded Receipt PDF (310 KB)',
  },
];

const FILTER_TABS: Array<{ key: HistoryFilterTab; label: string }> = [
  { key: 'all', label: 'All Logs (14)' },
  { key: 'verified', label: 'Verified Garages (12)' },
  { key: 'self', label: 'Self-Reported (2)' },
];

export type MaintenanceHistoryScreenProps = {
  onBack: () => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

export const MaintenanceHistoryScreen: React.FC<MaintenanceHistoryScreenProps> = ({
  onBack,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    MAINTENANCE_RECORDS[0].id
  );

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MAINTENANCE_RECORDS.filter((record) => {
      const matchesTab =
        activeTab === 'all' || record.source === activeTab;
      if (!matchesTab) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        record.title.toLowerCase().includes(query) ||
        record.garageName.toLowerCase().includes(query) ||
        record.invoiceNumber.toLowerCase().includes(query) ||
        record.ledgerId.toLowerCase().includes(query) ||
        record.vin.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, activeTab]);

  const activeRecord = useMemo(() => {
    if (filteredRecords.length === 0) {
      return null;
    }
    return (
      filteredRecords.find((item) => item.id === selectedRecordId) ??
      filteredRecords[0]
    );
  }, [filteredRecords, selectedRecordId]);

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
        {/* 2. BACK + SECURITY CHIP + TITLE */}
        <View style={styles.pageHeaderSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={16} color="#0056A2" />
            <Text style={styles.backButtonText}>Back to Records</Text>
          </TouchableOpacity>

          <View style={styles.blockchainChip}>
            <Ionicons name="shield-checkmark" size={12} color="#15803d" />
            <Text style={styles.blockchainChipText}>AutoCare Blockchain Secured</Text>
          </View>

          <Text style={styles.pageTitle}>
            Maintenance &amp; Service Records History
          </Text>
        </View>

        {/* 3. TOP SEARCH */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={17}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search VINs, service records..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search VINs and service records"
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

        {/* 4. FILTER TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
          style={styles.filterTabsScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[
                  styles.filterTab,
                  isSelected ? styles.filterTabActive : null,
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isSelected ? styles.filterTabTextActive : null,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 5. SERVICE RECORD LIST + EXPANDED DETAIL */}
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={26} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No matching service records.</Text>
            <Text style={styles.emptySubtitle}>
              Try another keyword or reset to All Logs.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Summary List */}
            <View style={styles.summaryList}>
              {filteredRecords.map((record) => {
                const isSelected = activeRecord?.id === record.id;
                const isVerified = record.source === 'verified';

                return (
                  <Pressable
                    key={record.id}
                    style={[
                      styles.summaryCard,
                      isSelected ? styles.summaryCardSelected : null,
                    ]}
                    onPress={() => setSelectedRecordId(record.id)}
                  >
                    <View style={styles.summaryTopRow}>
                      <Text style={styles.summaryTitle}>{record.title}</Text>
                      <View
                        style={[
                          styles.badgePill,
                          isVerified ? styles.badgePillGreen : styles.badgePillAmber,
                        ]}
                      >
                        <Ionicons
                          name={isVerified ? 'checkmark-circle' : 'person-outline'}
                          size={11}
                          color={isVerified ? '#15803d' : '#b45309'}
                        />
                        <Text
                          style={[
                            styles.badgePillText,
                            isVerified
                              ? styles.badgePillTextGreen
                              : styles.badgePillTextAmber,
                          ]}
                        >
                          {record.badgeLabel}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.summaryBottomRow}>
                      <Text style={styles.summaryMeta}>{record.dateAndMileage}</Text>
                      <Text style={styles.summaryAmount}>{record.amount}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* 6. EXPANDED RECORD DETAIL CARD */}
            {activeRecord ? (
              <View style={styles.detailCard}>
                {/* Detail Header */}
                <View style={styles.detailHeaderBlock}>
                  <View style={styles.certifiedBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#15803d" />
                    <Text style={styles.certifiedBadgeText}>
                      {activeRecord.certificationLabel}
                    </Text>
                  </View>

                  <Text style={styles.detailTitle}>{activeRecord.detailTitle}</Text>

                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerLabel}>Service Ledger ID: </Text>
                    <Text style={styles.ledgerHash} numberOfLines={1}>
                      {activeRecord.ledgerId}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Garage Section */}
                <View style={styles.garageBox}>
                  <View style={styles.garageIconCircle}>
                    <Ionicons name="construct-outline" size={18} color="#0056A2" />
                  </View>
                  <View style={styles.garageTextCol}>
                    <Text style={styles.garageName}>{activeRecord.garageName}</Text>
                    <Text style={styles.garageSub}>{activeRecord.garageMeta}</Text>
                    <Text style={styles.garageTech}>{activeRecord.technician}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* 7. WORK PERFORMED & PARTS SWAPPED */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionEyebrow}>
                    WORK PERFORMED &amp; PARTS SWAPPED
                  </Text>

                  {activeRecord.workPerformed.map((item, idx) => (
                    <View
                      key={`${activeRecord.id}-work-${idx}`}
                      style={[
                        styles.workRow,
                        idx < activeRecord.workPerformed.length - 1
                          ? styles.workRowBorder
                          : null,
                      ]}
                    >
                      <View style={styles.workTaskRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={15}
                          color="#16a34a"
                          style={styles.workCheckIcon}
                        />
                        <Text style={styles.workTaskText}>{item.task}</Text>
                      </View>
                      <Text style={styles.workNoteText}>{item.note}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                {/* 8. BILLING & PAYMENT STATUS */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionEyebrow}>
                    BILLING &amp; PAYMENT STATUS
                  </Text>

                  <View style={styles.billingBox}>
                    <View style={styles.billingTopRow}>
                      <Text style={styles.billingAmount}>
                        {activeRecord.amount} Total
                      </Text>
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidBadgeText}>PAID</Text>
                      </View>
                    </View>

                    <Text style={styles.billingInvoice}>
                      {activeRecord.invoiceNumber}
                    </Text>
                    <Text style={styles.billingPayment}>
                      {activeRecord.paymentMethod}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* 9. CERTIFIED INVOICE FILE CARD */}
                <View style={styles.invoiceFileCard}>
                  <View style={styles.pdfIconBox}>
                    <Ionicons name="document-text" size={20} color="#dc2626" />
                  </View>
                  <View style={styles.pdfTextCol}>
                    <Text style={styles.pdfFileName}>
                      {activeRecord.invoiceFileName}
                    </Text>
                    <Text style={styles.pdfFileMeta}>
                      {activeRecord.invoiceFileMeta}
                    </Text>
                  </View>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#0056A2" />
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* 10. BOTTOM NAVIGATION (RECORDS VISUALLY ACTIVE) */}
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

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onRecordsPress}
          activeOpacity={0.7}
        >
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
    paddingTop: 16,
    paddingBottom: 28,
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
  blockchainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    gap: 5,
    marginBottom: 8,
  },
  blockchainChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  pageTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
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
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  filterTabsScroll: {
    marginBottom: 14,
  },
  filterTabsRow: {
    gap: 8,
    paddingRight: 8,
  },
  filterTab: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterTabActive: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  summaryList: {
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryCardSelected: {
    borderColor: '#0056A2',
    borderWidth: 1.5,
    backgroundColor: '#f8fcff',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  summaryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
    gap: 3,
  },
  badgePillGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  badgePillAmber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgePillTextGreen: {
    color: '#15803d',
  },
  badgePillTextAmber: {
    color: '#b45309',
  },
  summaryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryMeta: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  detailHeaderBlock: {
    marginBottom: 14,
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    gap: 4,
    marginBottom: 8,
  },
  certifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803d',
  },
  detailTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ledgerLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  ledgerHash: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontWeight: '700',
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  garageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  garageIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageTextCol: {
    flex: 1,
  },
  garageName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  garageSub: {
    fontSize: 12,
    color: '#0056A2',
    fontWeight: '600',
    marginBottom: 2,
  },
  garageTech: {
    fontSize: 12,
    color: '#64748b',
  },
  sectionBlock: {
    paddingVertical: 14,
  },
  sectionEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#64748b',
    marginBottom: 10,
  },
  workRow: {
    paddingVertical: 8,
  },
  workRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  workTaskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginBottom: 3,
  },
  workCheckIcon: {
    marginTop: 1,
  },
  workTaskText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 18,
  },
  workNoteText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0056A2',
    paddingLeft: 22,
  },
  billingBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 13,
  },
  billingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },
  billingAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  paidBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  paidBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803d',
  },
  billingInvoice: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
    marginBottom: 2,
  },
  billingPayment: {
    fontSize: 12,
    color: '#64748b',
  },
  invoiceFileCard: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fcff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12,
  },
  pdfIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfTextCol: {
    flex: 1,
  },
  pdfFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  pdfFileMeta: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 1,
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
    width: 54,
    height: 54,
    borderRadius: 27,
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

export default MaintenanceHistoryScreen;

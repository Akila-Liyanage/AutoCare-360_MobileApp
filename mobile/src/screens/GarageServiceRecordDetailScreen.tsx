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

export type GarageServiceRecordStatus = 'committed' | 'pending';

export type GarageServiceRecordPart = {
  name: string;
  badge: string;
};

export type GarageServiceRecordDocument = {
  id: string;
  fileName: string;
  label: string;
};

export type GarageServiceRecord = {
  id: string;
  recordCode: string;
  vehicleModel: string;
  registration: string;
  odometer: string;
  serviceTitle: string;
  serviceDate: string;
  garage: string;
  technician: string;
  status: GarageServiceRecordStatus;
  labourCost: string;
  partsCost: string;
  totalCost: string;
  workItems: string[];
  partsReplaced: GarageServiceRecordPart[];
  documents: GarageServiceRecordDocument[];
};

export interface GarageServiceRecordDetailScreenProps {
  record?: GarageServiceRecord | null;
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onViewDocumentPress?: (documentId: string) => void;
  onViewVehiclePassportPress?: (record: GarageServiceRecord) => void;
  onAddAnotherRecordPress?: (record: GarageServiceRecord) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

export const GARAGE_SERVICE_RECORDS: GarageServiceRecord[] = [
  {
    id: 'entry-wp-abc-1234',
    recordCode: 'SRV-2026-0921',
    vehicleModel: 'Toyota Aqua',
    registration: 'WP ABC-1234',
    odometer: '85,240 km',
    serviceTitle: 'Engine Oil & Filter Swap',
    serviceDate: '21 Sep 2026',
    garage: 'Perera Auto Works',
    technician: 'Indika Perera · TEC-2051',
    status: 'committed',
    labourCost: 'LKR 18,500',
    partsCost: 'LKR 64,900',
    totalCost: 'LKR 83,400',
    workItems: [
      'Engine oil replaced',
      'Oil filter replaced',
      'Air filter inspected',
      'Cooling system inspected',
      'Odometer verified',
    ],
    partsReplaced: [
      { name: 'Toyota 0W-20 synthetic oil', badge: 'OEM' },
      { name: 'Oil filter', badge: 'OEM' },
      { name: 'Air filter', badge: 'Approved' },
    ],
    documents: [
      { id: 'doc-inv-0921', fileName: 'invoice-0921.pdf', label: 'Invoice' },
      {
        id: 'doc-insp-0921',
        fileName: 'inspection-report.pdf',
        label: 'Inspection report',
      },
    ],
  },
  {
    id: 'entry-wp-cas-9988',
    recordCode: 'SRV-2026-0918',
    vehicleModel: 'Honda Vezel',
    registration: 'WP CAS-9988',
    odometer: '112,450 km',
    serviceTitle: 'Dual Clutch Fluid Replacement',
    serviceDate: '18 Sep 2026',
    garage: 'Perera Auto Works',
    technician: 'Chamara Silva · TEC-2084',
    status: 'committed',
    labourCost: 'LKR 22,000',
    partsCost: 'LKR 48,500',
    totalCost: 'LKR 70,500',
    workItems: [
      'Dual clutch fluid drained and refilled',
      'Clutch actuator pressure checked',
      'Transmission lines inspected for leaks',
      'Road test and gear shift check completed',
      'Odometer verified',
    ],
    partsReplaced: [
      { name: 'Honda i-DCD dual clutch fluid', badge: 'OEM' },
      { name: 'Drain plug crush washer', badge: 'OEM' },
      { name: 'Transmission breather seal', badge: 'Approved' },
    ],
    documents: [
      { id: 'doc-inv-0918', fileName: 'invoice-0918.pdf', label: 'Invoice' },
      {
        id: 'doc-insp-0918',
        fileName: 'inspection-report.pdf',
        label: 'Inspection report',
      },
    ],
  },
  {
    id: 'entry-wp-cad-1212',
    recordCode: 'SRV-2026-0915',
    vehicleModel: 'Suzuki Wagon R',
    registration: 'WP CAD-1212',
    odometer: '42,100 km',
    serviceTitle: 'Spark Plug Configuration',
    serviceDate: '15 Sep 2026',
    garage: 'Perera Auto Works',
    technician: 'Nuwan Bandara · TEC-2109',
    status: 'pending',
    labourCost: 'LKR 9,500',
    partsCost: 'LKR 18,900',
    totalCost: 'LKR 28,400',
    workItems: [
      'Ignition coils removed and inspected',
      'Iridium spark plugs replaced and gapped',
      'Idle RPM stability verified',
      'OBD misfire check completed',
      'Odometer verified',
    ],
    partsReplaced: [
      { name: 'NGK Iridium spark plug set', badge: 'OEM' },
      { name: 'Ignition coil boot seals', badge: 'Approved' },
    ],
    documents: [
      { id: 'doc-inv-0915', fileName: 'invoice-0915.pdf', label: 'Invoice' },
      {
        id: 'doc-insp-0915',
        fileName: 'inspection-report.pdf',
        label: 'Inspection report',
      },
    ],
  },
];

export function findGarageServiceRecordById(
  entryId: string
): GarageServiceRecord {
  return (
    GARAGE_SERVICE_RECORDS.find((entry) => entry.id === entryId) ??
    GARAGE_SERVICE_RECORDS[0]
  );
}

export const GarageServiceRecordDetailScreen: React.FC<
  GarageServiceRecordDetailScreenProps
> = ({
  record,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onViewDocumentPress,
  onViewVehiclePassportPress,
  onAddAnotherRecordPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const activeRecord = record ?? GARAGE_SERVICE_RECORDS[0];
  const isCommitted = activeRecord.status === 'committed';
  const statusLabel = isCommitted ? 'Committed' : 'Pending SMS code';

  const detailRows: Array<{ label: string; value: string; accentColor?: string }> = [
    { label: 'Service date', value: activeRecord.serviceDate },
    { label: 'Garage', value: activeRecord.garage },
    { label: 'Technician', value: activeRecord.technician },
    { label: 'Odometer', value: activeRecord.odometer },
    { label: 'Record ID', value: activeRecord.recordCode },
    {
      label: 'Status',
      value: statusLabel,
      accentColor: isCommitted ? '#15803d' : '#b45309',
    },
  ];

  const verificationRows: Array<{
    label: string;
    value: string;
    isPositive: boolean;
  }> = [
    { label: 'Garage identity', value: 'Verified', isPositive: true },
    { label: 'Technician identity', value: 'Verified', isPositive: true },
    { label: 'Odometer sequence', value: 'Consistent', isPositive: true },
    {
      label: 'Owner authorization',
      value: isCommitted ? 'Confirmed' : 'Pending SMS code',
      isPositive: isCommitted,
    },
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
          accessibilityLabel="Back to Garage Overview"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>GARAGE / SERVICE RECORD</Text>
          <Text style={styles.pageTitle}>Service record</Text>
          <Text style={styles.pageSubtitle}>
            Verified maintenance details, work performed and service costs.
          </Text>
        </View>

        {/* 3. SERVICE HERO CARD */}
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
                isCommitted
                  ? styles.heroStatusPillCommitted
                  : styles.heroStatusPillPending,
              ]}
            >
              <Ionicons
                name={isCommitted ? 'checkmark-circle' : 'time-outline'}
                size={13}
                color={isCommitted ? '#15803d' : '#b45309'}
              />
              <Text
                style={[
                  styles.heroStatusPillText,
                  isCommitted
                    ? styles.heroStatusTextCommitted
                    : styles.heroStatusTextPending,
                ]}
              >
                {statusLabel}
              </Text>
            </View>

            <View style={styles.heroBadgeIcon}>
              <Ionicons name="clipboard-outline" size={18} color="#bae6fd" />
            </View>
          </View>

          <Text style={styles.heroVehicle}>{activeRecord.vehicleModel}</Text>
          <Text style={styles.heroRegistration}>
            {activeRecord.registration}
          </Text>

          <View style={styles.heroMetaBox}>
            <View style={styles.heroMetaRow}>
              <Ionicons name="build-outline" size={14} color="#bae6fd" />
              <Text style={styles.heroMetaText}>
                {activeRecord.serviceTitle}
              </Text>
            </View>
            <View style={styles.heroMetaRow}>
              <Ionicons name="speedometer-outline" size={14} color="#86efac" />
              <Text style={styles.heroMetaText}>{activeRecord.odometer}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 4. SERVICE DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-text-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Service details</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {detailRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    row.accentColor ? { color: row.accentColor } : null,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. WORK PERFORMED CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="checkmark-done-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Work performed</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.checklist}>
            {activeRecord.workItems.map((item) => (
              <View key={item} style={styles.checklistRow}>
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text style={styles.checklistText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. PARTS REPLACED CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="cube-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Parts replaced</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.partsList}>
            {activeRecord.partsReplaced.map((part, idx) => (
              <View key={part.name}>
                <View style={styles.partRow}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <View style={styles.partBadge}>
                    <Text style={styles.partBadgeText}>{part.badge}</Text>
                  </View>
                </View>
                {idx < activeRecord.partsReplaced.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* 7. SERVICE COSTS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="calculator-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Service costs</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.costsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Labour</Text>
              <Text style={styles.detailValue}>{activeRecord.labourCost}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Parts</Text>
              <Text style={styles.detailValue}>{activeRecord.partsCost}</Text>
            </View>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{activeRecord.totalCost}</Text>
          </View>
        </View>

        {/* 8. RECORD VERIFICATION CARD */}
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
              <Text style={styles.cardTitle}>Record verification</Text>
            </View>

            <View style={styles.integrityBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#15803d" />
              <Text style={styles.integrityBadgeText}>
                Record integrity checked
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {verificationRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <View style={styles.verifyValueRow}>
                  <Ionicons
                    name={row.isPositive ? 'checkmark-circle' : 'time-outline'}
                    size={14}
                    color={row.isPositive ? '#15803d' : '#b45309'}
                  />
                  <Text
                    style={[
                      styles.verifyValueText,
                      row.isPositive
                        ? styles.verifyPositiveText
                        : styles.verifyPendingText,
                    ]}
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 9. ATTACHED DOCUMENTS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-attach-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Attached documents</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.docsList}>
            {activeRecord.documents.map((doc, idx) => (
              <View key={doc.id}>
                <View style={styles.docRow}>
                  <View style={styles.docIconWrap}>
                    <Ionicons
                      name="document-text-outline"
                      size={17}
                      color="#0056A2"
                    />
                  </View>

                  <View style={styles.docInfoCol}>
                    <Text style={styles.docFileName} numberOfLines={1}>
                      {doc.fileName}
                    </Text>
                    <Text style={styles.docLabel}>{doc.label}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.docViewButton}
                    onPress={() => onViewDocumentPress?.(doc.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.docViewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
                {idx < activeRecord.documents.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* 10. ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => onViewVehiclePassportPress?.(activeRecord)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#0056A2"
            />
            <Text style={styles.secondaryActionButtonText}>
              View vehicle passport
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => onAddAnotherRecordPress?.(activeRecord)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionButtonText}>
              + Add another service record
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 11. GARAGE BOTTOM NAVIGATION (JOBS ACTIVE) */}
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
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onJobsPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Jobs"
        >
          <Ionicons name="clipboard" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Jobs</Text>
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
  heroStatusPillCommitted: {
    backgroundColor: '#dcfce7',
  },
  heroStatusPillPending: {
    backgroundColor: '#fef3c7',
  },
  heroStatusPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  heroStatusTextCommitted: {
    color: '#15803d',
  },
  heroStatusTextPending: {
    color: '#b45309',
  },
  heroBadgeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVehicle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  heroRegistration: {
    fontSize: 14,
    fontWeight: '700',
    color: '#bae6fd',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  heroMetaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    flexShrink: 1,
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
    marginVertical: 10,
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
  checklist: {
    gap: 10,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  checklistText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#1e293b',
  },
  partsList: {
    gap: 0,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  partName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  partBadge: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  partBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  costsList: {
    gap: 9,
    marginBottom: 13,
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  totalLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#004684',
  },
  totalValue: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#003566',
  },
  integrityBadge: {
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
  integrityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  verifyValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  verifyValueText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  verifyPositiveText: {
    color: '#15803d',
  },
  verifyPendingText: {
    color: '#b45309',
  },
  docsList: {
    gap: 0,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  docFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  docLabel: {
    fontSize: 11.5,
    color: '#64748b',
  },
  docViewButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 13,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docViewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056A2',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
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

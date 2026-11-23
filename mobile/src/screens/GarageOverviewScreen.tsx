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

export type GarageTab = 'garage' | 'vehicles' | 'jobs' | 'billing';

export interface GarageOverviewScreenProps {
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onViewProfilePress?: () => void;
  onAddServiceEntryPress?: () => void;
  onReviewScanPress?: () => void;
  onViewServiceRecordPress?: (entryId: string) => void;
  onVehicleRecordsPress?: () => void;
  onQuotationPress?: () => void;
  onInvoicePress?: () => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

interface GarageMetricCard {
  id: string;
  label: string;
  value: string;
  subtext: string;
  subtextTone: 'positive' | 'neutral' | 'warning';
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
}

interface VerifiedServiceEntry {
  id: string;
  vehicleName: string;
  plateNumber: string;
  summary: string;
  statusLabel: string;
  statusTone: 'committed' | 'pending';
}

const GARAGE_METRICS: GarageMetricCard[] = [
  {
    id: 'total-customers',
    label: 'Total customers',
    value: '125',
    subtext: '↑ 12% New this month',
    subtextTone: 'positive',
    icon: 'people-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
  },
  {
    id: 'vehicles-serviced',
    label: 'Vehicles serviced',
    value: '240',
    subtext: 'LKR 4.2M Ledger Value',
    subtextTone: 'neutral',
    icon: 'car-sport-outline',
    iconColor: '#0891b2',
    iconBg: '#e0f7fa',
  },
  {
    id: 'pending-entries',
    label: 'Pending entries',
    value: '18',
    subtext: 'Awaiting Owner Signature OTP',
    subtextTone: 'warning',
    icon: 'time-outline',
    iconColor: '#d97706',
    iconBg: '#fffbeb',
  },
  {
    id: 'monthly-revenue',
    label: 'Monthly revenue',
    value: 'Rs. 850,000',
    subtext: 'On track for targets',
    subtextTone: 'positive',
    icon: 'cash-outline',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
  },
];

const RECENT_VERIFIED_ENTRIES: VerifiedServiceEntry[] = [
  {
    id: 'entry-wp-abc-1234',
    vehicleName: 'Toyota Aqua',
    plateNumber: 'WP ABC-1234',
    summary: '85,240 km · Engine Oil & Filter Swap',
    statusLabel: 'Committed',
    statusTone: 'committed',
  },
  {
    id: 'entry-wp-cas-9988',
    vehicleName: 'Honda Vezel',
    plateNumber: 'WP CAS-9988',
    summary: '112,450 km · Dual Clutch Fluid Replacement',
    statusLabel: 'Committed',
    statusTone: 'committed',
  },
  {
    id: 'entry-wp-cad-1212',
    vehicleName: 'Suzuki Wagon R',
    plateNumber: 'WP CAD-1212',
    summary: '42,100 km · Spark Plug Configuration',
    statusLabel: 'Pending SMS code',
    statusTone: 'pending',
  },
];

export const GarageOverviewScreen: React.FC<GarageOverviewScreenProps> = ({
  onNotificationsPress,
  onMenuPress,
  onViewProfilePress,
  onAddServiceEntryPress,
  onReviewScanPress,
  onViewServiceRecordPress,
  onVehicleRecordsPress,
  onQuotationPress,
  onInvoicePress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
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
          <Text style={styles.eyebrow}>BR3 / GARAGE SERVICE MANAGEMENT</Text>
          <Text style={styles.pageTitle}>Garage overview</Text>
          <Text style={styles.pageSubtitle}>
            Service records, diagnostic scanning and your workshop at a glance.
          </Text>
        </View>

        {/* 3. GARAGE BUSINESS CARD */}
        <LinearGradient
          colors={['#003566', '#004684', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.garageCard}
        >
          <View style={styles.garageCardTopRow}>
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={13} color="#15803d" />
              <Text style={styles.verifiedPillText}>Verified business</Text>
            </View>

            <View style={styles.garageBadgeIcon}>
              <Ionicons name="construct-outline" size={18} color="#bae6fd" />
            </View>
          </View>

          <Text style={styles.garageName}>Perera Auto Works</Text>

          <View style={styles.garageMetaGroup}>
            <View style={styles.garageMetaRow}>
              <Ionicons name="location-outline" size={14} color="#bae6fd" />
              <Text style={styles.garageMetaText}>BR-03 · Colombo 05</Text>
            </View>
            <View style={styles.garageMetaRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#86efac" />
              <Text style={styles.garageMetaText}>
                Verified through 31 Dec 2026
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => onViewProfilePress?.()}
            activeOpacity={0.85}
          >
            <Text style={styles.viewProfileButtonText}>View profile</Text>
            <Ionicons name="arrow-forward" size={16} color="#004684" />
          </TouchableOpacity>
        </LinearGradient>

        {/* 4. PRIMARY ACTION */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={() => onAddServiceEntryPress?.()}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryActionText}>+ Add Service Entry</Text>
        </TouchableOpacity>

        {/* 5. GARAGE METRICS GRID (2x2) */}
        <View style={styles.metricsGrid}>
          {GARAGE_METRICS.map((metric) => {
            const subtextStyle =
              metric.subtextTone === 'positive'
                ? styles.metricSubtextPositive
                : metric.subtextTone === 'warning'
                ? styles.metricSubtextWarning
                : styles.metricSubtextNeutral;

            return (
              <View key={metric.id} style={styles.metricCard}>
                <View
                  style={[styles.metricIconBox, { backgroundColor: metric.iconBg }]}
                >
                  <Ionicons name={metric.icon} size={17} color={metric.iconColor} />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text
                  style={styles.metricValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {metric.value}
                </Text>
                <Text style={[styles.metricSubtext, subtextStyle]}>
                  {metric.subtext}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 6. ACTIVE AI OCR QUEUE */}
        <View style={styles.sectionCard}>
          <View style={styles.ocrHeaderRow}>
            <View style={styles.ocrHeaderLeft}>
              <View style={styles.ocrIconBox}>
                <Ionicons name="scan-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardHeading}>Active AI OCR queue</Text>
            </View>
            <View style={styles.ocrPercentPill}>
              <Text style={styles.ocrPercentText}>88%</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.ocrItemTitle}>Invoice Scan #0492</Text>
          <Text style={styles.ocrItemSubtitle}>
            Toyota Prius (WP CAR-8282) · Processing 88%
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '88%' }]} />
          </View>

          <View style={styles.warningPanel}>
            <Ionicons
              name="warning-outline"
              size={18}
              color="#b45309"
              style={styles.warningIcon}
            />
            <View style={styles.warningTextCol}>
              <Text style={styles.warningTitle}>OCR Validation Warning</Text>
              <Text style={styles.warningBody}>
                Manual check required for odometer match.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reviewScanButton}
            onPress={() => onReviewScanPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={15} color="#0056A2" />
            <Text style={styles.reviewScanButtonText}>Review scan</Text>
          </TouchableOpacity>
        </View>

        {/* 7. RECENT VERIFIED ENTRIES */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent verified entries</Text>
            <Text style={styles.sectionCountText}>
              {RECENT_VERIFIED_ENTRIES.length} latest
            </Text>
          </View>

          <View style={styles.entriesList}>
            {RECENT_VERIFIED_ENTRIES.map((entry) => {
              const isCommitted = entry.statusTone === 'committed';
              return (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryTopRow}>
                    <View style={styles.entryTitleCol}>
                      <Text style={styles.entryVehicleName}>
                        {entry.vehicleName}
                      </Text>
                      <Text style={styles.entryPlate}>{entry.plateNumber}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        isCommitted
                          ? styles.statusBadgeCommitted
                          : styles.statusBadgePending,
                      ]}
                    >
                      <Ionicons
                        name={
                          isCommitted
                            ? 'checkmark-circle'
                            : 'time-outline'
                        }
                        size={12}
                        color={isCommitted ? '#15803d' : '#b45309'}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isCommitted
                            ? styles.statusBadgeTextCommitted
                            : styles.statusBadgeTextPending,
                        ]}
                      >
                        {entry.statusLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.entrySummary}>{entry.summary}</Text>

                  <TouchableOpacity
                    style={styles.entryActionButton}
                    onPress={() => onViewServiceRecordPress?.(entry.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.entryActionButtonText}>
                      View service record
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={15}
                      color="#0056A2"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* 8. VEHICLE RECORDS CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.vehicleRecordsHeader}>
            <View style={styles.vehicleRecordsIconBox}>
              <Ionicons name="folder-open-outline" size={19} color="#0056A2" />
            </View>
            <View style={styles.vehicleRecordsTextCol}>
              <Text style={styles.cardHeading}>Vehicle records</Text>
              <Text style={styles.vehicleRecordsSubtitle}>
                Passports, owners and the latest service status.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.vehicleRecordsButton}
            onPress={() => onVehicleRecordsPress?.()}
            activeOpacity={0.85}
          >
            <Text style={styles.vehicleRecordsButtonText}>
              View vehicle records
            </Text>
            <Ionicons name="arrow-forward" size={15} color="#0056A2" />
          </TouchableOpacity>
        </View>

        {/* 9. QUICK ACTIONS (QUOTATION / INVOICE) */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => onQuotationPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={17} color="#0056A2" />
            <Text style={styles.quickActionButtonText}>Quotation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButtonPrimary}
            onPress={() => onInvoicePress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="receipt-outline" size={17} color="#ffffff" />
            <Text style={styles.quickActionButtonPrimaryText}>Invoice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 10. GARAGE BOTTOM NAVIGATION */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onGaragePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Garage"
        >
          <Ionicons name="construct" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Garage</Text>
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
    paddingTop: 18,
    paddingBottom: 24,
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
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  garageCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#003566',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  garageCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  verifiedPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803d',
  },
  garageBadgeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageName: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  garageMetaGroup: {
    gap: 6,
    marginBottom: 16,
  },
  garageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  garageMetaText: {
    fontSize: 12.5,
    lineHeight: 17,
    color: '#e0f2fe',
    fontWeight: '500',
    flexShrink: 1,
  },
  viewProfileButton: {
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewProfileButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#004684',
  },
  primaryActionButton: {
    height: 48,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '48.3%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 13,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  metricSubtextPositive: {
    color: '#15803d',
  },
  metricSubtextWarning: {
    color: '#b45309',
  },
  metricSubtextNeutral: {
    color: '#475569',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  ocrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  ocrHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  ocrIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 1,
  },
  ocrPercentPill: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  ocrPercentText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0056A2',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  ocrItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  ocrItemSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0056A2',
    borderRadius: 999,
  },
  warningPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 12,
    gap: 9,
    marginBottom: 12,
  },
  warningIcon: {
    marginTop: 1,
  },
  warningTextCol: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  warningBody: {
    fontSize: 12,
    lineHeight: 17,
    color: '#b45309',
  },
  reviewScanButton: {
    height: 40,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reviewScanButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056A2',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  entriesList: {
    gap: 10,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  entryTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  entryTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  entryVehicleName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  entryPlate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056A2',
    letterSpacing: 0.3,
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
  statusBadgeCommitted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  statusBadgePending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeTextCommitted: {
    color: '#15803d',
  },
  statusBadgeTextPending: {
    color: '#b45309',
  },
  entrySummary: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 12,
  },
  entryActionButton: {
    height: 38,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  entryActionButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  vehicleRecordsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 14,
  },
  vehicleRecordsIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleRecordsTextCol: {
    flex: 1,
  },
  vehicleRecordsSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginTop: 3,
  },
  vehicleRecordsButton: {
    height: 42,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  vehicleRecordsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056A2',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  quickActionButton: {
    flex: 1,
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  quickActionButtonPrimary: {
    flex: 1,
    height: 46,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionButtonPrimaryText: {
    fontSize: 13.5,
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

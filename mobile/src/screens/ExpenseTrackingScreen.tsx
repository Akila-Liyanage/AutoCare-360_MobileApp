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

type SummaryMetricCard = {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  valueColor: string;
};

type CategorySpendItem = {
  id: string;
  label: string;
  amount: string;
  percent: number;
  barColor: string;
};

type UpcomingExpenseItem = {
  id: string;
  title: string;
  meta: string;
  amount: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
};

const SUMMARY_CARDS: SummaryMetricCard[] = [
  {
    id: 'total-spend',
    label: 'Total spend in 2026',
    value: 'LKR 172,000',
    subtext: 'LKR 169,000 service · LKR 3,000 recurring',
    icon: 'wallet-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
    valueColor: '#0f172a',
  },
  {
    id: 'avg-service',
    label: 'Average service cost',
    value: 'LKR 42,250',
    subtext: 'Across 4 verified service invoices',
    icon: 'stats-chart-outline',
    iconColor: '#0891b2',
    iconBg: '#e0f7fa',
    valueColor: '#0f172a',
  },
  {
    id: 'paid-invoices',
    label: 'Paid invoices',
    value: '5 of 5',
    subtext: 'No overdue payments',
    icon: 'checkmark-done-circle-outline',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
    valueColor: '#15803d',
  },
  {
    id: 'upcoming-90',
    label: 'Upcoming 90 days',
    value: 'LKR 38,500',
    subtext: 'AI estimate · 2 expected costs',
    icon: 'calendar-outline',
    iconColor: '#d97706',
    iconBg: '#fffbeb',
    valueColor: '#0f172a',
  },
];

const CATEGORY_SPEND: CategorySpendItem[] = [
  {
    id: 'repairs',
    label: 'Repairs & parts',
    amount: 'LKR 120,000',
    percent: 70,
    barColor: '#0056A2',
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics',
    amount: 'LKR 28,500',
    percent: 17,
    barColor: '#0891b2',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    amount: 'LKR 12,000',
    percent: 7,
    barColor: '#0d9488',
  },
  {
    id: 'tyres',
    label: 'Tyres & safety',
    amount: 'LKR 8,500',
    percent: 5,
    barColor: '#16a34a',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    amount: 'LKR 3,000',
    percent: 2,
    barColor: '#64748b',
  },
];

const RECURRING_AND_UPCOMING: UpcomingExpenseItem[] = [
  {
    id: 'sub-1',
    title: 'Connected services subscription',
    meta: '01 Oct 2026 · recurring monthly',
    amount: 'LKR 3,000',
    icon: 'repeat-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
  },
  {
    id: 'tyre-res-2',
    title: 'Tyre replacement reserve',
    meta: 'AI estimate · due near 86,000 km',
    amount: 'LKR 35,500',
    icon: 'sparkles-outline',
    iconColor: '#d97706',
    iconBg: '#fffbeb',
  },
];

export type ExpenseTrackingScreenProps = {
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onNotificationsPress?: () => void;
  onViewLedgerPress?: () => void;
  onExportCsvPress?: () => void;
  onAddExpensePress?: () => void;
  onMenuPress?: () => void;
};

export const ExpenseTrackingScreen: React.FC<ExpenseTrackingScreenProps> = ({
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onNotificationsPress,
  onViewLedgerPress,
  onExportCsvPress,
  onAddExpensePress,
  onMenuPress,
}) => {
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
        {/* 2. PAGE HEADER + TOP ACTIONS */}
        <View style={styles.pageHeaderSection}>
          <Text style={styles.pageEyebrow}>OWNER FINANCES</Text>
          <Text style={styles.pageTitle}>Expense tracking</Text>
          <Text style={styles.pageSubtitle}>
            Track verified service costs, invoices, recurring charges and upcoming owner expenses.
          </Text>

          <View style={styles.topActionsRow}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => onExportCsvPress?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={14} color="#475569" />
              <Text style={styles.exportButtonText}>Export CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addExpenseButton}
              onPress={() => onAddExpensePress?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={styles.addExpenseButtonText}>Add expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. FOUR COMPACT SUMMARY CARDS */}
        <View style={styles.summaryGrid}>
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={styles.summaryCard}>
              <View style={[styles.summaryIconBox, { backgroundColor: card.iconBg }]}>
                <Ionicons name={card.icon} size={17} color={card.iconColor} />
              </View>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={[styles.summaryValue, { color: card.valueColor }]}>
                {card.value}
              </Text>
              <Text style={styles.summarySubtext}>{card.subtext}</Text>
            </View>
          ))}
        </View>

        {/* 4. LARGE TOTAL SPEND CARD */}
        <View style={styles.heroSpendCard}>
          <View style={styles.heroSpendHeaderRow}>
            <View style={styles.heroSpendIconCircle}>
              <Ionicons name="receipt-outline" size={18} color="#0056A2" />
            </View>
            <View style={styles.heroSpendBadge}>
              <Text style={styles.heroSpendBadgeText}>2026 VERIFIED</Text>
            </View>
          </View>

          <Text style={styles.heroSpendTitle}>Total spend in 2026</Text>
          <Text style={styles.heroSpendAmount}>LKR 172,000</Text>
          <Text style={styles.heroSpendSubtext}>
            LKR 169,000 service · LKR 3,000 recurring
          </Text>

          <TouchableOpacity
            style={styles.ledgerPrimaryButton}
            onPress={() => onViewLedgerPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="list-outline" size={16} color="#ffffff" />
            <Text style={styles.ledgerPrimaryButtonText}>
              View itemized ledger
            </Text>
            <Ionicons name="arrow-forward" size={15} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* 5. SPEND BY CATEGORY CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spend by category</Text>
          <Text style={styles.cardSubtitle}>
            Tesla Model S Plaid · 01 Jan–30 Sep 2026
          </Text>

          <View style={styles.divider} />

          <View style={styles.categoryList}>
            {CATEGORY_SPEND.map((item) => (
              <View key={item.id} style={styles.categoryRow}>
                <View style={styles.categoryLabelRow}>
                  <Text style={styles.categoryLabel}>{item.label}</Text>
                  <Text style={styles.categoryAmount}>{item.amount}</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${item.percent}%`,
                        backgroundColor: item.barColor,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 6. RECURRING & UPCOMING CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recurring &amp; upcoming</Text>
          <Text style={styles.cardSubtitle}>Planned and AI-estimated costs</Text>

          <View style={styles.divider} />

          {RECURRING_AND_UPCOMING.map((item, idx) => (
            <View key={item.id}>
              <View
                style={[
                  styles.upcomingRow,
                  idx === RECURRING_AND_UPCOMING.length - 1
                    ? styles.upcomingRowLast
                    : null,
                ]}
              >
                <View
                  style={[styles.upcomingIconBox, { backgroundColor: item.iconBg }]}
                >
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>

                <View style={styles.upcomingTextCol}>
                  <Text style={styles.upcomingTitle}>{item.title}</Text>
                  <Text style={styles.upcomingMeta}>{item.meta}</Text>
                </View>

                <Text style={styles.upcomingAmount}>{item.amount}</Text>
              </View>

              {idx < RECURRING_AND_UPCOMING.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>

        {/* 7. ANNUAL MAINTENANCE BUDGET CARD */}
        <View style={styles.card}>
          <View style={styles.budgetHeaderRow}>
            <Text style={styles.cardTitle}>Annual maintenance budget</Text>
            <Text style={styles.budgetPercent}>72%</Text>
          </View>

          <Text style={styles.budgetUsageText}>
            LKR 172,000 of LKR 240,000 used
          </Text>

          <View style={styles.budgetTrack}>
            <View style={[styles.budgetFill, { width: '72%' }]} />
          </View>

          <View style={styles.budgetFooterRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#16a34a" />
            <Text style={styles.budgetFooterText}>
              LKR 68,000 remaining through 31 Dec 2026.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 8. BOTTOM NAVIGATION (NO TAB ACTIVE — SECONDARY FINANCE SCREEN) */}
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
    paddingBottom: 28,
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 12,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 5,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 13,
    height: 36,
    borderRadius: 8,
    gap: 4,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },
  addExpenseButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
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
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 10.5,
    lineHeight: 14.5,
    color: '#64748b',
  },
  heroSpendCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  heroSpendHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroSpendIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSpendBadge: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  heroSpendBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#0056A2',
  },
  heroSpendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  heroSpendAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroSpendSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  ledgerPrimaryButton: {
    height: 44,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  ledgerPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  categoryList: {
    paddingTop: 12,
    gap: 13,
  },
  categoryRow: {
    gap: 6,
  },
  categoryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryAmount: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 11,
  },
  upcomingRowLast: {
    paddingBottom: 2,
  },
  upcomingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingTextCol: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  upcomingMeta: {
    fontSize: 11.5,
    color: '#64748b',
  },
  upcomingAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0056A2',
  },
  budgetUsageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  budgetTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 10,
  },
  budgetFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#0056A2',
  },
  budgetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetFooterText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
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
});

export default ExpenseTrackingScreen;

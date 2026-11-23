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

type ExpenseCategory =
  | 'Repairs & parts'
  | 'Diagnostics'
  | 'Maintenance'
  | 'Tyres & safety'
  | 'Subscriptions';

type ExpenseFilter = 'All' | ExpenseCategory;

type ExpenseLedgerItem = {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendor: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: 'PAID';
};

const FILTER_OPTIONS: ExpenseFilter[] = [
  'All',
  'Repairs & parts',
  'Diagnostics',
  'Maintenance',
  'Tyres & safety',
  'Subscriptions',
];

const STATIC_EXPENSES: ExpenseLedgerItem[] = [
  {
    id: 'exp-1',
    title: 'Brake Calibration & Pads',
    category: 'Repairs & parts',
    vendor: 'Apex Tech Service Center',
    invoiceNumber: 'INV-2026-0818',
    date: '18 Aug 2026',
    amount: 'LKR 45,000',
    status: 'PAID',
  },
  {
    id: 'exp-2',
    title: 'Front Motor Coolant Flush',
    category: 'Repairs & parts',
    vendor: 'Perera Auto Works',
    invoiceNumber: 'INV-2026-0705',
    date: '05 Jul 2026',
    amount: 'LKR 32,000',
    status: 'PAID',
  },
  {
    id: 'exp-3',
    title: 'Annual Safety & Electronics Diagnostics',
    category: 'Diagnostics',
    vendor: 'Apex Tech Service Center',
    invoiceNumber: 'INV-2026-0614',
    date: '14 Jun 2026',
    amount: 'LKR 28,500',
    status: 'PAID',
  },
  {
    id: 'exp-4',
    title: 'Cabin Filter & AC Service',
    category: 'Maintenance',
    vendor: 'Apex Tech Service Center',
    invoiceNumber: 'INV-2026-0412',
    date: '12 Apr 2026',
    amount: 'LKR 12,000',
    status: 'PAID',
  },
  {
    id: 'exp-5',
    title: 'Tyre Safety Check & Rotation',
    category: 'Tyres & safety',
    vendor: 'Perera Auto Works',
    invoiceNumber: 'INV-2026-0204',
    date: '04 Feb 2026',
    amount: 'LKR 8,500',
    status: 'PAID',
  },
  {
    id: 'exp-6',
    title: 'Connected Services Subscription',
    category: 'Subscriptions',
    vendor: 'AutoCare Connected Services',
    invoiceNumber: 'SUB-2026-09',
    date: '30 Sep 2026',
    amount: 'LKR 3,000',
    status: 'PAID',
  },
];

const CATEGORY_TOTALS: Array<{ category: ExpenseCategory; amount: string }> = [
  { category: 'Repairs & parts', amount: 'LKR 120,000' },
  { category: 'Diagnostics', amount: 'LKR 28,500' },
  { category: 'Maintenance', amount: 'LKR 12,000' },
  { category: 'Tyres & safety', amount: 'LKR 8,500' },
  { category: 'Subscriptions', amount: 'LKR 3,000' },
];

export type ItemizedExpenseLedgerScreenProps = {
  onBack: () => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onNotificationsPress?: () => void;
  onExportCsvPress?: () => void;
  onDownloadStatementPress?: () => void;
  onMenuPress?: () => void;
};

export const ItemizedExpenseLedgerScreen: React.FC<
  ItemizedExpenseLedgerScreenProps
> = ({
  onBack,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onNotificationsPress,
  onExportCsvPress,
  onDownloadStatementPress,
  onMenuPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<ExpenseFilter>('All');

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return STATIC_EXPENSES.filter((item) => {
      const matchesFilter =
        selectedFilter === 'All' || item.category === selectedFilter;
      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query) ||
        item.invoiceNumber.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedFilter]);

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
        {/* 2. PAGE TOP */}
        <View style={styles.pageHeaderSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={16} color="#0056A2" />
            <Text style={styles.backButtonText}>Back to Expense Tracking</Text>
          </TouchableOpacity>

          <Text style={styles.pageEyebrow}>OWNER FINANCES</Text>
          <Text style={styles.pageTitle}>Itemized Expense Ledger</Text>
          <Text style={styles.pageSubtitle}>
            Review categorized service expenses, invoices, payments and recurring costs.
          </Text>
        </View>

        {/* 3. SUMMARY HEADER CARD */}
        <View style={styles.summaryHeaderCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>Total spend</Text>
              <Text style={styles.summaryAmount}>LKR 172,000</Text>
              <Text style={styles.summarySubtext}>01 Jan–30 Sep 2026</Text>
            </View>

            <View style={styles.allPaidChip}>
              <Ionicons name="checkmark-circle" size={12} color="#15803d" />
              <Text style={styles.allPaidChipText}>All invoices paid</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.exportRow}>
            <TouchableOpacity
              style={styles.placeholderActionBtn}
              onPress={() => onExportCsvPress?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={14} color="#475569" />
              <Text style={styles.placeholderActionText}>Export CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.placeholderActionBtn}
              onPress={() => onDownloadStatementPress?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={14} color="#0056A2" />
              <Text style={styles.placeholderActionTextBlue}>
                Download statement
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={17}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search expenses"
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
          {FILTER_OPTIONS.map((option) => {
            const isActive = selectedFilter === option;
            return (
              <Pressable
                key={option}
                style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                onPress={() => setSelectedFilter(option)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive ? styles.filterChipTextActive : null,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 6. ITEMIZED LEDGER LIST OR EMPTY STATE */}
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={26} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No matching expenses found.</Text>
            <Text style={styles.emptySubtitle}>
              Try another keyword or switch back to All categories.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.expensesList}>
            {filteredExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseCard}>
                {/* Row Top: Title + PAID badge */}
                <View style={styles.expenseTopRow}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark-circle" size={10} color="#15803d" />
                    <Text style={styles.paidBadgeText}>{expense.status}</Text>
                  </View>
                </View>

                {/* Category Pill + Date */}
                <View style={styles.categoryDateRow}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{expense.category}</Text>
                  </View>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>

                <View style={styles.divider} />

                {/* Vendor + Invoice + Amount */}
                <View style={styles.expenseMetaRow}>
                  <View style={styles.vendorCol}>
                    <Text style={styles.vendorName}>{expense.vendor}</Text>
                    <Text style={styles.invoiceText}>{expense.invoiceNumber}</Text>
                  </View>

                  <View style={styles.amountCol}>
                    <Text style={styles.expenseAmount}>{expense.amount}</Text>
                    <TouchableOpacity
                      style={styles.invoicePlaceholderBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="document-outline" size={12} color="#0056A2" />
                      <Text style={styles.invoicePlaceholderText}>Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 7. TOTALS BY CATEGORY CARD */}
        <View style={styles.totalsCard}>
          <Text style={styles.totalsCardTitle}>Totals by category</Text>
          <View style={styles.divider} />

          {CATEGORY_TOTALS.map((row) => (
            <View key={row.category}>
              <View style={styles.totalRow}>
                <Text style={styles.totalRowLabel}>{row.category}</Text>
                <Text style={styles.totalRowValue}>{row.amount}</Text>
              </View>
              <View style={styles.divider} />
            </View>
          ))}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>LKR 172,000</Text>
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
  pageEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#0056A2',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  summaryHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#bfdbfe',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  allPaidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  allPaidChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  exportRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },
  placeholderActionBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  placeholderActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  placeholderActionTextBlue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
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
    paddingHorizontal: 13,
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
  expensesList: {
    gap: 12,
    marginBottom: 16,
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  expenseTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },
  expenseTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 19,
  },
  paidBadge: {
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
  paidBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  categoryDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  expenseDate: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600',
  },
  expenseMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 11,
    gap: 10,
  },
  vendorCol: {
    flex: 1,
  },
  vendorName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  invoiceText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontWeight: '700',
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  invoicePlaceholderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  invoicePlaceholderText: {
    fontSize: 11,
    fontWeight: '700',
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
    marginBottom: 16,
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
  totalsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalsCardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalRowLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  totalRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  grandTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '800',
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
});

export default ItemizedExpenseLedgerScreen;

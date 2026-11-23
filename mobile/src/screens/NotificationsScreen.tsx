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

export type NotificationBadgeType =
  | 'High priority'
  | 'Verified'
  | 'Success'
  | 'Reminder'
  | 'Action required';

type NotificationFilter = 'All' | NotificationBadgeType;

export type NotificationItem = {
  id: string;
  section: 'today' | 'earlier';
  title: string;
  subtitle: string;
  badge: NotificationBadgeType;
  timestamp: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const FILTER_OPTIONS: NotificationFilter[] = [
  'All',
  'High priority',
  'Verified',
  'Success',
  'Reminder',
  'Action required',
];

export const STATIC_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    section: 'today',
    title: 'Service due in 500 km',
    subtitle: 'WP ABC-1234 · Toyota Aqua',
    badge: 'High priority',
    timestamp: '10:42 AM',
    icon: 'alert-circle-outline',
  },
  {
    id: 'notif-2',
    section: 'today',
    title: 'Maintenance record verified',
    subtitle: 'Perera Auto Works published record AC-9821',
    badge: 'Verified',
    timestamp: '9:18 AM',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'notif-3',
    section: 'today',
    title: 'Quotation accepted',
    subtitle: 'Kaveesha P. approved QT-2026-091',
    badge: 'Success',
    timestamp: '8:36 AM',
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'notif-4',
    section: 'earlier',
    title: 'Secure link expires tomorrow',
    subtitle: 'Insurance inspection access',
    badge: 'Reminder',
    timestamp: 'Yesterday',
    icon: 'time-outline',
  },
  {
    id: 'notif-5',
    section: 'earlier',
    title: 'OCR extraction needs review',
    subtitle: 'Invoice INV-1042 has 2 uncertain values',
    badge: 'Action required',
    timestamp: '18 Sep',
    icon: 'document-text-outline',
  },
];

const getBadgeTheme = (
  badge: NotificationBadgeType
): { bg: string; border: string; text: string; iconBg: string } => {
  switch (badge) {
    case 'High priority':
      return {
        bg: '#fef2f2',
        border: '#fecaca',
        text: '#dc2626',
        iconBg: '#fef2f2',
      };
    case 'Verified':
      return {
        bg: '#f0fdf4',
        border: '#bbf7d0',
        text: '#15803d',
        iconBg: '#f0fdf4',
      };
    case 'Success':
      return {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        text: '#047857',
        iconBg: '#ecfdf5',
      };
    case 'Reminder':
      return {
        bg: '#ebf5ff',
        border: '#bfdbfe',
        text: '#0056A2',
        iconBg: '#ebf5ff',
      };
    case 'Action required':
      return {
        bg: '#fffbeb',
        border: '#fde68a',
        text: '#b45309',
        iconBg: '#fffbeb',
      };
  }
};

export type NotificationsScreenProps = {
  notifications?: NotificationItem[];
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onSchedulePress?: () => void;
  onMenuPress?: () => void;
};

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications = STATIC_NOTIFICATIONS,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onSchedulePress,
  onMenuPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('All');

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter =
        selectedFilter === 'All' || item.badge === selectedFilter;
      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query)
      );
    });
  }, [notifications, searchQuery, selectedFilter]);

  const todayItems = useMemo(
    () => filteredNotifications.filter((item) => item.section === 'today'),
    [filteredNotifications]
  );

  const earlierItems = useMemo(
    () => filteredNotifications.filter((item) => item.section === 'earlier'),
    [filteredNotifications]
  );

  const renderNotificationRow = (
    item: NotificationItem,
    isLast: boolean
  ) => {
    const theme = getBadgeTheme(item.badge);

    return (
      <View key={item.id}>
        <View style={[styles.notificationRow, isLast ? styles.notificationRowLast : null]}>
          <View style={[styles.notifIconBox, { backgroundColor: theme.iconBg }]}>
            <Ionicons name={item.icon} size={18} color={theme.text} />
          </View>

          <View style={styles.notifContentCol}>
            <View style={styles.notifTitleRow}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifTime}>{item.timestamp}</Text>
            </View>

            <Text style={styles.notifSubtitle}>{item.subtitle}</Text>

            <View
              style={[
                styles.statusPill,
                { backgroundColor: theme.bg, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.statusPillText, { color: theme.text }]}>
                {item.badge}
              </Text>
            </View>
          </View>
        </View>

        {!isLast ? <View style={styles.divider} /> : null}
      </View>
    );
  };

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
            style={[styles.headerIconButton, styles.headerIconButtonActive]}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications" size={20} color="#0056A2" />
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
        {/* 2. PAGE TITLE & SCHEDULE NOTIFICATION BUTTON */}
        <View style={styles.pageHeaderSection}>
          <View style={styles.titleActionRow}>
            <Text style={styles.pageTitle}>Notifications</Text>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => onSchedulePress?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="calendar-outline" size={14} color="#ffffff" />
              <Text style={styles.scheduleButtonText}>Schedule notification</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pageSubtitle}>
            Stay ahead of maintenance, verification and access activity.
          </Text>
        </View>

        {/* 3. SEARCH */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>SEARCH</Text>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={17}
              color="#64748b"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notifications"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search notifications"
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
        </View>

        {/* INLINE OPTIONAL FILTERS PANEL (TOGGLED BY FILTERS BUTTON) */}
        {showFilters ? (
          <View style={styles.filtersPanel}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = selectedFilter === option;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.filterChip,
                      isActive ? styles.filterChipActive : null,
                    ]}
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
          </View>
        ) : null}

        {/* 4. TODAY & EARLIER CARDS (OR EMPTY SEARCH STATE) */}
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={26} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No matching notifications.</Text>
            <Text style={styles.emptySubtitle}>
              Try another search keyword or clear active filters.
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
          <>
            {/* TODAY CARD */}
            {todayItems.length > 0 ? (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderTextCol}>
                    <Text style={styles.cardHeading}>Today</Text>
                    <Text style={styles.cardSubtext}>
                      {todayItems.length} new{' '}
                      {todayItems.length === 1 ? 'notification' : 'notifications'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.filtersButton,
                      showFilters || selectedFilter !== 'All'
                        ? styles.filtersButtonActive
                        : null,
                    ]}
                    onPress={() => setShowFilters((prev) => !prev)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="options-outline"
                      size={14}
                      color={
                        showFilters || selectedFilter !== 'All'
                          ? '#0056A2'
                          : '#475569'
                      }
                    />
                    <Text
                      style={[
                        styles.filtersButtonText,
                        showFilters || selectedFilter !== 'All'
                          ? styles.filtersButtonTextActive
                          : null,
                      ]}
                    >
                      Filters
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {todayItems.map((item, idx) =>
                  renderNotificationRow(item, idx === todayItems.length - 1)
                )}
              </View>
            ) : null}

            {/* EARLIER CARD */}
            {earlierItems.length > 0 ? (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderTextCol}>
                    <Text style={styles.cardHeading}>Earlier</Text>
                  </View>

                  {todayItems.length === 0 ? (
                    <TouchableOpacity
                      style={[
                        styles.filtersButton,
                        showFilters || selectedFilter !== 'All'
                          ? styles.filtersButtonActive
                          : null,
                      ]}
                      onPress={() => setShowFilters((prev) => !prev)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="options-outline"
                        size={14}
                        color={
                          showFilters || selectedFilter !== 'All'
                            ? '#0056A2'
                            : '#475569'
                        }
                      />
                      <Text
                        style={[
                          styles.filtersButtonText,
                          showFilters || selectedFilter !== 'All'
                            ? styles.filtersButtonTextActive
                            : null,
                        ]}
                      >
                        Filters
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.divider} />

                {earlierItems.map((item, idx) =>
                  renderNotificationRow(item, idx === earlierItems.length - 1)
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* 5. BOTTOM NAVIGATION (NO TAB ACTIVE — SECONDARY SCREEN) */}
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
  headerIconButtonActive: {
    backgroundColor: '#ebf5ff',
    borderColor: '#bfdbfe',
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
  titleActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 11,
    height: 34,
    borderRadius: 8,
    gap: 5,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },
  scheduleButtonText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  searchSection: {
    marginBottom: 14,
  },
  searchLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#64748b',
    marginBottom: 6,
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
  filtersPanel: {
    marginBottom: 12,
  },
  filtersRow: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  cardHeaderTextCol: {
    flex: 1,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
    gap: 5,
  },
  filtersButtonActive: {
    backgroundColor: '#ebf5ff',
    borderColor: '#93c5fd',
  },
  filtersButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filtersButtonTextActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: 11,
  },
  notificationRowLast: {
    paddingBottom: 10,
  },
  notifIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  notifContentCol: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 3,
  },
  notifTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 1,
  },
  notifSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    marginBottom: 8,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
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
});

export default NotificationsScreen;

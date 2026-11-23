import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type GarageProfileData = {
  garageName: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  openingHours: string;
};

export const DEFAULT_GARAGE_PROFILE: GarageProfileData = {
  garageName: 'Perera Auto Works',
  phone: '011 234 5678',
  mobile: '077 456 7890',
  email: 'service@pereraautoworks.lk',
  address: 'No. 42, Havelock Road, Colombo 05',
  openingHours: 'Mon–Sat · 8:00 AM–6:00 PM',
};

export interface GarageProfileScreenProps {
  profile?: GarageProfileData;
  onSaveProfile?: (updated: GarageProfileData) => void;
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onViewVehicleRecordsPress?: () => void;
  onAddServiceEntryPress?: () => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

interface TechnicianItem {
  id: string;
  name: string;
  code: string;
  role: string;
  status: string;
}

const TECHNICIANS: TechnicianItem[] = [
  {
    id: 'tec-2051',
    name: 'Indika Perera',
    code: 'TEC-2051',
    role: 'Senior Technician',
    status: 'Verified',
  },
  {
    id: 'tec-2094',
    name: 'Sarah Chen',
    code: 'TEC-2094',
    role: 'Diagnostic Specialist',
    status: 'Verified',
  },
  {
    id: 'tec-2118',
    name: 'Kasun Fernando',
    code: 'TEC-2118',
    role: 'Service Technician',
    status: 'Verified',
  },
];

const SERVICE_CAPABILITIES: string[] = [
  'Periodic maintenance',
  'Engine diagnostics',
  'Brake service',
  'Hybrid vehicle service',
  'Air conditioning',
  'Electrical diagnostics',
  'Safety inspection',
];

const PERFORMANCE_METRICS: Array<{
  id: string;
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
}> = [
  {
    id: 'perf-customers',
    label: 'Customers',
    value: '125',
    icon: 'people-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
  },
  {
    id: 'perf-vehicles',
    label: 'Vehicles serviced',
    value: '240',
    icon: 'car-sport-outline',
    iconColor: '#0891b2',
    iconBg: '#e0f7fa',
  },
  {
    id: 'perf-pending',
    label: 'Pending entries',
    value: '18',
    icon: 'time-outline',
    iconColor: '#d97706',
    iconBg: '#fffbeb',
  },
  {
    id: 'perf-revenue',
    label: 'Monthly revenue',
    value: 'LKR 850,000',
    icon: 'cash-outline',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
  },
];

export const GarageProfileScreen: React.FC<GarageProfileScreenProps> = ({
  profile = DEFAULT_GARAGE_PROFILE,
  onSaveProfile,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onViewVehicleRecordsPress,
  onAddServiceEntryPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [activeProfile, setActiveProfile] = useState<GarageProfileData>(profile);
  const [draftProfile, setDraftProfile] = useState<GarageProfileData>(profile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [updatedNotice, setUpdatedNotice] = useState<boolean>(false);

  const handleStartEdit = () => {
    setDraftProfile(activeProfile);
    setEditError(null);
    setUpdatedNotice(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftProfile(activeProfile);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!draftProfile.garageName.trim()) {
      setEditError('Garage name cannot be empty.');
      return;
    }
    if (!draftProfile.email.trim()) {
      setEditError('Contact email cannot be empty.');
      return;
    }

    const cleaned: GarageProfileData = {
      garageName: draftProfile.garageName.trim(),
      phone: draftProfile.phone.trim() || DEFAULT_GARAGE_PROFILE.phone,
      mobile: draftProfile.mobile.trim() || DEFAULT_GARAGE_PROFILE.mobile,
      email: draftProfile.email.trim(),
      address: draftProfile.address.trim() || DEFAULT_GARAGE_PROFILE.address,
      openingHours:
        draftProfile.openingHours.trim() || DEFAULT_GARAGE_PROFILE.openingHours,
    };

    setActiveProfile(cleaned);
    setDraftProfile(cleaned);
    setEditError(null);
    setIsEditing(false);
    setUpdatedNotice(true);
    onSaveProfile?.(cleaned);
  };

  const businessInfoRows: Array<{ label: string; value: string }> = [
    { label: 'Garage name', value: activeProfile.garageName },
    { label: 'Garage ID', value: 'BR-03' },
    { label: 'Location', value: 'Colombo 05' },
    { label: 'Business type', value: 'Automotive service & repair' },
    { label: 'Registration', value: 'PV-2026-04821' },
    { label: 'Established', value: '2018' },
  ];

  const contactRows: Array<{ label: string; value: string }> = [
    { label: 'Phone', value: activeProfile.phone },
    { label: 'Mobile', value: activeProfile.mobile },
    { label: 'Email', value: activeProfile.email },
    { label: 'Address', value: activeProfile.address },
    { label: 'Opening hours', value: activeProfile.openingHours },
  ];

  const certificationRows: Array<{
    label: string;
    value: string;
    isChip?: boolean;
  }> = [
    { label: 'Business verification', value: 'Verified', isChip: true },
    { label: 'Garage certification', value: 'Active', isChip: true },
    { label: 'Certified through', value: '31 Dec 2026', isChip: false },
    {
      label: 'Technician compliance',
      value: '3 verified technicians',
      isChip: true,
    },
    { label: 'Insurance', value: 'Active', isChip: true },
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
          <Text style={styles.eyebrow}>GARAGE / BUSINESS PROFILE</Text>
          <Text style={styles.pageTitle}>Garage profile</Text>
          <Text style={styles.pageSubtitle}>
            Manage workshop identity, certification and operational details.
          </Text>
        </View>

        {/* 3. BUSINESS HERO CARD */}
        <LinearGradient
          colors={['#003566', '#004684', '#0056A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={13} color="#15803d" />
              <Text style={styles.verifiedPillText}>Verified business</Text>
            </View>

            <View style={styles.heroBadgeIcon}>
              <Ionicons name="business-outline" size={18} color="#bae6fd" />
            </View>
          </View>

          <Text style={styles.heroGarageName}>{activeProfile.garageName}</Text>

          <View style={styles.heroMetaGroup}>
            <View style={styles.heroMetaLine}>
              <Ionicons name="location-outline" size={14} color="#bae6fd" />
              <Text style={styles.heroMetaText}>BR-03 · Colombo 05</Text>
            </View>
            <View style={styles.heroMetaLine}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#86efac"
              />
              <Text style={styles.heroMetaText}>
                Verified through 31 Dec 2026
              </Text>
            </View>
          </View>

          <View style={styles.heroStatsBar}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Business status</Text>
              <View style={styles.activeStatusRow}>
                <View style={styles.activeGreenDot} />
                <Text style={styles.heroStatValue}>Active</Text>
              </View>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Trust score</Text>
              <Text style={styles.heroStatValue}>98%</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 4. EDIT GARAGE PROFILE (LOCAL FRONTEND EDIT MODE) */}
        {!isEditing ? (
          <View style={styles.editTriggerWrap}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleStartEdit}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color="#0056A2" />
              <Text style={styles.editProfileButtonText}>
                Edit garage profile
              </Text>
            </TouchableOpacity>

            {updatedNotice ? (
              <View style={styles.updatedBanner}>
                <Ionicons name="checkmark-circle" size={15} color="#15803d" />
                <Text style={styles.updatedBannerText}>
                  Profile updated locally
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="create-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Edit garage profile</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Garage name</Text>
              <TextInput
                style={styles.editInput}
                value={draftProfile.garageName}
                onChangeText={(text) => {
                  setDraftProfile((prev) => ({ ...prev, garageName: text }));
                  setEditError(null);
                }}
                placeholder="Perera Auto Works"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={[styles.twoColRow, styles.editFieldGroup]}>
              <View style={styles.halfCol}>
                <Text style={styles.editLabel}>Phone</Text>
                <TextInput
                  style={styles.editInput}
                  value={draftProfile.phone}
                  onChangeText={(text) =>
                    setDraftProfile((prev) => ({ ...prev, phone: text }))
                  }
                  placeholder="011 234 5678"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.halfCol}>
                <Text style={styles.editLabel}>Mobile</Text>
                <TextInput
                  style={styles.editInput}
                  value={draftProfile.mobile}
                  onChangeText={(text) =>
                    setDraftProfile((prev) => ({ ...prev, mobile: text }))
                  }
                  placeholder="077 456 7890"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Email</Text>
              <TextInput
                style={styles.editInput}
                value={draftProfile.email}
                onChangeText={(text) => {
                  setDraftProfile((prev) => ({ ...prev, email: text }));
                  setEditError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="service@pereraautoworks.lk"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Address</Text>
              <TextInput
                style={styles.editInput}
                value={draftProfile.address}
                onChangeText={(text) =>
                  setDraftProfile((prev) => ({ ...prev, address: text }))
                }
                placeholder="No. 42, Havelock Road, Colombo 05"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Opening hours</Text>
              <TextInput
                style={styles.editInput}
                value={draftProfile.openingHours}
                onChangeText={(text) =>
                  setDraftProfile((prev) => ({ ...prev, openingHours: text }))
                }
                placeholder="Mon–Sat · 8:00 AM–6:00 PM"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {editError ? (
              <Text style={styles.editErrorText}>{editError}</Text>
            ) : null}

            <View style={styles.editActionsRow}>
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={handleCancelEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelEditButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveEditButton}
                onPress={handleSaveEdit}
                activeOpacity={0.85}
              >
                <Text style={styles.saveEditButtonText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 5. BUSINESS INFORMATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="business-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Business information</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {businessInfoRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. CONTACT DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="call-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Contact details</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {contactRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7. VERIFICATION & CERTIFICATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>
              Verification &amp; certification
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            {certificationRows.map((row) => (
              <View key={row.label} style={styles.certRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                {row.isChip ? (
                  <View style={styles.greenChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#15803d"
                    />
                    <Text style={styles.greenChipText}>{row.value}</Text>
                  </View>
                ) : (
                  <Text style={styles.detailValue}>{row.value}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 8. TECHNICIANS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="people-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Technicians</Text>
            </View>

            <View style={styles.countPill}>
              <Text style={styles.countPillText}>
                {TECHNICIANS.length} active
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.techList}>
            {TECHNICIANS.map((tech) => (
              <View key={tech.id} style={styles.techCard}>
                <View style={styles.techTopRow}>
                  <View style={styles.techInfoCol}>
                    <Text style={styles.techName}>{tech.name}</Text>
                    <Text style={styles.techMeta}>
                      {tech.code} · {tech.role}
                    </Text>
                  </View>

                  <View style={styles.greenChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#15803d"
                    />
                    <Text style={styles.greenChipText}>{tech.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 9. SERVICE CAPABILITIES CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="construct-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Service capabilities</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.capabilitiesWrap}>
            {SERVICE_CAPABILITIES.map((cap) => (
              <View key={cap} style={styles.capabilityChip}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={13}
                  color="#0056A2"
                />
                <Text style={styles.capabilityChipText}>{cap}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 10. PERFORMANCE SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="stats-chart-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Performance summary</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.perfGrid}>
            {PERFORMANCE_METRICS.map((item) => (
              <View key={item.id} style={styles.perfTile}>
                <View
                  style={[styles.perfIconBox, { backgroundColor: item.iconBg }]}
                >
                  <Ionicons name={item.icon} size={16} color={item.iconColor} />
                </View>
                <Text style={styles.perfLabel}>{item.label}</Text>
                <Text
                  style={styles.perfValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 11. WORKING GARAGE ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => onViewVehicleRecordsPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="folder-open-outline" size={16} color="#0056A2" />
            <Text style={styles.secondaryActionButtonText}>
              View vehicle records
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => onAddServiceEntryPress?.()}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={17} color="#ffffff" />
            <Text style={styles.primaryActionButtonText}>
              Add service entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 12. GARAGE BOTTOM NAVIGATION (GARAGE ACTIVE) */}
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
    marginBottom: 12,
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
  heroGarageName: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
  },
  heroMetaGroup: {
    gap: 6,
    marginBottom: 14,
  },
  heroMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    fontSize: 12.5,
    color: '#e0f2fe',
    fontWeight: '500',
    flexShrink: 1,
  },
  heroStatsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  heroStatItem: {
    flex: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginHorizontal: 12,
  },
  heroStatLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#bae6fd',
    marginBottom: 2,
  },
  activeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  heroStatValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  editTriggerWrap: {
    marginBottom: 14,
    gap: 8,
  },
  editProfileButton: {
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editProfileButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  updatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  updatedBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
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
  editFieldGroup: {
    marginBottom: 11,
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  editInput: {
    height: 42,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 9,
    paddingHorizontal: 11,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  editErrorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 10,
  },
  editActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelEditButton: {
    flex: 1,
    height: 42,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEditButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  saveEditButton: {
    flex: 1,
    height: 42,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveEditButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
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
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
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
  greenChip: {
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
  greenChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  countPill: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0056A2',
  },
  techList: {
    gap: 9,
  },
  techCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
  },
  techTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  techInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  techName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  techMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  capabilitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capabilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  capabilityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  perfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  perfTile: {
    width: '48.3%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
  },
  perfIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  perfLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 3,
  },
  perfValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
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

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

type OwnerTab = 'home' | 'vehicles' | 'records' | 'profile';

interface OwnerHomeScreenProps {
  onVehiclesPress?: () => void;
  onRecordsPress?: () => void;
  onProfilePress?: () => void;
  onSelectTab?: (tab: OwnerTab) => void;
  onPressCreatePassport?: () => void;
  onPressVerifyVin?: () => void;
  onPressNotifications?: () => void;
  onPressMenu?: () => void;
}

interface CapabilityItem {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'ledger',
    icon: 'shield-checkmark-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
    title: 'Tamper-Proof Ledger',
    description: 'Verified maintenance logs locked with garage certification stamps.',
  },
  {
    id: 'odometer',
    icon: 'speedometer-outline',
    iconColor: '#0891b2',
    iconBg: '#e0f7fa',
    title: 'Odometer Protection',
    description: 'Chronological mileage checkpoints guard against rollback fraud.',
  },
  {
    id: 'qr-share',
    icon: 'qr-code-outline',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
    title: 'Timed QR Sharing',
    description: 'Share expiring vehicle passport links safely with buyers or insurers.',
  },
  {
    id: 'garages',
    icon: 'construct-outline',
    iconColor: '#0056A2',
    iconBg: '#ebf5ff',
    title: 'Verified Garages',
    description: 'Only accredited service workshops can issue official repair stamps.',
  },
  {
    id: 'ai-care',
    icon: 'analytics-outline',
    iconColor: '#0d9488',
    iconBg: '#f0fdfa',
    title: 'AI Predictive Care',
    description: 'Proactive diagnostics and upcoming maintenance health alerts.',
  },
  {
    id: 'resale',
    icon: 'document-text-outline',
    iconColor: '#15803d',
    iconBg: '#effcf0',
    title: 'Resale Trust Report',
    description: 'Instant digital vehicle history that accelerates trusted resale.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Create Digital Vehicle Passport',
    description:
      'Register your plate, chassis/VIN, and baseline odometer reading in seconds.',
  },
  {
    number: '02',
    title: 'Service at Verified Garages',
    description:
      'Certified workshops log diagnostics, parts, and mileage with digital stamps.',
  },
  {
    number: '03',
    title: 'Share Timed Verification Links',
    description:
      'Generate secure expiring QR links so anyone can verify vehicle authenticity.',
  },
];

const LEGACY_POINTS = [
  'Paper receipts lost, damaged, or easily forged',
  'Unverified odometer claims and hidden accident history',
  'No proof of genuine parts or accredited garage work',
  'Slow, uncertain pre-purchase vehicle inspections',
];

const AUTOCARE_POINTS = [
  'Permanent cloud-backed Universal Digital Passport',
  'Verified mileage timeline with tamper-evident stamps',
  'Only audited AutoCare 360 garages issue service records',
  'Instant timed-expiry QR verification for trusted resale',
];

const FEATURE_CHIPS: Array<{
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}> = [
  { label: 'Verified Garages Only', icon: 'checkmark-circle', color: '#16a34a' },
  { label: 'Timed Expiry QR Links', icon: 'qr-code-outline', color: '#0056A2' },
  { label: 'AI Predictive Care', icon: 'sparkles-outline', color: '#0891b2' },
];

export const OwnerHomeScreen: React.FC<OwnerHomeScreenProps> = ({
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onSelectTab,
  onPressCreatePassport,
  onPressVerifyVin,
  onPressNotifications,
  onPressMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [, setLastInspectedQuery] = useState<string>('');

  const handleInspect = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }
    setSearchQuery(trimmed);
    setLastInspectedQuery(trimmed);
  };

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
            onPress={() => onPressNotifications?.()}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={21} color="#0f172a" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => onPressMenu?.()}
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
        {/* 2. HERO SECTION */}
        <LinearGradient
          colors={['#f8fcff', '#eef7ff', '#f0fdf7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <Image
            source={require('../../assets/bg-fade.png')}
            style={styles.heroBgOverlay}
            resizeMode="cover"
          />

          <View style={styles.heroTopRow}>
            {/* Left Copy */}
            <View style={styles.heroCopyColumn}>
              <View style={styles.heroEyebrowPill}>
                <View style={styles.heroEyebrowDot} />
                <Text style={styles.heroEyebrowText}>UNIVERSAL VMR</Text>
              </View>

              <Text style={styles.heroHeading}>
                Every vehicle{'\n'}
                deserves a{'\n'}
                <Text style={styles.heroHeadingAccent}>lifetime digital</Text>
                {'\n'}
                Passport.
              </Text>

              <Text style={styles.heroDescription}>
                Unify certified garage maintenance, mileage history, and AI diagnostics in one trusted vehicle record.
              </Text>
            </View>

            {/* Right Vehicle Visual (Non-overlapping dedicated column) */}
            <View style={styles.heroVisualColumn}>
              <LinearGradient
                colors={['#0056A2', '#0891b2', '#10b981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroVehicleCard}
              >
                <View style={styles.heroVerifiedTag}>
                  <Ionicons name="shield-checkmark" size={11} color="#16a34a" />
                  <Text style={styles.heroVerifiedTagText}>VERIFIED</Text>
                </View>

                <View style={styles.heroCarCircle}>
                  <Ionicons name="car-sport" size={46} color="#ffffff" />
                </View>

                <View style={styles.heroPlateBadge}>
                  <Text style={styles.heroPlateText}>VMR • 360</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Verification / Search Input + Inspect Button */}
          <View style={styles.searchBarContainer}>
            <Ionicons
              name="search-outline"
              size={17}
              color="#64748b"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter Plate, Chassis, or VIN..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleInspect}
              accessibilityLabel="Vehicle Plate, Chassis, or VIN"
            />
            <TouchableOpacity
              style={styles.inspectButton}
              onPress={handleInspect}
              activeOpacity={0.85}
            >
              <Text style={styles.inspectButtonText}>Inspect</Text>
            </TouchableOpacity>
          </View>

          {/* Primary & Secondary Hero CTAs */}
          <View style={styles.heroCtaRow}>
            <TouchableOpacity
              style={styles.heroPrimaryCta}
              onPress={() => onPressCreatePassport?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={16} color="#ffffff" />
              <Text style={styles.heroPrimaryCtaText} numberOfLines={1}>
                Create Free Passport
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryCta}
              onPress={() => onPressVerifyVin?.()}
              activeOpacity={0.85}
            >
              <Ionicons name="shield-checkmark-outline" size={15} color="#0056A2" />
              <Text style={styles.heroSecondaryCtaText} numberOfLines={1}>
                Verify Chassis / VIN
              </Text>
            </TouchableOpacity>
          </View>

          {/* Feature Chips */}
          <View style={styles.chipsWrap}>
            {FEATURE_CHIPS.map((chip) => (
              <View key={chip.label} style={styles.featureChip}>
                <Ionicons name={chip.icon} size={13} color={chip.color} />
                <Text style={styles.featureChipText}>{chip.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* 3. CORE CAPABILITIES */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>CORE CAPABILITIES</Text>
          <Text style={styles.sectionTitle}>
            Complete Security &amp; Diagnostics Platform
          </Text>
          <Text style={styles.sectionSubtitle}>
            Built for vehicle owners, certified workshops, and prospective buyers.
          </Text>

          <View style={styles.capabilitiesGrid}>
            {CAPABILITIES.map((item) => (
              <View key={item.id} style={styles.capabilityCard}>
                <View style={[styles.capabilityIconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <Text style={styles.capabilityTitle}>{item.title}</Text>
                <Text style={styles.capabilityDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. HOW IT WORKS (BLUE SECTION) */}
        <LinearGradient
          colors={['#0056A2', '#004684', '#003566']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.howItWorksSection}
        >
          <View style={styles.howItWorksBadge}>
            <Text style={styles.howItWorksBadgeText}>HOW IT WORKS</Text>
          </View>
          <Text style={styles.howItWorksTitle}>
            Three Steps to Complete Verification
          </Text>
          <Text style={styles.howItWorksSubtitle}>
            Build an authentic digital service history from your very first inspection.
          </Text>

          <View style={styles.stepsList}>
            {HOW_IT_WORKS_STEPS.map((step) => (
              <View key={step.number} style={styles.stepCard}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* 5. TRANSFORMATION SECTION */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>THE TRANSFORMATION</Text>
          <Text style={styles.sectionTitle}>
            From Fragmented Paper Clutter To A Verified Universal Passport
          </Text>

          {/* Legacy Method Card */}
          <View style={styles.legacyCard}>
            <View style={styles.comparisonHeaderRow}>
              <View style={styles.legacyBadge}>
                <Ionicons name="alert-circle-outline" size={14} color="#dc2626" />
                <Text style={styles.legacyBadgeText}>Legacy Method</Text>
              </View>
              <Text style={styles.comparisonTagMuted}>Paper &amp; Unverified</Text>
            </View>

            {LEGACY_POINTS.map((point) => (
              <View key={point} style={styles.comparisonRow}>
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color="#dc2626"
                  style={styles.comparisonIcon}
                />
                <Text style={styles.comparisonTextMuted}>{point}</Text>
              </View>
            ))}
          </View>

          {/* AutoCare 360 Card */}
          <View style={styles.autocareCard}>
            <View style={styles.comparisonHeaderRow}>
              <View style={styles.autocareBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#ffffff" />
                <Text style={styles.autocareBadgeText}>AutoCare 360</Text>
              </View>
              <Text style={styles.comparisonTagActive}>Verified Digital VMR</Text>
            </View>

            {AUTOCARE_POINTS.map((point) => (
              <View key={point} style={styles.comparisonRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#16a34a"
                  style={styles.comparisonIcon}
                />
                <Text style={styles.comparisonTextStrong}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. BOTTOM CTA / VEHICLE-HEALTH PROMOTIONAL BLOCK */}
        <View style={styles.promoWrapper}>
          <LinearGradient
            colors={['#0056A2', '#0891b2', '#16a34a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoCard}
          >
            <View style={styles.promoTopRow}>
              <View style={styles.promoBadge}>
                <Ionicons name="pulse-outline" size={13} color="#0056A2" />
                <Text style={styles.promoBadgeText}>VEHICLE HEALTH READY</Text>
              </View>

              <View style={styles.promoIconCircle}>
                <Ionicons name="car-sport-outline" size={24} color="#ffffff" />
              </View>
            </View>

            <Text style={styles.promoTitle}>
              Keep Your Vehicle Health Verified &amp; Resale-Ready
            </Text>
            <Text style={styles.promoSubtitle}>
              Monitor diagnostics, certified workshop stamps, and predictive maintenance alerts in one secure passport.
            </Text>

            <View style={styles.promoMetricsRow}>
              <View style={styles.promoMetricPill}>
                <Ionicons name="checkmark-circle" size={14} color="#86efac" />
                <Text style={styles.promoMetricText}>100% Verified Stamps</Text>
              </View>
              <View style={styles.promoMetricPill}>
                <Ionicons name="shield-checkmark" size={14} color="#bae6fd" />
                <Text style={styles.promoMetricText}>Lifetime VMR Access</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.promoButton}
              onPress={() => onPressCreatePassport?.()}
              activeOpacity={0.85}
            >
              <Text style={styles.promoButtonText}>Create Free Passport</Text>
              <Ionicons name="arrow-forward" size={16} color="#0056A2" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* 7. BOTTOM NAVIGATION */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab?.('home')}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onVehiclesPress ?? (() => onSelectTab?.('vehicles'))}
          activeOpacity={0.7}
        >
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onRecordsPress ?? (() => onSelectTab?.('records'))}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onProfilePress ?? (() => onSelectTab?.('profile'))}
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
    borderBottomColor: '#f1f5f9',
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
    paddingBottom: 24,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.08,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  heroCopyColumn: {
    flex: 1,
  },
  heroEyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 5,
    marginBottom: 8,
  },
  heroEyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  heroEyebrowText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#0056A2',
  },
  heroHeading: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  heroHeadingAccent: {
    color: '#0056A2',
  },
  heroDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#475569',
  },
  heroVisualColumn: {
    width: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVehicleCard: {
    width: 118,
    height: 152,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  heroVerifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 3,
  },
  heroVerifiedTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.4,
  },
  heroCarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlateBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroPlateText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 5,
    height: 46,
    marginBottom: 12,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12.5,
    color: '#0f172a',
    padding: 0,
  },
  inspectButton: {
    backgroundColor: '#0056A2',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  inspectButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  heroPrimaryCta: {
    flex: 1,
    height: 42,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  heroPrimaryCtaText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroSecondaryCta: {
    flex: 1,
    height: 42,
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
  heroSecondaryCtaText: {
    color: '#0056A2',
    fontSize: 12,
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  featureChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 6,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#0056A2',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 14,
  },
  capabilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  capabilityCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  capabilityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  capabilityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  capabilityDesc: {
    fontSize: 11,
    lineHeight: 15.5,
    color: '#64748b',
  },
  howItWorksSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  howItWorksBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
  },
  howItWorksBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#bae6fd',
  },
  howItWorksTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  howItWorksSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    padding: 13,
    gap: 12,
  },
  stepNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#00B4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  legacyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 8,
    marginBottom: 12,
  },
  autocareCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#0056A2',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  comparisonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  legacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  legacyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  autocareBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  autocareBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  comparisonTagMuted: {
    fontSize: 10.5,
    color: '#94a3b8',
    fontWeight: '600',
  },
  comparisonTagActive: {
    fontSize: 10.5,
    color: '#16a34a',
    fontWeight: '700',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  comparisonIcon: {
    marginTop: 1,
  },
  comparisonTextMuted: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
  },
  comparisonTextStrong: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#0f172a',
    fontWeight: '500',
  },
  promoWrapper: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  promoCard: {
    borderRadius: 18,
    padding: 18,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  promoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  promoBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#0056A2',
  },
  promoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 14,
  },
  promoMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  promoMetricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  promoMetricText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  promoButton: {
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  promoButtonText: {
    color: '#0056A2',
    fontSize: 13.5,
    fontWeight: '800',
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

export default OwnerHomeScreen;

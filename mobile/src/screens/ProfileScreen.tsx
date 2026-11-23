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
import { DEFAULT_OWNER_PROFILE, OwnerProfileData } from './EditProfileScreen';

export type ProfileScreenProps = {
  profile?: OwnerProfileData;
  onHomePress: () => void;
  onVehiclesPress?: () => void;
  onRecordsPress?: () => void;
  onEditProfilePress: () => void;
  onLogoutPress: () => void;
  onSecuritySettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile = DEFAULT_OWNER_PROFILE,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onEditProfilePress,
  onLogoutPress,
  onSecuritySettingsPress,
  onNotificationsPress,
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
            onPress={onMenuPress ?? onLogoutPress}
            activeOpacity={0.7}
            accessibilityLabel="Menu"
          >
            <Ionicons name="menu-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. PAGE TITLE & EDIT PROFILE ACTION */}
        <View style={styles.pageHeaderSection}>
          <Text style={styles.pageEyebrow}>OWNER MANAGEMENT</Text>

          <View style={styles.titleActionRow}>
            <Text style={styles.pageTitle}>Profile</Text>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={onEditProfilePress}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={15} color="#ffffff" />
              <Text style={styles.editProfileButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pageSubtitle}>
            Manage your vehicle-owner identity, contact details, security and linked digital passports.
          </Text>
        </View>

        {/* 3. CARD 1 — IDENTITY SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarOuterRing}>
              <View style={styles.avatarInnerCircle}>
                <Ionicons name="person" size={38} color="#0056A2" />
              </View>

              <TouchableOpacity
                style={styles.avatarEditBadge}
                onPress={onEditProfilePress}
                activeOpacity={0.85}
                accessibilityLabel="Edit profile photo"
              >
                <Ionicons name="pencil" size={12} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.ownerName}>{profile.fullName}</Text>
            <Text style={styles.ownerRoleSubtitle}>Verified vehicle owner</Text>

            <View style={styles.identityVerifiedBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#15803d" />
              <Text style={styles.identityVerifiedBadgeText}>IDENTITY VERIFIED</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner ID</Text>
            <Text style={styles.infoValueMono}>AC360-OW-20984</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>15 May 2026</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Primary region</Text>
            <Text style={styles.infoValue}>{profile.primaryRegion}</Text>
          </View>
        </View>

        {/* 4. CARD 2 — PERSONAL & CONTACT INFORMATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal &amp; contact information</Text>
          <Text style={styles.cardSubtitle}>
            Registration details used for owner verification and authorized sharing.
          </Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full name</Text>
            <Text style={styles.detailValue}>{profile.fullName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Email address</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="checkmark-circle" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>{profile.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Contact phone</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="checkmark-circle" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>{profile.phone}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.detailRow, styles.infoRowLast]}>
            <Text style={styles.detailLabel}>Preferred language</Text>
            <Text style={styles.detailValue}>{profile.preferredLanguage}</Text>
          </View>
        </View>

        {/* 5. CARD 3 — ACCOUNT & SECURITY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account &amp; security</Text>
          <Text style={styles.cardSubtitle}>
            Your owner identity is protected and cryptographically bound to each vehicle passport.
          </Text>

          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => onSecuritySettingsPress?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark-outline" size={15} color="#0056A2" />
            <Text style={styles.securityButtonText}>Security settings</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Password</Text>
            <Text style={styles.detailValue}>Updated 18 Aug 2026</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Two-factor authentication</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="checkmark-circle" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>ENABLED</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>Authenticator app</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last sign in</Text>
            <Text style={styles.detailValue}>30 Sep 2026 · 09:42</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.detailRow, styles.infoRowLast]}>
            <View style={styles.detailTopLine}>
              <Text style={styles.detailLabel}>Trusted devices</Text>
              <View style={styles.statusBadgeGreen}>
                <Ionicons name="shield-checkmark" size={11} color="#15803d" />
                <Text style={styles.statusBadgeGreenText}>NO ALERTS</Text>
              </View>
            </View>
            <Text style={styles.detailValue}>3 devices</Text>
          </View>
        </View>

        {/* Logout Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogoutPress}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={17} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 6. BOTTOM NAVIGATION */}
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

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="person" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Profile</Text>
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
    gap: 12,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056A2',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  editProfileButtonText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarSection: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  avatarOuterRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#bae6fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatarInnerCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0056A2',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  ownerRoleSubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    marginBottom: 10,
  },
  identityVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  identityVerifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: 12,
  },
  infoRowLast: {
    paddingBottom: 2,
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  infoValueMono: {
    fontSize: 12.5,
    color: '#0056A2',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    marginBottom: 14,
  },
  detailRow: {
    paddingVertical: 11,
  },
  detailTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13.5,
    color: '#0f172a',
    fontWeight: '600',
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    gap: 3,
  },
  statusBadgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 6,
    marginBottom: 14,
  },
  securityButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  logoutButton: {
    height: 44,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 2,
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 13.5,
    fontWeight: '700',
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

export default ProfileScreen;

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export const DashboardScreen: React.FC = () => {
  const { user, token, logout, verifyTokenWithBackend } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);

  const handleVerifyBackend = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyTokenWithBackend();
      setVerifyResult(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const role = user?.role || 'owner';

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'garage':
        return {
          bg: '#f0fdf4',
          border: '#86efac',
          text: '#15803d',
          label: 'Verified Garage Partner',
          icon: 'construct' as const,
        };
      case 'admin':
        return {
          bg: '#e0f7fa',
          border: '#7dd3fc',
          text: '#0369a1',
          label: 'System Administrator',
          icon: 'shield-checkmark' as const,
        };
      default:
        return {
          bg: '#ebf5ff',
          border: '#93c5fd',
          text: '#0056A2',
          label: 'Vehicle Owner',
          icon: 'car' as const,
        };
    }
  };

  const roleBadge = getRoleBadgeStyle();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.logoutIconButton} onPress={logout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card Banner */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name || user?.fullName)}</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.userName}>{user?.name || user?.fullName || 'AutoCare User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@autocare.io'}</Text>

            <View style={[styles.roleBadgeContainer, { backgroundColor: roleBadge.bg, borderColor: roleBadge.border }]}>
              <Ionicons name={roleBadge.icon} size={13} color={roleBadge.text} />
              <Text style={[styles.roleBadgeText, { color: roleBadge.text }]}>{roleBadge.label}</Text>
            </View>
          </View>
        </View>

        {/* Backend Connection Diagnostic */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleRow}>
              <Ionicons name="server-outline" size={17} color="#0056A2" />
              <Text style={styles.cardSectionTitle}>AutoCare 360 Backend Session</Text>
            </View>
            <View style={styles.chipActive}>
              <View style={styles.pulseDot} />
              <Text style={styles.chipText}>Authenticated</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>API Base URL</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {APP_CONFIG.API_BASE_URL}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID / Subject</Text>
            <Text style={styles.infoValueMono} numberOfLines={1}>
              {user?.id || user?._id || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={[styles.infoValue, { color: '#16a34a', fontWeight: '700' }]}>
              {(user?.status || 'Active').toUpperCase()}
            </Text>
          </View>

          {user?.phone ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          ) : null}

          {/* Test Token Introspection */}
          <TouchableOpacity
            style={[styles.verifyButton, isVerifying && styles.buttonDisabled]}
            onPress={handleVerifyBackend}
            disabled={isVerifying}
            activeOpacity={0.8}
          >
            {isVerifying ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={15} color="#ffffff" />
                <Text style={styles.verifyButtonText}>Verify Token with Backend (/api/auth/me)</Text>
              </>
            )}
          </TouchableOpacity>

          {verifyResult ? (
            <View
              style={[
                styles.verifyBox,
                verifyResult.success ? styles.verifySuccessBox : styles.verifyErrorBox,
              ]}
            >
              {verifyResult.success ? (
                <>
                  <Text style={styles.verifySuccessTitle}>✓ Backend Verified Token (200 OK)</Text>
                  <Text style={styles.verifyDetail}>
                    Express backend accepted JWT Bearer token and validated user profile.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.verifyErrorTitle}>✕ Verification Failed</Text>
                  <Text style={styles.verifyDetail}>{verifyResult.error}</Text>
                </>
              )}
            </View>
          ) : null}
        </View>

        {/* Role-Specific Workstation Features */}
        <Text style={styles.sectionHeading}>
          {role === 'garage'
            ? 'Garage Workstation'
            : role === 'admin'
            ? 'System Administration'
            : 'Vehicle Owner Hub'}
        </Text>

        <View style={styles.gridContainer}>
          {role === 'owner' && (
            <>
              <View style={styles.gridCard}>
                <Ionicons name="car-sport" size={24} color="#0056A2" />
                <Text style={styles.gridTitle}>My Vehicles</Text>
                <Text style={styles.gridDesc}>Digital vehicle passport & lifetime maintenance</Text>
              </View>

              <View style={styles.gridCard}>
                <Ionicons name="document-text" size={24} color="#16a34a" />
                <Text style={styles.gridTitle}>Service Records</Text>
                <Text style={styles.gridDesc}>Tamper-evident service and garage stamps</Text>
              </View>
            </>
          )}

          {role === 'garage' && (
            <>
              <View style={styles.gridCard}>
                <Ionicons name="build" size={24} color="#16a34a" />
                <Text style={styles.gridTitle}>Active Services</Text>
                <Text style={styles.gridDesc}>Vehicles currently undergoing maintenance</Text>
              </View>

              <View style={styles.gridCard}>
                <Ionicons name="receipt" size={24} color="#0056A2" />
                <Text style={styles.gridTitle}>Invoice Generator</Text>
                <Text style={styles.gridDesc}>Issue digital maintenance record & warranty</Text>
              </View>
            </>
          )}

          {role === 'admin' && (
            <>
              <View style={styles.gridCard}>
                <Ionicons name="business" size={24} color="#0284c7" />
                <Text style={styles.gridTitle}>Garages Audit</Text>
                <Text style={styles.gridDesc}>Approve and verify registered service centers</Text>
              </View>

              <View style={styles.gridCard}>
                <Ionicons name="analytics" size={24} color="#7c3aed" />
                <Text style={styles.gridTitle}>System Logs</Text>
                <Text style={styles.gridDesc}>Immutable audit trail of record changes</Text>
              </View>
            </>
          )}
        </View>

        {/* Sign Out CTA */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={17} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Sign Out from AutoCare 360</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="home" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
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
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLogo: {
    height: 38,
    width: 170,
  },
  logoutIconButton: {
    padding: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#0056A2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  profileMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12.5,
    color: '#64748b',
    marginTop: 1,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16a34a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  infoValueMono: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    maxWidth: '65%',
    textAlign: 'right',
  },
  verifyButton: {
    backgroundColor: '#0056A2',
    paddingVertical: 11,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  verifyBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  verifySuccessBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  verifyErrorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  verifySuccessTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#16a34a',
  },
  verifyErrorTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#dc2626',
  },
  verifyDetail: {
    fontSize: 11,
    color: '#475569',
    marginTop: 3,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
    marginLeft: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gridTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  gridDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 15,
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 13,
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

export default DashboardScreen;

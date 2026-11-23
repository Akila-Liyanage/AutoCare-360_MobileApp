import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { AuthRole } from '../types/auth.types';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  initialEmail?: string;
}

const DEMO_EMAILS: Record<AuthRole, string> = {
  owner: 'david.silva@autocare.io',
  garage: 'service@apexprecision.com',
  admin: 'admin.silva@autocare.io',
};

const ROLE_BUTTON_LABELS: Record<AuthRole, string> = {
  owner: 'Sign In As Vehicle Owner',
  garage: 'Sign In As Verified Garage',
  admin: 'Sign In As System Admin',
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  initialEmail,
}) => {
  const { login, error, clearError, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<AuthRole>('owner');
  const [email, setEmail] = useState<string>(initialEmail || DEMO_EMAILS.owner);
  const [password, setPassword] = useState<string>('Password123!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleRoleSelect = (role: AuthRole) => {
    setSelectedRole(role);
    setLocalError(null);
    setLocalSuccess(null);
    clearError();

    // If email is currently one of the demo emails or empty, update to the selected role's demo email
    if (!email || Object.values(DEMO_EMAILS).includes(email.trim().toLowerCase())) {
      setEmail(DEMO_EMAILS[role]);
    }
  };

  const handleLoginSubmit = async () => {
    setLocalError(null);
    setLocalSuccess(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Please enter your account email.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your account password.');
      return;
    }

    try {
      await login({
        username: trimmedEmail,
        password,
        role: selectedRole,
        selectedRole,
        rememberDevice,
      });
      setLocalSuccess('Authentication successful! Welcome to AutoCare 360.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(msg);
    }
  };

  const handleForgotPassword = () => {
    onNavigateToForgotPassword();
  };

  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with official logo on clean white background */}
      <View style={styles.topLogoBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessible
          accessibilityLabel="AutoCare 360 Logo"
        />
      </View>

      {/* 2. Vibrant Cyan-to-Green Gradient Background Container */}
      <LinearGradient
        colors={['#00B4EB', '#0891b2', '#0d9488', '#10b981', '#16a34a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Subtle background texture overlay */}
        <Image
          source={require('../../assets/bg-fade.png')}
          style={styles.bgFadeOverlay}
          resizeMode="cover"
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 3. Floating White Authentication Card */}
            <View style={styles.card}>
              {/* Card Header (Official Brand Blue #0056A2 Banner) */}
              <View style={styles.cardHeader}>
                <View style={styles.shieldBadge}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#00B4EB" />
                </View>
                <Text style={styles.cardTitle}>Sign In to AutoCare 360</Text>
                <Text style={styles.cardSubtitle}>
                  Access your digital vehicle passport, garage workstation, or administrative audit console
                </Text>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Role Selector Eyebrow */}
                <Text style={styles.roleEyebrow}>SELECT YOUR ACCESS ROLE</Text>

                {/* 3 Role Tabs (Segmented Control matching Screenshot) */}
                <View style={styles.roleTabsContainer}>
                  {/* Tab 1: Vehicle Owner */}
                  <TouchableOpacity
                    style={[
                      styles.roleTab,
                      selectedRole === 'owner' && styles.roleTabOwnerActive,
                    ]}
                    onPress={() => handleRoleSelect('owner')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="car-outline"
                      size={18}
                      color={selectedRole === 'owner' ? '#0056A2' : '#64748b'}
                    />
                    <Text
                      style={[
                        styles.roleTabText,
                        selectedRole === 'owner' && styles.roleTabOwnerTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      Vehicle Owner
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 2: Verified Garage */}
                  <TouchableOpacity
                    style={[
                      styles.roleTab,
                      selectedRole === 'garage' && styles.roleTabGarageActive,
                    ]}
                    onPress={() => handleRoleSelect('garage')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="construct-outline"
                      size={18}
                      color={selectedRole === 'garage' ? '#16a34a' : '#64748b'}
                    />
                    <Text
                      style={[
                        styles.roleTabText,
                        selectedRole === 'garage' && styles.roleTabGarageTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      Verified Garage
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 3: System Admin */}
                  <TouchableOpacity
                    style={[
                      styles.roleTab,
                      selectedRole === 'admin' && styles.roleTabAdminActive,
                    ]}
                    onPress={() => handleRoleSelect('admin')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="shield-outline"
                      size={18}
                      color={selectedRole === 'admin' ? '#0284c7' : '#64748b'}
                    />
                    <Text
                      style={[
                        styles.roleTabText,
                        selectedRole === 'admin' && styles.roleTabAdminTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      System Admin
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Inline Error Notice */}
                {displayError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
                    <Text style={styles.errorText}>{displayError}</Text>
                  </View>
                ) : null}

                {/* Inline Success Notice */}
                {localSuccess ? (
                  <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
                    <Text style={styles.successText}>{localSuccess}</Text>
                  </View>
                ) : null}

                {/* Account Email Field */}
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Account Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={16}
                      color="#94a3b8"
                      style={styles.inputLeftIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. name@example.com"
                      placeholderTextColor="#94a3b8"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (displayError) {
                          setLocalError(null);
                          clearError();
                        }
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Account Password Field */}
                <View style={styles.formGroup}>
                  <View style={styles.passwordHeaderRow}>
                    <Text style={styles.inputLabel}>Account Password</Text>
                    <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={16}
                      color="#94a3b8"
                      style={styles.inputLeftIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••••••"
                      placeholderTextColor="#94a3b8"
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        if (displayError) {
                          setLocalError(null);
                          clearError();
                        }
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.eyeToggleBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={17}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember Device Checkbox */}
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberDevice((prev) => !prev)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, rememberDevice && styles.checkboxActive]}>
                    {rememberDevice && (
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember this device for 30 days</Text>
                </TouchableOpacity>

                {/* Sign In CTA Button */}
                <TouchableOpacity
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                  onPress={handleLoginSubmit}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>
                        {ROLE_BUTTON_LABELS[selectedRole]}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                    </>
                  )}
                </TouchableOpacity>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.footerBrandingRow}>
                    <Text style={styles.footerBrandText}>AutoCare 360</Text>
                    <View style={styles.vmrBadge}>
                      <Text style={styles.vmrBadgeText}>Universal VMR</Text>
                    </View>
                  </View>
                  <Text style={styles.footerEcosystemText}>
                    Digital Vehicle Passport & Maintenance Ecosystem
                  </Text>
                  <View style={styles.footerRegisterPromptRow}>
                    <Text style={styles.footerPromptText}>
                      Don't have a passport or garage account yet?{' '}
                    </Text>
                    <TouchableOpacity onPress={onNavigateToRegister} disabled={isLoading}>
                      <Text style={styles.footerRegisterLink}>Register your vehicle or business</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* 4. Bottom Navigation Bar matching Screenshot */}
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
  topLogoBar: {
    height: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  logoImage: {
    height: 44,
    width: Math.min(width * 0.65, 230),
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
  bgFadeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.18,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardHeader: {
    backgroundColor: '#0056A2',
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  shieldBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 10.5,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 320,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  roleEyebrow: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  roleTabsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  roleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  roleTabOwnerActive: {
    borderColor: '#0056A2',
    backgroundColor: '#ebf5ff',
  },
  roleTabGarageActive: {
    borderColor: '#50B748',
    backgroundColor: '#f0fdf4',
  },
  roleTabAdminActive: {
    borderColor: '#00B4EB',
    backgroundColor: '#e0f7fa',
  },
  roleTabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  roleTabOwnerTextActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
  roleTabGarageTextActive: {
    color: '#15803d',
    fontWeight: '700',
  },
  roleTabAdminTextActive: {
    color: '#0369a1',
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  successText: {
    color: '#16a34a',
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  passwordHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0056A2',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 12.5,
    padding: 0,
  },
  eyeToggleBtn: {
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 14,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    borderColor: '#0056A2',
    backgroundColor: '#0056A2',
  },
  rememberText: {
    fontSize: 11,
    color: '#475569',
  },
  primaryButton: {
    height: 42,
    backgroundColor: '#0056A2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  footerBrandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerBrandText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  vmrBadge: {
    backgroundColor: '#effcf0',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  vmrBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
  },
  footerEcosystemText: {
    fontSize: 9.5,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  footerRegisterPromptRow: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPromptText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  footerRegisterLink: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0056A2',
    textAlign: 'center',
    marginTop: 1,
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

export default LoginScreen;

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
import { AuthRole } from '../types/auth.types';

const { width } = Dimensions.get('window');

interface RegisterScreenProps {
  onNavigateToLogin: (registeredEmail?: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const { register, clearError, isLoading, login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'owner' | 'garage'>('owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isLoggingInAfterRegister, setIsLoggingInAfterRegister] = useState(false);

  const handleRegister = async () => {
    setLocalError(null);
    setSuccessInfo(null);
    clearError();

    if (!fullName.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      setLocalError('Please enter your phone number');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      const result = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: selectedRole,
      });

      setSuccessInfo(result.message || 'Account registered successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setLocalError(msg);
    }
  };

  const handleAutoLogin = async () => {
    setIsLoggingInAfterRegister(true);
    try {
      await login({
        username: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        selectedRole,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLocalError(`Auto-login failed: ${msg}. Please log in manually.`);
      setIsLoggingInAfterRegister(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topLogoBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Gradient Background */}
      <LinearGradient
        colors={['#00B4EB', '#0891b2', '#0d9488', '#10b981', '#16a34a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradientContainer}
      >
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
            <View style={styles.card}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.shieldBadge}>
                  <Ionicons name="person-add-outline" size={18} color="#00B4EB" />
                </View>
                <Text style={styles.cardTitle}>Create AutoCare Account</Text>
                <Text style={styles.cardSubtitle}>
                  Register your vehicle passport or verified service garage workstation
                </Text>
              </View>

              <View style={styles.cardBody}>
                {successInfo ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={32} color="#16a34a" />
                    <Text style={styles.successTitle}>Registration Successful!</Text>
                    <Text style={styles.successText}>
                      Your account for <Text style={styles.boldText}>{email}</Text> has been created in the AutoCare 360 database.
                    </Text>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleAutoLogin}
                      disabled={isLoggingInAfterRegister}
                    >
                      {isLoggingInAfterRegister ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <>
                          <Text style={styles.primaryButtonText}>Sign In Directly</Text>
                          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => onNavigateToLogin(email)}
                    >
                      <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Role Selection */}
                    <Text style={styles.roleEyebrow}>CHOOSE REGISTRATION TYPE</Text>
                    <View style={styles.roleTabsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.roleTab,
                          selectedRole === 'owner' && styles.roleTabOwnerActive,
                        ]}
                        onPress={() => setSelectedRole('owner')}
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
                        >
                          Vehicle Owner
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.roleTab,
                          selectedRole === 'garage' && styles.roleTabGarageActive,
                        ]}
                        onPress={() => setSelectedRole('garage')}
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
                        >
                          Verified Garage
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Inline Error */}
                    {localError ? (
                      <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
                        <Text style={styles.errorText}>{localError}</Text>
                      </View>
                    ) : null}

                    {/* Full Name Field */}
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder={selectedRole === 'garage' ? 'e.g. Apex Auto Repairs' : 'e.g. David Silva'}
                          placeholderTextColor="#94a3b8"
                          value={fullName}
                          onChangeText={setFullName}
                          editable={!isLoading}
                        />
                      </View>
                    </View>

                    {/* Email Field */}
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="e.g. name@example.com"
                          placeholderTextColor="#94a3b8"
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                          editable={!isLoading}
                        />
                      </View>
                    </View>

                    {/* Phone Number Field */}
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Phone Number</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="e.g. +94 77 123 4567"
                          placeholderTextColor="#94a3b8"
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          editable={!isLoading}
                        />
                      </View>
                    </View>

                    {/* Password Field */}
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Password (Min 6 Characters)</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="••••••••••••"
                          placeholderTextColor="#94a3b8"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          editable={!isLoading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeToggleBtn}>
                          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={17} color="#94a3b8" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="••••••••••••"
                          placeholderTextColor="#94a3b8"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showPassword}
                          editable={!isLoading}
                        />
                      </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                      style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                      onPress={handleRegister}
                      disabled={isLoading}
                      activeOpacity={0.85}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <>
                          <Text style={styles.primaryButtonText}>
                            Create {selectedRole === 'garage' ? 'Garage' : 'Owner'} Account
                          </Text>
                          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                        </>
                      )}
                    </TouchableOpacity>

                    {/* Link back to login */}
                    <View style={styles.footerRow}>
                      <Text style={styles.footerPromptText}>Already have an account? </Text>
                      <TouchableOpacity onPress={() => onNavigateToLogin()} disabled={isLoading}>
                        <Text style={styles.footerRegisterLink}>Sign in here</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
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
    gap: 8,
    marginBottom: 14,
  },
  roleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
  roleTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  roleTabOwnerTextActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
  roleTabGarageTextActive: {
    color: '#15803d',
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
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1e293b',
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
  primaryButton: {
    height: 42,
    backgroundColor: '#0056A2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '600',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 10,
  },
  successText: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerPromptText: {
    fontSize: 11,
    color: '#64748b',
  },
  footerRegisterLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0056A2',
  },
});

export default RegisterScreen;

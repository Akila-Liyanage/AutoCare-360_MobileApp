import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type OwnerProfileData = {
  fullName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  primaryRegion: string;
};

export const DEFAULT_OWNER_PROFILE: OwnerProfileData = {
  fullName: 'David Silva',
  email: 'david.silva@autocare.io',
  phone: '077-0603956',
  preferredLanguage: 'English',
  primaryRegion: 'Colombo, Sri Lanka',
};

const LANGUAGE_OPTIONS = ['English', 'Sinhala', 'Tamil'];

export type EditProfileScreenProps = {
  initialProfile?: OwnerProfileData;
  onBack: () => void;
  onCancel: () => void;
  onSave: (updatedProfile: OwnerProfileData) => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
};

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  initialProfile = DEFAULT_OWNER_PROFILE,
  onBack,
  onCancel,
  onSave,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const [fullName, setFullName] = useState<string>(initialProfile.fullName);
  const [email, setEmail] = useState<string>(initialProfile.email);
  const [phone, setPhone] = useState<string>(initialProfile.phone);
  const [preferredLanguage, setPreferredLanguage] = useState<string>(
    initialProfile.preferredLanguage
  );
  const [primaryRegion, setPrimaryRegion] = useState<string>(
    initialProfile.primaryRegion
  );
  const [languageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedRegion = primaryRegion.trim() || DEFAULT_OWNER_PROFILE.primaryRegion;

    const nextErrors: FormErrors = {};

    if (!trimmedName) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!trimmedPhone) {
      nextErrors.phone = 'Contact phone is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSave({
      fullName: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      preferredLanguage,
      primaryRegion: trimmedRegion,
    });
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

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 2. TOP BACK & TITLE */}
          <View style={styles.pageHeaderSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={16} color="#0056A2" />
              <Text style={styles.backButtonText}>Back to Profile</Text>
            </TouchableOpacity>

            <Text style={styles.pageEyebrow}>OWNER MANAGEMENT</Text>
            <Text style={styles.pageTitle}>Edit Profile</Text>
            <Text style={styles.pageSubtitle}>
              Update your vehicle-owner identity, contact details, and regional preferences.
            </Text>
          </View>

          {/* 3. PROFILE PHOTO CARD */}
          <View style={styles.card}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarOuterRing}>
                <View style={styles.avatarInnerCircle}>
                  <Ionicons name="person" size={38} color="#0056A2" />
                </View>

                <TouchableOpacity
                  style={styles.avatarCameraBadge}
                  activeOpacity={0.85}
                  accessibilityLabel="Change profile photo"
                >
                  <Ionicons name="camera-outline" size={14} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.avatarHelperTitle}>{fullName.trim() || 'Vehicle Owner'}</Text>
              <Text style={styles.avatarHelperText}>
                Profile photo appears on authorized digital vehicle passports.
              </Text>

              <TouchableOpacity
                style={styles.changePhotoButton}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={15} color="#0056A2" />
                <Text style={styles.changePhotoButtonText}>Change photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. EDIT FORM CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal &amp; contact details</Text>
            <Text style={styles.cardSubtitle}>
              Keep your owner details accurate for verification and service sharing.
            </Text>

            <View style={styles.divider} />

            {/* Full Name */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Full name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.fullName ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={16}
                  color="#94a3b8"
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    clearFieldError('fullName');
                  }}
                  autoCapitalize="words"
                  accessibilityLabel="Full name"
                />
              </View>
              {errors.fullName ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.fullName}</Text>
                </View>
              ) : null}
            </View>

            {/* Email Address */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email ? styles.inputWrapperError : null,
                ]}
              >
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
                    clearFieldError('email');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  accessibilityLabel="Email address"
                />
              </View>
              {errors.email ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>

            {/* Contact Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Contact phone</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.phone ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={16}
                  color="#94a3b8"
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 077-0603956"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    clearFieldError('phone');
                  }}
                  keyboardType="phone-pad"
                  accessibilityLabel="Contact phone"
                />
              </View>
              {errors.phone ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.phone}</Text>
                </View>
              ) : null}
            </View>

            {/* Preferred Language (Frontend-only selector) */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Preferred language</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => setLanguageMenuOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Preferred language"
              >
                <View style={styles.selectorLeft}>
                  <Ionicons
                    name="globe-outline"
                    size={16}
                    color="#94a3b8"
                    style={styles.inputLeftIcon}
                  />
                  <Text style={styles.selectorValue}>{preferredLanguage}</Text>
                </View>
                <Ionicons
                  name={languageMenuOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={17}
                  color="#64748b"
                />
              </Pressable>

              {languageMenuOpen ? (
                <View style={styles.dropdownMenu}>
                  {LANGUAGE_OPTIONS.map((option, idx) => {
                    const isSelected = option === preferredLanguage;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < LANGUAGE_OPTIONS.length - 1
                            ? styles.dropdownItemBorder
                            : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setPreferredLanguage(option);
                          setLanguageMenuOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected ? styles.dropdownItemTextSelected : null,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected ? (
                          <Ionicons name="checkmark" size={16} color="#0056A2" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* Primary Region */}
            <View style={styles.formGroupLast}>
              <Text style={styles.inputLabel}>Primary region</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#94a3b8"
                  style={styles.inputLeftIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Colombo, Sri Lanka"
                  placeholderTextColor="#94a3b8"
                  value={primaryRegion}
                  onChangeText={setPrimaryRegion}
                  accessibilityLabel="Primary region"
                />
              </View>
            </View>
          </View>

          {/* 5. ACTION BUTTONS */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle-outline" size={17} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Save changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

        <TouchableOpacity
          style={styles.tabItem}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
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
  keyboardContainer: {
    flex: 1,
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
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 12,
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
  avatarCameraBadge: {
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
  avatarHelperTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  avatarHelperText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    gap: 6,
  },
  changePhotoButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
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
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 14,
  },
  formGroupLast: {
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
  },
  inputWrapperError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 13.5,
    padding: 0,
  },
  inlineErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  inlineErrorText: {
    fontSize: 11.5,
    color: '#dc2626',
    fontWeight: '500',
    flex: 1,
  },
  selectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorValue: {
    fontSize: 13.5,
    color: '#0f172a',
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemSelected: {
    backgroundColor: '#ebf5ff',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 10,
    marginTop: 2,
  },
  primaryButton: {
    height: 46,
    backgroundColor: '#0056A2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
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

export default EditProfileScreen;

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  initialIdentifier?: string;
  onNavigateToLogin: () => void;
  onContinue: (identifier: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  initialIdentifier = '',
  onNavigateToLogin,
  onContinue,
}) => {
  const [contactInput, setContactInput] = useState<string>(initialIdentifier);
  const [retainedContact, setRetainedContact] = useState<string>(initialIdentifier);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleContinue = () => {
    const trimmed = contactInput.trim();

    if (!trimmed) {
      setValidationError('Please enter your email address or phone number.');
      return;
    }

    setValidationError(null);
    setContactInput(trimmed);
    setRetainedContact(trimmed);
    onContinue(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. White header with centered AutoCare 360 logo */}
      <View style={styles.topLogoBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessible
          accessibilityLabel="AutoCare 360 Logo"
        />
      </View>

      {/* 2. Cyan-to-Green Gradient Background */}
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
            {/* 3. White Rounded Centered Card */}
            <View style={styles.card}>
              {/* Back Action */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={onNavigateToLogin}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="arrow-back" size={16} color="#0056A2" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              {/* Title & Explanatory Copy */}
              <Text style={styles.cardTitle}>Reset Password</Text>
              <Text style={styles.cardSubtitle}>
                Enter the email address or phone number associated with your AutoCare 360 account to continue.
              </Text>

              {/* Inline Validation Error */}
              {validationError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{validationError}</Text>
                </View>
              ) : null}

              {/* Email / Phone Number Field */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Email / Phone Number</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    validationError ? styles.inputWrapperError : null,
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
                    placeholder="e.g. name@example.com or +94 77 123 4567"
                    placeholderTextColor="#94a3b8"
                    value={contactInput}
                    onChangeText={(val) => {
                      setContactInput(val);
                      if (validationError) {
                        setValidationError(null);
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                    accessibilityLabel="Email or Phone Number"
                  />
                </View>
              </View>

              {/* Continue CTA Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
                activeOpacity={0.85}
                accessibilityState={{ selected: Boolean(retainedContact) }}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* 4. Bottom Navigation Bar Visual */}
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
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 18,
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
    marginBottom: 14,
    gap: 6,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  formGroup: {
    marginBottom: 18,
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
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  inputWrapperError: {
    borderColor: '#dc2626',
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 13,
    padding: 0,
  },
  primaryButton: {
    height: 44,
    backgroundColor: '#0056A2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
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

export default ForgotPasswordScreen;

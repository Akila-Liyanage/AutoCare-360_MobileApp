import React, { useEffect, useRef, useState } from 'react';
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
  TextInputKeyPressEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CODE_LENGTH = 5;

interface VerifyCodeScreenProps {
  identifier: string;
  initialCode?: string;
  onBack: () => void;
  onContinue: (code: string) => void;
}

const buildInitialDigits = (code?: string): string[] => {
  const sanitized = (code || '').replace(/\D/g, '').slice(0, CODE_LENGTH);
  return Array.from({ length: CODE_LENGTH }, (_, idx) => sanitized[idx] || '');
};

export const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  identifier,
  initialCode,
  onBack,
  onContinue,
}) => {
  const [digits, setDigits] = useState<string[]>(() => buildInitialDigits(initialCode));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRefs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
    return () => clearTimeout(focusTimer);
  }, []);

  const handleDigitChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, '');
    const digit = cleaned.slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);

    if (validationError) {
      setValidationError(null);
    }

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: TextInputKeyPressEvent
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const code = digits.join('');

    if (code.length < CODE_LENGTH) {
      setValidationError('Please enter the 5-digit verification code.');
      return;
    }

    setValidationError(null);
    onContinue(code);
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
                onPress={onBack}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="arrow-back" size={16} color="#0056A2" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              {/* Title & Supporting Copy */}
              <Text style={styles.cardTitle}>Enter Verification Code</Text>
              <Text style={styles.cardSubtitle}>
                The Verification Code Has Been Sent To Your Email
              </Text>
              {identifier ? (
                <Text style={styles.identifierText} numberOfLines={1}>
                  {identifier}
                </Text>
              ) : null}

              {/* Inline Validation Error */}
              {validationError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{validationError}</Text>
                </View>
              ) : null}

              {/* 5 Verification Code Boxes */}
              <View style={styles.codeRow}>
                {digits.map((digit, index) => {
                  const isFocused = focusedIndex === index;
                  return (
                    <TextInput
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      style={[
                        styles.codeBox,
                        isFocused ? styles.codeBoxFocused : null,
                        validationError && !digit ? styles.codeBoxError : null,
                      ]}
                      value={digit}
                      onChangeText={(val) => handleDigitChange(index, val)}
                      onKeyPress={(event) => handleKeyPress(index, event)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() =>
                        setFocusedIndex((prev) => (prev === index ? -1 : prev))
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      autoFocus={index === 0}
                      selectTextOnFocus
                      textAlign="center"
                      returnKeyType={index === CODE_LENGTH - 1 ? 'done' : 'next'}
                      onSubmitEditing={
                        index === CODE_LENGTH - 1 ? handleContinue : undefined
                      }
                      accessibilityLabel={`Verification code digit ${index + 1}`}
                    />
                  );
                })}
              </View>

              {/* Resend Helper Text */}
              <Text style={styles.resendHelperText}>
                Not Received Yet?{' '}
                <Text style={styles.resendHighlightText}>
                  Resend After 59 Seconds
                </Text>
              </Text>

              {/* Continue CTA Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
                activeOpacity={0.85}
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
    marginBottom: 6,
  },
  identifierText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
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
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  codeBox: {
    flex: 1,
    height: 48,
    borderWidth: 1.2,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    padding: 0,
  },
  codeBoxFocused: {
    borderColor: '#0056A2',
    backgroundColor: '#ebf5ff',
  },
  codeBoxError: {
    borderColor: '#dc2626',
  },
  resendHelperText: {
    fontSize: 11.5,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 18,
  },
  resendHighlightText: {
    color: '#0056A2',
    fontWeight: '600',
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

export default VerifyCodeScreen;

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
import { Ionicons } from '@expo/vector-icons';

export type SecureLinkStep2Data = {
  expiresIn: string;
  maxViews: string;
  requireViewerName: boolean;
  requireOtp: boolean;
  allowDownload: boolean;
};

export interface SecureLinkProtectionScreenProps {
  initialDraft?: SecureLinkStep2Data | null;
  onBackPress?: (currentDraft: SecureLinkStep2Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: SecureLinkStep2Data) => void;
  onSaveDraftPress?: (draft: SecureLinkStep2Data) => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type ValidationErrors = Partial<Record<'expiresIn' | 'maxViews', string>>;

const EXPIRY_OPTIONS: string[] = ['24 hours', '48 hours', '72 hours', '7 days'];

function isPositiveInteger(raw: string): boolean {
  const trimmed = raw.trim();
  return /^[1-9]\d*$/.test(trimmed);
}

export const SecureLinkProtectionScreen: React.FC<
  SecureLinkProtectionScreenProps
> = ({
  initialDraft,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onContinuePress,
  onSaveDraftPress,
  onHomePress,
  onVehiclesPress,
  onSharingPress,
  onHealthPress,
}) => {
  const [expiresIn, setExpiresIn] = useState<string>(
    initialDraft?.expiresIn ?? '48 hours'
  );
  const [maxViews, setMaxViews] = useState<string>(
    initialDraft?.maxViews ?? '10'
  );
  const [requireViewerName, setRequireViewerName] = useState<boolean>(
    initialDraft?.requireViewerName ?? true
  );
  const [requireOtp, setRequireOtp] = useState<boolean>(
    initialDraft?.requireOtp ?? true
  );
  const [allowDownload, setAllowDownload] = useState<boolean>(
    initialDraft?.allowDownload ?? false
  );

  const [expiryDropdownOpen, setExpiryDropdownOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const validMaxViews = isPositiveInteger(maxViews) ? maxViews.trim() : null;

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildPayload = (): SecureLinkStep2Data => ({
    expiresIn: expiresIn.trim(),
    maxViews: maxViews.trim(),
    requireViewerName,
    requireOtp,
    allowDownload,
  });

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!expiresIn.trim()) {
      nextErrors.expiresIn = 'Please choose an expiry duration.';
    }
    if (!maxViews.trim()) {
      nextErrors.maxViews = 'Maximum views is required.';
    } else if (!isPositiveInteger(maxViews)) {
      nextErrors.maxViews = 'Enter a positive whole number (e.g. 10).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    setExpiryDropdownOpen(false);
    if (!validateForm()) {
      return;
    }
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setExpiryDropdownOpen(false);
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
  };

  const handleBack = () => {
    onBackPress?.({
      expiresIn,
      maxViews,
      requireViewerName,
      requireOtp,
      allowDownload,
    });
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
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Back to Recipient and Records"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-5 · SECURE LINK</Text>
          <Text style={styles.pageTitle}>Protection</Text>
          <Text style={styles.pageSubtitle}>
            Control expiry, viewing limits and identity checks.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 2 of 3 · Protection</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
          </View>
        </View>

        {/* 4. LINK EXPIRY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="time-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Link expiry</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>EXPIRES IN</Text>
          <TouchableOpacity
            style={[
              styles.selectorBox,
              errors.expiresIn ? styles.inputErrorBorder : null,
            ]}
            onPress={() => setExpiryDropdownOpen((prev) => !prev)}
            activeOpacity={0.8}
            accessibilityLabel="Select link expiry"
          >
            <Text style={styles.selectorText}>{expiresIn}</Text>
            <Ionicons
              name={expiryDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748b"
            />
          </TouchableOpacity>
          {errors.expiresIn ? (
            <Text style={styles.errorText}>{errors.expiresIn}</Text>
          ) : null}

          {expiryDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              {EXPIRY_OPTIONS.map((option, idx) => {
                const isSelected = option === expiresIn;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      idx < EXPIRY_OPTIONS.length - 1
                        ? styles.dropdownOptionBorder
                        : null,
                      isSelected ? styles.dropdownOptionSelected : null,
                    ]}
                    onPress={() => {
                      setExpiresIn(option);
                      setExpiryDropdownOpen(false);
                      setDraftSaved(false);
                      clearFieldError('expiresIn');
                    }}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected ? styles.dropdownOptionTextSelected : null,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={17} color="#0056A2" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* 5. VIEWING LIMIT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="eye-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Viewing limit</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>MAXIMUM VIEWS</Text>
          <View
            style={[
              styles.inputBox,
              errors.maxViews ? styles.inputErrorBorder : null,
            ]}
          >
            <Ionicons
              name="stats-chart-outline"
              size={16}
              color="#64748b"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              value={maxViews}
              onChangeText={(text) => {
                setMaxViews(text);
                setDraftSaved(false);
                if (text.trim() && !isPositiveInteger(text)) {
                  setErrors((prev) => ({
                    ...prev,
                    maxViews: 'Enter a positive whole number (e.g. 10).',
                  }));
                } else {
                  clearFieldError('maxViews');
                }
              }}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Maximum views"
            />
          </View>
          {errors.maxViews ? (
            <Text style={styles.errorText}>{errors.maxViews}</Text>
          ) : (
            <Text style={styles.helperText}>
              Link automatically locks when this limit is reached.
            </Text>
          )}
        </View>

        {/* 6. VIEWER IDENTITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>Viewer identity</Text>
          </View>

          <View style={styles.divider} />

          {/* Require viewer name */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => {
              setRequireViewerName((prev) => !prev);
              setDraftSaved(false);
            }}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: requireViewerName }}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Require viewer name</Text>
              <Text style={styles.toggleHelper}>
                Viewer enters their name before opening the shared records.
              </Text>
            </View>

            <View
              style={[
                styles.switchTrack,
                requireViewerName ? styles.switchTrackOn : styles.switchTrackOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  requireViewerName ? styles.switchThumbOn : null,
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Require OTP verification */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => {
              setRequireOtp((prev) => !prev);
              setDraftSaved(false);
            }}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: requireOtp }}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Require OTP verification</Text>
              <Text style={styles.toggleHelper}>
                A one-time code will be required before access.
              </Text>
            </View>

            <View
              style={[
                styles.switchTrack,
                requireOtp ? styles.switchTrackOn : styles.switchTrackOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  requireOtp ? styles.switchThumbOn : null,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* 7. DOCUMENT PROTECTION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="lock-closed-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Document protection</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => {
              setAllowDownload((prev) => !prev);
              setDraftSaved(false);
            }}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: allowDownload }}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Allow downloads</Text>
              <Text style={styles.toggleHelper}>
                When disabled, shared files can only be viewed inside the
                protected viewer.
              </Text>
            </View>

            <View
              style={[
                styles.switchTrack,
                allowDownload ? styles.switchTrackOn : styles.switchTrackOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  allowDownload ? styles.switchThumbOn : null,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* 8. PROTECTION SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderSpread}>
            <Text style={styles.cardTitle}>Protection summary</Text>
            <View style={styles.protectedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#15803d" />
              <Text style={styles.protectedBadgeText}>Protected</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Expires:</Text>
              <Text style={styles.summaryValue}>{expiresIn || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Views:</Text>
              <Text style={styles.summaryValue}>
                {validMaxViews ? `${validMaxViews} maximum` : '—'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Viewer name:</Text>
              <Text style={styles.summaryValue}>
                {requireViewerName ? 'Required' : 'Optional'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>OTP:</Text>
              <Text style={styles.summaryValue}>
                {requireOtp ? 'Required' : 'Off'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Downloads:</Text>
              <Text style={styles.summaryValue}>
                {allowDownload ? 'Allowed' : 'Blocked'}
              </Text>
            </View>
          </View>
        </View>

        {/* 9. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue to link</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveDraftButton}
            onPress={handleSaveDraft}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={16} color="#0056A2" />
            <Text style={styles.saveDraftButtonText}>Save draft</Text>
          </TouchableOpacity>

          {draftSaved ? (
            <View style={styles.draftHintRow}>
              <Ionicons name="checkmark-circle" size={14} color="#15803d" />
              <Text style={styles.draftHintText}>Draft saved locally</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 10. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onHomePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Home"
        >
          <Ionicons name="home-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Home</Text>
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
          onPress={() => onSharingPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Sharing"
        >
          <Ionicons name="share-social" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Sharing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onHealthPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Health"
        >
          <Ionicons name="pulse-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Health</Text>
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
    marginBottom: 14,
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
  stepSection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 13,
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 9,
  },
  stepProgressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepSegment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  stepSegmentActive: {
    backgroundColor: '#0056A2',
  },
  stepSegmentInactive: {
    backgroundColor: '#dbeafe',
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 16,
    marginBottom: 16,
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
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#475569',
    marginBottom: 6,
  },
  selectorBox: {
    minHeight: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownOptionTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  inputBox: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    padding: 0,
  },
  inputErrorBorder: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 6,
  },
  helperText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#64748b',
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextCol: {
    flex: 1,
    minWidth: 0,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  toggleHelper: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
  },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
    flexShrink: 0,
  },
  switchTrackOn: {
    backgroundColor: '#0056A2',
  },
  switchTrackOff: {
    backgroundColor: '#cbd5e1',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
    flexShrink: 0,
  },
  protectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  summaryList: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  saveDraftButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDraftButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  draftHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 2,
  },
  draftHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
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

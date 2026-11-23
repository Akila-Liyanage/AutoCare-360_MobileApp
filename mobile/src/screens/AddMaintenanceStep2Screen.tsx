import React, { useMemo, useState } from 'react';
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

export type MaintenanceStep2Data = {
  workPerformed: string;
  partsReplaced: string;
  labourCost: string;
  partsCost: string;
};

export interface AddMaintenanceStep2ScreenProps {
  vehicleLabel?: string;
  initialDraft?: MaintenanceStep2Data | null;
  onBackPress?: (currentDraft: MaintenanceStep2Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: MaintenanceStep2Data) => void;
  onSaveDraftPress?: (data: MaintenanceStep2Data) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type ValidationErrors = Partial<
  Record<'workPerformed' | 'labourCost' | 'partsCost', string>
>;

const DEFAULT_WORK_PERFORMED =
  'Full periodic maintenance; engine oil change; oil filter and air filter replacement; cooling system inspection.';
const DEFAULT_PARTS_REPLACED =
  'Toyota 0W-20 synthetic oil · Oil filter · Air filter · Cabin filter';
const DEFAULT_LABOUR_COST = 'LKR 18,500';
const DEFAULT_PARTS_COST = 'LKR 64,900';

export function parseCostAmount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const withoutCurrency = trimmed.replace(/^(?:LKR|RS\.?)\s*/i, '').trim();
  if (!withoutCurrency || withoutCurrency.startsWith('-')) {
    return null;
  }
  const normalized = withoutCurrency.replace(/,/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export function formatLkr(amount: number): string {
  const hasDecimals = Math.round(amount * 100) % 100 !== 0;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `LKR ${formatted}`;
}

export const AddMaintenanceStep2Screen: React.FC<
  AddMaintenanceStep2ScreenProps
> = ({
  vehicleLabel = 'WP ABC-1234 · Toyota Aqua',
  initialDraft,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onContinuePress,
  onSaveDraftPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [workPerformed, setWorkPerformed] = useState<string>(
    initialDraft?.workPerformed ?? DEFAULT_WORK_PERFORMED
  );
  const [partsReplaced, setPartsReplaced] = useState<string>(
    initialDraft?.partsReplaced ?? DEFAULT_PARTS_REPLACED
  );
  const [labourCost, setLabourCost] = useState<string>(
    initialDraft?.labourCost ?? DEFAULT_LABOUR_COST
  );
  const [partsCost, setPartsCost] = useState<string>(
    initialDraft?.partsCost ?? DEFAULT_PARTS_COST
  );

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const labourAmount = useMemo(() => parseCostAmount(labourCost), [labourCost]);
  const partsAmount = useMemo(() => parseCostAmount(partsCost), [partsCost]);

  const totalDisplay = useMemo(() => {
    if (labourAmount === null || partsAmount === null) {
      return '—';
    }
    return formatLkr(labourAmount + partsAmount);
  }, [labourAmount, partsAmount]);

  const buildPayload = (): MaintenanceStep2Data => ({
    workPerformed: workPerformed.trim(),
    partsReplaced: partsReplaced.trim(),
    labourCost: labourCost.trim(),
    partsCost: partsCost.trim(),
  });

  const handleLabourChange = (value: string) => {
    setLabourCost(value);
    setDraftSaved(false);
    if (value.trim() && parseCostAmount(value) === null) {
      setErrors((prev) => ({
        ...prev,
        labourCost: 'Enter a valid non-negative amount (e.g. LKR 18,500).',
      }));
    } else {
      setErrors((prev) => {
        if (!prev.labourCost) return prev;
        const next = { ...prev };
        delete next.labourCost;
        return next;
      });
    }
  };

  const handlePartsChange = (value: string) => {
    setPartsCost(value);
    setDraftSaved(false);
    if (value.trim() && parseCostAmount(value) === null) {
      setErrors((prev) => ({
        ...prev,
        partsCost: 'Enter a valid non-negative amount (e.g. LKR 64,900).',
      }));
    } else {
      setErrors((prev) => {
        if (!prev.partsCost) return prev;
        const next = { ...prev };
        delete next.partsCost;
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!workPerformed.trim()) {
      nextErrors.workPerformed = 'Please describe the work performed.';
    }
    if (!labourCost.trim()) {
      nextErrors.labourCost = 'Labour cost is required.';
    } else if (parseCostAmount(labourCost) === null) {
      nextErrors.labourCost =
        'Enter a valid non-negative amount (e.g. LKR 18,500).';
    }
    if (!partsCost.trim()) {
      nextErrors.partsCost = 'Parts cost is required.';
    } else if (parseCostAmount(partsCost) === null) {
      nextErrors.partsCost =
        'Enter a valid non-negative amount (e.g. LKR 64,900).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
  };

  const handleBack = () => {
    onBackPress?.({
      workPerformed,
      partsReplaced,
      labourCost,
      partsCost,
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
          accessibilityLabel="Back to Step 1"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>ADD MAINTENANCE RECORD</Text>
          <Text style={styles.pageTitle}>Work &amp; costs</Text>
          <View style={styles.vehicleSubtitleRow}>
            <Ionicons name="car-sport-outline" size={14} color="#0056A2" />
            <Text style={styles.vehicleSubtitleText} numberOfLines={1}>
              {vehicleLabel}
            </Text>
          </View>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 2 of 3 · Work &amp; costs</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
          </View>
        </View>

        {/* 4. WORK & PARTS CARD */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="build-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Work &amp; parts</Text>
          </View>

          <View style={styles.divider} />

          {/* Work Performed */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Work performed</Text>
            <TextInput
              style={[
                styles.multilineInput,
                styles.workInputHeight,
                errors.workPerformed ? styles.inputErrorBorder : null,
              ]}
              value={workPerformed}
              onChangeText={(text) => {
                setWorkPerformed(text);
                setDraftSaved(false);
                if (errors.workPerformed && text.trim()) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.workPerformed;
                    return next;
                  });
                }
              }}
              multiline
              textAlignVertical="top"
              placeholder="Describe the maintenance or repair work performed..."
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Work performed"
            />
            {errors.workPerformed ? (
              <Text style={styles.errorText}>{errors.workPerformed}</Text>
            ) : null}
          </View>

          {/* Parts Replaced */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>Parts replaced</Text>
            <TextInput
              style={[styles.multilineInput, styles.partsInputHeight]}
              value={partsReplaced}
              onChangeText={(text) => {
                setPartsReplaced(text);
                setDraftSaved(false);
              }}
              multiline
              textAlignVertical="top"
              placeholder="List replaced parts, oils, or consumables..."
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Parts replaced"
            />
          </View>
        </View>

        {/* 5. SERVICE COSTS CARD */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="calculator-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Service costs</Text>
          </View>

          <View style={styles.divider} />

          {/* Labour */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Labour</Text>
            <View
              style={[
                styles.inputBox,
                errors.labourCost ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="construct-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={labourCost}
                onChangeText={handleLabourChange}
                placeholder="LKR 18,500"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Labour cost"
              />
            </View>
            {errors.labourCost ? (
              <Text style={styles.errorText}>{errors.labourCost}</Text>
            ) : null}
          </View>

          {/* Parts */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Parts</Text>
            <View
              style={[
                styles.inputBox,
                errors.partsCost ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={partsCost}
                onChangeText={handlePartsChange}
                placeholder="LKR 64,900"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Parts cost"
              />
            </View>
            {errors.partsCost ? (
              <Text style={styles.errorText}>{errors.partsCost}</Text>
            ) : null}
          </View>

          {/* Total (Calculated Live) */}
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalDisplay}</Text>
            </View>
            <Text style={styles.totalHint}>
              {labourAmount !== null && partsAmount !== null
                ? 'Calculated automatically from Labour + Parts'
                : 'Enter valid Labour and Parts amounts to calculate total'}
            </Text>
          </View>
        </View>

        {/* 6. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              Continue to documents &amp; review
            </Text>
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

      {/* 7. GARAGE BOTTOM NAVIGATION (JOBS ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onGaragePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Garage"
        >
          <Ionicons name="construct-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Garage</Text>
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
          <Ionicons name="clipboard" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Jobs</Text>
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
    marginBottom: 6,
  },
  vehicleSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleSubtitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    flexShrink: 1,
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
  formCard: {
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
  fieldGroup: {
    marginBottom: 13,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  multilineInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
    color: '#0f172a',
  },
  workInputHeight: {
    minHeight: 96,
  },
  partsInputHeight: {
    minHeight: 78,
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
    fontSize: 13.5,
    fontWeight: '600',
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
    marginTop: 5,
  },
  totalContainer: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 13,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#004684',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#003566',
  },
  totalHint: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
  actionsSection: {
    gap: 10,
    marginTop: 4,
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

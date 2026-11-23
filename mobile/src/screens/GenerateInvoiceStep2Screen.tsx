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
import { InvoiceStep1Data } from './GenerateInvoiceStep1Screen';
import { formatLkr, parseCostAmount } from './AddMaintenanceStep2Screen';

export type InvoiceStep2Data = {
  labourCost: string;
  partsCost: string;
  tax: string;
  discount: string;
  ownerAuthorizationConfirmed: boolean;
  ownerAuthorizationCode?: string;
  publicationConfirmed: boolean;
  notes: string;
};

export type PreparedInvoice = {
  step1: InvoiceStep1Data;
  step2: InvoiceStep2Data;
  labourAmount: number;
  partsAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  linkedQuotationCode?: string;
  preparedAt: string;
};

export interface GenerateInvoiceStep2ScreenProps {
  step1Data?: InvoiceStep1Data | null;
  initialDraft?: InvoiceStep2Data | null;
  linkedQuotationCode?: string | null;
  onBackPress?: (currentDraft: InvoiceStep2Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onPrepareInvoicePress?: (invoice: PreparedInvoice) => void;
  onSaveDraftPress?: (draft: InvoiceStep2Data) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type ValidationErrors = Partial<
  Record<
    | 'step1'
    | 'labourCost'
    | 'partsCost'
    | 'tax'
    | 'discount'
    | 'ownerAuthorizationConfirmed'
    | 'ownerAuthorizationCode'
    | 'publicationConfirmed',
    string
  >
>;

export const GenerateInvoiceStep2Screen: React.FC<
  GenerateInvoiceStep2ScreenProps
> = ({
  step1Data,
  initialDraft,
  linkedQuotationCode,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onPrepareInvoicePress,
  onSaveDraftPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [labourCost, setLabourCost] = useState<string>(
    initialDraft?.labourCost ?? 'LKR 18,500'
  );
  const [partsCost, setPartsCost] = useState<string>(
    initialDraft?.partsCost ?? 'LKR 64,900'
  );
  const [tax, setTax] = useState<string>(initialDraft?.tax ?? 'LKR 0');
  const [discount, setDiscount] = useState<string>(
    initialDraft?.discount ?? 'LKR 0'
  );
  const [ownerAuthorizationConfirmed, setOwnerAuthorizationConfirmed] =
    useState<boolean>(initialDraft?.ownerAuthorizationConfirmed ?? false);
  const [ownerAuthorizationCode, setOwnerAuthorizationCode] = useState<string>(
    initialDraft?.ownerAuthorizationCode ?? ''
  );
  const [publicationConfirmed, setPublicationConfirmed] = useState<boolean>(
    initialDraft?.publicationConfirmed ?? false
  );
  const [notes, setNotes] = useState<string>(initialDraft?.notes ?? '');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [preparedNotice, setPreparedNotice] = useState<boolean>(false);

  const displayInvoiceNumber = step1Data?.invoiceNumber || 'INV-2026-0923';
  const displayVehicle = step1Data?.vehicleLabel || 'WP ABC-1234 · Toyota Aqua';
  const displayOwner = step1Data?.owner || 'Kaveesha P.';
  const displayService = step1Data?.serviceType || 'Periodic engine service';
  const displayServiceDate = step1Data?.serviceDate || '23 Sep 2026';
  const displayTechnician = step1Data?.technician || 'Indika Perera · TEC-2051';
  const displayOdometer = step1Data?.odometer || '85,240 km';

  const costValues = useMemo(() => {
    const labourNum = parseCostAmount(labourCost);
    const partsNum = parseCostAmount(partsCost);
    const taxNum = parseCostAmount(tax);
    const discountNum = parseCostAmount(discount);

    const allValid =
      labourNum !== null &&
      partsNum !== null &&
      taxNum !== null &&
      discountNum !== null;

    const totalNum = allValid
      ? Math.max(0, labourNum + partsNum + taxNum - discountNum)
      : null;

    return {
      labourNum,
      partsNum,
      taxNum,
      discountNum,
      totalNum,
      totalDisplay: totalNum !== null ? formatLkr(totalNum) : '—',
    };
  }, [labourCost, partsCost, tax, discount]);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCostInputChange = (
    field: 'labourCost' | 'partsCost' | 'tax' | 'discount',
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setDraftSaved(false);
    setPreparedNotice(false);
    if (value.trim() && parseCostAmount(value) === null) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Enter a valid non-negative amount.',
      }));
    } else {
      clearFieldError(field);
    }
  };

  const buildPayload = (): InvoiceStep2Data => ({
    labourCost: labourCost.trim(),
    partsCost: partsCost.trim(),
    tax: tax.trim(),
    discount: discount.trim(),
    ownerAuthorizationConfirmed,
    ownerAuthorizationCode: ownerAuthorizationCode.trim(),
    publicationConfirmed,
    notes,
  });

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!step1Data) {
      nextErrors.step1 =
        'Invoice Step 1 details are required before preparing this invoice.';
    }
    if (!labourCost.trim() || costValues.labourNum === null) {
      nextErrors.labourCost = 'Enter a valid non-negative labour cost.';
    }
    if (!partsCost.trim() || costValues.partsNum === null) {
      nextErrors.partsCost = 'Enter a valid non-negative parts cost.';
    }
    if (!tax.trim() || costValues.taxNum === null) {
      nextErrors.tax = 'Enter a valid non-negative tax amount.';
    }
    if (!discount.trim() || costValues.discountNum === null) {
      nextErrors.discount = 'Enter a valid non-negative discount amount.';
    }
    if (!ownerAuthorizationConfirmed) {
      nextErrors.ownerAuthorizationConfirmed =
        'Please confirm that the vehicle owner has reviewed and approved this invoice.';
    }
    if (!/^\d{6}$/.test(ownerAuthorizationCode.trim())) {
      nextErrors.ownerAuthorizationCode =
        'Enter a 6-digit authorization code for local preview.';
    }
    if (!publicationConfirmed) {
      nextErrors.publicationConfirmed =
        'Please confirm all service details and charges are correct.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePrepareInvoice = () => {
    if (
      !validateForm() ||
      !step1Data ||
      costValues.labourNum === null ||
      costValues.partsNum === null ||
      costValues.taxNum === null ||
      costValues.discountNum === null ||
      costValues.totalNum === null
    ) {
      setPreparedNotice(false);
      return;
    }

    const payload = buildPayload();
    const prepared: PreparedInvoice = {
      step1: step1Data,
      step2: payload,
      labourAmount: costValues.labourNum,
      partsAmount: costValues.partsNum,
      taxAmount: costValues.taxNum,
      discountAmount: costValues.discountNum,
      totalAmount: costValues.totalNum,
      linkedQuotationCode: linkedQuotationCode || undefined,
      preparedAt: new Date().toISOString(),
    };

    setPreparedNotice(true);
    setDraftSaved(false);
    onPrepareInvoicePress?.(prepared);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
  };

  const handleBack = () => {
    onBackPress?.({
      labourCost,
      partsCost,
      tax,
      discount,
      ownerAuthorizationConfirmed,
      ownerAuthorizationCode,
      publicationConfirmed,
      notes,
    });
  };

  const summaryRows: Array<{ label: string; value: string }> = [
    { label: 'Invoice number', value: displayInvoiceNumber },
    { label: 'Vehicle', value: displayVehicle },
    { label: 'Owner', value: displayOwner },
    { label: 'Service', value: displayService },
    { label: 'Service date', value: displayServiceDate },
    { label: 'Technician', value: displayTechnician },
    { label: 'Odometer', value: displayOdometer },
  ];

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
          accessibilityLabel="Back to Invoice Step 1"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR3 / GARAGE SERVICE MANAGEMENT</Text>
          <Text style={styles.pageTitle}>Generate invoice</Text>
        </View>

        {/* 3. STEP INDICATOR (STEP 2 OF 2) */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>
            Step 2 of 2 · Authorization &amp; publish
          </Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          </View>
        </View>

        {/* OPTIONAL LINKED QUOTATION */}
        {linkedQuotationCode ? (
          <View style={styles.linkedQuotationStrip}>
            <Ionicons name="link-outline" size={15} color="#0056A2" />
            <Text style={styles.linkedQuotationText}>
              Linked quotation: {linkedQuotationCode}
            </Text>
          </View>
        ) : null}

        {/* 4. INVOICE SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="receipt-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Invoice summary</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryList}>
            {summaryRows.map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. COST BREAKDOWN CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="calculator-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Cost breakdown</Text>
          </View>

          <View style={styles.divider} />

          {/* Labour & Parts */}
          <View style={[styles.twoColRow, styles.fieldGroup]}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Labour</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.labourCost ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={labourCost}
                  onChangeText={(value) =>
                    handleCostInputChange('labourCost', setLabourCost, value)
                  }
                  placeholder="LKR 18,500"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Labour cost"
                />
              </View>
              {errors.labourCost ? (
                <Text style={styles.errorText}>{errors.labourCost}</Text>
              ) : null}
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Parts</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.partsCost ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={partsCost}
                  onChangeText={(value) =>
                    handleCostInputChange('partsCost', setPartsCost, value)
                  }
                  placeholder="LKR 64,900"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Parts cost"
                />
              </View>
              {errors.partsCost ? (
                <Text style={styles.errorText}>{errors.partsCost}</Text>
              ) : null}
            </View>
          </View>

          {/* Tax & Discount */}
          <View style={[styles.twoColRow, styles.fieldGroup]}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Tax</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.tax ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={tax}
                  onChangeText={(value) =>
                    handleCostInputChange('tax', setTax, value)
                  }
                  placeholder="LKR 0"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Tax amount"
                />
              </View>
              {errors.tax ? (
                <Text style={styles.errorText}>{errors.tax}</Text>
              ) : null}
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Discount</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.discount ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={discount}
                  onChangeText={(value) =>
                    handleCostInputChange('discount', setDiscount, value)
                  }
                  placeholder="LKR 0"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Discount amount"
                />
              </View>
              {errors.discount ? (
                <Text style={styles.errorText}>{errors.discount}</Text>
              ) : null}
            </View>
          </View>

          {/* Calculated Total */}
          <View style={styles.totalSummaryBox}>
            <View style={styles.totalTopRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{costValues.totalDisplay}</Text>
            </View>
            <Text style={styles.totalHint}>
              Labour + Parts + Tax − Discount (minimum LKR 0)
            </Text>
          </View>
        </View>

        {/* 6. OWNER AUTHORIZATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color="#0056A2"
                />
              </View>
              <Text style={styles.cardTitle}>Owner authorization</Text>
            </View>

            <View style={styles.ownerPill}>
              <Ionicons name="person-outline" size={12} color="#0056A2" />
              <Text style={styles.ownerPillText}>{displayOwner}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.authInfoText}>
            Owner approval is required before this invoice can be published.
          </Text>

          <TouchableOpacity
            style={[
              styles.checkboxRow,
              errors.ownerAuthorizationConfirmed
                ? styles.checkboxRowError
                : null,
            ]}
            onPress={() => {
              const next = !ownerAuthorizationConfirmed;
              setOwnerAuthorizationConfirmed(next);
              setDraftSaved(false);
              setPreparedNotice(false);
              if (next) clearFieldError('ownerAuthorizationConfirmed');
            }}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ownerAuthorizationConfirmed }}
          >
            <View
              style={[
                styles.checkboxBox,
                ownerAuthorizationConfirmed ? styles.checkboxBoxChecked : null,
              ]}
            >
              {ownerAuthorizationConfirmed ? (
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>
              Owner has reviewed and approved this invoice
            </Text>
          </TouchableOpacity>
          {errors.ownerAuthorizationConfirmed ? (
            <Text style={styles.errorText}>
              {errors.ownerAuthorizationConfirmed}
            </Text>
          ) : null}

          {/* Frontend-only 6-digit Authorization Code */}
          <View style={styles.codeFieldGroup}>
            <Text style={styles.fieldLabel}>Owner authorization code</Text>
            <View
              style={[
                styles.inputBox,
                errors.ownerAuthorizationCode ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="key-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={ownerAuthorizationCode}
                onChangeText={(text) => {
                  const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
                  setOwnerAuthorizationCode(digitsOnly);
                  setDraftSaved(false);
                  setPreparedNotice(false);
                  if (/^\d{6}$/.test(digitsOnly)) {
                    clearFieldError('ownerAuthorizationCode');
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Owner authorization code"
              />
            </View>
            {errors.ownerAuthorizationCode ? (
              <Text style={styles.errorText}>
                {errors.ownerAuthorizationCode}
              </Text>
            ) : (
              <Text style={styles.codeHelperText}>
                Frontend preview input only — no SMS or backend verification is
                performed.
              </Text>
            )}
          </View>
        </View>

        {/* 7. PUBLICATION CONFIRMATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={17}
                color="#0056A2"
              />
            </View>
            <Text style={styles.cardTitle}>Publication confirmation</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[
              styles.checkboxRow,
              errors.publicationConfirmed ? styles.checkboxRowError : null,
            ]}
            onPress={() => {
              const next = !publicationConfirmed;
              setPublicationConfirmed(next);
              setDraftSaved(false);
              setPreparedNotice(false);
              if (next) clearFieldError('publicationConfirmed');
            }}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: publicationConfirmed }}
          >
            <View
              style={[
                styles.checkboxBox,
                publicationConfirmed ? styles.checkboxBoxChecked : null,
              ]}
            >
              {publicationConfirmed ? (
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>
              I confirm all service details and charges are correct.
            </Text>
          </TouchableOpacity>
          {errors.publicationConfirmed ? (
            <Text style={styles.errorText}>{errors.publicationConfirmed}</Text>
          ) : null}

          <View style={styles.helperNoteBox}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#475569"
              style={styles.helperNoteIcon}
            />
            <Text style={styles.helperNoteText}>
              Publishing will create the final invoice record once backend
              integration is enabled.
            </Text>
          </View>
        </View>

        {/* 8. INTERNAL NOTES CARD */}
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Internal notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setDraftSaved(false);
              setPreparedNotice(false);
            }}
            multiline
            textAlignVertical="top"
            placeholder="Add an optional note for this invoice"
            placeholderTextColor="#94a3b8"
            accessibilityLabel="Internal notes"
          />
        </View>

        {/* 9. INVOICE PREVIEW CARD */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeaderRow}>
            <Text style={styles.previewTitle}>Invoice preview</Text>
            <View style={styles.readyStatusPill}>
              <Ionicons name="time-outline" size={12} color="#b45309" />
              <Text style={styles.readyStatusPillText}>
                Ready for authorization
              </Text>
            </View>
          </View>

          <View style={styles.previewDivider} />

          <Text style={styles.previewCode}>{displayInvoiceNumber}</Text>
          <Text style={styles.previewVehicle}>{displayVehicle}</Text>
          <Text style={styles.previewOwner}>{displayOwner}</Text>

          <View style={styles.previewTotalRow}>
            <Text style={styles.previewTotalText}>
              Total: {costValues.totalDisplay}
            </Text>
          </View>
        </View>

        {/* Missing Step 1 Draft Error */}
        {errors.step1 ? (
          <View style={styles.step1ErrorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
            <Text style={styles.step1ErrorText}>{errors.step1}</Text>
          </View>
        ) : null}

        {/* 10. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrepareInvoice}
            activeOpacity={0.85}
          >
            <Ionicons name="shield-checkmark-outline" size={17} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              Authorize &amp; prepare invoice
            </Text>
          </TouchableOpacity>

          {preparedNotice ? (
            <View style={styles.preparedStatusBox}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.preparedStatusText}>
                Invoice prepared locally — backend publication not performed.
              </Text>
            </View>
          ) : null}

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

      {/* 11. GARAGE BOTTOM NAVIGATION (BILLING ACTIVE) */}
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
          <Ionicons name="clipboard-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onBillingPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Billing"
        >
          <Ionicons name="receipt" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Billing</Text>
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
  },
  stepSection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 13,
    marginBottom: 14,
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
  linkedQuotationStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 7,
    marginBottom: 14,
  },
  linkedQuotationText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#004684',
    flexShrink: 1,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
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
  ownerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  ownerPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  summaryList: {
    gap: 9,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  codeFieldGroup: {
    marginTop: 13,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  inputBox: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 11,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 5,
  },
  totalSummaryBox: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 13,
    marginTop: 2,
  },
  totalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 14,
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
    color: '#475569',
    fontWeight: '500',
  },
  authInfoText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 11,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 11,
    padding: 12,
  },
  checkboxRowError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  checkboxBox: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#0f172a',
  },
  codeHelperText: {
    fontSize: 11,
    lineHeight: 15.5,
    color: '#64748b',
    marginTop: 5,
  },
  helperNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 11,
  },
  helperNoteIcon: {
    marginTop: 1,
  },
  helperNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#475569',
  },
  notesLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 80,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#0f172a',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 15,
    marginBottom: 16,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  previewTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  readyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  readyStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 11,
  },
  previewCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056A2',
    marginBottom: 3,
  },
  previewVehicle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  previewOwner: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  previewTotalRow: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  previewTotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#003566',
  },
  step1ErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },
  step1ErrorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  primaryButton: {
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
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  preparedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  preparedStatusText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#004684',
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

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
import { MaintenanceStep1Data } from './AddMaintenanceStep1Screen';
import {
  formatLkr,
  MaintenanceStep2Data,
  parseCostAmount,
} from './AddMaintenanceStep2Screen';

export type MaintenanceStep3Data = {
  invoiceAttached: boolean;
  inspectionAttached: boolean;
  ownerAuthorizationConfirmed: boolean;
  notes: string;
};

export type PreparedMaintenanceRecord = {
  step1: MaintenanceStep1Data;
  step2: MaintenanceStep2Data;
  step3: MaintenanceStep3Data;
  formattedLabour: string;
  formattedParts: string;
  formattedTotal: string;
  preparedAt: string;
};

export interface AddMaintenanceStep3ScreenProps {
  step1Data?: MaintenanceStep1Data | null;
  step2Data?: MaintenanceStep2Data | null;
  initialDraft?: MaintenanceStep3Data | null;
  vehicleLabel?: string;
  onBackPress?: (currentDraft: MaintenanceStep3Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onPrepareRecordPress?: (record: PreparedMaintenanceRecord) => void;
  onSaveDraftPress?: (data: MaintenanceStep3Data) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type ValidationErrors = Partial<
  Record<'drafts' | 'ownerAuthorizationConfirmed', string>
>;

export const AddMaintenanceStep3Screen: React.FC<
  AddMaintenanceStep3ScreenProps
> = ({
  step1Data,
  step2Data,
  initialDraft,
  vehicleLabel = 'WP ABC-1234 · Toyota Aqua',
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onPrepareRecordPress,
  onSaveDraftPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [invoiceAttached, setInvoiceAttached] = useState<boolean>(
    initialDraft?.invoiceAttached ?? false
  );
  const [inspectionAttached, setInspectionAttached] = useState<boolean>(
    initialDraft?.inspectionAttached ?? false
  );
  const [ownerAuthorizationConfirmed, setOwnerAuthorizationConfirmed] =
    useState<boolean>(initialDraft?.ownerAuthorizationConfirmed ?? false);
  const [notes, setNotes] = useState<string>(initialDraft?.notes ?? '');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [recordPrepared, setRecordPrepared] = useState<boolean>(false);

  const displayVehicleLabel = step1Data?.vehicleLabel || vehicleLabel;

  const costSummary = useMemo(() => {
    const labourNum = step2Data ? parseCostAmount(step2Data.labourCost) : null;
    const partsNum = step2Data ? parseCostAmount(step2Data.partsCost) : null;

    const formattedLabour =
      labourNum !== null
        ? formatLkr(labourNum)
        : step2Data?.labourCost || '—';
    const formattedParts =
      partsNum !== null
        ? formatLkr(partsNum)
        : step2Data?.partsCost || '—';
    const formattedTotal =
      labourNum !== null && partsNum !== null
        ? formatLkr(labourNum + partsNum)
        : '—';

    return {
      formattedLabour,
      formattedParts,
      formattedTotal,
    };
  }, [step2Data]);

  const buildStep3Payload = (): MaintenanceStep3Data => ({
    invoiceAttached,
    inspectionAttached,
    ownerAuthorizationConfirmed,
    notes: notes.trim(),
  });

  const handleToggleInvoice = (nextValue: boolean) => {
    setInvoiceAttached(nextValue);
    setDraftSaved(false);
    setRecordPrepared(false);
  };

  const handleToggleInspection = (nextValue: boolean) => {
    setInspectionAttached(nextValue);
    setDraftSaved(false);
    setRecordPrepared(false);
  };

  const handleToggleAuthorization = () => {
    const nextValue = !ownerAuthorizationConfirmed;
    setOwnerAuthorizationConfirmed(nextValue);
    setDraftSaved(false);
    setRecordPrepared(false);
    if (nextValue) {
      setErrors((prev) => {
        if (!prev.ownerAuthorizationConfirmed) return prev;
        const next = { ...prev };
        delete next.ownerAuthorizationConfirmed;
        return next;
      });
    }
  };

  const handlePrepareRecord = () => {
    const nextErrors: ValidationErrors = {};

    if (!step1Data || !step2Data) {
      nextErrors.drafts =
        'Step 1 and Step 2 details are required before preparing this record.';
    }
    if (!ownerAuthorizationConfirmed) {
      nextErrors.ownerAuthorizationConfirmed =
        'Please confirm that the vehicle owner has reviewed and approved this maintenance entry.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !step1Data || !step2Data) {
      setRecordPrepared(false);
      return;
    }

    const step3Payload = buildStep3Payload();
    const preparedRecord: PreparedMaintenanceRecord = {
      step1: step1Data,
      step2: step2Data,
      step3: step3Payload,
      formattedLabour: costSummary.formattedLabour,
      formattedParts: costSummary.formattedParts,
      formattedTotal: costSummary.formattedTotal,
      preparedAt: new Date().toISOString(),
    };

    setRecordPrepared(true);
    setDraftSaved(false);
    onPrepareRecordPress?.(preparedRecord);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    onSaveDraftPress?.(buildStep3Payload());
  };

  const handleBack = () => {
    onBackPress?.({
      invoiceAttached,
      inspectionAttached,
      ownerAuthorizationConfirmed,
      notes,
    });
  };

  const step1Rows: Array<{ label: string; value: string }> = [
    { label: 'Vehicle', value: step1Data?.vehicleLabel || displayVehicleLabel },
    { label: 'Service date', value: step1Data?.serviceDate || '—' },
    { label: 'Odometer', value: step1Data?.odometer || '—' },
    { label: 'Service type', value: step1Data?.serviceType || '—' },
    { label: 'Garage', value: step1Data?.garage || '—' },
    { label: 'Technician', value: step1Data?.technician || '—' },
    { label: 'Owner', value: step1Data?.owner || '—' },
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
          accessibilityLabel="Back to Step 2"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>ADD MAINTENANCE RECORD</Text>
          <Text style={styles.pageTitle}>Documents &amp; review</Text>
          <View style={styles.vehicleSubtitleRow}>
            <Ionicons name="car-sport-outline" size={14} color="#0056A2" />
            <Text style={styles.vehicleSubtitleText} numberOfLines={1}>
              {displayVehicleLabel}
            </Text>
          </View>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>
            Step 3 of 3 · Documents &amp; review
          </Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          </View>
        </View>

        {/* 4. DOCUMENTS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-attach-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Documents</Text>
          </View>

          <View style={styles.divider} />

          {/* Row 1: Invoice / bill */}
          <View style={styles.docRow}>
            <View style={styles.docInfoCol}>
              <Text style={styles.docTitle}>Invoice / bill</Text>
              {invoiceAttached ? (
                <View style={styles.attachedMetaRow}>
                  <Ionicons name="document-text" size={14} color="#15803d" />
                  <Text style={styles.attachedFileName} numberOfLines={1}>
                    invoice-0921.pdf
                  </Text>
                  <View style={styles.attachedPill}>
                    <Text style={styles.attachedPillText}>Attached</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.docSubtext}>PDF, JPG or PNG</Text>
              )}
            </View>

            {invoiceAttached ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleToggleInvoice(false)}
                activeOpacity={0.75}
                accessibilityLabel="Remove invoice attachment"
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleToggleInvoice(true)}
                activeOpacity={0.8}
                accessibilityLabel="Upload invoice or bill"
              >
                <Ionicons name="cloud-upload-outline" size={14} color="#0056A2" />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.rowDivider} />

          {/* Row 2: Inspection / diagnostic report */}
          <View style={styles.docRow}>
            <View style={styles.docInfoCol}>
              <Text style={styles.docTitle}>
                Inspection / diagnostic report
              </Text>
              {inspectionAttached ? (
                <View style={styles.attachedMetaRow}>
                  <Ionicons name="document-text" size={14} color="#15803d" />
                  <Text style={styles.attachedFileName} numberOfLines={1}>
                    inspection-report.pdf
                  </Text>
                  <View style={styles.attachedPill}>
                    <Text style={styles.attachedPillText}>Attached</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.docSubtext}>
                  Optional supporting document
                </Text>
              )}
            </View>

            {inspectionAttached ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleToggleInspection(false)}
                activeOpacity={0.75}
                accessibilityLabel="Remove inspection report attachment"
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleToggleInspection(true)}
                activeOpacity={0.8}
                accessibilityLabel="Upload inspection or diagnostic report"
              >
                <Ionicons name="cloud-upload-outline" size={14} color="#0056A2" />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 5. REVIEW RECORD CARD (STEP 1 + STEP 2 SUMMARY) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="reader-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Review record</Text>
          </View>

          <View style={styles.divider} />

          {/* Step 1 Summary */}
          <View style={styles.summaryList}>
            {step1Rows.map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionDivider} />

          {/* Step 2 Work & Parts Summary */}
          <View style={styles.textBlockGroup}>
            <Text style={styles.blockLabel}>Work performed</Text>
            <Text style={styles.blockValue}>
              {step2Data?.workPerformed || '—'}
            </Text>
          </View>

          <View style={styles.textBlockGroup}>
            <Text style={styles.blockLabel}>Parts replaced</Text>
            <Text style={styles.blockValue}>
              {step2Data?.partsReplaced ? step2Data.partsReplaced : 'None listed'}
            </Text>
          </View>

          <View style={styles.sectionDivider} />

          {/* Step 2 Cost Summary */}
          <View style={styles.costSummaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Labour</Text>
              <Text style={styles.summaryValue}>
                {costSummary.formattedLabour}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Parts</Text>
              <Text style={styles.summaryValue}>
                {costSummary.formattedParts}
              </Text>
            </View>
          </View>

          <View style={styles.totalSummaryBox}>
            <Text style={styles.totalSummaryLabel}>Total</Text>
            <Text style={styles.totalSummaryValue}>
              {costSummary.formattedTotal}
            </Text>
          </View>
        </View>

        {/* 6. OWNER AUTHORIZATION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="shield-checkmark-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Owner authorization</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[
              styles.checkboxRow,
              errors.ownerAuthorizationConfirmed
                ? styles.checkboxRowError
                : null,
            ]}
            onPress={handleToggleAuthorization}
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
              I confirm the vehicle owner has reviewed and approved this
              maintenance entry.
            </Text>
          </TouchableOpacity>

          {errors.ownerAuthorizationConfirmed ? (
            <Text style={styles.errorText}>
              {errors.ownerAuthorizationConfirmed}
            </Text>
          ) : null}

          <View style={styles.helperNoteBox}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#475569"
              style={styles.helperNoteIcon}
            />
            <Text style={styles.helperNoteText}>
              Final publishing and owner signature verification will be handled
              by the backend workflow.
            </Text>
          </View>
        </View>

        {/* 7. ADDITIONAL NOTES CARD */}
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Additional notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setDraftSaved(false);
              setRecordPrepared(false);
            }}
            multiline
            textAlignVertical="top"
            placeholder="Add internal notes for this service record"
            placeholderTextColor="#94a3b8"
            accessibilityLabel="Additional notes"
          />
        </View>

        {/* Missing Draft Error (if applicable) */}
        {errors.drafts ? (
          <View style={styles.draftsErrorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
            <Text style={styles.draftsErrorText}>{errors.drafts}</Text>
          </View>
        ) : null}

        {/* 8. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrepareRecord}
            activeOpacity={0.85}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={17}
              color="#ffffff"
            />
            <Text style={styles.primaryButtonText}>
              Review &amp; prepare record
            </Text>
          </TouchableOpacity>

          {recordPrepared ? (
            <View style={styles.preparedStatusBox}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.preparedStatusText}>
                Record prepared locally — backend submission not performed.
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

      {/* 9. GARAGE BOTTOM NAVIGATION (JOBS ACTIVE) */}
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
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 13,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  docInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  docTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  docSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  attachedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  attachedFileName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    flexShrink: 1,
  },
  attachedPill: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  attachedPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 9,
    paddingHorizontal: 12,
    height: 36,
    flexShrink: 0,
  },
  uploadButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  removeButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 9,
    paddingHorizontal: 12,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  removeButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#dc2626',
  },
  summaryList: {
    gap: 9,
  },
  costSummaryList: {
    gap: 8,
    marginBottom: 12,
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
  textBlockGroup: {
    marginBottom: 11,
  },
  blockLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  blockValue: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: '#0f172a',
  },
  totalSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  totalSummaryLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#004684',
  },
  totalSummaryValue: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#003566',
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
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 7,
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
    minHeight: 84,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#0f172a',
  },
  draftsErrorBanner: {
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
  draftsErrorText: {
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

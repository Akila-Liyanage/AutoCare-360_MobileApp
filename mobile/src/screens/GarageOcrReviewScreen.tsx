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
import { parseCostAmount } from './AddMaintenanceStep2Screen';

export type OcrOdometerChoice = 'extracted' | 'passport';

export type OcrReviewDecision = 'none' | 'approved' | 'rejected';

export type OcrReviewDraftData = {
  invoiceNumber: string;
  serviceDate: string;
  registration: string;
  vehicle: string;
  serviceType: string;
  garage: string;
  technician: string;
  odometer: string;
  totalAmount: string;
  odometerChoice: OcrOdometerChoice;
  reviewNotes: string;
  decision: OcrReviewDecision;
};

export interface GarageOcrReviewScreenProps {
  initialDraft?: OcrReviewDraftData | null;
  onBackPress?: (currentDraft: OcrReviewDraftData) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onApprovePress?: (data: OcrReviewDraftData) => void;
  onRejectPress?: (data: OcrReviewDraftData) => void;
  onContinueToServiceRecordPress?: (data: OcrReviewDraftData) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type ValidationErrors = Partial<
  Record<
    | 'invoiceNumber'
    | 'serviceDate'
    | 'registration'
    | 'vehicle'
    | 'serviceType'
    | 'odometer'
    | 'totalAmount',
    string
  >
>;

const EXTRACTED_ODOMETER = '84,520 km';
const PASSPORT_ODOMETER = '85,240 km';

const EXTRACTED_LINE_ITEMS: Array<{ id: string; label: string; amount: string }> = [
  { id: 'ocr-item-1', label: 'Engine oil', amount: 'LKR 18,500' },
  { id: 'ocr-item-2', label: 'Oil filter', amount: 'LKR 6,500' },
  { id: 'ocr-item-3', label: 'Labour', amount: 'LKR 11,500' },
];

function isValidPositiveOdometer(raw: string): boolean {
  const cleaned = raw
    .trim()
    .replace(/\s*km$/i, '')
    .replace(/,/g, '')
    .trim();
  if (!cleaned || !/^\d+(\.\d+)?$/.test(cleaned)) {
    return false;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) && value > 0;
}

export const GarageOcrReviewScreen: React.FC<GarageOcrReviewScreenProps> = ({
  initialDraft,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onApprovePress,
  onRejectPress,
  onContinueToServiceRecordPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    initialDraft?.invoiceNumber ?? 'INV-0492'
  );
  const [serviceDate, setServiceDate] = useState<string>(
    initialDraft?.serviceDate ?? '22 Sep 2026'
  );
  const [registration, setRegistration] = useState<string>(
    initialDraft?.registration ?? 'WP CAR-8282'
  );
  const [vehicle, setVehicle] = useState<string>(
    initialDraft?.vehicle ?? 'Toyota Prius'
  );
  const [serviceType, setServiceType] = useState<string>(
    initialDraft?.serviceType ?? 'Engine oil & filter replacement'
  );
  const [garage, setGarage] = useState<string>(
    initialDraft?.garage ?? 'Perera Auto Works'
  );
  const [technician, setTechnician] = useState<string>(
    initialDraft?.technician ?? 'Indika Perera'
  );
  const [odometerChoice, setOdometerChoice] = useState<OcrOdometerChoice>(
    initialDraft?.odometerChoice ?? 'passport'
  );
  const [odometer, setOdometer] = useState<string>(
    initialDraft?.odometer ?? PASSPORT_ODOMETER
  );
  const [totalAmount, setTotalAmount] = useState<string>(
    initialDraft?.totalAmount ?? 'LKR 36,500'
  );
  const [reviewNotes, setReviewNotes] = useState<string>(
    initialDraft?.reviewNotes ?? ''
  );
  const [decision, setDecision] = useState<OcrReviewDecision>(
    initialDraft?.decision ?? 'none'
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildDraft = (
    overrideDecision?: OcrReviewDecision
  ): OcrReviewDraftData => ({
    invoiceNumber: invoiceNumber.trim(),
    serviceDate: serviceDate.trim(),
    registration: registration.trim(),
    vehicle: vehicle.trim(),
    serviceType: serviceType.trim(),
    garage: garage.trim(),
    technician: technician.trim(),
    odometer: odometer.trim(),
    totalAmount: totalAmount.trim(),
    odometerChoice,
    reviewNotes,
    decision: overrideDecision ?? decision,
  });

  const handleSelectOdometerChoice = (choice: OcrOdometerChoice) => {
    setOdometerChoice(choice);
    setOdometer(
      choice === 'extracted' ? EXTRACTED_ODOMETER : PASSPORT_ODOMETER
    );
    setDecision('none');
    clearFieldError('odometer');
  };

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!invoiceNumber.trim()) {
      nextErrors.invoiceNumber = 'Invoice number is required.';
    }
    if (!serviceDate.trim()) {
      nextErrors.serviceDate = 'Service date is required.';
    }
    if (!registration.trim()) {
      nextErrors.registration = 'Registration number is required.';
    }
    if (!vehicle.trim()) {
      nextErrors.vehicle = 'Vehicle model is required.';
    }
    if (!serviceType.trim()) {
      nextErrors.serviceType = 'Service type is required.';
    }
    if (!odometer.trim()) {
      nextErrors.odometer = 'Odometer reading is required.';
    } else if (!isValidPositiveOdometer(odometer)) {
      nextErrors.odometer =
        'Enter a valid positive numeric odometer reading (e.g. 85,240 km).';
    }
    if (!totalAmount.trim()) {
      nextErrors.totalAmount = 'Total amount is required.';
    } else if (parseCostAmount(totalAmount) === null) {
      nextErrors.totalAmount =
        'Enter a valid non-negative total amount (e.g. LKR 36,500).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleApprove = () => {
    if (!validateForm()) {
      setDecision('none');
      return;
    }
    setDecision('approved');
    onApprovePress?.(buildDraft('approved'));
  };

  const handleReject = () => {
    setErrors({});
    setDecision('rejected');
    onRejectPress?.(buildDraft('rejected'));
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
          onPress={() => onBackPress?.(buildDraft())}
          activeOpacity={0.7}
          accessibilityLabel="Back to Garage Overview"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>GARAGE / AI OCR REVIEW</Text>
          <Text style={styles.pageTitle}>Review scan</Text>
          <Text style={styles.pageSubtitle}>
            Review extracted invoice data before adding it to the vehicle
            service record.
          </Text>
        </View>

        {/* 3. SCAN SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="scan-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Invoice Scan #0492</Text>
            </View>

            <View style={styles.needsReviewPill}>
              <Ionicons name="alert-circle-outline" size={12} color="#b45309" />
              <Text style={styles.needsReviewPillText}>Needs review</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRows}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>Toyota Prius</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Registration</Text>
              <Text style={styles.summaryValue}>WP CAR-8282</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing confidence</Text>
              <Text style={[styles.summaryValue, styles.confidenceValueBlue]}>
                88%
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '88%' }]} />
          </View>

          <View style={styles.warningStrip}>
            <Ionicons
              name="warning-outline"
              size={18}
              color="#b45309"
              style={styles.warningIcon}
            />
            <View style={styles.warningTextCol}>
              <Text style={styles.warningTitle}>OCR Validation Warning</Text>
              <Text style={styles.warningBody}>
                Manual check required for odometer match.
              </Text>
            </View>
          </View>
        </View>

        {/* 4. SCANNED DOCUMENT PREVIEW */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="document-text-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Scanned document</Text>
            </View>

            <Text style={styles.previewOnlyTag}>Preview only</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptPaper}>
            <Text style={styles.receiptBrand}>PERERA AUTO WORKS</Text>
            <Text style={styles.receiptHeading}>SERVICE INVOICE</Text>

            <View style={styles.receiptDashedLine} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Invoice:</Text>
              <Text style={styles.receiptValue}>INV-0492</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Vehicle:</Text>
              <Text style={styles.receiptValue}>Toyota Prius</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Registration:</Text>
              <Text style={styles.receiptValue}>WP CAR-8282</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Service:</Text>
              <Text style={styles.receiptValue}>
                Engine oil &amp; filter replacement
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Odometer:</Text>
              <Text style={styles.receiptValue}>84,520 km</Text>
            </View>

            <View style={styles.receiptDashedLine} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptTotalLabel}>Total:</Text>
              <Text style={styles.receiptTotalValue}>LKR 36,500</Text>
            </View>
          </View>
        </View>

        {/* 5. ODOMETER MISMATCH REVIEW CARD */}
        <View style={styles.mismatchCard}>
          <View style={styles.mismatchHeaderRow}>
            <Ionicons name="speedometer-outline" size={18} color="#b45309" />
            <Text style={styles.mismatchTitle}>Odometer review required</Text>
          </View>

          <View style={styles.mismatchValuesBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.mismatchLabel}>Extracted value:</Text>
              <Text style={styles.mismatchValue}>{EXTRACTED_ODOMETER}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.mismatchLabel}>Passport latest value:</Text>
              <Text style={styles.mismatchValue}>{PASSPORT_ODOMETER}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.mismatchLabel}>Difference:</Text>
              <Text style={styles.mismatchDiff}>-720 km</Text>
            </View>
          </View>

          <Text style={styles.mismatchBody}>
            The extracted invoice reading is lower than the latest recorded
            passport mileage.
          </Text>

          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                odometerChoice === 'extracted'
                  ? styles.radioOptionSelected
                  : null,
              ]}
              onPress={() => handleSelectOdometerChoice('extracted')}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ checked: odometerChoice === 'extracted' }}
            >
              <View
                style={[
                  styles.radioCircle,
                  odometerChoice === 'extracted'
                    ? styles.radioCircleSelected
                    : null,
                ]}
              >
                {odometerChoice === 'extracted' ? (
                  <View style={styles.radioDot} />
                ) : null}
              </View>
              <View style={styles.radioTextCol}>
                <Text style={styles.radioLabel}>Use extracted value</Text>
                <Text style={styles.radioSubtext}>{EXTRACTED_ODOMETER}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioOption,
                odometerChoice === 'passport'
                  ? styles.radioOptionSelected
                  : null,
              ]}
              onPress={() => handleSelectOdometerChoice('passport')}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ checked: odometerChoice === 'passport' }}
            >
              <View
                style={[
                  styles.radioCircle,
                  odometerChoice === 'passport'
                    ? styles.radioCircleSelected
                    : null,
                ]}
              >
                {odometerChoice === 'passport' ? (
                  <View style={styles.radioDot} />
                ) : null}
              </View>
              <View style={styles.radioTextCol}>
                <Text style={styles.radioLabel}>Use passport value</Text>
                <Text style={styles.radioSubtext}>{PASSPORT_ODOMETER}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.finalOdometerRow}>
            <Text style={styles.finalOdometerLabel}>
              Selected reviewed odometer:
            </Text>
            <Text style={styles.finalOdometerValue}>{odometer || '—'}</Text>
          </View>
        </View>

        {/* 6. EXTRACTED DATA CARD (EDITABLE + CONFIDENCE) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="create-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Extracted data</Text>
          </View>

          <View style={styles.divider} />

          {/* Invoice number */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Invoice number</Text>
              <View style={styles.confBadgeHigh}>
                <Text style={styles.confBadgeTextHigh}>98% · High</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.invoiceNumber ? styles.inputErrorBorder : null,
              ]}
              value={invoiceNumber}
              onChangeText={(text) => {
                setInvoiceNumber(text);
                setDecision('none');
                clearFieldError('invoiceNumber');
              }}
              placeholder="INV-0492"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Invoice number"
            />
            {errors.invoiceNumber ? (
              <Text style={styles.errorText}>{errors.invoiceNumber}</Text>
            ) : null}
          </View>

          {/* Service date */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Service date</Text>
              <View style={styles.confBadgeHigh}>
                <Text style={styles.confBadgeTextHigh}>94% · High</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.serviceDate ? styles.inputErrorBorder : null,
              ]}
              value={serviceDate}
              onChangeText={(text) => {
                setServiceDate(text);
                setDecision('none');
                clearFieldError('serviceDate');
              }}
              placeholder="22 Sep 2026"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Service date"
            />
            {errors.serviceDate ? (
              <Text style={styles.errorText}>{errors.serviceDate}</Text>
            ) : null}
          </View>

          {/* Registration */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Registration</Text>
              <View style={styles.confBadgeHigh}>
                <Text style={styles.confBadgeTextHigh}>96% · High</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.registration ? styles.inputErrorBorder : null,
              ]}
              value={registration}
              onChangeText={(text) => {
                setRegistration(text);
                setDecision('none');
                clearFieldError('registration');
              }}
              placeholder="WP CAR-8282"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Registration"
            />
            {errors.registration ? (
              <Text style={styles.errorText}>{errors.registration}</Text>
            ) : null}
          </View>

          {/* Vehicle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Vehicle</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.vehicle ? styles.inputErrorBorder : null,
              ]}
              value={vehicle}
              onChangeText={(text) => {
                setVehicle(text);
                setDecision('none');
                clearFieldError('vehicle');
              }}
              placeholder="Toyota Prius"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Vehicle"
            />
            {errors.vehicle ? (
              <Text style={styles.errorText}>{errors.vehicle}</Text>
            ) : null}
          </View>

          {/* Service type */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Service type</Text>
              <View style={styles.confBadgeHigh}>
                <Text style={styles.confBadgeTextHigh}>91% · High</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.serviceType ? styles.inputErrorBorder : null,
              ]}
              value={serviceType}
              onChangeText={(text) => {
                setServiceType(text);
                setDecision('none');
                clearFieldError('serviceType');
              }}
              placeholder="Engine oil & filter replacement"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Service type"
            />
            {errors.serviceType ? (
              <Text style={styles.errorText}>{errors.serviceType}</Text>
            ) : null}
          </View>

          {/* Garage & Technician */}
          <View style={[styles.twoColRow, styles.fieldGroup]}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Garage</Text>
              <TextInput
                style={styles.textInput}
                value={garage}
                onChangeText={(text) => {
                  setGarage(text);
                  setDecision('none');
                }}
                placeholder="Perera Auto Works"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Garage"
              />
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Technician</Text>
              <TextInput
                style={styles.textInput}
                value={technician}
                onChangeText={(text) => {
                  setTechnician(text);
                  setDecision('none');
                }}
                placeholder="Indika Perera"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Technician"
              />
            </View>
          </View>

          {/* Odometer */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Odometer</Text>
              <View style={styles.confBadgeReview}>
                <Text style={styles.confBadgeTextReview}>72% · Review</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.odometer ? styles.inputErrorBorder : null,
              ]}
              value={odometer}
              onChangeText={(text) => {
                setOdometer(text);
                setDecision('none');
                clearFieldError('odometer');
              }}
              placeholder="85,240 km"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Odometer"
            />
            {errors.odometer ? (
              <Text style={styles.errorText}>{errors.odometer}</Text>
            ) : null}
          </View>

          {/* Total amount */}
          <View style={styles.fieldGroupLast}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Total amount</Text>
              <View style={styles.confBadgeHigh}>
                <Text style={styles.confBadgeTextHigh}>97% · High</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                errors.totalAmount ? styles.inputErrorBorder : null,
              ]}
              value={totalAmount}
              onChangeText={(text) => {
                setTotalAmount(text);
                setDecision('none');
                clearFieldError('totalAmount');
              }}
              placeholder="LKR 36,500"
              placeholderTextColor="#94a3b8"
              accessibilityLabel="Total amount"
            />
            {errors.totalAmount ? (
              <Text style={styles.errorText}>{errors.totalAmount}</Text>
            ) : null}
          </View>
        </View>

        {/* 7. EXTRACTED LINE ITEMS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="list-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Extracted line items</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.lineItemsList}>
            {EXTRACTED_LINE_ITEMS.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalSummaryBox}>
            <Text style={styles.totalSummaryLabel}>Total</Text>
            <Text style={styles.totalSummaryValue}>LKR 36,500</Text>
          </View>
        </View>

        {/* 8. REVIEW NOTES CARD */}
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Review notes</Text>
          <TextInput
            style={styles.notesInput}
            value={reviewNotes}
            onChangeText={(text) => {
              setReviewNotes(text);
              setDecision('none');
            }}
            multiline
            textAlignVertical="top"
            placeholder="Add a note about any corrected OCR values"
            placeholderTextColor="#94a3b8"
            accessibilityLabel="Review notes"
          />
        </View>

        {/* 9. PRIMARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApprove}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle-outline" size={17} color="#ffffff" />
            <Text style={styles.approveButtonText}>Approve reviewed data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={17} color="#dc2626" />
            <Text style={styles.rejectButtonText}>Reject scan</Text>
          </TouchableOpacity>

          {decision === 'approved' ? (
            <>
              <View style={styles.approvedBanner}>
                <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
                <Text style={styles.approvedBannerText}>
                  Reviewed OCR data prepared locally — backend submission not
                  performed.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.continueServiceButton}
                onPress={() =>
                  onContinueToServiceRecordPress?.(buildDraft('approved'))
                }
                activeOpacity={0.85}
              >
                <Text style={styles.continueServiceButtonText}>
                  Continue to service record
                </Text>
                <Ionicons name="arrow-forward" size={15} color="#0056A2" />
              </TouchableOpacity>
            </>
          ) : null}

          {decision === 'rejected' ? (
            <View style={styles.rejectedBanner}>
              <Ionicons name="alert-circle" size={16} color="#b91c1c" />
              <Text style={styles.rejectedBannerText}>
                Scan marked rejected locally — backend not updated.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 10. GARAGE BOTTOM NAVIGATION (JOBS ACTIVE) */}
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
    marginBottom: 16,
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
  needsReviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
    flexShrink: 0,
  },
  needsReviewPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  summaryRows: {
    gap: 8,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
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
  confidenceValueBlue: {
    color: '#0056A2',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0056A2',
    borderRadius: 999,
  },
  warningStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 11,
    padding: 11,
    gap: 9,
  },
  warningIcon: {
    marginTop: 1,
  },
  warningTextCol: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  warningBody: {
    fontSize: 12,
    lineHeight: 17,
    color: '#b45309',
  },
  previewOnlyTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  receiptPaper: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
  },
  receiptBrand: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  receiptHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 2,
  },
  receiptDashedLine: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 5,
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'right',
    flex: 1,
  },
  receiptTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  receiptTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0056A2',
  },
  mismatchCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 16,
    marginBottom: 14,
  },
  mismatchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 11,
  },
  mismatchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400e',
  },
  mismatchValuesBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 11,
    padding: 11,
    gap: 6,
    marginBottom: 10,
  },
  mismatchLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  mismatchValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  mismatchDiff: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#dc2626',
  },
  mismatchBody: {
    fontSize: 12,
    lineHeight: 17,
    color: '#92400e',
    marginBottom: 12,
  },
  radioGroup: {
    gap: 8,
    marginBottom: 11,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  radioOptionSelected: {
    borderColor: '#0056A2',
    backgroundColor: '#eff6ff',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCircleSelected: {
    borderColor: '#0056A2',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0056A2',
  },
  radioTextCol: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  radioSubtext: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  finalOdometerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 4,
  },
  finalOdometerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  finalOdometerValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#003566',
  },
  fieldGroup: {
    marginBottom: 13,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  confBadgeHigh: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  confBadgeTextHigh: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  confBadgeReview: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  confBadgeTextReview: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#b45309',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  textInput: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
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
  lineItemsList: {
    gap: 9,
    marginBottom: 13,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#003566',
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
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  approveButton: {
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
  approveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  rejectButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#dc2626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#dc2626',
  },
  approvedBanner: {
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
  approvedBannerText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#004684',
  },
  continueServiceButton: {
    height: 44,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#0056A2',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  continueServiceButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056A2',
  },
  rejectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  rejectedBannerText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#b91c1c',
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

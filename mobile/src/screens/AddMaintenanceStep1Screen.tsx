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
import {
  GARAGE_VEHICLE_RECORDS,
  GarageVehicleRecord,
} from './GarageVehicleRecordsScreen';

export type MaintenanceStep1Data = {
  vehicleId: string;
  vehicleLabel: string;
  serviceDate: string;
  odometer: string;
  serviceType: string;
  garage: string;
  technician: string;
  owner: string;
};

export interface AddMaintenanceStep1ScreenProps {
  selectedVehicle?: GarageVehicleRecord | null;
  initialDraft?: MaintenanceStep1Data | null;
  onBackPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: MaintenanceStep1Data) => void;
  onSaveDraftPress?: (data: MaintenanceStep1Data) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type ValidationErrors = Partial<
  Record<
    'vehicleLabel' | 'serviceDate' | 'odometer' | 'serviceType' | 'garage' | 'technician',
    string
  >
>;

const DEFAULT_ODOMETERS: Record<string, string> = {
  'veh-wp-abc-1234': '85,240 km',
  'veh-wp-cbd-5521': '42,100 km',
  'veh-wp-cde-9080': '112,450 km',
};

const SERVICE_TYPE_OPTIONS: string[] = [
  'Periodic engine service',
  'Engine Oil & Filter Swap',
  'Dual Clutch Fluid Replacement',
  'Brake System Inspection & Service',
  'Spark Plug Configuration',
  'Full Hybrid Diagnostic Scan',
];

const TECHNICIAN_OPTIONS: string[] = [
  'Indika Perera · TEC-2051',
  'Chamara Silva · TEC-2084',
  'Nuwan Bandara · TEC-2109',
];

function formatVehicleLabel(vehicle: GarageVehicleRecord): string {
  return `${vehicle.registration} · ${vehicle.model}`;
}

function isValidOdometer(raw: string): boolean {
  const cleaned = raw
    .trim()
    .replace(/\s*km$/i, '')
    .replace(/,/g, '')
    .trim();
  if (!cleaned) {
    return false;
  }
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return false;
  }
  const numericValue = Number(cleaned);
  return Number.isFinite(numericValue) && numericValue > 0;
}

export const AddMaintenanceStep1Screen: React.FC<
  AddMaintenanceStep1ScreenProps
> = ({
  selectedVehicle,
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
  const baseVehicle = selectedVehicle ?? GARAGE_VEHICLE_RECORDS[0];
  const useDraft =
    initialDraft != null &&
    (!selectedVehicle || initialDraft.vehicleId === selectedVehicle.id);

  const [vehicleId, setVehicleId] = useState<string>(
    useDraft ? initialDraft.vehicleId : baseVehicle.id
  );
  const [vehicleLabel, setVehicleLabel] = useState<string>(
    useDraft ? initialDraft.vehicleLabel : formatVehicleLabel(baseVehicle)
  );
  const [serviceDate, setServiceDate] = useState<string>(
    useDraft ? initialDraft.serviceDate : '21 Sep 2026'
  );
  const [odometer, setOdometer] = useState<string>(
    useDraft
      ? initialDraft.odometer
      : DEFAULT_ODOMETERS[baseVehicle.id] ?? '85,240 km'
  );
  const [serviceType, setServiceType] = useState<string>(
    useDraft ? initialDraft.serviceType : 'Periodic engine service'
  );
  const [garage, setGarage] = useState<string>(
    useDraft ? initialDraft.garage : 'Perera Auto Works'
  );
  const [technician, setTechnician] = useState<string>(
    useDraft ? initialDraft.technician : 'Indika Perera · TEC-2051'
  );
  const [owner, setOwner] = useState<string>(
    useDraft ? initialDraft.owner : baseVehicle.owner || 'Kaveesha P.'
  );

  const [openDropdown, setOpenDropdown] = useState<
    'vehicle' | 'serviceType' | 'technician' | null
  >(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const buildPayload = (): MaintenanceStep1Data => ({
    vehicleId,
    vehicleLabel: vehicleLabel.trim(),
    serviceDate: serviceDate.trim(),
    odometer: odometer.trim(),
    serviceType: serviceType.trim(),
    garage: garage.trim(),
    technician: technician.trim(),
    owner: owner.trim() || 'Kaveesha P.',
  });

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSelectVehicle = (record: GarageVehicleRecord) => {
    setVehicleId(record.id);
    setVehicleLabel(formatVehicleLabel(record));
    setOwner(record.owner || 'Kaveesha P.');
    setOdometer(DEFAULT_ODOMETERS[record.id] ?? '85,240 km');
    setOpenDropdown(null);
    setDraftSaved(false);
    clearFieldError('vehicleLabel');
    clearFieldError('odometer');
  };

  const handleSelectServiceType = (option: string) => {
    setServiceType(option);
    setOpenDropdown(null);
    setDraftSaved(false);
    clearFieldError('serviceType');
  };

  const handleSelectTechnician = (option: string) => {
    setTechnician(option);
    setOpenDropdown(null);
    setDraftSaved(false);
    clearFieldError('technician');
  };

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!vehicleLabel.trim()) {
      nextErrors.vehicleLabel = 'Please select a vehicle.';
    }
    if (!serviceDate.trim()) {
      nextErrors.serviceDate = 'Service date is required.';
    }
    if (!odometer.trim()) {
      nextErrors.odometer = 'Odometer reading is required.';
    } else if (!isValidOdometer(odometer)) {
      nextErrors.odometer =
        'Enter a valid numeric odometer reading (e.g. 85,240 km).';
    }
    if (!serviceType.trim()) {
      nextErrors.serviceType = 'Please select a service type.';
    }
    if (!garage.trim()) {
      nextErrors.garage = 'Garage name is required.';
    }
    if (!technician.trim()) {
      nextErrors.technician = 'Please select a technician.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    setOpenDropdown(null);
    if (!validateForm()) {
      return;
    }
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
    setOpenDropdown(null);
    setDraftSaved(true);
    onSaveDraftPress?.(buildPayload());
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
        {/* 2. BACK + PAGE TITLE */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Back to Vehicle Records"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-03 / NEW VERIFIED ENTRY</Text>
          <Text style={styles.pageTitle}>Add maintenance record</Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 1 of 3 · Vehicle &amp; service</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
          </View>
        </View>

        {/* 4. VEHICLE & SERVICE CARD */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-sport-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle &amp; service</Text>
          </View>

          <View style={styles.divider} />

          {/* Vehicle Selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Vehicle</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.vehicleLabel ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'vehicle' ? null : 'vehicle'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select vehicle"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {vehicleLabel}
              </Text>
              <Ionicons
                name={openDropdown === 'vehicle' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.vehicleLabel ? (
              <Text style={styles.errorText}>{errors.vehicleLabel}</Text>
            ) : null}

            {openDropdown === 'vehicle' ? (
              <View style={styles.dropdownMenu}>
                {GARAGE_VEHICLE_RECORDS.map((record, idx) => {
                  const label = formatVehicleLabel(record);
                  const isSelected = record.id === vehicleId;
                  return (
                    <TouchableOpacity
                      key={record.id}
                      style={[
                        styles.dropdownOption,
                        idx < GARAGE_VEHICLE_RECORDS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => handleSelectVehicle(record)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.dropdownOptionTextCol}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected ? styles.dropdownOptionTextSelected : null,
                          ]}
                        >
                          {label}
                        </Text>
                        <Text style={styles.dropdownOptionSubtext}>
                          Owner · {record.owner}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={17} color="#0056A2" />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Service Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Service date</Text>
            <View
              style={[
                styles.inputBox,
                errors.serviceDate ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={serviceDate}
                onChangeText={(text) => {
                  setServiceDate(text);
                  setDraftSaved(false);
                  clearFieldError('serviceDate');
                }}
                placeholder="21 Sep 2026"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Service date"
              />
            </View>
            {errors.serviceDate ? (
              <Text style={styles.errorText}>{errors.serviceDate}</Text>
            ) : null}
          </View>

          {/* Odometer */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Odometer</Text>
            <View
              style={[
                styles.inputBox,
                errors.odometer ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="speedometer-outline"
                size={17}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={odometer}
                onChangeText={(text) => {
                  setOdometer(text);
                  setDraftSaved(false);
                  clearFieldError('odometer');
                }}
                placeholder="85,240 km"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Odometer"
              />
            </View>
            {errors.odometer ? (
              <Text style={styles.errorText}>{errors.odometer}</Text>
            ) : null}
          </View>

          {/* Service Type Selector */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>Service type</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.serviceType ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'serviceType' ? null : 'serviceType'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select service type"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {serviceType}
              </Text>
              <Ionicons
                name={
                  openDropdown === 'serviceType' ? 'chevron-up' : 'chevron-down'
                }
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.serviceType ? (
              <Text style={styles.errorText}>{errors.serviceType}</Text>
            ) : null}

            {openDropdown === 'serviceType' ? (
              <View style={styles.dropdownMenu}>
                {SERVICE_TYPE_OPTIONS.map((option, idx) => {
                  const isSelected = option === serviceType;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        idx < SERVICE_TYPE_OPTIONS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => handleSelectServiceType(option)}
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
        </View>

        {/* 5. GARAGE & TECHNICIAN DETAILS CARD */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="construct-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>
              Garage &amp; technician details
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Garage */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Garage</Text>
            <View
              style={[
                styles.inputBox,
                errors.garage ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="business-outline"
                size={17}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={garage}
                onChangeText={(text) => {
                  setGarage(text);
                  setDraftSaved(false);
                  clearFieldError('garage');
                }}
                placeholder="Perera Auto Works"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Garage"
              />
            </View>
            {errors.garage ? (
              <Text style={styles.errorText}>{errors.garage}</Text>
            ) : null}
          </View>

          {/* Technician Selector */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>Technician</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                errors.technician ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'technician' ? null : 'technician'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select technician"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {technician}
              </Text>
              <Ionicons
                name={
                  openDropdown === 'technician' ? 'chevron-up' : 'chevron-down'
                }
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {errors.technician ? (
              <Text style={styles.errorText}>{errors.technician}</Text>
            ) : null}

            {openDropdown === 'technician' ? (
              <View style={styles.dropdownMenu}>
                {TECHNICIAN_OPTIONS.map((option, idx) => {
                  const isSelected = option === technician;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        idx < TECHNICIAN_OPTIONS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => handleSelectTechnician(option)}
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
        </View>

        {/* 6. OWNER INFO */}
        <View style={styles.ownerStrip}>
          <Ionicons name="person-circle-outline" size={18} color="#0056A2" />
          <Text style={styles.ownerStripText}>
            Owner · {owner || 'Kaveesha P.'}
          </Text>
        </View>

        {/* 7. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              Continue to work &amp; costs
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

      {/* 8. GARAGE BOTTOM NAVIGATION (JOBS ACTIVE) */}
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
  dropdownOptionTextCol: {
    flex: 1,
    minWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flexShrink: 1,
  },
  dropdownOptionTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  dropdownOptionSubtext: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },
  ownerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 8,
    marginBottom: 18,
  },
  ownerStripText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#004684',
    flexShrink: 1,
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

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
import { OwnerProfileData, DEFAULT_OWNER_PROFILE } from './EditProfileScreen';
import { VehicleItem } from './VehiclesScreen';

const CATEGORY_OPTIONS = ['Sedan', 'SUV', 'Hatchback', 'Crossover', 'Coupe', 'Pickup / Van'];
const FUEL_OPTIONS = ['Petrol', 'Hybrid', 'Diesel', 'Electric', 'Plug-in Hybrid'];
const TRANSMISSION_OPTIONS = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];
const PHOTO_PRESETS = ['Certified Sedan', 'Certified SUV', 'Certified Hatchback'];

const EXTERIOR_COLORS: Array<{ label: string; hex: string; borderHex?: string }> = [
  { label: 'Deep Metallic Blue', hex: '#1d4ed8' },
  { label: 'Arctic White', hex: '#f8fafc', borderHex: '#cbd5e1' },
  { label: 'Solid Black Metallic', hex: '#0f172a' },
  { label: 'Chalk Crayon Grey', hex: '#94a3b8' },
  { label: 'Guards Red', hex: '#dc2626' },
];

export type AddVehicleScreenProps = {
  ownerProfile?: OwnerProfileData;
  onBack: () => void;
  onCancel: () => void;
  onSave: (vehicle: VehicleItem) => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

type FormErrors = {
  make?: string;
  model?: string;
  year?: string;
  registration?: string;
  vin?: string;
  mileage?: string;
  ownerName?: string;
};

type OpenDropdown = 'category' | 'fuel' | 'transmission' | null;

export const AddVehicleScreen: React.FC<AddVehicleScreenProps> = ({
  ownerProfile = DEFAULT_OWNER_PROFILE,
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
  // Step 1: Image Uploading Options (frontend-only visual state)
  const [photoSelected, setPhotoSelected] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Step 2: Core Vehicle Specifications
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [category, setCategory] = useState<string>('Sedan');
  const [fuelType, setFuelType] = useState<string>('Petrol');
  const [transmission, setTransmission] = useState<string>('Automatic');
  const [exteriorColor, setExteriorColor] = useState<string>('Deep Metallic Blue');
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  // Vehicle Identification & Mileage
  const [registration, setRegistration] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [engineNumber, setEngineNumber] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');

  // Step 5: Registered Ownership Credentials
  const [ownerName, setOwnerName] = useState<string>(ownerProfile.fullName);
  const [ownerPhone, setOwnerPhone] = useState<string>(ownerProfile.phone);
  const [ownerEmail, setOwnerEmail] = useState<string>(ownerProfile.email);

  const [errors, setErrors] = useState<FormErrors>({});

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleDropdown = (target: Exclude<OpenDropdown, null>) => {
    setOpenDropdown((prev) => (prev === target ? null : target));
  };

  const handleSave = () => {
    const trimmedMake = make.trim();
    const trimmedModel = model.trim();
    const trimmedYear = year.trim();
    const trimmedReg = registration.trim();
    const trimmedVin = vin.trim();
    const trimmedEngine = engineNumber.trim();
    const trimmedMileage = mileage.trim();
    const trimmedOwnerName = ownerName.trim();
    const trimmedOwnerPhone = ownerPhone.trim();
    const trimmedOwnerEmail = ownerEmail.trim();

    const nextErrors: FormErrors = {};

    if (!trimmedMake) {
      nextErrors.make = 'Manufacturer / Make is required.';
    }
    if (!trimmedModel) {
      nextErrors.model = 'Model & Specification Trim is required.';
    }
    if (!trimmedYear) {
      nextErrors.year = 'Manufacturing Year is required.';
    } else if (!/^\d{4}$/.test(trimmedYear)) {
      nextErrors.year = 'Manufacturing Year must be a valid 4-digit year.';
    }
    if (!trimmedReg) {
      nextErrors.registration = 'Registration Number is required.';
    }
    if (!trimmedVin) {
      nextErrors.vin = 'Chassis / VIN Number is required.';
    }
    if (trimmedMileage && !/^\d+$/.test(trimmedMileage)) {
      nextErrors.mileage = 'Current Mileage must be numeric.';
    }
    if (!trimmedOwnerName) {
      nextErrors.ownerName = 'Owner Full Name is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const newVehicle: VehicleItem = {
      id: `veh-${Date.now()}`,
      name: `${trimmedMake} ${trimmedModel}`,
      registration: trimmedReg.toUpperCase(),
      year: trimmedYear,
      fuel: fuelType,
      status: 'VERIFIED',
      passportStatus: 'ACTIVE',
      make: trimmedMake,
      model: trimmedModel,
      category,
      transmission,
      color: exteriorColor,
      vin: trimmedVin.toUpperCase(),
      engineNumber: trimmedEngine ? trimmedEngine.toUpperCase() : undefined,
      mileage: trimmedMileage || undefined,
      ownerName: trimmedOwnerName,
      ownerPhone: trimmedOwnerPhone || undefined,
      ownerEmail: trimmedOwnerEmail || undefined,
    };

    onSave(newVehicle);
  };

  const hasValidationErrors = Object.values(errors).some(Boolean);

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
          {/* 2. TOP AREA */}
          <View style={styles.pageHeaderSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={16} color="#0056A2" />
              <Text style={styles.backButtonText}>Back To Vehicles</Text>
            </TouchableOpacity>

            <View style={styles.digitalVehicleBadge}>
              <Ionicons name="shield-checkmark-outline" size={12} color="#0056A2" />
              <Text style={styles.digitalVehicleBadgeText}>Digital Vehicle</Text>
            </View>

            <Text style={styles.pageTitle}>Add New Vehicle To Digital Passport</Text>
            <Text style={styles.pageSubtitle}>
              Complete your vehicle specifications, identification numbers, and verified ownership credentials below.
            </Text>
          </View>

          {/* STEP 1 CARD: IMAGE UPLOADING OPTIONS */}
          <View style={styles.card}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <View style={styles.stepHeaderTextCol}>
                <Text style={styles.cardTitle}>Image Uploading Options</Text>
                <Text style={styles.cardSubtitle}>
                  Upload Your Vehicle&apos;s Photo Or Choose From Certified High-Res Vehicle Presets.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.uploadZone,
                photoSelected ? styles.uploadZoneSelected : null,
              ]}
              onPress={() => {
                setPhotoSelected((prev) => !prev);
                setSelectedPreset(null);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.uploadIconCircle}>
                <Ionicons
                  name={photoSelected ? 'checkmark-circle' : 'cloud-upload-outline'}
                  size={26}
                  color={photoSelected ? '#16a34a' : '#0056A2'}
                />
              </View>
              <Text style={styles.uploadTitle}>
                {photoSelected ? 'Vehicle Photo Ready (Preview)' : 'Upload Vehicle Photo'}
              </Text>
              <Text style={styles.uploadHelper}>Include front view &amp; license plate</Text>
            </TouchableOpacity>

            <Text style={styles.presetLabel}>Certified High-Res Presets</Text>
            <View style={styles.presetRow}>
              {PHOTO_PRESETS.map((preset) => {
                const isActive = selectedPreset === preset;
                return (
                  <Pressable
                    key={preset}
                    style={[
                      styles.presetChip,
                      isActive ? styles.presetChipActive : null,
                    ]}
                    onPress={() => {
                      setSelectedPreset(isActive ? null : preset);
                      setPhotoSelected(false);
                    }}
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={13}
                      color={isActive ? '#0056A2' : '#64748b'}
                    />
                    <Text
                      style={[
                        styles.presetChipText,
                        isActive ? styles.presetChipTextActive : null,
                      ]}
                    >
                      {preset}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* STEP 2 CARD: CORE VEHICLE SPECIFICATIONS */}
          <View style={styles.card}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <View style={styles.stepHeaderTextCol}>
                <Text style={styles.cardTitle}>Core Vehicle Specifications</Text>
                <Text style={styles.cardSubtitle}>
                  Enter manufacturer, trim, powertrain, and exterior finish details.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Manufacturer / Make * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Manufacturer / Make *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.make ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="car-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Toyota"
                  placeholderTextColor="#94a3b8"
                  value={make}
                  onChangeText={(val) => {
                    setMake(val);
                    clearFieldError('make');
                  }}
                  autoCapitalize="words"
                  accessibilityLabel="Manufacturer or Make"
                />
              </View>
              {errors.make ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.make}</Text>
                </View>
              ) : null}
            </View>

            {/* Model & Specification Trim * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Model &amp; Specification Trim *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.model ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="options-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Corolla Altis 1.8G"
                  placeholderTextColor="#94a3b8"
                  value={model}
                  onChangeText={(val) => {
                    setModel(val);
                    clearFieldError('model');
                  }}
                  autoCapitalize="words"
                  accessibilityLabel="Model and Specification Trim"
                />
              </View>
              {errors.model ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.model}</Text>
                </View>
              ) : null}
            </View>

            {/* Manufacturing Year * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Manufacturing Year *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.year ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="calendar-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 2022"
                  placeholderTextColor="#94a3b8"
                  value={year}
                  onChangeText={(val) => {
                    setYear(val.replace(/\D/g, '').slice(0, 4));
                    clearFieldError('year');
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  accessibilityLabel="Manufacturing Year"
                />
              </View>
              {errors.year ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.year}</Text>
                </View>
              ) : null}
            </View>

            {/* Body & Vehicle Category */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Body &amp; Vehicle Category</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('category')}
                accessibilityRole="button"
                accessibilityLabel="Body and Vehicle Category"
              >
                <Text style={styles.selectorValue}>{category}</Text>
                <Ionicons
                  name={openDropdown === 'category' ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={17}
                  color="#64748b"
                />
              </Pressable>
              {openDropdown === 'category' ? (
                <View style={styles.dropdownMenu}>
                  {CATEGORY_OPTIONS.map((option, idx) => {
                    const isSelected = option === category;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < CATEGORY_OPTIONS.length - 1 ? styles.dropdownItemBorder : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setCategory(option);
                          setOpenDropdown(null);
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

            {/* Powertrain & Fuel Type */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Powertrain &amp; Fuel Type</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('fuel')}
                accessibilityRole="button"
                accessibilityLabel="Powertrain and Fuel Type"
              >
                <Text style={styles.selectorValue}>{fuelType}</Text>
                <Ionicons
                  name={openDropdown === 'fuel' ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={17}
                  color="#64748b"
                />
              </Pressable>
              {openDropdown === 'fuel' ? (
                <View style={styles.dropdownMenu}>
                  {FUEL_OPTIONS.map((option, idx) => {
                    const isSelected = option === fuelType;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < FUEL_OPTIONS.length - 1 ? styles.dropdownItemBorder : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setFuelType(option);
                          setOpenDropdown(null);
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

            {/* Transmission */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Transmission</Text>
              <Pressable
                style={styles.selectorWrapper}
                onPress={() => toggleDropdown('transmission')}
                accessibilityRole="button"
                accessibilityLabel="Transmission"
              >
                <Text style={styles.selectorValue}>{transmission}</Text>
                <Ionicons
                  name={openDropdown === 'transmission' ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={17}
                  color="#64748b"
                />
              </Pressable>
              {openDropdown === 'transmission' ? (
                <View style={styles.dropdownMenu}>
                  {TRANSMISSION_OPTIONS.map((option, idx) => {
                    const isSelected = option === transmission;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx < TRANSMISSION_OPTIONS.length - 1 ? styles.dropdownItemBorder : null,
                          isSelected ? styles.dropdownItemSelected : null,
                        ]}
                        onPress={() => {
                          setTransmission(option);
                          setOpenDropdown(null);
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

            {/* Exterior Color Finish */}
            <View style={styles.formGroupLast}>
              <Text style={styles.inputLabel}>Exterior Color Finish</Text>
              <View style={styles.colorChipsWrap}>
                {EXTERIOR_COLORS.map((swatch) => {
                  const isSelected = exteriorColor === swatch.label;
                  return (
                    <Pressable
                      key={swatch.label}
                      style={[
                        styles.colorChip,
                        isSelected ? styles.colorChipSelected : null,
                      ]}
                      onPress={() => setExteriorColor(swatch.label)}
                    >
                      <View
                        style={[
                          styles.colorDot,
                          {
                            backgroundColor: swatch.hex,
                            borderColor: swatch.borderHex || swatch.hex,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.colorChipText,
                          isSelected ? styles.colorChipTextSelected : null,
                        ]}
                      >
                        {swatch.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* STEP 3 CARD: VEHICLE IDENTIFICATION & MILEAGE */}
          <View style={styles.card}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>3</Text>
              </View>
              <View style={styles.stepHeaderTextCol}>
                <Text style={styles.cardTitle}>Vehicle Identification &amp; Mileage</Text>
                <Text style={styles.cardSubtitle}>
                  Registration plate, chassis/VIN, and baseline odometer details.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Registration Number * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Registration Number *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.registration ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="card-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. CAB-4582"
                  placeholderTextColor="#94a3b8"
                  value={registration}
                  onChangeText={(val) => {
                    setRegistration(val);
                    clearFieldError('registration');
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  accessibilityLabel="Registration Number"
                />
              </View>
              {errors.registration ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.registration}</Text>
                </View>
              ) : null}
            </View>

            {/* Chassis / VIN Number * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Chassis / VIN Number *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.vin ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="barcode-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. JTDKN3DU0F0123456"
                  placeholderTextColor="#94a3b8"
                  value={vin}
                  onChangeText={(val) => {
                    setVin(val);
                    clearFieldError('vin');
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  accessibilityLabel="Chassis or VIN Number"
                />
              </View>
              {errors.vin ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.vin}</Text>
                </View>
              ) : null}
            </View>

            {/* Engine Number */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Engine Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="hardware-chip-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 2ZR-FE-849201"
                  placeholderTextColor="#94a3b8"
                  value={engineNumber}
                  onChangeText={setEngineNumber}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  accessibilityLabel="Engine Number"
                />
              </View>
            </View>

            {/* Current Mileage */}
            <View style={styles.formGroupLast}>
              <Text style={styles.inputLabel}>Current Mileage (km)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.mileage ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="speedometer-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 42500"
                  placeholderTextColor="#94a3b8"
                  value={mileage}
                  onChangeText={(val) => {
                    setMileage(val);
                    clearFieldError('mileage');
                  }}
                  keyboardType="number-pad"
                  accessibilityLabel="Current Mileage"
                />
              </View>
              {errors.mileage ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.mileage}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* STEP 5 CARD: REGISTERED OWNERSHIP CREDENTIALS */}
          <View style={styles.card}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>5</Text>
              </View>
              <View style={styles.stepHeaderTextCol}>
                <Text style={styles.cardTitle}>Registered Ownership Credentials</Text>
                <Text style={styles.cardSubtitle}>
                  Verified owner profile bound to this vehicle&apos;s digital passport.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Owner Full Name * */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Owner Full Name *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.ownerName ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons name="person-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. David Silva"
                  placeholderTextColor="#94a3b8"
                  value={ownerName}
                  onChangeText={(val) => {
                    setOwnerName(val);
                    clearFieldError('ownerName');
                  }}
                  autoCapitalize="words"
                  accessibilityLabel="Owner Full Name"
                />
              </View>
              {errors.ownerName ? (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
                  <Text style={styles.inlineErrorText}>{errors.ownerName}</Text>
                </View>
              ) : null}
            </View>

            {/* Contact Phone # */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Contact Phone #</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 077-0603956"
                  placeholderTextColor="#94a3b8"
                  value={ownerPhone}
                  onChangeText={setOwnerPhone}
                  keyboardType="phone-pad"
                  accessibilityLabel="Contact Phone"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.formGroupLast}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={16} color="#94a3b8" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. david.silva@autocare.io"
                  placeholderTextColor="#94a3b8"
                  value={ownerEmail}
                  onChangeText={setOwnerEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  accessibilityLabel="Email Address"
                />
              </View>
            </View>
          </View>

          {/* Form Error Summary Notice */}
          {hasValidationErrors ? (
            <View style={styles.summaryErrorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
              <Text style={styles.summaryErrorText}>
                Please review the highlighted required fields above before saving.
              </Text>
            </View>
          ) : null}

          {/* ACTION BUTTONS */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={17} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Save Vehicle</Text>
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

      {/* BOTTOM NAVIGATION */}
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
          <Ionicons name="car" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Vehicles</Text>
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
  digitalVehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
    marginBottom: 8,
  },
  digitalVehicleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  pageTitle: {
    fontSize: 22,
    lineHeight: 28,
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
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#0056A2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  stepHeaderTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
  },
  uploadZone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    backgroundColor: '#f8fcff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  uploadZoneSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  uploadHelper: {
    fontSize: 11.5,
    color: '#64748b',
    textAlign: 'center',
  },
  presetLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  presetChipActive: {
    backgroundColor: '#ebf5ff',
    borderColor: '#0056A2',
  },
  presetChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#0056A2',
    fontWeight: '700',
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
    paddingHorizontal: 12,
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
  colorChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 6,
  },
  colorChipSelected: {
    backgroundColor: '#ebf5ff',
    borderColor: '#0056A2',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  colorChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  colorChipTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  summaryErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 7,
  },
  summaryErrorText: {
    flex: 1,
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
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

export default AddVehicleScreen;

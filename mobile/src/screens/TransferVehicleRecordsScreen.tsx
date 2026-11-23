import React, { useMemo, useState } from 'react';
import {
  Modal,
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
import { VehicleItem } from './VehiclesScreen';
import { DEFAULT_OWNER_PROFILE, OwnerProfileData } from './EditProfileScreen';

export type TransferVehicleRecordsScreenProps = {
  vehicle?: VehicleItem | null;
  ownerProfile?: OwnerProfileData;
  backLabel?: string;
  onBack: () => void;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onRecordsPress: () => void;
  onProfilePress: () => void;
  onEditDetailsPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
};

type TransferModalErrors = {
  ownerName?: string;
  ownerEmail?: string;
};

const formatRecordedMileage = (mileage?: string): string => {
  if (!mileage) {
    return '85,240 km (Verified)';
  }
  const numeric = Number(mileage.replace(/[^\d]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return `${mileage} km (Verified)`;
  }
  return `${numeric.toLocaleString()} km (Verified)`;
};

export const TransferVehicleRecordsScreen: React.FC<
  TransferVehicleRecordsScreenProps
> = ({
  vehicle,
  ownerProfile = DEFAULT_OWNER_PROFILE,
  backLabel = 'Back',
  onBack,
  onHomePress,
  onVehiclesPress,
  onRecordsPress,
  onProfilePress,
  onEditDetailsPress,
  onNotificationsPress,
  onMenuPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [newOwnerName, setNewOwnerName] = useState<string>('');
  const [newOwnerEmail, setNewOwnerEmail] = useState<string>('');
  const [modalErrors, setModalErrors] = useState<TransferModalErrors>({});

  // Local-only session preview state (no backend/blockchain submission)
  const [localTransferredOwner, setLocalTransferredOwner] = useState<string | null>(
    null
  );
  const [localPreviewNotice, setLocalPreviewNotice] = useState<string | null>(null);

  const vehicleName = vehicle?.name || 'Tesla Model S Plaid';
  const registrationNumber = vehicle?.registration || 'WP ABC-1234';
  const vinNumber = vehicle?.vin || 'NHP10-23648102';
  const engineNumber = vehicle?.engineNumber || '1NZ-FXE-45812';
  const vehicleCategory = vehicle?.category || 'Motor Car (Hybrid)';
  const manufacturer = vehicle?.make || 'Toyota Motor Corporation';
  const modelVariant = vehicle?.model || 'Aqua 1.5 S';
  const yearOfManufacture = vehicle?.year || '2018';
  const recordedMileage = formatRecordedMileage(vehicle?.mileage);

  const ledgerOwnerDisplay = localTransferredOwner || 'Alex Mitchell';
  const registeredOwnerDisplay =
    localTransferredOwner ||
    vehicle?.ownerName ||
    ownerProfile.fullName ||
    'David Silva';

  const matchesSearch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const searchableFields = [
      vehicleName,
      registrationNumber,
      vinNumber,
      engineNumber,
      manufacturer,
      modelVariant,
      ledgerOwnerDisplay,
      registeredOwnerDisplay,
      '0x9d15dc86',
      '0x81ac2',
    ];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(query)
    );
  }, [
    searchQuery,
    vehicleName,
    registrationNumber,
    vinNumber,
    engineNumber,
    manufacturer,
    modelVariant,
    ledgerOwnerDisplay,
    registeredOwnerDisplay,
  ]);

  const openTransferModal = () => {
    setModalErrors({});
    setNewOwnerName('');
    setNewOwnerEmail('');
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setModalErrors({});
    setShowTransferModal(false);
  };

  const handleConfirmTransfer = () => {
    const trimmedName = newOwnerName.trim();
    const trimmedEmail = newOwnerEmail.trim();
    const nextErrors: TransferModalErrors = {};

    if (!trimmedName) {
      nextErrors.ownerName = 'New owner name is required.';
    }
    if (!trimmedEmail) {
      nextErrors.ownerEmail = 'New owner email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.ownerEmail = 'Please enter a valid email address.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setModalErrors(nextErrors);
      return;
    }

    setModalErrors({});
    setLocalTransferredOwner(trimmedName);
    setLocalPreviewNotice(
      'Local preview updated — backend transfer not submitted.'
    );
    setShowTransferModal(false);
  };

  const specificationRows = [
    { label: 'Registration Number', value: registrationNumber },
    { label: 'VIN / Chassis No', value: vinNumber, mono: true },
    { label: 'Engine Number', value: engineNumber, mono: true },
    { label: 'Vehicle Category', value: vehicleCategory },
    { label: 'Manufacturer', value: manufacturer },
    { label: 'Model & Variant', value: modelVariant },
    { label: 'Year of Manufacture', value: yearOfManufacture },
    { label: 'Current Recorded Mileage', value: recordedMileage },
    { label: 'Current Registered Owner', value: registeredOwnerDisplay },
  ];

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

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. TOP BACK + SECURITY PILL + TITLE */}
        <View style={styles.pageHeaderSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={16} color="#0056A2" />
            <Text style={styles.backButtonText}>{backLabel}</Text>
          </TouchableOpacity>

          <View style={styles.blockchainChip}>
            <Ionicons name="shield-checkmark" size={12} color="#15803d" />
            <Text style={styles.blockchainChipText}>AutoCare Blockchain Secured</Text>
          </View>

          <Text style={styles.pageTitle}>Transfer Vehicle Records</Text>
        </View>

        {/* 3. SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={17}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search VINs, service records..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search VINs and service records"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Local Preview Notice (only after valid local preview transfer) */}
        {localPreviewNotice ? (
          <View style={styles.previewNoticeBanner}>
            <Ionicons name="information-circle-outline" size={17} color="#0056A2" />
            <Text style={styles.previewNoticeText}>{localPreviewNotice}</Text>
          </View>
        ) : null}

        {!matchesSearch ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={26} color="#0056A2" />
            </View>
            <Text style={styles.emptyTitle}>No matching vehicle records.</Text>
            <Text style={styles.emptySubtitle}>
              Try searching by vehicle name, registration number, VIN, or owner name.
            </Text>
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
              activeOpacity={0.85}
            >
              <Text style={styles.clearSearchButtonText}>Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 4. VEHICLE SUMMARY CARD */}
            <View style={styles.card}>
              <View style={styles.vehicleSummaryTop}>
                <View style={styles.vehicleVisualBox}>
                  <Ionicons name="car-sport" size={32} color="#0056A2" />
                </View>

                <View style={styles.vehicleSummaryTextCol}>
                  <Text style={styles.vehicleName}>{vehicleName}</Text>
                  <Text style={styles.immutableLabel}>Global Immutable Record:</Text>
                  <Text style={styles.immutableHash}>0x9d15dc86 ... bf489</Text>

                  <View style={styles.aiTrustBadge}>
                    <Ionicons name="sparkles-outline" size={11} color="#15803d" />
                    <Text style={styles.aiTrustBadgeText}>AI Trust Score: 98%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryActionsRow}>
                <TouchableOpacity
                  style={styles.editDetailsButton}
                  onPress={() => onEditDetailsPress?.()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0056A2" />
                  <Text style={styles.editDetailsButtonText}>Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.transferPassportButton}
                  onPress={openTransferModal}
                  activeOpacity={0.85}
                >
                  <Ionicons name="swap-horizontal-outline" size={16} color="#ffffff" />
                  <Text style={styles.transferPassportButtonText}>
                    Transfer Passport
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 5. OWNERSHIP & CRYPTOGRAPHIC INTEGRITY LEDGER */}
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="lock-closed-outline" size={17} color="#0056A2" />
                <Text style={styles.cardTitle}>
                  Ownership &amp; Cryptographic Integrity Ledger
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.ledgerSection}>
                <Text style={styles.sectionSmallLabel}>Current Verified Owner</Text>
                <Text style={styles.ownerDisplayName}>{ledgerOwnerDisplay}</Text>
                <View style={styles.hashRow}>
                  <Text style={styles.hashLabel}>Owner Hash: </Text>
                  <Text style={styles.hashValue}>0x81ac2 ... b652</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.ledgerSectionLast}>
                <Text style={styles.sectionSmallLabel}>
                  Trust Verification Status
                </Text>
                <View style={styles.compliantBadge}>
                  <Ionicons name="shield-checkmark" size={13} color="#15803d" />
                  <Text style={styles.compliantBadgeText}>FULLY COMPLIANT</Text>
                </View>
                <Text style={styles.compliantHelper}>
                  Audit status verified 100% complete
                </Text>
              </View>
            </View>

            {/* 6. OFFICIAL REGISTRATION SPECIFICATIONS */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Official Registration Specifications
              </Text>

              <View style={styles.divider} />

              {specificationRows.map((row, idx) => (
                <View key={row.label}>
                  <View
                    style={[
                      styles.specRow,
                      idx === specificationRows.length - 1 ? styles.specRowLast : null,
                    ]}
                  >
                    <Text style={styles.specLabel}>{row.label}</Text>
                    <Text
                      style={[
                        styles.specValue,
                        row.mono ? styles.specValueMono : null,
                      ]}
                    >
                      {row.value}
                    </Text>
                  </View>
                  {idx < specificationRows.length - 1 ? (
                    <View style={styles.divider} />
                  ) : null}
                </View>
              ))}
            </View>

            {/* 7. PASSPORT TRUST SCORE CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Passport Trust Score</Text>

              <View style={styles.trustScoreCenter}>
                <View style={styles.trustRingOuter}>
                  <View style={styles.trustRingInner}>
                    <Text style={styles.trustRingPercent}>100%</Text>
                  </View>
                </View>

                <Text style={styles.trustSupportingText}>
                  Data sources verified on decentralised cluster ledger. No discrepancy found.
                </Text>
              </View>
            </View>

            {/* 8. ODOMETER AUTHENTICITY CARD */}
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="speedometer-outline" size={18} color="#0056A2" />
                <Text style={styles.cardTitle}>Odometer Authenticity</Text>
              </View>

              <Text style={styles.odometerDescription}>
                Telemetry cross-analysis confirms odometer sequence consistency against 12 historical check-ins.
              </Text>

              <View style={styles.mileageRatingBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#15803d" />
                <Text style={styles.mileageRatingBadgeText}>
                  MILEAGE RATING: PERFECT (A+)
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* 9. TRANSFER PASSPORT CONFIRMATION MODAL (FRONTEND-ONLY) */}
      <Modal
        visible={showTransferModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeTransferModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeTransferModal}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="swap-horizontal" size={24} color="#0056A2" />
              </View>

              <Text style={styles.modalTitle}>Transfer Passport</Text>
              <Text style={styles.modalSubtitle}>
                Enter the new owner details for {vehicleName} ({registrationNumber}). Frontend preview only — no backend transfer is submitted.
              </Text>

              {/* New Owner Name */}
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>New owner name</Text>
                <View
                  style={[
                    styles.modalInputWrapper,
                    modalErrors.ownerName ? styles.modalInputError : null,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={15}
                    color="#94a3b8"
                    style={styles.modalInputIcon}
                  />
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Nimal Perera"
                    placeholderTextColor="#94a3b8"
                    value={newOwnerName}
                    onChangeText={(val) => {
                      setNewOwnerName(val);
                      if (modalErrors.ownerName) {
                        setModalErrors((prev) => ({ ...prev, ownerName: undefined }));
                      }
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {modalErrors.ownerName ? (
                  <Text style={styles.modalErrorText}>{modalErrors.ownerName}</Text>
                ) : null}
              </View>

              {/* New Owner Email */}
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>New owner email</Text>
                <View
                  style={[
                    styles.modalInputWrapper,
                    modalErrors.ownerEmail ? styles.modalInputError : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={15}
                    color="#94a3b8"
                    style={styles.modalInputIcon}
                  />
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. nimal@example.com"
                    placeholderTextColor="#94a3b8"
                    value={newOwnerEmail}
                    onChangeText={(val) => {
                      setNewOwnerEmail(val);
                      if (modalErrors.ownerEmail) {
                        setModalErrors((prev) => ({
                          ...prev,
                          ownerEmail: undefined,
                        }));
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
                {modalErrors.ownerEmail ? (
                  <Text style={styles.modalErrorText}>{modalErrors.ownerEmail}</Text>
                ) : null}
              </View>

              {/* Modal Actions */}
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={closeTransferModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmTransfer}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalConfirmText}>Confirm transfer</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* 10. BOTTOM NAVIGATION (NO TAB ACTIVE — SECONDARY UTILITY SCREEN) */}
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
    marginBottom: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056A2',
  },
  blockchainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    gap: 5,
    marginBottom: 8,
  },
  blockchainChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803d',
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  previewNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  previewNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0056A2',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleSummaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  vehicleVisualBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSummaryTextCol: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 3,
  },
  immutableLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  immutableHash: {
    fontSize: 11.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontWeight: '700',
    marginBottom: 8,
  },
  aiTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  aiTrustBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  summaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
  },
  editDetailsButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editDetailsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  transferPassportButton: {
    flex: 1.2,
    height: 40,
    backgroundColor: '#0056A2',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  transferPassportButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 1,
    marginBottom: 4,
  },
  ledgerSection: {
    paddingVertical: 12,
  },
  ledgerSectionLast: {
    paddingTop: 12,
    paddingBottom: 2,
  },
  sectionSmallLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  ownerDisplayName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  hashLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  hashValue: {
    fontSize: 11.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontWeight: '700',
  },
  compliantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    marginBottom: 6,
  },
  compliantBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  compliantHelper: {
    fontSize: 12,
    color: '#64748b',
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: 10,
  },
  specRowLast: {
    paddingBottom: 2,
  },
  specLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    flexShrink: 0,
  },
  specValue: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  specValueMono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0056A2',
    fontSize: 11.5,
  },
  trustScoreCenter: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  trustRingOuter: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: '#f0fdf4',
    borderWidth: 8,
    borderColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  trustRingInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustRingPercent: {
    fontSize: 26,
    fontWeight: '800',
    color: '#15803d',
  },
  trustSupportingText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  odometerDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 12,
  },
  mileageRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  mileageRatingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#15803d',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
  },
  clearSearchButton: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  modalOverlay: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalFieldGroup: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 5,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 9,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  modalInputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  modalInputIcon: {
    marginRight: 7,
  },
  modalTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  modalErrorText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 4,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalConfirmButton: {
    flex: 1.2,
    height: 42,
    borderRadius: 9,
    backgroundColor: '#0056A2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
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
});

export default TransferVehicleRecordsScreen;

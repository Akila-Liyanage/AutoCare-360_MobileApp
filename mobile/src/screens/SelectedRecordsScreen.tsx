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
import { AccessLevelStep1Data } from './AccessLevelScreen';

export type SelectedRecordsStep2Data = {
  serviceHistory: boolean;
  maintenanceRecords: boolean;
  emissionsReports: boolean;
  ownershipRecords: boolean;
  expenseRecords: boolean;
  notes: string;
};

export interface SelectedRecordsScreenProps {
  step1Data?: AccessLevelStep1Data | null;
  initialDraft?: SelectedRecordsStep2Data | null;
  onBackPress?: (currentDraft: SelectedRecordsStep2Data) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onContinuePress?: (data: SelectedRecordsStep2Data) => void;
  onSaveDraftPress?: (draft: SelectedRecordsStep2Data) => void;
  onHomePress?: () => void;
  onVehiclesPress?: () => void;
  onSharingPress?: () => void;
  onHealthPress?: () => void;
}

type CategoryKey =
  | 'serviceHistory'
  | 'maintenanceRecords'
  | 'emissionsReports'
  | 'ownershipRecords'
  | 'expenseRecords';

interface RecordCategoryOption {
  key: CategoryKey;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const RECORD_CATEGORIES: RecordCategoryOption[] = [
  {
    key: 'serviceHistory',
    title: 'Service history',
    description: 'Verified service entries and workshop records.',
    icon: 'construct-outline',
  },
  {
    key: 'maintenanceRecords',
    title: 'Maintenance records',
    description: 'Maintenance schedules, repairs and replaced parts.',
    icon: 'build-outline',
  },
  {
    key: 'emissionsReports',
    title: 'Emissions reports',
    description: 'Verified emissions and inspection reports.',
    icon: 'leaf-outline',
  },
  {
    key: 'ownershipRecords',
    title: 'Ownership records',
    description: 'Ownership and transfer-related vehicle records.',
    icon: 'swap-horizontal-outline',
  },
  {
    key: 'expenseRecords',
    title: 'Expense records',
    description: 'Vehicle-related expense and cost history.',
    icon: 'wallet-outline',
  },
];

export const SelectedRecordsScreen: React.FC<SelectedRecordsScreenProps> = ({
  step1Data,
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
  const [serviceHistory, setServiceHistory] = useState<boolean>(
    initialDraft?.serviceHistory ?? true
  );
  const [maintenanceRecords, setMaintenanceRecords] = useState<boolean>(
    initialDraft?.maintenanceRecords ?? true
  );
  const [emissionsReports, setEmissionsReports] = useState<boolean>(
    initialDraft?.emissionsReports ?? true
  );
  const [ownershipRecords, setOwnershipRecords] = useState<boolean>(
    initialDraft?.ownershipRecords ?? false
  );
  const [expenseRecords, setExpenseRecords] = useState<boolean>(
    initialDraft?.expenseRecords ?? false
  );
  const [notes, setNotes] = useState<string>(initialDraft?.notes ?? '');

  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  const selectionMap: Record<CategoryKey, boolean> = useMemo(
    () => ({
      serviceHistory,
      maintenanceRecords,
      emissionsReports,
      ownershipRecords,
      expenseRecords,
    }),
    [
      serviceHistory,
      maintenanceRecords,
      emissionsReports,
      ownershipRecords,
      expenseRecords,
    ]
  );

  const selectedCategories = useMemo(
    () => RECORD_CATEGORIES.filter((cat) => selectionMap[cat.key]),
    [selectionMap]
  );

  const recipientLabel =
    step1Data?.recipientName || 'N. Fernando · Ceylinco Insurance';
  const vehicleLabel = step1Data?.vehicle || 'WP ABC-1234 · Toyota Aqua';
  const accessLevelLabel =
    step1Data?.accessLevel === 'review' ? 'Review' : 'View only';

  const buildPayload = (): SelectedRecordsStep2Data => ({
    serviceHistory,
    maintenanceRecords,
    emissionsReports,
    ownershipRecords,
    expenseRecords,
    notes,
  });

  const handleToggleCategory = (key: CategoryKey) => {
    setDraftSaved(false);
    setSelectionError(null);
    switch (key) {
      case 'serviceHistory':
        setServiceHistory((prev) => !prev);
        break;
      case 'maintenanceRecords':
        setMaintenanceRecords((prev) => !prev);
        break;
      case 'emissionsReports':
        setEmissionsReports((prev) => !prev);
        break;
      case 'ownershipRecords':
        setOwnershipRecords((prev) => !prev);
        break;
      case 'expenseRecords':
        setExpenseRecords((prev) => !prev);
        break;
    }
  };

  const handleSelectAll = () => {
    setServiceHistory(true);
    setMaintenanceRecords(true);
    setEmissionsReports(true);
    setOwnershipRecords(true);
    setExpenseRecords(true);
    setSelectionError(null);
    setDraftSaved(false);
  };

  const handleClearAll = () => {
    setServiceHistory(false);
    setMaintenanceRecords(false);
    setEmissionsReports(false);
    setOwnershipRecords(false);
    setExpenseRecords(false);
    setDraftSaved(false);
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      setSelectionError('Select at least one record category to continue.');
      return;
    }
    setSelectionError(null);
    onContinuePress?.(buildPayload());
  };

  const handleSaveDraft = () => {
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
        {/* 2. BACK + PAGE INTRO */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.(buildPayload())}
          activeOpacity={0.7}
          accessibilityLabel="Back to Access Level"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR-6 · ACCESS PERMISSIONS</Text>
          <Text style={styles.pageTitle}>Selected records</Text>
          <Text style={styles.pageSubtitle}>
            Choose exactly which vehicle information this recipient can access.
          </Text>
        </View>

        {/* 3. STEP INDICATOR */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 2 of 3 · Selected records</Text>
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentActive]} />
            <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
          </View>
        </View>

        {/* 4. ACCESS CONTEXT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="shield-checkmark-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Access context</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.contextList}>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Recipient</Text>
              <Text style={styles.contextValue}>{recipientLabel}</Text>
            </View>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Vehicle</Text>
              <Text style={styles.contextValue}>{vehicleLabel}</Text>
            </View>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Access level</Text>
              <Text style={[styles.contextValue, styles.contextAccent]}>
                {accessLevelLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. CHOOSE RECORDS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="folder-open-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Choose records</Text>
            </View>

            <View style={styles.bulkActionsRow}>
              <TouchableOpacity
                style={styles.bulkActionChip}
                onPress={handleSelectAll}
                activeOpacity={0.75}
              >
                <Text style={styles.bulkActionText}>Select all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bulkActionChipMuted}
                onPress={handleClearAll}
                activeOpacity={0.75}
              >
                <Text style={styles.bulkActionTextMuted}>Clear all</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.categoriesList}>
            {RECORD_CATEGORIES.map((category) => {
              const isChecked = selectionMap[category.key];
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryCard,
                    isChecked ? styles.categoryCardSelected : null,
                  ]}
                  onPress={() => handleToggleCategory(category.key)}
                  activeOpacity={0.8}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isChecked ? styles.checkboxBoxChecked : null,
                    ]}
                  >
                    {isChecked ? (
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    ) : null}
                  </View>

                  <View style={styles.categoryTextCol}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDesc}>
                      {category.description}
                    </Text>
                  </View>

                  <Ionicons
                    name={category.icon}
                    size={18}
                    color={isChecked ? '#0056A2' : '#94a3b8'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {selectionError ? (
            <Text style={styles.errorText}>{selectionError}</Text>
          ) : null}
        </View>

        {/* 6. SELECTED ACCESS SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Selected access</Text>
          <Text style={styles.summaryCountText}>
            {selectedCategories.length} record{' '}
            {selectedCategories.length === 1 ? 'category' : 'categories'}{' '}
            selected
          </Text>

          {selectedCategories.length === 0 ? (
            <View style={styles.emptyWarningBox}>
              <Ionicons name="warning-outline" size={16} color="#b45309" />
              <Text style={styles.emptyWarningText}>
                Select at least one record category to continue.
              </Text>
            </View>
          ) : (
            <View style={styles.chipsWrap}>
              {selectedCategories.map((cat) => (
                <View key={cat.key} style={styles.selectedChip}>
                  <Ionicons name="checkmark-circle" size={13} color="#0056A2" />
                  <Text style={styles.selectedChipText}>{cat.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 7. ACCESS NOTE CARD */}
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Access note</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setDraftSaved(false);
            }}
            multiline
            textAlignVertical="top"
            placeholder="Add a note for this permission..."
            placeholderTextColor="#94a3b8"
            accessibilityLabel="Access note"
          />
        </View>

        {/* 8. PRIMARY & SECONDARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue to review</Text>
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

      {/* 9. OWNER SHARING / HEALTH SUBMODULE BOTTOM NAV (SHARING ACTIVE) */}
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
    marginBottom: 14,
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
    flexWrap: 'wrap',
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
  contextList: {
    gap: 9,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  contextLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  contextValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  contextAccent: {
    color: '#0056A2',
  },
  bulkActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulkActionChip: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bulkActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0056A2',
  },
  bulkActionChipMuted: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bulkActionTextMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 11,
  },
  categoryCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#0056A2',
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
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0056A2',
    borderColor: '#0056A2',
  },
  categoryTextCol: {
    flex: 1,
    minWidth: 0,
  },
  categoryTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: 12,
    lineHeight: 16.5,
    color: '#475569',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 10,
  },
  summaryCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0056A2',
    marginTop: 4,
    marginBottom: 11,
  },
  emptyWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 11,
    gap: 7,
  },
  emptyWarningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004684',
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
    marginTop: 2,
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

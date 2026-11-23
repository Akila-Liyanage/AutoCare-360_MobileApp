import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { VerifyCodeScreen } from './src/screens/VerifyCodeScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { OwnerHomeScreen } from './src/screens/OwnerHomeScreen';
import { MOCK_VEHICLES, VehicleItem, VehiclesScreen } from './src/screens/VehiclesScreen';
import { AddVehicleScreen } from './src/screens/AddVehicleScreen';
import { VehicleDetailScreen } from './src/screens/VehicleDetailScreen';
import { RecordsScreen } from './src/screens/RecordsScreen';
import { MaintenanceHistoryScreen } from './src/screens/MaintenanceHistoryScreen';
import { TransferVehicleRecordsScreen } from './src/screens/TransferVehicleRecordsScreen';
import { ExpenseTrackingScreen } from './src/screens/ExpenseTrackingScreen';
import { ItemizedExpenseLedgerScreen } from './src/screens/ItemizedExpenseLedgerScreen';
import {
  NotificationItem,
  NotificationsScreen,
  STATIC_NOTIFICATIONS,
} from './src/screens/NotificationsScreen';
import {
  CreateNotificationScreen,
  NotificationDraftData,
} from './src/screens/CreateNotificationScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import {
  DEFAULT_OWNER_PROFILE,
  EditProfileScreen,
  OwnerProfileData,
} from './src/screens/EditProfileScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { GarageOverviewScreen } from './src/screens/GarageOverviewScreen';
import {
  DEFAULT_GARAGE_PROFILE,
  GarageProfileData,
  GarageProfileScreen,
} from './src/screens/GarageProfileScreen';
import {
  GARAGE_VEHICLE_RECORDS,
  GarageVehicleRecord,
  GarageVehicleRecordsScreen,
} from './src/screens/GarageVehicleRecordsScreen';
import { GarageVehiclePassportScreen } from './src/screens/GarageVehiclePassportScreen';
import {
  findGarageServiceRecordById,
  GARAGE_SERVICE_RECORDS,
  GarageServiceRecord,
  GarageServiceRecordDetailScreen,
} from './src/screens/GarageServiceRecordDetailScreen';
import {
  GarageOcrReviewScreen,
  OcrReviewDraftData,
} from './src/screens/GarageOcrReviewScreen';
import {
  AddMaintenanceStep1Screen,
  MaintenanceStep1Data,
} from './src/screens/AddMaintenanceStep1Screen';
import {
  AddMaintenanceStep2Screen,
  MaintenanceStep2Data,
} from './src/screens/AddMaintenanceStep2Screen';
import {
  AddMaintenanceStep3Screen,
  MaintenanceStep3Data,
  PreparedMaintenanceRecord,
} from './src/screens/AddMaintenanceStep3Screen';
import {
  GenerateQuotationScreen,
  PreparedQuotation,
  QuotationFormData,
} from './src/screens/GenerateQuotationScreen';
import {
  GenerateInvoiceStep1Screen,
  InvoiceStep1Data,
} from './src/screens/GenerateInvoiceStep1Screen';
import {
  GenerateInvoiceStep2Screen,
  InvoiceStep2Data,
  PreparedInvoice,
} from './src/screens/GenerateInvoiceStep2Screen';
import { LogoutConfirmation } from './src/components/LogoutConfirmation';

type AuthScreen = 'login' | 'register' | 'forgotPassword' | 'verifyCode' | 'resetPassword';
type OwnerScreen =
  | 'home'
  | 'vehicles'
  | 'addVehicle'
  | 'viewVehicle'
  | 'records'
  | 'maintenanceHistory'
  | 'transferVehicleRecords'
  | 'expenseTracking'
  | 'itemizedExpenseLedger'
  | 'notifications'
  | 'createNotification'
  | 'profile'
  | 'editProfile';
type GarageScreen =
  | 'overview'
  | 'garageProfile'
  | 'vehicleRecords'
  | 'vehiclePassport'
  | 'serviceRecordDetail'
  | 'ocrReview'
  | 'maintenanceStep1'
  | 'maintenanceStep2'
  | 'maintenanceStep3'
  | 'quotation'
  | 'invoiceStep1'
  | 'invoiceStep2';

function MainNavigator() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [ownerScreen, setOwnerScreen] = useState<OwnerScreen>('home');
  const [garageScreen, setGarageScreen] = useState<GarageScreen>('overview');
  const [garageProfile, setGarageProfile] = useState<GarageProfileData>(
    DEFAULT_GARAGE_PROFILE
  );
  const [selectedGarageVehicle, setSelectedGarageVehicle] =
    useState<GarageVehicleRecord | null>(null);
  const [selectedGarageServiceRecord, setSelectedGarageServiceRecord] =
    useState<GarageServiceRecord | null>(null);
  const [ocrReviewDraft, setOcrReviewDraft] =
    useState<OcrReviewDraftData | null>(null);
  const [maintenanceStep1Draft, setMaintenanceStep1Draft] =
    useState<MaintenanceStep1Data | null>(null);
  const [maintenanceStep2Draft, setMaintenanceStep2Draft] =
    useState<MaintenanceStep2Data | null>(null);
  const [maintenanceStep3Draft, setMaintenanceStep3Draft] =
    useState<MaintenanceStep3Data | null>(null);
  const [, setPreparedMaintenanceRecord] =
    useState<PreparedMaintenanceRecord | null>(null);
  const [quotationDraft, setQuotationDraft] =
    useState<QuotationFormData | null>(null);
  const [preparedQuotation, setPreparedQuotation] =
    useState<PreparedQuotation | null>(null);
  const [invoiceStep1Draft, setInvoiceStep1Draft] =
    useState<InvoiceStep1Data | null>(null);
  const [invoiceStep2Draft, setInvoiceStep2Draft] =
    useState<InvoiceStep2Data | null>(null);
  const [, setPreparedInvoice] = useState<PreparedInvoice | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfileData>(DEFAULT_OWNER_PROFILE);
  const [vehicles, setVehicles] = useState<VehicleItem[]>(MOCK_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(STATIC_NOTIFICATIONS);
  const [notificationDraft, setNotificationDraft] = useState<NotificationDraftData | null>(null);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [recoveryIdentifier, setRecoveryIdentifier] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [, setResetPasswordValue] = useState<string>('');

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      setShowLogout(false);
      setOwnerScreen('home');
      setGarageScreen('overview');
      setGarageProfile(DEFAULT_GARAGE_PROFILE);
      setSelectedGarageVehicle(null);
      setSelectedGarageServiceRecord(null);
      setOcrReviewDraft(null);
      setMaintenanceStep1Draft(null);
      setMaintenanceStep2Draft(null);
      setMaintenanceStep3Draft(null);
      setPreparedMaintenanceRecord(null);
      setQuotationDraft(null);
      setPreparedQuotation(null);
      setInvoiceStep1Draft(null);
      setInvoiceStep2Draft(null);
      setPreparedInvoice(null);
      setCurrentScreen('login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to log out. Please try again.';
      setLogoutError(msg);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('./assets/autocare-logo.png')}
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#0056A2" />
        <Text style={styles.loadingText}>Initializing AutoCare 360...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    const role = user?.role || 'owner';
    if (role === 'owner') {
      if (ownerScreen === 'editProfile') {
        return (
          <EditProfileScreen
            initialProfile={ownerProfile}
            onBack={() => setOwnerScreen('profile')}
            onCancel={() => setOwnerScreen('profile')}
            onSave={(updatedProfile) => {
              setOwnerProfile(updatedProfile);
              setOwnerScreen('profile');
            }}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'addVehicle') {
        return (
          <AddVehicleScreen
            ownerProfile={ownerProfile}
            onBack={() => setOwnerScreen('vehicles')}
            onCancel={() => setOwnerScreen('vehicles')}
            onSave={(newVehicle) => {
              setVehicles((prev) => [newVehicle, ...prev]);
              setOwnerScreen('vehicles');
            }}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'viewVehicle') {
        const activeVehicle = selectedVehicle ?? vehicles[0] ?? MOCK_VEHICLES[0];
        return (
          <VehicleDetailScreen
            vehicle={activeVehicle}
            ownerProfile={ownerProfile}
            onBack={() => setOwnerScreen('vehicles')}
            onHomePress={() => setOwnerScreen('home')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onViewCompleteHistoryPress={() => setOwnerScreen('maintenanceHistory')}
            onTransferRecordsPress={() => setOwnerScreen('transferVehicleRecords')}
            onExpenseTrackingPress={() => setOwnerScreen('expenseTracking')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'itemizedExpenseLedger') {
        return (
          <ItemizedExpenseLedgerScreen
            onBack={() => setOwnerScreen('expenseTracking')}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'expenseTracking') {
        return (
          <ExpenseTrackingScreen
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
            onViewLedgerPress={() => setOwnerScreen('itemizedExpenseLedger')}
          />
        );
      }
      if (ownerScreen === 'transferVehicleRecords') {
        const transferVehicle = selectedVehicle ?? vehicles[0] ?? MOCK_VEHICLES[0];
        return (
          <TransferVehicleRecordsScreen
            vehicle={transferVehicle}
            ownerProfile={ownerProfile}
            backLabel={selectedVehicle ? 'Back to Vehicle' : 'Back to Records'}
            onBack={() =>
              setOwnerScreen(selectedVehicle ? 'viewVehicle' : 'records')
            }
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'maintenanceHistory') {
        return (
          <MaintenanceHistoryScreen
            onBack={() => setOwnerScreen('records')}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'createNotification') {
        return (
          <CreateNotificationScreen
            initialDraft={notificationDraft}
            onBack={() => setOwnerScreen('notifications')}
            onCancel={() => setOwnerScreen('notifications')}
            onSaveDraft={(draft) => {
              setNotificationDraft(draft);
              setOwnerScreen('notifications');
            }}
            onSave={(newNotification) => {
              setNotifications((prev) => [newNotification, ...prev]);
              setNotificationDraft(null);
              setOwnerScreen('notifications');
            }}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
          />
        );
      }
      if (ownerScreen === 'notifications') {
        return (
          <NotificationsScreen
            notifications={notifications}
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onSchedulePress={() => setOwnerScreen('createNotification')}
          />
        );
      }
      if (ownerScreen === 'records') {
        return (
          <RecordsScreen
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onProfilePress={() => setOwnerScreen('profile')}
            onMaintenanceHistoryPress={() => setOwnerScreen('maintenanceHistory')}
            onTransferRecordsPress={() => setOwnerScreen('transferVehicleRecords')}
            onExpenseTrackingPress={() => setOwnerScreen('expenseTracking')}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'vehicles') {
        return (
          <VehiclesScreen
            vehicles={vehicles}
            onHomePress={() => setOwnerScreen('home')}
            onRecordsPress={() => setOwnerScreen('records')}
            onProfilePress={() => setOwnerScreen('profile')}
            onAddVehiclePress={() => setOwnerScreen('addVehicle')}
            onViewVehiclePress={(vehicle) => {
              setSelectedVehicle(vehicle);
              setOwnerScreen('viewVehicle');
            }}
            onViewPassportPress={(vehicle) => {
              setSelectedVehicle(vehicle);
              setOwnerScreen('viewVehicle');
            }}
            onNotificationsPress={() => setOwnerScreen('notifications')}
          />
        );
      }
      if (ownerScreen === 'profile') {
        return (
          <>
            <ProfileScreen
              profile={ownerProfile}
              onHomePress={() => setOwnerScreen('home')}
              onVehiclesPress={() => setOwnerScreen('vehicles')}
              onRecordsPress={() => setOwnerScreen('records')}
              onEditProfilePress={() => setOwnerScreen('editProfile')}
              onLogoutPress={() => {
                setLogoutError(null);
                setShowLogout(true);
              }}
              onNotificationsPress={() => setOwnerScreen('notifications')}
            />
            <LogoutConfirmation
              visible={showLogout}
              isLoggingOut={isLoggingOut}
              error={logoutError}
              onCancel={() => {
                setLogoutError(null);
                setShowLogout(false);
              }}
              onConfirm={handleConfirmLogout}
            />
          </>
        );
      }
      return (
        <OwnerHomeScreen
          onVehiclesPress={() => setOwnerScreen('vehicles')}
          onRecordsPress={() => setOwnerScreen('records')}
          onProfilePress={() => setOwnerScreen('profile')}
          onPressCreatePassport={() => setOwnerScreen('addVehicle')}
          onPressNotifications={() => setOwnerScreen('notifications')}
        />
      );
    }
    if (role === 'garage') {
      const currentMaintenanceRoute: GarageScreen = maintenanceStep3Draft
        ? 'maintenanceStep3'
        : maintenanceStep2Draft
        ? 'maintenanceStep2'
        : 'maintenanceStep1';

      if (garageScreen === 'invoiceStep2') {
        const activeQuotationCode =
          preparedQuotation?.quotationNumber ||
          quotationDraft?.quotationNumber ||
          'QT-2026-091';
        return (
          <GenerateInvoiceStep2Screen
            step1Data={invoiceStep1Draft}
            initialDraft={invoiceStep2Draft}
            linkedQuotationCode={activeQuotationCode}
            onBackPress={(draft) => {
              setInvoiceStep2Draft(draft);
              setGarageScreen('invoiceStep1');
            }}
            onSaveDraftPress={(draft) => setInvoiceStep2Draft(draft)}
            onPrepareInvoicePress={(invoice) => {
              setInvoiceStep2Draft(invoice.step2);
              setPreparedInvoice(invoice);
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('invoiceStep2')}
          />
        );
      }
      if (garageScreen === 'invoiceStep1') {
        return (
          <GenerateInvoiceStep1Screen
            selectedVehicle={selectedGarageVehicle}
            initialDraft={invoiceStep1Draft}
            linkedQuotation={preparedQuotation ?? quotationDraft}
            onBackPress={(draft) => {
              setInvoiceStep1Draft(draft);
              setGarageScreen('overview');
            }}
            onSaveDraftPress={(draft) => setInvoiceStep1Draft(draft)}
            onContinuePress={(data) => {
              setInvoiceStep1Draft(data);
              setGarageScreen('invoiceStep2');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('invoiceStep1')}
          />
        );
      }
      if (garageScreen === 'quotation') {
        return (
          <GenerateQuotationScreen
            selectedVehicle={selectedGarageVehicle}
            initialDraft={quotationDraft}
            onBackPress={(draft) => {
              setQuotationDraft(draft);
              setGarageScreen('overview');
            }}
            onSaveDraftPress={(draft) => setQuotationDraft(draft)}
            onGenerateQuotationPress={(prepared) => {
              setQuotationDraft(prepared);
              setPreparedQuotation(prepared);
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'maintenanceStep3') {
        const step3VehicleLabel =
          maintenanceStep1Draft?.vehicleLabel ||
          (selectedGarageVehicle
            ? `${selectedGarageVehicle.registration} · ${selectedGarageVehicle.model}`
            : 'WP ABC-1234 · Toyota Aqua');
        return (
          <AddMaintenanceStep3Screen
            step1Data={maintenanceStep1Draft}
            step2Data={maintenanceStep2Draft}
            initialDraft={maintenanceStep3Draft}
            vehicleLabel={step3VehicleLabel}
            onBackPress={(currentDraft) => {
              setMaintenanceStep3Draft(currentDraft);
              setGarageScreen('maintenanceStep2');
            }}
            onSaveDraftPress={(draft) => setMaintenanceStep3Draft(draft)}
            onPrepareRecordPress={(record) => {
              setMaintenanceStep3Draft(record.step3);
              setPreparedMaintenanceRecord(record);
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen('maintenanceStep3')}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'maintenanceStep2') {
        const step2VehicleLabel =
          maintenanceStep1Draft?.vehicleLabel ||
          (selectedGarageVehicle
            ? `${selectedGarageVehicle.registration} · ${selectedGarageVehicle.model}`
            : 'WP ABC-1234 · Toyota Aqua');
        return (
          <AddMaintenanceStep2Screen
            vehicleLabel={step2VehicleLabel}
            initialDraft={maintenanceStep2Draft}
            onBackPress={(currentDraft) => {
              setMaintenanceStep2Draft(currentDraft);
              setGarageScreen('maintenanceStep1');
            }}
            onSaveDraftPress={(draft) => setMaintenanceStep2Draft(draft)}
            onContinuePress={(data) => {
              setMaintenanceStep2Draft(data);
              setGarageScreen('maintenanceStep3');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen('maintenanceStep2')}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'maintenanceStep1') {
        const syncSelectedVehicle = (data: MaintenanceStep1Data) => {
          const matched = GARAGE_VEHICLE_RECORDS.find(
            (v) => v.id === data.vehicleId
          );
          if (matched) {
            setSelectedGarageVehicle(matched);
          }
        };
        return (
          <AddMaintenanceStep1Screen
            selectedVehicle={selectedGarageVehicle}
            initialDraft={maintenanceStep1Draft}
            onBackPress={() => setGarageScreen('vehicleRecords')}
            onSaveDraftPress={(draft) => {
              syncSelectedVehicle(draft);
              setMaintenanceStep1Draft(draft);
            }}
            onContinuePress={(data) => {
              syncSelectedVehicle(data);
              setMaintenanceStep1Draft(data);
              setGarageScreen('maintenanceStep2');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen('maintenanceStep1')}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'garageProfile') {
        return (
          <GarageProfileScreen
            profile={garageProfile}
            onSaveProfile={(updated) => setGarageProfile(updated)}
            onBackPress={() => setGarageScreen('overview')}
            onViewVehicleRecordsPress={() => setGarageScreen('vehicleRecords')}
            onAddServiceEntryPress={() => setGarageScreen('maintenanceStep1')}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'ocrReview') {
        return (
          <GarageOcrReviewScreen
            initialDraft={ocrReviewDraft}
            onBackPress={(draft) => {
              setOcrReviewDraft(draft);
              setGarageScreen('overview');
            }}
            onApprovePress={(draft) => setOcrReviewDraft(draft)}
            onRejectPress={(draft) => setOcrReviewDraft(draft)}
            onContinueToServiceRecordPress={(draft) => {
              setOcrReviewDraft(draft);
              const matchedVehicle =
                GARAGE_VEHICLE_RECORDS.find(
                  (v) =>
                    v.registration.toLowerCase() ===
                    draft.registration.trim().toLowerCase()
                ) ?? null;
              if (matchedVehicle) {
                setSelectedGarageVehicle(matchedVehicle);
              }
              setGarageScreen('maintenanceStep1');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen('ocrReview')}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'serviceRecordDetail') {
        const matchGarageVehicle = (
          record: GarageServiceRecord
        ): GarageVehicleRecord =>
          GARAGE_VEHICLE_RECORDS.find(
            (v) =>
              v.registration.toLowerCase() === record.registration.toLowerCase()
          ) ??
          GARAGE_VEHICLE_RECORDS.find(
            (v) => v.model.toLowerCase() === record.vehicleModel.toLowerCase()
          ) ??
          GARAGE_VEHICLE_RECORDS[0];

        return (
          <GarageServiceRecordDetailScreen
            record={selectedGarageServiceRecord ?? GARAGE_SERVICE_RECORDS[0]}
            onBackPress={() => setGarageScreen('overview')}
            onViewVehiclePassportPress={(record) => {
              setSelectedGarageVehicle(matchGarageVehicle(record));
              setGarageScreen('vehiclePassport');
            }}
            onAddAnotherRecordPress={(record) => {
              const matchedVehicle = matchGarageVehicle(record);
              if (
                selectedGarageVehicle &&
                matchedVehicle.id !== selectedGarageVehicle.id
              ) {
                setMaintenanceStep2Draft(null);
                setMaintenanceStep3Draft(null);
                setPreparedMaintenanceRecord(null);
              }
              setSelectedGarageVehicle(matchedVehicle);
              setGarageScreen('maintenanceStep1');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen('serviceRecordDetail')}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'vehiclePassport') {
        return (
          <GarageVehiclePassportScreen
            vehicle={selectedGarageVehicle ?? GARAGE_VEHICLE_RECORDS[0]}
            onBackPress={() => setGarageScreen('vehicleRecords')}
            onAddServiceRecordPress={(vehicleId) => {
              const foundVehicle =
                GARAGE_VEHICLE_RECORDS.find((v) => v.id === vehicleId) ??
                selectedGarageVehicle ??
                GARAGE_VEHICLE_RECORDS[0];
              if (
                selectedGarageVehicle &&
                foundVehicle.id !== selectedGarageVehicle.id
              ) {
                setMaintenanceStep2Draft(null);
                setMaintenanceStep3Draft(null);
                setPreparedMaintenanceRecord(null);
              }
              setSelectedGarageVehicle(foundVehicle);
              setGarageScreen('maintenanceStep1');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      if (garageScreen === 'vehicleRecords') {
        return (
          <GarageVehicleRecordsScreen
            onBackPress={() => setGarageScreen('overview')}
            onViewPassportPress={(vehicleId) => {
              const foundVehicle =
                GARAGE_VEHICLE_RECORDS.find((v) => v.id === vehicleId) ?? null;
              setSelectedGarageVehicle(foundVehicle);
              setGarageScreen('vehiclePassport');
            }}
            onAddRecordPress={(vehicleId) => {
              const foundVehicle =
                GARAGE_VEHICLE_RECORDS.find((v) => v.id === vehicleId) ?? null;
              if (
                foundVehicle &&
                selectedGarageVehicle &&
                foundVehicle.id !== selectedGarageVehicle.id
              ) {
                setMaintenanceStep2Draft(null);
                setMaintenanceStep3Draft(null);
                setPreparedMaintenanceRecord(null);
              }
              setSelectedGarageVehicle(foundVehicle);
              setGarageScreen('maintenanceStep1');
            }}
            onGaragePress={() => setGarageScreen('overview')}
            onVehiclesPress={() => setGarageScreen('vehicleRecords')}
            onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
            onBillingPress={() => setGarageScreen('quotation')}
          />
        );
      }
      return (
        <GarageOverviewScreen
          onViewProfilePress={() => setGarageScreen('garageProfile')}
          onAddServiceEntryPress={() => setGarageScreen('maintenanceStep1')}
          onReviewScanPress={() => setGarageScreen('ocrReview')}
          onViewServiceRecordPress={(entryId) => {
            setSelectedGarageServiceRecord(
              findGarageServiceRecordById(entryId)
            );
            setGarageScreen('serviceRecordDetail');
          }}
          onVehicleRecordsPress={() => setGarageScreen('vehicleRecords')}
          onQuotationPress={() => setGarageScreen('quotation')}
          onInvoicePress={() => setGarageScreen('invoiceStep1')}
          onGaragePress={() => setGarageScreen('overview')}
          onVehiclesPress={() => setGarageScreen('vehicleRecords')}
          onJobsPress={() => setGarageScreen(currentMaintenanceRoute)}
          onBillingPress={() => setGarageScreen('quotation')}
        />
      );
    }
    return <DashboardScreen />;
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onNavigateToLogin={(email) => {
          if (email) setPrefilledEmail(email);
          setCurrentScreen('login');
        }}
      />
    );
  }

  if (currentScreen === 'forgotPassword') {
    return (
      <ForgotPasswordScreen
        initialIdentifier={recoveryIdentifier}
        onNavigateToLogin={() => setCurrentScreen('login')}
        onContinue={(identifier) => {
          if (identifier !== recoveryIdentifier) {
            setVerificationCode('');
          }
          setRecoveryIdentifier(identifier);
          setCurrentScreen('verifyCode');
        }}
      />
    );
  }

  if (currentScreen === 'verifyCode') {
    return (
      <VerifyCodeScreen
        identifier={recoveryIdentifier}
        initialCode={verificationCode}
        onBack={() => setCurrentScreen('forgotPassword')}
        onContinue={(code) => {
          setVerificationCode(code);
          setCurrentScreen('resetPassword');
        }}
      />
    );
  }

  if (currentScreen === 'resetPassword') {
    return (
      <ResetPasswordScreen
        onBack={() => setCurrentScreen('verifyCode')}
        onContinue={(newPassword) => {
          setResetPasswordValue(newPassword);
          setCurrentScreen('login');
        }}
      />
    );
  }

  return (
    <LoginScreen
      initialEmail={prefilledEmail}
      onNavigateToRegister={() => setCurrentScreen('register')}
      onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.appRoot}>
        <StatusBar style="dark" />
        <MainNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingLogo: {
    width: 220,
    height: 60,
    marginBottom: 24,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 16,
    fontWeight: '600',
  },
});

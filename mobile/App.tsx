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
import { ProfileScreen } from './src/screens/ProfileScreen';
import {
  DEFAULT_OWNER_PROFILE,
  EditProfileScreen,
  OwnerProfileData,
} from './src/screens/EditProfileScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LogoutConfirmation } from './src/components/LogoutConfirmation';

type AuthScreen = 'login' | 'register' | 'forgotPassword' | 'verifyCode' | 'resetPassword';
type OwnerScreen =
  | 'home'
  | 'vehicles'
  | 'addVehicle'
  | 'viewVehicle'
  | 'records'
  | 'profile'
  | 'editProfile';

function MainNavigator() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [ownerScreen, setOwnerScreen] = useState<OwnerScreen>('home');
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfileData>(DEFAULT_OWNER_PROFILE);
  const [vehicles, setVehicles] = useState<VehicleItem[]>(MOCK_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
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
            onViewCompleteHistoryPress={() => setOwnerScreen('records')}
          />
        );
      }
      if (ownerScreen === 'records') {
        return (
          <RecordsScreen
            onHomePress={() => setOwnerScreen('home')}
            onVehiclesPress={() => setOwnerScreen('vehicles')}
            onProfilePress={() => setOwnerScreen('profile')}
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

import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { VerifyCodeScreen } from './src/screens/VerifyCodeScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';

type AuthScreen = 'login' | 'register' | 'forgotPassword' | 'verifyCode' | 'resetPassword';

function MainNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [recoveryIdentifier, setRecoveryIdentifier] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [, setResetPasswordValue] = useState<string>('');

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

import { Platform } from 'react-native';

/**
 * AutoCare 360 - Mobile Application & Backend Configuration
 */
const getDefaultApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  // Standard Android Emulator maps host machine localhost to 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  // iOS simulator or Web
  return 'http://localhost:5000';
};

export const APP_CONFIG = {
  // AutoCare 360 Express REST API Base URL
  API_BASE_URL: getDefaultApiBaseUrl(),

  // Keycloak Identity Provider (IAM Fallback)
  KEYCLOAK_URL:
    process.env.EXPO_PUBLIC_KEYCLOAK_URL ||
    process.env.FRONTEND_KEYCLOAK_URL ||
    'https://idp.sltdigitallab.lk',
  KEYCLOAK_REALM:
    process.env.EXPO_PUBLIC_KEYCLOAK_REALM ||
    process.env.FRONTEND_KEYCLOAK_REALM ||
    'ai-data-pipeline',
  KEYCLOAK_CLIENT_ID:
    process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ||
    process.env.FRONTEND_KEYCLOAK_CLIENT_ID ||
    'frontend-client',
};

export default APP_CONFIG;

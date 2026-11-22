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
};

export default APP_CONFIG;

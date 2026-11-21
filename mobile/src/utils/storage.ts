import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKENS: '@autocare360_tokens',
  AUTH_USER: '@autocare360_user',
};

export const storage = {
  async saveTokens(tokens: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
    } catch (e) {
      console.warn('Failed to save tokens to storage', e);
    }
  },

  async getTokens(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get tokens from storage', e);
      return null;
    }
  },

  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user to storage', e);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get user from storage', e);
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKENS, STORAGE_KEYS.AUTH_USER]);
    } catch (e) {
      console.warn('Failed to clear auth from storage', e);
    }
  },
};

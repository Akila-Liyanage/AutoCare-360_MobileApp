import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type LogoutConfirmationProps = {
  visible: boolean;
  isLoggingOut?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  visible,
  isLoggingOut = false,
  error = null,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!isLoggingOut) {
          onCancel();
        }
      }}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          if (!isLoggingOut) {
            onCancel();
          }
        }}
      >
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Sign-out Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={26} color="#dc2626" />
          </View>

          {/* Title & Confirmation Copy */}
          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.message}>
            Are you sure you want to log out of your AutoCare 360 account? You will need to sign in again to access your digital passports.
          </Text>

          {/* Inline Error (only if logout fails unexpectedly) */}
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={15} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelButton, isLoggingOut && styles.buttonDisabled]}
              onPress={onCancel}
              disabled={isLoggingOut}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={isLoggingOut}
              activeOpacity={0.85}
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={16} color="#ffffff" />
                  <Text style={styles.logoutButtonText}>Log Out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
    gap: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 11.5,
    color: '#dc2626',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  logoutButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});

export default LogoutConfirmation;

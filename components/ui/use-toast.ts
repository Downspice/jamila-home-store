import { Alert } from 'react-native';

interface ToastOptions {
  title?: string;
  description?: string;
}

export const toast = {
  success: (message: string, options: ToastOptions = {}) => {
    Alert.alert(options.title || 'Success', message);
  },
  error: (message: string, options: ToastOptions = {}) => {
    Alert.alert(options.title || 'Error', message);
  }
}; 
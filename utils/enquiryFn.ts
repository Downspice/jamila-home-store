import React from 'react';
import { Button, Linking, Alert } from 'react-native';

export const callFn = () => {
  const phoneNumber = '+2330577210669';

  const makeCall = async () => {
    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'This device cannot make calls');
    }
  };
  makeCall();
};

 
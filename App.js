import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
I18nManager.allowRTL(false);  // Disable RTL support
I18nManager.forceRTL(false);  // Ensure LTR is forced

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2D' }}>
    <ActivityIndicator size="large" color="#BF272a" />
  </View>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLanguage, setInitialLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('@app_language');
        if (storedLanguage) {
          setInitialLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLanguage();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <AppNavigator />
    </LanguageProvider>
  );
};

export default App;

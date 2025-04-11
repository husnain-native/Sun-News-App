import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';  
import { BookmarkProvider } from '../context/BookmarkContext';
import { LanguageProvider } from '../context/LanguageContext'; // ✅ Fixed path
import { I18nManager } from 'react-native';

I18nManager.allowRTL(false);  // Disable RTL support
I18nManager.forceRTL(false);  // Ensure LTR is forced
const AppNavigator = () => {
  return (
    <LanguageProvider> {/* ✅ Wrap language provider outside */}
      <BookmarkProvider>
        <NavigationContainer>
          {/* DrawerNavigator includes BottomTabNavigator inside */}
          <DrawerNavigator />
        </NavigationContainer>
      </BookmarkProvider>
    </LanguageProvider>
  );
};

export default AppNavigator;

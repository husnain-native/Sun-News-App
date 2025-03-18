import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';  
import { BookmarkProvider } from '../context/BookmarkContext';
import { LanguageProvider } from '../context/LanguageContext'; // ✅ Fixed path

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

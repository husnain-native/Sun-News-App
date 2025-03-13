import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';  
import { BookmarkProvider } from '../context/BookmarkContext';

const AppNavigator = () => {
  return (
    <BookmarkProvider>
      <NavigationContainer>
        {/* DrawerNavigator includes BottomTabNavigator inside */}
        <DrawerNavigator />
      </NavigationContainer>
    </BookmarkProvider>
  );
};

export default AppNavigator;

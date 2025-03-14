import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';  
import { BookmarkProvider } from '../context/BookmarkContext';
import CategoryNavigation from '../components/CategoryNavigation';

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

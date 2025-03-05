import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
      <BottomTabNavigator /> {/* Move BottomTabNavigator outside of DrawerNavigator */}
    </NavigationContainer>
  );
};

export default AppNavigator;

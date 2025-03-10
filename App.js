import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator'; // Import Drawer Navigator
import BottomTabNavigator from './src/navigation/BottomTabNavigator'; // Import Bottom Tab Navigator

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator>
        <BottomTabNavigator />
      </DrawerNavigator>


    </NavigationContainer>
  );
};

export default AppNavigator;

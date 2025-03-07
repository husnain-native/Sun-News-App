import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import EntertainmentScreen from '../screens/EntertainmentScreen'; // Import the new screen
import NewsDetailsScreen from '../screens/NewsDetailsScreen'; // Import News Details Screen

import SportsScreen from '../screens/SportsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="Entertainment" component={EntertainmentScreen} /> 
        <Stack.Screen name="Sports" component={SportsScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} /> // Add News Details Screen

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './src/navigation/DrawerNavigator'; // Import Drawer Navigator
import BottomTabNavigator from './src/navigation/BottomTabNavigator'; // Import Bottom Tab Navigator
import EntertainmentScreen from './screens/EntertainmentScreen';
import SportsScreen from './screens/SportsScreen';
import NewsDetailsScreen from './screens/NewsDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Set BottomTabNavigator as the default Home screen */}
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        
        {/* Drawer Navigation */}
        <Stack.Screen name="Drawer" component={DrawerNavigator} />

        {/* Other Screens */}
        <Stack.Screen name="Entertainment" component={EntertainmentScreen} />
        <Stack.Screen name="Sports" component={SportsScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

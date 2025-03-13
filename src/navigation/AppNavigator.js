import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { BookmarkProvider } from '../context/BookmarkContext';
import NewsDetailsScreen from '../screens/NewsDetailsScreen';
import CategoryScreen from '../screens/CategoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <BookmarkProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BookmarkProvider>
  );
};

export default AppNavigator;

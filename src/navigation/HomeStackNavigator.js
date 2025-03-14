import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewsDetailsScreen from '../screens/NewsDetailsScreen';
import SportsScreen from '../screens/SportsScreen';
import CategoryScreen from '../screens/CategoryScreen';



import BusinessScreen from '../screens/BusinessScreen';

const Stack = createStackNavigator();


const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name='Category' component={CategoryScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="SportsScreen" component={SportsScreen} />

      <Stack.Screen name="Business" component={BusinessScreen} />
    </Stack.Navigator>

  );
};

export default HomeStackNavigator;

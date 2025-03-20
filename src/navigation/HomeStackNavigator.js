import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewsDetailsScreen from '../screens/NewsDetailsScreen';
import SportsScreen from '../screens/SportsScreen';
import LatestNews from '../screens/LatestNews';
import CategoryScreen from '../screens/CategoryScreen';
import PodcastScreen from '../screens/PodcastScreen';
import BusinessScreen from '../screens/BusinessScreen';
import ContactScreen from '../screens/ContactScreen';
import CategoryNavigation from '../components/CategoryNavigation';
import EntertainmentScreen from '../screens/EntertainmentScreen';
import LiveScreen from '../screens/LiveScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="Breaking" component={LatestNews} />
      <Stack.Screen name="Podcast" component={PodcastScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="navigation" component={CategoryNavigation} />
      <Stack.Screen name="SportsScreen" component={SportsScreen} />
      <Stack.Screen name="Business" component={BusinessScreen} />
      <Stack.Screen name="Entertainment" component={EntertainmentScreen} />
      <Stack.Screen name="Live" component={LiveScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator  screenOptions={({ route }) => ({
      headerShown: false,  // ✅ Hides the header
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = 'home';
        } else if (route.name === 'Bookmarks') {
          iconName = 'bookmark';
        } else if (route.name === 'Contact') {
          iconName = 'call';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />

      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

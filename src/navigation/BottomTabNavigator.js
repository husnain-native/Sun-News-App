import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import BookmarksScreen from '../screens/BookmarksScreen';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar, 
        tabBarShowLabel: true, // Show labels for clarity
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Bookmarks') {
            iconName = 'bookmark';
          } else if (route.name === 'Contact') {
            iconName = 'call';
          }
          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#ffffff', // White text/icons for active tab
        tabBarInactiveTintColor: '#e0e0e0', // Light gray for inactive tab
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} /> 

      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

// 🎨 **Modern & Professional Styling**
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#BF272a', // Professional news app theme (red)
    height: 60,
    paddingBottom: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
});

export default BottomTabNavigator;

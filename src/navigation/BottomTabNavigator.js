import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import BookmarksScreen from '../screens/BookmarksScreen';
import ContactScreen from '../screens/ContactScreen';
import PodcastScreen from '../screens/PodcastScreen';
import LatestNews from '../screens/LatestNews';
import { FontAwesome6 } from '@expo/vector-icons'; // Import FontAwesome6

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar, 
        tabBarShowLabel: true, 
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let IconComponent = Ionicons; // Default to Ionicons

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Podcast') {
            iconName = 'mic'; 
          } else if (route.name === 'Bookmarks') {
            iconName = 'bookmark';
          } else if (route.name === 'Contact') {
            iconName = 'call';
          } else if (route.name === 'Breaking') {
            iconName = focused ? 'bolt' : 'bolt-lightning'; // ⚡ Lightning bolt effect
            IconComponent = FontAwesome6; // Use FontAwesome6 for bolt icon
          }

          return (
            <View style={styles.iconContainer}>
              <IconComponent name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#ffffff', 
        tabBarInactiveTintColor: '#e0e0e0', 
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} /> 
      <Tab.Screen name="Podcast" component={PodcastScreen} />
      <Tab.Screen name="Breaking" component={LatestNews} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#BF272a', 
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

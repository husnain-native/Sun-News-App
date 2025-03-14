import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import BookmarksScreen from '../screens/BookmarksScreen';
import ContactScreen from '../screens/ContactScreen';
import PodcastScreen from '../screens/PodcastScreen';
import LatestNews from '../screens/LatestNews';
import { FontAwesome6 } from '@expo/vector-icons'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons

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
          let IconComponent = Ionicons; // Default icon component

          if (route.name === 'HOME') {
            iconName = 'home';
          } else if (route.name === 'PODCAST') {
            iconName = 'mic'; 
          } else if (route.name === 'SAVED') {
            iconName = 'bookmark';
          } else if (route.name === 'FOLLOW') {
            return (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account-supervisor" size={size} color={color} />
              </View>
            );
          } else if (route.name === 'BREAKING') {
            iconName = focused ? 'bolt' : 'bolt-lightning'; // ⚡ Lightning bolt effect
            IconComponent = FontAwesome6; // Use FontAwesome6 for bolt icon
          }

          return (
            <View style={styles.iconContainer}>
              <IconComponent name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#fff', 
        tabBarInactiveTintColor: '#d9cccc', 
      })}
    >
      <Tab.Screen name="HOME" component={HomeStackNavigator} /> 
      <Tab.Screen name="PODCAST" component={PodcastScreen} />
      <Tab.Screen name="BREAKING" component={LatestNews} />
      <Tab.Screen name="SAVED" component={BookmarksScreen} />
      <Tab.Screen name="FOLLOW" component={ContactScreen} />
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

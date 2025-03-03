import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import NewsDetailScreen from '../screens/NewsDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SportsScreen from '../screens/SportsScreen';
import BusinessScreen from '../screens/BusinessScreen';
import EntertainmentScreen from '../screens/EntertainmentScreen';

const Drawer = createDrawerNavigator();

const CustomHeaderTitle = () => (
  <View>
    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', fontFamily: 'Roboto-Bold'}} >Sun News</Text>
  </View>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitle: () => <CustomHeaderTitle />,  // ✅ Custom title "Sun News"
        headerStyle: { backgroundColor: '#BF272a' },   // ✅ Red background
        headerTitleAlign: 'center',                // ✅ Centered title
        headerTintColor: 'white',                  // ✅ White text color
      }}
    >
      <Drawer.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{ drawerLabel: () => null, title: '' }}
      />
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Sports" component={SportsScreen} />
      <Drawer.Screen name="Business" component={BusinessScreen} />
      <Drawer.Screen name="Entertainment" component={EntertainmentScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

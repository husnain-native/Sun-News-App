import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import NewsDetailScreen from '../screens/NewsDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SportsScreen from '../screens/SportsScreen';
import BusinessScreen from '../screens/BusinessScreen';
import EntertainmentScreen from '../screens/EntertainmentScreen';

const Drawer = createDrawerNavigator();

const CustomHeaderTitle = () => (
  <View>
    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', fontFamily: 'Roboto-Bold' }}>Sun News</Text>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
       
        <Text style={styles.drawerTitle}>Sun News</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Logout"
        onPress={() => console.log('Logout Pressed')}
        labelStyle={styles.logoutLabel}
        style={styles.logoutButton}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: () => <CustomHeaderTitle />,  // ✅ Custom title "Sun News"
        headerStyle: { backgroundColor: '#BF272a' }, // ✅ Red background
        headerTitleAlign: 'center', // ✅ Centered title
        headerTintColor: 'white', // ✅ White text color
      }}
    >
      {/* Hidden News Detail Screen (Not in Drawer) */}
      <Drawer.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{ drawerLabel: () => null, title: '' }}
      />

      {/* Main Screens */}
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Sports" component={SportsScreen} />
      <Drawer.Screen name="Business" component={BusinessScreen} />
      <Drawer.Screen name="Entertainment" component={EntertainmentScreen} />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#BF272a',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#BF272a',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  logoutLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;

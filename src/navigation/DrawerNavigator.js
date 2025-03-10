import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import NewsDetailScreen from '../screens/NewsDetailsScreen';
import SportsScreen from '../screens/SportsScreen';
import BusinessScreen from '../screens/BusinessScreen';
import EntertainmentScreen from '../screens/EntertainmentScreen';
import BottomTabNavigator from './BottomTabNavigator'; // Ensure Bottom Tabs are used

const Drawer = createDrawerNavigator();

// Custom Header with Logo
const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Image source={require('../assets/sun-logo.png')} style={styles.logo} />
    <Text style={styles.headerTitle}>SUN NEWS</Text>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Logo & App Title */}
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/sun-logo.png')} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>SUN NEWS</Text>
      </View>

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: () => <CustomHeaderTitle />,
        headerStyle: { backgroundColor: '#BF272a' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        drawerStyle: { backgroundColor: '#1E1E2D' },
        drawerActiveBackgroundColor: '#BF272a',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: '#CCCCCC',
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Sports" component={SportsScreen} />
      <Drawer.Screen name="Business" component={BusinessScreen} />
      <Drawer.Screen name="Entertainment" component={EntertainmentScreen} />
      {/* Ensure NewsDetailScreen is accessible but hidden from Drawer */}
      <Drawer.Screen 
        name="NewsDetail" 
        component={NewsDetailScreen} 
        options={{ drawerLabel: () => null, title: 'News Details' }} 
      />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  drawerLogo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 45,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Roboto-Bold',
    marginLeft: 10,
  },
});

export default DrawerNavigator;

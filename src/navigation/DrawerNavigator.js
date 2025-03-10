import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import CategoryScreen from '../screens/CategoryScreen';

const Drawer = createDrawerNavigator();
const API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories';

// Custom Header with Logo
const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Image source={require('../assets/sun-logo.png')} style={styles.logo} />
    <Text style={styles.headerTitle}>SUN NEWS</Text>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* App Header */}
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/sun-logo.png')} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>SUN NEWS</Text>
      </View>

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 20 }} />}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>Failed to load categories</Text>}

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <DrawerItem
            key={category.id}
            label={category.name}
            onPress={() => navigation.navigate('Category', { categoryId: category.id, categoryName: category.name })}
            labelStyle={styles.drawerLabel}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
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
      <Drawer.Screen name="Category" component={CategoryScreen} options={{ headerShown: true }}  />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: { flex: 1 },
  drawerHeader: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  logo: { width: 35, height: 45, resizeMode: 'contain' },
  drawerLogo: { width: 86, height: 86, resizeMode: 'contain' },
  drawerTitle: { fontSize: 40, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerTitle: { fontSize: 27, fontWeight: 'bold', color: 'white', marginTop: 8, paddingLeft: 3 },
  drawerItemsContainer: { flex: 1, paddingHorizontal: 10 },
  drawerLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  headerContainer: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginVertical: 10 },
});

export default DrawerNavigator;

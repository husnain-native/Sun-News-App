import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import CategoryScreen from '../screens/CategoryScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import CategoryNavigation from '../components/CategoryNavigation';

const Drawer = createDrawerNavigator();
const API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories?per_page=100';

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
  const [activeCategory, setActiveCategory] = useState(null);
  const navigation = useNavigation();

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    setActiveCategory(category.id);
    navigation.navigate('Category', { 
      categoryId: category.id, 
      categoryName: category.name
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/sun-logo.png')} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>SUN NEWS</Text>
      </View>

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 20 }} />}

      {/* Error Message & Retry */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load categories</Text>
          <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          onPress={() => navigation.navigate('Home')}
          labelStyle={styles.drawerLabel}
        />

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <DrawerItem
            key={category.id}
            label={category.name}
            onPress={() => handleCategoryPress(category)}
            labelStyle={[styles.drawerLabel, activeCategory === category.id && styles.activeCategoryLabel]}
            style={[activeCategory === category.id && styles.activeCategoryBackground]}
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
      <Drawer.Screen name="Category" component={CategoryScreen} />
       <Drawer.Screen name='navigation' component={CategoryNavigation}/>
      <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 27, fontWeight: 'bold', color: 'white', marginTop: 8, paddingLeft: 3 },
  drawerItemsContainer: { flex: 1, paddingHorizontal: 10 },
  drawerLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  activeCategoryLabel: { color: 'white' },
  activeCategoryBackground: {
    backgroundColor: '#BF272a',
    borderRadius: 5,
  },
  errorContainer: { alignItems: 'center', marginVertical: 10 },
  errorText: { color: 'red', textAlign: 'center' },
  retryButton: { backgroundColor: 'white', padding: 6, borderRadius: 5 },
  retryText: { color: '#BF272a', fontWeight: 'bold' },
});

export default DrawerNavigator;

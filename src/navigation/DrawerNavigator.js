import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const ENGLISH_API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories?per_page=100';
const URDU_API_URL = 'https://sunnewshd.tv/wp-json/wp/v2/categories?per_page=100';

// Custom Header with Logo and Language Toggle
const CustomHeaderTitle = ({ toggleLanguage, language }) => (
  <View style={styles.headerContainer}>
    <View style={styles.titleLogo}>
      <Image source={require('../assets/sun-logo.png')} style={styles.logo} />
      <Text style={styles.headerTitle}>SUN NEWS</Text>
    </View>
    <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
      <Text style={styles.languageText}>{language === 'en' ? 'اردو' : 'English'}</Text>
    </TouchableOpacity>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = ({ navigation, language }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    const API_URL = language === 'en' ? ENGLISH_API_URL : URDU_API_URL;

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
  }, [language]);

  const handleCategoryPress = (category) => {
    setActiveCategory(category.id);
    navigation.navigate('BottomTabs', {
      screen: 'HOME',
      params: {
        screen: 'Category',
        params: {
          categoryId: category.id,
          categoryName: category.name,
          language: language,
        }
      }
    });
  };

  const handleHomePress = () => {
    navigation.navigate('BottomTabs', {
      screen: 'HOME',
      params: {
        screen: 'Home'
      }
    });
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/sun-logo.png')} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>SUN NEWS</Text>
      </View>
      
      {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 20 }} />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load categories</Text>
          <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.drawerItemsContainer}>
        {/* Home Menu Item */}
        <DrawerItem
          label={language === 'en' ? 'Home' : 'ہوم'}
          onPress={handleHomePress}
          labelStyle={[styles.drawerLabel, { textAlign: language === 'ur' ? 'right' : 'left' }]}
        />

        {/* Categories */}
        {categories.map((category) => (
          <DrawerItem
            key={category.id}
            label={category.name}
            onPress={() => handleCategoryPress(category)}
            labelStyle={[
              styles.drawerLabel,
              { textAlign: language === 'ur' ? 'right' : 'left' },
              activeCategory === category.id && styles.activeCategoryLabel,
            ]}
            style={[activeCategory === category.id && styles.activeCategoryBackground]}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} language={language} />}
      screenOptions={{
        headerTitle: () => <CustomHeaderTitle toggleLanguage={toggleLanguage} language={language} />,
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
      <Drawer.Screen name="BottomTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

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
  logo: { width: 35, height: 45, resizeMode: 'contain', borderWidth: 1, borderColor: '#fff' },
  drawerLogo: { width: 86, height: 86, resizeMode: 'contain' },
  drawerTitle: { fontSize: 40, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleLogo: { flexDirection: 'row', marginLeft: 60 },
  headerTitle: { fontSize: 27, fontWeight: 'bold', color: 'white', marginLeft: 5 },
  languageButton: {
    padding: 5,
    backgroundColor: '#a82729',
    color: '#fff',
    marginStart: 30,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#d6b6b7',
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
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
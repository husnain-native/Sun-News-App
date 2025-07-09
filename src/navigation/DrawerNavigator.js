import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const ENGLISH_API_URL = 'https://sunnewshd.tv/english/index.php?rest_route=/wp/v2/categories&per_page=100';
const URDU_API_URL = 'https://sunnewshd.tv/index.php?rest_route=/wp/v2/categories&per_page=100';

const CustomHeaderTitle = ({ toggleLanguage, language }) => (
  <View style={styles.headerContainer}>
    <View style={styles.titleLogo}>
      <Image source={require('../assets/sun-logo.png')} style={styles.logo} />
      <Text style={styles.headerTitle}>SUN NEWS</Text>
    </View>
    <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
      <Text style={styles.languageText}>{language === 'en' ? 'پنجابی ' : 'English'}</Text>
    </TouchableOpacity>
  </View>
);

const CustomDrawerContent = ({ navigation, language }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { activeCategory, setActiveCategory } = useLanguage();

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    const API_URL = language === 'en' ? ENGLISH_API_URL : URDU_API_URL;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network Issue! Failed to fetch categories');
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
    setActiveCategory(null);
    navigation.navigate('BottomTabs', {
      screen: 'HOME',
      params: {
        screen: 'Home'
      }
    });
  };

  return (
    <DrawerContentScrollView 
      contentContainerStyle={styles.drawerContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      overScrollMode="always"
    >
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/sun-logo.png')} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>SUN NEWS</Text>
      </View>
      
      {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 20 }} />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {language === 'en' ? 'Networt issue!Failed to load categories' : 'کیٹیگریاں لوڈ کرنے میں ناکامی'}
          </Text>
          <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
            <Text style={styles.retryText}>
              {language === 'en' ? 'Retry' : 'دوبارہ کوشش کریں'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label={() => (
            <Text style={[styles.drawerLabel(language), { textAlign: language === 'ur' ? 'right' : 'left' }]}>
              {language === 'en' ? 'Home' : 'ہوم'}
            </Text>
          )}
          onPress={handleHomePress}
          labelStyle={styles.drawerLabel(language)}
          style={!activeCategory && styles.activeCategoryBackground}
        />

        {categories.map((category) => (
          <DrawerItem
            key={category.id}
            label={() => (
              <Text style={[styles.drawerLabel(language), { textAlign: language === 'ur' ? 'right' : 'left' }]}>
                {category.name}
              </Text>
            )}
            onPress={() => handleCategoryPress(category)}
            labelStyle={[
              styles.drawerLabel(language),
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
  const navigation = useNavigation();
  
  // Force LTR layout for drawer
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);

  const handleLanguageToggle = () => {
    toggleLanguage();
    navigation.navigate('BottomTabs', {
      screen: 'HOME',
      params: {
        screen: 'Home'
      }
    });
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} language={language} />}
      screenOptions={{
        headerTitle: () => <CustomHeaderTitle toggleLanguage={handleLanguageToggle} language={language} />,
        headerStyle: { backgroundColor: '#BF272a' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        drawerStyle: {
          backgroundColor: '#1E1E2D',
          width: '85%',
        },
        drawerPosition: 'left', // Dynamic drawer position based on language
        drawerType: 'front',
        overlayColor: 'transparent',
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
        drawerActiveBackgroundColor: '#BF272a',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: '#CCCCCC',
        drawerLabelStyle: { 
          fontSize: 16, 
          fontWeight: 'bold',
          flexDirection: language === 'ur' ? 'row-reverse' : 'row',
        },
      }}
    >
      <Drawer.Screen name="BottomTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  drawerHeader: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  logo: { 
    width: 35, 
    height: 45, 
    resizeMode: 'contain', 
    borderWidth: 1, 
    borderColor: '#fff' 
  },
  drawerLogo: { 
    width: 86, 
    height: 86, 
    resizeMode: 'contain' 
  },
  drawerTitle: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: 'white', 
    marginTop: 8 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleLogo: { 
    flexDirection: 'row', 
    marginLeft: 60 
  },
  headerTitle: { 
    fontSize: 27, 
    fontWeight: 'bold', 
    color: 'white', 
    marginLeft: 5 
  },
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
  languageText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 20 
  },
  drawerItemsContainer: { 
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  drawerLabel: (language) => ({ 
    fontSize: 19, 
    fontWeight: 'bold', 
    color: 'white',
    marginLeft: 0,
    paddingLeft: 0,
  }),
  activeCategoryLabel: { 
    color: 'white' 
  },
  activeCategoryBackground: {
    backgroundColor: '#BF272a',
    borderRadius: 5,
  },
  errorContainer: { 
    alignItems: 'center', 
    marginVertical: 10 
  },
  errorText: { 
    color: 'red', 
    textAlign: 'center' 
  },
  retryButton: { 
    backgroundColor: 'white', 
    padding: 6, 
    borderRadius: 5,
    marginTop: 5 
  },
  retryText: { 
    color: '#BF272a', 
    fontWeight: 'bold' 
  },
});

export default DrawerNavigator;
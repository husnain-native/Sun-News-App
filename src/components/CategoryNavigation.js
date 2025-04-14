import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Linking, I18nManager } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import LiveBadge from './LiveBadge';

// API URLs for categories
const ENGLISH_API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories?per_page=100';
const URDU_API_URL = 'https://sunnewshd.tv/wp-json/wp/v2/categories?per_page=100';

const CategoryNavigation = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Force RTL layout for Urdu
  React.useEffect(() => {
    I18nManager.forceRTL(language === 'ur');
    return () => I18nManager.forceRTL(false);
  }, [language]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(false);
      const API_URL = language === 'en' ? ENGLISH_API_URL : URDU_API_URL;

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        let data = await response.json();

        // Add "Home" manually at the end for Urdu
        const homeCategory = language === 'en' 
          ? { id: 'home', name: 'Home' } 
          : { id: 'home', name: 'ہوم' };
        
        if (language === 'ur') {
          data = data.reverse();
          setCategories([...data, homeCategory]);
        } else {
          setCategories([homeCategory, ...data]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  const { activeCategory, setActiveCategory } = useLanguage();
  const navigationState = useNavigationState(state => state);
  
  const getCurrentCategory = () => {
    let route = navigationState.routes[navigationState.index];
    while (route.state?.index !== undefined) {
      route = route.state.routes[route.state.index];
    }
    
    const categoryName = route.params?.params?.categoryName || 
                         route.params?.categoryName || 
                         route.state?.routes?.[route.state?.index]?.params?.categoryName;
    if (categoryName) return categoryName;
    
    return language === 'en' ? 'Home' : 'ہوم';
  };

  const currentActiveCategory = getCurrentCategory();

  useEffect(() => {
    if (currentActiveCategory) {
      const category = categories.find(cat => 
        cat.name === currentActiveCategory || 
        (cat.id === 'home' && (currentActiveCategory === 'Home' || currentActiveCategory === 'ہوم'))
      );
      setActiveCategory(category?.id || null);
    }
  }, [currentActiveCategory, categories]);

  useEffect(() => {
    if (categories.length > 0 && scrollViewRef.current) {
      const activeIndex = categories.findIndex(cat => 
        cat.name === currentActiveCategory || (cat.id === 'home' && currentActiveCategory === 'ہوم')
      );
      if (activeIndex !== -1) {
        scrollViewRef.current.scrollTo({
          x: activeIndex * 120,
          animated: true,
        });
      }
    }
  }, [categories, currentActiveCategory]);

  const handleCategoryPress = (category) => {
    setActiveCategory(category.id === 'home' ? null : category.id);
    if (category.id === 'home') {
      navigation.navigate('BottomTabs', {
        screen: 'HOME',
        params: {
          screen: 'Home'
        }
      });
    } else {
      navigation.navigate('BottomTabs', {
        screen: 'HOME',
        params: {
          screen: 'Category',
          params: {
            categoryId: category.id,
            categoryName: category.name
          }
        }
      });
    }
  };

  const handleLivePress = async () => {
    const youtubeUrl = 'https://www.youtube.com/@SunNewsOfficial/streams';
    try {
      await Linking.openURL(youtubeUrl);
    } catch (error) {
      console.error('Error opening YouTube:', error);
    }
  };

  return (
    <View>
      <View style={[styles.container, language === 'ur' && styles.rtlContainer]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.categoryContainer, language === 'ur' && styles.rtlCategoryContainer]}
          inverted={language === 'ur'}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#BF272a" style={{ marginHorizontal: 10 }} />
          ) : error ? (
            <Text style={styles.errorText}>
              {language === 'en' ? 'Failed to load categories' : 'کیٹیگریاں لوڈ کرنے میں ناکامی'}
            </Text>
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  (activeCategory === category.id || (category.id === 'home' && !activeCategory)) && styles.activeButton,
                  language === 'ur' && styles.rtlCategoryButton,
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (activeCategory === category.id || (category.id === 'home' && !activeCategory)) && styles.activeButtonText,
                    language === 'ur' && styles.rtlText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity onPress={handleLivePress}>
          <LiveBadge />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  rtlCategoryContainer: {
    direction: 'row-reverse',
    alignItems: 'flex-end',
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  rtlCategoryButton: {
    marginRight: 0,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BF272a',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#BF272a',
  },
  activeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b0505',
  },
  bottomLine: {
    height: 1.5,
    backgroundColor: '#BF272a',
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});

export default CategoryNavigation;

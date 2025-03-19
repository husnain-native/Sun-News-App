import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Language Context
import LiveBadge from './LiveBadge';

// API URLs for categories
const ENGLISH_API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories?per_page=100';
const URDU_API_URL = 'https://sunnewshd.tv/wp-json/wp/v2/categories?per_page=100';

const CategoryNavigation = () => {
  const { language } = useLanguage(); // ✅ Get language from context
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); // ✅ Ref for ScrollView
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(false);
      const API_URL = language === 'en' ? ENGLISH_API_URL : URDU_API_URL;

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();

        // Add "Home" manually at the beginning
        const homeCategory = language === 'en' ? { id: 'home', name: 'Home' } : { id: 'home', name: 'ہوم' };
        setCategories([homeCategory, ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]); // ✅ Re-fetch when language changes

  // Get current active category
  const activeCategory = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.params?.categoryName || (language === 'en' ? 'Home' : 'ہوم');
  });

  // Scroll to active category
  useEffect(() => {
    if (categories.length > 0 && scrollViewRef.current) {
      const activeIndex = categories.findIndex(cat => cat.name === activeCategory);

      if (activeIndex !== -1) {
        // ✅ Scroll to the active category
        scrollViewRef.current.scrollTo({
          x: activeIndex * 120, // Adjust scroll position based on category width
          animated: true,
        });
      }
    }
  }, [categories, activeCategory]);

  const handleCategoryPress = (category) => {
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

  return (
    <View>
      {/* Category List */}
      <View style={[styles.container, language === 'ur' && styles.rtlContainer]}>
        <ScrollView
          ref={scrollViewRef} // ✅ Attach ref to ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoryContainer,
            language === 'ur' && styles.rtlCategoryContainer, // ✅ RTL for Urdu
          ]}
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
                  activeCategory === category.name && styles.activeButton,
                  language === 'ur' && styles.rtlCategoryButton, // ✅ RTL for Urdu
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    activeCategory === category.name && styles.activeButtonText,
                    language === 'ur' && styles.rtlText, // ✅ RTL for Urdu
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Live Badge */}
        <TouchableOpacity onPress={() => navigation.navigate('Live')}>
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
    flexDirection: 'row', // ✅ RTL for Urdu
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  rtlCategoryContainer: {
    flexDirection: 'row', // ✅ RTL scrolling for Urdu
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  rtlCategoryButton: {
    marginRight: 0,
    marginLeft: 10, // ✅ Adjust spacing for RTL
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BF272a',
  },
  rtlText: {
    textAlign: 'right', // ✅ Align text to right for Urdu
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
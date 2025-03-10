import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import LiveBadge from './LiveBadge';

const API_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/categories';

const CategoryNavigation = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();

        // Add "Home" manually at the beginning
        setCategories([{ id: 'home', name: 'Home' }, ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get current active category
  const activeCategory = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.params?.categoryName || 'Home';
  });

  const handleCategoryPress = (category) => {
    if (category.id === 'home') {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Category', { categoryId: category.id, categoryName: category.name });
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#BF272a" style={{ marginHorizontal: 10 }} />
          ) : error ? (
            <Text style={styles.errorText}>Failed to load categories</Text>
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, activeCategory === category.name && styles.activeButton]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={[styles.buttonText, activeCategory === category.name && styles.activeButtonText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity onPress={() => navigation.navigate('Live')}>
          <LiveBadge />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 5, paddingHorizontal: 15 },
  categoryContainer: { flexDirection: 'row', alignItems: 'center', paddingRight: 10 },
  categoryButton: { backgroundColor: '#fff', paddingVertical: 5, paddingHorizontal: 14, marginRight: 10 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#BF272a' },
  activeButton: { borderBottomWidth: 2, borderBottomColor: '#BF272a' },
  activeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#3b0505' },
  bottomLine: { height: 1.5, backgroundColor: '#BF272a', width: '100%' },
  errorText: { color: 'red', textAlign: 'center', marginHorizontal: 10 },
});

export default CategoryNavigation;

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import LiveBadge from './LiveBadge';

const CategoryNavigation = () => {
  const navigation = useNavigation();

  // Get the current active route name
  const activeCategory = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.name; // Get the currently active screen name
  });

  const categories = ['Home', 'Business', 'Entertainment', 'Sports', 'Technology', 'Health', 'World', 'Science'];

  const handleCategoryPress = (category) => {
    navigation.navigate(category);
  };

  return (
    <View>
      {/* Category Navigation Bar */}
      <View style={styles.container}>
        {/* Horizontally Scrollable Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, activeCategory === category && styles.activeButton]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={[styles.buttonText, activeCategory === category && styles.activeButtonText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Live Badge Component */}
        <TouchableOpacity onPress={() => navigation.navigate('Live')}>
          <LiveBadge />
        </TouchableOpacity>
      </View>

      {/* Horizontal Line at Bottom */}
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
    paddingHorizontal: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BF272a',
  },
  activeButtonText: {
    fontSize: 18, // Increased size for active category
    fontWeight: 'bold',
    color: '#3b0505',
  },
  bottomLine: {
    height: 1.5, // Thickness of the line
    backgroundColor: '#bf272a',
    width: '100%',
  },
});

export default CategoryNavigation;

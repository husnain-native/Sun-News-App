import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryName } = route.params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=${categoryId}&_embed`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryId]);

  const renderNewsItem = ({ item }) => {
    const title = item.title.rendered;
    const imageUrl =
    typeof item._embedded?.['wp:featuredmedia']?.[0]?.source_url === 'string'
      ? { uri: item._embedded['wp:featuredmedia'][0].source_url }
      : require('../assets/notfound.png');
  
  
    const date = new Date(item.date).toDateString();

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('NewsDetails', { postId: item.id })}
      >
        <Image source={imageUrl} style={styles.cardImage} />

        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.sourceInfo}>
            <Text style={styles.cardSubtitle}>{date}</Text>
          </View>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton}>
              <Bookmark size={20} color="#BF272a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Share2 size={20} color="#BF272a" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <MaterialIcons name="category" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>{categoryName.toUpperCase()}</Text>
            <View style={styles.underline} />
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    paddingHorizontal: 15, 
    paddingTop: 10 
  },
  titleContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginStart: 5, padding: 10, color: '#333' },
  underline: { height: 4, backgroundColor: '#BF272a', width: '60%', marginTop: -7, marginStart: 14, borderRadius: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  sourceInfo: {
    flexDirection: 'column',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginLeft: 10,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 },
});

export default CategoryScreen;

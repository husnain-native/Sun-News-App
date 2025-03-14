import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Dimensions, Share, Platform, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Bookmark } from 'lucide-react-native';
import { MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const CategoryScreen = () => {
  const route = useRoute();
  const { categoryId, categoryName , navigation} = route.params || {};

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (categoryId !== undefined && categoryId !== null) {
          const response = await fetch(
            `https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=${categoryId}&_embed`
          );
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    loadBookmarkedPosts();
  }, [categoryId]);

  const loadBookmarkedPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('bookmarkedPosts');
      if (savedPosts) {
        setBookmarkedPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const toggleBookmark = async (post) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === post.id);
    if (index !== -1) {
      updatedBookmarks.splice(index, 1);
    } else {
      updatedBookmarks.push(post);
    }
    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

  const sharePost = async (title, link) => {
    try {
      await Share.share({
        message: `${link}`
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };
  

  const renderNewsItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const date = new Date(item.date).toDateString();
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {
            title: item.title.rendered,
            content: item.content.rendered,
            description: item.excerpt.rendered,
            image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            source: { name: 'Sun News' },
            publishedAt: item.date
          }
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.sourceInfo}>
            <Text style={styles.cardSubtitle}>{date}</Text>
          </View>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleBookmark(item)}>
              <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => sharePost(title, item.link, imageUrl)}>
              <MaterialCommunityIcons name="share-variant-outline" size={22} color="#bf272a" />
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
          {/* Back Button Added Here */}
          <MaterialIcons name="category" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>{categoryName?.toUpperCase()}</Text>
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
  categoryNavContainer: { width: Dimensions.get('window').width, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 15, paddingTop: 10 },
  titleContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginStart: 5, padding: 10, color: '#333' },
  underline: { height: 4, backgroundColor: '#BF272a', width: '60%', marginTop: -7, marginStart: 14, borderRadius: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  backButton: { padding: 1, marginRight: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, paddingBottom: 10, elevation: 3, overflow: 'hidden' },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  iconGroup: { flexDirection: 'row' },
  iconButton: { padding: 6, borderRadius: 8, backgroundColor: '#EDEDED', marginLeft: 10 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 }
});

export default CategoryScreen;

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Dimensions, Share, Alert, RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Bookmark } from 'lucide-react-native';
import { MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Extract category and language params
  const { categoryId, categoryName, language } = route.params || { language: 'en' }; // Default to English

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      if (categoryId !== undefined && categoryId !== null) {
        const API_URL =
          language === 'en'
          ? `https://sunnewshd.tv/wp-json/wp/v2/posts?categories=${categoryId}&_embed`
          : `https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=${categoryId}&_embed`

        // console.log('Current Language:', language);
        // console.log('API URL:', API_URL);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        // console.log('API Response:', data);

        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load bookmarked posts from AsyncStorage
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

  // Toggle bookmark function
  const toggleBookmark = async (post) => {
    try {
      setBookmarkedPosts((prevBookmarks) => {
        const updatedBookmarks = prevBookmarks.some(item => item.id === post.id)
          ? prevBookmarks.filter(item => item.id !== post.id)
          : [...prevBookmarks, post];

        AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks)).catch((err) => {
          console.error('Error saving bookmarks:', err);
        });
        return updatedBookmarks;
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Share post function
  const sharePost = async (title, link) => {
    try {
      const message = `${link}`;
      await Share.share({ message, url: link });
    } catch (error) {
      console.error('Error sharing post:', error.message);
      Alert.alert("شیئرنگ ناکام", "پوسٹ شیئر کرنے میں مسئلہ درپیش آیا۔");
    }
  };

  // Handle Pull-to-Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  // Fetch posts and load bookmarks when categoryId or language changes
  useEffect(() => {
    fetchPosts();
    loadBookmarkedPosts();
  }, [categoryId, language]);

  // Render individual news item
  const renderNewsItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';
    const date = item.date ? new Date(item.date).toDateString() : 'Date not available'; // Fallback if date is missing
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
        <View style={[styles.cardTextContainer]}>
          <Text style={[styles.cardTitle, language === 'ur' && styles.urduText]} 
            numberOfLines={3}
          >
            {title}
          </Text>
        </View>
        <View style={[styles.iconRow, language === 'ur' && styles.urduIconRow]}>
          {language === 'ur' ? (
            <>
              <View style={styles.iconGroup}>
                <TouchableOpacity style={styles.iconButton} onPress={() => toggleBookmark(item)}>
                  <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => sharePost(title, item.link)}>
                  <MaterialCommunityIcons name="share-variant-outline" size={22} color="#bf272a" />
                </TouchableOpacity>
              </View>
              <View style={styles.sourceInfo}>
                <Text style={[styles.cardSubtitle, language === 'ur' && styles.urduText]}>
                  {date}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.sourceInfo}>
                <Text style={[styles.cardSubtitle, language === 'ur' && styles.urduText]}>
                  {date}
                </Text>
              </View>
              <View style={styles.iconGroup}>
                <TouchableOpacity style={styles.iconButton} onPress={() => toggleBookmark(item)}>
                  <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => sharePost(title, item.link)}>
                  <MaterialCommunityIcons name="share-variant-outline" size={22} color="#bf272a" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>خرابی: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <MaterialIcons name="category" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text 
              style={[
                styles.sectionTitle, 
                language === 'ur' && styles.urduText
              ]}
            >
              {categoryName ? categoryName.toUpperCase() : 'CATEGORY'}
            </Text>
            <View style={styles.underline} />
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: { width: Dimensions.get('window').width, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 10, paddingTop: 10 },
  titleContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 10, color: '#333' },
  underline: { height: 4, backgroundColor: '#BF272a', width: '60%', marginTop: -7, borderRadius: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  backButton: { padding: 5, marginRight: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { flex: 1, flexDirection: 'space-between', padding: 10, textAlign: 'right' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  urduText: {
    textAlign: 'right',
    color: '#000'
    
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 },
  iconRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10 
  },
  urduIconRow: { 
    flexDirection: 'row-reverse', // Reverse layout for Urdu mode
  },
  sourceInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 15,
    marginBottom: 15
  },
  iconGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 15,
    marginBottom: 15
  },
  iconButton: { 
    marginLeft: 10 // Adds space between icons
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'left' 
  },
  urduContainer: {
    alignItems: 'flex-start',
  }
});

export default CategoryScreen;
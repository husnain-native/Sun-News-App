import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Share, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark } from 'lucide-react-native';
import { decode } from 'html-entities';

const BusinessSection = ({ navigation }) => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchNews();
    loadBookmarkedPosts();
  }, []);

  // Fetch business news
  const fetchNews = async () => {
    try {
      const response = await axios.get(
        'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=19&_embed'
      );
      setBusinessNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load saved bookmarks
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

  // Toggle bookmark
  const toggleBookmark = async (newsItem) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === newsItem.id);

    if (index !== -1) {
      updatedBookmarks.splice(index, 1);  // Remove if already bookmarked
    } else {
      updatedBookmarks.push(newsItem);  // Add if not bookmarked
    }

    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

  // Share post
  const sharePost = async (title, link) => {
    try {
      const message = `${link}`;
      await Share.share({ message, url: link, title });
    } catch (error) {
      console.error('Error sharing news:', error.message);
      Alert.alert("Sharing Failed", "There was an error sharing the news.");
    }
  };

  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {
            id: item.id,
            title: decode(item.title.rendered),
            content: decode(item.content.rendered),
            description: decode(item.excerpt.rendered),
            image: imageUrl,
            source: { name: 'Sun News' },
            publishedAt: item.date
          }
        })}
      >
        <Image 
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
          style={styles.cardImage} 
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={3}>{decode(item.title.rendered)}</Text>
          <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => toggleBookmark(item)}>
            <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity onPress={() => sharePost(decode(item.title.rendered), item.link)} style={styles.iconButton}>
            <MaterialCommunityIcons name="share-variant-outline" size={22} color="#bf272a" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#BF272a" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.categoryContainer}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name='business' size={34} color='#BF272a' />
            <Text style={styles.sectionTitle}>BUSINESS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('BusinessScreen')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={businessNews.slice(0, 8)}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          removeClippedSubviews={true} 
          getItemLayout={(data, index) => ({
            length: 180,
            offset: 180 * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, paddingLeft: 10 },
  categoryContainer: { marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingLeft: 8, color: '#333' },
  seeAll: {  fontSize: 14, color: '#bf272a', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, marginRight: 10 },
  card: { backgroundColor: '#e3e1e1', borderRadius: 5, marginRight: 10, paddingBottom: 10, elevation: 3, width: 180 },
  cardImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  iconRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 2 },
  iconButton: { paddingHorizontal: 10, borderRadius: 8 }
});

export default BusinessSection;

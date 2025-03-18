import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Dimensions, Share, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bookmark } from 'lucide-react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Language Context

const LatestNews = () => {
  const navigation = useNavigation();
  const { language } = useLanguage(); // ✅ Get the current language from context
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  // API URLs for English and Urdu
  const ENGLISH_API_URL = `https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=24&_embed`; // Replace with the correct category ID for English
  const URDU_API_URL = `https://sunnewshd.tv/wp-json/wp/v2/posts?categories=33&_embed`; // Replace with the correct category ID for Urdu

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const API_URL = language === 'en' ? ENGLISH_API_URL : URDU_API_URL; // ✅ Use the correct API URL based on language
        const response = await fetch(API_URL);
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
    loadBookmarkedPosts();
  }, [language]); // ✅ Re-fetch when language changes

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

  const toggleBookmark = async (podcast) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === podcast.id);
    if (index !== -1) {
      updatedBookmarks.splice(index, 1);
    } else {
      updatedBookmarks.push(podcast);
    }
    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

  const sharePost = async (title, link) => {
    try {
      const message = `${title}\nListen here: ${link}`;
      await Share.share({ message, url: link, title });
    } catch (error) {
      console.error('Error sharing podcast:', error.message);
      Alert.alert("Sharing Failed", "There was an error sharing the podcast.");
    }
  };

  const renderNewsItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const date = new Date(item.date).toDateString();
    const isBookmarked = bookmarkedPosts.some(podcast => podcast.id === item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {  // Correct parameter name
            title: item.title.rendered,
            content: item.content.rendered,
            image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            publishedAt: item.date
          }
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, language === 'ur' && styles.urduTitle]} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.iconRow}>
          <Text style={styles.cardSubtitle}>{date}</Text>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleBookmark(item)}>
              <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => sharePost(title, item.link)}>
              <Feather name="share" size={22} color="#333" />
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
        <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
          <FontAwesome6 name="bolt" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text style={[styles.sectionTitle, language === 'ur' && styles.urduSectionTitle]}>
              {language === 'ur' ? 'بریکنگ نیوز' : 'Breaking News'}
            </Text>
            <View style={styles.underline} />
          </View>
        </View>
        <FlatList
          data={podcasts}
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 10, color: '#333' },
  urduSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    color: '#333',
    textAlign: 'right', // ✅ Align text to right for Urdu
  },
  underline: { height: 4, backgroundColor: '#BF272a', width: '70%', marginTop: -6, borderRadius: 100, marginStart: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, paddingBottom: 10, elevation: 3 },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  urduTitle: { textAlign: 'right' }, // ✅ Align text to right for Urdu
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  iconGroup: { flexDirection: 'row' },
  iconButton: { padding: 6, borderRadius: 8, backgroundColor: '#EDEDED', marginLeft: 10 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 }
});

export default LatestNews;
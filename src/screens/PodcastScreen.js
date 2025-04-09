import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, Share, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bookmark } from 'lucide-react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext'; // Import Language Context

const PodcastScreen = () => {
  const navigation = useNavigation();
  const { language } = useLanguage(); // Get the current language from context
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchPodcasts();
    loadBookmarkedPosts();
  }, [language]); // Re-fetch when language changes

  // Fetch podcasts based on selected language
  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=50&_embed' // English API
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=1&_embed'; // Urdu API

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
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
  const toggleBookmark = async (podcast) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === podcast.id);
    
    if (index !== -1) {
      updatedBookmarks.splice(index, 1); // Remove if already bookmarked
    } else {
      updatedBookmarks.push(podcast); // Add if not bookmarked
    }

    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };
 
  const sharePost = async (title, link) => {
    try {
      await Share.share({ message: `${link}` });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const renderPodcastItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';
    const date = item.date ? new Date(item.date).toDateString() : 'Date not available';
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

    // Check for both video URL types
    const videoUrl = item.tie_video_url || item.tic_video_url;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BottomTabs', {
          screen: 'HOME',
          params: {
            screen: 'NewsDetails',
            params: {
              news: {
                title: item.title.rendered,
                content: item.content.rendered,
                description: item.excerpt.rendered,
                image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
                source: { name: 'Sun News' },
                publishedAt: item.date,
                videoUrl: videoUrl // Pass the video URL if present
              }
            }
          }
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, language === 'ur' && styles.urduText]} numberOfLines={3}>
            {title}
          </Text>
        </View>
        <View style={[styles.iconRow, language === 'ur' && styles.urduIconRow]}>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons name="calendar" size={24} color="#bf272a" style={{ marginEnd: 5 }} />
            <Text style={styles.cardSubtitle}>{date}</Text>
          </View>
          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.iconButton}>
              <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sharePost(title, item.link)} style={styles.iconButton}>
              <MaterialCommunityIcons name="share-variant-outline" size={20} color="#bf272a" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#BF272a" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>
      <View style={styles.container}>
        <View style={[styles.headerRow, language === 'ur' && styles.rtlHeaderRow]}>
          <FontAwesome name="microphone" size={34} color="#BF272a" />
          <View style={[styles.titleContainer, language === 'ur' && styles.rtlTitleContainer]}>
            <Text style={styles.sectionTitle}>{language === 'ur' ? "پوڈکاسٹ" : "PODCAST"}</Text>
            <View style={styles.underline} />
          </View>
        </View>
        <FlatList
          data={podcasts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPodcastItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: { width: Dimensions.get('window').width, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 15, paddingTop: 10 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  rtlHeaderRow: {
    flexDirection: 'row-reverse', // Reverse the direction for Urdu
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  rtlTitleContainer: {
    alignItems: 'flex-end', // Align text to the right for Urdu
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    color: '#333'
  },
  underline: {
    height: 4,
    backgroundColor: '#BF272a',
    width: '70%',
    marginTop: -7,
    borderRadius: 100,
    marginStart: 8
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingBottom: 10,
    elevation: 3
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  cardTextContainer: {
    padding: 12
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },
  urduTitle: {
    textAlign: 'right', // Align text to the right for Urdu
    fontFamily: 'NotoNastaliqUrdu', // Use a professional Urdu font
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EDEDED',
    marginLeft: 10
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconGroup: { flexDirection: 'row' },
  urduText: {
    textAlign: 'right', // Align text to the right for Urdu
  },
  urduIconRow: {
    flexDirection: 'row-reverse', // Reverse the direction for Urdu
  },
});

export default PodcastScreen;
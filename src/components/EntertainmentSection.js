import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Share, Alert, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';
import { useLanguage } from '../context/LanguageContext';
import RNRestart from 'react-native-restart';

const EntertainmentSection = ({ navigation }) => {
  const { language } = useLanguage();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntertainmentNews();
    loadBookmarkedPosts();
  }, [language]);

  const fetchEntertainmentNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=26&_embed'
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=37&_embed';

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(language === 'en' ? 'Connection Failed' : 'کنکشن ناکام');
      }
      const data = await response.json();
      setEntertainmentNews(data);
    } catch (error) {
      console.error('Error fetching entertainment news:', error);
      setError(<Text style={color='#bf272a'}>Connection Failed!</Text>);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedPosts');
      let existingBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      
      const isBookmarked = existingBookmarks.some(item => item.id === post.id);
      
      let updatedBookmarks;
      if (isBookmarked) {
        updatedBookmarks = existingBookmarks.filter(item => item.id !== post.id);
      } else {
        updatedBookmarks = [...existingBookmarks, post];
      }
      
      await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
      setBookmarkedPosts(updatedBookmarks);
    } catch (error) {
      console.error('Error saving bookmark:', error);
      Alert.alert(
        language === 'en' ? "Error" : "خرابی",
        language === 'en' ? "Failed to save bookmark" : "بک مارک محفوظ کرنے میں ناکامی"
      );
    }
  };

  const sharePost = async (newsItem) => {
    try {
      await Share.share({
        message: `${decode(newsItem.title.rendered)}\n\n${newsItem.link}`,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert(
        language === 'en' ? "Sharing Failed" : "شیئرنگ ناکام",
        language === 'en' 
          ? "There was a problem sharing the post." 
          : "پوسٹ شیئر کرنے میں مسئلہ درپیش آیا۔"
      );
    }
  };

  const handleRestart = async () => {
    try {
      await RNRestart.Restart();
    } catch (restartError) {
      Alert.alert(
        language === 'en' ? 'Restart Failed' : 'ری اسٹارٹ ناکام',
        language === 'en' 
          ? 'Please manually close and reopen the app' 
          : 'براہ کرم دستی طور پر ایپ بند کریں اور دوبارہ کھولیں'
      );
    }
  };

  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const isBookmarked = bookmarkedPosts.some(b => b.id === item.id);

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
        <View style={styles.row}>
          <Image 
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
            style={styles.cardImage} 
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, language === 'ur' && styles.urduTitle]} numberOfLines={2}>
              {decode(item.title.rendered)}
            </Text>
            <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => toggleBookmark(item)}>
                <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} fill={isBookmarked ? "#BF272a" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sharePost(item)}>
                <Share2 size={20} color="#bf272a" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && entertainmentNews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF272a" />
      </View>
    );
  }

  if (error && entertainmentNews.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Image
          source={require('../assets/new.jpg')}
          style={styles.errorImage}
          accessibilityLabel="Error"
        />
        <Text style={styles.errorText}>
          {error || (language === 'en' 
            ? 'Failed to load entertainment news' 
            : 'تفریحی خبریں لوڈ کرنے میں ناکامی')}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRestart}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>
                   {language === 'ur' ? 'ری فریش ' : 'Refresh'}
                 </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Only show content if we have data */}
      {entertainmentNews.length > 0 && (
        <>
          {/* Header Row */}
          <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: language === 'ur' ? 'row-reverse' : 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons 
                name="movie-open" 
                size={40} 
                color="#BF272a" 
                style={language === 'ur' ? { marginRight: 10 } : { marginLeft: 10 }}
              />
              <Text style={[styles.sectionTitle, language === 'ur' && styles.urduSectionTitle]}>
                {language === 'ur' ? "تفریح" : "ENTERTAINMENT"}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('BottomTabs', {
                screen: 'HOME',
                params: {
                  screen: 'Entertainment'
                }
              })}
              style={language === 'ur' ? { marginLeft: 10 } : null}
            >
              <Text style={styles.seeAll}>
                {language === 'ur' ? "مزید دیکھیں" : "See All"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* News List */}
          <FlatList
            data={entertainmentNews.slice(0, 3)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNewsItem}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20, 
    marginHorizontal: 10 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15, 
    marginTop: 25 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#BF272a', 
    marginLeft: 10 
  },
  urduSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BF272a',
    textAlign: 'right',
    marginRight: 10,
  },
  seeAll: { 
    fontSize: 14, 
    color: '#bf272a', 
    fontWeight: 'bold', 
    backgroundColor: "#d4d6d9", 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    marginRight: 7 
  },
  card: { 
    backgroundColor: '#f5f5f5', 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10, 
    flexDirection: 'column',
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  cardImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    marginRight: 10 
  },
  cardContent: { 
    flex: 1 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  urduTitle: {
    textAlign: 'right'
  },
  cardSubtitle: { 
    fontSize: 12, 
    color: 'gray', 
    marginTop: 3 
  },
  iconRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 15 
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#bf272a',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#BF272a',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EntertainmentSection;
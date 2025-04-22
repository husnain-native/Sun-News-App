import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Dimensions, Share, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bookmark } from 'lucide-react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import RNRestart from 'react-native-restart';
import CategoryNavigation from '../components/CategoryNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

const LatestNews = () => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchPodcasts();
    loadBookmarkedPosts();
  }, [language]);

  const fetchPodcasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=24&_embed'
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=33&_embed';

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(language === 'en' 
          ? 'Failed to load latest news' 
          : 'تازہ ترین خبریں لوڈ کرنے میں ناکامی');
      }
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Error fetching news:', error);
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

  const toggleBookmark = async (podcast) => {
    try {
      const updatedBookmarks = bookmarkedPosts.some(item => item.id === podcast.id)
        ? bookmarkedPosts.filter(item => item.id !== podcast.id)
        : [...bookmarkedPosts, podcast];

      setBookmarkedPosts(updatedBookmarks);
      await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const sharePost = async (title, link) => {
    try {
      await Share.share({ message: link });
    } catch (error) {
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
    const title = item.title?.rendered || (language === 'en' ? 'No Title' : 'کوئی عنوان نہیں');
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';
    const date = item.date ? new Date(item.date).toDateString() : (language === 'en' ? 'Date not available' : 'تاریخ دستیاب نہیں');
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

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
                publishedAt: item.date
              },
              fromScreen: 'BREAKING'
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF272a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Image
          source={require('../assets/new.jpg')}
          style={styles.errorImage}
          accessibilityLabel="Error"
        />
        <Text style={styles.errorText}>
          {error || (language === 'en' 
            ? 'Network Failed' 
            : 'نیٹورک ناکام')}
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
    <View style={{ flex: 1 }}>
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>
      <View style={styles.container}>
        <View style={[styles.headerRow, language === 'ur' && styles.rtlHeaderRow]}>
          <FontAwesome name="bolt" size={34} color="#BF272a" />
          <View style={[styles.titleContainer, language === 'ur' && styles.rtlTitleContainer]}>
            <Text style={styles.sectionTitle}>{language === 'ur' ? "بریکنگ نیوز" : "BREAKING"}</Text>
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
  categoryNavContainer: { 
    width: Dimensions.get('window').width, 
    backgroundColor: '#fff' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    paddingHorizontal: 15, 
    paddingTop: 10 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  rtlHeaderRow: {
    flexDirection: 'row-reverse',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  rtlTitleContainer: {
    alignItems: 'flex-end',
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
  urduText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
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
  urduIconRow: {
    flexDirection: 'row-reverse',
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EDEDED',
    marginLeft: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  errorImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#BF272a',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconGroup: { 
    flexDirection: 'row' 
  },
});

export default LatestNews;
import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Image, 
  StyleSheet, ActivityIndicator, Share 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';
import { useLanguage } from '../context/LanguageContext';

const EntertainmentSection = ({ navigation }) => {
  const { language } = useLanguage();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntertainmentNews();
    loadBookmarkedPosts();
  }, [language]);

  // Fetch Entertainment News based on selected language
  const fetchEntertainmentNews = async () => {
    try {
      setLoading(true);
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=26&_embed'
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=37&_embed';

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setEntertainmentNews(data);
    } catch (error) {
      console.error('Error fetching entertainment news:', error);
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
  const toggleBookmark = async (post) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === post.id);

    if (index !== -1) {
      updatedBookmarks.splice(index, 1); // Remove if already bookmarked
    } else {
      updatedBookmarks.push(post); // Add if not bookmarked
    }

    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

  // Share post
  const sharePost = async (newsItem) => {
    try {
      await Share.share({
        message: `${newsItem.link}`,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Render News Item
  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const isBookmarked = bookmarkedPosts.some(b => b.id === item.id);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('BottomTabs', {
          screen: 'HOME',
          params: {
            screen: 'NewsDetails',
            params: {
              news: {
                title: decode(item.title.rendered),
                content: decode(item.content.rendered),
                description: decode(item.excerpt.rendered),
                image: imageUrl,
                source: { name: 'Sun News' },
                publishedAt: item.date
              }
            }
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
                <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
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

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
        {/* Icon + Text Container */}
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
        {/* See All Button */}
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

      {loading ? (
        <ActivityIndicator size="large" color="#BF272a" />
      ) : (
        <FlatList
          data={entertainmentNews.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
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
  }
});

export default EntertainmentSection;
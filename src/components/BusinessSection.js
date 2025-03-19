import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Share, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark } from 'lucide-react-native';
import { decode } from 'html-entities';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Language Context

const BusinessSection = ({ navigation }) => {
  const { language } = useLanguage(); // ✅ Get the current language from context
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchNews();
    loadBookmarkedPosts();
  }, [language]); // ✅ Re-fetch when language changes

  // Fetch business news based on selected language
  const fetchNews = async () => {
    setLoading(true);
    try {
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=19&_embed'
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=28&_embed';

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setBusinessNews(data);
    } catch (error) {
      console.error('Error fetching business news:', error);
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
      updatedBookmarks.splice(index, 1); // Remove if already bookmarked
    } else {
      updatedBookmarks.push(newsItem); // Add if not bookmarked
    }

    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

  // Share post
  const sharePost = async (title, link) => {
    try {
      await Share.share({ message: link, url: link, title });
    } catch (error) {
      console.error('Error sharing news:', error.message);
      Alert.alert("Sharing Failed", "There was an error sharing the news.");
    }
  };

  // Render News Item (Horizontal Card)
  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

    return (
      <TouchableOpacity 
        style={[styles.card, language === 'ur' && styles.urduCard]}
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
          <Text style={[styles.cardTitle, language === 'ur' && styles.urduTitle]} numberOfLines={3}>
            {decode(item.title.rendered)}
          </Text>
          <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => toggleBookmark(item)}>
            <Bookmark size={20} color={isBookmarked ? "#BF272a" : "#666"} />
          </TouchableOpacity>
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
        <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
          {/* Icon + Text Container */}
          <View style={{ flexDirection: language === 'ur' ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <MaterialIcons 
              name='business' 
              size={34} 
              color='#BF272a' 
              style={language === 'ur' ? { marginRight: 10 } : { marginLeft: 10 }} // ✅ Add space on the right in Urdu mode
            />
            <Text style={[styles.sectionTitle, language === 'ur' && styles.urduSectionTitle]}>
              {language === 'ur' ? "کاروبار" : "BUSINESS"}
            </Text>
          </View>
          {/* See All Button */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('BottomTabs', {
              screen: 'HOME',
              params: {
                screen: 'Business'
              }
            })} 
            style={language === 'ur' ? { marginLeft: 10 } : null}
          >
            <Text style={styles.seeAll} >{language === 'ur' ? " مزید دیکھیں" : "See All"}</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={businessNews.slice(0, 5)}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNewsItem}
          horizontal // ✅ Set FlatList to horizontal
          inverted={language === 'ur'} // ✅ Reverse scroll direction for Urdu
          showsHorizontalScrollIndicator={false} // ✅ Hide scroll bar
          contentContainerStyle={{
            paddingHorizontal: language === 'ur' ? 0 : 10, // ✅ No left padding in Urdu mode
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    //paddingStart: language === 'ur' ? 0 : 10, // ✅ No left padding in Urdu mode
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BF272a',
    marginLeft: 10,
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
    backgroundColor: '#d4d6d9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 7,
  },
  card: {
    width: 250, // ✅ Fixed width for horizontal layout
    marginRight: 10,
    backgroundColor: '#f0f1f2',
    borderRadius: 8,
    elevation: 3,
  },
  urduCard: {
    alignItems: 'flex-end',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode:  'cover',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  cardTextContainer: {
    marginTop: 10,
    paddingHorizontal: 10
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  urduTitle: {
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default BusinessSection;
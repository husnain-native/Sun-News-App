import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, Share, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import { decode } from 'html-entities';
import { useLanguage } from '../context/LanguageContext';

const BusinessSection = ({ navigation }) => {
  const { language } = useLanguage();
  const flatListRef = useRef(null);
  const [businessNews, setBusinessNews] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchNews();
    loadBookmarkedPosts();
  }, [language]);

  useEffect(() => {
    // Reset scroll position when businessNews changes (after language change)
    if (businessNews.length > 0 && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: false,
          viewPosition: 0
        });
      }, 100); // Small delay to ensure FlatList is ready
      return () => clearTimeout(timer);
    }
  }, [businessNews]);

  const fetchNews = async () => {
    try {
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/index.php?rest_route=/wp/v2/posts&categories=19&_embed'
        : 'https://sunnewshd.tv/index.php?rest_route=/wp/v2/posts&categories=28&_embed';

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setBusinessNews(data);
    } catch (error) {
      console.error('Error fetching business news:', error);
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

  const toggleBookmark = async (newsItem) => {
    let updatedBookmarks = [...bookmarkedPosts];
    const index = updatedBookmarks.findIndex(item => item.id === newsItem.id);

    if (index !== -1) {
      updatedBookmarks.splice(index, 1);
    } else {
      updatedBookmarks.push(newsItem);
    }

    setBookmarkedPosts(updatedBookmarks);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  };

   // Share News
    const shareNews = async (title, url) => {
      try {
        await Share.share({
          message: `${title}\n\nRead more: ${url}`,
        });
      } catch (error) {
        console.error('Error sharing news:', error);
      }
    };

  const renderNewsItem = ({ item }) => {
    let imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    // Ensure imageUrl is a string, else fallback to local image
    if (typeof imageUrl !== 'string') {
      imageUrl = require('../assets/notfound.png');
    }

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
          <View style={styles.bottomRow}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="calendar" size={24} color="#bf272a" />
              <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
            </View>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => toggleBookmark(item)}>
                <Bookmark size={20} color={isBookmarked ? "#bf272a" : "gray"} fill={isBookmarked ? "#bf272a" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareNews(decode(item.title.rendered), item.link)}>
                <Share2 size={20} color="#bf272a" style={{ marginLeft: 12 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
     
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      {businessNews.length > 0 && (
        <View style={styles.categoryContainer}>
          <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: language === 'ur' ? 'row-reverse' : 'row', alignItems: 'center' }}>
              <MaterialIcons 
                name='business' 
                size={34} 
                color='#BF272a' 
                style={language === 'ur' ? { marginRight: 10 } : { marginLeft: 10 }}
              />
              <Text style={[styles.sectionTitle, language === 'ur' && styles.urduSectionTitle]}>
                {language === 'ur' ? "کاروبار" : "BUSINESS"}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('BottomTabs', {
                screen: 'HOME',
                params: {
                  screen: 'Business'
                }
              })} 
              style={language === 'ur' ? { marginLeft: 10 } : null}
            >
              <Text style={styles.seeAll}>{language === 'ur' ? " مزید دیکھیں" : "See All"}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={businessNews.slice(0, 5)}
            onScrollToIndexFailed={(error) => {
              console.log('Scroll to index failed:', error);
              flatListRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
              });
            }}
            initialScrollIndex={0}
            keyExtractor={item => item.id.toString()}
            renderItem={renderNewsItem}
            horizontal
            inverted={language === 'ur'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: language === 'ur' ? 0 : 10,
            }}
          />
        </View>
      )}
    </View>
  );
};

// ... keep your existing styles ...

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
    marginBottom: 15,
    paddingHorizontal: 15
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
    marginTop: 10,
    paddingHorizontal: 10
  },
  iconButton: {
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default BusinessSection;
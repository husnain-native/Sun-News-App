import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Share, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import { decode } from 'html-entities';
import { useLanguage } from '../context/LanguageContext'; // Import Language Context

const SportsSection = ({ navigation }) => {
  const { language } = useLanguage(); // Get the current language from context
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    fetchSportsNews();
    loadBookmarks();
  }, [language]); // Re-fetch when language changes

  // Fetch Sports News based on selected language
  const fetchSportsNews = async () => {
    try {
      setLoading(true);
      const API_URL = language === 'en'
        ? 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=25&_embed' // English API
        : 'https://sunnewshd.tv/wp-json/wp/v2/posts?categories=43&_embed'; // Urdu API (replace with correct category ID if needed)

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setSportsNews(data);
    } catch (error) {
      console.error('Error fetching sports news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Bookmarked Items from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedPosts');
      if (storedBookmarks) {
        setBookmarkedItems(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  // Toggle Bookmark (Save or Remove)
  const toggleBookmark = async (item) => {
    try {
      setBookmarkedItems((prevBookmarks) => {
        let updatedBookmarks;
        if (prevBookmarks.some((news) => news.id === item.id)) {
          // Remove bookmark
          updatedBookmarks = prevBookmarks.filter((news) => news.id !== item.id);
        } else {
          // Add bookmark
          updatedBookmarks = [...prevBookmarks, item];
        }
        AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
        return updatedBookmarks;
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
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

  // Render News Item
  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const isBookmarked = bookmarkedItems.some((news) => news.id === item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NewsDetails', {
            news: {
              id: item.id,
              title: decode(item.title.rendered),
              content: decode(item.content.rendered),
              description: decode(item.excerpt.rendered),
              image: imageUrl,
              source: { name: 'Sun News' },
              publishedAt: item.date,
            },
          })
        }
      >
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, language === 'ur' && styles.urduTitle]} numberOfLines={3}>{decode(item.title.rendered)}</Text>
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

  if (loading) {
    return <ActivityIndicator size="large" color="#BF272a" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.sectionContainer}>
      {/* Header Row */}
      <View style={[styles.headerRow, { flexDirection: language === 'ur' ? 'row-reverse' : 'row' }]}>
        {/* Icon + Text Container */}
        <View style={{ flexDirection: language === 'ur' ? 'row-reverse' : 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons 
            name="football" 
            size={34} 
            color="#BF272a" 
            style={language === 'ur' ? { marginRight: 10 } : { marginLeft: 10 }} // ✅ Add space on the right in Urdu mode
          />
          <Text style={[styles.sectionTitle, language === 'ur' && styles.urduSectionTitle]}>
            {language === 'ur' ? "کھیل" : "SPORTS"}
          </Text>
        </View>
        {/* See All Button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Sports')}
          style={language === 'ur' ? { marginLeft: 10 } : null} // ✅ Add margin on the left in Urdu mode
        >
          <Text style={styles.seeAll}>
            {language === 'ur' ? "مزید دیکھیں" : "See All"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* News List */}
      <FlatList
        data={sportsNews.slice(0, 3)}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderNewsItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#e3e1e1',
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
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
    flexDirection: 'row',
    backgroundColor: '#e3e1e1',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: 90,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  urduTitle: {
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SportsSection;
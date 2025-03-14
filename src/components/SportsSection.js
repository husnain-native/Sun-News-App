import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { decode } from 'html-entities';

const SportsSection = ({ navigation }) => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    fetchSportsNews();
    loadBookmarks();
  }, []);

  // Fetch Sports News
  const fetchSportsNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=25&_embed'
      );
      setSportsNews(response.data);
    } catch (error) {
      console.error('Error fetching sports news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Bookmarked Items from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedSports');
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
        AsyncStorage.setItem('bookmarkedSports', JSON.stringify(updatedBookmarks));
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
        message: `${title}\nRead more: ${url}`,
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
          <Text style={styles.cardTitle} numberOfLines={3}>{decode(item.title.rendered)}</Text>
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
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="football" size={34} color="#BF272a" />
          <Text style={styles.sectionTitle}>SPORTS</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Sports')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
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

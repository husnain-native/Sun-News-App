import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';
import { useBookmarks } from '../context/BookmarkContext'; // Import the context

const BUSINESS_NEWS_URL = 'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=19&_embed';

const BusinessScreen = ({ navigation }) => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleBookmark } = useBookmarks(); // Get toggleBookmark function from context

  useEffect(() => {
    const fetchBusinessNews = async () => {
      try {
        const response = await axios.get(BUSINESS_NEWS_URL);
        setBusinessNews(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessNews();
  }, []);

  const renderNewsItem = ({ item }) => {
    const title = item.title.rendered;
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const date = new Date(item.date).toDateString();

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('NewsDetail', { 
          news: { 
            title: item.title.rendered, 
            image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url, 
            content: item.content?.rendered ?? '<p>No content available.</p>',
            source: { name: 'Sun News' }, 
            publishedAt: item.date
          } 
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.sourceInfo}>
            <Text style={styles.cardSubtitle}>{date}</Text>
          </View>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleBookmark(item)}>
              <Bookmark size={20} color="#BF272a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Share2 size={20} color="#BF272a" />
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
      {/* Category Navigation - Full Width */}
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>

      {/* Business News Content */}
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <MaterialIcons name="business" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>BUSINESS NEWS</Text>
            <View style={styles.underline} />
          </View>
        </View>
        <FlatList
          data={businessNews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: {
    width: Dimensions.get('window').width, // Ensures full width
    backgroundColor: '#fff', // Background to match navigation
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    paddingHorizontal: 15, 
    paddingTop: 10 
  },
  titleContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginStart: 5, padding: 10, color: '#333' },
  underline: { height: 4, backgroundColor: '#BF272a', width: '60%', marginTop: -7, marginStart: 14, borderRadius: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  sourceInfo: {
    flexDirection: 'column',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginLeft: 10,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 },
});

export default BusinessScreen;

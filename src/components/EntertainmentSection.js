import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import axios from 'axios';
import { decode } from 'html-entities'; // Import for decoding HTML entities

const EntertainmentSection = ({ navigation }) => {
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntertainmentNews = async () => {
    try {
      const response = await axios.get(
        'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=26&_embed' // Change category ID to Entertainment
      );
      setEntertainmentNews(response.data);
    } catch (error) {
      console.error('Error fetching entertainment news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntertainmentNews();
  }, []);

  const renderNewsItem = ({ item }) => {
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {
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
            <Text style={styles.cardTitle} numberOfLines={2}>{decode(item.title.rendered)}</Text>
            <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
          </View>
        </View>
        <View style={styles.iconRow}>
          <Bookmark size={16} color="gray" />
          <Share2 size={16} color="gray" style={{ marginLeft: 10 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="movie-open" size={30} color="#BF272a" />
          <Text style={styles.sectionTitle}>ENTERTAINMENT</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Entertainment')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#BF272a" />
      ) : (
        <FlatList
          data={entertainmentNews.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          nestedScrollEnabled={true} // Helps with smooth scrolling inside nested views
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20, marginHorizontal: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginStart: 5 },
  seeAll: { fontSize: 14, color: '#000', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 25 },

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
  row: { flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 3 },

  iconRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingLeft: 90 }
});

export default EntertainmentSection;

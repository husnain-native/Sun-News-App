import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Share2 } from 'lucide-react-native';
import axios from 'axios';

const EntertainmentSection = ({ navigation }) => {
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'da3704a65f404b3da127339011223fd4'; // Replace with a valid API key
  const defaultImage = require('../assets/notfound.png'); // ✅ Import the default image

  useEffect(() => {
    const fetchEntertainmentNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=entertainment&country=us&apiKey=${API_KEY}`
        );
        setEntertainmentNews(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching entertainment news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainmentNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        console.log('Navigating to NewsDetails with:', item);
        navigation.navigate('NewsDetails', { news: item });
      }}

    >
      <View style={styles.row}>
        <Image 
          source={item.urlToImage ? { uri: item.urlToImage } : defaultImage} 
          style={styles.cardImage} 
          onError={() => defaultImage} // ✅ Fallback to 'notfound.png' if image fails to load
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.source.name} • {new Date(item.publishedAt).toDateString()}</Text>
        </View>
      </View>
      <View style={styles.iconRow}>
        <Bookmark size={16} color="gray" />
        <Share2 size={16} color="gray" style={{ marginLeft: 10 }} />
      </View>
    </TouchableOpacity>
  );

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
          data={entertainmentNews.slice(0, 3)} // Show only 3 news items
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
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

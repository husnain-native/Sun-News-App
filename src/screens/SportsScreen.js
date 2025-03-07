import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = 'da3704a65f404b3da127339011223fd4'; // Replace with a valid API key
const DEFAULT_IMAGE = 'https://via.placeholder.com/150'; // Fallback image

const SportsScreen = ({ navigation }) => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${API_KEY}`
        );
        setSportsNews(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching sports news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('NewsDetails', { news: item })}
    >
      <Image 
        source={{ uri: item.urlToImage ? item.urlToImage : DEFAULT_IMAGE }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title || 'No Title Available'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.source?.name || 'Unknown Source'} • {item.publishedAt ? new Date(item.publishedAt).toDateString() : 'No Date'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="football" size={35} color="#BF272a" />
        <Text style={styles.header}>Sports News</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#BF272a" />
      ) : (
        <FlatList
          data={sportsNews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 10, marginBottom: 10, flexDirection: 'row' },
  cardImage: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 3 },
});

export default SportsScreen;

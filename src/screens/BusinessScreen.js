import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_KEY = 'da3704a65f404b3da127339011223fd4'; // 🔹 Replace this with your actual API key
const BUSINESS_NEWS_URL = `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${API_KEY}`;

const BusinessScreen = ({ navigation }) => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessNews = async () => {
      try {
        const response = await axios.get(BUSINESS_NEWS_URL);
        setBusinessNews(response.data.articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard} 
      onPress={() => navigation.navigate('NewsDetail', { news: item })}
    >
      <Image 
        source={{ uri: item.urlToImage || 'https://via.placeholder.com/300' }}  
        style={styles.newsImage} 
      />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSource}>
        {item.source.name || 'Unknown Source'} • {new Date(item.publishedAt).toDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business News</Text>
      <FlatList
        data={businessNews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNewsItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  newsCard: { marginBottom: 15 },
  newsImage: { width: '100%', height: 180, borderRadius: 10 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  newsSource: { fontSize: 12, color: 'gray' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 },
});

export default BusinessScreen;

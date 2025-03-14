import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

// Replace with the actual category ID for latest news
const LATEST_NEWS_CATEGORY_ID = 1;  

const LatestNewsSection = () => {
  const navigation = useNavigation();
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch(
          `https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=${LATEST_NEWS_CATEGORY_ID}&_embed`
        );
        const data = await response.json();
        setLatestNews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const renderNewsItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const date = new Date(item.date).toDateString();

    return (
      <TouchableOpacity
        style={styles.latestNewsCard}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {
            title: item.title.rendered,
            content: item.content.rendered,
            image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            publishedAt: item.date
          }
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.latestNewsImage} />
        <View style={styles.overlay}>
          <Text style={styles.latestNewsTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.latestNewsSource}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;
  if (error) {
    Alert.alert('Error', `Failed to load latest news: ${error}`);
    return null;
  }

  return (
    <View style={styles.latestNewsContainer}>
      <FlatList
        data={latestNews}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsItem}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  latestNewsContainer: { paddingVertical: 15, paddingLeft: 10, marginBottom: 10, backgroundColor: '#BF272a', marginTop: -2 },
  latestNewsCard: { width: 280, height: 180, marginRight: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff' },
  latestNewsImage: { width: '100%', height: '100%', borderRadius: 10 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, justifyContent: 'flex-end' },
  latestNewsTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  latestNewsSource: { fontSize: 12, color: 'white', marginTop: 5 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default LatestNewsSection;

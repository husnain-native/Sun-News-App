import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { decode } from 'html-entities'; // Import for decoding HTML entities

const BusinessSection = ({ navigation }) => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        'https://sunnewshd.tv/english/wp-json/wp/v2/posts?categories=19&_embed'
      );
      setBusinessNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
        <Image 
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
          style={styles.cardImage} 
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={3}>{decode(item.title.rendered)}</Text>
          <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
        </View>
        <View style={styles.iconRow}>
          <Bookmark size={20} color="#bf272a" />
          <Share2 size={20} color="#bf272a" style={{ marginLeft: 8 }} />
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
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name='business' size={34} color='#BF272a' />
            <Text style={styles.sectionTitle}>BUSINESS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Business')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={businessNews.slice(0, 8)}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, paddingLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginStart: 3, padding: 8 },
  seeAll: { fontSize: 14, color: '#000', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 25 },
  iconRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  categoryContainer: { marginBottom: 20 },
  card: { width: 180, backgroundColor: '#ededed', borderRadius: 10, marginRight: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingBottom: 8 },
  cardImage: { width: '100%', height: 100 },
  cardTextContainer: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', minHeight: 60, maxHeight: 80 },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 4, minHeight: 30, maxHeight: 80 },
});

export default BusinessSection;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const BusinessSection = ({ navigation }) => {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'bbe5db179a879d4cfae24f37b9b3c1be'; // Your API Key

  useEffect(() => {
    const fetchNews = async () => { 
      try {
        const response = await axios.get(
          `https://gnews.io/api/v4/search?q=business&token=${API_KEY}&lang=en&max=10`
        );
        setBusinessNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderNewsItem = ({ item }) => {
    const imageUrl = item.image ? { uri: item.image } : require('../assets/notfound.png'); 

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('NewsDetails', { news: item })} // ✅ Pass news item
      >
        <Image 
          source={imageUrl} 
          style={styles.cardImage} 
          defaultSource={require('../assets/notfound.png')}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={3}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.source.name} • {new Date(item.publishedAt).toDateString()}</Text>
        </View>
        <View style={styles.iconRow}>
          <Bookmark size={16} color="gray" />
          <Share2 size={16} color="gray" style={{ marginLeft: 8 }} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#BF272a" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.sectionContainer}>
      {/* Business Section Header */}
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
        
        {/* News List */}
        <FlatList
          data={businessNews.slice(0, 5)}
          horizontal
          keyExtractor={(item, index) => index.toString()}
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

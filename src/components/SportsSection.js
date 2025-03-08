import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { decode } from 'html-entities'; // For decoding HTML entities

const SportsSection = ({ navigation }) => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSportsNews = async () => {
    try {
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

  useEffect(() => {
    fetchSportsNews();
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
          <View style={styles.bottomRow}>
  <View style={styles.dateContainer}>
    <MaterialCommunityIcons name="calendar" size={24} color="#bf272a" />
    <Text style={styles.cardSubtitle}>{new Date(item.date).toDateString()}</Text>
  </View>
  <View style={styles.iconRow}>
    <Bookmark size={20} color="#bf272a" />
    <Share2 size={20} color="#bf272a" style={{ marginLeft: 12 }} />
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
  data={sportsNews.slice(0, 3)}  // Show only 3 posts
  keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
  renderItem={renderNewsItem}
  showsVerticalScrollIndicator={false}  // Hide scrollbar
/>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#F9F9F9'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333'
  },
  seeAll: {
    fontSize: 14, color: '#bf272a', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15
  },

  // Card Styling
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    
    marginBottom: 12,
    padding: 10,
    alignItems: 'center'
  },
  cardImage: {
    width: 120,
    height: 90,
    // borderRadius: 8,
    marginRight: 10
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222'
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'gray',
    marginVertical: 5
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8
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
  
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,  // Space between icon and text
  },
  
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
});

export default SportsSection;

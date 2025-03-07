import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Bookmark, Share2 } from 'lucide-react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = 'da3704a65f404b3da127339011223fd4'; // 🔹 Your API key
const defaultImage = require('../assets/notfound.png'); // ✅ Import the default image

const SportsSection = ({ navigation }) => {
  const [sportsNews, setSportsNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [sportsRes] = await Promise.all([
          axios.get(`https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${API_KEY}`),
        ]);

        setSportsNews(sportsRes.data.articles);
      } catch (error) {
        console.error('Error fetching sports news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="football" size={35} color="#BF272a" />
          <Text style={styles.sectionTitle}>SPORTS</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Sports')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="#BF272a" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={sportsNews.slice(0, 3)} // Show top 3 news items
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => navigation.navigate('NewsDetails', { news: item })}
            >
              <Image 
                source={item.urlToImage ? { uri: item.urlToImage } : defaultImage} 
                style={styles.listImage} 
                onError={() => defaultImage} // ✅ Fallback to 'notfound.png' if image fails to load
              />
              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.listSubtitle}>{item.source.name}</Text>

                {/* Time & Icons */}
                <View style={styles.timeRow}>
                  <FontAwesome5 name="business-time" size={16} color="black" />
                  <Text style={styles.listTime}>{new Date(item.publishedAt).toLocaleTimeString()}</Text>
                  <View style={styles.iconRow}>
                    <Bookmark size={18} color="gray" />
                    <Share2 size={18} color="gray" style={{ marginLeft: 8 }} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, paddingHorizontal: 10, backgroundColor: '#f0f2f0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  seeAll: { fontSize: 14, color: '#000', fontWeight: 'bold', backgroundColor: "#d4d6d9", padding: 6, borderRadius: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  
  listItem: { flexDirection: 'row', padding: 10, backgroundColor: '#f0f2f0', marginBottom: 10 },
  listImage: { width: 140, height: 100, marginRight: 10 },
  listTextContainer: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  listSubtitle: { fontSize: 12, color: 'gray', marginTop: 5 },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  listTime: { fontSize: 12, color: 'black', marginLeft: 5 },
  iconRow: { flexDirection: 'row', marginLeft: 'auto' },
});

export default SportsSection;

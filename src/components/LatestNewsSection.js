import React, { useEffect, useState, useRef } from 'react';
import { 
  View, FlatList, TouchableOpacity, Image, Text, 
  StyleSheet, ActivityIndicator, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext'; // Import Language Context

const LatestNewsSection = () => {
  const navigation = useNavigation();
  const { language } = useLanguage(); // Get the current language from context
  const flatListRef = useRef(null);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const API_URL = language === 'en'
          ? `https://sunnewshd.tv/english/index.php?rest_route=/wp/v2/posts&categories=24&_embed` // English API
          : `https://sunnewshd.tv/index.php?rest_route=/wp/v2/posts&categories=33&_embed`; // Urdu API

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setLatestNews(data);
      } catch (error) {
        setError(<Text style={color='#bf272a'}>Connection Failed!</Text>);
      } finally {
        setLoading(true);
      }
    };

    fetchLatestNews();
  }, [language]); // Re-fetch when language changes

  useEffect(() => {
    // Reset scroll position when latestNews changes (after language change)
    if (latestNews.length > 0 && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: false,
          viewPosition: 0
        });
      }, 100); // Small delay to ensure FlatList is ready
      return () => clearTimeout(timer);
    }
  }, [latestNews]);

  const renderNewsItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    let imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    if (typeof imageUrl !== 'string') {
      imageUrl = require('../assets/notfound.png');
    }

    return (
      <TouchableOpacity
        style={[styles.latestNewsCard, language === 'ur' && styles.urduCard]}
        onPress={() => navigation.navigate('NewsDetails', { 
          news: {
            title: item.title.rendered,
            content: item.content.rendered,
            image: imageUrl,
            // publishedAt: item.date
          }
        })}
      >
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.latestNewsImage} />
        <View style={[styles.overlay, language === 'ur' && styles.urduOverlay]}>
          <Text 
            style={[
              styles.latestNewsTitle, 
              language === 'ur' && styles.urduTitle
            ]} 
            numberOfLines={2}
          >
            {title}
          </Text>
          {/* <Text 
            style={[
              styles.latestNewsSource, 
              language === 'ur' && styles.urduSource
            ]}
          >
            {date}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };


 

  return (
    <View style={styles.latestNewsContainer}>
      <FlatList
        ref={flatListRef}
        data={latestNews}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsItem}
        inverted={language === 'ur'}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        onScrollToIndexFailed={(error) => {
          console.log('Scroll to index failed:', error);
          flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
          });
        }}
        initialScrollIndex={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  latestNewsContainer: { 
    paddingVertical: 15, 
    paddingLeft: 10, 
    marginBottom: 10, 
    backgroundColor: '#BF272a', 
    marginTop: -2 
  },
  latestNewsCard: { 
    width: 280, 
    height: 180, 
    marginRight: 10, 
    borderRadius: 10, 
    overflow: 'hidden', 
    backgroundColor: '#fff' 
  },
  urduCard: {
    // Add any specific styling for Urdu mode cards if needed
  },
  latestNewsImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10 
  },
  overlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: '40%', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    padding: 10, 
    justifyContent: 'flex-end' 
  },
  urduOverlay: {
    // Adjust overlay for Urdu mode
    paddingRight: 5, // Add more padding on the right for Urdu text
  },
  latestNewsTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  urduTitle: {
    textAlign: 'right', // Align text to the right for Urdu
    fontFamily: 'Noto Nastaliq Urdu', // Use a professional Urdu font
  },
  latestNewsSource: { 
    fontSize: 12, 
    color: 'white', 
    marginTop: 5 
  },
  urduSource: {
    textAlign: 'right', // Align text to the right for Urdu
    fontFamily: 'Noto Nastaliq Urdu', // Use a professional Urdu font
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default LatestNewsSection;
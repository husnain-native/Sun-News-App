import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { decode } from 'html-entities'; // Import for HTML decoding

const NewsDetailsScreen = ({ route }) => {
  const news = route?.params?.news; 

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No news data available.</Text>
      </View>
    );
  }

  const imageUrl = news.image ? { uri: news.image } : require('../assets/notfound.png');

  // Clean and decode content
  const fullContent = news.content ? decode(news.content.replace(/\[\+\d+ chars\]/, '')) : '';
  const completeText = decode(`${news.description || ''}\n\n${fullContent}`);

  return (
    <ScrollView style={styles.container}>
      {/* News Image */}
      <Image source={imageUrl} style={styles.newsImage} />

      {/* News Title */}
      <Text style={styles.title}>{news.title}</Text>

      {/* Source & Date */}
      <Text style={styles.source}>
        {news.source?.name || 'Unknown Source'} • {news.publishedAt ? new Date(news.publishedAt).toDateString() : 'Unknown Date'}
      </Text>

      {/* Full News Content */}
      <Text style={styles.content}>{completeText || 'Full content is not available.'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', fontWeight: 'bold' },
  newsImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  source: { fontSize: 14, color: 'gray', marginBottom: 10 },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
});

export default NewsDetailsScreen;

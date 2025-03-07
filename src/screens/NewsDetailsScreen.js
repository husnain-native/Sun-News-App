import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const NewsDetailsScreen = ({ route }) => {
  const news = route?.params?.news;
  const { width } = useWindowDimensions();

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No news data available.</Text>
      </View>
    );
  }

  // Set the image URL or use a placeholder if not available
  const imageUrl = news.image ? { uri: news.image } : require('../assets/notfound.png');

  // Remove extra text like "[+123 chars]" from content
  const fullContent = news.content ? news.content.replace(/\[\+\d+ chars\]/, '') : '';

  // Only use full content (NO description to avoid duplication)
  const completeText = fullContent;

  return (
    <ScrollView style={styles.container}>
      {/* News Image with Shadow */}
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.newsImage} />
      </View>

      {/* News Title */}
      <Text style={styles.title}>{news.title}</Text>

      {/* Source & Date */}
      <Text style={styles.source}>
        {news.source?.name || 'Unknown Source'} • {news.publishedAt ? new Date(news.publishedAt).toDateString() : 'Unknown Date'}
      </Text>

      {/* Render HTML Content */}
      <View style={styles.contentContainer}>
        <RenderHtml
          contentWidth={width}
          source={{ html: completeText }}
          tagsStyles={htmlStyles} // Apply styles for HTML content
        />
      </View>
    </ScrollView>
  );
};

// **Styling for Components**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
    marginTop: 15
  },
  newsImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  source: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '600',
    marginBottom: 12,
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});

// **Custom Styles for Rendered HTML**
const htmlStyles = {
  p: { fontSize: 16, color: '#343A40', lineHeight: 24 },
  strong: { fontWeight: 'bold', color: '#212529' },
  a: { color: '#007BFF', textDecorationLine: 'underline' },
};

export default NewsDetailsScreen;

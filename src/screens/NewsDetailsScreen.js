import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import BusinessEntertainmentSection from '../components/BusinessEntertainmentSection';

const NewsDetailScreen = ({ route }) => {
  const { news } = route.params;
  console.log(news); // Log the news object to inspect its structure

  return (
    <ScrollView style={styles.container}>
      <Image source={news.image} style={styles.image} />
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.source}>{news.source} • {news.time}</Text>
      <Text style={styles.content}>
        {news.content}
      </Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  source: { fontSize: 14, color: 'black', marginBottom: 10 },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 15 },
});

export default NewsDetailScreen;

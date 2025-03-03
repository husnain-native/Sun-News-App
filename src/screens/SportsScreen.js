import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { newsData } from '../data/newsData';

const SportsScreen = ({ navigation }) => {
  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard} 
      onPress={() => navigation.navigate('NewsDetail', { news: item })}
    >
      <Image source={item.image} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSource}>{item.source} • {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sports News</Text>
      <FlatList
        data={newsData.Sports}
        keyExtractor={(item) => item.id}
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
});

export default SportsScreen;

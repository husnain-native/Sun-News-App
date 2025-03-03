import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native'; // Icons for bookmark and share
import { newsData } from '../data/newsData';

const HomeScreen = ({ navigation }) => {
  const latestNews = [
    ...newsData.Business.slice(0, 2),
    ...newsData.Sports.slice(0, 2),
    ...newsData.Entertainment.slice(0, 1),
  ];

  const renderLatestNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.latestNewsCard} 
      onPress={() => navigation.navigate('NewsDetail', { news: item })}
    >
      <Image source={item.image} style={styles.latestNewsImage} />
      <View style={styles.overlay}>
        <Text style={styles.latestNewsTitle}>{item.title}</Text>
        <Text style={styles.latestNewsSource}>{item.source} • {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Latest News Section */}
      <View style={styles.latestNewsContainer}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        <FlatList
          data={latestNews}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLatestNewsItem}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true} // Fix scroll conflict
        />
      </View>

      {/* Business and Entertainment Sections */}
      <BusinessEntertainmentSection navigation={navigation} newsData={newsData} />
    </ScrollView>
  );
};

const BusinessEntertainmentSection = ({ navigation, newsData }) => {
  return (
    <View style={styles.sectionContainer}>
      {/* Business Section */}
      <View style={styles.categoryContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>BUSINESS</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={newsData.Business.slice(0, 3)}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('NewsDetail', { news: item })}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.source} • {item.time}</Text>
              </View>
              <View style={styles.iconRow}>
                <Bookmark size={16} color="gray" />
                <Share2 size={16} color="gray" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true} // Fix scroll issue
        />
      </View>

      {/* Entertainment Section */}
      <View style={styles.categoryContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>ENTERTAINMENT</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={newsData.Entertainment.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => navigation.navigate('NewsDetail', { news: item })}
            >
              <Image source={item.image} style={styles.listImage} />
              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listSubtitle}>{item.source} • {item.time}</Text>
              </View>
              <View style={styles.iconRow}>
                <Bookmark size={16} color="gray" />
                <Share2 size={16} color="gray" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true} // Fix scroll issue
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Latest News Styles
  latestNewsContainer: { paddingVertical: 15, paddingLeft: 10, marginBottom: 20 },
  latestNewsCard: { width: 280, height: 180, marginRight: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff' },
  latestNewsImage: { width: '100%', height: '100%', borderRadius: 10 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, justifyContent: 'flex-end' },
  latestNewsTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  latestNewsSource: { fontSize: 12, color: 'white', marginTop: 5 },

  // Section Styles
  sectionContainer: { marginBottom: 20, paddingLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { fontSize: 14, color: '#007AFF', fontWeight: 'bold' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },

  // Business and Entertainment Cards
  card: { width: 180, backgroundColor: '#f9f9f9', borderRadius: 10, marginRight: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingBottom: 8 },
  cardImage: { width: '100%', height: 100 },
  cardTextContainer: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 4 },
  iconRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },

  // Entertainment List Items
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10, backgroundColor: '#f9f9f9', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  listImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  listTextContainer: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: 'bold' },
  listSubtitle: { fontSize: 12, color: 'gray', marginTop: 4 },
});

export default HomeScreen;

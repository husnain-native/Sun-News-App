import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { newsData } from '../data/newsData';
import BottomTabNavigator from '../navigation/BottomTabNavigator'; // Re-import Bottom Tab Navigator

const BusinessScreen = ({ navigation }) => {
  
  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard} 
      onPress={() => {
        console.log(item); // Log the item to check its structure
        navigation.navigate('NewsDetail', { news: item });
      }}
    >
      <Image source={item.image} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSource}>{item.source} • {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}> {/* Parent View to wrap everything */}
      <View style={styles.container}>
        <Text style={styles.header}>Business News</Text>
        
        <FlatList
          data={newsData.Business}
          keyExtractor={(item) => item.id}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    
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

export default BusinessScreen;

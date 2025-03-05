import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const LatestNewsSection = ({ latestNews, navigation }) => {
  return (
    <View style={styles.latestNewsContainer}>
      <FlatList
        data={latestNews}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.latestNewsCard} 
            onPress={() => navigation.navigate('NewsDetails', { news: item })}
          >
            <Image source={item.image} style={styles.latestNewsImage} />
            <View style={styles.overlay}>
              <Text style={styles.latestNewsTitle}>{item.title}</Text>
              <Text style={styles.latestNewsSource}>{item.source} • {item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  latestNewsContainer: { paddingVertical: 15, paddingLeft: 10, marginBottom: 10, backgroundColor: '#BF272a' },
  latestNewsCard: { width: 280, height: 180, marginRight: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff' },
  latestNewsImage: { width: '100%', height: '100%', borderRadius: 10 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, justifyContent: 'flex-end' },
  latestNewsTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  latestNewsSource: { fontSize: 12, color: 'white', marginTop: 5 },
});

export default LatestNewsSection;
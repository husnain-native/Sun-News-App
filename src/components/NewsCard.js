import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';

const NewsCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('NewsDetails', { news: item })}
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
  );
};

const styles = StyleSheet.create({
  card: { width: 180, backgroundColor: '#ededed', borderRadius: 10, marginRight: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingBottom: 8 },
  cardImage: { width: '100%', height: 100 },
  cardTextContainer: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 4 },
  iconRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
});

export default NewsCard;

import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const BusinessEntertainmentSection = ({ navigation, newsData }) => {
  return (
    <View style={styles.sectionContainer}>
      {/* Business Section */}
      <View style={styles.categoryContainer}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name='business' size={34} color='#BF272a' />
            <Text style={styles.sectionTitle}>BUSINESS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Business')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={newsData.Business ? newsData.Business.slice(0, 3) : []}



          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
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
          )}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      </View>

      {/* Entertainment Section (Restored Styling) */}
      <View style={styles.entertainmentContainer}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="movie-open" size={34} color="#BF272a" />
            <Text style={styles.sectionTitle}>ENTERTAINMENT</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Entertainment')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={newsData.Entertainment ? newsData.Entertainment.slice(0, 3) : []}



          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => navigation.navigate('NewsDetails', { news: item })}
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
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, paddingLeft: 10 },
  
  // Common Section Styles
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginStart: 3 },
  seeAll: { fontSize: 14, color: '#000', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 25 },
  iconRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },

  // Business Section
  categoryContainer: { marginBottom: 20 },
  card: { width: 180, backgroundColor: '#ededed', borderRadius: 10, marginRight: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingBottom: 8 },
  cardImage: { width: '100%', height: 100 },
  cardTextContainer: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: 'gray', marginTop: 4 },

  // Entertainment Section (Restored Styling)
  entertainmentContainer: { borderRadius: 10, paddingEnd: 10, marginBottom: 10 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10, backgroundColor: '#d9d9d9', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  listImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  listTextContainer: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  listSubtitle: { fontSize: 12, color: '#000', marginTop: 4 },
});

export default BusinessEntertainmentSection;

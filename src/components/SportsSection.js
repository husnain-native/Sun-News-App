import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const SportsSection = ({ navigation, newsData }) => {
  console.log('Sports Data:', newsData); // Debugging line to check the data

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="football" size={45} color="#BF272a" />
          <Text style={styles.sectionTitle}>SPORTS</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Sports')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Sports News List */}
      <FlatList
        data={newsData.Sports ? newsData.Sports.slice(0, 3) : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.listItem}
            onPress={() => navigation.navigate('NewsDetails', { news: item })}
          >
            <Image source={item.image} style={styles.listImage} />

            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.listSubtitle}>{item.source}</Text>

              {/* Time with Clock Icon */}
              <View style={styles.timeRow}>
                <FontAwesome5 name="business-time" size={20} color="black" />
                <Text style={styles.listtime}>{item.time}</Text>
                <View>
                  
                </View>
              <Bookmark size={20} color="black" style={{marginStart: 20}}/>
              <Share2 size={20} color="black" style={{ marginLeft: 8 }} />
              </View>
            </View>

            
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, paddingHorizontal: 10, backgroundColor: '#ededeb' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginStart: 5 },
  seeAll: { fontSize: 14, color: '#000', fontWeight: 'bold', backgroundColor: "#d4d6d9", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginRight: 7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 6 },
  
  listItem: { flexDirection: 'row', padding: 8, backgroundColor: '#ededeb', marginBottom: 10, borderRadius: 10 },
  listImage: { width: 150, height: 100, marginRight: 10 },
  listTextContainer: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  listSubtitle: { fontSize: 12, color: '#000', marginTop: 5 },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  listtime: { fontSize: 12, color: 'black', marginLeft: 5 },

  iconRow: { },
});

export default SportsSection;

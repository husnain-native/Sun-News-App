import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import LatestNews from '../components/LatestNewsSection';
import BusinessEntertainment from '../components/BusinessEntertainmentSection';
import SportsSection from '../components/SportsSection'; // ✅ Import Sports Section
import { newsData } from '../data/newsData';

const HomeScreen = ({ navigation }) => {
  return (
    <FlatList
      style={styles.container}
      data={[
        { key: 'latestNews', component: <LatestNews navigation={navigation} latestNews={[
          ...newsData.Business ? newsData.Business.slice(0, 2) : [],
          ...newsData.Sports ? newsData.Sports.slice(0, 2) : [],
          ...newsData.Entertainment ? newsData.Entertainment.slice(0, 1) : [],

        ]} /> },
        { key: 'businessEntertainment', component: <BusinessEntertainment 
          navigation={navigation} 
          newsData={{
            Business: newsData.Business ? newsData.Business : [],
            Entertainment: newsData.Entertainment ? newsData.Entertainment : []
          }} 
        /> },
        { key: 'sportsSection', component: <SportsSection 
          navigation={navigation} 
          newsData={newsData}  // ✅ Pass the full newsData object
        /> },
      ]}
      renderItem={({ item }) => item.component}
      keyExtractor={item => item.key}
      nestedScrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default HomeScreen;

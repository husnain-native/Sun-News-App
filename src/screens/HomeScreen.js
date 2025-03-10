import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import LatestNews from '../components/LatestNewsSection';
import BusinessSection from '../components/BusinessSection';
import EntertainmentSection from '../components/EntertainmentSection';
import SportsSection from '../components/SportsSection';
import CategoryNavigation from '../components/CategoryNavigation'; // ✅ Import CategoryNavigation
import { newsData } from '../data/newsData';

const HomeScreen = ({ navigation }) => {
  return (
    <FlatList
      style={styles.container}
      data={[
        {
          key: 'latestNews',
          component: (
            <View>
              {/* ✅ Category Navigation under Latest News Section */}
              <LatestNews
                navigation={navigation}
                latestNews={[
                  ...newsData.Business ? newsData.Business.slice(0, 2) : [],
                  ...newsData.Sports ? newsData.Sports.slice(0, 2) : [],
                  ...newsData.Entertainment ? newsData.Entertainment.slice(0, 1) : [],
                ]}
              />
                <CategoryNavigation />
            </View>
          ),
        },
        {
          key: 'businessSection',
          component: <BusinessSection navigation={navigation} newsData={newsData.Business || []} />,
        },
        {
          key: 'sportsSection',
          component: <SportsSection navigation={navigation} newsData={newsData.Sports || []} />,
        },
        {
          key: 'entertainmentSection',
          component: <EntertainmentSection navigation={navigation} newsData={newsData.Entertainment || []} />,
        },
      ]}
      renderItem={({ item }) => item.component}
      keyExtractor={(item) => item.key}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default HomeScreen;

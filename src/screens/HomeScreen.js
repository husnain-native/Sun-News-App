import React from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import LatestNewsSection from '../components/LatestNewsSection';
import BusinessSection from '../components/BusinessSection';
import EntertainmentSection from '../components/EntertainmentSection';
import SportsSection from '../components/SportsSection';
import CategoryNavigation from '../components/CategoryNavigation';
import { newsData } from '../data/newsData';

const HomeScreen = ({ navigation }) => {
  return (
    <>
    <View>
      <View style={styles.categoryNavContainer}>

      <CategoryNavigation style={styles.stickyHeader}/>
      </View>
    </View>
    <FlatList
      style={styles.container}
      data={[ 
        {
          key: 'latestNewsSection',
          component: (
            <LatestNewsSection />
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
</>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  categoryNavContainer: {width: Dimensions.get('window').width, backgroundColor: '#fff'
}});

export default HomeScreen;

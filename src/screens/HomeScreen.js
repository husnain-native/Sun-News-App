import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Dimensions, ActivityIndicator, Image } from 'react-native';
import LatestNewsSection from '../components/LatestNewsSection';
import BusinessSection from '../components/BusinessSection';
import EntertainmentSection from '../components/EntertainmentSection';
import SportsSection from '../components/SportsSection';
import CategoryNavigation from '../components/CategoryNavigation';
import AdvertisementBanner from '../components/AdvertisementBanner';
import { newsData } from '../data/newsData';
import ThreeDotLoader from '../components/ThreeDotLoader';

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Simulate loading all data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you might have async operations here
        // For now, we'll just simulate a loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate error condition here if needed, e.g.:
        // throw new Error('Network error');
        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        setIsLoading(true);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ThreeDotLoader />
      </View>
      
    );
  }

  if (hasError) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../assets/error.jpg')}
          style={{ width: 200, height: 200, resizeMode: 'contain' }}
          accessibilityLabel="Error"
        />
      </View>
    );
  }

  return (
    <>
      {!isLoading && !hasError && (
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
                component: <LatestNewsSection />,
              },
              {
                key: 'advertisementBanner',
                component: <AdvertisementBanner />,
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  categoryNavContainer: {
    width: Dimensions.get('window').width, 
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%'
  }
});

export default HomeScreen;

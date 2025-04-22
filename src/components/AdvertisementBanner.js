import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const AdvertisementBanner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/ads.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 10,
    
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AdvertisementBanner; 
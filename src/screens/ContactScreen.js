import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNRestart from 'react-native-restart';
import CategoryNavigation from "../components/CategoryNavigation";
import { useLanguage } from "../context/LanguageContext";

const FollowUsScreen = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openSocialMedia = async (platform) => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      switch (platform) {
        case "facebook":
          url = "https://www.facebook.com/people/Sun-News/61573097942664/";
          break;
        case "twitter":
          url = "https://twitter.com/SunNewsOfficial";
          break;
        case "instagram":
          url = "https://www.instagram.com/sunnewshdpk";
          break;
        case "youtube":
          url = "https://www.youtube.com/channel/UCzislLLPhE4aRd-k-WLdLVQ";
          break;
      }

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error(language === 'en' ? "Network failed" : "نیٹ ورک  ناکام");
      }

      await Linking.openURL(url);
    } catch (err) {
      console.error('Error opening link:', err);
      setError(<Text style={color='#bf272a'}>Connection Failed!</Text>);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      await RNRestart.Restart();
    } catch (restartError) {
      Alert.alert(
        language === 'en' ? 'Restart Failed' : 'ری اسٹارٹ ناکام',
        language === 'en' 
          ? 'Please manually close and reopen the app' 
          : 'براہ کرم دستی طور پر ایپ بند کریں اور دوبارہ کھولیں'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF272a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Image
          source={require('../assets/new.jpg')}
          style={styles.errorImage}
          accessibilityLabel="Error"
        />
        <Text style={styles.errorText}>
          {error || (language === 'en' 
            ? 'Network Failed' 
            : 'نیٹورک ناکام')}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRestart}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>
                   {language === 'ur' ? 'ری فریش ' : 'Refresh'}
                 </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={require("../assets/sun-logo.png")} style={styles.logo} />
          <Text style={styles.appName}>SUN NEWS</Text>
          <Text style={styles.introText}>
            <Text style={{ fontWeight: "bold", color: "#bf272a", fontSize: 20 }}>Sun News</Text> brings you authentic, fast, and reliable news from Pakistan and across the globe. Stay
            informed anytime, anywhere!
          </Text>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("facebook")}>
            <FontAwesome name="facebook-square" size={40} color="#1877F2" />
            <Text style={styles.socialText}>Follow us on Facebook</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("instagram")}>
            <FontAwesome name="instagram" size={40} color="#C13584" />
            <Text style={styles.socialText}>Follow us on Instagram</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("twitter")}>
            <FontAwesome name="twitter" size={40} color="#1DA1F2" />
            <Text style={styles.socialText}>Follow us on Twitter</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("youtube")}>
            <FontAwesome name="youtube-play" size={40} color="#FF0000" />
            <Text style={styles.socialText}>Subscribe on YouTube</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: { 
    width: Dimensions.get('window').width, 
    backgroundColor: '#fff' 
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8'
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 150,
    marginTop: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#bf272a",
    marginTop: 10,
  },
  introText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginVertical: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9d7d2",
    padding: 19,
    borderRadius: 10,
    width: "90%",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  socialText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 15,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  errorImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#bf272a',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#BF272a',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FollowUsScreen;
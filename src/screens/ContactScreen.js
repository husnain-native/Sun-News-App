import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import greater-than icon
import CategoryNavigation from "../components/CategoryNavigation";


const FollowUsScreen = () => {
  const openSocialMedia = (platform) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = "https://www.facebook.com/people/Sun-News/61573097942664/";
        break;
      case "twitter":
        url = "https://twitter.com//SunNewsOfficial";
        break;
      case "instagram":
        url = "https://www.instagram.com/sunnewshdpk";
        break;
      case "youtube":
        url = "https://www.youtube.com/channel/UCzislLLPhE4aRd-k-WLdLVQ";
        break;
    }
    Linking.openURL(url).catch(() => alert("Failed to open link."));
  };

  return (
    <View style={{flex: 1}}>
    <View >

      <CategoryNavigation />
    </View>
    <View style={styles.container}>
      {/* Category Navigation at the top */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sun News Logo */}
        <Image source={require("../assets/sun-logo.png")} style={styles.logo} />

        {/* Introduction */}
        <Text style={styles.appName}>SUN NEWS</Text>
        <Text style={styles.introText}>
        <Text style={{ fontWeight: "bold", color: "#bf272a", fontSize: 20 }}>Sun News</Text> brings you authentic, fast, and reliable news from Pakistan and across the globe. Stay
          informed anytime, anywhere!
        </Text>

        {/* Social Media Links */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
  },
  categoryNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#bf272a",
    paddingVertical: 12,
  },
  navItem: {
    paddingHorizontal: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default FollowUsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import ThreeDotLoader from '../components/ThreeDotLoader';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow
import RenderHtml, { defaultHTMLElementModels } from 'react-native-render-html';
import CategoryNavigation from '../components/CategoryNavigation';
import { WebView } from 'react-native-webview';
import { useLanguage } from '../context/LanguageContext'; // Import Language Con

// **Custom Image Renderer**
const customRenderers = {
  img: ({ TDefaultRenderer, tnode }) => {
    const source = tnode.attributes?.src ? { uri: tnode.attributes.src } : require('../assets/notfound.png');
    return (
      <Image
        source={source}
        style={{
          width: '100%',
          maxWidth: 300, // Ensure images don't overflow
          height: 250,
          resizeMode: 'contain',
          borderRadius: 10,
          alignSelf: 'center',
        }}
      />
    );
  },
};

// **Custom HTML Element Models**
const customModels = {
  img: defaultHTMLElementModels.img.extend({
    contentModel: 'block',
    render: customRenderers.img,
  }),
};

const NewsDetailsScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate loading for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);
  const news = route?.params?.news;
  const { language } = useLanguage(); // Get the current language from context
  const { width } = useWindowDimensions();

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ThreeDotLoader />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No news data available.</Text>
      </View>
    );
  }

  const imageUrl = news.image ? { uri: news.image } : require('../assets/notfound.png');
  const videoUrl = news.videoUrl;

  let fullContent = news.content && typeof news.content === 'string'
    ? news.content.replace(/\[\+\d+ chars\]/, '')
    : '<p>No content available.</p>';

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    if (!url) return null;
    // Handle both standard YouTube URLs and shortened youtu.be URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoUrl ? getVideoId(videoUrl) : null;

  return (
    <View style={styles.screen}>
      {/* **Category Navigation at the Top** */}
      <CategoryNavigation />

      {/* **Back Arrow at the Top** */}
      <TouchableOpacity
        style={[styles.backButton, language === 'ur' && styles.rtlBackButton]}
        onPress={() => {
          if (route.params?.fromScreen === 'BREAKING') {
            navigation.navigate('BottomTabs', {
              screen: 'BREAKING'
            });}
          else if (route.params?.fromScreen === 'PODCAST') {
            navigation.navigate('BottomTabs', {
              screen: 'PODCAST'
            });
         
          } 
          else if (route.params?.fromScreen === 'SAVED') {
            navigation.navigate('BottomTabs', {
              screen: 'SAVED'
            });
         
          } 
          else if (route.params?.categoryName) {
            navigation.navigate('BottomTabs', {
              screen: 'HOME',
              params: {
                screen: 'Category',
                params: {
                  categoryId: route.params.categoryId,
                  categoryName: route.params.categoryName
                }
              }
            });
          } else if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('BottomTabs', {
              screen: 'HOME',
              params: {
                screen: 'Home'
              }
            });
          }
        }}
      >
        <Ionicons
          name="return-up-back"
          size={30}
          color="#BF272A"
        />
      </TouchableOpacity>

      <ScrollView
        style={[styles.container, language === 'en' ? styles.ltrContainer : styles.rtlContainer]} // Apply RTL to the container
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.imageContainer}>
            {videoId ? (
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
                style={styles.newsImage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo={true}
              />
            ) : (
              <Image source={imageUrl} style={styles.newsImage} />
            )}
          </View>
          <Text style={[language === 'en' ? styles.title : styles.urduTitle]}>{news.title}</Text>
          <Text style={[language === 'en' ? styles.source : styles.urduSource]}>
            {news.source?.name || 'Unknown Source'} • {news.publishedAt ? new Date(news.publishedAt).toDateString() : 'Unknown Date'}
          </Text>
          <View style={language === 'en' ? styles.contentContainerltr : styles.contentContainerrtl}>
            <RenderHtml
              contentWidth={width}
              source={{ html: fullContent }}
              tagsStyles={language === 'ur' ? urduHtmlStyles : htmlStyles}
              baseStyle={language === 'ur' ? urduBaseStyle : englishBaseStyle}
              systemFonts={['NotoNastaliqUrdu']}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// **Styles**
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1, marginHorizontal: 10, paddingBottom: 20, marginTop: 15 },
  rtlContainer: {
    direction: 'rtl', // Apply RTL direction to the container
  },
  ltrContainer: {
    direction: 'ltr', // Apply LTR direction to the container
    
  },
  backButton: {
    position: 'absolute', // Position the back button absolutely
    top: 32, // Adjust top position as needed
    left: 1, // Position on the left for LTR
    zIndex: 1, // Ensure it's above other elements
    padding: 15, // Add padding for better touch area
    // margin: 15,

    fontWeight: 'bold',
    borderRadius: 20, // Rounded corners
  },

  imageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
    marginTop: 15,
  },
  newsImage: { width: '100%', height: 220, resizeMode: 'cover' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    writingDirection: 'ltr',
    textAlign: 'left ', // Default to left alignment
  },
  urduTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'right ', // RTL alignment for Urdu
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
    writingDirection: 'rtl', // Ensure RTL writing direction
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  source: {
    fontSize: 14,
    color: '#bf272a',
    fontWeight: '600',
    marginBottom: 12,
    
    textAlign: 'left', // Default to left alignment
  },
  urduSource: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right', // RTL alignment for Urdu
    color: '#bf272a',
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
    writingDirection: 'rtl', // Ensure RTL writing direction
     alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  contentContainerltr: {
    backgroundColor: '#fff',
    paddingVertical: 0,
    padding: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    writingDirection: 'ltr',
    direction: 'ltr'
  },
  contentContainerrtl: {
    backgroundColor: '#fff',
    paddingVertical: 0,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    writingDirection: 'rtl',
    direction: 'rtl',
    marginBottom: 20
  },
  rtlContent: {
    writingDirection: 'rtl',
    direction: 'rtl'
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', fontWeight: 'bold' },
  bottomLine: {
    fontSize: 14,
    color: '#343A40',
    textAlign: 'right', // Ensure bottom line is aligned to the right
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
    writingDirection: 'rtl', // Ensure RTL writing direction
    marginTop: 10, // Add some margin for spacing
  },
  
});

// **HTML Styles for English**
const htmlStyles = {
  p: {
    fontSize: 16,
    color: '#343A40',
    lineHeight: 24,
    textAlign: 'left', // Left alignment for English
    
  },
  strong: {
    fontWeight: 'bold',
    color: '#212529',
  },
  a: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
};

// **HTML Styles for Urdu**
const urduHtmlStyles = {
  p: {
    fontSize: 16,
    color: '#343A40',
    lineHeight: 28,
    textAlign: 'justify',
    // textAlignLast: 'right',
    fontFamily: 'NotoNastaliqUrdu',
    writingDirection: 'rtl',
    direction: 'rtl',
    // textJustify: 'inter-word',
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  strong: {
    fontWeight: 'bold',
    color: '#212529',
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
  },
  a: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
  },
};
const englishBaseStyle = {
  textAlign: 'left',
  fontFamily: 'System',
  writingDirection: 'ltr',
};
const urduBaseStyle = {
  textAlign: 'justify',
  // textAlignLast: 'right',
  fontFamily: 'NotoNastaliqUrdu',
  writingDirection: 'rtl',
  direction: 'rtl',
  // textJustify: 'inter-word',
  lineHeight: 28,
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
};

export default NewsDetailsScreen;
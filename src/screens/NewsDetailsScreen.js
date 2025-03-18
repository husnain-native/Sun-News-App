import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useWindowDimensions, I18nManager } from 'react-native';
import RenderHtml, { defaultHTMLElementModels } from 'react-native-render-html';
import CategoryNavigation from '../components/CategoryNavigation';

// Enable RTL layout
I18nManager.forceRTL(true); // Force RTL layout for Urdu

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

const NewsDetailsScreen = ({ route }) => {
  const news = route?.params?.news;
  const { width } = useWindowDimensions();

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No news data available.</Text>
      </View>
    );
  }

  const imageUrl = news.image ? { uri: news.image } : require('../assets/notfound.png');

  let fullContent = news.content && typeof news.content === 'string'
    ? news.content.replace(/\[\+\d+ chars\]/, '')
    : '<p>No content available.</p>';

  return (
    <View style={styles.screen}>
      {/* **Category Navigation at the Top** */}
      <CategoryNavigation />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={imageUrl} style={styles.newsImage} />
        </View>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.source}>
          {news.source?.name || 'Unknown Source'} • {news.publishedAt ? new Date(news.publishedAt).toDateString() : 'Unknown Date'}
        </Text>

        <View style={styles.contentContainer}>
          <RenderHtml
            contentWidth={width}
            source={{ html: fullContent }}
            tagsStyles={htmlStyles}
            ignoredDomTags={['iframe']}
            customHTMLElementModels={customModels}
            baseStyle={{ textAlign: 'right', fontFamily: 'NotoNastaliqUrdu' }} // RTL and Urdu font
          />
        </View>

        {/* Bottom Line Text */}
        <Text style={styles.bottomLine}>
          تس، ویذیوز نباکر ب. بنه جل گیا وی لگنگ مشکل.
        </Text>
      </ScrollView>
    </View>
  );
};

// **Styles**
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1, marginHorizontal: 16, paddingBottom: 20 },
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
    textAlign: 'right', // RTL alignment for Urdu
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
  },
  source: {
    fontSize: 14,
    color: '#bf272a',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right', // RTL alignment for Urdu
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', fontWeight: 'bold' },
  bottomLine: {
    fontSize: 14,
    color: '#343A40',
    textAlign: 'right', // Ensure bottom line is aligned to the right
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
    marginTop: 10, // Add some margin for spacing
  },
});

// **HTML Styles**
const htmlStyles = {
  p: {
    fontSize: 16,
    color: '#343A40',
    lineHeight: 24,
    textAlign: 'right', // RTL alignment for Urdu
    fontFamily: 'NotoNastaliqUrdu', // Urdu font
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

export default NewsDetailsScreen;
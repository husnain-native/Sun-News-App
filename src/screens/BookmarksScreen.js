import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Share, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryNavigation from '../components/CategoryNavigation';

const BookmarkScreen = ({ navigation }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem('bookmarkedPosts');
        if (savedBookmarks) {
          setBookmarkedPosts(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        setError(<Text style={color='#bf272a'}>Connection Failed!</Text>);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const removeBookmark = async (id) => {
    try {
      const updatedBookmarks = bookmarkedPosts.filter(item => item.id !== id);
      setBookmarkedPosts(updatedBookmarks);
      await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const sharePost = async (title, link) => {
    try {
      await Share.share({ message: `${link}` });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const renderBookmarkItem = ({ item }) => {
    if (!item || !item.id) return null;

    const title = item.title?.rendered || 'No Title';
    const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';
    const date = item.date ? new Date(item.date).toDateString() : 'Date not available';
    const isBookmarked = bookmarkedPosts.some(post => post.id === item.id);

    // Check for both video URL types
    const videoUrl = item.tie_video_url || item.tic_video_url;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BottomTabs', {
          screen: 'HOME',
          params: {
            screen: 'NewsDetails',
            params: {
              news: {
                title: item.title.rendered,
                content: item.content.rendered,
                description: item.excerpt.rendered,
                image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url,
                source: { name: 'Sun News' },
                publishedAt: item.date,
                videoUrl: videoUrl // Pass the video URL if present
              },
              fromScreen: 'SAVED' // Add this line
            }
          }
        })}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.dateContainer}>
                        <MaterialCommunityIcons name="calendar" size={24} color="#bf272a" style={{marginEnd: 5}} />
                        <Text style={styles.cardSubtitle}>{date}</Text>
                      </View>
          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={() => removeBookmark(item.id)} style={styles.iconButton}>
              <FontAwesome name="bookmark" size={20} color="#BF272a" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sharePost(title, item.link)} style={styles.iconButton}>
              <MaterialCommunityIcons name="share-variant-outline" size={20} color="#bf272a" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;
  if (error) return (
    <View style={styles.loadingContainer}>
      <Image
        source={require('../assets/error.jpg')}
        style={{ width: 200, height: 200, resizeMode: 'contain' }}
        accessibilityLabel="Error"
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Category Navigation at the Top */}
      <View style={styles.categoryNavContainer}>
        <CategoryNavigation />
      </View>

      <View style={styles.container}>
        {/* Bookmark Title with Icon */}
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="bookmark" size={34} color="#BF272a" />
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>SAVED</Text>
            <View style={styles.underline} />
          </View>
        </View>

        {bookmarkedPosts.length === 0 ? (
          <Text style={styles.noBookmarks}>No bookmarks yet</Text>
        ) : (
          <FlatList
            data={bookmarkedPosts}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderBookmarkItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryNavContainer: { width: Dimensions.get('window').width, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 15, paddingTop: 10 },
  titleContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 25, fontWeight: 'bold', padding: 10, color: '#333' },
  underline: { height: 4, backgroundColor: '#BF272a', width: '70%', marginTop: -7, borderRadius: 100, marginStart: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, paddingBottom: 10, elevation: 3 },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  iconGroup: { flexDirection: 'row' },
  iconButton: { padding: 6, borderRadius: 8, backgroundColor: '#EDEDED', marginLeft: 10 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noBookmarks: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' }
  ,
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%'
  },
  ///////////////////////////////////////
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default BookmarkScreen;

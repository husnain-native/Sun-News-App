import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Feather } from '@expo/vector-icons';

const BookmarkScreen = ({ navigation }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem('bookmarkedPosts');
        if (savedBookmarks) {
          setBookmarkedPosts(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
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
      await Share.share({ message: `${title}\nRead more: ${link}` });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const renderNewsItem = ({ item }) => {
    const title = item?.title?.rendered || 'No Title';
    const imageUrl = item?._embedded?.['wp:featuredmedia']?.[0]?.source_url || require('../assets/notfound.png');
    const date = new Date(item?.date).toDateString();

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('NewsDetails', { 
          news: {
            title: item?.title?.rendered,
            content: item?.content?.rendered,
            description: item?.excerpt?.rendered,
            image: item?._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            source: { name: 'Sun News' },
            publishedAt: item?.date
          }
        })}>
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.cardSubtitle}>{date}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => removeBookmark(item.id)}>
            <FontAwesome name="bookmark" size={22} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sharePost(title, item.link)}>
            <Feather name="share" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Posts</Text>
      {bookmarkedPosts.length === 0 ? (
        <Text style={styles.noBookmarks}>No bookmarks yet</Text>
      ) : (
        <FlatList
          data={bookmarkedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f8f8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  noBookmarks: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, elevation: 3, overflow: 'hidden', paddingBottom: 10 },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTextContainer: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default BookmarkScreen;

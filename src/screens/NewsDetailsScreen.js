import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

const NewsDetailsScreen = () => {
  const route = useRoute();
  const { postId } = route.params || {};
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://sunnewshd.tv/english/wp-json/wp/v2/posts/${postId}?_embed`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <ActivityIndicator size="large" color="#BF272a" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;
  if (!post) return <Text style={styles.errorText}>No content available</Text>;

  const imageUrl =
    typeof post._embedded?.['wp:featuredmedia']?.[0]?.source_url === 'string'
      ? { uri: post._embedded['wp:featuredmedia'][0].source_url }
      : require('../assets/notfound.png');

  return (
    <ScrollView style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title}>{post.title.rendered}</Text>
      <RenderHTML contentWidth={300} source={{ html: post.content.rendered }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  image: { width: '100%', height: 250, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#222' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 20 },
});

export default NewsDetailsScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const NewsDetailScreen = () => {
  const route = useRoute();
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://sunnewshd.tv/english/wp-json/wp/v2/posts/${postId}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <ScrollView style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="#BF272a" /> : null}
      {post && (
        <>
          <Text style={styles.title}>{post.title.rendered}</Text>
          <Text style={styles.content}>{post.content.rendered.replace(/(<([^>]+)>)/gi, '')}</Text>
        </>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#BF272a', marginBottom: 10 },
  content: { fontSize: 16, color: '#333' },
});

export default NewsDetailScreen;

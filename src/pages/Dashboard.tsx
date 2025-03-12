import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box, IconButton } from "@mui/material";
import { ThumbUp, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchPosts, likePost } from "../realtimeDB"; // ✅ Import database functions

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };
    loadPosts();
  }, []);

  const handleLike = async (postId: string, currentLikes: number) => {
    await likePost(postId, currentLikes);
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    );
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: "15px" }}>
        Dashboard
      </Typography>

      {posts.length === 0 ? (
        <Typography textAlign="center">No posts available.</Typography>
      ) : (
        posts.map((post) => (
          <Paper key={post.id} sx={{ padding: "15px", marginBottom: "10px" }}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography>{post.content.slice(0, 100)}...</Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <IconButton onClick={() => handleLike(post.id, post.likes)} color="primary">
                <ThumbUp />
              </IconButton>
              <Typography>{post.likes} Likes</Typography>

              <Button onClick={() => navigate(`/details/${post.id}`)} startIcon={<Visibility />} variant="contained">
                Read More
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Dashboard;

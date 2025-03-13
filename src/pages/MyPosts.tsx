import React, { useEffect, useState, useContext } from "react";
import { Typography, Box, Grid, Card, CardContent, CardActions, IconButton, useTheme, Skeleton } from "@mui/material";
import { Visibility, Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { ref, get, query, orderByChild, equalTo, remove } from "firebase/database";
import { toast } from 'react-toastify';

interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
}

const MyPosts: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!auth?.user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const postsRef = ref(db, 'posts');
        const userPostsQuery = query(
          postsRef,
          orderByChild('authorId'),
          equalTo(auth.user.uid)
        );

        const snapshot = await get(userPostsQuery);
        if (snapshot.exists()) {
          const postsData = snapshot.val();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const postsArray = Object.entries(postsData).map(([id, post]: [string, any]) => ({
            id,
            ...post,
          }));
          setPosts(postsArray);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load your posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [auth?.user, navigate]);

  const handleDelete = async (postId: string) => {
    if (!postId) return;
    
    try {
      await remove(ref(db, `posts/${postId}`));
      setPosts(posts.filter(post => post.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: "1200px", margin: "auto", padding: { xs: "10px", sm: "20px" } }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={24} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: { xs: "10px", sm: "20px" } }}>
      <Typography 
        variant="h4" 
        textAlign="center" 
        sx={{ 
          marginBottom: "30px",
          fontWeight: "bold",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
        }}
      >
        My Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography textAlign="center" variant="h6" color="text.secondary">
          You haven't created any posts yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card 
                sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: "bold",
                      color: theme.palette.primary.main
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {post.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(post.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton 
                      onClick={() => navigate(`/details/${post.id}`)}
                      color="primary"
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => navigate(`/edit/${post.id}`)}
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                  <IconButton 
                    onClick={() => handleDelete(post.id!)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyPosts;

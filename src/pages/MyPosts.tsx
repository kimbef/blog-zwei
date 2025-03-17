import React, { useEffect, useState, useContext } from "react";
import { Typography, Box, Grid,  IconButton, useTheme, CircularProgress, Paper, Divider, Fade } from "@mui/material";
import { Visibility, Delete, Edit, AccessTime, Article } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchUserPosts, deletePost } from "../realtimeDB";
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
        const userPosts = await fetchUserPosts(auth.user.uid);
        setPosts(userPosts);
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
      await deletePost(postId);
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
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
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: "center",
            background: theme.palette.background.default,
            borderRadius: 2
          }}
        >
          <Article sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Posts Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start sharing your thoughts by creating your first post!
          </Typography>
        </Paper>
      ) : (
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[4],
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8, 
                    display: "flex", 
                    gap: 0.5,
                    zIndex: 1
                  }}>
                    <IconButton 
                      onClick={() => navigate(`/details/${post.id}`)}
                      size="small"
                      sx={{ 
                        width: 24,
                        height: 24,
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        "&:hover": { backgroundColor: theme.palette.primary.main }
                      }}
                    >
                      <Visibility sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton 
                      onClick={() => navigate(`/edit/${post.id}`)}
                      size="small"
                      sx={{ 
                        width: 24,
                        height: 24,
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText,
                        "&:hover": { backgroundColor: theme.palette.secondary.main }
                      }}
                    >
                      <Edit sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(post.id!)}
                      size="small"
                      sx={{ 
                        width: 24,
                        height: 24,
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                        "&:hover": { backgroundColor: theme.palette.error.main }
                      }}
                    >
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      pr: 8 // Add padding to prevent text from going under the buttons
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.6
                    }}
                  >
                    {post.content}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1,
                    color: theme.palette.text.secondary
                  }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="caption">
                      Created: {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default MyPosts;

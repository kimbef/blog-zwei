import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, IconButton, useTheme, CircularProgress, Paper, Divider, Fade, Chip, Pagination } from "@mui/material";
import { Visibility, AccessTime, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchPosts, likePost } from "../realtimeDB";
import { toast } from 'react-toastify';

interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
  likes: number;
}

const POSTS_PER_PAGE = 9;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      await likePost(postId, currentLikes);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
      );
      toast.success("Post liked successfully!");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again.");
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

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
        Latest Posts
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
          <Typography variant="h6" color="text.secondary">
            No posts available.
          </Typography>
        </Paper>
      ) : (
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {paginatedPosts.map((post) => (
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
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      pr: 8
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
                    gap: 2,
                    color: theme.palette.text.secondary
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="caption">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton 
                        onClick={() => handleLike(post.id!, post.likes)}
                        size="small"
                        sx={{ 
                          width: 24,
                          height: 24,
                          color: theme.palette.error.main,
                          "&:hover": { 
                            backgroundColor: theme.palette.error.light,
                            color: theme.palette.error.contrastText
                          }
                        }}
                      >
                        <Favorite sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Chip 
                        label={`${post.likes} Likes`} 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        sx={{ 
                          borderRadius: "12px",
                          borderColor: theme.palette.error.main
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                margin: "0 4px",
              },
              "& .Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

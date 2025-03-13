import React, { useEffect, useState } from "react";
import { Typography, Button, Box, IconButton, Pagination, Skeleton, useTheme, Grid, Card, CardContent, CardActions, Chip } from "@mui/material";
import { Visibility, AccessTime, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchPosts, likePost } from "../realtimeDB"; // ✅ Import database functions
import { toast } from 'react-toastify';

interface Post {
  id?: string;
  title: string;
  content: string;
  likes: number;
  createdAt?: string;
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
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
      ) : posts.length === 0 ? (
        <Typography textAlign="center" variant="h6" color="text.secondary">
          No posts available.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedPosts.map((post) => (
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, flexDirection: "column", gap: 1 }}>
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1,
                      width: "100%",
                      justifyContent: "center"
                    }}>
                      <IconButton 
                        onClick={() => handleLike(post.id!, post.likes)} 
                        color="error"
                        size="small"
                        sx={{ 
                          transition: "transform 0.2s",
                          "&:hover": { 
                            transform: "scale(1.1)",
                            backgroundColor: theme.palette.error.light
                          }
                        }}
                      >
                        <Favorite fontSize="small" />
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
                    <Button 
                      onClick={() => navigate(`/details/${post.id!}`)} 
                      startIcon={<Visibility />} 
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{ 
                        borderRadius: "20px",
                        textTransform: "none",
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

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
        </>
      )}
    </Box>
  );
};

export default Dashboard;

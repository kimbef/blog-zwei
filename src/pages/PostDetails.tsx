import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Paper, Typography, Button, Box, TextField, IconButton, useTheme, useMediaQuery, Fade, Divider } from "@mui/material";
import { Star, StarBorder, ThumbUp, ThumbDown, Send, Reply } from "@mui/icons-material";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';

interface Comment {
  id: string;
  text: string;
  authorId: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  ratings: number[];
  likes: number;
  comments: Comment[];
}

const PostDetails: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [showReplyInput, setShowReplyInput] = useState<{ [key: string]: boolean }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = ref(db, `posts/${id}`);
        const snapshot = await get(postRef);
        if (snapshot.exists()) {
          const postData = snapshot.val();
          setPost({
            id: snapshot.key!,
            ...postData,
            comments: postData.comments ? postData.comments : [],
            ratings: postData.ratings ? postData.ratings : [],
            likes: postData.likes ? postData.likes : 0,
          } as Post);
        } else {
          toast.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  const handleRate = async (star: number) => {
    if (!post) return;
    try {
      const updatedRatings = [...post.ratings, star];
      await update(ref(db, `posts/${id}`), { ratings: updatedRatings });
      setPost((prev) => prev && { ...prev, ratings: updatedRatings });
      setRating(star);
      toast.success("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    try {
      await update(ref(db, `posts/${id}`), { likes: post.likes + 1 });
      setPost((prev) => prev && { ...prev, likes: post.likes + 1 });
      toast.success("Post liked successfully!");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again.");
    }
  };

  const handleComment = async () => {
    if (!post || !commentText.trim()) return;
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        authorId: auth?.user?.uid || "",
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      const updatedComments = [...post.comments, newComment];
      await update(ref(db, `posts/${id}`), { comments: updatedComments });
      setPost((prev) => prev && { ...prev, comments: updatedComments });
      setCommentText("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleReplyClick = (commentId: string) => {
    setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReply = async (commentId: string) => {
    if (!post || !replyText[commentId]?.trim()) return;
    try {
      const newReply: Comment = {
        id: Date.now().toString(),
        text: replyText[commentId],
        authorId: auth?.user?.uid || "",
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      const updatedComments = post.comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment
      );

      await update(ref(db, `posts/${id}`), { comments: updatedComments });
      setPost((prev) => prev && { ...prev, comments: updatedComments });
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  const handleLikeDislikeComment = async (commentId: string, type: "like" | "dislike") => {
    if (!post) return;
    try {
      const updatedComments = post.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: type === "like" ? comment.likes + 1 : comment.likes,
              dislikes: type === "dislike" ? comment.dislikes + 1 : comment.dislikes,
            }
          : comment
      );

      await update(ref(db, `posts/${id}`), { comments: updatedComments });
      setPost((prev) => prev && { ...prev, comments: updatedComments });
      toast.success(`${type === "like" ? "Liked" : "Disliked"} comment successfully!`);
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(`Failed to ${type} comment. Please try again.`);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: "800px", 
      margin: "auto", 
      padding: { xs: "10px", sm: "20px" },
      minHeight: "100vh",
      backgroundColor: theme.palette.background.default
    }}>
      <Fade in={!!post} timeout={500}>
        {post ? (
          <Paper 
            elevation={3} 
            sx={{ 
              padding: { xs: "15px", sm: "25px" },
              borderRadius: "12px",
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}
          >
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              sx={{ 
                fontWeight: "bold",
                marginBottom: "15px",
                color: theme.palette.primary.main
              }}
            >
              {post.title}
            </Typography>
            
            <Typography 
              sx={{ 
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.6,
                color: theme.palette.text.secondary
              }}
            >
              {post.content}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Post Actions */}
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center", 
              marginTop: "15px",
              justifyContent: { xs: "center", sm: "flex-start" }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton 
                  color="primary" 
                  onClick={handleLikePost}
                  sx={{ 
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" }
                  }}
                >
                  <ThumbUp />
                </IconButton>
                <Typography variant="body1">{post.likes} Likes</Typography>
              </Box>

              {/* Rating Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1">Rate:</Typography>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton 
                    key={star} 
                    onClick={() => handleRate(star)}
                    sx={{ 
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" }
                    }}
                  >
                    {rating && rating >= star ? 
                      <Star color="primary" /> : 
                      <StarBorder color="action" />
                    }
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: "15px",
                  color: theme.palette.primary.main
                }}
              >
                Comments
              </Typography>
              
              <Box sx={{ 
                display: "flex", 
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
                mb: 3
              }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Write a comment..." 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)}
                  sx={{ 
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    }
                  }}
                />
                <Button 
                  onClick={handleComment} 
                  startIcon={<Send />} 
                  variant="contained"
                  sx={{ 
                    borderRadius: "25px",
                    px: 3,
                    minWidth: { xs: "100%", sm: "auto" }
                  }}
                >
                  Post
                </Button>
              </Box>

              {/* Comments List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {post.comments.map((comment) => (
                  <Paper 
                    key={comment.id} 
                    sx={{ 
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: theme.palette.background.default,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateX(5px)" }
                    }}
                  >
                    <Typography sx={{ mb: 1 }}>{comment.text}</Typography>
                    <Box sx={{ 
                      display: "flex", 
                      gap: 1, 
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleLikeDislikeComment(comment.id, "like")}
                        size="small"
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="secondary" 
                        onClick={() => handleLikeDislikeComment(comment.id, "dislike")}
                        size="small"
                      >
                        <ThumbDown fontSize="small" />
                      </IconButton>
                      <Button 
                        startIcon={<Reply />} 
                        onClick={() => handleReplyClick(comment.id)}
                        size="small"
                        sx={{ borderRadius: "15px" }}
                      >
                        Reply
                      </Button>
                    </Box>

                    {/* Reply Input Field */}
                    {showReplyInput[comment.id] && (
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a reply..."
                          value={replyText[comment.id] || ""}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          sx={{ 
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleReply(comment.id)}
                          startIcon={<Send />}
                          sx={{ borderRadius: "20px" }}
                        >
                          Send
                        </Button>
                      </Box>
                    )}

                    {/* Replies List */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ mt: 2, ml: 4 }}>
                        {comment.replies.map((reply) => (
                          <Paper
                            key={reply.id}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              borderRadius: "8px",
                              backgroundColor: theme.palette.background.paper,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            <Typography variant="body2">{reply.text}</Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
                              <IconButton 
                                color="primary" 
                                onClick={() => handleLikeDislikeComment(reply.id, "like")}
                                size="small"
                              >
                                <ThumbUp fontSize="small" />
                              </IconButton>
                              <IconButton 
                                color="secondary" 
                                onClick={() => handleLikeDislikeComment(reply.id, "dislike")}
                                size="small"
                              >
                                <ThumbDown fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          </Paper>
        ) : (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "50vh" 
          }}>
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        )}
      </Fade>
    </Box>
  );
};

export default PostDetails;

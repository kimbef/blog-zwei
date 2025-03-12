import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Paper, Typography, Button, Box, TextField, IconButton } from "@mui/material";
import { Star, StarBorder, ThumbUp, ThumbDown, Send, Reply, Edit, Delete } from "@mui/icons-material";
import { db } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import { AuthContext } from "../context/AuthContext";

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
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchPost = async () => {
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
      }
    };

    fetchPost();
  }, [id]);

  const handleRate = async (star: number) => {
    if (!post) return;
    const updatedRatings = [...post.ratings, star];

    await update(ref(db, `posts/${id}`), { ratings: updatedRatings });

    setPost((prev) => prev && { ...prev, ratings: updatedRatings });
    setRating(star);
  };

  const handleLikePost = async () => {
    if (!post) return;
    await update(ref(db, `posts/${id}`), { likes: post.likes + 1 });

    setPost((prev) => prev && { ...prev, likes: post.likes + 1 });
  };

  const handleComment = async () => {
    if (!post || !commentText.trim()) return;
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
  };

  const handleReply = async (commentId: string) => {
    if (!post || !replyText[commentId]?.trim()) return;

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
  };

  const handleLikeDislikeComment = async (commentId: string, type: "like" | "dislike") => {
    if (!post) return;

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
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      {post ? (
        <Paper sx={{ padding: "15px" }}>
          <Typography variant="h4">{post.title}</Typography>
          <Typography>{post.content}</Typography>

          {/* Post Likes */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <IconButton color="primary" onClick={handleLikePost}>
              <ThumbUp />
            </IconButton>
            <Typography>{post.likes} Likes</Typography>
          </Box>

          {/* ⭐ Rating Section */}
          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            Rate this Post
          </Typography>
          <Box>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton key={star} onClick={() => handleRate(star)}>
                {rating && rating >= star ? <Star color="primary" /> : <StarBorder />}
              </IconButton>
            ))}
          </Box>

          {/* 💬 Comments Section */}
          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            Comments
          </Typography>
          <TextField fullWidth variant="outlined" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ marginBottom: "10px" }} />
          <Button onClick={handleComment} startIcon={<Send />} variant="contained">
            Post Comment
          </Button>

          {/* 📝 Display Comments */}
          {post.comments.map((comment) => (
            <Paper key={comment.id} sx={{ marginTop: "10px", padding: "10px" }}>
              <Typography>{comment.text}</Typography>
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <IconButton color="primary" onClick={() => handleLikeDislikeComment(comment.id, "like")}>
                  <ThumbUp />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleLikeDislikeComment(comment.id, "dislike")}>
                  <ThumbDown />
                </IconButton>
                <Button startIcon={<Reply />} onClick={() => handleReply(comment.id)}>
                  Reply
                </Button>
              </Box>
            </Paper>
          ))}
        </Paper>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default PostDetails;

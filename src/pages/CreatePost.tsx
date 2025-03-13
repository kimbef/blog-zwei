import React, { useState, useContext } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';

const CreatePost: React.FC = () => {
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!auth?.user) {
      toast.error("You must be logged in to create a post.");
      return;
    }

    try {
      const postRef = ref(db, "posts");
      await push(postRef, {
        title,
        content,
        authorId: auth.user.uid,
        createdAt: new Date().toISOString(),
        likes: 0,
        ratings: [],
        comments: []
      });

      setTitle("");
      setContent("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h5" textAlign="center">Create a New Post</Typography>

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Content"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Post
      </Button>
    </Paper>
  );
};

export default CreatePost;

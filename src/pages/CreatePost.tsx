import React, { useState, useContext } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import { AuthContext } from "../context/AuthContext";

const CreatePost: React.FC = () => {
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!auth?.user) return alert("You must be logged in to create a post.");

    const postRef = ref(db, "posts");
    await push(postRef, {
      title,
      content,
      authorId: auth.user.uid, // ✅ Store the logged-in user's ID
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setContent("");
    alert("Post created successfully!");
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

import React, { useEffect, useState, useContext } from "react";
import { Paper, Typography, Button, Box, IconButton, TextField } from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { ref, onValue, remove, update } from "firebase/database";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

const MyPosts: React.FC = () => {
  const auth = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");

  useEffect(() => {
    if (!auth?.user) return;

    const postsRef = ref(db, "posts");
    
    onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allPosts = snapshot.val();
        const userPosts = Object.keys(allPosts)
          .map((key) => ({
            id: key,
            ...allPosts[key],
          }))
          .filter((post) => post.authorId === auth.user?.uid); // ✅ Filter only the logged-in user's posts

        setMyPosts(userPosts);
      } else {
        setMyPosts([]);
      }
    });
  }, [auth?.user]);

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await remove(ref(db, `posts/${postId}`));
    setMyPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditedTitle("");
    setEditedContent("");
  };

  const handleSaveEdit = async (postId: string) => {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, { title: editedTitle, content: editedContent });

    setMyPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, title: editedTitle, content: editedContent } : post
      )
    );

    setEditingPost(null);
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: "15px" }}>
        My Posts
      </Typography>

      {myPosts.length === 0 ? (
        <Typography textAlign="center">No posts found.</Typography>
      ) : (
        myPosts.map((post) => (
          <Paper key={post.id} sx={{ padding: "15px", marginBottom: "10px" }}>
            {editingPost === post.id ? (
              <>
                {/* Edit Mode */}
                <TextField
                  fullWidth
                  label="Edit Title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  sx={{ marginBottom: "10px" }}
                />
                <TextField
                  fullWidth
                  label="Edit Content"
                  multiline
                  rows={4}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  sx={{ marginBottom: "10px" }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="primary" startIcon={<Save />} onClick={() => handleSaveEdit(post.id)}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" startIcon={<Cancel />} onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* View Mode */}
                <Typography variant="h6">{post.title}</Typography>
                <Typography>{post.content.slice(0, 100)}...</Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <IconButton color="error" onClick={() => handleDelete(post.id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEdit(post)}>
                    <Edit />
                  </IconButton>
                </Box>
              </>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default MyPosts;

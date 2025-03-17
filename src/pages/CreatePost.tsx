import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  useTheme,
  CircularProgress,
  Fade
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { createPost } from "../realtimeDB";
import { toast } from 'react-toastify';

const CreatePost: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.user) return;

    try {
      setSaving(true);
      const postData = {
        title,
        content,
        authorId: auth.user.uid,
        createdAt: new Date().toISOString(),
        likes: 0,
        ratings: [],
        comments: [],
      };
      await createPost(postData);
      toast.success("Post created successfully!");
      navigate('/my-posts');
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: "800px", 
      margin: "auto", 
      padding: { xs: "10px", sm: "20px" } 
    }}>
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
        Create New Post
      </Typography>

      <Fade in timeout={500}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: theme.palette.background.paper,
            transition: "all 0.3s ease",
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              boxShadow: theme.shadows[4],
              borderColor: theme.palette.primary.main
            }
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              required
            />

            <TextField
              fullWidth
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={10}
              sx={{ mb: 3 }}
              variant="outlined"
              required
            />

            <Box sx={{ 
              display: "flex", 
              gap: 2, 
              justifyContent: "flex-end" 
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/my-posts')}
                disabled={saving}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSubmit}
                disabled={saving || !title.trim() || !content.trim()}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  }
                }}
              >
                Create Post
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default CreatePost;

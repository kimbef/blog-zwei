import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  useTheme,
  CircularProgress
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import { toast } from 'react-toastify';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
}

const EditPost: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !auth?.user) {
        navigate('/my-posts');
        return;
      }

      try {
        setLoading(true);
        const postRef = ref(db, `posts/${id}`);
        const snapshot = await get(postRef);
        
        if (snapshot.exists()) {
          const postData = snapshot.val();
          if (postData.authorId !== auth.user.uid) {
            toast.error("You don't have permission to edit this post");
            navigate('/my-posts');
            return;
          }
          setTitle(postData.title);
          setContent(postData.content);
        } else {
          toast.error("Post not found");
          navigate('/my-posts');
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post. Please try again later.");
        navigate('/my-posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, auth?.user, navigate]);

  const handleSave = async () => {
    if (!id || !title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      const postRef = ref(db, `posts/${id}`);
      await update(postRef, {
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString()
      });
      
      toast.success("Post updated successfully!");
      navigate('/my-posts');
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setSaving(false);
    }
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
    <Box sx={{ 
      maxWidth: "800px", 
      margin: "auto", 
      padding: { xs: "10px", sm: "20px" } 
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: "bold",
            color: theme.palette.primary.main
          }}
        >
          Edit Post
        </Typography>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
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
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPost; 
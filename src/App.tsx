import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import MyPosts from './pages/MyPosts';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './auth/Profile.tsx'; 
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost'; 
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/details/:id" element={<PostDetails />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/edit/:id" element={<EditPost />} />
            </Routes>
          </Layout>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </AuthProvider>
      <SpeedInsights />
    </ThemeProvider>
  );
};

export default App;

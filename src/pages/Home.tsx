import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  useTheme, 
  useMediaQuery,
  Fade,
  IconButton,
  useScrollTrigger,
  Zoom,
  Fab,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  alpha
} from "@mui/material";
import { 
  ArrowForward, 
  Create, 
  Explore, 
  Favorite, 
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  KeyboardArrowUp,
  PlayArrow,
  Star
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Scroll to top component
const ScrollTop = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const anchor = ((event.target as HTMLButtonElement).ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Tooltip title="Scroll to top" arrow>
        <Fab
          color="primary"
          size="small"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
            }
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Create fontSize="large" />,
      title: "Create Beautiful Posts",
      description: "Share your thoughts and ideas with our intuitive post editor.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: theme.palette.primary.main
    },
    {
      icon: <Explore fontSize="large" />,
      title: "Explore Content",
      description: "Discover amazing stories and connect with other writers.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: theme.palette.secondary.main
    },
    {
      icon: <Favorite fontSize="large" />,
      title: "Engage with Others",
      description: "Like, comment, and interact with the community.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: theme.palette.error.main
    },
    {
      icon: <TrendingUp fontSize="large" />,
      title: "Trending Topics",
      description: "Stay updated with the most popular discussions.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: theme.palette.success.main
    }
  ];

  return (
    <Box>
      <div id="back-to-top-anchor" />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant={isMobile ? "h3" : "h2"}
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: { xs: '50%', md: '0' },
                    transform: { xs: 'translateX(-50%)', md: 'none' },
                    width: '60px',
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '2px'
                  }
                }}
              >
                Share Your Story
                <br />
                With The World
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: { xs: '100%', md: '600px' }
                }}
              >
                Join our community of writers and readers. Create, share, and discover amazing stories.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Explore Posts
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={feature.image}
                      alt={feature.title}
                      sx={{
                        transition: 'all 0.3s ease',
                        transform: hoveredFeature === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, ${alpha(feature.color, 0.2)}, ${alpha(feature.color, 0.8)})`,
                        opacity: hoveredFeature === index ? 1 : 0,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          color: feature.color,
                          mb: 2
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: 8,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.3)})`,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              mb: 4,
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Join our community today and start sharing your stories with the world.
      </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              startIcon={<Star />}
              sx={{
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
                }
              }}
            >
              Sign Up Now
        </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          py: 4, 
          background: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  color="primary"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  color="primary"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  color="primary"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  color="primary"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'left', md: 'right' }}>
                © {new Date().getFullYear()} Kimbeff's Blog. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
    </Container>
      </Box>

      <ScrollTop />
    </Box>
  );
};

export default Home;

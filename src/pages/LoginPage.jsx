import React, { useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { handleCallback, login } = useGoogleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("google_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #fbbc04 0%, #4285F4 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glassmorphism effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backdropFilter: 'blur(8px)',
          opacity: 0.7,
        }}
      />
      <Card
        elevation={12}
        sx={{
          borderRadius: 6,
          padding: 5,
          textAlign: 'center',
          minWidth: 350,
          maxWidth: 400,
          zIndex: 1,
          background: 'rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px 0 rgba(66,133,244,0.25)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)',
          transition: 'box-shadow 0.3s',
        }}
      >
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="Keep" style={{ width: 56, height: 56, marginBottom: 8 }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#222', letterSpacing: 1, mb: 1 }}>
            Welcome Back 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: 18 }}>
            Sign in with Google to continue
          </Typography>
          <Box mt={5}>
            <Button
              onClick={login}
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(90deg, #4285F4 60%, #fbbc04 100%)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
                padding: '12px 24px',
                borderRadius: '16px',
                boxShadow: '0 4px 16px 0 rgba(66,133,244,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #357ae8 60%, #ffe066 100%)',
                  boxShadow: '0 8px 32px 0 rgba(251,188,4,0.25)',
                },
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: 26, height: 26 }}
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                     1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                     3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 
                     1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                     20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                     8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 
                     2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 
                     7.07l3.66 2.84c.87-2.6 3.3-4.53 
                     6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    
  );
};

export default LoginPage;

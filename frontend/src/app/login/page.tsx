// src/app/login/page.tsx
"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Button, TextField, Container, Box, Typography, Link as MuiLink } from '@mui/material';

// Define the expected response type from the login API
interface LoginResponse {
  key: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //setError("");
    try {
      // 2. Pass the interface as a generic type to axios.post.
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
        { username, password }
      );

      // Now TypeScript knows response.data has a 'key' property.
      login(response.data.key);
      router.push("/dashboard");

    } catch (err) {
      showNotification("نام کاربری یا رمز عبور اشتباه است.", "error");
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{

          p:3,
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          ورود به دارویار
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ورود
          </Button>
          <Box textAlign="center">
            <MuiLink component={Link} href="/register" variant="body2">
              {"حساب کاربری ندارید؟ ثبت‌نام کنید"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
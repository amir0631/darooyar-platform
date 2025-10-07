// frontend/src/app/register/page.tsx
// Corrected version

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, TextField, Container, Box, Typography, Alert, Link as MuiLink } from '@mui/material';
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState(""); 
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password1 !== password2) {
      setError("رمزهای عبور با یکدیگر مطابقت ندارند.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/registration/`,
        { username, email, password1, password2 } 
      );
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
      } else {
        setError("یک خطای پیش‌بینی نشده رخ داد.");
      }
      console.error(err);
    }
  };

  if (success) {
    // ... (this part remains the same)
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ 
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 3,
        p:3,
        }}>
        <Typography component="h1" variant="h5">
          ایجاد حساب کاربری جدید
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="username" label="نام کاربری" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth id="email" label="آدرس ایمیل" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {/* --- CHANGE 3: Update props for the first password field --- */}
          <TextField margin="normal" required fullWidth name="password" label="رمز عبور" type="password" id="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password2" label="تکرار رمز عبور" type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />

          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            ثبت‌نام
          </Button>
          <Box textAlign="center">
            <MuiLink component={Link} href="/login" variant="body2">
              {"حساب کاربری دارید؟ وارد شوید"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
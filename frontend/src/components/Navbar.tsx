// frontend/src/components/Navbar.tsx
// ورژن ۲.۰
// بازسازی کامل نوبار با استفاده از کامپوننت‌های MUI

"use client";

import { useAuth } from "@/context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box, Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  const { authToken, logout, isLoading } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <MuiLink component={Link} href="/" underline="none" color="inherit">
            دارویار
          </MuiLink>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoading ? (
            <Typography variant="body2">در حال بارگذاری...</Typography>
          ) : authToken ? (
            <>
              <Button component={Link} href="/dashboard" color="inherit">
              داشبورد داروخانه
              </Button>
              
              <Button variant="outlined" color="error" onClick={logout}>
                خروج
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} href="/login" color="primary" variant="contained">
                ورود
              </Button>
              <Button component={Link} href="/register" color="inherit">
                ثبت‌نام
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
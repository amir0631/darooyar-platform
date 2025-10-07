// frontend/src/app/dashboard/page.tsx
// ورژن ۱.۱
// افزودن بج عددی به آیتم منوی درخواست‌ها

"use client";

import { Container, Grid, Paper, Typography, Link as MuiLink, Badge } from '@mui/material';
import Link from 'next/link';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

const menuItems = [
  {
    title: 'درخواست‌های من',
    description: 'درخواست‌های ارسالی و دریافتی خود را مدیریت کنید.',
    link: '/dashboard/my-requests',
    icon: <PlaylistAddCheckIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'دارو های من',
    description: 'داروهای ثبت شده خود را مدیریت کنید.',
    link: '/dashboard/my-drugs', // Note: This links to add-drug, consider a dedicated page later
    icon: <PostAddIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'داروهای موجود',
    description: 'لیست داروهای موجود در شبکه را مشاهده و جستجو کنید.',
    link: '/dashboard/available-drugs',
    icon: <MedicalServicesIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'ثبت داروی مازاد',
    description: 'داروهای مازاد یا نزدیک به انقضای خود را ثبت کنید.',
    link: '/dashboard/add-drug',
    icon: <PostAddIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'درخواست دارو',
    description: 'درخواست داروهای مورد نیاز خود را ثبت کنید.',
    link: '/dashboard/available-drugs', // Note: This links to the list to start a request
    icon: <PostAddIcon color="primary" sx={{ fontSize: 40 }} />,
  },
];


export default function DashboardPage() {
    const { user, authToken, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !authToken) {
        router.push('/login');
        }
    }, [authToken, isAuthLoading, router]);

    if (isAuthLoading || !authToken) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
        );
    }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        داشبورد
      </Typography>
      <Grid container spacing={4}>
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, md: 4}} key={item.title}>
            <MuiLink component={Link} href={item.link} underline="none" sx={{ display: 'block', height: '100%' }}>
              
              {/* بخش کلیدی: افزودن شرطی بج برای آیتم "درخواست‌های من" */}
              {item.title === 'درخواست‌های من' && user && user.pending_requests_count > 0 ? (
                <Badge badgeContent={user.pending_requests_count} color="error" sx={{ width: '100%', height: '100%' }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%',
                      width: '100%',
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.description}
                    </Typography>
                  </Paper>
                </Badge>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {item.description}
                  </Typography>
                </Paper>
              )}
            </MuiLink>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
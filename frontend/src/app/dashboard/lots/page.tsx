// frontend/src/app/dashboard/lots/page.tsx
// ورژن ۱.۰
// صفحه نمایش لیست بسته‌های دارویی موجود

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Paper, Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

interface Drug {
    id: number;
    brand_name: string;
    quantity: number;
}

interface DrugLot {
  id: number;
  title: string;
  description: string;
  drugs: Drug[]; // لیست داروهای داخل بسته
}

export default function LotsPage() {
  const [lots, setLots] = useState<DrugLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authToken) {
      router.push('/login');
      return;
    }

    const fetchLots = async () => {
      try {
        const response = await apiClient.get('/lots/');
        setLots(response.data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات بسته‌ها.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLots();
  }, [authToken, isAuthLoading, router]);

  if (isLoading || isAuthLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title="بسته‌های دارویی موجود در شبکه" />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {lots.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">در حال حاضر هیچ بسته‌ای برای نمایش وجود ندارد.</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {lots.map((lot) => (
          <Grid item key={lot.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {lot.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {lot.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  محتویات بسته ({lot.drugs.length} قلم):
                </Typography>
                <Box component="ul" sx={{ pl: 2, maxHeight: 100, overflow: 'auto' }}>
                  {lot.drugs.map(drug => (
                    <li key={drug.id}>
                      <Typography variant="body2">{drug.brand_name} (تعداد: {drug.quantity})</Typography>
                    </li>
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                 {/* TODO: Add link to lot detail page */}
                 <Button fullWidth variant="outlined">
                   مشاهده و درخواست بسته
                 </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
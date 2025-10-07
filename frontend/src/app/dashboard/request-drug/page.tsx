// frontend/src/app/dashboard/request-drug/page.tsx
// ورژن ۱.۰
// صفحه ثبت درخواست دارو

"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { Container, Box, Typography, Grid, TextField, Button, CircularProgress } from '@mui/material';
import PageHeader from '@/components/PageHeader';

export default function RequestDrugPage() {
  const [formData, setFormData] = useState({
    brand_name: '', generic_name: '', dose: '',
    form: '', quantity_needed: '1',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/inquiries/', {
        ...formData,
        quantity_needed: parseInt(formData.quantity_needed),
      });
      showNotification('درخواست داروی شما با موفقیت در شبکه ثبت شد.', 'success');
      router.push('/dashboard');
    } catch (error) {
      showNotification('خطا در ثبت درخواست.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <PageHeader title="ثبت درخواست دارو در شبکه" />
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6}}>
            <TextField name="brand_name" required fullWidth label="نام تجاری دارو" value={formData.brand_name} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6}}>
            <TextField name="generic_name" required fullWidth label="نام ژنریک دارو" value={formData.generic_name} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6}}>
            <TextField name="dose" required fullWidth label="دوز" value={formData.dose} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6}}>
            <TextField name="form" required fullWidth label="شکل دارویی" value={formData.form} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12}}>
            <TextField name="quantity_needed" required fullWidth label="تعداد مورد نیاز" type="number" inputProps={{ min: 1 }} value={formData.quantity_needed} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12}}>
            <Button type="submit" variant="contained" disabled={isLoading} fullWidth sx={{ py: 1.5, mt: 2 }}>
              {isLoading ? <CircularProgress size={24} /> : 'ثبت درخواست در شبکه'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
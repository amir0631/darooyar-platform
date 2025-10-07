// frontend/src/app/dashboard/profile/page.tsx
// ورژن ۱.۰
// صفحه پروفایل کاربر

"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { Container, Box, Typography, Grid, TextField, Button, CircularProgress, Paper, Avatar } from '@mui/material';
import PageHeader from '@/components/PageHeader';

const avatars = [
  { id: 'avatar1', src: '/avatars/avatar1.png' },
  { id: 'avatar2', src: '/avatars/avatar2.png' },
  { id: 'avatar3', src: '/avatars/avatar3.png' },
  { id: 'avatar4', src: '/avatars/avatar4.png' },
];
// نکته: شما باید فایل‌های آواتار را در پوشه `frontend/public/avatars/` قرار دهید.

export default function ProfilePage() {
  const { user, fetchUser } = useAuth(); // fetchUser برای رفرش کردن اطلاعات کاربر در context
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({ 
    first_name: '',
    last_name: '',
    avatar: '',
    pharmacy_name: '',
    license_number: '',
    mobile_number: '',
    address_loc: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        avatar: user.avatar || 'avatar1',
        pharmacy_name: user.pharmacy_name || '',
        license_number: user.license_number || '',
        mobile_number: user.mobile_number || '',
        address_loc: user.address_loc || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (avatarId: string) => {
    setFormData({ ...formData, avatar: avatarId });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
try {
      const { first_name, last_name, avatar, pharmacy_name, license_number, mobile_number, address_loc } = formData;
      await apiClient.patch('/auth/user/', { first_name, last_name, avatar, pharmacy_name, license_number, mobile_number, address_loc });
      showNotification('پروفایل با موفقیت به‌روزرسانی شد.', 'success');
      await fetchUser(localStorage.getItem('authToken')!);
    } catch (error) {
      showNotification('خطا در به‌روزرسانی پروفایل.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <PageHeader title="پروفایل من" />
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* بخش آواتار */}
            <Grid size={{ xs: 12,}} sx={{ textAlign: 'center' }}>
              <Typography gutterBottom>آواتار خود را انتخاب کنید</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                {avatars.map((av) => (
                  <Avatar
                    key={av.id} src={av.src} onClick={() => handleAvatarSelect(av.id)}
                    sx={{
                      width: 80, height: 80, cursor: 'pointer',
                      border: formData.avatar === av.id ? '3px solid' : '3px solid transparent',
                      borderColor: formData.avatar === av.id ? 'primary.main' : 'transparent',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* بخش اطلاعات فردی */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="first_name" fullWidth label="نام" value={formData.first_name} onChange={handleChange} required/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="last_name" fullWidth label="نام خانوادگی" value={formData.last_name} onChange={handleChange} required/>
            </Grid>

            {/* بخش اطلاعات داروخانه */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="pharmacy_name" fullWidth label="نام داروخانه" value={formData.pharmacy_name} onChange={handleChange} required/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="license_number" fullWidth label="شماره پروانه" value={formData.license_number} onChange={handleChange} required/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="mobile_number" fullWidth label="شماره موبایل" value={formData.mobile_number} onChange={handleChange} required/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="address_loc" fullWidth label="آدرس" value={formData.address_loc} onChange={handleChange} required/>
            </Grid>

            {/* دکمه ذخیره */}
            <Grid size={{ xs: 12}}>
              <Button type="submit" variant="contained" disabled={isLoading} fullWidth sx={{ py: 1.5, mt: 2 }}>
                {isLoading ? <CircularProgress size={24} /> : 'ذخیره تغییرات'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
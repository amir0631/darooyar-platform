// frontend/src/app/drugs/[id]/edit/page.tsx
// ورژن ۱.۰
// صفحه ویرایش دارو

"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { Container, Box, Typography, Grid, TextField, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, } from '@mui/material';
import PageHeader from '@/components/PageHeader';

export default function EditDrugPage() {
  const [formData, setFormData] = useState({
    brand_name: '', generic_name: '', dose: '', form: '',
    manufacturer: '', expiry_date: '', quantity: '1',
    batch_number: '', drug_type: 'surplus',
  });
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!id) return;
    const fetchDrug = async () => {
      try {
        const response = await apiClient.get(`/drugs/${id}/`);
        // Format the date for the date input field
        const expiryDate = response.data.expiry_date.split('T')[0];
        setFormData({ ...response.data, expiry_date: expiryDate });
      } catch (_err) {
        showNotification('خطا در دریافت اطلاعات دارو.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrug();
  }, [id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.patch(`/drugs/${id}/`, {
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      showNotification('دارو با موفقیت ویرایش شد!', 'success');
      router.push(`/drugs/${id}`);
    } catch (err) {
      showNotification('خطا در ویرایش دارو.', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <PageHeader title={`ویرایش داروی ${formData.brand_name}`} />
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Grid container spacing={2}>
             {/* Grid items for TextFields, similar to AddDrugPage, but with 'name' attributes */}
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="brand_name" required fullWidth label="نام تجاری" value={formData.brand_name} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="generic_name" required fullWidth label="نام ژنریک" value={formData.generic_name} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="dose" required fullWidth label="دوز" value={formData.dose} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="form" required fullWidth label="شکل دارویی" value={formData.form} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="manufacturer" required fullWidth label="شرکت سازنده" value={formData.manufacturer} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="batch_number" required fullWidth label="شماره بچ" value={formData.batch_number} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="expiry_date" required fullWidth label="تاریخ انقضا" type="date" InputLabelProps={{ shrink: true }} value={formData.expiry_date} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6,}}>
              <TextField name="quantity" required fullWidth label="تعداد" type="number" inputProps={{ min: 0 }} value={formData.quantity} onChange={handleChange} />
            </Grid>
          </Grid>
          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">وضعیت دارو</FormLabel>
            <RadioGroup row name="drug_type" value={formData.drug_type} onChange={handleChange}>
              <FormControlLabel value="surplus" control={<Radio />} label="مازاد" />
              <FormControlLabel value="near_expiry" control={<Radio />} label="نزدیک به انقضا" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {isLoading ? <CircularProgress size={24} /> : 'ذخیره تغییرات'}
          </Button>
        </Box>
    </Container>
  );
}
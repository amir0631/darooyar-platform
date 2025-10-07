// frontend/src/app/drugs/[id]/page.tsx
// ورژن ۲.۰
// بازسازی کامل صفحه جزئیات و مودال درخواست با MUI

"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  TextField,
} from '@mui/material';

interface DrugDetails {
  id: number;
  generic_name: string;
  brand_name: string;
  dose: string;
  form: string;
  manufacturer: string;
  expiry_date: string;
  quantity: number;
  batch_number: string;
  storage_conditions: string | null;
  owner: number;
  price: number;
  tracking_id: string;
}

export default function DrugDetailPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const [drug, setDrug] = useState<DrugDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();


  const handleDeleteDrug = async () => {
    if (!drug) return;
    try {
      await apiClient.delete(`/drugs/${drug.id}/`);
      showNotification('دارو با موفقیت حذف شد.', 'success');
      router.push('/dashboard/available-drugs'); // هدایت به لیست داروها
    } catch (error) {
      showNotification('خطا در حذف دارو.', 'error');
      console.error(error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchDrugDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/drugs/${id}/`);
        setDrug(response.data as DrugDetails);
        
      } catch (_err) { 

        showNotification('خطا در ثبت دارو. لطفاً تمام فیلدها را بررسی کنید.', 'error');

      } finally {
        setIsLoading(false);
      }
    };
    fetchDrugDetails();
  }, [id]);

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/exchanges/', {
        drug: drug?.id,
        quantity_requested: quantity,
      });
      showNotification('درخواست شما با موفقیت ثبت شد!', 'success');
      setIsModalOpen(false);
    } catch (_err) {
      showNotification('خطا در ثبت درخواست.', 'error');
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  //if (error) return <Container><Alert severity="error" sx={{ mt: 4 }}>{error}</Alert></Container>;
  if (!drug) return <Container><Alert severity="warning" sx={{ mt: 4 }}>دارویی یافت نشد.</Alert></Container>;

  const isOwner = user?.pk === drug.owner;

  return (
    <>
    <PageHeader title="بازگشت" />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>{drug.brand_name}</Typography>
            <Typography variant="h5" color="primary.main" gutterBottom>{drug.price.toLocaleString('fa-IR')} تومان</Typography>
          </div>
          <Chip label={`#${drug.tracking_id}`} color="secondary" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>شکل دارویی:</strong> {drug.form}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>شرکت سازنده:</strong> {drug.manufacturer}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>تعداد موجود:</strong> {drug.quantity}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>شماره بچ:</strong> {drug.batch_number}</Typography></Grid>
            <Grid size={{ xs: 12}}><Typography color="error"><strong>تاریخ انقضا:</strong> {drug.expiry_date}</Typography></Grid>
            <Typography variant="h6" color="primary.main" gutterBottom>
              {drug.price.toLocaleString('fa-IR')} تومان
            </Typography>
            {drug.storage_conditions && <Grid size={{ xs: 12}}><Typography><strong>شرایط نگهداری:</strong> {drug.storage_conditions}</Typography></Grid>}
          </Grid>
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            {isOwner ? (
              <Box>
              <Alert severity="info">این دارو متعلق به شماست و قابل درخواست نمی‌باشد.</Alert>
              <Box sx={{display: 'flex', gap: 5, paddingTop:2, }}>
                <Button component={Link} href={`/dashboard/drugs/${drug.id}/edit`} fullWidth variant="contained" color="secondary">
                  ویرایش دارو
                </Button>
                {/* --- دکمه جدید حذف --- */}
                <Button onClick={() => setOpenDeleteDialog(true)} fullWidth variant="contained" color="error">
                 حذف دارو
                </Button>
              </Box>
              </Box>
            ) : (
                <Button fullWidth variant="contained" size="large" onClick={() => setIsModalOpen(true)}>
                 درخواست این دارو
                </Button>
            )}
              
          </Box>
        </Paper>
      </Container>

      {/* --- دیالوگ تأیید حذف --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأیید حذف دارو</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف داروی "{drug?.brand_name}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>انصراف</Button>
          <Button onClick={handleDeleteDrug} color="error" autoFocus>
            حذف کن
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Dialog (Modal) */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>ثبت درخواست برای {drug.brand_name}</DialogTitle>
        <Box component="form" onSubmit={handleRequestSubmit}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              لطفاً تعداد مورد نیاز خود را مشخص کنید. (حداکثر موجودی: {drug.quantity})
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="quantity"
              label="تعداد درخواستی"
              type="number"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              inputProps={{ min: 1, max: drug.quantity }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setIsModalOpen(false)}>انصراف</Button>
            <Button type="submit" variant="contained">ثبت درخواست</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
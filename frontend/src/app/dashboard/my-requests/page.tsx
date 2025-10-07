// frontend/src/app/my-requests/page.tsx
// ورژن ۲.۰
// بازسازی کامل صفحه درخواست‌های من با کامپوننت‌های MUI

"use client";

import { useEffect, useState, SyntheticEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { useNotification } from '@/context/NotificationContext';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Grid, // <-- اضافه شد
  Link as MuiLink // <-- اضافه شد و تغییر نام یافت
} from '@mui/material';

interface ExchangeRequest {
  id: number;
  drug: {
    id: number;
    brand_name: string;
  };
  requester: {
    pk: number;
    username: string;
  };
  quantity_requested: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
}

// کامپوننت پنل برای تب‌ها
function TabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [error, setError] = useState('');
  const { user, authToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authToken) {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, [authToken, isAuthLoading, router]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<ExchangeRequest[]>('/exchanges/');
      setRequests(response.data);
    } catch (err) {
      showNotification('خطا در دریافت لیست درخواست‌ها.', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId: number, newStatus: 'accepted' | 'rejected') => {
    try {
      await apiClient.patch(`/exchanges/${requestId}/update-status/`, { status: newStatus });
      fetchRequests();
      showNotification('وضعیت درخواست با موفقیت به‌روزرسانی شد.', 'success');
    } catch (err) {
      console.error('Failed to update request status', err);
      showNotification('خطا در به‌روزرسانی وضعیت درخواست.', 'error');
    }
  };

  if (isLoading || isAuthLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  const sentRequests = requests.filter(req => req.requester.pk === user?.pk);
  const receivedRequests = requests.filter(req => req.requester.pk !== user?.pk);

  const statusTranslations: { [key: string]: string } = {
    pending: 'در انتظار بررسی',
    accepted: 'پذیرفته شده',
    rejected: 'رد شده',
    completed: 'تکمیل شده',
  };
   const statusColors: { [key: string]: string } = {
    pending: 'warning.main',
    accepted: 'success.main',
    rejected: 'error.main',
    completed: 'info.main',
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title="درخواست‌های من" />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
          <Tab label={`دریافتی (${receivedRequests.length})`} />
          <Tab label={`ارسالی (${sentRequests.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        {receivedRequests.length > 0 ? (
          <Grid container spacing={2}>
            {receivedRequests.map(req => (
              <Grid size={{ xs: 12 }} key={req.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      درخواست برای داروی{' '}
                      <MuiLink component={Link} href={`/drugs/${req.drug.id}`} fontWeight="bold">
                      {req.drug.brand_name}
                      </MuiLink>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">تعداد درخواست: {req.quantity_requested}</Typography>
                    <Typography variant="body2" color="text.secondary">{req.drug.brand_name}</Typography>
                    <Typography variant="body2" sx={{ color: statusColors[req.status] }}>وضعیت: {statusTranslations[req.status]}</Typography>
                  </CardContent>
                  {req.status === 'pending' && (
                    <CardActions>
                      <Button size="small" variant="contained" color="success" onClick={() => handleUpdateRequestStatus(req.id, 'accepted')}>پذیرش</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleUpdateRequestStatus(req.id, 'rejected')}>رد</Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : <Typography>شما هیچ درخواست دریافتی ندارید.</Typography>}
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        {sentRequests.length > 0 ? (
          <Grid container spacing={2}>
            {sentRequests.map(req => (
              <Grid size={{ xs: 12 }} key={req.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      درخواست برای داروی{' '}
                      <MuiLink component={Link} href={`/drugs/${req.drug.id}`} fontWeight="bold">
                      {req.drug.brand_name}
                      </MuiLink>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">تعداد: {req.quantity_requested}</Typography>
                    <Typography variant="body2" sx={{ color: statusColors[req.status] }}>وضعیت: {statusTranslations[req.status]}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : <Typography>شما هیچ درخواست ارسالی ندارید.</Typography>}
      </TabPanel>
    </Container>
  );
}
// frontend/src/app/dashboard/available-drugs/page.tsx
// ورژن ۲.۱
// نسخه کامل و اصلاح شده صفحه داروهای موجود

"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { 
  Alert,
  Container, 
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  Skeleton,
  Paper,
  IconButton
} from '@mui/material';

// تعریف کامل اینترفیس‌ها
interface Drug {
  id: number;
  brand_name: string;
  generic_name: string;
  dose: string;
  expiry_date: string;
  quantity: number;
  manufacturer: string;
  drug_type: string;
  owner: number;
  price: number;
  tracking_id: string;
}

export default function AvailableDrugsPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, authToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [filterType, setFilterType] = useState('');
  const [sortOrder, setSortOrder] = useState('-created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authToken) {
      router.push('/login');
      return;
    }

    const fetchDrugs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterType) params.append('drug_type', filterType);
        if (sortOrder) params.append('ordering', sortOrder);
        if (activeSearch) params.append('search', activeSearch);

        const response = await apiClient.get(`/drugs/?${params.toString()}`);
        setDrugs(response.data as Drug[]);
      } catch (err) {
        setError('خطا در دریافت اطلاعات داروها.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrugs();
  }, [authToken, isAuthLoading, router, filterType, sortOrder, activeSearch]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  if (isLoading || isAuthLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <PageHeader title="لیست داروهای موجود" />
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md:4}} key={index}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!authToken) return null; 

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <PageHeader title="لیست داروهای موجود" />
        <Button component={Link} href="/dashboard/add-drug" variant="contained" startIcon={<AddCircleOutlineIcon />}>
          ثبت داروی جدید
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8}}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField 
                fullWidth
                variant="outlined"
                label="جستجو (نام تجاری، ژنریک، شرکت سازنده)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" aria-label="search">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2}}>
            <FormControl fullWidth>
              <InputLabel>وضعیت</InputLabel>
              <Select value={filterType} label="وضعیت" onChange={(e: SelectChangeEvent) => setFilterType(e.target.value)}>
                <MenuItem value=""><em>همه</em></MenuItem>
                <MenuItem value="surplus">مازاد</MenuItem>
                <MenuItem value="near_expiry">نزدیک به انقضا</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2}}>
            <FormControl fullWidth>
              <InputLabel>مرتب‌سازی</InputLabel>
              <Select value={sortOrder} label="مرتب‌سازی" onChange={(e: SelectChangeEvent) => setSortOrder(e.target.value)}>
                <MenuItem value="-created_at">جدیدترین</MenuItem>
                <MenuItem value="created_at">قدیمی‌ترین</MenuItem>
                <MenuItem value="-quantity">بیشترین تعداد</MenuItem>
                <MenuItem value="quantity">کمترین تعداد</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!isLoading && drugs.length === 0 && !error && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6">هیچ دارویی مطابق با فیلترهای شما یافت نشد.</Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {drugs.map((drug) => {
          const isOwner = user?.pk === drug.owner;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={drug.id}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 },
                  borderColor: isOwner ? 'primary.main' : 'divider',
                  borderWidth: isOwner ? 2 : 1,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ maxWidth: '70%' }}>
                      {drug.brand_name}
                    </Typography>
                    <Chip
                      label={drug.drug_type === 'near_expiry' ? 'نزدیک به انقضا' : 'مازاد'}
                      color={drug.drug_type === 'near_expiry' ? 'warning' : 'info'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {drug.generic_name} - {drug.dose}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    شرکت: {drug.manufacturer}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1.5 }}>
                    تعداد: {drug.quantity}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mt: 1.5, fontWeight: 'bold' }}>
                    {drug.price > 0 ? `${drug.price.toLocaleString('fa-IR')} تومان` : 'اهدایی'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                   <Typography variant="caption" color="error" component="div" sx={{ mb: 1, textAlign: 'center' }}>
                     تاریخ انقضا: {drug.expiry_date}
                   </Typography>
                   <Button component={Link} href={`/dashboard/drugs/${drug.id}`} fullWidth variant="outlined">
                     مشاهده جزئیات و درخواست
                   </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
// frontend/src/app/page.tsx
// ورژن ۲.۰
// بازسازی کامل صفحه اصلی عمومی با الهام از سایت مرجع

"use client";

import { Box, Button, Container, Grid, Paper, Typography, Divider } from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* بخش Hero */}
      <Box
        sx={{
          pt: 12,
          pb: 12,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #3F51B5 30%, #7986CB 90%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="700">
            اتصال داروخانه‌ها برای فردایی سالم‌تر
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
            دارویار، شبکه هوشمند و امن برای تبادل داروهای مازاد و کمیاب بین مراکز درمانی معتبر.
          </Typography>
          <Button component={Link} href="/login" variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#eee' } }} size="large">
            شروع به کار
          </Button>
        </Container>
      </Box>

      {/* بخش "چگونه کار می‌کند؟" */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          فرآیند کار
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          <Grid size={{ xs: 12, md: 4 }} textAlign="center">
            <SearchIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>۱. جستجوی دارو</Typography>
            <Typography color="text.secondary">داروی مورد نیاز خود را در شبکه گسترده‌ای از داروخانه‌ها و مراکز درمانی پیدا کنید.</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} textAlign="center">
            <AddTaskIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>۲. ثبت درخواست</Typography>
            <Typography color="text.secondary">درخواست تبادل یا اهدای خود را به صورت آنلاین و با چند کلیک ساده ثبت نمایید.</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} textAlign="center">
            <LocalShippingIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>۳. هماهنگی و تحویل</Typography>
            <Typography color="text.secondary">با مرکز مورد نظر هماهنگی‌های لازم را انجام داده و فرآیند تحویل را نهایی کنید.</Typography>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* بخش ویژگی‌ها */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
            ویژگی‌های کلیدی پلتفرم
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4}}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <InventoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>مدیریت موجودی بهینه</Typography>
                <Typography color="text.secondary">داروهای راکد و نزدیک به انقضای خود را به راحتی مدیریت کرده و از ضرر مالی جلوگیری کنید.</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4}}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
              <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>پلتفرم امن و معتبر</Typography>
              <Typography color="text.secondary">تمام اعضا احراز هویت شده‌اند و تبادلات در بستری کاملاً امن و مطابق با استانداردها انجام می‌شود.</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4}}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
              <ReduceCapacityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>کاهش ضایعات دارویی</Typography>
              <Typography color="text.secondary">با مشارکت در این شبکه، نقش مهمی در کاهش هدررفت دارو و حفظ منابع ملی ایفا کنید.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* بخش فراخوان نهایی (Call to Action) */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            آماده‌اید تا به شبکه دارویار بپیوندید؟
          </Typography>
          <Typography sx={{ my: 3 }} color="text.secondary">
            امروز ثبت‌نام کنید و به جمع پیشروان بهینه‌سازی زنجیره سلامت کشور بپیوندید.
          </Typography>
          <Button component={Link} href="/register" variant="contained" size="large">
            ایجاد حساب کاربری رایگان
          </Button>
        </Container>
      </Box>

       {/* فوتر */}
      <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4, textAlign: 'center' }}>
        <Container>
          <Typography variant="body2">
            © {new Date().getFullYear()} پلتفرم دارویار. تمام حقوق محفوظ است.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
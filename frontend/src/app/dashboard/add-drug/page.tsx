// frontend/src/app/dashboard/add-drug/page.tsx
// ورژن ۳.۰
// بازطراحی کامل فرم ثبت دارو به صورت لیستی و داینامیک

"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import 
{ 
  Container, 
  Box, 
  Checkbox,
  Grid, 
  TextField, 
  Button, 
  CircularProgress, 
  Paper, 
  IconButton, 
  FormControl,
  FormControlLabel, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent

} from '@mui/material';
import PageHeader from '@/components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface DrugFormRow {
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  batch_number: string;
  dose: string;
  form: string;
  quantity: string;
  price: string;
  expiry_date: string;
  drug_type: 'surplus' | 'near_expiry';
}

const initialRowState: DrugFormRow = {
  brand_name: '', generic_name: '', manufacturer: '', batch_number: '',
  dose: '', form: '', quantity: '1', price: '0',
  expiry_date: '', drug_type: 'surplus'
};

export default function AddDrugListPage() {
  const [rows, setRows] = useState<DrugFormRow[]>([initialRowState]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLot, setIsLot] = useState(false);
  const [lotTitle, setLotTitle] = useState('');
  const [lotDescription, setLotDescription] = useState('');

  // --- CORRECTED FUNCTION SIGNATURE ---
  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    // Ensure name is a valid key
    if (name) {
      newRows[index] = { ...newRows[index], [name]: value };
      setRows(newRows);
    }
  };
  // ------------------------------------

  const handleAddRow = () => {
    setRows([...rows, initialRowState]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const drugsToSubmit = rows.map(row => ({
      ...row,
      quantity: parseInt(row.quantity),
      price: parseInt(row.price),
    }));
    
    try {
      if (isLot) {
        // اگر به صورت بسته ثبت می‌شود، ابتدا بسته را ایجاد کن
        const lotResponse = await apiClient.post('/lots/', {
          title: lotTitle,
          description: lotDescription,
        });
        const lotId = lotResponse.data.id;
        // سپس داروها را با اتصال به ID بسته ثبت کن
        const drugsWithLot = drugsToSubmit.map(drug => ({ ...drug, lot: lotId }));
        await apiClient.post('/drugs/', drugsWithLot);
        showNotification(`بسته "${lotTitle}" با ${rows.length} دارو با موفقیت ثبت شد.`, 'success');
      } else {
        // اگر به صورت تکی ثبت می‌شود
        await apiClient.post('/drugs/', drugsToSubmit);
        showNotification(`${rows.length} دارو با موفقیت ثبت شد.`, 'success');
      }
      router.push('/dashboard/available-drugs');
    } catch (error) {
      showNotification('خطا در ثبت داروها. لطفاً اطلاعات را بررسی کنید.', 'error');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Container maxWidth="xl"> {/* افزایش عرض کانتینر برای جا دادن فیلدها */}
      <PageHeader title="ثبت لیستی داروهای مازاد" />
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
           {/* --- بخش جدید برای اطلاعات بسته --- */}
          <FormControlLabel
            control={<Checkbox checked={isLot} onChange={(e) => setIsLot(e.target.checked)} />}
            label="ثبت تمام ردیف‌ها به عنوان یک بسته واحد (محموله)"
          />
          {isLot && (
            <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="عنوان بسته" value={lotTitle} onChange={(e) => setLotTitle(e.target.value)} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="توضیحات بسته (اختیاری)" value={lotDescription} onChange={(e) => setLotDescription(e.target.value)} fullWidth />
              </Grid>
            </Grid>
          )}
          {/* ---------------------------------- */}
          {rows.map((row, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs:12, sm: 6, md: 2}}>
                  <TextField name="brand_name" label="نام تجاری" value={row.brand_name} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:12, sm: 6, md: 2}}>
                  <TextField name="generic_name" label="نام ژنریک" value={row.generic_name} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:12, sm: 6, md: 2}}>
                  <TextField name="manufacturer" label="شرکت سازنده" value={row.manufacturer} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:12, sm: 6, md: 2}}>
                  <TextField name="batch_number" label="شماره بچ" value={row.batch_number} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:6, sm: 3, md: 1}}>
                  <TextField name="dose" label="دوز" value={row.dose} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:6, sm: 3, md: 1}}>
                  <TextField name="form" label="شکل دارو" value={row.form} onChange={(e) => handleInputChange(index, e)} fullWidth required /></Grid>
                <Grid size={{ xs:6, sm: 3, md: 1}}>
                  <TextField name="quantity" label="تعداد" type="number" value={row.quantity} onChange={(e) => handleInputChange(index, e)} fullWidth required inputProps={{ min: 1 }} /></Grid>
                <Grid size={{ xs:6, sm: 3, md: 1}}>
                  <TextField name="price" label="قیمت" type="number" value={row.price} onChange={(e) => handleInputChange(index, e)} fullWidth required inputProps={{ min: 0 }} /></Grid>
                <Grid size={{ xs:6, sm: 3, md: 1}}>
                  <FormControl fullWidth required>
                    <InputLabel>وضعیت</InputLabel>
                    <Select name="drug_type" value={row.drug_type} label="وضعیت" onChange={(e) => handleInputChange(index, e)}>
                      <MenuItem value="surplus">مازاد</MenuItem>
                      <MenuItem value="near_expiry">نزدیک به انقضا</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs:12, sm: 6, md: 2}}>
                    <TextField name="expiry_date" label="تاریخ انقضا" type="date" value={row.expiry_date} onChange={(e) => handleInputChange(index, e)} fullWidth required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 2}} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {rows.length > 1 && (
                    <IconButton onClick={() => handleRemoveRow(index)} color="error"><DeleteIcon /></IconButton>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow}>افزودن ردیف جدید</Button>
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : `ثبت ${rows.length} دارو`}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
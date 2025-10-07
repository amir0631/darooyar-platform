// frontend/src/components/PageHeader.tsx
import { Box, Typography } from '@mui/material';
import BackButton from './BackButton';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
      <BackButton />
      <Typography variant="h4" component="h1" sx={{ mr: 1, fontWeight: 'bold' }}>
        {title}
      </Typography>
    </Box>
  );
}
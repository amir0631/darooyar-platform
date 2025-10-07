// frontend/src/components/BackButton.tsx
"use client";
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; //  آیکون "به سمت راست" برای بازگشت در حالت راست‌چین

export default function BackButton() {
  const router = useRouter();
  return (
    <IconButton onClick={() => router.back()} aria-label="بازگشت">
      <ArrowForwardIcon />
    </IconButton>
  );
}
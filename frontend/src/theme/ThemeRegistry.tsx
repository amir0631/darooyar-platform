// src/theme/ThemeRegistry.tsx
// ورژن ۱.۲
// تم سفارشی MUI بر اساس وب‌سایت مرجع

'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

// تعریف تم سفارشی
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#3F51B5', // یک آبی مشابه سایت مرجع (می‌توانید دقیق‌تر تنظیم کنید)
      light: '#7986CB',
      dark: '#303F9F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057', // یک رنگ ثانویه پیش‌فرض، می‌توانید تغییر دهید
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F5F5', // یک خاکستری بسیار روشن برای پس‌زمینه کلی
      paper: '#FFFFFF', // سفید برای کارت‌ها و برگه‌ها
    },
  },
  typography: {
    fontFamily: 'var(--font-vazir), Arial, sans-serif',
  },
  shape: {
    borderRadius: 8, // گوشه‌های گرد برای دکمه‌ها و کارت‌ها
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // حذف تبدیل حروف به بزرگ در دکمه‌ها
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)', // سایه ظریف برای کارت‌ها
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // گوشه‌های گرد برای فیلدهای ورودی
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#FFFFFF', // پس‌زمینه سفید برای نوبار
          color: '#3F51B5', // رنگ متن نوبار
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 600, // کمی پررنگ‌تر برای عناوین مهم
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'mui-style', prepend: true });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
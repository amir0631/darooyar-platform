// frontend/src/components/DashboardLayout.tsx
// ورژن ۲.۳
// افزودن منوی کاربری به AppBar و اصلاح ساختار Toolbar

"use client";

import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  CssBaseline, Tooltip, Avatar, Menu, MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '@/context/AuthContext';
import InventoryIcon from '@mui/icons-material/Inventory';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ViewListIcon from '@mui/icons-material/ViewList';


const drawerWidth = 240;

const menuItems = [
    { text: 'داشبورد اصلی', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'داروهای موجود', icon: <MedicalServicesIcon />, link: '/dashboard/available-drugs' },
    { text: 'درخواست‌های من', icon: <PlaylistAddCheckIcon />, link: '/dashboard/my-requests' },
    { text: 'داروهای من', icon: <InventoryIcon />, link: '/dashboard/my-drugs' },
    { text: 'ثبت داروی مازاد', icon: <PostAddIcon />, link: '/dashboard/add-drug' },
    { text: 'درخواست دارو', icon: <HelpOutlineIcon />, link: '/dashboard/request-drug' },
    { text: 'بسته‌های دارویی', icon: <ViewListIcon />, link: '/dashboard/lots' }, // <-- آیتم جدید
    { text: 'پروفایل من', icon: <PersonIcon />, link: '/dashboard/profile' },
    
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleToggleDrawer = () => {
    setOpen(!open);
  };
  const userDisplayName = user?.first_name || user?.username || '';
  const userAvatarSrc = user?.avatar ? `/avatars/${user.avatar}.png` : '/avatars/avatar4.png'; // Fallback to a default avatar

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
           {/* دکمه باز و بسته کردن منوی کناری */}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleToggleDrawer}
            edge="start"
            sx={{ ml: 2}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            پنل مدیریت دارویار
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* This pushes content to the sides */}
          {/* بخش اطلاعات کاربر و منو */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
              خوش آمدید، {userDisplayName}!
            </Typography>
            <Tooltip title="تنظیمات حساب کاربری">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar alt={userDisplayName} src={userAvatarSrc} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} href="/dashboard/profile" onClick={handleMenuClose}>
                <Typography textAlign="center">پروفایل من</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
                <Typography textAlign="center">خروج</Typography>
              </MenuItem>
            </Menu>
          </Box>
                  
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: open ? drawerWidth : (theme) => theme.spacing(7),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : (theme) => theme.spacing(7),
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            right: 0,
            left: 'auto',
          },
        }}
      >
        <Toolbar /> 
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? item.text : ''} placement="left">
                  <ListItemButton
                    component={Link}
                    href={item.link}
                    selected={pathname === item.link}
                    sx={{ 
                      minHeight: 48, 
                      justifyContent: open ? 'initial' : 'center', 
                      px: 2.5 
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 0, 
                        mr: open ? 3 : 'auto', 
                        justifyContent: 'center' 
                        }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
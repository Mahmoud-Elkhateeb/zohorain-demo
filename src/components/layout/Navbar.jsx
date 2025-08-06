'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '@/features/authSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f1f3f4',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 300,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  '& .placeholder': {
    color: '#9aa0a6',
  },
}));

export default function Navbar() {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);
  const profileOpen = Boolean(profileAnchor);
  const langOpen = Boolean(langAnchor);

  const dispatch = useDispatch();
  
  const router = useRouter();

  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth) || {};

  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleLangClick = (event) => setLangAnchor(event.currentTarget);

  const handleClose = () => {
    setProfileAnchor(null);
    setLangAnchor(null);
  };

  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    router.push('/login');
    handleClose();
  };

  // Extract user data from user object
  const userEmail = user?.email || '';
  const userName = user?.name || 'Husain';

  return (
    <AppBar position="static" color="transparent" elevation={0} className='border-b border-[1px] border-[#e9e9e9]'>
      <Toolbar className="flex justify-between items-center px-4 ">
        {/* Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        {/* Right Section */}
        <Box className="flex items-center gap-7  ">
          {/* Language Selector with Dropdown */}
          <Box
            className="flex items-center  cursor-pointer  hover:text-blue-600  transition"
            onClick={handleLangClick}
          >
            <Typography variant="body2" className="font-medium">
              En
            </Typography>
            <ArrowDropDownIcon />
          </Box>
          <Menu
            anchorEl={langAnchor}
            open={langOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              className: 'min-w-[120px] p-1',
              sx: { borderRadius: 2 },
            }}
          >
            <MenuItem onClick={handleClose}>En</MenuItem>
            <MenuItem onClick={handleClose}>Ar</MenuItem>
          </Menu>

          {/* Messages */}
          <Link href="/messages">
          <IconButton size="large" aria-label="show messages" color="inherit" >
            <MailIcon className='text-[#9AA5B7] ' />
          </IconButton>
          </Link>
          

          {/* Notifications */}
          <Link href="/notification">
          <IconButton size="large" aria-label="show notifications" color="inherit" >
            <Badge variant="dot" color="error">
              <NotificationsIcon className='text-[#9AA5B7] ' />
            </Badge>
          </IconButton>
          </Link>
          

          {/* Profile with Dropdown */}
          <Box
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <Box className="text-right hidden sm:block">
              <Typography variant="body2" className="font-semibold">
                {userName}
              </Typography>
              <ArrowDropDownIcon />
              <Typography variant="caption" className="text-gray-500">
                {userEmail}
              </Typography>
            </Box>
            <Avatar alt={userName} src="/avatar.png" />
          </Box>
          <Menu
            anchorEl={profileAnchor}
            open={profileOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              className: 'w-fit p-2',
              sx: { borderRadius: 2 },
            }}
          >
            <Box className="flex items-center gap-3 px-3 py-2">
              <Avatar alt="Husain" src="/avatar.png" sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="body2" className="font-semibold">
                  Husain
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {userEmail}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
}

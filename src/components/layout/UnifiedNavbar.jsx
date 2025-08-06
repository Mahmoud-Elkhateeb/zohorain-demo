'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/features/authSlice';
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Menu as MenuIcon,
  Home,
  ShoppingCart,
  Subscriptions,
  Fastfood,
  Category,
  Add,
  RateReview,
  LocalOffer,
  ExpandMore,
  ChevronRight,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import clsx from 'clsx';

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

const navigationItems = [
  {
    headline: 'MAIN',
    items: [
      { title: 'Dashboard', icon: <Home />, href: '/' },
    ],
  },
  {
    headline: 'ORDER MANAGEMENT',
    items: [
      {
        title: 'Regular Orders',
        icon: <ShoppingCart />,
        sublinks: [
          { title: 'All', href: '/order-management/regular-orders/all', count: 13 },
          { title: 'Pending', href: '/order-management/regular-orders/pending', count: 0 },
          { title: 'Confirmed', href: '/order-management/regular-orders/confirmed', count: 2 },
          { title: 'Accepted', href: '/order-management/regular-orders/accepted', count: 0 },
          { title: 'Cooking', href: '/order-management/regular-orders/cooking', count: 1 },
          { title: 'Ready For Delivery', href: '/order-management/regular-orders/ready', count: 4 },
          { title: 'Food On The Way', href: '/order-management/regular-orders/on-the-way', count: 0 },
          { title: 'Delivered', href: '/order-management/regular-orders/delivered', count: 8 },
          { title: 'Dine In', href: '/order-management/regular-orders/dine-in', count: 0 },
          { title: 'Refunded', href: '/order-management/regular-orders/refunded', count: 0 },
          { title: 'Refund Requested', href: '/order-management/regular-orders/refund-requested', count: 2 },
          { title: 'Scheduled', href: '/order-management/regular-orders/scheduled', count: 0 },
          { title: 'Payment Failed', href: '/order-management/regular-orders/payment-failed', count: 0 },
          { title: 'Canceled', href: '/order-management/regular-orders/canceled', count: 0 },
        ],
      },
      {
        title: 'Subscription Orders',
        icon: <Subscriptions />,
        href: '/order-management/subscription-orders',
      },
    ],
  },
  {
    headline: 'FOOD MANAGEMENT',
    items: [
      { title: 'Foods', icon: <Fastfood />, href: '/food-management/foods/list' },
      { title: 'Categories', icon: <Category />, href: '/food-management/categories/category' },
      { title: 'Addons', icon: <Add />, href: '/food-management/addons' },
      { title: 'Reviews', icon: <RateReview />, href: '/food-management/reviews' },
    ],
  },
  {
    headline: 'PROMOTIONS',
    items: [
      { title: 'Promotions', icon: <LocalOffer />, href: '/promotions' },
    ],
  },
];

export default function UnifiedNavbar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);
  const [openDropdown, setOpenDropdown] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useSelector((state) => state.auth) || {};
  const profileOpen = Boolean(profileAnchor);
  const langOpen = Boolean(langAnchor);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavigation = (href) => {
    router.push(href);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 280, bgcolor: '#334257', height: '100%', color: '#E9F3FF', position: 'fixed', top: 0, left: 0, overflowY: 'auto', overflowX: 'hidden' }}>
      <Box sx={{ p: 1, borderBottom: '1px solid #465468', position: 'fixed', zIndex: 1000, backgroundColor: '#E9F3FF', width: '280px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <img src="/assets/logos/2025-07-22-687f61523c255.png" alt="Logo" style={{ width: 45, borderRadius: 4 }} />
          <Typography variant="h6" sx={{ color: '#012D5E', fontWeight: 'bold', fontSize: '1rem' }}>
            Zohorain
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, mt: 8 }}>
        {navigationItems.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            {section.headline && (
              <Typography variant="caption" sx={{
                color: '#9AA5B7',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                mb: 1,
                display: 'block'
              }}>
                {section.headline}
              </Typography>
            )}

            {section.items.map((item, itemIndex) => {
              const key = `${sectionIndex}-${itemIndex}`;
              const isActive = pathname === item.href;
              const hasSublinks = !!item.sublinks;

              return (
                <Box key={key}>
                  {hasSublinks ? (
                    <Box>
                      <Box
                        onClick={() => toggleDropdown(key)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#465468' },
                          ...(isActive && { bgcolor: '#465468' })
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.icon}
                          <Typography variant="body2">{item.title}</Typography>
                        </Box>
                        {openDropdown[key] ? <ExpandMore /> : <ChevronRight />}
                      </Box>

                      <Collapse in={openDropdown[key]}>
                        <Box sx={{ pl: 4, mt: 1 }}>
                          {item.sublinks.map((sublink, subIndex) => (
                            <Box
                              key={subIndex}
                              onClick={() => handleNavigation(sublink.href)}
                              sx={{
                                p: 0.5,
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#465468' },
                                ...(pathname === sublink.href && { bgcolor: '#465468' })
                              }}
                            >
                              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                {sublink.title}
                                {sublink.count && (
                                  <Box component="span" sx={{ ml: 1, color: '#EF853A' }}>
                                    ({sublink.count})
                                  </Box>
                                )}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ) : (
                    <Box
                      onClick={() => handleNavigation(item.href)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#465468' },
                        ...(isActive && { bgcolor: '#465468' })
                      }}
                    >
                      {item.icon}
                      <Typography variant="body2">{item.title}</Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="fixed ">
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${isMobile ? 0 : 280}px)` },
          ml: { md: isMobile ? 0 : '280px' },
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', flexGrow: 1 }}>
            {/* Language Selector */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={handleLangClick}
            >
              <Typography variant="body2">En</Typography>
              <ArrowDropDownIcon />
            </Box>
            <Menu
              anchorEl={langAnchor}
              open={langOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>En</MenuItem>
              <MenuItem onClick={handleClose}>Ar</MenuItem>
            </Menu>

            {/* Messages */}
            <IconButton size="large" color="inherit">
              <MailIcon />
            </IconButton>

            {/* Notifications */}
            <IconButton size="large" color="inherit">
              <Badge variant="dot" color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleProfileClick}>
              <Avatar alt={user?.name || 'User'} src="" sx={{ width: 32, height: 32 }} />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'User'}
              </Typography>
              <ArrowDropDownIcon />
            </Box>
            <Menu
              anchorEl={profileAnchor}
              open={profileOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>


    </Box>
  );
}



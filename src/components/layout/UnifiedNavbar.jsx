'use client';

import React, { useState, useEffect } from 'react';
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
  Drawer,
  Collapse,
  useTheme,
  useMediaQuery,
  Popover,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
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
  ChevronLeft,
} from '@mui/icons-material';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import DiscountIcon from '@mui/icons-material/Discount';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WalletIcon from '@mui/icons-material/Wallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FilterListIcon from '@mui/icons-material/FilterList';
import FlagIcon from '@mui/icons-material/Flag';
import PieChartIcon from '@mui/icons-material/PieChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonIcon from '@mui/icons-material/Person';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import BadgeIcon from '@mui/icons-material/Badge';
import { styled } from '@mui/system';

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
          { title: 'All', href: '/All', count: 13 },
          { title: 'Pending', href: '/Pending', count: 0 },
          { title: 'Confirmed', href: '/Confirmed', count: 2 },
          { title: 'Accepted', href: '/Accepted', count: 0 },
          { title: 'Cooking', href: '/Cooking', count: 1 },
          { title: 'Ready For Delivery', href: '/ReadyForDelivery', count: 4 },
          { title: 'Food On The Way', href: '/FoodOnTheWay', count: 0 },
          { title: 'Delivered', href: '/Delivered', count: 8 },
          { title: 'Dine In', href: '/DineIn', count: 0 },
          { title: 'Refunded', href: '/Refunded', count: 0 },
          { title: 'Refund Requested', href: '/RefundRequested', count: 2 },
          { title: 'Scheduled', href: '/Scheduled', count: 0 },
          { title: 'Payment Failed', href: '/PaymentFailed', count: 0 },
          { title: 'Canceled', href: '/Canceled', count: 0 },
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
      {
        title: 'Foods', icon: <Fastfood />, sublinks: [
          { title: 'Add New', href: '/AddNewFood' },
          { title: 'List', href: '/FoodList' },
          { title: 'Bulk Import', href: '/FoodBulkImport' },
          { title: 'Bulk Export', href: '/FoodBulkExport' },
        ],
      },
      {
        title: 'Categories', icon: <Category />, sublinks: [
          { title: 'Category', href: '/Category' },
          { title: 'Subcategory', href: '/Subcategory' },
        ],
      },
      { title: 'Addons', icon: <Add />, href: '/food-management/addons' },
      { title: 'Reviews', icon: <RateReview />, href: '/food-management/reviews' },
    ],
  },
  {
    headline: 'Promotions Management',
    items: [
      {
        title: 'Campaign', icon: <FilterHdrIcon />, sublinks: [
          { title: 'Basic Campaign', href: '/basicCampaign' },
          { title: 'Food Campaign', href: '/foodCampaign' },
        ],
      },
      { title: 'Coupons', icon: <DiscountIcon />, href: '/coupons' },

    ],
  },
  {
    headline: 'Help & support',
    items: [
      { title: 'Chat', icon: <QuestionAnswerIcon />, href: '/chat' },

    ],
  },
  {
    headline: 'Ads Management',
    items: [

      { title: 'New Ads', icon: <LiveTvIcon />, href: '/newAds' },
      {
        title: 'Ads List', icon: <FormatListBulletedIcon />, sublinks: [
          { title: 'Pending', href: '/pendingAds' },
          { title: 'List', href: '/adsList' },
        ],
      },
    ],
  },
  {
    headline: 'Wallet management',
    items: [
      { title: 'My Wallet', icon: <WalletIcon />, href: '/myWallet' },
      { title: 'Wallet Method', icon: <AccountBalanceIcon />, href: '/walletMethod' },
    ],
  },
  {
    headline: 'Deliveryman management',
    items: [
      { title: 'Add Delivery Man', icon: <DirectionsRunIcon />, href: '/addDeliveryMan' },
      { title: 'DeliveryMan List', icon: <FilterListIcon />, href: '/deliveryManList' },
    ],
  },
  {
    headline: 'Reports',
    items: [
      { title: 'Expense Report', icon: <FlagIcon />, href: '/expenseReport' },
      { title: 'Transaction', icon: <PieChartIcon />, href: '/transaction' },
      { title: 'Disbursement Report', icon: <SummarizeIcon />, href: '/disbursementReport' },
      {
        title: 'Order Report', icon: <PersonIcon />, sublinks: [
          { title: 'Regular Order Report', href: '/regularOrderReport' },
          { title: 'Campaign Order Report', href: '/campaignOrderReport' },
        ],
      },
      { title: 'Food Report', icon: <LunchDiningIcon />, href: '/foodReport' },
      { title: 'Tax Report', icon: <SummarizeIcon />, href: '/taxReport' },
    ],
  },
  {
    headline: 'Business management',
    items: [
      { title: 'My Restaurant', icon: <Home />, href: '/business-management/myRestaurantProfile' },
      { title: 'Restaurant Config', icon: <SettingsIcon />, href: '/business-management/restaurant-config' },
      { title: 'My QR Code', icon: <QrCode2Icon />, href: '/business-management/myQRCode' },
      { title: 'Notification Setup', icon: <NotificationsIcon />, href: '/business-management/notification-setup' },
    ],
  },
  {
    headline: 'Employee management',
    items: [
      { title: 'Employee Role', icon: <BadgeIcon />, href: '/employee-management/employee-role' },  
      {
        title: 'All Employee', icon: <PersonIcon />, sublinks: [
          { title: 'Add New Employee', href: '/employee-management/add-employee' },
          { title: 'List', href: '/employee-management/employee-list' },
        ],
      },
    ],
  },
];

export default function UnifiedNavbar({ sidebarCollapsed: sidebarCollapsedProp, toggleSidebarCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsedInternal, setSidebarCollapsedInternal] = useState(false);
  const [popover, setPopover] = useState({ anchor: null, content: null, key: null });
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const sidebarCollapsed = typeof sidebarCollapsedProp === 'boolean' ? sidebarCollapsedProp : sidebarCollapsedInternal;
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);
  const [openDropdown, setOpenDropdown] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const { user } = useSelector((state) => state.auth) || {};
  const profileOpen = Boolean(profileAnchor);
  const langOpen = Boolean(langAnchor);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setProfileError('No authentication token found');
          setLoadingProfile(false);
          return;
        }

        const response = await fetch('https://test-api.pro-manager.net/zohorain-v1/api/v1/vendor/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'vendorType': 'owner',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileError(error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setCurrentLanguage(savedLanguage);
      fetchUserProfile();
    }
  }, []);

  const setSidebarCollapsed = (value) => {
    if (typeof toggleSidebarCollapsed === 'function') {
      toggleSidebarCollapsed();
    } else {
      setSidebarCollapsedInternal(value);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
    localStorage.removeItem('token');
    router.push('/login');
    handleClose();
  };

  const handlePopoverClick = (event, sublinks, key) => {
    if (sidebarCollapsed) {
      if (popover.key === key) {
        setPopover({ anchor: null, content: null, key: null });
      } else {
        setPopover({
          anchor: event.currentTarget,
          content: sublinks,
          key: key,
        });
      }
    }
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

  const drawerWidth = sidebarCollapsed ? 80 : 280;
  const collapsedDrawerWidth = 80;

  const drawer = (
    <Box sx={{
      width: sidebarCollapsed ? collapsedDrawerWidth : 280,
      bgcolor: '#334257',
      height: '100vh',
      color: '#E9F3FF',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease'
    }}>
      <Box sx={{
        p: 1,
        borderBottom: '1px solid #465468',
        bgcolor: '#E9F3FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/assets/logos/2025-07-22-687f61523c255.png" alt="Logo" style={{ width: 45, borderRadius: 4 }} />
            <Typography variant="h6" sx={{ color: '#012D5E', fontWeight: 'bold', fontSize: '0.95rem' }}>
              Zohorain
            </Typography>
          </Box>
        )}
        {sidebarCollapsed && (
          <img src="/assets/logos/2025-07-22-687f61523c255.png" alt="Logo" style={{ width: 45, borderRadius: 4 }} />
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }} className="sidebar-scrollbar sidebar-scroll-fade touch-scroll">
        {navigationItems.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            {section.headline && !sidebarCollapsed && (
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
                        onClick={(e) => {
                          if (sidebarCollapsed) {
                            handlePopoverClick(e, item.sublinks, key);
                          } else {
                            toggleDropdown(key);
                          }
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                          p: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#465468' },
                          ...(isActive && { bgcolor: '#465468' }),
                          position: 'relative'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: sidebarCollapsed ? 0 : 2,
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          width: '100%'
                        }}>
                          {sidebarCollapsed && isLargeScreen && hasSublinks && (
                            <Box sx={{
                              position: 'absolute',
                              top: 4,
                              right: 0,
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#E9F3FF',
                            }} />
                          )}
                          {item.icon}
                          {!sidebarCollapsed && (
                            <Typography variant="body2">{item.title}</Typography>
                          )}
                        </Box>
                        {!sidebarCollapsed && (
                          openDropdown[key] ? <ExpandMore /> : <ChevronRight />
                        )}
                      </Box>

                      {!sidebarCollapsed && (
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                    {sublink.title}
                                  </Typography>
                                  {sublink.count !== undefined && (
                                    <Box
                                      component="span"
                                      sx={{
                                        minWidth: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: (() => {
                                          if (sublink.count === 0) {
                                            if (['Refunded', 'Refund Requested'].includes(sublink.title)) {
                                              return '#fff';
                                            }
                                            return '#334257';
                                          }
                                          if (['All', 'Cooking', 'Ready For Delivery', 'Delivered'].includes(sublink.title)) {
                                            return '#1E88E5';
                                          }
                                          if (['Pending', 'Confirmed', 'Accepted', 'Dine In', 'Scheduled', 'Payment Failed', 'Canceled'].includes(sublink.title)) {
                                            return '#388E3C';
                                          }
                                          if (['Refunded', 'Refund Requested'].includes(sublink.title)) {
                                            return '#D32F2F';
                                          }
                                          return '#1E88E5';
                                        })(),
                                        border: sublink.count === 0 && ['Refunded', 'Refund Requested'].includes(sublink.title) ? '1.5px solid #D32F2F' : 'none',
                                        userSelect: 'none',
                                      }}
                                    >
                                      {sublink.count}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  ) : (
                    <Box
                      onClick={() => handleNavigation(item.href)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: sidebarCollapsed ? 0 : 2,
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        '&:hover': { bgcolor: '#465468' },
                        ...(isActive && { bgcolor: '#465468' })
                      }}
                    >
                      {item.icon}
                      {!sidebarCollapsed && (
                        <Typography variant="body2">{item.title}</Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {!isMobile && (
        <Box sx={{
          p: 2,
          borderTop: '1px solid #465468',
          display: 'flex',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-end'
        }}>
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              color: '#E9F3FF',
              '&:hover': { bgcolor: '#465468' }
            }}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  const ProfileMenu = () => (
    <Menu
      anchorEl={profileAnchor}
      open={profileOpen}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleClose}>
        <Avatar 
          alt={userProfile ? `${userProfile.f_name} ${userProfile.l_name}` : 'User'} 
          src={userProfile?.image || ""}
          sx={{ bgcolor: theme.palette.primary.main }}
        >
          {loadingProfile ? (
            <CircularProgress size={20} color="inherit" />
          ) : userProfile ? (
            `${userProfile.f_name?.[0] || ''}${userProfile.l_name?.[0] || ''}`
          ) : (
            'U'
          )}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {loadingProfile ? 'Loading...' : (
              profileError ? 'Error loading profile' : (
                userProfile ? `${userProfile.f_name || ''} ${userProfile.l_name || ''}`.trim() || 'User' : 'User'
              )
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loadingProfile ? 'loading...' : (
              profileError ? 'Check connection' : (
                userProfile?.email || 'user@example.com'
              )
            )}
          </Typography>
        </Box>
      </MenuItem>
      
      <MenuItem onClick={() => {
        handleClose();
        router.push('/profileuser/settings');
      }}>
        <Typography variant="body2">Settings</Typography>
      </MenuItem>
      <MenuItem onClick={handleSignOut}>
        <Typography variant="body2" color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {!isMobile && (
        <Box
          sx={{
            width: sidebarCollapsed ? collapsedDrawerWidth : 280,
            flexShrink: 0,
            transition: 'width 0.3s ease',
          }}
        >
          {drawer}
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }}>
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              zIndex: theme.zIndex.drawer + 1000,
              bgcolor: '#fff',
              color: 'text.primary',
              borderBottom: '1px solid #E0E0E0',
              boxShadow: 1,
              height: 64,
            }}
          >
            <Toolbar sx={{ minHeight: 64, px: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <Search sx={{ flexGrow: 1 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
              </Search>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => {
                    const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
                    setCurrentLanguage(newLang);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('language', newLang);
                      window.location.reload();
                    }
                  }}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {currentLanguage === 'ar' ? 'EN' : 'AR'}
                  </Typography>
                </IconButton>

                <IconButton size="large" color="inherit">
                  <MailIcon />
                </IconButton>
                <IconButton size="large" color="inherit">
                  <Badge variant="dot" color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={userProfile ? `${userProfile.f_name} ${userProfile.l_name}` : 'User'}
                    src={userProfile?.image || ""}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    {loadingProfile ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : userProfile ? (
                      `${userProfile.f_name?.[0] || ''}${userProfile.l_name?.[0] || ''}`
                    ) : (
                      'U'
                    )}
                  </Avatar>
                </IconButton>

                <ProfileMenu />
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {!isMobile && (
          <AppBar
            position="fixed"
            sx={{
              zIndex: theme.zIndex.drawer + 1,
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: 0,
              borderBottom: '1px solid #E0E0E0',
              ml: sidebarCollapsed ? `${collapsedDrawerWidth}px` : `${drawerWidth}px`,
              width: sidebarCollapsed ? `calc(100% - ${collapsedDrawerWidth}px)` : `calc(100% - ${drawerWidth}px)`,
              transition: 'all 0.3s ease',
            }}
          >
            <Toolbar>
              <Search sx={{ flexGrow: 1 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
              </Search>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', flexGrow: 1 }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => {
                    const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
                    setCurrentLanguage(newLang);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('language', newLang);
                      window.location.reload();
                    }
                  }}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {currentLanguage === 'ar' ? 'EN' : 'AR'}
                  </Typography>
                </IconButton>

                <IconButton size="large" color="inherit">
                  <MailIcon />
                </IconButton>
                <IconButton size="large" color="inherit">
                  <Badge variant="dot" color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={userProfile ? `${userProfile.f_name} ${userProfile.l_name}` : 'User'}
                    src={userProfile?.image || ""}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    {loadingProfile ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : userProfile ? (
                      `${userProfile.f_name?.[0] || ''}${userProfile.l_name?.[0] || ''}`
                    ) : (
                      'U'
                    )}
                  </Avatar>
                </IconButton>

                <ProfileMenu />
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              height: '100vh'
            },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: isMobile ? 8 : 0,
            width: !isMobile ? (sidebarCollapsed ? `calc(100% - ${collapsedDrawerWidth}px)` : `calc(100% - ${drawerWidth}px)`) : '100%',
            transition: 'all 0.3s ease',
            minHeight: '100vh',
          }}
        >
          {/* Content goes here */}
        </Box>
      </Box>
      <Popover
        open={Boolean(popover.anchor)}
        anchorEl={popover.anchor}
        onClose={() => setPopover({ anchor: null, content: null, key: null })}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#3E5169',
            color: '#E9F3FF',
            padding: '8px',
            minWidth: '220px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            transition: 'opacity 250ms ease-in-out, transform 250ms ease-in-out',
            opacity: Boolean(popover.anchor) ? 1 : 0,
            transform: Boolean(popover.anchor) ? 'translateX(0)' : 'translateX(-10px)',
          },
        }}
        disableRestoreFocus
      >
        {popover.content?.map((sublink, subIndex) => (
          <Box
            key={subIndex}
            onClick={() => {
              handleNavigation(sublink.href);
              setPopover({ anchor: null, content: null, key: null });
            }}
            sx={{
              p: 1,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: '#465468' },
              ...(pathname === sublink.href && { bgcolor: '#465468' }),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {sublink.title}
            </Typography>
            {sublink.count !== undefined && (
              <Box
                component="span"
                sx={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: (() => {
                    if (sublink.count === 0) {
                      if (['Refunded', 'Refund Requested'].includes(sublink.title)) {
                        return '#fff';
                      }
                      return '#334257';
                    }
                    if (['All', 'Cooking', 'Ready For Delivery', 'Delivered'].includes(sublink.title)) {
                      return '#1E88E5';
                    }
                    if (['Pending', 'Confirmed', 'Accepted', 'Dine In', 'Scheduled', 'Payment Failed', 'Canceled'].includes(sublink.title)) {
                      return '#388E3C';
                    }
                    if (['Refunded', 'Refund Requested'].includes(sublink.title)) {
                      return '#D32F2F';
                    }
                    return '#1E88E5';
                  })(),
                  border: sublink.count === 0 && ['Refunded', 'Refund Requested'].includes(sublink.title) ? '1.5px solid #D32F2F' : 'none',
                  userSelect: 'none',
                }}
              >
                {sublink.count}
              </Box>
            )}
          </Box>
        ))}
      </Popover>
    </Box>
  );
}
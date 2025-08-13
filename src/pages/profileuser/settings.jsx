// pages/settings.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    useMediaQuery,
    Tabs,
    Tab
} from '@mui/material';
import {
    Home as HomeIcon,
    Lock as LockIcon,
    PersonOutline as PersonIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    Visibility,
    VisibilityOff,
    CheckCircleOutline as CheckIcon,
    ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// API Configuration
const API_ROUTES = {
    profile: {
        get: 'https://test-api.pro-manager.net/zohorain-v1/api/v1/vendor/profile',
        update: 'https://test-api.pro-manager.net/zohorain-v1/api/v1/vendor/update-profile'
    }
};

// Form validation schemas
const generalSchema = Yup.object({
    f_name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
        .required('First name is required'),
    l_name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
        .required('Last name is required'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(8, 'Phone number must be at least 8 digits')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
});

const passwordSchema = Yup.object({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

export default function Settings() {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [countryCode, setCountryCode] = useState('+966');
    const [isLoading, setIsLoading] = useState({
        profile: false,
        password: false
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState('');
    const [vendorType, setVendorType] = useState('');

    // Initialize formik with empty values (will be populated from API)
    const generalFormik = useFormik({
        initialValues: {
            f_name: '',
            l_name: '',
            phone: '',
            email: '',
            password: ''
        },
        validationSchema: generalSchema,
        onSubmit: handleProfileSubmit,
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: passwordSchema,
        onSubmit: handlePasswordSubmit,
    });

    // Fetch token from localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedVendorType = localStorage.getItem('vendorType');
        
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedVendorType) {
            setVendorType(storedVendorType);
        }
    }, []);

    // Fetch profile data when token is available
    useEffect(() => {
        if (!token) return;

        const fetchProfileData = async () => {
            try {
                const response = await fetch(API_ROUTES.profile.get, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'vendorType': 'owner'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                
                const data = await response.json();
                
                // Extract phone number without country code
                let phoneNumber = data.phone || '';
                if (phoneNumber.startsWith(countryCode)) {
                    phoneNumber = phoneNumber.substring(countryCode.length);
                }

                generalFormik.setValues({
                    f_name: data.f_name || '',
                    l_name: data.l_name || '',
                    phone: phoneNumber,
                    email: data.email || '',
                    password: '' // Don't pre-fill password
                });
                
            } catch (error) {
                setErrorMessage(error.message || 'Failed to load profile data');
                setTimeout(() => setErrorMessage(''), 5000);
            }
        };
        
        fetchProfileData();
    }, [token, vendorType]);

    async function handleProfileSubmit(values) {
        setIsLoading(prev => ({ ...prev, profile: true }));
        setErrorMessage('');
        
        try {
            const response = await fetch(API_ROUTES.profile.update, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'vendorType': vendorType
                },
                body: JSON.stringify({
                    f_name: values.f_name,
                    l_name: values.l_name,
                    phone: `${countryCode}${values.phone}`,
                    email: values.email,
                    password: values.password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to update profile');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setIsLoading(prev => ({ ...prev, profile: false }));
        }
    }

    async function handlePasswordSubmit(values) {
        setIsLoading(prev => ({ ...prev, password: true }));
        setErrorMessage('');
        
        try {
            // Since the API expects password in the profile update endpoint,
            // we'll use the same endpoint but only update the password
            const response = await fetch(API_ROUTES.profile.update, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'vendorType': vendorType
                },
                body: JSON.stringify({
                    password: values.newPassword
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update password');
            }

            setSuccessMessage('Password updated successfully!');
            passwordFormik.resetForm();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to update password');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setIsLoading(prev => ({ ...prev, password: false }));
        }
    }

    const countries = [
        { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+1', name: 'United States', flag: '🇺🇸' },
        { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
        { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    ];

    const PasswordRequirement = ({ text, isValid }) => (
        <Box display="flex" alignItems="center" mb={0.5}>
            {isValid ? (
                <CheckIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
            ) : (
                <ErrorIcon fontSize="small" sx={{ color: 'grey.500', mr: 1 }} />
            )}
            <Typography variant="caption" color={isValid ? 'success.main' : 'text.secondary'}>
                {text}
            </Typography>
        </Box>
    );

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="">
            <Head>
                <title>Account Settings</title>
                <meta name="description" content="Manage your account settings" />
            </Head>

            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div className="mb-4 md:mb-0">
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Account Settings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your profile and security settings
                        </Typography>
                    </div>
                    <div>
                        <Link href="/" passHref legacyBehavior>
                            <Button
                                component="a"
                                variant="contained"
                                startIcon={<HomeIcon />}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
                                    zIndex: 0,
                                }}
                            >
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {errorMessage && (
                    <Box
                        sx={{
                            bgcolor: 'error.light',
                            color: 'error.dark',
                            p: 2,
                            mb: 3,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        }}
                    >
                        <ErrorIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">{errorMessage}</Typography>
                    </Box>
                )}

                {successMessage && (
                    <Box
                        sx={{
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            p: 2,
                            mb: 3,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        }}
                    >
                        <CheckIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">{successMessage}</Typography>
                    </Box>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Navigation Sidebar - Desktop */}
                    {!isMobile && (
                        <div className="w-full lg:w-1/4">
                            <Card sx={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        p: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="h6" color="white">
                                        Settings Menu
                                    </Typography>
                                </Box>
                                <CardContent className="p-0">
                                    <div className="bg-white">
                                        <ul className="space-y-1">
                                            <li>
                                                <button
                                                    onClick={() => setActiveTab('general')}
                                                    className={`w-full text-left px-4 py-3 flex items-center transition-all ${activeTab === 'general'
                                                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <PersonIcon className="mr-3" />
                                                    Profile Information
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => setActiveTab('password')}
                                                    className={`w-full text-left px-4 py-3 flex items-center transition-all ${activeTab === 'password'
                                                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <LockIcon className="mr-3" />
                                                    Password & Security
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="w-full lg:w-3/4">
                        {/* Mobile Tabs */}
                        {isMobile && (
                            <Card sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden' }}>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            height: 4,
                                            backgroundColor: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    <Tab
                                        value="general"
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <PersonIcon sx={{ mr: 1 }} />
                                                Profile
                                            </Box>
                                        }
                                        sx={{
                                            py: 2,
                                            '&.Mui-selected': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                    <Tab
                                        value="password"
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <LockIcon sx={{ mr: 1 }} />
                                                Password
                                            </Box>
                                        }
                                        sx={{
                                            py: 2,
                                            '&.Mui-selected': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                </Tabs>
                            </Card>
                        )}

                        {activeTab === 'general' && (
                            <form onSubmit={generalFormik.handleSubmit}>
                                {/* Profile Cover & Avatar */}
                                <Card sx={{
                                    mb: 4,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}>
                                    <Box
                                        sx={{
                                            height: isMobile ? 120 : 180,
                                            background: 'linear-gradient(45deg, #012D5E, #FDAA8E)',
                                            position: 'relative'
                                        }}
                                    />
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        mt: isMobile ? -8 : -10, 
                                        mb: 4 
                                    }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <Box
                                                sx={{
                                                    width: isMobile ? 80 : 120,
                                                    height: isMobile ? 80 : 120,
                                                    borderRadius: '50%',
                                                    border: '4px solid white',
                                                    bgcolor: 'grey.200',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <img
                                                    src="https://test-api.pro-manager.net/zohorain-v1/public/assets/admin/img/160x160/img1.jpg"
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy" // Next.js optimization
                                                />
                                            </Box>
                                            <label
                                                htmlFor="avatar-upload"
                                                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
                                                style={{
                                                    transform: isMobile ? 'scale(0.8)' : 'scale(1)',
                                                    transformOrigin: 'bottom right'
                                                }}
                                            >
                                                <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                <input
                                                    type="file"
                                                    id="avatar-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </label>
                                        </Box>
                                    </Box>
                                </Card>

                                {/* Basic Information Form */}
                                <Card sx={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}>
                                    <CardHeader
                                        title={
                                            <Box display="flex" alignItems="center">
                                                <InfoIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                                                <Typography variant="h6" fontWeight="bold">
                                                    Profile Information
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            py: 2
                                        }}
                                    />
                                    <CardContent>
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    name="f_name"
                                                    value={generalFormik.values.f_name}
                                                    onChange={generalFormik.handleChange}
                                                    onBlur={generalFormik.handleBlur}
                                                    error={generalFormik.touched.f_name && Boolean(generalFormik.errors.f_name)}
                                                    helperText={generalFormik.touched.f_name && generalFormik.errors.f_name}
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    name="l_name"
                                                    value={generalFormik.values.l_name}
                                                    onChange={generalFormik.handleChange}
                                                    onBlur={generalFormik.handleBlur}
                                                    error={generalFormik.touched.l_name && Boolean(generalFormik.errors.l_name)}
                                                    helperText={generalFormik.touched.l_name && generalFormik.errors.l_name}
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel>Phone Number</InputLabel>
                                                <TextField
                                                    value={generalFormik.values.phone}
                                                    onChange={generalFormik.handleChange}
                                                    onBlur={generalFormik.handleBlur}
                                                    name="phone"
                                                    label="Phone Number"
                                                    error={generalFormik.touched.phone && Boolean(generalFormik.errors.phone)}
                                                    helperText={generalFormik.touched.phone && generalFormik.errors.phone}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Select
                                                                    value={countryCode}
                                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                                    className="w-32"
                                                                    variant="standard"
                                                                    disableUnderline
                                                                    sx={{
                                                                        '& .MuiSelect-select': {
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }
                                                                    }}
                                                                >
                                                                    {countries.map((country) => (
                                                                        <MenuItem key={country.code} value={country.code}>
                                                                            <Box display="flex" alignItems="center">
                                                                                <span style={{ marginRight: 8 }}>{country.flag}</span>
                                                                                {country.code}
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </FormControl>

                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={generalFormik.values.email}
                                                onChange={generalFormik.handleChange}
                                                onBlur={generalFormik.handleBlur}
                                                error={generalFormik.touched.email && Boolean(generalFormik.errors.email)}
                                                helperText={generalFormik.touched.email && generalFormik.errors.email}
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Password (leave empty to keep current)"
                                                name="password"
                                                type="password"
                                                value={generalFormik.values.password}
                                                onChange={generalFormik.handleChange}
                                                onBlur={generalFormik.handleBlur}
                                                error={generalFormik.touched.password && Boolean(generalFormik.errors.password)}
                                                helperText={generalFormik.touched.password && generalFormik.errors.password}
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={isLoading.profile}
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        '&:hover': { bgcolor: 'primary.dark' },
                                                        px: 4,
                                                        py: 1.5,
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        fontWeight: '500',
                                                        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
                                                    }}
                                                >
                                                    {isLoading.profile ? 'Updating...' : 'Update Profile'}
                                                </Button>
                                            </Box>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={passwordFormik.handleSubmit}>
                                <Card sx={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}>
                                    <CardHeader
                                        title={
                                            <Box display="flex" alignItems="center">
                                                <LockIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                                                <Typography variant="h6" fontWeight="bold">
                                                    Password & Security
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            py: 2
                                        }}
                                    />
                                    <CardContent>
                                        <div className="flex flex-col gap-6">
                                            <TextField
                                                fullWidth
                                                label="Current Password"
                                                name="currentPassword"
                                                type={showPassword.current ? 'text' : 'password'}
                                                value={passwordFormik.values.currentPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                                                helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => togglePasswordVisibility('current')}
                                                                edge="end"
                                                            >
                                                                {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                name="newPassword"
                                                type={showPassword.new ? 'text' : 'password'}
                                                value={passwordFormik.values.newPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                                                helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => togglePasswordVisibility('new')}
                                                                edge="end"
                                                            >
                                                                {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type={showPassword.confirm ? 'text' : 'password'}
                                                value={passwordFormik.values.confirmPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                                                helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => togglePasswordVisibility('confirm')}
                                                                edge="end"
                                                            >
                                                                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <Card variant="outlined" sx={{ borderRadius: '8px', p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Password Requirements
                                                </Typography>
                                                <Box>
                                                    <PasswordRequirement
                                                        text="At least 8 characters long"
                                                        isValid={passwordFormik.values.newPassword.length >= 8}
                                                    />
                                                    <PasswordRequirement
                                                        text="Contains at least one letter"
                                                        isValid={/[a-zA-Z]/.test(passwordFormik.values.newPassword)}
                                                    />
                                                    <PasswordRequirement
                                                        text="Contains at least one number"
                                                        isValid={/[0-9]/.test(passwordFormik.values.newPassword)}
                                                    />
                                                    <PasswordRequirement
                                                        text="Passwords match"
                                                        isValid={
                                                            passwordFormik.values.newPassword === passwordFormik.values.confirmPassword &&
                                                            passwordFormik.values.newPassword.length > 0
                                                        }
                                                    />
                                                </Box>
                                            </Card>

                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={isLoading.password}
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        '&:hover': { bgcolor: 'primary.dark' },
                                                        px: 4,
                                                        py: 1.5,
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        fontWeight: '500',
                                                        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
                                                    }}
                                                >
                                                    {isLoading.password ? 'Updating...' : 'Update Password'}
                                                </Button>
                                            </Box>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
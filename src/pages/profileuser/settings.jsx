// pages/settings.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
    FormHelperText,
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

// Form validation schemas
const generalSchema = Yup.object({
    firstName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
        .required('First name is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
        .required('Last name is required'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(8, 'Phone number must be at least 8 digits')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

const passwordSchema = Yup.object({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

export default function Settings() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countryCode, setCountryCode] = useState('+966');
    const [formData, setFormData] = useState({
        firstName: 'husain',
        lastName: 'Ali',
        phone: '0543005927',
        email: 'constantgrowth25@gmail.com',
        password: '',
        confirmPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Formik for general information form
    const generalFormik = useFormik({
        initialValues: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
        },
        validationSchema: generalSchema,
        onSubmit: (values) => {
            setFormData(prev => ({ ...prev, ...values }));
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        },
    });

    // Formik for password form
    const passwordFormik = useFormik({
        initialValues: {
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        },
        validationSchema: passwordSchema,
        onSubmit: (values) => {
            setFormData(prev => ({ ...prev, ...values }));
            passwordFormik.resetForm();
            setSuccessMessage('Password updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        },
    });

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
                        <Link href="/dashboard" passHref>
                            <Button
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
                    <div className="w-full lg:w-3/4 ">
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
                                {/* Profile Cover & Avatar - Now visible on all screens */}
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
                                            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
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
                                                    name="firstName"
                                                    value={generalFormik.values.firstName}
                                                    onChange={generalFormik.handleChange}
                                                    onBlur={generalFormik.handleBlur}
                                                    error={generalFormik.touched.firstName && Boolean(generalFormik.errors.firstName)}
                                                    helperText={generalFormik.touched.firstName && generalFormik.errors.firstName}
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
                                                    name="lastName"
                                                    value={generalFormik.values.lastName}
                                                    onChange={generalFormik.handleChange}
                                                    onBlur={generalFormik.handleBlur}
                                                    error={generalFormik.touched.lastName && Boolean(generalFormik.errors.lastName)}
                                                    helperText={generalFormik.touched.lastName && generalFormik.errors.lastName}
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

                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
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
                                                    Update Profile
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
                                                label="New Password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={passwordFormik.values.password}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
                                                helperText={passwordFormik.touched.password && passwordFormik.errors.password}
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
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
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
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                                        isValid={passwordFormik.values.password.length >= 8}
                                                    />
                                                    <PasswordRequirement
                                                        text="Contains at least one letter"
                                                        isValid={/[a-zA-Z]/.test(passwordFormik.values.password)}
                                                    />
                                                    <PasswordRequirement
                                                        text="Contains at least one number"
                                                        isValid={/[0-9]/.test(passwordFormik.values.password)}
                                                    />
                                                    <PasswordRequirement
                                                        text="Passwords match"
                                                        isValid={
                                                            passwordFormik.values.password === passwordFormik.values.confirmPassword &&
                                                            passwordFormik.values.password.length > 0
                                                        }
                                                    />
                                                </Box>
                                            </Card>

                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
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
                                                    Update Password
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
import { useState, useRef } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from 'next/router';

const EditRestaurant = () => {
    const router = useRouter(); // Initialize router for navigation
    const [activeTab, setActiveTab] = useState('default');
    const [logoPreview, setLogoPreview] = useState('/assets/logos/2025-07-22-687f61523c255.png');
    const [coverPreview, setCoverPreview] = useState('/assets/logos/2025-07-22-687f61523c255.png');
    const [formData, setFormData] = useState({
        names: {
            default: "مخبز و مقهى زهورين",
            en: "zohorain",
            ar: ""
        },
        addresses: {
            default: "شارع حمزة بن عبدالمطلب, Ash Shati, Al Qatif 32617",
            en: "شارع حمزة بن عبدالمطلب, Ash Shati, Al Qatif 32617",
            ar: ""
        },
        contact: "+9660543005927",
        logo: null,
        cover: null
    });
    const [errors, setErrors] = useState({
        names: { default: '', en: '', ar: '' },
        addresses: { default: '', en: '', ar: '' },
        contact: ''
    });
    
    const logoInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const tokenRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleImageChange = (e, setPreview, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const triggerFileInput = (ref) => {
        ref.current.click();
    };

    const handleChange = (field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
        
        // Clear error when user starts typing
        if (errors[field][lang]) {
            setErrors(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: ''
                }
            }));
        }
    };

    const handleContactChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, contact: value }));
        
        if (errors.contact) {
            setErrors(prev => ({ ...prev, contact: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            names: { default: '', en: '', ar: '' },
            addresses: { default: '', en: '', ar: '' },
            contact: ''
        };

        // Name validation
        const nameRegex = /^[\p{L}\s]{8,}$/u;
        ['default', 'en', 'ar'].forEach(lang => {
            if (!formData.names[lang] || formData.names[lang].trim() === '') {
                newErrors.names[lang] = 'Name is required';
                isValid = false;
            } else if (!nameRegex.test(formData.names[lang])) {
                newErrors.names[lang] = 'Name must be at least 8 characters and contain only letters';
                isValid = false;
            }
        });

        // Address validation
        ['default', 'en', 'ar'].forEach(lang => {
            if (!formData.addresses[lang] || formData.addresses[lang].trim() === '') {
                newErrors.addresses[lang] = 'Address is required';
                isValid = false;
            }
        });

        // Contact validation
        const contactRegex = /^\+?[0-9]+$/;
        if (!formData.contact || formData.contact.trim() === '') {
            newErrors.contact = 'Contact number is required';
            isValid = false;
        } else if (!contactRegex.test(formData.contact)) {
            newErrors.contact = 'Contact must contain only numbers and an optional plus sign';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Prepare form data for API submission
        const formDataToSend = new FormData();
        formDataToSend.append('_token', tokenRef.current.value);
        
        // Append names and addresses
        formDataToSend.append('name[]', formData.names.default);
        formDataToSend.append('name[]', formData.names.en);
        formDataToSend.append('name[]', formData.names.ar);
        
        formDataToSend.append('address[]', formData.addresses.default);
        formDataToSend.append('address[]', formData.addresses.en);
        formDataToSend.append('address[]', formData.addresses.ar);
        
        formDataToSend.append('contact', formData.contact);
        
        if (formData.logo) {
            formDataToSend.append('image', formData.logo);
        }
        
        if (formData.cover) {
            formDataToSend.append('photo', formData.cover);
        }

        try {
            // Replace with your actual API endpoint
            const response = await fetch('YOUR_API_ENDPOINT_HERE', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                alert('Restaurant updated successfully!');
                // REDIRECT TO HOME PAGE AFTER SUCCESS
                router.push('/');
            } else {
                alert('Failed to update restaurant. Please try again.');
            }
        } catch (error) {
            console.error('Error updating restaurant:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container-fluid mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                        <h2 className="text-xl font-[500] flex items-center">
                            <div className="mr-3">
                                <Image
                                    src="/assets/logos/resturant.png"
                                    alt="Restaurant"
                                    width={25}
                                    height={25}
                                />
                            </div>
                            <span>Edit Restaurant Information</span>
                        </h2>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="hidden"
                    name="_token"
                    value="f4TG8a30bRXnrXSHLeLdH5alPmAJf1mC9jn5S7VC"
                    autoComplete="off"
                    ref={tokenRef}
                />

                <div className="grid grid-cols-1 gap-6">
                    <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        <CardContent className="p-6">
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                className="border-b border-gray-200"
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab label="Default" value="default" className="font-medium" />
                                <Tab label="English (EN)" value="en" className="font-medium" />
                                <Tab label="Arabic - العربية (AR)" value="ar" className="font-medium" />
                            </Tabs>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {/* Restaurant Name Fields */}
                                    <div className={`${activeTab === 'default' ? 'block' : 'hidden'} mb-3`}>
                                        <TextField
                                            fullWidth
                                            label="Restaurant Name (Default)"
                                            name="name[]"
                                            value={formData.names.default}
                                            onChange={(e) => handleChange('names', 'default', e.target.value)}
                                            placeholder="Restaurant name"
                                            className="mb-4"
                                            error={Boolean(errors.names.default)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.names.default && (
                                            <FormHelperText error className="mt-[-0.5rem] mb-3">
                                                {errors.names.default}
                                            </FormHelperText>
                                        )}
                                    </div>
                                    <div className={`${activeTab === 'en' ? 'block' : 'hidden'} mb-3`}>
                                        <TextField
                                            fullWidth
                                            label="Restaurant name (EN)"
                                            name="name[]"
                                            value={formData.names.en}
                                            onChange={(e) => handleChange('names', 'en', e.target.value)}
                                            placeholder="Restaurant name"
                                            className="mb-4"
                                            error={Boolean(errors.names.en)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.names.en && (
                                            <FormHelperText error className="mt-[-0.5rem] mb-3">
                                                {errors.names.en}
                                            </FormHelperText>
                                        )}
                                    </div>
                                    <div className={`${activeTab === 'ar' ? 'block' : 'hidden'} mb-3`}>
                                        <TextField
                                            fullWidth
                                            label="Restaurant name (AR)"
                                            name="name[]"
                                            value={formData.names.ar}
                                            onChange={(e) => handleChange('names', 'ar', e.target.value)}
                                            placeholder="Restaurant name"
                                            className="mb-4"
                                            error={Boolean(errors.names.ar)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.names.ar && (
                                            <FormHelperText error className="mt-[-0.5rem] mb-3">
                                                {errors.names.ar}
                                            </FormHelperText>
                                        )}
                                    </div>

                                    <input type="hidden" name="lang[]" value="default" />
                                    <input type="hidden" name="lang[]" value="en" />
                                    <input type="hidden" name="lang[]" value="ar" />

                                    {/* Contact Number */}
                                    <TextField
                                        fullWidth
                                        label="Contact number"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleContactChange}
                                        placeholder="Ex : +966 123456789"
                                        required
                                        className="mt-4"
                                        error={Boolean(errors.contact)}
                                        variant="outlined"
                                        InputProps={{
                                            className: "rounded-lg bg-gray-50"
                                        }}
                                    />
                                    {errors.contact && (
                                        <FormHelperText error>
                                            {errors.contact}
                                        </FormHelperText>
                                    )}
                                </div>

                                <div>
                                    {/* Address Fields */}
                                    <div className={`${activeTab === 'default' ? 'block' : 'hidden'}`}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Restaurant address (Default)"
                                            name="address[]"
                                            value={formData.addresses.default}
                                            onChange={(e) => handleChange('addresses', 'default', e.target.value)}
                                            placeholder="Ex: Street, City, Country"
                                            required
                                            error={Boolean(errors.addresses.default)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.addresses.default && (
                                            <FormHelperText error>
                                                {errors.addresses.default}
                                            </FormHelperText>
                                        )}
                                    </div>
                                    <div className={`${activeTab === 'en' ? 'block' : 'hidden'}`}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Restaurant address (EN)"
                                            name="address[]"
                                            value={formData.addresses.en}
                                            onChange={(e) => handleChange('addresses', 'en', e.target.value)}
                                            placeholder="Ex: Street, City, Country"
                                            error={Boolean(errors.addresses.en)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.addresses.en && (
                                            <FormHelperText error>
                                                {errors.addresses.en}
                                            </FormHelperText>
                                        )}
                                    </div>
                                    <div className={`${activeTab === 'ar' ? 'block' : 'hidden'}`}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Restaurant address (AR)"
                                            name="address[]"
                                            value={formData.addresses.ar}
                                            onChange={(e) => handleChange('addresses', 'ar', e.target.value)}
                                            placeholder="Ex: Street, City, Country"
                                            error={Boolean(errors.addresses.ar)}
                                            variant="outlined"
                                            InputProps={{
                                                className: "rounded-lg bg-gray-50"
                                            }}
                                        />
                                        {errors.addresses.ar && (
                                            <FormHelperText error>
                                                {errors.addresses.ar}
                                            </FormHelperText>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo & Cover Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo Upload */}
                        <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                            <CardContent className="p-6">
                                <Typography variant="h6" className="font-medium text-gray-800 mb-4">
                                    Upload Restaurant Logo <span className="text-red-500">(Ratio 200×200)</span>
                                </Typography>
                                <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="bg-white flex items-center justify-center rounded-lg" style={{ width: '200px', height: '200px' }}>
                                        <Image
                                            src={logoPreview}
                                            alt="Restaurant logo"
                                            width={100}
                                            height={100}
                                            className="rounded-lg shadow-md object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <input
                                        type="file"
                                        name="image"
                                        ref={logoInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, setLogoPreview, 'logo')}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => triggerFileInput(logoInputRef)}
                                        className="w-full rounded-lg"
                                    >
                                        Choose file
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cover Upload */}
                        <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                            <CardContent className="p-6">
                                <Typography variant="h6" className="font-medium text-gray-800 mb-4">
                                    Upload Cover Photo <span className="text-red-500">(Ratio : 1100×320)</span>
                                </Typography>
                                <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="bg-white flex items-center justify-center rounded-lg w-full" style={{ maxWidth: '200px', aspectRatio: '200/200' }}>
                                        <Image
                                            src={coverPreview}
                                            alt="Cover photo"
                                            width={100}
                                            height={100}
                                            className="rounded-lg shadow-md object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <input
                                        type="file"
                                        name="photo"
                                        ref={coverInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, setCoverPreview, 'cover')}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => triggerFileInput(coverInputRef)}
                                        className="w-full rounded-lg"
                                    >
                                        Choose file
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-5 mt-4">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-3 font-medium shadow-md text-white "
                        >
                            Update Restaurant
                        </Button>
                        <Button
                            href="/business-management/myRestaurantProfile"
                            variant="outlined"
                            color="error"
                            className="border-red-500 text-red-500 hover:bg-red-50 rounded-lg px-8 py-3 font-medium "
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditRestaurant;
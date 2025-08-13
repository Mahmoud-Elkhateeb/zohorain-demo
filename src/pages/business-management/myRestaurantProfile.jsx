// components/myRestaurantProfile.jsx
import { useState, useEffect } from 'react';
import { Switch, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';
import Link from 'next/link';


const MyRestaurantProfile = () => {
    // Restaurant data state
    const [restaurant, setRestaurant] = useState({
        name: "zohorain",
        createdAt: "2025-07-22T01:01:00Z",
        businessModel: "Commission Base",
        adminCommission: "0%",
        phone: "+9660543005927",
        address: "شارع حمزة بن عبدالمطلب, Ash Shati, Al Qatif 32617"
    });
    const [loading, setLoading] = useState(true);

    // Formik configuration for announcements
    const formik = useFormik({
        initialValues: {
            announcementStatus: true,
            announcementMessage: ''
        },
        validationSchema: Yup.object({
            announcementMessage: Yup.string()
                .required('Announcement is required')
                .max(254, 'Announcement must be at most 254 characters')
        }),
        onSubmit: async (values) => {
            try {
                // This will be the actual API call when endpoint is ready
                /*
                const response = await fetch('YOUR_ANNOUNCEMENT_API_ENDPOINT', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    status: values.announcementStatus,
                    message: values.announcementMessage
                  })
                });
                
                if (!response.ok) throw new Error('Failed to save announcement');
                */

                console.log('Announcement published:', values);
                alert('Announcement published successfully!');
            } catch (error) {
                console.error('Error publishing announcement:', error);
                alert('Failed to publish announcement');
            }
        }
    });

    // Fetch restaurant data from API
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Simulating API fetch
                /*
                const response = await fetch('YOUR_RESTAURANT_API_ENDPOINT');
                const data = await response.json();
                setRestaurant(data);
                */

                // Mock data - remove this when API is ready
                setTimeout(() => {
                    setRestaurant({
                        name: "zohorain",
                        createdAt: "2025-07-22T01:01:00Z",
                        businessModel: "Commission Base",
                        adminCommission: "0%",
                        phone: "+9660543005927",
                        address: "شارع حمزة بن عبدالمطلب, Ash Shati, Al Qatif 32617"
                    });
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, []);

    // Format creation date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
    };

    if (loading) {
        return (
            <div className="">
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className="container-fluid mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    {/* Page Header */}
                    <div className="mb-4">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-700">Shop Details</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Created at {formatDate(restaurant.createdAt)}
                                </p>
                            </div>
                            <div>
                                <Link
                                    href="/business-management/editRestaurant"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    
                                    Edit Shop
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Banner Section */}
                    <section className="">
                        <div className="rounded-xl overflow-hidden">
                            {/* Cover Photo */}
                            <div className="relative h-54 w-full">
                                <Image
                                    src="/assets/logos/2025-07-22-687f61523c255.png"
                                    alt="Restaurant cover"
                                    layout="fill"
                                    objectFit="cover"
                                    className="object-cover"
                                />
                            </div>

                            {/* Profile Content */}
                            <div className="relative px-6 pb-6 -mt-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Logo Section */}
                                    <div className="flex-shrink-0 flex flex-col items-center">
                                        <div className=" p-1 ">
                                            <div className="relative w-32 h-32  overflow-hidden  ">
                                                <Image
                                                    src="/assets/logos/2025-07-22-687f61523c255.png"
                                                    alt="Restaurant logo"
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold md:hidden">{restaurant.name}</h3>
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-grow">
                                        <h3 className="mt-4 text-xl font-[500] hidden md:block">{restaurant.name}</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                            {/* Business Model */}
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <Image
                                                        src="/assets/logos/icon-1.png"
                                                        alt="Model icon"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold text-gray-700">Business Model</h6>
                                                    <p className="text-gray-600">{restaurant.businessModel}</p>
                                                </div>
                                            </div>

                                            {/* Admin Commission */}
                                            <div className="flex items-start gap-3">
                                                <div className="bg-green-100 p-2 rounded-lg">
                                                    <Image
                                                        src="/assets/logos/icon_6.png"
                                                        alt="Commission icon"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold text-gray-700">Admin Commission</h6>
                                                    <p className="text-gray-600">{restaurant.adminCommission}</p>
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="flex items-start gap-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Image
                                                        src="/assets/logos/icon-3.png"
                                                        alt="Phone icon"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold text-gray-700">Phone</h6>
                                                    <p className="text-gray-600">{restaurant.phone}</p>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="flex items-start gap-3">
                                                <div className="bg-orange-100 p-2 rounded-lg">
                                                    <Image
                                                        src="/assets/logos/icon-4.png"
                                                        alt="Address icon"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold text-gray-700">Address</h6>
                                                    <p className="text-gray-600">{restaurant.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Announcement Section */}
                        <div className="bg-white rounded-xl shadow-sm mt-0">
                            <div className="p-4 border-b flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/assets/logos/company.png"
                                        alt="Announcement"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="font-bold">Announcement</span>
                                    <div className="ml-1 cursor-pointer">
                                        <Image
                                            src="/assets/logos/info-circle.svg"
                                            alt="Info"
                                            width={16}
                                            height={16}
                                            title="This announcement shown in the user app/web"
                                        />
                                    </div>
                                </div>
                                <Switch
                                    checked={formik.values.announcementStatus}
                                    onChange={(e) => formik.setFieldValue('announcementStatus', e.target.checked)}
                                    color="primary"
                                />
                            </div>

                            <div className="p-4">
                                <form onSubmit={formik.handleSubmit}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        name="announcementMessage"
                                        value={formik.values.announcementMessage}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.announcementMessage && Boolean(formik.errors.announcementMessage)}
                                        helperText={formik.touched.announcementMessage && formik.errors.announcementMessage}
                                        placeholder="Ex: ABC Company"
                                        variant="outlined"
                                        inputProps={{ maxLength: 254 }}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={formik.isSubmitting}
                                        >
                                            Publish
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MyRestaurantProfile;
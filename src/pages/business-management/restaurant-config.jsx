import React, { useState } from 'react';
import {
    Switch,
    FormControlLabel,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton
} from '@mui/material';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';

const RestaurantConfig = () => {
    // Toggle states
    const [restaurantClosed, setRestaurantClosed] = useState(false);
    const [scheduledDelivery, setScheduledDelivery] = useState(true);
    const [homeDelivery, setHomeDelivery] = useState(true);
    const [freeDelivery, setFreeDelivery] = useState(false);
    const [takeaway, setTakeaway] = useState(true);
    const [veg, setVeg] = useState(true);
    const [nonVeg, setNonVeg] = useState(true);
    const [cutlery, setCutlery] = useState(false);
    const [instantOrder, setInstantOrder] = useState(true);
    const [customDateOrder, setCustomDateOrder] = useState(false);
    const [halalTag, setHalalTag] = useState(true);
    const [freeDeliveryDistance, setFreeDeliveryDistance] = useState(false);
    const [gstStatus, setGstStatus] = useState(false);

    // Snackbar state
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Popup state
    const [openPopup, setOpenPopup] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
        title: '',
        description: '',
        image: '',
        currentValue: false,
        setter: null,
        fieldName: ''
    });

    // Opening hours states
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [currentDay, setCurrentDay] = useState('');
    const [openingHours, setOpeningHours] = useState({
        Monday: { open: '00:21', close: '23:21' },
        Tuesday: { open: '00:21', close: '23:21' },
        Wednesday: { open: '00:21', close: '23:21' },
        Thursday: { open: '00:21', close: '23:21' },
        Friday: { open: '00:21', close: '23:21' },
        Saturday: { open: '00:21', close: '23:21' },
        Sunday: { open: '00:21', close: '23:21' }
    });
    const [newSchedule, setNewSchedule] = useState({
        open: '',
        close: ''
    });

    // Form states
    const [formData, setFormData] = useState({
        customer_order_date: 0,
        minimum_order: 0,
        minimum_delivery_charge: 0,
        per_km_delivery_charge: 0,
        maximum_shipping_charge: '',
        free_delivery_distance: '',
        gst: '',
        cuisine_ids: [],
        tags: '',
        characteristics: [],
        meta_title: ['', '', ''],
        meta_description: ['', '', ''],
    });

    const [metaImage, setMetaImage] = useState(null);
    const [activeLang, setActiveLang] = useState('default');
    const [errors, setErrors] = useState({
        minimum_delivery_charge: '',
        per_km_delivery_charge: ''
    });

    // Formik validation schema
    const validationSchema = Yup.object().shape({
        meta_title: Yup.array().of(
            Yup.string().required('Meta title is required')
        ),
        meta_description: Yup.array().of(
            Yup.string()
                .required('Meta description is required')
                .min(15, 'Meta description must be at least 15 characters')
        )
    });

    const formik = useFormik({
        initialValues: {
            meta_title: ['', '', ''],
            meta_description: ['', '', '']
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted:', values);
            setSnackbarMessage('Meta data updated');
            setOpenSnackbar(true);
        }
    });

    // Opening hours handlers
    const handleOpenDeleteConfirm = (day) => {
        setCurrentDay(day);
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    const handleConfirmDelete = () => {
        setOpeningHours(prev => ({
            ...prev,
            [currentDay]: { open: '', close: '' }
        }));
        setOpenDeleteConfirm(false);
        setSnackbarMessage('Schedule removed successfully');
        setOpenSnackbar(true);
    };

    const handleOpenAddEditDialog = (day) => {
        setCurrentDay(day);
        if (openingHours[day].open && openingHours[day].close) {
            setNewSchedule({
                open: openingHours[day].open,
                close: openingHours[day].close
            });
        } else {
            setNewSchedule({ open: '', close: '' });
        }
        setOpenAddEditDialog(true);
    };

    const handleCloseAddEditDialog = () => {
        setOpenAddEditDialog(false);
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSchedule = () => {
        setOpeningHours(prev => ({
            ...prev,
            [currentDay]: { open: newSchedule.open, close: newSchedule.close }
        }));
        setOpenAddEditDialog(false);
        if (openingHours[currentDay].open && openingHours[currentDay].close) {
            setSnackbarMessage('Schedule updated successfully');
        } else {
            setSnackbarMessage('Schedule added successfully');
        }
        setOpenSnackbar(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMetaImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate fields on input
        if (name === 'minimum_delivery_charge' || name === 'per_km_delivery_charge') {
            validateField(name, value);
        }
    };

    const validateField = (name, value) => {
        let error = '';
        if (!value) {
            error = 'This field is required';
        } else if (parseFloat(value) <= 1) {
            error = 'Value must be greater than 1';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleLangChange = (lang) => {
        setTimeout(() => {
            setActiveLang(lang);
        }, 100);
    };

    const handleMetaTitleChange = (e, langIndex) => {
        const newTitles = [...formData.meta_title];
        newTitles[langIndex] = e.target.value;
        setFormData(prev => ({ ...prev, meta_title: newTitles }));
        formik.setFieldValue(`meta_title[${langIndex}]`, e.target.value);
    };

    const handleMetaDescriptionChange = (e, langIndex) => {
        const newDescriptions = [...formData.meta_description];
        newDescriptions[langIndex] = e.target.value;
        setFormData(prev => ({ ...prev, meta_description: newDescriptions }));
        formik.setFieldValue(`meta_description[${langIndex}]`, e.target.value);
    };

    const getLangIndex = () => {
        return activeLang === 'default' ? 0 : activeLang === 'en' ? 1 : 2;
    };

    const handleOpenPopup = (title, description, image, currentValue, setter, fieldName) => {
        setPopupConfig({
            title,
            description,
            image,
            currentValue,
            setter,
            fieldName
        });
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleConfirmChange = () => {
        popupConfig.setter(!popupConfig.currentValue);
        setSnackbarMessage(`${popupConfig.fieldName} settings updated!`);
        setOpenSnackbar(true);
        setOpenPopup(false);
    };

    const handleUpdate = () => {
        // Validate required fields
        const isMinDeliveryValid = validateField('minimum_delivery_charge', formData.minimum_delivery_charge);
        const isPerKmValid = validateField('per_km_delivery_charge', formData.per_km_delivery_charge);

        if (isMinDeliveryValid && isPerKmValid) {
            setSnackbarMessage('Restaurant settings updated');
            setOpenSnackbar(true);
        }
    };

    const handleReset = () => {
        setFormData({
            customer_order_date: 0,
            minimum_order: 0,
            minimum_delivery_charge: 0,
            per_km_delivery_charge: 0,
            maximum_shipping_charge: '',
            free_delivery_distance: '',
            gst: '',
            cuisine_ids: [],
            tags: '',
            characteristics: [],
            meta_title: ['', '', ''],
            meta_description: ['', '', ''],
        });
        setErrors({
            minimum_delivery_charge: '',
            per_km_delivery_charge: ''
        });
    };

    return (
        <div className="container-fuild mx-auto p-2">
            {/* Page Header */}
            <div className="mb-6 flex items-center">
                <div className="mr-3">
                    <Image
                        src="/assets/logos/resturant.png"
                        alt="Restaurant"
                        width={25}
                        height={25}
                    />
                </div>
                <h2 className="text-xl font-[500]">Restaurant Setup</h2>
            </div>

            {/* Close Restaurant Card */}
            <div className="card bg-white rounded-lg shadow-md mb-6">
                <div className="card-body p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="mr-2">🔧</span>
                            <h4 className="m-0 font-medium">
                                Close Restaurant Temporarily
                                <span
                                    className="ml-2 cursor-pointer"
                                    title="If enabled this restaurant will be closed temporarily and hidden from customer app and web app. Restaurant owners can re-open this restaurant anytime by turning off this button."
                                >
                                    ℹ️
                                </span>
                            </h4>
                        </div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={restaurantClosed}
                                    onChange={() => handleOpenPopup(
                                        restaurantClosed ? 'Want to close your restaurant temporarily ?' : 'Want to make your restaurant available for all ?',
                                        restaurantClosed
                                            ? 'If yes this restaurant will be unavailable for customers in apps and web'
                                            : 'If yes this restaurant will be available for customers in app and web',
                                        '/assets/logos/wrong-cancel-close-svgrepo-com.svg',
                                        restaurantClosed,
                                        setRestaurantClosed,
                                        'Restaurant status'
                                    )}
                                />
                            }
                            label=""
                        />
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="card bg-white rounded-lg shadow-md mb-6">
                <div className="card-header p-4 border-b border-[#e4e4e4]">
                    <h5 className="card-title text-[1.05rem] font-[500] flex items-center">
                        <span className="mr-2">🍔</span> General settings
                    </h5>
                </div>
                <div className="card-body p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Toggle Items */}
                        {[
                            {
                                id: 'schedule_order',
                                label: 'Scheduled Delivery',
                                state: scheduledDelivery,
                                setter: setScheduledDelivery,
                                title: 'If enabled customers can order food on a scheduled basis from your restaurant.',
                                secondTitle: 'If disabled the Scheduled Order option will be hidden from your restaurant.',
                                image: ['/assets/logos/schedule-on.png', '/assets/logos/schedule-off.png'],

                            },
                            {
                                id: 'delivery',
                                label: 'Home Delivery',
                                state: homeDelivery,
                                setter: setHomeDelivery,
                                title: 'If enabled customers can order food for home delivery.',
                                secondTitle: 'If disabled the home delivery option will be hidden from your restaurant.',
                                image: ['/assets/logos/dm-self-reg-on.png', '/assets/logos/dm-self-reg-off.png'],

                            },
                            {
                                id: 'free_delivery',
                                label: 'Free delivery',
                                state: freeDelivery,
                                setter: setFreeDelivery,
                                title: 'If enabled customers can order food for free delivery.',
                                secondTitle: 'If disabled the free delivery option will be hidden from your restaurant.',
                                image: ['/assets/logos/free-delivery-on.png', '/assets/logos/free-delivery-off.png']
                            },
                            {
                                id: 'take_away',
                                label: 'Takeaway',
                                state: takeaway,
                                setter: setTakeaway,
                                title: 'If enabled customers can place takeaway/self-pickup orders.',
                                secondTitle: 'If disabled the takeaway option will be hidden from your restaurant.',
                                image: ['/assets/logos/takeaway-on.png', '/assets/logos/takeaway-off.png']
                            },
                            {
                                id: 'veg',
                                label: 'Veg',
                                state: veg,
                                setter: setVeg,
                                title: 'If enabled customers can find your restaurant in the veg restaurant list.',
                                secondTitle: 'If disabled your restaurant will be hidden from the veg restaurant list.',
                                image: ['/assets/logos/veg-on.png', '/assets/logos/veg-off.png']
                            },
                            {
                                id: 'non_veg',
                                label: 'Non veg',
                                state: nonVeg,
                                setter: setNonVeg,
                                title: 'If enabled customers can find your restaurant in the veg restaurant list.',
                                secondTitle: 'If disabled your restaurant will be hidden from the veg restaurant list.',
                                image: ['/assets/logos/veg-on.png', '/assets/logos/veg-off.png']

                            },
                            {
                                id: 'cutlery',
                                label: 'Cutlery',
                                state: cutlery,
                                setter: setCutlery,
                                title: 'If enabled customers can order food with or without cutlery from your restaurant.',
                                secondTitle: 'If disabled the cutlery option will be hidden from your restaurant.',
                                image: ['', '']
                            },
                            {
                                id: 'instant_order',
                                label: 'Instant order',
                                state: instantOrder,
                                setter: setInstantOrder,
                                title: 'If enabled customers can order instantly',
                                secondTitle: 'If disabled customers can not order instantly.',
                                image: ['/assets/logos/veg-on.png', '/assets/logos/veg-off.png']

                            },
                            {
                                id: 'customer_date_order_sratus',
                                label: 'Custom date order status',
                                state: customDateOrder,
                                setter: setCustomDateOrder,
                                title: 'If enabled customers can not select schedule date over the given days. and you must set a date on the Customer Can Order Within field',
                                secondTitle: 'If disabled customers can select any schedule date',
                                image: ['/assets/logos/schedule-on.png', '/assets/logos/schedule-off.png'],

                            },
                            {
                                id: 'halal_tag_status',
                                label: 'Halal tag status',
                                state: halalTag,
                                setter: setHalalTag,
                                title: 'If enabled customers can see halal tag on product',
                                secondTitle: 'If disabled customers can not see halal tag on product.',
                                image: ['/assets/logos/schedule-on.png', '/assets/logos/schedule-off.png'],

                            },
                        ].map((item) => (
                            <div key={item.id} className="border-1 border-[#e4e4e4] rounded p-1 flex justify-between items-center">
                                <div>
                                    <span className="font-[400] text-[0.95rem] ml-3">{item.label}</span>
                                    <span
                                        className="ml-2 cursor-pointer"
                                        title={item.title}
                                    >
                                        ℹ️
                                    </span>
                                </div>
                                <Switch
                                    checked={item.state}
                                    onChange={() => handleOpenPopup(
                                        item.state ? `Want to disable the ${item.label} Option ?` : `Want to enable the ${item.label} Option ?`,
                                        item.state
                                            ? `${item.secondTitle}`
                                            : `${item.title}`,
                                        item.image[item.state ? 1 : 0],
                                        item.state,
                                        item.setter,
                                        item.label
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Basic Settings */}
            <div className="card bg-white rounded-lg shadow-md mb-6">
                <div className="card-header p-4 border-b border-[#e4e4e4]">
                    <h5 className="card-title text-[1.05rem] font-[500] flex items-center">
                        <span className="mr-2">⚙️</span> Basic settings
                    </h5>
                </div>
                <div className="card-body p-4">
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <TextField
                                label="Customer Can Order Within (Days)"
                                title='Customers can not select schedule date over this given days.'
                                type="number"
                                name="customer_order_date"
                                value={formData.customer_order_date}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Minimum order amount"
                                title='Specify the minimum order amount required for customers when ordering from this restaurant.'
                                type="number"
                                name="minimum_order"
                                value={formData.minimum_order}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Minimum delivery charge (ر.س.‏)"
                                type="number"
                                name="minimum_delivery_charge"
                                value={formData.minimum_delivery_charge}
                                onChange={handleChange}
                                onBlur={(e) => validateField('minimum_delivery_charge', e.target.value)}
                                error={!!errors.minimum_delivery_charge}
                                helperText={errors.minimum_delivery_charge}
                                fullWidth
                                required
                                inputProps={{ min: "1", step: "0.01" }}
                            />

                            <TextField
                                label="Delivery charge per km (ر.س.‏)"
                                type="number"
                                name="per_km_delivery_charge"
                                value={formData.per_km_delivery_charge}
                                onChange={handleChange}
                                onBlur={(e) => validateField('per_km_delivery_charge', e.target.value)}
                                error={!!errors.per_km_delivery_charge}
                                helperText={errors.per_km_delivery_charge}
                                fullWidth
                                required
                                inputProps={{ min: "1", step: "0.01" }}
                            />

                            <TextField
                                label="Maximum shipping charge (ر.س.‏)"
                                title='It will add a limit on total delivery charge.'
                                type="number"
                                name="maximum_shipping_charge"
                                value={formData.maximum_shipping_charge}
                                onChange={handleChange}
                                fullWidth
                            />

                            <div className='sm:-mt-5'>
                                <div className="flex justify-between items-center text-[0.9rem] ">
                                    <span>Free delivery distance (KM)
                                        <span className="ml-2 cursor-pointer" title='If the order distance exceeds the free delivery distance, the delivery fee will be free and the delivery fee will be deducted from the restaurants commission'>ℹ️</span>
                                    </span>
                                    <Switch
                                        checked={freeDeliveryDistance}
                                        onChange={() => handleOpenPopup(
                                            freeDeliveryDistance ? 'Disable Free Delivery Distance' : 'Enable Free Delivery Distance',
                                            freeDeliveryDistance
                                                ? 'Are you sure you want to disable free delivery distance?'
                                                : 'Are you sure you want to enable free delivery distance? If the order distance exceeds the free delivery distance, the delivery fee will be free and the delivery fee will be deducted from the restaurants commission.',
                                            '/assets/images/free-delivery-distance.jpg',
                                            freeDeliveryDistance,
                                            setFreeDeliveryDistance,
                                            'Free delivery distance'
                                        )}
                                    />
                                </div>
                                <TextField
                                    type="number"
                                    name="free_delivery_distance"
                                    value={formData.free_delivery_distance}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={!freeDeliveryDistance}
                                />
                            </div>

                            <div className='sm:-mt-10'>
                                <div className="flex justify-between items-center text-[0.9rem]">
                                    <span>GST
                                        <span className="ml-2 cursor-pointer" title='If enabled the GST number will be shown in the invoice'>ℹ️</span>
                                    </span>

                                    <Switch
                                        checked={gstStatus}
                                        onChange={() => handleOpenPopup(
                                            gstStatus ? 'Disable GST' : 'Enable GST',
                                            gstStatus
                                                ? 'Are you sure you want to disable GST? The GST number will no longer be shown in invoices.'
                                                : 'Are you sure you want to enable GST? The GST number will be shown in invoices.',
                                            '/assets/images/gst.jpg',
                                            gstStatus,
                                            setGstStatus,
                                            'GST status'
                                        )}
                                    />
                                </div>
                                <TextField
                                    name="gst"
                                    value={formData.gst}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={!gstStatus}
                                />
                            </div>

                            <FormControl fullWidth>
                                <InputLabel>Cuisine</InputLabel>
                                <Select
                                    multiple
                                    value={formData.cuisine_ids}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        cuisine_ids: e.target.value
                                    }))}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    <MenuItem value="eastern">المطبخ الشرقي</MenuItem>
                                    {/* Add more cuisine options */}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Enter tags"
                            />
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h6 className="font-medium mb-2">Set Restaurant Characteristics</h6>
                            <p className="text-sm text-gray-600 mb-3">
                                Select the Restaurant Type that Best Represents Your Establishment
                            </p>
                            <TextField
                                fullWidth
                                placeholder="Add characteristics"
                                value={formData.characteristics.join(', ')}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    characteristics: e.target.value.split(', ')
                                }))}
                            />
                        </div>

                        <div className="flex justify-end gap-3 space-x-3">
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div >

            {/* Restaurant Meta Data */}
            <div className="card bg-white rounded-lg shadow-md mb-6">
                <div className="card-header p-4 border-b border-gray-200 flex items-center">
                    <h5 className="text-[1.05rem] font-[500]">Restaurant meta data</h5>
                </div>
                <div className="card-body p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                                {['default', 'en', 'ar'].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`px-4 py-2 min-w-max ${activeLang === lang ? 'border-b-2 border-blue-500' : ''} text-[#677788] font-[400] cursor-pointer hover:text-blue-500 transition-all duration-300`}
                                        onClick={() => handleLangChange(lang)}
                                    >
                                        {lang === 'default' ? 'Default' :
                                            lang === 'en' ? 'English(EN)' : 'Arabic - العربية(AR)'}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4 flex flex-col justify-start items-center gap-7">
                                <TextField
                                    label={`Meta title (${activeLang.toUpperCase()})`}
                                    name={`meta_title[${getLangIndex()}]`}
                                    fullWidth
                                    value={formData.meta_title[getLangIndex()]}
                                    onChange={(e) => handleMetaTitleChange(e, getLangIndex())}
                                    error={formik.touched.meta_title && Boolean(formik.errors.meta_title?.[getLangIndex()])}
                                    helperText={formik.touched.meta_title && formik.errors.meta_title?.[getLangIndex()]}
                                    onBlur={formik.handleBlur}
                                />

                                <TextField
                                    label={`Meta description (${activeLang.toUpperCase()})`}
                                    name={`meta_description[${getLangIndex()}]`}
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={formData.meta_description[getLangIndex()]}
                                    onChange={(e) => handleMetaDescriptionChange(e, getLangIndex())}
                                    error={formik.touched.meta_description && Boolean(formik.errors.meta_description?.[getLangIndex()])}
                                    helperText={formik.touched.meta_description && formik.errors.meta_description?.[getLangIndex()]}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="card-header border-b border-[#eee] pb-3 mb-4">
                                <h5 className="font-medium flex items-center">
                                    <span className="mr-2">📊</span>
                                    <span>Restaurant meta image</span>
                                </h5>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="mb-4 relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    {metaImage ? (
                                        <Image
                                            src={metaImage}
                                            alt="Meta preview"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No image selected</span>
                                    )}
                                </div>

                                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                    Upload Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">Aspect ratio: 1:1</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const langIndex = getLangIndex();
                                formik.setFieldTouched(`meta_title[${langIndex}]`, true);
                                formik.setFieldTouched(`meta_description[${langIndex}]`, true);

                                if (!formik.errors.meta_title?.[langIndex] &&
                                    !formik.errors.meta_description?.[langIndex]) {
                                    formik.handleSubmit();
                                }
                            }}
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="card bg-white rounded-lg shadow-md">
                <div className="card-header p-4 border-b border-[#eee]">
                    <h5 className="card-title text-[1.05rem] font-[500] flex items-center">
                        <span className="mr-2">📅</span>
                        Restaurant Opening & Closing Schedules
                    </h5>
                </div>
                <div className="card-body p-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="flex flex-wrap items-center mb-4 p-3 border border-[#d2d2d2] rounded text-[#5a5a5a]">
                            <span className="font-medium w-24">{day}:</span>
                            <div className="flex-1 ml-4 flex items-center justify-between">
                                {openingHours[day].open && openingHours[day].close ? (
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center flex-wrap">
                                            <span className="mr-2">🕒</span>
                                            <div>
                                                <div className="text-sm text-gray-500">Opening Time</div>
                                                <div>{openingHours[day].open}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center flex-wrap">
                                            <span className="mr-2">🕒</span>
                                            <div>
                                                <div className="text-sm text-gray-500">Closing Time</div>
                                                <div>{openingHours[day].close}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400">Closed</div>
                                )}
                                <div className="flex space-x-2">
                                    {openingHours[day].open && openingHours[day].close && (
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleOpenDeleteConfirm(day)}
                                        >
                                            <span className="text-xl">✕</span>
                                        </button>
                                    )}
                                    <button 
                                        className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                        onClick={() => handleOpenAddEditDialog(day)}
                                    >
                                        <span className="text-xl">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Snackbar Notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Confirmation Dialog */}
            <Dialog
                open={openPopup}
                onClose={handleClosePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="flex justify-between items-center">
                    {popupConfig.title}
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePopup}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center mb-4">
                        <Image
                            src={popupConfig.image}
                            alt={popupConfig.title}
                            width={200}
                            height={150}
                            className="rounded-lg mb-4"
                        />
                        <DialogContentText id="alert-dialog-description">
                            {popupConfig.description}
                        </DialogContentText>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup}>Cancel</Button>
                    <Button onClick={handleConfirmChange} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Schedule Confirmation Dialog */}
            <Dialog
                open={openDeleteConfirm}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="delete-schedule-dialog-title"
            >
                <DialogTitle id="delete-schedule-dialog-title" className="flex justify-center items-center text-center">
                    Want to delete this day’s schedule
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDeleteConfirm}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center justify-center text-center ">
                        <Image
                            src="/assets/logos/wrong-cancel-close-svgrepo-com.svg"
                            alt="Warning"
                            width={100}
                            height={100}
                            className="rounded-lg mb-4"
                        />
                        <DialogContentText>
                            If yes the schedule will be removed from here. However you can also add another one.
                        </DialogContentText>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>No</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Schedule Dialog */}
            <Dialog
                open={openAddEditDialog}
                onClose={handleCloseAddEditDialog}
                aria-labelledby="add-edit-schedule-dialog-title"
            >
                <DialogTitle id="add-edit-schedule-dialog-title" className="flex justify-between items-center">
                    {openingHours[currentDay]?.open ? 'Edit' : 'Add'} Schedule for {currentDay}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAddEditDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4 mt-4">
                        <TextField
                            label="Opening Time"
                            type="time"
                            name="open"
                            value={newSchedule.open}
                            onChange={handleScheduleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Closing Time"
                            type="time"
                            name="close"
                            value={newSchedule.close}
                            onChange={handleScheduleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddEditDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSaveSchedule} 
                        color="primary" 
                        disabled={!newSchedule.open || !newSchedule.close}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RestaurantConfig;
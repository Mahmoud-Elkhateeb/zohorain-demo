import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/authSlice';
import { useRouter } from 'next/router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [emailSuccess, setEmailSuccess] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const initialValues = { 
        email: '', 
        password: '',
        vendor_type: 'owner' // Added vendor_type as required by API
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('https://test-api.pro-manager.net/zohorain-v1/api/v1/auth/vendor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    vendor_type: values.vendor_type
                })
            });

            const data = await response.json();

                if (response.ok) {
                    const user = {
                        email: data.vendor?.email,
                        token: data.token,
                    };
                    dispatch(loginSuccess(user));
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(user));
                        router.push('/');
                } else {
                setErrorMessage(data.message || 'Login failed. Please check your credentials.');
                setShowError(true);
                resetForm();
                setTimeout(() => {
                    setShowError(false);
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Network error. Please try again.');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
                setErrorMessage('');
            }, 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendMail = async () => {
        try {
            const response = await fetch('https://test-api.pro-manager.net/zohorain-v1/api/v1/auth/vendor/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: forgotEmail,
                    vendor_type: 'restaurant'
                })
            });

            const data = await response.json();

            if (response.ok) {
                setEmailSuccess(true);
            } else {
                setErrorMessage(data.message || 'Email does not exist or is not registered.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setErrorMessage('Network error. Please try again.');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
                setErrorMessage('');
            }, 3000);
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center w-full flex flex-col"
            style={{ backgroundImage: "url('/assets/images/login-image.png')" }}
        >
            {/* Notification on Top Center */}
            {showError && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[1000] transition-all duration-500 ease-in-out">
                    <div className="bg-red-100 border border-red-400 text-red-600 text-center font-semibold py-2 px-6 rounded-lg shadow-lg animate-fadeIn">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Orange Overlay */}
            <div className="absolute inset-0 hidden lg:flex">
                <div className="bg-[#ff8800c7] lg:flex flex-col justify-center items-center text-white px-6 m-auto ml-0 w-[505px] h-[405px]">
                    <h2 className="text-4xl font-bold mb-3">WELCOME TO CG</h2>
                    <p className="text-lg text-center">Manage your app & website easily.</p>
                </div>
                <div className="w-1/2" />
            </div>

            <div className="absolute top-4 right-4 text-xs font-[600] text-[#00C9A7] z-20 w-fit p-2 rounded-lg bg-[#00c9a71f]">
                Software Version: 8.3
            </div>

            <div className="lg:w-[100%] lg:h-[100%] z-10 flex lg:flex-row lg:justify-end">
                <div className="w-full lg:w-[30%] h-[100vh] bg-[#fffffff0] p-8 rounded-lg flex flex-col justify-center items-center">
                    <div className="block text-center">
                        <img src="/assets/logos/2025-07-22-687f61523c255.png" alt="Logo" className="mx-auto h-13 mb-8 w-auto" />
                    </div>

                    <h1 className="text-[1.4rem] font-[600] mb-15 text-center text-[#012D5E]">
                        Signin To Your Panel
                    </h1>

                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form className="space-y-4 w-[90%] flex flex-col">
                                <div>
                                    <label htmlFor="email" className="block text-[#334257] text-[0.9rem] font-[600] mb-2">
                                        Your Email
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block text-[#334257] text-[0.9rem] font-[600] mb-2">
                                        Password
                                    </label>
                                    <Field
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="w-full px-4 py-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[47px] text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                    </button>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600 mt-5">
                                    <label className="flex items-center text-[#8C9BAD] cursor-pointer">
                                        <input type="checkbox" className="mr-2" />
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotModal(true);
                                            setEmailSuccess(false);
                                            setForgotEmail('');
                                        }}
                                        className="text-gray-500 hover:text-orange-500 transition"
                                    >
                                        Forget Password
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-[80%] h-[55px] m-auto mt-11 bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-orange-500 transition duration-200"
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-[#00000072] bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md relative p-8 text-center animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setShowForgotModal(false)}
                        >
                            &times;
                        </button>

                        {!emailSuccess ? (
                            <>
                                <img src="/assets/logos/send-mail.svg" alt="Email Icon" className="mx-auto mb-4 w-16 h-16" />
                                <h2 className="text-lg font-semibold mb-4">Send Mail to Your Email</h2>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <button
                                    onClick={handleSendMail}
                                    className="bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold py-2 px-6 rounded-md"
                                >
                                    Send Mail
                                </button>
                            </>
                        ) : (
                            <>
                                <img src="/assets/logos/sent-mail.svg" alt="Success Icon" className="mx-auto mb-4 w-16 h-16" />
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                                    A mail has been sent to your registered email!
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Click the link in the mail description to change password
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
// app/components/layout/Footer.jsx
'use client';

import Link from 'next/link';
import {Home} from '@mui/icons-material';
const Footer = () => {
  return (
    <footer className="  bg-[#F9FAFB] px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm ">
      {/* Left side */}
      <div className="text-gray-500 mb-4 md:mb-0 ml-5 ">© zohorain.</div>

      {/* Right side links */}
      <div className="flex items-center space-x-2 text-gray-600">
        <Link href="/business-management/restaurant-config" passHref className="hover:text-blue-600  w-31 text-center font-[500] text-[#334567] transition-all duration-100">
          Restaurant settings
        </Link>
        <span className="text-[#BDC5D1] text-[1.1rem]">•</span>
        <Link href="/business-management/myRestaurantProfile" passHref className="hover:text-blue-600 text-[#334567] font-[500]  w-15 text-center transition-all duration-100">
          Profile
        </Link>
        <span className="text-[#BDC5D1] text-[1.1rem]">•</span>
        <Link href="/" passHref className="hover:text-blue-500 hover:bg-[#6f98ff35] rounded-full w-12 flex justify-center items-center h-12 transition-all duration-100">
          <Home/>
        </Link>
      </div>


    </footer>
  );
};

export default Footer;

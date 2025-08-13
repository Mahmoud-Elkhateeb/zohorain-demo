'use client';

import { useState } from 'react';
import Footer from './Footer';
import UnifiedNavbar from './UnifiedNavbar';

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Desktop Layout - Only visible on medium screens and up */}
      <div className="hidden md:flex h-screen bg-[#F9FAFB]">
        {/* Sidebar and main content */}
        <UnifiedNavbar 
          isMobile={false} 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebarCollapsed={toggleSidebarCollapsed}
        />
        
        {/* Main content area - Takes remaining width */}
        <div className="flex-1 flex flex-col mt-17 p-1" key={sidebarCollapsed}>
          <main className="flex-1 overflow-y-auto p-4 ">
            {children}
          </main>
          <Footer />
        </div>
      </div>

      {/* Mobile Layout - Only visible on small screens */}
      <div className="md:hidden flex flex-col h-screen  bg-[#F9FAFB]">
        {/* Mobile Navbar - Fixed at top */}
        <div className="fixed top-0 ">
          <UnifiedNavbar 
            isMobile={true} 
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebarCollapsed={toggleSidebarCollapsed}
          />
        </div>
        
        {/* Sidebar overlay for mobile */}
        <div className={`fixed inset-0 transition-transform duration-300 ease-in-out z-50 ${
          sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleSidebarCollapsed} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#F9FAFB] shadow-lg z-50">
            <UnifiedNavbar 
              isMobile={true} 
              sidebarCollapsed={sidebarCollapsed}
              toggleSidebarCollapsed={toggleSidebarCollapsed}
            />
          </div>
        </div>

        {/* Main content area - Account for fixed navbar */}
        <div className="flex-1  mt-16">
          <main className="p-4 z-0">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

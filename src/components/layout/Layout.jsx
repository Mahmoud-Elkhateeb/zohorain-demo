'use client';

import Footer from './Footer';
import UnifiedNavbar from './UnifiedNavbar';

export default function Layout({ children }) {
  return (
    <div className="flex  bg-gray-50">
      
        

      <div className="flex-1  flex-col justify-center">
        <UnifiedNavbar/>
        <main className="flex-1 p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
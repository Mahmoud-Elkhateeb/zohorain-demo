'use client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex  bg-gray-50">
      
        <Sidebar />

      <div className="flex-1  flex-col justify-center">
        <Navbar />
        <main className="flex-1 p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
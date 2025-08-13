// components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';

const LoadingScreen = () => {
    

    return (
        <>
            <Head>
                <title>Zohorain Restaurant - Loading</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;600&family=Inter:wght@300;400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    {/* Restaurant logo with elegant design - Replace with your actual logo */}
                    <div className="elegant-pulse mx-auto mb-12 w-24 h-24 flex items-center justify-center">
                        {/* Replace this div with your actual logo image */}
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            {/* Placeholder for logo - replace with Image component in Next.js */}
                            <img
                                src="/assets/logos/2025-07-22-687f61523c255.png"
                                alt="Zohorain Restaurant Logo"
                                className="w-full h-full object-contain"
                                width={80}
                                height={80}
                            />
                        </div>
                    </div>

                    {/* Restaurant name with elegant typography */}
                    <h1
                        className={`restaurant-name shimmer-text text-5xl font-light mb-4 `}
                        style={{ animationDelay: '0.3s' }}
                    >
                        Zohorain
                    </h1>

                    {/* Subtitle with refined styling */}
                    <div  style={{ animationDelay: '0.6s' }}>
                        <p className="text-gray-400 text-sm font-light tracking-widest uppercase mb-8">
                            Fine Dining Experience
                        </p>
                    </div>

                    {/* Loading indicator with dots */}
                    <div
                        className={`flex justify-center items-center space-x-1 `}
                        style={{ animationDelay: '0.9s' }}
                    >
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes elegant-pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
            box-shadow: 0 0 0 20px rgba(251, 146, 60, 0);
          }
        }
        
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .elegant-pulse {
          animation: elegant-pulse 2.5s ease-in-out infinite;
        }
        
        .float-up {
          animation: float-up 1s ease-out forwards;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #334257 25%, #fb923c 50%, #334257 75%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .restaurant-name {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
        </>
    );
};

export default LoadingScreen;
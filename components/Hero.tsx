"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
   <section className="bg-[#211C24] text-white">
      {/* Container */}
      <div className="container mx-auto px-4">
        {/* Row (Flexbox) */}
        <div className="flex flex-col md:flex-row items-center py-12 md:py-20 gap-10">
          
          {/* Text Column */}
          <div className="w-full md:w-1/2">
            <p className="text-gray-400 text-xl mb-3">Pro.Beyond.</p>
            <h1 className="text-6xl md:text-8xl font-light mb-4 tracking-tight">
              IPhone 16 <span className="font-bold">Pro</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
              Created to change everything for the better. For everyone.
            </p>
            
            <Link
              href="/products"
              className="inline-block border border-white text-white text-lg px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300 rounded-sm"
            >
              Shop Now
            </Link>
          </div>

          {/* Model Viewer Column */}
          <div className="w-full md:w-1/2 flex justify-center items-center relative min-h-[400px]">
            <Script
              type="module"
              src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
              onLoad={() => setIsLoaded(true)}
            />

            {/* Tailwind Spinner */}
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
                <span className="mt-4 text-sm text-gray-400">Loading 3D Model...</span>
              </div>
            )}

            {isLoaded && (
              /* @ts-ignore */
              <model-viewer
                src="/assets/3d module/iphone-16-pro-max/iphone_16_pro_max.glb"
                style={{ width: '100%', height: '400px' }}
                alt="iPhone 16 Pro 3D Model"
                auto-rotate=""
                camera-controls=""
                disable-zoom=""
                disable-pan=""
                background-color="#211C24"
                camera-orbit="-90deg 90deg"
                className="w-full h-full"
              />
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
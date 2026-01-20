import React from 'react';

const Loading: React.FC<{ message?: string }> = ({ message = "Analiz yapılıyor..." }) => {
  return (
    <div className="fixed inset-0 bg-calm-50/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6 animate-float">
        {/* Simple SVG Plane Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-calm-600 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
        </svg>
      </div>
      <h2 className="text-xl font-medium text-calm-800 animate-pulse">{message}</h2>
      <p className="text-calm-500 mt-2 text-sm">Veriler en doğru hava modelleriyle işleniyor</p>
    </div>
  );
};

export default Loading;

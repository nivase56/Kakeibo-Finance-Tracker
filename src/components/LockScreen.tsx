"use client"
import { useState, useEffect } from 'react';

export default function LockScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showLock, setShowLock] = useState(true);
  const correctPassword = '1841';

  // Effect to handle local storage for lock state
  useEffect(() => {
    const isUnlocked = localStorage.getItem('kakeiboUnlocked') === 'true';
    if (isUnlocked) {
      setShowLock(false);
    }
  }, []);

  const handleNumberClick = (num: string) => {
    if (password.length < 4) {
      const newPassword = password + num;
      setPassword(newPassword);
      
      if (newPassword.length === 4) {
        if (newPassword === correctPassword) {
          setError(false);
          localStorage.setItem('kakeiboUnlocked', 'true');
          setShowLock(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPassword('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleDeleteClick = () => {
    setPassword(password.slice(0, -1));
    setError(false);
  };

  // If not showing lock screen, return null
  if (!showLock) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Kakeibo</h1>
        <p className="text-gray-400 text-sm">Enter Passcode</p>
      </div>

      <div className={`flex gap-4 my-4 ${error ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full ${
              password.length > i 
                ? 'bg-white' 
                : 'border border-gray-400'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-16 h-16 rounded-full bg-gray-800 text-white text-2xl font-light flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            {num}
          </button>
        ))}
        <div className="w-16 h-16" /> {/* Empty space */}
        <button
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 rounded-full bg-gray-800 text-white text-2xl font-light flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDeleteClick}
          className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

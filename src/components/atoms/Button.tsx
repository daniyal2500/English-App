//src/components/atoms/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-2xl font-bold transition-all transform active:scale-95 duration-100 flex items-center justify-center gap-2 shadow-lg";
  
  const variants = {
    // Primary: Rich Purple with darker border
    primary: "bg-[#a91079] text-white border-b-4 border-[#7a0b56] hover:bg-[#960d6b] hover:border-[#5c0841]", 
    // Secondary: Neon/Hot Pink
    secondary: "bg-[#570a57] text-white border-b-4 border-[#2e0249] hover:bg-[#4a084a]",
    // Outline: Light border for dark background
    outline: "bg-transparent border-2 border-[#a91079] text-[#a91079] hover:bg-[#a91079]/10",
    // Ghost: Text only
    ghost: "bg-transparent text-[#f806cc] font-bold hover:bg-white/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
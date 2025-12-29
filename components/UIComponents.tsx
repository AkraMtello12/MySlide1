import React from 'react';
import { motion } from 'framer-motion';

export const SectionTitle: React.FC<{ children: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
  <div className="mb-16 text-center relative z-10">
    {subtitle && (
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="block text-secondary font-bold tracking-wider text-xl md:text-2xl mb-3"
      >
        {subtitle}
      </motion.span>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-6xl font-black text-primary relative inline-block py-2"
    >
      {children}
      <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-secondary rounded-full opacity-80"></span>
    </motion.h2>
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button'
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary hover:shadow-lg hover:shadow-secondary/30",
    secondary: "bg-secondary text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/30",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-secondary/20 transition-all duration-500 border border-white/50 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-primary mb-2">{label}</label>
    <input 
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50/50"
      {...props} 
    />
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-primary mb-2">{label}</label>
    <textarea 
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50/50 min-h-[120px]"
      {...props} 
    />
  </div>
);
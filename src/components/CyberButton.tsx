
import React from 'react';
import { motion } from 'framer-motion';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outlined';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClass = variant === 'outlined' ? 'cyber-button-outlined' : 'cyber-button';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
};

export default CyberButton;

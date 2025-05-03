
import React from 'react';
import { motion } from 'framer-motion';

interface CyberHeaderProps {
  text: string;
}

const CyberHeader: React.FC<CyberHeaderProps> = ({ text }) => {
  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-2xl md:text-4xl font-bold text-cyber-green mb-6 border-b border-cyber-green pb-2"
    >
      <span className="inline-block mr-2">{'>'}</span>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 * index, duration: 0.1 }}
          className={index % 5 === 0 ? 'animate-text-flicker' : ''}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
      >
        _
      </motion.span>
    </motion.h1>
  );
};

export default CyberHeader;

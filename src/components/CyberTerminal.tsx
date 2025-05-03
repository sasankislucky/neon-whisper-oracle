
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CyberTerminalProps {
  children: React.ReactNode;
  title?: string;
}

const CyberTerminal: React.FC<CyberTerminalProps> = ({ children, title }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [children]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="cyber-terminal w-full h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-2 border-b border-cyber-green pb-1">
        <div className="text-cyber-green font-bold">{title || "Terminal"}</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-4 h-4 rounded-full bg-cyber-green hover:bg-cyber-green-light"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          />
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className={`flex-1 overflow-auto transition-all duration-300 ${isMinimized ? 'h-0' : 'h-auto'}`}
      >
        {children}
      </div>

      {/* Glowing effect at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50 mt-2" />
    </motion.div>
  );
};

export default CyberTerminal;

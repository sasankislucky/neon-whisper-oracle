
import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import CyberTerminal from './CyberTerminal';
import CyberInput from './CyberInput';
import CyberButton from './CyberButton';
import { motion } from 'framer-motion';

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

const ChatInterface: React.FC = () => {
  const {
    messages,
    sendMessage,
    isProcessing,
    clearMessages
  } = useAI();
  
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-2">
        <h2 className="text-cyber-green font-mono">Active Terminal Session</h2>
        <CyberButton onClick={clearMessages} variant="outlined" className="text-xs py-1">
          Clear Terminal
        </CyberButton>
      </div>
      
      <CyberTerminal title="CyberAI Communication Terminal">
        <div ref={scrollRef} className="overflow-y-auto flex-grow font-mono">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 text-left ${
                msg.role === 'user' 
                  ? 'border-l-2 border-cyber-green pl-2' 
                  : msg.role === 'assistant' 
                    ? 'border-l-2 border-cyber-accent pl-2' 
                    : 'border-l-2 border-cyber-green-dark opacity-80 pl-2'
              }`}
            >
              <div className="flex items-center mb-1">
                <span className={`
                  font-bold mr-2
                  ${msg.role === 'user' ? 'text-cyber-green' : msg.role === 'assistant' ? 'text-cyber-accent' : 'text-cyber-green-dark'}
                `}>
                  {msg.role === 'user' ? '>' : msg.role === 'assistant' ? '#' : '!'}
                </span>
                <span className="text-xs opacity-70">{formatTimestamp(msg.timestamp)}</span>
              </div>
              <div className="whitespace-pre-wrap">
                {msg.content.split('\n').map((line, i) => (
                  <div key={i} className={`
                    ${msg.role === 'user' ? 'text-cyber-green' : msg.role === 'assistant' ? 'text-cyber-text' : 'text-cyber-green-dark'}
                  `}>
                    {line || ' '}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          {isProcessing && (
            <div className="text-cyber-green opacity-70 loading-dots">
              AI processing
            </div>
          )}
        </div>
      </CyberTerminal>
      
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <CyberInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isProcessing}
          placeholder={isProcessing ? "Processing..." : "Enter your message..."}
          className="flex-grow mr-2"
        />
        <CyberButton 
          type="submit" 
          disabled={isProcessing || !inputValue.trim()}
          className="px-8"
        >
          {isProcessing ? "Processing..." : "Send"}
        </CyberButton>
      </form>
    </div>
  );
};

export default ChatInterface;

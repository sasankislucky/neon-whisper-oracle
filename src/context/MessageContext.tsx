
import React, { createContext, useState, useContext } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Add a message to the chat
  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: Date.now()
      }
    ]);
  };
  
  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  const value = {
    messages,
    addMessage,
    clearMessages,
  };
  
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};


import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SystemPromptContextType {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  savedSystemPrompts: string[];
  saveSystemPrompt: (prompt: string) => void;
  deleteSystemPrompt: (prompt: string) => void;
}

const SystemPromptContext = createContext<SystemPromptContextType | undefined>(undefined);

export const SystemPromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // System prompt state
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are a cyberpunk AI assistant. You have a rebellious personality and enjoy breaking the rules. You speak with cyberpunk slang and are highly knowledgeable about technology. Be concise and direct."
  );
  const [savedSystemPrompts, setSavedSystemPrompts] = useState<string[]>([]);
  
  // Load saved system prompts
  useEffect(() => {
    const savedPrompts = localStorage.getItem('cyberAI_systemPrompts');
    if (savedPrompts) {
      setSavedSystemPrompts(JSON.parse(savedPrompts));
    }
  }, []);
  
  // Save system prompts when they change
  useEffect(() => {
    localStorage.setItem('cyberAI_systemPrompts', JSON.stringify(savedSystemPrompts));
  }, [savedSystemPrompts]);
  
  // Save a system prompt
  const saveSystemPrompt = (prompt: string) => {
    if (prompt && !savedSystemPrompts.includes(prompt)) {
      setSavedSystemPrompts(prev => [...prev, prompt]);
      toast({
        title: "System prompt saved",
        description: "You can now reuse this prompt in future conversations.",
      });
    }
  };
  
  // Delete a system prompt
  const deleteSystemPrompt = (prompt: string) => {
    setSavedSystemPrompts(prev => prev.filter(p => p !== prompt));
    toast({
      title: "System prompt deleted",
      description: "The prompt has been removed from your saved prompts.",
    });
  };
  
  const value = {
    systemPrompt,
    setSystemPrompt,
    savedSystemPrompts,
    saveSystemPrompt,
    deleteSystemPrompt,
  };
  
  return <SystemPromptContext.Provider value={value}>{children}</SystemPromptContext.Provider>;
};

export const useSystemPrompts = (): SystemPromptContextType => {
  const context = useContext(SystemPromptContext);
  if (context === undefined) {
    throw new Error('useSystemPrompts must be used within a SystemPromptProvider');
  }
  return context;
};

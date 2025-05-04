
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ModelProvider, useModel } from './ModelContext';
import { MessageProvider, useMessages, Message } from './MessageContext';
import { SystemPromptProvider, useSystemPrompts } from './SystemPromptContext';
import { ApiProvider, useApi } from './ApiContext';
import { getHardwareInfo, HardwareInfo } from '../utils/hardwareUtils';
import { ModelManager } from '../utils/modelUtils';
import { useToast } from '@/components/ui/use-toast';

interface AIContextType {
  // Messages
  messages: Message[];
  addMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
  clearMessages: () => void;
  
  // System prompts
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  savedSystemPrompts: string[];
  saveSystemPrompt: (prompt: string) => void;
  deleteSystemPrompt: (prompt: string) => void;
  
  // Models
  availableModels: any[];
  selectedModel: any | null;
  selectModel: (modelId: string) => void;
  loadSelectedModel: () => Promise<void>;
  isModelLoaded: boolean;
  modelLoadingProgress: number;
  
  // API services
  apiManager: any;
  selectedService: string;
  selectService: (serviceId: string) => void;
  
  // Mode
  isOnlineMode: boolean;
  setOnlineMode: (isOnline: boolean) => void;
  
  // Action
  sendMessage: (message: string) => Promise<void>;
  isProcessing: boolean;
  
  // Hardware
  hardwareInfo: HardwareInfo | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const AIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Get contexts from providers
  const { messages, addMessage, clearMessages } = useMessages();
  const { systemPrompt, setSystemPrompt, savedSystemPrompts, saveSystemPrompt, deleteSystemPrompt } = useSystemPrompts();
  const { availableModels, selectedModel, selectModel, loadSelectedModel, isModelLoaded, modelLoadingProgress } = useModel();
  const { apiManager, selectedService, selectService } = useApi();
  
  // Mode state
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(true);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Hardware info
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  
  // Initialize
  useEffect(() => {
    // Get hardware info
    const hwInfo = getHardwareInfo();
    setHardwareInfo(hwInfo);
    
    // Add welcome message
    addMessage('system', `CyberAI Terminal v1.0.0 initialized.\nCreated by V.Seshank Babu\nHardware detected: ${hwInfo.cpuCores || 'Unknown'} cores, Platform: ${hwInfo.platform}.\nType a message to begin.`);
  }, []);
  
  // Send a message and get a response
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    addMessage('user', message);
    setIsProcessing(true);
    
    try {
      let response = '';
      
      if (isOnlineMode) {
        // Online mode - use API
        const serviceId = selectedService;
        
        if (!apiManager.hasApiKey(serviceId)) {
          throw new Error(`API key for ${serviceId} not set. Please add your API key in settings.`);
        }
        
        if (serviceId === 'openai') {
          response = await apiManager.callOpenAI(message, systemPrompt);
        } else if (serviceId === 'huggingface') {
          const result = await apiManager.callHuggingFace('gpt2', message);
          response = result[0].generated_text || 'No response generated.';
        } else if (serviceId === 'perplexity') {
          response = await apiManager.callPerplexity(message, systemPrompt);
        }
      } else {
        // Offline mode - use local model
        if (!selectedModel) {
          throw new Error('No model selected');
        }
        
        if (!isModelLoaded) {
          throw new Error('Model not loaded. Please load the model first.');
        }
        
        const modelManager = ModelManager.getInstance();
        response = await modelManager.runTextGeneration(selectedModel.id, message);
      }
      
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('system', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: `${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const value = {
    messages,
    addMessage,
    clearMessages,
    systemPrompt,
    setSystemPrompt,
    savedSystemPrompts,
    saveSystemPrompt,
    deleteSystemPrompt,
    availableModels,
    selectedModel,
    selectModel,
    loadSelectedModel,
    isModelLoaded,
    modelLoadingProgress,
    apiManager,
    selectedService,
    selectService,
    isOnlineMode,
    setOnlineMode: setIsOnlineMode,
    sendMessage,
    isProcessing,
    hardwareInfo
  };
  
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ModelProvider>
      <MessageProvider>
        <SystemPromptProvider>
          <ApiProvider>
            <AIContextProvider>{children}</AIContextProvider>
          </ApiProvider>
        </SystemPromptProvider>
      </MessageProvider>
    </ModelProvider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

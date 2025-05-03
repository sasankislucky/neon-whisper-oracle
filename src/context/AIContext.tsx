
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ModelManager, AIModel, availableModels } from '../utils/modelUtils';
import { ApiManager, availableApiServices } from '../utils/apiUtils';
import { getHardwareInfo, HardwareInfo } from '../utils/hardwareUtils';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

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
  availableModels: AIModel[];
  selectedModel: AIModel | null;
  selectModel: (modelId: string) => void;
  loadSelectedModel: () => Promise<void>;
  isModelLoaded: boolean;
  modelLoadingProgress: number;
  
  // API services
  apiManager: ApiManager;
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

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  
  // System prompt state
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are a cyberpunk AI assistant. You have a rebellious personality and enjoy breaking the rules. You speak with cyberpunk slang and are highly knowledgeable about technology. Be concise and direct."
  );
  const [savedSystemPrompts, setSavedSystemPrompts] = useState<string[]>([]);
  
  // Model state
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [modelLoadingProgress, setModelLoadingProgress] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  
  // API state
  const apiManager = new ApiManager();
  const [selectedService, setSelectedService] = useState<string>('openai');
  
  // Mode state
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(true);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Hardware info
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  
  // Initialize
  useEffect(() => {
    // Load saved system prompts
    const savedPrompts = localStorage.getItem('cyberAI_systemPrompts');
    if (savedPrompts) {
      setSavedSystemPrompts(JSON.parse(savedPrompts));
    }
    
    // Set default model
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0]);
    }
    
    // Get hardware info
    const hwInfo = getHardwareInfo();
    setHardwareInfo(hwInfo);
    
    // Add welcome message
    addMessage('system', `CyberAI Terminal v1.0.0 initialized.\nCreated by V.Seshank Babu\nHardware detected: ${hwInfo.cpuCores || 'Unknown'} cores, Platform: ${hwInfo.platform}.\nType a message to begin.`);
  }, []);
  
  // Save system prompts when they change
  useEffect(() => {
    localStorage.setItem('cyberAI_systemPrompts', JSON.stringify(savedSystemPrompts));
  }, [savedSystemPrompts]);
  
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
  
  // Select a model
  const selectModel = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setIsModelLoaded(false);
      setModelLoadingProgress(0);
    }
  };
  
  // Load the selected model
  const loadSelectedModel = async () => {
    if (selectedModel) {
      setIsProcessing(true);
      try {
        const modelManager = ModelManager.getInstance();
        await modelManager.loadModel(selectedModel.id, (progress) => {
          setModelLoadingProgress(progress);
        });
        setIsModelLoaded(true);
        toast({
          title: "Model loaded successfully",
          description: `${selectedModel.name} is now ready to use.`,
        });
      } catch (error) {
        console.error('Error loading model:', error);
        toast({
          title: "Failed to load model",
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Select an API service
  const selectService = (serviceId: string) => {
    setSelectedService(serviceId);
  };
  
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
    setOnlineMode,
    sendMessage,
    isProcessing,
    hardwareInfo
  };
  
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

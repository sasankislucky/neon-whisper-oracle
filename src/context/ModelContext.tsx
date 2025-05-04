
import React, { createContext, useState, useContext } from 'react';
import { ModelManager, AIModel, availableModels } from '../utils/modelUtils';
import { useToast } from '@/components/ui/use-toast';

interface ModelContextType {
  availableModels: AIModel[];
  selectedModel: AIModel | null;
  selectModel: (modelId: string) => void;
  loadSelectedModel: () => Promise<void>;
  isModelLoaded: boolean;
  modelLoadingProgress: number;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Model state
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [modelLoadingProgress, setModelLoadingProgress] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  
  // Initialize
  React.useEffect(() => {
    // Set default model
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0]);
    }
  }, []);
  
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
      }
    }
  };
  
  const value = {
    availableModels,
    selectedModel,
    selectModel,
    loadSelectedModel,
    isModelLoaded,
    modelLoadingProgress,
  };
  
  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModel = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};

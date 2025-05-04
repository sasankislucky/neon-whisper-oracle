
import { pipeline, env } from '@huggingface/transformers';

export interface AIModel {
  id: string;
  name: string;
  type: 'online' | 'offline';
  format: string;
  size?: string;
  description: string;
  downloadUrl?: string;
}

// List of available models
export const availableModels: AIModel[] = [
  {
    id: 'gpt2',
    name: 'GPT-2',
    type: 'offline',
    format: 'onnx',
    size: '500MB',
    description: 'A small, fast language model that can run entirely in the browser',
    downloadUrl: 'https://huggingface.co/onnx-community/gpt2/resolve/main/model.onnx',
  },
  {
    id: 'distilbert-base-uncased',
    name: 'DistilBERT Base Uncased',
    type: 'offline',
    format: 'onnx',
    size: '260MB',
    description: 'A distilled version of BERT that maintains 95% of its performance',
    downloadUrl: 'https://huggingface.co/onnx-community/distilbert-base-uncased/resolve/main/model.onnx'
  },
  {
    id: 'whisper-tiny',
    name: 'Whisper Tiny',
    type: 'offline',
    format: 'onnx',
    size: '150MB',
    description: 'Lightweight speech-to-text model',
    downloadUrl: 'https://huggingface.co/onnx-community/whisper-tiny.en/resolve/main/model.onnx'
  },
];

// Class to handle model operations
export class ModelManager {
  private static instance: ModelManager;
  private loadedModels: Map<string, any>;
  private modelStatus: Map<string, 'loading' | 'loaded' | 'error'>;
  private downloadProgress: Map<string, number>;
  
  private constructor() {
    this.loadedModels = new Map();
    this.modelStatus = new Map();
    this.downloadProgress = new Map();

    // Configure the transformers.js library
    env.allowLocalModels = true;
    env.backends.onnx.wasm.numThreads = navigator.hardwareConcurrency || 4;
  }
  
  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }
  
  public async loadModel(modelId: string, progressCallback?: (progress: number) => void): Promise<any> {
    // If model is already loaded, return it
    if (this.loadedModels.has(modelId)) {
      return this.loadedModels.get(modelId);
    }
    
    this.modelStatus.set(modelId, 'loading');
    this.downloadProgress.set(modelId, 0);
    
    try {
      const model = availableModels.find(m => m.id === modelId);
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }
      
      let loadedModel;
      
      // Convert our simple progress callback to match HF's expected ProgressCallback type
      const adaptedProgressCallback = (progressInfo: any) => {
        // Extract a numeric value from the progress info
        const numericProgress = typeof progressInfo === 'number' 
          ? progressInfo 
          : progressInfo?.progress || 0;
        
        this.downloadProgress.set(modelId, numericProgress);
        progressCallback?.(numericProgress);
      };
      
      // Load different types of models
      if (modelId === 'gpt2') {
        loadedModel = await pipeline('text-generation', modelId, {
          progress_callback: adaptedProgressCallback
        });
      } else if (modelId === 'distilbert-base-uncased') {
        loadedModel = await pipeline('feature-extraction', modelId, {
          progress_callback: adaptedProgressCallback
        });
      } else if (modelId === 'whisper-tiny') {
        loadedModel = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny.en', {
          progress_callback: adaptedProgressCallback
        });
      }
      
      this.loadedModels.set(modelId, loadedModel);
      this.modelStatus.set(modelId, 'loaded');
      return loadedModel;
    } catch (error) {
      console.error(`Failed to load model ${modelId}:`, error);
      this.modelStatus.set(modelId, 'error');
      throw error;
    }
  }
  
  public getModelStatus(modelId: string): 'loading' | 'loaded' | 'error' | undefined {
    return this.modelStatus.get(modelId);
  }
  
  public getDownloadProgress(modelId: string): number {
    return this.downloadProgress.get(modelId) || 0;
  }

  public isModelLoaded(modelId: string): boolean {
    return this.loadedModels.has(modelId);
  }
  
  public async runTextGeneration(
    modelId: string, 
    prompt: string,
    options = { max_length: 50 }
  ): Promise<string> {
    try {
      let model = this.loadedModels.get(modelId);
      if (!model) {
        model = await this.loadModel(modelId);
      }
      
      const result = await model(prompt, options);
      return result[0].generated_text;
    } catch (error) {
      console.error(`Error generating text with model ${modelId}:`, error);
      throw error;
    }
  }
}

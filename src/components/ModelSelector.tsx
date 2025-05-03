
import React from 'react';
import { useAI } from '../context/AIContext';
import CyberButton from './CyberButton';
import CyberTerminal from './CyberTerminal';
import { motion } from 'framer-motion';

const ModelSelector: React.FC = () => {
  const {
    availableModels,
    selectedModel,
    selectModel,
    loadSelectedModel,
    isModelLoaded,
    modelLoadingProgress,
    isOnlineMode,
    setOnlineMode,
    selectedService,
    selectService,
    apiManager
  } = useAI();
  
  const handleLoadModel = () => {
    loadSelectedModel();
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-cyber-green font-mono mb-2">Mode Selection</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <CyberButton 
          onClick={() => setOnlineMode(true)}
          variant={isOnlineMode ? 'default' : 'outlined'}
        >
          Online API Mode
        </CyberButton>
        <CyberButton
          onClick={() => setOnlineMode(false)} 
          variant={!isOnlineMode ? 'default' : 'outlined'}
        >
          Offline Local Mode
        </CyberButton>
      </div>
      
      {isOnlineMode ? (
        <div className="flex-grow">
          <h3 className="text-cyber-green font-mono mb-2">Select API Service</h3>
          
          <div className="grid grid-cols-1 gap-2 mb-4">
            {['openai', 'perplexity', 'huggingface'].map(serviceId => (
              <button
                key={serviceId}
                onClick={() => selectService(serviceId)}
                className={`
                  cyber-panel p-3 text-left transition-all
                  ${selectedService === serviceId 
                    ? 'border-cyber-green bg-cyber-green/10' 
                    : 'border-cyber-green/40 hover:border-cyber-green/70'}
                `}
              >
                <div className="font-bold mb-1">{serviceId.charAt(0).toUpperCase() + serviceId.slice(1)}</div>
                <div className="text-xs flex justify-between">
                  <span>{apiManager.hasApiKey(serviceId) ? 'API Key Set ✓' : 'No API Key ⚠️'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow">
          <h3 className="text-cyber-green font-mono mb-2">Select Local Model</h3>
          
          <div className="grid grid-cols-1 gap-2 mb-4">
            {availableModels.map(model => (
              <button
                key={model.id}
                onClick={() => selectModel(model.id)}
                className={`
                  cyber-panel p-3 text-left transition-all
                  ${selectedModel?.id === model.id 
                    ? 'border-cyber-green bg-cyber-green/10' 
                    : 'border-cyber-green/40 hover:border-cyber-green/70'}
                `}
              >
                <div className="font-bold mb-1">{model.name}</div>
                <div className="text-xs flex justify-between">
                  <span>{model.format.toUpperCase()}</span>
                  <span>{model.size}</span>
                </div>
                <div className="text-xs mt-1 opacity-70">{model.description}</div>
              </button>
            ))}
          </div>
          
          {selectedModel && (
            <div className="mt-4">
              <CyberButton 
                onClick={handleLoadModel} 
                disabled={isModelLoaded}
                className="w-full"
              >
                {isModelLoaded 
                  ? "Model Loaded ✓" 
                  : `Load ${selectedModel.name} Model`}
              </CyberButton>
              
              {modelLoadingProgress > 0 && modelLoadingProgress < 1 && (
                <div className="mt-2">
                  <div className="text-xs text-cyber-green mb-1">
                    Loading: {Math.round(modelLoadingProgress * 100)}%
                  </div>
                  <div className="bg-cyber-black rounded-full h-2 overflow-hidden border border-cyber-green">
                    <motion.div
                      className="bg-cyber-green h-full"
                      style={{ width: `${modelLoadingProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;


import React, { useState } from 'react';
import { useAI } from '../context/AIContext';
import CyberTerminal from './CyberTerminal';
import CyberInput from './CyberInput';
import CyberButton from './CyberButton';
import { availableApiServices } from '../utils/apiUtils';
import { useToast } from '@/components/ui/use-toast';

const ApiKeyManager: React.FC = () => {
  const { apiManager } = useAI();
  const { toast } = useToast();
  
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: apiManager.getApiKey('openai') || '',
    huggingface: apiManager.getApiKey('huggingface') || '',
    perplexity: apiManager.getApiKey('perplexity') || ''
  });
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    openai: false,
    huggingface: false,
    perplexity: false
  });
  
  const handleSaveKey = (serviceId: string) => {
    const key = apiKeys[serviceId];
    if (key) {
      apiManager.setApiKey(serviceId, key);
      toast({
        title: "API key saved",
        description: `Your ${serviceId} API key has been saved.`,
      });
    } else {
      apiManager.deleteApiKey(serviceId);
      toast({
        title: "API key deleted",
        description: `Your ${serviceId} API key has been removed.`,
      });
    }
  };
  
  const toggleShowKey = (serviceId: string) => {
    setShowKeys(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-cyber-green font-mono mb-2">API Key Manager</h2>
      
      <CyberTerminal title="Manage API Keys">
        <div className="space-y-6">
          {availableApiServices.map(service => (
            <div key={service.id} className="cyber-panel p-3">
              <h3 className="text-cyber-green mb-2 border-b border-cyber-green/30 pb-1">
                {service.name}
              </h3>
              
              <div className="text-xs mb-3 opacity-80">
                {service.description}
              </div>
              
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <CyberInput
                    label="API Key"
                    type={showKeys[service.id] ? 'text' : 'password'}
                    value={apiKeys[service.id] || ''}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [service.id]: e.target.value }))}
                    placeholder={`Enter ${service.name} API Key...`}
                  />
                </div>
                
                <button
                  onClick={() => toggleShowKey(service.id)}
                  className="text-xs underline text-cyber-green/70 hover:text-cyber-green mb-3"
                >
                  {showKeys[service.id] ? 'Hide' : 'Show'}
                </button>
                
                <CyberButton
                  onClick={() => handleSaveKey(service.id)}
                  variant="outlined"
                  className="mb-4"
                >
                  Save
                </CyberButton>
              </div>
              
              <div className="text-xs mt-2">
                Status: {apiManager.hasApiKey(service.id) ? (
                  <span className="text-cyber-green">✓ Key Set</span>
                ) : (
                  <span className="text-yellow-500">⚠️ No Key Set</span>
                )}
              </div>
            </div>
          ))}
          
          <div className="text-xs text-cyber-green/70 mt-4">
            Note: API keys are stored in your browser's local storage. They never leave your device.
          </div>
        </div>
      </CyberTerminal>
    </div>
  );
};

export default ApiKeyManager;

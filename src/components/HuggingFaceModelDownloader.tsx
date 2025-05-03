
import React, { useState } from 'react';
import CyberTerminal from './CyberTerminal';
import CyberInput from './CyberInput';
import CyberButton from './CyberButton';
import { useToast } from '@/components/ui/use-toast';

// Note: This is a placeholder component that would be implemented with actual Hugging Face model downloads
// in a real application. For the browser demo, this would need additional service worker or backend support.

interface HuggingFaceModel {
  id: string;
  name: string;
  description: string;
  downloads: number;
  tags: string[];
}

const MOCK_MODELS: HuggingFaceModel[] = [
  {
    id: 'gpt2',
    name: 'GPT-2',
    description: 'OpenAI GPT-2 model, a transformer-based language model',
    downloads: 1500000,
    tags: ['text-generation', 'pytorch']
  },
  {
    id: 'distilbert-base-uncased',
    name: 'DistilBERT Base Uncased',
    description: 'Distilled version of BERT, smaller and faster',
    downloads: 900000,
    tags: ['text-classification', 'feature-extraction']
  },
  {
    id: 'whisper-tiny',
    name: 'Whisper Tiny',
    description: 'Small speech recognition model from OpenAI',
    downloads: 500000,
    tags: ['automatic-speech-recognition', 'audio']
  }
];

const HuggingFaceModelDownloader: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HuggingFaceModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API search with timeout
    setTimeout(() => {
      const results = MOCK_MODELS.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };
  
  const handleDownload = (model: HuggingFaceModel) => {
    toast({
      title: "Download started",
      description: `Downloading ${model.name}... (This is a demo - no actual download happens)`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${model.name} has been downloaded successfully.`,
      });
    }, 3000);
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-cyber-green font-mono mb-2">Hugging Face Model Explorer</h2>
      
      <CyberTerminal title="Browse & Download Models">
        <div className="flex gap-2">
          <CyberInput 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models (e.g., 'gpt2', 'bert', 'audio')..."
            className="flex-grow"
          />
          <CyberButton 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? "Searching..." : "Search"}
          </CyberButton>
        </div>
        
        <div className="mt-4">
          <h3 className="text-cyber-green mb-2 border-b border-cyber-green/30 pb-1">
            {searchResults.length > 0 ? `Search Results (${searchResults.length})` : "Popular Models"}
          </h3>
          
          {isSearching ? (
            <div className="text-center py-8 text-cyber-green loading-dots">
              Searching Hugging Face models
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map(model => (
                <div key={model.id} className="cyber-panel p-3">
                  <div className="flex justify-between">
                    <h4 className="text-cyber-green font-bold">{model.name}</h4>
                    <span className="text-xs text-cyber-green-light">{model.downloads.toLocaleString()} downloads</span>
                  </div>
                  
                  <div className="text-xs opacity-80 my-1">{model.description}</div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      {model.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-cyber-green/20 py-1 px-2 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <CyberButton 
                      onClick={() => handleDownload(model)}
                      variant="outlined"
                      className="text-xs py-1"
                    >
                      Download
                    </CyberButton>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 text-cyber-green/70">
              No models found matching "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_MODELS.map(model => (
                <div key={model.id} className="cyber-panel p-3">
                  <div className="flex justify-between">
                    <h4 className="text-cyber-green font-bold">{model.name}</h4>
                    <span className="text-xs text-cyber-green-light">{model.downloads.toLocaleString()} downloads</span>
                  </div>
                  
                  <div className="text-xs opacity-80 my-1">{model.description}</div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      {model.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-cyber-green/20 py-1 px-2 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <CyberButton 
                      onClick={() => handleDownload(model)}
                      variant="outlined"
                      className="text-xs py-1"
                    >
                      Download
                    </CyberButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-cyber-green/50 mt-4">
          Note: This is a demo interface. In a production app, this would connect to the Hugging Face API to download actual models.
        </div>
      </CyberTerminal>
    </div>
  );
};

export default HuggingFaceModelDownloader;

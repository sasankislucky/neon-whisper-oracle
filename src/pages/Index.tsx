
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AIProvider } from '../context/AIContext';
import ChatInterface from '../components/ChatInterface';
import ModelSelector from '../components/ModelSelector';
import SystemPromptEditor from '../components/SystemPromptEditor';
import HardwareMonitor from '../components/HardwareMonitor';
import ApiKeyManager from '../components/ApiKeyManager';
import HuggingFaceModelDownloader from '../components/HuggingFaceModelDownloader';
import CyberScanline from '../components/CyberScanline';
import CyberHeader from '../components/CyberHeader';

// Define our available tabs
type TabType = 'chat' | 'models' | 'prompts' | 'hardware' | 'api' | 'huggingface';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'models':
        return <ModelSelector />;
      case 'prompts':
        return <SystemPromptEditor />;
      case 'hardware':
        return <HardwareMonitor />;
      case 'api':
        return <ApiKeyManager />;
      case 'huggingface':
        return <HuggingFaceModelDownloader />;
      default:
        return <ChatInterface />;
    }
  };
  
  return (
    <AIProvider>
      <div className="min-h-screen bg-cyber-black text-cyber-text overflow-hidden">
        <CyberScanline />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <CyberHeader text="NEON WHISPER ORACLE" />
            <p className="text-cyber-green-light italic mb-4">
              Cyberpunk AI Communicator // Online & Offline Mode // Created by V.Seshank Babu
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <motion.div 
              className="lg:col-span-1 cyber-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-cyber-green font-bold mb-4 border-b border-cyber-green pb-2">
                Navigation Terminal
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'chat', label: 'AI Communication', icon: '💬' },
                  { id: 'models', label: 'Model Selection', icon: '🧠' },
                  { id: 'prompts', label: 'System Prompts', icon: '📝' },
                  { id: 'hardware', label: 'Hardware Monitor', icon: '📊' },
                  { id: 'api', label: 'API Settings', icon: '🔑' },
                  { id: 'huggingface', label: 'Model Downloads', icon: '🌐' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`
                      w-full text-left p-3 rounded flex items-center
                      ${activeTab === tab.id ? 'bg-cyber-green text-cyber-black font-bold' : 'text-cyber-green hover:bg-cyber-green/10 transition-colors'}
                    `}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="ml-auto text-xs animate-pulse-green">▶</span>
                    )}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 text-xs text-center text-cyber-green/70">
                <p className="mb-2 animate-pulse">CONNECTION STATUS: ACTIVE</p>
                <p>Running in interpreted mode</p>
                <p>No compilation required</p>
                <div className="mt-4 border-t border-cyber-green/30 pt-2">
                  <p className="font-bold">v1.0.0 // CORE SYSTEM</p>
                </div>
              </div>
            </motion.div>
            
            {/* Main Content Area */}
            <motion.div 
              className="lg:col-span-3 cyber-panel h-[70vh] lg:h-[75vh] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </AIProvider>
  );
};

export default Index;

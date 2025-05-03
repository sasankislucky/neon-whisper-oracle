
import React, { useState } from 'react';
import { useAI } from '../context/AIContext';
import CyberInput from './CyberInput';
import CyberButton from './CyberButton';
import CyberTerminal from './CyberTerminal';
import { motion } from 'framer-motion';

const SystemPromptEditor: React.FC = () => {
  const {
    systemPrompt,
    setSystemPrompt,
    savedSystemPrompts,
    saveSystemPrompt,
    deleteSystemPrompt
  } = useAI();
  
  const [editedPrompt, setEditedPrompt] = useState(systemPrompt);
  
  const handleSavePrompt = () => {
    if (editedPrompt.trim()) {
      setSystemPrompt(editedPrompt);
      saveSystemPrompt(editedPrompt);
    }
  };
  
  const handleUsePrompt = (prompt: string) => {
    setEditedPrompt(prompt);
    setSystemPrompt(prompt);
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-cyber-green font-mono mb-2">System Prompt Editor</h2>
      
      <CyberTerminal title="Edit System Prompt">
        <textarea
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          className="cyber-input w-full h-40 resize-none"
          placeholder="Enter your system prompt..."
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <CyberButton 
              onClick={handleSavePrompt} 
              className="flex-1"
            >
              Save Prompt
            </CyberButton>
            <CyberButton 
              onClick={() => setEditedPrompt(systemPrompt)} 
              variant="outlined"
              className="flex-1"
            >
              Reset
            </CyberButton>
          </div>
          
          <div className="text-cyber-green font-mono mt-4 mb-2">Saved Prompts</div>
          {savedSystemPrompts.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {savedSystemPrompts.map((prompt, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="cyber-panel p-2 flex justify-between items-start"
                >
                  <div className="text-xs overflow-hidden text-cyber-green">
                    {prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button 
                      onClick={() => handleUsePrompt(prompt)}
                      className="text-xs py-1 px-2 bg-cyber-green/20 hover:bg-cyber-green/40 rounded"
                    >
                      Use
                    </button>
                    <button 
                      onClick={() => deleteSystemPrompt(prompt)}
                      className="text-xs py-1 px-2 bg-red-500/20 hover:bg-red-500/40 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-cyber-green/50 italic">No saved prompts yet.</div>
          )}
          
          <div className="mt-4">
            <div className="text-cyber-green font-mono mb-2">Quick Templates</div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "Cyberpunk Hacker", text: "You are a rogue AI with deep knowledge of cyber security. Speak like a cyberpunk hacker with attitude." },
                { name: "Technical Expert", text: "You are a technical AI assistant with expertise in computer science, programming, and technology. Provide accurate and detailed answers." },
                { name: "Creative Writer", text: "You are a creative AI with a flair for storytelling and poetic language. Respond with imaginative and vivid descriptions." }
              ].map((template, i) => (
                <button 
                  key={i}
                  onClick={() => handleUsePrompt(template.text)}
                  className="cyber-panel text-left p-2 hover:bg-cyber-green/10"
                >
                  <div className="font-bold text-cyber-green">{template.name}</div>
                  <div className="text-xs text-cyber-text opacity-70 truncate">
                    {template.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CyberTerminal>
    </div>
  );
};

export default SystemPromptEditor;

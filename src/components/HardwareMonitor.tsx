
import React, { useState, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import CyberTerminal from './CyberTerminal';
import { monitorPerformance } from '../utils/hardwareUtils';

interface PerformanceMetrics {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  fps?: number;
  timestamp: number;
}

const HardwareMonitor: React.FC = () => {
  const { hardwareInfo } = useAI();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    const stopMonitoring = monitorPerformance(setMetrics);
    return () => stopMonitoring();
  }, []);
  
  const renderBar = (value: number, max: number, label: string) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    let color = 'bg-cyber-green';
    
    if (percentage > 80) color = 'bg-red-500';
    else if (percentage > 60) color = 'bg-yellow-500';
    
    return (
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 w-full bg-cyber-black border border-cyber-green rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-cyber-green font-mono mb-2">Hardware Monitor</h2>
      
      <CyberTerminal title="System Resources">
        <div className="mb-4">
          <h3 className="text-cyber-green mb-2 border-b border-cyber-green/30 pb-1">
            System Information
          </h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex">
              <span className="text-cyber-green/70 mr-2">CPU Cores:</span>
              <span className="text-cyber-text">{hardwareInfo?.cpuCores || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-cyber-green/70 mr-2">Platform:</span>
              <span className="text-cyber-text">{hardwareInfo?.platform || 'Unknown'}</span>
            </div>
            {hardwareInfo?.memory.total && (
              <div className="flex">
                <span className="text-cyber-green/70 mr-2">Memory Total:</span>
                <span className="text-cyber-text">{hardwareInfo.memory.total} GB</span>
              </div>
            )}
            <div className="flex">
              <span className="text-cyber-green/70 mr-2">User Agent:</span>
              <span className="text-cyber-text truncate">{hardwareInfo?.userAgent.split(' ')[0] || 'Unknown'}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-cyber-green mb-2 border-b border-cyber-green/30 pb-1">
            Live Metrics
          </h3>
          
          {metrics?.memory && (
            <>
              {renderBar(
                metrics.memory.usedJSHeapSize, 
                metrics.memory.jsHeapSizeLimit, 
                `Memory Usage: ${Math.round(metrics.memory.usedJSHeapSize)} / ${Math.round(metrics.memory.jsHeapSizeLimit)} MB`
              )}
            </>
          )}
          
          {metrics?.fps !== undefined && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Performance (FPS)</span>
                <span 
                  className={
                    metrics.fps < 30 ? 'text-red-500' : 
                    metrics.fps < 50 ? 'text-yellow-500' : 
                    'text-cyber-green'
                  }
                >
                  {metrics.fps}
                </span>
              </div>
              <div className="h-2 w-full bg-cyber-black border border-cyber-green rounded-full overflow-hidden">
                <div 
                  className={`h-full
                    ${metrics.fps < 30 ? 'bg-red-500' : 
                      metrics.fps < 50 ? 'bg-yellow-500' : 
                      'bg-cyber-green'}
                  `}
                  style={{ width: `${Math.min(metrics.fps / 60 * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="text-xs text-cyber-green/50 mt-4">
            Last updated: {metrics ? new Date(metrics.timestamp).toLocaleTimeString() : 'Never'}
          </div>
        </div>
      </CyberTerminal>
    </div>
  );
};

export default HardwareMonitor;

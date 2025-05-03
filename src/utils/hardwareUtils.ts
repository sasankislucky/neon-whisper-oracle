
export interface HardwareInfo {
  cpuCores: number | null;
  memory: {
    total: number | null; // in GB
    available: number | null; // in GB
  };
  platform: string;
  userAgent: string;
}

export const getHardwareInfo = (): HardwareInfo => {
  let cpuCores = null;
  try {
    cpuCores = navigator.hardwareConcurrency || null;
  } catch (e) {
    console.error("Could not retrieve CPU information:", e);
  }

  const memory = {
    total: null,
    available: null
  };

  // Try to access memory info - only works in some browsers
  try {
    if ((performance as any).memory) {
      memory.total = Math.round(((performance as any).memory.jsHeapSizeLimit / 1024 / 1024 / 1024) * 100) / 100;
      memory.available = Math.round(((performance as any).memory.jsHeapSizeLimit - (performance as any).memory.totalJSHeapSize) / 1024 / 1024 / 1024 * 100) / 100;
    }
  } catch (e) {
    console.error("Could not retrieve memory information:", e);
  }

  return {
    cpuCores,
    memory,
    platform: navigator.platform || 'Unknown',
    userAgent: navigator.userAgent
  };
};

export const monitorPerformance = (callback: (metrics: any) => void): (() => void) => {
  let running = true;
  
  const monitor = async () => {
    while (running) {
      try {
        // Get current performance data
        const memoryInfo = (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize / 1024 / 1024,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit / 1024 / 1024,
        } : null;
        
        const metrics = {
          timestamp: Date.now(),
          memory: memoryInfo,
          fps: await calculateFPS()
        };

        callback(metrics);
      } catch (e) {
        console.error("Error monitoring performance:", e);
      }
      
      // Wait for a second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };
  
  monitor();
  
  // Return a function to stop monitoring
  return () => {
    running = false;
  };
};

// Calculate FPS based on requestAnimationFrame
const calculateFPS = (): Promise<number> => {
  return new Promise(resolve => {
    let frameCount = 0;
    let lastTimestamp = performance.now();
    
    const countFrames = (timestamp: number) => {
      frameCount++;
      
      // Calculate FPS after 500ms
      if (timestamp - lastTimestamp >= 500) {
        const fps = Math.round((frameCount * 1000) / (timestamp - lastTimestamp));
        resolve(fps);
        return;
      }
      
      requestAnimationFrame(countFrames);
    };
    
    requestAnimationFrame(countFrames);
  });
};

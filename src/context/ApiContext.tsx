
import React, { createContext, useState, useContext } from 'react';
import { ApiManager, availableApiServices } from '../utils/apiUtils';

interface ApiContextType {
  apiManager: ApiManager;
  selectedService: string;
  selectService: (serviceId: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // API state
  const apiManager = new ApiManager();
  const [selectedService, setSelectedService] = useState<string>('openai');
  
  // Select an API service
  const selectService = (serviceId: string) => {
    setSelectedService(serviceId);
  };
  
  const value = {
    apiManager,
    selectedService,
    selectService,
  };
  
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

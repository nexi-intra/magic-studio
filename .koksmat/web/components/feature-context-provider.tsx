/**
 * FeatureContextProvider
 * 
 * A context provider for managing application features, UPNs, and feature activation status.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Feature {
  name: string;
  path: string;
}

interface FeatureContextType {
  setActiveFeatures: (features: string[]) => void;
  setActiveUPN: (upn: string) => void;
  registerFeature: (feature: Feature) => void;
  isFeatureActive: (featureName: string, upn?: string) => boolean;
  getActiveFeaturesForUPN: (upn: string) => string[];
  getRegisteredFeatures: () => Feature[];
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

interface FeatureContextProviderProps {
  children: ReactNode;
}

export const FeatureContextProvider: React.FC<FeatureContextProviderProps> = ({ children }) => {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [activeUPN, setActiveUPN] = useState<string>('');
  const [registeredFeatures, setRegisteredFeatures] = useState<Feature[]>([]);
  const [upnFeatureMap, setUpnFeatureMap] = useState<Record<string, string[]>>({});

  const setActiveFeaturesHandler = useCallback((features: string[]) => {
    setActiveFeatures(features);
  }, []);

  const setActiveUPNHandler = useCallback((upn: string) => {
    setActiveUPN(upn);
  }, []);

  const registerFeatureHandler = useCallback((feature: Feature) => {
    setRegisteredFeatures(prev => [...prev, feature]);
  }, []);

  const isFeatureActive = useCallback((featureName: string, upn?: string) => {
    const targetUPN = upn || activeUPN;
    return upnFeatureMap[targetUPN]?.includes(featureName) || false;
  }, [activeUPN, upnFeatureMap]);

  const getActiveFeaturesForUPN = useCallback((upn: string) => {
    return upnFeatureMap[upn] || [];
  }, [upnFeatureMap]);

  const getRegisteredFeatures = useCallback(() => {
    return registeredFeatures;
  }, [registeredFeatures]);

  const contextValue: FeatureContextType = {
    setActiveFeatures: setActiveFeaturesHandler,
    setActiveUPN: setActiveUPNHandler,
    registerFeature: registerFeatureHandler,
    isFeatureActive,
    getActiveFeaturesForUPN,
    getRegisteredFeatures,
  };

  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureContext = () => {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatureContext must be used within a FeatureContextProvider');
  }
  return context;
};
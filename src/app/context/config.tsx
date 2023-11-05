import React from 'react';

interface Config {
  PXE_URL: string;
}

export const defaultConfig: Config = {
  PXE_URL: process.env.PXE_URL || 'http://localhost:8080',
};

export const ConfigContext = React.createContext<Config>(defaultConfig);

export const useConfig = () => {
  return React.useContext(ConfigContext);
};

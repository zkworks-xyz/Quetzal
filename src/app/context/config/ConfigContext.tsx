import { createContext } from 'react';
import { Config } from './Config.js';

const defaultConfig: Config = {
  PXE_URL: process.env.PXE_URL || 'http://localhost:8080',
};

export const ConfigContext = createContext<Config>(defaultConfig);

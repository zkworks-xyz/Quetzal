import { useContext } from 'react';
import { ConfigContext } from './ConfigContext.js';

export const useConfig = () => {
  return useContext(ConfigContext);
};

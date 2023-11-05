import { useContext } from 'react';
import { DeveloperContext } from './DeveloperContext.js';

export const useDeveloperMode = () => {
  return useContext(DeveloperContext);
};

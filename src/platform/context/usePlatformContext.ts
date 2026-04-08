import { useContext } from 'react';
import { PlatformContext } from './platformContext.shared';

export function usePlatformContext() {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }

  return context;
}

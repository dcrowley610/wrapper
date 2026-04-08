import { useSyncExternalStore } from 'react';
import { investorsService } from '../services';

export function useInvestorsVersion(): number {
  return useSyncExternalStore(
    investorsService.subscribe,
    investorsService.getVersion,
  );
}

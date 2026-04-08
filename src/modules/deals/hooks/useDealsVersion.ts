import { useSyncExternalStore } from 'react';
import { dealsService } from '../services';

export function useDealsVersion(): number {
  return useSyncExternalStore(
    dealsService.subscribe,
    dealsService.getVersion,
  );
}

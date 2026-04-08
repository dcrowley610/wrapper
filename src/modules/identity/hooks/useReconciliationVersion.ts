import { useSyncExternalStore } from 'react';
import { reconciliationService } from '../services';

export function useReconciliationVersion(): number {
  return useSyncExternalStore(
    reconciliationService.subscribe,
    reconciliationService.getVersion,
  );
}

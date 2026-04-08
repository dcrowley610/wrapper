import { useSyncExternalStore } from 'react';
import { fundsService } from '../services/funds.service';

export function useFundsVersion(): number {
  return useSyncExternalStore(
    fundsService.subscribe,
    fundsService.getVersion,
  );
}

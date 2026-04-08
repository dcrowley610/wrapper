import { useSyncExternalStore } from 'react';
import { identityService } from '../services';

export function useIdentityVersion(): number {
  return useSyncExternalStore(
    identityService.subscribe,
    identityService.getVersion,
  );
}

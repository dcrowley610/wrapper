import { useSyncExternalStore } from 'react';
import { entitiesService } from '../services';

export function useEntitiesVersion(): number {
  return useSyncExternalStore(
    entitiesService.subscribe,
    entitiesService.getVersion,
  );
}

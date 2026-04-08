import { createContext } from 'react';
import type { PlatformContextValue } from './platformContext.types';

export const PlatformContext = createContext<PlatformContextValue | null>(null);

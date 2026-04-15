import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { PlatformContext } from './platformContext.shared';
import { useFundsVersion } from '../../modules/home/hooks/useFundsVersion';
import { useDealsVersion } from '../../modules/deals/hooks/useDealsVersion';
import {
  MOCK_SCOPE_OPTIONS,
  SCOPE_DIMENSIONS,
  SCOPE_PRESETS,
  DEFAULT_SCOPE_SELECTION,
  computeScopeLabel,
  type NavigationTarget,
  type PlatformContextValue,
  type ScopeSelection,
} from './platformContext.types';

export function PlatformProvider({ children }: PropsWithChildren) {
  const fundsVersion = useFundsVersion();
  const dealsVersion = useDealsVersion();
  const [scopeSelection, setScopeSelection] = useState<ScopeSelection>(DEFAULT_SCOPE_SELECTION);
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget>(null);

  const navigateTo = useCallback((module: string, params?: Record<string, string>) => {
    setNavigationTarget({ module, params });
  }, []);

  const clearNavigationTarget = useCallback(() => {
    setNavigationTarget(null);
  }, []);

  // Legacy: derive selectedScopeId from the first fund or first year in the selection
  const setSelectedScopeId = useCallback((scopeId: string) => {
    const opt = MOCK_SCOPE_OPTIONS.find((o) => o.id === scopeId);
    if (!opt) return;
    if (opt.kind === 'fund' || opt.kind === 'legalEntity') {
      setScopeSelection((prev) => ({ ...prev, fundIds: [scopeId] }));
    } else if (opt.kind === 'taxYear') {
      setScopeSelection((prev) => ({ ...prev, taxYearIds: [scopeId] }));
    } else if (opt.kind === 'workstream') {
      setScopeSelection((prev) => ({ ...prev, workstreamIds: [scopeId] }));
    }
  }, []);

  const value = useMemo<PlatformContextValue>(() => {
    const scopeLabel = computeScopeLabel(scopeSelection);

    // Legacy backward compat: pick the first fund id or first year id as "selectedScope"
    const legacyId = scopeSelection.fundIds[0] ?? scopeSelection.taxYearIds[0] ?? scopeSelection.workstreamIds[0] ?? MOCK_SCOPE_OPTIONS[0].id;
    const selectedScope =
      MOCK_SCOPE_OPTIONS.find((scope) => scope.id === legacyId) ?? MOCK_SCOPE_OPTIONS[0];

    return {
      // New
      scopeDimensions: SCOPE_DIMENSIONS,
      scopePresets: SCOPE_PRESETS,
      scopeSelection,
      setScopeSelection,
      scopeLabel,

      // Legacy
      scopeOptions: MOCK_SCOPE_OPTIONS,
      selectedScope,
      setSelectedScopeId,

      // Navigation
      navigateTo,
      navigationTarget,
      clearNavigationTarget,
    };
  }, [scopeSelection, setSelectedScopeId, navigateTo, navigationTarget, clearNavigationTarget, fundsVersion, dealsVersion]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

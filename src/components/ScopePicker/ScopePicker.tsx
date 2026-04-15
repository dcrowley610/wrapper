import { useCallback } from 'react';
import { usePlatformContext } from '../../platform/context';
import type { ScopeSelection } from '../../platform/context';
import { fundsService } from '../../modules/home/services/funds.service';
import { useFundsVersion } from '../../modules/home/hooks/useFundsVersion';
import { dealsService } from '../../modules/deals/services/deals.service';
import { useDealsVersion } from '../../modules/deals/hooks/useDealsVersion';
import { DimensionDropdown } from './DimensionDropdown';
import { PresetMenu } from './PresetMenu';
import styles from './ScopePicker.module.css';

export function ScopePicker() {
  const { scopeDimensions, scopePresets, scopeSelection, setScopeSelection } = usePlatformContext();
  useFundsVersion();
  useDealsVersion();
  const fundOptions = fundsService.getFundScopeDimensionOptions();
  const dealOptions = dealsService.getDealScopeDimensionOptions();

  const updateDimension = useCallback(
    (key: keyof ScopeSelection, ids: string[]) => {
      setScopeSelection({ ...scopeSelection, [key]: ids });
    },
    [scopeSelection, setScopeSelection],
  );

  return (
    <div className={styles.scopePicker}>
      <DimensionDropdown
        label="Fund"
        options={fundOptions}
        selectedIds={scopeSelection.fundIds}
        allLabel="All Funds"
        onChange={(ids) => updateDimension('fundIds', ids)}
      />
      <DimensionDropdown
        label="Year"
        options={scopeDimensions.taxYear}
        selectedIds={scopeSelection.taxYearIds}
        allLabel="All Years"
        onChange={(ids) => updateDimension('taxYearIds', ids)}
      />
      <DimensionDropdown
        label="Investor"
        options={scopeDimensions.investor}
        selectedIds={scopeSelection.investorIds}
        allLabel="All Investors"
        onChange={(ids) => updateDimension('investorIds', ids)}
        placeholder
      />
      <DimensionDropdown
        label="Deal"
        options={dealOptions}
        selectedIds={scopeSelection.dealIds}
        allLabel="All Deals"
        onChange={(ids) => updateDimension('dealIds', ids)}
        placeholder
      />
      <PresetMenu
        presets={scopePresets}
        onSelect={setScopeSelection}
      />
    </div>
  );
}

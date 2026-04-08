import { useEffect, useRef, useState } from 'react';
import type { ScopePreset, ScopeSelection } from '../../platform/context';
import styles from './ScopePicker.module.css';

interface PresetMenuProps {
  presets: ScopePreset[];
  onSelect: (selection: ScopeSelection) => void;
}

export function PresetMenu({ presets, onSelect }: PresetMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dimensionDropdown} ref={ref}>
      <button
        className={styles.presetTrigger}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        Presets
        <span className={styles.chevron} />
      </button>

      {open && (
        <div className={`${styles.dropdownMenu} ${styles.presetDropdownMenu}`}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              className={styles.presetItem}
              onClick={() => {
                onSelect(preset.selection);
                setOpen(false);
              }}
              type="button"
            >
              <span className={styles.presetLabel}>{preset.label}</span>
              <span className={styles.presetDesc}>{preset.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

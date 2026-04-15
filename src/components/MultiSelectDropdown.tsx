import { useEffect, useRef, useState } from 'react';
import styles from './MultiSelectDropdown.module.css';

type Option = { value: string; label: string };

type MultiSelectDropdownProps = {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (vals: string[]) => void;
};

export function MultiSelectDropdown({ label, options, selected, onChange }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const triggerLabel =
    selected.length === 0
      ? `All ${label.toLowerCase()}`
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
        : `${label} (${selected.length})`;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <span className={styles.fieldLabel}>{label}</span>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{triggerLabel}</span>
        <span className={styles.arrow}>{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.actions}>
            <button type="button" className={styles.actionLink} onClick={() => onChange(options.map((o) => o.value))}>
              Select all
            </button>
            <button type="button" className={styles.actionLink} onClick={() => onChange([])}>
              Clear
            </button>
          </div>
          <div className={styles.optionList}>
            {options.map((opt) => (
              <label key={opt.value} className={styles.option}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                />
                <span className={styles.optionLabel}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

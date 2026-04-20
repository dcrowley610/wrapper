import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScopeDimensionOption } from '../../platform/context';
import styles from './ScopePicker.module.css';

interface DimensionDropdownProps {
  label: string;
  options: ScopeDimensionOption[];
  selectedIds: string[];
  allLabel: string;
  onChange: (ids: string[]) => void;
  placeholder?: boolean;
}

export function DimensionDropdown({
  label,
  options,
  selectedIds,
  allLabel,
  onChange,
  placeholder,
}: DimensionDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const isAll = selectedIds.length === 0;

  let displayText: string;
  if (isAll) {
    displayText = allLabel;
  } else if (selectedIds.length === 1) {
    const opt = options.find((o) => o.id === selectedIds[0]);
    displayText = opt?.label ?? selectedIds[0];
  } else {
    displayText = `${selectedIds.length} ${label}s`;
  }

  const toggleId = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((s) => s !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    },
    [selectedIds, onChange],
  );

  const selectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const isPlaceholder = placeholder && isAll;

  const trimmedQuery = query.trim();
  const filteredOptions =
    trimmedQuery === ''
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(trimmedQuery.toLowerCase()),
        );

  return (
    <div className={styles.dimensionDropdown} ref={ref}>
      <button
        className={`${styles.dimensionTrigger} ${isPlaceholder ? styles.dimensionTriggerPlaceholder : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className={styles.dimensionLabel}>{label}:</span>{' '}
        <span className={styles.dimensionValue}>{displayText}</span>
        <span className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownSearchWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (query) {
                    setQuery('');
                    e.stopPropagation();
                  } else {
                    setOpen(false);
                  }
                }
              }}
              placeholder={`Search ${label.toLowerCase()}…`}
              className={styles.dropdownSearch}
            />
          </div>
          {trimmedQuery === '' && (
            <>
              <label className={styles.dropdownItem}>
                <input
                  type="checkbox"
                  checked={isAll}
                  onChange={selectAll}
                  className={styles.checkbox}
                />
                <span className={styles.dropdownItemLabel}>{allLabel}</span>
              </label>
              <div className={styles.dropdownDivider} />
            </>
          )}
          {filteredOptions.length === 0 ? (
            <div className={styles.dropdownEmpty}>No matches</div>
          ) : (
            filteredOptions.map((opt) => (
              <label key={opt.id} className={styles.dropdownItem}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(opt.id)}
                  onChange={() => toggleId(opt.id)}
                  className={styles.checkbox}
                />
                <span className={styles.dropdownItemLabel}>{opt.label}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

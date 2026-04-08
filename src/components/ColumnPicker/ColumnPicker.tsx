import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ColumnPicker.module.css';

export type ColumnDef = { key: string; label: string };

type ColumnPickerProps = {
  columns: ColumnDef[];
  visibleKeys: string[];
  onChange: (keys: string[]) => void;
  defaultKeys: string[];
};

function GripIcon() {
  return (
    <svg className={styles.gripIcon} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5.5" cy="3" r="1.2" />
      <circle cx="10.5" cy="3" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="13" r="1.2" />
      <circle cx="10.5" cy="13" r="1.2" />
    </svg>
  );
}

type SortableColumnItemProps = {
  colKey: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

function SortableColumnItem({ colKey, label, checked, onToggle }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: colKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.item} ${isDragging ? styles.dragging : ''}`}
    >
      <button
        type="button"
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <label className={styles.itemLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={onToggle}
        />
        <span className={styles.label}>{label}</span>
      </label>
    </div>
  );
}

function OverlayItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className={`${styles.item} ${styles.overlayItem}`}>
      <div className={styles.dragHandle}>
        <GripIcon />
      </div>
      <label className={styles.itemLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          readOnly
        />
        <span className={styles.label}>{label}</span>
      </label>
    </div>
  );
}

export function ColumnPicker({ columns, visibleKeys, onChange, defaultKeys }: ColumnPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columnMap = new Map(columns.map((c) => [c.key, c]));

  // Visible columns in their order, then unchecked columns in definition order
  const orderedItems = [
    ...visibleKeys.filter((k) => columnMap.has(k)),
    ...columns.filter((c) => !visibleKeys.includes(c.key)).map((c) => c.key),
  ];

  function toggle(key: string) {
    if (visibleKeys.includes(key)) {
      onChange(visibleKeys.filter((k) => k !== key));
    } else {
      onChange([...visibleKeys, key]);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedItems.indexOf(String(active.id));
    const newIndex = orderedItems.indexOf(String(over.id));
    const reordered = arrayMove(orderedItems, oldIndex, newIndex);

    // Extract only the checked items in the new order
    const newVisible = reordered.filter((k) => visibleKeys.includes(k));
    onChange(newVisible);
  }

  const activeCol = activeId ? columnMap.get(activeId) : null;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.gearBtn}
        onClick={() => setOpen((o) => !o)}
        type="button"
        title="Configure visible columns"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="2.5" />
          <path d="M13.5 8a5.5 5.5 0 0 0-.1-.8l1.3-1-.7-1.2-1.5.5a5.5 5.5 0 0 0-1.2-.7L11 3.3H9.6l-.3 1.5a5.5 5.5 0 0 0-1.2.7l-1.5-.5-.7 1.2 1.3 1a5.5 5.5 0 0 0 0 1.6l-1.3 1 .7 1.2 1.5-.5c.4.3.8.5 1.2.7l.3 1.5H11l.3-1.5c.4-.2.8-.4 1.2-.7l1.5.5.7-1.2-1.3-1a5.5 5.5 0 0 0 .1-.8z" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderedItems} strategy={verticalListSortingStrategy}>
              {orderedItems.map((key) => {
                const col = columnMap.get(key);
                if (!col) return null;
                return (
                  <SortableColumnItem
                    key={col.key}
                    colKey={col.key}
                    label={col.label}
                    checked={visibleKeys.includes(col.key)}
                    onToggle={() => toggle(col.key)}
                  />
                );
              })}
            </SortableContext>
            <DragOverlay>
              {activeCol ? (
                <OverlayItem
                  label={activeCol.label}
                  checked={visibleKeys.includes(activeCol.key)}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
          <div className={styles.divider} />
          <button
            className={styles.resetLink}
            onClick={() => onChange(defaultKeys)}
            type="button"
          >
            Reset to default
          </button>
        </div>
      )}
    </div>
  );
}

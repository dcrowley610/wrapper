import { useState } from 'react';
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
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './DraggableHeaderRow.module.css';

type Column = { key: string; label: string };

type DraggableHeaderRowProps = {
  columns: Column[];
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onReorder: (keys: string[]) => void;
  fixedFirstKey?: string;
  showActions?: boolean;
  sortIndicatorClass: string;
};

function SortableTh({
  col,
  sortKey,
  sortDirection,
  onSort,
  sortIndicatorClass,
}: {
  col: Column;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  sortIndicatorClass: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.key });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`${styles.draggableTh} ${isDragging ? styles.dragging : ''}`}
      onClick={() => onSort(col.key)}
      {...attributes}
      {...listeners}
    >
      {col.label}
      {sortKey === col.key && (
        <span className={sortIndicatorClass}>
          {sortDirection === 'asc' ? '\u25B2' : '\u25BC'}
        </span>
      )}
    </th>
  );
}

export function DraggableHeaderRow({
  columns,
  sortKey,
  sortDirection,
  onSort,
  onReorder,
  fixedFirstKey,
  showActions,
  sortIndicatorClass,
}: DraggableHeaderRowProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const fixedFirst = fixedFirstKey ? columns.find((c) => c.key === fixedFirstKey) : null;
  const draggable = columns.filter((c) => c.key !== fixedFirstKey);
  const draggableIds = draggable.map((c) => c.key);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = draggableIds.indexOf(String(active.id));
    const newIndex = draggableIds.indexOf(String(over.id));
    const reordered = arrayMove(draggable, oldIndex, newIndex);
    const newKeys = reordered.map((c) => c.key);

    // Include the fixed key at front for the full visibleColumns order
    if (fixedFirstKey) {
      onReorder([fixedFirstKey, ...newKeys]);
    } else {
      onReorder(newKeys);
    }
  }

  const activeCol = activeId ? draggable.find((c) => c.key === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <tr>
        {fixedFirst && (
          <th onClick={() => onSort(fixedFirst.key)}>
            {fixedFirst.label}
            {sortKey === fixedFirst.key && (
              <span className={sortIndicatorClass}>
                {sortDirection === 'asc' ? '\u25B2' : '\u25BC'}
              </span>
            )}
          </th>
        )}
        <SortableContext items={draggableIds} strategy={horizontalListSortingStrategy}>
          {draggable.map((col) => (
            <SortableTh
              key={col.key}
              col={col}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
              sortIndicatorClass={sortIndicatorClass}
            />
          ))}
        </SortableContext>
        {showActions && <th>Actions</th>}
      </tr>
      <DragOverlay>
        {activeCol ? (
          <div className={styles.overlay}>{activeCol.label}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

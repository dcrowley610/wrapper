import type { StepNote } from '../../types';
import styles from '../../RulesModule.module.css';

type NoteBlockProps = {
  notes: StepNote[];
};

export function NoteBlock({ notes }: NoteBlockProps) {
  if (notes.length === 0) return null;

  return (
    <div>
      {notes.map((note) => (
        <div key={note.id} className={styles.noteItem}>
          <div className={styles.noteText}>{note.text}</div>
          <div className={styles.noteMeta}>
            {note.author} &middot; {new Date(note.timestamp).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

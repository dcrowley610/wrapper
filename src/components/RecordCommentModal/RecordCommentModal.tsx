import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RecordComment } from '../../types/comment';
import styles from './RecordCommentModal.module.css';

type RecordCommentModalProps = {
  title: string;
  comments: RecordComment[];
  onAddComment: (comment: RecordComment) => void;
  onClose: () => void;
};

let commentCounter = 0;

export function RecordCommentModal({ title, comments, onAddComment, onClose }: RecordCommentModalProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  function hasDirtyFields() {
    return author.trim().length > 0 || text.trim().length > 0;
  }

  function handleClose() {
    if (hasDirtyFields() && !window.confirm('You have unsaved text. Close without posting?')) {
      return;
    }
    onClose();
  }

  function handleSubmit() {
    if (!author.trim() || !text.trim()) return;
    commentCounter += 1;
    const comment: RecordComment = {
      id: `cmt-${Date.now()}-${commentCounter}`,
      author: author.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    onAddComment(comment);
    setAuthor('');
    setText('');
  }

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.iconBtn} onClick={handleClose} type="button" title="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {comments.length === 0 ? (
          <div className={styles.emptyState}>No comments yet.</div>
        ) : (
          <div className={styles.commentTimeline}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentEntry}>
                <span className={styles.commentAuthor}>{c.author}</span>
                <span className={styles.commentTimestamp}>
                  {new Date(c.timestamp).toLocaleString()}
                </span>
                <p className={styles.commentText}>{c.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className={styles.commentForm}>
          <input
            className={styles.authorInput}
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            type="button"
            disabled={!author.trim() || !text.trim()}
          >
            Post comment
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

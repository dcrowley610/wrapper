import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RequestComment, WorkflowRequest } from '../types';
import styles from '../RequestsModule.module.css';

type RequestCommentModalProps = {
  request: WorkflowRequest;
  onAddComment: (requestId: string, comment: RequestComment) => void;
  onExpand: () => void;
  onClose: () => void;
};

let commentCounter = 0;

export function RequestCommentModal({ request, onAddComment, onExpand, onClose }: RequestCommentModalProps) {
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
    const comment: RequestComment = {
      id: `cmt-${Date.now()}-${commentCounter}`,
      author: author.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    onAddComment(request.id, comment);
    setAuthor('');
    setText('');
  }

  return createPortal(
    <div className={styles.importOverlay} onClick={handleClose}>
      <div className={styles.importModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeaderRow}>
          <h3 className={styles.importTitle}>Comments — {request.id}</h3>
          <div>
            <button className={styles.modalIconBtn} onClick={onExpand} type="button" title="Open full view">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
              </svg>
            </button>
            <button className={styles.modalIconBtn} onClick={handleClose} type="button" title="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {request.comments.length === 0 ? (
          <div className={styles.emptyState}>No comments yet.</div>
        ) : (
          <div className={styles.commentTimeline}>
            {request.comments.map((c) => (
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
            className={styles.commentAuthorInput}
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            className={styles.commentTextarea}
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className={styles.commentSubmitBtn}
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

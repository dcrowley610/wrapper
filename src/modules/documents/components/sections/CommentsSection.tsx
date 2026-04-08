import { useState } from 'react';
import type { DocumentComment } from '../../types';
import type { FieldAction } from '../../pages/DocumentReviewPage';
import styles from '../../DocumentsModule.module.css';

type CommentsSectionProps = {
  comments: DocumentComment[];
  dispatch: React.Dispatch<FieldAction>;
};

export function CommentsSection({ comments, dispatch }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');

  function handleSubmit() {
    if (!newComment.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      comment: {
        author: 'Current User',
        text: newComment.trim(),
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        fieldId: null,
      },
    });
    setNewComment('');
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Comments</h2>
      <p className={styles.sectionCopy}>
        Notes, explanations, and discussion about this document.
      </p>

      {comments.length > 0 ? (
        <div className={styles.commentTimeline}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentEntry}>
              <span className={styles.commentAuthor}>{comment.author}</span>
              <span className={styles.commentTimestamp}>{comment.timestamp}</span>
              {comment.fieldId && (
                <span className={styles.commentFieldRef}>Field: {comment.fieldId}</span>
              )}
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} style={{ marginTop: 14 }}>No comments yet.</div>
      )}

      <div className={styles.commentForm}>
        <textarea
          className={styles.commentTextarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or explanation..."
        />
        <button
          className={styles.commentSubmitBtn}
          onClick={handleSubmit}
          type="button"
          disabled={!newComment.trim()}
        >
          Add comment
        </button>
      </div>
    </>
  );
}

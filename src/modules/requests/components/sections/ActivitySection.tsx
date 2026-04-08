import { useState } from 'react';
import type { WorkflowRequest } from '../../types';
import type { DetailAction } from '../../pages/RequestDetailPage';
import styles from '../../RequestsModule.module.css';

type ActivitySectionProps = {
  request: WorkflowRequest;
  dispatch: React.Dispatch<DetailAction>;
};

export function ActivitySection({ request, dispatch }: ActivitySectionProps) {
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  function handleSubmitComment() {
    if (!author.trim() || !commentText.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      comment: {
        id: crypto.randomUUID(),
        author: author.trim(),
        text: commentText.trim(),
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
    });
    setCommentText('');
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Activity log</h2>
      <p className={styles.sectionCopy}>
        Full chronological record of actions, status changes, and updates for this request.
      </p>
      {request.activityLog.length > 0 ? (
        <div className={styles.activityTimeline}>
          {request.activityLog.map((entry, i) => (
            <div key={i} className={styles.activityEntry}>
              <div className={styles.activityDate}>{entry.date}</div>
              <div className={styles.activityAction}>{entry.action}</div>
              <div className={styles.activityActor}>{entry.actor}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No activity recorded yet.</div>
      )}

      <hr className={styles.commentDivider} />
      <h2 className={styles.sectionTitle}>Comments</h2>
      <p className={styles.sectionCopy}>
        Notes and discussion from any interested party on this request.
      </p>

      {request.comments.length > 0 ? (
        <div className={styles.commentTimeline}>
          {request.comments.map((comment) => (
            <div key={comment.id} className={styles.commentEntry}>
              <span className={styles.commentAuthor}>{comment.author}</span>
              <span className={styles.commentTimestamp}>{comment.timestamp}</span>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} style={{ marginTop: 14 }}>No comments yet.</div>
      )}

      <div className={styles.commentForm}>
        <input
          className={styles.commentAuthorInput}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
        />
        <textarea
          className={styles.commentTextarea}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          className={styles.commentSubmitBtn}
          onClick={handleSubmitComment}
          type="button"
          disabled={!author.trim() || !commentText.trim()}
        >
          Post comment
        </button>
      </div>
    </>
  );
}

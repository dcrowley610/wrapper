import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function QuestionsSection({ investor }: { investor: InvestorRecord }) {
  const badgeClass = (status: string) => {
    if (status === 'Open') return styles.questionBadgeOpen;
    if (status === 'Answered') return styles.questionBadgeAnswered;
    return styles.questionBadgeEscalated;
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Questions</h2>
      <p className={styles.sectionCopy}>
        Investor outreach, unanswered tax questions, and follow-up tracking.
      </p>
      {investor.openQuestionsList.map((q) => (
        <div key={q.id} className={styles.questionCard}>
          <p className={styles.questionText}>{q.question}</p>
          <div className={styles.questionMeta}>
            <span>Asked: {q.askedDate}</span>
            <span className={`${styles.questionBadge} ${badgeClass(q.status)}`}>{q.status}</span>
          </div>
        </div>
      ))}
    </>
  );
}

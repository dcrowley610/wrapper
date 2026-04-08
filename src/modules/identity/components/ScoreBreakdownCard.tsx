import type { ScoreComponent } from '../types';
import styles from '../IdentityModule.module.css';

type ScoreBreakdownCardProps = {
  components: ScoreComponent[];
  compositeScore: number;
};

export function ScoreBreakdownCard({ components, compositeScore }: ScoreBreakdownCardProps) {
  return (
    <div>
      <table className={styles.scoreGrid}>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Score</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody>
          {components.map((c, i) => (
            <tr key={i}>
              <td>{c.factor.replace(/_/g, ' ')}</td>
              <td className={c.weightedScore >= 0 ? styles.scorePositive : styles.scoreNegative}>
                {c.weightedScore >= 0 ? '+' : ''}{c.weightedScore}
              </td>
              <td>{c.explanation}</td>
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: 700, borderTop: '2px solid #bcc8d1' }}>Composite</td>
            <td style={{ fontWeight: 800, borderTop: '2px solid #bcc8d1' }}>{compositeScore}</td>
            <td style={{ borderTop: '2px solid #bcc8d1' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

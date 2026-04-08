import { usePlatformContext } from '../../platform/context/PlatformContext';
import styles from './RequestsApp.module.css';

const activeRequests = [
  {
    id: 'REQ-1042',
    status: 'In review',
    stage: 'Source package assembled',
    title: 'Atlas Master Fund extension decision memo',
    summary:
      'The orchestrator has grouped state filing exposure, prior-year assumptions, and open notices into one review packet for tax and legal sign-off.',
    owner: 'Tax Manager',
    latestExpectedDate: 'Mar 26',
  },
  {
    id: 'REQ-1038',
    status: 'Agent drafting',
    stage: 'Waiting on document validation',
    title: 'Lux blocker ECI and withholding support package',
    summary:
      'Entity structure, ownership percentages, and supporting workpapers have been stitched together so the team can resolve withholding assumptions before filing.',
    owner: 'International Tax',
    latestExpectedDate: 'Mar 24',
  },
  {
    id: 'REQ-1031',
    status: 'Ready to launch',
    stage: 'Playbook selected',
    title: 'Q1 notice response triage for state composite filings',
    summary:
      'The starter workflow has identified impacted jurisdictions, owners, and prior notices so the response can begin from a pre-scoped checklist instead of a blank page.',
    owner: 'Tax Operations',
    latestExpectedDate: 'Mar 22',
  },
];

const queueCards = [
  {
    title: 'Agent-ready intake',
    count: '12',
    text: 'Requests with enough structured facts to auto-generate a first-pass workplan and missing-data checklist.',
  },
  {
    title: 'Needs source mapping',
    count: '5',
    text: 'Requests that still need documents, ownership context, or prior return references linked into the case.',
  },
  {
    title: 'Blocked on approvals',
    count: '3',
    text: 'Matters paused pending reviewer assignment, signer confirmation, or legal escalation.',
  },
];

const timeline = [
  {
    time: '09:10 ET',
    label: 'Intake classified',
    text: 'The extension memo request was recognized as a filing-decision workflow and routed to the master fund playbook.',
  },
  {
    time: '10:25 ET',
    label: 'Structure context attached',
    text: 'The orchestrator pulled ownership and blocker relationships from Structures so entity-level assumptions travel with the request.',
  },
  {
    time: '11:05 ET',
    label: 'Draft package generated',
    text: 'A first-pass checklist, issues memo outline, and reviewer handoff were assembled for the selected scope.',
  },
];

export default function RequestsApp() {
  const { selectedScope } = usePlatformContext();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Orchestrator Starter</div>
          <h1 className={styles.title}>AI-enabled tax requests that understand context.</h1>
          <p className={styles.lead}>
            Request intake, triage, and execution for tax matters.
            This active platform helps frame the request, suggest the right playbook, and
            pull in structure-aware context before a human reviewer touches the file.
          </p>
          <div className={styles.heroMetrics}>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Active Scope</p>
              <p className={styles.metricValue}>{selectedScope.label}</p>
              <p className={styles.metricMeta}>{selectedScope.description}</p>
            </article>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Live Requests</p>
              <p className={styles.metricValue}>20</p>
              <p className={styles.metricMeta}>Across intake, drafting, review, and notices.</p>
            </article>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Auto-scoped</p>
              <p className={styles.metricValue}>82%</p>
              <p className={styles.metricMeta}>Requests mapped to a starter playbook without manual triage.</p>
            </article>
          </div>
        </div>

        <aside className={styles.insightCard}>
          <div className={styles.eyebrow}>Why It Matters</div>
          <h2 className={styles.insightTitle}>A request module should launch the process, not just collect a form.</h2>
          <p className={styles.insightText}>
            The design here treats Requests as the orchestration front door for tax operations: classify,
            enrich, assign, and prepare work so the next human or AI step starts with context.
          </p>
          <ul className={styles.insightList}>
            <li>Starter playbooks for extensions, K-1 issues, notices, and entity-level compliance.</li>
            <li>Scope-aware intake tied to funds, legal entities, tax years, or cross-functional workstreams.</li>
            <li>Direct handoff into downstream modules like Structures, Workflow, Documents, and Rules.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Priority request queue</h2>
              <p className={styles.sectionCopy}>
                A realistic starter surface for the orchestrator: active matters, lifecycle stage, and
                who is expected to act next.
              </p>
            </div>
            <span className={styles.pill}>Scope: {selectedScope.kind}</span>
          </div>
          <div className={styles.requestList}>
            {activeRequests.map((request) => (
              <article key={request.id} className={styles.requestCard}>
                <div className={styles.requestTopline}>
                  <span className={styles.status}>{request.status}</span>
                  <span className={styles.stage}>{request.stage}</span>
                </div>
                <h3 className={styles.requestTitle}>{request.title}</h3>
                <p className={styles.requestSummary}>{request.summary}</p>
                <div className={styles.requestMeta}>
                  <span>{request.id}</span>
                  <span>Owner: {request.owner}</span>
                  <span>Expected: {request.latestExpectedDate}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.queueGrid}>
          <div className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Triage lanes</h2>
                <p className={styles.sectionCopy}>
                  A simple operating model for how work enters the system and where intervention is needed.
                </p>
              </div>
            </div>
            {queueCards.map((queue) => (
              <article key={queue.title} className={styles.queueCard}>
                <div className={styles.queueHeading}>
                  <h3 className={styles.queueTitle}>{queue.title}</h3>
                  <span className={styles.queueCount}>{queue.count}</span>
                </div>
                <p className={styles.queueText}>{queue.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.timelineCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Recent orchestrations</h2>
                <p className={styles.sectionCopy}>
                  Example events showing how the module can narrate what the system has already done.
                </p>
              </div>
            </div>
            <div className={styles.timelineList}>
              {timeline.map((item) => (
                <article key={item.time} className={styles.timelineItem}>
                  <div className={styles.timelineTime}>{item.time}</div>
                  <div className={styles.timelineBody}>
                    <h3 className={styles.timelineLabel}>{item.label}</h3>
                    <p className={styles.timelineText}>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

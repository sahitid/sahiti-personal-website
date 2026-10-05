import { FiFileText, FiCheckCircle, FiRefreshCw, FiImage, FiDatabase, FiLink, FiCamera, FiUserCheck, FiSend, FiGitBranch } from 'react-icons/fi';
import styles from './VroomDiagrams.module.css';

function Figure({ title, caption, children }) {
  return <figure className={styles.figure} aria-label={title}>
    <div className={styles.surface}><div className={styles.title}>{title}</div>{children}</div>
    <figcaption>{caption}</figcaption>
  </figure>;
}
function Node({ icon: Icon, title, children, accent = false }) {
  return <div className={`${styles.node} ${accent ? styles.accent : ''}`}>
    <strong>{Icon && <Icon aria-hidden="true" />}{title}</strong>{children && <span>{children}</span>}
  </div>;
}
function Arrow({ children }) { return <div className={styles.arrow}><span aria-hidden="true">↓</span>{children && <small>{children}</small>}</div>; }

export default function VroomDiagrams({ kind }) {
  if (kind === 'approval') return <Figure title="From draft to delivery" caption="Verification can trigger one refinement pass. Delivery follows the selected mode; manual review and automated sending are separate paths.">
    <ol className={styles.pipeline} aria-label="Draft generation stages">
      <li><FiFileText aria-hidden="true" /><strong>Distill</strong><span>Haiku · provider facts</span></li>
      <li><FiGitBranch aria-hidden="true" /><strong>Plan</strong><span>Sonnet · event + history</span></li>
      <li><FiFileText aria-hidden="true" /><strong>Draft</strong><span>Sonnet · subject + body</span></li>
    </ol>
    <Arrow />
    <Node icon={FiCheckCircle} title="Verify the draft">Haiku returns a structured report.</Node>
    <div className={styles.branches}>
      <section><Arrow>No issues / verifier unavailable</Arrow><Node title="Keep the draft">Continue with the generated message.</Node></section>
      <section><Arrow>Issues found</Arrow><Node icon={FiRefreshCw} title="Refine once">Sonnet revises; if it fails, keep the original.</Node></section>
    </div>
    <div className={styles.merge}>Both paths → draft ready for delivery</div>
    <div className={styles.destinations}>
      <Node icon={FiUserCheck} title="Manual mode" accent>Gmail draft + context snapshot → pending human approval.</Node>
      <Node icon={FiSend} title="Automated mode">AgentMail sends → record a pre-approved entry.</Node>
    </div>
  </Figure>;

  if (kind === 'photos') return <Figure title="One upload, two independent outcomes" caption="Tagging can recover without re-uploading the photo. Orphaned storage files are handled by a separate cleanup job after a one-hour grace period.">
    <div className={styles.swimlanes}>
      <section className={styles.savedLane}>
        <div className={styles.eyebrow}>Upload path</div>
        <Node icon={FiImage} title="Prepare">Thumbnail + image re-encoding.</Node><Arrow />
        <Node icon={FiDatabase} title="Store + record">Save the file and its photo record.</Node><Arrow />
        <Node icon={FiCheckCircle} title="Photo saved" accent>The uploaded photo stays available if tagging fails.</Node>
      </section>
      <section className={styles.tagLane}>
        <div className={styles.eyebrow}>Tagging states · after upload</div>
        <div className={styles.state}>pending</div><Arrow />
        <div className={styles.state}>processing</div>
        <div className={styles.branches}>
          <section><Arrow>Success</Arrow><div className={`${styles.state} ${styles.done}`}>done</div></section>
          <section><Arrow>Error</Arrow><div className={`${styles.state} ${styles.failed}`}>failed</div></section>
        </div>
        <div className={styles.retry}><FiRefreshCw aria-hidden="true" /><strong>Retry eligible pending / failed tags</strong><span>Return to processing · every 10 minutes<br />20 per batch · at most 3 attempts per photo</span></div>
      </section>
    </div>
  </Figure>;

  if (kind === 'lookup') return <Figure title="A field keeps its evidence" caption="Illustrative record shape. Each populated value travels with its source URL; information absent from the supplied page can stay null.">
    <div className={styles.recordLayout}>
      <div className={styles.sourcePage}><div className={styles.browserBar}><FiLink aria-hidden="true" />Supplied provider URL</div><div className={styles.pageText}><span /><span /><mark>Capacity listed on the page</mark><span /><span /></div></div>
      <div className={styles.extract}><span aria-hidden="true">→</span><small>Extract<br />+ validate</small></div>
      <dl className={styles.record}><div><dt>field</dt><dd>capacity</dd></div><div><dt>value</dt><dd>extracted number</dd></div><div className={styles.sourceRow}><dt>source</dt><dd><FiLink aria-hidden="true" /> supplied page URL</dd></div><div><dt>unknown</dt><dd><code>null</code></dd></div></dl>
    </div>
    <div className={styles.meta}>Page text → GPT-4o mini → JSON Schema → Zod → editable form</div>
  </Figure>;

  if (kind === 'checkin') return <Figure title="One scanner, two check-in routes" caption="The parser preserves the rsvp: prefix. Both routes receive the expected event ID; the RSVP result includes the guest’s name and +1 count.">
    <div className={styles.scanInput}><FiCamera aria-hidden="true" /><span>QR code or ticket URL</span></div>
    <Arrow />
    <div className={styles.decision}><FiGitBranch aria-hidden="true" />Does the code start with <code>rsvp:</code>?</div>
    <div className={styles.branches}>
      <section><Arrow>Yes · RSVP</Arrow><Node title="scan_rsvp" accent>p_qr_code + p_event_id</Node><Arrow /><div className={styles.output}>Guest name + number of +1s</div></section>
      <section><Arrow>No · ticket</Arrow><Node title="scan_ticket">code + expected_event_id</Node><Arrow /><div className={styles.output}>Ticket check-in result</div></section>
    </div>
  </Figure>;

  if (kind === 'ranking') return <Figure title="How long a post stays in the feed" caption="Expiration is a hard cutoff. Within each post’s lifetime, votes and time decay determine its rank among the fetched candidates.">
    <div className={styles.timeline}>
      <div className={styles.axis}><span>Posted</span><span>7 days</span><span>14 days</span></div>
      {[['Tea', '72 hours', '21.43%'], ['Green flag', '7 days', '50%'], ['Red flag', '14 days', '100%']].map(([label, duration, width]) => <div className={styles.timelineRow} key={label}><strong>{label}</strong><div className={styles.track}><span style={{ width }} /></div><span>{duration}</span></div>)}
    </div>
    <div className={styles.meta}>Unexpired posts → location bounds → 50 recent candidates → vote / age ranking</div>
  </Figure>;
  return null;
}

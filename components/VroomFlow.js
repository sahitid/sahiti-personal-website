import { useId, useState } from 'react';
import styles from './VroomFlow.module.css';

const flows = {
  search: {
    title: 'A fixed pool, progressively ranked',
    version: 'Historical implementation · April 2026',
    caption: 'Search architecture. Explore each stage, then follow the ranking-failure path.',
    toggle: 'Reranker unavailable',
    normal: 'The same providers survive every stage. Ranking changes their order.',
    failure: 'The stream reports the ranking error, then emits reranked and final with the original ordering.',
    steps: [
      { title: 'Filter', actor: 'Supabase · SQL', detail: 'Apply location, category, capacity, and other structured requirements. Fetch up to 75 provider records and emit the first pool immediately.', output: 'skeleton event · fixed candidate pool', code: 'hardFilterSearch()' },
      { title: 'Embed', actor: 'OpenRouter · OpenAI SDK', detail: 'Embed the requested atmosphere with text-embedding-3-small. Provider vectors were prepared separately by the background queue.', output: '1,536-dimensional query vector', code: 'embedOne(vibe)' },
      { title: 'Reorder', actor: 'PostgreSQL · pgvector', detail: 'Compare the query vector with stored embeddings inside the original pool. Preserve every candidate; providers without vectors sort to the bottom.', output: 'reranked event · same IDs, new order', code: 'rerank_providers_in_pool()', failureDetail: 'If embedding or the ranking RPC fails, retain the first ordering. Emit an error event with the original pool as the fallback.', failureOutput: 'error event + original candidate order' },
      { title: 'Finish', actor: 'SSE · React', detail: 'Emit final with the same results as reranked. The client ignores stale request IDs and cancels an older search when a new one begins.', output: 'final event · no additional reasoning stage', code: 'requestId + AbortController', failureDetail: 'Still emit reranked and final using the original ordering. A ranking failure does not discard the database results.', failureOutput: 'final event · original candidate order' },
    ],
  },
  approval: {
    title: 'From provider context to a draft',
    version: 'Historical V2 outreach chain',
    caption: 'Outreach architecture. Refinement runs when verification reports a failed check.',
    toggle: 'Verification flags a problem',
    normal: 'Manual mode: Gmail draft + pending approval. Automated mode: AgentMail send + pre-approved record.',
    failure: 'A failed check requests one refinement pass. If refinement throws, the original draft is retained.',
    steps: [
      { title: 'Distill', actor: 'Claude Haiku', detail: 'Extract concrete provider facts, capacity, atmosphere, and red flags from its stored description. On failure, continue with empty intelligence.', output: 'Structured provider intelligence', code: 'claude-haiku-4-5-20251001' },
      { title: 'Plan', actor: 'Claude Sonnet', detail: 'Combine provider facts with event details and relationship context. Build a hook, an ask, required details, and a target length of 70–140 words. Fall back to a template on error.', output: 'Structured outreach plan', code: 'claude-sonnet-4-6' },
      { title: 'Draft', actor: 'Claude Sonnet', detail: 'Generate a subject and body from the plan and provider intelligence. Parse the returned XML into the draft record.', output: 'Subject + body', code: 'parseDraftXml()' },
      { title: 'Verify', actor: 'Claude Haiku', detail: 'Request a structured report about the draft. When the verifier itself throws, retain the draft without a completed verification result.', output: 'Verification report', code: 'hasVerificationFailures()', failureDetail: 'The report identifies a failed check. Pass that report, the plan, and provider intelligence to the refinement step.', failureOutput: 'Report with issues → refinement' },
      { title: 'Refine?', actor: 'Conditional · Sonnet', detail: 'Skip this call if verification reports no failed checks. Pass the draft to the configured approval or sending workflow.', output: 'Draft ready for the configured workflow', code: 'storeDraftForApproval()', failureDetail: 'Make one Sonnet call to refine the draft against the reported issues. If that call fails, keep the original draft.', failureOutput: 'Refined draft, or original on error' },
    ],
  },
  photos: {
    title: 'Photo storage and tagging have separate states',
    version: 'Vroom Tickets · upload and recovery paths',
    caption: 'Photo architecture. Tagging can fail independently of the stored photo; a scheduled job retries eligible records.',
    toggle: 'Tagging fails',
    normal: 'Independent maintenance: reconcile orphaned blobs after a one-hour grace period, scanning up to 500 files per run.',
    failure: 'Every 10 minutes, select up to 20 pending/failed photos with fewer than three attempts. Report health and backlog separately.',
    steps: [
      { title: 'Prepare', actor: 'Web · mobile', detail: 'Generate a thumbnail and re-encode the image to strip EXIF metadata. The web helper allows the original file as a fallback if re-encoding fails.', output: 'Image + thumbnail', code: 'generateThumbnail() / stripExif()' },
      { title: 'Persist', actor: 'Supabase', detail: 'Store image blobs and a corresponding event_photos record. These are separate writes; an interrupted operation can leave a blob without a row.', output: 'Storage paths + photo record', code: 'Storage ↔ event_photos' },
      { title: 'Tag', actor: 'Photo tagger', detail: 'Track tagging state independently. The tagging route records processing and marks the result done or failed.', output: 'pending → processing → done', code: 'tag_status + tag_attempts', failureDetail: 'A tagger error leaves a failed status on the photo. The stored photo and the failed tagging operation remain distinguishable.', failureOutput: 'pending → processing → failed' },
      { title: 'Recover', actor: 'Cron · monitoring', detail: 'Expose tagger health and backlog counts through an admin endpoint. Retry eligible pending/failed records through the scheduled worker.', output: 'Health, backlog, and retry counts', code: '/api/cron/retry-photo-tags', failureDetail: 'The worker selects eligible photos in batches of 20 and increments attempts before requesting tagging again. Stop selecting records at three attempts.', failureOutput: 'Retry, then done or failed' },
    ],
  },
};

export default function VroomFlow({ kind = 'search' }) {
  const flow = flows[kind] || flows.search;
  const [selected, setSelected] = useState(0);
  const [failure, setFailure] = useState(false);
  const id = useId();
  const step = flow.steps[selected];
  return (
    <figure className={styles.figure} aria-labelledby={`${id}-title`}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{flow.version}</span>
          <strong id={`${id}-title`} className={styles.title}>{flow.title}</strong>
        </div>
        <div className={styles.steps} style={{ '--step-count': flow.steps.length }} role="group" aria-label={`${flow.title} stages`}>
          {flow.steps.map((item, index) => (
            <button key={item.title} type="button" className={styles.step}
              aria-pressed={selected === index} aria-controls={`${id}-detail`}
              onClick={() => setSelected(index)}>
              <span className={styles.number}>0{index + 1}</span>
              <strong>{item.title}</strong>
              <span className={styles.actor}>{item.actor}</span>
            </button>
          ))}
        </div>
        <div className={styles.detail} id={`${id}-detail`} aria-live="polite" aria-atomic="true">
          <div>
            <span className={styles.eyebrow}>Step {selected + 1} / {flow.steps.length}</span>
            <strong>{step.title}</strong>
            <p>{failure && step.failureDetail ? step.failureDetail : step.detail}</p>
            <code>{step.code}</code>
          </div>
          <div className={styles.output}>
            <span className={styles.eyebrow}>Output</span>
            <span>{failure && step.failureOutput ? step.failureOutput : step.output}</span>
          </div>
        </div>
        <div className={styles.scenario}>
          <button type="button" aria-pressed={failure} className={styles.toggle} onClick={() => {
            setFailure(!failure);
            setSelected(kind === 'approval' ? 3 : 2);
          }}><span className={styles.indicator} aria-hidden="true" />{flow.toggle}</button>
          <p aria-live="polite">{failure ? flow.failure : flow.normal}</p>
        </div>
        <div className={styles.footnote}>Interactive architecture walkthrough · illustrative states, no live requests</div>
      </div>
      <figcaption>{flow.caption}</figcaption>
    </figure>
  );
}

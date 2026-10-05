import styles from './VroomFlow.module.css';

const flows = {
  search: {
    title: 'Provider search',
    steps: [
      ['Filter', 'Supabase', 'Up to 75 providers matching the event requirements.'],
      ['Embed', 'OpenRouter', 'Turn the atmosphere query into a text-embedding-3-small vector.'],
      ['Rank', 'pgvector', 'Reorder the same providers by similarity.'],
      ['Return', 'Server-sent events', 'Send the updated order to the browser.'],
    ],
    note: 'Results appear before ranking finishes. If ranking fails, the original results stay visible.',
  },
  approval: {
    title: 'Writing an outreach email',
    steps: [
      ['Extract facts', 'Claude Haiku', 'Read the provider description.'],
      ['Plan', 'Claude Sonnet', 'Combine provider, event, and conversation details.'],
      ['Write', 'Claude Sonnet', 'Generate a subject and email body.'],
      ['Check', 'Claude Haiku', 'Check the draft against the requirements.'],
      ['Revise if needed', 'Claude Sonnet', 'Make one revision when the check finds a problem.'],
    ],
    note: 'Manual mode saves a Gmail draft for approval. Automated mode sends through AgentMail. If revision fails, the original draft is kept.',
  },
  photos: {
    title: 'Uploading event photos',
    steps: [
      ['Prepare', 'Web / mobile', 'Create a thumbnail and strip image metadata.'],
      ['Save', 'Supabase', 'Store the image and its database record.'],
      ['Tag', 'Photo tagger', 'Track tagging separately from the upload.'],
      ['Retry', 'Scheduled job', 'Retry pending or failed tags every 10 minutes.'],
    ],
    note: 'A tagging failure does not remove the uploaded photo. Each retry batch handles up to 20 photos, with a limit of three attempts per photo.',
  },
};

export default function VroomFlow({ kind = 'search' }) {
  const flow = flows[kind] || flows.search;
  return <figure className={styles.figure} aria-label={flow.title}>
    <div className={styles.title}>{flow.title}</div>
    <ol className={styles.steps} style={{ '--step-count': flow.steps.length }}>
      {flow.steps.map(([title, actor, description]) => <li key={title} className={styles.step}>
        <strong>{title}</strong>
        <span className={styles.actor}>{actor}</span>
        <span className={styles.description}>{description}</span>
      </li>)}
    </ol>
    <figcaption>{flow.note}</figcaption>
  </figure>;
}

import {
  FiFilter, FiMonitor, FiCpu, FiList, FiCheckCircle,
} from 'react-icons/fi';
import styles from './VroomFlow.module.css';
import VroomDiagrams from './VroomDiagrams';

const flows = {
  search: {
    title: 'Provider search',
    intro: 'From event requirements to a progressively ranked list.',
    steps: [
      [FiFilter, 'Build the candidate pool', 'Supabase · structured filters', 'Apply location, category, capacity, and other event filters. Retrieve up to 75 providers; atmosphere is handled in the next stage.'],
      [FiMonitor, 'Show the first results', 'SSE · skeleton', 'Send the entire pool to the browser immediately. The organizer can see matching providers while semantic ranking runs.'],
      [FiCpu, 'Embed the atmosphere', 'OpenRouter · text-embedding-3-small', 'Turn a phrase such as “an intimate gallery” into a 1,536-dimensional query vector. Provider vectors are already stored.'],
      [FiList, 'Reorder the same providers', 'PostgreSQL · pgvector', 'Compare the query with embeddings for this pool only. Sort by similarity, keeping providers without embeddings at the bottom.'],
      [FiCheckCircle, 'Stream the updated order', 'SSE · reranked → final', 'Replace the visible ordering with the full ranked pool. The final event marks completion; this version adds no further model-ranking step.'],
    ],
    note: 'If embedding or ranking fails, the original pool remains. An empty pool completes without semantic ranking; an empty atmosphere keeps the initial order.',
  },

};

export default function VroomFlow({ kind = 'search' }) {
  if (kind === 'approval' || kind === 'photos') return <VroomDiagrams kind={kind} />;
  const flow = flows.search;
  return <figure className={styles.figure} aria-label={flow.title}>
    <div className={styles.canvas}>
      <div className={styles.title}>{flow.title}</div>
      <p className={styles.intro}>{flow.intro}</p>
      <ol className={styles.steps}>
        {flow.steps.map(([Icon, title, actor, description], index) => <li key={title} className={styles.step}>
          <div className={styles.label}>
            <Icon className={styles.icon} aria-hidden="true" />
            <div><span className={styles.number}>0{index + 1}</span><strong>{title}</strong><span className={styles.actor}>{actor}</span></div>
          </div>
          <span className={styles.description}>{description}</span>
        </li>)}
      </ol>
    </div>
    <figcaption>{flow.note}</figcaption>
  </figure>;
}

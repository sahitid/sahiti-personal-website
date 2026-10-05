import { FiDatabase, FiCheckCircle, FiRefreshCw, FiLayers, FiSend } from 'react-icons/fi';
import styles from './VroomDetails.module.css';
import VroomDiagrams from './VroomDiagrams';

const groups = {
  foundation: [
    [FiLayers, 'One vocabulary', 'Category aliases resolve to the same stored value, so forms, search, and outreach interpret a provider consistently.'],
    [FiSend, 'One entry point', 'Four outreach trigger paths share the outreach.draft event, including proposal acceptance and bulk actions.'],
    [FiRefreshCw, 'Independent retries', 'One Inngest invocation per shortlisted provider lets a failed job retry without restarting the whole shortlist.'],
  ],
  embeddings: [
    [FiDatabase, 'Queue changed records', 'Database changes to descriptions and related fields enqueue providers for embedding outside the search request.'],
    [FiLayers, 'Work in batches', 'An Inngest worker processes 32 providers at a time and stores 1,536-dimensional vectors for reuse.'],
    [FiRefreshCw, 'Keep failures visible', 'Transient API failures use bounded retries with backoff. Repeated failures remain available for inspection.'],
  ],
  messaging: [
    [FiCheckCircle, 'Complete fulfillment', 'Connect the confirmation service to completed Stripe checkout fulfillment and include links back to ticket actions.'],
    [FiSend, 'Defer delivery', 'Run confirmation messaging through the execution helper so a delivery failure does not fail the webhook response.'],
    [FiRefreshCw, 'Recover broadcasts', 'Per-recipient delivery details and a failed-send retry endpoint make partially successful organizer broadcasts actionable.'],
  ],
};

export default function VroomDetails({ kind }) {
  if (['lookup', 'checkin', 'ranking'].includes(kind)) return <VroomDiagrams kind={kind} />;
  const items = groups[kind];
  if (!items) return null;
  return <ul className={styles.details} aria-label={`${kind} implementation details`}>
    {items.map(([Icon, title, description]) => <li key={title}>
      <Icon className={styles.icon} aria-hidden="true" />
      <strong>{title}</strong>
      <p>{description}</p>
    </li>)}
  </ul>;
}

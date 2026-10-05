# Vroom draft research — 2026-09-25

Draft: content/writing/building-at-vroom.md. Hidden from writing index through draft:true, but like existing drafts, accessible directly at /writing/building-at-vroom. Not deployed.

User explicitly confirms ownership of Vroom Tea and agentic search. Dates of work, collaborators, outcomes, individual implementation boundaries need confirmation. On 2026-09-26, the user confirmed they built the venue-search system. Do not invent them.

## Sources examined
- https://projects.lindaxue.com/vtix: banner, workspace, sidebar, lists, tasks, event creation, scanning, attendee app/Wallet, messaging demos. Attribute to Linda and distinguish team platform from personal work.
- https://www.shayaanazeem.com/forus: use structure (overview, specific projects, implementation details, captioned figures, sidebar); prose is original.
- VRM-Corp/vroomtea: apps/vroomtea/src/lib/actions/posts.ts, feed.ts, constants.ts, phone-hash.ts. Verified categories, expiry, location-filtered feeds, decay ranking, post limits, pseudonymous identifiers. Hashing is not a guarantee of anonymity.
- VRM-Corp/vroomsourcing: scraper.py search_venues_by_prompt, server.py /api/chat/search, README.md. Natural language -> OpenAI web search -> website crawl -> structured records -> saved venues/outreach drafts. Do not equate this automatically with user-owned agentic search.
- VRM-Corp/vtix: ticketing and messaging; Sahiti commits include attendee exports, RSVP confirmations, photo workflow, UI loading states. Those may support further sections after user review.
- VRM-Corp/vroom-brain: separate music-industry intelligence system, NOT assumed to be user's search. lib/agent.ts streams Claude tool loop and citation events. Entity/relationship/deal/news tools; lib/tools/vector-search.ts has Voyage + pgvector, but lib/system-prompt.md explicitly says vector search offline in v1. MAX_TOOL_CALLS comment is not a strict per-call cap: actual loop bounds iterations and executes multiple tools in an iteration. Do not claim eight enforced calls or active vector search based only on comments.
- VROOM, vroomtickets, vroomtix checked; no matching workspace search established. vroomtix empty.

## Search attribution confirmed
On 2026-09-26 the user confirmed the venue-search system is their work, resolving the venue-versus-music search question. Read route, orchestration, tools, extraction, persistence and frontend together. Distinguish implemented from planned and demonstrated from deployed. No live model calls, emails, or database mutations performed during research.

## Search trace follow-up
- Sourcing UI (`static/app.js:sendChatMessage`) POSTs only the current prompt to `/api/chat/search`, displays found venues and missing-contact notices, then refreshes pending approvals/stats. This path is a single-request pipeline, not a conversation-history-aware iterative planner.
- `server.py:_do_chat_search` saves only candidates with email addresses, creates campaigns for targets absent from the fetched campaign list (limit 500), seeds thread context, generates outreach through Haiku, and queues drafts for approval. Searching does not itself send these emails.
- `scraper.py:crawl_venue_page` fetches the supplied website page and extracts contact details and descriptive fields. Do not describe this as exhaustive multi-page crawling or verified availability/pricing.
- Brain prompt documents a limited v1 dataset dominated by artists/labels and signing/distribution edges; supported schema types are not proof of populated data. Counts in the prompt are documentation, not live database verification.
- `vtix` main and branch inventory inspected; no matching venue-agent implementation established in that checkout.

Draft updated after user confirmation: first-person venue-search ownership, discovery/extraction/approval workflow, no music-brain attribution. No tenure dates or measured outcomes invented.

## Media explanations — 2026-09-26
Removed repeated Linda archive credits on user request; retained explicit postmortem link. Backend explanations checked against vtix check-in route, checkout route, wallet-update service, messaging/text-agent and ticketing tools; sourcing db.upsert_venue; Tea actions/asks.ts. Task-board generation internals are not established in these repos: description stays at observed product behavior and distinguishes sourcing campaign persistence. Media remains unchanged.

## Contribution and architecture revision — 2026-10-03

Reworked `/projects/vroom` around the subsequent Git-author audit. All 13 existing body media URLs and the header thumbnail are retained. The prior article blended the separate Python sourcing flow with the TypeScript provider-search contribution; the revision describes the traceable `venuemailagent` commits directly.

Evidence checkouts: `/Users/sahitidasari/Documents/Codex/2026-10-03/i-m-writing-resume-bullets-about/work/repos/`.
- `venuemailagent` inspected HEAD: `90381a0e7598d4209f723292069bb53ea6d41585`.
- `vtix` inspected HEAD: `9aed76b234ec304d4eef77c4396beb605fa119ed`.
- Attribution: exact `git log --author="Sahiti" --stat --oneline`; 14 matching sourcing commits and 44 VTIX commits, including merges. Counts are not product outcomes and are not shown as impact metrics.

### Main evidence
- `8fe91b2`: URL lookup, original 22-field provenance schema, form integration. Original model: `openai/gpt-4o-mini` through OpenRouter. Current direct OpenAI/web-search path and 16-field schema are later changes.
- `0a33a84`: SSE search, 75-provider pool, 1536-dimensional embeddings, pgvector RPC, cancellation/stale-event handling, queue, worker, tests. Stage budgets are logging thresholds. Final stage is passthrough. Removed by `1f9c334`; do not claim it is the current production search.
- `d74a93c`, `68da98d`: text filter in rerank retrieval and search diagnostics.
- `c0fd3d4`, `a15aba5`: V2 outreach chain. Haiku for distill/verify, Sonnet for plan/draft/refine. Verify errors keep the draft; refinement errors keep the original. Removed in `695f940`.
- `d627a54`: draft generation, context adapter, Gmail manual-review flow and AgentMail automated path, approval snapshots and notifications.
- VTIX photo changes: `0aa8f86`, `0343d68`, `fa4df98`, `3706be9`, `043a012`, `46bf9bf`, `d2b8d7f`, `ece0c33`, `bbffbf2`, `19a77b1`, `ebfe0b9`, `443755c`, `43bb734`. Read current thumbnail helper, tag retry route, health route, cleanup route, face-cluster migration, report migration. Image re-encoding permits original-file fallback: no unconditional EXIF guarantee. Clustering uses existing embeddings; no model-training attribution.
- `1be9b81`: shared RSVP guests and event widgets; `9227a73`: explicitly UI-only guest-list visibility.
- `08b28f2`: preserve RSVP QR prefix, route to scan_rsvp vs scan_ticket, show guest details. No claim of whole-scanner authorship.
- `9aed76b`: deferred purchase confirmations with Resend/Twilio and action links. No authorship claim for core Stripe, refund, or Wallet implementations.
- `5028f30`, `939e4eb`, `d820414`: MMS payloads/tests, after() lifecycle fix, delivery details/retry.
- `1fd710c`, `e90cb8f`, `6bfc2ca`, `ad7b745`: attendee exports, RSVP inclusion, identity resolution, phone fields.

Tea facts/ownership are retained from the previously confirmed scope and source review above; this revision adds no new Tea ownership assertions. Figures demonstrate the team product and are labeled accordingly. Actual deployment, usage, conversion, latency, and model accuracy remain unknown; implementation constants are not measurements. Personal motivations not recorded in the evidence are not invented.

Writing reference: https://www.kevinjosethomas.com/work/vercel and /work/kscale. Used the problem → implementation → constraints structure, with original prose and no borrowed experience/metrics.

Replaced the old generic search/approval diagrams with source-specific interactive walkthroughs for historical search, historical outreach, and photo recovery. They make no network calls and have explicit failure-state controls. Fixed the legacy writing URL redirect to use getServerSideProps because Next.js rejected its getStaticProps redirect during prerendering.

## Corrected Vroom Events attribution — 2026-10-03

The user explicitly clarified that they helped build the wider event workspace and that their Vroom Events work during the weekend of April 18, 2026 was committed under both `sahitid` and Vikram's account. This corrects the earlier exact-author-only audit. It applies to `venuemailagent`, not VTIX/Vroom Tickets. Do not attribute all Vikram commits outside this weekend or other repositories to Sahiti.

Read GitHub commit API for main, April 17 through early April 20 UTC, and compared local diffs. GitHub maps Sahiti Dasari to `sahitid` and Vik Gupta to `vgupta24`. Late Sunday Pacific commits are early Monday UTC/Eastern; included the pricing redirect fixes with that recorded timezone boundary, not Monday afternoon work. Merge/cherry-picked duplicates are not counted as separate features.

Additional attribution grounded in the user's clarification plus diffs:
- `c21bad4`: four outreach trigger paths consolidated to `fireOutreachDraft`/`fireOutreachDrafts` → `outreach.draft`, one Inngest event per provider; proposal acceptance uses shared trigger.
- `e1b236a`: context/generation/send module split; provider/event/user fetched with Promise.all; prior interactions scoped to accessible event IDs; message queries limited to 50. Commit message described a generation stub; `d627a54` integrates the real generation and approval pipeline. User confirmation supplies personal attribution beyond Git's author field.
- `4e81e94`: normalization helpers, case/category alignment, forms/schema/types/search changes across 27 files. Production migration and row counts described in commit message are not independently verified; not used as outcome metrics.
- `18be390`: common error/status mapping, shared client error extraction, structured logging, dead 5-second ReplyPoller removed, common helpers. Error map uses message fragments, not typed domain errors.
- `e48bae1`: provider search timer and final elapsed duration.
- `6b45ab3`: pricing redesign with shared design-system components.
- `b71844b`, `ccc2a11`, `3166eb7` (duplicates also on history): pricing/onboarding redirect fixes, Sunday night Pacific.
- `4b6b587`: excludes max_budget from event context given to generation.

Page order changed to Vroom Events (workspace first, then search and outreach), Vroom Tickets, Vroom Tea. All 13 body media URLs retained; captions renumbered. Task-board media retained without claiming authorship of its generation engine. No private GitHub links reintroduced on the public page.

## Narrative rewrite and media layout — 2026-10-03

User requested the problem/architecture/contribution structure of Kevin Thomas's Prime Agent writeup. Rewrote the article as connected technical prose, keeping factual claims within the previous audit. Consolidated historical scope and unknown outcomes into three GFM footnotes with backlinks. Footer project links render after those notes through WritingPost children and a page-specific CSS module.

On explicit follow-up, removed only the Rough Draft 02 postcard. The other 12 body media embeds and all three interactive diagrams remain. Moved the ticketing hero directly before the Vroom Tickets heading and renumbered captions. Preserved Events → Tickets → Tea order, omitted the previously removed date phrase/version-note paragraph, and did not restore inaccessible GitHub links.

Validation: production build passed; media URL comparison confirms only the requested Rough Draft image was removed; rendered browser shows 12 media items, three footnote references with backlinks, and the Vroom Tea / Media archive / Postmortem footer links. Inspected footer styling against the supplied example.

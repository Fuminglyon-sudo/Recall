// Practice documents for Doc Lab.
//
// Each one is written to read like a real circulated memo — plausible, and
// persuasive on a fast read — while carrying genuine structural weaknesses:
// unstated assumptions, missing stakeholders, unmeasurable success criteria,
// evidence that does not support the claim it is attached to, costs that are
// mentioned once and never carried through, and alternatives that were never
// considered. The flaws are deliberately NOT listed here: the grader finds
// them from the text alone, exactly as it does for a document the user pastes
// in themselves, so practice and real use behave identically.

export const DOC_TOPICS = ["workplace", "economics", "politics", "social", "tech", "health"] as const;

export type DocTopic = (typeof DOC_TOPICS)[number];

export type SampleDoc = {
  id: string;
  topic: DocTopic;
  emoji: string;
  title: string;
  blurb: string;
  body: string;
};

export const TOPIC_LABELS: Record<DocTopic, string> = {
  workplace: "Workplace",
  economics: "Economics",
  politics: "Politics",
  social: "Social",
  tech: "Tech",
  health: "Health",
};

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "four-day-week",
    topic: "economics",
    emoji: "🗓️",
    title: "Proposal: Move the company to a four-day week",
    blurb: "A People team proposal citing a well-known pilot study.",
    body: `PROPOSAL: FOUR-DAY WORKING WEEK
From: People Operations
Status: For decision at the next leadership meeting

Summary
We propose moving all staff to a four-day week (32 hours) at full pay, beginning next quarter. The Icelandic public sector trials found that productivity remained the same or improved across the large majority of workplaces studied, and staff wellbeing improved substantially. We expect similar results.

Rationale
Our last engagement survey showed burnout as the top-cited concern, mentioned by 41% of respondents. Competitors in our sector have begun advertising four-day weeks in job listings, and we have lost three candidates in the past year who cited flexibility as a factor. Moving now positions us as a leader rather than a follower.

Implementation
All staff move to Monday–Thursday. Friday becomes a company-wide non-working day, which keeps the policy simple and avoids the coordination problems of staggered days off. Managers will be asked to identify any work that cannot be compressed into four days and report back within the first month.

Cost
There is no direct salary cost, as pay is unchanged. We anticipate some reduction in output in the transition period, offset by improved retention.

Success criteria
We will consider the pilot a success if staff report improved wellbeing and productivity does not meaningfully decline. We will review after six months.

Recommendation
We recommend approving the move for all departments simultaneously. A partial rollout would create a two-tier culture and generate resentment between teams.`,
  },
  {
    id: "congestion-charge",
    topic: "politics",
    emoji: "🚗",
    title: "City Council memo: Downtown congestion charge",
    blurb: "A municipal policy memo proposing a driving levy.",
    body: `MEMORANDUM
To: City Council, Transport Committee
Subject: Introduction of a downtown congestion charge

Recommendation
That the Council introduce a £12 daily charge for private vehicles entering the downtown core between 07:00 and 19:00, commencing next April.

Background
Downtown traffic volumes have risen 18% over five years. Average journey times across the core have increased and air quality monitoring at three sites shows particulate levels above recommended limits. London's congestion charge reduced traffic in the charging zone significantly after introduction, and we expect a comparable effect here.

Revenue and use of funds
At projected volumes the scheme would raise approximately £14m annually. Net revenue will be reinvested in public transport, improving the bus network and making the scheme self-reinforcing over time.

Delivery
Enforcement will use automatic number plate recognition at 22 entry points. The technology is proven and is already used for our bus lane enforcement. Signage and a public information campaign will run for eight weeks before launch.

Equity
Residents living inside the zone will receive a 90% discount. Blue badge holders will be exempt.

Consultation
A public consultation ran for six weeks and received 2,400 responses, of which 61% supported the introduction of a charge.

Conclusion
The scheme addresses congestion and air quality simultaneously while generating revenue for public transport. We recommend proceeding to the statutory consultation stage.`,
  },
  {
    id: "mentorship-expansion",
    topic: "social",
    emoji: "🤝",
    title: "Programme proposal: Expanding youth mentorship citywide",
    blurb: "A non-profit scaling a pilot that showed strong results.",
    body: `PROGRAMME EXPANSION PROPOSAL
Youth Futures — Mentorship Programme
Prepared for: Board of Trustees

The case for expansion
Our pilot mentorship programme in the Eastside district has been a clear success. Of the 60 young people who completed the twelve-month programme, 78% went on to further education or employment, compared with a district average of 54%. Mentees consistently reported feeling more confident about their futures.

We propose expanding from one district to all nine districts over the next eighteen months, growing from 60 to roughly 540 young people annually.

Why now
Our funder has indicated appetite for a larger grant, and the current political attention on youth opportunity makes this a favourable moment. Delay risks losing both the funding window and momentum from the pilot's success.

Delivery model
The model is straightforward and replicates well: recruit volunteer mentors, match them to referred young people, and support the relationship with monthly check-ins from a programme coordinator. Each district will need one coordinator. We will recruit mentors through the same channels that worked in Eastside — local employers and university alumni networks.

Budget
The main cost is nine coordinator posts. At £34,000 each, this is £306,000 annually, which falls within the indicated grant envelope.

Measurement
We will track the same headline measure: the proportion of completers entering education or employment. We will report annually to the board.

Ask
We ask the Board to approve the expansion in principle so that we can submit the funding application before the deadline in six weeks.`,
  },
  {
    id: "premium-tier",
    topic: "workplace",
    emoji: "📈",
    title: "Product plan: Launching a premium subscription tier",
    blurb: "A PRD proposing paid tiers for a free product.",
    body: `PRODUCT REQUIREMENTS: PREMIUM TIER
Owner: Product
Target launch: End of quarter

Problem
We currently monetise nothing. Our 40,000 registered users cost us roughly $18,000 a month in infrastructure and model costs, and that number grows with usage. We need revenue.

Proposal
Introduce a Premium tier at $12/month. Free users keep core functionality with usage caps; Premium removes the caps and adds priority processing and an export feature.

Why $12
Comparable tools in the productivity category sit between $8 and $20 per month. $12 positions us mid-market — credible without being a barrier.

Expected outcome
If 5% of our registered users convert, that is 2,000 subscribers, or $24,000 monthly recurring revenue. This covers infrastructure with margin to reinvest in growth.

Scope
In scope: billing integration, tier gating, upgrade flow, and the export feature.
Out of scope: annual billing, team plans, and regional pricing. These can follow later.

Risks
The main risk is user backlash from introducing caps on functionality that is currently unlimited. We will mitigate this by setting the caps generously so that the majority of existing users are unaffected.

Timeline
Six weeks: two for billing integration, two for gating and the upgrade flow, two for the export feature and testing.

Decision needed
Approval to proceed with the $12 price point and the scope above.`,
  },
  {
    id: "microservices",
    topic: "tech",
    emoji: "⚙️",
    title: "Engineering proposal: Break the monolith into services",
    blurb: "An architecture proposal to solve deploy-speed problems.",
    body: `ENGINEERING PROPOSAL: SERVICE EXTRACTION
Author: Platform team

Context
Our deployment pipeline now takes 47 minutes end to end, and a failure in any test suite blocks all teams. Engineers report that shipping a one-line change can take half a day. This is our single most-cited productivity complaint.

Proposal
Extract the monolith into six services aligned to our domain boundaries: accounts, billing, content, notifications, search, and reporting. Each service gets its own repository, pipeline, and on-call rotation. Teams can then deploy independently.

Precedent
This is the standard path for companies at our stage. Amazon, Netflix, and Uber all moved from monoliths to services and cite significant gains in deployment velocity.

Approach
We will extract services one at a time, beginning with notifications, as it has the fewest dependencies. Each extraction is estimated at four to six weeks. The full programme is therefore approximately eight months.

Benefits
- Independent deploys; a failing test in one domain no longer blocks others
- Clearer ownership boundaries
- Services can be scaled independently based on load

Cost
Eight months of platform team capacity. We will need to stand up service templates, shared observability, and a service mesh.

Recommendation
Approve the programme and begin with the notifications extraction next sprint.`,
  },
  {
    id: "wellness-rollout",
    topic: "health",
    emoji: "🧘",
    title: "HR proposal: Company-wide wellness programme",
    blurb: "A wellbeing initiative responding to rising sick leave.",
    body: `WELLNESS PROGRAMME — PROPOSAL
From: HR Business Partner team

Background
Sick leave has risen 23% year on year. Exit interviews increasingly mention stress. We propose a company-wide wellness programme to address this.

Programme components
1. A subsidised gym membership for all employees (company covers 60%)
2. An app-based meditation subscription for all staff
3. Quarterly wellbeing workshops delivered by an external provider
4. A dedicated wellbeing channel and monthly newsletter

Evidence
Organisations with structured wellness programmes report lower absenteeism. A widely cited industry figure suggests a return of roughly $3 for every $1 invested in workplace wellness.

Cost
Gym subsidy: £180 per employee annually
Meditation app: £60 per employee annually
Workshops: £24,000 annually
For 400 employees this is approximately £120,000 per year.

Measurement
We will measure success through the annual engagement survey wellbeing score and by tracking sick leave days over the following year.

Rollout
Launch to all staff at once, supported by an all-hands announcement and manager briefing pack. A phased rollout would create confusion about who is eligible.

Recommendation
Approve the programme for the coming financial year.`,
  },
  {
    id: "continuous-feedback",
    topic: "workplace",
    emoji: "🔄",
    title: "People strategy: Retiring annual reviews for continuous feedback",
    blurb: "A denser HR paper — the flaw sits underneath a real-sounding stat.",
    body: `PEOPLE STRATEGY PAPER
Retiring the Annual Performance Review
Prepared for: Executive Team

Summary
We propose retiring the annual performance review cycle in favour of continuous, manager-led feedback delivered through a new internal tool ("Pulse"), beginning next fiscal year. This brings us in line with the direction the majority of high-performing organisations have already taken.

The case against annual reviews
Annual reviews are widely regarded as a poor mechanism for improving performance. A frequently cited industry analysis found that companies which moved from annual to continuous feedback saw a 15% improvement in a composite "employee effectiveness" index within eighteen months. Given our own engagement scores have been flat for three consecutive cycles, we believe the current model is a contributing factor.

What continuous feedback looks like here
Managers will hold a structured quarter-hour check-in with each report every two weeks, logged in Pulse. Pulse surfaces a running summary that replaces the single annual write-up. Compensation and promotion decisions will draw on the accumulated Pulse record rather than a single end-of-year rating.

Why now
Our current HRIS contract renews in five months, and bundling Pulse into the renewal negotiation gives us leverage on price. Waiting a further cycle means either paying for a tool we are not using or missing the negotiation window entirely.

Cost
Pulse licensing: $22 per employee per month. For 1,100 employees, this is approximately $290,000 annually. This is offset by retiring our current standalone review software, which costs $95,000 annually, for a net increase of roughly $195,000.

Success criteria
We will consider this a success if manager-report check-in completion exceeds 85% and if next year's engagement survey shows an improvement in the "I receive feedback that helps me grow" item.

Recommendation
We recommend approving the transition and beginning manager training two months ahead of the HRIS renewal date.`,
  },
  {
    id: "land-value-tax",
    topic: "economics",
    emoji: "🏛️",
    title: "Policy memo: Replacing commercial property tax with a land value tax",
    blurb: "A fiscal-policy memo — the hardest part of the reform is left unaddressed.",
    body: `FISCAL POLICY MEMO
Subject: Transitioning commercial property tax to a land value tax (LVT)
Prepared for: Finance Committee

Recommendation
That the city transition commercial property taxation from the current improvement-inclusive model to a pure land value tax over a three-year phase-in, beginning next fiscal year.

The economic case
Standard property tax discourages investment: a business that improves its building sees its tax bill rise, while a business that leaves a downtown lot as surface parking pays less. A land value tax removes this disincentive entirely, since the tax is based only on the land's value, not what sits on it. A well-known case study of this reform in a mid-sized US city found a measurable increase in downtown building density within a decade of adoption, which we would expect to replicate here given similar zoning constraints.

Revenue design
The reform is intended to be revenue-neutral in year one: land value tax rates will be calibrated so total citywide commercial tax revenue matches current collections, then held flat in nominal terms as the phase-in proceeds. This protects the budget while the new system beds in.

Implementation
The city assessor's office will produce separate land and improvement valuations for all 6,400 commercial parcels ahead of the first transition year, using the existing mass-appraisal methodology extended to isolate land value.

Business impact
Owners of underdeveloped high-value land (surface lots, vacant storefronts) will see the largest increases; owners of well-improved buildings on that same land will see reductions. We expect this redistribution to be broadly popular, since more businesses will see a cut than an increase.

Timeline
Year 1: assessment build-out and public communication. Years 2-3: phased rate transition. Year 4: full LVT in effect.

Recommendation
We recommend approving the three-year transition and directing the assessor's office to begin the land/improvement valuation build-out immediately.`,
  },
  {
    id: "ranked-choice-voting",
    topic: "politics",
    emoji: "🗳️",
    title: "Council memo: Adopting ranked-choice voting for municipal elections",
    blurb: "An electoral-reform memo built almost entirely on one borrowed result.",
    body: `MEMORANDUM
To: City Council, Elections Committee
Subject: Adoption of ranked-choice voting (RCV) for municipal elections

Recommendation
That the Council adopt ranked-choice voting for all municipal elections beginning with the next election cycle, replacing the current plurality system.

Background
Under our current system, council seats have twice in the past decade been won with under 35% of the vote in crowded fields, which critics argue does not reflect majority preference. RCV allows voters to rank candidates and eliminates lower-finishing candidates in rounds until one candidate holds a majority of remaining votes.

Evidence
A peer city of comparable size adopted RCV eight years ago. Voter turnout in that city's next municipal election rose four points against the prior cycle, and post-election surveys found 71% of voters found the ballot "easy or very easy" to complete. We would expect a similar reception here given the similarity in electorate size and existing voting infrastructure.

Administration
Ballots will be counted using our existing tabulation vendor, which offers an RCV counting module already certified in fourteen states. A single public information campaign ahead of the first RCV election will cover the change in ballot format.

Cost
The vendor's RCV module carries a one-time licensing cost of $180,000 and no ongoing increase to per-election costs. The public information campaign is budgeted at $65,000.

Equity considerations
RCV is designed to give voters more voice, not less, since no vote is wasted on a candidate who cannot win. We do not anticipate the change creating new barriers to participation.

Success criteria
We will consider adoption successful if the first RCV election proceeds without a significant rise in ballot errors and if voter turnout does not decline relative to the prior cycle.

Recommendation
We recommend approving adoption and directing the elections office to begin vendor onboarding and the public information campaign six months ahead of the first RCV election.`,
  },
  {
    id: "parent-support-line",
    topic: "social",
    emoji: "📞",
    title: "Proposal: Peer-support hotline for new parents",
    blurb: "A compassionate pilot with a scaling problem hiding inside the good results.",
    body: `PROGRAMME PROPOSAL
Peer Support Line for New Parents
Prepared for: Board of Directors

The case for the programme
New parents in our county report high rates of isolation in the first postpartum year, and existing clinical mental-health services have an eleven-week average wait. We propose a peer-support hotline staffed by trained volunteer parents, offering same-day phone or text support to any new parent who calls.

Pilot results
Our six-month pilot, staffed by twelve trained volunteers, handled 340 calls. Post-call surveys showed 92% of callers rated the interaction as helpful, and volunteers themselves reported high satisfaction with the role. Callers frequently described the line as "a lifeline" in open-text feedback.

Proposed expansion
We propose scaling the line countywide over the next year, moving from twelve volunteers to an estimated eighty, sufficient to cover extended hours and an anticipated call volume of roughly 2,400 calls annually based on population ratios from the pilot area.

Training and screening
Volunteers complete a 20-hour training curriculum covering active listening, common postpartum challenges, and when to refer a caller to clinical services. Training will be delivered by the two staff members who developed and ran the pilot's training.

Budget
Volunteer recruitment and training materials: $40,000. Staff coordinator (one FTE) to manage the volunteer roster and referral pipeline: $58,000. Phone system and text platform licensing: $12,000. Total: $110,000 for the expansion year, covered by our existing family-services grant.

Measurement
Success will be measured by caller satisfaction ratings and total calls handled, tracked monthly by the coordinator.

Recommendation
We recommend approving countywide expansion on the timeline above, beginning volunteer recruitment immediately.`,
  },
  {
    id: "streaming-migration",
    topic: "tech",
    emoji: "🌊",
    title: "Platform proposal: Moving the data warehouse to real-time streaming",
    blurb: "An infrastructure pitch that reads like it was written by someone very sure of themselves.",
    body: `PLATFORM ENGINEERING PROPOSAL
Migrating from Nightly Batch to Real-Time Streaming
Author: Data Platform team

Context
Our analytics and reporting currently run on nightly batch ETL, meaning dashboards reflect yesterday's data. Product and sales teams have repeatedly asked for same-day visibility into key metrics, and two customer-facing features currently blocked on the roadmap require sub-hour data freshness.

Proposal
Replace the nightly batch pipeline with a real-time streaming architecture built on a managed event-streaming platform, with a stream-processing layer computing rolling aggregates directly into the warehouse. This is the standard architecture used by companies operating at the scale we are heading toward, and adopting it now avoids a more disruptive migration later.

Approach
We will stand up the streaming platform, migrate our eleven highest-value data pipelines first (covering roughly 80% of dashboard traffic), and run batch and streaming in parallel for one release cycle before decommissioning the legacy pipelines.

Team readiness
The platform team has strong distributed-systems fundamentals from our existing services work, and the managed platform's documentation is thorough. We are confident the team can ramp on stream processing concepts during the build phase.

Benefits
- Same-day, and eventually sub-hour, data freshness across dashboards
- Unblocks the two roadmap features waiting on fresh data
- Positions us on infrastructure that scales with our growth trajectory

Cost
Managed streaming platform licensing: approximately $14,000 monthly at current data volumes. Engineering effort: estimated at one quarter for the initial eleven-pipeline migration.

Success criteria
We will consider the migration successful when the eleven priority pipelines are running on streaming infrastructure with dashboard data lag under one hour.

Recommendation
Approve the migration and begin platform evaluation and procurement immediately so the build can start next sprint.`,
  },
  {
    id: "same-day-scheduling",
    topic: "health",
    emoji: "🩺",
    title: "Clinical operations: Same-day scheduling clinic-wide",
    blurb: "An access-improvement proposal built on one specialty's pilot.",
    body: `CLINICAL OPERATIONS PROPOSAL
Clinic-Wide Same-Day Appointment Scheduling
Prepared for: Medical Director and Operations Committee

Background
Patients currently wait an average of eighteen days for a non-urgent appointment across our clinics. Same-day scheduling — holding a portion of each day's slots open rather than booking weeks in advance — is a recognised approach to reducing wait times and no-show rates.

Pilot results
Our family medicine department piloted same-day scheduling for four months, holding 40% of each provider's daily slots open until that morning. Wait times for non-urgent visits in that department fell from nineteen days to same-day or next-day in the large majority of cases, and the no-show rate fell from 14% to 6%.

Proposed rollout
Given these results, we propose extending same-day scheduling to all clinical departments — including cardiology, endocrinology, and behavioural health — over the next two quarters, using the same 40% open-slot ratio that worked in family medicine.

Why now
Patient satisfaction scores around access have been our lowest-rated domain for two consecutive years, and same-day scheduling directly targets the most common complaint in patient feedback: difficulty getting an appointment.

Implementation
Scheduling staff will be retrained on the new booking rules department by department, starting with the two departments with the longest current wait times. No change to provider staffing levels is planned for the initial rollout.

Cost
The primary cost is scheduling-staff retraining time, estimated at 80 hours total across all departments, plus updated patient communication materials explaining the new booking process. No new hires are budgeted.

Measurement
We will track average wait time and no-show rate by department, reported monthly, against the family medicine pilot as a benchmark.

Recommendation
We recommend approving the clinic-wide rollout on the timeline above, beginning with cardiology and behavioural health.`,
  },
];

export function getSampleDoc(id: string): SampleDoc | undefined {
  return SAMPLE_DOCS.find((d) => d.id === id);
}

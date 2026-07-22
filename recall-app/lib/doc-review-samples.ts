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
];

export function getSampleDoc(id: string): SampleDoc | undefined {
  return SAMPLE_DOCS.find((d) => d.id === id);
}

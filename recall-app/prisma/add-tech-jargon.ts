import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WORDS = [
  {
    front: "p50",
    back: "The 50th percentile response time — the median. Half of all requests complete faster than this.",
    partOfSpeech: "noun",
    example: "Our p50 is 45ms, which looks fine — but check the p99 before celebrating.",
    hook: "p50 = the middle. Flip a coin — half faster, half slower.",
    synonyms: "median latency, median response time",
  },
  {
    front: "p90",
    back: "The 90th percentile response time. 9 out of 10 requests complete faster than this value.",
    partOfSpeech: "noun",
    example: "p90 is 200ms — most users are fine, but 1 in 10 is already feeling it.",
    hook: "p90 = only 10% of requests are slower. The first warning sign.",
    synonyms: "90th percentile, tail latency",
  },
  {
    front: "p95",
    back: "The 95th percentile response time. 95% of requests complete faster than this. A common SLA threshold.",
    partOfSpeech: "noun",
    example: "We guarantee p95 under 500ms in our SLA — anything above that triggers a breach.",
    hook: "p95 = 1 in 20 requests is slower. Where most SLA conversations start.",
    synonyms: "95th percentile",
  },
  {
    front: "p99",
    back: "The 99th percentile response time. 99% of requests complete faster. Exposes tail latency affecting your worst-off 1%.",
    partOfSpeech: "noun",
    example: "p99 spiked to 4 seconds during the deploy — someone's experience was terrible.",
    hook: "p99 = 1 in 100 suffers. If you have 1M users, that's 10,000 unhappy people.",
    synonyms: "99th percentile, tail latency",
  },
  {
    front: "p99.9",
    back: "The 99.9th percentile — only 1 in 1,000 requests is slower. Called 'three nines'. Used in high-reliability systems.",
    partOfSpeech: "noun",
    example: "Our payment gateway SLO targets p99.9 under 1 second.",
    hook: "Three nines — 999 out of 1,000 requests are fine. The other one is your canary.",
    synonyms: "three nines, p999",
  },
  {
    front: "p100",
    back: "The 100th percentile — the absolute worst-case request. The single slowest response ever recorded.",
    partOfSpeech: "noun",
    example: "Ignore p100 in your SLA — one fluke request skews everything. Focus on p99.9 instead.",
    hook: "p100 = the one unlucky request out of all of them. Useful to know, dangerous to optimise for.",
    synonyms: "max latency, worst case",
  },
  {
    front: "CDN",
    back: "Content Delivery Network. A globally distributed network of servers that caches and serves content from locations closer to the user.",
    partOfSpeech: "noun",
    example: "After putting our images behind a CDN, load times in Asia dropped from 3s to 400ms.",
    hook: "CDN = copies of your content placed near every user, so data travels less distance.",
    synonyms: "content delivery network, edge network, edge caching",
  },
  {
    front: "TTL",
    back: "Time to Live. How long a cached value, DNS record, or network packet is considered valid before it expires and must be refreshed.",
    partOfSpeech: "noun",
    example: "Set the TTL on your DNS to 300 seconds before a migration so changes propagate quickly.",
    hook: "TTL = an expiry date stamped on cached data. After it expires, go fetch fresh.",
    synonyms: "time to live, cache expiry, cache duration",
  },
  {
    front: "latency",
    back: "The time delay between a request being sent and a response being received. Usually measured in milliseconds.",
    partOfSpeech: "noun",
    example: "High latency makes the app feel sluggish even when throughput is fine.",
    hook: "Latency = how long you wait. Throughput = how much you get. Both matter, they're different.",
    synonyms: "response time, delay, round-trip time, RTT",
  },
  {
    front: "throughput",
    back: "The volume of work a system processes per unit of time — requests per second, transactions per minute, bytes per second.",
    partOfSpeech: "noun",
    example: "We handle 50,000 requests per second at peak — that's our throughput ceiling.",
    hook: "Throughput = how wide the pipe is. Latency = how fast one drop travels through it.",
    synonyms: "requests per second, RPS, TPS, bandwidth",
  },
  {
    front: "SLA",
    back: "Service Level Agreement. A formal contract between a provider and customer defining the guaranteed performance level — uptime, latency, support response times.",
    partOfSpeech: "noun",
    example: "We breached the SLA last month — three incidents pushed availability below 99.9%.",
    hook: "SLA = the promise you make to customers, in writing, with consequences for breaking it.",
    synonyms: "service level agreement",
  },
  {
    front: "SLO",
    back: "Service Level Objective. The internal performance target a team sets for itself — usually stricter than the SLA to give a buffer before a breach.",
    partOfSpeech: "noun",
    example: "Our SLA promises 99.9% uptime, so our SLO is 99.95% to give us a safety margin.",
    hook: "SLO is your internal goal. SLA is the customer-facing promise. SLO should be tighter.",
    synonyms: "service level objective",
  },
  {
    front: "SLI",
    back: "Service Level Indicator. The actual metric you measure to determine whether you're meeting your SLO — e.g. request success rate, p99 latency.",
    partOfSpeech: "noun",
    example: "Our SLI is the percentage of requests completing in under 200ms over a rolling 7 days.",
    hook: "SLI = what you measure. SLO = what you aim for. SLA = what you promise. SLI → SLO → SLA.",
    synonyms: "service level indicator",
  },
  {
    front: "rate limiting",
    back: "Controlling how many requests a user or system can make in a given time window — to prevent abuse, protect infrastructure, and ensure fair usage.",
    partOfSpeech: "noun",
    example: "We rate limit free-tier users to 100 API calls per minute.",
    hook: "Rate limiting = a bouncer at the door who only lets in N people per minute.",
    synonyms: "throttling, request throttling",
  },
  {
    front: "load balancer",
    back: "A system that distributes incoming network traffic across multiple servers to prevent any single server from being overwhelmed.",
    partOfSpeech: "noun",
    example: "When traffic spiked, the load balancer spread it across six instances and none of them went down.",
    hook: "Load balancer = traffic cop directing cars across multiple lanes so none gets gridlocked.",
    synonyms: "LB, reverse proxy (partial), traffic distribution",
  },
  {
    front: "cache hit",
    back: "When a requested piece of data is found in the cache, returning it immediately without fetching from the slower original source.",
    partOfSpeech: "noun",
    example: "Our cache hit rate is 92% — most users never reach the database.",
    hook: "Cache hit = the answer was already waiting for you. Fast and cheap.",
    synonyms: "cache hit rate",
  },
  {
    front: "cache miss",
    back: "When the requested data is not in the cache, so the system must fetch it from the slower original source — database, API, or disk.",
    partOfSpeech: "noun",
    example: "A cold deploy causes a cache miss storm as every request hits the database at once.",
    hook: "Cache miss = you went to grab it and the shelf was empty. Had to go to the warehouse.",
    synonyms: "cold cache, cache cold start",
  },
  {
    front: "uptime",
    back: "The percentage of time a system is operational and available to users. Usually expressed as nines: 99.9% = ~8.7h downtime/year.",
    partOfSpeech: "noun",
    example: "We achieved 99.95% uptime last quarter — that's under 4.5 hours of downtime.",
    hook: "99% uptime sounds great until you realise it means 3.65 days of downtime per year.",
    synonyms: "availability, reliability",
  },
  {
    front: "MTTR",
    back: "Mean Time to Recover (or Repair). The average time it takes to restore a system to normal operation after a failure.",
    partOfSpeech: "noun",
    example: "Our MTTR dropped from 45 minutes to 8 minutes after we built automated rollbacks.",
    hook: "MTTR = how quickly you can recover when things break. Lower is better. Build for recovery.",
    synonyms: "mean time to recover, mean time to repair, mean time to restore",
  },
  {
    front: "idempotent",
    back: "An operation that produces the same result no matter how many times it is repeated. Critical for safe retries in distributed systems.",
    partOfSpeech: "adjective",
    example: "Make your payment endpoint idempotent — if a retry fires twice, the customer should only be charged once.",
    hook: "Idempotent = pressing a lift button ten times doesn't summon ten lifts. Once is enough.",
    synonyms: "safe to retry, retry-safe",
  },
];

async function main() {
  const deck = await prisma.deck.findFirstOrThrow({ where: { name: "Corporate Jargon" } });

  let added = 0;
  let skipped = 0;

  for (const word of WORDS) {
    const existing = await prisma.card.findFirst({ where: { deckId: deck.id, front: word.front } });
    if (existing) { skipped++; continue; }

    await prisma.card.create({
      data: { ...word, deckId: deck.id, dueAt: new Date() },
    });
    added++;
  }

  console.log(`✓ Corporate Jargon deck: ${added} added, ${skipped} already existed`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "how-spaced-repetition-works",
    title: "How Spaced Repetition Actually Works (And Why Timing Is Everything)",
    description:
      "Most people review things too early or too late. Spaced repetition finds the optimal window — and the science behind it changes how you should think about learning anything.",
    date: "2025-06-12",
    readTime: "5 min read",
    category: "Learning Science",
    excerpt:
      "Most people review things too early or too late. Spaced repetition finds the optimal window — and the science behind it changes how you should think about learning anything.",
    content: [
      {
        type: "p",
        text: "The problem most people have isn't that they don't study — it's that they study at the wrong time. Review something the moment after you've learned it and you're doing almost no work. The memory is fresh; you haven't forgotten anything yet. Review it ten years later and you've forgotten so much that starting over is nearly as much effort as learning it the first time.",
      },
      {
        type: "h2",
        text: "The Spacing Effect",
      },
      {
        type: "p",
        text: "Hermann Ebbinghaus, a 19th-century psychologist, discovered something counterintuitive about memory: the optimal moment to review something is just before you're about to forget it. Study it too early and the review is wasted. Study it too late and the memory has already decayed.",
      },
      {
        type: "p",
        text: "This is the spacing effect, and it's one of the most replicated findings in cognitive science. Distributed practice — spreading reviews out over time — consistently outperforms massed practice (cramming) for long-term retention. The difference isn't small. Studies put the advantage at two to three times better recall after a month.",
      },
      {
        type: "h2",
        text: "How the SM-2 Algorithm Works",
      },
      {
        type: "p",
        text: "The SM-2 algorithm, developed by Piotr Woźniak in the late 1980s, operationalises the spacing effect. Each card in a spaced repetition system has two key properties: an interval (how many days until the next review) and an ease factor (how easy the card is for you specifically).",
      },
      {
        type: "p",
        text: "When you review a card and grade your recall, the algorithm adjusts both values. A card you found easy gets a longer interval — maybe 10 days, then 25, then 60. A card you struggled with gets a shorter interval until it stabilises. Over time, the algorithm builds a personalised review schedule calibrated to your specific memory.",
      },
      {
        type: "p",
        text: "The result is efficient: you're not reviewing easy cards too often, and you're not forgetting hard cards because you reviewed them too late.",
      },
      {
        type: "h2",
        text: "Why Timing Matters More Than You Think",
      },
      {
        type: "p",
        text: "When a memory is strong, reviewing it doesn't do much. The neurological work happens when you have to effortfully retrieve something — when you feel the friction of almost-but-not-quite remembering. That's the consolidation moment. Spaced repetition is engineered to put you in that state repeatedly, across months and years.",
      },
      {
        type: "p",
        text: "This is why passive review — rereading, highlighting, watching the same video again — produces far less durable memory than active retrieval under a spaced schedule. Recognition feels like learning. Effortful recall actually is.",
      },
      {
        type: "h2",
        text: "What This Means in Practice",
      },
      {
        type: "p",
        text: "Most vocabulary apps and flashcard tools ask you to review everything, all at once, whenever you feel like it. That's the wrong model. What works is: review each item at its optimal interval, grade your recall honestly, and trust the system to schedule the next session.",
      },
      {
        type: "p",
        text: "Soro Soke is built around this. Every card has its own timeline. The app surfaces what's due today — not what you feel like reviewing, not the entire deck. Just what your memory needs, right now. That's not magic. It's mathematics applied to how your brain actually works.",
      },
    ],
  },
  {
    slug: "why-you-go-blank-in-conversations",
    title: "Why You Go Blank in Important Conversations — And How to Fix It",
    description:
      "You had the answer. The words were right there. Then someone was watching and they were gone. This isn't a confidence problem — it's a retrieval problem, and there's a specific way to address it.",
    date: "2025-06-19",
    readTime: "6 min read",
    category: "Communication",
    excerpt:
      "You had the answer. The words were right there. Then someone was watching and they were gone. This isn't a confidence problem — it's a retrieval problem, and there's a specific way to address it.",
    content: [
      {
        type: "p",
        text: "You know the feeling. The question lands. The answer is right there — you can almost feel it — and then it's gone. You say something vague, or nothing at all, and the moment passes. Walking home, you find the sentence you should have said.",
      },
      {
        type: "p",
        text: "Most people frame this as a confidence problem. It isn't. It's a retrieval problem. And there's a specific way to fix it.",
      },
      {
        type: "h2",
        text: "Why Pressure Affects Recall",
      },
      {
        type: "p",
        text: "When you're under social pressure — an interview, a pitch, a conversation with someone you want to impress — your brain's threat-detection system activates. Cortisol and adrenaline narrow your attention. Resources that would normally support open-ended thinking get redirected toward monitoring the situation.",
      },
      {
        type: "p",
        text: "This is a feature, not a bug. In an actual emergency, tunnel vision is useful. In a conversation, it works against you. The result is retrieval failure. The knowledge is there, encoded in memory. But the retrieval pathway — the one that runs from 'I want to say something about X' to the actual words — is narrowed by stress.",
      },
      {
        type: "h2",
        text: "Why Practice Helps (But Only the Right Kind)",
      },
      {
        type: "p",
        text: "You can't make yourself less nervous by willing it. What you can do is reduce the cognitive load of the moment so that retrieval still works even when attention is impaired.",
      },
      {
        type: "p",
        text: "That's what deliberate practice does. When you've rehearsed a response to a scenario enough times — not memorised a script, but practiced the shape of an answer — retrieving it under pressure costs less cognitive resources. It's already close to the surface.",
      },
      {
        type: "p",
        text: "The key distinction is between practice that happens in conditions that match the actual situation and practice that doesn't. Rehearsing in your head is fine. Rehearsing out loud, with realistic scenarios, with some kind of feedback, is better by a significant margin.",
      },
      {
        type: "h2",
        text: "What Real Practice Looks Like",
      },
      {
        type: "p",
        text: "Effective preparation for high-stakes conversations has three components: realistic scenarios, honest assessment, and repetition over time.",
      },
      {
        type: "ul",
        items: [
          "Realistic scenarios — because context matters. Your brain encodes memories in context. A retrieval cue (a job interview question, an awkward silence at a networking event) is more likely to activate the right memory if the two were encoded in similar conditions.",
          "Honest assessment — because you can't fix what you don't know is wrong. Feeling like you did fine doesn't mean you did fine. You need someone — or something — to tell you where you hedged, where you lost clarity, where the logic broke down.",
          "Repetition over time — because a single practice session isn't enough. Memory consolidates during sleep. One good practice the night before is worth less than five spread over two weeks.",
        ],
      },
      {
        type: "h2",
        text: "The Room Where You Rehearse",
      },
      {
        type: "p",
        text: "Most people try to manage anxiety before high-stakes moments with breathing techniques or positive self-talk. Those things have their place. But the deeper fix is eliminating the gap between what you know and what you can access under pressure.",
      },
      {
        type: "p",
        text: "You close that gap by practicing — specifically, honestly, and often enough that the retrieval pathways are well-worn before you need them.",
      },
      {
        type: "p",
        text: "The room where you rehearse is the thing that determines how you perform in the room that counts.",
      },
    ],
  },
  {
    slug: "the-forgetting-curve",
    title: "The Forgetting Curve: Why You Lose 70% of New Information Within 24 Hours",
    description:
      "Ebbinghaus discovered in 1885 that we forget most new information within a day. The implications for how you should study, practice, and retain anything are significant.",
    date: "2025-06-26",
    readTime: "4 min read",
    category: "Learning Science",
    excerpt:
      "Ebbinghaus discovered in 1885 that we forget most new information within a day. The implications for how you should study, practice, and retain anything are significant.",
    content: [
      {
        type: "p",
        text: "In 1885, Hermann Ebbinghaus memorised lists of nonsense syllables and then tested his own recall at regular intervals. The results formed what is now called the forgetting curve — and they should make you rethink how you study.",
      },
      {
        type: "h2",
        text: "What the Curve Shows",
      },
      {
        type: "p",
        text: "Within one hour of learning something new, you'll forget roughly 50% of it. Within 24 hours, that figure rises to around 70%. By a week later, without any review, you'll retain less than 25% of what you originally learned.",
      },
      {
        type: "p",
        text: "This isn't a personal failing. It's the default setting of human memory. Information that isn't used, revisited, or connected to existing knowledge gets deprioritised. Your brain treats it as noise, and noise gets cleared.",
      },
      {
        type: "h2",
        text: "Why Passive Review Doesn't Help Much",
      },
      {
        type: "p",
        text: "Re-reading notes feels productive because it's familiar. You recognise the content; the words look right. But recognition and recall are different cognitive processes. Recognition is easy — of course you remember it when you're looking at it. Recall is what happens when the book is closed and you need the information.",
      },
      {
        type: "p",
        text: "Passive review — rereading, highlighting, listening again — produces recognition, not recall. It feels like studying, but it doesn't produce the neurological changes that make information durable.",
      },
      {
        type: "h2",
        text: "What Actually Works",
      },
      {
        type: "p",
        text: "The antidote to the forgetting curve is active retrieval — specifically, attempting to recall information just before you forget it, and spacing those attempts over increasing intervals.",
      },
      {
        type: "p",
        text: "When you attempt retrieval and succeed with some effort — that near-miss feeling of pulling something back from the edge of forgetting — you strengthen the memory trace more than any passive review can. This is called the testing effect, and it's one of the most robust findings in memory research.",
      },
      {
        type: "p",
        text: "Spaced repetition systems operationalise this. They track what you've learned, estimate when you'll forget it, and surface items for review at the optimal moment. The work you do at each review is retrieval, not recognition.",
      },
      {
        type: "h2",
        text: "The Compounding Effect",
      },
      {
        type: "p",
        text: "One of the underappreciated consequences of the forgetting curve is how quickly small losses compound. If you forget 70% of a new language lesson each day and don't review, you retain almost nothing within a week. But if you review each item at the right interval, retention stays above 90% indefinitely — and review sessions get shorter over time as intervals lengthen.",
      },
      {
        type: "p",
        text: "Long-term memory isn't about learning something once and hoping it sticks. It's about creating a system that revisits what you're building, on a schedule that matches how memory actually decays. The curve bends the moment you stop fighting your biology and start working with it.",
      },
    ],
  },
  {
    slug: "how-to-build-vocabulary-that-sticks",
    title: "How to Build Vocabulary That Actually Sticks (It's Not What You Think)",
    description:
      "Reading widely won't build your vocabulary the way most people believe. The gap between passive exposure and active command is larger than almost any learner realises — and there's a better way.",
    date: "2025-07-03",
    readTime: "5 min read",
    category: "Vocabulary",
    excerpt:
      "Reading widely won't build your vocabulary the way most people believe. The gap between passive exposure and active command is larger than almost any learner realises — and there's a better way.",
    content: [
      {
        type: "p",
        text: "Reading widely is good advice. But it won't build your vocabulary the way most people think it will.",
      },
      {
        type: "h2",
        text: "The Passive vs Active Gap",
      },
      {
        type: "p",
        text: "Encountering a new word in context helps you absorb its rough meaning. If you see 'vitiate' used twice in a novel, you'll probably figure out that it means to weaken or impair. But 'figuring it out from context' is surface-level encoding. The word is loosely tethered — available in the context of the book, fragile everywhere else.",
      },
      {
        type: "p",
        text: "The gap between passive exposure and active command is larger than most learners realise. You can understand hundreds of words that you'd never spontaneously reach for in speech or writing. That's because comprehension and production draw on different pathways. Passive recognition builds a reading vocabulary. Active retrieval builds a speaking and writing vocabulary.",
      },
      {
        type: "h2",
        text: "Why Active Recall Changes This",
      },
      {
        type: "p",
        text: "When you see a word in reading, your brain processes it automatically. When you're asked to retrieve the word and its meaning from scratch — before you see it — you do something much harder. You reconstruct it.",
      },
      {
        type: "p",
        text: "That reconstruction process is expensive neurologically, and that expense is exactly the point. The effort of retrieval is what consolidates the memory. Words you've tested yourself on are available differently than words you've merely read — they're faster to access, more likely to surface in the right moment, more reliably at your disposal when it counts.",
      },
      {
        type: "h2",
        text: "Context and Connection",
      },
      {
        type: "p",
        text: "There's a second variable: how a word connects to what you already know. Isolated definitions decay. Words that arrive with a memorable example sentence — especially one that creates a concrete image — attach to existing semantic networks and stay far longer.",
      },
      {
        type: "p",
        text: "This is why the best flashcard practice isn't a word on one side and a bare definition on the other. It's a word, a vivid example, and ideally a personal anchor — a context you can picture.",
      },
      {
        type: "h2",
        text: "Beyond Individual Words",
      },
      {
        type: "p",
        text: "Vocabulary isn't just a list of words. It's a web of associations, collocations (words that travel together), registers (formal vs. informal), and connotations. A word like 'frugal' sits close to 'thrifty' but not to 'cheap' — understanding the difference between them is more useful than knowing what either one means in isolation.",
      },
      {
        type: "p",
        text: "The goal of vocabulary building isn't to increase your word count. It's to increase the precision and range of what you can express. That's a different target, and it shapes how you practice: not drilling isolated words, but building connected, usable knowledge — the kind you can reach for without thinking.",
      },
    ],
  },
  {
    slug: "small-talk-is-a-learnable-skill",
    title: "Small Talk Isn't Small: Why Conversation Fluency Is a Learnable Skill",
    description:
      "Most people who struggle socially believe their problem is confidence. Research suggests the real issue is cognitive load — and that conversation fluency, like any skill, can be deliberately trained.",
    date: "2025-07-10",
    readTime: "6 min read",
    category: "Social Skills",
    excerpt:
      "Most people who struggle socially believe their problem is confidence. Research suggests the real issue is cognitive load — and that conversation fluency, like any skill, can be deliberately trained.",
    content: [
      {
        type: "p",
        text: "Most people who struggle in social situations believe their problem is confidence. The fix they seek is usually something internal: think differently, feel less anxious, project more self-assurance. The problem with that framing is that it misidentifies what's actually hard about conversation.",
      },
      {
        type: "h2",
        text: "What Makes Conversations Hard",
      },
      {
        type: "p",
        text: "Conversation is a real-time, bidirectional cognitive task. You're listening, processing, formulating a response, monitoring tone, tracking how the other person is reacting, and deciding when to speak — all simultaneously.",
      },
      {
        type: "p",
        text: "When any one of those channels is overloaded, the others suffer. For people who find social situations stressful, the monitoring channel tends to run hot. A significant portion of cognitive resources goes toward self-evaluation ('How am I coming across? Was that weird?') at the expense of actually engaging with what the other person is saying. The result feels like a confidence problem. It's actually a load problem.",
      },
      {
        type: "h2",
        text: "The Three Phases",
      },
      {
        type: "p",
        text: "Most conversations have a recognisable structure: an opening, a sustained middle, and a close. Struggles tend to cluster in specific phases.",
      },
      {
        type: "ul",
        items: [
          "Openings — the moment of initiating with a stranger, or knowing what to say first in a group. The blank that arrives when a room expects you to speak.",
          "Sustaining — starting a conversation but not being able to keep it alive past initial pleasantries. Running out of road after the first topic.",
          "Closing — letting conversations trail off awkwardly, or leaving without a natural end. The lingering feeling that the exit was wrong.",
        ],
      },
      {
        type: "p",
        text: "Each of these is a specific skill, not a personality characteristic. And like any skill, each improves with deliberate practice in conditions that match real situations.",
      },
      {
        type: "h2",
        text: "What Practice Actually Requires",
      },
      {
        type: "p",
        text: "Generic social advice — 'ask more questions,' 'listen actively,' 'be genuinely interested' — is correct but not sufficient. The gap between knowing the principle and executing it naturally in the moment is closed by practice, not by understanding.",
      },
      {
        type: "p",
        text: "Effective practice has three qualities: it's realistic (the scenarios resemble real situations you encounter), it involves production (you're not just reading about it), and it includes feedback (something tells you what worked and what didn't). Most people get none of these. They think about what they should have said after the fact. They read articles. They feel anxious. They avoid the situations that would give them practice.",
      },
      {
        type: "h2",
        text: "The Compounding Effect",
      },
      {
        type: "p",
        text: "Conversation skills compound. Each interaction where you successfully open, sustain, or close a conversation builds a small amount of automaticity — a response that required deliberate attention starts requiring less. Over months and years, the load drops. What was effortful becomes background.",
      },
      {
        type: "p",
        text: "This is why people who've spent years in high-social environments — salespeople, teachers, community organisers — seem to effortlessly navigate situations that others find exhausting. They're not a different personality type. They've accumulated more practice at a lower load per interaction.",
      },
      {
        type: "p",
        text: "The skill is learnable. What it requires is structured practice, honest feedback, and enough repetition for fluency to develop. That's not a personality fix. It's a training problem — and training problems have solutions.",
      },
    ],
  },
  {
    slug: "how-to-stop-saying-um",
    title: "How to Stop Saying Um: The Real Reason You Use Filler Words (And How to Break the Habit)",
    description:
      "Filler words aren't a nervous habit — they're a cognitive load symptom. Understanding why you say um and uh is the first step to speaking with the pauses that actually sound confident.",
    date: "2025-07-17",
    readTime: "5 min read",
    category: "Speaking Confidence",
    excerpt:
      "Filler words aren't a nervous habit — they're a cognitive load symptom. Understanding why you say um and uh is the first step to speaking with the pauses that actually sound confident.",
    content: [
      {
        type: "p",
        text: "If you've ever listened to a recording of yourself and cringed at how many times you said 'um' or 'you know,' you're not alone. Filler words are one of the most common verbal habits in the English-speaking world. They're also among the most misunderstood.",
      },
      {
        type: "h2",
        text: "Why You Use Filler Words",
      },
      {
        type: "p",
        text: "Filler words are not a confidence problem. They're a symptom of cognitive load. When your brain is searching for the next word or idea — retrieving something from memory, selecting the right phrasing, deciding what to say next — it doesn't like silence. So it produces sound instead. 'Um' and 'uh' are place-holders that signal to your listener: I'm still here, I'm still thinking, I haven't finished.",
      },
      {
        type: "p",
        text: "Research on this is fairly settled. Linguist Herbert Clark found that fillers function as 'speaking turns' — vocal signals that keep the floor while the speaker processes. They're not meaningless sounds. They're live negotiation with your listener. The problem is that in professional contexts — interviews, presentations, pitches — they erode perceived authority at a disproportionate rate.",
      },
      {
        type: "h2",
        text: "When They Get Worse",
      },
      {
        type: "p",
        text: "Fillers increase when cognitive load increases. Give a speech on a familiar topic to a relaxed audience: you'll use fewer fillers. Speak on an unfamiliar topic to a critical audience in a formal setting: the fillers multiply. This is why most advice to 'just slow down' doesn't work. If the underlying search cost is high, slowing down buys you maybe a 10% reduction.",
      },
      {
        type: "p",
        text: "What actually reduces fillers is reducing the search cost — which happens either by knowing your material more thoroughly, or by building a habit of pausing silently instead of producing sound during retrieval.",
      },
      {
        type: "h2",
        text: "The Pause Is the Fix",
      },
      {
        type: "p",
        text: "The counterintuitive finding is that a confident pause — one to three seconds of silence — sounds better than a filled pause to almost every listener. Silence reads as considered and deliberate. 'Um' reads as uncertain.",
      },
      {
        type: "p",
        text: "This is a trainable reflex. But you can't train it mentally. You can't think your way out of a filler word habit during a high-stakes conversation. You have to practice speaking in pressure conditions enough times that the pause reflex becomes automatic — that reaching for silence feels easier than reaching for a placeholder sound.",
      },
      {
        type: "h2",
        text: "How to Build the Habit",
      },
      {
        type: "ul",
        items: [
          "Record yourself. You probably underestimate how often the fillers appear. Listening back to a 5-minute recording is often all the motivation you need.",
          "Practice out loud, not in your head. Silent rehearsal doesn't train the reflex. The habit has to be built in the medium it'll be used.",
          "Embrace the pause. Next time you feel the urge to say 'um,' close your mouth, breathe, and let a second of silence sit. It feels longer to you than it sounds to your listener.",
          "Train in pressure conditions. The hardest part is carrying the pause habit into high-stakes scenarios, which is why low-pressure repetition in realistic conditions matters more than occasional big-moment effort.",
        ],
      },
      {
        type: "p",
        text: "The goal isn't to eliminate all fillers. Some are part of natural speech. The goal is to stop using them as a default during retrieval, and to replace that reflex with something that sounds intentional rather than uncertain.",
      },
    ],
  },
  {
    slug: "the-elevator-pitch-formula",
    title: "The Elevator Pitch Formula That Works in 60 Seconds (And How to Practice Until It Feels Natural)",
    description:
      "Most elevator pitches fail not because the idea is bad, but because the delivery hasn't been earned. A three-part structure helps — but fluency only comes from practicing out loud.",
    date: "2025-07-24",
    readTime: "5 min read",
    category: "Career & Confidence",
    excerpt:
      "Most elevator pitches fail not because the idea is bad, but because the delivery hasn't been earned. A three-part structure helps — but fluency only comes from practicing out loud.",
    content: [
      {
        type: "p",
        text: "The classic elevator pitch scenario — 60 seconds in a lift with someone who can change your career — is a contrivance. But the skill it's designed to test is real: can you explain who you are, what you do, and why it matters, clearly, in under a minute, to a stranger who isn't obligated to care?",
      },
      {
        type: "p",
        text: "Most people can't. Not because they lack interesting things to say, but because they've never earned the fluency to say them under pressure.",
      },
      {
        type: "h2",
        text: "The Three-Part Structure",
      },
      {
        type: "p",
        text: "A pitch that works has three components: what you do, who you do it for, and why it matters (or what makes it different). In that order.",
      },
      {
        type: "ul",
        items: [
          "What you do — the clearest possible description of your work or idea, without jargon.",
          "Who you do it for — the specific person, problem, or context that makes what you do relevant.",
          "Why it matters — the outcome, the difference, the thing that makes someone lean in rather than nod politely.",
        ],
      },
      {
        type: "p",
        text: "The temptation is to frontload credentials or context. 'I've been in the industry for twelve years and I specialise in—' loses people before you've earned their attention. Start with the work. Start with the problem you solve. Credentials land after someone's already interested.",
      },
      {
        type: "h2",
        text: "Why Most Pitches Fail",
      },
      {
        type: "p",
        text: "There are two failure modes. The first is over-rehearsed: the pitch has been polished until it sounds like a script, and it plays that way — flat, disconnected, impersonal. The listener can tell you've said it exactly this way fifty times before.",
      },
      {
        type: "p",
        text: "The second is under-rehearsed: you know what you want to say but haven't said it out loud enough times to know where the clarity breaks down. The first pressure question — 'what does that mean practically?' — sends you into a spiral.",
      },
      {
        type: "p",
        text: "The target is between those two failure modes: fluent enough to sound easy, loose enough to sound genuine. That requires a specific kind of practice.",
      },
      {
        type: "h2",
        text: "What Practice Looks Like",
      },
      {
        type: "p",
        text: "Effective pitch practice isn't repetition. It's repetition against resistance. The pitch needs to be tested against follow-up questions, interruptions, and skeptical reactions — because the pitch itself is only the opening. What happens after the 60 seconds is where the conversation either continues or ends.",
      },
      {
        type: "p",
        text: "This is where AI role-play has a real edge over solo rehearsal. You can speak your pitch, get a realistic follow-up ('What does that look like in practice?', 'Why would someone choose you over X?'), and see in real time where your answer breaks down. That feedback loop — pitch, react, debrief, revise — is what builds the fluency that makes a pitch sound uncontrived.",
      },
    ],
  },
  {
    slug: "how-to-think-on-your-feet",
    title: "How to Think on Your Feet: A Framework for Answering Anything Without Freezing",
    description:
      "Impromptu speaking isn't a talent. It's a trained reflex built from frameworks and repeated practice. Here's the structure used by the best off-the-cuff speakers — and how to make it automatic.",
    date: "2025-07-31",
    readTime: "6 min read",
    category: "Speaking Confidence",
    excerpt:
      "Impromptu speaking isn't a talent. It's a trained reflex built from frameworks and repeated practice. Here's the structure used by the best off-the-cuff speakers — and how to make it automatic.",
    content: [
      {
        type: "p",
        text: "The people who seem to always have the right answer are not smarter than everyone else in the room. They've just practiced being put on the spot often enough that their brain has a pre-built path to follow when it happens. What looks like wit is usually architecture.",
      },
      {
        type: "h2",
        text: "Why the Brain Freezes",
      },
      {
        type: "p",
        text: "When you're asked an unexpected question in a high-stakes setting, your brain faces a dual challenge: it has to retrieve relevant knowledge while simultaneously managing social anxiety. The two tasks compete for the same cognitive resources. If the social monitoring channel is running hot — 'how do I look right now?', 'what if I say something wrong?' — retrieval suffers.",
      },
      {
        type: "p",
        text: "This is why preparation that reduces cognitive load in the moment is more effective than preparation that focuses on specific answers. You can't predict the exact question. You can build a scaffolding that your brain can reach for automatically when pressure arrives.",
      },
      {
        type: "h2",
        text: "The PREP Framework",
      },
      {
        type: "p",
        text: "One of the most useful structures for impromptu responses is PREP: Point, Reason, Example, Point. State your position, explain the reasoning behind it, support it with a concrete example, then restate the point. The loop takes 45 to 90 seconds and works for almost any question.",
      },
      {
        type: "ul",
        items: [
          "Point — your direct answer to the question, in one sentence.",
          "Reason — the logic behind it. Why do you believe this?",
          "Example — a concrete instance. A number, a story, a name, an anecdote.",
          "Point — land back on your answer to close the loop.",
        ],
      },
      {
        type: "p",
        text: "The power of PREP is that it gives your brain a rail to run on when retrieval is hard. Even if you don't know exactly what you want to say, you know the shape of the answer. You start with 'My view on that is—' and the rest follows.",
      },
      {
        type: "h2",
        text: "Other Structures Worth Knowing",
      },
      {
        type: "p",
        text: "PREP works for opinion and analysis questions. For storytelling moments ('Tell me about a time when—'), a simpler arc works: situation, complication, resolution. Three sentences. For 'What would you do if—' questions, start by naming the most important factor you'd consider, then explain the trade-off.",
      },
      {
        type: "p",
        text: "The frameworks matter less than the habit of having one. The point is to replace the blank-mind moment with a reflexive reach for structure. That reach takes less than a second when it's been practiced enough.",
      },
      {
        type: "h2",
        text: "How to Build the Reflex",
      },
      {
        type: "p",
        text: "You can't build a speaking reflex by reading about speaking. The practice has to be verbal, and it has to come with some form of pressure. Toastmasters Table Topics is a version of this. AI role-play is another — question in, spoken answer out, feedback on structure and clarity, repeat.",
      },
      {
        type: "p",
        text: "Ten practice rounds with a realistic follow-up question will do more for your impromptu speaking than ten hours of reading about it. The reflex is built in the repetitions, not the understanding.",
      },
    ],
  },
  {
    slug: "vocabulary-and-speaking-confidence",
    title: "Why Your Vocabulary Is the Hidden Driver of Speaking Confidence",
    description:
      "The hesitation before you speak is often a vocabulary problem disguised as a confidence problem. When the word is already close to the surface, the gap between thought and speech disappears.",
    date: "2025-08-07",
    readTime: "5 min read",
    category: "Vocabulary",
    excerpt:
      "The hesitation before you speak is often a vocabulary problem disguised as a confidence problem. When the word is already close to the surface, the gap between thought and speech disappears.",
    content: [
      {
        type: "p",
        text: "There's a specific kind of frustration that happens mid-sentence: you know what you mean, you can feel the idea clearly, but the exact word for it sits just out of reach. So you round down to something less precise, or you hedge, or you stop. The idea loses shape in the translation.",
      },
      {
        type: "p",
        text: "This is not a confidence problem. It's a word-retrieval problem. And the distinction matters, because the fixes are completely different.",
      },
      {
        type: "h2",
        text: "The Hesitation Gap",
      },
      {
        type: "p",
        text: "Spoken language happens in real time. Unlike writing, where you can stop and search for the right word, speech is produced under time pressure while someone is watching. When the word you need isn't immediately available, you have three options: pause and search, substitute a less precise word, or add a filler while you retrieve.",
      },
      {
        type: "p",
        text: "All three options have costs. The pause can look like uncertainty. The substitution produces speech that doesn't quite say what you meant. The filler erodes your authority. The underlying cause of all three is the same: the word wasn't close enough to the surface to retrieve quickly under pressure.",
      },
      {
        type: "h2",
        text: "Active vs Passive Vocabulary",
      },
      {
        type: "p",
        text: "Most people have a significantly larger passive vocabulary than active vocabulary. You understand hundreds of words you'd never spontaneously use in speech. Reading expands passive vocabulary. Active vocabulary — the words you can reach for quickly in real time — is built differently.",
      },
      {
        type: "p",
        text: "The route from passive to active is retrieval practice. Words you've tested yourself on — that you've been asked to produce from memory rather than simply recognise — are available differently than words you've only encountered in reading. They're faster to access. More likely to surface before the sentence ends. More reliable under pressure.",
      },
      {
        type: "h2",
        text: "Why Confident Speakers Sound Different",
      },
      {
        type: "p",
        text: "Speakers with strong active vocabularies don't sound confident because they're less anxious. They sound confident because their word retrieval is faster. The pause before they answer is shorter. The sentence construction is more precise. The gap between thought and speech is smaller.",
      },
      {
        type: "p",
        text: "Fluency, in this sense, is not a personality trait. It's a measure of how quickly you can pull the right word from memory in the moment you need it. That speed is trainable — through deliberate vocabulary practice, with retrieval at its core, spaced over enough time that the words become genuinely automatic.",
      },
      {
        type: "h2",
        text: "Building Vocabulary That Transfers to Speech",
      },
      {
        type: "ul",
        items: [
          "Focus on active recall over passive recognition. Test yourself on the word before you see the definition.",
          "Prioritise words you'll actually use — high-frequency, high-value words in your professional and social register.",
          "Learn words in example sentences, not definitions alone. Context accelerates retention and improves access speed.",
          "Review on a spaced schedule. Words reviewed too early or too infrequently don't consolidate into active memory.",
          "Use words in speech within 48 hours of learning them. Production accelerates the transfer from passive to active.",
        ],
      },
    ],
  },
  {
    slug: "how-to-practice-speaking-alone",
    title: "The Best Way to Practice Public Speaking When You Don't Have an Audience",
    description:
      "Most public speaking advice assumes you have access to a group. When you don't, the standard recommendation — record yourself — captures very little of what makes real speaking hard.",
    date: "2025-08-14",
    readTime: "5 min read",
    category: "Speaking Confidence",
    excerpt:
      "Most public speaking advice assumes you have access to a group. When you don't, the standard recommendation — record yourself — captures very little of what makes real speaking hard.",
    content: [
      {
        type: "p",
        text: "Almost all advice about improving public speaking assumes you have somewhere to practice: a Toastmasters club, a workplace presentation, a class that requires participation. The standard advice when you don't have those things is to record yourself and watch it back.",
      },
      {
        type: "p",
        text: "Recording yourself is useful. But it's also missing the most important feature of real speaking: the other person.",
      },
      {
        type: "h2",
        text: "Why Monologue Practice Has Limits",
      },
      {
        type: "p",
        text: "When you speak to a camera or a mirror, you control the entire situation. There's no unpredictability. No follow-up question you didn't see coming. No moment where the listener's body language shifts and you have to adjust. No decision about when to stop, speed up, or change direction.",
      },
      {
        type: "p",
        text: "Real speaking is reactive. Your brain is doing two things simultaneously: producing language and monitoring response. The monitoring channel — the one that tracks how you're landing — is what makes speaking feel hard. When you practice in isolation, that channel is switched off. You're training one half of the skill while the other half atrophies.",
      },
      {
        type: "h2",
        text: "What Good Solo Practice Actually Develops",
      },
      {
        type: "p",
        text: "This doesn't mean solo practice is useless. What it's good for is specific: memorising structure, building fluency on well-defined content, and identifying surface-level delivery habits (pace, filler words, posture) through playback.",
      },
      {
        type: "p",
        text: "What it's poor at developing: impromptu response, adaptability, handling interruption, reading a room. Those are built through interaction — and historically, that interaction required another human to arrange.",
      },
      {
        type: "h2",
        text: "Reactive Practice",
      },
      {
        type: "p",
        text: "The most underused form of solo speaking practice is reactive practice: putting yourself in a scenario where the output of your speech determines the next input. The simplest version is asking yourself a random question and answering it out loud, then asking a follow-up based on what you said — simulating a conversation rather than a speech.",
      },
      {
        type: "p",
        text: "More effective is using AI role-play to produce the unpredictability that solo practice can't. A simulated interviewer who pushes back on your answer, asks for clarification, or challenges an assumption forces the kind of live adaptation that monologue rehearsal never requires. The difference between the two isn't small.",
      },
      {
        type: "h2",
        text: "A Practical Solo Practice Routine",
      },
      {
        type: "ul",
        items: [
          "10 minutes of scenario practice — pick one high-stakes scenario and speak your response out loud. Don't script it.",
          "Follow-up question — answer a realistic challenge or clarification to your first response.",
          "One playback — listen for pace, clarity, and filler words. Note one specific thing to do differently.",
          "Repeat across different scenarios over the week — variety prevents over-rehearsal of a single scenario.",
        ],
      },
      {
        type: "p",
        text: "The goal isn't to become comfortable with a prepared speech. It's to lower the cost of being put on the spot — so that when the real room arrives, the reflex is already there.",
      },
    ],
  },
  {
    slug: "how-to-rescue-a-dying-conversation",
    title: "What to Do When a Conversation Runs Dry: How to Rescue Any Lull",
    description:
      "The awkward silence isn't inevitable. Most conversation lulls have a structure — and knowing the three recovery moves that work gives you a reliable way back before the silence becomes permanent.",
    date: "2025-08-21",
    readTime: "5 min read",
    category: "Conversation Skills",
    excerpt:
      "The awkward silence isn't inevitable. Most conversation lulls have a structure — and knowing the three recovery moves that work gives you a reliable way back before the silence becomes permanent.",
    content: [
      {
        type: "p",
        text: "It happens in most conversations at some point. A topic runs out. The natural follow-up doesn't come. A two-second pause stretches into four. Both people are aware of it, and now the awareness is part of the problem.",
      },
      {
        type: "p",
        text: "The awkward silence has an outsized reputation. It feels worse than it is. But it does have a structure — which means there are specific, learnable moves to navigate it before it becomes permanent.",
      },
      {
        type: "h2",
        text: "Why Conversations Run Dry",
      },
      {
        type: "p",
        text: "Most lulls have one of three causes. Topic exhaustion: you've genuinely covered the subject and neither person is extending it. Energy mismatch: one person is more engaged than the other, and the imbalance creates awkwardness. Low open-endedness: the conversation has been running on yes/no questions and short responses, with nothing pulling it forward.",
      },
      {
        type: "p",
        text: "The fix for each cause is slightly different, but the underlying skill is the same: noticing which cause you're dealing with and having a move ready.",
      },
      {
        type: "h2",
        text: "The Three Recovery Moves",
      },
      {
        type: "ul",
        items: [
          "Deepen the topic: 'What's the part of that you find most interesting?' or 'How long have you been doing that?' — asks the other person to go further on something they've already raised.",
          "Shift the topic: use a natural bridge — 'That reminds me of—', 'Something that's been on my mind lately is—' — to move to something new without the shift feeling abrupt.",
          "Invite a story: 'Have you ever—?' or 'What was that like?' — moves from exchange of information to narrative, which naturally carries more energy.",
        ],
      },
      {
        type: "p",
        text: "These three moves cover most conversation stalls. The key is that they all share one property: they give the other person something to reach for. A conversation can only sustain itself if both parties have material to work with.",
      },
      {
        type: "h2",
        text: "What Doesn't Work",
      },
      {
        type: "p",
        text: "Generic questions fill silence but don't restart energy. 'So, what do you do?' after you've already discussed jobs doesn't revive anything. Neither does commenting on the environment ('It's cold in here') unless it connects to something already in the conversation. Filler talk is recognisable as filler and rarely changes the direction of a stalling exchange.",
      },
      {
        type: "h2",
        text: "The Preparation Problem",
      },
      {
        type: "p",
        text: "Most advice about conversation rescue is read and forgotten because it's never practiced under anything resembling real pressure. You can't recall a recovery move if you've never used one. The knowledge has to be in your muscle memory, not your reading memory.",
      },
      {
        type: "p",
        text: "The only way to build that is through repeated exposure to conversations that stall — in conditions realistic enough that the reflex develops. Practice scenarios that go quiet on purpose are more valuable for this than any number of tips you've read about it.",
      },
    ],
  },
  {
    slug: "imposter-syndrome-at-work",
    title: "Imposter Syndrome at Work: Why High Achievers Go Quiet in Rooms They Should Own",
    description:
      "Imposter syndrome doesn't just create anxiety — it creates silence. Understanding why highly capable people underperform verbally reveals a more useful approach than positive self-talk.",
    date: "2025-08-28",
    readTime: "6 min read",
    category: "Career & Confidence",
    excerpt:
      "Imposter syndrome doesn't just create anxiety — it creates silence. Understanding why highly capable people underperform verbally reveals a more useful approach than positive self-talk.",
    content: [
      {
        type: "p",
        text: "In 1978, psychologists Pauline Clance and Suzanne Imes described a phenomenon they were observing in high-achieving women: a persistent belief that their success was undeserved, and that they were at risk of being exposed as frauds. They called it the imposter phenomenon. Four decades later, research suggests it affects as many as 70% of professionals at some point in their career — regardless of gender, seniority, or field.",
      },
      {
        type: "p",
        text: "What's less often discussed is where it shows up most visibly: in your behaviour, specifically in rooms where you should be speaking.",
      },
      {
        type: "h2",
        text: "The Silence Pattern",
      },
      {
        type: "p",
        text: "Imposter syndrome doesn't typically manifest as paralysis. Most high-achieving people with it still do good work. What it does, reliably, is suppress verbal output in high-stakes settings. You hold back an opinion because someone smarter might disagree. You don't ask the question because asking it might reveal you don't know the answer. You agree with the room rather than challenge it, even when you have strong grounds to.",
      },
      {
        type: "p",
        text: "The pattern: privately competent, publicly deferential. The gap between what you think in the meeting and what you say in the meeting. This gap is what imposter syndrome looks like in practice — not paralysis, but a constant low-level filter that edits you down.",
      },
      {
        type: "h2",
        text: "Why Positive Self-Talk Doesn't Fix It",
      },
      {
        type: "p",
        text: "The standard advice — 'remind yourself of your achievements,' 'recognise you belong here,' 'fake it till you make it' — addresses the cognitive content of imposter syndrome without addressing its mechanism.",
      },
      {
        type: "p",
        text: "The mechanism is anxiety reinforced by avoidance. When you avoid speaking up in a high-stakes room, you don't get the evidence that speaking up was safe. The anxiety persists because it's never been disconfirmed. Positive self-talk doesn't provide disconfirming evidence — it just tries to override the anxiety. The override rarely lasts.",
      },
      {
        type: "h2",
        text: "What Actually Works: Graduated Exposure",
      },
      {
        type: "p",
        text: "The most evidence-supported approach to imposter syndrome's speaking dimension is graduated exposure: practicing speaking up in lower-stakes settings, repeatedly, until the anxiety response habituates. You don't become bolder by deciding to be bolder. You become bolder by accumulating experiences where speaking up didn't end badly.",
      },
      {
        type: "p",
        text: "The difficulty is access to lower-stakes settings that are realistic enough to transfer. This is where AI role-play has a structural advantage: you can rehearse the specific scenarios — pitching an idea in a meeting, pushing back on a decision, answering a challenging question — with honest feedback, in private, without any actual social cost.",
      },
      {
        type: "h2",
        text: "What Shifts Over Time",
      },
      {
        type: "p",
        text: "People who work through this consistently report the same shift: not that the anxiety disappears, but that their relationship to it changes. They speak up in spite of it rather than waiting for it to resolve. That's a different state than confidence — it's more like indifference to the internal signal.",
      },
      {
        type: "p",
        text: "You don't eliminate imposter syndrome. You desensitise yourself to its volume enough that you can act against it. Repeated practice is the only mechanism that produces that desensitisation. There is no shortcut that works at scale.",
      },
    ],
  },
  {
    slug: "how-to-make-new-words-stick",
    title: "How to Make New Words Stick: Memory Techniques That Actually Work",
    description:
      "Most vocabulary techniques feel productive but don't produce durable recall. The techniques that actually work are designed around how memory consolidates — not how studying feels.",
    date: "2025-09-04",
    readTime: "5 min read",
    category: "Vocabulary",
    excerpt:
      "Most vocabulary techniques feel productive but don't produce durable recall. The techniques that actually work are designed around how memory consolidates — not how studying feels.",
    content: [
      {
        type: "p",
        text: "Learning a new word is easy. Having that word available six weeks later when you need it in a sentence is the hard part. The gap between encountering something and owning it is where most vocabulary practice fails.",
      },
      {
        type: "h2",
        text: "Why Words Don't Stick",
      },
      {
        type: "p",
        text: "Memory consolidation requires two things that most vocabulary practice doesn't provide: effortful retrieval and distributed review. Rereading word lists, looking up words when you encounter them, and even making flashcards you flip through all at once produce familiarity, not durability. You recognise the word when you see it. You can't reach for it when you need it.",
      },
      {
        type: "p",
        text: "The problem is that familiarity feels like learning. Your brain registers the word as known after enough exposures. But 'known' in the sense of recognition and 'known' in the sense of active recall are different states, accessed through different neural pathways.",
      },
      {
        type: "h2",
        text: "The Keyword Method",
      },
      {
        type: "p",
        text: "One of the most research-supported mnemonic techniques for vocabulary is the keyword method: find a word that sounds like the new word (the keyword), and create a vivid mental image linking the keyword's meaning to the new word's meaning.",
      },
      {
        type: "p",
        text: "For example: 'loquacious' (talkative) sounds a bit like 'local casino.' Imagine a local casino filled with people who won't stop talking. The image is absurd enough to be memorable, and it links the sound of the word to its meaning through something concrete. When you encounter 'loquacious,' the image surfaces, and the meaning comes with it.",
      },
      {
        type: "h2",
        text: "Sentence Embedding",
      },
      {
        type: "p",
        text: "Words embedded in sentences that you care about are retained far better than words attached to bare definitions. The mechanism is semantic association: the word connects to meaning, event, and emotion all at once.",
      },
      {
        type: "p",
        text: "When learning a new word, write an example sentence that places it in a context you actually recognise — a conversation you've had, a situation you've been in, a sentence someone else said that stuck with you. The personal anchor does more for retention than any dictionary example.",
      },
      {
        type: "h2",
        text: "Spaced Retrieval Is the Frame",
      },
      {
        type: "p",
        text: "These techniques improve encoding — how well the memory is formed in the first place. But even a well-encoded memory decays without review. The spacing effect means that the timing of review matters as much as the quality of initial encoding.",
      },
      {
        type: "ul",
        items: [
          "Review a new word the same day you learn it.",
          "Review it again two to three days later.",
          "Then a week later, then two weeks, then a month.",
          "Each successful retrieval extends the next interval. Each failure shortens it.",
        ],
      },
      {
        type: "p",
        text: "The keyword method and sentence embedding create strong memories. Spaced retrieval keeps them accessible. The combination is more powerful than either alone — and it's the difference between a vocabulary that grows on paper and one that shows up in your speech.",
      },
    ],
  },
  {
    slug: "ten-minutes-to-sharper-communication",
    title: "The 10-Minute Daily Habit That Compounds Into a Much Sharper Communicator",
    description:
      "Long study sessions feel productive. But for communication skills, consistency beats intensity. Here's why 10 minutes a day outperforms a weekend workshop — and what those 10 minutes should actually contain.",
    date: "2025-09-11",
    readTime: "4 min read",
    category: "Learning Science",
    excerpt:
      "Long study sessions feel productive. But for communication skills, consistency beats intensity. Here's why 10 minutes a day outperforms a weekend workshop — and what those 10 minutes should actually contain.",
    content: [
      {
        type: "p",
        text: "Every year, thousands of people attend a weekend workshop or intensive course on public speaking or communication skills. Most leave feeling energised. Most forget the majority of what they learned within two weeks. This isn't a failing of the workshops — it's a failing of the format.",
      },
      {
        type: "h2",
        text: "Why Intensity Doesn't Compound",
      },
      {
        type: "p",
        text: "Skill development and knowledge retention work differently. For factual knowledge, learning in concentrated bursts and then reviewing is partially effective. For skills — physical or verbal — the consolidation happens during practice and during sleep. Both require time between sessions.",
      },
      {
        type: "p",
        text: "A speaking skill practiced once a week decays more between sessions than it builds. The nervous system needs repeated signal, not occasional intensity. This is the same reason professional musicians and athletes practice daily rather than in weekend marathons — and why their skill compounds while a weekend workshop's gains don't.",
      },
      {
        type: "h2",
        text: "What 10 Minutes Actually Includes",
      },
      {
        type: "p",
        text: "Ten minutes sounds too short to matter. But the constraint forces efficiency. You can't do everything, so you do the things with the highest return.",
      },
      {
        type: "ul",
        items: [
          "3 minutes: vocabulary review — only the cards due today, graded honestly. Probably 5 to 12 cards.",
          "5 minutes: one speaking scenario — pick a scenario, speak your response out loud, no scripting.",
          "2 minutes: reflection — what felt unclear? What would you change? What word came up that you didn't have?",
        ],
      },
      {
        type: "p",
        text: "The ten minutes is not ten minutes of warming up and then doing a thing. It's ten minutes of the highest-leverage work, done daily, without ceremony.",
      },
      {
        type: "h2",
        text: "The Compounding Effect",
      },
      {
        type: "p",
        text: "After 30 days of this practice, the improvement is usually invisible — you won't feel dramatically different. After 90 days, the improvement becomes visible to other people. After six months, it becomes part of how you operate rather than something you're working on.",
      },
      {
        type: "p",
        text: "This is the pattern of compounding skills: slow at first, then discontinuous. The daily sessions look like nothing individually. Collectively, they build a baseline of fluency that changes how you communicate in every context — not just the ones you practiced.",
      },
      {
        type: "h2",
        text: "The Habit Stack",
      },
      {
        type: "p",
        text: "The easiest way to make a 10-minute practice consistent is to attach it to something already stable. After coffee. Before the first meeting. On the commute. The specific time matters less than the anchor. A consistent trigger is what converts a good intention into an automatic routine.",
      },
    ],
  },
  {
    slug: "what-your-voice-reveals",
    title: "What Your Voice Reveals About You Before You've Finished Your First Sentence",
    description:
      "Research shows listeners form strong impressions from vocal cues before they've fully processed your words. Here's what those cues are, what they signal, and how to develop them deliberately.",
    date: "2025-09-18",
    readTime: "5 min read",
    category: "Speaking Confidence",
    excerpt:
      "Research shows listeners form strong impressions from vocal cues before they've fully processed your words. Here's what those cues are, what they signal, and how to develop them deliberately.",
    content: [
      {
        type: "p",
        text: "A widely cited breakdown of communication attributes 55% of impression to body language, 38% to vocal tone, and 7% to the actual words. The original Mehrabian research behind this figure is often overapplied — it was conducted under specific conditions that don't generalise to all conversation — but the underlying finding holds: when verbal and nonverbal signals conflict, listeners trust the nonverbal ones. And your voice is the most powerful nonverbal signal you deliver in any setting where you can't be seen.",
      },
      {
        type: "h2",
        text: "What Listeners Register Before Meaning",
      },
      {
        type: "p",
        text: "Within the first three to four seconds of hearing someone speak, listeners form impressions across several dimensions: competence, warmth, confidence, credibility. These impressions are formed from vocal cues — pace, pitch range, volume, resonance — before content has been fully processed.",
      },
      {
        type: "p",
        text: "This isn't conscious judgment. It's the brain pattern-matching against a large learned database of social experience. The person who speaks slowly and with minimal pitch variation reads as steady, even if their words are hesitant. The person who speaks with rising intonation at the end of every statement reads as uncertain, even if the content is authoritative.",
      },
      {
        type: "h2",
        text: "Four Habits That Undermine Authority",
      },
      {
        type: "ul",
        items: [
          "Uptalk — ending statements with rising intonation, as though they're questions. It signals uncertainty about your own content.",
          "Trailing off — letting sentences lose volume and clarity at the end. Listeners hear the beginning and lose confidence in the rest.",
          "Monotone delivery — speaking at a single pitch without variation. It signals disengagement and is harder for listeners to track emotionally.",
          "Speaking too fast under pressure — the speed signals anxiety and reduces clarity, making listeners work harder and attribute the difficulty to the speaker.",
        ],
      },
      {
        type: "h2",
        text: "What a Strong Vocal Presence Actually Involves",
      },
      {
        type: "p",
        text: "Vocal presence isn't about a deep baritone or a 'perfect' accent. It's about control: the ability to modulate pace deliberately, land statements with downward intonation, sustain volume to the end of a sentence, and use silence as punctuation. These are specific, learnable habits — not native traits.",
      },
      {
        type: "p",
        text: "Pace is the most accessible lever. Speaking slightly slower than you think you should consistently improves the impression of authority, reduces fillers, and gives both speaker and listener more processing time. Most people who think they already speak slowly enough are still speaking too fast.",
      },
      {
        type: "h2",
        text: "How Vocal Habits Change",
      },
      {
        type: "p",
        text: "You can't change vocal habits by reading about them. You need to speak, hear yourself, and adjust — repeatedly, in realistic conditions. The adjustment loop is what builds the new pattern.",
      },
      {
        type: "p",
        text: "What makes this hard is that your own voice sounds different to you than it does to your listeners. You experience it partially through bone conduction; they hear it entirely through air. This is why real feedback — on pace, on uptalk, on trailing off — is more useful than most people's self-assessment. You need to hear what others hear, and adjust from that signal rather than from your internal sense of how you're doing.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

import { prisma } from "./prisma";

// GDPR Art. 15/20 export — everything Soro Soke holds that's actually
// personal data. Deliberately excludes: Account (OAuth refresh/access/id
// tokens — secrets, not data about the person), Session (JWT sessions mean
// this table is always empty), VerificationToken/VisitLog/SiteConfig/
// BannedEmail/Country (not tied to this specific person), and
// PushSubscription's cryptographic keys (p256dh/auth — not meaningful to
// the user, only useful for sending them a push).
export async function exportUserData(userId: string) {
  const [
    user,
    decks,
    streak,
    settings,
    achievements,
    voiceProfile,
    socialSessions,
    speakUpSessions,
    debateSessions,
    docReviewSessions,
    docPresenterSessions,
    pushSubscriptions,
    countryProgress,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, emailVerified: true, createdAt: true, plan: true, planStartedAt: true },
    }),
    prisma.deck.findMany({
      where: { userId },
      select: {
        id: true, name: true, description: true, createdAt: true, shareToken: true,
        cards: {
          select: {
            id: true, front: true, back: true, partOfSpeech: true, example: true, hook: true,
            synonyms: true, association: true, kind: true, sourceContext: true, easeFactor: true,
            interval: true, repetitions: true, dueAt: true, createdAt: true, updatedAt: true,
            reviewLogs: { select: { grade: true, reviewedAt: true } },
          },
        },
      },
    }),
    prisma.streak.findUnique({
      where: { userId },
      select: { currentStreak: true, longestStreak: true, lastReviewDate: true, recoveryUsedAt: true, streakStartedAt: true },
    }),
    prisma.userSettings.findUnique({ where: { userId }, select: { dailyNewCards: true } }),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true, unlockedAt: true } }),
    prisma.voiceProfile.findUnique({ where: { userId }, select: { tone: true, updatedAt: true } }),
    prisma.socialSession.findMany({
      where: { userId },
      select: {
        id: true, createdAt: true, scenarioTag: true, scenarioContext: true, characterLabel: true,
        difficulty: true, exchangeCount: true, score: true, strongPoints: true, improvements: true,
        powerMove: true, messages: true, practiceGoal: true, feedbackRating: true,
      },
    }),
    prisma.speakUpSession.findMany({
      where: { userId },
      select: {
        id: true, createdAt: true, scenarioId: true, scenarioTag: true, personaId: true, personaLabel: true,
        difficulty: true, practiceGoal: true, exchangeCount: true, score: true, strongPoints: true,
        improvements: true, modelAnswer: true, messages: true, feedbackRating: true,
      },
    }),
    prisma.debateSession.findMany({
      where: { userId },
      select: {
        id: true, createdAt: true, motion: true, position: true, opponentType: true, difficulty: true,
        exchangeCount: true, score: true, strongPoints: true, improvements: true, keyFallacy: true,
        missedArg: true, modelRebuttal: true, argumentBreakdown: true, skillScores: true, messages: true,
        feedbackRating: true,
      },
    }),
    prisma.docReviewSession.findMany({
      where: { userId },
      select: {
        id: true, createdAt: true, sampleDocId: true, docTitle: true, docTopic: true, isOwnDoc: true,
        attempted: true, detectionScore: true, userNotes: true, caught: true, missed: true,
        topQuestions: true, judgmentNote: true, raisingTip: true,
      },
    }),
    prisma.docPresenterSession.findMany({
      where: { userId },
      select: {
        id: true, createdAt: true, sampleDocId: true, docTitle: true, docTopic: true, isOwnDoc: true,
        summary: true, followUpQuestion: true, answer: true, summaryScore: true, answerScore: true,
        overallScore: true, strengths: true, improvements: true, idealFollowUpAnswer: true,
      },
    }),
    prisma.pushSubscription.findMany({ where: { userId }, select: { id: true, createdAt: true } }),
    prisma.userCountryProgress.findMany({
      where: { userId },
      select: { interval: true, repetitions: true, easeFactor: true, dueAt: true, createdAt: true, country: { select: { name: true } } },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    account: user,
    decks,
    streak,
    settings,
    achievements,
    voiceProfile,
    practiceSessions: {
      smallTalkLab: socialSessions,
      speakUp: speakUpSessions,
      debateLab: debateSessions,
      docLabCommenter: docReviewSessions,
      docLabPresenter: docPresenterSessions,
    },
    pushSubscriptions,
    countryProgress: countryProgress.map((p) => ({
      country: p.country.name,
      interval: p.interval,
      repetitions: p.repetitions,
      easeFactor: p.easeFactor,
      dueAt: p.dueAt,
      createdAt: p.createdAt,
    })),
  };
}

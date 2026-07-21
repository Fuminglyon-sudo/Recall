export type Sm2Input = {
  easeFactor: number;
  interval: number;
  repetitions: number;
  grade: number;
  now?: Date;
};

export type Sm2Result = {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueAt: Date;
};

export function applySm2({ easeFactor, interval, repetitions, grade, now = new Date() }: Sm2Input): Sm2Result {
  const boundedGrade = Math.max(0, Math.min(5, grade));

  if (boundedGrade < 3) {
    return {
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1,
      repetitions: 0,
      dueAt: addDays(now, 1),
    };
  }

  const nextEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - boundedGrade) * (0.08 + (5 - boundedGrade) * 0.02)));
  const nextRepetitions = repetitions + 1;

  let nextInterval = 1;
  if (nextRepetitions === 1) nextInterval = 1;
  else if (nextRepetitions === 2) nextInterval = 6;
  else nextInterval = Math.max(1, Math.round(interval * nextEaseFactor));

  return {
    easeFactor: nextEaseFactor,
    interval: nextInterval,
    repetitions: nextRepetitions,
    dueAt: addDays(now, nextInterval),
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** The resulting interval (in days) for each grade 0-5, for a "what happens if I pick this?" preview. */
export function previewGradeIntervals(current: { easeFactor: number; interval: number; repetitions: number }): number[] {
  return [0, 1, 2, 3, 4, 5].map((grade) => applySm2({ ...current, grade }).interval);
}

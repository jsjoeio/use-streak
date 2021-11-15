import {
  doesStreakExist,
  getStreak,
  shouldInrementOrResetStreakCount,
  formattedDate,
  updateStreak,
  resetStreakCount,
  initializeAndGetStreak,
  incrementStreakCount,
} from "./lib";

export function useStreak(_localStorage: Storage, currentDate: Date) {
  // Check if streak exists
  const _doesStreakExist = doesStreakExist(_localStorage);

  if (_doesStreakExist) {
    const streak = getStreak(_localStorage);

    // check if we should increment or reset
    const { shouldIncrement, shouldReset } = shouldInrementOrResetStreakCount(
      formattedDate(currentDate),
      streak?.lastLoginDate || "10/21/2021"
    );

    if (shouldReset) {
      const updatedStreak = resetStreakCount(streak, currentDate);
      updateStreak(_localStorage, updatedStreak);
      return updatedStreak;
    }

    if (shouldIncrement) {
      const updatedStreak = incrementStreakCount(streak, currentDate);
      updateStreak(_localStorage, updatedStreak);
      return updatedStreak;
    }

    return streak;
  }

  const _streak = initializeAndGetStreak(_localStorage, currentDate);
  return _streak;
}

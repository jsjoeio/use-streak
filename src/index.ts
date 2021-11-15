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

/**
 *
 * @param {Storage} _localStorage - pass in `localStorage`
 * @param {Date} currentDate - pass in current date i.e. `new Date()`
 * @returns Streak - an object with `currentCount`, `lastLoginDate`, `startDate`
 * 
 * @example
import { useStreak } from "use-streak";

const today = new Date();
const streak = useStreak(localStorage, today);
// streak returns an object:
// {
//    currentCount: 1,
//    lastLoginDate: "11/11/2021",
//    startDate: "11/11/2021",
// }
 */
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

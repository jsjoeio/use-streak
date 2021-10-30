import { differenceInDays } from "date-fns";
import { STREAK_KEY } from "./constants";

export type Streak = {
  startDate: Date;
  lastLoginDate: Date;
  currentCount: number;
};

export function buildStreakCount(date: Date) {
  return {
    startDate: date,
    lastLoginDate: date,
    currentCount: 1,
  };
}

export function resetStreakCount(currentStreak: Streak, date: Date) {
  return {
    startDate: date,
    lastLoginDate: date,
    currentCount: 1,
  };
}

export function incrementStreakCount(currentStreak: Streak) {
  return {
    ...currentStreak,
    currentCount: (currentStreak.currentCount += 1),
  };
}

/**
 *
 * @param currentDate
 * @param lastLoginDate
 * returns a boolean value indicating whether or not you should increment or
 * reset streak count
 */
export function shouldInrementOrResetStreakCount(
  currentDate: Date,
  lastLoginDate: Date
) {
  const difference = differenceInDays(currentDate, lastLoginDate);

  // logging in on the same day
  if (difference === 0) {
    return {
      shouldIncrement: false,
      shouldReset: false,
    };
  }
  // This means they logged in the day after the current
  if (difference === 1) {
    return {
      shouldIncrement: true,
      shouldReset: false,
    };
  }

  // Otherwise they logged in after a day, which would
  // break the streak
  return {
    shouldIncrement: false,
    shouldReset: true,
  };
}

/*

original stream: https://www.youtube.com/watch?v=ndBAg6lqlwI
*/

export function intializeStreak(_localStorage: Storage, streak: Streak) {
  const value = JSON.stringify(streak);
  _localStorage.setItem(STREAK_KEY, value);
}

export function getStreak(_localStorage: Storage) {
  try {
    const streak = JSON.parse(_localStorage.getItem(STREAK_KEY) || "");
    return streak;
  } catch (error) {
    console.error(
      error,
      "something went wrong getting the streak. JSON.parse error?"
    );
    return undefined;
  }
}

// motto 10/30
// defeat inflation
// i don't have time to use my mouse
// i see you use date-fns over moment, man of culture

export function doesStreakExist(_localStorage: Storage) {
  return _localStorage.getItem(STREAK_KEY) !== null;
}

export function removeStreak(_localStorage: Storage) {
  _localStorage.removeItem(STREAK_KEY);
}

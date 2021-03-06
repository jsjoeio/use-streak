// These are private functions
// used by he package
// but not meant to be used by consumers.

export const STREAK_KEY = "streak";

export type Streak = {
  startDate: string;
  lastLoginDate: string;
  currentCount: number;
};

export function formattedDate(date: Date): string {
  // NOTE@jsjoeio
  // sometimes this returns 11/11/2021
  // other times it returns 11/11/2021, 12:00:00 AM
  // which is why we call the .split at the end
  return date.toLocaleString("en-US").split(",")[0];
}

export function buildStreakCount(date: Date): Streak {
  return {
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
    currentCount: 1,
  };
}

export function resetStreakCount(currentStreak: Streak, date: Date) {
  return {
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
    currentCount: 1,
  };
}

export function incrementStreakCount(
  currentStreak: Streak,
  date: Date
): Streak {
  return {
    ...currentStreak,
    lastLoginDate: formattedDate(date),
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
  currentDate: string,
  lastLoginDate: string
) {
  // We get 11/5/2021
  // so to get 5, we split on / and get the second item
  const difference =
    parseInt(currentDate.split("/")[1]) - parseInt(lastLoginDate.split("/")[1]);

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

export function intializeStreak(_localStorage: Storage, streak: Streak) {
  const value = JSON.stringify(streak);
  _localStorage.setItem(STREAK_KEY, value);
}

export function updateStreak(_localStorage: Storage, streak: Streak) {
  const value = JSON.stringify(streak);
  _localStorage.setItem(STREAK_KEY, value);
}

export function getStreak(_localStorage: Storage): Streak {
  try {
    const streak = JSON.parse(_localStorage.getItem(STREAK_KEY) || "");
    return streak;
  } catch (error) {
    console.error(
      error,
      "something went wrong getting the streak. JSON.parse error? initializing and getting streak."
    );

    const today = new Date();
    return initializeAndGetStreak(_localStorage, today);
  }
}

export function doesStreakExist(_localStorage: Storage) {
  return _localStorage.getItem(STREAK_KEY) !== null;
}

export function removeStreak(_localStorage: Storage) {
  _localStorage.removeItem(STREAK_KEY);
}

export function initializeAndGetStreak(
  _localStorage: Storage,
  currentDate: Date
) {
  const initialStreak = buildStreakCount(currentDate);
  intializeStreak(_localStorage, initialStreak);
  const _streak = getStreak(_localStorage);
  return _streak;
}

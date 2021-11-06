import { format } from "date-fns";
export const STREAK_KEY = "streak";
export const DATE_FORMAT = "MM/dd/yyyy";

export type Streak = {
  startDate: string;
  lastLoginDate: string;
  currentCount: number;
};

export const formattedDate = (date: Date) => format(date, DATE_FORMAT);

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

/*

original stream: https://www.youtube.com/watch?v=ndBAg6lqlwI
*/

export function intializeStreak(_localStorage: Storage, streak: Streak) {
  const value = JSON.stringify(streak);
  _localStorage.setItem(STREAK_KEY, value);
}

export function updateStreak(_localStorage: Storage, streak: Streak) {
  const value = JSON.stringify(streak);
  _localStorage.setItem(STREAK_KEY, value);
}

export function getStreak(_localStorage: Storage): Streak | undefined {
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
// is your life typescript everything at this point?
// I am normal 24 year old guy in India

export function doesStreakExist(_localStorage: Storage) {
  return _localStorage.getItem(STREAK_KEY) !== null;
}

export function removeStreak(_localStorage: Storage) {
  _localStorage.removeItem(STREAK_KEY);
}

export function useStreak(_localStorage: Storage, currentDate: Date) {
  // Check if streak exists
  const _doesStreakExist = doesStreakExist(_localStorage);

  if (_doesStreakExist) {
    const streak = getStreak(_localStorage);

    if (streak) {
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

    const initialStreak = buildStreakCount(currentDate);
    intializeStreak(_localStorage, initialStreak);
    const _streak = getStreak(_localStorage);
    return _streak;
  }

  const initialStreak = buildStreakCount(currentDate);
  intializeStreak(_localStorage, initialStreak);
  const streak = getStreak(_localStorage);

  return streak;
}

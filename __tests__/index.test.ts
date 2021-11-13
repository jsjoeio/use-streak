import { sub, isSameDay, add } from "date-fns";
import { JSDOM } from "jsdom";
import {
  Streak,
  useStreak,
  buildStreakCount,
  STREAK_KEY,
  removeStreak,
  updateStreak,
  doesStreakExist,
  incrementStreakCount,
  intializeStreak,
  getStreak,
  resetStreakCount,
  shouldInrementOrResetStreakCount,
  formattedDate,
} from "../src/index";

// Test helper
const currentDateFormatted = formattedDate(new Date());

describe("buildStreakCount", () => {
  it("should return a Streak object", () => {
    const currentDate = new Date();
    const actual = buildStreakCount(currentDate);

    expect(Object.prototype.hasOwnProperty.call(actual, "currentCount")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(actual, "startDate")).toBe(
      true
    );

    const expected = currentDateFormatted;
    expect(actual.startDate).toBe(expected);
    expect(actual.currentCount).toBe(1);
  });
});

describe("resetStreakCount", () => {
  it("should reset the date and count", () => {
    const currentDate = new Date();
    const fakeStreakCount = {
      currentCount: 5,
      startDate: currentDateFormatted,
      lastLoginDate: currentDateFormatted,
    };

    const updatedStreakCount = resetStreakCount(fakeStreakCount, currentDate);

    expect(updatedStreakCount.startDate).toBe(currentDateFormatted);
    expect(updatedStreakCount.currentCount).toBe(1);
  });
});

describe("incrementStreakCount", () => {
  it("should increment the currentCount", () => {
    const fakeStreakCount = {
      currentCount: 5,
      startDate: currentDateFormatted,
      lastLoginDate: currentDateFormatted,
    };

    const updatedStreakCount = incrementStreakCount(
      fakeStreakCount,
      new Date()
    );

    expect(updatedStreakCount.currentCount).toBe(6);
  });
});

describe("shouldInrementOrResetStreakCount", () => {
  it("should return an object with shouldIncrement and shouldRest boolean values", () => {
    const currentDate = currentDateFormatted;
    const lastLoginDate = currentDateFormatted;
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(
      Object.prototype.hasOwnProperty.call(actual, "shouldIncrement")
    ).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(actual, "shouldReset")).toBe(
      true
    );
  });

  it("should return an object with shouldIncrement as false if currentDate and lastLoginDate are the same", () => {
    const currentDate = currentDateFormatted;
    const lastLoginDate = currentDateFormatted;
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(actual.shouldIncrement).toBe(false);
    expect(actual.shouldReset).toBe(false);
  });

  it("should return an object with shouldIncrement as true if currentDate is 1 day after lastLoginDate", () => {
    const currentDate = currentDateFormatted;
    const lastLoginDate = formattedDate(sub(new Date(), { days: 1 }));
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(actual.shouldIncrement).toBe(true);
    expect(actual.shouldReset).toBe(false);
  });

  it("should return an object with shouldReset as true if currentDate is 2 days after lastLoginDate", () => {
    const currentDate = currentDateFormatted;
    const lastLoginDate = formattedDate(sub(new Date(), { days: 2 }));
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(actual.shouldIncrement).toBe(false);
    expect(actual.shouldReset).toBe(true);
  });
});

describe("initializeStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  it("should store the streak in localStorage", () => {
    const today = new Date();
    const fakeStreak = buildStreakCount(today);
    // It should not exist when we start the test
    const getStreak = () => mockLocalStorage.getItem(STREAK_KEY);
    expect(getStreak()).toBeNull();

    intializeStreak(mockLocalStorage, fakeStreak);
    expect(getStreak()).not.toBeNull();
    const parsedStreak: Streak = JSON.parse(getStreak() || "");
    expect(parsedStreak.currentCount).toBe(1);
    expect(parsedStreak.lastLoginDate).toBe(currentDateFormatted);
  });
});

describe("getStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    const today = new Date();
    const fakeStreak: Streak = buildStreakCount(today);

    mockLocalStorage = mockJSDom.window.localStorage;
    intializeStreak(mockLocalStorage, fakeStreak);
  });

  afterEach(() => {
    mockLocalStorage.removeItem(STREAK_KEY);
  });

  it("should get the streak from local storage if it exists", () => {
    const streak = getStreak(mockLocalStorage);
    expect(streak).not.toBeNull();
    expect(Object.prototype.hasOwnProperty.call(streak, "currentCount")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "startDate")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "lastLoginDate")).toBe(
      true
    );

    if (streak) {
      expect(streak.startDate).toBe(currentDateFormatted);
    }
  });
});

// defeat inflation
describe("doesStreakExist", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should return false if it does not exist", () => {
    const actual = doesStreakExist(mockLocalStorage);
    const expected = false;
    expect(actual).toBe(expected);
  });

  it("should return true if it does not iexist", () => {
    const today = new Date();
    const fakeStreak = buildStreakCount(today);

    intializeStreak(mockLocalStorage, fakeStreak);
    const actual = doesStreakExist(mockLocalStorage);
    const expected = true;
    expect(actual).toBe(expected);
    mockLocalStorage.removeItem(STREAK_KEY);
  });
});

describe("removeStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should remove the streak from localStorage/", () => {
    // check that it exists first
    const today = new Date();
    const fakeStreak = buildStreakCount(today);

    intializeStreak(mockLocalStorage, fakeStreak);
    expect(mockLocalStorage.getItem(STREAK_KEY)).not.toBe(null);
    removeStreak(mockLocalStorage);
    expect(mockLocalStorage.getItem(STREAK_KEY)).toBe(null);
  });
});

describe("updateStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    const today = new Date();
    const fakeStreak = buildStreakCount(today);

    mockLocalStorage = mockJSDom.window.localStorage;
    intializeStreak(mockLocalStorage, fakeStreak);
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should update the streak and save to localStorage", () => {
    // 1. getStreak -> assert the currentCount
    const streak = getStreak(mockLocalStorage);
    if (streak) {
      expect(streak?.currentCount).toBe(1);
      // 2. updateStreak -> save localStorage
      // TODO@jsjoeio - don't assert as Streak
      const updatedStreak = incrementStreakCount(streak, new Date());
      updateStreak(mockLocalStorage, updatedStreak);

      // 3. getStreak (again) -> assert the currentCount ++
      expect(streak?.currentCount).toBe(2);
    }
  });
});

describe("useStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    const today = new Date();
    const fakeStreak = buildStreakCount(today);

    mockLocalStorage = mockJSDom.window.localStorage;
    intializeStreak(mockLocalStorage, fakeStreak);
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should always return a streak", () => {
    const streak = useStreak(mockLocalStorage, new Date());
    expect(streak).not.toBeNull();

    expect(Object.prototype.hasOwnProperty.call(streak, "currentCount")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "startDate")).toBe(
      true
    );

    // delete it and see if we still get it when calling streak
    removeStreak(mockLocalStorage);

    const streak2 = useStreak(mockLocalStorage, new Date());

    expect(streak2).not.toBeUndefined();
  });

  it("should automatically reset the streak", () => {
    const streak = useStreak(mockLocalStorage, new Date());
    const initialLastLoginDate = streak?.lastLoginDate;
    expect(initialLastLoginDate).not.toBeNull();

    // Instead, what if we pretend to login
    // two days later
    // which should reset the streak
    if (streak) {
      const twoDaysLater = add(new Date(streak?.lastLoginDate), { days: 2 });
      const streak2 = useStreak(mockLocalStorage, twoDaysLater);
      if (streak2) {
        // the startDate and lastLoginDate should both be twoDaysLater
        const isSameStartDate = isSameDay(
          new Date(streak2.lastLoginDate),
          twoDaysLater
        );

        const isSameLastLoginDate = isSameDay(
          new Date(streak2.startDate),
          twoDaysLater
        );
        expect(isSameStartDate).toBe(true);
        expect(isSameLastLoginDate).toBe(true);

        // ensure it's not the same as the original streak
        expect(streak.startDate).not.toBe(streak2.startDate);
        expect(streak.lastLoginDate).not.toBe(streak2.lastLoginDate);
      }
    }
  });
  it("should automatically increment the streak", () => {
    const streak = useStreak(mockLocalStorage, new Date());
    const initialLastLoginDate = streak?.lastLoginDate;
    expect(initialLastLoginDate).not.toBeNull();

    // Pretend we login one day later
    // which should increment the streak
    if (streak) {
      const oneDayLater = add(new Date(streak?.lastLoginDate), { days: 1 });
      const streak2 = useStreak(mockLocalStorage, oneDayLater);
      if (streak2) {
        console.log(streak, "streak1");
        console.log(streak2, "streak2");
        // the startDate and lastLoginDate should both be twoDaysLater
        const isSameStartDate = isSameDay(
          new Date(streak2.lastLoginDate),
          oneDayLater
        );

        const isSameLastLoginDate = isSameDay(
          new Date(streak2.startDate),
          oneDayLater
        );
        expect(isSameStartDate).toBe(true);
        expect(isSameLastLoginDate).toBe(false);

        // this should be the same
        expect(streak.startDate).toBe(streak2.startDate);
        expect(streak.lastLoginDate).not.toBe(streak2.lastLoginDate);
      }
    }
  });
});

describe("formattedDate", () => {
  it("should return a date in MM/dd/yyy", () => {
    const today = new Date("11/11/2021")
    const actual = formattedDate(today)
    const expected = "11/11/2021"
    
    expect(actual).toBe(expected)
  })
  it("should return a date in MM/dd/yyy (example 2)", () => {
    const today = new Date("10/11/2021")
    const actual = formattedDate(today)
    const expected = "10/11/2021"
    
    expect(actual).toBe(expected)
  })
})
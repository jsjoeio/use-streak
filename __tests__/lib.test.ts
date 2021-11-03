import { sub, isSameDay } from "date-fns";
import { JSDOM } from "jsdom";
import {
  Streak,
  useStreak,
  buildStreakCount,
  removeStreak,
  updateStreak,
  doesStreakExist,
  incrementStreakCount,
  intializeStreak,
  getStreak,
  resetStreakCount,
  shouldInrementOrResetStreakCount,
} from "../src/lib";
import { STREAK_KEY } from "../src/constants";

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

    expect(actual.startDate).toBe(currentDate);
    expect(actual.currentCount).toBe(1);
  });
});

describe("resetStreakCount", () => {
  it("should reset the date and count", () => {
    const currentDate = new Date();
    const fakeStreakCount = {
      currentCount: 5,
      startDate: new Date(),
      lastLoginDate: new Date(),
    };

    const updatedStreakCount = resetStreakCount(fakeStreakCount, currentDate);

    expect(updatedStreakCount.startDate).toBe(currentDate);
    expect(updatedStreakCount.currentCount).toBe(1);
  });
});

describe("incrementStreakCount", () => {
  it("should increment the currentCount", () => {
    const fakeStreakCount = {
      currentCount: 5,
      startDate: new Date(),
      lastLoginDate: new Date(),
    };

    const updatedStreakCount = incrementStreakCount(fakeStreakCount);

    expect(updatedStreakCount.currentCount).toBe(6);
  });
});

describe("shouldInrementOrResetStreakCount", () => {
  it("should return an object with shouldIncrement and shouldRest boolean values", () => {
    const currentDate = new Date();
    const lastLoginDate = new Date();
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(
      Object.prototype.hasOwnProperty.call(actual, "shouldIncrement")
    ).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(actual, "shouldReset")).toBe(
      true
    );
  });

  it("should return an object with shouldIncrement as false if currentDate and lastLoginDate are the same", () => {
    const currentDate = new Date();
    const lastLoginDate = new Date();
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(actual.shouldIncrement).toBe(false);
    expect(actual.shouldReset).toBe(false);
  });

  it("should return an object with shouldIncrement as true if currentDate is 1 day after lastLoginDate", () => {
    const currentDate = new Date();
    const lastLoginDate = sub(currentDate, { days: 1 });
    const actual = shouldInrementOrResetStreakCount(currentDate, lastLoginDate);

    expect(actual.shouldIncrement).toBe(true);
    expect(actual.shouldReset).toBe(false);
  });

  it("should return an object with shouldReset as true if currentDate is 2 days after lastLoginDate", () => {
    const currentDate = new Date();
    const lastLoginDate = sub(currentDate, { days: 2 });
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
    expect(new Date(parsedStreak.lastLoginDate).toDateString()).toMatch(
      today.toDateString()
    );
  });
});

describe("getStreak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    const today = new Date();
    const fakeStreak = buildStreakCount(today);

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
      const updatedStreak = incrementStreakCount(streak);
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
    const streak = useStreak(mockLocalStorage);
    expect(streak).not.toBeNull();

    expect(Object.prototype.hasOwnProperty.call(streak, "currentCount")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "startDate")).toBe(
      true
    );

    // delete it and see if we still get it when calling streak
    removeStreak(mockLocalStorage);

    const streak2 = useStreak(mockLocalStorage);

    expect(streak2).not.toBeUndefined();
  });

  it("should automatically reset the streak", () => {
    const streak = useStreak(mockLocalStorage);
    const initialLastLoginDate = streak?.lastLoginDate;
    expect(initialLastLoginDate).not.toBeNull();

    // simulate the streak as if it were two days prior
    // then get it now and it should reset because
    // we broke the streak
    // 1. overwrite the streakLastLoginDate
    if (streak) {
      console.log(streak, "streak");
      const twoDaysAgo = sub(streak?.lastLoginDate, { days: 2 });
      streak.lastLoginDate = twoDaysAgo;
      // 2. store it in localStorage
      updateStreak(mockLocalStorage, streak);
      // 3. call streak2
      const streak2 = useStreak(mockLocalStorage);
      if (streak2) {
        // 4. assert streak2.lastLoginDate should not be the one we overwrote it to
        console.log(streak2.lastLoginDate, "last login date");
        console.log(`${twoDaysAgo} twoDaysAgo mate`);
        const _isSameDay = isSameDay(streak2.lastLoginDate, twoDaysAgo);
        expect(_isSameDay).toBe(false);
      }
    }
  });
});

/*

Things we need to do:
- [x] doesStreakExist
- [x] removeStreak
- [x] updateStreak
- [ ] write useStreak hook
  - [ ] fix getStreak
  - [ ] finish useStreak reset test
  - [ ] add test for increment
- [ ] add cra template in subdir

How it works in practice
1. page loads
2. check doesStreakExist
3. if it does, use shouldInrementOrResetStreakCount 
4. increment or reset  
5. updateStreak

How we'd use it in a React app
// This would return a Streak object 
const [streak] = useStreak(localStorage)

// and have these three values:
// startDate: Date;
// lastLoginDate: Date;
// currentCount: number;
*/

/*
  11/3/2021
stopped here.
need to update getStreak to ensure that lastLoginDate and othe Date properties
actually come back as Date objects. right now, they come back as date strings
fix this...
then finish the useStreak tests
NyxKrage suggests using parseISO() from date-fns because new Date can fail if 
your language changeTs
TIL

*/
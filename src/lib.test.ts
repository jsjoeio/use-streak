import { sub } from "date-fns";
import { JSDOM } from "jsdom";
import {
  buildStreakCount,
  incrementStreakCount,
  resetStreakCount,
  shouldInrementOrResetStreakCount
} from "./lib";

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
      lastLoginDate: new Date()
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
      lastLoginDate: new Date()
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
    const mockJSDom = new JSDOM();

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  /*

  STOPPED HERE
  Ran into this issue "Identifier 'window' has already been declared"

  Not sure how to fix. Seems like a CodeSandbox issue. 
  https://github.com/testing-library/dom-testing-library-template/issues/4


  */

  it("should store the streak in localStorage", () => {
    // const today = new Date();
    // const fakeStreak = buildStreakCount(today);
    const cat = mockLocalStorage.getItem("myCat");

    expect(cat).toBe("hello");
  });
});

/*

Things we need to do:
- check if streak object exists in localStorage
- create and store it 
- if need to reset, then update

intialize...
get...
update...


intializeStreak(_localStorage: LocalStorage, streak: Streak) {
  const KEY = "streak"
  const value = JSON.stringify(streak)
  _localStorage.setItem(KEY, value);
}

*/

import { isDefined, isNil } from "../function-extensions";

describe("isNil", () => {
  const tests = [{
    name: "should return true when passed null",
    input: null,
    expected: true
  },
  {
    name: "should return true when passed undefined",
    input: undefined,
    expected: true
  },
  {
    name: "should return false when passed 0",
    input: 0,
    expected: false
  },
  {
    name: "should return false when passed []",
    input: [],
    expected: false
  },
  {
    name: "should return false when passed {}",
    input: {},
    expected: false
  },
  {
    name: "should return false when passed ''",
    input: '',
    expected: false
  }];

  tests.forEach(test => {
    it(test.name, () => {
      expect(isNil(test.input)).toBe(test.expected)
    })
  })
});

describe("isDefined", () => {
  const tests = [{
    name: "should return false when passed null",
    input: null,
    expected: false
  },
  {
    name: "should return false when passed undefined",
    input: undefined,
    expected: false
  },
  {
    name: "should return true when passed 0",
    input: 0,
    expected: true
  },
  {
    name: "should return true when passed []",
    input: [],
    expected: true
  },
  {
    name: "should return true when passed {}",
    input: {},
    expected: true
  },
  {
    name: "should return true when passed ''",
    input: '',
    expected: true
  }];

  tests.forEach(test => {
    it(test.name, () => {
      expect(isDefined(test.input)).toBe(test.expected)
    })
  })
});

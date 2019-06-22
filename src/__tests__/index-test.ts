import { identity } from "../index";

describe("identity", () => {
  it("should return the same value that was passed in", () => {
    expect(identity(1)).toBe(1);
  });
  it("should return the same reference that was passed in", () => {
    const value = {};
    expect(identity(value)).toBe(value);
  });

});

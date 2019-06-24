import { getCurrentUTCTimestamp } from "../utc-timestamp";

describe("getCurrentUTCTimestamp", () => {
  it("should return the milliseconds from January 1, 1970 00:00:00 UTC", () => {
    const now = Date.now();
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => now);

      expect(getCurrentUTCTimestamp()).toBe(now);
  });
});

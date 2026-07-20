import { hasFounderSpotAvailable } from "@/lib/founder";

describe("hasFounderSpotAvailable", () => {
  test("spot open when count is below the total", () => {
    expect(hasFounderSpotAvailable(0, 50)).toBe(true);
    expect(hasFounderSpotAvailable(49, 50)).toBe(true);
  });

  test("no spot left once count reaches the total", () => {
    expect(hasFounderSpotAvailable(50, 50)).toBe(false);
    expect(hasFounderSpotAvailable(51, 50)).toBe(false);
  });

  test("zero total means no spots ever available", () => {
    expect(hasFounderSpotAvailable(0, 0)).toBe(false);
  });
});

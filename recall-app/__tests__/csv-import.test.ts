import { parseCSV, clip, MAX_IMPORT_ROWS, MAX_IMPORT_BYTES } from "@/lib/csv-import";

describe("parseCSV", () => {
  test("parses a simple header + row", () => {
    expect(parseCSV("front,back\nhello,world")).toEqual([
      ["front", "back"],
      ["hello", "world"],
    ]);
  });

  test("handles quoted fields with embedded commas", () => {
    expect(parseCSV('front,back\n"a, b",world')).toEqual([
      ["front", "back"],
      ["a, b", "world"],
    ]);
  });

  test("handles escaped double quotes inside a quoted field", () => {
    expect(parseCSV('front,back\n"say ""hi""",world')).toEqual([
      ["front", "back"],
      ['say "hi"', "world"],
    ]);
  });

  test("handles CRLF line endings", () => {
    expect(parseCSV("front,back\r\nhello,world\r\n")).toEqual([
      ["front", "back"],
      ["hello", "world"],
    ]);
  });

  test("handles a quoted field containing a newline", () => {
    expect(parseCSV('front,back\n"line1\nline2",world')).toEqual([
      ["front", "back"],
      ["line1\nline2", "world"],
    ]);
  });
});

describe("clip", () => {
  test("returns null for undefined input", () => {
    expect(clip(undefined, 10)).toBeNull();
  });

  test("returns null for blank/whitespace-only input", () => {
    expect(clip("   ", 10)).toBeNull();
  });

  test("trims surrounding whitespace", () => {
    expect(clip("  hello  ", 10)).toBe("hello");
  });

  test("passes through strings within the limit unchanged", () => {
    expect(clip("hello", 10)).toBe("hello");
  });

  test("truncates strings beyond the limit — this is the S4 CSV-import fix", () => {
    const huge = "x".repeat(10_000);
    const result = clip(huge, 500);
    expect(result).not.toBeNull();
    expect(result!.length).toBe(500);
  });
});

describe("import caps", () => {
  test("MAX_IMPORT_ROWS and MAX_IMPORT_BYTES are sane bounds", () => {
    expect(MAX_IMPORT_ROWS).toBe(1000);
    expect(MAX_IMPORT_BYTES).toBe(512 * 1024);
  });
});

import { createAdminToken, verifyAdminToken, timingSafeEqualHex } from "@/lib/auth-token";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("createAdminToken / verifyAdminToken", () => {
  test("a freshly created token verifies", async () => {
    const token = await createAdminToken(3600);
    expect(await verifyAdminToken(token)).toBe(true);
  });

  test("token format is v1.<expiry>.<hex signature>", async () => {
    const token = await createAdminToken(3600);
    const parts = token.split(".");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("v1");
    expect(Number.isInteger(Number(parts[1]))).toBe(true);
    expect(parts[2]).toMatch(/^[0-9a-f]{64}$/);
  });

  test("an already-expired token is rejected", async () => {
    const token = await createAdminToken(-10); // expired 10s ago
    expect(await verifyAdminToken(token)).toBe(false);
  });

  test("empty string is rejected", async () => {
    expect(await verifyAdminToken("")).toBe(false);
  });

  test("garbage input is rejected", async () => {
    expect(await verifyAdminToken("not-a-real-token")).toBe(false);
  });

  test("the old static-HMAC token format (no expiry) is rejected", async () => {
    // This is the exact shape the pre-fix token used: a bare hex digest
    // with no version or expiry segment. Confirms old sessions don't
    // silently keep working after the S1 fix deploys.
    expect(await verifyAdminToken("deadbeef".repeat(8))).toBe(false);
  });

  test("wrong version segment is rejected", async () => {
    const token = await createAdminToken(3600);
    const [, exp, sig] = token.split(".");
    expect(await verifyAdminToken(`v2.${exp}.${sig}`)).toBe(false);
  });

  test("tampering with the expiry invalidates the signature", async () => {
    const token = await createAdminToken(3600);
    const [version, exp, sig] = token.split(".");
    const tampered = `${version}.${Number(exp) + 100000}.${sig}`;
    expect(await verifyAdminToken(tampered)).toBe(false);
  });

  test("tampering with the signature invalidates the token", async () => {
    const token = await createAdminToken(3600);
    const [version, exp, sig] = token.split(".");
    const flipped = sig[0] === "0" ? "1" + sig.slice(1) : "0" + sig.slice(1);
    expect(await verifyAdminToken(`${version}.${exp}.${flipped}`)).toBe(false);
  });

  test("a token signed under a different secret does not verify", async () => {
    process.env.AUTH_SECRET = "secret-a";
    const token = await createAdminToken(3600);
    process.env.AUTH_SECRET = "secret-b";
    expect(await verifyAdminToken(token)).toBe(false);
  });

  test("throws in production when AUTH_SECRET is unset", async () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    delete process.env.AUTH_SECRET;
    await expect(createAdminToken(3600)).rejects.toThrow();
  });
});

describe("timingSafeEqualHex", () => {
  test("identical strings are equal", () => {
    expect(timingSafeEqualHex("abcd1234", "abcd1234")).toBe(true);
  });

  test("different strings of the same length are not equal", () => {
    expect(timingSafeEqualHex("abcd1234", "abcd1235")).toBe(false);
  });

  test("different lengths are not equal", () => {
    expect(timingSafeEqualHex("abcd", "abcd1234")).toBe(false);
  });
});

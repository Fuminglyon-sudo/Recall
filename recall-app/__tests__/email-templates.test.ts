import { welcomeEmail, founderWelcomeEmail } from "@/lib/email-templates";

describe("welcomeEmail", () => {
  test("greets by first name only", () => {
    const { html } = welcomeEmail({ name: "Ada Lovelace" });
    expect(html).toContain("Hi Ada,");
    expect(html).not.toContain("Lovelace");
  });

  test("falls back to a generic greeting when name is missing", () => {
    const { html } = welcomeEmail({ name: null });
    expect(html).toContain("Hi there,");
  });

  test("mentions the trial, not a lifetime-free claim", () => {
    const { subject, html } = welcomeEmail({ name: "Ada" });
    expect(subject).not.toMatch(/first 50/i);
    expect(html).toMatch(/14-day free trial/i);
    expect(html).not.toMatch(/free, forever/i);
  });

  test("names all three practice modes as their own steps", () => {
    const { html } = welcomeEmail({ name: "Ada" });
    expect(html).toContain("Add your first word");
    expect(html).toContain("Speak Up");
    expect(html).toContain("Small Talk Lab");
    expect(html).toContain("Debate Lab");
  });

  test("includes the founder's note and signs off as Priscilla", () => {
    const { html } = welcomeEmail({ name: "Ada" });
    expect(html).toMatch(/I'm Priscilla/);
    expect(html).toContain("— Priscilla, founder");
  });

  test("includes the hosted logo image, not an emoji placeholder", () => {
    const { html } = welcomeEmail({ name: "Ada" });
    expect(html).toContain("/brand/app-icon-192.png");
    expect(html).not.toContain("🥁");
  });

  test("has a plain-text alternative with the same key content", () => {
    const { text } = welcomeEmail({ name: "Ada" });
    expect(text).toContain("Hi Ada,");
    expect(text).toContain("Add your first word");
    expect(text).toContain("Speak Up");
    expect(text).toMatch(/I'm Priscilla/);
    expect(text).toMatch(/14-day free trial/i);
    expect(text).not.toMatch(/<[a-z][\s\S]*>/i); // no leftover HTML tags
  });
});

describe("founderWelcomeEmail", () => {
  test("greets by first name only", () => {
    const { html } = founderWelcomeEmail({ name: "Ada Lovelace" });
    expect(html).toContain("Hi Ada,");
    expect(html).not.toContain("Lovelace");
  });

  test("claims free forever, not a 14-day trial", () => {
    const { subject, html } = founderWelcomeEmail({ name: "Ada" });
    expect(subject).toMatch(/first 50/i);
    expect(html).toMatch(/free, forever/i);
    expect(html).not.toMatch(/14-day free trial/i);
  });

  test("names all three practice modes as their own steps", () => {
    const { html } = founderWelcomeEmail({ name: "Ada" });
    expect(html).toContain("Add your first word");
    expect(html).toContain("Speak Up");
    expect(html).toContain("Small Talk Lab");
    expect(html).toContain("Debate Lab");
  });

  test("includes the founder's note and signs off as Priscilla", () => {
    const { html } = founderWelcomeEmail({ name: "Ada" });
    expect(html).toMatch(/I'm Priscilla/);
    expect(html).toContain("— Priscilla, founder");
  });

  test("has a plain-text alternative with the same key content", () => {
    const { text } = founderWelcomeEmail({ name: "Ada" });
    expect(text).toContain("Hi Ada,");
    expect(text).toMatch(/free, forever/i);
    expect(text).toMatch(/I'm Priscilla/);
    expect(text).not.toMatch(/<[a-z][\s\S]*>/i); // no leftover HTML tags
  });
});

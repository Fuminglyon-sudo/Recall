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

  test("includes all three getting-started steps", () => {
    const { html } = welcomeEmail({ name: "Ada" });
    expect(html).toContain("Add your first word");
    expect(html).toContain("Review it");
    expect(html).toContain("Try a practice mode");
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

  test("includes all three getting-started steps", () => {
    const { html } = founderWelcomeEmail({ name: "Ada" });
    expect(html).toContain("Add your first word");
    expect(html).toContain("Review it");
    expect(html).toContain("Try a practice mode");
  });
});

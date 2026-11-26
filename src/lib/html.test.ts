import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./html";

describe("sanitizeHtml", () => {
  it("keeps allowed markup and drops scripts and event handlers", () => {
    const clean = sanitizeHtml('<p onclick="alert(1)">Hi<script>alert(1)</script></p><a href="javascript:alert(1)">link</a>');
    expect(clean).toContain("<p>");
    expect(clean).toContain("Hi");
    expect(clean.toLowerCase()).not.toContain("script");
    expect(clean.toLowerCase()).not.toContain("onclick");
    expect(clean.toLowerCase()).not.toContain("javascript:");
  });
});

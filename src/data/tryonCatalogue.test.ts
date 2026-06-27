import { describe, it, expect } from "vitest";
import { TRYON_LOOKS, PERSON_PRESETS, getLooksByGender, getLookById } from "./tryonCatalogue";

describe("tryonCatalogue", () => {
  it("has exactly 5 looks", () => {
    expect(TRYON_LOOKS).toHaveLength(5);
  });

  it("every look has required fields", () => {
    for (const look of TRYON_LOOKS) {
      expect(look.id).toBeTruthy();
      expect(look.name).toBeTruthy();
      expect(look.gender).toMatch(/^(women|men)$/);
      expect(look.image).toBeTruthy();
      expect(look.shopLink).toBeTruthy();
      expect(look.fabric).toBeTruthy();
      expect(look.description).toBeTruthy();
      expect(look.garmentCategory).toMatch(/^(upper_body|lower_body|dresses)$/);
    }
  });

  it("has unique ids", () => {
    const ids = TRYON_LOOKS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getLooksByGender", () => {
  it("returns 3 women looks", () => {
    const women = getLooksByGender("women");
    expect(women).toHaveLength(3);
    expect(women.every((l) => l.gender === "women")).toBe(true);
  });

  it("returns 2 men looks", () => {
    const men = getLooksByGender("men");
    expect(men).toHaveLength(2);
    expect(men.every((l) => l.gender === "men")).toBe(true);
  });
});

describe("getLookById", () => {
  it("finds churidar by id", () => {
    const look = getLookById("tryon-churidar");
    expect(look).toBeDefined();
    expect(look!.name).toBe("Churidar Kurta");
  });

  it("returns undefined for unknown id", () => {
    expect(getLookById("nonexistent")).toBeUndefined();
  });
});

describe("PERSON_PRESETS", () => {
  it("has 4 presets", () => {
    expect(PERSON_PRESETS).toHaveLength(4);
  });

  it("has 2 women and 2 men presets", () => {
    const women = PERSON_PRESETS.filter((p) => p.gender === "women");
    const men = PERSON_PRESETS.filter((p) => p.gender === "men");
    expect(women).toHaveLength(2);
    expect(men).toHaveLength(2);
  });

  it("every preset has required fields", () => {
    for (const p of PERSON_PRESETS) {
      expect(p.id).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.src).toBeTruthy();
    }
  });
});

import { describe, it, expect } from "vitest";
import { extendRuleset, makeRuleset } from "./tools";
import type { Player, Rule } from "./types";

interface PlayerWithA extends Player {
  a: string;
}

interface PlayerWithB extends Player {
  b: string;
}

const sampleRuleA: Rule<PlayerWithA, "sample-rule-A"> = {
  id: "sample-rule-A",
  description: "A sample rule for testing A",
  validate(_tournamentState, _currentTeams, _teamToValidate) {
    return [];
  },
};

const sampleRuleB: Rule<PlayerWithB, "sample-rule-B"> = {
  id: "sample-rule-B",
  description: "A sample rule for testing B",
  validate(_tournamentState, _currentTeams, _teamToValidate) {
    return [];
  },
};

describe("tools functions", () => {
  it("should create a ruleset", () => {
    const rulesetName = "Test Ruleset";
    const rulesetLink = "http://example.com/ruleset";
    const ruleset = makeRuleset(rulesetName, rulesetLink, [sampleRuleA, sampleRuleB]);
    expect(ruleset.name).toBe(rulesetName);
    expect(ruleset.link).toBe(rulesetLink);
    expect(ruleset.rules).toHaveLength(2);
    expect(ruleset.rules).toContain(sampleRuleA);
    expect(ruleset.rules).toContain(sampleRuleB);
  });

  it("should extend a ruleset adding a new rule", () => {
    const rulesetName = "Test Ruleset";
    const rulesetLink = "http://example.com/ruleset";
    const ruleset = makeRuleset(rulesetName, rulesetLink, [sampleRuleA]);
    const newRulesetName = "Test Ruleset";
    const newRulesetLink = "http://example.com/ruleset";
    const newRuleset = extendRuleset(ruleset, newRulesetName, newRulesetLink, [], [sampleRuleB]);
    expect(newRuleset.name).toBe(newRulesetName);
    expect(newRuleset.link).toBe(newRulesetLink);
    expect(newRuleset.rules).toHaveLength(2);
    expect(newRuleset.rules).toContain(sampleRuleA);
    expect(newRuleset.rules).toContain(sampleRuleB);
  });

  it("should extend a ruleset adding a new rule and removing an existing one", () => {
    const rulesetName = "Test Ruleset";
    const rulesetLink = "http://example.com/ruleset";
    const ruleset = makeRuleset(rulesetName, rulesetLink, [sampleRuleA]);
    const newRulesetName = "Test Ruleset";
    const newRulesetLink = "http://example.com/ruleset";
    const newRuleset = extendRuleset(
      ruleset,
      newRulesetName,
      newRulesetLink,
      ["sample-rule-A"],
      [sampleRuleB],
    );
    expect(newRuleset.name).toBe(newRulesetName);
    expect(newRuleset.link).toBe(newRulesetLink);
    expect(newRuleset.rules).toHaveLength(1);
    expect(newRuleset.rules).not.toContain(sampleRuleA);
    expect(newRuleset.rules).toContain(sampleRuleB);
  });
});

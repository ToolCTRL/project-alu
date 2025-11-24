# Enhanced Test Architect Module

**Version:** 1.0.0
**Pattern:** Master/Sub-TEA with Interactive Framework Selection

## Problem Solved

Comprehensive test strategy creation → Context overflow (unit + integration + e2e + performance + security = 200K+ tokens).

## Solution

Master-TEA orchestrates specialized sub-test-architects:
- Unit-Test-Strategist-Sub
- Integration-Test-Strategist-Sub
- E2E-Test-Strategist-Sub
- Performance-Test-Strategist-Sub
- Security-Test-Strategist-Sub
- Test-Infrastructure-Sub

Each sub-TEA: 0-150K → closes → Master stays at ~30K.

## Key Features

✅ **Comprehensive Coverage** - Unit, integration, e2e, performance, security
✅ **Interactive Framework Selection** - Asks before choosing Jest vs Vitest vs Pytest
✅ **Coverage Target Decisions** - User defines acceptable coverage thresholds
✅ **CI/CD Integration Strategy** - Test automation pipeline design
✅ **Test Data Strategy** - Fixtures, mocks, factories approach
✅ **Quality-Based Refinement** - Auto-refine strategies < 6.0/10

## Workflows

1. **create-test-strategy** - Comprehensive test strategy creation
2. **validate-test-strategy** - Coverage and completeness validation

## Interactive Decisions

- Test frameworks (Jest, Vitest, Pytest, Playwright, Cypress)
- Coverage targets (80%, 90%, critical paths only)
- CI/CD integration (GitHub Actions, GitLab CI, Jenkins)
- Test data approach (fixtures, mocks, factories, real data)
- Performance testing tools (k6, JMeter, Gatling)
- Security testing scope (OWASP top 10, penetration testing)

## Usage

```bash
/bmad:enhanced-test-architect:agents:master-tea
→ create-test-strategy
```

**Input:** Architecture from Enhanced-Architect + Stories from Enhanced-SM
**Output:** Complete test strategy docs

## Output Structure

```
docs/testing/
├── test-strategy-complete.md
├── unit-test-strategy.md
├── integration-test-strategy.md
├── e2e-test-strategy.md
├── performance-test-strategy.md
├── security-test-strategy.md
└── test-infrastructure.md
```

## Integration

Enhanced-Architect + Enhanced-SM → **Enhanced-Test-Architect** → Enhanced-Dev

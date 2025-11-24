# Validate PRD Workflow Instructions



Comprehensive PRD validation using sub-PM validators.

## Steps

### 1. Load PRD

```yaml
- Load all sections
- Load all epics
- Load status file
```

### 2. Quality Validation

```yaml
Spawn Quality-Validator-PM:

  Checks:
    Vision:
      ✓ Clear and specific
      ✓ Measurable KPIs
      ✓ Compelling

    Epics:
      ✓ Clear AC
      ✓ Testable
      ✓ Complete

  Output: Quality scores per section
```

### 3. MECE Validation

```yaml
Spawn MECE-Validator-PM:

  Checks:
    ✓ Epics mutually exclusive (no overlaps)
    ✓ Epics collectively exhaustive (all requirements covered)
    ✓ Clear boundaries

  Output: MECE compliance report
```

### 4. Metrics Validation

```yaml
Spawn Metrics-Validator-PM:

  Checks:
    ✓ All KPIs measurable
    ✓ Success criteria defined
    ✓ Realistic targets

  Output: Metrics validation report
```

### 5. Dependency Validation

```yaml
Check:
  ✓ All dependencies identified
  ✓ No circular dependencies
  ✓ Dependencies realistic
```

### 6. Final Report

```yaml
Display:

✅ PRD Validation Results

Quality:
  Vision: {score}/10
  Epics Avg: {score}/10

MECE:
  {PASS | FAIL}
  {issues if any}

Metrics:
  {PASS | FAIL}
  {issues if any}

Dependencies:
  {PASS | FAIL}

Overall: {READY | NEEDS_WORK}

{if issues}:
  Recommendations:
  {list fixes}

Next: {refine-prd | proceed to SM}
```

Communicate in {communication_language}

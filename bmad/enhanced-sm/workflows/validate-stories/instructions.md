# Validate Stories Workflow Instructions



Comprehensive story validation using specialized sub-SM validators.

## Steps

### 1. Load Stories

```yaml
Load all story files:
  Location: {project-root}/.bmad/stories/story-*.md

Load dependency graph:
  Location: {project-root}/.bmad/stories/dependency-graph.yaml

Load status:
  Location: {status_location}/status.yaml

Display:
  🔍 Validate Stories Workflow

  Stories loaded: {count}
  Dependency graph: Loaded ✓
```

### 2. Quality Validation

```yaml
Spawn Quality-Validator-SM:

  Input:
    - All story files
    - Quality criteria from workflow.yaml

  Checks:
    INVEST Compliance:
      ✓ Independent, Negotiable, Valuable
      ✓ Estimable, Small, Testable

    Acceptance Criteria:
      ✓ At least 3 AC per story
      ✓ All AC testable and measurable
      ✓ Edge cases covered

    Task Breakdown:
      ✓ Clear and actionable
      ✓ Complete (nothing missing)
      ✓ Test tasks included

    Dependencies:
      ✓ Blockers identified
      ✓ Prerequisites identified

    Technical Notes:
      ✓ Helpful implementation guidance

    Test Strategy:
      ✓ Unit, integration, e2e defined
      ✓ Coverage goals stated

  Output:
    Per-story quality scores (1-10)
    Issues list with severity and recommendations
    Overall quality assessment

Quality-Validator-SM closes → context freed!

Display:
  ✓ Quality validation completed

  Average Scores:
    INVEST: {score}/10
    AC Quality: {score}/10
    Task Breakdown: {score}/10
    Dependencies: {score}/10
    Technical Notes: {score}/10
    Test Strategy: {score}/10

  Overall: {avg_score}/10

  {if issues}:
    ⚠️ Issues Found: {count}
    {list high-severity issues}
```

### 3. INVEST Validation

```yaml
Spawn INVEST-Validator-SM:

  Input:
    - All stories
    - Epic context

  Deep Checks:
    Independent:
      ✓ Can develop without waiting
      ✓ Minimal coupling
      ✓ All context present

    Negotiable:
      ✓ Implementation flexible
      ✓ Not overly prescriptive

    Valuable:
      ✓ Clear user/business value
      ✓ Measurable impact

    Estimable:
      ✓ Team can estimate
      ✓ Enough detail
      ✓ Not ambiguous

    Small:
      ✓ Fits in sprint
      ✓ Points reasonable (≤13)

    Testable:
      ✓ AC testable
      ✓ Success/failure clear

  Output:
    Detailed INVEST compliance per story
    Stories that fail INVEST
    Recommendations for fixes

INVEST-Validator-SM closes → context freed!

Display:
  ✓ INVEST validation completed

  {if all compliant}:
    ✅ All stories INVEST-compliant

  {else}:
    ⚠️ INVEST Issues:
    {list stories with issues}
```

### 4. Dependency Validation

```yaml
Spawn Dependency-Validator-SM:

  Input:
    - All stories
    - Dependency graph

  Checks:
    Completeness:
      ✓ All blockers identified
      ✓ All prerequisites identified
      ✓ Technical deps documented

    Correctness:
      ✓ Dependencies logical
      ✓ Align with epic structure

    Circular Dependencies:
      ✓ No cycles in graph
      {if cycles}: CRITICAL ERROR

    Resolvability:
      ✓ Dependencies satisfiable
      ✓ Dependent stories exist
      ✓ Realistic sequencing

  Output:
    Dependency validation status (PASS/FAIL)
    Circular dependency chains (if any)
    Missing dependencies
    Dependency graph validity

Dependency-Validator-SM closes → context freed!

Display:
  ✓ Dependency validation completed

  {if PASS}:
    ✅ Dependencies valid
    No circular dependencies ✓

  {else}:
    ❌ Dependency Issues:
    {list issues}

    {if circular deps}:
      🔴 CRITICAL: Circular dependencies detected
      {show cycle chains}
      {suggest resolution}
```

### 5. Aggregate Results

```yaml
Combine all validation results:

Quality Validation:
  - Per-story scores
  - Overall average
  - Issues list

INVEST Validation:
  - INVEST compliance per story
  - Non-compliant stories
  - Recommendations

Dependency Validation:
  - Dependency graph status
  - Circular dependencies
  - Missing dependencies

Calculate Final Status:
  IF all_validations_pass AND avg_quality >= threshold:
    status = "READY_FOR_DEV"
  ELIF critical_issues (circular deps):
    status = "BLOCKED"
  ELSE:
    status = "NEEDS_IMPROVEMENT"
```

### 6. Generate Validation Report

```yaml
Write: {project-root}/.bmad/stories/validation-report.md

Content:
  # Story Validation Report

  **Date:** {timestamp}
  **Stories Validated:** {count}
  **Overall Status:** {READY_FOR_DEV | NEEDS_IMPROVEMENT | BLOCKED}

  ## Quality Scores

  | Story ID | INVEST | AC | Tasks | Deps | Tech | Tests | Total |
  |----------|--------|----|----|------|------|-------|-------|
  | STORY-1  | 8.5    | 7.5| 8.0| 7.0  | 6.5  | 8.5   | 7.8   |
  | ...      | ...    | ...| ...| ...  | ...  | ...   | ...   |

  **Average:** {avg}/10

  ## INVEST Compliance

  ✅ Compliant: {count}
  ⚠️ Non-Compliant: {count}

  {if non-compliant}:
    ### Non-Compliant Stories:
    - STORY-X: Fails "Small" (21 points, should split)
    - STORY-Y: Fails "Testable" (AC not measurable)

  ## Dependency Analysis

  {if PASS}:
    ✅ All dependencies valid
    - Story dependencies: {count}
    - Epic dependencies: {count}
    - Technical dependencies: {count}
    - Circular dependencies: None ✓

  {else}:
    ❌ Dependency Issues:
    {list issues}

  ## Issues Summary

  ### Critical ({count}):
  {list critical issues}

  ### High ({count}):
  {list high issues}

  ### Medium ({count}):
  {list medium issues}

  ### Low ({count}):
  {list low issues}

  ## Recommendations

  {for each issue}:
    - **{story_id}** ({severity}): {issue}
      → Fix: {recommendation}

  ## Next Steps

  {if READY_FOR_DEV}:
    ✅ Stories ready for development!
    → Run /bmad:enhanced-sm:workflows:plan-sprint

  {elif NEEDS_IMPROVEMENT}:
    ⚠️ Address issues before development
    → Run /bmad:enhanced-sm:workflows:refine-stories (future)
    → Or manually fix issues

  {elif BLOCKED}:
    🔴 Critical issues block development
    → Resolve circular dependencies
    → Re-run validation after fixes

Display:
  ✓ Validation report: validation-report.md
```

### 7. Write Quality Scores File

```yaml
Write: {project-root}/.bmad/stories/quality-scores.yaml

Content:
  stories:
    - story_id: "STORY-1"
      scores:
        invest: 8.5
        ac: 7.5
        tasks: 8.0
        deps: 7.0
        tech: 6.5
        tests: 8.5
        total: 7.8
      invest_compliant: true
      ready_for_dev: true
    - ...

  overall:
    avg_invest: 8.2
    avg_ac: 7.3
    avg_tasks: 7.8
    avg_deps: 7.1
    avg_tech: 6.8
    avg_tests: 8.0
    avg_total: 7.5

  validation:
    invest_compliant: 95%  # 19/20 stories
    dependencies_valid: true
    ready_for_dev: false  # due to 1 non-compliant story

Display:
  ✓ Quality scores: quality-scores.yaml
```

### 8. Write Issues List

```yaml
Write: {project-root}/.bmad/stories/validation-issues.md

Content:
  # Validation Issues

  {for each issue}:
    ## {story_id}: {issue_title}

    **Severity:** {critical|high|medium|low}
    **Category:** {invest|ac|tasks|deps|tech|tests}

    **Issue:**
    {description}

    **Recommendation:**
    {how_to_fix}

    **Impact:**
    {what_happens_if_not_fixed}

    ---

Display:
  ✓ Issues list: validation-issues.md
```

### 9. Update Status File

```yaml
Update: {status_location}/status.yaml

  stories:
    validated: {count}

  validation:
    invest_compliant: {percentage}
    dependencies_valid: {true|false}
    avg_quality_score: {score}
    ready_for_dev: {true|false}

  quality:
    avg_invest: {score}
    avg_ac: {score}
    avg_tasks: {score}
    avg_deps: {score}
    avg_tests: {score}

  {if issues}:
    warnings:
      - timestamp: {now}
        level: {critical|warning}
        message: "{issue summary}"
        phase: "validation"

  next_steps:
    {if ready}:
      - action: "Run plan-sprint"
        priority: "high"

    {else}:
      - action: "Fix validation issues"
        priority: "high"
      - action: "Re-run validation"
        priority: "medium"
```

### 10. Display Final Summary

```yaml
Display:

  ✅ Validate Stories Workflow Completed!

  📊 Summary:

  Stories Validated: {count}
  Overall Quality: {avg_score}/10

  INVEST Compliance: {percentage}% ({compliant}/{total})
  Dependencies: {VALID | ISSUES}

  Issues:
    Critical: {count} 🔴
    High: {count} ⚠️
    Medium: {count}
    Low: {count}

  Files Generated:
    ✓ validation-report.md
    ✓ quality-scores.yaml
    ✓ validation-issues.md

  Overall Status: {READY_FOR_DEV | NEEDS_IMPROVEMENT | BLOCKED}

  {if READY_FOR_DEV}:
    ✅ All stories ready for development!

    Next Steps:
      1. Run /bmad:enhanced-sm:workflows:plan-sprint
      2. Start development with Enhanced-Dev

  {elif NEEDS_IMPROVEMENT}:
    ⚠️ Issues need to be addressed

    Next Steps:
      1. Review validation-issues.md
      2. Fix issues manually or use refine workflow
      3. Re-run validation

  {elif BLOCKED}:
    🔴 Critical issues block development

    Critical Issues:
      {list critical issues}

    Next Steps:
      1. Resolve circular dependencies
      2. Fix critical issues
      3. Re-run validation
```

Communicate in {communication_language}

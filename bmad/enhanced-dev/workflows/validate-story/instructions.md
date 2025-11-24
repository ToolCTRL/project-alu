# Validate Story Workflow Instructions



Validate that a story is ready for development by checking prerequisites, context, and acceptance criteria.

## Steps

### 1. Load Story

```yaml
- Load story from {story_file} or auto-discover
- Parse story structure
- Extract key elements:
  - Acceptance Criteria
  - Tasks/Subtasks
  - Dependencies
  - Test requirements
```

### 2. Validate Story Structure

```yaml
Check:
  ✓ Story has ID
  ✓ Story has title
  ✓ Story has description
  ✓ Story has acceptance criteria (minimum 1)
  ✓ Story has tasks defined
  ✓ Story status is appropriate

Fail if ANY required element missing
```

### 3. Validate Context

```yaml
Check context file at {context_file}:
  ✓ File exists
  ✓ File is valid XML
  ✓ Contains required sections:
    - Existing code patterns
    - Technical specifications
    - Dependencies
    - Architecture guidelines

If missing:
  → Suggest running story-context workflow
  → Provide command to generate context
```

### 4. Validate Acceptance Criteria

```yaml
For each AC:
  ✓ Clearly defined
  ✓ Testable
  ✓ Specific (not vague)
  ✓ Mapped to tasks

Warn if:
  - AC is vague ("improve performance")
  - AC has no clear success criteria
  - AC is not testable
```

### 5. Validate Dependencies

```yaml
Check:
  ✓ All dependencies defined
  ✓ Dependencies exist
  ✓ No circular dependencies
  ✓ External dependencies documented
```

### 6. Validate Test Requirements

```yaml
Check:
  ✓ Test types specified (unit/integration/e2e)
  ✓ Test command configured
  ✓ Test environment requirements documented
```

### 7. Update Status

```yaml
Write to {status_file}:
  validation:
    story_validated: true/false
    context_loaded: true/false
    acceptance_criteria_met: true/false
    issues: [list of issues]
    warnings: [list of warnings]
```

### 8. Report Results

```yaml
Display:

✅ Story Validation Results

Story: {story_id} - {story_title}

Structure: {PASS|FAIL}
  ✓ ID, title, description present
  {issues if any}

Context: {PASS|FAIL|WARNING}
  ✓ Context file exists
  ✓ Valid XML structure
  {issues if any}

Acceptance Criteria: {PASS|FAIL|WARNING}
  ✓ {count} criteria defined
  ✓ All testable
  {warnings if any}

Dependencies: {PASS|FAIL}
  ✓ All dependencies valid
  {issues if any}

Tests: {PASS|FAIL}
  ✓ Test requirements documented
  ✓ Test command configured

Overall: {READY|NOT_READY|READY_WITH_WARNINGS}

{if NOT_READY}:
  ❌ Must fix before development:
  {list issues}

{if READY_WITH_WARNINGS}:
  ⚠️ Warnings (can proceed but review):
  {list warnings}

{if READY}:
  ✅ Story is ready for development
  → Run dev-story workflow to start

Next Steps:
  {appropriate next actions based on status}
```

## Validation Criteria

**PASS**: All checks successful

**READY_WITH_WARNINGS**: Passes but has minor issues

**FAIL**: Critical issues must be fixed

## Communication

Communicate in {communication_language}

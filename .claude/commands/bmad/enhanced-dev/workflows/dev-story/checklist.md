# Enhanced Dev Story - Quality Checklist

## Pre-Execution Validation

- [ ] Story file exists and is readable
- [ ] Story has acceptance criteria defined
- [ ] Story context file exists at {context_file}
- [ ] Story status is "approved" or "ready"
- [ ] Status file location is writable
- [ ] Git repository is initialized
- [ ] Test command {run_tests_command} is configured

## Task Execution Validation

For EACH task:

- [ ] Task description is clear and actionable
- [ ] Acceptance criteria mapped to task
- [ ] Appropriate sub-developer type selected
- [ ] Task timeout configured
- [ ] Dependency tasks completed first

## Sub-Developer Spawn Validation

- [ ] Task tool called with correct subagent_type
- [ ] Complete context provided in prompt
- [ ] Test requirements specified
- [ ] Max duration set
- [ ] Success/failure criteria clear

## Testing Validation

For EACH completed task:

- [ ] Tests written (unit and/or integration)
- [ ] Tests executed
- [ ] ALL tests passing (no exceptions)
- [ ] Test output captured and logged
- [ ] Coverage meets threshold (if applicable)

## Git Commit Validation

When {auto_commit} = true:

- [ ] Only relevant files staged
- [ ] Commit message follows template
- [ ] Commit message includes task ID
- [ ] Commit message includes test status
- [ ] Commit hash captured in status
- [ ] No uncommitted changes left

## Fix Flow Validation

When task fails:

- [ ] Error clearly identified
- [ ] Error logs captured
- [ ] Fix-developer spawned with error context
- [ ] Fix attempt tracked (1/2/3)
- [ ] Max retries enforced
- [ ] Blocked status set if all attempts fail

## Anti-Loop Validation

Throughout workflow:

- [ ] Task timeout enforced
- [ ] Max fix retries enforced (3)
- [ ] Max loop iterations tracked
- [ ] No infinite retry loops
- [ ] Blocked tasks skipped, not retried endlessly

## Status File Validation

After EACH major action:

- [ ] Status file updated
- [ ] Timestamp accurate
- [ ] Task status correct (pending/in_progress/completed/blocked)
- [ ] Progress metrics calculated
- [ ] Test results logged
- [ ] Commit hashes recorded

## Progress Reporting Validation

After EACH task:

- [ ] User informed of task completion/failure
- [ ] Clear error messages if blocked
- [ ] Progress percentage displayed
- [ ] Test summary shown
- [ ] Commit info displayed if committed

## Final Validation

After ALL tasks:

- [ ] Full test suite executed
- [ ] Coverage calculated
- [ ] All completed tasks have commits
- [ ] All blocked tasks documented
- [ ] Final status file written
- [ ] Comprehensive summary displayed

## Summary Report Validation

- [ ] Clear completion count (X/Y tasks)
- [ ] Test results summary
- [ ] Coverage percentage
- [ ] Commit count
- [ ] Blocked tasks listed with errors
- [ ] Next steps suggested
- [ ] Ready-for-review status set appropriately

## Error Handling Validation

- [ ] All errors caught gracefully
- [ ] Error details logged to status
- [ ] User informed of errors clearly
- [ ] Workflow doesn't crash on error
- [ ] Progress saved even on error

## Communication Validation

- [ ] All messages in {communication_language}
- [ ] Clear and concise updates
- [ ] Technical details when needed
- [ ] Next steps always provided
- [ ] No jargon without explanation

## Success Criteria

Workflow passes quality check if:

- ✓ All attempted tasks are documented
- ✓ Status file is accurate and complete
- ✓ User is fully informed
- ✓ No infinite loops occurred
- ✓ All successful tasks are committed
- ✓ Blocked tasks have clear error reports
- ✓ Tests were run for all implementations

**Note:** 100% task completion is NOT required - properly documented blocked tasks are acceptable.

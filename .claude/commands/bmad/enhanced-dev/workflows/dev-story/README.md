# Enhanced Dev Story Workflow

Orchestrated story development using the sub-developer pattern with isolated contexts, autonomous fix management, and comprehensive status tracking.

## Overview

This workflow revolutionizes how stories are developed by:

- **Master-Developer Pattern**: The Master Developer orchestrates but never implements
- **Sub-Developer Spawning**: Each task gets a specialized sub-developer with fresh context
- **Context Isolation**: Prevents context overflow - each sub-dev gets max 200K tokens then closes
- **Autonomous Fixes**: Master automatically spawns fix-developers when tasks fail (max 3 attempts)
- **Status Tracking**: Real-time progress tracking in `.bmad/enhanced-dev/status.yaml`
- **Anti-Loop Guards**: Max retries enforced - no endless debugging cycles
- **Test-Driven**: Every implementation includes tests - all must pass before commit

## How It Works

```
User → Master-Developer
         ↓
         1. Loads story + context
         2. Plans tasks
         3. For each task:
            ↓
            → Spawns Sub-Developer (Task tool)
              → Sub-Dev: Implements + Tests in isolated context
              → Returns result
              → Context closes (freed!)
            ↓
            → If success: Git commit
            → If failure: Spawn Fix-Developer (max 3x)
            → If still blocked: Skip + log + continue
         ↓
         4. Final summary + next steps
```

## Key Features

### 🎯 Isolated Context Per Task

Each sub-developer gets its own context window:
- No context pollution
- Can handle large codebases
- Parallel execution possible
- Clean state every task

### 🔧 Autonomous Fix Management

When tasks fail:
1. Master analyzes error
2. Spawns Fix-Developer with error context
3. Fix-Dev attempts repair
4. Max 3 fix attempts
5. If still blocked → Skip, log, continue

**User does NOTHING manually!**

### 📊 Real-Time Status Tracking

Every action updates `.bmad/enhanced-dev/status.yaml`:
```yaml
current_story: story-042
tasks:
  - id: task-1
    status: completed
    tests_passed: true
    committed: true
  - id: task-2
    status: blocked
    error: "DB timeout"
    attempts: 3
progress: 1/5 tasks (20%)
```

### 🛡️ Anti-Loop Guards

Prevents endless cycles:
- Max 3 implementation attempts
- Max 3 fix attempts per task
- Task timeout (15 minutes default)
- Max workflow iterations (10 default)

After limits → Skip task, continue workflow

### ✅ Test-Driven Development

Every sub-developer:
- Writes tests (unit/integration)
- Runs tests
- Must have ALL tests passing
- No exceptions - no fake passes

Test types:
- **Backend tasks**: Unit + Integration tests
- **Frontend tasks**: Component + Unit tests
- **E2E tasks**: Playwright E2E (separate task)

### 🔄 Git Integration

Auto-commit when `auto_commit: true`:
- Commits after each successful task
- Follows commit message template
- Includes task ID, test status
- Tracks commit hashes in status

## Usage

### From Master-Developer Agent

```bash
/master-dev

Menu appears:
3. *dev-story - Develop story using sub-developer pattern
```

### Direct Workflow Call

```bash
/bmad:enhanced-dev:workflows:dev-story
```

### Configuration

Edit `bmad/enhanced-dev/config.yaml`:

```yaml
# Testing
run_tests_command: "npm test"
test_coverage_threshold: 80

# Retries & Timeouts
max_task_retries: 3
max_fix_retries: 3
task_timeout_minutes: 15

# Git
auto_commit: true
commit_on_task_complete: true

# Deployment
auto_deploy: false
```

## Workflow Steps

1. **Initialize**
   - Load/create status file
   - Load story + context
   - Parse tasks from story

2. **Validate Prerequisites**
   - Story approved?
   - Context exists?
   - AC defined?

3. **Plan Tasks**
   - Decompose story
   - Assign sub-developer types
   - Determine dependencies

4. **Execute Tasks**
   - For each task:
     - Spawn sub-developer
     - Implement + test
     - If fail → Auto-fix (3x)
     - If success → Git commit
     - If blocked → Skip + log

5. **Final Validation**
   - Run full test suite
   - Check coverage
   - List blocked tasks

6. **Summary**
   - Display results
   - Suggest next steps
   - Update status

## Status File Structure

`.bmad/enhanced-dev/status.yaml`:

```yaml
current_story:
  id: "story-042"
  status: "in_progress"
  started: "2025-11-02T14:30:00Z"

tasks:
  - id: "task-1"
    description: "Create API endpoint"
    type: "backend"
    status: "completed"
    subagent_type: "backend-architect"
    started_at: "2025-11-02T14:31:00Z"
    completed_at: "2025-11-02T14:35:00Z"
    tests_passed: true
    committed: true
    commit_hash: "abc123"

  - id: "task-2"
    description: "Add frontend component"
    type: "frontend"
    status: "in_progress"
    subagent_type: "frontend-developer"
    started_at: "2025-11-02T14:36:00Z"

  - id: "task-3"
    description: "Integration tests"
    status: "blocked"
    error: "Database connection timeout"
    attempts: 3
    last_error_log: "..."
    suggestion: "Check DB config"

progress:
  total_tasks: 5
  completed: 1
  in_progress: 1
  blocked: 1
  pending: 2
  percentage: 20

tests:
  passing: 12
  failing: 3
  coverage: 75
  last_run: "2025-11-02T14:35:00Z"

commits:
  count: 1
  latest_hash: "abc123"
  latest_message: "feat: Create API endpoint..."
```

## Example Output

```
📊 Enhanced Dev Story

Story: STORY-042 - User Authentication
Started: 14:30

Progress: 3/5 Tasks Completed (60%)

✅ Task 1: Create auth API endpoint
   Duration: 4min
   Tests: 8/8 passing
   Commit: abc123

✅ Task 2: Add login UI component
   Duration: 6min
   Tests: 12/12 passing
   Commit: def456

❌ Task 3: Database integration
   Status: BLOCKED after 3 attempts
   Error: Connection timeout to PostgreSQL
   Suggestion: Verify DB config or use connection pool

⏳ Task 4: E2E tests (pending)
⏳ Task 5: Documentation (pending)

Tests Overall:
  ✓ 20 passing
  ✗ 3 failing
  📈 Coverage: 75%

Git:
  📝 2 commits
  🔖 Latest: def456

Next Steps:
  → Review blocked task (DB integration)
  → Try alternative DB config
  → Or skip and continue with E2E tests
```

## Troubleshooting

### Task keeps failing

**Check:**
- Error logs in status file
- Test output
- Sub-developer prompt clarity

**Solutions:**
- Adjust task description
- Break into smaller tasks
- Try different sub-developer type

### Context overflow

**This should NOT happen** - each sub-dev has isolated context!

If it does:
- Check task complexity
- Break into smaller sub-tasks
- Reduce context file size

### Tests always failing

**Check:**
- Test command correct?
- Dependencies installed?
- Test environment configured?

**Sub-developers will:**
- Attempt fixes automatically (3x)
- Then block and continue

### Too many blocked tasks

**If >50% blocked:**
- Story might be too complex
- Break into smaller stories
- Review acceptance criteria clarity
- Check environment setup

## Best Practices

1. **Clear Acceptance Criteria**
   - Sub-developers rely on clear AC
   - Vague AC = blocked tasks

2. **Proper Story Context**
   - Run `story-context` workflow first
   - Ensure context file is complete

3. **Test Environment Ready**
   - Install dependencies
   - Configure test DB
   - Set environment variables

4. **Small, Focused Tasks**
   - Better for sub-developers
   - Easier to fix if blocked
   - Cleaner commits

5. **Review Blocked Tasks**
   - Check suggestions in status
   - Often simple config issues
   - Can retry with different approach

## Integration

Works with:
- **validate-story**: Run before dev-story
- **code-review**: Run after dev-story
- **deploy**: Run when ready
- **BMM workflows**: Compatible with BMM stories

## Performance

- **Average task**: 3-10 minutes
- **Fix attempts**: 2-5 minutes each
- **5 task story**: 30-60 minutes total
- **Context**: Master uses <30K, sub-devs 0-150K each

## Limitations

- Sequential by default (can parallelize independent tasks)
- Requires clear acceptance criteria
- Needs proper test environment
- Auto-fixes work best for simple errors
- Complex architectural issues may need manual review

## Future Enhancements

- [ ] Parallel task execution option
- [ ] Learning from blocked tasks
- [ ] Suggested alternative approaches
- [ ] Integration with deployment pipelines
- [ ] Performance metrics and optimization
- [ ] Sub-developer specialization learning

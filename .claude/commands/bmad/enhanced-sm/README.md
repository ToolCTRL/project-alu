# Enhanced Scrum Master Module

**Version:** 1.0.0
**BMAD Version:** 6.0.0

## The Problem: Context Overflow in Story Creation

Traditional Scrum Master agents face critical limitations:

```
Traditional SM Agent:
├─ Load 20 epics (100K tokens)
├─ Extract 80 stories (150K tokens)
├─ Write all stories (300K tokens)
└─ Context: 550K tokens ❌ OVERFLOW!

Result:
❌ Agent crashes or loses context
❌ Later stories have poor quality
❌ Manual intervention required
❌ Inconsistent story format
```

## The Solution: Master/Sub-SM Pattern

Enhanced-SM uses **context isolation** through specialized sub-SMs:

```
Master-SM (Coordinator)
│  Context: ~30K tokens
│
├─► Story-Writer-SM (Batch 1: 10 simple stories)
│   Context: 0-150K → CLOSES → Returns compact results
│   Master receives: 20K story data
│
├─► Story-Writer-SM (Batch 2: 5 medium stories)
│   Context: 0-150K → CLOSES → Returns compact results
│   Master receives: 15K story data
│
├─► Story-Validator-SM
│   Context: 0-150K → CLOSES → Returns validation report
│   Master receives: 10K validation data
│
└─► Sprint-Planner-SM
    Context: 0-150K → CLOSES → Returns sprint plan
    Master receives: 15K sprint data

Total Master Context: ~90K ✓ NO OVERFLOW!
```

## Key Features

### 1. Context Isolation
- **Master-SM**: Coordinates workflows, maintains ~30K context
- **Sub-SMs**: Execute in isolated 0-150K contexts, then close
- **Result**: No context overflow, unlimited story capacity

### 2. Dynamic Story Batching

```yaml
Story Complexity Classification:
  Simple (1-2 tasks, 1-3 points):
    Batch Size: 10 stories
    Examples: Logout, basic forms, simple UI

  Medium (3-5 tasks, 5-8 points):
    Batch Size: 5 stories
    Examples: Login, password reset, OAuth

  Complex (6+ tasks, 13+ points):
    Batch Size: 2 stories
    Examples: SSO integration, multi-factor auth
```

### 3. Quality-Based Auto-Refinement

```yaml
Story-Writer-SM creates stories → Quality Score: 5.2/10

IF score < 6.0 AND auto_refine = true:
  Spawn Refine-Story-SM
  Max 2 refinement attempts
  Accept best version

Result: Autonomous quality improvement, no manual intervention
```

### 4. INVEST Compliance Validation

Every story validated against INVEST principles:

- **I**ndependent: Can be developed independently
- **N**egotiable: Details can be discussed
- **V**aluable: Clear value to user
- **E**stimable: Can be estimated
- **S**mall: Fits in sprint
- **T**estable: Has testable acceptance criteria

### 5. Intelligent Dependency Management

```yaml
Dependency-Analyzer-SM:
  - Identifies story-to-story dependencies (blocks, depends_on)
  - Identifies epic-level dependencies
  - Identifies technical dependencies (services, infrastructure)
  - Detects circular dependencies (CRITICAL ERROR if found)
  - Creates dependency graph for sprint planning
```

### 6. Capacity-Aware Sprint Planning

```yaml
Sprint-Planner-SM:
  Input:
    - Team capacity (velocity, availability, constraints)
    - Prioritized stories (business value, dependencies, risk, effort)
    - Dependency graph

  Output:
    - Sprint plan(s) with optimal story selection
    - Capacity utilization tracking
    - Backlog prioritization
    - Risk identification
```

### 7. Real-Time Status Tracking

Status file tracks:
- Story creation progress (batches, quality scores)
- Validation results (INVEST compliance, dependencies)
- Sprint planning (capacity, story assignments)
- Warnings and issues
- Next steps

## Module Structure

```
enhanced-sm/
├── agents/
│   └── master-sm.agent.yaml         # Master orchestrator
│
├── workflows/
│   ├── create-stories/               # Main story creation workflow
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── checklist.md
│   │
│   ├── validate-stories/             # Story validation workflow
│   │   ├── workflow.yaml
│   │   └── instructions.md
│   │
│   └── plan-sprint/                  # Sprint planning workflow
│       ├── workflow.yaml
│       └── instructions.md
│
├── status/
│   └── sm-status-template.yaml      # Status tracking template
│
├── _module-installer/
│   └── install-config.yaml          # Installation configuration
│
├── config.yaml                       # Module configuration
└── README.md                         # This file
```

## Workflows

### 1. create-stories

**Input:** Epic files (from Enhanced-PM or BMM-PM)
**Output:** Story files in `.bmad/stories/`

**Process:**
1. Load epic files
2. Extract story requirements from epics
3. Classify story complexity (simple/medium/complex)
4. Create dynamic batches based on complexity
5. Spawn Story-Writer-SM for each batch
6. Quality validation + auto-refinement (if needed)
7. Dependency analysis across all stories
8. Write story files + dependency graph

**Context Management:**
- Master maintains ~30K
- Each Story-Writer-SM gets isolated 0-150K context
- No context overflow regardless of story count

### 2. validate-stories

**Input:** Story files
**Output:** Validation report, quality scores, issues list

**Process:**
1. Load all story files
2. Spawn Quality-Validator-SM
   - INVEST compliance scoring
   - Acceptance criteria quality
   - Task breakdown completeness
   - Test strategy validation
3. Spawn INVEST-Validator-SM (deep INVEST analysis)
4. Spawn Dependency-Validator-SM
   - Check dependency completeness
   - Detect circular dependencies
   - Validate resolvability
5. Generate validation report + recommendations

### 3. plan-sprint

**Input:** Validated stories + team data
**Output:** Sprint plan, capacity analysis, backlog

**Process:**
1. Gather team data (size, velocity, availability)
2. Spawn Capacity-Analyzer-SM
   - Analyze historical velocity
   - Calculate sprint capacity
   - Assess confidence level
3. Spawn Story-Prioritizer-SM
   - Prioritize by business value, dependencies, risk, effort
   - Create priority tiers (must-have, should-have, nice-to-have)
4. Spawn Sprint-Planner-SM
   - Create optimal sprint plan(s)
   - Respect capacity constraints
   - Satisfy dependencies
   - Maximize value delivery
5. Generate sprint plan + backlog

## Usage

### Starting Master-SM

```bash
/bmad:enhanced-sm:agents:master-sm
```

**Menu:**
1. **status** - Show current status and progress
2. **create-stories** - Create stories from epic files
3. **validate-stories** - Validate story quality and dependencies
4. **plan-sprint** - Plan sprint with capacity awareness
5. **continue** - Resume interrupted workflow

### Workflow: Create Stories from Epics

```bash
1. Run Enhanced-PM to create epics
   → Epics written to /docs/epics/

2. Run Master-SM → create-stories
   → Master loads epics
   → Extracts requirements
   → Classifies complexity
   → Creates batches (10 simple, 5 medium, 2 complex per batch)
   → Spawns Story-Writer-SM for each batch
   → Quality validates (auto-refines if < 6.0)
   → Analyzes dependencies
   → Writes story files to .bmad/stories/

3. Result:
   ✓ Story files created
   ✓ Dependency graph generated
   ✓ Batch summary report
```

### Workflow: Validate Stories

```bash
1. Run Master-SM → validate-stories
   → Loads all stories
   → Spawns Quality-Validator-SM (INVEST, AC, tasks, tests)
   → Spawns INVEST-Validator-SM (deep INVEST analysis)
   → Spawns Dependency-Validator-SM (circular deps, completeness)
   → Generates validation report

2. Result:
   ✓ Validation report with issues
   ✓ Quality scores per story
   ✓ READY_FOR_DEV | NEEDS_IMPROVEMENT | BLOCKED
```

### Workflow: Plan Sprint

```bash
1. Run Master-SM → plan-sprint
   → Prompts for team data (size, velocity, availability)
   → Spawns Capacity-Analyzer-SM (calculates capacity)
   → Spawns Story-Prioritizer-SM (prioritizes stories)
   → Spawns Sprint-Planner-SM (creates sprint plan)
   → Generates sprint plan + backlog

2. Result:
   ✓ Sprint plan with story assignments
   ✓ Capacity analysis
   ✓ Prioritized backlog
```

## Configuration

`config.yaml`:

```yaml
# Quality
story_quality_threshold: 6.0      # Auto-refine if below
max_refine_attempts: 2            # Max refinement iterations
enable_auto_refine: true          # Enable automatic refinement

# Story batching
story_batch_simple_size: 10       # Simple stories per batch
story_batch_medium_size: 5        # Medium stories per batch
story_batch_complex_size: 2       # Complex stories per batch

# Sprint planning
default_sprint_duration: 2        # weeks
default_team_velocity: 40         # points per sprint

# Validation
enforce_invest: true              # Enforce INVEST compliance
require_testable_ac: true         # All AC must be testable

# Integration
bmm_compatible: true              # BMM-compatible output
input_source: "enhanced-pm"       # or bmm-pm
handoff_to: "enhanced-dev"        # or bmm-dev
```

## Story Output Format

Each story file follows this template:

```markdown
# Story: User Login with Email/Password

**Epic:** Epic-1 (User Authentication)
**Story ID:** STORY-1
**Priority:** High
**Estimated Points:** 5

## User Story
As a **registered user**
I want to **login with my email and password**
So that **I can access my personalized dashboard**

## Acceptance Criteria
- [ ] User enters valid email/password → redirected to dashboard
- [ ] User enters invalid credentials → error message shown
- [ ] Login form validates email format client-side
- [ ] Password is masked during input
- [ ] "Remember me" checkbox persists session for 30 days
- [ ] Forgot password link navigates to password reset

## Tasks
1. Create login API endpoint (POST /api/auth/login)
2. Implement email/password validation logic
3. Add JWT token generation on success
4. Build login form UI component
5. Add client-side validation
6. Implement error handling & display
7. Add "Remember me" functionality
8. Write unit tests for auth logic
9. Write e2e tests for login flow

## Dependencies
- **Blocks:** STORY-2 (User Profile Access)
- **Depends On:** None

## Technical Notes
- Use bcrypt for password hashing
- JWT tokens expire after 24h (30 days if "Remember me")
- Rate limit: 5 failed attempts → lockout 15min

## Test Strategy
- Unit: Auth service, validation logic
- Integration: API endpoint
- e2e: Full login flow with Playwright

## Definition of Done
- [ ] All tasks completed
- [ ] All AC met
- [ ] Unit tests pass (coverage > 80%)
- [ ] e2e tests pass
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] PM approved
```

## Status File Structure

`.bmad/enhanced-sm/status.yaml`:

```yaml
current_project:
  name: "MyApp"
  status: "sprint_planning"

epics_loaded:
  - epic_id: "epic-1"
    title: "User Authentication"
    requirements_count: 12

stories:
  total: 26
  completed: 26
  validated: 26
  needs_refinement: 0

batching:
  total_batches: 3
  batches_completed: 3

quality:
  avg_story_score: 7.5
  avg_invest_score: 8.2

validation:
  invest_compliant: true
  dependencies_resolved: true
  ready_for_dev: true

sprint_plan:
  sprints_planned: 2
  total_points: 78
  avg_velocity: 40
  backlog_count: 4
```

## Integration with Other Modules

### Input: Enhanced-PM or BMM-PM

```
Enhanced-PM
  ↓ Creates epic files
  └─ /docs/epics/epic-*.md

Enhanced-SM
  ↓ Reads epic files
  └─ Creates story files
```

### Output: Enhanced-Dev or BMM-Dev

```
Enhanced-SM
  ↓ Creates story files
  └─ .bmad/stories/story-*.md

Enhanced-Dev
  ↓ Reads story files
  └─ Implements stories
```

### Full Workflow Chain

```
Enhanced-PM (PRD + Epics)
  ↓
Enhanced-SM (Stories + Sprint Plan)
  ↓
Enhanced-Dev (Implementation + Tests + Deployment)
```

## Anti-Loop Guards

```yaml
Max Refinement Attempts: 2
  - Prevents endless refinement loops
  - Accepts best version after max attempts
  - Logs warning in status file

Batch Timeout: 20 minutes
  - Prevents stuck story batches
  - Skips and continues with next batch
  - Logs timeout warning

Circular Dependency Detection:
  - CRITICAL ERROR if circular deps found
  - Halts workflow (requires manual fix)
  - Shows dependency cycle chains
```

## Troubleshooting

### Issue: Stories below quality threshold

**Solution:** Auto-refinement handles this automatically. If quality remains low after 2 refinement attempts, stories are accepted with warnings. Review `validation-issues.md` for specific improvements.

### Issue: Circular dependencies detected

**Solution:** Circular dependencies are CRITICAL errors. Review `dependency-graph.yaml` to identify the cycle. Break one dependency manually, then re-run validation.

### Issue: Capacity planning unrealistic

**Solution:** Adjust team data (velocity, availability) when running `plan-sprint`. Use historical velocity from recent sprints for accuracy.

### Issue: Too many stories per sprint

**Solution:** Sprint-Planner-SM respects capacity constraints. If sprints are overloaded, reduce `default_team_velocity` in config or provide accurate velocity during planning.

### Issue: Stories not INVEST compliant

**Solution:** INVEST-Validator-SM identifies non-compliant stories. Review `validation-report.md` for specific issues. Consider splitting large stories or clarifying ambiguous ones.

## Best Practices

1. **Always validate before sprint planning**
   - Run `validate-stories` before `plan-sprint`
   - Ensures all stories are dev-ready

2. **Use historical velocity for capacity**
   - Accurate velocity = realistic sprint plans
   - Track actual velocity after each sprint

3. **Review auto-refined stories**
   - Auto-refinement improves quality
   - But manual review recommended for critical stories

4. **Keep epics focused**
   - Smaller epics → simpler stories
   - Easier to batch and plan

5. **Address dependency cycles immediately**
   - Circular dependencies block development
   - Fix before proceeding

6. **Monitor quality trends**
   - Check `avg_story_score` in status
   - If consistently low, review epic quality

## What's Next?

After Enhanced-SM creates stories and plans sprints:

1. **Review sprint plan** (`.bmad/sprint-plan.md`)
2. **Assign stories to team members**
3. **Start development with Enhanced-Dev**
   - `/bmad:enhanced-dev:agents:master-developer`
   - Select story from sprint plan
   - Master-Dev implements, tests, deploys

## Support

For issues or questions:
- Check status file: `.bmad/enhanced-sm/status.yaml`
- Review warnings and next steps
- Check validation reports for specific issues

## Version History

- **1.0.0** (2025-11-02)
  - Initial release
  - Master/Sub-SM pattern
  - Dynamic story batching
  - Quality-based auto-refinement
  - INVEST validation
  - Dependency analysis
  - Sprint planning with capacity awareness
  - BMM compatibility

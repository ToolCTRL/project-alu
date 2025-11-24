# Plan Sprint Workflow Instructions



Sprint planning with capacity awareness, dependency resolution, and value prioritization.

## Steps

### 1. Load Data

```yaml
Load:
  - All validated stories (.bmad/stories/)
  - Dependency graph (.bmad/stories/dependency-graph.yaml)
  - Quality scores (.bmad/stories/quality-scores.yaml)
  - Status file ({status_location}/status.yaml)

Display:
  📅 Plan Sprint Workflow

  Stories loaded: {count}
  Dependencies loaded: ✓
  Ready for planning!
```

### 2. Gather Team Data

```yaml
Prompt user for team information:

  Questions:
    1. Team size? (default: 5)
    2. Sprint duration? (default: 2 weeks)
    3. Team velocity (last 3 sprints)?
       - Last sprint: {points}
       - 2 sprints ago: {points}
       - 3 sprints ago: {points}
       OR: Use default {40 points}
    4. Team availability this sprint?
       - Full (100%)
       - Reduced due to PTO/holidays ({percentage}%)
    5. Any capacity constraints?
       - Meetings, overhead, etc.

Store in status:
  team:
    size: {count}
    sprint_duration: {weeks}
    velocity_history: [{points}]
    availability: {percentage}
    constraints: {list}

Display:
  ✓ Team data collected

  Team: {size} people
  Sprint: {weeks} weeks
  Average Velocity: {avg} points
  Availability: {percentage}%
```

### 3. Analyze Capacity

```yaml
Spawn Capacity-Analyzer-SM:

  Input:
    - Team data
    - Velocity history
    - Availability
    - Constraints

  Analysis:
    Historical Velocity:
      Last sprint: {points}
      Last 3 avg: {points}
      Trend: {increasing|stable|decreasing}

    Team Capacity:
      Base velocity: {avg_points}
      Availability factor: {percentage}
      Buffer (20%): {buffer_points}
      **Target capacity: {capacity} points**

    Confidence:
      High: Stable velocity, full team
      Medium: Some variation or reduced availability
      Low: High variation or major constraints

    Risks:
      - New team members (lower initial velocity)
      - Key person OOO (reduced capacity)
      - Technical unknowns (buffer needed)

  Output:
    Recommended sprint capacity: {points}
    Buffer percentage: {percentage}
    Confidence level: {high|medium|low}

Capacity-Analyzer-SM closes → context freed!

Update Status:
  sprint_plan:
    target_capacity: {points}
    buffer: {percentage}
    confidence: {level}

Display:
  ✓ Capacity analysis completed

  Sprint Capacity: {capacity} points
  Buffer: {buffer}%
  Confidence: {level}
```

### 4. Prioritize Stories

```yaml
Spawn Story-Prioritizer-SM:

  Input:
    - All validated stories
    - Dependency graph
    - Epic priorities (from epic files)

  Prioritization Criteria:

    Business Value (weight: 3.0):
      - User impact (high/medium/low)
      - Revenue impact
      - Strategic alignment

    Dependencies (weight: 2.5):
      - Blockers first
      - Prerequisites before dependents

    Risk (weight: 1.5):
      - Technical risk
      - Complexity uncertainty

    Effort (weight: 1.0):
      - Balanced mix of sizes

  Priority Tiers:
    Must-Have:
      - Blockers (stories that block many others)
      - High business value
      - Critical for epic completion

    Should-Have:
      - Medium value
      - Required dependencies
      - Strategic importance

    Nice-to-Have:
      - Lower priority
      - Independent stories
      - Can defer to later sprints

  Output:
    Prioritized story list with scores
    Priority tier per story
    Rationale per story

Story-Prioritizer-SM closes → context freed!

Display:
  ✓ Story prioritization completed

  Must-Have: {count} stories ({points} points)
  Should-Have: {count} stories ({points} points)
  Nice-to-Have: {count} stories ({points} points)

  Top Priorities:
    1. {story_id} - {title} ({points} pts)
    2. {story_id} - {title} ({points} pts)
    3. {story_id} - {title} ({points} pts)
```

### 5. Create Sprint Plan

```yaml
Spawn Sprint-Planner-SM:

  Input:
    - Capacity analysis
    - Prioritized stories
    - Dependency graph

  Planning Rules:

    Capacity Constraint:
      Total points <= capacity
      Leave ~20% buffer

    Dependency Constraint:
      Prerequisites before dependents
      Satisfy all dependencies within sprint

    Epic Coherence:
      Keep related stories together
      Complete full epics when possible

    Value Maximization:
      Prioritize high-value stories
      Balance quick wins with strategic work

  Planning Process:

    Sprint 1:
      1. Add must-have stories (highest priority first)
      2. Check dependencies satisfied
      3. Check capacity constraint
      4. Fill with should-haves until capacity reached
      5. Final check: any quick wins to add?

    Sprint 2 (if needed):
      1. Add remaining must-haves
      2. Add should-haves
      3. Fill capacity

    Continue until all stories planned or backlog

  Output:
    Sprint plan for each sprint
    Backlog (unprioritized stories)
    Capacity utilization per sprint
    Risks and recommendations

Sprint-Planner-SM closes → context freed!

Display:
  ✓ Sprint plan created

  Sprints: {count}
  Stories Planned: {count} ({points} points)
  Backlog: {count} stories
  Avg Capacity Utilization: {percentage}%
```

### 6. Write Sprint Plan File

```yaml
Write: {project-root}/bmad/sprint-plan.md

Content:
  # Sprint Plan

  **Project:** {project_name}
  **Created:** {timestamp}
  **Team:** {team_size} people
  **Sprint Duration:** {weeks} weeks

  ## Sprint 1

  **Duration:** {weeks} weeks
  **Capacity:** {capacity} points
  **Planned:** {planned_points} points ({utilization}%)

  ### Stories:

  #### Must-Have (Blockers & High Priority)
  - **STORY-1:** User Login (5 pts)
    - Dependencies: None
    - Blocks: STORY-2, STORY-5, STORY-7
    - Priority: Critical blocker

  - **STORY-3:** Password Reset (3 pts)
    - Dependencies: STORY-1
    - Blocks: None
    - Priority: High user value

  #### Should-Have
  - **STORY-5:** OAuth Google (8 pts)
    - Dependencies: STORY-1
    - Blocks: None
    - Priority: Strategic feature

  #### Nice-to-Have
  - **STORY-9:** Remember Me (2 pts)
    - Dependencies: STORY-1
    - Blocks: None
    - Priority: UX enhancement

  ### Totals:
  - Stories: {count}
  - Points: {points} / {capacity}
  - Utilization: {percentage}%
  - Epics: {epic_list}

  ### Risks:
  - STORY-5 (OAuth) has technical unknowns
  - External dependency on Google OAuth setup

  ### Dependencies:
  - All dependencies satisfied within sprint ✓

  ---

  ## Sprint 2

  {same structure}

  ---

  ## Backlog

  **Total:** {count} stories ({points} points)

  ### Lower Priority Stories:
  - STORY-12: Admin Dashboard (13 pts) - Deferred
  - STORY-15: Analytics Integration (8 pts) - Deferred
  - ...

  ### Reason:
  Capacity constraints. These stories are lower priority and can be planned for future sprints.

  ---

  ## Summary

  - **Total Sprints:** {count}
  - **Stories Planned:** {count}
  - **Total Points:** {points}
  - **Backlog:** {count} stories
  - **Avg Capacity Utilization:** {percentage}%

  ## Recommendations

  - Complete STORY-1 early (blocks many others)
  - Pair on STORY-5 (technical risk)
  - Reserve buffer time for OAuth debugging
  - Consider backlog items for Sprint 3

Display:
  ✓ Sprint plan: sprint-plan.md
```

### 7. Write Capacity Analysis File

```yaml
Write: {project-root}/bmad/capacity-analysis.yaml

Content:
  team:
    size: {count}
    sprint_duration: {weeks}
    availability: {percentage}

  velocity:
    last_sprint: {points}
    last_3_avg: {points}
    trend: {increasing|stable|decreasing}

  capacity:
    target: {points}
    buffer: {percentage}
    confidence: {high|medium|low}

  risks:
    - {risk_1}
    - {risk_2}

Display:
  ✓ Capacity analysis: capacity-analysis.yaml
```

### 8. Write Backlog File

```yaml
Write: {project-root}/bmad/backlog.md

Content:
  # Backlog

  **Total Stories:** {count}
  **Total Points:** {points}

  ## Prioritized Backlog

  ### High Priority (Next Sprint)
  - STORY-12: Admin Dashboard (13 pts)
    - Reason: Deferred due to capacity
    - Recommend: Sprint 3

  ### Medium Priority
  - STORY-15: Analytics (8 pts)
  - STORY-18: Export Reports (5 pts)

  ### Low Priority
  - STORY-25: Theme Customization (3 pts)
  - STORY-27: Easter Eggs (1 pt)

Display:
  ✓ Backlog: backlog.md
```

### 9. Update Status File

```yaml
Update: {status_location}/status.yaml

  sprint_plan:
    sprints_planned: {count}
    total_points: {points}
    avg_velocity: {velocity}
    backlog_count: {count}

  progress:
    current_phase: "sprint_planned"
    percentage: 100  # SM work complete!

  workflow:
    current_workflow: "plan-sprint"
    workflow_status: "completed"
    completed_at: {timestamp}

  next_steps:
    - action: "Start development with Enhanced-Dev"
      priority: "high"
    - action: "Daily standups to track progress"
      priority: "medium"
```

### 10. Display Final Summary

```yaml
Display:

  ✅ Plan Sprint Workflow Completed!

  📅 Sprint Plan:

  Sprints Created: {count}
  Stories Planned: {count} ({points} points)
  Backlog: {count} stories

  Sprint 1:
    Stories: {count}
    Points: {points}/{capacity} ({utilization}%)
    Must-Have: {count}
    Should-Have: {count}

  {if sprint_2}:
    Sprint 2:
      Stories: {count}
      Points: {points}/{capacity}

  Files Generated:
    ✓ sprint-plan.md
    ✓ capacity-analysis.yaml
    ✓ backlog.md

  Next Steps:
    1. Review sprint-plan.md
    2. Assign stories to team members
    3. Start Sprint 1 with Enhanced-Dev
       → Use /bmad:enhanced-dev:workflows:dev-story

  Ready to start development! 🚀
```

Communicate in {communication_language}

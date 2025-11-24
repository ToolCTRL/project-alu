# Create Stories Workflow Checklist

Use this checklist to ensure comprehensive story creation quality.

## Pre-Workflow

- [ ] Epic files exist in `{project-root}/docs/epics/`
- [ ] Epics follow Enhanced-PM or BMM format
- [ ] Status location `.bmad/enhanced-sm/` exists
- [ ] Config loaded from `config.yaml`

## Step 1: Initialize

- [ ] Status file created or loaded
- [ ] Project name identified
- [ ] Workflow status set to "running"
- [ ] Timestamp recorded

## Step 2: Load Epics

- [ ] All epic files scanned
- [ ] Epic metadata extracted (id, title, requirements)
- [ ] Epic count displayed to user
- [ ] Epic dependencies noted

## Step 3: Extract Requirements

- [ ] Requirements extracted from each epic
- [ ] Requirements assigned unique IDs
- [ ] Requirements linked to parent epic
- [ ] Total requirement count accurate

## Step 4: Classify Complexity

- [ ] Each requirement analyzed for complexity
- [ ] Complexity classification applied (simple/medium/complex)
- [ ] Estimated tasks and points assigned
- [ ] Complexity distribution displayed

## Step 5: Dynamic Batching

- [ ] Requirements grouped by complexity
- [ ] Batch sizes respect configured limits (10/5/2)
- [ ] Epic coherence maintained when possible
- [ ] Dependencies considered in batch ordering
- [ ] Total batch count calculated
- [ ] Batch plan displayed to user

## Step 6: Write Stories (Per Batch)

### For Each Batch:

- [ ] Story-Writer-SM spawned via Task tool
- [ ] Epic context provided
- [ ] Requirements list provided
- [ ] Other stories context provided (dependencies)
- [ ] Story template provided
- [ ] Quality criteria communicated

### Story-Writer-SM Execution:

- [ ] Stories follow template format
- [ ] Each story has:
  - [ ] Story ID
  - [ ] Epic reference
  - [ ] Priority
  - [ ] Estimated points
  - [ ] User story (As/I want/So that)
  - [ ] Acceptance criteria (testable!)
  - [ ] Task breakdown
  - [ ] Dependencies (blocks, depends on)
  - [ ] Technical notes
  - [ ] Test strategy (unit, integration, e2e)
  - [ ] Definition of Done

### Quality Assessment:

- [ ] INVEST compliance scored
- [ ] AC quality scored
- [ ] Task breakdown scored
- [ ] Dependencies scored
- [ ] Technical notes scored
- [ ] Test strategy scored
- [ ] Total quality score calculated

### Quality Validation:

- [ ] Quality score compared to threshold
- [ ] If below threshold and auto-refine enabled:
  - [ ] Refine-Story-SM spawned
  - [ ] Quality feedback provided
  - [ ] Refinement attempt tracked
  - [ ] New quality score assessed
  - [ ] Max refine attempts enforced
- [ ] Stories accepted (with or without warnings)
- [ ] Batch status updated

### Context Management:

- [ ] Sub-SM closed after completion
- [ ] Context freed
- [ ] Master context remains clean (~30K)

### Batch Completion:

- [ ] Stories stored in master memory (not files yet)
- [ ] Batch marked completed in status
- [ ] Progress updated
- [ ] Display batch summary to user

## Step 7: Dependency Analysis

- [ ] Dependency-Analyzer-SM spawned
- [ ] All stories provided for analysis
- [ ] Epic structure provided
- [ ] Story-to-story dependencies identified
- [ ] Epic-level dependencies identified
- [ ] Technical dependencies identified
- [ ] Circular dependencies checked
- [ ] If circular dependencies found:
  - [ ] ERROR displayed
  - [ ] Circular chains shown
  - [ ] Workflow halted
- [ ] Dependency graph created (graphviz/mermaid)
- [ ] Dependencies added to story objects
- [ ] Dependency-Analyzer-SM closed

## Step 8: Write Story Files

- [ ] For each story:
  - [ ] Filename generated (story-{id}-{slug}.md)
  - [ ] File written to `.bmad/stories/`
  - [ ] Dependencies included in story content
  - [ ] Status updated with filename
- [ ] All story files written
- [ ] File count displayed

## Step 9: Generate Dependency Graph

- [ ] Dependency graph file created
- [ ] Location: `.bmad/stories/dependency-graph.yaml`
- [ ] Contains story dependencies
- [ ] Contains epic dependencies
- [ ] Contains technical dependencies
- [ ] Contains visualization (mermaid/graphviz)
- [ ] File path displayed

## Step 10: Generate Summary Report

- [ ] Batch summary file created
- [ ] Location: `.bmad/stories/batch-summary.md`
- [ ] Contains:
  - [ ] Project name and date
  - [ ] Statistics (total, complexity distribution)
  - [ ] Quality metrics (avg scores)
  - [ ] Dependency counts
  - [ ] Batch details
  - [ ] Warnings list
  - [ ] Next steps
- [ ] File path displayed

## Step 11: Final Status Update

- [ ] Project status set to "stories_created"
- [ ] Completion timestamp recorded
- [ ] Story counts updated
- [ ] Batch counts updated
- [ ] Quality averages calculated
- [ ] Progress percentage updated (50%)
- [ ] Workflow status set to "completed"
- [ ] Next steps added to status

## Step 12: Display Final Summary

- [ ] Stories created count displayed
- [ ] Complexity distribution shown
- [ ] Batches processed count shown
- [ ] Average quality score shown
- [ ] Dependency counts shown
- [ ] Files generated list shown
- [ ] Warnings count and details shown
- [ ] Next steps clearly communicated
- [ ] User guided to next workflow

## Quality Gates

### INVEST Compliance:

- [ ] **I**ndependent - Stories can be developed independently
- [ ] **N**egotiable - Details can be discussed
- [ ] **V**aluable - Clear value to user
- [ ] **E**stimable - Can be estimated for effort
- [ ] **S**mall - Can be completed in a sprint
- [ ] **T**estable - Clear acceptance criteria

### Acceptance Criteria:

- [ ] At least 3 AC per story
- [ ] All AC are testable
- [ ] All AC are measurable
- [ ] AC cover happy path and edge cases

### Task Breakdown:

- [ ] At least 1 task per story
- [ ] Tasks are clear and actionable
- [ ] Tasks are complete (nothing missing)
- [ ] Tasks include testing

### Dependencies:

- [ ] All blocking dependencies identified
- [ ] All prerequisite dependencies identified
- [ ] No circular dependencies
- [ ] Technical dependencies documented

### Test Strategy:

- [ ] Unit tests defined
- [ ] Integration tests defined
- [ ] e2e tests defined
- [ ] Test coverage goals stated

### Definition of Done:

- [ ] All standard DoD items included
- [ ] Clear completion criteria
- [ ] Approval process defined

## Error Handling

- [ ] Timeouts handled gracefully
- [ ] Sub-SM failures logged
- [ ] Quality threshold failures handled
- [ ] Circular dependencies caught
- [ ] Missing epic files handled
- [ ] All warnings logged in status
- [ ] User informed of all issues

## Post-Workflow

- [ ] All files written successfully
- [ ] Status file updated
- [ ] User informed of completion
- [ ] Next steps clearly communicated
- [ ] Ready for validate-stories workflow

## BMM Compatibility

- [ ] Story format matches BMM expectations
- [ ] File naming consistent with BMM
- [ ] Story location compatible (`.bmad/stories/`)
- [ ] Can be consumed by Enhanced-Dev
- [ ] Can be consumed by BMM workflows

## Context Efficiency

- [ ] Master context stayed under 100K
- [ ] All sub-SMs closed after use
- [ ] No context overflow
- [ ] Batch sizes respected limits
- [ ] Context management working as designed

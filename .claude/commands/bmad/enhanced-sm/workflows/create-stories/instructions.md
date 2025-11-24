# Create Stories Workflow Instructions



Master-SM orchestrates story creation by spawning specialized sub-SMs with isolated contexts.

## Workflow Overview

```
Input: Epic Files (from Enhanced-PM)
Output: Story Files + Dependency Graph + Validation Report
Context: Master keeps ~30K, each sub-SM gets 0-150K then closes
```


## Step 2: Load Epic Files

```yaml
Action:
  - Scan {project-root}/docs/epics/*.md
  - Load all epic files
  - Extract epic metadata

For each epic:
  epic_id: {from filename or frontmatter}
  epic_title: {from heading}
  requirements: {extract from AC or requirements section}
  dependencies: {extract from dependencies section}
  success_metrics: {extract if present}

Update Status:
  epics_loaded:
    - epic_id: "epic-1"
      title: "User Authentication"
      requirements_count: 12
      file_path: "docs/epics/epic-1-authentication.md"
    - epic_id: "epic-2"
      title: "User Profile"
      requirements_count: 8
      file_path: "docs/epics/epic-2-profile.md"

Display:
  ✓ Loaded {count} epics
  ✓ Extracted {total} requirements
```


## Step 4: Classify Story Complexity

```yaml
For each requirement:
  Analyze:
    - Number of related tasks (estimated)
    - Technical complexity
    - Integration points
    - Dependencies

  Classify:
    Simple:
      Criteria: 1-2 tasks, minimal dependencies, 1-3 points
      Examples: Logout, basic form validation, simple UI components

    Medium:
      Criteria: 3-5 tasks, some dependencies, 5-8 points
      Examples: Login with session, password reset, OAuth integration

    Complex:
      Criteria: 6+ tasks, multiple dependencies, 13+ points
      Examples: SSO integration, biometric auth, multi-factor auth

Classification Logic:
  IF estimated_tasks <= 2 AND estimated_points <= 3:
    complexity = "simple"
  ELIF estimated_tasks <= 5 AND estimated_points <= 8:
    complexity = "medium"
  ELSE:
    complexity = "complex"

Update Status:
  requirements:
    - id: "REQ-1"
      complexity: "medium"  # Updated from initial estimate
      estimated_points: 5
      estimated_tasks: 4
    - id: "REQ-2"
      complexity: "simple"
      estimated_points: 2
      estimated_tasks: 2

Display:
  Story Complexity Distribution:
    Simple: {count} stories
    Medium: {count} stories
    Complex: {count} stories
```


## Step 6: Write Stories (Per Batch)

**For each batch sequentially:**

### 6a. Spawn Story-Writer-SM

```yaml
Prepare Context:
  - Epic content for stories in this batch
  - Requirements to address
  - Context about other stories (for dependencies)
  - Story template
  - Quality criteria

Spawn Sub-SM:
  Tool: Task
  Subagent: general-purpose
  Prompt: {workflow.sub_sm_spawning.story_writer_sm.prompt_template}

  Variables:
    batch_size: {stories_in_batch}
    epic_content: {relevant_epic_files}
    requirements_list: {batch_requirements}
    other_stories_context: {previously_written_stories}

Display:
  ⏳ Batch {batch_number}/{total_batches}
  Spawning Story-Writer-SM for {story_count} {complexity} stories...
```

### 6b. Story-Writer-SM Execution

```yaml
Story-Writer-SM (in isolated context):
  1. Analyzes epic requirements
  2. Writes stories following template
  3. Ensures INVEST compliance
  4. Defines acceptance criteria (testable!)
  5. Breaks down tasks
  6. Identifies dependencies
  7. Adds technical notes
  8. Defines test strategy
  9. Self-assesses quality

  Returns to Master:
    stories: [
      {
        story_id: "STORY-1",
        content: "# Story: User Login...",
        epic_id: "epic-1",
        ...
      },
      ...
    ]
    quality_assessment: {
      invest_compliance: 8/10,
      ac_quality: 7/10,
      task_breakdown: 8/10,
      dependencies: 6/10,
      technical_notes: 7/10,
      test_strategy: 8/10,
      total_score: 7.3/10
    }

Story-Writer-SM closes → context freed!
```

### 6c. Quality Validation

```yaml
Master receives stories + quality score

IF quality_score >= {quality_threshold} (default 6.0):
  ✓ ACCEPT stories
  Update Status:
    batches[batch_number].status: "completed"
    batches[batch_number].quality_score: {score}
    stories.completed += {story_count}

  Display:
    ✓ Batch {batch_number} completed
    Quality: {score}/10 ✓
    Stories: {story_count}

ELSE:
  ⚠️ QUALITY BELOW THRESHOLD
  Quality Score: {score}/10 (threshold: {threshold})

  IF {enable_auto_refine} AND refine_attempts < {max_refine_attempts}:
    → Proceed to Step 6d (Auto-Refine)
  ELSE:
    → Accept with warning

    Update Status:
      warnings:
        - timestamp: {now}
          level: "warning"
          message: "Batch {batch_number} quality below threshold ({score}/10)"
          phase: "story_creation"

      batches[batch_number].status: "completed_with_warnings"
```

### 6d. Auto-Refine (If Quality < Threshold)

```yaml
Refinement Loop:
  attempt = 1

  While attempt <= {max_refine_attempts}:

    Display:
      🔄 Auto-Refining Batch {batch_number} (Attempt {attempt}/{max})
      Issues: {quality_feedback}

    Prepare Refinement Context:
      - Original stories
      - Quality feedback (specific issues)
      - Target improvements

    Spawn Refine-Story-SM:
      Tool: Task
      Subagent: general-purpose
      Prompt: {workflow.sub_sm_spawning.refine_story_sm.prompt_template}

      Variables:
        story_content: {all_stories_in_batch}
        feedback: {quality_issues}

    Refine-Story-SM:
      Analyzes issues
      Refines stories
      Re-assesses quality
      Returns: refined_stories + new_score

    Refine-Story-SM closes → context freed!

    IF new_score >= {quality_threshold}:
      ✓ REFINEMENT SUCCESSFUL
      Break loop

    ELSE:
      attempt++
      IF attempt > {max_refine_attempts}:
        ⚠️ MAX REFINEMENT ATTEMPTS REACHED
        Accept best version with warning

        Update Status:
          warnings:
            - message: "Batch {batch_number} quality still below threshold after {max_refine_attempts} attempts"
              score_final: {new_score}
              score_threshold: {threshold}

Update Status:
  batches[batch_number].refinement_attempts: {attempt}
  batches[batch_number].quality_score: {final_score}
  batches[batch_number].status: "completed"
```

### 6e. Store Stories Temporarily

```yaml
Master stores batch results in memory:
  all_stories.append(batch_stories)

Do NOT write files yet - wait until all batches complete
(Allows dependency analysis across all stories)

Update Status:
  stories.completed: {count}
  batches[batch_number].status: "completed"
  progress.batches_completed: {count}

Display:
  ✓ Batch {batch_number}/{total_batches} completed
  Progress: {batches_completed}/{total_batches} batches
  Stories: {stories_completed}/{total_stories}
```

**Repeat Steps 6a-6e for all batches sequentially**


## Step 8: Write Story Files

```yaml
For each story in all_stories:

  Generate filename:
    story_id: {from story}
    slug: {slugified_title}
    filename: "story-{story_id}-{slug}.md"

  Write file:
    Location: {project-root}/bmad/stories/{filename}
    Content: {story_markdown_with_dependencies}

  Update Status:
    output.files_generated.append({filename})

Display:
  📝 Writing story files...

  ✓ STORY-1: story-1-user-login.md
  ✓ STORY-2: story-2-user-logout.md
  ✓ STORY-3: story-3-password-reset.md
  ...

  Total: {count} story files written
```


## Step 10: Generate Summary Report

```yaml
Create Batch Summary:
  Location: {project-root}/bmad/stories/batch-summary.md

  Content:
    # Story Creation Summary

    **Project:** {project_name}
    **Date:** {timestamp}
    **Workflow:** create-stories

    ## Statistics

    - Total Stories: {total}
    - Simple Stories: {simple_count}
    - Medium Stories: {medium_count}
    - Complex Stories: {complex_count}

    - Batches Processed: {batch_count}
    - Average Quality Score: {avg_score}/10
    - Stories Below Threshold: {below_count}
    - Refinement Attempts: {total_refines}

    ## Quality Metrics

    - INVEST Compliance: {avg_invest}/10
    - Acceptance Criteria: {avg_ac}/10
    - Task Breakdown: {avg_tasks}/10
    - Dependencies: {avg_deps}/10
    - Technical Notes: {avg_tech}/10
    - Test Strategy: {avg_test}/10

    ## Dependencies

    - Story Dependencies: {count}
    - Epic Dependencies: {count}
    - Technical Dependencies: {count}
    - Circular Dependencies: {count} ⚠️

    ## Batches

    {for each batch}:
      ### Batch {number} ({complexity})
      - Stories: {count}
      - Quality: {score}/10
      - Refinements: {attempts}
      - Status: {status}

    ## Warnings

    {list all warnings from status file}

    ## Next Steps

    - ✓ Stories ready for validation
    - → Run validate-stories workflow
    - → Run plan-sprint workflow

Display:
  ✓ Summary report: batch-summary.md
```


## Step 12: Display Final Summary

```yaml
Display:

  ✅ Create Stories Workflow Completed!

  📊 Summary:

  Stories Created: {total}
    Simple: {simple_count}
    Medium: {medium_count}
    Complex: {complex_count}

  Batches Processed: {batch_count}
  Average Quality: {avg_score}/10

  Dependencies:
    Story: {story_deps}
    Epic: {epic_deps}
    Technical: {tech_deps}

  Files Generated:
    ✓ {count} story files (.bmad/stories/)
    ✓ Dependency graph
    ✓ Batch summary

  Warnings: {warning_count}

  {if warnings > 0}:
    ⚠️ Issues Detected:
    {list warnings}

  Next Steps:
    1. Review stories in .bmad/stories/
    2. Run /bmad:enhanced-sm:workflows:validate-stories
    3. Run /bmad:enhanced-sm:workflows:plan-sprint

  Ready for validation! 🚀
```

**Communication in {communication_language}**


## Context Management Summary

```
Master-SM Context: ~30K
  - Coordination logic
  - Status tracking
  - Batch orchestration

Per Batch:
  Story-Writer-SM: 0-150K → CLOSE → Returns compact results (20K)
  Refine-Story-SM: 0-150K → CLOSE → Returns refined stories (20K)

End of Workflow:
  Dependency-Analyzer-SM: 0-150K → CLOSE → Returns dependency data (15K)

Total Master Context: ~30K + (20K * batches) = ~90K max
No overflow! ✓
```

Communicate in {communication_language}

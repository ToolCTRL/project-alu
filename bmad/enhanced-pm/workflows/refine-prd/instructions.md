# Refine PRD Workflow Instructions



Improve PRD quality by spawning refine-PMs for specific sections or epics.

## Steps

### 1. Load PRD & Status

```yaml
- Load status from {status_file}
- Identify PRD folder
- List all sections and epics
- Check quality scores
```

### 2. Identify Sections Needing Refinement

```yaml
Ask user which to refine:
  1. Vision & Strategy
  2. Market Research
  3. User Research
  4. Technical Feasibility
  5. Specific Epic (select which)
  6. All sections below threshold
  7. Custom selection

Or auto-select sections with quality < {quality_threshold}
```

### 3. Spawn Refine-PMs

```yaml
For each selected section:

  Spawn Refine-PM via Task tool:
    subagent_type: "general-purpose"

    prompt: |
      Refine this PRD section:

      **Section:** {section_name}
      **Current Content:** {load section file}
      **Current Quality:** {quality_score}/10

      **Issues Identified:**
      {list specific quality issues}

      **Improvement Goals:**
      - Increase clarity
      - Add specificity
      - Improve measurability
      - Better alignment

      **Output:** Improved section
      Save to: {section_file}

      Language: {document_output_language}
      Quality Target: 8+/10

IMMEDIATELY after spawning sub-agent, update status:
  Re-validate quality
  Max {max_refine_attempts} per section
```

### 4. Regenerate Complete PRD

```yaml
After all refinements:
  - Reassemble complete PRD from sections
  - Update prd-complete.md
  - Update status file
```

### 5. Report Results

```yaml
Display:
  ✅ Sections Refined: {count}
  📈 Quality Improvements:
    - Vision: {old_score} → {new_score}
    - Epic 2: {old_score} → {new_score}

  Status: {IMPROVED | NEEDS_MORE_WORK}

  Next: Review refined PRD
```

Communicate in {communication_language}

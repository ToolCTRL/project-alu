# Create PRD - Quality Checklist

## Pre-Execution Validation

- [ ] Product name provided
- [ ] Product brief/idea provided
- [ ] Target users identified
- [ ] Status file location writable
- [ ] Output folder accessible
- [ ] Templates available

## Research Phase Validation

For EACH research type enabled:

- [ ] Research sub-PM spawned successfully
- [ ] Research complete (file generated)
- [ ] Research file has reasonable content (>500 words)
- [ ] Research findings documented

## Vision & Strategy Validation

- [ ] Vision statement clear and specific
- [ ] Strategic goals defined (3-5)
- [ ] Success metrics measurable (KPIs)
- [ ] Value proposition articulated
- [ ] Target market defined
- [ ] Quality score >= 6/10
- [ ] If <6: Auto-refine attempted (if enabled)

## Requirements Extraction Validation

- [ ] Requirements extracted from vision
- [ ] Requirements numbered (REQ-1, REQ-2, ...)
- [ ] Complexity estimated per requirement
- [ ] Requirements grouped into logical epics

## Epic Planning Validation

### Dynamic Batching

- [ ] Epics classified by complexity
- [ ] Batch sizes determined appropriately:
  - Simple epics: up to 5 per batch
  - Medium epics: up to 3 per batch
  - Complex epics: 1 per batch
- [ ] Estimated context < 120K per batch

### Per Epic

- [ ] Epic title clear and descriptive
- [ ] Epic description comprehensive
- [ ] All requirements listed
- [ ] Acceptance criteria clear and testable
- [ ] Success criteria defined
- [ ] Dependencies identified
- [ ] Size estimated (S/M/L)
- [ ] Testing strategy outlined
- [ ] Technical considerations documented
- [ ] Quality score >= 6/10
- [ ] BMM-compatible format

### MECE Validation

- [ ] No epic overlaps (Mutually Exclusive)
- [ ] All requirements covered (Collectively Exhaustive)
- [ ] Epic boundaries clear
- [ ] Dependencies make sense (no circular)

## Auto-Refine Validation

When quality < threshold:

- [ ] Refine-PM spawned with specific feedback
- [ ] Quality issues clearly identified
- [ ] Refinement attempt tracked
- [ ] Max attempts enforced (2)
- [ ] If still poor: Warning logged + continue

## PRD Assembly Validation

- [ ] All section files loaded
- [ ] All epic files loaded
- [ ] Complete PRD generated
- [ ] Table of contents included
- [ ] Executive summary written
- [ ] Consistent formatting throughout
- [ ] Cross-references working
- [ ] Epic overview table included

## Output Validation

### File Structure

- [ ] prd-complete.md exists
- [ ] sections/ folder exists with files
- [ ] epics/ folder exists with files
- [ ] All expected files present

### File Quality

- [ ] Complete PRD > 2000 words
- [ ] Each section > 300 words
- [ ] Each epic > 200 words
- [ ] Proper markdown formatting
- [ ] No broken links/references

### BMM Compatibility

- [ ] Epic files follow BMM format
- [ ] Epic files can be loaded by SM
- [ ] Epic structure includes all required sections
- [ ] Epic format tested with sample SM workflow

## Status File Validation

After EACH major action:

- [ ] Status file updated
- [ ] Timestamp accurate
- [ ] Phase status correct
- [ ] Quality scores logged
- [ ] Refinement attempts tracked
- [ ] Epic details recorded
- [ ] Output paths recorded

## Progress Reporting Validation

After EACH phase:

- [ ] User informed of completion
- [ ] Quality scores displayed
- [ ] Any warnings shown clearly
- [ ] Next steps indicated

## Final Validation

- [ ] All enabled phases completed
- [ ] All output files generated
- [ ] Status file complete and accurate
- [ ] Quality summary provided
- [ ] User informed of next steps
- [ ] Ready for SM workflows

## Error Handling Validation

- [ ] All errors caught gracefully
- [ ] Error details logged to status
- [ ] User informed of errors clearly
- [ ] Workflow doesn't crash on error
- [ ] Progress saved even on error
- [ ] Resume capability maintained

## Communication Validation

- [ ] All messages in {communication_language}
- [ ] Strategic and vision-focused
- [ ] Clear quality feedback
- [ ] Constructive improvement suggestions
- [ ] Next steps always provided

## Success Criteria

PRD creation passes quality check if:

- ✓ Vision section created with quality >= 6/10
- ✓ At least 1 epic created with quality >= 6/10
- ✓ Complete PRD file generated
- ✓ Status file accurate
- ✓ User fully informed
- ✓ BMM-compatible outputs
- ✓ No workflow crashes

**Note:** Perfect quality not required - refinement available via refine-prd workflow.

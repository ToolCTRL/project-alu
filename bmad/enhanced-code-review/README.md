# Enhanced Code Review Module

**Version:** 1.0.0 | **Pattern:** Master/Sub-Reviewer with Dynamic File Batching

## Problem: Large PR Context Overflow
50+ file PRs → 500K+ tokens overflow, quality degrades for later files.

## Solution: Dynamic File Batching
Files classified by complexity:
- Simple (configs, tests): 10 per batch
- Medium (services, components): 5 per batch
- Complex (core logic): 2 per batch

Specialized sub-reviewers:
- File-Reviewer-Sub (code quality, style, best practices)
- Security-Reviewer-Sub (OWASP, vulnerabilities)
- Performance-Reviewer-Sub (bottlenecks, optimizations)
- Architecture-Reviewer-Sub (patterns, compliance)

Each: 0-150K → closes → Master stays ~30K.

## Key Features
✅ Dynamic File Batching (10/5/2)
✅ Interactive Strictness Decisions
✅ Security-Focused Review Pass
✅ Performance-Focused Review Pass
✅ Architecture Compliance Check
✅ Auto-Fix Suggestions

## Interactive Decisions
- Review strictness (strict, balanced, lenient)
- Auto-fix approach (auto-fix minor vs manual)
- Blocking issues (which issues prevent merge)

## Usage
```bash
/bmad:enhanced-code-review:agents:master-code-reviewer → review-code
```

## Output
```
docs/code-reviews/
├── review-summary.md
├── security-issues.md
├── performance-issues.md
└── architecture-notes.md
```

## Integration
Git PR OR Local Files → **Enhanced-Code-Review** → Enhanced-Dev (for fixes)

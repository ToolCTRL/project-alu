# Enhanced Research Module

**Version:** 1.0.0
**Pattern:** Master/Sub-Researcher with Interactive Scope Decisions

## Problem Solved

Comprehensive research → Context overflow (market + competitor + tech + user + trends = 280K+ tokens).

## Solution

Master-Researcher orchestrates specialized sub-researchers:
- Market-Researcher-Sub (TAM/SAM/SOM analysis)
- Competitor-Analyst-Sub (feature comparison, pricing)
- Tech-Researcher-Sub (tech stack, feasibility)
- User-Researcher-Sub (personas, pain points)
- Trend-Analyst-Sub (TikTok, viral trends, App Store)
- Insights-Synthesizer-Sub (aggregate findings)

Each sub-researcher: 0-150K → closes → Master stays at ~30K.

## Key Features

✅ **Parallel Research Streams** - Market, competitive, technical, user, trends
✅ **Interactive Scope Decisions** - Depth vs breadth, source selection, budget
✅ **Web Research Integration** - WebSearch + WebFetch tools
✅ **Insight Synthesis** - Aggregate findings into actionable recommendations
✅ **Quality-Based Refinement** - Auto-refine research < 6.0/10
✅ **Source Credibility Validation** - Ensures reliable research sources

## Workflows

1. **comprehensive-research** - Full research across all areas
2. **competitor-analysis** - Focused competitive intelligence
3. **tech-feasibility** - Technical stack and feasibility assessment

## Interactive Decisions

- Research scope (comprehensive vs focused areas)
- Research depth (surface-level vs deep-dive)
- Competitor selection (which competitors to analyze)
- Market selection (which geographic/demographic markets)
- Source budget (free sources vs paid research tools)
- Timeframe (quick research vs thorough investigation)

## Usage

```bash
/bmad:enhanced-research:agents:master-researcher
→ comprehensive-research
```

**Input:** Product Brief OR Research Questions
**Output:** Complete research reports + synthesis

## Output Structure

```
docs/research/
├── research-synthesis.md  (Key insights + recommendations)
├── market-research.md
├── competitor-analysis.md
├── tech-feasibility.md
├── user-research.md
└── trend-analysis.md
```

## Integration

**Enhanced-Research** → Enhanced-PM (Research informs PRD creation)

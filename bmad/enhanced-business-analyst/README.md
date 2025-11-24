# Enhanced Business Analyst Module

**Version:** 1.0.0 | **Pattern:** Master/Sub-BA with Interactive Stakeholder Decisions

## Problem: Enterprise Analysis Context Overflow
Complex business domains → Stakeholder analysis + Process mapping + Requirements + Data analysis + Gap analysis = 220K+ tokens.

## Solution: Specialized Sub-BAs
- Stakeholder-Analyst-Sub (stakeholder mapping, needs analysis)
- Process-Mapper-Sub (as-is/to-be process flows, BPMN)
- Requirements-Gatherer-Sub (functional/non-functional requirements)
- Data-Analyst-Sub (data flows, entities, business rules)
- Gap-Analyzer-Sub (current vs desired state analysis)

Each: 0-150K → closes → Master stays ~30K.

## Key Features
✅ Interactive Stakeholder Prioritization
✅ Business Process Mapping (as-is, to-be)
✅ Comprehensive Requirements Elicitation
✅ Data Flow & Business Rules Analysis
✅ Gap Analysis (current vs desired state)
✅ MoSCoW Prioritization

## Interactive Decisions
- Stakeholder prioritization (who to engage first)
- Scope definition (MVP vs comprehensive analysis)
- Process change impact assessment
- Requirements prioritization (MoSCoW: Must/Should/Could/Won't)

## Usage
```bash
/bmad:enhanced-business-analyst:agents:master-ba → analyze-requirements
```

## Output
```
docs/business-analysis/
├── stakeholder-analysis.md
├── process-maps/
├── requirements-doc.md
├── data-analysis.md
└── gap-analysis.md
```

## Integration
Business Brief → **Enhanced-Business-Analyst** → Enhanced-PM

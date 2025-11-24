# Enhanced Architect Module

**Version:** 1.0.0
**Pattern:** Master/Sub-Architect with Interactive Decisions

## Problem Solved

Traditional architecture creation → Context overflow when documenting complex systems (200K+ tokens).

## Solution

Master-Architect orchestrates specialized sub-architects:
- System-Architect-Sub (high-level decisions)
- Component-Architect-Sub (services/modules)
- Data-Architect-Sub (database/schemas)
- Security-Architect-Sub (auth/security)
- Integration-Architect-Sub (APIs/integrations)
- Deployment-Architect-Sub (infrastructure)

Each sub-architect: 0-150K context → closes → Master stays at ~30K.

## Key Features

✅ **Context Isolation** - No overflow regardless of system complexity
✅ **Dynamic Batching** - 8 simple / 4 medium / 2 complex components per batch
✅ **Interactive Decisions** - Asks before critical tech choices (database, patterns, deployment)
✅ **Quality-Based Refinement** - Auto-refine components scoring < 6.0/10
✅ **ADR Generation** - Architecture Decision Records for all major choices
✅ **Consistency Validation** - Ensures all components align
✅ **BMM Compatible** - Integrates with Enhanced-PM → Enhanced-Dev

## Workflows

1. **create-architecture** - Main workflow with 6 architecture phases
2. **validate-architecture** - Consistency and completeness checks
3. **refine-architecture** - Targeted improvements

## Interactive Decision Points

- Technology stack (monolith vs microservices, languages, frameworks)
- Architecture patterns (MVC, hexagonal, event-driven, CQRS)
- Database choice (SQL, NoSQL, hybrid)
- Security approach (OAuth, JWT, session-based)
- Deployment strategy (containers, serverless, VMs)
- Integration patterns (REST, GraphQL, gRPC, events)

## Usage

```bash
/bmad:enhanced-architect:agents:master-architect
→ create-architecture
```

**Input:** PRD from Enhanced-PM
**Output:** Complete architecture docs + ADRs + diagrams

## Output Structure

```
docs/architecture/
├── architecture-complete.md
├── architecture-system.md
├── architecture-components.md
├── architecture-data.md
├── architecture-security.md
├── architecture-integration.md
├── architecture-deployment.md
├── adrs/
│   ├── adr-001-microservices.md
│   ├── adr-002-postgresql.md
│   └── ...
└── diagrams/
    ├── system-architecture.mmd
    ├── data-flow.mmd
    └── deployment.mmd
```

## Configuration

```yaml
architecture_quality_threshold: 6.0
enable_interactive_mode: true  # Ask before decisions
component_batch_simple_size: 8
component_batch_medium_size: 4
component_batch_complex_size: 2
```

## Integration

Enhanced-PM → **Enhanced-Architect** → Enhanced-Dev/Enhanced-SM

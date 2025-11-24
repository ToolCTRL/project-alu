# Enhanced Product Management Module

**Master/Sub-PM Pattern für BMAD**

Revolutionäres PRD-Erstellungssystem das Context-Overflow verhindert, qualitätsbasierte Refinements orchestriert, und BMM-kompatible Outputs generiert.

---

## 🎯 Das Problem

**Standard-PM mit AI:**
```
User → Claude (ein PM Agent)
        ↓ Research (30K)
        ↓ Vision schreiben (15K)
        ↓ Epic 1 planen (15K)
        ↓ Epic 2 planen (15K)
        ↓ Epic 3 planen (15K)
        ↓ Epic 4 planen (15K)
        ↓ PRD assemblieren (20K)
        ↓ Context ist voll (150K)
        ✗ Muss clearen
        ✗ Verliert Zusammenhang
```

**Das Qualitäts-Problem:**
```
PM schreibt Vision → Zu vage
      ↓ User muss manuell nachbessern
      ↓ Zeitverschwendung
      ✗ Frustrierend!
```

---

## ✅ Die Lösung: Enhanced-PM

### Master/Sub-PM Pattern

```
User → Master-PM (orchestriert)
         ↓ analysiert Product-Idee
         ↓ plant Research & Epics
         ↓
         ├──> Research-PM (Market + Competition)
         │    └─> Eigener Context (0-150K)
         │        Research Report
         │        Schließt → Context weg!
         │
         ├──> Vision-PM (Vision + Strategy)
         │    └─> Eigener Context (0-150K)
         │        Vision Document
         │        Schließt → Context weg!
         │
         ├──> Epic-Planner-PM 1 (Epics 1-3)
         │    └─> Eigener Context (0-150K)
         │        3 Epics
         │        Schließt → Context weg!
         │
         ├──> Epic-Planner-PM 2 (Epics 4-6)
         │    └─> Eigener Context (0-150K)
         │        3 Epics
         │        Schließt → Context weg!
         │
         └──> PRD-Assembler-PM (Final Assembly)
              └─> Eigener Context (0-150K)
                  Complete PRD
                  Schließt → Context weg!

         Master bleibt clean! (~20-30K tokens)
```

### Qualitätsbasierte Auto-Refinement

```
Vision-PM liefert schlechte Quality (4.5/10)
  ↓
  Master analysiert Issues
  ↓
  Spawnt Refine-Vision-PM mit Feedback
  ↓
  Refine-PM verbessert (max 2 Versuche)
  ↓
  Wenn erfolgreich: Weiter
  Wenn immer noch schlecht: Warning + Continue

KEIN manuelles Eingreifen nötig!
```

---

## 🚀 Features

### 1. Context Isolation

✅ **Kein Context-Overflow mehr**
- Jede Phase = frischer Context
- Master bleibt immer clean
- Kann riesige Produkte handlen

### 2. Quality-Based Refinement

✅ **Master orchestriert Qualität**
- Quality Score < 6/10? Auto-Refine
- Max 2 Refine-Versuche
- Dann warning + continue
- User macht NICHTS manuell!

### 3. Dynamic Epic Batching

✅ **Intelligente Batch-Größen**
```yaml
Simple Epics (1-3 Requirements):
  → 5 Epics pro Sub-PM

Medium Epics (4-8 Requirements):
  → 3 Epics pro Sub-PM

Complex Epics (9+ Requirements):
  → 1 Epic pro Sub-PM (isoliert)

Master entscheidet dynamisch!
```

### 4. Status-Tracking

✅ **Real-Time Progress**
```yaml
.bmad/enhanced-pm/status.yaml

phases:
  research: ✅ completed
  vision: ✅ completed (score: 7.5/10)
  epics: ⏳ in_progress (3/6 done)

epics:
  - epic-1: ✅ completed (8.2/10)
  - epic-2: ✅ completed (7.8/10)
  - epic-3: ⏳ in_progress
```

### 5. BMM-Kompatibel

✅ **Outputs funktionieren mit BMM**
- Epic-Files = BMM-Format
- BMM-SM kann Epics nutzen
- Enhanced-SM kompatibel
- Nahtlose Integration

### 6. Hybrid Output

✅ **Flexibles Output-Format**
```
docs/prd/product-name/
├── prd-complete.md      ← Alles in einem
├── sections/
│   ├── 01-vision.md
│   ├── 02-market-research.md
│   └── 03-user-research.md
└── epics/
    ├── epic-1-auth.md
    ├── epic-2-profile.md
    └── epic-3-dashboard.md
```

---

## 📦 Installation

Wenn Enhanced-PM bei BMAD-Installation ausgewählt wurde:

```bash
# Agent verfügbar als:
/master-pm

# Workflows verfügbar:
/bmad:enhanced-pm:workflows:create-prd
/bmad:enhanced-pm:workflows:refine-prd
/bmad:enhanced-pm:workflows:validate-prd
```

### Konfiguration

`bmad/enhanced-pm/config.yaml`:

```yaml
# Quality
quality_threshold: 6.0
max_refine_attempts: 2
enable_auto_refine: true

# Research
enable_market_research: true
enable_user_research: true
enable_tech_research: true

# Epic Batching (Dynamic)
epic_batch_simple_size: 5
epic_batch_medium_size: 3
epic_batch_complex_size: 1

# Output
output_format: "hybrid"
bmm_compatible: true
```

---

## 🎮 Nutzung

### Quick Start

```bash
# 1. Master-PM starten
/master-pm

# 2. Menü erscheint
1. *status - Aktueller Status
2. *create-prd - PRD erstellen
3. *refine-prd - PRD verbessern
4. *validate-prd - PRD validieren
5. *continue - Fortsetzen
6. *help - Hilfe
7. *exit - Beenden

# 3. PRD erstellen
> 2

# Master orchestriert:
# → Research Phases
# → Vision schreiben
# → Epics planen (dynamische Batches)
# → PRD assemblieren
# → Quality tracking
# → Auto-Refinement
```

### Workflow Ablauf

**1. Master startet:**
```
📋 Master PM bereit!

Produkt-Idee eingeben...
→ User Auth System
→ B2B SaaS Platform
→ Target: Enterprise customers

Status initialisiert ✓
```

**2. Research Phase:**
```
Phase 1: Market Research
  → Spawne Research-PM...
  → Analysiert Competitors...
  → Report erstellt ✓
  Duration: 5min

Phase 2: User Research
  → Spawne Research-PM...
  → Erstellt Personas...
  → Report erstellt ✓
  Duration: 6min

Phase 3: Technical Feasibility
  → Spawne Research-PM...
  → Tech Stack Empfehlung...
  → Assessment erstellt ✓
  Duration: 4min
```

**3. Vision Phase:**
```
Vision & Strategy
  → Spawne Vision-PM...
  → Vision geschrieben
  → Quality Score: 5.8/10 ⚠️

  Quality < 6/10 → Auto-Refine
    → Spawne Refine-Vision-PM...
    → Verbessert Klarheit & KPIs
    → Quality Score: 7.5/10 ✅

  Duration: 8min (inkl. 1 Refine)
```

**4. Epic Planning:**
```
Requirements extrahiert: 18

Epic Batching Strategy:
  Batch 1: Epic 1-3 (9 Reqs, Mixed)
  Batch 2: Epic 4 (7 Reqs, Complex)
  Batch 3: Epic 5-6 (2 Reqs, Simple)

Batch 1: Epics 1-3
  → Spawne Epic-Planner-PM...
  → Epic 1: Quality 8.0/10 ✅
  → Epic 2: Quality 7.5/10 ✅
  → Epic 3: Quality 8.5/10 ✅
  Duration: 12min

Batch 2: Epic 4 (Complex!)
  → Spawne Epic-Planner-PM...
  → Epic 4: Quality 7.0/10 ✅
  Duration: 10min

Batch 3: Epics 5-6
  → Spawne Epic-Planner-PM...
  → Epic 5: Quality 7.8/10 ✅
  → Epic 6: Quality 8.2/10 ✅
  Duration: 6min
```

**5. PRD Assembly:**
```
PRD Assembly
  → Spawne PRD-Assembler-PM...
  → Alle Sections geladen
  → Alle Epics integriert
  → Complete PRD generiert ✅
  Duration: 5min
```

**6. Final Summary:**
```
📋 PRD Creation Complete

Product: User Auth System

Research:
  ✓ Market Research
  ✓ User Research (5 Personas)
  ✓ Technical Assessment

Vision:
  ✓ Vision & Strategy
  Quality: 7.5/10 (1 refinement)

Epics:
  ✓ 6 epics planned
  Average Quality: 7.8/10
  MECE: ✅ Validated

Output:
  📄 Complete PRD: docs/prd/auth-system/prd-complete.md
  📁 Sections: docs/prd/auth-system/sections/
  📁 Epics: docs/prd/auth-system/epics/

Total Duration: 56min
Status: READY FOR STORIES ✅

Next Steps:
  → Review PRD
  → Run validate-prd for detailed check
  → Use Enhanced-SM to create stories
```

---

## 🏗️ Architektur

### Module-Struktur

```
enhanced-pm/
├── agents/
│   └── master-pm.agent.yaml       # Master orchestrator
│
├── workflows/
│   ├── create-prd/                # Main PRD creation
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── checklist.md
│   │
│   ├── refine-prd/                # Quality improvement
│   │   ├── workflow.yaml
│   │   └── instructions.md
│   │
│   └── validate-prd/              # Validation
│       ├── workflow.yaml
│       └── instructions.md
│
├── status/
│   └── pm-status-template.yaml    # Status tracking
│
├── templates/                     # PRD templates
│   ├── sections/
│   └── epics/
│
├── _module-installer/
│   └── install-config.yaml
│
├── config.yaml
└── README.md
```

### Sub-PM Types

**Research-PM** → Market/User/Tech Research
- Competitor Analysis
- User Personas
- Tech Stack Assessment

**Vision-PM** → Vision & Strategy
- Vision Statement
- Strategic Goals
- Success Metrics
- Value Proposition

**Epic-Planner-PM** → Epic Planning
- Requirements → Epics
- AC Definition
- Dependency Mapping
- Size Estimation

**Refine-PM** → Quality Improvement
- Section Refinement
- Quality Enhancement
- Specific Issue Fixes

**PRD-Assembler-PM** → Final Assembly
- Section Integration
- Complete PRD Generation
- Table of Contents
- Cross-References

---

## 📊 Status-File

`.bmad/enhanced-pm/status.yaml`:

```yaml
current_product:
  name: "User Auth System"
  status: "epic_planning"
  started: "2025-11-02T14:00:00Z"

phases:
  research:
    status: "completed"
    market_research: "completed"
    user_research: "completed"
    tech_research: "completed"

  vision:
    status: "completed"
    quality_score: 7.5
    refinement_attempts: 1

  epics:
    status: "in_progress"
    total_epics: 6
    epics_completed: 3
    batches_completed: 1

epics:
  - id: "epic-1"
    title: "Authentication"
    status: "completed"
    quality_score: 8.0
    requirements: ["REQ-1", "REQ-2", "REQ-3"]

  - id: "epic-2"
    title: "User Profile"
    status: "completed"
    quality_score: 7.5

  - id: "epic-3"
    status: "in_progress"

progress:
  current_phase: "epic_planning"
  percentage: 60
  epics_completed: 3
  epics_pending: 3

quality:
  vision_score: 7.5
  avg_epic_score: 7.8
```

---

## 🎯 Best Practices

### Product-Idee vorbereiten

**Gut vorbereitet:**
- Klare Produkt-Idee
- Zielgruppe bekannt
- Business Goals definiert
- Problem Statement klar

**Beispiel:**
```
Product: User Auth System
Domain: B2B SaaS
Target: Enterprise customers
Problem: Complex auth requirements, compliance needs
Goal: Secure, scalable, enterprise-ready authentication
```

### Quality Thresholds verstehen

```yaml
Score 10-9: Exzellent
Score 8-7: Gut (keine Action)
Score 6-5: Akzeptabel (Optional Refine)
Score 4-3: Verbesserung nötig (Auto-Refine)
Score 2-1: Schlecht (2x Auto-Refine)
```

### Epic-Komplexität einschätzen

**Simple Epic:**
- 1-3 Requirements
- Klarer Scope
- Keine Dependencies
- Standard-Features

**Medium Epic:**
- 4-8 Requirements
- Moderater Scope
- Einige Dependencies
- Mix aus Standard & Custom

**Complex Epic:**
- 9+ Requirements
- Großer Scope
- Viele Dependencies
- Custom/Innovative Features

---

## 🐛 Troubleshooting

### Vision hat schlechte Quality

**Check:**
- Status-File quality_score
- Refinement attempts

**Wenn immer <6:**
- Manuell refine-prd Workflow
- Klarere Product-Idee angeben
- Mehr Context in Brief

### Zu viele Epics

**Check:**
- Epic-Count in Status
- Requirements-Anzahl

**Lösung:**
- Requirements gruppieren
- Epics zusammenfassen
- Scope reduzieren

### Epic Overlaps (nicht MECE)

**Check:**
- Validate-PRD Workflow
- MECE Validation Report

**Lösung:**
- Epic-Boundaries klarer definieren
- Requirements neu zuweisen
- Refine-PRD für betroffene Epics

### Context Overflow (sollte NICHT passieren!)

**Falls doch:**
- Epic-Batch-Größen reduzieren
- Config anpassen
- Einzelne Epics planen

---

## 🔧 Konfiguration

### Quality Thresholds

```yaml
quality_threshold: 7.0    # Höherer Standard
max_refine_attempts: 3    # Mehr Versuche
enable_auto_refine: true  # Auto-Refine aktiviert
```

### Research Phasen

```yaml
enable_market_research: false  # Skippen wenn nicht nötig
enable_user_research: true
enable_tech_research: true
```

### Epic Batching

```yaml
# Mehr Epics pro Batch (schneller aber größere Context)
epic_batch_simple_size: 7
epic_batch_medium_size: 4
epic_batch_complex_size: 2
```

### Output Format

```yaml
output_format: "single"  # Nur Complete PRD
# ODER
output_format: "multi"   # Nur Sections
# ODER
output_format: "hybrid"  # Beides (empfohlen)
```

---

## 🤝 Integration

### Mit Enhanced-SM

```bash
# 1. Enhanced-PM → PRD + Epics
/master-pm
> create-prd

# 2. Enhanced-SM → Stories
/master-sm
> create-stories-from-epic

# Epics sind kompatibel! ✅
```

### Mit BMM-SM

```bash
# 1. Enhanced-PM → PRD + Epics
/master-pm

# 2. Standard BMM-SM → Stories
/sm
> *create-story

# Epics sind BMM-format! ✅
```

### Mit Enhanced-Dev

```
Enhanced-PM → Epics
  ↓
Enhanced-SM (oder BMM-SM) → Stories
  ↓
Enhanced-Dev → Code

Komplette Enhanced-Chain!
```

---

## 📈 Performance

- **Research Phase**: 10-20 min (alle 3 Phasen)
- **Vision Phase**: 5-10 min (inkl. Refinement)
- **Epic Planning**: 5-15 min pro Batch (je nach Größe)
- **PRD Assembly**: 3-5 min
- **Total für 6 Epics**: 45-70 min

**Context:**
- Master-PM: ~30K
- Sub-PMs: 0-150K (dann weg!)
- Kein Overflow! ✅

---

## 🚧 Limitationen

- Sequential (Parallel in v2.0)
- Braucht klare Product-Idee
- Auto-Refine für simple Issues am besten
- Komplexe strategische Entscheidungen brauchen ggf. Manual Review
- MECE-Validation ist heuristisch, nicht perfekt

---

## 🎓 Roadmap

### v1.1
- [ ] Parallel Research Phases
- [ ] Learning von Quality-Patterns
- [ ] Template-Bibliothek
- [ ] Competitor-Intelligence Integration

### v2.0
- [ ] Parallel Epic Planning
- [ ] AI-basierte MECE-Validation
- [ ] Stakeholder-Perspective Sub-PMs
- [ ] Automated Market-Sizing

---

**Happy Product Management! 🚀**

Mit Enhanced-PM:
- ✅ Kein Context-Overflow
- ✅ Quality-Based Refinement
- ✅ Dynamic Epic Batching
- ✅ Status-Tracking
- ✅ BMM-Compatible
- ✅ Hybrid Output

**PRD-Erstellung war noch nie so entspannt!**

# Enhanced Development Module

**Master/Sub-Developer Pattern für BMAD**

Revolutionäres Entwicklungssystem das Context-Overflow verhindert, autonome Fixes orchestriert, und Test-Driven Development mit Status-Tracking vereint.

---

## 🎯 Das Problem

**Standard-Entwicklung mit AI:**
```
User → Claude (ein einziger Agent)
        ↓ liest Story
        ↓ implementiert Task 1
        ↓ implementiert Task 2
        ↓ implementiert Task 3
        ↓ Context ist voll (150K tokens)
        ↓ User muss clearen
        ✗ Kontext verloren!
        ✗ Muss alles neu laden
        ✗ Zeit verschwendet
```

**Das Endlos-Debug-Problem:**
```
Agent implementiert → Tests fail
       ↓ versucht zu fixen
       ↓ Tests fail wieder
       ↓ versucht nochmal
       ↓ Tests fail wieder
       ↓ läuft im Kreis
       ✗ User muss manuell eingreifen
       ✗ Frustrierend!
```

---

## ✅ Die Lösung: Enhanced Dev

### Master/Sub-Developer Pattern

```
User → Master-Developer (koordiniert)
         ↓ analysiert Story
         ↓ plant Tasks
         ↓
         ├──> Sub-Dev 1 (Task 1)
         │    └─> Eigener Context (0-150K)
         │        Implementiert, testet, committed
         │        Schließt → Context weg!
         │
         ├──> Sub-Dev 2 (Task 2)
         │    └─> Eigener Context (0-150K)
         │        Implementiert, testet, committed
         │        Schließt → Context weg!
         │
         └──> Sub-Dev 3 (Task 3)
              └─> Eigener Context (0-150K)
                  Implementiert, testet, committed
                  Schließt → Context weg!

         Master bleibt clean! (~20-30K tokens)
```

### Autonome Fix-Orchestrierung

```
Task fehlgeschlagen?
  ↓
  Master analysiert Fehler
  ↓
  Spawnt Fix-Developer mit Error-Context
  ↓
  Fix-Dev repariert (max 3 Versuche)
  ↓
  Wenn erfolgreich: Weiter
  Wenn blockiert: Skip + Log + Continue

KEIN manuelles Eingreifen nötig!
```

---

## 🚀 Features

### 1. Context Isolation

✅ **Kein Context-Overflow mehr**
- Jeder Task = frischer Context
- Master bleibt immer clean
- Kann riesige Codebases handlen

### 2. Autonome Fixes

✅ **Master orchestriert alles**
- Tasks fehlgeschlagen? Auto-Fix spawnen
- Max 3 Fix-Versuche
- Dann skip + continue
- User macht NICHTS manuell!

### 3. Status-Tracking

✅ **Real-Time Progress**
```yaml
.bmad/enhanced-dev/status.yaml

tasks:
  - task-1: ✅ completed (tests: 8/8)
  - task-2: ⏳ in_progress
  - task-3: ❌ blocked (DB timeout - 3 attempts)
  - task-4: ⏸️ pending

progress: 1/4 (25%)
tests: 8 passing, 0 failing
```

### 4. Anti-Loop Guards

✅ **Keine Endlos-Schleifen**
- Max 3 Task-Versuche
- Max 3 Fix-Versuche
- Task-Timeout (15min default)
- Nach Limit: Skip + Continue

### 5. Test-Driven

✅ **Tests sind Pflicht**
- Jeder Sub-Dev schreibt Tests
- ALL tests müssen passen
- Keine Fake-Passes erlaubt
- Types: Unit / Integration / E2E

### 6. Git Integration

✅ **Auto-Commits**
- Nach jedem erfolgreichen Task
- Strukturierte Commit-Messages
- Tracked in Status
- Push optional

---

## 📦 Installation

### In BMAD installiert

Wenn Enhanced-Dev Module bei der BMAD-Installation ausgewählt wurde:

```bash
# Agent verfügbar als:
/master-dev

# Workflows verfügbar:
/bmad:enhanced-dev:workflows:dev-story
/bmad:enhanced-dev:workflows:validate-story
/bmad:enhanced-dev:workflows:deploy
```

### Konfiguration

`bmad/enhanced-dev/config.yaml`:

```yaml
# Tests
run_tests_command: "npm test"
test_coverage_threshold: 80

# Retries
max_task_retries: 3
max_fix_retries: 3
task_timeout_minutes: 15

# Git
auto_commit: true
git_branch: "main"

# Deploy
auto_deploy: false
deploy_command: ""
```

---

## 🎮 Nutzung

### Quick Start

```bash
# 1. Master-Developer starten
/master-dev

# 2. Menü erscheint
1. *status - Aktueller Status
2. *dev-story - Story entwickeln
3. *validate-story - Story validieren
4. *deploy - Deployen
5. *continue - Fortsetzen
6. *help - Hilfe
7. *exit - Beenden

# 3. Story entwickeln
> 2

# Master orchestriert:
# → Lädt Story + Context
# → Plant Tasks
# → Spawnt Sub-Devs
# → Orchestriert Fixes
# → Tracked Status
# → Committed Code
# → Zeigt Summary
```

### Workflow Ablauf

**1. Master startet:**
```
📊 Master Developer bereit!

Status laden... ✓
Story: STORY-042 - User Authentication
Tasks: 5 identifiziert
```

**2. Task Execution:**
```
Task 1: Create auth API endpoint
  → Spawne Backend-Developer...
  → Implementiert...
  → Tests: 8/8 passing ✓
  → Committed: abc123 ✓
  Duration: 4min

Task 2: Add login UI component
  → Spawne Frontend-Developer...
  → Implementiert...
  → Tests: 12/12 passing ✓
  → Committed: def456 ✓
  Duration: 6min

Task 3: Database integration
  → Spawne Backend-Developer...
  → Implementiert...
  → Tests: 2/5 failing ✗

  Fix-Versuch 1:
    → Spawne Fix-Developer...
    → Tests: 3/5 failing ✗

  Fix-Versuch 2:
    → Spawne Fix-Developer...
    → Tests: 5/5 passing ✓
    → Committed: ghi789 ✓
  Duration: 11min (inkl. 2 Fixes)
```

**3. Final Summary:**
```
📊 Story Development Complete

Story: STORY-042 - User Authentication

Results:
  ✅ 5/5 tasks completed
  ❌ 0 blocked

Tests:
  ✓ 25 passing
  ✗ 0 failing
  📈 Coverage: 87%

Git:
  📝 5 commits
  🔖 Latest: ghi789

Status: READY_FOR_REVIEW ✅

Next Steps:
  → Run code-review workflow
  → Or deploy if ready
```

---

## 🏗️ Architektur

### Module-Struktur

```
enhanced-dev/
├── agents/
│   └── master-developer.agent.yaml    # Master orchestrator
│
├── workflows/
│   ├── dev-story/                     # Main development flow
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   ├── checklist.md
│   │   └── README.md
│   │
│   ├── validate-story/                # Story validation
│   │   ├── workflow.yaml
│   │   └── instructions.md
│   │
│   └── deploy/                        # Deployment pipeline
│       ├── workflow.yaml
│       └── instructions.md
│
├── status/
│   └── dev-status-template.yaml       # Status file template
│
├── _module-installer/
│   └── install-config.yaml            # Installation config
│
├── config.yaml                        # Module config (generated)
└── README.md                          # This file
```

### Sub-Developer Types

**Backend Tasks** → `backend-architect`
- API Endpoints
- Database logic
- Business logic
- Tests: Unit + Integration

**Frontend Tasks** → `frontend-developer`
- React/Vue components
- UI implementation
- State management
- Tests: Component + Unit

**Testing Tasks** → `test-writer-fixer`
- E2E Tests (Playwright)
- Integration tests
- Test infrastructure

**General Tasks** → `general-purpose`
- Documentation
- Configuration
- Misc tasks

---

## 📊 Status-File

`.bmad/enhanced-dev/status.yaml`:

```yaml
current_story:
  id: "story-042"
  status: "in_progress"
  started: "2025-11-02T14:30:00Z"

tasks:
  - id: "task-1"
    description: "Create auth API"
    status: "completed"
    tests_passed: true
    committed: true
    commit_hash: "abc123"

  - id: "task-2"
    status: "in_progress"

  - id: "task-3"
    status: "blocked"
    error: "DB connection timeout"
    attempts: 3
    suggestion: "Check DB config"

progress:
  total_tasks: 5
  completed: 1
  in_progress: 1
  blocked: 1
  pending: 2
  percentage: 20

tests:
  passing: 8
  failing: 0
  coverage: 87

commits:
  count: 1
  latest_hash: "abc123"
```

---

## 🎯 Best Practices

### Story Vorbereitung

1. **Klare Acceptance Criteria**
   - Testbar
   - Spezifisch
   - Messbar

2. **Story Context generieren**
   ```bash
   /bmad:bmm:workflows:story-context
   ```

3. **Validieren vor Dev**
   ```bash
   /master-dev
   > validate-story
   ```

### Task Definition

**Gut:**
- "Create POST /api/auth/login endpoint"
- "Add LoginForm component with email/password"
- "Write Playwright test for login flow"

**Schlecht:**
- "Make auth better" (zu vage)
- "Fix everything" (unklar)
- "Improve performance" (nicht messbar)

### Test-Strategie

**Unit Tests** - Jede Funktion/Component
**Integration Tests** - API Endpoints, Datenbankoperationen
**E2E Tests** - Eigener Task, User-Flows

---

## 🐛 Troubleshooting

### "Task immer blockiert"

**Check:**
- Error-Log in status.yaml
- Test-Ausgabe
- Sub-Dev Prompt-Klarheit

**Lösung:**
- Task kleiner aufteilen
- Andere Sub-Dev Type probieren
- AC klarer formulieren

### "Context Overflow trotzdem"

**Das sollte nicht passieren!**

Falls doch:
- Task zu komplex?
- In kleinere Tasks aufteilen
- Context-File reduzieren

### "Tests fail immer"

**Check:**
- Test-Command richtig?
- Dependencies installiert?
- Test-Environment konfiguriert?

**Sub-Devs werden:**
- Auto-Fix versuchen (3x)
- Dann blockieren
- Fehler loggen

### "Zu viele blockierte Tasks"

**Wenn >50% blockiert:**
- Story zu komplex
- In kleinere Stories aufteilen
- AC-Klarheit prüfen
- Environment checken

---

## 🔧 Konfiguration

### Test-Command ändern

```yaml
# config.yaml
run_tests_command: "npm run test:ci"
```

### Retries anpassen

```yaml
max_task_retries: 5      # Mehr Versuche
max_fix_retries: 2        # Weniger Fix-Versuche
task_timeout_minutes: 20  # Längerer Timeout
```

### Deploy konfigurieren

```yaml
deploy_command: "vercel deploy --prod"
deploy_target: "production"
auto_deploy: true  # Auto nach Story
```

### Git Settings

```yaml
auto_commit: false     # Manuelle Commits
git_branch: "develop"  # Anderer Branch
create_tag: true       # Tags bei Deploy
```

---

## 🚧 Limitationen

- Sequential by default (Parallelisierung optional)
- Braucht klare Acceptance Criteria
- Test-Environment muss ready sein
- Auto-Fixes für einfache Fehler am besten
- Komplexe Architektur-Issues brauchen ggf. Manual Review

---

## 🎓 Erweiterte Features

### Parallel Task Execution

Unabhängige Tasks parallel:
```yaml
# In instructions.md anpassen
# Mehrere Task-Tool-Calls in einer Message
```

### Custom Sub-Developer Types

Eigene Sub-Dev Types definieren:
```yaml
# In agent.yaml erweitern
# Oder via Task subagent_type parameter
```

### Integration mit BMM

Works mit BMM Stories:
```bash
# BMM Story erstellen
/pm → *create-story

# Enhanced-Dev nutzen
/master-dev → *dev-story
```

---

## 📈 Roadmap

### v1.1 (Geplant)
- [ ] Parallel Task Execution
- [ ] Learning von blocked tasks
- [ ] Alternative Approaches vorschlagen
- [ ] Deploy Pipeline Integration

### v2.0 (Zukunft)
- [ ] Sub-Dev Spezialisierung Learning
- [ ] Performance Metrics
- [ ] Auto Story Decomposition
- [ ] IDE Integration

---

## 🤝 Support

**Fragen? Issues?**
- Check die READMEs in den Workflow-Ordnern
- Schaue in status.yaml für Details
- Teste mit validate-story workflow

**Contributing:**
- Modul ist in `/bmad/enhanced-dev/`
- Agent: `agents/master-developer.agent.yaml`
- Workflows: `workflows/*/`

---

## 📄 Lizenz

Teil der BMAD Methode
Enhanced Dev Module v1.0

---

**Happy Developing! 🚀**

Mit Enhanced-Dev:
- ✅ Kein Context-Overflow
- ✅ Autonome Fixes
- ✅ Status-Tracking
- ✅ Anti-Loop Guards
- ✅ Test-Driven
- ✅ Git Integration

**Entwicklung war noch nie so entspannt!**

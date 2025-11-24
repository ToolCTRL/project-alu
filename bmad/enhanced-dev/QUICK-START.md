# Enhanced-Dev Module - Quick Start

## ✅ Status: ERSTELLT!

Das Enhanced-Dev Modul wurde erfolgreich in `/Users/raffael/Desktop/CUSTOM-BMAD/bmad/enhanced-dev/` erstellt!

---

## 📦 Was wurde erstellt?

```
enhanced-dev/
├── agents/
│   └── master-developer.agent.yaml     ✅ Master Orchestrator
│
├── workflows/
│   ├── dev-story/                      ✅ Main Workflow
│   ├── validate-story/                 ✅ Validation
│   └── deploy/                         ✅ Deployment
│
├── status/
│   └── dev-status-template.yaml        ✅ Status Template
│
├── _module-installer/
│   └── install-config.yaml             ✅ Installation Config
│
├── config.yaml                         ✅ Module Config
├── README.md                           ✅ Dokumentation
└── QUICK-START.md                      ✅ Diese Datei
```

---

## ⚠️ WICHTIG: Nächste Schritte

### PROBLEM:

Der Agent liegt als **`.agent.yaml`** (YAML-Source) vor, muss aber als **`.md`** (kompiliert) vorliegen, damit Claude ihn nutzen kann.

Bei einer regulären BMAD-Installation würde der Installer das automatisch kompilieren.

### LÖSUNG: 2 Optionen

---

## 🎯 OPTION 1: In BMAD-METHOD integrieren (Empfohlen)

**Für automatische Kompilierung und echte Installation:**

### Schritt 1: In BMAD-METHOD kopieren

```bash
# Kopiere enhanced-dev in BMAD-METHOD Source
cp -r /Users/raffael/Desktop/CUSTOM-BMAD/bmad/enhanced-dev \
      /Users/raffael/Desktop/BMAD-METHOD/src/modules/
```

### Schritt 2: BMAD neu installieren

```bash
cd /Users/raffael/Desktop/BMAD-METHOD
node tools/cli/bmad-cli.js install

# Wähle:
# - Target: /Users/raffael/Desktop/CUSTOM-BMAD (oder neues Projekt)
# - Module: enhanced-dev auswählen ✓
# - IDEs: claude-code ✓
```

### Schritt 3: Agent kompiliert! ✅

Der Installer:
- ✅ Kompiliert `master-developer.agent.yaml` → `master-developer.md`
- ✅ Generiert Slash-Commands
- ✅ Erstellt Manifeste
- ✅ Alles ready!

### Schritt 4: Nutzung

```bash
# Agent verfügbar:
/master-dev

# Oder über Slash-Command:
/bmad:enhanced-dev:agents:master-developer

# Workflows:
/bmad:enhanced-dev:workflows:dev-story
```

---

## 🔧 OPTION 2: Lokale Nutzung (Manuell)

**Wenn du es JETZT ohne Installation testen willst:**

### Schritt 1: Agent manuell "kompilieren"

Eigentlich bräuchten wir den BMAD YAML-Compiler, aber für Quick-Test:

**Erstelle:** `bmad/enhanced-dev/agents/master-developer.md`

```markdown
---
name: "master-developer"
description: "Master Developer"
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified.

```xml
<agent id="bmad/enhanced-dev/agents/master-developer.md" name="Master Dev" title="Master Developer" icon="🎯">
  <!-- Copy from master-developer.agent.yaml and convert to XML format -->
  <!-- Oder warte auf Option 1 - echter Compiler -->
</agent>
```
```

**PROBLEM:** Das ist fehleranfällig und der YAML→MD Compiler macht mehr als nur Copy-Paste.

**EMPFEHLUNG:** → Nutze Option 1!

---

## 🎯 EMPFEHLUNG:

**→ Nutze OPTION 1**

1. Kopiere Modul nach `/BMAD-METHOD/src/modules/`
2. Führe BMAD Installation aus
3. Wähle `enhanced-dev` Modul
4. Fertig! Alles kompiliert und ready

---

## 📚 Was dann?

### Nach Installation:

**1. Master-Dev starten:**
```bash
/master-dev
```

**2. Menü nutzen:**
```
1. *status - Status anzeigen
2. *dev-story - Story entwickeln
3. *validate-story - Validieren
4. *deploy - Deployen
```

**3. Story entwickeln:**
```bash
/master-dev
> 2  # dev-story

# Master orchestriert:
# → Sub-Devs spawnen
# → Tasks abarbeiten
# → Auto-Fixes
# → Status tracking
# → Commits
```

---

## 🧪 Testen

### Test-Story erstellen:

```markdown
# story-test.md

## Story: Test Authentication

### Acceptance Criteria
1. User can login with email/password
2. Invalid credentials show error
3. Successful login redirects to dashboard

### Tasks
1. Create POST /api/auth/login endpoint
2. Add LoginForm component
3. Write integration tests
```

### Story-Context generieren:

```bash
# Wenn BMM installiert:
/pm
> *story-context
```

### Dann Enhanced-Dev nutzen:

```bash
/master-dev
> validate-story  # Erst validieren
> dev-story       # Dann entwickeln
```

---

## 📊 Status-File checken

Nach dem Lauf:

```bash
cat .bmad/enhanced-dev/status.yaml

# Zeigt:
# - Alle Tasks
# - Status (completed/blocked)
# - Tests
# - Commits
# - Fehler
```

---

## 🔍 Verzeichnis-Struktur nach Installation

```
dein-projekt/
├── bmad/
│   ├── core/
│   ├── bmb/
│   ├── bmm/
│   └── enhanced-dev/           ← Modul
│       ├── agents/
│       │   └── master-developer.md  ← KOMPILIERT!
│       ├── workflows/
│       └── config.yaml
│
├── .bmad/
│   └── enhanced-dev/
│       └── status.yaml         ← Status-Tracking
│
└── .claude/
    └── commands/
        └── bmad/
            └── enhanced-dev/   ← Slash-Commands
                ├── agents/
                │   └── master-developer.md
                └── workflows/
                    ├── dev-story.md
                    ├── validate-story.md
                    └── deploy.md
```

---

## 💡 Tipps

### Konfiguration anpassen:

```yaml
# bmad/enhanced-dev/config.yaml

# Tests
run_tests_command: "npm run test:ci"  # Anpassen!

# Retries
max_task_retries: 5  # Mehr Versuche

# Git
auto_commit: false   # Manuelle Commits
```

### Debug:

```bash
# Status checken:
/master-dev
> status

# Oder direkt:
cat .bmad/enhanced-dev/status.yaml
```

### Bei Problemen:

1. **Agent nicht gefunden?**
   → Option 1 nutzen (Installation)

2. **Workflows fehlen?**
   → Manifeste prüfen
   → Neu-Installation

3. **Tests feilen?**
   → Status-File checken
   → Error-Logs anschauen

---

## 🚀 Ready!

Das Modul ist erstellt! Nutze **Option 1** um es zu installieren und dann:

```bash
/master-dev
```

**Happy Developing! 🎯**

---

## 📖 Weitere Infos

- **README.md** - Komplette Dokumentation
- **workflows/dev-story/README.md** - Dev-Story Details
- **workflows/*/instructions.md** - Workflow-Logik

---

**Fragen?**

Check die READMEs oder schau in die `instructions.md` Dateien!

# Architectural Decisions & Design Documentation

This folder contains documentation of major architectural decisions, design patterns, and implementation approaches used throughout the RichTextEditor codebase.

## Purpose

- **Decision Tracking**: Document why certain architectural patterns were chosen
- **Learning Resource**: Help new team members understand design decisions
- **Problem Resolution**: Reference solutions to common architectural challenges
- **Future Reference**: Prevent repeating mistakes or reconsidering settled decisions

## Contents

### 1. Toolbar Status Update Flow Refactoring

**Topic**: Eliminating Redundant Formatting State Queries

**Document**: `toolbar-status-update-refactoring.md`

**Covers**:
- **Problem**: Original architecture queried formatting state 2-3 times per command (duplicate queries in toolbar and quick-toolbar modules)
- **Solution**: Centralized `FormattingStateService` with single query point in `EditorController.onSuccess()`
- **Architecture**: Event-driven distribution via `formattingStateUpdated` observer event
- **Results**: 50-66% reduction in state queries and UI updates per command
- **Removed**: Eliminated confusing dual-event paths (old `refreshToolbarStatus` relay mechanism)

**Key Decision**: Use service pattern to separate query logic from UI rendering, enabling consistency and future module reuse.

---

### 2. Command Builder Pattern (`JOURNEY.md` + `IMPLEMENTATION.md`)

**Topic**: Command Execution API Redesign

**Documents**:
- **JOURNEY.md**: High-level overview of the problem, three attempted solutions, and final approach
  - Problem statement and why it matters
  - Generics approach (why it failed)
  - Function overloading approach (why it failed)
  - Chainable command builder pattern (why it succeeded)
  - Key learnings and before/after comparison

- **IMPLEMENTATION.md**: Deep technical details for developers implementing or extending the command system
  - Complete class hierarchy and builder definitions
  - Type-safe argument interfaces
  - Integration points with RichTextEditorUI and EditorController
  - Design patterns used (Builder, Facade, Fluent Interface, Delegation)
  - Testing strategy
  - Extension points for adding new commands

**Key Decision**: When API design impacts downstream tools (TypeDoc, Vue generator), the solution must account for those constraints rather than fighting them.

---

## How to Use This Folder

### When Adding New Documentation

1. Choose a descriptive filename
2. Create a pair of documents if appropriate:
   - `FEATURE_NAME-JOURNEY.md`: Decision process and alternatives
   - `FEATURE_NAME-IMPLEMENTATION.md`: Technical details for developers
3. Or create a single document with both sections if the feature is smaller

### Document Structure Guidelines

**JOURNEY.md** should include:
- Problem statement
- What was tried and why it failed/succeeded
- Key learnings
- Before/after comparison

**IMPLEMENTATION.md** should include:
- Architecture overview (with diagram)
- Class/module hierarchy
- Type definitions and interfaces
- Integration points
- Design patterns used
- Code examples and usage patterns
- Testing approach
- Extension points

### Naming Convention

- Folder: `docs/architectural-decisions/`
- Files: `FEATURE_NAME-JOURNEY.md` and `FEATURE_NAME-IMPLEMENTATION.md`
- Example: `command-builder-journey.md`, `command-builder-implementation.md`

---

## Related Documentation

- **TypeScript/JavaScript Guidelines**: See `docs/convention/` for coding standards
- **Component Architecture**: See `docs/component/` for component structure
- **Specifications**: See `docs/spec/` for feature specifications

---

## Folder Structure

```
docs/
├── architectural-decisions/     ← You are here
│   ├── README.md               (This file)
│   ├── JOURNEY.md              (Command Builder decision journey)
│   ├── IMPLEMENTATION.md       (Command Builder implementation details)
│   └── ... (future features)
│
├── component/                  (Component structure & architecture)
├── convention/                 (Coding standards & conventions)
└── spec/                       (Feature specifications)
```

---

## Future Documentation Topics

Candidates for future architectural decision documents:
- Real-time collaboration implementation
- Plugin system design
- Toolbar layout and configuration system
- Undo/redo architecture
- Performance optimization strategies
- Accessibility implementation patterns
- Testing strategies (unit, integration, E2E)

Feel free to add documentation as new architectural decisions are made or complex patterns are established!

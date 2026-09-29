# Specification Index

**Last Updated**: 2026-03-17  
**Total Specs**: 5 foundation + 7 component capability specs = **12 specs**

---

## How to Use This Index

**CRITICAL**: Do not read all specs for every change. Follow this process:
1. **Identify which component(s)** are affected by your change
2. **Read the foundation specs** that apply to your change type
3. **Read the component's capability spec(s)** for the specific area
4. **Read 3–5 relevant specs**, not all 12

---

## Foundation Specs (Apply to ALL Components)

These specs cover cross-cutting concerns that apply to multiple or all components.

| Spec | Scope | When to Read |
|---|---|---|
| [testing-standards](./testing-standards/spec.md) | Test file organization, Jasmine patterns, memory profiling, event/keyboard testing | **Every change** that adds or modifies any code |
| [accessibility](./accessibility/spec.md) | ARIA attributes, keyboard navigation, focus management, disabled state | **Every UI change** affecting behavior or rendering |
| [component-lifecycle](./component-lifecycle/spec.md) | preRender/render/destroy sequence, @NotifyPropertyChanges, event wiring | When modifying lifecycle methods, constructor, or event wiring |
| [css-architecture](./css-architecture/spec.md) | e-* class naming, RTL support, state classes, cssClass propagation, icon styling | When adding CSS classes, RTL behavior, or icon handling |
| [property-system](./property-system/spec.md) | @Property/@Event/@Complex/@Collection decorators, getModel(), onPropertyChanged, HTML sanitization | When adding/changing properties, events, or nested models |

**Foundation Spec Selection Guide**:
- **Any code change** → always read `testing-standards`
- **Any UI/rendering change** → add `accessibility` + `css-architecture`
- **New property or event** → add `property-system` + `component-lifecycle`
- **Lifecycle method change** → add `component-lifecycle`

---

## Component Specs (Component-Specific Capabilities)

### DropDownButton

**Purpose**: Toggles a contextual popup overlay with a list of action items  
**Location**: `src/drop-down-button/drop-down-button.ts`  
**Capability Count**: 2 specs  

| Capability | What It Covers | Read When |
|---|---|---|
| [api-contract](./components/drop-down-button/api-contract/spec.md) | All properties, methods, events and their behavior contracts | **Always read** for any DropDownButton change |
| [popup-behavior](./components/drop-down-button/popup-behavior/spec.md) | Popup creation/positioning, open/close sequence, animation, lazy init (`createPopupOnClick`) | When changing popup open/close, positioning, animation, or lazy creation |

**Quick Decision Tree for DropDownButton**:
- Changing a property? → `api-contract` + `property-system` + `testing-standards`
- Changing popup open/close behavior? → `api-contract` + `popup-behavior` + `accessibility` + `testing-standards`
- Adding keyboard support? → `api-contract` + `accessibility` + `testing-standards`
- Changing CSS or icon styling? → `css-architecture` + `api-contract` + `testing-standards`
- Changing popup animation? → `popup-behavior` + `testing-standards`
- Changing `createPopupOnClick`? → `popup-behavior` + `api-contract` + `component-lifecycle`
- Fixing ARIA? → `accessibility` + `api-contract` + `testing-standards`

---

### SplitButton

**Purpose**: Dual-button (primary action + dropdown popup) component  
**Location**: `src/split-button/split-button.ts`  
**Capability Count**: 1 spec  
**Note**: SplitButton inherits DropDownButton — DropDownButton specs are also relevant

| Capability | What It Covers | Read When |
|---|---|---|
| [api-contract](./components/split-button/api-contract/spec.md) | Inherited API differences, `click` event, internal structure, Angular element support, async beforeOpen/beforeClose | **Always read** for any SplitButton change |

**Quick Decision Tree for SplitButton**:
- Changing primary button behavior? → `split-button/api-contract` + `testing-standards`
- Changing popup behavior? → `split-button/api-contract` + `drop-down-button/popup-behavior` + `accessibility`
- Changing CSS/wrapper structure? → `split-button/api-contract` + `css-architecture`
- Adding Angular framework support? → `split-button/api-contract` + `component-lifecycle`
- Fixing async beforeOpen/beforeClose? → `split-button/api-contract` + `testing-standards`

> **Important**: SplitButton extends DropDownButton. Changes to DropDownButton MUST be reviewed against SplitButton behavior. Read `split-button/api-contract` for any DropDownButton change that could affect SplitButton.

---

### ProgressButton

**Purpose**: Button with visual progress feedback via spinner and background filler  
**Location**: `src/progress-button/progress-button.ts`  
**Capability Count**: 2 specs  

| Capability | What It Covers | Read When |
|---|---|---|
| [api-contract](./components/progress-button/api-contract/spec.md) | All properties, spinSettings, animationSettings, methods (start/stop/progressComplete), events | **Always read** for any ProgressButton change |
| [progress-animation](./components/progress-button/progress-animation/spec.md) | requestAnimationFrame loop, timing calculation, background filler, pause/resume, spinner visibility | When changing the animation loop, timing, filler behavior, or start/stop/complete logic |

**Quick Decision Tree for ProgressButton**:
- Changing a property (spinSettings, animationSettings, duration)? → `api-contract` + `property-system` + `testing-standards`
- Changing animation timing or loop? → `api-contract` + `progress-animation` + `testing-standards`
- Changing spinner behavior? → `api-contract` + `progress-animation` + `css-architecture`
- Fixing progress percentage or filler? → `progress-animation` + `api-contract` + `testing-standards`
- Fixing accessibility (aria-valuenow)? → `accessibility` + `api-contract`
- Adding new animation effect? → `progress-animation` + `css-architecture` + `testing-standards`

---

### ButtonGroup

**Purpose**: Groups buttons horizontally/vertically as a logical unit  
**Location**: `src/button-group/button-group.ts`  
**Capability Count**: 1 spec  

| Capability | What It Covers | Read When |
|---|---|---|
| [api-contract](./components/button-group/api-contract/spec.md) | `createButtonGroup` function, `CreateButtonGroupModel`, button/label/input support, usage constraints | **Always read** for any ButtonGroup change |

**Quick Decision Tree for ButtonGroup**:
- Changing `createButtonGroup` function behavior? → `api-contract` + `testing-standards`
- Adding support for new element types? → `api-contract` + `css-architecture` + `testing-standards`
- Fixing accessibility (role, keyboard)? → `accessibility` + `api-contract` + `testing-standards`
- Changing CSS class application? → `css-architecture` + `api-contract`

> **Important**: ButtonGroup is a utility function — do NOT add class-based component patterns.

---

### Common Utilities

**Purpose**: Shared types, models, and helpers for DropDownButton and SplitButton  
**Location**: `src/common/common.ts`  
**Note**: No dedicated spec — changes to common.ts must be validated against ALL four components

> **Critical**: Changes to `common.ts` affect DropDownButton and SplitButton (which both import from it). Always read `drop-down-button/api-contract`, `split-button/api-contract`, `accessibility`, and `testing-standards` for any `common.ts` change.

---

## Spec Selection Strategy

### Step 1: Identify Component
"Which component am I changing?" → Narrows from 12 specs to ~3–5 relevant specs

### Step 2: Identify Capability
"Which capability area does this affect?" → Narrows to 1–2 component specs

### Step 3: Add Foundation Specs
"Which cross-cutting concerns apply?" → Adds 1–3 foundation specs

### Result: Read 3–5 Relevant Specs Instead of 12

---

## Example Scenarios

### Scenario 1: "Fix DropDownButton popup not closing on outside click"
**Read**:
1. `components/drop-down-button/popup-behavior/spec.md` (popup close behavior)
2. `components/drop-down-button/api-contract/spec.md` (beforeClose event)
3. `testing-standards/spec.md` (how to test)

**Skip**: SplitButton specs (unless also affected), ProgressButton, ButtonGroup, css-architecture

---

### Scenario 2: "Add new property 'closeOnScroll' to DropDownButton"
**Read**:
1. `components/drop-down-button/api-contract/spec.md` (existing properties)
2. `components/drop-down-button/popup-behavior/spec.md` (popup close triggers)
3. `property-system/spec.md` (how to declare @Property)
4. `testing-standards/spec.md` (how to test)
5. `components/split-button/api-contract/spec.md` (inherited — does SplitButton need it too?)

**Skip**: ProgressButton, ButtonGroup, css-architecture (unless CSS class involved)

---

### Scenario 3: "Add spinner size customization to ProgressButton"
**Read**:
1. `components/progress-button/api-contract/spec.md` (spinSettings)
2. `components/progress-button/progress-animation/spec.md` (spinner visibility)
3. `property-system/spec.md` (@Complex model change)
4. `css-architecture/spec.md` (spinner CSS classes)
5. `testing-standards/spec.md` (how to test)

**Skip**: DropDownButton, SplitButton, ButtonGroup specs

---

### Scenario 4: "Fix keyboard navigation skipping disabled items in DropDownButton"
**Read**:
1. `accessibility/spec.md` (keyboard navigation requirements)
2. `components/drop-down-button/api-contract/spec.md` (items disabled property)
3. `testing-standards/spec.md` (how to write keyboard tests)

**Skip**: ProgressButton, ButtonGroup, property-system, css-architecture

---

### Scenario 5: "Improve RTL support across all components"
**Read**:
1. `css-architecture/spec.md` (RTL class requirements)
2. `components/drop-down-button/api-contract/spec.md` (enableRtl)
3. `components/split-button/api-contract/spec.md` (wrapper RTL)
4. `accessibility/spec.md` (RTL ARIA direction)
5. `testing-standards/spec.md` (how to test)

---

## Spec Maintenance

### When to Update This Index
- New foundation spec added
- New component added to the package
- New component capability spec added
- Spec renamed or reorganized
- Component relationships change
- Decision trees become inaccurate

### Signs This Index is Stale
- Lists specs that don't exist at referenced paths
- Missing newly added specs
- Decision trees reference patterns that changed
- Spec count header doesn't match actual file count

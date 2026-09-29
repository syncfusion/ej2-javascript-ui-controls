# Specification Index

**Last Updated**: 2026-03-17
**Total Specs**: 6 foundation + 27 component capability specs (includes 5 virtualization specs)

## How to Use This Index

**CRITICAL**: Do not read all specs for every change. Follow this process:
1. **Identify which component(s)** are affected by your change
2. **Navigate to the component section below** to select relevant capability specs
3. **Read 3–5 relevant specs**, not all 28

---

## Foundation Specs (Apply to ALL Components)

These specs cover cross-cutting concerns that apply to all or most components.

| Spec | Scope | When to Read |
|------|-------|--------------|
| [testing-standards](./testing-standards/spec.md) | Coverage targets (100/90/100/100), Karma+Jasmine patterns, DOM setup/teardown, mocking | Every change that adds or modifies tests |
| [accessibility](./accessibility/spec.md) | ARIA roles/attributes, keyboard navigation, focus management, RTL, screen reader | Every UI change (popup, input, list, chips) |
| [component-lifecycle](./component-lifecycle/spec.md) | @NotifyPropertyChanges, render/wireEvents/destroy, module injection, onPropertyChanged | When modifying lifecycle, base class, or module injection |
| [css-architecture](./css-architecture/spec.md) | e-* class naming, CSS constants pattern, cssClass property, RTL classes, animations | When adding new DOM elements or CSS classes |
| [property-event-system](./property-event-system/spec.md) | @Property/@Event decorators, @Complex, onPropertyChanged, persist data, validation | When adding properties, events, or changing reactive behavior |
| [data-binding](./data-binding/spec.md) | DataManager, local arrays, fields mapping, filtering, grouping, sorting, virtual scroll; REQ-006: dynamic remote dataSource reassignment at runtime | When modifying data loading, filtering, or list rendering; when fixing bugs with `[] → DataManager` reassignment |
| [**components/common/virtualization**](./components/common/virtualization/spec.md) | `VirtualScroll` class, `IDropdownlist` interface, viewport algorithm, scroll debounce, page cache | When touching `src/common/virtual-scroll.ts` or `src/common/interface.ts` |

**Foundation Spec Selection**:
- Most changes touch 1–3 foundation specs
- Always consider: `testing-standards` for any code change
- Always consider: `accessibility` for any UI change
- Always consider: `property-event-system` when adding/changing a @Property or @Event

---

## Component Specs (Component-Specific Capabilities)

### DropDownBase
**Purpose**: Abstract base class; data binding, list rendering, filtering, virtual scroll wiring
**Location**: `src/drop-down-base/`
**Capability Count**: 2 specs
**Component Index**: [components/drop-down-base/README.md](./components/drop-down-base/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/drop-down-base/api-contract/spec.md) | Public properties, events, FieldSettings, FilterType, list rendering methods | Always read for DropDownBase changes |
| [rendering](./components/drop-down-base/rendering/spec.md) | List DOM structure, group headers, item templates, no-records, action-failure templates | When modifying list rendering or templates |

**Quick Decision Tree for DropDownBase**:
- Changing data binding or filtering? → `api-contract` + `data-binding` + `testing-standards`
- Changing list rendering (templates, groups)? → `rendering` + `css-architecture` + `accessibility`
- Changing FieldSettings? → `api-contract` + `property-event-system` + `testing-standards`

---

### DropDownList
**Purpose**: Non-editable single-select dropdown; popup lifecycle, keyboard navigation
**Location**: `src/drop-down-list/`
**Capability Count**: 4 specs
**Component Index**: [components/drop-down-list/README.md](./components/drop-down-list/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/drop-down-list/api-contract/spec.md) | All public properties, events, value/text/index API | Always read for DropDownList changes |
| [popup-behavior](./components/drop-down-list/popup-behavior/spec.md) | Popup open/close, animation, positioning, mobile dialog, filter bar | When modifying popup lifecycle |
| [keyboard-navigation](./components/drop-down-list/keyboard-navigation/spec.md) | Arrow keys, type-ahead, Home/End, Enter/Escape, focus management | When modifying keyboard handling |
| [virtual-scroll](./components/drop-down-list/virtual-scroll/spec.md) | `enableVirtualization`, DOM structure, remote skeleton loading, keyboard across pages, filter in virtual mode | When changing `enableVirtualization` or any virtual list behavior |

**Quick Decision Tree for DropDownList**:
- Changing value selection? → `api-contract` + `property-event-system` + `testing-standards`
- Changing popup open/close? → `popup-behavior` + `accessibility` + `testing-standards`
- Changing keyboard behavior? → `keyboard-navigation` + `accessibility` + `testing-standards`
- Adding filter bar feature? → `popup-behavior` + `data-binding` + `accessibility`
- Changing virtual scroll? → `virtual-scroll` + `components/common/virtualization` + `data-binding` REQ-005

---

### ComboBox
**Purpose**: Editable dropdown with custom value support; extends DropDownList
**Location**: `src/combo-box/`
**Capability Count**: 3 specs
**Component Index**: [components/combo-box/README.md](./components/combo-box/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/combo-box/api-contract/spec.md) | allowCustom, autofill, allowFiltering, customValueSpecifier event | Always read for ComboBox changes |
| [custom-value](./components/combo-box/custom-value/spec.md) | Free-text entry, custom value validation, customValueSpecifier event flow | When changing custom value or autofill behavior |
| [virtual-scroll](./components/combo-box/virtual-scroll/spec.md) | `isCustomFilter` flag in virtual mode, `queryString` vs `typedString` branching | When changing ComboBox `enableVirtualization` behavior |

**Quick Decision Tree for ComboBox**:
- Changing autofill or custom value? → `custom-value` + `api-contract` + `testing-standards`
- Changing filtering? → `api-contract` + `data-binding` + `testing-standards`
- UI/popup changes? → Also read DropDownList `popup-behavior`
- Changing virtual scroll? → `virtual-scroll` + `components/common/virtualization` + DDL `virtual-scroll`
- Dynamic dataSource reassignment (especially `[] → DataManager`)? → `data-binding` REQ-006 + `component-lifecycle` REQ-003 + `testing-standards`

---

### AutoComplete
**Purpose**: Type-ahead suggestions with highlight; extends ComboBox
**Location**: `src/auto-complete/`
**Capability Count**: 3 specs
**Component Index**: [components/auto-complete/README.md](./components/auto-complete/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/auto-complete/api-contract/spec.md) | highlight, minLength, suggestionCount, showPopupButton | Always read for AutoComplete changes |
| [filtering-highlight](./components/auto-complete/filtering-highlight/spec.md) | highlightSearch/revertHighlightSearch, performance with large sets, minLength trigger | When changing suggestion filtering or text highlighting |
| [virtual-scroll](./components/auto-complete/virtual-scroll/spec.md) | No `query.skip()` in getPageQuery, filter-controlled slicing, viewport clamp to `dataCount` | When changing AutoComplete `enableVirtualization` behavior |

**Quick Decision Tree for AutoComplete**:
- Changing highlight behavior? → `filtering-highlight` + `css-architecture` + `testing-standards`
- Changing suggestion count or minLength? → `api-contract` + `data-binding` + `testing-standards`
- Performance concerns? → `filtering-highlight` + `data-binding` (virtual scroll section)
- Changing virtual scroll? → `virtual-scroll` + `components/common/virtualization` + DDL `virtual-scroll`

---

### MultiSelect
**Purpose**: Multi-value picker with chips/delimiter UI; extends DropDownBase
**Location**: `src/multi-select/`
**Capability Count**: 4 specs
**Component Index**: [components/multi-select/README.md](./components/multi-select/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/multi-select/api-contract/spec.md) | value[], mode, delimiter, maximumSelectionLength, hideSelectedItem, all events | Always read for MultiSelect changes |
| [chip-ui](./components/multi-select/chip-ui/spec.md) | Chip rendering, chip close, chip-selected, overflow display, Box/Delimiter/CheckBox modes | When modifying chip display or selection modes |
| [checkbox-selection](./components/multi-select/checkbox-selection/spec.md) | CheckBoxSelection module, select-all, checkbox positioning, module injection | When modifying checkbox mode or select-all |
| [virtual-scroll](./components/multi-select/virtual-scroll/spec.md) | CheckBox+enableSelectionOrder reorder section, `hideSelectedItem` index math, `allowCustomValue` boundary injection, `itemCount×2` optimization | When changing MultiSelect `enableVirtualization` behavior |

**Quick Decision Tree for MultiSelect**:
- Changing chip appearance? → `chip-ui` + `css-architecture` + `accessibility`
- Changing checkbox/select-all? → `checkbox-selection` + `component-lifecycle` (module injection) + `testing-standards`
- Changing value array or events? → `api-contract` + `property-event-system` + `testing-standards`
- Adding new display mode? → `chip-ui` + `api-contract` + `css-architecture`
- Changing virtual scroll? → `virtual-scroll` + `components/common/virtualization` (REQ-006) + DDL `virtual-scroll`

---

### ListBox
**Purpose**: Always-visible list with drag-and-drop, dual-listbox, toolbar
**Location**: `src/list-box/`
**Capability Count**: 3 specs
**Component Index**: [components/list-box/README.md](./components/list-box/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/list-box/api-contract/spec.md) | selectionSettings, toolbarSettings, allowDragAndDrop, scope, public methods | Always read for ListBox changes |
| [drag-and-drop](./components/list-box/drag-and-drop/spec.md) | Sortable integration, drag events, drop validation, dual-list transfer | When modifying drag-and-drop or dual-listbox |
| [toolbar](./components/list-box/toolbar/spec.md) | Toolbar button rendering, MoveUp/MoveDown/MoveTo actions, toolbar position | When modifying toolbar or item movement actions |

**Quick Decision Tree for ListBox**:
- Changing toolbar actions? → `toolbar` + `api-contract` + `accessibility`
- Changing drag behavior? → `drag-and-drop` + `api-contract` + `testing-standards`
- Changing selection (checkbox, single/multiple)? → `api-contract` + `accessibility` + `testing-standards`

---

### DropDownTree
**Purpose**: Hierarchical tree data in a popup; independent component (no DropDownBase)
**Location**: `src/drop-down-tree/`
**Capability Count**: 3 specs
**Component Index**: [components/drop-down-tree/README.md](./components/drop-down-tree/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/drop-down-tree/api-contract/spec.md) | fields (hierarchical), treeSettings, value[], allowMultiSelection, showCheckBox, all events | Always read for DropDownTree changes |
| [tree-integration](./components/drop-down-tree/tree-integration/spec.md) | TreeView wiring, NodeSelectEventArgs, NodeCheckEventArgs, expand behavior | When modifying tree rendering or node selection |
| [selection-display](./components/drop-down-tree/selection-display/spec.md) | Chip display for multi-select, showOverflowCount, value display in input | When modifying how selected tree nodes are displayed |

**Quick Decision Tree for DropDownTree**:
- Changing tree node selection? → `tree-integration` + `api-contract` + `accessibility`
- Changing chip/input display? → `selection-display` + `css-architecture` + `testing-standards`
- Changing fields/data? → `api-contract` + `data-binding` (note: DDT reimplements data binding)
- Popup changes? → `api-contract` + read DropDownList `popup-behavior` for pattern reference

---

### Mention
**Purpose**: Inline @ tagging in contenteditable/textarea; extends DropDownBase
**Location**: `src/mention/`
**Capability Count**: 3 specs
**Component Index**: [components/mention/README.md](./components/mention/README.md)

| Capability | What It Covers | Read When |
|------------|----------------|-----------|
| [api-contract](./components/mention/api-contract/spec.md) | target, mentionChar, allowSpaces, displayTemplate, suffixText, all events | Always read for Mention changes |
| [trigger-behavior](./components/mention/trigger-behavior/spec.md) | Trigger char detection, Range API, cursor tracking, popup positioning | When modifying trigger detection or popup positioning |
| [display-template](./components/mention/display-template/spec.md) | displayTemplate rendering, chip insertion into host element, sanitization | When modifying how mention tags are inserted/displayed |

**Quick Decision Tree for Mention**:
- Changing trigger detection? → `trigger-behavior` + `api-contract` + `testing-standards`
- Changing how mention is inserted? → `display-template` + `css-architecture` + `accessibility`
- Filtering/suggestions? → `api-contract` + `data-binding` + `testing-standards`

---

## Spec Selection Strategy

### Step 1: Identify Component
"Which component am I changing?" → Narrows from 28 specs to ~5 component specs

### Step 2: Identify Capability
"Which capability area does this affect?" → Narrows to 1–2 component specs

### Step 3: Add Foundation Specs
"Which cross-cutting concerns apply?" → Adds 1–3 foundation specs

### Result: Read 3–5 Relevant Specs Instead of 28

---

## Example Scenarios

### Scenario 1: "Fix DropDownList popup not closing on Escape"
**Read**:
1. `components/drop-down-list/keyboard-navigation/spec.md` (Escape behavior)
2. `components/drop-down-list/popup-behavior/spec.md` (popup close logic)
3. `testing-standards/spec.md` (regression test in cr-issues)

**Skip**: All MultiSelect, ListBox, Mention specs; foundation data-binding spec

---

### Scenario 2: "Add highlight to AutoComplete"
**Read**:
1. `components/auto-complete/filtering-highlight/spec.md` (highlight requirements)
2. `components/auto-complete/api-contract/spec.md` (highlight property)
3. `css-architecture/spec.md` (CSS class for highlighted text)
4. `testing-standards/spec.md` (test coverage)

**Skip**: All other component specs

---

### Scenario 3: "Fix MultiSelect chip display in RTL mode"
**Read**:
1. `components/multi-select/chip-ui/spec.md` (chip rendering)
2. `accessibility/spec.md` (RTL section — REQ-005)
3. `css-architecture/spec.md` (RTL CSS handling)

**Skip**: Data binding, keyboard navigation, other component specs

---

### Scenario 4: "Add select-all to DropDownList filter results"
**Read**:
1. `components/drop-down-list/api-contract/spec.md` (API changes)
2. `data-binding/spec.md` (filtering behavior)
3. `accessibility/spec.md` (ARIA for select-all checkbox)
4. `testing-standards/spec.md` (coverage)

**Skip**: MultiSelect, ListBox, DropDownTree specs

---

### Scenario 5: "Improve virtual scroll performance across components"
**Read**:
1. `specs/README.md` (identify all components using virtual scroll)
2. `data-binding/spec.md` → REQ-005 (virtual scroll requirements)
3. `component-lifecycle/spec.md` → REQ-004 (module injection)
4. All components' `api-contract/spec.md` (understand enableVirtualization API)

**Skip**: Component-specific UI specs unless testing specific component

---

### Scenario 6: "Fix virtual scroll skipping items when scrolling fast in MultiSelect CheckBox mode"
**Read**:
1. `components/common/virtualization/spec.md` — REQ-003 (viewport algorithm), REQ-004 (debounce), REQ-005 (page cache)
2. `components/multi-select/virtual-scroll/spec.md` — REQ-MS-VS-001 (reorder), REQ-MS-VS-002 (hideSelectedItem index math)
3. `components/drop-down-list/virtual-scroll/spec.md` — REQ-DDL-VS-003 (keyboard across pages)
4. `testing-standards/spec.md` — regression test in `spec/cr-issues/`

**Skip**: ComboBox/AutoComplete virtual-scroll specs; all popup-behavior and chip-ui specs

---

### Scenario 7: "Add enableVirtualization to a new component"
**Read**:
1. `components/common/virtualization/spec.md` — REQ-001 (IDropdownlist full interface), REQ-002 (module architecture)
2. `component-lifecycle/spec.md` — REQ-004 (module injection pattern)
3. `components/drop-down-list/virtual-scroll/spec.md` — REQ-DDL-VS-006 (IDropdownlist completeness)
4. `data-binding/spec.md` — REQ-005 (consumer table)
5. `testing-standards/spec.md` — coverage requirements

**Also update**: `specs/README.md` (add new virtual-scroll spec); `data-binding/spec.md` REQ-005 consumer table

---

## Spec Maintenance

### When to Update This Index
- New foundation spec is added
- New component is added to the package
- New component capability spec is created
- Spec is renamed or reorganized
- Component relationships change (e.g., new inheritance)

### Signs This Index is Stale
- Lists specs that don't exist on disk
- Missing newly created specs
- Decision trees reference old patterns
- Component count doesn't match `src/index.ts` exports

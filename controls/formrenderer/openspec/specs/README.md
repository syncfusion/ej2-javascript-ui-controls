# OpenSpec Specifications Index

**Repository**: `@syncfusion/ej2-form-renderer`
**Total Specs**: 3 (foundation + component, aligned with the single-component nature of this repo)
**Last Updated**: July 16, 2026

---

## Navigation Guide

This index is the **primary entry point** for AI-driven development in this repo. Use it to:
1. Understand spec organization
2. Find relevant specs for a task
3. Understand dependencies

---

## Foundation Specs (Cross-Cutting)

Foundation specs apply to **FormRenderer** and to the **Common** backing modules.

| Spec | File | Applies To | Key Topics |
|------|------|------------|------------|
| **EJ2 TS Component Standards** | [foundation/ej2-ts-component-standards/spec.md](./foundation/ej2-ts-component-standards/spec.md) | All | EJ2 `@Property`/`@Event`/`@Complex` decorators, `Component<>` lifecycle (preRender→render→destroy), `@NotifyPropertyChanges`, `refresh()`, `destroy()` cleanup, `getModuleName()`, JSDoc, CSS `e-*` naming, theming via global data-theme, RTL |
| **Testing Standards** | [foundation/testing-standards/spec.md](./foundation/testing-standards/spec.md) | All | Karma+Jasmine patterns, coverage thresholds (95% lines FormRenderer.ts, 100% lines renderFormField.ts), test organization under `spec/`, mocks for EJ2 base/data/notifications |
| **Schema Contract** | [foundation/schema-contract/spec.md](./foundation/schema-contract/spec.md) | All | Wire-compatible FormSchema/FormComponent discriminated union (25+ types), conditions, validation rules, settings; JSON MUST NOT change at the wire level |

**Read Foundation Specs First**: these establish the patterns used across the component.

---

## Component Specs

### FormRenderer (1 spec)

| Spec | File | Scope | Key Topics |
|------|------|-------|------------|
| **Rendering & Behavior** | [components/form-renderer/rendering-behavior/spec.md](./components/form-renderer/rendering-behavior/spec.md) | Full FormRenderer behavior | Schema parsing/normalization (FormSchema / Unified Schema / parser fallback), 25+ field-type→EJ2 mapping, conditional/expression/validation parity, layout (panel/table/tabs/card), submit transform (id→label, exclude hidden/disabled/button/message/layout), imperative `getComponent(name)`, cross-cutting locale/RTL/cssClass/htmlAttributes, signature/imageEditor value-extraction indirection, date value formatting |

**[→ FormRenderer Component Guide](./components/form-renderer/README.md)**

---

> **Note**: Foundation spec files under `openspec/specs/foundation/` and component spec files under `openspec/specs/components/` are written as part of change implementation. The migration change `port-formrenderer-to-typescript` references these specs as the behavior acceptance criteria (mirroring §5 of the migration contract).

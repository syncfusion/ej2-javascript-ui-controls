# Changelog

## [Unreleased]

## 35.2.14 (2026-11-26)

Initial preview release of the Workflow Designer component.

### Added

- Workflow creation using triggers, actions, conditions, loops, delays, approvals, notifications, and custom steps.
- Workflow import, export, validation, test execution, and execution monitoring.
- Property panel, expression editor, variable picker, automatic layout, undo, and redo support.
- AI-assisted workflow creation in Server and Direct modes.
- Scheduled execution with time-zone support.
- Credential resolution and request customization events.
- Keyboard navigation and screen-reader announcements.
- Getting-started, business workflow, and live-data demos.

### Fixed

- Preserved structured AI responses when no text response is returned.
- Applied timeout handling to approval steps.
- Closed approval and form prompts when execution is stopped.
- Corrected inline credential validation.
- Improved step selection and property-panel functionality.
- Corrected toolbar and Run/Stop tooltips.

### Known Limitations

- The built-in runner is intended for design-time testing. Production workflow execution must be handled by the host application.
- Multiple designers on the same page share the currently active locale.
/**
 * EJ2 PowerPoint Editor
 *
 * @module @syncfusion/ej2-pptxeditor
 *
 * Public API entry point for the EJ2 PowerPoint Editor component.
 * Exports the component class, type definitions, and enumerations.
 *
 * @example
 * ```typescript
 * import { PptxEditor, ThemeVariant } from '@syncfusion/ej2-pptxeditor';
 *
 * const editor = new PptxEditor({
 *   theme: 'Material3',
 *   zoom: 100
 * }, '#editor-container');
 * ```
 */

export * from './pptxeditor/index';

// Re-export EJ2 base for convenience
export { Component, Event, Property } from '@syncfusion/ej2-base';

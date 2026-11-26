import { ChildProperty, Property } from '@syncfusion/ej2-base';import { WorkflowTool } from './workflow-enums';

/**
 * Interface for a class WorkflowSettings
 */
export interface WorkflowSettingsModel {

    /**
     * Defines the active canvas tool: `'SingleSelection'` selects one item at a time,
     * `'MultiSelection'` allows several items to be selected, and `'ZoomPan'` pans the canvas.
     *
     * @default 'SingleSelection'
     */
    tool?: WorkflowTool;

    /**
     * Defines the minimum zoom level of the canvas, where `1` is 100%.
     *
     * @default 0.2
     */
    minZoom?: number;

    /**
     * Defines the maximum zoom level of the canvas, where `1` is 100%.
     *
     * @default 30
     */
    maxZoom?: number;

    /**
     * Defines whether grid lines are displayed on the canvas.
     *
     * @default true
     */
    showGridLines?: boolean;

    /**
     * Defines whether the workflow is read-only. When `true`, users cannot change the workflow on the
     * canvas, and `clearWorkflow` has no effect.
     *
     * Read-only is a viewing mode, not a lock: `importWorkflow` still replaces the workflow (so a
     * host can load what the user views), and runs can still be started. To prevent runs, hide the
     * Execute toolbar item and don't call `runExecution`.
     *
     * While a run is in progress the canvas is locked the same way, without changing this value.
     *
     * @default false
     */
    readOnly?: boolean;

}
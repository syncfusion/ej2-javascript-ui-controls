import { ChildProperty, Property } from '@syncfusion/ej2-base';import { WorkflowCanvasToolbarItem, WorkflowToolbarItem } from './workflow-enums';

/**
 * Interface for a class WorkflowToolbarSettings
 */
export interface WorkflowToolbarSettingsModel {

    /**
     * Defines whether the top toolbar is displayed.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Defines which commands the top toolbar shows. Commands that are not in this list are not displayed.
     * The commands always appear in the same order (Execute, Layout, Lock, Undo, Redo, Import, Export),
     * whatever order they are listed in. While a run is in progress, Execute becomes a Stop command.
     *
     * @default ['Undo', 'Redo', 'Layout', 'Execute', 'Lock', 'Export', 'Import']
     */
    items?: WorkflowToolbarItem[];

}

/**
 * Interface for a class WorkflowCanvasToolbarSettings
 */
export interface WorkflowCanvasToolbarSettingsModel {

    /**
     * Defines whether the floating canvas toolbar is displayed.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Defines which commands the floating canvas toolbar shows. Commands that are not in this list are
     * not displayed.
     *
     * @default ['Add', 'StickyNote', 'Select', 'Pan', 'ZoomOut', 'ZoomIn', 'Fit', 'ResetZoom', 'Clear']
     */
    items?: WorkflowCanvasToolbarItem[];

}
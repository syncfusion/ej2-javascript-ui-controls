import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WorkflowCanvasToolbarItem, WorkflowToolbarItem } from './workflow-enums';

/**
 * Defines the top toolbar of the Workflow Designer. Commands are displayed as icon buttons with
 * tooltips and accessible names.
 */
export class WorkflowToolbarSettings extends ChildProperty<WorkflowToolbarSettings> {
    /**
     * Defines whether the top toolbar is displayed.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines which commands the top toolbar shows. Commands that are not in this list are not displayed.
     * The commands always appear in the same order (Execute, Layout, Lock, Undo, Redo, Import, Export),
     * whatever order they are listed in. While a run is in progress, Execute becomes a Stop command.
     *
     * @default ['Undo', 'Redo', 'Layout', 'Execute', 'Lock', 'Export', 'Import']
     */
    @Property(['Undo', 'Redo', 'Layout', 'Execute', 'Lock', 'Export', 'Import'])
    public items: WorkflowToolbarItem[];
}

/**
 * Defines the floating toolbar displayed at the bottom of the canvas.
 */
export class WorkflowCanvasToolbarSettings extends ChildProperty<WorkflowCanvasToolbarSettings> {
    /**
     * Defines whether the floating canvas toolbar is displayed.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines which commands the floating canvas toolbar shows. Commands that are not in this list are
     * not displayed.
     *
     * @default ['Add', 'StickyNote', 'Select', 'Pan', 'ZoomOut', 'ZoomIn', 'Fit', 'ResetZoom', 'Clear']
     */
    @Property(['Add', 'StickyNote', 'Select', 'Pan', 'ZoomOut', 'ZoomIn', 'Fit', 'ResetZoom', 'Clear'])
    public items: WorkflowCanvasToolbarItem[];
}

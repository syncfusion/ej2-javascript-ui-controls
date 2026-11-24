import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ITreeData } from '..';

/**
 * Interface for a class RowDropSettings
 */
export interface RowDropSettingsModel {

    /**
     * Specifies the ID of the droppable component where rows can be dragged and dropped.
     * Accepts a single id (string) or an array of ids (string[]) for multi-TreeGrid
     * drag-and-drop. When an array is supplied, the rows can be dropped into any one
     * of the configured peer grids.
     *
     * @default null
     */
    targetID?: string | string[];

}
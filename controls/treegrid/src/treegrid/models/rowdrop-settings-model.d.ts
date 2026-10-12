import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ITreeData } from '..';

/**
 * Interface for a class RowDropSettings
 */
export interface RowDropSettingsModel {

    /**
     * Specifies the ID of the droppable component where rows can be dragged and dropped. Ensures that the row drop operation targets the correct component within the application.
     *
     * @default null
     */
    targetID?: string;

}
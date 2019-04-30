import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class LabelSettings
 */
export interface LabelSettingsModel {

    /**
     * Defines right side label of task.
     * @default null
     */
    rightLabel?: string;

    /**
     * Defines left side label of task.
     * @default null
     */
    leftLabel?: string;

    /**
     * Defines label which is placed inside the taskbar.
     * @default null
     */
    taskLabel?: string;

}
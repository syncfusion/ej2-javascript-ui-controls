import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ProgressLineSettings
 */
export interface ProgressLineSettingsModel {

    /**
     * Specifies the status date used for the progress line.
     *
     * @default null
     */
    statusDate?: Date;

    /**
     * Specifies the stroke color of the progress line.
     *
     * @default null
     */
    lineColor?: string;

    /**
     * Specifies the stroke width of the progress line in pixels.
     *
     * @default 2
     */
    lineWidth?: number;

}
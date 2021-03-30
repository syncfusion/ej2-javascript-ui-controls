import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SplitterView } from '../base/enum';

/**
 * Interface for a class SplitterSettings
 */
export interface SplitterSettingsModel {

    /**
     * Defines splitter position at initial load, it accepts values in pixels.
     *
     * @default null
     */
    position?: string;

    /**
     * Defines splitter position with respect to column index value.
     * If `columnIndex` set as `2` then splitter bar placed at third column of grid.
     *
     * @default -1
     */
    columnIndex?: number;

    /**
     * Defines splitter bar size
     *
     * @default 4
     */
    separatorSize?: number;

    /**
     * Defines minimum width of Grid part, splitter can't be moved less than this value on grid side.
     *
     * @default null
     */
    minimum?: string;

    /**
     * Defines predefined view of Gantt.
     * * `Default` - Shows grid side and side of Gantt.
     * * `Grid` - Shows grid side alone in Gantt.
     * * `Chart` - Shows chart side alone in Gantt.
     *
     * @default Default
     */
    view?: SplitterView;

}
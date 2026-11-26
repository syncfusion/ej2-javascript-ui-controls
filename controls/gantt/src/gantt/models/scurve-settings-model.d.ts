import { Property, ChildProperty, Collection } from '@syncfusion/ej2-base';import { SCurveField } from '../base/enum';

/**
 * Interface for a class SCurveData
 */
export interface SCurveDataModel {

    /**
     * Specifies the metric shown by the dataset.
     *
     * * `Progress` - cumulative earned progress of the leaf tasks.
     * * `Duration` - cumulative scheduled duration of the leaf tasks.
     *
     * A dataset with any other value draws no line
     *
     * @default null
     */
    field?: SCurveField;

    /**
     * Specifies the line and marker color of the dataset (any CSS color).
     * When not set, the theme styles of the S-Curve CSS classes apply
     *
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class SCurveSettings
 */
export interface SCurveSettingsModel {

    /**
     * Enables or disables the S-Curve in the Gantt chart.
     * When enabled, the datasets defined in dataSet are drawn over the timeline.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Defines the collection of S-Curve datasets. Each dataset is drawn as one line,
     * in the order of the collection; later datasets are drawn above earlier ones.
     *
     * @default []
     */
    dataSet?: SCurveDataModel[];

}
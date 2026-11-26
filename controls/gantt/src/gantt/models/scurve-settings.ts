import { Property, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { SCurveField } from '../base/enum';
import { SCurveDataModel } from './scurve-settings-model';

/**
 * Configures an individual S-Curve dataset.
 */
export class SCurveData extends ChildProperty<SCurveData> {
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
    @Property(null)
    public field: SCurveField;

    /**
     * Specifies the line and marker color of the dataset (any CSS color).
     * When not set, the theme styles of the S-Curve CSS classes apply
     *
     * @default null
     */
    @Property(null)
    public color: string;
}

/**
 * Configures the S-Curve settings of the Gantt chart.
 */
export class SCurveSettings extends ChildProperty<SCurveSettings> {
    /**
     * Enables or disables the S-Curve in the Gantt chart.
     * When enabled, the datasets defined in dataSet are drawn over the timeline.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Defines the collection of S-Curve datasets. Each dataset is drawn as one line,
     * in the order of the collection; later datasets are drawn above earlier ones.
     *
     * @default []
     */
    @Collection<SCurveDataModel>([], SCurveData)
    public dataSet: SCurveDataModel[];
}

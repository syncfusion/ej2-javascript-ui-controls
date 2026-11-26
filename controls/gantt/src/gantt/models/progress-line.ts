import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Configures the progress line settings of the Gantt chart.
 */
export class ProgressLineSettings extends ChildProperty<ProgressLineSettings> {
    /**
     * Specifies the status date used for the progress line.
     *
     * @default null
     */
    @Property(null)
    public statusDate: Date;
    /**
     * Specifies the stroke color of the progress line.
     *
     * @default null
     */
    @Property(null)
    public lineColor: string;
    /**
     * Specifies the stroke width of the progress line in pixels.
     *
     * @default 2
     */
    @Property(2)
    public lineWidth: number;
}

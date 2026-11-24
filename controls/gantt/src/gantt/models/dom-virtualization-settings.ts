import { ChildProperty, Property } from '@syncfusion/ej2-base';
/**
 * Configures the DOM Virtualization settings of the Gantt chart.
 */
export class DomVirtualizationSettings extends ChildProperty<DomVirtualizationSettings> {
    /**
     * Specifies the number of extra rows to render above and below the visible viewport.
     * A larger buffer reduces blank rows during fast scroll at the cost of slightly more DOM nodes.
     *
     * @default 20
     */
    @Property(20)
    public rowBuffer: number;
}

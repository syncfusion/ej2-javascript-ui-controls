import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class DomVirtualizationSettings
 */
export interface DomVirtualizationSettingsModel {

    /**
     * Specifies the number of extra rows to render above and below the visible viewport.
     * A larger buffer reduces blank rows during fast scroll at the cost of slightly more DOM nodes.
     *
     * @default 20
     */
    rowBuffer?: number;

}
import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that holds the fixed rows related configurations of a timeline view.
 * Fixed rows are resource rows that stay in a fixed region at the top of the content area.
 */
export class FixedRowsSettings extends ChildProperty<FixedRowsSettings> {
    /**
     * Decides whether the fixed region is applied in the view. When set to `false`, the fixed state of the resources is
     * retained, but it has no layout effect in the view. It requires the `FixedRows` module to be injected.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Decides whether to show the separator between the fixed region and the scrolling region. The separator is rendered
     * only while at least one fixed row is visible.
     *
     * @default true
     */
    @Property(true)
    public showSeparator: boolean;

    /**
     * Template option to customize the separator strip, rendered as one full-width row between the fixed region and the scrolling region in place of the plain separator.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public separatorTemplate: string | Function;

    /**
     * Template option for the panel part of the separator strip, shown under the resource column. This part does not scroll horizontally.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public separatorPanelTemplate: string | Function;

    /**
     * Template option for the time part of the separator strip, shown under the time slots. This part scrolls horizontally with the time axis.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public separatorTimeTemplate: string | Function;
}

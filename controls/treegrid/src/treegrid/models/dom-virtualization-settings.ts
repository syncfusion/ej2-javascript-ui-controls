import { ChildProperty } from '@syncfusion/ej2-base';
import { Property } from '@syncfusion/ej2-base';

/**
 * Configures the DOM virtualization settings for TreeGrid.
 */
export class DomVirtualizationSettings extends ChildProperty<DomVirtualizationSettings> {
    /**
     * Defines the virtualization mode.
     * * `Row` — Vertical virtualization only.
     *
     * @default 'Row'
     */
    @Property('Row')
    public virtualDomType: string;

    /**
     * Number of extra rows rendered above and below the visible viewport.
     * Higher values reduce whitespace during fast scroll at the cost of a larger DOM.
     *
     * @default 5
     */
    @Property(5)
    public rowBuffer: number;

    /**
     * Throttle scroll events (milliseconds).
     * Reduces scroll event processing frequency and used for backend fetching delay can set from user.
     *
     * @default 0 (no throttling)
     */
    @Property(0)
    public scrollThrottle: number;

    /**
     * Maximum row pool size (for memory safety).
     * Restricted to no.of dom rows render.
     *
     * @default 500 rows
     * @hidden
     */
    @Property(500)
    public maxPoolSize: number;

    /**
     * If `autoRowHeight` is set to true, row heights are measured automatically to support variable row heights.
     * Enable this when using `rowTemplate`, `columnTemplate`, or `allowTextWrap` features that produce rows of different heights.
     * Note: enabling this with column templates disables column virtualization.
     *
     * @default false
     */
    @Property(false)
    public autoRowHeight: boolean;
}

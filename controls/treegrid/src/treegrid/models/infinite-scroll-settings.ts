import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { InfiniteScrollSettings as GridInfiniteScrollSettings } from '@syncfusion/ej2-grids';

/**
 * Configures the infinite scroll behavior of the Tree Grid.
 */
export class InfiniteScrollSettings extends ChildProperty<GridInfiniteScrollSettings> {
    /**
     * If `enableCache` is set to true, the Tree Grid will cache the loaded data for reuse in future requests, improving performance.
     *
     * @default false
     */
    @Property(false)
    public enableCache: boolean;

    /**
     * Specifies the number of data blocks to maintain in the Tree Grid's cache when `enableCache` is true.
     *
     * @default 3
     */
    @Property(3)
    public maxBlocks: number;

    /**
     * Specifies the number of data blocks to render initially when the Tree Grid loads, if caching is enabled.
     *
     * @default 3
     */
    @Property(3)
    public initialBlocks: number;
}

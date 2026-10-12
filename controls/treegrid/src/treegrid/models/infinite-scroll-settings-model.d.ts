import { Property, ChildProperty } from '@syncfusion/ej2-base';import { InfiniteScrollSettings as GridInfiniteScrollSettings } from '@syncfusion/ej2-grids';

/**
 * Interface for a class InfiniteScrollSettings
 */
export interface InfiniteScrollSettingsModel {

    /**
     * If `enableCache` is set to true, the Tree Grid will cache the loaded data for reuse in future requests, improving performance.
     *
     * @default false
     */
    enableCache?: boolean;

    /**
     * Specifies the number of data blocks to maintain in the Tree Grid's cache when `enableCache` is true.
     *
     * @default 3
     */
    maxBlocks?: number;

    /**
     * Specifies the number of data blocks to render initially when the Tree Grid loads, if caching is enabled.
     *
     * @default 3
     */
    initialBlocks?: number;

}
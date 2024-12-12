import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { InfiniteScrollSettings as GridInfiniteScrollSettings} from '@syncfusion/ej2-grids';




/**
 * Configures the infinite scroll behavior of Tree Grid.
 */
export class InfiniteScrollSettings extends ChildProperty<GridInfiniteScrollSettings> {
    /**
     * If `enableCache` is set to true, the Tree Grid will cache the loaded data to be reused next time it is needed.
     *
     * @default false
     */
    @Property(false)
    public enableCache: boolean;

    /**
     * Defines the number of blocks to be maintained in Tree Grid while settings enableCache as true.
     *
     * @default 3
     */
    @Property(3)
    public maxBlocks: number;

    /**
     * Defines the number of blocks will render at the initial Tree Grid rendering while enableCache is enabled.
     *
     * @default 3
     */
    @Property(3)
    public initialBlocks: number;
}

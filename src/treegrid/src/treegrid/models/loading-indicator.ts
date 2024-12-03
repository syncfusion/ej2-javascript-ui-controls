import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { IndicatorType } from '@syncfusion/ej2-grids';

/**
 * Configures the Loading Indicator of the Tree Grid.
 */
export class LoadingIndicator extends ChildProperty<LoadingIndicator> {
    /**
     * Defines the loading indicator. The available loading indicator are:
     * ```props
     * * Spinner :- Defines Loading Indicator as Spinner.
     * * Shimmer :- Defines Loading Indicator as Shimmer.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.IndicatorType.Spinner
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.IndicatorType
     */

    @Property('Spinner')
    public indicatorType: IndicatorType;
}

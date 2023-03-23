import { Property, ChildProperty } from '@syncfusion/ej2-base';import { IndicatorType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class LoadingIndicator
 */
export interface LoadingIndicatorModel {

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

    indicatorType?: IndicatorType;

}
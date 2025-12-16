import { ChildProperty, Property } from '@syncfusion/ej2-base';import { IndicatorType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class LoadingIndicator
 */
export interface LoadingIndicatorModel {

    /**
     * Defines the loading indicator. The available loading indicator are:
     * * Spinner – Displays a rotating loader icon. Ideal for quick data loading scenarios.
     * * Shimmer – Displays a placeholder skeleton with a shimmering animation. Recommended for longer data loading operations to provide a better user experience.
     *
     * @default Syncfusion.EJ2.Grids.IndicatorType.Spinner
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.IndicatorType
     *
     */
    indicatorType?: IndicatorType;

}
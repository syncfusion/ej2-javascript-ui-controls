import { ChildProperty, Property } from '@syncfusion/ej2-base';import { IndicatorType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class LoadingIndicator
 */
export interface LoadingIndicatorModel {

    /**
     * Defines the loading indicator. The available loading indicator are:
     * * Spinner
     * * Shimmer
     *
     * @default Syncfusion.EJ2.Grids.IndicatorType.Spinner
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.IndicatorType
     *
     */
    indicatorType?: IndicatorType;

}
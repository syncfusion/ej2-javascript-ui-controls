import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { IndicatorType } from '@syncfusion/ej2-grids';

/**
 * Configures the loading indicator for the Tree Grid, allowing you to display a visual indicator during data loading operations to enhance user experience.
 */
export class LoadingIndicator extends ChildProperty<LoadingIndicator> {
    /**
     * Specifies the type of loading indicator to be displayed. You can choose between:
     * ```props
     * * `Spinner`: Displays a spinning loader to indicate ongoing loading.
     * * `Shimmer`: Displays a shimmer effect that suggests content is loading.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.IndicatorType.Spinner
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.IndicatorType
     */
    @Property('Spinner')
    public indicatorType: IndicatorType;
}

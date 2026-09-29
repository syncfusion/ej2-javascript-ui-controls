import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeNavigatorSeriesModel } from '@syncfusion/ej2-charts';


/**
 * `rangenavigatorSeriesDirective` directive represent a series of the react AccumulationChart. 
 * It must be contained in a Rangenavigator component(`Rangenavigator`). 
 * ```
 * <RangenavigatorComponent>
 * <RangenavigatorSeriesCollectionDirective>
 * <RangenavigatorSeriesDirective></RangenavigatorSeriesDirective>
 * </RangenavigatorSeriesCollectionDirective>
 * </RangenavigatorChartComponent>
 * ```
 */
export class RangenavigatorSeriesDirective extends ComplexBase<RangeNavigatorSeriesModel & { children?: React.ReactNode }, RangeNavigatorSeriesModel> {
    public static moduleName: string = 'rangenavigatorSeries';
}

export class RangenavigatorSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'rangenavigatorSeriesCollection';
}

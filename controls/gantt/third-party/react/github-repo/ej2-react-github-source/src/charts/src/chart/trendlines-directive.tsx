import { ComplexBase } from '@syncfusion/ej2-react-base';
import { TrendlineModel } from '@syncfusion/ej2-charts';


/**
 * `TrendlineDirective` directive represent a trendline of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <SeriesCollectionDirective>
 * <SeriesDirective>
 * <TrendlinesDirective>
 * <TrendlineDirective></TrendlineDirective>
 * </TrendlinesDirective>
 * </SeriesDirective>
 * </SeriesCollectionDirective>
 * </ChartComponent>
 * ```
 */
export class TrendlineDirective extends ComplexBase<TrendlineModel & { children?: React.ReactNode }, TrendlineModel> {
    public static moduleName: string = 'trendline';
}

export class TrendlinesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'trendlines';
    public static moduleName: string = 'trendlines';
}

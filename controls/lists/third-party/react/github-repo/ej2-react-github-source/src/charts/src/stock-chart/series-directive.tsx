import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockSeriesModel } from '@syncfusion/ej2-charts';


/**
 * `SeriesDirective` directive represent a series of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent>
 * <StockChartSeriesCollectionDirective>
 * <StockChartSeriesDirective></SeriesDirective>
 * </StockChartSeriesCollectionDirective>
 * </StockChartComponent>
 * ```
 */
export class StockChartSeriesDirective extends ComplexBase<StockSeriesModel & { children?: React.ReactNode }, StockSeriesModel> {
    public static moduleName: string = 'stockChartSeries';
}

export class StockChartSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'stockChartSeriesCollection';
}

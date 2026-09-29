import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartTrendlineModel } from '@syncfusion/ej2-charts';


/**
 * `TrendlineDirective` directive represent a trendline of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent>
 * <StockChartSeriesCollectionDirective>
 * <StockSeriesDirective>
 * <TrendlinesDirective>
 * <TrendlineDirective></TrendlineDirective>
 * </TrendlinesDirective>
 * </StockChartSeriesDirective>
 * </StockChartSeriesCollectionDirective>
 * </StockChartComponent>
 * ```
 */
export class StockChartTrendlineDirective extends ComplexBase<StockChartTrendlineModel & { children?: React.ReactNode }, StockChartTrendlineModel> {
    public static moduleName: string = 'stockChartTrendline';
}

export class StockChartTrendlinesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'trendlines';
    public static moduleName: string = 'stockChartTrendlines';
}

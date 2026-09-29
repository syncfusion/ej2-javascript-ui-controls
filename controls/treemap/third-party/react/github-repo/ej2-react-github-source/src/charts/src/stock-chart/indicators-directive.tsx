import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartIndicatorModel } from '@syncfusion/ej2-charts';


/**
 * `IndicatorDirective` directive represent a indicator of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent>
 * <StockChartIndicatorsDirective>
 * <StockChartIndicatorDirective></StockChartIndicatorDirective>
 * </StockChartIndicatorsDirective>
 * </StockChartComponent>
 * ```
 */
export class StockChartIndicatorDirective extends ComplexBase<StockChartIndicatorModel & { children?: React.ReactNode }, StockChartIndicatorModel> {
    public static moduleName: string = 'stockChartIndicator';
}

export class StockChartIndicatorsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'indicators';
    public static moduleName: string = 'stockChartIndicators';
}

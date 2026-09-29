import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PeriodsModel } from '@syncfusion/ej2-charts';


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
export class StockChartPeriodDirective extends ComplexBase<PeriodsModel & { children?: React.ReactNode }, PeriodsModel> {
    public static moduleName: string = 'stockChartPeriod';
}

export class StockChartPeriodsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'periods';
    public static moduleName: string = 'stockChartPeriods';
}

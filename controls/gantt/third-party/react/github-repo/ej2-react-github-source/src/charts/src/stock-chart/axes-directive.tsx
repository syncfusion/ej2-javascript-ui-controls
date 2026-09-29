import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartAxisModel } from '@syncfusion/ej2-charts';


/**
 * `Axis` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent>
 * <StockChartAxesDirective>
 * <StockChartAxisDirective></StockChartAxisDirective>
 * </StockChartAxesDirective>
 * </StockChartComponent>
 * ```
 */
export class StockChartAxisDirective extends ComplexBase<StockChartAxisModel & { children?: React.ReactNode }, StockChartAxisModel> {
    public static moduleName: string = 'stockChartAxis';
}

export class StockChartAxesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'axes';
    public static moduleName: string = 'stockChartAxes';
}

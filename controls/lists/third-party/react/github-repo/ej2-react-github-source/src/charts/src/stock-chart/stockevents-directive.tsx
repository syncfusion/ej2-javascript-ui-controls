import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockEventsSettingsModel } from '@syncfusion/ej2-charts';


/**
 * `StockChartStockEvents` directive represent a stockevent of the react chart. 
 * It must be contained in a Chart component(`StockChartComponent`). 
 * ```
 * <StockChartComponent>
 * <StockChartStockEventsDirective>
 * <StockChartStockEventDirective></StockChartStockEventDirective>
 * </StockChartStockEventsDirective>
 * </StockChartComponent>
 * ```
 */
export class StockEventDirective extends ComplexBase<StockEventsSettingsModel & { children?: React.ReactNode }, StockEventsSettingsModel> {
    public static moduleName: string = 'stockEvent';
}

export class StockEventsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'stockEvents';
    public static moduleName: string = 'stockEvents';
}

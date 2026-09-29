import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartRowModel } from '@syncfusion/ej2-charts';


/**
 * `Row` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent> 
 * <RowsDirective>
 * <RowDirective></RowDirective>
 * </RowsDirective>
 * </ChartComponent>
 * ```
 */
export class StockChartRowDirective extends ComplexBase<StockChartRowModel & { children?: React.ReactNode }, StockChartRowModel> {
    public static moduleName: string = 'stockChartRow';
}

export class StockChartRowsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rows';
    public static moduleName: string = 'stockChartRows';
}

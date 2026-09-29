import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartIndexesModel } from '@syncfusion/ej2-charts';


/**
 * `SelectedDataIndex` directive represent the selected data in react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent> 
 * <SelectedDataIndexesDirective>
 * <SelectedDataIndexDirective></SelectedDataIndexDirective>
 * </SelectedDataIndexesDirective>
 * </ChartComponent>
 * ```
 */
export class StockChartSelectedDataIndexDirective extends ComplexBase<StockChartIndexesModel & { children?: React.ReactNode }, StockChartIndexesModel> {
    public static moduleName: string = 'stockChartSelectedDataIndex';
}

export class StockChartSelectedDataIndexesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'selectedDataIndexes';
    public static moduleName: string = 'stockChartSelectedDataIndexes';
}

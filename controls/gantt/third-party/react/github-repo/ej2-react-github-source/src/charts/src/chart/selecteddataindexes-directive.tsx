import { ComplexBase } from '@syncfusion/ej2-react-base';
import { IndexesModel } from '@syncfusion/ej2-charts';


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
export class SelectedDataIndexDirective extends ComplexBase<IndexesModel & { children?: React.ReactNode }, IndexesModel> {
    public static moduleName: string = 'selectedDataIndex';
}

export class SelectedDataIndexesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'selectedDataIndexes';
    public static moduleName: string = 'selectedDataIndexes';
}

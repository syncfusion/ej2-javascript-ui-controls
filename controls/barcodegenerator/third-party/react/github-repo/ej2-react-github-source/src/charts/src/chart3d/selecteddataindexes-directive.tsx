import { ComplexBase } from '@syncfusion/ej2-react-base';
import { IndexesModel } from '@syncfusion/ej2-charts';


/**
 * `SelectedDataIndex` directive represent the selected data in react Chart. 
 * It must be contained in a Chart component(`Chart3DComponent`). 
 * ```
 * <Chart3DComponent> 
 * <Chart3DSelectedDataIndexesDirective>
 * <Chart3DSelectedDataIndexDirective></Chart3DSelectedDataIndexDirective>
 * </Chart3DSelectedDataIndexesDirective>
 * </Chart3DComponent>
 * ```
 */
export class Chart3DSelectedDataIndexDirective extends ComplexBase<IndexesModel & { children?: React.ReactNode }, IndexesModel> {
    public static moduleName: string = 'chart3DSelectedDataIndex';
}

export class Chart3DSelectedDataIndexesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'selectedDataIndexes';
    public static moduleName: string = 'chart3DSelectedDataIndexes';
}

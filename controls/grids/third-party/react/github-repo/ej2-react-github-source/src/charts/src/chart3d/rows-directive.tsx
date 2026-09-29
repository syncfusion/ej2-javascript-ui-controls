import { ComplexBase } from '@syncfusion/ej2-react-base';
import { Chart3DRowModel } from '@syncfusion/ej2-charts';


/**
 * `Row3D` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`Chart3DComponent`). 
 * ```
 * <Chart3DComponent>
 * <Chart3DRowsDirective>
 * <Chart3DRowDirective></Chart3DRowDirective>
 * </Chart3DRowsDirective>
 * </Chart3DComponent>
 * ```
 */
export class Chart3DRowDirective extends ComplexBase<Chart3DRowModel & { children?: React.ReactNode }, Chart3DRowModel> {
    public static moduleName: string = 'chart3DRow';
}

export class Chart3DRowsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rows';
    public static moduleName: string = 'chart3DRows';
}

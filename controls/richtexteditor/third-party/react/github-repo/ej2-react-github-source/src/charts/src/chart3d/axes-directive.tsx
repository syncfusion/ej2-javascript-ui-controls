import { ComplexBase } from '@syncfusion/ej2-react-base';
import { Chart3DAxisModel } from '@syncfusion/ej2-charts';


/**
 * `Axis3D` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`Chart3DComponent`). 
 * ```
 * <Chart3DComponent>
 * <Chart3DAxesDirective>
 * <Chart3DAxisDirective></Chart3DAxisDirective>
 * </Chart3DAxesDirective>
 * </Chart3DComponent>
 * ```
 */
export class Chart3DAxisDirective extends ComplexBase<Chart3DAxisModel & { children?: React.ReactNode }, Chart3DAxisModel> {
    public static moduleName: string = 'chart3DAxis';
}

export class Chart3DAxesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'axes';
    public static moduleName: string = 'chart3DAxes';
}

import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AxisModel } from '@syncfusion/ej2-charts';


/**
 * `Axis` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <AxesDirective>
 * <AxisDirective></AxisDirective>
 * </AxesDirective>
 * </ChartComponent>
 * ```
 */
export class AxisDirective extends ComplexBase<AxisModel & { children?: React.ReactNode }, AxisModel> {
    public static moduleName: string = 'axis';
}

export class AxesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'axes';
    public static moduleName: string = 'axes';
}

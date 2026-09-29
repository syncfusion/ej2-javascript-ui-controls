import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AxisModel } from '@syncfusion/ej2-lineargauge';


/**
 * Represents the directive to render the axes in the Linear Gauge.
 * ```
 * <LinearGaugeComponent>
 * <AxesDirective>
 * <AxisDirective></AxisDirective>
 * </AxesDirective>
 * </LinearGaugeComponent>
 * ```
 */
export class AxisDirective extends ComplexBase<AxisModel & { children?: React.ReactNode }, AxisModel> {
    public static moduleName: string = 'axis';
}

export class AxesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'axes';
    public static moduleName: string = 'axes';
}

import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AxisModel } from '@syncfusion/ej2-circulargauge';


/**
 * Represents the directive to render the axes in the Circular Gauge.
 * ```tsx
 * <CircularGaugeComponent>
 * <AxesDirective>
 * <AxisDirective></AxisDirective>
 * </AxesDirective>
 * </CircularGaugeComponent>
 * ```
 */
export class AxisDirective extends ComplexBase<AxisModel & { children?: React.ReactNode }, AxisModel> {
    public static moduleName: string = 'axis';
}

export class AxesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'axes';
    public static moduleName: string = 'axes';
}

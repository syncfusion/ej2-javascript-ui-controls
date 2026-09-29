import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeModel } from '@syncfusion/ej2-lineargauge';


/**
 * Represents the directive to render and customize the ranges in an axis of linear gauge.
 * ```
 * <LinearGaugeComponent>
 * <AxesDirective>
 * <AxisDirective>
 * <RangesDirective>
 * <RangeDirective></RangeDirective>
 * </RangesDirective>
 * </AxisDirective>
 * </AxesDirective>
 * </LinearGaugeComponent>
 * ```
 */
export class RangeDirective extends ComplexBase<RangeModel & { children?: React.ReactNode }, RangeModel> {
    public static moduleName: string = 'range';
}

export class RangesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'ranges';
    public static moduleName: string = 'ranges';
}

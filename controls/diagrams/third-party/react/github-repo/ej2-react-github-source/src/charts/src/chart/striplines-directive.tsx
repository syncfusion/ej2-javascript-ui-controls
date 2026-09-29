import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StripLineSettingsModel } from '@syncfusion/ej2-charts';


/**
 * `StriplineDirective` directive represent a stripline of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <AxesDirective>
 * <AxisDirective>
 * <StriplinesDirective>
 * <StriplineDirective></StriplineDirective>
 * </StriplinesDirective>
 * </AxisDirective>
 * </AxesDirective>
 * </ChartComponent>
 * ```
 */
export class StripLineDirective extends ComplexBase<StripLineSettingsModel & { children?: React.ReactNode }, StripLineSettingsModel> {
    public static moduleName: string = 'stripLine';
}

export class StripLinesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'stripLines';
    public static moduleName: string = 'stripLines';
}

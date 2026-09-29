import { ComplexBase } from '@syncfusion/ej2-react-base';
import { TechnicalIndicatorModel } from '@syncfusion/ej2-charts';


/**
 * `IndicatorDirective` directive represent a indicator of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <IndicatorsDirective>
 * <IndicatorDirective></IndicatorDirective>
 * </IndicatorsDirective>
 * </ChartComponent>
 * ```
 */
export class IndicatorDirective extends ComplexBase<TechnicalIndicatorModel & { children?: React.ReactNode }, TechnicalIndicatorModel> {
    public static moduleName: string = 'indicator';
}

export class IndicatorsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'indicators';
    public static moduleName: string = 'indicators';
}

import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeColorSettingModel } from '@syncfusion/ej2-charts';


/**
 * `RangeColorSetting` directive represent range color mapping of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent> 
 * <RangeColorSettingsDirective>
 * <RangeColorSettingDirective></RangeColorSettingDirective>
 * </RangeColorSettingsDirective>
 * </ChartComponent>
 * ```
 */
export class RangeColorSettingDirective extends ComplexBase<RangeColorSettingModel & { children?: React.ReactNode }, RangeColorSettingModel> {
    public static moduleName: string = 'rangeColorSetting';
}

export class RangeColorSettingsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rangeColorSettings';
    public static moduleName: string = 'rangeColorSettings';
}

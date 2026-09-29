import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PresetsModel } from '@syncfusion/ej2-calendars';


/**
 * `PresetsDirective` represent a presets of the react daterangepicker. 
 * It must be contained in a daterangepicker component(`DateRangePickerComponent`). 
 * ```tsx
 * <DateRangePickerComponent id='range'> 
 * <PresetsDirective>
 * <PresetDirective label='Last Week' start={new Date('06/07/2018')} end= {new Date('06/01/2018')}></PresetDirective>
 * <PresetDirective label='Last Month' start={new Date('06/07/2018')} end= {new Date('05/07/2018')]></PresetDirective>
 * </PresetsDirective>
 * </DateRangePickerComponent>
 * ```
 */
export class PresetDirective extends ComplexBase<PresetsModel & { children?: React.ReactNode }, PresetsModel> {
    public static moduleName: string = 'preset';
}

export class PresetsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'presets';
    public static moduleName: string = 'presets';
}

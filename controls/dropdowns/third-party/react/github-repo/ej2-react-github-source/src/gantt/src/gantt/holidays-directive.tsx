import { ComplexBase } from '@syncfusion/ej2-react-base';
import { HolidayModel } from '@syncfusion/ej2-gantt';


/**
 * `HolidaysDirective` represent a holidays collection in Gantt.. 
 * It must be contained in a Gantt component(`GanttComponent`). 
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}> 
 * <HolidaysDirective>
 * <HolidayDirective from='02/20/2018' label='Holiday 1'></HolidayDirective>
 * <HolidayDirective from='05/15/2018' label='Holiday 2'></HolidayDirective>
 * </HolidaysDirective>
 * </GanttComponent>
 * ```
 */
export class HolidayDirective extends ComplexBase<HolidayModel & { children?: React.ReactNode }, HolidayModel> {
    public static moduleName: string = 'holiday';
}

export class HolidaysDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'holidays';
    public static moduleName: string = 'holidays';
}

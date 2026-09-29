import { ComplexBase } from '@syncfusion/ej2-react-base';
import { WeekWorkingTimeModel } from '@syncfusion/ej2-gantt';


/**
 * `WeekWorkingTimeDirective` represent a working time ranges in a day. 
 * It must be contained in a Gantt component(`GanttComponent`). 
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}> 
 * <WeekWorkingTimeCollection>
 * <WeekWorkingTime dayOfWeek='Monday' from='8' to='12'></WeekWorkingTimeCollection>
 * <WeekWorkingTime dayOfWeek='Monday' from='13' to='17'></WeekWorkingTimeCollection>
 * </WeekWorkingTimeCollection>
 * </GanttComponent>
 * ```
 */
export class WeekWorkingTimeDirective extends ComplexBase<WeekWorkingTimeModel & { children?: React.ReactNode }, WeekWorkingTimeModel> {
    public static moduleName: string = 'weekWorkingTime';
}

export class WeekWorkingTimesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'weekWorkingTime';
    public static moduleName: string = 'weekWorkingTimes';
}

import { ComplexBase } from '@syncfusion/ej2-react-base';
import { DayWorkingTimeModel } from '@syncfusion/ej2-gantt';


/**
 * `DayWorkingTimeDirective` represent a working time ranges in a day. 
 * It must be contained in a Gantt component(`GanttComponent`). 
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}> 
 * <DayWorkingTimeCollection>
 * <DayWorkingTime from='8' to='12'></DayWorkingTimeCollection>
 * <DayWorkingTime from='13' to='17'></DayWorkingTimeCollection>
 * </DayWorkingTimeCollection>
 * </GanttComponent>
 * ```
 */
export class DayWorkingTimeDirective extends ComplexBase<DayWorkingTimeModel & { children?: React.ReactNode }, DayWorkingTimeModel> {
    public static moduleName: string = 'dayWorkingTime';
}

export class DayWorkingTimeCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'dayWorkingTime';
    public static moduleName: string = 'dayWorkingTimeCollection';
}

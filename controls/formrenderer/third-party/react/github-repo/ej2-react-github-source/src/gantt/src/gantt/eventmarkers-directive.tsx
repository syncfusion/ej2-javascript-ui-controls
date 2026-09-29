import { ComplexBase } from '@syncfusion/ej2-react-base';
import { EventMarkerModel } from '@syncfusion/ej2-gantt';


/**
 * `EventMarkersDirective` represent a event marker collection in Gantt
 * It must be contained in a Gantt component(`GanttComponent`). 
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}> 
 * <EventMarkersDirective>
 * <EventMarkerDirective day='02/10/2018' label='Project Starts'></EventMarkerDirective>
 * </EventMarkersDirective>
 * </GanttComponent>
 * ```
 */
export class EventMarkerDirective extends ComplexBase<EventMarkerModel & { children?: React.ReactNode }, EventMarkerModel> {
    public static moduleName: string = 'eventMarker';
}

export class EventMarkersDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'eventMarkers';
    public static moduleName: string = 'eventMarkers';
}

import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ResourcesModel } from '@syncfusion/ej2-schedule';


/**
 * `ResourcesDirective` represent a resource of the react Schedule. 
 * It must be contained in a Schedule component(`SchduleComponent`). 
 * ```ts
 * <ScheduleComponent>
 * <ResourcesDirective>
 * <ResourceDirective field='RoomId' name='Rooms'></ResourceDirective>
 * <ResourceDirective field='OwnerId' name='Owners'></ResourceDirective>
 * <ResourcesDirective>
 * </ScheduleComponent>
 * ```
 */
export class ResourceDirective extends ComplexBase<ResourcesModel & { children?: React.ReactNode }, ResourcesModel> {
    public static moduleName: string = 'resource';
}

export class ResourcesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'resources';
    public static moduleName: string = 'resources';
}

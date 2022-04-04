import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { ITreeData } from '..';

/**
 * Configures the row drop settings of the TreeGrid.
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**
     * Defines the ID of droppable component on which row drop should occur.
     *
     * @default null
     */
    @Property()
    public targetID: string;
}
export interface TreeActionEventArgs {
    requestType?: string;
    data?: ITreeData[];
    row?: Object[];
    cancel?: boolean;
}

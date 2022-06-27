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
    data?: ITreeData | ITreeData[];
    row?: Object[];
    cancel?: boolean;
    /** Defines the corresponding action */
    action?: string;
    /** Defines the target element from index. */
    dropIndex?: number;
    /** Defines drop position of the dragged record */
    dropPosition?: string;
    /** Defines the modified records. */
    modifiedRecords?: ITreeData[];
}

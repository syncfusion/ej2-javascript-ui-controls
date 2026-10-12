import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { ITreeData } from '..';

/**
 * Configures the settings for row dragging and dropping within the TreeGrid, allowing for enhanced user interaction and data manipulation capabilities.
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**
     * Specifies the ID of the droppable component where rows can be dragged and dropped. Ensures that the row drop operation targets the correct component within the application.
     *
     * @default null
     */
    @Property()
    public targetID: string;
}

/**
 * Interface for TreeGrid row drop action event arguments, providing detailed information about the row drop operation and its related context.
 */
export interface TreeActionEventArgs {
    /** Identifies the type of request made during the action. */
    requestType?: string;
    /** Contains the data of the row(s) involved in the action, either a single row or an array of rows. */
    data?: ITreeData | ITreeData[];
    /** Refers to the rows affected by the action. */
    row?: Object[];
    /** A boolean value indicating whether the action should be canceled. */
    cancel?: boolean;
    /** Describes the specific action being performed. */
    action?: string;
    /** Indicates the target index where the row(s) will be dropped. */
    dropIndex?: number;
    /** Specifies the position where the dragged record will be dropped relative to the target. */
    dropPosition?: string;
    /** Lists the records that have been modified as a result of the action. */
    modifiedRecords?: ITreeData[];
}

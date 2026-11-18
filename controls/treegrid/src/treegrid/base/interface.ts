import { Column } from '../models/column';
import { SaveEventArgs, DataStateChangeEventArgs as GridDataStateChangeEventArgs, ExcelExportProperties, RowDragEventArgs as GridRowDragEventArgs, ActionEventArgs as GridActionEventArgs } from '@syncfusion/ej2-grids';
import { PdfExportProperties } from '@syncfusion/ej2-grids';
/**
 * Specifies FlatData interfaces.
 *
 * @hidden
 */
export interface ITreeData {
    /**
     * Specifies the childRecords of a parentData
     */
    childRecords?: ITreeData[];
    /**
     * Specifies whether the record contains child records
     */
    hasChildRecords?: boolean;
    /**
     * Specifies whether the record contains filtered child records
     */
    hasFilteredChildRecords?: boolean;
    /**
     * Specifies whether the child records are expanded
     */
    expanded?: boolean;
    /**
     * Specifies the parentItem of childRecords
     */
    parentItem?: ITreeData;
    /**
     * Specifies the index of current record
     */
    index?: number;
    /**
     * Specifies the hierarchy level of record
     */
    level?: number;
    /**
     * Specifies the hierarchy level of filtered record
     */
    filterLevel?: number;
    /**
     * Specifies the parentID
     */
    //parentIdMapping?: number;
    /**
     * Specifies the unique ID of a record
     */
    uniqueID?: string;
    /**
     * Specifies the parent Unique ID of a record
     */
    parentUniqueID?: string;
    /**
     * Specifies the checkbox state of a record
     */
    checkboxState?: string;
    /**
     * Specifies the summary of a record
     */
    isSummaryRow?: boolean;
    /**
     * Specifies the main data
     */
    taskData?: ITreeData;
    /**
     * Specifies the Primary data
     */
    primaryParent?: ITreeData;
}

/** Specifies the Tree Grid ExcelExport properties */
export interface TreeGridExcelExportProperties extends ExcelExportProperties {
    /** Specifies the collapsed state persistence in exported file */
    isCollapsedStatePersist: boolean;
}

/** Specifies the Tree Grid PdfExport properties */
export interface TreeGridPdfExportProperties extends PdfExportProperties {
    /** Specifies the collapsed state persistence in exported file */
    isCollapsedStatePersist: boolean;
}

export interface AggregateTemplateContext {
    /** Gets sum aggregate value */
    sum: string;
    /** Gets average aggregate value */
    average: string;
    /** Gets maximum aggregate value */
    max: string;
    /** Gets minimum aggregate value */
    min: string;
    /** Gets count aggregate value */
    count: string;
    /** Gets true count aggregate value */
    trueCount: string;
    /** Specifies false count aggregate value */
    falseCount: string;
    /** Gets custom aggregate value */
    custom: string;
    /** Gets the current group field name */
    field?: string;
    /** Gets header text of the grouped column */
    headerText?: string;
    /** Gets grouped data key value */
    key?: string;
}

/**
 * @hidden
 */
export interface ITreeGridCellFormatter {
    getValue(column: Column, data: Object): Object;
}
export interface RowExpandedEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowExpandingEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row expanding action */
    cancel?: boolean;
    /** Provides an option to ExpandAll the nested parent rows of the current row. */
    expandAll?: boolean
}
export interface RowCollapsedEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowCollapsingEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row collapsing action */
    cancel?: boolean;
    /** Provides an option to CollapseAll the nested parent rows of the current row. */
    collapseAll?: boolean
}
export interface CellSaveEventArgs extends SaveEventArgs {
    /** Defines edited column */
    column?: Column;
}
export interface DataStateChangeEventArgs extends GridDataStateChangeEventArgs {
    /** Defines the child records for the respective parent row */
    childData? : ITreeData[];
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row expanding action */
    cancel?: boolean;
    /** Defines the expand or collapse request for the parent record. */
    requestType?: string;
    /** Defines the resolve function for the promise. */
    childDataBind?: Function;
}
export interface RowDragEventArgs extends GridRowDragEventArgs {
    dropPosition: string;
}
export interface ActionEventArgs extends GridActionEventArgs {
    /** Maintains Treegrid's Collapse state in virtualization */
    isCollapseMaintain?: boolean;
}

/**
 * Defines the event arguments for the `beforeWebMcpToolExecute` event.
 * Provides access to the tool name and its input arguments before execution,
 * and allows the application to inspect, modify, or cancel the operation.
 * @hidden
 */
export interface WebMcpToolExecuteEventArgs {
    /**
     * Specifies whether the tool execution should be cancelled.
     * Set to `true` to prevent the tool from executing.
     */
    cancel?: boolean;
    /**
     * Specifies the name of the WebMCP tool being executed (e.g. `'getViewRecords'`, `'sortByColumn'`).
     */
    toolName?: string;
    /**
     * Specifies the arguments passed to the tool.
     * The shape of this object matches the tool's `inputSchema` as defined in the tool registry.
     */
    toolArgs?: object;
    /**
     * Set to `true` to display a confirmation dialog to the user before the tool executes.
     * Execution proceeds only if the user confirms.
     */
    showConfirmationDialog?: boolean;
    /**
     * Specifies a custom response message to send back to the AI when tool execution is cancelled,
     * either by setting `cancel` to `true` or when the user dismisses the confirmation dialog.
     * When not provided, a default cancellation message is sent to the AI.
     */
    cancellationResponse?: string;
}

/**
 * Defines the structure of a WebMCP tool, including its name, description,
 * and input/output JSON schemas used for tool registration and execution.
 * @hidden
 */
export interface WebMcpTool {
    /**
     * The unique identifier name of the WebMCP tool (e.g., 'getViewRecords', 'sortByColumn').
     */
    name: string;
    /**
     * A description of the tool's functionality and purpose.
     */
    description: string;
    /**
     * The JSON schema object that defines the expected input parameters for the tool.
     */
    inputSchema: object;
    /**
     * The JSON schema object that defines the structure of the tool's output response.
     */
    outputSchema: object;
    /**
     * An annotations object containing flags like `readOnlyHint` indicating whether the tool performs read-only operations.
     */
    annotations: object;
    /**
     * A function that executes the tool's logic when invoked.
     */
    execute?: Function;
}

/**
 * Defines the result returned by a WebMCP tool execution,
 * containing the response content array and an optional error flag.
 * @hidden
 */
export interface WebMcpToolResponse {
    /**
     * Array of content objects with type and text fields.
     */
    content: { type: string; text: string }[];
    /**
     * Flag indicating if the response represents an error state.
     */
    isError?: boolean;
}

/**
 * Defines the model interface for TreeGrid WebMCP settings configuration.
 * Provides type information for TreegridWebMcpSettings properties.
 * @hidden
 */
export interface TreegridWebMcpSettingsModel {
    /**
     * Specifies the name or prefix for the registered tools.
     *
     * @default null
     */
    name?: string;

    /**
     * Specifies the list of tools to register. Can be an array of tool names (strings) or tool objects.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Specifies the list of allowed origins to expose the registered tools to.
     *
     * @default null
     */
    exposedTo?: string[];
}

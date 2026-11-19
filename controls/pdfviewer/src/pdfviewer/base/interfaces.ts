import { ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { AnnotationType, DynamicStampItem, FormFieldType, SignStampItem, StandardBusinessStampItem } from './types';
import { ItemModel, RectangleBoundsModel } from '../pdfviewer-model';
import { IFormFieldBound } from '../form-designer';
import { IPoint } from '../annotation';
import { PointModel } from '../ej2-drawings/primitives';
import { Rectangle } from '@syncfusion/ej2-pdf';

/**
 * ContextMenu module is used to handle the context menus used in the control.
 *
 * @hidden
 */
export interface IContextMenu {
    contextMenuObj?: Context
    contextMenuElement: HTMLElement
    currentTarget: HTMLElement
    previousAction: string
    createContextMenu(): void
    updateContextMenuItems(items: string[], isEnable: boolean): void
    open(top: number, left: number, target: HTMLElement): void
    close(): void
    destroy(): void
    OnItemSelected(selectedMenu: string): void
}

/**
 * This event arguments to send the disabled or hidden contextmenu items details to the C# for blazor alone.
 *
 * @hidden
 */
export interface MouseDownEventArgs {
    /**
     * Specified the hidden contextmenu items to server.
     */
    hidenItems: string[]

    /**
     * Specified the disabled contextmenu items to server.
     */
    disabledItems: string[]

    /**
     * Specified the cancel the event.
     */
    isCancel: boolean
}

/**
 * WebMCP Tool Definition Interface
 */
export interface WebMcpTool {
    /**
     * Unique identifier for the tool (1-128 chars, alphanumeric, underscore, hyphen, period only)
     */
    name: string;
    /**
     * Natural language description of functionality
     */
    description: string;
    /**
     * Async callback function invoked by agents
     */
    execute?: Function;
    /**
     * Optional metadata (readOnlyHint, untrustedContentHint)
     */
    annotations?: {
        /**
         * Indicates if the tool is read-only
         */
        readOnlyHint?: boolean;
    };
    /**
     * The JSON schema object that defines the expected input parameters for the tool.
     */
    inputSchema: object;
    /**
     * The JSON schema object that defines the structure of the tool's output response.
     */
    outputSchema: object;
}

/**
 * WebMCP Tool Response Interface
 * @hidden
 */
export interface WebMcpToolResponse {
    /**
     * Array of content objects with type and text properties
     */
    content: { type: string; text: string }[];
    /**
     * Flag indicating if the response is an error
     */
    isError?: boolean;
}

/**
 * Defines the event arguments for the `beforeWebMcpToolExecute` event.
 * Provides access to the tool name and its input arguments before execution,
 * and allows the application to inspect, modify, or cancel the operation.
 */
export interface WebMcpToolExecuteEventArgs {
    /**
     * Specifies whether the tool execution should be cancelled.
     * Set to `true` to prevent the tool from executing.
     */
    cancel?: boolean;
    /**
     * Specifies the name of the WebMCP tool being executed (e.g. `'editCell'`, `'getCellData'`).
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
 * Interface for all WebMCP tool parameters
 * Consolidates all possible parameters across all tool handlers
 * @hidden
 */
export interface WebMcpToolParameters {
    navigationAction?: string;
    pageNumber?: number;
    searchText?: string;
    caseSensitive?: boolean;
    pageIndex?: number;
    startPage?: number;
    endPage?: number;
    annotationType?: AnnotationType;
    bounds?: RectangleBoundsModel[] | IFormFieldBound;
    fillColor?: string;
    strokeColor?: string;
    opacity?: number;
    offset?: IPoint;
    width?: number;
    height?: number;
    vertexPoints?: PointModel[];
    thickness?: number;
    content?: string;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    stampType?: string;
    stampValue?: DynamicStampItem | SignStampItem | StandardBusinessStampItem;
    path?: string;
    author?: string;
    url?: string;
    destinationPageIndex?: number;
    annotationId?: string;
    annotationIds?: string | string[];
    updates?: WebMcpToolParameters;
    fieldType?: FormFieldType;
    name?: string;
    fieldId?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isPrint?: boolean;
    tooltip?: string;
    maxLength?: number;
    visibility?: string;
    borderColor?: string;
    defaultValue?: string | boolean | number;
    value?: string | boolean | number;
    options?: (string | ItemModel)[];
    isMultiline?: boolean;
    isChecked?: boolean;
    isSelected?: boolean;
    fieldIds?: string | string[];
    pageRange?: string;
    zoomAction?: string;
    zoomValue?: number;
    bookmarkAction?: string;
    x?: number;
    y?: number;
    action?: string;
    redactionAction?: string;
    bound?: Rectangle;
    markerFillColor?: string;
    markerBorderColor?: string;
    overlayText?: string;
    beforeRedactionsApplied?: boolean;
    pageNumbers?: number[];
    filledFieldCount?: number;
    requiredFieldsMissing?: (string | undefined)[];
}

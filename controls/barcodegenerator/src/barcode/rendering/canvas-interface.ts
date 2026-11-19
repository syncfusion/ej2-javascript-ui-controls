/**
 * svg renderer
 */
import { createHtmlElement } from '../utility/dom-util';
import { IBarcodeRenderer } from './IRenderer';



/** @private */
export interface BaseAttributes {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    string?: string;
    stringSize?: number;
    visibility?: boolean;
    fontStyle?: string;
    id?: string;
    strokeColor?: string;
    imageSource?: any;
}

/** @private */
export interface EncodingResult {
    checksum: number;
    result: string;
}

/** @private */
export interface PdfDataMatrixSymbolAttribute {
    SymbolRow: number;
    SymbolColumn: number;
    HorizontalDataRegion: number;
    VerticalDataRegion: number;
    DataCodewords: number;
    CorrectionCodewords: number;
    InterleavedBlock: number;
    InterleavedDataBlock: number;
}

/** @private */
export interface Code93ExtendedValues {
    value: string;
    checkDigit: number;
    bars: string;
}
/** @private */
export interface Code93ExtendedArrayAttribute {
    character: string;
    keyword?: string;
    value?: string;
}

/** @private */
export interface ValidateEvent {
    message: string;
}
/** @private */
export class BarcodeSVGRenderer implements IBarcodeRenderer {
    /**
     * Draw the root element for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     * @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderRootElement(attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }

    /**
     * Draw the rect for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderRect(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**
     * Draw the horizontal line for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderLine(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**
     * Draw the text for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderText(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
}

/**
 * Defines the event arguments for the `beforeWebMcpToolExecute` event.
 * Provides access to the tool name and its input arguments before execution,
 * and allows the application to inspect or cancel the operation.
 */
export interface WebMcpToolExecuteEventArgs {
    /**
     * Specifies whether the tool execution should be cancelled.
     * Set to `true` to prevent the tool from executing.
     */
    cancel?: boolean;
    /**
     * Specifies the base name of the WebMCP tool being executed (e.g. `'generateBarcode'`).
     * This value never includes the prefix applied during registration.
     */
    toolName?: string;
    /**
     * Specifies the name the tool was registered under on `document.modelContext`, including any prefix.
     */
    registeredName?: string;
    /**
     * Specifies the arguments passed to the tool.
     */
    toolArgs?: object;
    /**
     * Set to `true` to display a confirmation dialog to the user before the tool executes.
     */
    showConfirmationDialog?: boolean;
    /**
     * Specifies a custom response message to send back to the AI when tool execution is cancelled.
     */
    cancellationResponse?: string;
}

/**
 * Defines the structure of a WebMCP tool, including its name, description,
 * and input/output JSON schemas used for tool registration and execution.
 */
export interface WebMcpTool {
    /**
     * The unique identifier name of the WebMCP tool (e.g., 'generateBarcode').
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
     * The behavioural hints an MCP client uses to decide how to present the tool.
     */
    annotations: object;
    /**
     * A function that executes the tool's logic when invoked.
     */
    execute?: Function;
}

/**
 * Defines the result returned by a WebMCP tool execution.
 */
export interface WebMcpToolResponse {
    /**
     * The response content blocks returned to the AI client.
     */
    content: { type: string; text: string }[];
    /**
     * Set to `true` when the tool failed, so the AI client surfaces the content as an error.
     */
    isError?: boolean;
}

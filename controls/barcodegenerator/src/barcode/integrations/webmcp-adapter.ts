/**
 * WebMcpBarcode - Barcode family WebMCP Integration
 * Enables AI model access to the BarcodeGenerator, QRCodeGenerator, DataMatrixGenerator, PDF417Generator and
 * DotCodeGenerator (including their GS1 variants) through the WebMCP protocol.
 */

import { isNullOrUndefined, Property, ChildProperty } from '@syncfusion/ej2-base';
import { BarcodeGenerator } from '../barcode';
import { QRCodeGenerator } from '../../qrcode/qrcode';
import { DataMatrixGenerator } from '../../datamatrix/datamatrix';
import { PDF417Generator } from '../../pdf417/pdf417';
import { DotCodeGenerator } from '../../dotcode/dotcode';
import { parseGs1, Gs1ParseResult } from '../../gs1/gs1-parser';
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../rendering/canvas-interface';

/**
 * Any of the generators the WebMCP module can be attached to.
 */
export type WebMcpBarcodeParent = BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator | PDF417Generator | DotCodeGenerator;

/**
 * Kind of generator, derived from the owning component.
 */
type WebMcpKind = 'barcode' | 'qrcode' | 'datamatrix' | 'pdf417' | 'dotcode';

const kindByModuleName: { [key: string]: WebMcpKind } = {
    barcode: 'barcode',
    QRCodeGenerator: 'qrcode',
    DataMatrixGenerator: 'datamatrix',
    PDF417Generator: 'pdf417',
    DotCodeGenerator: 'dotcode'
};

/**
 * Value rules for each one dimensional barcode type, returned by getSupportedBarcodeTypes.
 * The component remains the authority: it raises the invalid event when a value is rejected.
 */
const barcodeTypeRules: { [key: string]: string } = {
    Code39: 'Upper case letters A-Z, digits 0-9, space and - . $ / + %',
    Code39Extension: 'Full ASCII (encoded with Code 39 shift characters)',
    Code128: 'Full ASCII; code sets are chosen automatically',
    Code128A: 'Upper case letters, digits and ASCII control characters',
    Code128B: 'Upper and lower case letters, digits and printable ASCII',
    Code128C: 'Digits only, in pairs (even length)',
    Codabar: 'Digits and - $ : / . + ; optional start/stop characters A-D',
    Ean8: 'Digits only: 7 digits plus check digit (8 digits)',
    Ean13: 'Digits only: 12 digits plus check digit (13 digits)',
    UpcA: 'Digits only: 11 digits plus check digit (12 digits)',
    UpcE: 'Digits only: compressed UPC-A',
    Code11: 'Digits and -',
    Code93: 'Upper case letters A-Z, digits 0-9, space and - . $ / + %',
    Code93Extension: 'Full ASCII (encoded with Code 93 shift characters)',
    Code32: 'Digits only (Italian pharmacode)',
    GS1Code128: 'GS1 data in bracketed AI notation, e.g. (01)09506000134376(10)ABC123',
    ITF14: 'Digits only: 13 digits plus check digit (14 digits); supports bearerBarWidth',
    GS1DataBarOmnidirectional: 'Digits only: GTIN',
    GS1DataBarTruncated: 'Digits only: GTIN',
    GS1DataBarStacked: 'Digits only: GTIN',
    GS1DataBarStackedOmnidirectional: 'Digits only: GTIN',
    GS1DataBarLimited: 'Digits only: GTIN with indicator digit 0 or 1',
    GS1DataBarExpanded: 'GS1 data in bracketed AI notation',
    GS1DataBarExpandedStacked: 'GS1 data in bracketed AI notation; supports segmentsPerRow'
};

const webMcpBarcodeTypes: string[] = Object.keys(barcodeTypeRules);

const twoDimensionalRules: { [key: string]: { [key: string]: string } } = {
    qrcode: {
        QRCode: 'Any text (numeric, alphanumeric, byte and kanji modes are chosen automatically). Set enableGS1 for GS1 QR Code.'
    },
    datamatrix: {
        DataMatrix: 'ASCII, ASCIINumeric or Base256 content. Set enableGS1 for GS1 DataMatrix (ASCII only).'
    },
    pdf417: {
        PDF417: 'Text, numeric or byte content, with configurable columns, rows and error correction level.'
    },
    dotcode: {
        DotCode: 'Any text or bytes. Set enableGS1 for GS1 DotCode.'
    }
};

const RESULT_SCHEMA: object = {
    type: 'object',
    properties: { success: { type: 'boolean' }, data: { type: 'object' }, message: { type: 'string' } }
};

const COLOR_PROPS: { [key: string]: object } = {
    foreColor: { type: 'string', description: 'The foreground (bar or module) color, hex or named' },
    backgroundColor: { type: 'string', description: 'The background color, hex or named' }
};

const SIZE_PROPS: { [key: string]: object } = {
    width: { type: ['string', 'number'], description: 'Width as a CSS unit string (e.g. "300px", "100%") or pixels' },
    height: { type: ['string', 'number'], description: 'Height as a CSS unit string (e.g. "150px", "100%") or pixels' }
};

const MARGIN_SCHEMA: object = {
    type: 'object',
    description: 'Margin in pixels around the code',
    properties: { left: { type: 'number' }, right: { type: 'number' }, top: { type: 'number' }, bottom: { type: 'number' } }
};

const MODE_PROP: object = { type: 'string', enum: ['SVG', 'Canvas'], description: 'Rendering mode' };

const GENERATE_NAMES: { [key in WebMcpKind]: string } = {
    barcode: 'generateBarcode',
    qrcode: 'generateQRCode',
    datamatrix: 'generateDataMatrix',
    pdf417: 'generatePDF417',
    dotcode: 'generateDotCode'
};

/**
 * Builds the generate tool for a kind of generator.
 *
 * @param {WebMcpKind} kind - The generator kind.
 * @returns {WebMcpTool} - The tool definition.
 */
function createGenerateTool(kind: WebMcpKind): WebMcpTool {
    const properties: { [key: string]: object } = {
        value: { type: 'string', description: 'The value to encode' },
        ...COLOR_PROPS,
        ...SIZE_PROPS
    };
    const label: { [key in WebMcpKind]: string } = {
        barcode: 'one dimensional barcode', qrcode: 'QR code', datamatrix: 'Data Matrix code', pdf417: 'PDF417 code', dotcode: 'DotCode'
    };
    if (kind === 'barcode') {
        properties.type = { type: 'string', description: 'The barcode type, e.g. Code128, Ean13. See getSupportedBarcodeTypes.', enum: webMcpBarcodeTypes };
        properties.enableCheckSum = { type: 'boolean', description: 'Whether to enable checksum calculation' };
        properties.bearerBarWidth = { type: 'number', description: 'ITF14 only: bearer bar width multiplier (1-10)' };
        properties.segmentsPerRow = { type: 'number', description: 'GS1DataBarExpandedStacked only: segments per row (even, 2-20)' };
    } else if (kind !== 'pdf417') {
        // GS1 is supported by QRCode, DataMatrix, DotCode; not by PDF417
        properties.enableGS1 = { type: 'boolean', description: 'Encode the value as GS1 data (bracketed AI notation or raw). Use validateGs1Data first.' };
    }
    if (kind === 'qrcode') {
        properties.xDimension = { type: 'number', description: 'Module size in pixels' };
        properties.errorCorrectionLevel = { type: ['string', 'number'], description: 'Low (7%), Medium (15%), Quartile (25%) or High (30%)' };
        properties.version = { type: 'number', description: 'QR version 1-40, or 0 for automatic' };
    }
    if (kind === 'datamatrix') {
        properties.xDimension = { type: 'number', description: 'Module size in pixels' };
        properties.encoding = { type: 'string', enum: ['Auto', 'ASCII', 'ASCIINumeric', 'Base256'], description: 'Encoding mode' };
        properties.symbolSize = { type: 'number', description: 'Symbol size index 0-19 (0 = Auto, 1 = 10x10 ... 19 = 88x88)' };
    }
    if (kind === 'pdf417') {
        properties.compactionMode = { type: 'string', enum: ['Auto', 'Text', 'Numeric', 'Byte'], description: 'Compaction mode' };
        properties.errorCorrectionLevel = { type: 'number', description: 'Error correction level 0-8, or -1 for automatic' };
        properties.columns = { type: 'number', description: 'Number of data columns (0 or omitted = automatic)' };
        properties.rows = { type: 'number', description: 'Number of rows (0 or omitted = automatic)' };
        properties.isCompact = { type: 'boolean', description: 'Render the compact (truncated) PDF417 variant' };
        properties.rowHeightRatio = { type: 'number', description: 'Row height to module width ratio' };
    }
    if (kind === 'dotcode') {
        properties.columns = { type: 'number', description: 'Dot grid columns: 0 for automatic, otherwise 5 or more' };
    }
    return {
        name: GENERATE_NAMES[kind],
        description: `Generates or updates the ${label[kind]} with the specified value and appearance. All supplied values are ` +
            'validated before any is applied. The response reports whether the component accepted the value (valid) and the validation message if not.',
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
        inputSchema: { type: 'object', properties, required: ['value'] },
        outputSchema: RESULT_SCHEMA
    };
}

/**
 * Builds the complete tool catalogue for a kind of generator.
 *
 * @param {WebMcpKind} kind - The generator kind.
 * @returns {WebMcpTool[]} - The tools available for that kind.
 */
function createTools(kind: WebMcpKind): WebMcpTool[] {
    return [
        createGenerateTool(kind),
        {
            name: 'getBarcodeConfiguration',
            description: 'Reads the full current configuration (symbology settings, colors, size, margin, display text, rendering mode) ' +
                'and whether the current value is valid, with the validation message if not. No side effects: does not modify the barcode.',
            annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
            inputSchema: { type: 'object', properties: {} },
            outputSchema: RESULT_SCHEMA
        },
        {
            name: 'manageDisplayText',
            description: 'Updates the human readable text shown with the code: custom text, visibility, font, size, alignment, ' +
                'position (Top/Bottom) and margin.',
            annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
            inputSchema: {
                type: 'object',
                properties: {
                    text: { type: 'string', description: 'Custom text. Empty string shows the encoded value.' },
                    visibility: { type: 'boolean' },
                    font: { type: 'string', description: 'Font family' },
                    size: { type: 'number', description: 'Font size in pixels' },
                    alignment: { type: 'string', enum: ['Left', 'Right', 'Center'] },
                    position: { type: 'string', enum: ['Top', 'Bottom'] },
                    margin: MARGIN_SCHEMA
                }
            },
            outputSchema: RESULT_SCHEMA
        },
        {
            name: 'manageBarcodeLayout',
            description: 'Updates the layout of the code: width, height, margin and rendering mode (SVG or Canvas).',
            annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
            inputSchema: { type: 'object', properties: { ...SIZE_PROPS, margin: MARGIN_SCHEMA, mode: MODE_PROP } },
            outputSchema: RESULT_SCHEMA
        },
        {
            name: 'getSupportedBarcodeTypes',
            description: 'Lists the symbologies this component supports with the value rules for each, so a valid type and value can be chosen.',
            annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
            inputSchema: { type: 'object', properties: {} },
            outputSchema: RESULT_SCHEMA
        },
        {
            name: 'validateGs1Data',
            description: 'Validates GS1 element data (bracketed such as (01)09506000134376(10)ABC123, or raw) without changing the code. ' +
                'Returns the parsed Application Identifiers or the error.',
            annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
            inputSchema: {
                type: 'object',
                properties: { value: { type: 'string', description: 'GS1 element string to validate' } },
                required: ['value']
            },
            outputSchema: RESULT_SCHEMA
        },
        {
            name: 'exportBarcodeImage',
            description: 'Exports the code as a PNG or JPG. Can return as base64 string or trigger a browser download. When download is true, it triggers a file download to the user\'s device. When download is false or omitted, returns the image as a base64 string for programmatic use.',
            annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
            inputSchema: {
                type: 'object',
                properties: {
                    exportType: { type: 'string', description: 'The export format', enum: ['PNG', 'JPG'] },
                    download: { type: 'boolean', description: 'If true, triggers browser file download. If false or omitted, returns base64 string.' },
                    fileName: { type: 'string', description: 'File name for download. Only used when download is true. Defaults to the element id.' }
                },
                required: ['exportType']
            },
            outputSchema: RESULT_SCHEMA
        }
    ];
}

const toolCache: { [key: string]: WebMcpTool[] } = {};

/**
 * Loosely typed argument bag. Tool arguments arrive as JSON from an AI client, so their
 * members cannot be described statically; every handler validates what it reads.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebMcpArgs = { [key: string]: any };

/**
 * Payload of the `getWebMcpTools` notification.
 */
interface WebMcpToolsRequest {
    /** Optional allowlist of tool names to return. */
    toolNames?: string[];
    /** Receives the matching tool definitions. */
    tools?: WebMcpTool[];
}

/**
 * Payload of the `registerWebMcpTools` notification.
 */
interface WebMcpRegisterRequest {
    /** Prefix applied to every registered tool name. */
    prefix?: string;
    /** Allowlist of tool names, or complete custom tool definitions. */
    tools?: string[] | WebMcpTool[];
    /** Origins allowed to reach the tools from a cross-origin iframe. */
    exposedTo?: string[];
}

/**
 * WebMcpBarcode - Integrates the barcode family with WebMCP protocol
 * Manages tool registration, execution, and communication with the MCP server
 */
export class WebMcpBarcode {
    private parent: WebMcpBarcodeParent = null as WebMcpBarcodeParent;
    private kind: WebMcpKind = 'barcode';
    private webMcpAbortController: AbortController = null;
    private listenersAttached: boolean = false;
    private getToolsHandler: Function = null;
    private registerToolsHandler: Function = null;
    private unregisterToolsHandler: Function = null;
    private destroyHandler: Function = null;

    /**
     * Creates the adapter. The module loader supplies the owning barcode.
     *
     * @param {WebMcpBarcodeParent} parent - The barcode instance that owns this adapter.
     */
    public constructor(parent?: WebMcpBarcodeParent) {
        this.parent = parent || null;
        if (parent) {
            this.kind = kindByModuleName[parent.getModuleName()] || 'barcode';
            this.addEventListener();
        }
    }

    /**
     * Initializes the WebMCP adapter with the parent barcode.
     * Called by the parent BarcodeGenerator component after module injection.
     *
     * @param {WebMcpBarcodeParent} parent - The barcode instance that owns this adapter.
     * @returns {void}
     */
    public init(parent: WebMcpBarcodeParent): void {
        if (this.parent && this.parent !== parent) {
            this.removeEventListener();
        }
        this.parent = parent || null;
        this.kind = parent ? (kindByModuleName[parent.getModuleName()] || 'barcode') : 'barcode';
        this.addEventListener();
    }

    /**
     * Registers listeners for the getWebMcpTools and registerWebMcpTools notifications.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (isNullOrUndefined(this.parent) || this.listenersAttached) {
            return;
        }
        this.getToolsHandler = (args: WebMcpToolsRequest): void => {
            this.getTools(args);
        };
        this.registerToolsHandler = (args: WebMcpRegisterRequest): void => {
            this.registerTools(args);
        };
        this.unregisterToolsHandler = (): void => {
            this.unregisterTools();
        };
        this.destroyHandler = (): void => {
            this.destroy();
        };
        this.parent.on('getWebMcpTools', this.getToolsHandler, this);
        this.parent.on('registerWebMcpTools', this.registerToolsHandler, this);
        this.parent.on('unregisterWebMcpTools', this.unregisterToolsHandler, this);
        // The component's destroy raises this notification before the component tears itself down.
        this.parent.on('destroy', this.destroyHandler, this);
        this.listenersAttached = true;
    }

    /**
     * Removes the notification listeners registered by this adapter.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (isNullOrUndefined(this.parent) || this.parent.isDestroyed || !this.listenersAttached) {
            this.listenersAttached = false;
            return;
        }
        this.parent.off('getWebMcpTools', this.getToolsHandler);
        this.parent.off('registerWebMcpTools', this.registerToolsHandler);
        this.parent.off('unregisterWebMcpTools', this.unregisterToolsHandler);
        this.parent.off('destroy', this.destroyHandler);
        this.getToolsHandler = null;
        this.registerToolsHandler = null;
        this.unregisterToolsHandler = null;
        this.destroyHandler = null;
        this.listenersAttached = false;
    }

    /**
     * Retrieves available tools, optionally filtered by name.
     *
     * @param {WebMcpToolsRequest} args - Holds the optional name filter and receives the resulting tools.
     * @returns {WebMcpTool[]} - The matching tool definitions.
     */
    private getTools(args: WebMcpToolsRequest): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        const all: WebMcpTool[] = this.catalogue();
        args.tools = (toolNames && toolNames.length !== 0 ? all.filter((t: WebMcpTool) => toolNames.indexOf(t.name) !== -1) : all)
            .map((t: WebMcpTool) => ({ ...t }));
        return args.tools;
    }

    /**
     * Returns the tool catalogue for the attached generator kind.
     *
     * @returns {WebMcpTool[]} - The tool definitions.
     */
    private catalogue(): WebMcpTool[] {
        if (!toolCache[this.kind]) {
            toolCache[this.kind] = createTools(this.kind);
        }
        return toolCache[this.kind];
    }

    /**
     * Registers tools for WebMCP integration. Called automatically when WebMCP is enabled.
     *
     * @param {WebMcpRegisterRequest} args - Tool registration request containing prefix, tools, and exposedTo
     * @returns {void}
     */
    public registerTools(args: WebMcpRegisterRequest): void {
        // Check both navigator.modelContext (WebMCP spec) and document.modelContext (Chrome preview implementation)
        let modelContext: { registerTool: Function } =
            <{ registerTool: Function }>(navigator as { modelContext?: { registerTool: Function } }).modelContext;
        if (!modelContext) {
            modelContext = <{ registerTool: Function }>(document as { modelContext?: { registerTool: Function } }).modelContext;
        }
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn(`[WebMcpBarcode] WebMCP tools registration failed: modelContext not found on navigator or document. 
                    Ensure the page is run in a WebMCP-capable context (Chrome preview or equivalent).`);
            }
            return;
        }
        this.unregisterTools();
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            // CRITICAL FIX: Create a copy of the tool definition before prefixing.
            // Without this, re-registering custom tools mutates the original definition,
            // causing double-prefixing (e.g., p_p_tool) on subsequent registrations.
            const toolCopy: WebMcpTool = { ...tool };
            toolCopy.name = `${toolPrefix}_${toolCopy.name}`;
            // Always route through executeHandler so beforeWebMcpToolExecute event fires for all tools (built-in and custom).
            // This ensures the event is triggered regardless of whether the tool is built-in or provided by the app.
            toolCopy.execute = async (args: object) => this.executeHandler(toolCopy.name, args || {});
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(toolCopy, registerOptions);
        });
    }

    /**
     * Revokes every tool previously registered by this adapter instance.
     *
     * @returns {void}
     */
    public unregisterTools(): void {
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
    }

    /**
     * Resolves a registered (possibly prefixed) tool name back to its base command name.
     * Matching against the registry avoids breaking on prefixes that contain underscores.
     *
     * @param {string} command - The registered tool name received from the MCP client.
     * @returns {string} - The base command name used for handler dispatch.
     */
    private resolveBaseCommand(command: string): string {
        if (!command) {
            return command;
        }
        for (const tool of this.catalogue()) {
            if (command === tool.name || command.endsWith(`_${tool.name}`)) {
                return tool.name;
            }
        }
        return command;
    }

    /**
     * Asks the end user to confirm a tool execution when the application requests it.
     *
     * @param {WebMcpToolExecuteEventArgs} eventArgs - The event arguments raised for this execution.
     * @returns {boolean} - True when the execution may proceed.
     */
    private confirmExecution(eventArgs: WebMcpToolExecuteEventArgs): boolean {
        if (typeof window === 'undefined' || typeof window.confirm !== 'function') {
            // No way to ask the user: fail closed rather than silently running a tool.
            return false;
        }
        return window.confirm(`Allow the AI assistant to run "${eventArgs.toolName}" on this ${this.kind === 'barcode' ? 'barcode' : this.kind}?`);
    }

    /**
     * Builds the response returned to the AI client when an execution is refused.
     *
     * @param {string} command - The tool that was refused.
     * @param {string} reason - Optional application supplied message.
     * @returns {WebMcpToolResponse} - The cancellation response.
     */
    private cancelled(command: string, reason?: string): WebMcpToolResponse {
        return this.message({
            success: false,
            action: command,
            cancelled: true,
            message: reason || `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
        });
    }

    /**
     * Executes a WebMCP tool handler and raises beforeWebMcpToolExecute for cancellation or confirmation.
     * Supports async handlers via Promise wrapper for frameworks that need async event handling.
     *
     * @param {string} command - The tool name to execute.
     * @param {Object} args - The arguments supplied by the AI client.
     * @returns {Promise<WebMcpToolResponse>} - The tool response.
     */
    private async executeHandler(command: string, args: Object): Promise<WebMcpToolResponse> {
        if (!this.ensureParent()) {
            return this.error('WebMcpBarcode is not properly initialized. Parent barcode is not available.');
        }
        const baseCommand: string = this.resolveBaseCommand(command);
        const eventArgs: WebMcpToolExecuteEventArgs = {
            cancel: false,
            toolName: baseCommand,
            registeredName: command,
            toolArgs: args,
            showConfirmationDialog: false
        };
        
        // Trigger the event. Note: EJ2 events are synchronous; handlers cannot await async operations.
        // To enable async handlers, the component would need to support a callback pattern or return Promises,
        // which would require changes to the component's event system.
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        if (eventArgs.cancel) {
            return this.cancelled(baseCommand, eventArgs.cancellationResponse);
        }
        if (eventArgs.showConfirmationDialog && !this.confirmExecution(eventArgs)) {
            return this.cancelled(baseCommand, eventArgs.cancellationResponse);
        }

        try {
            // Route to the appropriate tool handler.
            switch (baseCommand) {
            case GENERATE_NAMES[this.kind]:
                return this.handleGenerate(args);
            case 'getBarcodeConfiguration':
                return this.handleGetConfiguration();
            case 'manageDisplayText':
                return this.handleManageDisplayText(args);
            case 'manageBarcodeLayout':
                return this.handleManageLayout(args);
            case 'getSupportedBarcodeTypes':
                return this.handleSupportedTypes();
            case 'validateGs1Data':
                return this.handleValidateGs1(args);
            case 'exportBarcodeImage':
                return await this.handleExport(args);
            default: return this.error(`Tool "${baseCommand}" not found.`);
            }
        } catch (err) {
            return this.error(`Tool execution failed: ${(err as Error).message || 'Unknown error'}`);
        }
    }

    /**
     * Verifies that a usable parent barcode is attached before a handler runs.
     *
     * @returns {boolean} - True when the parent barcode is available.
     */
    private ensureParent(): boolean {
        return !isNullOrUndefined(this.parent) && !this.parent.isDestroyed;
    }

    /**
     * Applies a model to the parent and reports whether the component accepted the value.
     * The component raises its `invalid` event while rendering; it is observed for the duration of the update.
     * If the component rejects the value, the previous state is restored.
     *
     * @param {WebMcpArgs} model - The properties to apply.
     * @returns {string} - The validation message, or undefined when the value was accepted.
     */
    private applyModel(model: WebMcpArgs): string {
        let message: string;
        const handler: Function = (e: WebMcpArgs): void => {
            message = e && e.message ? e.message : 'Invalid value.';
        };
        const parent: WebMcpArgs = this.parent as WebMcpArgs;
        
        // Save the previous state for rollback. Deep copy nested objects like margin and displayText.
        const backup: WebMcpArgs = {};
        for (const key of Object.keys(model)) {
            const value: any = (parent as any)[key];
            // Deep copy objects to avoid reference issues
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                backup[key] = { ...value };
            } else {
                backup[key] = value;
            }
        }
        
        parent.addEventListener('invalid', handler);
        try {
            this.parent.setProperties(model);
        } finally {
            parent.removeEventListener('invalid', handler);
        }
        
        // If the component rejected the value, restore the previous state and clear the error
        if (message) {
            this.parent.setProperties(backup);
            // After rollback, the value is restored to valid state, so clear the validation message
            message = undefined;
        }
        
        // Store the validation message for use by getBarcodeConfiguration
        (this as any).lastValidationMessage = message;
        
        return message;
    }

    /**
     * Returns the last known validation message from the most recent property update.
     * This reports whether the current value (as most recently set) is valid.
     * 
     * After a successful generate/update call, this reflects the component's verdict.
     * If an invalid value is rejected and rolled back, this returns undefined (valid).
     * If the app sets a value directly (bypassing WebMCP), this won't immediately reflect it
     * until the app calls a WebMCP tool or the component detects an error.
     *
     * @returns {string} - The validation message, or undefined when the current value is valid.
     */
    private currentValidation(): string {
        return (this as any).lastValidationMessage;
    }

    private isNumber(value: unknown): boolean {
        return typeof value === 'number' && isFinite(value);
    }

    private isSize(value: unknown): boolean {
        return (typeof value === 'number' && isFinite(value) && value > 0) || (typeof value === 'string' && value.trim() !== '');
    }

    /**
     * Validates and copies the arguments shared by every generator into a model.
     *
     * @param {WebMcpArgs} args - The tool arguments.
     * @param {WebMcpArgs} model - The model receiving validated values.
     * @returns {string} - An error message, or undefined when valid.
     */
    private collectCommon(args: WebMcpArgs, model: WebMcpArgs): string {
        for (const color of ['foreColor', 'backgroundColor']) {
            if (!isNullOrUndefined(args[`${color}`])) {
                if (typeof args[`${color}`] !== 'string' || !args[`${color}`]) { return `${color} must be a non-empty string.`; }
                model[`${color}`] = args[`${color}`];
            }
        }
        for (const dim of ['width', 'height']) {
            if (!isNullOrUndefined(args[`${dim}`])) {
                if (!this.isSize(args[`${dim}`])) { return `${dim} must be a positive number or a CSS size string.`; }
                model[`${dim}`] = args[`${dim}`];
            }
        }
        if (!isNullOrUndefined(args.mode)) {
            if (args.mode !== 'SVG' && args.mode !== 'Canvas') { return 'mode must be SVG or Canvas.'; }
            model.mode = args.mode;
        }
        if (!isNullOrUndefined(args.margin)) {
            const margin: WebMcpArgs = {};
            if (typeof args.margin !== 'object') { return 'margin must be an object.'; }
            for (const side of ['left', 'right', 'top', 'bottom']) {
                if (!isNullOrUndefined(args.margin[`${side}`])) {
                    if (!this.isNumber(args.margin[`${side}`]) || args.margin[`${side}`] < 0) { return `margin.${side} must be a non-negative number.`; }
                    margin[`${side}`] = args.margin[`${side}`];
                }
            }
            model.margin = margin;
        }
        return undefined;
    }

    /**
     * Generates or updates the code. Every value is validated before any is applied.
     *
     * @param {Object} args - The tool arguments.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleGenerate(args: WebMcpArgs): WebMcpToolResponse {
        if (typeof args.value !== 'string' || args.value === '') {
            return this.error('Missing or invalid required parameter: value (non-empty string).');
        }
        const model: WebMcpArgs = { value: args.value };
        const problem: string = this.collectCommon(args, model) || this.collectSpecific(args, model);
        if (problem) {
            return this.error(problem);
        }
        const validation: string = this.applyModel(model);
        return this.message({
            success: !validation, valid: !validation, validationMessage: validation, data: { ...model },
            message: validation ? 'The component rejected the value. Settings were rolled back.' : 'Generated successfully.'
        });
    }

    /**
     * Validates the arguments that only apply to one kind of generator.
     *
     * @param {WebMcpArgs} args - The tool arguments.
     * @param {WebMcpArgs} model - The model receiving validated values.
     * @returns {string} - An error message, or undefined when valid.
     */
    private collectSpecific(args: WebMcpArgs, model: WebMcpArgs): string {
        const parent: WebMcpArgs = this.parent as WebMcpArgs;
        if (!isNullOrUndefined(args.enableGS1)) {
            if (this.kind === 'barcode') { return 'enableGS1 is not supported by barcode; use a GS1 type such as GS1Code128.'; }
            if (this.kind === 'pdf417') { return 'enableGS1 is not supported by PDF417.'; }
            if (typeof args.enableGS1 !== 'boolean') { return 'enableGS1 must be a boolean.'; }
            model.enableGS1 = args.enableGS1;
        }
        const range: Function = (name: string, min: number, max: number, integer: boolean): string => {
            if (isNullOrUndefined(args[`${name}`])) { return undefined; }
            const v: number = args[`${name}`];
            if (!this.isNumber(v) || v < min || v > max || (integer && Math.floor(v) !== v)) {
                return `${name} must be ${integer ? 'an integer' : 'a number'} between ${min} and ${max}.`;
            }
            model[`${name}`] = v;
            return undefined;
        };
        switch (this.kind) {
        case 'barcode': {
            if (!isNullOrUndefined(args.type)) {
                if (webMcpBarcodeTypes.indexOf(args.type) === -1) { return `Invalid barcode type: ${args.type}`; }
                model.type = args.type;
            }
            const type: string = args.type || parent.type;
            if (!isNullOrUndefined(args.enableCheckSum)) {
                if (typeof args.enableCheckSum !== 'boolean') { return 'enableCheckSum must be a boolean.'; }
                model.enableCheckSum = args.enableCheckSum;
            }
            if (type === 'ITF14') {
                return range('bearerBarWidth', 1, 10, false);
            }
            if (type === 'GS1DataBarExpandedStacked' && !isNullOrUndefined(args.segmentsPerRow)) {
                const r: string = range('segmentsPerRow', 2, 20, true);
                return r || (args.segmentsPerRow % 2 !== 0 ? 'segmentsPerRow must be an even number between 2 and 20.' : undefined);
            }
            return undefined;
        }
        case 'qrcode': {
            const r: string = range('xDimension', 1, 100, false) || range('version', 0, 40, true);
            if (r) { return r; }
            if (!isNullOrUndefined(args.errorCorrectionLevel)) {
                const levels: { [key: string]: number } = { Low: 7, Medium: 15, Quartile: 25, High: 30 };
                const level: number = typeof args.errorCorrectionLevel === 'string' ? levels[args.errorCorrectionLevel] : args.errorCorrectionLevel;
                if ([7, 15, 25, 30].indexOf(level) === -1) { return 'errorCorrectionLevel must be Low, Medium, Quartile or High.'; }
                model.errorCorrectionLevel = level;
            }
            return undefined;
        }
        case 'datamatrix': {
            const r: string = range('xDimension', 1, 100, false) || range('symbolSize', 0, 19, true);
            if (r) { return r; }
            if (!isNullOrUndefined(args.symbolSize)) {
                // Map the API's symbolSize parameter to the component's size property
                model.size = args.symbolSize;
            }
            if (!isNullOrUndefined(args.encoding)) {
                if (['Auto', 'ASCII', 'ASCIINumeric', 'Base256'].indexOf(args.encoding) === -1) { return 'Invalid encoding.'; }
                model.encoding = args.encoding;
            }
            return undefined;
        }
        case 'pdf417': {
            const r: string = range('errorCorrectionLevel', -1, 8, true) || range('columns', 0, 30, true) ||
                range('rows', 0, 90, true) || range('rowHeightRatio', 1, 20, false);
            if (r) { return r; }
            if (!isNullOrUndefined(args.compactionMode)) {
                if (['Auto', 'Text', 'Numeric', 'Byte'].indexOf(args.compactionMode) === -1) { return 'Invalid compactionMode.'; }
                model.compactionMode = args.compactionMode;
            }
            if (!isNullOrUndefined(args.isCompact)) {
                if (typeof args.isCompact !== 'boolean') { return 'isCompact must be a boolean.'; }
                model.isCompact = args.isCompact;
            }
            return undefined;
        }
        default: {
            if (!isNullOrUndefined(args.columns) && args.columns !== 0) {
                return range('columns', 5, 1000, true);
            }
            if (args.columns === 0) { model.columns = 0; }
            return undefined;
        }
        }
    }

    /**
     * Returns the full current configuration and validity of the value.
     *
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleGetConfiguration(): WebMcpToolResponse {
        const parent: WebMcpArgs = this.parent as WebMcpArgs;
        const keys: { [key in WebMcpKind]: string[] } = {
            barcode: ['type', 'enableCheckSum', 'bearerBarWidth', 'segmentsPerRow'],
            qrcode: ['enableGS1', 'xDimension', 'errorCorrectionLevel', 'version'],
            datamatrix: ['enableGS1', 'xDimension', 'encoding', 'size'],
            pdf417: ['compactionMode', 'errorCorrectionLevel', 'columns', 'rows', 'isCompact', 'rowHeightRatio'],
            dotcode: ['enableGS1', 'columns']
        };
        const data: WebMcpArgs = { kind: this.kind };
        ['value', 'foreColor', 'backgroundColor', 'width', 'height', 'mode'].concat(keys[this.kind]).forEach((key: string) => {
            data[`${key}`] = parent[`${key}`];
        });
        // For DataMatrix, return symbolSize instead of size, and validate the range
        if (this.kind === 'datamatrix') {
            const symbolSize: number = parent.size;
            if (typeof symbolSize === 'number' && (symbolSize < 0 || symbolSize > 19)) {
                data.symbolSize = symbolSize;
                data._symbolSizeWarning = `Symbol size ${symbolSize} is out of valid range (0–19). Component may have invalid state.`;
            } else {
                data.symbolSize = symbolSize;
            }
            // Remove the 'size' key and replace with 'symbolSize'
            delete data.size;
        }
        const dt: WebMcpArgs = parent.displayText || {};
        const m: WebMcpArgs = parent.margin || {};
        data.displayText = {
            text: dt.text, visibility: dt.visibility, font: dt.font, size: dt.size, alignment: dt.alignment, position: dt.position,
            margin: dt.margin ? { left: dt.margin.left, right: dt.margin.right, top: dt.margin.top, bottom: dt.margin.bottom } : undefined
        };
        data.margin = { left: m.left, right: m.right, top: m.top, bottom: m.bottom };
        if (parent.symbolInfo) { data.symbolInfo = parent.symbolInfo; }
        const validation: string = this.currentValidation();
        return this.message({ success: true, valid: !validation, validationMessage: validation, data });
    }

    /**
     * Updates the display text settings.
     *
     * @param {Object} args - The tool arguments.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageDisplayText(args: WebMcpArgs): WebMcpToolResponse {
        const text: WebMcpArgs = {};
        if (!isNullOrUndefined(args.text)) {
            if (typeof args.text !== 'string') { return this.error('text must be a string.'); }
            text.text = args.text;
        }
        if (!isNullOrUndefined(args.visibility)) {
            if (typeof args.visibility !== 'boolean') { return this.error('visibility must be a boolean.'); }
            text.visibility = args.visibility;
        }
        if (!isNullOrUndefined(args.font)) {
            if (typeof args.font !== 'string' || !args.font) { return this.error('font must be a non-empty string.'); }
            text.font = args.font;
        }
        if (!isNullOrUndefined(args.size)) {
            if (!this.isNumber(args.size) || args.size <= 0) { return this.error('size must be a positive number.'); }
            text.size = args.size;
        }
        if (!isNullOrUndefined(args.alignment)) {
            if (['Left', 'Right', 'Center'].indexOf(args.alignment) === -1) { return this.error('alignment must be Left, Right or Center.'); }
            text.alignment = args.alignment;
        }
        if (!isNullOrUndefined(args.position)) {
            if (['Top', 'Bottom'].indexOf(args.position) === -1) { return this.error('position must be Top or Bottom.'); }
            text.position = args.position;
        }
        if (!isNullOrUndefined(args.margin)) {
            const holder: WebMcpArgs = {};
            const problem: string = this.collectCommon({ margin: args.margin }, holder);
            if (problem) { return this.error(problem); }
            text.margin = holder.margin;
        }
        if (Object.keys(text).length === 0) {
            return this.error('Supply at least one of text, visibility, font, size, alignment, position or margin.');
        }
        const validation: string = this.applyModel({ displayText: text });
        return this.message({
            success: !validation, valid: !validation, validationMessage: validation, data: { displayText: text },
            message: 'Display text updated.'
        });
    }

    /**
     * Updates width, height, margin and rendering mode.
     *
     * @param {Object} args - The tool arguments.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageLayout(args: WebMcpArgs): WebMcpToolResponse {
        const model: WebMcpArgs = {};
        const problem: string = this.collectCommon({ width: args.width, height: args.height, margin: args.margin, mode: args.mode }, model);
        if (problem) { return this.error(problem); }
        if (Object.keys(model).length === 0) { return this.error('Supply at least one of width, height, margin or mode.'); }
        const validation: string = this.applyModel(model);
        return this.message({
            success: !validation, valid: !validation, validationMessage: validation, data: model, message: 'Layout updated.'
        });
    }

    /**
     * Lists the symbologies supported by the attached generator with their value rules.
     *
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleSupportedTypes(): WebMcpToolResponse {
        const rules: { [key: string]: string } = this.kind === 'barcode' ? barcodeTypeRules : twoDimensionalRules[this.kind];
        const types: object[] = Object.keys(rules).map((name: string) => ({ type: name, valueRules: rules[`${name}`] }));
        return this.message({ success: true, data: { kind: this.kind, types } });
    }

    /**
     * Validates GS1 data without changing the code.
     *
     * @param {Object} args - The tool arguments.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleValidateGs1(args: WebMcpArgs): WebMcpToolResponse {
        if (typeof args.value !== 'string' || args.value === '') {
            return this.error('Missing or invalid required parameter: value (non-empty string).');
        }
        const result: Gs1ParseResult = parseGs1(args.value);
        if (result.ok === false) {
            return this.message({ success: true, valid: false, error: result.error });
        }
        return this.message({
            success: true, valid: true,
            data: { elements: result.elements.map((e: WebMcpArgs) => ({ ai: e.ai, value: e.value })), humanReadableText: result.humanReadableText }
        });
    }

    /**
     * Exports the code as a base64 image, or downloads it.
     *
     * @param {Object} args - The tool arguments.
     * @returns {Promise<WebMcpToolResponse>} - The tool response.
     */
    /**
     * Exports the barcode as an image. Can either return base64 or download as a file.
     *
     * @param {WebMcpArgs} args - Export arguments (exportType, fileName for download).
     * @param {boolean} download - If true, triggers file download. If false, returns base64.
     * @returns {Promise<WebMcpToolResponse>} - The tool response.
     */
    private async handleExport(args: WebMcpArgs): Promise<WebMcpToolResponse> {
        if (args.exportType !== 'PNG' && args.exportType !== 'JPG') {
            return this.error('Invalid or missing exportType. Must be PNG or JPG.');
        }
        const download: boolean = args.download === true;
        const parent: WebMcpArgs = this.parent as WebMcpArgs;
        if (download) {
            const fileName: string = typeof args.fileName === 'string' && args.fileName ? args.fileName : this.parent.element.id;
            parent.exportImage(fileName, args.exportType);
            return this.message({ success: true, data: { exportType: args.exportType, fileName, downloaded: true } });
        }
        const image: string = await parent.exportAsBase64Image(args.exportType);
        return this.message({ success: true, data: { exportType: args.exportType, image } });
    }

    /**
     * Revokes registered tools, removes listeners and releases the parent reference.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.unregisterTools();
        this.parent = null;
    }

    /**
     * Returns the module name used for injection and lookup.
     *
     * @returns {string} - The module name.
     */
    public getModuleName(): string {
        return 'WebMcpBarcode';
    }

    /**
     * Formats a payload in the WebMCP standard response format.
     *
     * @param {unknown} data - The payload serialized into the response content.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    /**
     * Formats a failure in the WebMCP standard response format.
     *
     * @param {string} text - The message describing what went wrong.
     * @returns {WebMcpToolResponse} - The tool response flagged as an error.
     */
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }
}

/**
 * Defines the settings for WebMCP integration in the Barcode component.
 * Provides declarative configuration for tool registration and exposure.
 */
export class WebMcpBarcodeSettings extends ChildProperty<WebMcpBarcodeSettings> {
    /**
     * Name of the barcode for organizing registered tools
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Array of tool names or custom WebMcpTool definitions to register
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Optional list of allowed origins for cross-origin iframe access
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}

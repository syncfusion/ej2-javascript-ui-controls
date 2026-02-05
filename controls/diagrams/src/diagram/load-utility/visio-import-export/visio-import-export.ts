import { BpmnShapeModel, ConnectorModel, IExportingEventArgs, IImportingEventArgs, NodeModel } from '../..';
import { Diagram } from '../../diagram';
import { DiagramConstraints, DiagramEvent, SnapConstraints } from '../../enum/enum';
import { bindVisioConnectors, VisioConnections, VisioConnector } from './visio-connectors';
import { IMPORT_LIMITATIONS, UNIT_CONVERSION } from './visio-constants';
import { ensureArray } from './visio-core';
import { exportToVsdxFile } from './visio-export';
import { parserVisioRelationship, parseVisioDocumentSettings, parseVisioMaster, parseVisioPage, parseVisioTheme, parseVisioWindow } from './visio-model-parsers';
import { VisioDiagramData, VisioLayer, VisioPage, VisioRelationship, VisioShape, VisioTheme, VisioWindow } from './visio-models';
import { parserVisioShape } from './visio-node-parser';
import { convertVisioShapeToNode } from './visio-nodes';
import { VisioPackageReader } from './visio-package-reader';
import { BPMNActivityShape, BPMNShape, DiagramAddInfo, DocumentSettingsElement, MasterElement, OneOrMany, ParsedXmlObject, ShapeCache, ThemeElements, VisioCell, VisioDocumentStructure, VisioMedia, VisioNode, VisioPageContent, VisioShapeData, WindowRootElement, XmlRelationship } from './visio-types';
import { MinimalZipReader } from './zipReader';

/**
 * Main class for importing and exporting Visio VSDX files.
 * Orchestrates the entire import/export pipeline including file reading, XML parsing, and diagram loading.
 *
 * This class serves as the primary public API for Visio import/export functionality,
 * managing the complete lifecycle of VSDX file conversion.
 *
 * @remarks
 * The class uses a {@link ParsingContext} to maintain state during operations,
 * ensuring re-entrant and testable parsing logic without global state dependencies.
 *
 * @example
 * ```typescript
 * const importer = new ImportAndExportVisio();
 * const file = document.getElementById('fileInput').files[0];
 * const result = await importer.importVSDX(file, diagram, { pageIndex: 0 });
 * console.log(result.warnings); // Log any import warnings
 * ```
 */
export class ImportAndExportVisio {
    /** Instance of VisioPackageReader for reading and extracting VSDX file contents */
    private packageReader: VisioPackageReader;

    /**
     * Creates a new instance of the ImportAndExportVisio class.
     * Initializes the internal VisioPackageReader used for VSDX file processing.
     */
    constructor() {
        this.packageReader = new VisioPackageReader();
    }

    /**
     * Exports a Syncfusion Diagram to VSDX format and triggers a file download.
     *
     * Orchestrates the export process by creating a clean context, triggering
     * export events, and delegating to the actual export function.
     *
     * @private
     * @param {Diagram} diagram - The Syncfusion Diagram object to export.
     * @param {VisioExportOptions} [options] - Optional export configuration.
     * @param {string} [options.fileName='diagram.vsdx'] - The name for the downloaded file.
     * @param {string} [options.pageName='Page-1'] - The name of the Visio page to create.
     * @returns {void}
     *
     * @remarks
     * This function:
     * 1. Creates a new ParsingContext for clean state
     * 2. Triggers the 'diagramExporting' event with 'starting' status
     * 3. Cancels if the event is cancelled by subscribers
     * 4. Calls exportToVsdxFile to perform the actual export
     * 5. Triggers the 'diagramExporting' event with 'completed' status
     *
     * @example
     * ```typescript
     * const importer = new ImportAndExportVisio();
     * importer.exportVSDX(diagram, { fileName: 'myDiagram.vsdx', pageName: 'Diagram1' });
     * // Browser download dialog appears
     * ```
     */
    public exportVSDX(diagram: Diagram, options?: VisioExportOptions): void {
        // Create a new, clean context for this parsing operation.
        const context: ParsingContext = new ParsingContext(diagram);
        const args: IExportingEventArgs = { status: 'started' };
        context.triggerEvent('Export', { status: 'started' });

        // Check if export was cancelled by event handlers
        if (args.cancel) {
            return;
        }

        // Perform the actual export
        exportToVsdxFile(diagram, options);
    }

    /**
     * Imports a VSDX file into a Syncfusion Diagram.
     *
     * This is the primary public method for importing Visio files. It orchestrates
     * the entire import pipeline: file reading → package extraction → XML parsing → diagram loading.
     *
     * @private
     * @async
     * @param {File} file - The VSDX file to import (from HTML file input).
     * @param {Diagram} diagram - The Syncfusion Diagram instance to populate.
     * @param {VisioImportOptions} [options] - Optional import configuration.
     * @param {number} [options.pageIndex=0] - Zero-based index of the page to import.
     * @returns {Promise<ImportResult>} - A promise resolving to the import result.
     * @returns {Promise<ImportResult.diagramJson>} - The diagram serialized as JSON string.
     * @returns {Promise<ImportResult.warnings>} - Array of warning messages about unsupported features.
     *
     * @remarks
     * Process Flow:
     * 1. Validates file parameter
     * 2. Triggers 'diagramImporting' event with 'starting' status
     * 3. Reads VSDX file as ArrayBuffer
     * 4. Extracts and parses XML content using VisioPackageReader
     * 5. Parses raw XML into VisioDiagramData model
     * 6. Loads data into Diagram instance
     * 7. Triggers 'diagramImporting' event with 'completed' status
     *
     * Error Handling:
     * - Missing file: Returns error warning
     * - Failed package read: Returns error warning
     * - Any exception: Caught and added to warnings
     *
     * @example
     * ```typescript
     * const importer = new ImportAndExportVisio();
     * const file = document.getElementById('fileInput').files[0];
     * const result = await importer.importVSDX(file, diagram);
     * if (result.warnings.length > 0) {
     *   console.log('Import completed with warnings:', result.warnings);
     * }
     * // Diagram is now populated with Visio data
     * ```
     */
    public async importVSDX(
        file: File,
        diagram: Diagram,
        options?: VisioImportOptions
    ): Promise<ImportResult> {
        // Create a new, clean context for this parsing operation.
        const context: ParsingContext = new ParsingContext(diagram);

        // Validate file parameter
        if (!file) {
            context.addWarning('[ERROR] :: No file provided.');
            return { diagramJson: '', warnings: context.getWarnings() };
        }

        try {
            // Step 1: Read file as ArrayBuffer
            const arrayBuffer: ArrayBuffer = await this.readFileAsArrayBuffer(file);

            // Extract page index from options (defaults to 0)
            const pageIndex: number = (options && typeof options.pageIndex === 'number') ? options.pageIndex : 0;

            // Step 2: Extract and parse XML from VSDX package
            const visioObj: VisioDocumentStructure = await this.packageReader.readPackage(
                arrayBuffer,
                context,
                pageIndex
            );

            // Validate package reading
            if (!visioObj) {
                context.addWarning('[ERROR] :: Failed to read Visio package.');
                return { diagramJson: '', warnings: context.getWarnings() };
            }

            // Store parsed XML structure in context for use during parsing
            context.entries = visioObj;

            // Step 3: Parse raw XML object into clean data model
            const diagramData: VisioDiagramData = await parseVisioData(visioObj, context);

            // Step 4: Load the clean data model into the diagram
            await loadVisioDataIntoDiagram(diagram, diagramData, context);

            // Clear temporary data
            diagramData.clear();

            // Trigger import completed event
            const args: IImportingEventArgs = { status: 'completed', logs: context.getWarnings() };
            context.triggerEvent('Import', args);

            // Serialize diagram to JSON
            const diagramJson: string = JSON.stringify(diagram.saveDiagram());

            return { diagramJson, warnings: context.getWarnings() };
        } catch (error) {
            // Handle any errors during import
            const errorMessage: string = error instanceof Error
                ? error.message
                : 'Unknown error during VSDX import';
            context.addWarning(`[ERROR] :: ${errorMessage}`);
            return { diagramJson: '', warnings: context.getWarnings() };
        }
    }

    /**
     * Reads a File object as an ArrayBuffer.
     * Uses the browser's FileReader API to asynchronously read file contents.
     *
     * @private
     * @param {File} file - The file to read.
     * @returns {Promise<ArrayBuffer>} - A promise that resolves with the file contents as an ArrayBuffer.
     * @throws {Error} - If the file cannot be read or the result is not an ArrayBuffer.
     *
     * @remarks
     * This utility method wraps the FileReader API in a Promise, making it easier
     * to use with async/await syntax.
     *
     * @example
     * ```typescript
     * const file = document.getElementById('fileInput').files[0];
     * const buffer = await this.readFileAsArrayBuffer(file);
     * // buffer is now an ArrayBuffer containing file contents
     * ```
     */
    private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve: (value: ArrayBuffer) => void, reject: (reason?: any) => void) => {
            const reader: FileReader = new FileReader();

            // Called when file reading completes successfully
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to read file as ArrayBuffer'));
                }
            };

            // Called if file reading fails
            reader.onerror = reject;

            // Start reading the file
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Returns the module name.
     *
     * @protected
     * @returns {string} - The module identifier string.
     */
    protected getModuleName(): string {
        return 'ImportAndExportVisio';
    }

    /**
     * Cleans up resources used by this instance.
     * Called when the component is destroyed or no longer needed.
     *
     * @private
     * @returns {void}
     *
     * @remarks
     * Currently a placeholder for future resource cleanup logic.
     * Can be extended to clean up file readers, cached data, etc.
     */
    public destroy(): void {
        // Cleanup logic can be added here if needed.
    }
}

/**
 * Encapsulates the state of a single Visio parsing operation.
 *
 * This context object replaces the need for global state, enabling re-entrant,
 * testable, and cleaner parsing logic. Each import/export operation gets its own
 * context instance to maintain isolated state.
 *
 * @remarks
 * The context maintains:
 * - Reference to the target Diagram instance
 * - Accumulated VisioDiagramData being built during parsing
 * - Shape index counter for internal use
 * - Warning messages collected during parsing
 * - Parsed XML document structure
 *
 * @example
 * ```typescript
 * const context = new ParsingContext(diagram);
 * // ... perform parsing operations ...
 * context.addWarning('Feature X is not supported');
 * const warnings = context.getWarnings();
 * ```
 */
export class ParsingContext {
    /**
     * Reference to the Diagram instance, used for unit conversions and event triggering.
     * @private
     * @readonly
     */
    public readonly diagram: Diagram;

    /**
     * Accumulated data model for the diagram being parsed.
     * Built up during parsing and eventually loaded into the diagram.
     * @private
     * @readonly
     */
    public readonly data: VisioDiagramData = new VisioDiagramData();

    /**
     * Shape index counter used internally during shape processing.
     * Wrapped in an object to allow mutation while maintaining readonly context.
     * @private
     */
    public shapeIndex: { value: number } = { value: 0 };

    /**
     * Parsed XML document structure from the VSDX file.
     * Contains all extracted XML data organized by type.
     * @private
     */
    public entries: VisioDocumentStructure;

    /**
     * Accumulated warning messages collected during parsing.
     * Prevents duplicate warnings.
     * @private
     */
    private warnings: string[] = [];

    /**
     * Creates a new ParsingContext for a specific Diagram instance.
     *
     * @param {Diagram} diagram - The target Diagram instance that will be populated with parsed data.
     */
    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }

    /**
     * Adds a warning message to the context's warning collection.
     * Automatically prevents duplicate warnings by checking if message already exists.
     *
     * @private
     * @param {string} message - The warning message to add.
     * @returns {void}
     *
     * @remarks
     * Warning messages are typically about unsupported Visio features or import limitations.
     * Duplicates are filtered to keep the warning list clean and readable.
     *
     * @example
     * ```typescript
     * context.addWarning('Feature X is not supported in Syncfusion');
     * context.addWarning('Feature X is not supported in Syncfusion'); // Ignored - duplicate
     * ```
     */
    public addWarning(message: string): void {
        // Only add if message doesn't already exist in warnings array
        if (this.warnings.indexOf(message) === -1) {
            this.warnings.push(message);
        }
    }

    /**
     * Retrieves all accumulated warning messages.
     *
     * @private
     * @returns {string[]} - Array of warning messages collected during parsing.
     *
     * @example
     * ```typescript
     * const warnings = context.getWarnings();
     * console.log(`Found ${warnings.length} warnings`);
     * ```
     */
    public getWarnings(): string[] {
        return this.warnings;
    }

    /**
     * Triggers an import or export event on the diagram with current warnings.
     * Delegates to the diagram's event system to notify subscribers of operation status.
     *
     * @private
     * @param {('Import' | 'Export')} type - The type of event to trigger.
     * @param {IImportingEventArgs | IExportingEventArgs} args - Event arguments containing status information.
     * @returns {void}
     *
     * @remarks
     * This method automatically adds accumulated warnings to the event args before triggering.
     * Allows event subscribers to be notified of import/export progress and warnings.
     *
     * @example
     * ```typescript
     * context.triggerEvent('Import', { status: 'starting' });
     * // Later...
     * context.triggerEvent('Import', { status: 'completed' });
     * ```
     */
    public triggerEvent(type: 'Import' | 'Export', args: IImportingEventArgs | IExportingEventArgs): void {
        // Attach warnings to event args if not already present
        if (!args.logs) {
            args.logs = this.getWarnings();
        }

        // Trigger appropriate diagram event
        if (type === 'Import') {
            this.diagram.triggerEvent(DiagramEvent.diagramImporting, args);
        } else {
            this.diagram.triggerEvent(DiagramEvent.diagramExporting, args);
        }
    }

    /**
     * Getter for the currently active page being parsed.
     *
     * @private
     * @returns {VisioPage | undefined} - The current page data or undefined if not set.
     *
     * @remarks
     * Returns the page from the accumulated data model. Used to access page-specific
     * properties during parsing.
     */
    public get currentPage(): VisioPage | undefined {
        return this.data.currentPage;
    }
}

/**
 * Main entry point to parse a raw Visio JavaScript object into a structured data model.
 * Orchestrates the entire parsing process, converting XML into typed data structures.
 *
 * @async
 * @param {VisioDocumentStructure} visioObj - The raw JavaScript object derived from XML conversion.
 * @param {ParsingContext} context - The context instance used for configuration and logging.
 * @returns {Promise<VisioDiagramData>} - A promise resolving to a fully populated VisioDiagramData instance.
 *
 * @remarks
 * Parsing Order:
 * 1. Pages (must be first for pageHeight dependency)
 * 2. Windows (viewport settings)
 * 3. Masters (shape definitions)
 * 4. Document Settings (general configuration)
 * 5. Relationships and Media (images and binaries)
 * 6. Themes (color schemes)
 * 7. Connections (connector relationships)
 * 8. Shapes and Connectors (diagram elements)
 *
 * This function handles:
 * - Parsing of all Visio document components
 * - Conversion of binary image data to base64 data URLs
 * - Relationship mapping between elements
 * - Theme application
 * - Connection establishment
 *
 * @example
 * ```typescript
 * const visioObj = await packageReader.readPackage(arrayBuffer, context);
 * const diagramData = await parseVisioData(visioObj, context);
 * // diagramData now contains all parsed diagram information
 * ```
 */
export async function parseVisioData(visioObj: VisioDocumentStructure, context: ParsingContext): Promise<VisioDiagramData> {
    /**
     * Helper function to safely extract string attributes from objects.
     * @param {object} obj - The object to extract from
     * @param {string} name - The attribute name
     * @returns {string} - The attribute value or empty string if not found
     */
    function getAttr(obj: { [k: string]: string[] } | undefined, name: string): string {
        if (obj && Object.prototype.hasOwnProperty.call(obj, name)) {
            const v: any = obj[`${name}`];
            if (typeof v === 'string') {
                return v;
            }
        }
        return '';
    }

    /**
     * Helper function to extract relationship ID from a page element.
     * Handles both namespaced (r:id) and non-namespaced (rId) formats.
     * @param {VisioPage} page - The page element
     * @returns {string} - The relationship ID
     */
    function getRelId(page: VisioPage | VisioPageContent): string {
        if (page) {
            const maybeRel: { $?: { [k: string]: string[] } } = (page as { Rel?: { $?: { [k: string]: string[] } } }).Rel;
            if (maybeRel && maybeRel.$) {
                const rid: string = getAttr(maybeRel.$, 'r:id');
                if (rid) {
                    return rid;
                }
                const ridAlt: string = getAttr(maybeRel.$, 'rId'); // some parsers drop namespace colon
                if (ridAlt) {
                    return ridAlt;
                }
            }
        }
        return '';
    }

    /**
     * Helper function to check if a target path represents a media file.
     * @param {string} target - The target file path
     * @returns {boolean} - True if target is a media file
     */
    function isMediaFile(target: string): boolean {
        const mediaExtensions: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.tif', '.tiff', '.webp'];
        const lowerTarget: string = target.toLowerCase();
        return mediaExtensions.some((ext: string) => lowerTarget.endsWith(ext));
    }

    /**
     * Helper function to extract file name from a full path.
     * @param {string} target - The full file path
     * @returns {string} - The extracted file name
     */
    function extractFileName(target: string): string {
        return target.split('/').pop() || 'unknown';
    }

    /**
     * Helper function to get MIME type from file extension.
     * @param {string} target - The file path with extension
     * @returns {string} - The appropriate MIME type
     */
    function getMimeType(target: string): string {
        const mimeTypes: { [key: string]: string } = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.svg': 'image/svg+xml',
            '.tif': 'image/tiff',
            '.tiff': 'image/tiff',
            '.webp': 'image/webp'
        };

        const ext: string = target.substring(target.lastIndexOf('.')).toLowerCase();
        return mimeTypes[`${ext}`] || 'application/octet-stream';
    }

    /**
     * Helper function to convert Uint8Array to base64 data URL in browser environment.
     * Uses FileReader and Blob for conversion.
     * @async
     * @param {Uint8Array} u8 - The binary data
     * @param {string} mime - The MIME type
     * @returns {Promise<string>} - Base64-encoded string
     */
    async function uint8ToBase64Browser(u8: Uint8Array, mime: string): Promise<string> {
        const blob: Blob = new Blob([u8], { type: mime });
        const base64: string = await new Promise<string>((resolve: (arg0: string) => void,
                                                          reject: (this: FileReader, ev: ProgressEvent) => any) => {
            const reader: FileReader = new FileReader();
            reader.onload = () => {
                const dataUrl: string = reader.result as string;
                // Extract base64 portion after the comma
                const base64: string = dataUrl.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return base64;
    }

    // ========================================
    // PARSE PAGES (must be done before shapes)
    // ========================================
    // Pages must be parsed first because other elements depend on pageHeight
    if (visioObj.Page) {
        const pages: VisioPageContent[] = ensureArray(visioObj.Page) as VisioPageContent[];

        // Filter pages matching the currently selected relationship ID
        const matchingPages: VisioPageContent[] = pages.filter((pageEl: VisioPageContent) => {
            const pageRelId: string = getRelId(pageEl);
            return pageRelId === visioObj.PageRelId;
        });

        // Parse each matching page
        context.data.pages = ensureArray(matchingPages).map((pageEl: VisioPageContent) => {
            // Append essential attributes to PageSheet for easier access during parsing
            const cells: VisioCell[] = ensureArray(pageEl.PageSheet.Cell);
            cells.push({ $: { 'N': 'PageID', 'V': pageEl.$.ID } });

            // Add BackPage attribute if present
            if (pageEl.$.BackPage) {
                cells.push({ $: { 'N': 'BackPage', 'V': pageEl.$.BackPage } });
            }

            // Add Background attribute if present
            if (pageEl.$.Background) {
                cells.push({ $: { 'N': 'Background', 'V': pageEl.$.Background } });
            }

            pageEl.PageSheet.Cell = cells;

            return parseVisioPage(pageEl.PageSheet);
        });

        // Set first page as current page
        if (context.data.pages.length > 0) {
            context.data.currentPage = context.data.pages[0];
        }
    }

    // ========================================
    // PARSE MASTERS
    // ========================================
    if (visioObj.Master) {
        context.data.masters = ensureArray(visioObj.Master).map((masterEl: MasterElement) => parseVisioMaster(masterEl));
    }

    // ========================================
    // PARSE DOCUMENT SETTINGS
    // ========================================
    if (visioObj.DocumentSettings) {
        context.data.documentSettings = parseVisioDocumentSettings(visioObj.DocumentSettings as unknown as DocumentSettingsElement);
    }

    // ========================================
    // PARSE WINDOWS
    // ========================================
    if (visioObj.Window) {
        context.data.windows = ensureArray(visioObj.Window).map((winEl: WindowRootElement) => parseVisioWindow(winEl));
    }

    // ========================================
    // PARSE RELATIONSHIPS AND MEDIA
    // ========================================
    if (visioObj.Relationship) {
        // Normalize relationships to array
        const relationArr: ParsedXmlObject[] = Array.isArray(visioObj.Relationship) ? visioObj.Relationship : [visioObj.Relationship];

        // Parse each relationship
        const relations: VisioRelationship[] = relationArr
            .map((relationObj: VisioRelationship) => parserVisioRelationship(relationObj as unknown as OneOrMany<XmlRelationship>))
            .filter((rel: VisioRelationship): rel is VisioRelationship => rel !== null);
        context.data.relations.push(...relations);

        // Process binary image data and convert to base64 data URLs
        if (context.entries.__BinaryParts) {
            for (const relationObj of context.data.relations) {
                for (const mediaObj of relationObj.media) {
                    // Check if the relationship points to a media file
                    if (mediaObj.Target && isMediaFile(mediaObj.Target)) {
                        // Construct binary key for lookup
                        let binaryKey: string = mediaObj.Target;
                        if (binaryKey.startsWith('../')) {
                            // Convert relative path to absolute path within VSDX
                            binaryKey = 'visio/' + binaryKey.slice(3);
                        }

                        // Retrieve binary data
                        const binaryData: Uint8Array = context.entries.__BinaryParts[`${binaryKey}`];

                        if (binaryData) {
                            // Create media object with binary data
                            const media: VisioMedia = {
                                id: mediaObj.Id,
                                name: extractFileName(mediaObj.Target),
                                type: getMimeType(mediaObj.Target),
                                data: binaryData
                            };

                            // Convert binary to base64 data URL
                            const base64: string = await uint8ToBase64Browser(media.data, media.type);
                            media.dataUrl = `data:${media.type};base64,${base64}`;

                            // Store in context media collection
                            context.data.medias[mediaObj.Id] = media;
                        }
                    }
                }
            }
        }
    }

    // ========================================
    // PARSE THEMES
    // ========================================
    if (visioObj['a:themeElements']) {
        // Parse all theme elements
        context.data.themes = ensureArray(visioObj['a:themeElements']).map((themeEl: ThemeElements) => parseVisioTheme(themeEl as unknown as ThemeElements, context));

        // Find and set the current theme based on page theme reference
        const currentPage: VisioPage = context.data.currentPage;
        const currentTheme: VisioTheme = context.data.themes.find((theme: VisioTheme) => currentPage.theme === Number(theme.schemeEnum));
        context.data.currentTheme = currentTheme;
    }

    // ========================================
    // PARSE CONNECTIONS
    // ========================================
    // Connections define which shapes are connected to connectors
    if (visioObj.Connects && Object.keys(visioObj.Connects).length > 0) {
        const connectsArr: ParsedXmlObject[] = Array.isArray(visioObj.Connects) ? visioObj.Connects : [visioObj.Connects];
        const connections: VisioConnections[] = [];

        // Parse each connection
        for (const connectObj of connectsArr) {
            connections.push(...VisioConnections.fromJs(connectObj, context));
        }
        context.data.connections.push(...connections);
    }

    // ========================================
    // PARSE SHAPES AND CONNECTORS
    // ========================================
    if (visioObj.Shapes) {
        const shapesArr: ParsedXmlObject[] = Array.isArray(visioObj.Shapes) ? visioObj.Shapes : [visioObj.Shapes];
        const shapes: VisioShape[] = [];

        // Parse all shapes first
        for (const shapeObj of shapesArr) {
            shapes.push(...parserVisioShape(shapeObj, context));
        }

        // Filter out empty shapes
        const nonEmptyShapes: VisioShape[] = shapes.filter(
            (shape: VisioShape) =>
                (Array.isArray(shape) && shape.length > 0) ||
                (shape && typeof shape === 'object' && Object.keys(shape).length > 0 && !Array.isArray(shape))
        );

        // Add non-empty shapes to context
        if (nonEmptyShapes.length > 0) {
            context.data.shapes.push(...nonEmptyShapes);
        }

        // Validate that at least one page exists
        if (context.data.pages.length === 0) {
            return undefined;
        }

        // Parse connectors from shapes
        const connectors: VisioConnector[] = [];
        for (const connectorObj of shapesArr) {
            connectors.push(...VisioConnector.fromJs(connectorObj, context));
        }
        context.data.connectors.push(...connectors);
    }

    return context.data;
}


/**
 * Loads a parsed and clean VisioDiagramData model into a Syncfusion Diagram instance.
 * This is the final step in the import pipeline, converting data structures to diagram elements.
 *
 * @async
 * @param {Diagram} diagram - The Syncfusion diagram instance to populate.
 * @param {VisioDiagramData} diagramData - The clean, parsed Visio diagram data model.
 * @param {ParsingContext} context - Reference to the ParsingContext for utility methods and logging.
 * @returns {Promise<void>} - Resolves when the diagram has been fully populated and rendered.
 *
 * @remarks
 * This function performs:
 * 1. Diagram initialization and clearing
 * 2. Page settings configuration (dimensions, orientation, background)
 * 3. Snap settings and grid configuration
 * 4. Layer setup and management
 * 5. Node conversion and addition
 * 6. Connector binding and addition
 * 7. Expanded subprocess processing (for BPMN)
 * 8. Active layer activation
 *
 * @example
 * ```typescript
 * await loadVisioDataIntoDiagram(diagram, diagramData, context);
 * // Diagram is now fully populated with all shapes and connectors
 * ```
 */
export async function loadVisioDataIntoDiagram(
    diagram: Diagram,
    diagramData: VisioDiagramData,
    context: ParsingContext
): Promise<void> {
    // Store diagram's additional info before clearing
    const info: DiagramAddInfo = diagram.addInfo as DiagramAddInfo;

    // Clear existing diagram content
    diagram.clear();
    diagram.addInfo = info;

    // Extract shape group from diagram data
    const shapeGroup: VisioShape[] = diagramData.shapes;

    // Validate that pages exist
    if (diagramData.pages.length === 0) {
        context.addWarning('[ERROR] :: No Visio pages found in the imported file.');
        return;
    }

    // Get DPI for coordinate conversion
    const DPI: number = UNIT_CONVERSION.SCREEN_DPI;

    // Filter to find non-background pages and use first one
    const nonBgPages: VisioPage[] = diagramData.pages.filter((p: VisioPage) => !p.isBackgroundPage);
    const currentPage: VisioPage = (nonBgPages.length > 0 ? nonBgPages : diagramData.pages)[0];

    // Find background shape if it exists
    const solidShape: VisioShape = shapeGroup.find((s: VisioShape) => s.name === 'Solid');

    // Create default window settings as fallback
    const defaultWindow: VisioWindow = new VisioWindow();
    defaultWindow.windowWidth = currentPage.pageWidth * DPI;
    defaultWindow.windowHeight = currentPage.pageHeight * DPI;
    defaultWindow.showPageBreaks = false;
    defaultWindow.showGrid = false;
    defaultWindow.showGuides = false;
    defaultWindow.viewCenterX = 0;
    defaultWindow.viewCenterY = 0;
    defaultWindow.snapExtensions = 8;
    defaultWindow.snapAngles = 15;
    defaultWindow.showRulers = false;

    // Get window settings or use defaults
    const windowSettings: VisioWindow = diagramData.windows.find((w: VisioWindow) => w.windowType === 'Drawing') || defaultWindow;

    // Configure diagram dimensions and appearance
    diagram.backgroundColor = solidShape ? solidShape.fillColor || 'transparent' : 'transparent';
    diagram.enableConnectorSplit = true;

    // Configure page settings
    diagram.pageSettings.width = currentPage.pageWidth * DPI;
    diagram.pageSettings.height = currentPage.pageHeight * DPI;
    diagram.pageSettings.background.color = solidShape ? solidShape.fillColor || 'transparent' : 'transparent';
    diagram.pageSettings.showPageBreaks = windowSettings.showPageBreaks;
    diagram.pageSettings.orientation = currentPage.printPageOrientation === 2 ? 'Landscape' : 'Portrait';

    // Configure snap settings
    diagram.snapSettings.constraints = SnapConstraints.None;
    if (windowSettings.showGrid && (diagram.pageSettings.background.color === 'transparent')) {
        diagram.snapSettings.constraints |= SnapConstraints.ShowLines | SnapConstraints.SnapToLines;
    }
    if (windowSettings.showGuides) {
        diagram.snapSettings.constraints |= SnapConstraints.SnapToObject;
    }

    // Set snap object distance and angles
    diagram.snapSettings.snapObjectDistance = windowSettings.snapExtensions || 8;
    diagram.snapSettings.snapAngle = windowSettings.snapAngles || 15;

    // Configure bridging (line jumps)
    setBridgingConstraints(diagram, currentPage, context);

    // Configure ruler settings
    diagram.rulerSettings.showRulers = windowSettings.showRulers || false;
    diagram.rulerSettings.dynamicGrid = diagramData.documentSettings ? diagramData.documentSettings.dynamicGridEnabled : false;

    // Configure scroll settings
    diagram.scrollSettings.horizontalOffset = windowSettings.viewCenterX || 0;
    diagram.scrollSettings.verticalOffset = windowSettings.viewCenterY || 0;
    diagram.scrollSettings.viewPortWidth = windowSettings.windowWidth || 0;
    diagram.scrollSettings.viewPortHeight = windowSettings.windowHeight || 0;

    // Configure layers
    diagram.layers = currentPage.layers.map((layer: VisioLayer, i: number) => ({
        id: layer.name || `layer${i}`,
        visible: layer.visible,
        lock: layer.lock,
        zIndex: i,
        objects: layer.objects
    }));

    // ========================================
    // PROCESS SHAPES AND CONNECTORS
    // ========================================

    // Get collection of expanded subprocesses
    const expandedSubprocess: string[] = diagramData.expandedSubprocessCollection;

    // Process shapes and add to diagram
    if (shapeGroup && Array.isArray(shapeGroup) && shapeGroup.length > 0) {
        // Process expanded subprocesses first (for BPMN hierarchy)
        expandedSubprocess.forEach((subprocessID: string) => {
            processExpandedSubprocesses(subprocessID, shapeGroup, context);
        });

        // Convert each shape to a node and add to diagram
        shapeGroup.forEach((shapeItem: VisioShape) => {
            // Skip Solid background shape and special BPMN shapes
            if (shapeItem.name !== 'Solid') {
                if ((shapeItem.shape && (shapeItem as VisioShapeData).shape.type !== 'Member')
                    && (shapeItem.shape && (shapeItem as VisioShapeData).shape.type !== 'Separator')) {
                    // Convert Visio shape to Syncfusion node
                    const node: NodeModel = convertVisioShapeToNode(shapeItem, context, shapeGroup);

                    // Log warning for BPMN shapes (visual differences expected)
                    if ((node.shape as BpmnShapeModel).type === 'Bpmn') {
                        context.addWarning('[WARNING] :: BPMN shapes visually differ from visio.');
                    }

                    // Add node to diagram
                    diagram.nodes.push(node);
                }
            }
        });
    }

    // Add connectors to diagram
    if (diagramData.connectors && diagramData.connectors.length > 0) {
        diagramData.connectors.forEach((connector: VisioConnector) => {
            // Skip empty connector objects
            if (connector && Object.keys(connector).length > 0) {
                // Bind Visio connector to Syncfusion format
                const conn: ConnectorModel = bindVisioConnectors(connector, context);
                diagram.connectors.push(conn);
            }
        });
    }

    // Add warning about gradient limitations
    context.addWarning('[WARNING] :: Gradients are only supported on connector decorators, not the full connector path.');

    // Save and reload diagram to apply all changes
    const data: string = diagram.saveDiagram();
    diagram.loadDiagram(data);

    // Activate the active layer if one was marked
    const activeLayer: VisioLayer = currentPage.layers.find((l: VisioLayer) => l.active);
    if (activeLayer && activeLayer.name) {
        diagram.setActiveLayer(activeLayer.name);
    }
}

/**
 * Processes expanded BPMN subprocesses and updates parent-child relationships.
 * Handles hierarchical subprocess structures and calculates child margins.
 *
 * @private
 * @param {string} parentId - The ID of the parent subprocess shape
 * @param {VisioShape[]} shapeGroup - Array of all shapes in the diagram
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {void}
 *
 * @remarks
 * Algorithm:
 * 1. Finds the parent subprocess by ID
 * 2. Validates that it's a BPMN expanded subprocess
 * 3. Filters out grandchildren to keep only immediate children
 * 4. Calculates margin positions for each child relative to parent
 *
 * This ensures proper hierarchy display for nested BPMN processes.
 *
 * @example
 * ```typescript
 * processExpandedSubprocesses('shape1', shapes, context);
 * // Updates shape1's child processes and calculates their margins
 * ```
 */
function processExpandedSubprocesses(parentId: string, shapeGroup: any[], context: ParsingContext): void {
    // Validate parameters
    if (!parentId || !Array.isArray(shapeGroup) || shapeGroup.length === 0) {
        return;
    }

    // Cache for shape lookups to improve performance
    const cache: ShapeCache = {};

    /**
     * Helper function to find shape by ID with caching
     * @param {string} id - The shape ID to find
     * @returns {VisioShapeData} The found shape or undefined
     */
    const findById: (id: string) => VisioShape | VisioShapeData = (id: string) => {
        if (cache[`${id}`]) {
            return cache[`${id}`];
        }
        const found: VisioShape | VisioShapeData = shapeGroup.find((s: VisioShape | VisioShapeData) => s && String(s.id) === id);
        if (found) {
            cache[`${id}`] = found as VisioShapeData;
        }
        return found;
    };

    // Find parent shape
    const parent: VisioShape | VisioShapeData = findById(parentId);
    if (!parent) {
        return;
    }

    // Validate parent is a BPMN expanded subprocess
    const isBpmn: boolean = parent.shape && parent.shape.type === 'Bpmn';
    const isExpanded: boolean = !!(parent.shape && (parent.shape as BPMNActivityShape).activity
                                   && (parent.shape as BPMNActivityShape).activity.subProcess);
    if (!isBpmn || !isExpanded) {
        return;
    }

    // Get original child list
    const originalChildren: string[] = ((parent.shape as BPMNActivityShape).activity.subProcess.processes as string[] || []).slice();
    if (originalChildren.length === 0) {
        return;
    }

    // Convert parent dimensions from inches to pixels
    const parentPxW: number = parent.width * UNIT_CONVERSION.SCREEN_DPI;
    const parentPxH: number = parent.height * UNIT_CONVERSION.SCREEN_DPI;

    // Calculate parent position in pixels
    const parentLeft: number = (parent.offsetX * UNIT_CONVERSION.SCREEN_DPI) - parentPxW / 2;
    const parentTop: number = parent.offsetY - parentPxH / 2;

    // Find all grandchildren to exclude from immediate children
    const grandchildrenSet: Set<string> = new Set<string>();
    originalChildren.forEach((childId: string): void => {
        const child: VisioShape | VisioShapeData = findById(childId);
        if (child && child.shape && (child.shape as BPMNActivityShape).activity
            && (child.shape as BPMNActivityShape).activity.subProcess) {
            // Collect all grandchildren
            ((child.shape as BPMNActivityShape).activity.subProcess.processes
             || []).forEach((gcId: string) => grandchildrenSet.add(String(gcId)));
        }
    });

    // Filter to get only immediate children (exclude grandchildren and connectors)
    const immediateChildIDs: string[] = originalChildren.filter((childId: string) => {
        const child: any = findById(childId);
        return child !== undefined && !grandchildrenSet.has(String(childId));
    });
    (parent.shape as BPMNActivityShape).activity.subProcess.processes = immediateChildIDs;

    // Calculate margins for each immediate child
    immediateChildIDs.forEach((childId: string): void => {
        const child: VisioShape | VisioShapeData = findById(childId);
        if (child) {
            // Convert child dimensions from inches to pixels
            const childPxW: number = child.width * UNIT_CONVERSION.SCREEN_DPI;
            const childPxH: number = child.height * UNIT_CONVERSION.SCREEN_DPI;

            // Calculate child position in pixels
            const childLeft: number = (child.offsetX * UNIT_CONVERSION.SCREEN_DPI) - childPxW / 2;
            const childTop: number = child.offsetY - childPxH / 2;

            // Calculate margin relative to parent
            (child as VisioShapeData).calculatedMargin = {
                left: childLeft - parentLeft,
                top: childTop - parentTop
            };
        }
    });
}

/**
 * Helper function to set bridging constraints on the diagram.
 * Configures line jump (bridging) behavior based on Visio page settings.
 *
 * @private
 * @param {Diagram} diagram - The diagram instance to configure
 * @param {VisioPage} page - The Visio page containing bridging settings
 * @param {ParsingContext} context - Parsing context for logging warnings
 * @returns {void}
 *
 * @remarks
 * Line bridging (line jumps) allows connector lines to display bridges where they cross.
 * - Value 0: No bridging
 * - Value 1: Top bridging style
 * - Value 2: Left bridging style
 *
 * Note: Syncfusion only supports arc style with horizontal/top directions.
 * Other Visio bridging styles are approximated.
 *
 * @example
 * ```typescript
 * setBridgingConstraints(diagram, page, context);
 * // Enables bridging if page.bridging !== 0
 * ```
 */
function setBridgingConstraints(diagram: Diagram, page: VisioPage, context: ParsingContext): void {
    // Get line jump value from page
    const lineJumpValue: number = page.bridging;

    // Apply bridging if enabled
    if (lineJumpValue !== 0) {
        // Add warning about limited bridging support
        context.addWarning('[WARNING] :: Only arc line jump style is supported.');
        context.addWarning('[WARNING] :: Only horizontal line jumps are supported.');

        // Enable bridging constraint on diagram
        diagram.constraints |= DiagramConstraints.Bridging;

        // Set bridge direction based on line jump value
        // 2 = Left, otherwise = Top
        diagram.bridgeDirection = lineJumpValue === 2 ? 'Left' : 'Top';
    }
}

/**
 * Defines options to customize Visio import behavior.
 * @interface VisioImportOptions
 */
export interface VisioImportOptions {
    /**
     * The zero-based index of the Visio page to import.
     * If multiple pages exist, use this to select which page to load.
     * @default 0
     * @type {number}
     * @example
     * ```typescript
     * { pageIndex: 1 } // Import the second page
     * ```
     */
    pageIndex?: number;
}

/**
 * Defines options to customize Visio export behavior.
 * @interface VisioExportOptions
 */
export interface VisioExportOptions {
    /**
     * The name of the exported `.vsdx` file.
     * Used as the filename when downloading the exported diagram.
     * @default "diagram.vsdx"
     * @type {string}
     * @example
     * ```typescript
     * { fileName: 'myDiagram.vsdx' }
     * ```
     */
    fileName?: string;

    /**
     * The name of the Visio page to create during export.
     * Appears as the page name in the exported Visio file.
     * @default "Page-1"
     * @type {string}
     * @example
     * ```typescript
     * { pageName: 'My Diagram' }
     * ```
     */
    pageName?: string;
}

/**
 * Result of a Visio import operation.
 * Contains the serialized diagram data and any warnings encountered during import.
 * @interface ImportResult
 */
export interface ImportResult {
    /**
     * The Syncfusion DiagramModel serialized as a JSON string.
     * Can be used with diagram.loadDiagram() to restore the state.
     * @type {string}
     * @example
     * ```typescript
     * const result = await importer.importVSDX(file, diagram);
     * diagram.loadDiagram(result.diagramJson);
     * ```
     */
    diagramJson: string;

    /**
     * Array of human-readable warning messages about unsupported features.
     * Includes limitations encountered during the import process.
     * Examples: gradients, BPMN shape differences, line styles, etc.
     * @type {string[]}
     * @example
     * ```typescript
     * const result = await importer.importVSDX(file, diagram);
     * console.log(result.warnings); // Log all warnings to user
     * ```
     */
    warnings: string[];
}

// src/diagram/load-utility/visio-import-export/visio-model-parsers.ts
import {
    calculateShadowProperties,
    ensureArray,
    extractGradientStops,
    findCellValue,
    getCellMapBooleanValue,
    getCellMapNumericValue,
    getCellMapStringValue,
    getGradientVectorByAngle,
    getRadialGradient,
    isObject,
    mapCellValues,
    parseNumberCell,
    safeNumber,
    toBoolean
} from './visio-core';
import { ParsingContext } from './visio-import-export';
import {
    VisioDocumentSettings,
    VisioLayer,
    VisioMaster,
    VisioNodeShadow,
    VisioNodeStyle,
    VisioPage,
    VisioRelationship,
    VisioShape,
    VisioTheme,
    VisioWindow
} from './visio-models';
import {
    CellMapValue,
    ColorModifiers,
    ColorRef,
    DocumentSettingsElement,
    FmtScheme,
    FontProps,
    FontScheme,
    LineStyleList,
    MasterElement,
    MasterDefaultValues, // Added for setDefaultData and parseVisioNodeStyle
    OneOrMany,
    OrderEntry, // Added for buildFmtSchemeFill/Stroke
    ParsedXmlObject,
    ProcessedColor,
    ShapeAttributes,
    VisioShapeNode, // Added for getVisioPorts and parseVisioNodeStyle
    ThemeColorScheme,
    ThemeElements,
    ThemeExtList,
    ThemeExtension,
    VarientStyle,
    VariationClrScheme,
    VariationColor,
    VariationStyleScheme,
    VisioCell,
    VisioCellValue,
    VisioPageSheet,
    VisioPort,
    VisioRow,
    VisioSection,
    WindowElement,
    WindowRootElement,
    XmlRelationship, // Added for parserVisioRelationship
    FontStyles,
    ColorReferenceArray,
    LineStyleRef,
    TransformedColorRef,
    RawColorValue,
    FmtConnectorScheme,
    FillStyleList,
    SolidFill,
    LineStyleEntry,
    LineStyles,
    FmtConnectorSchemeLineStyles,
    ConnectorLineStyle,
    FmtSchemeLineStyles,
    SchemeLineStyle,
    VarientStyleAttributes,
    SchemeColor,
    StrokeItem,
    StrokeAttributes,
    RgbColor,
    VisioStyleSheet
} from './visio-types';

import { resolveMasterSourceForNode } from './visio-nodes';
import { isValidColor } from './visio-theme';

/**
 * Finds the default master data for a given shape from its master ID.
 * This function searches through a collection of master shape definitions to locate
 * the master that corresponds to the given shape's master ID attribute.
 *
 * @param {MasterDefaultValues[]} defaultDataValue - The collection of all master shape definitions, each with a masterID property.
 * @param {ShapeAttributes} attributes - The attributes of the current shape, containing the Master property with the master ID reference.
 * @returns {MasterDefaultValues} The default data object containing shape properties (dimensions, pins, geometry, ports, styles, etc.)
 *                or an empty object if no matching master is found.
 *
 * @example
 * const defaultData = setDefaultData(allMasters, shapeAttributes);
 * const width = defaultData.Width; // Shape width from master definition
 *
 * @private
 */
export function setDefaultData(defaultDataValue: any[], attributes: ShapeAttributes): MasterDefaultValues  {
    const defaultData: MasterDefaultValues | undefined = defaultDataValue.find(
        (obj: MasterDefaultValues) => obj.masterID === attributes.Master
    );

    if (!defaultData) {
        return {};
    }

    // Build a normalized object containing all relevant shape properties from the master definition
    const defaultValues: MasterDefaultValues = {
        Width: defaultData.Width,
        Height: defaultData.Height,
        LocPinX: defaultData.LocPinX,
        LocPinY: defaultData.LocPinY,
        Name: defaultData.shapeName,
        beginX: defaultData.beginX,
        beginY: defaultData.beginY,
        endX: defaultData.endX,
        endY: defaultData.endY,
        N: 'Geometry',
        Row: defaultData.Row,
        Ports: defaultData.ports,
        shapeStyle: defaultData.shapeStyle,
        txtWidth: defaultData.txtWidth,
        txtHeight: defaultData.txtHeight,
        txtPinX: defaultData.txtPinX,
        txtPinY: defaultData.txtPinY,
        txtLocalPinX: defaultData.txtLocalPinX,
        txtLocalPinY: defaultData.txtLocalPinY,
        QuickStyleLineColor: defaultData.QuickStyleLineColor,
        QuickStyleFillColor: defaultData.QuickStyleFillColor,
        QuickStyleShadowColor: defaultData.QuickStyleShadowColor,
        QuickStyleFontColor: defaultData.QuickStyleFontColor,
        QuickStyleLineMatrix: defaultData.QuickStyleLineMatrix,
        QuickStyleFillMatrix: defaultData.QuickStyleFillMatrix,
        QuickStyleEffectsMatrix: defaultData.QuickStyleEffectsMatrix,
        QuickStyleFontMatrix: defaultData.QuickStyleFontMatrix
    };
    return defaultValues;
}

/**
 * Extracts connection points (ports) from a Visio shape definition.
 * Parses the Connection section from the raw shape XML object to identify all ports
 * where connectors can attach. Adjusts port Y-coordinates based on shape height.
 *
 * @param {VisioShapeNode} shape - The raw shape object from the parsed XML, containing Section and Cell data.
 * @param {MasterDefaultValues} [defaultData] - Optional default data from the shape's master definition containing pre-computed port positions.
 * @param {number} [width] - Optional node width measurement that may override calculated shape width.
 * @param {number} [height] - Optional node height measurement that may override calculated shape height.
 * @returns {VisioPort[]} An array of VisioPort objects with id, coordinates (x, y), direction vectors (dirX, dirY),
 *                        port type, auto-generation flag, and prompt text. Returns empty array if no Connection section exists.
 *
 * @example
 * const ports = getVisioPorts(shapeData, masterData, 100);
 * ports.forEach(port => console.log(`Port ${port.id} at (${port.x}, ${port.y})`));
 *
 * @private
 */
export function getVisioPorts(shape: VisioShapeNode, defaultData?: MasterDefaultValues, width?: number, height?: number): VisioPort[] {
    const ports: VisioPort[] = [];

    // Return empty array if shape has no Section element
    if (!shape.Section) { return ports; }

    const defaultMap: Record<string, VisioPort> = {};
    if (defaultData && defaultData.Ports && defaultData.Ports.length) {
        for (const p of defaultData.Ports) {
            if (p.id) {
                defaultMap[p.id] = p;
            }
        }
    }

    // Normalize Section to array format
    const sections: VisioSection[] = ensureArray(shape.Section);

    // Find the Connection section which contains port definitions
    const connSection: VisioSection | undefined = sections.find((s: VisioSection) => s && s.$ && s.$.N === 'Connection');
    if (!connSection || !connSection.Row) { return ports; }

    // Normalize rows to array format
    const rows: VisioRow[] = ensureArray(connSection.Row);

    // Process each row to extract port properties
    rows.forEach((row: VisioRow) => {
        if (row.$ && row.$.T === 'Connection') {
            const id: string | undefined = row.$.IX;

            const cells: VisioCell[] = ensureArray(row.Cell);

            // Initialize port with default values
            const port: VisioPort = {
                id: `port${id}`,
                x: 0, y: 0,
                dirX: 0, dirY: 0,
                type: 0, autoGen: 0, prompt: ''
            };

            // Use default port data if available from master definition
            const def: VisioPort | undefined = defaultMap[port.id];
            if (def) {
                port.x = def.x;
                port.y = def.y;
            }

            // Parse cell properties for this port
            cells.forEach((cell: VisioCell) => {
                const name: string = cell.$.N;
                const value: string = cell.$.V as string; // Assert V to string for parseFloat/parseInt

                // Map cell names to port properties
                switch (name) {
                case 'X': port.x = (parseFloat(value)) / width; break;
                case 'Y':
                    // Invert Y coordinate based on shape height (Visio origin is bottom-left)
                    port.y =  (height - parseFloat(value)) / height;
                    break;
                case 'DirX': port.dirX = parseFloat(value); break;
                case 'DirY': port.dirY = parseFloat(value); break;
                case 'Type': port.type = parseInt(value, 10); break;
                case 'AutoGen': port.autoGen = parseInt(value, 10); break;
                case 'Prompt': port.prompt = value; break;
                }
            });

            ports.push(port);
        }
    });

    return ports;
}

/**
 * Helper function to read child value objects with strict typing.
 * Safely extracts the 'value' property from a cell object located at a specific key
 * in the parent object, with multiple levels of null/undefined checking.
 *
 * @param {ParsedXmlObject} parent - The parent object that may contain the keyed child object.
 * @param {string} key - The property name to read from the parent (e.g., 'GlueSettings').
 * @returns {string | undefined} The child object's 'value' property as a string, or undefined if not present or parent is null.
 *
 * @example
 * const glueValue = readCellValue(documentSettings, 'GlueSettings'); // Returns "1" or undefined
 *
 * @private
 */
function readCellValue(parent: ParsedXmlObject, key: string): string | undefined {
    if (!parent) { return undefined; }

    // Access the cell object by key
    const cell: VisioCellValue | undefined = parent[`${key}`] as VisioCellValue | undefined; // Added type assertion
    if (!cell) { return undefined; }

    // Extract and return the value property
    if (typeof cell.value === 'undefined') { return undefined; }
    return cell.value;
}

/**
 * Parses document-level settings from the DocumentSettings XML element.
 * Extracts configuration values for glue behavior, snap settings, grid options,
 * and document protection flags from the parsed Visio XML structure.
 *
 * @param {any} obj - The source DocumentSettings element from the parsed VSDX file.
 * @returns {VisioDocumentSettings} A populated VisioDocumentSettings instance with parsed numeric, boolean,
 *                                  and configuration values. Returns a new empty instance if input is null/undefined.
 *
 * @example
 * const settings = parseVisioDocumentSettings(docSettingsElement);
 * console.log(settings.glueSettings); // 0-3 (connection behavior)
 * console.log(settings.dynamicGridEnabled); // true or false
 *
 * @private
 */
export function parseVisioDocumentSettings(obj: any): VisioDocumentSettings {
    const settings: VisioDocumentSettings = new VisioDocumentSettings();
    if (!obj) { return settings; }

    // Parse numeric settings (default to 0 if not found)
    settings.glueSettings = parseNumberCell(readCellValue(obj, 'GlueSettings'), 0);
    settings.snapSettings = parseNumberCell(readCellValue(obj, 'SnapSettings'), 0);
    settings.snapExtensions = parseNumberCell(readCellValue(obj, 'SnapExtensions'), 0);
    settings.snapAngles = parseNumberCell(readCellValue(obj, 'SnapAngles'), 0);

    // Parse boolean settings (default to false if not found)
    settings.dynamicGridEnabled = toBoolean(readCellValue(obj, 'DynamicGridEnabled'), false);
    settings.protectStyles = toBoolean(readCellValue(obj, 'ProtectStyles'), false);
    settings.protectShapes = toBoolean(readCellValue(obj, 'ProtectShapes'), false);
    settings.protectMasters = toBoolean(readCellValue(obj, 'ProtectMasters'), false);
    settings.protectBkgnds = toBoolean(readCellValue(obj, 'ProtectBkgnds'), false);

    return settings;
}

/**
 * Parses a Visio master shape definition from the XML element.
 * Extracts master metadata including ID, name, type, and keywords from the
 * master element's attributes and PageSheet cell data.
 *
 * @param {MasterElement} obj - The source master element from the VSDX (includes $ attributes and optional PageSheet).
 * @returns {VisioMaster} A populated VisioMaster instance containing id, name, shapeType, and shape keywords.
 *                        Returns an empty instance if input is null or missing attributes.
 *
 * @example
 * const master = parseVisioMaster(masterElement);
 * console.log(`Master: ${master.name} (${master.id})`);
 * console.log(`Type: ${master.shapeType}`);
 *
 * @private
 */
export function parseVisioMaster(obj: MasterElement): VisioMaster {
    const master: VisioMaster = new VisioMaster();
    if (!obj || !obj.$) { return master; }

    // Extract PageSheet cells if present
    const pageSheetCell: VisioCell[] = obj.PageSheet ? ensureArray(obj.PageSheet.Cell) : [];

    // Extract master properties from XML attributes
    master.id = obj.$.ID;
    master.shape = obj.$.Name;
    master.shapeType = typeof obj.$.MasterType === 'string' ? obj.$.MasterType : '';
    master.name = obj.$.NameU;

    // Extract keywords from PageSheet cell data
    master.shapeKeywords = findCellValue(pageSheetCell, 'ShapeKeywords');

    return master;
}

/**
 * Parses a Visio page configuration from PageSheet data.
 * Extracts page-level properties including dimensions, scale settings, shadow configuration,
 * drawing settings, and layer definitions from the PageSheet's Cell and Section data.
 *
 * @param {VisioPageSheet | undefined} pageSheet - The Visio PageSheet object containing Cell array and optional Section array.
 * @returns {VisioPage} A VisioPage instance populated with parsed settings. Returns instance with empty layers if input is undefined.
 *
 * @example
 * const page = parseVisioPage(pageSheetData);
 * console.log(`Page dimensions: ${page.pageWidth} x ${page.pageHeight}`);
 * console.log(`Layers: ${page.layers.length}`);
 *
 * @private
 */
export function parseVisioPage(pageSheet: VisioPageSheet | undefined): VisioPage {
    const page: VisioPage = new VisioPage();

    // Return defaults if PageSheet is missing or empty
    if (!pageSheet || !pageSheet.Cell) {
        page.layers = [];
        return page;
    }

    // Convert Cell array to a Map for efficient value lookup
    const cellMap: Map<string, CellMapValue> = mapCellValues(ensureArray(pageSheet.Cell));

    // Parse numeric page properties
    page.pageWidth = getCellMapNumericValue(cellMap, 'PageWidth');
    page.pageHeight = getCellMapNumericValue(cellMap, 'PageHeight');
    page.shdwOffsetX = getCellMapNumericValue(cellMap, 'ShdwOffsetX');
    page.shdwOffsetY = getCellMapNumericValue(cellMap, 'ShdwOffsetY');
    page.pageScale = getCellMapNumericValue(cellMap, 'PageScale');
    page.drawingScale = getCellMapNumericValue(cellMap, 'DrawingScale');
    page.drawingSizeType = getCellMapNumericValue(cellMap, 'DrawingSizeType');
    page.drawingScaleType = getCellMapNumericValue(cellMap, 'DrawingScaleType');
    page.uiVisibility = getCellMapNumericValue(cellMap, 'UIVisibility');
    page.shdwType = getCellMapNumericValue(cellMap, 'ShdwType');
    page.shdwObliqueAngle = getCellMapNumericValue(cellMap, 'ShdwObliqueAngle');
    page.shdwScaleFactor = getCellMapNumericValue(cellMap, 'ShdwScaleFactor');
    page.drawingResizeType = getCellMapNumericValue(cellMap, 'DrawingResizeType');
    page.printPageOrientation = getCellMapNumericValue(cellMap, 'PrintPageOrientation');

    // Parse bridging/line jump settings with defaults
    page.bridging = getCellMapNumericValue(cellMap, 'LineJumpCode', 1);
    page.horizontalBridgeSpace = getCellMapNumericValue(cellMap, 'LineJumpFactorX', 0.6667);
    page.verticalBridgeSpace = getCellMapNumericValue(cellMap, 'LineJumpFactorY', 0.6667);
    page.theme = getCellMapNumericValue(cellMap, 'ThemeIndex');
    page.variationStyleIndex = getCellMapNumericValue(cellMap, 'VariationStyleIndex', 0);

    // Parse boolean properties
    page.inhibitSnap = getCellMapBooleanValue(cellMap, 'InhibitSnap');
    page.pageLockReplace = getCellMapBooleanValue(cellMap, 'PageLockReplace');
    page.pageLockDuplicate = getCellMapBooleanValue(cellMap, 'PageLockDuplicate');
    page.pageShapeSplit = getCellMapBooleanValue(cellMap, 'PageShapeSplit');

    // Parse string properties
    page.fillColor = getCellMapStringValue(cellMap, 'FillForegnd');
    page.lineRouteExt = getCellMapStringValue(cellMap, 'LineRouteExt', '0');
    page.routeStyle = getCellMapStringValue(cellMap, 'RouteStyle', '0');

    // Parse layer definitions from Section data
    page.layers = parseLayerSections(pageSheet.Section);

    return page;
}

/**
 * Extracts and parses all layers from the given page sections.
 * Searches for a Layer section within the sections collection and parses each
 * layer row to create VisioLayer objects.
 *
 * @param {OneOrMany<VisioSection> | undefined} sections - The PageSheet sections collection (single section or array).
 * @returns {VisioLayer[]} An array of parsed VisioLayer objects; empty array if no Layer section or sections are undefined.
 *
 * @private
 */
function parseLayerSections(sections: OneOrMany<VisioSection> | undefined): VisioLayer[] {
    if (!sections) { return []; }

    // Normalize sections to array format
    const sectionsArray: VisioSection[] = ensureArray(sections);

    // Find the Layer section
    const layerSection: VisioSection = sectionsArray.find((s: VisioSection) => s && s.$ && s.$.N === 'Layer');

    // Return empty array if no Layer section or rows found
    if (!layerSection || !layerSection.Row) { return []; }

    // Parse each layer row and filter out any undefined results
    const rows: VisioRow[] = ensureArray(layerSection.Row);
    return rows.map(parseLayer).filter(Boolean) as VisioLayer[]; // Added type assertion for filter(Boolean)
}

/**
 * Parses a Visio layer definition from a single Layer row.
 * Extracts layer properties including name, color, visibility, printing,
 * and locking settings from the Cell data.
 *
 * @param {VisioRow | undefined} row - The Layer row containing Cell data with layer properties.
 * @returns {VisioLayer | undefined} The parsed VisioLayer object, or undefined if the row is invalid.
 *
 * @private
 */
function parseLayer(row: VisioRow | undefined): VisioLayer | undefined {
    if (!row || !row.Cell) { return undefined; }

    // Convert Cell array to Map for efficient value lookup
    const cellMap: Map<string, CellMapValue> = mapCellValues(ensureArray(row.Cell));

    // Build and return layer object with parsed properties
    return {
        objects: [],
        name: getCellMapStringValue(cellMap, 'Name'),
        color: getCellMapNumericValue(cellMap, 'Color'),
        status: getCellMapNumericValue(cellMap, 'Status'),
        visible: getCellMapBooleanValue(cellMap, 'Visible', true),
        print: getCellMapBooleanValue(cellMap, 'Print', true),
        active: getCellMapBooleanValue(cellMap, 'Active'),
        lock: getCellMapBooleanValue(cellMap, 'Lock'),
        snap: getCellMapBooleanValue(cellMap, 'Snap', true),
        glue: getCellMapBooleanValue(cellMap, 'Glue', true),
        nameUniv: getCellMapStringValue(cellMap, 'NameU'),
        colorTrans: getCellMapNumericValue(cellMap, 'ColorTrans')
    };
}

/**
 * Parses Visio window/view configuration and display settings.
 * Extracts viewport dimensions, zoom level, view center, and display toggle flags
 * (rulers, grid, guides, connection points, etc.) from the Window XML element.
 *
 * @param {WindowRootElement} root - The root Window element containing window configuration and child Window elements.
 * @returns {VisioWindow} A VisioWindow instance with parsed view settings. Returns instance with defaults if input is missing.
 *
 * @example
 * const window = parseVisioWindow(windowElement);
 * console.log(`View Scale: ${window.viewScale * 100}%`);
 * console.log(`Show Grid: ${window.showGrid}`);
 *
 * @private
 */
export function parseVisioWindow(root: WindowRootElement): VisioWindow {
    const window: VisioWindow = new VisioWindow();
    if (!root) { return window; }

    // Parse root-level attributes (client dimensions)
    if (root.$) {
        window.clientWidth = parseNumberCell(root.$.ClientWidth, 0);
        window.clientHeight = parseNumberCell(root.$.ClientHeight, 0);
    }

    // Find the Drawing type window from child windows
    const windows: WindowElement[] = ensureArray(root.Window);
    const drawing: WindowElement | undefined = windows.find((w: WindowElement) => w && w.$ && w.$.WindowType === 'Drawing');

    if (!drawing) {
        return window;
    }

    // Parse drawing window attributes (dimensions and view settings)
    if (drawing.$) {
        window.windowType = drawing.$.WindowType;
        window.windowWidth = parseNumberCell(drawing.$.WindowWidth, 0);
        window.windowHeight = parseNumberCell(drawing.$.WindowHeight, 0);
        window.viewScale = parseNumberCell(drawing.$.ViewScale, 1);
        window.viewCenterX = parseNumberCell(drawing.$.ViewCenterX, 0);
        window.viewCenterY = parseNumberCell(drawing.$.ViewCenterY, 0);
    }

    // Parse boolean display toggle settings
    window.showRulers = toBoolean(readCellValue(drawing as ParsedXmlObject, 'ShowRulers'), false);
    window.showGrid = toBoolean(readCellValue(drawing as ParsedXmlObject, 'ShowGrid'), false);
    window.showPageBreaks = toBoolean(readCellValue(drawing as ParsedXmlObject, 'ShowPageBreaks'), false);
    window.showGuides = toBoolean(readCellValue(drawing as ParsedXmlObject, 'ShowGuides'), false);
    window.showConnectionPoints = toBoolean(readCellValue(drawing as ParsedXmlObject, 'ShowConnectionPoints'), false);
    window.dynamicGridEnabled = toBoolean(readCellValue(drawing as ParsedXmlObject, 'DynamicGridEnabled'), false);

    // Parse grid and snap settings
    window.glueSettings = parseNumberCell(readCellValue(drawing as ParsedXmlObject, 'GlueSettings'), 0);
    window.snapSettings = parseNumberCell(readCellValue(drawing as ParsedXmlObject, 'SnapSettings'), 0);
    window.snapExtensions = parseNumberCell(readCellValue(drawing as ParsedXmlObject, 'SnapExtensions'), 0);
    window.snapAngles = parseNumberCell(readCellValue(drawing as ParsedXmlObject, 'SnapAngles'), 0);
    window.tabSplitterPos = parseNumberCell(readCellValue(drawing as ParsedXmlObject, 'TabSplitterPos'), 0);

    return window;
}

/**
 * Clamps a number to the [min, max] range.
 * Returns the input value constrained within the specified minimum and maximum bounds.
 *
 * @param {number} n - The value to clamp.
 * @param {number} min - The minimum allowed value (inclusive).
 * @param {number} max - The maximum allowed value (inclusive).
 * @returns {number} The clamped value constrained within [min, max].
 *
 * @example
 * clamp(5, 0, 10); // Returns 5
 * clamp(-5, 0, 10); // Returns 0
 * clamp(15, 0, 10); // Returns 10
 *
 * @private
 */
function clamp(n: number, min: number, max: number): number {
    if (n < min) {
        return min;
    }
    if (n > max) {
        return max;
    }
    return n;
}

/**
 * Normalizes a hex color string to the form "#RRGGBB" with uppercase hex digits.
 * Converts input like "ff00aa" to "#FF00AA", or returns undefined if input is invalid.
 *
 * @param {string | undefined} s - A hex color string (without '#'), or undefined.
 * @returns {string | undefined} A normalized hex string like "#FF00AA", or undefined if input is not a valid string or empty.
 *
 * @example
 * toHex('ff00aa'); // Returns '#FF00AA'
 * toHex(undefined); // Returns undefined
 * toHex(''); // Returns undefined
 *
 * @private
 */
function toHex(s: string | undefined): string | undefined {
    if (typeof s !== 'string') {
        return undefined;
    }

    // Trim whitespace and check if empty
    const hex: string = s.trim();
    if (hex.length === 0) {
        return undefined;
    }

    // Return normalized format with '#' prefix and uppercase
    return '#' + hex.toUpperCase();
}

/**
 * Checks whether a ThemeExtension object has the specified property as its own property.
 * Uses Object.prototype.hasOwnProperty for strict own-property checking (not inherited).
 *
 * @param {ThemeExtension} ext - The extension object to inspect.
 * @param {ThemeExtension} key - The property key to test for.
 * @returns {boolean} True if the extension has the key as its own property; otherwise false.
 *
 * @private
 */
function extHas(ext: ThemeExtension, key: keyof ThemeExtension): boolean {
    return Object.prototype.hasOwnProperty.call(ext, key);
}

/**
 * Finds a ThemeExtension in the collection by matching its $.uri attribute.
 * Performs a linear search through the extensions array looking for a URI match.
 *
 * @param {ReadonlyArray<ThemeExtension> | undefined} exts - The collection of ThemeExtension objects to search.
 * @param {string} uri - The URI value to match against each extension's $.uri property.
 * @returns {ThemeExtension | undefined} The first matching extension, or undefined if not found or exts is undefined.
 *
 * @private
 */
function findExtByUri(exts: ReadonlyArray<ThemeExtension> | undefined, uri: string): ThemeExtension | undefined {
    if (!exts) {
        return undefined;
    }

    // Linear search through extensions for matching URI
    for (let i: number = 0; i < exts.length; i++) {
        const e: ThemeExtension = exts[parseInt(i.toString(), 10)];
        if (e && e.$ && e.$.uri === uri) {
            return e;
        }
    }
    return undefined;
}

/**
 * Finds the first ThemeExtension in the collection that contains the given property key.
 * Performs a linear search through extensions looking for the first one with the specified key.
 *
 * @param {ReadonlyArray<ThemeExtension> | undefined} exts - The collection of ThemeExtension objects to search.
 * @param {ThemeExtension} key - The property key to look for using hasOwnProperty check.
 * @returns {ThemeExtension | undefined} The first extension containing the key, or undefined if none found or exts is undefined.
 *
 * @private
 */
function findExtWithKey(exts: ReadonlyArray<ThemeExtension> | undefined, key: keyof ThemeExtension): ThemeExtension | undefined {
    if (!exts) {
        return undefined;
    }

    // Linear search for first extension containing the key
    for (let i: number = 0; i < exts.length; i++) {
        const e: ThemeExtension = exts[parseInt(i.toString(), 10)];
        if (e && extHas(e, key)) {
            return e;
        }
    }
    return undefined;
}

/**
 * Extracts hex colors from a variation color scheme by reading vt:varColor1 through vt:varColor7.
 * Builds an array of normalized hex color strings ("#RRGGBB" format) in sequence order.
 *
 * @param {VariationClrScheme | undefined} variation - The variation color scheme node containing vt:varColor properties.
 * @param {ProcessedColor[]} themeVariants - Optional array to populate with ProcessedColor objects for each extracted color.
 * @returns {string[]} An array of normalized hex colors (e.g., ["#FF00AA", "#00FF00"]), or empty array if input is undefined.
 *
 * @private
 */
function extractHexColorsFromVariation(variation: VariationClrScheme | undefined, themeVariants?: ProcessedColor[]): Array<string> {
    if (!variation) {
        return [];
    }

    const result: string[] = [];

    // Extract colors 1-7 in sequence
    for (let i: number = 1; i <= 7; i++) {
        const key: keyof VariationClrScheme = ('vt:varColor' + i) as keyof VariationClrScheme;
        const color: VariationColor = (variation as ParsedXmlObject)[`${key}`] as VariationColor | undefined;

        // Navigate nested structure to find srgbClr value
        const val: string | undefined = color && color['a:srgbClr'] && color['a:srgbClr'].$ ? (color['a:srgbClr'].$.val as string) : undefined; // Assert to string
        const hex: string | undefined = toHex(val);

        if (typeof hex === 'string') {
            result.push(hex);

            // Populate the themeVariants array with ProcessedColor objects if provided
            if (themeVariants) {
                themeVariants.push(createProcessedColor(hex));
            }
        }
    }

    return result;
}

/**
 * Ensures the value is returned as a ReadonlyArray.
 * Converts single values to single-element arrays, passes through existing arrays,
 * and returns undefined for undefined input.
 *
 * @template T - The type of array elements.
 * @param {ReadonlyArray<T> | T | undefined} value - The value to normalize (single item, array, or undefined).
 * @returns {ReadonlyArray<T> | undefined} The value as a ReadonlyArray, or undefined if input was undefined.
 *
 * @example
 * toReadonlyArray(5); // Returns [5]
 * toReadonlyArray([1, 2, 3]); // Returns [1, 2, 3]
 * toReadonlyArray(undefined); // Returns undefined
 *
 * @private
 */
export function toReadonlyArray<T>(
    value: ReadonlyArray<T> | T | undefined
): ReadonlyArray<T> | undefined {
    if (typeof value === 'undefined') {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value;
    }
    return [value] as ReadonlyArray<T>;
}

/**
 * Extracts known theme color hex strings from an a:clrScheme object.
 * Parses standard theme color definitions (dk1, lt1, dk2, lt2, accent1-6, hlink, folHlink)
 * and returns them as normalized hex strings with '#' prefix.
 *
 * @param {ParsedXmlObject} clrScheme - The raw a:clrScheme object (typically parsed XML converted to JS object).
 * @returns {Record<string, string | undefined> | undefined} An object mapping color names to hex strings (e.g., { dk1: "#FF0000", accent1: "#00FF00" }),
 *                                                            or undefined if input is not a valid object.
 *
 * @example
 * const colors = extractAndFormatColors(clrSchemeObj);
 * console.log(colors.accent1); // "#FF00AA"
 * console.log(colors.dk1); // "#000000"
 *
 * @private
 */
export function extractAndFormatColors(
    clrScheme: ParsedXmlObject
): Record<string, string | undefined> | undefined {
    if (!isObject(clrScheme)) {
        return undefined;
    }

    /**
     * Helper function to extract hex value from a:srgbClr or a:schemeClr nodes.
     * Attempts to find a color value in either sRGB or scheme color format.
     *
     * @param {ParsedXmlObject | undefined} node - The node to inspect for color values.
     * @returns {string | undefined} Normalized hex string or undefined.
     */
    function getHex(node: ParsedXmlObject | undefined): string | undefined {
        if (!isObject(node)) {
            return undefined;
        }

        const srgb: ParsedXmlObject | undefined = node['a:srgbClr'] as ParsedXmlObject | undefined;
        const scheme: ParsedXmlObject | undefined = node['a:schemeClr'] as ParsedXmlObject | undefined;

        let val: unknown = undefined;

        // Try to extract from sRGB color node
        if (isObject(srgb) && isObject((srgb as ParsedXmlObject).$)) {
            val = ((srgb as ParsedXmlObject).$ as { val?: unknown }).val;
        }
        // Fall back to scheme color node
        else if (isObject(scheme) && isObject((scheme as ParsedXmlObject).$)) {
            val = ((scheme as ParsedXmlObject).$ as { val?: unknown }).val;
        }

        // Return normalized hex if value is non-empty string
        if (typeof val === 'string' && val.length > 0) {
            return '#' + val.toUpperCase();
        }
        return undefined;
    }

    // Build result object mapping each standard theme color name to its hex value
    const result: Record<string, string | undefined> = {
        dk1: getHex(clrScheme['a:dk1'] as ParsedXmlObject | undefined), // Added type assertion
        lt1: getHex(clrScheme['a:lt1'] as ParsedXmlObject | undefined), // Added type assertion
        dk2: getHex(clrScheme['a:dk2'] as ParsedXmlObject | undefined), // Added type assertion
        lt2: getHex(clrScheme['a:lt2'] as ParsedXmlObject | undefined), // Added type assertion
        accent1: getHex(clrScheme['a:accent1'] as ParsedXmlObject | undefined), // Added type assertion
        accent2: getHex(clrScheme['a:accent2'] as ParsedXmlObject | undefined), // Added type assertion
        accent3: getHex(clrScheme['a:accent3'] as ParsedXmlObject | undefined), // Added type assertion
        accent4: getHex(clrScheme['a:accent4'] as ParsedXmlObject | undefined), // Added type assertion
        accent5: getHex(clrScheme['a:accent5'] as ParsedXmlObject | undefined), // Added type assertion
        accent6: getHex(clrScheme['a:accent6'] as ParsedXmlObject | undefined), // Added type assertion
        hlink: getHex(clrScheme['a:hlink'] as ParsedXmlObject | undefined), // Added type assertion
        folHlink: getHex(clrScheme['a:folHlink'] as ParsedXmlObject | undefined) // Added type assertion
    };

    return result;
}

/**
 * Builds an ordered list of fill style definitions from an a:fmtScheme's a:fillStyleLst.
 * Extracts the __order__ array from the fill style list to maintain the sequence of fill styles.
 *
 * @param {ParsedXmlObject} fmtScheme - The a:fmtScheme object (parsed XML to JS) that may contain a:fillStyleLst.
 * @returns {ReadonlyArray<OrderEntry> | undefined} Ordered array of fill style objects with name and value,
 *                                                                        or undefined if not found or fmtScheme is not an object.
 *
 * @private
 */
export function buildFmtSchemeFill(
    fmtScheme: ParsedXmlObject
): ReadonlyArray<OrderEntry> | undefined { // Changed to OrderEntry
    if (!isObject(fmtScheme)) {
        return undefined;
    }

    // Access the fill style list
    const lst: ParsedXmlObject | undefined = fmtScheme['a:fillStyleLst'] as ParsedXmlObject | undefined;
    if (!isObject(lst)) {
        return undefined;
    }

    // Return the ordered list of fill styles
    return lst['__order__'] as ReadonlyArray<OrderEntry>; // Changed to OrderEntry
}

/**
 * Builds an ordered list of line (stroke) style definitions from an a:fmtScheme's a:lnStyleLst.
 * Extracts the __order__ array from the line style list to maintain the sequence of stroke styles.
 *
 * @param {ParsedXmlObject} fmtScheme - The a:fmtScheme object (parsed XML to JS) that may contain a:lnStyleLst.
 * @returns {ReadonlyArray<OrderEntry> | undefined} Ordered array of line style objects with name and value,
 *                                                                        or undefined if not found or fmtScheme is not an object.
 *
 * @private
 */
export function buildFmtSchemeStroke(
    fmtScheme: ParsedXmlObject
): ReadonlyArray<OrderEntry> | undefined { // Changed to OrderEntry
    if (!isObject(fmtScheme)) { return undefined; }

    // Access the line style list
    const lst: ParsedXmlObject | undefined = fmtScheme['a:lnStyleLst'] as ParsedXmlObject | undefined;
    if (!isObject(lst)) {
        return undefined;
    }

    // Return the ordered list of stroke styles
    return lst['__order__'] as ReadonlyArray<OrderEntry>; // Changed to OrderEntry
}

/**
 * Represents the structure for major font definition within FontScheme.
 */
interface MajorFontDefinition {
    readonly 'a:latin': {
        readonly $: {
            readonly typeface: string;
        };
    };
}

/**
 * Parses a Visio theme definition from theme elements.
 * Comprehensive extraction of theme colors, fonts, gradients, and variation schemes
 * from a:clrScheme, a:fmtScheme, a:fontScheme, and extension elements.
 *
 * @param {ThemeElements} obj - The theme elements root parsed from VSDX (contains a:clrScheme, a:fmtScheme, a:fontScheme, a:extLst, etc.).
 * @param {ParsingContext} context - Parser utilities and environment for logging warnings and accessing parsing state (current page, page data).
 * @returns {VisioTheme} The parsed VisioTheme object containing colors, fonts, fills, strokes, gradients, and variation schemes.
 *
 * @example
 * const theme = parseVisioTheme(themeElements, context);
 * console.log(theme.fontFamily); // "Calibri"
 * console.log(theme.fontColor.accent1); // "#0563C1"
 * console.log(theme.hexColors); // ["#FF0000", "#00FF00", ...]
 *
 * @private
 */
export function parseVisioTheme(obj: ThemeElements, context: ParsingContext): VisioTheme {
    const theme: VisioTheme = {};

    // ==================== Extract Color Scheme Extensions ====================
    // Collect extensions under a:clrScheme -> a:extLst -> a:ext[]
    let clrExts: ReadonlyArray<ThemeExtension> | undefined = undefined;
    const clrScheme: ThemeColorScheme | ParsedXmlObject | undefined = obj['a:clrScheme'] as ThemeColorScheme | ParsedXmlObject | undefined;
    if (isObject(clrScheme)) {
        const extLst: ThemeExtList | undefined = clrScheme['a:extLst'] as ThemeExtList; // Refined type
        if (extLst && isObject(extLst)) {
            const exts: OneOrMany<ThemeExtension> | undefined = extLst['a:ext'] as OneOrMany<ThemeExtension>;
            clrExts = toReadonlyArray<ThemeExtension>(exts);
        }
    }

    // ==================== Extract Root Extensions ====================
    // Collect extensions under a:extLst -> a:ext[] (root level)
    let rootExts: ReadonlyArray<ThemeExtension> | undefined = undefined;
    const rootExtList: ThemeExtList | undefined = obj['a:extLst']; // Added undefined
    let rootExtsRaw: any;
    if (isObject(rootExtList)) {
        rootExtsRaw = rootExtList['a:ext'] as OneOrMany<ThemeExtension>;
        rootExts = toReadonlyArray<ThemeExtension>(rootExtsRaw);
    }

    // ==================== Extract Scheme Enum ====================
    // Parse vt:schemeID from clrScheme extensions
    const schemeIdExt: ThemeExtension | undefined = rootExtsRaw[1]['vt:themeScheme'];
    if (
        schemeIdExt &&
        isObject(schemeIdExt['vt:schemeID']) &&
        isObject((schemeIdExt['vt:schemeID'] as ParsedXmlObject).$)
    ) {
        const schemeAttrs: ParsedXmlObject = (schemeIdExt['vt:schemeID'] as ParsedXmlObject).$ as ParsedXmlObject;
        const schemeEnumVal: string | undefined = schemeAttrs.schemeEnum as string | undefined;
        if (typeof schemeEnumVal === 'string') {
            theme.schemeEnum = schemeEnumVal;
        }
    }

    // ==================== Extract Format Scheme Name ====================
    // Parse theme name from a:fmtScheme.$.name
    const fmtScheme: FmtScheme | undefined = obj['a:fmtScheme']; // Added undefined
    if (isObject(fmtScheme) && isObject(fmtScheme.$)) {
        const fmtAttrs: ParsedXmlObject = fmtScheme.$ as ParsedXmlObject;
        const nameVal: string | undefined = fmtAttrs.name as string | undefined;
        if (typeof nameVal === 'string') {
            theme.name = nameVal;
        }
    }

    // ==================== Extract Font Family ====================
    // Parse primary font typeface from a:fontScheme -> a:majorFont -> a:latin -> $.typeface
    const fontScheme: FontScheme | undefined = obj['a:fontScheme'];
    if (isObject(fontScheme)) {
        const major: MajorFontDefinition | undefined = fontScheme['a:majorFont']; // Used new interface, added undefined
        if (isObject(major)) {
            const latin: { readonly $: { readonly typeface: string; }; } | undefined = major['a:latin']; // Added undefined
            if (isObject(latin) && isObject(latin.$)) {
                const latinAttrs: ParsedXmlObject = latin.$ as ParsedXmlObject;
                const typeface: string | undefined = latinAttrs.typeface as string | undefined;
                if (typeof typeface === 'string') {
                    theme.fontFamily = typeface;
                }
            }
        }
    }

    // ==================== Extract Font Colors ====================
    // Extract all standard theme colors from a:clrScheme
    theme.fontColor = extractAndFormatColors(obj['a:clrScheme'] as unknown as ParsedXmlObject); // Assert to ParsedXmlObject

    // ==================== Extract Fill Styles ====================
    // Build ordered array of fill style definitions from a:fmtScheme -> a:fillStyleLst
    if (isObject(fmtScheme)) {
        const fillOrder: ReadonlyArray<OrderEntry> | undefined = buildFmtSchemeFill(fmtScheme as ParsedXmlObject); // Changed to OrderEntry and asserted fmtScheme
        if (fillOrder && fillOrder.length > 0) {
            theme.fmtSchemeFill = fillOrder;
        }
    }

    // ==================== Extract Line (Stroke) Styles ====================
    // Build ordered array of line style definitions from a:fmtScheme -> a:lnStyleLst
    if (isObject(fmtScheme)) {
        const lnOrder: ReadonlyArray<OrderEntry> | undefined = buildFmtSchemeStroke(fmtScheme as ParsedXmlObject); // Changed to OrderEntry and asserted fmtScheme
        if (lnOrder && lnOrder.length > 0) {
            theme.fmtSchemeStroke = lnOrder;
        }
    }

    // ==================== Extract Font Styles + Connector Fonts ====================
    // Parse vt:fontStylesGroup under root extensions (with URI fallback)
    const fontStylesUri: string = '{EBE24D50-EC5C-4D6F-A1A3-C5F0A18B936A}';
    let fontStylesExt: ThemeExtension | undefined = findExtByUri(rootExts, fontStylesUri);
    if (!fontStylesExt) {
        fontStylesExt = findExtWithKey(rootExts, 'vt:fontStylesGroup');
    }

    if (fontStylesExt && isObject(fontStylesExt['vt:fontStylesGroup'])) {
        const group: ParsedXmlObject = fontStylesExt['vt:fontStylesGroup'] as ParsedXmlObject;

        // Extract regular font styles
        const vtFontStyles: FontStyles | ParsedXmlObject | undefined = group['vt:fontStyles'] as FontStyles | ParsedXmlObject | undefined;
        if (isObject(vtFontStyles) && isObject((vtFontStyles as ParsedXmlObject)['vt:fontProps'])) {
            const fontProps: OneOrMany<FontProps> | undefined = (vtFontStyles as ParsedXmlObject)['vt:fontProps'] as OneOrMany<FontProps> | undefined;
            const fontPropsArr: ReadonlyArray<FontProps> | undefined = toReadonlyArray<FontProps>(
                fontProps
            );
            if (fontPropsArr && fontPropsArr.length > 0) {
                theme.fontStyles = fontPropsArr;
            }
        }

        // Extract connector-specific font styles
        const vtConnectorFontStyles: FontStyles | ParsedXmlObject | undefined = group['vt:connectorFontStyles'] as FontStyles | ParsedXmlObject | undefined;
        if (
            isObject(vtConnectorFontStyles) &&
            isObject((vtConnectorFontStyles as ParsedXmlObject)['vt:fontProps'])
        ) {
            const connProps: OneOrMany<FontProps> | undefined = (vtConnectorFontStyles as ParsedXmlObject)['vt:fontProps'] as OneOrMany<FontProps> | undefined;
            const connPropsArr: ReadonlyArray<FontProps> | undefined = toReadonlyArray<FontProps>(
                connProps
            );
            if (connPropsArr && connPropsArr.length > 0) {
                theme.connectorFont = connPropsArr;
            }
        }
    }

    // ==================== Extract Connector Stroke Styles ====================
    // Parse vt:fmtConnectorScheme -> a:lnStyleLst for connector-specific line styles
    const fmtConnectorExt: ThemeExtension | undefined = findExtWithKey(rootExts, 'vt:fmtConnectorScheme');
    if (fmtConnectorExt && isObject(fmtConnectorExt['vt:fmtConnectorScheme'])) {
        const fmtConn: ParsedXmlObject = fmtConnectorExt['vt:fmtConnectorScheme'] as ParsedXmlObject;
        if (isObject(fmtConn['a:lnStyleLst'])) {
            theme.connectorStroke = fmtConn['a:lnStyleLst'] as LineStyleList;
        }
    }

    // ==================== Extract Variation Color Schemes ====================
    // Parse vt:variationClrSchemeLst under clrScheme extensions (with URI fallback)
    const variationClrUri: string = '{DDD2D869-C2EF-471E-B8FA-914AFA308C9F}';
    let variationClrExt: ThemeExtension | undefined = findExtByUri(clrExts, variationClrUri);
    if (!variationClrExt) {
        variationClrExt = findExtWithKey(clrExts, 'vt:variationClrSchemeLst');
    }

    let colorVariations: ReadonlyArray<VariationClrScheme> = [];
    if (
        variationClrExt &&
        isObject(variationClrExt['vt:variationClrSchemeLst']) &&
        isObject(
            (variationClrExt['vt:variationClrSchemeLst'] as ParsedXmlObject)['vt:variationClrScheme']
        )
    ) {
        const v: OneOrMany<VariationClrScheme> | undefined = (variationClrExt['vt:variationClrSchemeLst'] as ParsedXmlObject)['vt:variationClrScheme'] as OneOrMany<VariationClrScheme> | undefined;
        const vArr: ReadonlyArray<VariationClrScheme> | undefined = toReadonlyArray<VariationClrScheme>(
            v
        );
        if (vArr && vArr.length > 0) {
            colorVariations = vArr;
        }
    }

    // ==================== Extract Variation Style Schemes ====================
    // Parse vt:variationStyleSchemeLst under root extensions (with URI fallback)
    const variationStyleUri: string = '{494CE47F-D151-47DC-95E8-85652EA8A67E}';
    let variationStyleExt: ThemeExtension | undefined = findExtByUri(rootExts, variationStyleUri);
    if (!variationStyleExt) {
        variationStyleExt = findExtWithKey(rootExts, 'vt:variationStyleSchemeLst');
    }

    let variationStyleSchemes: ReadonlyArray<VariationStyleScheme> = [];
    if (
        variationStyleExt &&
        isObject(variationStyleExt['vt:variationStyleSchemeLst']) &&
        isObject(
            (variationStyleExt['vt:variationStyleSchemeLst'] as ParsedXmlObject)[
                'vt:variationStyleScheme'
            ]
        )
    ) {
        const s: OneOrMany<VariationStyleScheme> | undefined = (variationStyleExt['vt:variationStyleSchemeLst'] as ParsedXmlObject)['vt:variationStyleScheme'] as OneOrMany<VariationStyleScheme> | undefined;
        const sArr: ReadonlyArray<VariationStyleScheme> | undefined = toReadonlyArray<VariationStyleScheme>(
            s
        );
        if (sArr && sArr.length > 0) {
            variationStyleSchemes = sArr;
        }
    }

    // ==================== Resolve Requested Index ====================
    // Parse the variationStyleIndex from context to determine which variation to use
    let requestedIndex: number = 0;
    if (context && context.data && Array.isArray(context.data.pages) && context.data.pages.length > 0) {
        if (
            context.currentPage &&
            typeof context.currentPage.variationStyleIndex !== 'undefined'
        ) {
            const raw: number = context.currentPage.variationStyleIndex;
            const toParse: string = typeof raw === 'number' ? String(raw) : String(raw);
            const parsed: number = parseInt(toParse, 10);
            if (!isNaN(parsed)) {
                requestedIndex = parsed;
            }
        }
    }

    // ==================== Select Variation Color Scheme ====================
    // Choose variation color scheme by clamped index (safe bounds checking)
    const varIndex: number =
        colorVariations.length > 0 ? clamp(requestedIndex, 0, colorVariations.length - 1) : 0;
    let chosenVariation: VariationClrScheme | undefined = undefined; // Added undefined
    if (colorVariations.length > varIndex) {
        chosenVariation = colorVariations[parseInt(varIndex.toString(), 10)];
    }

    // ==================== Select Variation Style Scheme ====================
    // Choose variation style scheme by clamped index and extract variant styles
    const styleIndex: number =
        variationStyleSchemes.length > 0
            ? clamp(requestedIndex, 0, variationStyleSchemes.length - 1)
            : 0;
    if (variationStyleSchemes.length > styleIndex) {
        const chosenStyle: VariationStyleScheme = variationStyleSchemes[parseInt(styleIndex.toString(), 10)];
        if (isObject(chosenStyle)) {
            const varStyle: OneOrMany<VarientStyle> | undefined = chosenStyle['vt:varStyle'] as OneOrMany<VarientStyle> | undefined;
            const varStyleArr: ReadonlyArray<VarientStyle> | undefined = toReadonlyArray<VarientStyle>(
                varStyle
            );
            if (varStyleArr && varStyleArr.length > 0) {
                theme.variant = varStyleArr;
            }
        }
    }

    // ==================== Extract Hex Colors from Variation ====================
    // Extract vt:varColor1..vt:varColor7 hex values from the chosen variation scheme
    theme.hexColors = extractHexColorsFromVariation(chosenVariation);

    // ==================== ENHANCED THEME PROCESSING ====================
    // Build richer theme helpers so the rest of the importer can resolve
    // quick-style matrices and color ids into concrete hex values.
    theme.baseColors = extractAndFormatColors(obj['a:clrScheme'] as unknown as ParsedXmlObject);

    // ==================== Process Fill Styles ====================
    // Transform extracted fill definitions into ProcessedColor objects using baseColors
    if (theme.fmtSchemeFill && Array.isArray(theme.fmtSchemeFill)) {
        const fillStyles: ColorReferenceArray = [];
        for (const fillItem of theme.fmtSchemeFill) {
            fillStyles.push(transformStyle(fillItem, theme.baseColors as Record<string, string>));
        }
        theme.fillStyles = fillStyles;
    }

    // ==================== Process Line Styles ====================
    // Transform extracted line style definitions into processed stroke objects
    if (theme.fmtSchemeStroke && Array.isArray(theme.fmtSchemeStroke)) {
        const lineStyles: LineStyleRef[] = [];
        for (const lineItem of theme.fmtSchemeStroke) {
            lineStyles.push(transformLineStyle(lineItem, theme.baseColors as Record<string, string>));
        }
        theme.lineStyles = lineStyles;
    }

    // ==================== Process Connector Fill Styles ====================
    // Extract and transform connector-specific fill styles
    const fmtConnectorExt2: ThemeExtension | undefined = findExtWithKey(rootExts, 'vt:fmtConnectorScheme');
    if (fmtConnectorExt2 && isObject(fmtConnectorExt2['vt:fmtConnectorScheme'])) {
        const fmtConn: FmtConnectorScheme = fmtConnectorExt2['vt:fmtConnectorScheme'];

        // Process connector fill styles
        if (isObject(fmtConn['a:fillStyleLst'])) {
            const connFillStyles: TransformedColorRef[] = [];
            const fillLst: FillStyleList = fmtConn['a:fillStyleLst'];

            for (const key in fillLst) {
                if (key !== '$' && fillLst.hasOwnProperty(key)) {
                    const items: ReadonlyArray<SolidFill> | undefined = toReadonlyArray(fillLst[`${key}`] as ReadonlyArray<SolidFill>);
                    if (items) {
                        for (let i: number = 0; i < items.length; i++) {
                            connFillStyles.push(transformStyle(
                                { name: key, value: items[parseInt(i.toString(), 10)] },
                                theme.baseColors as Record<string, string>
                            ));
                        }
                    }
                }
            }

            if (connFillStyles.length > 0) {
                theme.connFillStyles = connFillStyles;
            }
        }

        // Process connector line styles
        if (isObject(fmtConn['a:lnStyleLst'])) {
            const connLineStyles: Array<{ name: string; value: LineStyleEntry }> = [];
            const lnLst: LineStyleList = fmtConn['a:lnStyleLst'] as LineStyleList;

            for (const key in lnLst) {
                if (key !== '$' && lnLst.hasOwnProperty(key)) {
                    const items: ReadonlyArray<LineStyleEntry> | undefined = toReadonlyArray(lnLst[`${key}`] as ReadonlyArray<LineStyleEntry>);
                    if (items) {
                        for (let i: number = 0; i < items.length; i++) {
                            connLineStyles.push({ name: key, value: items[parseInt(i.toString(), 10)] });
                        }
                    }
                }
            }

            if (connLineStyles.length > 0) {
                theme.connLineStyles = connLineStyles;
            }
        }
    }

    // ==================== Process Extended Line Styles ====================
    // Extract extended line style definitions for scheme and connectors
    const lineStylesExt: ThemeExtension | undefined = findExtWithKey(rootExts, 'vt:lineStyles');
    if (lineStylesExt && isObject(lineStylesExt['vt:lineStyles'])) {
        const lineStyles2: LineStyles = lineStylesExt['vt:lineStyles'];

        // Connector line styles extended
        if (isObject(lineStyles2['vt:fmtConnectorSchemeLineStyles'])) {
            const connLnExt: Array<{name: string; value: ConnectorLineStyle}> = [];
            const connLnExtObj: FmtConnectorSchemeLineStyles = lineStyles2['vt:fmtConnectorSchemeLineStyles'];

            for (const key in connLnExtObj) {
                if (key !== '$' && connLnExtObj.hasOwnProperty(key)) {
                    const items: ReadonlyArray<ConnectorLineStyle> | undefined = toReadonlyArray(connLnExtObj[`${key}`] as ReadonlyArray<ConnectorLineStyle> | undefined);
                    if (items) {
                        for (let i: number = 0; i < items.length; i++) {
                            connLnExt.push({ name: key, value: items[parseInt(i.toString(), 10)] });
                        }
                    }
                }
            }

            if (connLnExt.length > 0) {
                theme.connLineStylesExt = connLnExt;
            }
        }

        // Scheme line styles extended
        if (isObject(lineStyles2['vt:fmtSchemeLineStyles'])) {
            const lineExtArr: Array<{name: string; value: SchemeLineStyle}> = [];
            const lineExtObj: FmtSchemeLineStyles = lineStyles2['vt:fmtSchemeLineStyles'];

            for (const key in lineExtObj) {
                if (key !== '$' && lineExtObj.hasOwnProperty(key)) {
                    const items: ReadonlyArray<SchemeLineStyle> | undefined = toReadonlyArray(lineExtObj[`${key}`] as ReadonlyArray<SchemeLineStyle> | undefined);
                    if (items) {
                        for (let i: number = 0; i < items.length; i++) {
                            lineExtArr.push({ name: key, value: items[parseInt(i.toString(), 10)] });
                        }
                    }
                }
            }
            if (lineExtArr.length > 0) {
                theme.lineStylesExt = lineExtArr;
            }
        }
    }

    // ==================== Extract Font Colors ====================
    // Extract all node-specific font colors from fontStyles
    if (theme.fontStyles && Array.isArray(theme.fontStyles)) {
        const fontStyles: ColorReferenceArray = [];
        for (let i: number = 0; i < theme.fontStyles.length; i++) {
            fontStyles.push(transformStyle(theme.fontStyles[parseInt(i.toString(), 10)], theme.baseColor as Record<string, string>));
        }
        theme.fontColorsArray = fontStyles;
    }

    // ==================== Extract Font Colors ====================
    // Extract all connector-specific font colors from connectorFont
    if (theme.connectorFont && Array.isArray(theme.connectorFont)) {
        const fontStyles: ColorReferenceArray = [];
        for (let i: number = 0; i < theme.connectorFont.length; i++) {
            fontStyles.push(transformStyle(theme.connectorFont[parseInt(i.toString(), 10)], theme.baseColor as Record<string, string>));
        }
        theme.connFontColors = fontStyles;
    }

    // ==================== Initialize Variant Color Arrays ====================
    // Pre-process all variant colors (not just the chosen one)
    theme.variantsColors = [];
    if (colorVariations && colorVariations.length > 0) {
        for (let i: number = 0; i < colorVariations.length; i++) {
            theme.variantsColors.push(([]));
            extractHexColorsFromVariation(colorVariations[parseInt(i.toString(), 10)], theme.variantsColors[parseInt(i.toString(), 10)]);
        }
    }

    // ==================== Build Variant Index Arrays ====================
    // Build 2D index arrays for fill, line, effect, and font styles across all variations
    theme.variantFillIdx = [] as Array<Array<number>>;
    if (variationStyleSchemes && variationStyleSchemes.length > 0) {
        for (let k: number = 0; k < variationStyleSchemes.length; k++) {
            const scheme: VariationStyleScheme = variationStyleSchemes[parseInt(k.toString(), 10)];

            if (isObject(scheme)) {
                const varientStyle: OneOrMany<VarientStyle> | undefined = scheme['vt:varStyle'] as OneOrMany<VarientStyle> | undefined;
                const variantStyleArray: ReadonlyArray<VarientStyle> | undefined = toReadonlyArray<VarientStyle>(varientStyle);
                const fillRow: Array<number> = [];
                if (variantStyleArray && variantStyleArray.length > 0) {
                    for (let j: number = 0; j < variantStyleArray.length; j++) {
                        const item: VarientStyle = variantStyleArray[parseInt(j.toString(), 10)];
                        const attrs: Partial<VarientStyleAttributes> = (item && item.$)
                            ? item.$ : {};

                        fillRow.push((attrs.fillIdx ? parseInt(attrs.fillIdx as string, 10) : 0));
                    }
                }
                theme.variantFillIdx.push(fillRow);
            }
        }
    }

    // ==================== Extract Monotone Variant Flags ====================
    // Extract monotone flags for each color variation
    theme.isMonotoneVariant = [false, false, false, false];
    if (colorVariations && colorVariations.length > 0) {
        for (let m: number = 0; m < Math.min(colorVariations.length, 4); m++) {
            const variation: VariationClrScheme = colorVariations[parseInt(m.toString(), 10)];
            if (variation && variation.$ && variation.$.monotone) {
                theme.isMonotoneVariant[parseInt(m.toString(), 10)] = true;
            }
        }
    }
    // Set theme variant indices (default to 0)
    theme.themeVariantClr = requestedIndex;
    theme.themeVariantStl = requestedIndex;
    return theme;
}

/**
 * Converts a hexadecimal color string to RGB components.
 * Strips the '#' prefix if present and extracts red, green, and blue values using bitwise operations.
 *
 * @param {string} hex - A hexadecimal color string (e.g., '#FF0000' or 'FF0000').
 * @returns {{red: number, green: number, blue: number}} Object containing RGB components in range [0, 255].
 *
 * @example
 * const rgb = hexToRgb('#FF0000');
 * console.log(rgb); // { red: 255, green: 0, blue: 0 }
 *
 * @private
 */
function hexToRgb(hex: string): { red: number; green: number; blue: number } {
    const cleanHex: string = hex.replace(/^#/, '');
    const num: number = parseInt(cleanHex, 16);
    return {
        red: (num >> 16) & 255,
        green: (num >> 8) & 255,
        blue: num & 255
    };
}

/**
 * Creates a fully initialized ProcessedColor object from a hexadecimal color value.
 * Initializes all color modifier fields to 0 and sets the resolved RGB color.
 *
 * @param {string} hexColor - A hexadecimal color string (e.g., '#FF0000').
 * @returns {ProcessedColor} A ProcessedColor object with all fields initialized and RGB resolved.
 *
 * @private
 */
function createProcessedColor(hexColor: string): ProcessedColor {
    const rgb: { red: number; green: number; blue: number } = hexToRgb(hexColor);
    return {
        tint: 0,
        shade: 0,
        comp: 0,
        inv: 0,
        gray: 0,
        alpha: 0,
        alphaOff: 0,
        alphaMod: 0,
        hue: 0,
        hueOff: 0,
        hueMod: 0,
        sat: 0,
        satOff: 0,
        satMod: 0,
        lum: 0,
        lumOff: 0,
        lumMod: 0,
        red: 0,
        redOff: 0,
        redMod: 0,
        green: 0,
        greenOff: 0,
        greenMod: 0,
        blue: 0,
        blueOff: 0,
        blueMod: 0,
        gamma: 0,
        invGamma: 0,
        isDynamic: false,
        isInitialized: false,
        hasEffects: false,
        color: {
            red: rgb.red,
            green: rgb.green,
            blue: rgb.blue,
            gradientClr: null
        },
        hexVal: hexColor.replace(/^#/, '').toUpperCase()
    };
}

/**
 * Creates a ColorRef object for a scheme color reference (not yet resolved to RGB).
 * Initializes all color modifier fields and stores the scheme color name for later resolution.
 *
 * @param {string} val - The scheme color name (e.g., 'accent1').
 * @param {ColorModifiers} modifiers - The color modifiers (tint, shade, hasEffects).
 * @returns {ColorRef} A ColorRef object with scheme color reference and modifiers.
 *
 * @private
 */
function createColorRef(val: string, modifiers: ColorModifiers): ColorRef {
    return {
        tint: modifiers.tint || 0,
        shade: modifiers.shade || 0,
        comp: 0,
        inv: 0,
        gray: 0,
        alpha: 0,
        alphaOff: 0,
        alphaMod: 0,
        hue: 0,
        hueOff: 0,
        hueMod:  modifiers.hueMod || 0,
        sat: 0,
        satOff: 0,
        satMod:  modifiers.satMod || 0,
        lum: 0,
        lumOff: 0,
        lumMod:  modifiers.lumMod || 0,
        red: 0,
        redOff: 0,
        redMod: 0,
        green: 0,
        greenOff: 0,
        greenMod: 0,
        blue: 0,
        blueOff: 0,
        blueMod: 0,
        gamma: 0,
        invGamma: 0,
        isDynamic: true,
        isInitialized: false,
        hasEffects: modifiers.hasEffects || false,
        color: null,
        val: val
    };
}

/**
 * Extracts color modifiers (tint and shade) from an XML color node.
 * Parses a:tint and a:shade elements and converts from 1000-based scale to decimal range.
 *
 * @param {SchemeColor} colorObj - The XML color object containing potential a:tint and a:shade elements.
 * @returns {ColorModifiers} Object with tint, shade, and hasEffects properties.
 *
 * @private
 */
function extractColorModifiers(colorObj: SchemeColor): ColorModifiers {
    const modifiers: ColorModifiers = { hasEffects: false };

    extractModifier(colorObj, 'a:tint', modifiers, 'tint');
    extractModifier(colorObj, 'a:shade', modifiers, 'shade');
    extractModifier(colorObj, 'a:satMod', modifiers, 'satMod');
    extractModifier(colorObj, 'a:lumMod', modifiers, 'lumMod');
    extractModifier(colorObj, 'a:hueMod', modifiers, 'hueMod');

    return modifiers;
}

/**
 * Extracts a specific color modifier from an XML color node.
 * Looks for the given XML key (e.g., a:tint, a:shade) and converts
 * its 1000-based scale value into a decimal range.
 *
 * @param {SchemeColor} colorObj - The XML color object containing modifier elements.
 * @param {string} xmlKey - The XML element name to extract (e.g., 'a:tint', 'a:shade').
 * @param {ColorModifiers} modifiers - The modifiers object to update with extracted values.
 * @param {string} modifierName - The property name to assign the extracted value to in `modifiers`.
 * @returns {void}
 *
 * @private
 */
function extractModifier(colorObj: SchemeColor, xmlKey: string, modifiers: ColorModifiers, modifierName: string): void {
    if (colorObj[`${xmlKey}`]) {
        const val: string = colorObj[`${xmlKey}`].$.val || '0';
        modifiers[`${modifierName}`] = parseInt(val, 10) / 1000;
        modifiers.hasEffects = true;
    }
}

/**
 * Transforms a raw data entry into a processed color object with resolved colors.
 * Handles both direct RGB fills and scheme color references.
 *
 * @param {Partial<OrderEntry>} colorElem - The Raw data to be converted as color element.
 * @param {Record<string, string>} baseColors - Base color map for reference resolution.
 * @returns {TransformedColorRef} Processed color object with optional color and value properties.
 *
 * @private
 */
function transformStyle(colorElem: Partial<OrderEntry>, baseColors: Record<string, string>): TransformedColorRef {
    const result: TransformedColorRef = {};
    if (colorElem && colorElem.name) {
        result.name = colorElem.name;
    }
    let value: RawColorValue;
    if (colorElem && colorElem['vt:color']) {
        value = colorElem['vt:color'] as RawColorValue;
    }
    else if (colorElem && colorElem.value) {
        value = colorElem.value as RawColorValue;
    }
    if (value) {
        // Handle direct RGB color
        if (value['a:srgbClr']) {
            const hexVal: string | undefined = value['a:srgbClr'].$.val;
            if (hexVal) {
                result.color = createProcessedColor('#' + hexVal);
            }
        }

        // Handle scheme color reference
        if (value['a:schemeClr']) {
            const schemeVal: string | undefined = value['a:schemeClr'].$.val;
            const modifiers: ColorModifiers = extractColorModifiers(value['a:schemeClr']);
            if (schemeVal) {
                result.color = createColorRef(schemeVal, modifiers);
            }
        }

        // Preserve gradient data if present
        if (value['a:gsLst']) {
            result.value = value;
        }
    }

    return result;
}

/**
 * Transforms a line (stroke) style entry into a processed stroke object with properties and colors.
 * Extracts line width, dash pattern, cap style, and fill color.
 *
 * @param {StrokeItem} strokeItem - The line item with optional attributes and color/dash properties.
 * @param {Record<string, string>} baseColors - Base color map for reference resolution.
 * @returns {LineStyleRef} Processed stroke object with all line properties.
 *
 * @private
 */
function transformLineStyle(strokeItem: StrokeItem, baseColors: Record<string, string>): LineStyleRef {
    const result: LineStyleRef = {
        isLineDashed: false,
        lineDashPattern: [],
        isRoundJoin: false,
        isBevelJoin: false,
        isMiterJoin: false,
        lineWidth: 0,
        lineCap: null,
        lineComp: 0,
        fillStyle: null,
        headEndType: null,
        headEndWidth: 0,
        headEndLen: 0,
        tailEndType: null,
        tailEndWidth: 0,
        tailEndLen: 0
    };

    // Extract line width and cap style from attributes
    if (strokeItem.$) {
        const attributes: StrokeAttributes = strokeItem.$;
        result.lineWidth = parseInt(attributes.w || '0', 10);
        result.lineCap = attributes.cap === 'rnd' ? 0 : attributes.cap === 'sq' ? 1 : null;
    }

    // Extract dash pattern
    if (strokeItem['a:prstDash']) {
        const dashVal: string | undefined = strokeItem['a:prstDash'].$.val;
        result.isLineDashed = dashVal && dashVal !== 'solid';
    }

    // Extract fill color from solid fill
    if (strokeItem['a:solidFill']) {
        result.fillStyle = transformStyle({ value: strokeItem['a:solidFill'] }, baseColors);
    }

    return result;
}

/**
 * Parses node styling properties (fills, strokes, gradients) from a shape's raw XML object.
 * Extracts fill colors, stroke properties, gradient settings, patterns, and opacity
 * from the shape's Cell and Section data.
 *
 * @param {VisioShapeNode} shapeData - The raw shape XML object containing Cell array and optional Section array.
 * @param {ParsingContext} context - Parser utilities for logging warnings and accessing parsing state.
 * @param {MasterDefaultValues | undefined} defaultStyle - Optional default style data to fall back to for undefined properties.
 * @param {VisioShape} shape -  Parsed Visio shape(s) for the vertex node
 * @param {string} attributeName - The attribute name of the shape (e.g., 'Image', 'Shape') used to determine opacity handling.
 * @returns {VisioNodeStyle} A VisioNodeStyle object containing parsed fill, stroke, gradient, and opacity properties.
 *
 * @example
 * const nodeStyle = parseVisioNodeStyle(shapeData, context, defaultStyle, 'Shape');
 * console.log(`Stroke Width: ${nodeStyle.strokeWidth}px`);
 * console.log(`Fill Color: ${nodeStyle.fillColor}`);
 * console.log(`Gradient Angle: ${nodeStyle.gradientAngle}°`);
 *
 * @private
 */
export function parseVisioNodeStyle(shapeData: VisioShapeNode, context: ParsingContext, defaultStyle: MasterDefaultValues | undefined,
                                    shape: VisioShape, attributeName: string): VisioNodeStyle {

    // Normalize Section array
    const section: VisioSection[] = shapeData.Section ? (Array.isArray(shapeData.Section) ? shapeData.Section : [shapeData.Section]) : [];

    /**
     * Helper to retrieve a cell value by name from the shape's Cell array.
     *
     * @param {string} name - The cell name to find (e.g., 'LineWeight').
     * @returns {string | undefined} The cell value or undefined if not found.
     */
    const getCell: (name: string) => string | undefined = (name: string) => { // Explicitly typed helper function
        const cell: VisioCell | undefined = ensureArray(shapeData.Cell).find((c: VisioCell) => c.$.N === name); // Used ensureArray and VisioCell
        return cell ? (cell.$.V as string) : undefined; // Assert to string
    };

    const getMasterCell: (name: string) => string | undefined = (name: string) => {
        const masterSource: VisioShapeNode | null = resolveMasterSourceForNode(shapeData, context);
        let masterCell: VisioCell | undefined;

        let objectStyleSheet: VisioStyleSheet;
        let styleName: string;
        switch (name) {
        case 'LineColor':
            styleName = 'LineStyle';
            break;
        case 'FillForegnd':
            styleName = 'FillStyle';
            break;
        }

        if (!context || !context.entries || !context.entries.RootDocument || !context.entries.RootDocument.StyleSheets
            || !context.entries.RootDocument.StyleSheets.StyleSheet) {
            return undefined;
        }

        const styleSheets: VisioStyleSheet[] = context.entries.RootDocument.StyleSheets.StyleSheet;

        if (masterSource && masterSource.$ && masterSource.$[`${styleName}`] && styleSheets && styleSheets.length > 1) {
            objectStyleSheet = styleSheets.find((sheet: VisioStyleSheet) => sheet && sheet.$ && sheet.$.ID === masterSource.$[`${styleName}`]);
        }
        if (shapeData && masterSource && masterSource.Cell) {
            masterCell = ensureArray(masterSource.Cell).find((c: VisioCell) => c.$.N === name);
        }
        if (masterCell && masterCell.$ && masterCell.$.V) {
            return context.propertyManager.getColor(masterCell.$.V as string);
        }
        if (objectStyleSheet && objectStyleSheet.Cell) {
            const cell: VisioCell | undefined = ensureArray(objectStyleSheet.Cell).find((c: VisioCell) => c.$.N === name);
            if (cell && cell.$ && cell.$.V && isValidColor(cell.$.V as string)) {
                return cell.$.V as string;
            }
            return undefined;
        }
        else {
            return undefined;
        }
    };

    // Initialize the node style object
    const nodeStyle: VisioNodeStyle = new VisioNodeStyle();
    const lineColor: string | undefined = getCell('LineColor');
    const masterLineColor: string | undefined = getMasterCell('LineColor');
    // ==================== Parse Stroke Properties ====================
    nodeStyle.strokeWidth = getCell('LineWeight') != null ? Number(getCell('LineWeight')) : undefined;
    nodeStyle.linePattern = getCell('LinePattern') != null ? getCell('LinePattern') : undefined;
    nodeStyle.strokeColor = lineColor != null ? (nodeStyle.linePattern !== '0' ? lineColor : undefined) : masterLineColor != null ? masterLineColor : undefined;
    nodeStyle.strokeDashArray = getCell('LinePattern') != null ? getCell('LinePattern') : undefined;

    // Log warning about partial pattern matching between Visio and EJ2
    if (getCell('LinePattern') != null) {
        context.addWarning('[WARNING] :: The dashed patterns in EJ2 partially match those in Visio. While the patterns themselves are similar, their appearance, particularly when adjusting the stroke width, is not identical.');
    }

    // ==================== Parse Fill Properties ====================
    nodeStyle.fillColor = getCell('FillForegnd') != null ? getCell('FillForegnd') : getMasterCell('FillForegnd') != null ? getMasterCell('FillForegnd') : getFillColor(shape, context);
    nodeStyle.fillPattern = getCell('FillPattern') != null ? getCell('FillPattern') : (defaultStyle && defaultStyle.FillPattern) ? defaultStyle.FillPattern : undefined;

    // ==================== Parse Opacity ====================
    // Image shapes use Transparency; other shapes use FillForegndTrans
    context.addWarning('[WARNING] :: EJ2 only have common opacity not like line opacity and fill opacity in visio. So only visio fill opacity is applied for both line and fill');
    nodeStyle.opacity = (attributeName === 'Image')
        ? (getCell('Transparency') != null ? Number(getCell('Transparency')) : 1)
        : (getCell('FillForegndTrans') != null ? Number(getCell('FillForegndTrans')) : (defaultStyle && defaultStyle.FillForegndTrans) ? defaultStyle.FillForegndTrans : 1);

    // ==================== Parse Gradient Properties ====================
    nodeStyle.gradientAngle = getCell('FillGradientAngle') != null ? Number(getCell('FillGradientAngle')) : 0;
    nodeStyle.isGradientEnabled = getCell('FillGradientEnabled') != null && getCell('FillGradientEnabled') !== '0';

    // Process gradient if enabled
    if (nodeStyle.isGradientEnabled) {
        // Log warnings about gradient limitations in EJ2
        context.addWarning('[WARNING] :: Gradient fills in Visio are approximated in EJ2.');
        context.addWarning('[WARNING] :: Line gradients are not supported in EJ2. Additionally, there isn\'t a specific API to adjust line transparency directly. Line transparency is adjusted when the node\'s fill transparency is modified.');

        // Convert gradient angle from radians to degrees
        const angleRad: number = Number(getCell('FillGradientAngle'));
        const angleDeg: number = angleRad * (180 / Math.PI);

        // Determine gradient type (Linear vs Radial) from FillGradientDir
        const gradientDir: string = getCell('FillGradientDir'); // Provide fallback
        nodeStyle.gradientType = gradientDir === '0' ? 'Linear' : 'Radial';

        context.addWarning('[WARNING] :: EJ2 diagram only supports linear and radial gradients. Rectangle and path gradient types are not supported in EJ2.');

        // Extract background/gradient color
        nodeStyle.gradient = getCell('FillBkgnd') != null ? getCell('FillBkgnd') : '#1b2811';

        // Calculate gradient coordinates based on type and direction
        if (nodeStyle.gradientType === 'Linear') {
            nodeStyle.gradientCoordinates = getGradientVectorByAngle(angleDeg);
        }
        else {
            nodeStyle.gradientCoordinates = getRadialGradient(gradientDir);
        }

        // Extract gradient stops from FillGradient section
        const fillGradientSection: VisioSection | undefined = section.find((sec: VisioSection) => { // Typed section
            return sec && sec.$ && sec.$.N === 'FillGradient';
        });
        nodeStyle.gradientStops = extractGradientStops(fillGradientSection);
    }

    return nodeStyle;
}

/**
 * Converts an RGB color object to a hexadecimal string representation.
 * Pads single-digit components with leading zeros.
 *
 * @param {RgbColor} color - The color object with red, green, and blue properties.
 * @returns {string} A hexadecimal color string in format "#RRGGBB" (e.g., "#FF0000").
 *
 * @private
 */
function toHexStr(color: RgbColor): string {
    const red: string = color.red.toString(16);
    const redPadded: string = red.length === 1 ? '0' + red : red;
    const green: string = color.green.toString(16);
    const greenPadded: string = green.length === 1 ? '0' + green : green;
    const blue: string = color.blue.toString(16);
    const bluePadded: string = blue.length === 1 ? '0' + blue : blue;

    return `#${redPadded}${greenPadded}${bluePadded}`;
}

/**
 * Converts an RGB color object to HSV color space for transformation operations.
 * Used as an intermediate step for applying tint, shade, and other color modifiers.
 *
 * @param {RgbColor} color - The RGB color object with red, green, and blue properties (0-255).
 * @returns {HSVColor} An HSVColor object representing the color in HSV space.
 *
 * @private
 */
function toHsv(color: RgbColor): HSVColor {
    const red: number = color.red / 255.0;
    const green: number = color.green / 255.0;
    const blue: number = color.blue / 255.0;
    const max: number = Math.max(red, Math.max(green, blue));
    const min: number = Math.min(red, Math.min(green, blue));
    const delta: number = max - min;

    let hue: number;
    const value: number = max;
    const saturation: number = max === 0 ? 0 : delta / max;

    if (max === min) {
        hue = 0;
    } else {
        if (max === red) {
            hue = (green - blue) / delta + (green < blue ? 6 : 0);
        } else if (max === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }
        hue /= 6;
    }

    return new HSVColor(hue, saturation, value);
}

/**
 * HSVColor class for color space conversion and manipulation.
 * Provides methods to apply tint, shade, and other color transformations.
 *
 * @private
 */
class HSVColor {
    hue: number = 0;
    saturation: number = 0;
    value: number = 0;

    constructor(hue: number, saturation: number, value: number) {
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
    }

    /**
     * Converts HSV color to RGB color space.
     * @returns {RgbColor} RGB color object with red, green, blue properties (0-255).
     */
    toRgb(): RgbColor {
        const hsvHueScaled: number = this.hue * 6;
        const hsvSaturation: number = this.saturation;
        const hsvValue: number = this.value;

        const sectorIndex: number = Math.floor(hsvHueScaled);
        const fractionalPart: number = hsvHueScaled - sectorIndex;
        const mod: number = (sectorIndex | 0) % 6;

        // Intermediate values used in conversion
        const valueMin: number = hsvValue * (1 - hsvSaturation);
        const valueDecreasing: number = hsvValue * (1 - fractionalPart * hsvSaturation);
        const valueIncreasing: number = hsvValue * (1 - (1 - fractionalPart) * hsvSaturation);

        // Candidate RGB values for each sector
        const redArr: number[] = [hsvValue, valueDecreasing, valueMin, valueMin, valueIncreasing, hsvValue];
        const greenArr: number[] = [valueIncreasing, hsvValue, hsvValue, valueDecreasing, valueMin, valueMin];
        const blueArr: number[] = [valueMin, valueMin, valueIncreasing, hsvValue, hsvValue, valueDecreasing];

        const red: number = redArr[parseInt(mod.toString(), 10)];
        const green: number = greenArr[parseInt(mod.toString(), 10)];
        const blue: number = blueArr[parseInt(mod.toString(), 10)];

        return {
            red: ((red * 255) | 0),
            green: ((green * 255) | 0),
            blue: ((blue * 255) | 0)
        };
    }

    /**
     * Clamps a number to the range [0, 1].
     * @param {number} val - The input number to clamp.
     * @returns {this} The clamped number between 0 and 1.
     */
    clamp01(val: number): number {
        return Math.min(1, Math.max(0, val));
    }

    /**
     * Applies a tint effect (brightens the color).
     * @param {number} amount - Percentage to increase brightness in range [0, 100].
     * @returns {this} The current instance with modified value.
     */
    tint(amount: number): this {
        this.value *= (1 + (amount / 100.0));
        this.value = this.clamp01(this.value);
        return this;
    }

    /**
     * Applies a shade effect (darkens the color).
     * @param {number} amount - Percentage to decrease brightness in range [0, 100].
     * @returns {this} The current instance with modified value.
     */
    shade(amount: number): this {
        this.value *= amount / 100.0;
        this.value = this.clamp01(this.value);
        return this;
    }

    /**
     * Applies a saturation modifier.
     * @param {number} amount - Percentage to scale saturation in range [0, 100].
     * @returns {this} The current instance with modified saturation.
     */
    satMod(amount: number): this {
        this.saturation *= amount / 100.0;
        this.saturation = this.clamp01(this.saturation);
        return this;
    }

    /**
     * Applies a luminance modifier.
     * @param {number} amount - Percentage to scale luminance in range [0, 100].
     * @returns {this} The current instance with modified luminance.
     */
    lumMod(amount: number): this {
        this.value *= amount / 100.0;
        this.value = this.clamp01(this.value);
        return this;
    }

    /**
     * Applies a hue modifier.
     * @param {number} amount - Percentage to scale hue in range [0, 100].
     * @returns {this} The current instance with modified hue.
     */
    hueMod(amount: number): this {
        this.hue *= amount / 100.0;
        this.hue = this.clamp01(this.hue);
        return this;
    }
}

/**
 * Applies color modifiers (tint, shade, saturation, luminance, hue) to a fill style color.
 * Converts to HSV space, applies modifications, and converts back to RGB.
 *
 * @param {ColorRef | ProcessedColor} fillStyleColor - The fill style color object with modifiers and RGB color.
 * @returns {void} Modifies the color object in place.
 *
 * @private
 */
function calcColor(fillStyleColor: ColorRef | ProcessedColor): void {
    if (fillStyleColor.hasEffects) {
        const hsvColor: HSVColor = toHsv(fillStyleColor.color as RgbColor);

        if (fillStyleColor.tint !== 0) {
            hsvColor.tint(fillStyleColor.tint);
        }
        if (fillStyleColor.shade !== 0) {
            hsvColor.shade(fillStyleColor.shade);
        }
        if (fillStyleColor.satMod !== 0) {
            hsvColor.satMod(fillStyleColor.satMod);
        }
        if (fillStyleColor.lumMod !== 0) {
            hsvColor.lumMod(fillStyleColor.lumMod);
        }
        if (fillStyleColor.hueMod !== 0) {
            hsvColor.hueMod(fillStyleColor.hueMod);
        }

        fillStyleColor.color = hsvColor.toRgb();
    }
}

/**
 * Retrieves the fill color for a shape based on quick style settings and theme data.
 * Resolves fill colors from theme fill style matrices, variant colors, or base colors.
 * Applies color modifiers (tint, shade, etc.) to generate the final fill color.
 *
 * @param {VisioShape} shape - Parsed Visio shape(s) for the vertex node
 * @param {ParsingContext} context - Parser context containing theme and shape data.
 * @returns {string | undefined} The resolved fill color in hex format (#RRGGBB), or undefined if not found.
 *
 * @private
 */
function getFillColor(shape: VisioShape, context: ParsingContext): string | undefined {
    const theme: VisioTheme | undefined = context.data.currentTheme ? context.data.currentTheme : undefined;
    if (!theme) {
        return undefined;
    }

    let fillStyle: { color?: ColorRef | ProcessedColor; name?: string } | null = null;
    let fillColorStyle: number = 0;

    if (shape) {
        fillColorStyle = shape.QuickFillColor;

        const matrix: number = shape.QuickFillMatrix;
        const index: number = matrix - 100;
        switch (matrix) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            if (theme.fillStyles && theme.fillStyles.length > 0) {
                fillStyle = theme.fillStyles[matrix - 1];
            }
            break;
        case 100:
        case 101:
        case 102:
        case 103:
            if (theme.isMonotoneVariant && theme.themeVariantStl !== undefined && theme.isMonotoneVariant[theme.themeVariantStl]) {
                fillColorStyle = 100;
            }
            if (theme.variantFillIdx && theme.themeVariantStl !== undefined && theme.fillStyles) {
                const variantRow: Array<number> = theme.variantFillIdx[theme.themeVariantStl];
                if (variantRow && variantRow[parseInt(index.toString(), 10)] !== undefined) {
                    fillStyle = theme.fillStyles[variantRow[parseInt(index.toString(), 10)] - 1];
                }
            }
            break;
        }
    }

    if (!fillColorStyle || !fillStyle) {
        return undefined;
    }

    if (fillStyle && fillStyle.color && (fillStyle.color as ColorRef).val !== 'phClr') {
        const colorValue: string = (fillStyle.color as ColorRef).val;
        return theme.baseColors[`${colorValue}`] ? theme.baseColors[`${colorValue}`] : undefined;
    }
    let variantColor: ProcessedColor | null = null;

    if (fillColorStyle < 8) {
        // Base color from scheme (colors 1-7)
        if (theme.baseColors) {
            const colorKey: string | undefined = getColorKeyFromId(fillColorStyle);
            if (colorKey && theme.baseColors[`${colorKey}`]) {
                variantColor = createProcessedColor(theme.baseColors[`${colorKey}`]);
            }
        }
    }
    else {
        // Variant colors (100-106, 200-206, etc.)
        let clrIndex: number = 0;
        if (fillColorStyle >= 200) {
            clrIndex = fillColorStyle - 200;
        } else if (fillColorStyle >= 100) {
            clrIndex = fillColorStyle - 100;
        }

        if (clrIndex >= 0 && clrIndex <= 6) {
            if (theme.themeVariantClr !== undefined && theme.variantsColors && theme.variantsColors.length > 0) {
                const variantIndex: number = theme.themeVariantClr % theme.variantsColors.length;
                const variantColors: ProcessedColor[] = theme.variantsColors[parseInt(variantIndex.toString(), 10)];
                if (variantColors && variantColors[parseInt(clrIndex.toString(), 10)]) {
                    variantColor = variantColors[parseInt(clrIndex.toString(), 10)];
                }
            }
        }
    }

    if (!variantColor) {
        return undefined;
    }

    if (fillStyle && fillStyle.color) {
        fillStyle.color.color = variantColor.color;
        calcColor(fillStyle.color);
        return toHexStr(fillStyle.color.color as RgbColor);
    }

    return undefined;
}

/**
 * Maps a fillColorStyle index to a color key in the theme color scheme.
 *
 * @param {number} colorId - The color ID (1-7).
 * @returns {string | undefined} The color key (e.g., 'dk1', 'accent1'), or undefined if not found.
 *
 * @private
 */
function getColorKeyFromId(colorId: number): string | undefined {
    const colorIdMap: Record<number, string> = {
        1: 'dk1',
        2: 'lt1',
        3: 'accent1',
        4: 'accent2',
        5: 'accent3',
        6: 'accent4',
        7: 'accent5'
    };
    return colorIdMap[parseInt(colorId.toString(), 10)];
}

/**
 * Parses node shadow properties (outer shadow effect) from a cell map.
 * Extracts shadow pattern, type, opacity, color, and offset from the provided cell data.
 * Logs warnings about EJ2 shadow limitations during parsing.
 *
 * @param {Map<string, CellMapValue>} cellMap - A Map containing shadow-related cell values (ShdwPattern, ShdwForegnd, etc.).
 * @param {ParsingContext} context - Parser utilities for logging warnings.
 * @returns {VisioNodeShadow} A VisioNodeShadow object containing shadow properties, or default values if shadow is disabled.
 *
 * @example
 * const shadow = parseVisioNodeShadow(cellMap, context);
 * console.log(`Shadow Color: ${shadow.shadowcolor}`);
 * console.log(`Shadow Opacity: ${shadow.shadowOpacity}`);
 *
 * @private
 */
export function parseVisioNodeShadow(cellMap: Map<string, CellMapValue>, context: ParsingContext): VisioNodeShadow { // Updated type
    const nodeShadow: VisioNodeShadow = new VisioNodeShadow();

    // ==================== Parse Shadow Enable Flags ====================
    nodeShadow.shadowPattern = cellMap.get('ShdwPattern') != null && cellMap.get('ShdwPattern') !== '0';
    nodeShadow.shapeShadowType = (cellMap.get('ShapeShdwType') != null && cellMap.get('ShapeShdwType')) as string;
    nodeShadow.shapeShadowShow = (cellMap.get('ShapeShdwShow') != null && cellMap.get('ShapeShdwShow')) as string;

    // Process shadow if both pattern and type are enabled
    if (nodeShadow.shadowPattern && nodeShadow.shapeShadowType) {
        // Log EJ2 shadow limitations
        context.addWarning('[WARNING] :: In EJ2, among the various shadow types, only \'Outer\' shadows are supported. Furthermore, within the \'Outer\' shadow type, the \'offset center\' effect cannot be replicated in EJ2. Additionally, EJ2 does not support a blur property for shadows, resulting in sharp-edged shadows only.');

        // ==================== Parse Shadow Opacity ====================
        // Shadow opacity is calculated as (1 - transparency)
        const shdwOpacity: number = safeNumber(cellMap.get('ShdwForegndTrans') as CellMapValue, 1); // Default to 1 if not found/invalid
        nodeShadow.shadowOpacity = (1 - shdwOpacity); // Opacity is 1 - transparency, clamped implicitly by range 0-1

        // ==================== Parse Shadow Color ====================
        nodeShadow.shadowcolor = cellMap.get('ShdwForegnd') != null ? (cellMap.get('ShdwForegnd') as string) : '#ffffff'; // Assert to string

        // ==================== Parse Shadow Offset ====================
        const shdwOffsetX: number = safeNumber(cellMap.get('ShapeShdwOffsetX') as CellMapValue, 0);
        const shdwOffsetY: number = safeNumber(cellMap.get('ShapeShdwOffsetY') as CellMapValue, 0);
        const shdwScaleFactor: number = safeNumber(cellMap.get('ShapeShdwScaleFactor') as CellMapValue, 0); // Default to 0 if not found/invalid

        // Calculate final shadow properties (offset, blur, etc.)
        nodeShadow.shadow = calculateShadowProperties(shdwOffsetX, shdwOffsetY, shdwScaleFactor);
    }

    return nodeShadow;
}

/**
 * Extracts media file relationships found under ../media/ targets.
 * Parses relationship XML elements to identify media resource references
 * (images, files, etc.) embedded in the Visio document.
 *
 * @param {OneOrMany<XmlRelationship>} relationshipInput - A single relationship object or array of relationship objects from the parsed XML.
 * @returns {VisioRelationship | undefined} A VisioRelationship object containing an array of media references with Id and Target,
 *                              or undefined if no media relationships are found.
 *
 * @example
 * const relationships = parserVisioRelationship(relElements);
 * relationships.media.forEach(m => console.log(`${m.Id}: ${m.Target}`));
 *
 * @private
 */
export function parserVisioRelationship(relationshipInput: OneOrMany<XmlRelationship>): VisioRelationship | undefined { // Updated type
    const relation: VisioRelationship = new VisioRelationship();

    // Normalize input to array (handle single object or existing array)
    const relationships: XmlRelationship[] = Array.isArray(relationshipInput)
        ? relationshipInput
        : [relationshipInput];

    // Iterate through relationships and extract media references
    for (const rel of relationships) {
        const target: string | undefined = rel.$.Target;
        const id: string = rel.$.Id;

        // Only include relationships that target media files
        if (target && target.startsWith('../media/')) {
            relation.media.push({ Id: id, Target: target });
        }
    }

    // Return the relationship object only if media was found, else undefined
    return relation.media.length > 0 ? relation : null;
}

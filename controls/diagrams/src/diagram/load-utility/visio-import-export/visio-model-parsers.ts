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
    ShapeAttributes,
    VisioShapeNode, // Added for getVisioPorts and parseVisioNodeStyle
    ThemeColorScheme,
    ThemeElements,
    ThemeExtList,
    ThemeExtension,
    VarStyle,
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
    FontStyles
} from './visio-types';

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
 * @returns {string[]} An array of normalized hex colors (e.g., ["#FF00AA", "#00FF00"]), or empty array if input is undefined.
 *
 * @private
 */
function extractHexColorsFromVariation(variation: VariationClrScheme | undefined): Array<string> {
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
            const varStyle: OneOrMany<VarStyle> | undefined = chosenStyle['vt:varStyle'] as OneOrMany<VarStyle> | undefined;
            const varStyleArr: ReadonlyArray<VarStyle> | undefined = toReadonlyArray<VarStyle>(
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

    return theme;
}

/**
 * Parses node styling properties (fills, strokes, gradients) from a shape's raw XML object.
 * Extracts fill colors, stroke properties, gradient settings, patterns, and opacity
 * from the shape's Cell and Section data.
 *
 * @param {VisioShapeNode} shapeData - The raw shape XML object containing Cell array and optional Section array.
 * @param {ParsingContext} context - Parser utilities for logging warnings and accessing parsing state.
 * @param {MasterDefaultValues | undefined} defaultStyle - Optional default style data to fall back to for undefined properties.
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
export function parseVisioNodeStyle(shapeData: VisioShapeNode, context: ParsingContext,
                                    defaultStyle: MasterDefaultValues | undefined, attributeName: string): VisioNodeStyle {

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

    // Initialize the node style object
    const nodeStyle: VisioNodeStyle = new VisioNodeStyle();

    // ==================== Parse Stroke Properties ====================
    nodeStyle.strokeWidth = getCell('LineWeight') != null ? Number(getCell('LineWeight')) : undefined;
    nodeStyle.linePattern = getCell('LinePattern') != null ? getCell('LinePattern') : undefined;
    nodeStyle.strokeColor = getCell('LineColor') != null ? (nodeStyle.linePattern !== '0' ? getCell('LineColor') : undefined) : undefined;
    nodeStyle.strokeDashArray = getCell('LinePattern') != null ? getCell('LinePattern') : undefined;

    // Log warning about partial pattern matching between Visio and EJ2
    if (getCell('LinePattern') != null) {
        context.addWarning('[WARNING] :: The dashed patterns in EJ2 partially match those in Visio. While the patterns themselves are similar, their appearance, particularly when adjusting the stroke width, is not identical.');
    }

    // ==================== Parse Fill Properties ====================
    nodeStyle.fillColor = getCell('FillForegnd') != null ? getCell('FillForegnd') : undefined;
    nodeStyle.fillPattern = getCell('FillPattern') != null ? getCell('FillPattern') : (defaultStyle && defaultStyle.FillPattern) ? defaultStyle.FillPattern : undefined;

    // ==================== Parse Opacity ====================
    // Image shapes use Transparency; other shapes use FillForegndTrans
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
        const shdwOpacity: number = cellMap.get('ShdwForegndTrans') != null ? Number(cellMap.get('ShdwForegndTrans')) : 1; // Default to 1 if not found
        nodeShadow.shadowOpacity = (1 - shdwOpacity); // Opacity is 1 - transparency, clamped implicitly by range 0-1

        // ==================== Parse Shadow Color ====================
        nodeShadow.shadowcolor = cellMap.get('ShdwForegnd') != null ? (cellMap.get('ShdwForegnd') as string) : '#ffffff'; // Assert to string

        // ==================== Parse Shadow Offset ====================
        const shdwOffsetX: number = cellMap.get('ShapeShdwOffsetX') != null ? Number(cellMap.get('ShapeShdwOffsetX')) : 0;
        const shdwOffsetY: number = cellMap.get('ShapeShdwOffsetY') != null ? Number(cellMap.get('ShapeShdwOffsetY')) : 0;
        const shdwScaleFactor: number = cellMap.get('ShapeShdwScaleFactor') != null ? Number(cellMap.get('ShapeShdwScaleFactor')) : 0; // Default to 0 if not found

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

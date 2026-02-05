import { Diagram } from '../../diagram';
import { PointModel } from '../../primitives/point-model';
import { UNIT_CONVERSION, DECORATOR_SIZE_MAP } from './visio-constants';
import { ParsingContext, VisioExportOptions } from './visio-import-export';
import { VisioDocumentSettings, VisioLayer, VisioPage, VisioWindow } from './visio-models';
import { LayerModel } from '../../diagram/layer-model';
import { DiagramConstraints, SnapConstraints } from '../../enum/enum';
import { Connector } from '../../objects/connector';
import { ImageModel, NodeModel, ShapeModel, TextModel } from '../../objects/node-model';
import { MinimalZipWriter } from './zipWriter';
import { XmlWriter } from './xml-write';
import { PathElement } from '../../core/elements/path-element';
import { ConnectorModel, StraightSegmentModel } from '../../objects/connector-model';
import { roundToPrecision } from './visio-core';
import { Gradient, LinearGradient, RadialGradient, Stop, TextStyle } from '../../core/appearance';
import { DiagramGradientModel, MarginModel, StopModel, TextStyleModel } from '../../core/appearance-model';
import { GroupableView } from '../../core/containers/container';
import { DiagramElement } from '../../core/elements/diagram-element';
import { AnnotationConstraints, ConnectorConstraints, NodeConstraints } from '../../enum/enum';
import { Hyperlink, PathAnnotation } from '../../objects/annotation';
import { PathAnnotationModel, ShapeAnnotationModel } from '../../objects/annotation-model';
import { FlowShape, Node } from '../../objects/node';
import { PathPort, PointPort } from '../../objects/port';
import { Rect } from '../../primitives/rect';
import { ConnectorFixedUserHandle} from '../../objects/fixed-user-handle';
import { getPathOffset , getAnnotationPosition} from '../../utility/diagram-util';
import { TextElement } from '../../core/elements/text-element';
import { SegmentInfo } from '../../rendering/canvas-interface';
import { UserHandle } from '../../interaction/selector';
import { IExportingEventArgs } from '../../objects/interface/IElement';

/**
 * Module-level variable to store global image mappings for the export session.
 * Maps node IDs to their corresponding image relationship IDs in the VSDX file.
 *
 * @type {Map<string, number>}
 * @private
 */
const globalImageMap: Map<string, number> = new Map<string, number>();

/**
 * Number of decimal places to use for coordinate precision in XML output.
 * Ensures accurate representation of spatial data in the VSDX format.
 *
 * @const {number}
 * @private
 */
const COORDINATE_PRECISION: number = 15;

/**
 * @interface Commands
 * Represents a drawing command used in SVG path data (or similar geometric definitions).
 * Each command specifies an operation (e.g., 'M' for moveto, 'L' for lineto, 'A' for arc)
 * and its associated coordinates or parameters.
 *
 * @property {string} type - The type of the command (e.g., 'M', 'L', 'C', 'A', 'Z')
 * @property {number} [x] - The x-coordinate for movement/line commands
 * @property {number} [y] - The y-coordinate for movement/line commands
 * @property {number} [x1] - The x-coordinate of the first control point for Bezier curves
 * @property {number} [x2] - The x-coordinate of the second control point for Bezier curves
 * @property {number} [y1] - The y-coordinate of the first control point for Bezier curves
 * @property {number} [y2] - The y-coordinate of the second control point for Bezier curves
 * @property {number} [rx] - The x-axis radius for elliptical arc commands
 * @property {number} [ry] - The y-axis radius for elliptical arc commands
 * @property {number} [angle] - The rotation angle of the ellipse for arc commands (in degrees)
 * @property {boolean} [largeArc] - The large-arc-flag for elliptical arc commands (true for >180°)
 * @property {boolean} [sweep] - The sweep-flag for elliptical arc commands (direction)
 *
 * @example
 * // MoveTo command
 * { type: 'M', x: 10, y: 20 }
 *
 * // Line command
 * { type: 'L', x: 100, y: 200 }
 *
 * // Cubic Bezier command
 * { type: 'C', x1: 50, y1: 60, x2: 70, y2: 80, x: 90, y: 100 }
 *
 * // Close path command
 * { type: 'Z' }
 */
interface Commands {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
    rx?: number;
    ry?: number;
    angle?: number;
    largeArc?: boolean;
    sweep?: boolean;
}

/**
 * @interface visioData
 * Represents a comprehensive data structure holding various Visio document-specific
 * settings and content, used as an intermediate model for VSDX export.
 *
 * This structure bridges Syncfusion Diagram objects and Visio XML output,
 * normalizing and organizing data for XML generation.
 *
 * @property {VisioWindow[]} windows - Array of Visio window/viewport objects
 *                                    Defines how the document appears when opened
 * @property {VisioPage[]} pages - Array of Visio page objects
 *                                Contains page-specific settings and content
 * @property {VisioDocumentSettings} documentSettings - Global document configuration
 *                                                     Includes snap, grid, protection settings
 *
 * @example
 * const visioData: visioData = {
 *   windows: [{ viewScale: 1.0, ... }],
 *   pages: [{ pageWidth: 8.5, pageHeight: 11, ... }],
 *   documentSettings: { dynamicGridEnabled: true, ... }
 * }
 */
interface visioData {
    windows: VisioWindow[],
    pages: VisioPage[],
    documentSettings: VisioDocumentSettings
}

/**
 * @interface shapeModel
 * Represents a simplified model for a shape, primarily used for identifying its
 * type and potentially other common properties like corner radius.
 *
 * This interface abstracts shape-specific attributes from the broader node model,
 * allowing shape type identification without coupling to the full NodeModel structure.
 *
 * @property {string} [shape] - Optional string indicating the specific shape type
 *                             (e.g., 'Rectangle', 'Ellipse', 'Circle', 'Triangle')
 * @property {number} [cornerRadius] - Optional corner radius for rounded rectangles (in pixels)
 *
 * @example
 * const model: shapeModel = {
 *   shape: 'Rectangle',
 *   cornerRadius: 10
 * }
 */
interface shapeModel {
    shape?: string;
    cornerRadius?: number;
}

/**
 * @interface Text
 * Defines an object that holds text content.
 * Used for type checking and duck-typing text nodes.
 *
 * @property {string} [text] - Optional text content string
 *
 * @example
 * const textObj: Text = { text: 'Hello World' };
 */
interface Text {
    text?: string;
}

/**
 * @interface BezierSegment
 * Defines a segment of a Bezier curve, typically characterized by control points.
 * Used when parsing and encoding curved connector paths.
 *
 * Each segment represents a cubic Bezier curve with two control points
 * (bezierPoint1 and bezierPoint2) that define the curve's shape.
 *
 * @property {PointModel} [bezierPoint1] - First control point of the Bezier segment
 * @property {PointModel} [bezierPoint2] - Second control point of the Bezier segment
 *
 * @example
 * const segment: BezierSegment = {
 *   bezierPoint1: { x: 50, y: 100 },
 *   bezierPoint2: { x: 150, y: 150 }
 * }
 */
interface BezierSegment {
    bezierPoint1?: PointModel;
    bezierPoint2?: PointModel;
}

/**
 * @interface NurbsValue
 * Represents NURBS (Non-uniform Rational B-spline) geometry data.
 * NURBS is used in Visio for representing complex smooth curves, particularly
 * for connector paths that require precise curve representation.
 *
 * @property {PointModel} [MoveTo] - Optional starting point for the NURBS path
 * @property {string} [NURBSTo] - Optional string containing the NURBS curve definition
 *                               Format: "knotLast,degree,xType,yType,x1,y1,k1,w1,x2,y2,k2,w2,..."
 *
 * @example
 * const nurbs: NurbsValue = {
 *   MoveTo: { x: 0, y: 0 },
 *   NURBSTo: "0.333,3,0,0,0.5,0.5,0,1"
 * }
 */
interface NurbsValue {
    MoveTo?: PointModel;
    NURBSTo?: string;
}

// Type alias for arrow shape names
type ArrowTypeName = 'None' | 'Arrow' | 'OpenArrow' | 'Square' | 'Circle' | 'Diamond' | 'Fletch' |
'OpenFetch' | 'IndentedArrow' | 'OutdentedArrow' | 'DoubleArrow';

export interface PaperSize {
    name: string;
    wIn: number; // width in inches (portrait base)
    hIn: number; // height in inches (portrait base)
    kind: number; // System.Drawing.Printing.PaperKind code
}

export interface PaperDetectionResult {
    isStandard: boolean;
    kind: number;                // PaperKind code; 0 if custom
    name: string;                // Paper name; '' if custom
    orientation: 'portrait' | 'landscape';
    multiple: number;            // scaling/tile multiple (integer >= 1)
    baseWidthIn: number;         // matched base size width in inches
    baseHeightIn: number;        // matched base size height in inches
}

/**
 * Exports a Syncfusion Diagram to a VSDX (Visio Drawing) file format.
 * This is the primary entry point for converting diagrams to Visio format.
 *
 * Process Flow:
 * 1. Convert diagram data to intermediate Visio format
 * 2. Generate XML content with master definitions and image handling
 * 3. Create document property files (core metadata)
 * 4. Package everything into a ZIP archive (VSDX format)
 * 5. Return ArrayBuffer containing the complete VSDX file
 *
 * @private
 * @async
 * @param {Diagram} diagram - The Syncfusion Diagram object to export
 * @param {string} pageName - The name to be given to the Visio page within the VSDX
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {Promise<ArrayBuffer>} A Promise that resolves with an ArrayBuffer containing
 *                                 the VSDX file's complete binary data, ready for download
 *
 * @example
 * const diagram = new Diagram({...});
 * const buffer = await exportToVsdx(diagram, 'My Diagram');
 * // buffer can now be saved to a file or sent to server
 *
 * @throws {Error} If diagram data is invalid or export process fails
 */
export async function exportToVsdx(diagram: Diagram, pageName: string, context: ParsingContext): Promise<ArrayBuffer> {
    // Step 1: Convert diagram data to Visio format
    // This creates intermediate data structures with normalized values
    const visioData: visioData = convertDiagramToVisioFormat(diagram, context);

    // Step 2: Generate XML content for Visio format with enhanced master handling
    // This includes all shapes, connectors, images, and master definitions
    const xmlFiles: Map<string, string | Uint8Array> = await generateVisioXmlContentWithMasters(visioData, diagram, pageName, context);

    // Step 3: Add document properties files (metadata like author, creation date)
    const docPropFiles: Map<string, string> = generateDocPropsFiles();
    docPropFiles.forEach((content: string, filename: string) => {
        xmlFiles.set(filename, content);
    });

    // Step 4: Create VSDX file (ZIP archive containing all XML and media)
    const vsdxBuffer: ArrayBuffer = createVsdxArchive(xmlFiles);

    return vsdxBuffer;
}

/**
 * Exports a Syncfusion Diagram to a VSDX file and triggers its download in the browser.
 * Convenience function that combines export with automatic file download.
 *
 * Process:
 * 1. Extract or use default options (fileName, pageName)
 * 2. Call exportToVsdx() to generate VSDX data
 * 3. Convert ArrayBuffer to base64 data URL
 * 4. Create temporary anchor element and trigger download
 * 5. Clean up temporary DOM elements
 *
 * @private
 * @async
 * @param {Diagram} diagram - The Syncfusion Diagram object to export
 * @param {VisioExportOptions} [options] - Optional configuration object
 * @param {string} [options.fileName='Sample.vsdx'] - The filename for the downloaded file
 * @param {string} [options.pageName='Page-1'] - The name of the page in the Visio document
 * @returns {Promise<void>} A Promise that resolves once the file download has been initiated
 *
 * @example
 * await exportToVsdxFile(diagram, {
 *     fileName: 'my-workflow.vsdx',
 *     pageName: 'Workflow Diagram'
 * });
 *
 * @note Browser must have user interaction for download to work (security restriction)
 */
export async function exportToVsdxFile(diagram: Diagram, options?: VisioExportOptions): Promise<void> {
    // Extract options with defaults
    const fileName: string = (options && options.fileName) ? options.fileName : 'Sample.vsdx';
    const pageName: string = (options && options.pageName) ? options.pageName : 'Page-1';
    // Create a new, clean context for this parsing operation.
    const context: ParsingContext = new ParsingContext(diagram);

    try {
        // Generate VSDX file as ArrayBuffer
        const arrayBuffer: ArrayBuffer = await exportToVsdx(diagram, pageName, context);

        // Convert ArrayBuffer to Uint8Array for easier manipulation
        const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);

        // Convert binary data to string (needed for base64 encoding)
        let binaryString: string = '';
        for (let i: number = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[parseInt(i.toString(), 10)]);
        }

        // Encode to base64 for data URL
        const base64: string = btoa(binaryString);
        const dataUrl: string = 'data:application/octet-stream;base64,' + base64;

        // Create temporary anchor element to trigger download
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up temporary element
        document.body.removeChild(a);
        // Signal completion
        context.triggerEvent('Export', { status: 'completed', logs: context.getWarnings() });
    } catch (error) {
        // Capture error and notify failure
        const msg: string = '[ERROR] :: Unknown error during VSDX export';
        context.addWarning(`${msg}`);
        const failedArgs: IExportingEventArgs = { status: 'failed', logs: [msg] } as IExportingEventArgs;
        context.triggerEvent('Export', failedArgs);
    }
}

/**
 * Generates the XML content for the VSDX file, including handling for masters and images.
 * This is a crucial orchestration function that coordinates the creation of various XML parts.
 *
 * Processing Steps:
 * 1. Create basic XML files (document.xml, pages.xml, windows.xml, etc.)
 * 2. Extract all unique shape types from diagram nodes
 * 3. Process and convert images to base64 format
 * 4. Generate master definitions for each shape type
 * 5. Create relationship files linking components
 * 6. Generate page content with shape instances
 * 7. Update content types XML with master information
 *
 * @private
 * @async
 * @param {visioData} visioData - The processed Visio data structure derived from the diagram
 * @param {Diagram} diagram - The Syncfusion Diagram object being exported
 * @param {string} pageName - The name of the page in the Visio document
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {Promise<Map<string, string | Uint8Array>>} A Promise that resolves with a Map
 *          where keys are file paths within the VSDX (e.g., 'visio/document.xml')
 *          and values are their corresponding XML content (string) or binary image data (Uint8Array)
 */
async function generateVisioXmlContentWithMasters(visioData: visioData, diagram: Diagram,
                                                  pageName: string, context: ParsingContext): Promise<Map<string, string | Uint8Array>> {
    // Initialize map to accumulate all XML files and binary data
    const xmlFiles: Map<string, string | Uint8Array> = new Map<string, string | Uint8Array>();

    // Step 1: Create foundational XML files (document structure, pages, windows, etc.)
    createBasicXmlFiles(xmlFiles, visioData, diagram, pageName);

    // Step 2: Extract all unique shape types and assign master IDs
    // This ensures each shape type gets its own Visio master definition
    const shapeTypes: Map<string, number> = extractShapeTypes(diagram);

    // Step 3: Process images from diagram nodes
    const imageSources: NodeModel[] = [];
    const imagePromises: Promise<void>[] = [];

    // Iterate through all nodes looking for image nodes
    diagram.nodes.forEach((node: NodeModel) => {
        if (node.shape.type === 'Image') {
            // TODO: Fix CORS issue when loading external images (e.g. SVG from Syncfusion CDN).
            // Currently blocked by browser policy, so onload never executes.
            // We will revisit this later to implement a workaround or host images with proper CORS headers.

            // // Check if source is already base64 or a file path
            // if ((node.shape as ImageModel).source && !(node.shape as ImageModel).source.startsWith('data:')) {
            //     // It's a file path, need to convert to base64
            //     const promise: Promise<void> = imageUrlToBase64((node.shape as ImageModel).source)
            //         .then((base64Data: string) => {
            //             // Store the base64 data back in the node
            //             (node.shape as ImageModel).source = base64Data;
            //             imageSources.push(node);
            //             // Map node ID to image index for later reference
            //             globalImageMap.set(node.id, imageSources.length + shapeTypes.size);
            //         })
            //         .catch((error: any) => {
            //             console.error('Error converting image to base64:', error);
            //             // Continue processing even if one image fails
            //         });
            //     imagePromises.push(promise);
            // } else {
            // Already base64 or data URL, use as-is
            imageSources.push(node);
            globalImageMap.set(node.id, imageSources.length + shapeTypes.size);
            // }
        }
    });

    // Wait for all image conversions to complete
    await Promise.all(imagePromises);

    // Step 4: Process images for media folder in VSDX
    imageSources.forEach((node: NodeModel, index: number) => {
        try {
            // Convert data URL to binary Uint8Array
            const imageData: Uint8Array = dataURLToUint8Array((node.shape as ImageModel).source);
            context.addWarning('[WARNING] :: Image nodes are exported to Visio, but image modification properties (e.g., brightness, contrast) are not applied because Visio does not support image editing properties.');

            // Store binary image data in media folder of VSDX
            xmlFiles.set(`visio/media/image${index + 1}.png`, imageData);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    });

    // Step 5: Generate masters XML and individual master files
    const masterFiles: Map<string, string> = generateMasterFiles(shapeTypes, diagram, context);

    // Add all master files to XML files collection
    masterFiles.forEach((content: string, filename: string) => {
        xmlFiles.set(filename, content);
    });

    // Step 6: Create relationship files (links between document parts)
    createRelationshipFiles(xmlFiles, shapeTypes, imageSources.length);

    // Step 7: Update content types XML to include all masters
    updateContentTypesForMasters(xmlFiles, shapeTypes);

    // Step 8: Generate page content with proper master references
    const pageContent: string = generatePageContentWithMasterRefs(visioData, diagram, shapeTypes, context);
    xmlFiles.set('visio/pages/page1.xml', pageContent);

    return xmlFiles;
}

// /**
//  * Converts an image URL to a Base64 data URL.
//  * This is particularly useful for embedding images directly into the VSDX XML.
//  *
//  * Process:
//  * 1. Create HTML Image element and load from URL
//  * 2. Draw image onto HTML Canvas
//  * 3. Export canvas as PNG data URL (base64 encoded)
//  * 4. Return base64 string or reject on error
//  *
//  * @private
//  * @async
//  * @param {string} url - The URL of the image to convert
//  * @returns {Promise<string>} A Promise that resolves with the Base64 data URL of the image
//  *                           (e.g., "data:image/png;base64,iVBORw0...")
//  * @throws {Error} If image fails to load (CORS issue, 404, etc.)
//  * @throws {Error} If canvas context cannot be obtained
//  * @throws {Error} If canvas.toDataURL() fails
//  *
//  * @example
//  * const base64 = await imageUrlToBase64('https://example.com/image.png');
//  * // base64 = "data:image/png;base64,iVBORw0KGgoAAAANS..."
//  *
//  * @note Requires CORS headers or same-origin image
//  */
// export async function imageUrlToBase64(url: string): Promise<string> {
// TODO: Fix CORS issue when loading external images (e.g. SVG from Syncfusion CDN).
// Currently blocked by browser policy, so onload never executes.
// We will revisit this later to implement a workaround or host images with proper CORS headers.

//     return new Promise((resolve: (value: string) => void, reject: any) => {
//         // Create image element to load URL
//         const img: HTMLImageElement = new Image();

//         // Allow cross-origin images (may still fail if CORS not configured)
//         img.crossOrigin = 'Anonymous';

//         // Handler when image successfully loads
//         img.onload = () => {
//             // Create canvas with same dimensions as image
//             const canvas: HTMLCanvasElement = document.createElement('canvas');
//             const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

//             if (!ctx) {
//                 reject(new Error('Could not get canvas context'));
//                 return;
//             }

//             // Set canvas size to match image
//             canvas.width = img.width;
//             canvas.height = img.height;

//             // Draw image onto canvas
//             ctx.drawImage(img, 0, 0);

//             try {
//                 // Export canvas as PNG data URL (base64 encoded)
//                 const dataURL: string = canvas.toDataURL('image/png');
//                 resolve(dataURL);
//             } catch (error) {
//                 reject(error);
//             }
//         };

//         // Handler when image fails to load
//         img.onerror = () => {
//             reject(new Error(`Failed to load image: ${url}`));
//         };

//         // Trigger image load
//         img.src = url;
//     });
// }

/**
 * Extracts all unique shape types from the diagram's nodes and maps them to unique master IDs.
 * This function ensures that each distinct shape type in the diagram gets its own Visio master,
 * enabling proper rendering and management of different shape styles.
 *
 * Algorithm:
 * 1. Initialize empty map for shape types
 * 2. Iterate through all nodes in diagram
 * 3. For non-image nodes, extract shape type (default to 'Rectangle')
 * 4. Add new shape types to map with sequential master IDs
 * 5. Return complete mapping of shape types to IDs
 *
 * @private
 * @param {Diagram} diagram - The Syncfusion Diagram object from which to extract shape types
 * @returns {Map<string, number>} A Map where keys are unique shape type strings
 *          (e.g., 'Rectangle', 'Ellipse', 'Circle') and values are their corresponding master IDs
 *
 * @example
 * const shapeTypes = extractShapeTypes(diagram);
 * // shapeTypes.get('Rectangle') = 1
 * // shapeTypes.get('Ellipse') = 2
 * // shapeTypes.get('Circle') = 3
 */
function extractShapeTypes(diagram: Diagram): Map<string, number> {
    // Map to store shape type -> master ID relationships
    const shapeTypes: Map<string, number> = new Map<string, number>();

    // Counter for assigning unique master IDs (start at 1)
    let masterId: number = 1;

    // Process all nodes in the diagram
    if (diagram.nodes && diagram.nodes.length > 0) {
        diagram.nodes.forEach((node: NodeModel) => {
            if (node.shape){
                // Skip image nodes (they're handled separately)
                if (node.shape.type !== 'Image' && (node.shape as shapeModel).shape) {
                    // Fix (Task 1004826): Previously defaulted missing shapes to 'Rectangle'
                    // and added unwanted master refs; now only explicit shape.shape gets a master.
                    const shapeType: string = (node.shape as shapeModel).shape;
                    // Add to shape types if not already present
                    if (!shapeTypes.has(shapeType)) {
                        shapeTypes.set(shapeType, masterId++);
                    }
                }
            }
        });
    }

    return shapeTypes;
}

/**
 * Converts SVG path data from a diagram node to Visio XML geometry format.
 * This function is the reverse of the determineShapeType method in visioProperties.ts
 * and handles various shape types including circles, ellipses, images, and custom paths.
 *
 * Supported shapes:
 * - Circle/Ellipse: Uses EllipticalArcTo commands
 * - Image: Creates simple rectangular geometry
 * - Custom paths: Parses SVG path data and converts to Visio geometry
 *
 * Algorithm for custom paths:
 * 1. Parse SVG path data into command array
 * 2. For each command, convert to appropriate Visio geometry row:
 *    - M (MoveTo) → MoveTo row
 *    - L (LineTo) → LineTo row
 *    - C (CubicBezier) → Multiple LineTo rows (approximation)
 *    - A (Arc) → EllipticalArcTo row
 *    - Z (Close) → LineTo back to start
 * 3. Convert pixel coordinates to inches using DPI
 * 4. Flip Y coordinates (Visio vs diagram coordinate systems)
 * 5. Generate formulas for relative positioning
 *
 * @private
 * @param {NodeModel} node - The diagram node containing the path data
 * @param {XmlWriter} writer - The XML writer to output the geometry
 * @returns {void} Returns nothing; writes Geometry section to the writer
 */
function convertPathDataToVisioGeometry(node: NodeModel, writer: XmlWriter): void {
    let pathData: string;
    const visibility: number = Number(!node.visible);

    // Special handling for circles and ellipses
    if (node.shape && ((node.shape as shapeModel).shape === 'Ellipse' || (node.shape as shapeModel).shape === 'Circle')) {
        // Convert to inches for Visio format
        const widthIn: number = node.width / UNIT_CONVERSION.SCREEN_DPI;
        const heightIn: number = node.height / UNIT_CONVERSION.SCREEN_DPI;

        // Generate ellipse geometry using two EllipticalArcTo commands (creates full circle)
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'Geometry');
        writer.writeAttributeString(null, 'IX', null, '0');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoFill');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoLine');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoShow');
        writer.writeAttributeString(null, 'V', null, visibility.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoSnap');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'F', null, 'No Formula');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoQuickDrag');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'F', null, 'No Formula');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'MoveTo');
        writer.writeAttributeString(null, 'IX', null, '1');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Width*0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, (heightIn / 2).toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Height*0.5');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'EllipticalArcTo');
        writer.writeAttributeString(null, 'IX', null, '2');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, widthIn.toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Width*1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, (heightIn / 2).toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Height*0.5');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'A');
        writer.writeAttributeString(null, 'V', null, (widthIn / 2).toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Width*0.5');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'B');
        writer.writeAttributeString(null, 'V', null, heightIn.toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Height*1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'C');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'U', null, 'DA');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'D');
        writer.writeAttributeString(null, 'V', null, (widthIn / heightIn).toFixed(3));
        writer.writeAttributeString(null, 'F', null, 'Width/Height*1');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'EllipticalArcTo');
        writer.writeAttributeString(null, 'IX', null, '3');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Geometry1.X1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, (heightIn / 2).toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Geometry1.Y1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'A');
        writer.writeAttributeString(null, 'V', null, (widthIn / 2).toFixed(3));
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Width*0.5');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'B');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeAttributeString(null, 'F', null, 'Height*0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'C');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'U', null, 'DA');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'D');
        writer.writeAttributeString(null, 'V', null, (widthIn / heightIn).toFixed(3));
        writer.writeAttributeString(null, 'F', null, 'Width/Height*1');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeEndElement(); // Section
        return; // geometry completed for ellipse/circle
    }

    // Special handling for image nodes
    else if (node.shape && node.shape.type === 'Image') {
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'Geometry');
        writer.writeAttributeString(null, 'IX', null, '0');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoFill');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoLine');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoShow');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoSnap');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoQuickDrag');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'RelMoveTo');
        writer.writeAttributeString(null, 'IX', null, '1');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'RelLineTo');
        writer.writeAttributeString(null, 'IX', null, '2');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'RelLineTo');
        writer.writeAttributeString(null, 'IX', null, '3');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'RelLineTo');
        writer.writeAttributeString(null, 'IX', null, '4');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'RelLineTo');
        writer.writeAttributeString(null, 'IX', null, '5');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeEndElement(); // Section
        return; // geometry completed for image
    }

    // Extract or generate SVG path data for custom shapes
    if (!node.wrapper || !node.wrapper.children || !node.wrapper.children[0] || !(node.wrapper.children[0] as PathElement).absolutePath) {
        // Generate default rectangular path if no path data exists
        const x: number = 0;
        const y: number = 0;
        const width: number = node.width;
        const height: number = node.height;
        pathData = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
    } else {
        // Use existing path data from node
        pathData = (node.wrapper.children[0] as PathElement).absolutePath;
    }

    // Parse SVG path data into individual commands
    const commands: Commands[] = parseSvgPathData(pathData);

    // Build Visio geometry section
    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'Geometry');
    writer.writeAttributeString(null, 'IX', null, '0');
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoFill');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLine');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoShow');
    writer.writeAttributeString(null, 'V', null, visibility.toString());
    writer.writeEndElement();

    let rowIndex: number = 1;
    let lastX: number = 0;
    let lastY: number = 0;
    let firstX: number = 0;
    let firstY: number = 0;
    let hasMoveTo: boolean = false;

    // Process each command and generate Visio rows
    for (let i: number = 0; i < commands.length; i++) {
        const cmd: Commands = commands[parseInt(i.toString(), 10)];

        // Function to flip Y coordinate (Visio uses inverted Y axis)
        const flipY: (y: number) => number = (y: number) => node.height - y;

        switch (cmd.type) {
        case 'M': // MoveTo command
            if (!hasMoveTo) {
                firstX = cmd.x;
                firstY = cmd.y;
                hasMoveTo = true;
            }
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'MoveTo');
            writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, (cmd.x / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Width*${cmd.x / node.width}`);
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, (flipY(cmd.y) / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Height*${flipY(cmd.y) / node.height}`);
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            lastX = cmd.x;
            lastY = cmd.y;
            break;

        case 'L': // LineTo command
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, (cmd.x / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Width*${cmd.x / node.width}`);
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, (flipY(cmd.y) / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Height*${flipY(cmd.y) / node.height}`);
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            lastX = cmd.x;
            lastY = cmd.y;
            break;

        case 'C': { // Cubic Bezier command
            // Approximate cubic Bezier curve with line segments
            // Control points: p0 (lastX,lastY), p1 (x1,y1), p2 (x2,y2), p3 (x,y)
            const p0: { x: number; y: number } = { x: lastX, y: lastY };
            const p1: { x: number; y: number } = { x: cmd.x1, y: cmd.y1 };
            const p2: { x: number; y: number } = { x: cmd.x2, y: cmd.y2 };
            const p3: { x: number; y: number } = { x: cmd.x, y: cmd.y };

            // Estimate number of segments needed for smooth approximation
            const segmentCount: number = estimateSegments(p0, p1, p2, p3, 8 /* px tolerance */);

            // Generate line segments to approximate the curve
            for (let i: number = 1; i <= segmentCount; i++) {
                const t: number = i / segmentCount;
                const pt: PointModel = cubicPoint(p0, p1, p2, p3, t);
                writer.writeStartElement(null, 'Row', null);
                writer.writeAttributeString(null, 'T', null, 'LineTo');
                writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'X');
                writer.writeAttributeString(null, 'V', null, (pt.x / UNIT_CONVERSION.SCREEN_DPI).toString());
                writer.writeAttributeString(null, 'U', null, 'IN');
                writer.writeAttributeString(null, 'F', null, `Width*${pt.x / node.width}`);
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Y');
                writer.writeAttributeString(null, 'V', null, (flipY(pt.y) / UNIT_CONVERSION.SCREEN_DPI).toString());
                writer.writeAttributeString(null, 'U', null, 'IN');
                writer.writeAttributeString(null, 'F', null, `Height*${flipY(pt.y) / node.height}`);
                writer.writeEndElement();
                writer.writeEndElement(); // Row
            }
            lastX = cmd.x;
            lastY = cmd.y;
            break;
        }

        case 'A': { // Elliptical Arc command
            // --- Inputs from parsed path command (absolute coordinates expected) ---
            const svgRadiusX: number = Math.abs(cmd.rx);
            const svgRadiusY: number = Math.abs(cmd.ry);
            const svgRotationDeg: number = cmd.angle;            // φ in degrees
            const isLargeArc: number = cmd.largeArc ? 1 : 0;     // SVG large-arc flag fA
            const isSweep: number = cmd.sweep ? 1 : 0;           // SVG sweep flag fS
            const startX: number = lastX;
            const startY: number = lastY;
            const endX: number = cmd.x;
            const endY: number = cmd.y;

            // If radii are zero, degrade to a line (Visio will draw a line).
            if (svgRadiusX === 0 || svgRadiusY === 0) {
                // (Optionally skip identical-point lines)
                if (!(endX === lastX && endY === lastY)) {
                    writer.writeStartElement(null, 'Row', null);
                    writer.writeAttributeString(null, 'T', null, 'LineTo');
                    writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());

                    // X
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'X');
                    writer.writeAttributeString(null, 'V', null, (endX / UNIT_CONVERSION.SCREEN_DPI).toString());
                    writer.writeAttributeString(null, 'U', null, 'IN');
                    writer.writeAttributeString(null, 'F', null, 'Width*' + (endX / node.width));
                    writer.writeEndElement();

                    // Y (flip to Visio coords)
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'Y');
                    writer.writeAttributeString(null, 'V', null, (flipY(endY) / UNIT_CONVERSION.SCREEN_DPI).toString());
                    writer.writeAttributeString(null, 'U', null, 'IN');
                    writer.writeAttributeString(null, 'F', null, 'Height*' + (flipY(endY) / node.height));
                    writer.writeEndElement();

                    writer.writeEndElement();
                }
                lastX = endX;
                lastY = endY;
                break;
            }

            // --- Compute ellipse center and angles per SVG spec (endpoint -> center) ---
            const arcParams: {
                cx: number; cy: number; theta1: number; deltaTheta: number; rx: number; ry: number; phiRad: number;
            } = computeSvgArcCenterParams(
                startX, startY, endX, endY,
                svgRadiusX, svgRadiusY,
                svgRotationDeg,
                isLargeArc, isSweep
            );
            // arcParams: { cx, cy, theta1, deltaTheta, rx, ry, phiRad }

            // Pick **control point** on the arc at mid-angle (recommended by Visio docs)
            const thetaMid: number = arcParams.theta1 + arcParams.deltaTheta / 2.0;
            const controlPoint: { x: number; y: number } = pointOnSvgArc(arcParams, thetaMid);

            // --- Compute Visio C (major axis angle) and D (axis ratio) ---
            // C = angle of major axis relative to x-axis; D = major/minor axis ratio
            // SVG rotation is the angle to ellipse x-axis. If rx >= ry, x-axis is major axis.
            let majorAxisAngleDeg: number;
            let axisRatio: number;
            if (arcParams.rx >= arcParams.ry) {
                majorAxisAngleDeg = svgRotationDeg;
                axisRatio = arcParams.rx / arcParams.ry;
            } else {
                majorAxisAngleDeg = svgRotationDeg + 90; // major axis is along the ellipse y-axis
                axisRatio = arcParams.ry / arcParams.rx;
            }
            // Clamp per Visio guidance to avoid unpredictable results
            if (!(axisRatio > 0)) { axisRatio = 1; }
            if (axisRatio > 1000) { axisRatio = 1000; }

            // --- Write EllipticalArcTo row (X,Y end; A,B control point; C angle; D ratio) ---
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'EllipticalArcTo');
            writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());

            // X (endX)
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, (endX / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, 'Width*' + (endX / node.width));
            writer.writeEndElement();

            // Y (endY) - flipped to Visio
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, (flipY(endY) / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, 'Height*' + (flipY(endY) / node.height));
            writer.writeEndElement();

            // A (control point x) - **point on the arc**, not radius
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'A');
            writer.writeAttributeString(null, 'V', null, (controlPoint.x / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, 'Width*' + (controlPoint.x / node.width));
            writer.writeEndElement();

            // B (control point y) - flipped
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'B');
            writer.writeAttributeString(null, 'V', null, (flipY(controlPoint.y) / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, 'Height*' + (flipY(controlPoint.y) / node.height));
            writer.writeEndElement();

            // C (major axis angle, degrees)
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'C');
            writer.writeAttributeString(null, 'V', null, majorAxisAngleDeg.toString());
            writer.writeAttributeString(null, 'U', null, 'DEG');
            writer.writeEndElement();

            // D (axis ratio = major/minor)
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'D');
            writer.writeAttributeString(null, 'V', null, axisRatio.toString());
            writer.writeEndElement();

            writer.writeEndElement(); // Row
            lastX = endX;
            lastY = endY;
            break;
        }

        case 'Z': // Close path (return to start)
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, (firstX / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Width*${firstX / node.width}`);
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, (flipY(firstY) / UNIT_CONVERSION.SCREEN_DPI).toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeAttributeString(null, 'F', null, `Height*${flipY(firstY) / node.height}`);
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            lastX = firstX;
            lastY = firstY;
            break;
        }
    }

    // Close geometry section
    writer.writeEndElement(); // Section
}

/**
 * Calculates a point on a cubic Bezier curve for a given parameter `t`.
 * Uses the standard cubic Bezier formula: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
 *
 * This is used when approximating cubic Bezier curves with line segments.
 *
 * @private
 * @param {PointModel} p0 - The starting control point (P0)
 * @param {PointModel} p1 - The first intermediate control point (P1)
 * @param {PointModel} p2 - The second intermediate control point (P2)
 * @param {PointModel} p3 - The ending control point (P3)
 * @param {number} t - The parameter along the curve, ranging from 0 to 1
 *                    (0 = start at p0, 1 = end at p3)
 * @returns {PointModel} The calculated point on the Bezier curve at parameter `t`
 *
 * @example
 * const midpoint = cubicPoint(p0, p1, p2, p3, 0.5);
 * // Returns point at 50% along the curve
 */
function cubicPoint(p0: PointModel, p1: PointModel, p2: PointModel, p3: PointModel, t: number): PointModel {
    const mt: number = 1 - t;
    const a: number = mt * mt * mt;
    const b: number = 3 * mt * mt * t;
    const c: number = 3 * mt * t * t;
    const d: number = t * t * t;

    return {
        x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
        y: a * p0.y + b * p1.y + c * p2.y + d * p3.y
    };
}

/**
 * Calculates the Euclidean distance between two points.
 * Used for estimating curve complexity and segment counts.
 *
 * Formula: distance = √((x2-x1)² + (y2-y1)²)
 *
 * @private
 * @param {PointModel} a - The first point
 * @param {PointModel} b - The second point
 * @returns {number} The distance between the two points
 *
 * @example
 * const dist = distance({x: 0, y: 0}, {x: 3, y: 4});
 * // Returns 5 (3-4-5 right triangle)
 */
function distance(a: PointModel, b: PointModel): number {
    const dx: number = a.x - b.x;
    const dy: number = a.y - b.y;
    return Math.hypot(dx, dy);
}

/**
 * Estimates the number of segments needed to approximate a cubic Bezier curve with a given pixel tolerance.
 * This heuristic aims to balance visual fidelity with the number of generated line segments.
 *
 * Algorithm:
 * 1. Calculate total length of control polygon (sum of distances between consecutive control points)
 * 2. Divide by tolerance to estimate segments needed
 * 3. Clamp result between 4 and 64 segments for reasonable performance
 *
 * @private
 * @param {PointModel} p0 - The starting control point of the Bezier curve
 * @param {PointModel} p1 - The first intermediate control point
 * @param {PointModel} p2 - The second intermediate control point
 * @param {PointModel} p3 - The ending control point
 * @param {number} [tolPx=6] - The pixel tolerance for the approximation
 *                            (lower = smoother curves, more segments)
 *                            Defaults to 6 pixels
 * @returns {number} The estimated number of line segments (between 4 and 64)
 *
 * @example
 * // Long, gradual curve might use 20+ segments
 * const segments1 = estimateSegments(p0, p1, p2, p3, 6);
 *
 * // Short, tight curve might use only 4 segments
 * const segments2 = estimateSegments(p0, p1, p2, p3, 20);
 */
function estimateSegments(p0: PointModel, p1: PointModel, p2: PointModel, p3: PointModel, tolPx: number): number {
    // Calculate total length of control polygon
    // This gives a rough upper bound on curve length
    const L: number =
        distance(p0, p1) +
        distance(p1, p2) +
        distance(p2, p3);

    // Estimate segments: L / tolerance, clamped between [4, 64]
    // Keep segments between reasonable bounds to balance quality and performance
    const n: number = Math.max(4, Math.min(64, Math.ceil(L / Math.max(1, tolPx))));
    return n;
}

/**
 * Parses SVG path data string into an array of drawing commands.
 * Supports all standard SVG path commands: M, L, H, V, C, A, Z (absolute and relative).
 *
 * Algorithm:
 * 1. Use regex to split path into command tokens and parameter groups
 * 2. For each command, parse parameters as numbers
 * 3. Convert to absolute coordinates (handle relative commands)
 * 4. Group parameters appropriately for each command type
 * 5. Store as Command objects for later processing
 *
 * Supported Commands:
 * - M/m: MoveTo - start a new subpath
 * - L/l: LineTo - draw line to point
 * - H/h: Horizontal LineTo - draw horizontal line
 * - V/v: Vertical LineTo - draw vertical line
 * - C/c: Cubic Bezier - draw cubic curve with two control points
 * - A/a: Elliptical Arc - draw arc with radius and sweep
 * - Z/z: ClosePath - close the current subpath
 *
 * @private
 * @param {string} pathData - The SVG path data string to parse
 *                           Example: "M 10,20 L 30,40 C 50,60 70,80 90,100 Z"
 * @returns {Commands[]} An array of parsed SVG path segments/commands
 *
 * @example
 * const commands = parseSvgPathData("M 0,0 L 100,0 L 100,100 Z");
 * // Returns:
 * // [
 * //   { type: 'M', x: 0, y: 0 },
 * //   { type: 'L', x: 100, y: 0 },
 * //   { type: 'L', x: 100, y: 100 },
 * //   { type: 'Z' }
 * // ]
 */
function parseSvgPathData(pathData: string): Commands[] {
    const commands: Commands[] = [];
    // Regex to match command letter followed by parameters
    const regex: RegExp = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
    let match: RegExpExecArray;

    // Track last coordinates for relative commands
    let lastX: number = 0;
    let lastY: number = 0;

    // Process each command token
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(pathData)) !== null) {
        const command: string = match[1];
        // Parse parameter string into array of numbers
        const params: number[] = match[2].trim()
            .split(/[\s,]+/)
            .filter((p: string) => p !== '')
            .map(parseFloat);

        switch (command) {
        case 'M': // MoveTo (absolute)
        case 'm': // MoveTo (relative)
            // MoveTo can have multiple coordinates (draws line to subsequent points)
            for (let i: number = 0; i < params.length; i += 2) {
                commands.push({
                    type: 'M',
                    x: params[parseInt(i.toString(), 10)],
                    y: params[parseInt(i.toString(), 10) + 1]
                });
                lastX = params[parseInt(i.toString(), 10)];
                lastY = params[parseInt(i.toString(), 10) + 1];
            }
            break;

        case 'L': // LineTo (absolute)
        case 'l': // LineTo (relative)
            for (let i: number = 0; i < params.length; i += 2) {
                commands.push({
                    type: 'L',
                    x: params[parseInt(i.toString(), 10)],
                    y: params[parseInt(i.toString(), 10) + 1]
                });
                lastX = params[parseInt(i.toString(), 10)];
                lastY = params[parseInt(i.toString(), 10) + 1];
            }
            break;

        case 'H': // Horizontal Line (absolute)
        case 'h': // Horizontal Line (relative)
            for (let i: number = 0; i < params.length; i++) {
                commands.push({
                    type: 'L',
                    x: params[parseInt(i.toString(), 10)],
                    y: lastY
                });
                lastX = params[parseInt(i.toString(), 10)];
            }
            break;

        case 'V': // Vertical Line (absolute)
        case 'v': // Vertical Line (relative)
            for (let i: number = 0; i < params.length; i++) {
                commands.push({
                    type: 'L',
                    x: lastX,
                    y: params[parseInt(i.toString(), 10)]
                });
                lastY = params[parseInt(i.toString(), 10)];
            }
            break;

        case 'C': // Cubic Bezier (absolute)
        case 'c': // Cubic Bezier (relative)
            // Each cubic bezier has 6 parameters: x1,y1 x2,y2 x,y
            for (let i: number = 0; i < params.length; i += 6) {
                commands.push({
                    type: 'C',
                    x1: params[parseInt(i.toString(), 10)],
                    y1: params[parseInt(i.toString(), 10) + 1],
                    x2: params[parseInt(i.toString(), 10) + 2],
                    y2: params[parseInt(i.toString(), 10) + 3],
                    x: params[parseInt(i.toString(), 10) + 4],
                    y: params[parseInt(i.toString(), 10) + 5]
                });
                lastX = params[parseInt(i.toString(), 10) + 4];
                lastY = params[parseInt(i.toString(), 10) + 5];
            }
            break;

        case 'A': // Elliptical Arc (absolute)
        case 'a': // Elliptical Arc (relative)
            // Each arc has 7 parameters: rx,ry x-axis-rotation large-arc-flag sweep-flag x,y
            for (let i: number = 0; i < params.length; i += 7) {
                commands.push({
                    type: 'A',
                    rx: params[parseInt(i.toString(), 10)],
                    ry: params[parseInt(i.toString(), 10) + 1],
                    angle: params[parseInt(i.toString(), 10) + 2],
                    largeArc: params[parseInt(i.toString(), 10) + 3] !== 0,
                    sweep: params[parseInt(i.toString(), 10) + 4] !== 0,
                    x: params[parseInt(i.toString(), 10) + 5],
                    y: params[parseInt(i.toString(), 10) + 6]
                });
                lastX = params[parseInt(i.toString(), 10) + 5];
                lastY = params[parseInt(i.toString(), 10) + 6];
            }
            break;

        case 'Z': // Close path (no parameters)
        case 'z':
            commands.push({
                type: 'Z'
            });
            break;
        }
    }

    return commands;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} deg - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(deg: number): number {
    return deg * Math.PI / 180;
}

/**
 * Clamps a value to the range [-1, 1].
 *
 * @param {number} x - Input value
 * @returns {number} Value limited between -1 and 1
 */
function clamp01(x: number): number {
    return Math.max(-1, Math.min(1, x));
}

/**
 * Converts an SVG elliptical-arc command (endpoint form)
 * into center parameterization (cx, cy, angles, radii).
 *
 * @param {number} x1 - Start point x
 * @param {number} y1 - Start point y
 * @param {number} x2 - End point x
 * @param {number} y2 - End point y
 * @param {number} rxIn - Input x-radius of ellipse
 * @param {number} ryIn - Input y-radius of ellipse
 * @param {number} xAxisRotationDeg - Rotation of ellipse x-axis in degrees
 * @param {number} largeArcFlag - 0 or 1, chooses large vs small arc
 * @param {number} sweepFlag - 0 or 1, chooses sweep direction
 * @returns {{cx:number, cy:number, theta1:number, deltaTheta:number, rx:number, ry:number, phiRad:number}}
 *          Center coordinates, start angle, angle delta, corrected radii, and rotation in radians
 */
function computeSvgArcCenterParams(
    x1: number, y1: number, x2: number, y2: number,
    rxIn: number, ryIn: number,
    xAxisRotationDeg: number,
    largeArcFlag: number, sweepFlag: number
): { cx: number; cy: number; theta1: number; deltaTheta: number; rx: number; ry: number; phiRad: number } {
    let rx: number = Math.abs(rxIn);
    let ry: number = Math.abs(ryIn);
    const phi: number = toRadians(xAxisRotationDeg); // rotation of ellipse x-axis

    // Step 1: (x1', y1') in ellipse-aligned frame
    const dx: number = (x1 - x2) / 2;
    const dy: number = (y1 - y2) / 2;
    const cosPhi: number = Math.cos(phi);
    const sinPhi: number = Math.sin(phi);
    const x1p: number = cosPhi * dx + sinPhi * dy;
    const y1p: number = -sinPhi * dx + cosPhi * dy;

    // Step 2: Correct radii if too small (per spec)
    const rCheck: number = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (rCheck > 1) {
        const scale: number = Math.sqrt(rCheck);
        rx *= scale;
        ry *= scale;
    }

    // Step 3: Center (cx', cy') in ellipse frame
    const sign: number = (largeArcFlag === sweepFlag) ? -1 : 1;
    const rx2: number = rx * rx;
    const ry2: number = ry * ry;
    const num: number = rx2 * ry2 - rx2 * (y1p * y1p) - ry2 * (x1p * x1p);
    const den: number = rx2 * (y1p * y1p) + ry2 * (x1p * x1p);
    const coef: number = (den === 0) ? 0 : sign * Math.sqrt(Math.max(0, num / den));

    const cxp: number = (coef * rx * y1p) / ry;
    const cyp: number = (coef * -ry * x1p) / rx;

    // Step 4: Transform center back
    const cx: number = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
    const cy: number = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

    /**
     * Get signed angle between two vectors (u→v).
     * @param {number} ux - X component of vector u
     * @param {number} uy - Y component of vector u
     * @param {number} vx - X component of vector v
     * @param {number} vy - Y component of vector v
     * @returns {number} Angle in radians (signed, positive = counterclockwise, negative = clockwise)
     */
    function angleBetween(ux: number, uy: number, vx: number, vy: number): number {
        const dot: number = ux * vx + uy * vy;
        const magU: number = Math.hypot(ux, uy);
        const magV: number = Math.hypot(vx, vy);
        const cosang: number = (magU === 0 || magV === 0) ? 1 : clamp01(dot / (magU * magV));
        const ang: number = Math.acos(cosang);
        const cross: number = ux * vy - uy * vx; // sign via 2D cross
        return (cross < 0 ? -ang : ang);
    }

    const ux: number = (x1p - cxp) / rx;
    const uy: number = (y1p - cyp) / ry;
    const vx: number = (-x1p - cxp) / rx;
    const vy: number = (-y1p - cyp) / ry;

    const theta1: number = angleBetween(1, 0, ux, uy);       // from (1,0) to u
    let deltaTheta: number = angleBetween(ux, uy, vx, vy);   // from u to v

    if (sweepFlag === 0 && deltaTheta > 0) { deltaTheta -= 2 * Math.PI; }
    if (sweepFlag === 1 && deltaTheta < 0) { deltaTheta += 2 * Math.PI; }

    return { cx, cy, theta1, deltaTheta, rx, ry, phiRad: phi };
}

/**
 * Computes a point on an SVG arc at a given angle θ,
 * using center parameterization of the ellipse.
 *
 * @param {{cx:number, cy:number, rx:number, ry:number, phiRad:number}} params - Arc center, radii, and rotation
 * @param {number} theta - Angle on ellipse (radians)
 * @returns {{x:number, y:number}} Point coordinates on the arc
 */
function pointOnSvgArc(
    params: { cx: number; cy: number; rx: number; ry: number; phiRad: number },
    theta: number
): { x: number; y: number } {
    const cosPhi: number = Math.cos(params.phiRad);
    const sinPhi: number = Math.sin(params.phiRad);
    const xp: number = params.rx * Math.cos(theta);
    const yp: number = params.ry * Math.sin(theta);
    return {
        x: cosPhi * xp - sinPhi * yp + params.cx,
        y: sinPhi * xp + cosPhi * yp + params.cy
    };
}

/**
 * Generates the XML content for a Visio Master shape definition.
 * Masters are reusable shape templates that define geometry, connection points, and styling.
 * Each unique shape type in the diagram gets its own master definition.
 *
 * Master Structure:
 * 1. MasterContents wrapper with proper namespaces
 * 2. Shapes collection containing one Shape element
 * 3. Cell definitions for positioning, sizing, flipping, etc.
 * 4. Geometry section with path data
 * 5. Connection section for connector attachment points
 * 6. Optional style information for gradients and shadows
 *
 * @private
 * @param {number} masterId - The ID of the master shape (used in relationships)
 * @param {string} shapeType - The type of the shape (e.g., 'Rectangle', 'Ellipse')
 * @param {ParsingContext} context - Parsing context for logging
 * @param {NodeModel} [node] - Optional. The node object with this shape type,
 *                            used to extract gradient styles and other properties
 * @returns {string} The XML content for the Visio Master shape as a complete MasterContents element
 *
 * @example
 * const masterXml = generateMasterContent(1, 'Rectangle', rectangleNode);
 * // Returns: <?xml version='1.0'...><MasterContents>...</MasterContents>
 *
 * @private
 */
function generateMasterContent(masterId: number, shapeType: string, context: ParsingContext, node?: NodeModel): string {
    const writer: XmlWriter = new XmlWriter();
    writer.writeStartDocument();

    // Add gradient support in master styles if present
    const hasGradient: boolean = !!(node && node.style && node.style.gradient && node.style.gradient.type !== 'None');

    // Handle shape flipping (mirror horizontally or vertically)
    const flipX: number = (node.flip === 1 || node.flip === 3) ? 1 : 0;
    const flipY: number = (node.flip === 2 || node.flip === 3) ? 1 : 0;

    if (node.flip) {
        context.addWarning('[WARNING] :: During export, port flip properties cannot be preserved because Visio does not provide separate flip settings for ports.');
    }
    // Generate complete MasterContents XML
    writer.writeStartElement(null, 'MasterContents', 'http://schemas.microsoft.com/office/visio/2012/main');
    writer.writeAttributeString('xmlns', 'r', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    writer.writeAttributeString('xml', 'space', null, 'preserve');
    writer.writeStartElement(null, 'Shapes', null);
    writer.writeStartElement(null, 'Shape', null);
    writer.writeAttributeString(null, 'ID', null, '5');
    writer.writeAttributeString(null, 'Type', null, 'Shape');
    writer.writeAttributeString(null, 'LineStyle', null, '3');
    writer.writeAttributeString(null, 'FillStyle', null, '3');
    writer.writeAttributeString(null, 'TextStyle', null, '3');

    // Insert connection section and optional FillStyle using XmlWriter
    if (hasGradient) {
        writer.writeStartElement(null, 'FillStyle', null);
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillPattern');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillForegnd');
        writer.writeAttributeString(null, 'V', null, colorNameToHex(node.style.fill));
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillGradientEnabled');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        // Only add ShdwPattern if shadow is not explicitly defined
        if (!node.shadow || !(node.constraints & NodeConstraints.Shadow)) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShdwPattern');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();
        }
        writer.writeEndElement(); // FillStyle
    }

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PinX');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PinY');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Width');
    writer.writeAttributeString(null, 'V', null, '1.5');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Height');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LocPinX');
    writer.writeAttributeString(null, 'V', null, '0.75');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeAttributeString(null, 'F', null, 'Width*0.5');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LocPinY');
    writer.writeAttributeString(null, 'V', null, '0.5');
    writer.writeAttributeString(null, 'U', null, 'IN');
    writer.writeAttributeString(null, 'F', null, 'Height*0.5');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Angle');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'U', null, 'DEG');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'FlipX');
    writer.writeAttributeString(null, 'V', null, flipX.toString());
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'FlipY');
    writer.writeAttributeString(null, 'V', null, flipY.toString());
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ResizeMode');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShapeSplit');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LineWeight');
    writer.writeAttributeString(null, 'V', null, '0.003333333333333333');
    writer.writeAttributeString(null, 'U', null, 'PT');
    writer.writeAttributeString(null, 'F', null, 'THEMEVAL("LineWeight",0.24PT)');
    writer.writeEndElement();

    // Generate geometry section based on path data if available
    convertPathDataToVisioGeometry(node, writer);

    writer.writeEndElement(); // Shape
    writer.writeEndElement(); // Shapes
    writer.writeEndElement(); // MasterContents

    return writer.text;
}

/**
 * Maps SVG stroke-dasharray patterns to Visio line pattern values.
 * Visio uses numeric codes (0-23) to represent different dash/dot line styles.
 *
 * Pattern Mapping:
 * - Solid lines (default): 0
 * - Various dash patterns: 1-23
 * - Each pattern has specific dash/space proportions
 *
 * Common patterns:
 * - '4 2': Dashes (value 2)
 * - '1 2': Dots (value 3)
 * - '4 2 1 2': Dash-dot (value 4)
 * - '2 2': Small dashes (value 9)
 *
 * Algorithm:
 * 1. Normalize dash array (remove extra spaces)
 * 2. Look up in pattern map
 * 3. Return numeric code or 0 (solid) if not found
 *
 * @private
 * @param {string | undefined} strokeDashArray - The SVG `stroke-dasharray` string
 *                                               (e.g., "4 2", "1 2", undefined)
 * @returns {string} The corresponding Visio line pattern value as a string (0-23)
 *
 * @example
 * getVisioLinePattern('4 2');      // Returns '2' (dashes)
 * getVisioLinePattern('1 2');      // Returns '3' (dots)
 * getVisioLinePattern(undefined);  // Returns '0' (solid)
 */
function getVisioLinePattern(strokeDashArray: string | undefined): string {
    // Mapping of SVG dash patterns to Visio line pattern values
    const dashPatternMap: { [key: string]: string } = {
        '4 2': '2',
        '1 2': '3',
        '4 2 1 2': '4',
        '4 2 1 2 1 2': '5',
        '4 2 4 2 1 2': '6',
        '8 2 2 2': '7',
        '8 2 2 2 2 2': '8',
        '2 2': '9',
        '4 4': '9',
        '1 1': '10',
        '2 2 1 2': '11',
        '2 2 1 2 1 2': '12',
        '2 2 2 2 1 2': '13',
        '4 2 2 2': '14',
        '4 2 2 2 2 2': '15',
        '8 4 8': '16',
        '1 4': '17',
        '8 4 1 4': '18',
        '8 2 1 2 1 2': '19',
        '8 2 8 2 1 2': '20',
        '16 2 4 2': '21',
        '16 2 4 2 4 2': '22',
        '4 2 4 2': '23'
    };

    // Return early if no dash array provided
    if (!strokeDashArray) {
        return '9'; // Simple dot pattern
    }

    // Normalize the dash array by removing extra spaces
    const normalizedDashArray: string = strokeDashArray.trim().replace(/\s+/g, ' ');

    // Look up pattern in map
    if (dashPatternMap[`${normalizedDashArray}`]) {
        return dashPatternMap[`${normalizedDashArray}`];
    }

    // Default to Simple dot pattern if pattern not found
    return '9';
}

/**
 * Calculates the angle of a linear gradient in radians.
 * Used when exporting gradient fill information to Visio.
 *
 * Algorithm:
 * 1. Calculate delta X and Y from gradient start to end points
 * 2. Use atan2 to get angle in radians (properly handles all quadrants)
 * 3. Return angle (not converted to degrees, as Visio expects radians)
 *
 * @private
 * @param {LinearGradient} gradient - The gradient object from which to calculate the angle
 * @returns {number} The calculated angle of the Visio gradient in radians
 *
 * @example
 * // Horizontal gradient (left to right)
 * const grad1 = {x1: 0, y1: 0, x2: 100, y2: 0};
 * calculateVisioGradientAngle(grad1);  // Returns 0
 *
 * // Vertical gradient (bottom to top)
 * const grad2 = {x1: 0, y1: 0, x2: 0, y2: 100};
 * calculateVisioGradientAngle(grad2);  // Returns π/2
 */
function calculateVisioGradientAngle(gradient: LinearGradient): number {
    // Calculate delta values
    const dx: number = gradient.x2 - gradient.x1;
    const dy: number = gradient.y2 - gradient.y1;

    // Calculate angle in radians using atan2 (handles all quadrants)
    const angle: number = Math.atan2(dy, dx);

    return angle;
}

/**
 * Determines the Visio gradient direction from coordinate pair.
 * Converts normalized gradient coordinates to the closest Visio direction value.
 *
 * Visio uses 8 primary directions for gradients:
 * - 0°: Horizontal (left to right)
 * - 45°: Diagonal (bottom-left to top-right)
 * - 90°: Vertical (bottom to top)
 * - 135°: Diagonal (bottom-right to top-left)
 * - 180°: Horizontal (right to left)
 * - 225°: Diagonal (top-right to bottom-left)
 * - 270°: Vertical (top to bottom)
 * - 315°: Diagonal (top-left to bottom-right)
 *
 * Algorithm:
 * 1. Normalize coordinates to 0-1 range
 * 2. Calculate angle in degrees using atan2
 * 3. Find closest Visio direction
 *
 * @private
 * @param {number} x1 - The x-coordinate of the first point (0-100 scale)
 * @param {number} y1 - The y-coordinate of the first point (0-100 scale)
 * @param {number} x2 - The x-coordinate of the second point (0-100 scale)
 * @param {number} y2 - The y-coordinate of the second point (0-100 scale)
 * @returns {number} The calculated gradient direction (0, 45, 90, 135, 180, 225, 270, or 315)
 *
 * @example
 * // Horizontal gradient
 * getVisioGradientDirectionFromCoordinates(0, 50, 100, 50);  // Returns 0
 *
 * // Vertical gradient
 * getVisioGradientDirectionFromCoordinates(50, 0, 50, 100);  // Returns 90
 */
function getVisioGradientDirectionFromCoordinates(x1: number, y1: number, x2: number, y2: number): number {
    // Normalize coordinates to a 0-1 scale (from 0-100 input)
    const normalizedX1: number = x1 / 100;
    const normalizedY1: number = y1 / 100;
    const normalizedX2: number = x2 / 100;
    const normalizedY2: number = y2 / 100;

    // Calculate angle in degrees
    let angleDeg: number = Math.atan2(normalizedY2 - normalizedY1, normalizedX2 - normalizedX1) * (180 / Math.PI);
    // Normalize to 0-360 range
    angleDeg = (angleDeg + 360) % 360;

    // Visio uses specific directions: 0, 45, 90, 135, 180, 225, 270, 315
    const directions: number[] = [0, 45, 90, 135, 180, 225, 270, 315];

    // Find closest direction to calculated angle
    let closestDir: number = 0;
    let minDiff: number = 360;

    for (const dir of directions) {
        const diff: number = Math.abs(angleDeg - dir);
        if (diff < minDiff) {
            minDiff = diff;
            closestDir = dir;
        }
    }

    return closestDir;
}

/**
 * Determines the Visio radial gradient type from center and focal point coordinates.
 * Visio supports 5 types of radial gradients, each with a different center location.
 *
 * Radial Gradient Types:
 * - 1: Center at bottom-right (cx=100, cy=100)
 * - 2: Center at bottom-left (cx=0, cy=100)
 * - 3: Center at middle (cx=50, cy=50) - DEFAULT
 * - 4: Center at top-right (cx=100, cy=0)
 * - 5: Center at top-left (cx=0, cy=0)
 *
 * Algorithm:
 * 1. Check center point coordinates
 * 2. Return matching type number
 * 3. Default to type 3 (centered) if no match
 *
 * @private
 * @param {number} cx - The x-coordinate of the center of the radial gradient (0-100 scale)
 * @param {number} cy - The y-coordinate of the center of the radial gradient (0-100 scale)
 * @param {number} fx - The x-coordinate of the focal point of the radial gradient
 * @param {number} fy - The y-coordinate of the focal point of the radial gradient
 * @returns {number} The corresponding Visio radial gradient type value (1-5)
 *
 * @example
 * // Centered gradient
 * getVisioRadialGradientType(50, 50, 50, 50);  // Returns 3
 *
 * // Corner gradient
 * getVisioRadialGradientType(0, 0, 0, 0);      // Returns 5
 */
function getVisioRadialGradientType(cx: number, cy: number, fx: number, fy: number): number {
    // Visio uses values 1-5 for different radial types based on center position
    if (cx === 100 && cy === 100) { return 1; } // Bottom-right
    if (cx === 0 && cy === 100) { return 2; }   // Bottom-left
    if (cx === 100 && cy === 0) { return 6; }   // Top-right
    if (cx === 0 && cy === 0) { return 7; }     // Top-left
    if (cx === 150 && cy === 100 && fx === 100 && fy === 100) { return 1; }

    // Default to centered (type 3)
    return 3;
}

/**
 * Generates the XML content for `masters.xml` and individual master files (`masterN.xml`)
 * for each unique shape type and connector type found in the diagram.
 *
 * This function ensures that each distinct shape and connector design has a corresponding
 * master definition in the VSDX file, allowing Visio to properly render the diagram.
 *
 * Process:
 * 1. Extract all connector types from diagram
 * 2. Generate masters.xml (index file listing all masters)
 * 3. For each shape type:
 *    a. Create master entry in masters.xml
 *    b. Generate individual master*.xml file with shape definition
 * 4. For connector types:
 *    a. Create master entry in masters.xml
 *    b. Generate individual master*.xml file with connector definition
 * 5. If diagram has background color, add Solid master for page background
 *
 * Master Hierarchy:
 * - masters.xml: List of all masters with metadata
 * - master1.xml: First master (usually first shape type)
 * - master2.xml: Second master
 * - ... etc ...
 *
 * @private
 * @param {Map<string, number>} shapeTypes - A map containing unique shape type names
 *                                          and their assigned master IDs (e.g., 'Rectangle' -> 1)
 * @param {Diagram} diagram - The Syncfusion Diagram object being exported
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {Map<string, string>} A Map where keys are file paths within the VSDX
 *         (e.g., 'visio/masters/masters.xml', 'visio/masters/master1.xml')
 *         and values are their corresponding XML content as strings
 *
 * @example
 * const masterFiles = generateMasterFiles(shapeTypes, diagram);
 * // Returns map with entries:
 * // 'visio/masters/masters.xml' -> '<Masters>...</Masters>'
 * // 'visio/masters/master1.xml' -> '<MasterContents>...</MasterContents>'
 * // 'visio/masters/master2.xml' -> '<MasterContents>...</MasterContents>'
 */
function generateMasterFiles(shapeTypes: Map<string, number>, diagram: Diagram, context: ParsingContext): Map<string, string> {
    const masterFiles: Map<string, string> = new Map<string, string>();
    const masterFiles1: Map<string, string> = new Map<string, string>();

    // Extract connector types and add to shapeTypes if needed
    extractConnectorTypes(diagram, shapeTypes);

    // Start building masters.xml with XML declaration
    const writer: XmlWriter = new XmlWriter();
    writer.writeStartDocument();
    writer.writeStartElement(null, 'Masters', 'http://schemas.microsoft.com/office/visio/2012/main');
    writer.writeAttributeString('xmlns', 'r', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    writer.writeAttributeString('xml', 'space', null, 'preserve');

    // Process each shape type and create master definitions
    shapeTypes.forEach((masterId: number, shapeType: string) => {
        if (shapeType === 'Dynamic connector') {
            // Special handling for connector master
            const uniqueId: string = generateUniqueId();
            const baseId: string = generateUniqueId();

            writer.writeStartElement(null, 'Master', null);
            writer.writeAttributeString(null, 'ID', null, masterId.toString());
            writer.writeAttributeString(null, 'NameU', null, 'Dynamic connector');
            writer.writeAttributeString(null, 'IsCustomNameU', null, '1');
            writer.writeAttributeString(null, 'Name', null, 'Dynamic connector');
            writer.writeAttributeString(null, 'IsCustomName', null, '1');
            writer.writeAttributeString(null, 'Prompt', null, 'Drag onto the page, then drag the ends to gray dots on shapes (green indicates connection).');
            writer.writeAttributeString(null, 'IconSize', null, '1');
            writer.writeAttributeString(null, 'AlignName', null, '2');
            writer.writeAttributeString(null, 'MatchByName', null, '0');
            writer.writeAttributeString(null, 'IconUpdate', null, '0');
            writer.writeAttributeString(null, 'UniqueID', null, `{${uniqueId}}`);
            writer.writeAttributeString(null, 'BaseID', null, `{${baseId}}`);
            writer.writeAttributeString(null, 'PatternFlags', null, '0');
            writer.writeAttributeString(null, 'Hidden', null, '0');
            writer.writeAttributeString(null, 'MasterType', null, '541');

            // OPEN PageSheet via writer (writer tracks the element)
            writer.writeStartElement(null, 'PageSheet', null);
            writer.writeAttributeString(null, 'LineStyle', null, '0');
            writer.writeAttributeString(null, 'FillStyle', null, '0');
            writer.writeAttributeString(null, 'TextStyle', null, '0');

            // Insert common PageSheet cells
            writer.writeRaw(commonXMLFormat());

            // Add per-master PageSheet cells
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PageWidth');
            writer.writeAttributeString(null, 'V', null, '3');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PageHeight');
            writer.writeAttributeString(null, 'V', null, '3');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'DrawingSizeType');
            writer.writeAttributeString(null, 'V', null, '4');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShapeKeywords');
            writer.writeAttributeString(null, 'V', null, 'Dynamic,connector,route,connect,line,combine,connection,association,conjunction,join');
            writer.writeEndElement();

            // CLOSE PageSheet properly
            writer.writeEndElement(); // </PageSheet>

            // Relationship
            writer.writeStartElement(null, 'Rel', null);
            writer.writeAttributeString('r', 'id', null, `rId${masterId}`);
            writer.writeEndElement();

            writer.writeEndElement(); // </Master>
        } else {
            // Regular shape master
            const uniqueId: string = generateUniqueId();
            const baseId: string = generateUniqueId();

            writer.writeStartElement(null, 'Master', null);
            writer.writeAttributeString(null, 'ID', null, masterId.toString());
            writer.writeAttributeString(null, 'NameU', null, shapeType);
            writer.writeAttributeString(null, 'IsCustomNameU', null, '1');
            writer.writeAttributeString(null, 'Name', null, shapeType);
            writer.writeAttributeString(null, 'IsCustomName', null, '1');
            writer.writeAttributeString(null, 'Prompt', null, 'Drag onto the page.');
            writer.writeAttributeString(null, 'IconSize', null, '1');
            writer.writeAttributeString(null, 'AlignName', null, '2');
            writer.writeAttributeString(null, 'MatchByName', null, '0');
            writer.writeAttributeString(null, 'IconUpdate', null, '1');
            writer.writeAttributeString(null, 'UniqueID', null, `{${uniqueId}}`);
            writer.writeAttributeString(null, 'BaseID', null, `{${baseId}}`);
            writer.writeAttributeString(null, 'PatternFlags', null, '0');
            writer.writeAttributeString(null, 'Hidden', null, '0');
            writer.writeAttributeString(null, 'MasterType', null, '2');

            // OPEN PageSheet via writer
            writer.writeStartElement(null, 'PageSheet', null);
            writer.writeAttributeString(null, 'LineStyle', null, '0');
            writer.writeAttributeString(null, 'FillStyle', null, '0');
            writer.writeAttributeString(null, 'TextStyle', null, '0');

            // Insert common PageSheet cells
            writer.writeRaw(commonXMLFormat());

            // Add per-master PageSheet cells
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PageWidth');
            writer.writeAttributeString(null, 'V', null, '4');
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PageHeight');
            writer.writeAttributeString(null, 'V', null, '4');
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'DrawingSizeType');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShapeKeywords');
            writer.writeAttributeString(null, 'V', null, `shape,geometry,${shapeType.toLowerCase()}`);
            writer.writeEndElement();

            // CLOSE PageSheet properly
            writer.writeEndElement(); // </PageSheet>

            // Relationship
            writer.writeStartElement(null, 'Rel', null);
            writer.writeAttributeString('r', 'id', null, `rId${masterId}`);
            writer.writeEndElement();

            writer.writeEndElement(); // </Master>
        }

        // Generate master content for non-connector shapes
        if (shapeType !== 'Dynamic connector') {
            // Find a node with this shape type to extract styling
            let nodeWithShape: NodeModel = null;
            if (diagram.nodes && diagram.nodes.length > 0) {
                for (const node of diagram.nodes) {
                    const nodeShapeType: string = node.shape && ((node.shape as shapeModel).shape || 'Rectangle');
                    if (nodeShapeType === shapeType) {
                        nodeWithShape = node;
                        break;
                    }
                }
            }
            // Generate master content file
            const masterContent: string = generateMasterContent(masterId, shapeType, context, nodeWithShape);
            masterFiles.set(`visio/masters/master${masterId}.xml`, masterContent);
        }
    });

    // Generate connector master files
    generateConnectorMasterFiles(shapeTypes, diagram, masterFiles);

    // Handle background color with Solid master if present
    if (diagram.backgroundColor && diagram.backgroundColor !== 'transparent') {
        const solidMasterId: number = shapeTypes.size + 1;
        const uniqueId: string = generateUniqueId();
        const baseId: string = generateUniqueId();

        writer.writeStartElement(null, 'Master', null);
        writer.writeAttributeString(null, 'ID', null, solidMasterId.toString());
        writer.writeAttributeString(null, 'NameU', null, 'Solid');
        writer.writeAttributeString(null, 'IsCustomNameU', null, '1');
        writer.writeAttributeString(null, 'Name', null, 'Solid');
        writer.writeAttributeString(null, 'IsCustomName', null, '1');
        writer.writeAttributeString(null, 'Prompt', null, '');
        writer.writeAttributeString(null, 'IconSize', null, '1');
        writer.writeAttributeString(null, 'AlignName', null, '2');
        writer.writeAttributeString(null, 'MatchByName', null, '0');
        writer.writeAttributeString(null, 'IconUpdate', null, '0');
        writer.writeAttributeString(null, 'UniqueID', null, `{${uniqueId}}`);
        writer.writeAttributeString(null, 'BaseID', null, `{${baseId}}`);
        writer.writeAttributeString(null, 'PatternFlags', null, '0');
        writer.writeAttributeString(null, 'Hidden', null, '0');
        writer.writeAttributeString(null, 'MasterType', null, '34');

        // OPEN PageSheet
        writer.writeStartElement(null, 'PageSheet', null);
        writer.writeAttributeString(null, 'LineStyle', null, '0');
        writer.writeAttributeString(null, 'FillStyle', null, '0');
        writer.writeAttributeString(null, 'TextStyle', null, '0');

        // Common cells
        writer.writeRaw(commonXMLFormat());

        // Solid-specific PageSheet cells
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PageWidth');
        writer.writeAttributeString(null, 'V', null, '5.5');
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PageHeight');
        writer.writeAttributeString(null, 'V', null, '4.25');
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'DrawingSizeType');
        writer.writeAttributeString(null, 'V', null, '2');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PrintPageOrientation');
        writer.writeAttributeString(null, 'V', null, '2');
        writer.writeEndElement();

        // Section User / Row msvSDContainerExcludedCategories
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'User');

        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'N', null, 'msvSDContainerExcludedCategories');

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Value');
        writer.writeAttributeString(null, 'V', null, 'DoNotContain');
        writer.writeAttributeString(null, 'U', null, 'STR');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Prompt');
        writer.writeAttributeString(null, 'V', null, '');
        writer.writeEndElement();

        writer.writeEndElement(); // </Row>
        writer.writeEndElement(); // </Section>

        // CLOSE PageSheet
        writer.writeEndElement(); // </PageSheet>

        // Relationship
        writer.writeStartElement(null, 'Rel', null);
        writer.writeAttributeString('r', 'id', null, `rId${solidMasterId}`);
        writer.writeEndElement();

        writer.writeEndElement(); // </Master>

        // Generate Solid master content (MasterContents)
        const solidContentWriter: XmlWriter = new XmlWriter();
        solidContentWriter.writeStartDocument();
        solidContentWriter.writeStartElement(null, 'MasterContents', 'http://schemas.microsoft.com/office/visio/2012/main');
        solidContentWriter.writeAttributeString('xmlns', 'r', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
        solidContentWriter.writeAttributeString('xml', 'space', null, 'preserve');

        solidContentWriter.writeStartElement(null, 'Shapes', null);
        solidContentWriter.writeStartElement(null, 'Shape', null);
        solidContentWriter.writeAttributeString(null, 'ID', null, '5');
        solidContentWriter.writeAttributeString(null, 'Type', null, 'Shape');
        solidContentWriter.writeAttributeString(null, 'LineStyle', null, '3');
        solidContentWriter.writeAttributeString(null, 'FillStyle', null, '3');
        solidContentWriter.writeAttributeString(null, 'TextStyle', null, '3');

        // PinX
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'PinX');
        solidContentWriter.writeAttributeString(null, 'V', null, '2.75');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();

        // PinY
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'PinY');
        solidContentWriter.writeAttributeString(null, 'V', null, '2.125');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();

        // Width
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Width');
        solidContentWriter.writeAttributeString(null, 'V', null, '5.5');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();

        // Height
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Height');
        solidContentWriter.writeAttributeString(null, 'V', null, '4.25');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();

        // LocPinX
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'LocPinX');
        solidContentWriter.writeAttributeString(null, 'V', null, '2.75');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Width*0.5');
        solidContentWriter.writeEndElement();

        // LocPinY
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'LocPinY');
        solidContentWriter.writeAttributeString(null, 'V', null, '2.125');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Height*0.5');
        solidContentWriter.writeEndElement();

        // ResizeMode
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'ResizeMode');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeEndElement();

        // Geometry Section
        solidContentWriter.writeStartElement(null, 'Section', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Geometry');
        solidContentWriter.writeAttributeString(null, 'IX', null, '0');

        // NoFill
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'NoFill');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeEndElement();

        // NoLine
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'NoLine');
        solidContentWriter.writeAttributeString(null, 'V', null, '1');
        solidContentWriter.writeEndElement();

        // NoShow
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'NoShow');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeEndElement();

        // NoSnap
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'NoSnap');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeEndElement();

        // Rows (MoveTo / LineTo ...)
        solidContentWriter.writeStartElement(null, 'Row', null);
        solidContentWriter.writeAttributeString(null, 'T', null, 'MoveTo');
        solidContentWriter.writeAttributeString(null, 'IX', null, '1');
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'X');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Y');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeEndElement(); // </Row>

        // LineTo IX=2
        solidContentWriter.writeStartElement(null, 'Row', null);
        solidContentWriter.writeAttributeString(null, 'T', null, 'LineTo');
        solidContentWriter.writeAttributeString(null, 'IX', null, '2');
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'X');
        solidContentWriter.writeAttributeString(null, 'V', null, '5.5');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Width*1');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Y');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeEndElement(); // </Row>

        // LineTo IX=3
        solidContentWriter.writeStartElement(null, 'Row', null);
        solidContentWriter.writeAttributeString(null, 'T', null, 'LineTo');
        solidContentWriter.writeAttributeString(null, 'IX', null, '3');
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'X');
        solidContentWriter.writeAttributeString(null, 'V', null, '5.5');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Width*1');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Y');
        solidContentWriter.writeAttributeString(null, 'V', null, '4.25');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Height*1');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeEndElement(); // </Row>

        // LineTo IX=4
        solidContentWriter.writeStartElement(null, 'Row', null);
        solidContentWriter.writeAttributeString(null, 'T', null, 'LineTo');
        solidContentWriter.writeAttributeString(null, 'IX', null, '4');
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'X');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Y');
        solidContentWriter.writeAttributeString(null, 'V', null, '4.25');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeAttributeString(null, 'F', null, 'Height*1');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeEndElement(); // </Row>

        // LineTo IX=5
        solidContentWriter.writeStartElement(null, 'Row', null);
        solidContentWriter.writeAttributeString(null, 'T', null, 'LineTo');
        solidContentWriter.writeAttributeString(null, 'IX', null, '5');
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'X');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeStartElement(null, 'Cell', null);
        solidContentWriter.writeAttributeString(null, 'N', null, 'Y');
        solidContentWriter.writeAttributeString(null, 'V', null, '0');
        solidContentWriter.writeAttributeString(null, 'U', null, 'IN');
        solidContentWriter.writeEndElement();
        solidContentWriter.writeEndElement(); // </Row>

        solidContentWriter.writeEndElement(); // </Section>
        solidContentWriter.writeEndElement(); // </Shape>
        solidContentWriter.writeEndElement(); // </Shapes>
        solidContentWriter.writeEndElement(); // </MasterContents>

        const solidMasterContent: string = solidContentWriter.text;
        masterFiles.set(`visio/masters/master${solidMasterId}.xml`, solidMasterContent);

        // Add Solid master to shapeTypes map
        shapeTypes.set('Solid', solidMasterId);
    }

    // CLOSE masters.xml and finalize
    writer.writeEndElement(); // </Masters>

    // Add all master files to results
    const mastersXml: string = writer.text;
    masterFiles1.set('visio/masters/masters.xml', mastersXml);
    masterFiles.forEach((value: string, key: string) => {
        masterFiles1.set(key, value);
    });

    return masterFiles1;
}

/**
 * Appends common XML formatting and cell data to an existing XML string.
 * Typically used for PageSheet sections within Visio master definitions.
 *
 * Adds standardized Visio page properties that are common to all masters:
 * - Shadow offset settings
 * - Scale and drawing settings
 * - Snap and inhibit behaviors
 * - Page protection flags
 * - UI visibility
 * - Drawing resize type
 *
 * @private
 * @returns {string} The updated XML string with common formatting applied
 *
 * @example
 * let xml = '<Master>...';
 * xml = commonXMLFormat(xml);
 * // xml now includes standard PageSheet cells
 *
 * @private
 */
function commonXMLFormat(): string {
    const writer: XmlWriter = new XmlWriter();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShdwOffsetX');
    writer.writeAttributeString(null, 'V', null, '0.125');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShdwOffsetY');
    writer.writeAttributeString(null, 'V', null, '-0.125');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PageScale');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'U', null, 'IN_F');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'DrawingScale');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'U', null, 'IN_F');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'DrawingScaleType');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'InhibitSnap');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PageLockReplace');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'U', null, 'BOOL');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PageLockDuplicate');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'U', null, 'BOOL');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'UIVisibility');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShdwType');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShdwObliqueAngle');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ShdwScaleFactor');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();
    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'DrawingResizeType');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();
    return writer.text;
}

/**
 * Creates and adds the necessary relationship XML files to the VSDX package.
 * Relationship files (.rels) define how different parts of the Visio document
 * (e.g., masters, pages, media) are linked together according to the Open Packaging Conventions.
 *
 * Relationship Files Created:
 * 1. visio/masters/_rels/masters.xml.rels: Links each master to its master*.xml file
 * 2. visio/pages/_rels/page1.xml.rels: Links page to masters and images
 * 3. visio/_rels/document.xml.rels: Links document to top-level resources
 * 4. visio/pages/_rels/pages.xml.rels: Links pages.xml to individual page files
 *
 * Algorithm:
 * 1. For each master, create a Relationship entry in masters.xml.rels
 * 2. For each master used in page and each image, create Relationship entries
 * 3. Create document relationships linking main resources
 * 4. Create pages relationships
 *
 * @private
 * @param {Map<string, string | Uint8Array>} xmlFiles - A map accumulating all XML contents
 *                                                       and binary data for the VSDX
 * @param {Map<string, number>} shapeTypes - A map containing unique shape type names
 *                                          and their assigned master IDs
 * @param {number} imageCount - The total number of images included in the document,
 *                             used for generating media relationships
 * @returns {void}
 *
 * @example
 * const xmlFiles = new Map();
 * const shapeTypes = new Map([['Rectangle', 1], ['Ellipse', 2]]);
 * createRelationshipFiles(xmlFiles, shapeTypes, 3);
 * // xmlFiles now contains 4 .rels files
 *
 * @private
 */
function createRelationshipFiles(
    xmlFiles: Map<string, string | Uint8Array>,
    shapeTypes: Map<string, number>,
    imageCount: number
): void {
    // Create masters relationship file
    // This links masters.xml to each individual master*.xml file
    const mastersRelsWriter: XmlWriter = new XmlWriter();
    mastersRelsWriter.writeStartDocument();
    mastersRelsWriter.writeStartElement(null, 'Relationships', 'http://schemas.openxmlformats.org/package/2006/relationships');

    // Add relationship for each master (including Solid master if present)
    shapeTypes.forEach((masterId: number, _shapeType: string) => {
        mastersRelsWriter.writeStartElement(null, 'Relationship', null);
        mastersRelsWriter.writeAttributeString(null, 'Id', null, `rId${masterId}`);
        mastersRelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/master');
        mastersRelsWriter.writeAttributeString(null, 'Target', null, `master${masterId}.xml`);
        mastersRelsWriter.writeEndElement();
    });

    mastersRelsWriter.writeEndElement(); // Relationships

    xmlFiles.set('visio/masters/_rels/masters.xml.rels', mastersRelsWriter.text);

    // Create page1 relationship file with references to masters and images
    const page1RelsWriter: XmlWriter = new XmlWriter();
    page1RelsWriter.writeStartDocument();
    page1RelsWriter.writeStartElement(null, 'Relationships', 'http://schemas.openxmlformats.org/package/2006/relationships');

    // Add relationship for each master used in the page
    let relId: number = 1;
    shapeTypes.forEach((masterId: number, _shapeType: string) => {
        page1RelsWriter.writeStartElement(null, 'Relationship', null);
        page1RelsWriter.writeAttributeString(null, 'Id', null, `rId${relId}`);
        page1RelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/master');
        page1RelsWriter.writeAttributeString(null, 'Target', null, `../masters/master${masterId}.xml`);
        page1RelsWriter.writeEndElement();
        relId++;
    });

    // Add relationships for each image in the media folder
    if (imageCount > 0) {
        for (let i: number = 1; i <= imageCount; i++) {
            page1RelsWriter.writeStartElement(null, 'Relationship', null);
            page1RelsWriter.writeAttributeString(null, 'Id', null, `rId${relId}`);
            page1RelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image');
            page1RelsWriter.writeAttributeString(null, 'Target', null, `../media/image${i}.png`);
            page1RelsWriter.writeEndElement();
            relId++;
        }
    }

    page1RelsWriter.writeEndElement(); // Relationships

    xmlFiles.set('visio/pages/_rels/page1.xml.rels', page1RelsWriter.text);

    // Create document relationships
    // Links document.xml to main resources (masters, pages, windows)
    const docRelsWriter: XmlWriter = new XmlWriter();
    docRelsWriter.writeStartDocument();
    docRelsWriter.writeStartElement(null, 'Relationships', 'http://schemas.openxmlformats.org/package/2006/relationships');
    docRelsWriter.writeStartElement(null, 'Relationship', null);
    docRelsWriter.writeAttributeString(null, 'Id', null, 'rId1');
    docRelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/masters');
    docRelsWriter.writeAttributeString(null, 'Target', null, 'masters/masters.xml');
    docRelsWriter.writeEndElement();
    docRelsWriter.writeStartElement(null, 'Relationship', null);
    docRelsWriter.writeAttributeString(null, 'Id', null, 'rId2');
    docRelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/pages');
    docRelsWriter.writeAttributeString(null, 'Target', null, 'pages/pages.xml');
    docRelsWriter.writeEndElement();
    docRelsWriter.writeStartElement(null, 'Relationship', null);
    docRelsWriter.writeAttributeString(null, 'Id', null, 'rId3');
    docRelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/windows');
    docRelsWriter.writeAttributeString(null, 'Target', null, 'windows.xml');
    docRelsWriter.writeEndElement();
    docRelsWriter.writeEndElement(); // Relationships

    xmlFiles.set('visio/_rels/document.xml.rels', docRelsWriter.text);

    // Create pages relationships
    // Links pages.xml to page1.xml
    const pagesRelsWriter: XmlWriter = new XmlWriter();
    pagesRelsWriter.writeStartDocument();
    pagesRelsWriter.writeStartElement(null, 'Relationships', 'http://schemas.openxmlformats.org/package/2006/relationships');
    pagesRelsWriter.writeStartElement(null, 'Relationship', null);
    pagesRelsWriter.writeAttributeString(null, 'Id', null, 'rId1');
    pagesRelsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/page');
    pagesRelsWriter.writeAttributeString(null, 'Target', null, 'page1.xml');
    pagesRelsWriter.writeEndElement();
    pagesRelsWriter.writeEndElement(); // Relationships

    xmlFiles.set('visio/pages/_rels/pages.xml.rels', pagesRelsWriter.text);
}

/**
 * Generates the XML content for a Visio page, including shapes, their master references,
 * and connector connections. This function is responsible for laying out the visual elements
 * on a Visio page based on the diagram data.
 *
 * Page Structure:
 * 1. PageContents wrapper with XML declaration and namespaces
 * 2. Shapes collection: All shape instances (nodes and connectors)
 * 3. Connects collection: All connector attachment points
 *
 * Algorithm:
 * 1. Add background shape if diagram has background color
 * 2. Process each node in diagram hierarchy:
 *    a. Generate shape XML with positioning, sizing, styling
 *    b. Handle groups and child nodes
 * 3. Process all connectors:
 *    a. Generate connector shape XML
 *    b. Add geometry for connector path
 * 4. Generate connects XML linking connectors to nodes/ports
 * 5. Return complete page content XML
 *
 * @private
 * @param {visioData} visioData - The processed Visio data structure
 * @param {Diagram} diagram - The Syncfusion Diagram object being exported
 * @param {Map<string, number>} shapeTypes - A map containing unique shape type names
 *                                          and their assigned master IDs
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {string} The XML content for the Visio page as a string
 *
 * @example
 * const pageXml = generatePageContentWithMasterRefs(visioData, diagram, shapeTypes);
 * // Returns: <?xml version='1.0'...><PageContents>...</PageContents>
 *
 * @private
 */
function generatePageContentWithMasterRefs(visioData: visioData, diagram: Diagram, shapeTypes: Map<string, number>,
                                           context: ParsingContext): string {
    const writer: XmlWriter = new XmlWriter();
    writer.writeStartDocument();
    writer.writeStartElement(null, 'PageContents', 'http://schemas.microsoft.com/office/visio/2012/main');
    writer.writeAttributeString('xmlns', 'r', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    writer.writeAttributeString('xml', 'space', null, 'preserve');

    let shapeId: number = 0;

    // Map to store Visio connection point indices for each Syncfusion port
    // Structure: nodeId -> (portId -> visioConnectionPointIndex)
    const portConnectionsMap: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();

    writer.writeStartElement(null, 'Shapes', null);

    // Add background shape if diagram has a background color
    if (diagram.backgroundColor && diagram.backgroundColor !== 'transparent') {
        const solidMasterId: number = shapeTypes.get('Solid');
        if (solidMasterId) {
            // Get page dimensions from visio data
            const page: VisioPage = visioData.pages[0];
            const pageWidth: number = page.pageWidth;
            const pageHeight: number = page.pageHeight;

            // Add the background shape as the first shape to ensure it's at the back
            writer.writeStartElement(null, 'Shape', null);
            writer.writeAttributeString(null, 'ID', null, (++shapeId).toString());
            writer.writeAttributeString(null, 'NameU', null, 'Solid');
            writer.writeAttributeString(null, 'Name', null, 'Solid');
            writer.writeAttributeString(null, 'Type', null, 'Shape');
            writer.writeAttributeString(null, 'Master', null, solidMasterId.toString());
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PinX');
            writer.writeAttributeString(null, 'V', null, (pageWidth / 2).toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'PinY');
            writer.writeAttributeString(null, 'V', null, (pageHeight / 2).toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Width');
            writer.writeAttributeString(null, 'V', null, pageWidth.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Height');
            writer.writeAttributeString(null, 'V', null, pageHeight.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'LocPinX');
            writer.writeAttributeString(null, 'V', null, (pageWidth / 2).toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'LocPinY');
            writer.writeAttributeString(null, 'V', null, (pageHeight / 2).toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'EventDrop');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'FillForegnd');
            writer.writeAttributeString(null, 'V', null, colorNameToHex(diagram.backgroundColor));
            writer.writeAttributeString(null, 'F', null, 'THEMEGUARD(MSOTINT(THEMEVAL("AccentColor"),-50))');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'FillBkgnd');
            writer.writeAttributeString(null, 'V', null, colorNameToHex(diagram.backgroundColor));
            writer.writeAttributeString(null, 'F', null, 'THEMEGUARD(SHADE(FillForegnd,LUMDIFF(THEMEVAL("FillColor"),THEMEVAL("FillColor2"))))');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ZOrderBack');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Section', null);
            writer.writeAttributeString(null, 'N', null, 'User');
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'N', null, 'msvVisioCreated');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Value');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Prompt');
            writer.writeAttributeString(null, 'V', null, '');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeEndElement(); // Section
            writer.writeStartElement(null, 'Section', null);
            writer.writeAttributeString(null, 'N', null, 'Geometry');
            writer.writeAttributeString(null, 'IX', null, '0');
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'MoveTo');
            writer.writeAttributeString(null, 'IX', null, '1');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, '2');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, pageWidth.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, '3');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, pageWidth.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, pageHeight.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, '4');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, pageHeight.toString());
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeStartElement(null, 'Row', null);
            writer.writeAttributeString(null, 'T', null, 'LineTo');
            writer.writeAttributeString(null, 'IX', null, '5');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'X');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Y');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeAttributeString(null, 'F', null, 'Inh');
            writer.writeEndElement();
            writer.writeEndElement(); // Row
            writer.writeEndElement(); // Section
            writer.writeEndElement(); // Shape
        }
    }

    // Process each top-level node in the diagram
    if (diagram.nodes && diagram.nodes.length > 0) {
        context.addWarning('[WARNING] :: All Nodes are exported as path shapes.');
        diagram.nodes.forEach((node: NodeModel) => {
            if ((node.shape as FlowShape).type === 'Flow') {
                context.addWarning('[WARNING] :: Flow shapes are exported but may appear visually different.');
            }
            // Only process root nodes (those without a parent)
            if (!(node as Node).parentId) {
                generateNodeShapeXML(writer, diagram.nameTable[node.id], diagram, shapeTypes, ++shapeId, portConnectionsMap, context);
                // Handle child nodes in groups
                if (node.children && node.children.length > 0) {
                    node.children.forEach((child: string) => {
                        ++shapeId;
                    });
                }
            }
        });
    }

    // Add connector shapes
    if (diagram.connectors && diagram.connectors.length > 0) {
        generateConnectorShapesXml(writer, diagram, shapeTypes, ++shapeId, portConnectionsMap, context, undefined);
    }

    writer.writeEndElement(); // Shapes

    // Generate the connections section (connector attachment points)
    writer.writeStartElement(null, 'Connects', null);
    if (diagram.connectors && diagram.connectors.length > 0) {
        generateConnectionsXml(writer, diagram, portConnectionsMap);
    }
    writer.writeEndElement(); // Connects

    writer.writeEndElement(); // PageContents

    return writer.text;
}

/**
 * Extracts the Base64 encoded string from a Data URL.
 * Separates the MIME type and encoding metadata from the actual base64 data.
 *
 * Data URL Format: data:[<mediatype>][;base64],<data>
 * Example: data:image/png;base64,iVBORw0KGgoAAAANS...
 *
 * Algorithm:
 * 1. Split on comma to separate header from data
 * 2. Return second part (the base64 string)
 * 3. Throw error if format is invalid
 *
 * @private
 * @param {string} dataURL - The Data URL string (e.g., "data:image/png;base64,iVBORw0...")
 * @returns {string} The Base64 encoded portion of the Data URL
 * @throws {Error} If the provided string is not a valid Data URL (missing comma)
 *
 * @example
 * const base64 = dataURLToBase64('data:image/png;base64,iVBORw0KGgo...');
 * // Returns: 'iVBORw0KGgo...'
 */
function dataURLToBase64(dataURL: string): string {
    const parts: string[] = dataURL.split(',');
    return parts[1];
}

/**
 * Converts a Base64 encoded Data URL to a Uint8Array.
 * Useful for processing image data as raw binary to be stored in the VSDX.
 *
 * Algorithm:
 * 1. Extract base64 string from data URL
 * 2. Decode base64 to binary string using atob()
 * 3. Convert each character to byte using charCodeAt()
 * 4. Create Uint8Array from bytes
 *
 * @private
 * @param {string} dataURL - The Data URL string (e.g., "data:image/png;base64,iVBORw0...")
 * @returns {Uint8Array} A Uint8Array containing the binary data of the image
 *
 * @example
 * const bytes = dataURLToUint8Array('data:image/png;base64,iVBORw0KGgo...');
 * // Returns: Uint8Array with binary image data
 */
function dataURLToUint8Array(dataURL: string): Uint8Array {
    const base64: string = dataURLToBase64(dataURL);
    const binaryString: string = atob(base64);
    const len: number = binaryString.length;
    const bytes: Uint8Array = new Uint8Array(len);
    for (let i: number = 0; i < len; i++) {
        bytes[parseInt(i.toString(), 10)] = binaryString.charCodeAt(i);
    }
    return bytes;
}

/**
 * Generates the XML representation of a single node shape for inclusion in the Visio page content.
 * This comprehensive function handles various node properties including position, size, styling,
 * annotations, ports, and constraints, converting them into Visio-compatible XML elements.
 * Also manages hierarchical structures for group nodes.
 *
 * Node Processing Steps:
 * 1. Extract shape type and determine master ID
 * 2. Calculate positioning in inches (convert from pixels)
 * 3. Convert colors to hex format
 * 4. Handle flipping and rotation
 * 5. Add styling (fill, stroke, gradients, shadows)
 * 6. Add annotations and text content
 * 7. Add ports for connector attachment
 * 8. Apply constraints
 * 9. Process child nodes for groups
 *
 * Special Cases:
 * - Group nodes: Type='Group' with nested Shapes
 * - Image nodes: Type='Foreign' with embedded image reference
 * - Regular nodes: Type='Shape' with master reference
 *
 * @private
 * @param {XmlWriter} writer - The XmlWriter instance used to generate the XML output
 * @param {NodeModel} node - The Syncfusion NodeModel object to convert to XML
 * @param {Diagram} diagram - The overall diagram object, providing context for calculations
 *                           (e.g., page dimensions, layers)
 * @param {Map<string, number>} shapeTypes - A map of shape type names to their corresponding Visio master IDs
 * @param {number} shapeId - The unique ID to assign to this shape in Visio
 *                          (incremented externally for each shape)
 * @param {Map<string, Map<string, number>>} portConnectionsMap - A map to store mapping from
 *                                                                nodeId -> (portId -> visioConnectionPointIndex)
 *                                                                for later use in connector connections
 * @param {ParsingContext} context - Parsing context for logging
 * @param {NodeModel} [groupNode] - Optional. If the current node is a child of a group,
 *                                 this is the parent group node (used for coordinate transformation)
 * @returns {void}
 */
function generateNodeShapeXML(
    writer: XmlWriter,
    node: NodeModel,
    diagram: Diagram,
    shapeTypes: Map<string, number>,
    shapeId: number,
    portConnectionsMap: Map<string, Map<string, number>>,
    context: ParsingContext,
    groupNode?: NodeModel
): void {
    // Fix (Task 1004826): Previously defaulted missing shapes to 'Rectangle' and
    // forced masterId to have value; now use master only when explicit shape.shape exists.
    // Get the shape type
    const shapeType: string = (node.shape && (node.shape as shapeModel).shape) ? (node.shape as shapeModel).shape : null;
    const masterId: number = shapeType ? shapeTypes.get(shapeType) : null;
    const pageDimension: { width: number, height: number } = getPageDimension(diagram);
    const pageHeight: number = pageDimension.height;

    // Calculate positions in inches (Visio uses inches, diagrams use pixels)
    // pinX and pinY are the center points of the shape
    let pinX: number = (node.offsetX || 0) / UNIT_CONVERSION.SCREEN_DPI;
    let pinY: number = (pageHeight - node.offsetY) / UNIT_CONVERSION.SCREEN_DPI;

    // Width and height converted to inches
    const width: number = (node.width) / UNIT_CONVERSION.SCREEN_DPI;
    const height: number = (node.height) / UNIT_CONVERSION.SCREEN_DPI;

    // Local pin (relative to shape's local origin)
    // Pivot point determines rotation center
    const locPinX: number = width * node.wrapper.pivot.x;
    const locPinY: number = height * node.wrapper.pivot.y;

    // Generate fill and line color values with fallbacks
    const fillColor: string = colorNameToHex(node.style.fill);
    const fillPattern: number = (node.style.fill === 'transparent') ? 0 : 1;
    const strokeColor: string = colorNameToHex(node.style.strokeColor);
    const lineWeight: number = (node.style && node.style.strokeWidth) / UNIT_CONVERSION.SCREEN_DPI;

    // Corner radius for rounded rectangles
    const rounding: number = ((node.shape as shapeModel).cornerRadius) / 72;

    // Glue type determines how connectors attach to shape
    let glueType: number = 0;
    if (!(node.constraints & NodeConstraints.InConnect) || !(node.constraints & NodeConstraints.OutConnect)) {
        glueType = 8; // Glue to connection points
    }

    // Find which layer this node belongs to
    let layerMember: number = 0;
    for (let i: number = 0; i < diagram.layers.length; i++) {
        if ((diagram.layers[parseInt(i.toString(), 10)].objects as string[]).indexOf(node.id) !== -1) {
            layerMember = i;
            break;
        }
    }

    // Handle group nodes (containers with child shapes)
    if (node.children && node.children.length > 0) {
        writer.writeStartElement(null, 'Shape', null);
        writer.writeAttributeString(null, 'ID', null, shapeId.toString());
        writer.writeAttributeString(null, 'Type', null, 'Group');
        writer.writeAttributeString(null, 'LineStyle', null, '3');
        writer.writeAttributeString(null, 'FillStyle', null, '3');
        writer.writeAttributeString(null, 'TextStyle', null, '3');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinX');
        writer.writeAttributeString(null, 'V', null, pinX.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinY');
        writer.writeAttributeString(null, 'V', null, pinY.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Width');
        writer.writeAttributeString(null, 'V', null, width.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Height');
        writer.writeAttributeString(null, 'V', null, height.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinX');
        writer.writeAttributeString(null, 'V', null, locPinX.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinY');
        writer.writeAttributeString(null, 'V', null, locPinY.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Angle');
        writer.writeAttributeString(null, 'V', null, (node.rotateAngle ? (node.rotateAngle * (Math.PI / 180) * -1) : 0).toString());
        writer.writeAttributeString(null, 'U', null, 'RAD');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillPattern');
        writer.writeAttributeString(null, 'V', null, fillPattern.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillForegnd');
        writer.writeAttributeString(null, 'V', null, fillColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineColor');
        writer.writeAttributeString(null, 'V', null, strokeColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Rounding');
        writer.writeAttributeString(null, 'V', null, rounding.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineWeight');
        writer.writeAttributeString(null, 'V', null, lineWeight.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'GlueType');
        writer.writeAttributeString(null, 'V', null, glueType.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LayerMember');
        writer.writeAttributeString(null, 'V', null, layerMember.toString());
        writer.writeEndElement();
    }
    // Handle image nodes (embedded graphics)
    else if (node.shape.type === 'Image') {
        writer.writeStartElement(null, 'Shape', null);
        writer.writeAttributeString(null, 'ID', null, shapeId.toString());
        writer.writeAttributeString(null, 'Type', null, 'Foreign');
        writer.writeAttributeString(null, 'LineStyle', null, '2');
        writer.writeAttributeString(null, 'FillStyle', null, '2');
        writer.writeAttributeString(null, 'TextStyle', null, '2');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinX');
        writer.writeAttributeString(null, 'V', null, pinX.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinY');
        writer.writeAttributeString(null, 'V', null, pinY.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Width');
        writer.writeAttributeString(null, 'V', null, width.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Height');
        writer.writeAttributeString(null, 'V', null, height.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinX');
        writer.writeAttributeString(null, 'V', null, locPinX.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinY');
        writer.writeAttributeString(null, 'V', null, locPinY.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Angle');
        writer.writeAttributeString(null, 'V', null, (node.rotateAngle ? (node.rotateAngle * (Math.PI / 180) * -1) : 0).toString());
        writer.writeAttributeString(null, 'U', null, 'RAD');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillPattern');
        writer.writeAttributeString(null, 'V', null, fillPattern.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillForegnd');
        writer.writeAttributeString(null, 'V', null, fillColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineColor');
        writer.writeAttributeString(null, 'V', null, strokeColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Rounding');
        writer.writeAttributeString(null, 'V', null, rounding.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineWeight');
        writer.writeAttributeString(null, 'V', null, lineWeight.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'GlueType');
        writer.writeAttributeString(null, 'V', null, glueType.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ImgOffsetX');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'F', null, 'ImgWidth*0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ImgOffsetY');
        writer.writeAttributeString(null, 'V', null, '0');
        writer.writeAttributeString(null, 'F', null, 'ImgHeight*0');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ImgWidth');
        writer.writeAttributeString(null, 'V', null, width.toString());
        writer.writeAttributeString(null, 'F', null, 'Width*1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ImgHeight');
        writer.writeAttributeString(null, 'V', null, height.toString());
        writer.writeAttributeString(null, 'F', null, 'Height*1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ClippingPath');
        writer.writeAttributeString(null, 'V', null, '');
        writer.writeAttributeString(null, 'E', null, '#N/A');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LayerMember');
        writer.writeAttributeString(null, 'V', null, layerMember.toString());
        writer.writeEndElement();

        // Get the relationship ID for this image (if it exists)
        const imageIndex: number = globalImageMap.get(node.id);
        if (imageIndex) {
            writer.writeStartElement(null, 'ForeignData', null);
            writer.writeAttributeString(null, 'ForeignType', null, 'Bitmap');
            writer.writeAttributeString(null, 'CompressionType', null, 'JPEG');
            writer.writeAttributeString(null, 'CompressionLevel', null, '0.05');
            writer.writeStartElement(null, 'Rel', null);
            writer.writeAttributeString('r', 'id', null, `rId${imageIndex}`);
            writer.writeEndElement(); // Rel
            writer.writeEndElement(); // ForeignData
        }
    }
    // Handle regular shape nodes (most common case)
    else {
        // If this is a child node of a group, adjust coordinates relative to group
        if ((node as Node).parentId && groupNode) {
            const dpiScale: number = UNIT_CONVERSION.SCREEN_DPI;
            pinX = ((node.wrapper.bounds.x - groupNode.wrapper.bounds.x) + node.width / 2) / dpiScale;
            pinY = (Number(groupNode.height) - ((node.wrapper.bounds.y - groupNode.wrapper.bounds.y) + node.height / 2)) / dpiScale;
        }

        writer.writeStartElement(null, 'Shape', null);
        writer.writeAttributeString(null, 'ID', null, shapeId.toString());
        writer.writeAttributeString(null, 'NameU', null, shapeType);
        writer.writeAttributeString(null, 'Name', null, shapeType);
        writer.writeAttributeString(null, 'Type', null, 'Shape');
        // Fix (Task 1004826): Previously always wrote a Master attribute;
        // now only write it when a valid explicit masterId exists.
        if (masterId){
            writer.writeAttributeString(null, 'Master', null, masterId.toString());
        }
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinX');
        writer.writeAttributeString(null, 'V', null, pinX.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinY');
        writer.writeAttributeString(null, 'V', null, pinY.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Width');
        writer.writeAttributeString(null, 'V', null, width.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Height');
        writer.writeAttributeString(null, 'V', null, height.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinX');
        writer.writeAttributeString(null, 'V', null, locPinX.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinY');
        writer.writeAttributeString(null, 'V', null, locPinY.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Angle');
        writer.writeAttributeString(null, 'V', null, (node.rotateAngle ? (node.rotateAngle * (Math.PI / 180) * -1) : 0).toString());
        writer.writeAttributeString(null, 'U', null, 'RAD');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillPattern');
        writer.writeAttributeString(null, 'V', null, fillPattern.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'FillForegnd');
        writer.writeAttributeString(null, 'V', null, fillColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineColor');
        writer.writeAttributeString(null, 'V', null, strokeColor);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Rounding');
        writer.writeAttributeString(null, 'V', null, rounding.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LineWeight');
        writer.writeAttributeString(null, 'V', null, lineWeight.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'GlueType');
        writer.writeAttributeString(null, 'V', null, glueType.toString());
        writer.writeAttributeString(null, 'U', null, 'IN');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LayerMember');
        writer.writeAttributeString(null, 'V', null, layerMember.toString());
        writer.writeEndElement();
    }

    // Add detailed styling properties for non-group nodes
    if (!(node.children && node.children.length > 0)) {
        // Add transparency/opacity
        if (node.style && node.style.opacity !== undefined) {
            // Convert opacity to transparency (Visio uses transparency where 0 is opaque, 1 is transparent)
            const transparency: number = 1 - node.style.opacity;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'FillForegndTrans');
            writer.writeAttributeString(null, 'V', null, transparency.toString());
            writer.writeEndElement();
        }

        // Add line dash pattern if present
        if (node.style && node.style.strokeDashArray) {
            context.addWarning('[WARNING] :: Stroke dash arrays are approximated from Visio');
            const linePattern: string = getVisioLinePattern(node.style.strokeDashArray);
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'LinePattern');
            writer.writeAttributeString(null, 'V', null, linePattern);
            writer.writeEndElement();
        }

        // Add tooltip/comment if present
        if (node.constraints & NodeConstraints.Tooltip) {
            const tooltip: string | HTMLElement = node.tooltip.content;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Comment');
            writer.writeAttributeString(null, 'V', null, tooltip.toString());
            writer.writeEndElement();
        }

        // Add gradient information if present in the node style
        if (node.style && node.style.gradient && node.style.gradient.type !== 'None') {
            const gradient: Gradient | LinearGradient | RadialGradient | DiagramGradientModel = node.style.gradient;

            // Enable gradient fill
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'FillGradientEnabled');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeEndElement();

            // Set gradient start color and transparency
            if (gradient.stops && gradient.stops.length > 0) {
                const firstStop: StopModel = gradient.stops[0];
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'FillForegnd');
                writer.writeAttributeString(null, 'V', null, colorNameToHex(firstStop.color));
                writer.writeEndElement();

                // Add transparency if specified for first stop
                if (firstStop.opacity !== undefined) {
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'FillForegndTrans');
                    writer.writeAttributeString(null, 'V', null, (1 - firstStop.opacity).toString());
                    writer.writeEndElement();
                }
            }

            // Handle linear gradients
            if (gradient.type === 'Linear') {
                // Get gradient direction from coordinates
                let gradientDir: number = 0;
                if ((gradient as LinearGradient).x1 !== undefined && (gradient as LinearGradient).y1 !== undefined &&
                    (gradient as LinearGradient).x2 !== undefined && (gradient as LinearGradient).y2 !== undefined) {
                    gradientDir = getVisioGradientDirectionFromCoordinates(
                        (gradient as LinearGradient).x1, (gradient as LinearGradient).y1,
                        (gradient as LinearGradient).x2, (gradient as LinearGradient).y2
                    );
                }

                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'FillGradientDir');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();

                // Calculate gradient angle
                const gradientAngle: number = calculateVisioGradientAngle(gradient as LinearGradient);

                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'FillGradientAngle');
                writer.writeAttributeString(null, 'V', null, gradientAngle.toString());
                writer.writeEndElement();
            }
            // Handle radial gradients
            else if (gradient.type === 'Radial') {
                // Determine radial gradient type from center position
                let radialType: number = 3; // Default centered type
                if ((gradient as RadialGradient).cx !== undefined && (gradient as RadialGradient).cy !== undefined &&
                    (gradient as RadialGradient).fx !== undefined && (gradient as RadialGradient).fy !== undefined) {
                    radialType = getVisioRadialGradientType(
                        (gradient as RadialGradient).cx, (gradient as RadialGradient).cy,
                        (gradient as RadialGradient).fx, (gradient as RadialGradient).fy
                    );
                }

                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'FillGradientDir');
                writer.writeAttributeString(null, 'V', null, radialType.toString());
                writer.writeEndElement();
            }

            // Add gradient stop colors if available
            if (gradient.stops && gradient.stops.length > 0) {
                writer.writeStartElement(null, 'Section', null);
                writer.writeAttributeString(null, 'N', null, 'FillGradient');

                gradient.stops.forEach((stop: Stop, index: number) => {
                    writer.writeStartElement(null, 'Row', null);
                    writer.writeAttributeString(null, 'IX', null, index.toString());
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'GradientStopColor');
                    writer.writeAttributeString(null, 'V', null, colorNameToHex(stop.color));
                    writer.writeEndElement();
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'GradientStopColorTrans');
                    writer.writeAttributeString(null, 'V', null, '0');
                    writer.writeEndElement();
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'GradientStopPosition');
                    writer.writeAttributeString(null, 'V', null, stop.offset.toString());
                    writer.writeEndElement();
                    writer.writeEndElement(); // Row
                });

                // Add deleted rows to match expected format (Visio expects up to 10 stops)
                for (let i: number = gradient.stops.length; i < 10; i++) {
                    writer.writeStartElement(null, 'Row', null);
                    writer.writeAttributeString(null, 'IX', null, i.toString());
                    writer.writeAttributeString(null, 'Del', null, '1');
                    writer.writeEndElement(); // Row
                }

                writer.writeEndElement(); // Section
            }
        }

        // Add shadow information if present
        if (node.shadow && (node.constraints & NodeConstraints.Shadow)) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShdwPattern');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShdwForegnd');
            writer.writeAttributeString(null, 'V', null, colorNameToHex(node.shadow.color));
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ShdwForegndTrans');
            writer.writeAttributeString(null, 'V', null, (1 - (node.shadow.opacity || 0.5)).toString());
            writer.writeEndElement();

            // Convert shadow angle and distance to offsets
            if (node.shadow.angle !== undefined && node.shadow.distance !== undefined) {
                const angle: number = node.shadow.angle;
                const distance: number = node.shadow.distance / 100;

                // Convert to radians for calculation
                const angleRad: number = angle * (Math.PI / 180);

                // Calculate offsets in X and Y directions
                const offsetX: number = distance * Math.cos(angleRad);
                // IMPORTANT: Invert the Y offset to account for flipped coordinate system
                const offsetY: number = -distance * Math.sin(angleRad);

                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ShapeShdwOffsetX');
                writer.writeAttributeString(null, 'V', null, offsetX.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ShapeShdwOffsetY');
                writer.writeAttributeString(null, 'V', null, offsetY.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ShapeShdwScaleFactor');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ShapeShdwType');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ShapeShdwShow');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
            }
        }

        // Handle annotation positioning if present
        if (node.annotations && node.annotations.length > 0) {
            const dpiScale: number = UNIT_CONVERSION.SCREEN_DPI;
            const offset: PointModel = node.annotations[0].offset;
            const margin: MarginModel = node.annotations[0].margin;

            // Calculate annotation offset with margins applied
            const annotationOffset: PointModel = { x: offset.x, y: offset.y };
            annotationOffset.x = annotationOffset.x + (margin.left / dpiScale) - (margin.right / dpiScale);
            annotationOffset.y = annotationOffset.y + (margin.top / dpiScale) - (margin.bottom / dpiScale);

            // Find annotation wrapper element for sizing
            const wrapper: GroupableView = node.wrapper;
            let annotationWrapper: DiagramElement;
            for (let i: number = 0; i < wrapper.children.length; i++) {
                const id: string = node.id + '_' + node.annotations[0].id;
                if (wrapper.children[parseInt(i.toString(), 10)].id === id) {
                    annotationWrapper = wrapper.children[parseInt(i.toString(), 10)];
                    break;
                }
            }

            // Adjust for text alignment
            if (node.annotations[0].horizontalAlignment === 'Left') {
                annotationOffset.x = annotationOffset.x + (annotationWrapper.actualSize.width * 0.5 / node.width);
            } else if (node.annotations[0].horizontalAlignment === 'Right') {
                annotationOffset.x = annotationOffset.x - (annotationWrapper.actualSize.width * 0.5 / node.width);
            }

            // Calculate text dimensions
            const textWidth: number = (node.annotations[0].width ? node.annotations[0].width : node.width) / dpiScale;
            const textHeight: number = (node.annotations[0].height ? node.annotations[0].height : node.height) / dpiScale;

            // Add text positioning cells
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinX');
            writer.writeAttributeString(null, 'V', null, (width * annotationOffset.x).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinY');
            writer.writeAttributeString(null, 'V', null, (height * (1 - annotationOffset.y)).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtWidth');
            writer.writeAttributeString(null, 'V', null, (textWidth * 1).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtHeight');
            writer.writeAttributeString(null, 'V', null, (textHeight * 1).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtLocPinX');
            writer.writeAttributeString(null, 'V', null, (textWidth * 0.5).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtLocPinY');
            writer.writeAttributeString(null, 'V', null, (textHeight * 0.5).toString());
            writer.writeEndElement();

            // Add text rotation if present
            if (node.annotations[0].rotateAngle) {
                const angle: number = node.annotations[0].rotateAngle * (Math.PI / 180);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'TxtAngle');
                writer.writeAttributeString(null, 'V', null, (angle * -1).toString());
                writer.writeEndElement();
            }

            // Hide text if visibility is false
            if (!node.annotations[0].visibility || !node.visible) {
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'HideText');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
            }

            // Set vertical alignment
            if (node.annotations[0].verticalAlignment) {
                const align: number = getVisioAlign(node.annotations[0].verticalAlignment);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'VerticalAlign');
                writer.writeAttributeString(null, 'V', null, align.toString());
                writer.writeEndElement();
            }
        }

        // Export node constraints (locking/enabling operations)
        exportNodeConstraints(node, writer);

        // Export node annotations (text content and styling)
        exportNodeAnnotations(node, writer);

        // Add geometry section (shape path data)
        convertPathDataToVisioGeometry(node, writer);

        // Export node ports for connector attachment
        if (node.ports && node.ports.length > 0) {
            let connectionRowIndex: number = 4; // Start after default connection points (0-3)
            const nodePortsMap: Map<string, number> = new Map<string, number>();

            writer.writeStartElement(null, 'Section', null);
            writer.writeAttributeString(null, 'N', null, 'Connection');

            // Create a connection row for each port
            node.ports.forEach((port: PointPort) => {
                const portX: number = (node.width * port.offset.x) / UNIT_CONVERSION.SCREEN_DPI;
                const portY: number = (node.height * (1 - port.offset.y)) / UNIT_CONVERSION.SCREEN_DPI;
                const dirX: number = 0;
                const dirY: number = 0;

                writer.writeStartElement(null, 'Row', null);
                writer.writeAttributeString(null, 'T', null, 'Connection');
                writer.writeAttributeString(null, 'IX', null, connectionRowIndex.toString());
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'X');
                writer.writeAttributeString(null, 'V', null, portX.toString());
                writer.writeAttributeString(null, 'U', null, 'IN');
                writer.writeAttributeString(null, 'F', null, `Width*${port.offset.x}`);
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Y');
                writer.writeAttributeString(null, 'V', null, portY.toString());
                writer.writeAttributeString(null, 'U', null, 'IN');
                writer.writeAttributeString(null, 'F', null, `Height*${1 - port.offset.y}`);
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'DirX');
                writer.writeAttributeString(null, 'V', null, dirX.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'DirY');
                writer.writeAttributeString(null, 'V', null, dirY.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Type');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'AutoGen');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Prompt');
                writer.writeAttributeString(null, 'V', null, `${port.id} Connection Point`);
                writer.writeEndElement();
                writer.writeEndElement(); // Row

                // Store port index for later reference in connector connections
                nodePortsMap.set(port.id, connectionRowIndex);
                connectionRowIndex++;
            });

            writer.writeEndElement(); // Section

            // Store the port map for use in generating connector connects
            portConnectionsMap.set(node.id, nodePortsMap);
        }
    }

    // Handle child nodes for group shapes
    if (node.children && node.children.length > 0) {
        writer.writeStartElement(null, 'Shapes', null);
        node.children.forEach((child: string) => {
            // Determine if child is a node or connector
            if (diagram.nameTable[`${child}`].propName === 'nodes') {
                // Child is a node
                generateNodeShapeXML(writer, (diagram.nameTable[`${child}`]), diagram, shapeTypes,
                                     ++shapeId, portConnectionsMap, context, node);
            } else {
                // Child is a connector
                generateConnectorShapesXml(writer, diagram, shapeTypes, ++shapeId, portConnectionsMap, context,
                                           [diagram.nameTable[`${child}`]], node);
            }
        });
        writer.writeEndElement(); // Shapes
    }

    // Close the shape tag
    writer.writeEndElement(); // Shape
}

/**
 * Exports the annotations (text content) of a node into the Visio shape XML.
 * This includes the primary text content of the node as well as specific annotations,
 * applying their styling and positioning.
 *
 * Handles:
 * - Primary node text content
 * - Annotation content text
 * - Hyperlink text (if present)
 * - Text styling (color, font, formatting)
 * - Hyperlink sections
 *
 * @private
 * @param {NodeModel | Text} node - The node object containing annotation information
 * @param {XmlWriter} writer - Writer used to append annotation XML
 * @returns {void}
 *
 * @example
 * let xml = '<Shape>...</Shape>';
 * xml = exportNodeAnnotations(node, xml);
 * // xml now includes <Text> and <Character> sections
 *
 * @private
 */
function exportNodeAnnotations(node: NodeModel | Text, writer: XmlWriter): void {
    // Handle primary node text content
    if ((node as Text).text && (node as Text).text.trim()) {
        writer.writeStartElement(null, 'Text', null);
        writer.writeString(escapeXmlText((node as Text).text));
        writer.writeEndElement();
    }

    // Handle text node content
    if ((node as NodeModel).shape &&
        (node as NodeModel).shape.type === 'Text' &&
        ((node as NodeModel).shape as TextModel).content) {
        writer.writeStartElement(null, 'Text', null);
        writer.writeString(escapeXmlText((((node as NodeModel).shape as TextModel).content as string)));
        writer.writeEndElement();

        // Apply text node styling
        if ((node as NodeModel).style) {
            const textNodeAdapter: any = { style: (node as NodeModel).style };
            exportTextStyling(textNodeAdapter, writer, 'node');
        }
    }

    // Handle node annotations (Syncfusion's annotation system)
    if ((node as NodeModel).annotations && (node as NodeModel).annotations.length > 0) {
        const annotation: ShapeAnnotationModel = (node as Node).annotations[0]; // Primary annotation

        // Add annotation content as text
        if (annotation.content) {
            writer.writeStartElement(null, 'Text', null);
            writer.writeString(escapeXmlText(annotation.content));
            writer.writeEndElement();
        }

        // Add hyperlink text if present
        if (annotation.hyperlink.content) {
            writer.writeStartElement(null, 'Text', null);
            writer.writeString(escapeXmlText(annotation.hyperlink.content));
            writer.writeEndElement();
        }

        // Add text positioning and styling
        exportTextStyling(annotation, writer, 'node');
    }
}

/**
 * Generates the XML representation of all connections within the diagram.
 * Connect elements link connectors to shape connection points or PinX/PinY cells.
 *
 * Connect Element Structure:
 * - FromSheet: ID of connector shape
 * - FromCell: Connector cell (BeginX/BeginY for source, EndX/EndY for target)
 * - FromPart: Connector attachment point (9 for BeginX, 12 for EndX)
 * - ToSheet: ID of target shape
 * - ToCell: Target cell (PinX by default, or Connections.X# for ports)
 * - ToPart: Target attachment point (usually 3 for PinX)
 *
 * Algorithm:
 * 1. For each connector, find source and target shapes
 * 2. Check if specific port is connected
 * 3. If port exists, use port's connection index
 * 4. Otherwise use default PinX attachment
 * 5. Generate Connect XML elements
 *
 * @private
 * @param {XmlWriter} writer - The XmlWriter instance used to generate the XML output
 * @param {Diagram} diagram - The diagram object containing connection information
 * @param {Map<string, Map<string, number>>} portConnectionsMap - Mapping from nodeId to
 *                                                                (portId to visioIdx)
 * @returns {void}
 */
function generateConnectionsXml(writer: XmlWriter, diagram: Diagram, portConnectionsMap: Map<string, Map<string, number>>): void {
    // Process each connector to create Connect elements with proper part references
    if (diagram.connectors && diagram.connectors.length > 0) {
        for (let i: number = 0; i < diagram.connectors.length; i++) {
            const connector: ConnectorModel = diagram.connectors[parseInt(i.toString(), 10)];
            // Connector shape ID is calculated based on nodes count + index
            const connectorId: number = i + diagram.nodes.length + 1;

            // Add source connection with proper part references
            if (connector.sourceID) {
                // Find index of source node (could be node or connector)
                let sourceNodeIndex: number = diagram.nodes.findIndex((node: NodeModel) => node.id === connector.sourceID);
                if (sourceNodeIndex === -1) {
                    sourceNodeIndex = diagram.connectors.findIndex((connect: ConnectorModel) => connect.id === connector.sourceID);
                    sourceNodeIndex += diagram.nodes.length;
                }

                if (sourceNodeIndex >= 0) {
                    const sourceShapeId: number = sourceNodeIndex + 1;
                    let toPart: number = 3; // Default to PinX
                    let toCellValue: string = 'PinX';

                    // If a specific sourcePortID is provided, find its Visio index
                    if (connector.sourcePortID && portConnectionsMap.has(connector.sourceID)) {
                        const nodePorts: Map<string, number> = portConnectionsMap.get(connector.sourceID);
                        if (nodePorts.has(connector.sourcePortID)) {
                            toPart = nodePorts.get(connector.sourcePortID) + 1;
                            toCellValue = 'Connections.X' + String(toPart);
                        }
                    }

                    // Add Connect element for source
                    writer.writeStartElement(null, 'Connect', null);
                    writer.writeAttributeString(null, 'FromSheet', null, connectorId.toString());
                    writer.writeAttributeString(null, 'FromCell', null, 'BeginX');
                    writer.writeAttributeString(null, 'FromPart', null, '9');
                    writer.writeAttributeString(null, 'ToSheet', null, sourceShapeId.toString());
                    writer.writeAttributeString(null, 'ToCell', null, toCellValue);
                    writer.writeAttributeString(null, 'ToPart', null, toPart.toString());
                    writer.writeEndElement();
                }
            }

            // Add target connection with proper part references
            if (connector.targetID) {
                // Find index of target node (could be node or connector)
                let targetNodeIndex: number = diagram.nodes.findIndex((node: NodeModel) => node.id === connector.targetID);
                if (targetNodeIndex === -1) {
                    targetNodeIndex = diagram.connectors.findIndex((connect: ConnectorModel) => connect.id === connector.targetID);
                    targetNodeIndex += diagram.nodes.length;
                }

                if (targetNodeIndex >= 0) {
                    const targetShapeId: number = targetNodeIndex + 1;
                    let toPart: number = 3; // Default to PinX
                    let toCellValue: string = 'PinX';

                    // If a specific targetPortID is provided, find its Visio index
                    if (connector.targetPortID && portConnectionsMap.has(connector.targetID)) {
                        const nodePorts: Map<string, number> = portConnectionsMap.get(connector.targetID);
                        if (nodePorts.has(connector.targetPortID)) {
                            toPart = nodePorts.get(connector.targetPortID) + 1;
                            toCellValue = 'Connections.X' + String(toPart);
                        }
                    }

                    // Add Connect element for target
                    writer.writeStartElement(null, 'Connect', null);
                    writer.writeAttributeString(null, 'FromSheet', null, connectorId.toString());
                    writer.writeAttributeString(null, 'FromCell', null, 'EndX');
                    writer.writeAttributeString(null, 'FromPart', null, '12');
                    writer.writeAttributeString(null, 'ToSheet', null, targetShapeId.toString());
                    writer.writeAttributeString(null, 'ToCell', null, toCellValue);
                    writer.writeAttributeString(null, 'ToPart', null, toPart.toString());
                    writer.writeEndElement();
                }
            }
        }
    }
}

/**
 * Creates and sets the content for fundamental Visio XML files that form the basic structure
 * and metadata of a VSDX package. These files form the backbone of any Visio document.
 *
 * Files Created:
 * 1. document.xml: Main document settings and configuration
 * 2. pages.xml: Page definitions and page properties
 * 3. windows.xml: Window/viewport settings
 * 4. [Content_Types].xml: MIME type mappings for all file types
 * 5. _rels/.rels: Package-level relationships
 *
 * @private
 * @param {Map<string, string | Uint8Array>} xmlFiles - A map accumulating all XML contents
 *                                                      and binary data for the VSDX
 * @param {visioData} visioData - The processed Visio data structure, containing document,
 *                               page, and window settings
 * @param {Diagram} diagram - The Syncfusion Diagram object being exported, used for
 *                           extracting properties like width, height, and layers
 * @param {string} pageName - The name of the page in the Visio document
 * @returns {void}
 */
function createBasicXmlFiles(
    xmlFiles: Map<string, string | Uint8Array>,
    visioData: visioData,
    diagram: Diagram,
    pageName: string
): void {
    // document.xml with enhanced font support
    // Contains global document settings and configuration
    const docWriter: XmlWriter = new XmlWriter();
    docWriter.writeStartDocument();
    docWriter.writeStartElement(null, 'VisioDocument', 'http://schemas.microsoft.com/office/visio/2012/main');
    // xmlns declarations (use the special XMLNS namespace URI)
    docWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/visio/2012/main');
    docWriter.writeAttributeString('xmlns', 'r', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    // xml:space uses the XML namespace
    docWriter.writeAttributeString('xml', 'space', 'http://www.w3.org/XML/1998/namespace', 'preserve');

    docWriter.writeStartElement(null, 'DocumentSettings', null);
    docWriter.writeAttributeString(null, 'TopPage', null, '0');
    docWriter.writeAttributeString(null, 'DefaultTextStyle', null, '3');
    docWriter.writeAttributeString(null, 'DefaultLineStyle', null, '3');
    docWriter.writeAttributeString(null, 'DefaultFillStyle', null, '3');
    docWriter.writeAttributeString(null, 'DefaultGuideStyle', null, '4');

    docWriter.writeElementString(null, 'GlueSettings', null, (visioData.documentSettings.glueSettings || 9).toString());
    docWriter.writeElementString(null, 'SnapSettings', null, (visioData.documentSettings.snapSettings || 65847).toString());
    docWriter.writeElementString(null, 'SnapExtensions', null, (visioData.documentSettings.snapExtensions || 34).toString());
    docWriter.writeElementString(null, 'SnapAngles', null, '');
    docWriter.writeElementString(null, 'DynamicGridEnabled', null, (visioData.documentSettings.dynamicGridEnabled ? 1 : 0).toString());
    docWriter.writeElementString(null, 'ProtectStyles', null, (visioData.documentSettings.protectStyles ? 1 : 0).toString());
    docWriter.writeElementString(null, 'ProtectShapes', null, (visioData.documentSettings.protectShapes ? 1 : 0).toString());
    docWriter.writeElementString(null, 'ProtectMasters', null, (visioData.documentSettings.protectMasters ? 1 : 0).toString());
    docWriter.writeElementString(null, 'ProtectBkgnds', null, (visioData.documentSettings.protectBkgnds ? 1 : 0).toString());

    docWriter.writeEndElement(); // DocumentSettings

    docWriter.writeStartElement(null, 'Colors', null);

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '24');
    docWriter.writeAttributeString(null, 'RGB', null, '#7F7F7F');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '25');
    docWriter.writeAttributeString(null, 'RGB', null, '#FFFFFF');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '26');
    docWriter.writeAttributeString(null, 'RGB', null, '#000000');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '0');
    docWriter.writeAttributeString(null, 'RGB', null, '#FFFFFF');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '1');
    docWriter.writeAttributeString(null, 'RGB', null, '#000000');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '2');
    docWriter.writeAttributeString(null, 'RGB', null, '#FF0000');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '3');
    docWriter.writeAttributeString(null, 'RGB', null, '#00FF00');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'ColorEntry', null);
    docWriter.writeAttributeString(null, 'IX', null, '4');
    docWriter.writeAttributeString(null, 'RGB', null, '#0000FF');
    docWriter.writeEndElement();

    docWriter.writeEndElement(); // Colors

    docWriter.writeStartElement(null, 'FaceNames', null);

    docWriter.writeStartElement(null, 'FaceName', null);
    docWriter.writeAttributeString(null, 'NameU', null, 'Calibri');
    docWriter.writeAttributeString(null, 'UnicodeRanges', null, '-469750017 -1040178053 9 0');
    docWriter.writeAttributeString(null, 'CharSets', null, '536871423 0');
    docWriter.writeAttributeString(null, 'Panose', null, '2 15 5 2 2 2 4 3 2 4');
    docWriter.writeAttributeString(null, 'Flags', null, '357');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'FaceName', null);
    docWriter.writeAttributeString(null, 'NameU', null, 'Arial');
    docWriter.writeAttributeString(null, 'UnicodeRanges', null, '-1073734909 -1073741809 9 0');
    docWriter.writeAttributeString(null, 'CharSets', null, '536870911 0');
    docWriter.writeAttributeString(null, 'Panose', null, '2 11 6 4 2 2 2 2 2 4');
    docWriter.writeAttributeString(null, 'Flags', null, '32');
    docWriter.writeEndElement();

    docWriter.writeStartElement(null, 'FaceName', null);
    docWriter.writeAttributeString(null, 'NameU', null, 'Times New Roman');
    docWriter.writeAttributeString(null, 'UnicodeRanges', null, '-1073734909 -1073741809 9 0');
    docWriter.writeAttributeString(null, 'CharSets', null, '536870911 0');
    docWriter.writeAttributeString(null, 'Panose', null, '2 2 6 3 5 4 5 2 3 4');
    docWriter.writeAttributeString(null, 'Flags', null, '32');
    docWriter.writeEndElement();

    docWriter.writeEndElement(); // FaceNames
    docWriter.writeEndElement(); // VisioDocument

    xmlFiles.set('visio/document.xml', docWriter.text);

    // pages.xml: Page definitions with layer information
    // Build pages.xml with page properties
    const page: VisioPage = visioData.pages[0];
    const pagesWriter: XmlWriter = new XmlWriter();
    pagesWriter.writeStartDocument();
    pagesWriter.writeStartElement(null, 'Pages', 'http://schemas.microsoft.com/office/visio/2012/main');
    pagesWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/visio/2012/main');
    pagesWriter.writeAttributeString('xmlns', 'r', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    pagesWriter.writeAttributeString('xml', 'space', 'http://www.w3.org/XML/1998/namespace', 'preserve');

    pagesWriter.writeStartElement(null, 'Page', null);
    pagesWriter.writeAttributeString(null, 'ID', null, '0');
    pagesWriter.writeAttributeString(null, 'NameU', null, pageName);
    pagesWriter.writeAttributeString(null, 'Name', null, pageName);
    pagesWriter.writeAttributeString(null, 'ViewScale', null, (visioData.windows[0].viewScale || -1).toString());
    pagesWriter.writeAttributeString(null, 'ViewCenterX', null, (visioData.windows[0].viewCenterX || 4).toString());
    pagesWriter.writeAttributeString(null, 'ViewCenterY', null, (visioData.windows[0].viewCenterY || 6).toString());

    pagesWriter.writeStartElement(null, 'PageSheet', null);
    pagesWriter.writeAttributeString(null, 'LineStyle', null, '0');
    pagesWriter.writeAttributeString(null, 'FillStyle', null, '0');
    pagesWriter.writeAttributeString(null, 'TextStyle', null, '0');

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageWidth');
    pagesWriter.writeAttributeString(null, 'V', null, page.pageWidth.toString());
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageHeight');
    pagesWriter.writeAttributeString(null, 'V', null, page.pageHeight.toString());
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'ShdwOffsetX');
    pagesWriter.writeAttributeString(null, 'V', null, '0.125');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'ShdwOffsetY');
    pagesWriter.writeAttributeString(null, 'V', null, '-0.125');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageScale');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeAttributeString(null, 'U', null, 'IN_F');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'DrawingScale');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeAttributeString(null, 'U', null, 'IN_F');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'DrawingSizeType');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'DrawingScaleType');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'InhibitSnap');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageLockReplace');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeAttributeString(null, 'U', null, 'BOOL');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageLockDuplicate');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeAttributeString(null, 'U', null, 'BOOL');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'UIVisibility');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'ShdwType');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'ShdwObliqueAngle');
    pagesWriter.writeAttributeString(null, 'V', null, '0');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'ShdwScaleFactor');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'LineJumpCode');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'LineJumpFactorX');
    pagesWriter.writeAttributeString(null, 'V', null, '0.5');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'LineJumpFactorY');
    pagesWriter.writeAttributeString(null, 'V', null, '0.5');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'DrawingResizeType');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PageShapeSplit');
    pagesWriter.writeAttributeString(null, 'V', null, '1');
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PrintPageOrientation');
    pagesWriter.writeAttributeString(null, 'V', null, (page.printPageOrientation || 1).toString());
    pagesWriter.writeEndElement();

    pagesWriter.writeStartElement(null, 'Cell', null);
    pagesWriter.writeAttributeString(null, 'N', null, 'PaperKind');
    pagesWriter.writeAttributeString(null, 'V', null, (detectPaperMultiple(page.pageWidth, page.pageHeight).kind).toString());
    pagesWriter.writeEndElement();

    // Contains metadata about each page and its layers
    if (diagram.layers && diagram.layers.length > 0) {
        pagesWriter.writeStartElement(null, 'Section', null);
        pagesWriter.writeAttributeString(null, 'N', null, 'Layer');
        for (let i: number = 0; i < diagram.layers.length; i++) {
            const layer: LayerModel = diagram.layers[parseInt(i.toString(), 10)];
            const active: number = diagram.activeLayer === layer ? 1 : 0;
            pagesWriter.writeStartElement(null, 'Row', null);
            pagesWriter.writeAttributeString(null, 'IX', null, i.toString());
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Name');
            pagesWriter.writeAttributeString(null, 'V', null, layer.id);
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Color');
            pagesWriter.writeAttributeString(null, 'V', null, '255');
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Status');
            pagesWriter.writeAttributeString(null, 'V', null, '0');
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Visible');
            pagesWriter.writeAttributeString(null, 'V', null, Number(layer.visible).toString());
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Print');
            pagesWriter.writeAttributeString(null, 'V', null, '1');
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Active');
            pagesWriter.writeAttributeString(null, 'V', null, active.toString());
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Lock');
            pagesWriter.writeAttributeString(null, 'V', null, Number(layer.lock).toString());
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Snap');
            pagesWriter.writeAttributeString(null, 'V', null, '1');
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'Glue');
            pagesWriter.writeAttributeString(null, 'V', null, '1');
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'NameUniv');
            pagesWriter.writeAttributeString(null, 'V', null, layer.id);
            pagesWriter.writeEndElement();
            pagesWriter.writeStartElement(null, 'Cell', null);
            pagesWriter.writeAttributeString(null, 'N', null, 'ColorTrans');
            pagesWriter.writeAttributeString(null, 'V', null, '0');
            pagesWriter.writeEndElement();
            pagesWriter.writeEndElement(); // Row
        }
        pagesWriter.writeEndElement(); // Section
    }

    pagesWriter.writeEndElement(); // PageSheet

    // Relationship element with r:id attribute (prefix 'r', localName 'id')
    pagesWriter.writeStartElement(null, 'Rel', null);
    pagesWriter.writeAttributeString('r', 'id', null, 'rId1');
    pagesWriter.writeEndElement();

    pagesWriter.writeEndElement(); // Page
    pagesWriter.writeEndElement(); // Pages

    xmlFiles.set('visio/pages/pages.xml', pagesWriter.text);

    // windows.xml: Viewport and display settings
    // Defines how the document appears when opened in Visio
    const window: VisioWindow = visioData.windows[0];
    const windowsWriter: XmlWriter = new XmlWriter();
    windowsWriter.writeStartDocument();
    windowsWriter.writeStartElement(null, 'Windows', 'http://schemas.microsoft.com/office/visio/2012/main');
    windowsWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/visio/2012/main');
    windowsWriter.writeAttributeString('xmlns', 'r', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    windowsWriter.writeAttributeString(null, 'ClientWidth', null, window.clientWidth.toString());
    windowsWriter.writeAttributeString(null, 'ClientHeight', null, window.clientHeight.toString());
    windowsWriter.writeAttributeString('xml', 'space', 'http://www.w3.org/XML/1998/namespace', 'preserve');

    windowsWriter.writeStartElement(null, 'Window', null);
    windowsWriter.writeAttributeString(null, 'ID', null, '0');
    windowsWriter.writeAttributeString(null, 'WindowType', null, 'Drawing');
    windowsWriter.writeAttributeString(null, 'WindowState', null, '1073741824');
    windowsWriter.writeAttributeString(null, 'WindowLeft', null, '-8');
    windowsWriter.writeAttributeString(null, 'WindowTop', null, '-31');
    windowsWriter.writeAttributeString(null, 'WindowWidth', null, window.windowWidth.toString());
    windowsWriter.writeAttributeString(null, 'WindowHeight', null, window.windowHeight.toString());
    windowsWriter.writeAttributeString(null, 'ContainerType', null, 'Page');
    windowsWriter.writeAttributeString(null, 'Page', null, '0');
    windowsWriter.writeAttributeString(null, 'ViewScale', null, window.viewScale.toString());
    windowsWriter.writeAttributeString(null, 'ViewCenterX', null, window.viewCenterX.toString());
    windowsWriter.writeAttributeString(null, 'ViewCenterY', null, window.viewCenterY.toString());

    windowsWriter.writeElementString(null, 'ShowRulers', null, (window.showRulers ? 1 : 0).toString());
    windowsWriter.writeElementString(null, 'ShowGrid', null, (window.showGrid ? 1 : 0).toString());
    windowsWriter.writeElementString(null, 'ShowPageBreaks', null, (window.showPageBreaks ? 1 : 0).toString());
    windowsWriter.writeElementString(null, 'ShowGuides', null, (window.showGuides ? 1 : 0).toString());
    windowsWriter.writeElementString(null, 'ShowConnectionPoints', null, '1');
    windowsWriter.writeElementString(null, 'GlueSettings', null, (visioData.documentSettings.glueSettings || 9).toString());
    windowsWriter.writeElementString(null, 'SnapSettings', null, (visioData.documentSettings.snapSettings || 65847).toString());
    windowsWriter.writeElementString(null, 'SnapExtensions', null, window.snapExtensions.toString());
    windowsWriter.writeElementString(null, 'SnapAngles', null, window.snapAngles.toString());
    windowsWriter.writeElementString(null, 'DynamicGridEnabled', null, (visioData.documentSettings.dynamicGridEnabled ? 1 : 0).toString());
    windowsWriter.writeElementString(null, 'TabSplitterPos', null, '0.5');

    windowsWriter.writeEndElement(); // Window
    windowsWriter.writeEndElement(); // Windows

    xmlFiles.set('visio/windows.xml', windowsWriter.text);

    // [Content_Types].xml: MIME type definitions for all file types in the package
    // Required by Open Packaging Conventions format
    const contentTypesWriter: XmlWriter = new XmlWriter();
    contentTypesWriter.writeStartDocument(true);
    contentTypesWriter.writeStartElement(null, 'Types', 'http://schemas.openxmlformats.org/package/2006/content-types');
    contentTypesWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/package/2006/content-types');

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'emf');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'image/x-emf');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'png');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'image/png');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'jpeg');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'image/jpeg');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'jpg');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'image/jpeg');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'rels');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.openxmlformats-package.relationships+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Default', null);
    contentTypesWriter.writeAttributeString(null, 'Extension', null, 'xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/document.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.drawing.main+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/masters/masters.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.masters+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/masters/master1.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.master+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/pages/pages.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.pages+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/pages/page1.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.page+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/visio/windows.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.windows+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/docProps/core.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.openxmlformats-package.core-properties+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/docProps/app.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.openxmlformats-officedocument.extended-properties+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeStartElement(null, 'Override', null);
    contentTypesWriter.writeAttributeString(null, 'PartName', null, '/docProps/custom.xml');
    contentTypesWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.openxmlformats-officedocument.custom-properties+xml');
    contentTypesWriter.writeEndElement();

    contentTypesWriter.writeEndElement(); // Types

    xmlFiles.set('[Content_Types].xml', contentTypesWriter.text);

    // _rels/.rels: Package-level relationships (root .rels file)
    // Defines relationships at package level (outside visio folder)
    const relsWriter: XmlWriter = new XmlWriter();
    relsWriter.writeStartDocument(true);
    relsWriter.writeStartElement(null, 'Relationships', 'http://schemas.openxmlformats.org/package/2006/relationships');
    relsWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/package/2006/relationships');

    relsWriter.writeStartElement(null, 'Relationship', null);
    relsWriter.writeAttributeString(null, 'Id', null, 'rId1');
    relsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.microsoft.com/visio/2010/relationships/document');
    relsWriter.writeAttributeString(null, 'Target', null, '/visio/document.xml');
    relsWriter.writeEndElement();

    relsWriter.writeStartElement(null, 'Relationship', null);
    relsWriter.writeAttributeString(null, 'Id', null, 'rId2');
    relsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail');
    relsWriter.writeAttributeString(null, 'Target', null, 'docProps/thumbnail.emf');
    relsWriter.writeEndElement();

    relsWriter.writeStartElement(null, 'Relationship', null);
    relsWriter.writeAttributeString(null, 'Id', null, 'rId3');
    relsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties');
    relsWriter.writeAttributeString(null, 'Target', null, 'docProps/core.xml');
    relsWriter.writeEndElement();

    relsWriter.writeStartElement(null, 'Relationship', null);
    relsWriter.writeAttributeString(null, 'Id', null, 'rId4');
    relsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties');
    relsWriter.writeAttributeString(null, 'Target', null, 'docProps/app.xml');
    relsWriter.writeEndElement();

    relsWriter.writeStartElement(null, 'Relationship', null);
    relsWriter.writeAttributeString(null, 'Id', null, 'rId5');
    relsWriter.writeAttributeString(null, 'Type', null, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties');
    relsWriter.writeAttributeString(null, 'Target', null, 'docProps/custom.xml');
    relsWriter.writeEndElement();

    relsWriter.writeEndElement(); // Relationships

    xmlFiles.set('_rels/.rels', relsWriter.text);
}

/**
 * Returns an array of standard paper sizes with their dimensions and System.Drawing.Printing.PaperKind codes.
 * Includes common international paper sizes used in printing and document creation.
 *
 * @private
 * @returns {PaperSize[]} Array of standard paper size objects
 */
function getStandardPaperSizes(): PaperSize[] {
    const sizes: PaperSize[] = [
        { name: 'Letter', wIn: 8.5, hIn: 11.0, kind: 1 },
        { name: 'Tabloid', wIn: 11.0, hIn: 17.0, kind: 3 },
        { name: 'Legal', wIn: 8.5, hIn: 14.0, kind: 5 },
        { name: 'Executive', wIn: 7.0, hIn: 10.0, kind: 6 },
        { name: 'A3', wIn: 11.69, hIn: 16.54, kind: 8 },
        { name: 'A4', wIn: 8.27, hIn: 11.69, kind: 9 },
        { name: 'A5', wIn: 5.83, hIn: 8.27, kind: 11 },
        { name: 'B4', wIn: 9.84, hIn: 13.90, kind: 12 },
        { name: 'B5', wIn: 6.93, hIn: 9.84, kind: 13 }
    ];
    return sizes;
}

/**
 * Calculates the multiple of a base size that fits within measured dimensions within tolerance.
 * Used for detecting standard paper sizes by checking if dimensions are multiples of base sizes.
 *
 * @private
 * @param {number} measuredIn - The measured dimension in inches
 * @param {number} baseIn - The base dimension in inches to check multiples of
 * @param {number} toleranceIn - The tolerance in inches for considering a match
 * @returns {number} The integer multiple (0 if no match within tolerance)
 */
function getMultiple(measuredIn: number, baseIn: number, toleranceIn: number): number {
    if (baseIn <= 0) {
        return 0;
    }
    const raw: number = measuredIn / baseIn;
    const m: number = Math.round(raw);
    if (m <= 0) {
        return 0;
    }
    const diff: number = Math.abs(measuredIn - (m * baseIn));
    if (diff <= toleranceIn) {
        return m;
    }
    return 0;
}

/**
 * Detects if given dimensions match standard paper sizes, considering orientation and multiples.
 * Attempts to match width/height against known paper sizes in both portrait and landscape orientations.
 * Also checks for tiled/multiple layouts of standard sizes.
 *
 * @private
 * @param {number} widthIn - Width in inches
 * @param {number} heightIn - Height in inches
 * @returns {PaperDetectionResult} Detection result with match info and metadata
 */
function detectPaperMultiple(widthIn: number, heightIn: number): PaperDetectionResult {
    // Tolerance in inches: use a small value to handle rounding/driver quirks
    // Adjust if your environment has larger variations.
    const toleranceIn: number = 0.05;

    const sizes: PaperSize[] = getStandardPaperSizes();

    // Try portrait (base wIn x hIn) and landscape (swap)
    for (let i: number = 0; i < sizes.length; i++) {
        const s: PaperSize = sizes[parseInt(i.toString(), 10)];

        // Portrait check
        const mwPortrait: number = getMultiple(widthIn, s.wIn, toleranceIn);
        const mhPortrait: number = getMultiple(heightIn, s.hIn, toleranceIn);
        if (mwPortrait > 0 && mhPortrait > 0 && mwPortrait === mhPortrait) {
            return {
                isStandard: true,
                kind: s.kind,
                name: s.name,
                orientation: 'portrait',
                multiple: mwPortrait,
                baseWidthIn: s.wIn,
                baseHeightIn: s.hIn
            };
        }

        // Landscape check (swap base dimensions)
        const mwLandscape: number = getMultiple(widthIn, s.hIn, toleranceIn);
        const mhLandscape: number = getMultiple(heightIn, s.wIn, toleranceIn);
        if (mwLandscape > 0 && mhLandscape > 0 && mwLandscape === mhLandscape) {
            return {
                isStandard: true,
                kind: s.kind,
                name: s.name,
                orientation: 'landscape',
                multiple: mwLandscape,
                baseWidthIn: s.hIn,
                baseHeightIn: s.wIn
            };
        }
    }

    // Non-standard/custom size
    return {
        isStandard: false,
        kind: 0,
        name: '',
        orientation: widthIn >= heightIn ? 'landscape' : 'portrait',
        multiple: 1,
        baseWidthIn: widthIn,
        baseHeightIn: heightIn
    };
}

/**
 * Generates the XML content for standard document properties files within the VSDX package.
 * Creates metadata files: `core.xml` (core properties), `app.xml` (application-specific),
 * and `custom.xml` (custom properties). Also creates a minimal `thumbnail.emf`.
 *
 * Files Generated:
 * 1. docProps/core.xml: Author, title, creation date, modification date
 * 2. docProps/app.xml: Application name and version
 * 3. docProps/custom.xml: Additional custom properties
 * 4. docProps/thumbnail.emf: Placeholder for document thumbnail
 *
 * @returns {Map<string, string>} A Map where keys are file paths within the VSDX
 *         (e.g., 'docProps/core.xml') and values are their corresponding XML content
 *         as strings (or base64 for thumbnail.emf)
 */
function generateDocPropsFiles(): Map<string, string> {
    const docPropFiles: Map<string, string> = new Map<string, string>();

    // Create core.xml: Document metadata (author, title, dates)
    // Follows Open Packaging Conventions core properties schema
    const coreWriter: XmlWriter = new XmlWriter();
    coreWriter.writeStartDocument(true);
    // Root with cp prefix and namespace
    coreWriter.writeStartElement('cp', 'coreProperties', 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties');
    // Namespace declarations
    coreWriter.writeAttributeString('xmlns', 'cp', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties');
    coreWriter.writeAttributeString('xmlns', 'dc', 'http://www.w3.org/2000/xmlns/', 'http://purl.org/dc/elements/1.1/');
    coreWriter.writeAttributeString('xmlns', 'dcterms', 'http://www.w3.org/2000/xmlns/', 'http://purl.org/dc/terms/');
    coreWriter.writeAttributeString('xmlns', 'dcmitype', 'http://www.w3.org/2000/xmlns/', 'http://purl.org/dc/dcmitype/');
    coreWriter.writeAttributeString('xmlns', 'xsi', 'http://www.w3.org/2000/xmlns/', 'http://www.w3.org/2001/XMLSchema-instance');

    coreWriter.writeStartElement('dc', 'title', 'http://purl.org/dc/elements/1.1/');
    coreWriter.writeRaw('Diagram');
    coreWriter.writeEndElement();

    coreWriter.writeStartElement('dc', 'creator', 'http://purl.org/dc/elements/1.1/');
    coreWriter.writeRaw('Diagram Export');
    coreWriter.writeEndElement();

    coreWriter.writeStartElement('cp', 'lastModifiedBy', 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties');
    coreWriter.writeRaw('Diagram Export');
    coreWriter.writeEndElement();

    coreWriter.writeStartElement('dcterms', 'created', 'http://purl.org/dc/terms/');
    coreWriter.writeAttributeString('xsi', 'type', 'http://www.w3.org/2001/XMLSchema-instance', 'dcterms:W3CDTF');
    coreWriter.writeRaw(new Date().toISOString());
    coreWriter.writeEndElement();

    coreWriter.writeStartElement('dcterms', 'modified', 'http://purl.org/dc/terms/');
    coreWriter.writeAttributeString('xsi', 'type', 'http://www.w3.org/2001/XMLSchema-instance', 'dcterms:W3CDTF');
    coreWriter.writeRaw(new Date().toISOString());
    coreWriter.writeEndElement();

    coreWriter.writeEndElement(); // cp:coreProperties

    // Create app.xml: Application-specific properties
    // Identifies the application and version that created the document
    const appWriter: XmlWriter = new XmlWriter();
    appWriter.writeStartDocument(true);
    // Root with default namespace for extended-properties
    appWriter.writeStartElement(null, 'Properties', 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties');
    appWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties');
    appWriter.writeAttributeString('xmlns', 'vt', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes');

    appWriter.writeStartElement(null, 'Application', null);
    appWriter.writeRaw('Microsoft Visio');
    appWriter.writeEndElement();

    appWriter.writeStartElement(null, 'AppVersion', null);
    appWriter.writeRaw('16.0');
    appWriter.writeEndElement();

    appWriter.writeEndElement(); // Properties

    // Create custom.xml: Custom properties (empty by default)
    // Can be extended to include diagram-specific metadata
    const customWriter: XmlWriter = new XmlWriter();
    customWriter.writeStartDocument(true);
    customWriter.writeStartElement(null, 'Properties', 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties');
    customWriter.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties');
    customWriter.writeAttributeString('xmlns', 'vt', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes');
    customWriter.writeEndElement(); // Properties

    // Create a minimal thumbnail.emf file
    // This is a placeholder EMF (Enhanced Metafile) header
    // A full implementation would generate an actual preview image
    const emfHeaderBytes: Uint8Array = new Uint8Array([
        0x01, 0x00, 0x00, 0x00, 0x58, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    // Convert EMF bytes to base64 for storage in the zip
    let binaryString: string = '';
    for (let i: number = 0; i < emfHeaderBytes.length; i++) {
        binaryString += String.fromCharCode(emfHeaderBytes[parseInt(i.toString(), 10)]);
    }
    const emfBase64: string = btoa(binaryString);

    // Add all files to the map
    docPropFiles.set('docProps/core.xml', coreWriter.text);
    docPropFiles.set('docProps/app.xml', appWriter.text);
    docPropFiles.set('docProps/custom.xml', customWriter.text);
    docPropFiles.set('docProps/thumbnail.emf', emfBase64);

    return docPropFiles;
}

/**
 * Creates the final VSDX file (which is a ZIP archive) from a map of file names and their contents.
 * Uses the MinimalZipWriter to package all XML and binary files into a single ZIP file.
 *
 * Process:
 * 1. Create new MinimalZipWriter instance
 * 2. Add each file from the map to the ZIP
 * 3. Generate the complete ZIP archive
 * 4. Return the underlying ArrayBuffer
 *
 * @private
 * @param {Map<string, string | Uint8Array>} xmlFiles - A map where keys are file paths
 *                                                      within the VSDX and values are
 *                                                      their corresponding XML content (string)
 *                                                      or binary data (Uint8Array)
 * @returns {ArrayBuffer} An ArrayBuffer containing the binary data of the generated VSDX file
 *
 * @example
 * const xmlFiles = new Map([
 *   ['visio/document.xml', '<?xml...>'],
 *   ['visio/media/image1.png', uint8ArrayData],
 *   ...
 * ]);
 * const vsdxBuffer = createVsdxArchive(xmlFiles);
 */
function createVsdxArchive(xmlFiles: Map<string, string | Uint8Array>): ArrayBuffer {
    const zipWriter: MinimalZipWriter = new MinimalZipWriter();

    // Add all XML files and binary data to the ZIP archive
    xmlFiles.forEach((content: string | Uint8Array, filename: string) => {
        zipWriter.addFile(filename, content);
    });

    // Generate the final VSDX file as ArrayBuffer
    return zipWriter.generate();
}

/**
 * Generates a GUID-like unique ID string.
 * This is used for creating unique identifiers for various Visio elements
 * like Master, BaseID, and UniqueID attributes.
 *
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * (Similar to RFC 4122 UUID v4, but not strictly compliant)
 *
 * Algorithm:
 * 1. Start with template string
 * 2. Replace each 'x' with random hex digit (0-F)
 * 3. Replace each 'y' with random digit in range [8-B] (ensures version/variant)
 *
 * @private
 * @returns {string} A string representing a GUID-like unique identifier
 *                  (format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
 *
 * @example
 * const id1 = generateUniqueId();
 * // Returns: '550e8400-e29b-41d4-a716-446655440000'
 *
 * const id2 = generateUniqueId();
 * // Returns: 'a76c5a3e-f2b9-4d1a-b583-2d9c7e4e5f01'
 */
function generateUniqueId(): string {
    // Generate a GUID-like unique ID by replacing x's and y's with random hex digits
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string): string {
        // Generate random number 0-15
        const r: number = Math.random() * 16 | 0;

        // For 'x': use random digit (0-F)
        // For 'y': use digit in range [8-B] to ensure valid UUID variant
        const v: number = c === 'x' ? r : (r & 0x3 | 0x8);

        // Convert to hexadecimal string
        return v.toString(16);
    });
}

/**
 * Converts a Syncfusion Diagram object into a `visioData` structure.
 * This is a simplified representation of Visio document, page, and window settings.
 * Acts as an intermediate data model for generating the actual VSDX XML.
 *
 * Process:
 * 1. Extract window/viewport settings from diagram scroll settings
 * 2. Extract page dimensions from diagram page settings
 * 3. Process layers and convert to Visio layer format
 * 4. Extract document-wide settings (grid, snap, protection, etc.)
 * 5. Return complete visioData structure
 *
 * @private
 * @param {Diagram} diagram - The Syncfusion Diagram object to convert
 * @param {ParsingContext} context - Parsing context for logging
 * @returns {visioData} An object containing Visio-compatible window, page, and
 *         document settings data, ready for XML generation
 *
 * @example
 * const visioData = convertDiagramToVisioFormat(diagram);
 * // Returns: {
 * //   windows: [VisioWindow],
 * //   pages: [VisioPage],
 * //   documentSettings: VisioDocumentSettings
 * // }
 */
function convertDiagramToVisioFormat(diagram: Diagram, context: ParsingContext): visioData {
    const visioData: visioData = {
        windows: [],
        pages: [],
        documentSettings: new VisioDocumentSettings()
    };
    //1004838 - Exception on exporting diagram to visio
    const pageDimension: { width: number, height: number } = getPageDimension(diagram);
    const pageWidth: number = pageDimension.width;
    const pageHeight: number = pageDimension.height;
    let clientWidth: number = pageWidth;
    let clientHeight: number = pageHeight;
    if (clientWidth > diagram.scrollSettings.viewPortWidth || clientHeight > diagram.scrollSettings.viewPortHeight) {
        clientWidth = diagram.scrollSettings.viewPortWidth;
        clientHeight = diagram.scrollSettings.viewPortHeight;
    }
    let printPageOrientation: number = pageWidth > pageHeight ? 2 : 1;
    if (diagram.pageSettings.width && diagram.pageSettings.height) {
        printPageOrientation = diagram.pageSettings.orientation === 'Landscape' ? 2 : 1;
    }

    // Create window/viewport data from diagram scroll settings
    const window: VisioWindow = new VisioWindow();
    window.clientWidth = clientWidth;
    window.clientHeight = clientHeight;
    window.windowWidth = pageWidth;
    window.windowHeight = pageHeight;
    window.viewScale = diagram.scrollSettings.currentZoom;
    window.viewCenterX = pageWidth * 0.5 / UNIT_CONVERSION.SCREEN_DPI;
    window.viewCenterY = pageHeight * 0.5 / UNIT_CONVERSION.SCREEN_DPI;
    window.showRulers = diagram.rulerSettings.showRulers;
    window.showGrid = !!((diagram.snapSettings.constraints & SnapConstraints.ShowLines));
    window.showPageBreaks = diagram.pageSettings.showPageBreaks;
    window.showGuides = !!((diagram.snapSettings.constraints & SnapConstraints.SnapToObject));
    window.snapExtensions = diagram.snapSettings.snapObjectDistance;
    window.snapAngles = diagram.snapSettings.snapAngle;
    visioData.windows.push(window);

    // Create page data from diagram page settings
    const page: VisioPage = new VisioPage();
    page.pageWidth = (pageWidth / UNIT_CONVERSION.SCREEN_DPI);
    page.pageHeight = (pageHeight / UNIT_CONVERSION.SCREEN_DPI);
    page.printPageOrientation = printPageOrientation;

    // Process layers and convert to Visio layer format
    if (page.layers.length > 1) {
        context.addWarning('[WARNING] :: Layers and object-to-layer assignments are exported correctly, but the layer Z-index is not preserved in the exported file.');
    }
    page.layers = diagram.layers.map((layer: LayerModel) => {
        const visioLayer: VisioLayer = {
            name: layer.id,
            visible: layer.visible,
            lock: layer.lock,
            active: diagram.activeLayer === layer.id,
            color: 0, // Default color
            status: 0, // Default status
            print: true, // Default print
            snap: true, // Default snap
            glue: true, // Default glue
            objects: layer.objects
        };
        return visioLayer;
    });

    visioData.pages.push(page);

    if (diagram.tooltip.content) {
        context.addWarning('[WARNING] :: Tooltip settings for the diagram are not exported because Visio does not support diagram-level tooltips.');
    }
    if (diagram.constraints & DiagramConstraints.AutomaticPortCreation) {
        context.addWarning('[WARNING] :: Automatic port creation and line overlapping avoidance are not exported as this are not supported in Visio.');
    }
    if (diagram.constraints) {
        context.addWarning('[WARNING] :: Diagram constraints and interaction modes (such as Constraints, Mode, and UserInteraction) cannot be exported as Visio does not support this feature.');
    }
    // Create document settings
    const documentSettings: VisioDocumentSettings = new VisioDocumentSettings();
    documentSettings.dynamicGridEnabled = diagram.rulerSettings.dynamicGrid;
    visioData.documentSettings = documentSettings;

    return visioData;
}

function getPageDimension(diagram: Diagram): { width: number, height: number } {
    const pageBounds: Rect = diagram.scroller.getPageBounds();
    const pageRight: number = pageBounds.right;
    const pageLeft: number = Math.min(pageBounds.left, 0);
    const pageWidth: number = pageRight - pageLeft + (0.25 * UNIT_CONVERSION.SCREEN_DPI);
    const pageBottom: number = pageBounds.bottom;
    const pageTop: number = Math.min(pageBounds.top, 0);
    const pageHeight: number = pageBottom - pageTop + (0.25 * UNIT_CONVERSION.SCREEN_DPI);
    return { width: pageWidth, height: pageHeight };
}

/**
 * Updates the `[Content_Types].xml` file to include `Override` elements for all generated master files.
 * This ensures that Visio can correctly identify and parse the custom master types within the VSDX package.
 *
 * Process:
 * 1. Get current [Content_Types].xml content
 * 2. Find insertion point (before </Types>)
 * 3. For each master (starting from master2, since master1 already exists):
 *    a. Create Override element with correct content type
 * 4. Insert all new overrides before closing tag
 * 5. Update xmlFiles map with modified content
 *
 * @private
 * @param {Map<string, string | Uint8Array>} xmlFiles - A map containing all XML contents
 *                                                      for the VSDX, where [Content_Types].xml
 *                                                      will be modified
 * @param {Map<string, number>} shapeTypes - A map containing unique shape type names
 *                                          and their assigned master IDs
 * @returns {void}
 *
 * @private
 */
function updateContentTypesForMasters(xmlFiles: Map<string, string | Uint8Array>, shapeTypes: Map<string, number>): void {
    // Get current content types XML
    const contentTypesXml: string = xmlFiles.get('[Content_Types].xml') as string;

    // Split at location of master1.xml override to preserve existing entry
    const parts: string[] = contentTypesXml.split('<Override PartName="/visio/masters/master1.xml"');

    let newContentTypes: string = parts[0] + '<Override PartName="/visio/masters/master1.xml"' + parts[1];

    // Find insertion point for additional masters
    const insertPoint: number = newContentTypes.indexOf('</Types>');
    const mastersWriter: XmlWriter = new XmlWriter();

    // Generate override entries for masters starting from master2
    // (master1 is already included in the default content)
    for (let masterId: number = 2; masterId <= shapeTypes.size; masterId++) {
        // <Override PartName="/visio/masters/master{n}.xml" ContentType="application/vnd.ms-visio.master+xml" />
        mastersWriter.writeStartElement(null, 'Override', null);
        mastersWriter.writeAttributeString(null, 'PartName', null, `/visio/masters/master${masterId}.xml`);
        mastersWriter.writeAttributeString(null, 'ContentType', null, 'application/vnd.ms-visio.master+xml');
        mastersWriter.writeEndElement();
    }

    // Insert new override entries before closing tag
    newContentTypes = newContentTypes.substring(0, insertPoint) + mastersWriter.text + newContentTypes.substring(insertPoint);
    // Update the content types XML in the files map
    xmlFiles.set('[Content_Types].xml', newContentTypes);
}

/**
 * Exports node constraints (editing restrictions) as Visio lock cells.
 * Constraints control which operations are allowed on a shape in Visio.
 *
 * Constraint Mapping:
 * - Select disabled → LockSelect = 1
 * - Delete disabled → LockDelete = 1
 * - Drag disabled → LockMoveX, LockMoveY = 1
 * - Height resize disabled → LockHeight = 1
 * - Width resize disabled → LockWidth = 1
 * - Rotate disabled → LockRotate = 1
 * - AspectRatio enabled → LockAspect = 1
 * - ReadOnly enabled → LockTextEdit = 1
 *
 * @private
 * @param {NodeModel} node - The node object containing constraint information
 * @param {XmlWriter} writer - Writer used to append constraint XML
 * @returns {void}
 *
 * @private
 */
function exportNodeConstraints(node: NodeModel, writer: XmlWriter): void {
    const constraints: NodeConstraints = node.constraints;

    // LockSelect (if Select is disabled)
    if (!(constraints & NodeConstraints.Select)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockSelect');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockDelete (if Delete is disabled)
    if (!(constraints & NodeConstraints.Delete)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockDelete');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // Locking movement (if Drag is disabled)
    if (!(constraints & NodeConstraints.Drag)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockMoveX');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockMoveY');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // Lock resize behavior
    const canResizeNorth: boolean = !!(constraints & NodeConstraints.ResizeNorth);
    const canResizeSouth: boolean = !!(constraints & NodeConstraints.ResizeSouth);
    const canResizeEast: boolean = !!(constraints & NodeConstraints.ResizeEast);
    const canResizeWest: boolean = !!(constraints & NodeConstraints.ResizeWest);

    // Check if height resize is disabled (both north and south disabled)
    if (!canResizeNorth && !canResizeSouth) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockHeight');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // Check if width resize is disabled (both east and west disabled)
    if (!canResizeEast && !canResizeWest) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockWidth');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockRotate (if Rotate is disabled)
    if (!(constraints & NodeConstraints.Rotate)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockRotate');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockAspect (if AspectRatio is enabled)
    if (constraints & NodeConstraints.AspectRatio) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockAspect');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockFormat (if ReadOnly is enabled)
    if ((constraints & NodeConstraints.ReadOnly)
        || (node.annotations.length > 0 && (node.annotations[0].constraints & AnnotationConstraints.ReadOnly))) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockTextEdit');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }
}

/**
 * Exports connector constraints (editing restrictions) as Visio lock cells.
 * Constraints control which operations are allowed on a connector in Visio.
 *
 * Constraint Mapping:
 * - Drag disabled → LockMoveX, LockMoveY = 1
 * - Select disabled → LockSelect = 1
 * - Delete disabled → LockDelete = 1
 * - ReadOnly enabled → LockTextEdit = 1
 * - DragSourceEnd enabled → lockBegin = 1 (lock source endpoint)
 * - DragTargetEnd enabled → endLock = 1 (lock target endpoint)
 *
 * @private
 * @param {ConnectorModel} connector - The connector object containing constraint information
 * @param {XmlWriter} writer - Writer used to append constraint XML
 * @returns {void}
 *
 * @private
 */
function exportConnectorConstraints(connector: ConnectorModel, writer: XmlWriter): void {
    const constraints: ConnectorConstraints = connector.constraints;

    // Locking movement (if Drag is disabled)
    if (!(constraints & ConnectorConstraints.Drag)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockMoveX');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockMoveY');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockSelect (if Select is disabled)
    if (!(constraints & ConnectorConstraints.Select)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockSelect');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockDelete (if Delete is disabled)
    if (!(constraints & ConnectorConstraints.Delete)) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockDelete');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // LockFormat (if ReadOnly is enabled)
    if ((constraints & ConnectorConstraints.ReadOnly)
        || (connector.annotations.length > 0 && (connector.annotations[0].constraints & AnnotationConstraints.ReadOnly))) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LockTextEdit');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // lockBegin (if DragSourceEnd is enabled - locks source endpoint)
    if (constraints & ConnectorConstraints.DragSourceEnd) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'lockBegin');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // endLock (if DragTargetEnd is enabled - locks target endpoint)
    if (constraints & ConnectorConstraints.DragTargetEnd) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'endLock');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }
}

/**
 * Extracts all connector types from the diagram and adds them to the shape types map.
 * Currently, all connectors use the 'Dynamic connector' master, but this function
 * is structured to support multiple connector types in the future.
 *
 * Algorithm:
 * 1. Initialize set for required connector master types
 * 2. Iterate through all connectors
 * 3. Add 'Dynamic connector' type (currently always used)
 * 4. Assign master IDs to any new connector types
 *
 * @private
 * @param {Diagram} diagram - The diagram object from which to extract connector types
 * @param {Map<string, number>} shapeTypes - A map to store the extracted shape type names
 *                                          and their corresponding IDs
 *                                          (modified in-place)
 * @returns {void}
 */
function extractConnectorTypes(diagram: Diagram, shapeTypes: Map<string, number>): void {
    // Start master ID after all shape types
    let masterId: number = shapeTypes.size + 1;

    const requiredConnectorMasters: Set<string> = new Set<string>();

    // Iterate through all connectors and identify types
    if (diagram.connectors && diagram.connectors.length > 0) {
        diagram.connectors.forEach((_connector: Connector) => {
            // All connectors currently use the same dynamic connector master
            requiredConnectorMasters.add('Dynamic connector');
        });
    }

    // Ensure a default connector master exists if there are connectors
    // This handles edge case where connectors exist but iteration didn't find them
    if (diagram.connectors && diagram.connectors.length > 0 && requiredConnectorMasters.size === 0) {
        requiredConnectorMasters.add('Dynamic connector');
    }

    // Add any new connector master types to the shape types map
    requiredConnectorMasters.forEach((masterName: string) => {
        if (!shapeTypes.has(masterName)) {
            shapeTypes.set(masterName, masterId++);
        }
    });
}

/**
 * Generates the content for a connector master definition.
 * This master is used as a template for all dynamic connectors in the diagram.
 *
 * Master Structure:
 * - Includes shape with Bezier-compatible geometry
 * - Connection points for source and target endpoints
 * - Guard formulas for automatic positioning based on endpoints
 * - Properties for connector-specific behavior (glue type, feedback, etc.)
 *
 * Key Cells:
 * - PinX/PinY: Calculated as center of BeginX/EndX and BeginY/EndY
 * - Width/Height: Calculated as distance between endpoints
 * - BeginX/BeginY: Source endpoint position
 * - EndX/EndY: Target endpoint position
 * - DynFeedback: Enables interactive feedback (value 2)
 * - GlueType: 2 for dynamic glue (connects to shapes dynamically)
 * - ObjType: 2 indicates connector object
 * - ConFixedCode: 3 for auto-routed connector
 *
 * @private
 * @param {number} _masterId - The master ID for the connector (used in relationships)
 * @returns {string} XML string for the master content with complete MasterContents element
 */
function generateConnectorMasterContent(_masterId: number): string {
    const writer: XmlWriter = new XmlWriter();
    writer.writeStartDocument();

    // <MasterContents> with Visio namespace and relationship prefix declared
    writer.writeStartElement(null, 'MasterContents', 'http://schemas.microsoft.com/office/visio/2012/main');
    writer.writeAttributeString('xmlns', '', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/visio/2012/main');
    writer.writeAttributeString('xmlns', 'r', 'http://www.w3.org/2000/xmlns/', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    writer.writeAttributeString('xml', 'space', 'http://www.w3.org/XML/1998/namespace', 'preserve');

    writer.writeStartElement(null, 'Shapes', null);

    writer.writeStartElement(null, 'Shape', null);
    writer.writeAttributeString(null, 'ID', null, '5');
    writer.writeAttributeString(null, 'Type', null, 'Shape');
    writer.writeAttributeString(null, 'LineStyle', null, '3');
    writer.writeAttributeString(null, 'FillStyle', null, '3');
    writer.writeAttributeString(null, 'TextStyle', null, '3');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PinX');
    writer.writeAttributeString(null, 'V', null, '1.5');
    writer.writeAttributeString(null, 'F', null, 'GUARD((BeginX+EndX)/2)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'PinY');
    writer.writeAttributeString(null, 'V', null, '1.5');
    writer.writeAttributeString(null, 'F', null, 'GUARD((BeginY+EndY)/2)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Width');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'F', null, 'GUARD(EndX-BeginX)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Height');
    writer.writeAttributeString(null, 'V', null, '-1');
    writer.writeAttributeString(null, 'F', null, 'GUARD(EndY-BeginY)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LocPinX');
    writer.writeAttributeString(null, 'V', null, '0.5');
    writer.writeAttributeString(null, 'F', null, 'GUARD(Width*0.5)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LocPinY');
    writer.writeAttributeString(null, 'V', null, '-0.5');
    writer.writeAttributeString(null, 'F', null, 'GUARD(Height*0.5)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Angle');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'GUARD(0DA)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'FlipX');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'GUARD(FALSE)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'FlipY');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'GUARD(FALSE)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ResizeMode');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'BeginX');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'BeginY');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'EndX');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'EndY');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtPinX');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'SETATREF(Controls.TextPosition)');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtPinY');
    writer.writeAttributeString(null, 'V', null, '-1');
    writer.writeAttributeString(null, 'F', null, 'SETATREF(Controls.TextPosition.Y)');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtWidth');
    writer.writeAttributeString(null, 'V', null, '0.5555555555555556');
    writer.writeAttributeString(null, 'F', null, 'MAX(TEXTWIDTH(TheText),5*Char.Size)');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtHeight');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'F', null, 'TEXTHEIGHT(TheText,TxtWidth)');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtLocPinX');
    writer.writeAttributeString(null, 'V', null, '0.2777777777777778');
    writer.writeAttributeString(null, 'F', null, 'TxtWidth*0.5');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtLocPinY');
    writer.writeAttributeString(null, 'V', null, '0.1222222222222222');
    writer.writeAttributeString(null, 'F', null, 'TxtHeight*0.5');
    writer.writeEndElement();


    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'TxtAngle');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'BegTrigger');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'F', null, '_XFTRIGGER(EventXFMod)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'EndTrigger');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'F', null, '_XFTRIGGER(EventXFMod)');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'DynFeedback');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'GlueType');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ObjType');
    writer.writeAttributeString(null, 'V', null, '2');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLiveDynamics');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LayerMember');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LockDelete');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'LockTextEdit');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'ConFixedCode');
    writer.writeAttributeString(null, 'V', null, '3');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'User');

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'N', null, 'visVersion');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Value');
    writer.writeAttributeString(null, 'V', null, '15');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Prompt');
    writer.writeAttributeString(null, 'V', null, '');
    writer.writeAttributeString(null, 'F', null, 'No Formula');
    writer.writeEndElement();

    writer.writeEndElement(); // Row
    writer.writeEndElement(); // Section

    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'Geometry');
    writer.writeAttributeString(null, 'IX', null, '0');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoFill');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLine');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoShow');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoSnap');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'MoveTo');
    writer.writeAttributeString(null, 'IX', null, '1');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Width*0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Height*0');
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'LineTo');
    writer.writeAttributeString(null, 'IX', null, '2');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeAttributeString(null, 'F', null, 'Width*1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, '-1');
    writer.writeAttributeString(null, 'F', null, 'Height*1');
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    writer.writeEndElement(); // Section
    writer.writeEndElement(); // Shape
    writer.writeEndElement(); // Shapes
    writer.writeEndElement(); // MasterContents

    return writer.text;
}

/**
 * Generates master files for all connector types in the diagram.
 * For each connector master type found, creates the corresponding master*.xml file.
 *
 * Currently, all connectors use the 'Dynamic connector' master type.
 * This function is extensible for future support of multiple connector master types.
 *
 * @private
 * @param {Map<string, number>} shapeTypes - A map of shape type names to their corresponding IDs
 * @param {Diagram} diagram - The diagram object containing connector information
 * @param {Map<string, string>} masterFiles - A map where generated master file content
 *                                           will be stored, with the filename as the key
 *                                           (modified in-place)
 * @returns {void}
 *
 * @private
 */
function generateConnectorMasterFiles(shapeTypes: Map<string, number>, diagram: Diagram, masterFiles: Map<string, string>): void {
    // Iterate through all shape types looking for connector types
    shapeTypes.forEach((masterId: number, shapeType: string) => {
        // Check if this is a connector master
        if (shapeType === 'Dynamic connector') {
            // Generate connector master content
            const masterContent: string = generateConnectorMasterContent(masterId);

            // Add to master files collection
            masterFiles.set(`visio/masters/master${masterId}.xml`, masterContent);
        }
    });
}

/**
 * Measures text width (maximum of all lines) in pixels using canvas 2D context.
 * @param {string} text - The text content to measure
 * @param {number} fontSizePt - Font size in points (pt)
 * @param {string} fontFamily - CSS font-family string (e.g., "Calibri, Arial")
 * @param {'normal' | 'bold'} [fontWeight='normal'] - Font weight: 'normal' | 'bold'
 * @param {'normal' | 'italic'} [fontStyle='normal'] - Font style: 'normal' | 'italic'
 * @returns {number} Width in pixels
 * @throws {Error} If Canvas 2D context is unavailable
 */
function measureTextWidthPx(
    text: string,
    fontSizePt: number,
    fontFamily: string,
    fontWeight: 'normal' | 'bold' = 'normal',
    fontStyle: 'normal' | 'italic' = 'normal'
): number {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas 2D context is not available in this environment.');
    }
    const dpi: number = UNIT_CONVERSION.SCREEN_DPI;
    const fontSizePx: number = fontSizePt * dpi / 72;
    const fontStr: string = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
    ctx.font = fontStr;
    const lines: string[] = (text || '').split(/\r\n|\r|\n/);
    let maxPx: number = 0;
    for (const line of lines) {
        const m: number = ctx.measureText(line || '').width;
        if (m > maxPx) {
            maxPx = m;
        }
    }
    return maxPx;
}

/**
 * Converts pixels to points (1 inch = 72 points).
 * @param {number} px - Value in pixels
 * @returns {number} Value in points
 */
function pxToPoints(px: number): number {
    return px * 72 / UNIT_CONVERSION.SCREEN_DPI;
}

/**
 * Converts points to inches (1 inch = 72 points).
 * @param {number} pt - Value in points
 * @returns {number} Value in inches
 */
function pointsToInches(pt: number): number {
    return pt / 72;
}

/**
 * Measures single-line text height in pixels using TextMetrics if available.
 * Falls back to font-size based estimation if TextMetrics is unavailable.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context (must have font already set)
 * @param {string} text - Text to measure
 * @param {number} fontSizePt - Font size in points
 * @returns {number} Height in pixels
 */
function measureSingleLineHeightPx(
    ctx: CanvasRenderingContext2D,
    text: string,
    fontSizePt: number
): number {
    const metrics: TextMetrics = ctx.measureText(text || 'M');
    if (
        metrics &&
        typeof metrics.actualBoundingBoxAscent === 'number' &&
        typeof metrics.actualBoundingBoxDescent === 'number'
    ) {
        const h: number = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        if (h > 0) {
            return h;
        }
    }
    // Fallback: approximate using font size in pixels and a line-height multiplier
    const dpi: number = UNIT_CONVERSION.SCREEN_DPI;
    const fontSizePx: number = fontSizePt * dpi / 72;
    const fallbackLineHeightFactor: number = 1.2; // 1.0..1.3 typical
    return fontSizePx * fallbackLineHeightFactor;
}

/**
 * Computes Visio TxtWidth in inches following Visio rule:
 * MAX(TEXTWIDTH(TheText), 5 * Char.Size)
 * Algorithm:
 * 1. Measure text width in pixels using canvas
 * 2. Convert pixels to points
 * 3. Add optional padding for glyph overhang
 * 4. Apply Visio minimum width rule (5 * font size)
 * 5. Convert final points value to inches
 * @param {string} text - Text content to measure
 * @param {number} fontSizePt - Font size in points
 * @param {string} fontFamily - CSS font-family string (e.g., "Calibri, Arial")
 * @param {'normal' | 'bold'} [fontWeight='normal'] - Font weight: 'normal' | 'bold'
 * @param {'normal' | 'italic'} [fontStyle='normal'] - Font style: 'normal' | 'italic'
 * @returns {number} Width in inches suitable for Visio TxtWidth cell
 * @example
 * computeVisioTxtWidthInches('Hello', 12, 'Calibri');
 * Returns approximately 0.75 inches
 */
function computeVisioTxtWidthInches(
    text: string,
    fontSizePt: number,
    fontFamily: string,
    fontWeight: 'normal' | 'bold' = 'normal',
    fontStyle: 'normal' | 'italic' = 'normal'
): number {
    // Step 1: Measure text width in pixels
    const measuredPx: number = measureTextWidthPx(text, fontSizePt, fontFamily, fontWeight, fontStyle);
    // Step 2: Convert to points
    let measuredPoints: number = pxToPoints(measuredPx);
    // Step 3: Optional padding for glyph overhang (adjust if necessary)
    const paddingPoints: number = 0.0; // e.g., 0.5 for extra slack
    measuredPoints += paddingPoints;
    // Step 4: Visio minimum width rule (5 * Char.Size in points)
    const minPoints: number = 5 * fontSizePt;
    const finalPoints: number = Math.max(measuredPoints, minPoints);
    // Step 5: Convert to inches for Visio TxtWidth cell
    return pointsToInches(finalPoints);
}

/**
 * Measures multi-line text height in inches.
 * Algorithm:
 * 1. Create canvas and 2D context
 * 2. Build font string from parameters
 * 3. Split text into lines
 * 4. Measure each line height individually
 * 5. Sum all line heights
 * 6. Add optional padding for clipping prevention
 * 7. Convert total pixels to points to inches
 * @param {string} text - Text content (may include line breaks: \r\n, \r, or \n)
 * @param {number} fontSizePt - Font size in points
 * @param {string} fontFamily - CSS font-family string (e.g., "Calibri, Arial")
 * @param {'normal' | 'bold'} [fontWeight='normal'] - Font weight: 'normal' | 'bold'
 * @param {'normal' | 'italic'} [fontStyle='normal'] - Font style: 'normal' | 'italic'
 * @returns {number} Height in inches suitable for Visio TxtHeight cell
 * @throws {Error} If Canvas 2D context is unavailable
 * @example
 * measureTextHeightInches('Hello\nWorld', 12, 'Calibri');
 * // Returns approximately 0.35 inches (two lines)
 * measureTextHeightInches('Single line', 14, 'Arial', 'bold');
 * // Returns approximately 0.20 inches (one line, bold)
 */
function measureTextHeightInches(
    text: string,
    fontSizePt: number,
    fontFamily: string,
    fontWeight: 'normal' | 'bold' = 'normal',
    fontStyle: 'normal' | 'italic' = 'normal'
): number {
    // Create canvas and 2D context
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas 2D context not available');
    }
    // Build font string in pixels
    const dpi: number = UNIT_CONVERSION.SCREEN_DPI;
    const fontSizePx: number = fontSizePt * dpi / 72;
    const fontStr: string = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;
    ctx.font = fontStr;
    // Split text into lines and measure each
    const lines: string[] = (text || '').split(/\r\n|\r|\n/);
    let totalPx: number = 0;
    for (let i: number = 0; i < lines.length; i++) {
        // Measure each line height (use 'M' as fallback to avoid zero height from empty lines)
        const line: string = lines[parseInt(i.toString(), 10)] || 'M';
        const lineHpx: number = measureSingleLineHeightPx(
            ctx,
            line,
            fontSizePt
        );
        totalPx += lineHpx;
    }
    // Optional: add small padding to avoid text clipping
    const paddingPx: number = 0; // e.g., 1 or 2 px if clipping occurs
    totalPx += paddingPx;
    // Convert px -> points -> inches
    const totalPts: number = pxToPoints(totalPx);
    return pointsToInches(totalPts);
}

/**
 * Generates the XML representation of connector shapes for the Visio page.
 * Creates shape elements for all connectors with proper positioning, routing,
 * styling, annotations, and constraint information.
 *
 * Connector Processing:
 * 1. Determine master reference ('Dynamic connector')
 * 2. Calculate endpoints in inches
 * 3. Calculate bounding box (PinX, PinY, Width, Height)
 * 4. Add styling (line color, weight, pattern, opacity)
 * 5. Add annotations and text styling
 * 6. Add arrow decorators (source and target)
 * 7. Add geometry (connector path)
 * 8. Add ports if present
 * 9. Apply constraints
 *
 * Special Handling:
 * - Group connectors: Optional parent group node handling
 * - Port connections: Use specific port indices if available
 * - Geometry types: Straight, Orthogonal, and Bezier curves
 * - Triggers: Reference source/target shapes for dynamic updates
 *
 * @private
 * @param {XmlWriter} writer - The XmlWriter instance used to generate the XML output
 * @param {Diagram} diagram - The diagram object containing connector information
 * @param {Map<string, number>} shapeTypes - A map of shape type names to their corresponding IDs
 * @param {number} startId - The starting ID for generating connector shapes
 * @param {Map<string, Map<string, number>>} portConnectionsMap - Mapping from nodeId to
 *                                                                (portId to visioIdx)
 * @param {ParsingContext} context - Parsing context for logging
 * @param {ConnectorModel[]} [childConnector] - Optional array of child connectors
 *                                             (for group connectors)
 * @param {NodeModel} [groupNode] - Optional parent group node (for coordinate transformation)
 * @returns {void}
 */
function generateConnectorShapesXml(
    writer: XmlWriter,
    diagram: Diagram,
    shapeTypes: Map<string, number>,
    startId: number,
    portConnectionsMap: Map<string, Map<string, number>>,
    context: ParsingContext,
    childConnector?: ConnectorModel[],
    groupNode?: NodeModel
): void {
    let shapeId: number = startId;
    const connectors: ConnectorModel[] = diagram.connectors;

    // Process each connector in the diagram
    for (const connector of connectors) {
        if (connector.type === 'Bezier') {
            context.addWarning('[WARNING] :: Bezier connectors are approximated and exported as curve connectors in visio, so the segments may differ after export.');
        }
        // Skip child connectors if not processing them specifically
        if (!childConnector && (connector as Connector).parentId) {
            continue;
        }

        // Skip invisible connectors
        if (connector.visible === false) {
            continue;
        }

        // Get connector master (currently always 'Dynamic connector')
        const masterName: string = 'Dynamic connector';
        const masterId: number = shapeTypes.get(masterName);

        // Calculate connector endpoints in inches
        const pageDimension: { width: number, height: number } = getPageDimension(diagram);
        const pageHeight: number = pageDimension.height;

        let beginX: number = connector.sourcePoint.x / UNIT_CONVERSION.SCREEN_DPI;
        let beginY: number = (pageHeight - connector.sourcePoint.y) / UNIT_CONVERSION.SCREEN_DPI;
        let endX: number = connector.targetPoint.x / UNIT_CONVERSION.SCREEN_DPI;
        let endY: number = (pageHeight - connector.targetPoint.y) / UNIT_CONVERSION.SCREEN_DPI;

        // Adjust coordinates if connector is within a group
        if ((connector as Connector).parentId) {
            beginX = ((connector.sourcePoint.x - groupNode.wrapper.bounds.x)) / UNIT_CONVERSION.SCREEN_DPI;
            beginY = (Number(groupNode.height) - (connector.sourcePoint.y - groupNode.wrapper.bounds.y)) / UNIT_CONVERSION.SCREEN_DPI;
            endX = ((connector.targetPoint.x - groupNode.wrapper.bounds.x)) / UNIT_CONVERSION.SCREEN_DPI;
            endY = (Number(groupNode.height) - (connector.targetPoint.y - groupNode.wrapper.bounds.y)) / UNIT_CONVERSION.SCREEN_DPI;
        }

        // Calculate connector bounding box
        const width: number = endX - beginX;
        const height: number = endY - beginY;

        // Calculate center point (PinX, PinY)
        const pinX: number = (beginX + endX) / 2;
        const pinY: number = (beginY + endY) / 2;

        // Calculate local pin (relative to bounding box)
        const locPinX: number = width / 2;
        const locPinY: number = height / 2;

        // Get connector styling properties
        const rounding: number = (connector.cornerRadius || 0) / 72;
        // Map connector type to Visio routing properties (ConLineRouteExt and ShapeRouteStyle)
        const routingProps: { conLineRouteExt: string; shapeRouteStyle: string; } = getVisioConnectorRouting(connector.type);

        // Find which layer this connector belongs to
        let layerMember: number = 0;
        for (let i: number = 0; i < diagram.layers.length; i++) {
            if ((diagram.layers[parseInt(i.toString(), 10)].objects as string[]).indexOf(connector.id) !== -1) {
                layerMember = i;
                break;
            }
        }

        // Initialize connection formulas (will be updated if ports are used)
        let sourceConnectionFormula: string = '_WALKGLUE(BegTrigger,EndTrigger,WalkPreference)';
        let targetConnectionFormula: string = '_WALKGLUE(BegTrigger,EndTrigger,WalkPreference)';

        // Find source and target shape indices
        let sourceNodeIndex: number = diagram.nodes.findIndex((node: NodeModel) => node.id === connector.sourceID);
        let targetNodeIndex: number = diagram.nodes.findIndex((node: NodeModel) => node.id === connector.targetID);

        // Check for source port connection
        if (connector.sourcePortID) {
            if (sourceNodeIndex === -1) {
                sourceNodeIndex = diagram.connectors.findIndex((connect: ConnectorModel) => connect.id === connector.sourceID);
                sourceNodeIndex += diagram.nodes.length;
            }
            const nodePorts: Map<string, number> = portConnectionsMap.get(connector.sourceID);
            const toPart: number = nodePorts && nodePorts.get(connector.sourcePortID) + 1;
            sourceConnectionFormula = `PAR(PNT(Sheet.${String(sourceNodeIndex + 1)}!Connections.X${String(toPart)},Sheet.${String(sourceNodeIndex + 1)}!Connections.Y${String(toPart)}))`;
        }

        // Check for target port connection
        if (connector.targetPortID) {
            if (targetNodeIndex === -1) {
                targetNodeIndex = diagram.connectors.findIndex((connect: ConnectorModel) => connect.id === connector.targetID);
                targetNodeIndex += diagram.nodes.length;
            }
            const nodePorts: Map<string, number> = portConnectionsMap.get(connector.targetID);
            const toPart: number = nodePorts && nodePorts.get(connector.targetPortID) + 1;
            targetConnectionFormula = `PAR(PNT(Sheet.${String(targetNodeIndex + 1)}!Connections.X${String(toPart)},Sheet.${String(targetNodeIndex + 1)}!Connections.Y${String(toPart)}))`;
        }

        // Build connector shape XML with all properties
        writer.writeStartElement(null, 'Shape', null);
        writer.writeAttributeString(null, 'ID', null, (shapeId++).toString());
        writer.writeAttributeString(null, 'NameU', null, masterName);
        writer.writeAttributeString(null, 'Name', null, masterName);
        writer.writeAttributeString(null, 'Type', null, 'Shape');
        writer.writeAttributeString(null, 'Master', null, masterId.toString());
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinX');
        writer.writeAttributeString(null, 'V', null, pinX.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD((BeginX+EndX)/2)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'PinY');
        writer.writeAttributeString(null, 'V', null, pinY.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD((BeginY+EndY)/2)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Width');
        writer.writeAttributeString(null, 'V', null, width.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD(EndX-BeginX)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Height');
        writer.writeAttributeString(null, 'V', null, height.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD(EndY-BeginY)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinX');
        writer.writeAttributeString(null, 'V', null, locPinX.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD(Width*0.5)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LocPinY');
        writer.writeAttributeString(null, 'V', null, locPinY.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, 'GUARD(Height*0.5)');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'BeginX');
        writer.writeAttributeString(null, 'V', null, beginX.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, sourceConnectionFormula);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'BeginY');
        writer.writeAttributeString(null, 'V', null, beginY.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, sourceConnectionFormula);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'EndX');
        writer.writeAttributeString(null, 'V', null, endX.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, targetConnectionFormula);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'EndY');
        writer.writeAttributeString(null, 'V', null, endY.toFixed(COORDINATE_PRECISION));
        writer.writeAttributeString(null, 'F', null, targetConnectionFormula);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'LayerMember');
        writer.writeAttributeString(null, 'V', null, layerMember.toString());
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoAlignBox');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'DynFeedback');
        writer.writeAttributeString(null, 'V', null, '2');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'GlueType');
        writer.writeAttributeString(null, 'V', null, '2');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ObjType');
        writer.writeAttributeString(null, 'V', null, '2');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'NoLiveDynamics');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ConFixedCode');
        writer.writeAttributeString(null, 'V', null, '3');
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ConLineRouteExt');
        writer.writeAttributeString(null, 'V', null, routingProps.conLineRouteExt);
        writer.writeEndElement();
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'ShapeRouteStyle');
        writer.writeAttributeString(null, 'V', null, routingProps.shapeRouteStyle);
        writer.writeEndElement();
        // Add trigger formulas for dynamic updates when source/target shapes change
        if (sourceNodeIndex >= 0) {
            const sourceShapeId: number = sourceNodeIndex + 1;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'BegTrigger');
            writer.writeAttributeString(null, 'V', null, '2');
            writer.writeAttributeString(null, 'F', null, `_XFTRIGGER(Sheet.${sourceShapeId}!EventXFMod)`);
            writer.writeEndElement();
        } else {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'BegTrigger');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeAttributeString(null, 'F', null, '_XFTRIGGER(EventXFMod)');
            writer.writeEndElement();
        }
        if (targetNodeIndex >= 0) {
            const targetShapeId: number = targetNodeIndex + 1;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'EndTrigger');
            writer.writeAttributeString(null, 'V', null, '2');
            writer.writeAttributeString(null, 'F', null, `_XFTRIGGER(Sheet.${targetShapeId}!EventXFMod)`);
            writer.writeEndElement();
        } else {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'EndTrigger');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeAttributeString(null, 'F', null, '_XFTRIGGER(EventXFMod)');
            writer.writeEndElement();
        }

        // Handle connector annotations (labels)
        if (connector.annotations && connector.annotations.length > 0) {
            const annotation: PathAnnotation = connector.annotations[0] as PathAnnotation;

            // Source point coordinates in pixels
            const sourcePointX: number = connector.sourcePoint.x;
            const sourcePointY: number = connector.sourcePoint.y;

            // Annotation text element position in pixels
            let annotationTextElementX: number;
            let annotationTextElementY: number;

            // Find the child wrapper that is a TextElement and belongs to this annotation
            const annotationId: string = annotation.id;
            for (const child of (connector.wrapper.children || [])) {
                // Ensure it's a TextElement and id contains the annotation id
                if (child instanceof TextElement && child.id) {
                    const text: string[] = child.id.split('_');
                    const last: string = text[text.length - 1];
                    if (last === annotationId) {
                        annotationTextElementX = child.offsetX;
                        annotationTextElementY = child.offsetY;
                        break; // Found the annotation element, exit loop
                    }

                }
            }

            // Calculate annotation position using connector bounds and path
            //const bounds: Rect = connector.wrapper.bounds;
            //const pathOffset: PointModel = getPathOffset((connector as Connector).intermediatePoints, annotation, annotation.offset);
            // Calculate position relative to source point in inches
            const annotationRelativePosition: PointModel = {
                x: (annotationTextElementX - sourcePointX) / UNIT_CONVERSION.SCREEN_DPI,
                y: -(annotationTextElementY - sourcePointY) / UNIT_CONVERSION.SCREEN_DPI
            };

            const fontSizePt: number = annotation.style && annotation.style.fontSize ? annotation.style.fontSize : 12; // fallback
            const fontFamily: string = annotation.style && annotation.style.fontFamily ? annotation.style.fontFamily : 'Calibri';
            const fontWeight: 'normal' | 'bold' = annotation.style && annotation.style.bold ? 'bold' : 'normal';
            const fontStyle: 'normal' | 'italic' = annotation.style && annotation.style.italic ? 'italic' : 'normal';

            // Compose the text used by Visio: if hyperlink content used, pick that or annotation content
            const textContent: string = annotation.content || (annotation.hyperlink && annotation.hyperlink.content) || '';

            // Compute Visio TxtWidth in inches
            const txtWidthIn: number = computeVisioTxtWidthInches(textContent, fontSizePt, fontFamily, fontWeight, fontStyle);
            const txtHeightIn: number = measureTextHeightInches(annotation.content || '', fontSizePt, fontFamily, fontWeight, fontStyle);

            // // Convert displacement and margin to inches
            // const marginLeft: number = annotation.margin.left || 0;
            // const marginRight: number = annotation.margin.right || 0;
            // const marginTop: number = annotation.margin.top || 0;
            // const marginBottom: number = annotation.margin.bottom || 0;

            // // Combine displacement and margin translations
            // const displacementX: number = (annotation.displacement.x || 0) + marginLeft - marginRight;
            // const displacementY: number = (annotation.displacement.y || 0) + marginTop - marginBottom;

            let transformedX: number = annotationRelativePosition.x;
            const transformedY: number = annotationRelativePosition.y;

            // Find annotation wrapper for alignment calculations
            const wrapper: GroupableView = connector.wrapper;
            let annotationWrapper: DiagramElement;
            for (let i: number = 0; i < wrapper.children.length; i++) {
                const id: string = connector.id + '_' + connector.annotations[0].id;
                if (wrapper.children[parseInt(i.toString(), 10)].id === id) {
                    annotationWrapper = wrapper.children[parseInt(i.toString(), 10)];
                    break;
                }
            }

            // Adjust for text horizontal alignment
            if (connector.annotations[0].horizontalAlignment === 'Left') {
                transformedX = transformedX + (annotationWrapper.actualSize.width * 0.5 / connector.wrapper.width);
            } else if (connector.annotations[0].horizontalAlignment === 'Right') {
                transformedX = transformedX - (annotationWrapper.actualSize.width * 0.5 / connector.wrapper.width);
            }
            context.addWarning('[WARNING] :: For vertical connectors the text will be in vertical direction during export.');
            // Calculate text dimensions
            //const dpiScale: number = UNIT_CONVERSION.SCREEN_DPI;
            // const textWidth: number = annotation.width / dpiScale || bounds.width / dpiScale;
            // const textHeight: number = annotation.height / dpiScale || Math.max(bounds.height / dpiScale, 0.1);

            // Add text positioning cells
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinX');
            writer.writeAttributeString(null, 'V', null, (transformedX).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinY');
            writer.writeAttributeString(null, 'V', null, (transformedY).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtWidth');
            writer.writeAttributeString(null, 'V', null, txtWidthIn.toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtHeight');
            writer.writeAttributeString(null, 'V', null, txtHeightIn.toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtLocPinX');
            writer.writeAttributeString(null, 'V', null, (txtWidthIn / 2).toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtLocPinY');
            writer.writeAttributeString(null, 'V', null, (txtHeightIn / 2).toString());
            writer.writeEndElement();
            // Add text rotation if present
            if (annotationWrapper.rotateAngle) {
                const angle: number = annotationWrapper.rotateAngle * (Math.PI / 180);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'TxtAngle');
                writer.writeAttributeString(null, 'V', null, (angle * -1).toString());
                writer.writeEndElement();
            }

            // Hide text if visibility is false
            if (!annotation.visibility) {
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'HideText');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
            }

            // Set vertical alignment
            if (annotation.verticalAlignment) {
                const align: number = getVisioAlign(annotation.verticalAlignment);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'VerticalAlign');
                writer.writeAttributeString(null, 'V', null, align.toString());
                writer.writeEndElement();
            }
        }
        else {

            // Provide defaults and write only TxtPinX and TxtPinY (empty text)
            // Compute source point defaults
            connector.annotations = [{content: ''}];
            const sourcePointX: number = connector.sourcePoint.x;
            const sourcePointY: number = connector.sourcePoint.y;

            // Default pin position at connector's wrapper center (fallback)
            const point: SegmentInfo = getAnnotationPosition(
                (connector as Connector).intermediatePoints,
                connector.annotations[0] as PathAnnotation | ConnectorFixedUserHandle,
                undefined);
            const transformedX: number = ((point.point.x - sourcePointX) / UNIT_CONVERSION.SCREEN_DPI) || 0;
            const transformedY: number = (-(point.point.y - sourcePointY) / UNIT_CONVERSION.SCREEN_DPI) || 0;

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinX');
            writer.writeAttributeString(null, 'V', null, (transformedX).toString());
            writer.writeEndElement();

            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'TxtPinY');
            writer.writeAttributeString(null, 'V', null, (transformedY).toString());
            writer.writeEndElement();
            connector.annotations = [];
        }
        // Export connector annotations
        exportConnectorAnnotations(connector, writer);

        // Add styling properties (colors, line weight, patterns)
        if (connector.style) {
            if (connector.sourceDecorator.style.strokeColor) {
                const color: string = colorNameToHex(connector.sourceDecorator.style.strokeColor);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'LineColor');
                writer.writeAttributeString(null, 'V', null, color);
                writer.writeAttributeString(null, 'F', null, 'THEMEGUARD(MSOTINT(THEMEVAL("AccentColor2"),40))');
                writer.writeEndElement();
            }
            if (connector.sourceDecorator.style && connector.sourceDecorator.style.gradient &&
                connector.sourceDecorator.style.gradient.type !== 'None') {
                const gradient: Gradient | LinearGradient |
                RadialGradient | DiagramGradientModel = connector.sourceDecorator.style.gradient;
                // Enable gradient fill
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'LineGradientEnabled');
                writer.writeAttributeString(null, 'V', null, '1');
                writer.writeEndElement();
                // Handle linear gradients
                if (gradient.type === 'Linear') {
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'LineGradientDir');
                    writer.writeAttributeString(null, 'V', null, '0');
                    writer.writeEndElement();
                    // Calculate gradient angle
                    const gradientAngle: number = calculateVisioGradientAngle(gradient as LinearGradient);
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'LineGradientAngle');
                    writer.writeAttributeString(null, 'V', null, gradientAngle.toString());
                    writer.writeEndElement();
                }
                // Handle radial gradients
                else if (gradient.type === 'Radial') {
                    writer.writeStartElement(null, 'Cell', null);
                    writer.writeAttributeString(null, 'N', null, 'LineGradientDir');
                    writer.writeAttributeString(null, 'V', null, '5');
                    writer.writeEndElement();
                }
                // Add gradient stop colors if available
                if (gradient.stops && gradient.stops.length > 0) {
                    writer.writeStartElement(null, 'Section', null);
                    writer.writeAttributeString(null, 'N', null, 'LineGradient');
                    gradient.stops.forEach((stop: Stop, index: number) => {
                        writer.writeStartElement(null, 'Row', null);
                        writer.writeAttributeString(null, 'IX', null, index.toString());
                        writer.writeStartElement(null, 'Cell', null);
                        writer.writeAttributeString(null, 'N', null, 'GradientStopColor');
                        writer.writeAttributeString(null, 'V', null, colorNameToHex(stop.color));
                        writer.writeEndElement();
                        writer.writeStartElement(null, 'Cell', null);
                        writer.writeAttributeString(null, 'N', null, 'GradientStopColorTrans');
                        writer.writeAttributeString(null, 'V', null, '0');
                        writer.writeEndElement();
                        writer.writeStartElement(null, 'Cell', null);
                        writer.writeAttributeString(null, 'N', null, 'GradientStopPosition');
                        writer.writeAttributeString(null, 'V', null, stop.offset.toString());
                        writer.writeEndElement();
                        writer.writeEndElement(); // Row
                    });

                    // Add deleted rows to match expected format (Visio expects up to 10 stops)
                    for (let i: number = gradient.stops.length; i < 10; i++) {
                        writer.writeStartElement(null, 'Row', null);
                        writer.writeAttributeString(null, 'IX', null, i.toString());
                        writer.writeAttributeString(null, 'Del', null, '1');
                        writer.writeEndElement();
                    }
                    writer.writeEndElement(); // Section
                }
            }
            if (connector.style.strokeWidth) {
                const lineWeight: number = connector.style.strokeWidth / UNIT_CONVERSION.SCREEN_DPI;
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'LineWeight');
                writer.writeAttributeString(null, 'V', null, lineWeight.toFixed(COORDINATE_PRECISION));
                writer.writeEndElement();
            }

            if (connector.style.strokeDashArray) {
                context.addWarning('[WARNING] :: Stroke dash arrays are approximated from Visio, so the appearance of dashed connectors may vary after export.');
                const linePattern: string = getVisioLinePattern(connector.style.strokeDashArray);
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'LinePattern');
                writer.writeAttributeString(null, 'V', null, linePattern);
                writer.writeEndElement();
            }

            if (connector.style.opacity !== undefined) {
                const transparency: number = 1 - connector.style.opacity;
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'LineColorTrans');
                writer.writeAttributeString(null, 'V', null, transparency.toString());
                writer.writeEndElement();
            }
        }

        // Add corner radius if present
        if (connector.cornerRadius) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Rounding');
            writer.writeAttributeString(null, 'V', null, rounding.toString());
            writer.writeAttributeString(null, 'U', null, 'IN');
            writer.writeEndElement();
        }

        // Add tooltip/comment if present
        if (connector.constraints & ConnectorConstraints.Tooltip) {
            const tooltip: string = connector.tooltip.content as string;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Comment');
            writer.writeAttributeString(null, 'V', null, tooltip);
            writer.writeEndElement();
        }

        // Add source arrow decorator if present
        if (connector.sourceDecorator && connector.sourceDecorator.shape !== 'None') {
            const arrowType: number = getVisioArrowType(connector.sourceDecorator.shape);
            const arrowSize: number = getVisioArrowSize(connector.sourceDecorator.shape, connector.sourceDecorator.width,
                                                        connector.sourceDecorator.height);
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'BeginArrow');
            writer.writeAttributeString(null, 'V', null, arrowType.toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'BeginArrowSize');
            writer.writeAttributeString(null, 'V', null, arrowSize.toString());
            writer.writeEndElement();
            if (connector.sourceDecorator.style && connector.sourceDecorator.style.fill) {
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'BeginArrowFill');
                writer.writeAttributeString(null, 'V', null, (connector.sourceDecorator.style.fill === 'transparent' ? 0 : 1).toString());
                writer.writeEndElement();
            }
        }

        // Add target arrow decorator if present
        if (connector.targetDecorator && connector.targetDecorator.shape !== 'None') {
            const arrowType: number = getVisioArrowType(connector.targetDecorator.shape);
            const arrowSize: number = getVisioArrowSize(connector.targetDecorator.shape, connector.targetDecorator.width,
                                                        connector.targetDecorator.height);
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'EndArrow');
            writer.writeAttributeString(null, 'V', null, arrowType.toString());
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'EndArrowSize');
            writer.writeAttributeString(null, 'V', null, arrowSize.toString());
            writer.writeEndElement();
            if (connector.targetDecorator.style && connector.targetDecorator.style.fill) {
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'EndArrowFill');
                writer.writeAttributeString(null, 'V', null, (connector.targetDecorator.style.fill === 'transparent' ? 0 : 1).toString());
                writer.writeEndElement();
            }
        }

        // Export connector constraints (locking/restrictions)
        if (connector.constraints) {
            exportConnectorConstraints(connector, writer);
        }

        // Handle connector ports (attachment points for sub-connectors)
        if (connector.ports && connector.ports.length > 0) {
            let connectionRowIndex: number = 0;
            const connectorPortsMap: Map<string, number> = new Map<string, number>();
            writer.writeStartElement(null, 'Section', null);
            writer.writeAttributeString(null, 'N', null, 'Connection');
            connector.ports.forEach((port: PathPort) => {
                // Calculate absolute port position using connector bounds
                // Source point coordinates in pixels
                const sourcePointX: number = connector.sourcePoint.x;
                const sourcePointY: number = connector.sourcePoint.y;

                // Annotation text element position in pixels
                let PortElementX: number;
                let PortElementY: number;
                const bounds: Rect = connector.wrapper.bounds;
                const portId: string = port.id;
                for (const child of (connector.wrapper.children || [])) {
                    // Make sure it's the path element that represents the port glyph
                    if (child instanceof PathElement && child.id) {
                        // Typical child id pattern: "<connectorId>_<portId>" (can have more underscores)
                        const parts: string[] = child.id.split('_');
                        const last: string = parts[parts.length - 1];
                        if (last === portId) {
                            PortElementX = child.offsetX;
                            PortElementY = child.offsetY;
                            break;
                        }
                    }
                }
                const portRelativePosition: PointModel = {
                    x: (PortElementX - sourcePointX) / UNIT_CONVERSION.SCREEN_DPI,
                    y: -((PortElementY - sourcePointY) / UNIT_CONVERSION.SCREEN_DPI)
                };

                const transformedX: number = portRelativePosition.x;
                const transformedY: number = portRelativePosition.y;

                // Find port wrapper for alignment calculations
                const wrapper: GroupableView = connector.wrapper;
                let portWrapper: DiagramElement;
                for (let i: number = 0; i < wrapper.children.length; i++) {
                    const id: string = connector.id + '_' + port.id;
                    if (wrapper.children[parseInt(i.toString(), 10)].id === id) {
                        portWrapper = wrapper.children[parseInt(i.toString(), 10)];
                        break;
                    }
                }

                // Generate Visio XML for port
                writer.writeStartElement(null, 'Row', null);
                writer.writeAttributeString(null, 'T', null, 'Connection');
                writer.writeAttributeString(null, 'IX', null, (connectionRowIndex + 1).toString());
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'X');
                writer.writeAttributeString(null, 'V', null, transformedX.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Y');
                writer.writeAttributeString(null, 'V', null, transformedY.toString());
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'DirX');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'DirY');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'Protection');
                writer.writeAttributeString(null, 'V', null, '0');
                writer.writeEndElement();
                writer.writeStartElement(null, 'Cell', null);
                writer.writeAttributeString(null, 'N', null, 'ID');
                writer.writeAttributeString(null, 'V', null, port.id);
                writer.writeEndElement();
                writer.writeEndElement(); // Row
                connectorPortsMap.set(port.id, connectionRowIndex);
                connectionRowIndex++;
            });
            writer.writeEndElement(); // Section
            // Store the port map for later use
            portConnectionsMap.set(connector.id, connectorPortsMap);
        }
        // Generate connector geometry (path)
        generateConnectorGeometryXml(connector, beginX, beginY, endX, endY, width, height, Number(pageHeight), writer);

        // Close connector shape
        writer.writeEndElement(); // Shape
    }
}

/**
 * Exports the annotations (text content) of a connector into its Visio shape XML.
 * This includes the primary text content of the annotation, hyperlinks,
 * and text styling information.
 *
 * Handles:
 * - Annotation content text
 * - Hyperlink text (if present)
 * - Text styling (color, font, formatting)
 * - Hyperlink sections
 *
 * @private
 * @param {ConnectorModel} connector - The connector object containing annotation information
 * @param {XmlWriter} writer - Writer used to append annotation XML
 * @returns {void}
 *
 * @private
 */
function exportConnectorAnnotations(connector: ConnectorModel, writer: XmlWriter): void {
    // Handle connector annotations (Syncfusion's annotation system)
    if (connector.annotations && connector.annotations.length > 0) {
        const annotation: PathAnnotationModel = connector.annotations[0]; // Primary annotation
        // Add annotation content as text
        if (annotation.content) {
            writer.writeStartElement(null, 'Text', null);
            writer.writeRaw(escapeXmlText(annotation.content));
            writer.writeEndElement();
        }

        // Add hyperlink text if present
        if (annotation.hyperlink.content) {
            writer.writeStartElement(null, 'Text', null);
            writer.writeRaw(escapeXmlText(annotation.hyperlink.content));
            writer.writeEndElement();
        }
        // Add text styling for connectors
        exportTextStyling(annotation, writer, 'connector');
    }
}

/**
 * Exports text styling properties of an annotation (for both nodes and connectors) into the Visio shape XML.
 * This comprehensive function handles properties like color, font size, font family, weight, style (italic),
 * alignment, and text decorations, applying them through various XML sections.
 *
 * Styling Levels:
 * 1. Cell-level: Direct cell values for quick properties
 * 2. Character section: Detailed font and color properties
 * 3. Paragraph section: Text alignment
 * 4. Hyperlink section: Link information
 *
 * @private
 * @param {ShapeAnnotationModel | PathAnnotationModel} annotation - The annotation object containing styling information
 * @param {XmlWriter} writer - Writer used to append styling XML
 * @param {'node' | 'connector'} elementType - Specifies whether the text styling is for a node or connector,
 *                                            helping with context-specific adjustments
 * @returns {void}
 *
 * @private
 */
function exportTextStyling(annotation: ShapeAnnotationModel | PathAnnotationModel, writer: XmlWriter, elementType: 'node' | 'connector'): void {
    // Early return if no styling information
    if (!annotation.style) {
        return;
    }

    const style: TextStyleModel = annotation.style;
    // Add text color cell
    if (style.color) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Char.Color');
        writer.writeAttributeString(null, 'V', null, colorNameToHex(style.color));
        writer.writeEndElement();
    }

    // Add font size cell (convert points to inches: divide by 72, then by 1.33)
    if (style.fontSize) {
        const sizeInInches: number = style.fontSize / 72 / 1.33;
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Char.Size');
        writer.writeAttributeString(null, 'V', null, sizeInInches.toFixed(COORDINATE_PRECISION));
        writer.writeEndElement();
    }

    // Add font family cell
    if (style.fontFamily) {
        const formattedFontFamily: string = style.fontFamily.replace(/([a-z])([A-Z])/g, '$1 $2');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Char.Font');
        writer.writeAttributeString(null, 'V', null, formattedFontFamily);
        writer.writeEndElement();
    }

    // Add bold styling
    if (style.bold || ((style as TextStyle).fontSize && (style.fontSize >= 600))) {
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Char.Style');
        writer.writeAttributeString(null, 'V', null, '1');
        writer.writeEndElement();
    }

    // Add italic styling
    if (style.italic) {
        const currentStyle: string = style.bold ? '3' : '2'; // 3 = bold+italic, 2 = italic only
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Char.Style');
        writer.writeAttributeString(null, 'V', null, currentStyle);
        writer.writeEndElement();
    }

    // Add text horizontal alignment
    if (style.textAlign) {
        const alignment: number = getVisioTextAlign(style.textAlign);
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Para.HorzAlign');
        writer.writeAttributeString(null, 'V', null, alignment.toString());
        writer.writeEndElement();
    }

    // Add text decorations (underline, line-through)
    if (style.textDecoration) {
        if (style.textDecoration.includes('Underline')) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Char.Strikethru');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Char.DblUnderline');
            writer.writeAttributeString(null, 'V', null, '0');
            writer.writeEndElement();
        }
        if (style.textDecoration.includes('LineThrough')) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Char.Strikethru');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeEndElement();
        }
    }

    // Add vertical alignment
    if (annotation.verticalAlignment) {
        let vAlign: number = 1; // Middle (default)
        switch (annotation.verticalAlignment.toLowerCase()) {
        case 'top':
            vAlign = 0;
            break;
        case 'bottom':
            vAlign = 2;
            break;
        default:
            vAlign = 1; // Middle
        }
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'VerticalAlign');
        writer.writeAttributeString(null, 'V', null, vAlign.toString());
        writer.writeEndElement();
    }

    // Check if annotation has hyperlink
    const isHyperlink: boolean = Boolean(annotation.hyperlink && annotation.hyperlink.link);

    // Add Character section for detailed font styling
    if (style.color || style.fontSize || style.fontFamily || style.bold || style.italic) {
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'Character');
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'IX', null, '0');
        // Font name
        if (style.fontFamily) {
            const formattedFontFamily: string = style.fontFamily.replace(/([a-z])([A-Z])/g, '$1 $2');
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Font');
            writer.writeAttributeString(null, 'V', null, formattedFontFamily);
            writer.writeEndElement();
        }

        // Font color
        if (style.color) {
            let color: string = colorNameToHex(style.color);
            // Override with hyperlink color if present
            if (isHyperlink && (annotation.hyperlink as Hyperlink).color) {
                color = colorNameToHex((annotation.hyperlink as Hyperlink).color);
            }
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Color');
            writer.writeAttributeString(null, 'V', null, color);
            writer.writeEndElement();
        }

        // Font size in inches
        if (style.fontSize) {
            const sizeInInches: number = style.fontSize / 72 / 1.33;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Size');
            writer.writeAttributeString(null, 'V', null, sizeInInches.toFixed(COORDINATE_PRECISION));
            writer.writeEndElement();
        }

        // Text opacity/transparency
        if (style.opacity) {
            const opacity: number = 1 - style.opacity;
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'ColorTrans');
            writer.writeAttributeString(null, 'V', null, opacity.toString());
            writer.writeEndElement();
        }

        // Font style (bold, italic, underline)
        if (style.bold || style.italic || style.textDecoration === 'Underline'
            || (isHyperlink && (annotation.hyperlink as Hyperlink).textDecoration === 'Underline')) {
            let styleValue: number = 0; // Normal
            if (style.bold) {
                styleValue += 1; // Bold
            }
            if (style.italic) {
                styleValue += 2; // Italic
            }
            if (style.textDecoration === 'Underline'
                || (isHyperlink && (annotation.hyperlink as Hyperlink).textDecoration === 'Underline')) {
                styleValue += 4; // Underline
            }
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Style');
            writer.writeAttributeString(null, 'V', null, styleValue.toString());
            writer.writeEndElement();
        }

        // Strikethrough (line-through)
        if (style.textDecoration === 'LineThrough' || (isHyperlink && (annotation.hyperlink as Hyperlink).textDecoration === 'LineThrough')) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Strikethru');
            writer.writeAttributeString(null, 'V', null, '1');
            writer.writeEndElement();
        }
        writer.writeEndElement(); // Row
        writer.writeEndElement(); // Section
    }

    // Add Hyperlink section if hyperlink is present
    if (annotation.hyperlink && (annotation.hyperlink as Hyperlink).link) {
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'Hyperlink');
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'N', null, 'Row_1');
        if ((annotation.hyperlink as Hyperlink).link) {
            writer.writeStartElement(null, 'Cell', null);
            writer.writeAttributeString(null, 'N', null, 'Address');
            writer.writeAttributeString(null, 'V', null, (annotation.hyperlink as Hyperlink).link);
            writer.writeEndElement();
        }
        writer.writeEndElement(); // Row
        writer.writeEndElement(); // Section
    }

    // Add Paragraph section for text alignment
    if (style.textAlign) {
        writer.writeStartElement(null, 'Section', null);
        writer.writeAttributeString(null, 'N', null, 'Paragraph');
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'IX', null, '0');
        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'HorzAlign');
        writer.writeAttributeString(null, 'V', null, getVisioTextAlign(style.textAlign).toString());
        writer.writeEndElement();
        writer.writeEndElement(); // Row
        writer.writeEndElement(); // Section
    }
}

/**
 * Converts a CSS color name or RGB/RGBA string to its hexadecimal representation.
 * This is crucial for matching Visio's color format which typically uses hex values.
 *
 * Algorithm:
 * 1. Create temporary DOM element
 * 2. Set its color property to the input value
 * 3. Get computed color in RGB format
 * 4. Parse RGB values
 * 5. Convert to hexadecimal
 * 6. Return uppercase hex string
 *
 * Supported Input Formats:
 * - CSS color names: 'red', 'blue', 'transparent', etc.
 * - RGB notation: 'rgb(255, 0, 0)'
 * - RGBA notation: 'rgba(255, 0, 0, 0.5)'
 * - Hex notation: '#FF0000'
 *
 * @private
 * @param {string} color - The CSS color string (e.g., "red", "rgb(255, 0, 0)", "#FF0000")
 * @returns {string | null} The hexadecimal representation of the color (e.g., "#FF0000"),
 *                         or null if the input is not a valid color
 *
 * @example
 * colorNameToHex('red');              // Returns '#FF0000'
 * colorNameToHex('rgb(0, 255, 0)');   // Returns '#00FF00'
 * colorNameToHex('#0000FF');          // Returns '#0000FF'
 * colorNameToHex('invalidColor');     // Returns null
 */
function colorNameToHex(color: string): string | null {
    // Create a dummy element to leverage browser's color parsing
    const tempElem: HTMLDivElement = document.createElement('div');
    tempElem.style.color = color;
    document.body.appendChild(tempElem);

    // Get computed color (browser normalizes to RGB)
    const computedColor: string = getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);

    // Parse RGB notation: "rgb(r, g, b)"
    const rgbMatch: RegExpMatchArray = computedColor.match(/^rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/);
    if (rgbMatch) {
        const r: number = parseInt(rgbMatch[1], 10);
        const g: number = parseInt(rgbMatch[2], 10);
        const b: number = parseInt(rgbMatch[3], 10);

        // Convert each component to 2-digit hex and concatenate
        return (
            '#' +
            [r, g, b]
                .map((x: number) => (x.toString(16) as any).padStart(2, '0'))
                .join('')
                .toUpperCase()
        );
    }

    // Color name/format not recognized
    return null;
}

/**
 * Escapes special characters in a string to make it safe for inclusion as text content within XML.
 * Also normalizes line endings to `\r\n`, which is often required for Visio XML text sections.
 *
 * Character Escaping:
 * - `&` → `&amp;` (must be first to avoid double-escaping)
 * - `<` → `&lt;`
 * - `>` → `&gt;`
 * - `"` → `&quot;`
 * - `'` → `&#39;`
 *
 * Line Ending Normalization:
 * - All line endings converted to Windows style (`\r\n`)
 * - Ensures consistent representation across platforms
 *
 * @private
 * @param {string} text - The raw string content to be escaped
 * @returns {string} The XML-safe string with escaped characters and normalized line endings
 *
 * @example
 * escapeXmlText('<Hello & "World">');
 * // Returns: '&lt;Hello &amp; &quot;World&quot;&gt;'
 *
 * escapeXmlText('Line1\nLine2');
 * // Returns: 'Line1\r\nLine2'
 */
function escapeXmlText(text: string): string {
    return text
        .replace(/&/g, '&amp;')      // Ampersand (must be first)
        .replace(/</g, '&lt;')        // Less than
        .replace(/>/g, '&gt;')        // Greater than
        .replace(/"/g, '&quot;')      // Double quote
        .replace(/'/g, '&#39;')       // Single quote
        .replace(/\r\n/g, '\n')       // Normalize CRLF to LF
        .replace(/\r/g, '\n')         // Normalize CR to LF
        .replace(/\n/g, '\r\n');      // Convert all to Windows CRLF
}

/**
 * Generates the Visio XML geometry section for a connector.
 * Routes to appropriate geometry generator based on connector type (Straight, Orthogonal, Bezier).
 *
 * Supported Connector Types:
 * 1. Orthogonal: Right-angle routing with intermediate waypoints
 * 2. Bezier: Smooth curved routing with bezier splines
 * 3. Straight (default): Direct line between endpoints
 *
 * @private
 * @param {ConnectorModel} connector - The connector object for which to generate geometry XML
 * @param {number} beginX - The x-coordinate of the connector's start point (in inches)
 * @param {number} beginY - The y-coordinate of the connector's start point (in inches)
 * @param {number} endX - The x-coordinate of the connector's end point (in inches)
 * @param {number} endY - The y-coordinate of the connector's end point (in inches)
 * @param {number} width - The width of the connector's bounding box (in inches)
 * @param {number} height - The height of the connector's bounding box (in inches)
 * @param {number} pageHeight - The Diagram's page height (used for coordinate calculations)
 * @param {XmlWriter} writer - The XML writer to output the geometry
 * @returns {void} Returns nothing; writes Geometry section to the writer
 */
function generateConnectorGeometryXml(
    connector: ConnectorModel,
    beginX: number,
    beginY: number,
    endX: number,
    endY: number,
    width: number,
    height: number,
    pageHeight: number,
    writer: XmlWriter
): void {
    // Route to appropriate geometry generator based on connector type
    if (connector.type === 'Orthogonal' && connector.segments && connector.segments.length > 0) {
        // Orthogonal routing with right-angle segments
        generateOrthogonalConnectorGeometry(connector, beginX, beginY, endX, endY, writer);
    }
    // For Bezier connectors
    else if (connector.type === 'Bezier' && connector.segments && connector.segments.length > 0) {
        // Bezier curve routing with smooth curves
        const dpiScale: number = UNIT_CONVERSION.SCREEN_DPI;
        generateBezierConnectorGeometryXml(connector, beginX, beginY, endX, endY, width, height, (pageHeight / dpiScale), writer);
    }
    // Default: straight line connector
    else {
        generateStraightConnectorGeometry(connector, beginX, beginY, endX, endY, writer);
    }
}

/**
 * Generates Visio geometry XML for a Bezier curve connector.
 * Uses NURBS (Non-uniform Rational B-spline) representation for smooth curves.
 *
 * Geometry Structure:
 * 1. MoveTo at origin (0,0) - start of curve
 * 2. NURBSTo at relative endpoint with curve definition
 *
 * NURBS Format:
 * - knotLast: Last knot value (0.333)
 * - degree: Polynomial degree (3 for cubic)
 * - xType/yType: Coordinate types (0 for both)
 * - Control points: (x, y, knot, weight) tuples
 *
 * @private
 * @param {ConnectorModel} connector - The connector object containing bezier points
 * @param {number} beginX - The x-coordinate of the connector's start point
 * @param {number} beginY - The y-coordinate of the connector's start point
 * @param {number} endX - The x-coordinate of the connector's end point
 * @param {number} endY - The y-coordinate of the connector's end point
 * @param {number} width - The width of the connector's bounding box
 * @param {number} height - The height of the connector's bounding box
 * @param {number} pageHeight - The Diagram's page height
 * @param {XmlWriter} writer - The XML writer to output the geometry
 * @returns {void} Returns nothing; writes Geometry section to the writer
 */
function generateBezierConnectorGeometryXml(
    connector: ConnectorModel, beginX: number, beginY: number, endX: number, endY: number, width: number, height: number,
    pageHeight: number, writer: XmlWriter
): void {
    // Determine visibility (1 if hidden, 0 if visible)
    const isVisible: number = Number(!connector.visible);

    // Calculate local coordinates relative to connector's origin
    const targetLocalX: number = roundToPrecision(endX - beginX);
    const targetLocalY: number = roundToPrecision(endY - beginY);

    // Convert bezier segments to NURBS representation
    const nurbsTo: NurbsValue = convertBezierSegmentsToVisioNURBS(connector, pageHeight, width, height);

    // Generate Geometry section with MoveTo and NURBSTo
    // Coordinates are in Visio's local coordinate system (0,0 to width,height)
    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'Geometry');
    writer.writeAttributeString(null, 'IX', null, '0');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoFill');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLine');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoShow');
    writer.writeAttributeString(null, 'V', null, isVisible.toString());
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoSnap');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'MoveTo');
    writer.writeAttributeString(null, 'IX', null, '1');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'NURBSTo');
    writer.writeAttributeString(null, 'IX', null, '2');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, targetLocalX.toString());
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, targetLocalY.toString());
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'A');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'B');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'C');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'D');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'E');
    writer.writeAttributeString(null, 'V', null, `NURBS(${nurbsTo.NURBSTo})`);
    writer.writeAttributeString(null, 'U', null, 'NURBS');
    writer.writeAttributeString(null, 'F', null, `NURBS(${nurbsTo.NURBSTo})`);
    writer.writeEndElement();

    writer.writeEndElement(); // Row
    writer.writeEndElement(); // Section
}

/**
 * Converts Bezier curve segments of a connector into a Visio-compatible NURBS (Non-uniform Rational B-spline) value.
 * This function is critical for representing complex curved connectors accurately in the VSDX format.
 *
 * NURBS Encoding:
 * - Format: "knotLast,degree,xType,yType, x1,y1,k1,w1, x2,y2,k2,w2, ..."
 * - knotLast: 0.333 (standard for 3-point curves)
 * - degree: 3 (cubic Bezier)
 * - xType/yType: 0 (Cartesian coordinates)
 * - For each control point: x, y, knot (0), weight (1)
 *
 * @private
 * @param {ConnectorModel} connector - The Syncfusion ConnectorModel containing Bezier points
 * @param {number} pageHeight - The height of the Visio page, used for coordinate transformation
 * @param {number} width - The width of the connector's bounding box
 * @param {number} height - The height of the connector's bounding box
 * @returns {NurbsValue} An object containing the NURBS properties in a format suitable for Visio XML
 */
function convertBezierSegmentsToVisioNURBS(connector: ConnectorModel, pageHeight: number, width: number, height: number): NurbsValue {
    // Conversion factor from pixels to inches
    const PIXEL_TO_INCH: number = 1 / UNIT_CONVERSION.SCREEN_DPI;

    // Extract Bezier segments from connector
    const segments: BezierSegment[] = connector.segments as BezierSegment[];

    /**
     * Converts a point from diagram coordinates to Visio page inches.
     * Handles coordinate system transformation (diagram Y increases downward,
     * Visio Y increases upward).
     *
     * @param {PointModel} point - Point in diagram coordinates (pixels)
     * @returns {{x: number, y: number}} Point in Visio page inches
     */
    function toVisioPageInches(point: PointModel): { x: number; y: number } {
        return {
            x: point.x * PIXEL_TO_INCH,
            y: pageHeight - (point.y * PIXEL_TO_INCH)
        };
    }

    /**
     * Builds the NURBS E-cell string from control points.
     * Generates the comma-separated list of NURBS parameters.
     *
     * @param {Array<{x: number, y: number}>} points - Control points in page inches
     * @param {{x: number, y: number}} src - Source point (start of curve)
     * @param {number} src.x - X coordinate of source point (start of curve)
     * @param {number} src.y - Y coordinate of source point (start of curve)
     * @returns {string} Comma-separated NURBS parameter string
     */
    function buildNurbsECell(points: { x: number; y: number }[], src: { x: number; y: number }): string {
        // NURBS parameters
        const knotLast: number = 0.333;
        const degree: number = 3;
        const xType: number = 0;
        const yType: number = 0;

        // Initialize with NURBS header
        const parts: (number | string)[] = [
            knotLast, degree, xType, yType
        ];

        // Constants for each control point
        const weight: number = 1;
        const knot: number = 0;

        // Add each control point with normalized coordinates
        for (let i: number = 0; i < points.length; i++) {
            const relX: number = roundToPrecision((points[parseInt(i.toString(), 10)].x - src.x) / width);
            const relY: number = roundToPrecision((points[parseInt(i.toString(), 10)].y - src.y) / height);
            parts.push(relX, relY, knot, weight);
        }

        return parts.join(',');
    }

    // Convert source point to page inches
    const srcPage: { x: number; y: number } = {
        x: connector.sourcePoint.x * PIXEL_TO_INCH,
        y: pageHeight - (connector.sourcePoint.y * PIXEL_TO_INCH)
    };

    // Extract control points from Bezier segments
    const controlPointsPage: Array<{ x: number; y: number }> = [];

    if (segments.length > 0) {
        const first: BezierSegment = segments[0];
        const last: BezierSegment = segments[segments.length - 1];

        // Get first control point from first segment
        if (first && first.bezierPoint1) {
            const p1: { x: number; y: number } = toVisioPageInches(first.bezierPoint1);
            controlPointsPage.push(p1);
        }

        // Get last control point from last segment
        if (last && last.bezierPoint2) {
            const p2: { x: number; y: number } = toVisioPageInches(last.bezierPoint2);
            controlPointsPage.push(p2);
        }
    }

    // Build NURBS content string
    const nurbsContent: string = buildNurbsECell(controlPointsPage, srcPage);

    return {
        MoveTo: { x: 0, y: 0 },
        NURBSTo: nurbsContent
    };
}

/**
 * Generates Visio geometry XML for a straight connector.
 * Creates a series of LineTo commands connecting intermediate waypoints.
 *
 * Geometry Structure:
 * 1. MoveTo at origin (0,0)
 * 2. LineTo for each intermediate waypoint
 * 3. LineTo for final endpoint
 *
 * Coordinates are normalized relative to the connector's bounding box (Width x Height).
 *
 * @private
 * @param {ConnectorModel} connector - The connector object from the diagram
 * @param {number} beginX - Starting X coordinate in inches
 * @param {number} beginY - Starting Y coordinate in inches
 * @param {number} endX - Ending X coordinate in inches
 * @param {number} endY - Ending Y coordinate in inches
 * @param {XmlWriter} writer - The XML writer to output the geometry
 * @returns {void} Returns nothing; writes Geometry section to the writer
 *
 * @private
 */
function generateStraightConnectorGeometry(
    connector: ConnectorModel,
    beginX: number,
    beginY: number,
    endX: number,
    endY: number,
    writer: XmlWriter
): void {
    // Determine visibility flag
    const visibility: number = Number(!connector.visible);

    // Start geometry section
    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'Geometry');
    writer.writeAttributeString(null, 'IX', null, '0');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoFill');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLine');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoShow');
    writer.writeAttributeString(null, 'V', null, visibility.toString());
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoSnap');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'MoveTo');
    writer.writeAttributeString(null, 'IX', null, '1');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Width*0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Height*0');
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    let rowIndex: number = 2;

    // Calculate normalized connector dimensions
    const width: number = (connector.targetPoint.x - connector.sourcePoint.x) / UNIT_CONVERSION.SCREEN_DPI;
    const height: number = ((connector.targetPoint.y - connector.sourcePoint.y) / UNIT_CONVERSION.SCREEN_DPI) * -1;

    // Process all segments except the last one (we'll add final line separately)
    for (let i: number = 0; i < connector.segments.length - 1; i++) {
        const segment: StraightSegmentModel = connector.segments[parseInt(i.toString(), 10)];

        // Calculate waypoint coordinates relative to source and normalize
        const nextX: number = (segment.point.x - connector.sourcePoint.x) / UNIT_CONVERSION.SCREEN_DPI;
        const nextY: number = ((segment.point.y - connector.sourcePoint.y) / UNIT_CONVERSION.SCREEN_DPI) * -1;

        // Add LineTo for this waypoint
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'LineTo');
        writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, nextX.toString());
        writer.writeAttributeString(null, 'F', null, `Width*${nextX}`);
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, nextY.toString());
        writer.writeAttributeString(null, 'F', null, `Height*${nextY}`);
        writer.writeEndElement();

        writer.writeEndElement(); // Row

    }

    // Add final line to target point
    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'LineTo');
    writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, width.toString());
    writer.writeAttributeString(null, 'F', null, `Width*${width}`);
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, height.toString());
    writer.writeAttributeString(null, 'F', null, `Height*${height}`);
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    writer.writeEndElement(); // Section
}

/**
 * Generates the Visio XML geometry section for an orthogonal connector.
 * Creates a series of LineTo commands representing right-angle routing path.
 *
 * Orthogonal connectors consist of horizontal and vertical segments that
 * create a staircase pattern between source and target shapes.
 *
 * @private
 * @param {ConnectorModel} connector - The connector object for which to generate geometry XML
 * @param {number} beginX - The x-coordinate of the connector's start point (in inches)
 * @param {number} beginY - The y-coordinate of the connector's start point (in inches)
 * @param {number} endX - The x-coordinate of the connector's end point (in inches)
 * @param {number} endY - The y-coordinate of the connector's end point (in inches)
 * @param {XmlWriter} writer - The XML writer to output the geometry
 * @returns {void} Returns nothing; writes Geometry section to the writer
 */
function generateOrthogonalConnectorGeometry(connector: ConnectorModel, beginX: number,
                                             beginY: number, endX: number, endY: number, writer: XmlWriter): void {
    // Determine visibility flag
    const visibility: number = Number(!connector.visible);

    // Start geometry section
    writer.writeStartElement(null, 'Section', null);
    writer.writeAttributeString(null, 'N', null, 'Geometry');
    writer.writeAttributeString(null, 'IX', null, '0');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoFill');
    writer.writeAttributeString(null, 'V', null, '1');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoLine');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoShow');
    writer.writeAttributeString(null, 'V', null, visibility.toString());
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'NoSnap');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Row', null);
    writer.writeAttributeString(null, 'T', null, 'MoveTo');
    writer.writeAttributeString(null, 'IX', null, '1');

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'X');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Width*0');
    writer.writeEndElement();

    writer.writeStartElement(null, 'Cell', null);
    writer.writeAttributeString(null, 'N', null, 'Y');
    writer.writeAttributeString(null, 'V', null, '0');
    writer.writeAttributeString(null, 'F', null, 'Height*0');
    writer.writeEndElement();

    writer.writeEndElement(); // Row

    // Build orthogonal path from intermediate points
    let currentX: number = 0;
    let currentY: number = 0;
    let rowIndex: number = 2;

    // Get intermediate points from connector's intermediate points array
    let prevPoint: PointModel = (connector as Connector).intermediatePoints[0];

    for (let i: number = 1; i < (connector as Connector).intermediatePoints.length; i++) {
        const point: PointModel = (connector as Connector).intermediatePoints[parseInt(i.toString(), 10)];

        // Calculate delta from previous point
        let nextX: number = currentX;
        let nextY: number = currentY;

        // Handle horizontal movement
        if (prevPoint.x > point.x) {
            nextX -= (prevPoint.x - point.x) / UNIT_CONVERSION.SCREEN_DPI;
        }
        else {
            nextX += (point.x - prevPoint.x) / UNIT_CONVERSION.SCREEN_DPI;
        }

        // Handle vertical movement (with Y-axis flip for Visio)
        if (prevPoint.y > point.y) {
            nextY -= ((prevPoint.y - point.y) / UNIT_CONVERSION.SCREEN_DPI) * -1;
        }
        else {
            nextY += ((point.y - prevPoint.y) / UNIT_CONVERSION.SCREEN_DPI) * -1;
        }

        // Add LineTo for this segment endpoint
        writer.writeStartElement(null, 'Row', null);
        writer.writeAttributeString(null, 'T', null, 'LineTo');
        writer.writeAttributeString(null, 'IX', null, (rowIndex++).toString());

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'X');
        writer.writeAttributeString(null, 'V', null, nextX.toString());
        writer.writeAttributeString(null, 'F', null, `Width*${nextX}`);
        writer.writeEndElement();

        writer.writeStartElement(null, 'Cell', null);
        writer.writeAttributeString(null, 'N', null, 'Y');
        writer.writeAttributeString(null, 'V', null, nextY.toString());
        writer.writeAttributeString(null, 'F', null, `Height*${nextY}`);
        writer.writeEndElement();

        writer.writeEndElement(); // Row

        currentX = nextX;
        currentY = nextY;
        prevPoint = point;
    }

    // Close geometry section
    writer.writeEndElement(); // Section
}

/**
 * Maps Syncfusion arrow/decorator shape names to Visio arrow type numeric codes.
 * Visio uses numeric codes to represent different arrow and decorator styles.
 *
 * Supported Arrow Types:
 * - None: 0 (no arrow)
 * - Arrow: 4 (filled triangle)
 * - OpenArrow: 3 (outline triangle)
 * - Square: 11 (filled square)
 * - Circle: 42 (filled circle)
 * - Diamond: 22 (filled diamond)
 * - Fletch: 8 (feathered arrow)
 * - OpenFetch: 7 (open feathered arrow)
 * - IndentedArrow: 5 (indented triangle)
 * - OutdentedArrow: 6 (outward pointing triangle)
 * - DoubleArrow: 39 (double arrow)
 *
 * @private
 * @param {string} shape - The string representation of the desired arrow type
 *                        (e.g., 'Arrow', 'Diamond', 'Circle', 'None')
 * @returns {number} The corresponding Visio arrow type value as a number (0-42)
 *
 * @example
 * getVisioArrowType('Arrow');        // Returns 4
 * getVisioArrowType('Diamond');      // Returns 22
 * getVisioArrowType('None');         // Returns 0
 * getVisioArrowType('InvalidType');  // Returns 0 (undefined behavior)
 */
function getVisioArrowType(shape: string): number {
    const arrowTypeMap: Record<ArrowTypeName, number> = {
        'None': 0,
        'Arrow': 4,
        'OpenArrow': 3,
        'Square': 11,
        'Circle': 42,
        'Diamond': 22,
        'Fletch': 8,
        'OpenFetch': 7,
        'IndentedArrow': 5,
        'OutdentedArrow': 6,
        'DoubleArrow': 39
    };

    return arrowTypeMap[shape as ArrowTypeName];
}

/**
 * Returns values from the dominant dimension across the given items.
 * Compares the maximum width and maximum height: if the maximum height is
 * greater than the maximum width, returns all heights; otherwise returns all widths.
 *
 * @param {{ width: number, height: number }[]} items - Collection of size objects.
 * @returns {number[]} A new array containing either all heights or all widths,
 * depending on which dimension has the larger maximum. Returns an empty array if no items.
 */
function dominantDimensionValues(items: { width: number; height: number }[]): number[] {
    if (!items || items.length === 0) { return []; }

    const maxWidth: number = Math.max(...items.map((i: { width: number; height: number }) => i.width));
    const maxHeight: number = Math.max(...items.map((i: { width: number; height: number }) => i.height));

    return (maxHeight > maxWidth)
        ? items.map((i: { width: number; height: number }) => i.height)
        : items.map((i: { width: number; height: number }) => i.width);
}

/**
 * Determines the appropriate Visio arrow size based on decorator dimensions.
 * Visio uses numeric sizes (0-6) representing predefined arrow scales.
 *
 * Size Mapping (based on max dimension):
 * - 0: Very small (≤5 units)
 * - 1: Small (≤7 units)
 * - 2: Medium (≤10 units)
 * - 3: Large (≤15 units)
 * - 4: Extra large (≤25 units)
 * - 5: Jumbo (≤50 units)
 * - 6: Colossal (>50 units)
 *
 * @private
 * @param {string} [arrowType] - The type of decoratpr
 * @param {number} [width] - Optional. The width of the decorator
 * @param {number} [height] - Optional. The height of the decorator
 * @returns {number} The Visio arrow size code (0-6)
 *
 * @example
 * getVisioArrowSize(5, 10);      // Returns 2 (Medium)
 * getVisioArrowSize(50, 50);     // Returns 5 (Jumbo)
 * getVisioArrowSize(3, 4);       // Returns 0 (Very small)
 */
function getVisioArrowSize(arrowType: string, width?: number, height?: number): number {
    // Normalize shape name to lowercase for lookup
    const shapeKey: string = (arrowType || '').toLowerCase();

    // Check if shape is arrow-like (all arrow-like shapes share size progression)
    const arrowLikeKey: string = ['arrow', 'outdentedarrow', 'fletch', 'openarrow', 'openfetch', 'indentedarrow', 'doublearrow']
        .find((k: string) => k === shapeKey);
    const resolvedKey: string = arrowLikeKey ? 'arrow' : (shapeKey === 'circle') ? 'square' : shapeKey;

    // Look up size table for shape
    const sizes: { width: number; height: number; }[] = DECORATOR_SIZE_MAP[`${resolvedKey}`];
    const valuesToCompare: number[] = dominantDimensionValues(sizes);
    // Size mapping based on approximate maximum dimension
    const size: number = Math.max(width, height);

    if (size <= valuesToCompare[0]) { return 0; } // Very small
    if (size <= valuesToCompare[1]) { return 1; } // Small
    if (size <= valuesToCompare[2]) { return 2; } // Medium
    if (size <= valuesToCompare[3]) { return 3; } // Large
    if (size <= valuesToCompare[4]) { return 4; } // Extra large
    if (size <= valuesToCompare[5]) { return 5; } // Jumbo
    if (size <= valuesToCompare[6]) { return 6; } // Colossal
    return 6;
}

/**
 * Maps text alignment values to Visio paragraph alignment codes.
 * Visio uses numeric codes to represent text alignment (left, center, right, justify).
 *
 * Alignment Mapping:
 * - Left: 0 (left-aligned)
 * - Center: 1 (centered, default)
 * - Right: 2 (right-aligned)
 * - Justify: 3 (justified)
 *
 * @private
 * @param {string} align - The string representation of text alignment
 *                        ('Left', 'Right', 'Center', 'Justify', etc.)
 * @returns {number} The Visio alignment code (0, 1, 2, or 3)
 *
 * @example
 * getVisioTextAlign('Left');      // Returns 0
 * getVisioTextAlign('Right');     // Returns 2
 * getVisioTextAlign('Center');    // Returns 1 (default)
 * getVisioTextAlign('Justify');   // Returns 3
 */
function getVisioTextAlign(align: string): number {
    switch (align) {
    case 'Left': return 0;
    case 'Right': return 2;
    case 'Justify': return 3;
    default: return 1; // Default to center
    }
}

/**
 * Maps vertical alignment values to Visio vertical alignment codes.
 * Visio uses numeric codes to represent vertical text positioning.
 *
 * Alignment Mapping:
 * - Top: 2 (top-aligned)
 * - Middle: 1 (vertically centered, default)
 * - Bottom: 0 (bottom-aligned)
 *
 * @private
 * @param {string} align - The string representation of vertical alignment
 *                        ('Top', 'Bottom', 'Middle', etc.)
 * @returns {number} The Visio vertical alignment code (0, 1, or 2)
 *
 * @example
 * getVisioAlign('Top');       // Returns 2
 * getVisioAlign('Bottom');    // Returns 0
 * getVisioAlign('Middle');    // Returns 1 (default)
 */
function getVisioAlign(align: string): number {
    switch (align) {
    case 'Top': return 2;
    case 'Bottom': return 0;
    default: return 1; // Default to center/middle
    }
}

/**
 * Maps EJ2 connector type to Visio routing properties (ConLineRouteExt and ShapeRouteStyle).
 * This reverses the decoding logic used in import (getConnectorType in visio-connectors.ts).
 *
 * Curvature (ConLineRouteExt):
 * - 'Bezier': Sets to '2' (curved)
 * - 'Straight' or 'Orthogonal': Sets to '1' (straight)
 *
 * Routing Algorithm (ShapeRouteStyle):
 * - 'Straight': Sets to '2' (straight line routing)
 * - 'Orthogonal': Sets to '1' (right-angle/orthogonal routing)
 * - 'Bezier': Ignored (only ConLineRouteExt is set)
 *
 * @private
 * @param {string} connectorType - EJ2 connector type: 'Straight', 'Orthogonal', 'Bezier'
 * @returns {Object} Object with conLineRouteExt and shapeRouteStyle properties
 *
 * @example
 * getVisioConnectorRouting('Straight');    // Returns { conLineRouteExt: '1', shapeRouteStyle: '2' }
 * getVisioConnectorRouting('Orthogonal');  // Returns { conLineRouteExt: '1', shapeRouteStyle: '1' }
 * getVisioConnectorRouting('Bezier');      // Returns { conLineRouteExt: '2', shapeRouteStyle: '1' }
 */
function getVisioConnectorRouting(connectorType: string): { conLineRouteExt: string; shapeRouteStyle: string; } {
    let conLineRouteExt: string = '1'; // Default: straight appearance
    let shapeRouteStyle: string = '1'; // Default: right-angle routing

    if (connectorType === 'Bezier') {
        // Bezier uses curved appearance
        conLineRouteExt = '2';
        // For Bezier, ShapeRouteStyle doesn't really apply, but we keep '1' for consistency
        shapeRouteStyle = '1';
    } else if (connectorType === 'Straight') {
        // Straight uses straight appearance and straight routing
        conLineRouteExt = '1';
        shapeRouteStyle = '16'; // 2 = Straight routing
    } else if (connectorType === 'Orthogonal') {
        // Orthogonal uses straight appearance with right-angle routing
        conLineRouteExt = '0';
        shapeRouteStyle = '0'; // 1 = Right angle routing
    }

    return { conLineRouteExt, shapeRouteStyle };
}

/**
 * Watermark parse pipeline (TASK-8061).
 *
 * Walks header parts once, classifies conservative VML watermark shapes,
 * builds {@link TextWatermark} / {@link PictureWatermark} models with residual
 * capture, resolves picture media via header-local relationships, and sets the
 * document logical watermark from the effective default header.
 *
 * @packageDocumentation
 */
import { WordDocument } from '../document/document';
import { BlockContent } from '../document/paragraph';
import { OpaqueParagraphItem, OpaqueRunItem } from '../document/text-range';
import { elementChildren, isWml } from '../document/wml';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { partNameKey, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { OpenXmlElement } from '../../core/xml/index';
import { serializeXml } from '../../core/xml/serialize';
import { objectEntries, ownSet } from '../../core/compat/object-compat';
import { defaultHeader, headersFootersFor, HeadersFootersCatalog } from '../headers-footers/index';
import { IMAGE_RELATIONSHIP_TYPE, JPEG_CONTENT_TYPE, PNG_CONTENT_TYPE, STRICT_IMAGE_RELATIONSHIP_TYPE } from '../images/index';
import { isPictureWatermarkShape, isTextWatermarkShape, isVml, parseVmlStyle, vmlAttribute, VML_NS } from './detect';
import { ImageType, PictureWatermark, TextWatermark, WatermarkLayout, SemitransparentState, Watermark, WatermarkShapeResidual } from './model';
import { OpenXmlAttribute } from '../../core/xml/model';
import { OpcRelationship } from '../../core/opc/relationships';
import { HeaderFooter } from '../document/headers-footers';
/** Office namespace used by `o:title` / `o:spid` on VML. */
const OFFICE_NS: string = 'urn:schemas-microsoft-com:office:office';
/** Office document relationships namespace (`r:id` on `v:imagedata`). */
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const IMAGE_REL_TYPES: Set<string> = new Set<string>([
    IMAGE_RELATIONSHIP_TYPE,
    STRICT_IMAGE_RELATIONSHIP_TYPE
]);
/** Shape attributes consumed by the modeled text/picture surface (not residual). */
const MODELED_SHAPE_ATTRS: Set<string> = new Set([
    'id',
    'type',
    'style',
    'fillcolor',
    'stroked',
    'filled'
]);
/** Style keys consumed for text/picture models. */
const MODELED_STYLE_KEYS: Set<string> = new Set([
    'position',
    'margin-left',
    'margin-top',
    'width',
    'height',
    'rotation',
    'z-index',
    'mso-position-horizontal',
    'mso-position-horizontal-relative',
    'mso-position-vertical',
    'mso-position-vertical-relative'
]);
/** textpath style keys consumed as fontName / size. */
const MODELED_TEXTPATH_STYLE_KEYS: Set<string> = new Set(['font-family', 'font-size']);
/**
 * Per-document parse index: unique physical header parts â†’ first recognized watermark.
 *
 * @private
 */
export interface WatermarkParseIndex {
    /** Part-name key â†’ watermark model for that header part. */
    readonly physicalByPartKey: ReadonlyMap<string, Watermark>;
    /** Whether ensureParsed has completed for this document. */
    readonly completed: boolean;
}
const parseIndexByDocument: WeakMap<WordDocument, WatermarkParseIndex> = new WeakMap<WordDocument, WatermarkParseIndex>();
const parseCompleted: WeakSet<WordDocument> = new WeakSet<WordDocument>();
/**
 * Once set, {@link applyLogicalWatermarkFromDefaultHeader} must not re-seed
 * logical state from the physical index. Covers first successful apply and
 * author setter / {@link WordDocument.removeWatermark} so clear is sticky.
 */
const logicalSettled: WeakSet<WordDocument> = new WeakSet<WordDocument>();
/**
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyMap<string, Watermark>} The result.
 * @private
 * Test / serialize hook: physical watermark copies by header part key.
 */
export function physicalWatermarksOf(document: WordDocument): ReadonlyMap<string, Watermark> {
    let ts330: any; let ts331: any;
    return (
        (ts331 = ((ts330 = parseIndexByDocument.get(document)), ts330 == null ? undefined : ts330.physicalByPartKey)),
        ts331 != null ? ts331 : new Map()
    );
}
/**
 * Mark parse complete so a later ensure does not overwrite author assignment.
 * Used by the document host setter after logical attach / remove.
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function markWatermarkParseCompleted(document: WordDocument): void {
    parseCompleted.add(document);
    // Author path owns logical state; never re-apply from physical headers.
    logicalSettled.add(document);
    if (!parseIndexByDocument.has(document)) {
        parseIndexByDocument.set(document, {
            physicalByPartKey: new Map(),
            completed: true
        });
    }
}
/**
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Reset parse bookkeeping for unit tests.
 */
export function resetWatermarkParseStateForTests(document?: WordDocument): void {
    if (document !== undefined) {
        parseIndexByDocument.delete(document);
        parseCompleted.delete(document);
        logicalSettled.delete(document);
    }
}
function attributeValue(el: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    let ts332: any;
    return (
        (ts332 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName)),
        ts332 == null ? undefined : ts332.value
    );
}
function findVmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isVml(child, localName)) {
            return child;
        }
    }
    return undefined;
}
function styleExtraRecord(style: ReadonlyMap<string, string>, modeled: ReadonlySet<string>): Record<string, string> | undefined {
    const out: Record<string, string> = {};
    let any: boolean = false;
    for (const [key, value] of style) {
        if (!modeled.has(key)) {
            ownSet(out, key, value);
            any = true;
        }
    }
    return any ? out : undefined;
}
function attrKey(attr: {
    prefix: string;
    localName: string;
    namespaceUri: string;
}): string {
    if (attr.prefix !== '') {
        return `${attr.prefix}:${attr.localName}`;
    }
    if (attr.namespaceUri !== '' && attr.namespaceUri !== VML_NS) {
        return `{${attr.namespaceUri}}${attr.localName}`;
    }
    return attr.localName;
}
function parsePt(raw: string | undefined): number | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const trimmed: string = raw.trim();
    const hasPtSuffix: boolean = trimmed.length >= 2 && trimmed.slice(-2).toLowerCase() === 'pt';
    const numberPart: string = hasPtSuffix ? trimmed.slice(0, -2).replace(/\s+$/, '') : '';
    const match: RegExpExecArray = hasPtSuffix ? /^([+-]?(?:\d+\.?\d*|\.\d+))$/.exec(numberPart) : null;
    if (match === null) {
        const asNum: number = Number.parseFloat(raw);
        return Number.isFinite(asNum) ? asNum : undefined;
    }
    const value: number = Number.parseFloat(match[1] != null ? match[1] : '');
    return Number.isFinite(value) ? value : undefined;
}
function stripFontFamilyQuotes(raw: string): string {
    let s: string = raw.trim();
    if ((s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith('\'') && s.endsWith('\''))) {
        s = s.slice(1, -1);
    }
    return s;
}
function parseRotationDegrees(style: ReadonlyMap<string, string>): number | undefined {
    const raw: string = style.get('rotation');
    if (raw === undefined || raw.trim() === '') {
        return undefined;
    }
    const value: number = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : undefined;
}
function layoutFromRotation(rotation: number | undefined): {
    layout: WatermarkLayout;
    customRotation: number | undefined;
} {
    if (rotation === undefined || rotation === 0) {
        return { layout: WatermarkLayout.Horizontal, customRotation: undefined };
    }
    if (rotation === 315) {
        return { layout: WatermarkLayout.Diagonal, customRotation: undefined };
    }
    return { layout: WatermarkLayout.Diagonal, customRotation: rotation };
}
/**
 * Opacity tri-state from `v:fill/@opacity` (and only that verified signal).
 * Gray fill alone is not proof. `.5` / values below full â†’ transparent; full â†’ opaque; absent â†’ unknown.
 *
 * @param {OpenXmlElement} shape - The shape.
 * @returns {Object} The result.
 */
function parseSemitransparentState(shape: OpenXmlElement): {
    state: SemitransparentState;
    fillOpacity: string | undefined;
} {
    const fill: OpenXmlElement = findVmlChild(shape, 'fill');
    if (fill === undefined) {
        return { state: 'unknown', fillOpacity: undefined };
    }
    const opacity: string = vmlAttribute(fill, 'opacity');
    if (opacity === undefined || opacity.trim() === '') {
        return { state: 'unknown', fillOpacity: undefined };
    }
    const normalized: string = opacity.trim().toLowerCase();
    if (normalized === '1' ||
        normalized === '1.0' ||
        normalized === '100%' ||
        normalized === '65536f') {
        return { state: 'opaque', fillOpacity: opacity };
    }
    const asNum: number = Number.parseFloat(normalized);
    if (Number.isFinite(asNum)) {
        if (asNum < 1) {
            return { state: 'transparent', fillOpacity: opacity };
        }
        if (asNum === 1) {
            return { state: 'opaque', fillOpacity: opacity };
        }
    }
    return { state: 'unknown', fillOpacity: opacity };
}
function buildResidual(
    shape: OpenXmlElement,
    style: ReadonlyMap<string, string>,
    textpath: OpenXmlElement | undefined,
    textpathStyle: ReadonlyMap<string, string>,
    fillOpacity: string | undefined,
    imagedata: OpenXmlElement | undefined,
    unresolvedImageNote: string | undefined
): WatermarkShapeResidual {
    const residualChildrenXml: string[] = [];
    let seenTextpath: boolean = false;
    let seenFill: boolean = false;
    let seenImagedata: boolean = false;
    for (const child of elementChildren(shape)) {
        if (isVml(child, 'textpath') && !seenTextpath) {
            seenTextpath = true;
            continue;
        }
        if (isVml(child, 'fill') && !seenFill) {
            seenFill = true;
            continue;
        }
        if (isVml(child, 'imagedata') && !seenImagedata) {
            seenImagedata = true;
            continue;
        }
        residualChildrenXml.push(serializeXml(child));
    }
    const extraShapeAttributes: Record<string, string> = {};
    for (const attr of shape.attributes) {
        const isVmlOrEmpty: boolean = attr.namespaceUri === '' || attr.namespaceUri === VML_NS;
        if (isVmlOrEmpty && MODELED_SHAPE_ATTRS.has(attr.localName)) {
            continue;
        }
        extraShapeAttributes[attrKey(attr)] = attr.value;
    }
    const extensions: Record<string, string> = {};
    const styleExtra: Record<string, string> = styleExtraRecord(style, MODELED_STYLE_KEYS);
    if (styleExtra !== undefined) {
        for (const [k, v] of objectEntries(styleExtra)) {
            extensions[`style.${k}`] = v;
        }
    }
    if (textpath !== undefined) {
        const textpathModeledAttrs: Set<string> = new Set(['string', 'on', 'style']);
        for (const attr of textpath.attributes) {
            const isVmlOrEmpty: boolean = attr.namespaceUri === '' || attr.namespaceUri === VML_NS;
            if (isVmlOrEmpty && textpathModeledAttrs.has(attr.localName)) {
                continue;
            }
            extensions[`textpath.${attrKey(attr)}`] = attr.value;
        }
        const tpStyleExtra: Record<string, string> = styleExtraRecord(textpathStyle, MODELED_TEXTPATH_STYLE_KEYS);
        if (tpStyleExtra !== undefined) {
            for (const [k, v] of objectEntries(tpStyleExtra)) {
                extensions[`textpathStyle.${k}`] = v;
            }
        }
    }
    if (imagedata !== undefined) {
        const imagedataModeled: Set<string> = new Set(['id', 'gain', 'blacklevel']);
        for (const attr of imagedata.attributes) {
            if (attr.namespaceUri === R_NS && attr.localName === 'id') {
                continue;
            }
            const isLocal: boolean = attr.namespaceUri === '' ||
                attr.namespaceUri === VML_NS ||
                attr.namespaceUri === OFFICE_NS;
            if (isLocal && imagedataModeled.has(attr.localName)) {
                // gain/blacklevel modeled as washout; retain raw tokens for clean fidelity.
                if (attr.localName === 'gain' || attr.localName === 'blacklevel') {
                    extensions[`imagedata.${attr.localName}`] = attr.value;
                }
                continue;
            }
            extensions[`imagedata.${attrKey(attr)}`] = attr.value;
        }
    }
    const residual: {
        shapeId?: string;
        shapeType?: string;
        styleAttribute?: string;
        fillcolor?: string;
        extraShapeAttributes?: Record<string, string>;
        extraChildXml?: string[];
        fillOpacity?: string;
        imageRelationshipId?: string;
        unresolvedImageNote?: string;
        extensions?: Record<string, string>;
    } = {};
    const shapeId: string = vmlAttribute(shape, 'id');
    if (shapeId !== undefined) {
        residual.shapeId = shapeId;
    }
    const shapeType: string = vmlAttribute(shape, 'type');
    if (shapeType !== undefined) {
        residual.shapeType = shapeType;
    }
    const styleAttribute: string = vmlAttribute(shape, 'style');
    if (styleAttribute !== undefined) {
        residual.styleAttribute = styleAttribute;
    }
    const fillcolor: string = vmlAttribute(shape, 'fillcolor');
    if (fillcolor !== undefined) {
        residual.fillcolor = fillcolor;
    }
    if (Object.keys(extraShapeAttributes).length > 0) {
        residual.extraShapeAttributes = extraShapeAttributes;
    }
    if (residualChildrenXml.length > 0) {
        residual.extraChildXml = residualChildrenXml;
    }
    if (fillOpacity !== undefined) {
        residual.fillOpacity = fillOpacity;
    }
    if (imagedata !== undefined) {
        const rid: string = attributeValue(imagedata, R_NS, 'id');
        if (rid !== undefined) {
            residual.imageRelationshipId = rid;
        }
    }
    if (unresolvedImageNote !== undefined) {
        residual.unresolvedImageNote = unresolvedImageNote;
    }
    if (Object.keys(extensions).length > 0) {
        residual.extensions = extensions;
    }
    return residual;
}
/**
 * @param {TextWatermark} model - The model.
 * @param {WatermarkShapeResidual} residual - The residual.
 * @param {number | undefined} customRotation - The custom rotation.
 * @returns {void} Nothing is returned.
 * @private
 * Apply residual + custom rotation onto a constructed model.
 */
export function attachTextParseExtras(model: TextWatermark, residual: WatermarkShapeResidual, customRotation: number | undefined): void {
    model.setParseResidual(residual);
    if (customRotation !== undefined) {
        model.setCustomRotationDegrees(customRotation);
    }
}
/**
 * @param {PictureWatermark} model - The model.
 * @param {WatermarkShapeResidual} residual - The residual.
 * @returns {void} Nothing is returned.
 * @private
 */
export function attachPictureParseExtras(model: PictureWatermark, residual: WatermarkShapeResidual): void {
    model.setParseResidual(residual);
}
function parseTextWatermark(shape: OpenXmlElement): TextWatermark {
    let ts333: any;
    const style: Map<string, string> = parseVmlStyle(vmlAttribute(shape, 'style'));
    const textpath: OpenXmlElement = findVmlChild(shape, 'textpath');
    const textpathStyle: Map<string, string> = parseVmlStyle(textpath === undefined ? undefined : vmlAttribute(textpath, 'style'));
    const text: string = textpath === undefined ? '' : (((ts333 = vmlAttribute(textpath, 'string')), ts333 != null ? ts333 : ''));
    const fontRaw: string = textpathStyle.get('font-family');
    const fontName: string = fontRaw === undefined ? undefined : stripFontFamilyQuotes(fontRaw);
    const size: number = parsePt(textpathStyle.get('font-size'));
    const color: string = vmlAttribute(shape, 'fillcolor');
    const width: number = parsePt(style.get('width'));
    const height: number = parsePt(style.get('height'));
    const rotation: number = parseRotationDegrees(style);
    const { layout, customRotation } = layoutFromRotation(rotation);
    const { state, fillOpacity } = parseSemitransparentState(shape);
    const options: {
        fontName?: string;
        size?: number;
        color?: string;
        layout?: WatermarkLayout;
        width?: number;
        height?: number;
    } = { layout };
    if (fontName !== undefined && fontName.length > 0) {
        options.fontName = fontName;
    }
    if (size !== undefined && size > 0) {
        options.size = size;
    }
    if (color !== undefined) {
        options.color = color;
    }
    if (width !== undefined && width > 0) {
        options.width = width;
    }
    if (height !== undefined && height > 0) {
        options.height = height;
    }
    const model: TextWatermark = new TextWatermark(text, options);
    model.setSemitransparentState(state);
    const residual: WatermarkShapeResidual = buildResidual(shape, style, textpath, textpathStyle, fillOpacity, undefined, undefined);
    attachTextParseExtras(model, residual, customRotation);
    return model;
}
function washoutFromImagedata(imagedata: OpenXmlElement): boolean {
    let ts334: any; let ts335: any; let ts336: any; let ts337: any;
    // Verified Word washout on PictureWatermark.docx: gain + blacklevel on v:imagedata.
    const gain: string = ((ts335 = ((ts334 = vmlAttribute(imagedata, 'gain')), ts334 != null ? ts334 : attributeValue(imagedata, OFFICE_NS, 'gain'))), ts335 != null ? ts335 : attributeValue(imagedata, '', 'gain'));
    const blacklevel: string = ((ts337 = ((ts336 = vmlAttribute(imagedata, 'blacklevel')), ts336 != null ? ts336 : attributeValue(imagedata, OFFICE_NS, 'blacklevel'))), ts337 != null ? ts337 : attributeValue(imagedata, '', 'blacklevel'));
    return gain !== undefined && blacklevel !== undefined;
}
function imageTypeFromContentType(contentType: string | undefined): ImageType | undefined {
    if (contentType === undefined) {
        return undefined;
    }
    const ct: string = contentType.toLowerCase();
    if (ct === JPEG_CONTENT_TYPE || ct === 'image/jpg') {
        return ImageType.Jpeg;
    }
    if (ct === PNG_CONTENT_TYPE) {
        return ImageType.Png;
    }
    return undefined;
}
function resolvePictureBytes(pkg: OpcPackage | undefined, headerPartName: PartName, imagedata: OpenXmlElement): {
    bytes: Uint8Array | undefined;
    imageType: ImageType | undefined;
    unresolvedNote: string | undefined;
    relationshipId: string | undefined;
} {
    const rid: string = attributeValue(imagedata, R_NS, 'id');
    if (rid === undefined || rid.length === 0) {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'missing-r-id',
            relationshipId: undefined
        };
    }
    if (pkg === undefined) {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'no-package',
            relationshipId: rid
        };
    }
    let rels: any;
    try {
        rels = relationshipsForPart(pkg, headerPartName);
    }
    catch {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'no-header-rels',
            relationshipId: rid
        };
    }
    const rel: OpcRelationship = rels.items.find((item: OpcRelationship) => item.id === rid);
    if (rel === undefined) {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: `missing-rel:${rid}`,
            relationshipId: rid
        };
    }
    if (!IMAGE_REL_TYPES.has(rel.type)) {
        // Still attempt resolve; classification already matched other indicators.
    }
    if (/^https?:/i.test(rel.target) || /^mailto:/i.test(rel.target)) {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'external-target',
            relationshipId: rid
        };
    }
    let targetName: PartName;
    try {
        targetName = resolveInternalTarget(rel.target, headerPartName);
    }
    catch {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'bad-target',
            relationshipId: rid
        };
    }
    const part: PackagePart = partByName(pkg, targetName);
    if (part === undefined) {
        return {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: `missing-part:${targetName}`,
            relationshipId: rid
        };
    }
    return {
        bytes: part.data,
        imageType: imageTypeFromContentType(part.contentType),
        unresolvedNote: undefined,
        relationshipId: rid
    };
}
function parsePictureWatermark(shape: OpenXmlElement, pkg: OpcPackage | undefined, headerPartName: PartName): PictureWatermark {
    const style: Map<string, string> = parseVmlStyle(vmlAttribute(shape, 'style'));
    const imagedata: OpenXmlElement = findVmlChild(shape, 'imagedata');
    const width: number = parsePt(style.get('width'));
    const height: number = parsePt(style.get('height'));
    const washout: boolean = imagedata === undefined ? false : washoutFromImagedata(imagedata);
    const resolved: { bytes: Uint8Array; imageType: ImageType; unresolvedNote: string; relationshipId: string; } = imagedata === undefined
        ? {
            bytes: undefined,
            imageType: undefined,
            unresolvedNote: 'missing-imagedata',
            relationshipId: undefined
        }
        : resolvePictureBytes(pkg, headerPartName, imagedata);
    const options: {
        imageType?: ImageType;
        washout?: boolean;
        width?: number;
        height?: number;
    } = { washout };
    if (resolved.imageType !== undefined) {
        options.imageType = resolved.imageType;
    }
    if (width !== undefined && width > 0) {
        options.width = width;
    }
    if (height !== undefined && height > 0) {
        options.height = height;
    }
    const model: PictureWatermark = new PictureWatermark(resolved.bytes, options);
    if (resolved.bytes === undefined) {
        model.imageData = undefined;
    }
    const residual: WatermarkShapeResidual = buildResidual(
        shape,
        style,
        undefined,
        new Map(),
        undefined,
        imagedata,
        resolved.unresolvedNote
    );
    attachPictureParseExtras(model, residual);
    return model;
}
function shapesUnderPict(pict: OpenXmlElement): OpenXmlElement[] {
    const shapes: OpenXmlElement[] = [];
    for (const child of elementChildren(pict)) {
        if (isVml(child, 'shape')) {
            shapes.push(child);
        }
    }
    return shapes;
}
function visitOpenXmlForPict(node: OpenXmlElement, visit: (pict: OpenXmlElement) => void): void {
    if (isWml(node, 'pict')) {
        visit(node);
        return;
    }
    for (const child of elementChildren(node)) {
        visitOpenXmlForPict(child, visit);
    }
}
function collectPictFromBlocks(blocks: ReadonlyArray<BlockContent>, visit: (pict: OpenXmlElement) => void): void {
    for (const block of blocks) {
        if (block.type === 'opaque') {
            visitOpenXmlForPict(block.xml, visit);
            continue;
        }
        if (block.type === 'paragraph') {
            for (const inline of block.paragraph.items) {
                if (inline instanceof OpaqueParagraphItem || inline instanceof OpaqueRunItem) {
                    visitOpenXmlForPict(inline.xml, visit);
                }
            }
        }
    }
}
/**
 * Parse the first recognized watermark shape under header body blocks.
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @param {OpcPackage | undefined} pkg - The pkg.
 * @param {PartName} headerPartName - The header part name.
 * @returns {Watermark | undefined} The result.
 * @private
 */
export function parseWatermarkFromHeaderBlocks(
    blocks: ReadonlyArray<BlockContent>,
    pkg: OpcPackage | undefined,
    headerPartName: PartName
): Watermark | undefined {
    let found: Watermark | undefined;
    collectPictFromBlocks(blocks, (pict: OpenXmlElement) => {
        if (found !== undefined) {
            return;
        }
        for (const shape of shapesUnderPict(pict)) {
            if (isTextWatermarkShape(shape)) {
                found = parseTextWatermark(shape);
                return;
            }
            if (isPictureWatermarkShape(shape)) {
                found = parsePictureWatermark(shape, pkg, headerPartName);
                return;
            }
        }
    });
    return found;
}
/**
 * Ensure header watermarks have been scanned once for this document.
 *
 * Builds the physical-by-part index only. Does **not** read or write
 * `document.watermark` (avoids prototype getter re-entry). Logical apply is
 * {@link applyLogicalWatermarkFromDefaultHeader} / {@link ensureParsedAndLogical}.
 *
 * Parse does not dirty header parts or mutate Open XML trees.
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function ensureWatermarksParsed(document: WordDocument): void {
    if (parseCompleted.has(document)) {
        return;
    }
    parseCompleted.add(document);
    const physicalByPartKey: Map<string, Watermark> = new Map<string, Watermark>();
    let catalog: any;
    try {
        catalog = headersFootersFor(document);
    }
    catch {
        parseIndexByDocument.set(document, { physicalByPartKey, completed: true });
        return;
    }
    let pkg: OpcPackage | undefined;
    try {
        pkg = document.opcPackage();
    }
    catch {
        pkg = undefined;
    }
    const visited: Set<string> = new Set<string>();
    for (const relId of catalog.relationshipIds('header')) {
        const entry: ReturnType<HeadersFootersCatalog['entryForRelationship']> = catalog.entryForRelationship(relId);
        if (entry === undefined) {
            continue;
        }
        const key: string = partNameKey(entry.partName);
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);
        const watermark: Watermark = parseWatermarkFromHeaderBlocks(entry.blocks, pkg, entry.partName);
        if (watermark !== undefined) {
            physicalByPartKey.set(key, watermark);
        }
    }
    parseIndexByDocument.set(document, { physicalByPartKey, completed: true });
}
/**
 * Apply logical watermark from default header after physical index is built.
 * Separated so the document getter can call ensure then read logical without
 * re-entrancy through the prototype getter mid-parse.
 *
 * @param {WordDocument} document - The document.
 * @param {Function} getLogical - The get logical.
 * @param {Function} setLogical - The set logical.
 * @returns {void} Nothing is returned.
 * @private
 */
export function applyLogicalWatermarkFromDefaultHeader(
    document: WordDocument,
    getLogical: () => Watermark | undefined,
    setLogical: (value: Watermark | undefined) => void
): void {
    // Sticky after first apply or author setter/remove â€” never re-seed logical.
    if (logicalSettled.has(document)) {
        return;
    }
    if (getLogical() !== undefined) {
        logicalSettled.add(document);
        return;
    }
    const index: WatermarkParseIndex = parseIndexByDocument.get(document);
    if (index === undefined) {
        return;
    }
    const header: HeaderFooter = defaultHeader(document);
    if (header === undefined) {
        // Physical scan finished with no default header; settle so getters stay empty.
        logicalSettled.add(document);
        return;
    }
    let catalog: any;
    try {
        catalog = headersFootersFor(document);
    }
    catch {
        logicalSettled.add(document);
        return;
    }
    const entry: ReturnType<HeadersFootersCatalog['entryForRelationship']> = catalog.entryForRelationship(header.relationshipId);
    if (entry === undefined) {
        logicalSettled.add(document);
        return;
    }
    const wm: Watermark = index.physicalByPartKey.get(partNameKey(entry.partName));
    if (wm !== undefined) {
        setLogical(wm);
    }
    logicalSettled.add(document);
}
/**
 * Full ensure + logical apply used by the document host getter.
 *
 * @param {WordDocument} document - The document.
 * @param {Function} getLogical - The get logical.
 * @param {Function} setLogical - The set logical.
 * @returns {void} Nothing is returned.
 * @private
 */
export function ensureParsedAndLogical(
    document: WordDocument,
    getLogical: () => Watermark | undefined,
    setLogical: (value: Watermark | undefined) => void
): void {
    ensureWatermarksParsed(document);
    applyLogicalWatermarkFromDefaultHeader(document, getLogical, setLogical);
}

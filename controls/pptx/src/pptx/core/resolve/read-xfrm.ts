import { getGradientDrawingNamespace } from '../theme/read-gradient';
/**
 * Read `a:xfrm` geometry from shape `spPr` (view only).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `CT_Transform2D` — `off` (`x`,`y`),
 * `ext` (`cx`,`cy`). Values are EMU strings parsed as safe integers.
 * Group child space uses `CT_GroupTransform2D` `chOff` / `chExt`
 * (`docs/specs/017-group-navigate-depth.md`).
 */
import { findChild, getAttr } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { PML_NS } from '../presentation/constants';
import { OoxmlElement } from '../xml/index';
/**
 * Sparse EMU transform numbers from one `a:xfrm`.
 *
 * @internal
 */
export interface DirectTransform {
    readonly x?: number;
    readonly y?: number;
    readonly cx?: number;
    readonly cy?: number;
    /** Direct clockwise rotation in degrees (`a:xfrm/@rot` divided by 60000). */
    readonly rotationDegrees?: number;
    /** Direct horizontal flip flag when authored. */
    readonly flipHorizontal?: boolean;
    /** Direct vertical flip flag when authored. */
    readonly flipVertical?: boolean;
}
/**
 * EMU point (`CT_Point2D`).
 */
export interface EmuPoint {
    /** Horizontal offset in EMUs (CT_Point2D/@x). */
    readonly x: number;
    /** Vertical offset in EMUs (CT_Point2D/@y). */
    readonly y: number;
}
/**
 * EMU size (`CT_PositiveSize2D` / extent).
 *
 * @remarks
 * Public property names are semantic (`width` / `height`). Wire attributes remain
 * `cx` / `cy` on `a:ext` and `a:chExt`.
 */
export interface EmuSize {
    readonly width: number;
    readonly height: number;
}
/**
 * Raw group child coordinate space from `grpSpPr` / `a:xfrm` (`chOff` / `chExt`).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `CT_GroupTransform2D` (~644–654).
 * Read-only; navigation must not invent missing nodes or write scheme colours.
 */
export interface GroupChildSpace {
    /** Optional child origin (a:xfrm/a:chOff) in group coordinate space. */
    readonly chOff?: EmuPoint;
    /** Optional child extent (a:xfrm/a:chExt) in group coordinate space. */
    readonly chExt?: EmuSize;
}
/**
 * Locates `p:spPr` or `a:spPr` under a shape element.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findSpPr(shapeElement: OoxmlElement): OoxmlElement | undefined {
    return (findChild(shapeElement, PML_NS, 'spPr') !== null &&
        findChild(shapeElement, PML_NS, 'spPr') !== undefined ? findChild(shapeElement, PML_NS, 'spPr') : findChild(shapeElement, DML_NS, 'spPr'));
}
/**
 * Reads `a:xfrm` under shape properties when present.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live `p:sp` (or similar) element.
 * @returns {DirectTransform | undefined} Sparse EMU numbers, or `undefined` when no `xfrm` exists.
 */
export function readShapeXfrm(shapeElement: OoxmlElement): DirectTransform | undefined {
    const drawing: string | undefined = getGradientDrawingNamespace(shapeElement.namespaceUri);
    if (drawing === undefined) { return undefined; }
    const frame: boolean = shapeElement.localName === 'graphicFrame';
    const properties: string = shapeElement.localName === 'grpSp' ? 'grpSpPr' : 'spPr';
    const spPr: OoxmlElement | undefined = frame ? undefined : findChild(shapeElement, shapeElement.namespaceUri, properties) ||
        findChild(shapeElement, drawing, properties);
    // CT_GraphicalObjectFrame owns p:xfrm directly, with DrawingML off/ext children.
    const xfrm: OoxmlElement | undefined = frame ? findChild(shapeElement, shapeElement.namespaceUri, 'xfrm') :
        spPr === undefined ? undefined : findChild(spPr, drawing, 'xfrm');
    if (xfrm === undefined) {
        return undefined;
    }
    return readXfrmElement(xfrm);
}
/**
 * Parses `a:off` / `a:ext` children of `a:xfrm`.
 *
 * @internal
 * @param {OoxmlElement} xfrm - The xfrm value.
 * @returns {DirectTransform | undefined} The result.
 */
export function readXfrmElement(xfrm: OoxmlElement): DirectTransform | undefined {
    const drawing: string | undefined = getGradientDrawingNamespace(xfrm.namespaceUri);
    if (drawing === undefined || xfrm.localName !== 'xfrm' || drawing !== xfrm.namespaceUri &&
        xfrm.namespaceUri !== PML_NS && xfrm.namespaceUri !== 'http://purl.oclc.org/ooxml/presentationml/main') { return undefined; }
    const off: OoxmlElement = findChild(xfrm, drawing, 'off');
    const ext: OoxmlElement = findChild(xfrm, drawing, 'ext');
    const x: number = parseEmuAttr(off, 'x');
    const y: number = parseEmuAttr(off, 'y');
    const cx: number = parseEmuAttr(ext, 'cx');
    const cy: number = parseEmuAttr(ext, 'cy');
    const rotationDegrees: number = parseRotation(getAttr(xfrm, '', 'rot'));
    const flipHorizontal: boolean = parseOptionalBoolean(getAttr(xfrm, '', 'flipH'));
    const flipVertical: boolean = parseOptionalBoolean(getAttr(xfrm, '', 'flipV'));
    if (x === undefined && y === undefined && cx === undefined && cy === undefined && rotationDegrees === undefined &&
        flipHorizontal === undefined && flipVertical === undefined) {
        return undefined;
    }
    return {
        ...(x !== undefined ? { x } : {}),
        ...(y !== undefined ? { y } : {}),
        ...(cx !== undefined ? { cx } : {}),
        ...(cy !== undefined ? { cy } : {}),
        ...(rotationDegrees !== undefined ? { rotationDegrees } : {}),
        ...(flipHorizontal !== undefined ? { flipHorizontal } : {}),
        ...(flipVertical !== undefined ? { flipVertical } : {})
    };
}

/**
 * Parse DrawingML angle units to degrees.
 *
 * @param {string | undefined} raw - Authored angle-unit string.
 * @returns {number | undefined} Degrees, or undefined for absent/invalid input.
 */
function parseRotation(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    const value: number = Number(raw);
    return Number.isSafeInteger(value) ? value / 60000 : undefined;
}

/**
 * Parse an optional OOXML boolean without inventing a missing value.
 *
 * @param {string | undefined} raw - Authored boolean token.
 * @returns {boolean | undefined} Parsed value, or undefined when absent/invalid.
 */
function parseOptionalBoolean(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    if (raw === '1' || raw.toLowerCase() === 'true') {
        return true;
    }
    if (raw === '0' || raw.toLowerCase() === 'false') {
        return false;
    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {number | undefined} The result.
 */
function parseEmuAttr(el: OoxmlElement | undefined, localName: string): number | undefined {
    if (el === undefined) {
        return undefined;
    }
    const raw: string = getAttr(el, '', localName);
    if (raw === undefined || !/^-?\d+$/u.test(raw)) {
        return undefined;
    }
    const n: number = Number(raw);
    return Number.isSafeInteger(n) ? n : undefined;
}
/**
 * True when the transform has at least one coordinate/extent.
 *
 * @internal
 * @param {DirectTransform | undefined} t - The t value.
 * @returns {*} The result.
 */
export function isTransformDefined(t: DirectTransform | undefined): t is DirectTransform {
    return t !== undefined;
}
/**
 * Locates `p:grpSpPr` or `a:grpSpPr` under a group shape element.
 *
 * @internal
 * @param {OoxmlElement} groupElement - The groupElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findGrpSpPr(groupElement: OoxmlElement): OoxmlElement | undefined {
    const drawing: string | undefined = getGradientDrawingNamespace(groupElement.namespaceUri);
    if (drawing === undefined) { return undefined; }
    return findChild(groupElement, groupElement.namespaceUri, 'grpSpPr') || findChild(groupElement, drawing, 'grpSpPr');
}
/**
 * Reads group child coordinate space (`chOff` / `chExt`) from `grpSpPr`/`a:xfrm`.
 *
 * @remarks Does not invent `chOff`/`chExt` nodes. Parent `off`/`ext` are not returned here. Citation: `CT_GroupTransform2D`; ECMA-376 Part
 * 1 §20.1.7.2 `chOff`.
 * @internal
 * @param {OoxmlElement} groupElement - Live `p:grpSp` element.
 * @returns {GroupChildSpace | undefined} Sparse child-space EMUs, or `undefined` when no child-space fields exist.
 */
export function readGroupChildSpaceFromElement(groupElement: OoxmlElement): GroupChildSpace | undefined {
    const grpSpPr: OoxmlElement = findGrpSpPr(groupElement);
    if (grpSpPr === undefined) {
        return undefined;
    }
    const drawing: string | undefined = getGradientDrawingNamespace(groupElement.namespaceUri);
    if (drawing === undefined) { return undefined; }
    const xfrm: OoxmlElement = findChild(grpSpPr, drawing, 'xfrm');
    if (xfrm === undefined) {
        return undefined;
    }
    const chOffEl: OoxmlElement = findChild(xfrm, drawing, 'chOff');
    const chExtEl: OoxmlElement = findChild(xfrm, drawing, 'chExt');
    const x: number = parseEmuAttr(chOffEl, 'x');
    const y: number = parseEmuAttr(chOffEl, 'y');
    const cx: number = parseEmuAttr(chExtEl, 'cx');
    const cy: number = parseEmuAttr(chExtEl, 'cy');
    // CT_Point2D / CT_PositiveSize2D require both axes; surface only complete pairs.
    const chOffPoint: EmuPoint | undefined = x !== undefined && y !== undefined ? { x, y } : undefined;
    const chExtSize: EmuSize | undefined = cx !== undefined && cy !== undefined ? { width: cx, height: cy } : undefined;
    if (chOffPoint === undefined && chExtSize === undefined) {
        return undefined;
    }
    return {
        ...(chOffPoint !== undefined ? { chOff: chOffPoint } : {}),
        ...(chExtSize !== undefined ? { chExt: chExtSize } : {})
    };
}

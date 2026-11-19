/**
 * Append a minimal auto-shape (`p:sp` + `a:prstGeom`) under a slide `p:spTree`.
 *
 * Citations (Transitional XSD / fixtures — no invented vocabulary):
 * - `pml.xsd` `CT_ShapeNonVisual` (~1260): `cNvPr`, `cNvSpPr`, `nvPr` required
 * - `pml.xsd` `CT_Shape` (~1268): `nvSpPr`, `spPr` required; `txBody` optional
 * - `dml-main.xsd` `CT_NonVisualDrawingProps` (~816): `@id`, `@name` required
 * - `dml-main.xsd` `CT_NonVisualDrawingShapeProps` (~822): no `@txBox` for freeforms
 * - `dml-main.xsd` `CT_Transform2D` (~635); `CT_ShapeProperties` (~2245)
 * - `dml-main.xsd` `ST_ShapeType` (~1717): `line`, `rect`, `ellipse`, `arc`
 * - `dml-main.xsd` `CT_PresetGeometry2D` (~2088): `@prst` required + optional `avLst`
 * - `dml-main.xsd` `CT_LineProperties` / `CT_SolidColorFillProperties`: `a:ln`, `a:solidFill`
 *
 * Line auto-shapes use `p:sp` + `prst="line"` (not `p:cxnSp` connectors).
 * Circle uses public name Circle with wire `prst="ellipse"` (no `circle` token).
 *
 * Public API form is `addShape(type, bounds)` (two positionals) per API-RULES
 * R2.2 / R2.4 / R8.1 — not five raw EMU numbers. Optional name is a trailing
 * options object only.
 */
import { PictureMediaAccess } from '../pictures/media-access';
import { PML_NS } from '../presentation/constants';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { OoxmlAttribute, OoxmlElement } from '../xml/index';
import { AutoShapeType, autoShapePrst, defaultAutoShapeName, isAutoShapeType, AutoShapePrst, AutoShapeTypeValue } from './auto-shape-type';
import { allocateNextDrawingElementId } from './drawing-element-id';
import { buildCreationIdExtLst, creationIdGuid } from './creation-id';
import { DML_NS } from './constants';
import { asMutable } from './dom-utils';
import { Shape } from './shape';
import { findSpTree, ShapeBounds } from './add-text-box';
import { walkSlideShapeTree } from './walk';
import { coordinateToEmuString } from '../util/length-units';
/**
 * Options for {@link ShapeCollection.addShape}.
 *
 * @remarks
 * Bounds are a **required** second positional on `addShape` (API-RULES R2.2
 * R8.1). Only optional name lives here so the common call stays two arguments.
 */
export interface AddShapeOptions {
    /**
     * `cNvPr/@name` for the new shape.
     *
     * @defaultValue Type-specific name (`"Rectangle"`, `"Oval"`, …)
     */
    readonly name?: string;
}
/**
 * Default bounds: origin, 2" × 1" (144 pt × 72 pt).
 *
 * @remarks
 * Conventional create default (same physical size as {@link DEFAULT_TEXT_BOX_BOUNDS}).
 * Wire EMUs are `points × 12700`. For {@link AutoShapeType.Circle}, pass equal
 * `width` and `height`.
 */
export const DEFAULT_AUTO_SHAPE_BOUNDS: Readonly<ShapeBounds> = Object.freeze({
    x: 0,
    y: 0,
    width: 144,
    height: 72
});
/**
 * Arguments for {@link addShapeToSlide}.
 *
 * @internal
 */
export interface AddShapeToSlideArgs {
    readonly root: OoxmlElement;
    readonly limits: SecurityLimits;
    readonly partName: string;
    readonly media?: PictureMediaAccess;
    /** Public auto-shape kind ({@link AutoShapeType}). */
    readonly type: AutoShapeTypeValue;
    /** Position and size in **points**. */
    readonly bounds: ShapeBounds;
    readonly options?: AddShapeOptions;
    /** Optional mutation hook (e.g. digital-signature warning). */
    readonly onMutate?: () => void;
}
/**
 * Appends an auto-shape under the slide `p:spTree` and returns its handle.
 *
 * @throws {Error} When `shapesPerSlide` would be exceeded.
 * @throws {Error} When `p:spTree` is missing or `type` is invalid.
 * @throws {RangeError} When drawing element id space is exhausted.
 * @remarks - New id = {@link allocateNextDrawingElementId} (includes grp tree id=1). - Existing shape ids and unknown `spTree` siblings are
 * left untouched. - Does **not** set `cNvSpPr/@txBox` and does not emit `txBody`. - Line/arc emit `a:noFill` + `a:ln` stroke; closed shapes
 * emit `a:solidFill` (theme `accent1`) plus the same stroke.
 * @internal
 * @param {AddShapeToSlideArgs} args - Live slide root, limits, type, bounds, and options.
 * @returns {Shape} The new {@link Shape} (`kind` `sp`) with allocated `cNvPr/@id`.
 */
export function addShapeToSlide(args: AddShapeToSlideArgs): Shape {
    if (!isAutoShapeType(args.type)) {
        throw new InvalidPackageError(`Unsupported auto-shape type "${String(args.type)}"; expected an AutoShapeType kind`,
                                      { partName: args.partName });
    }
    const spTree: OoxmlElement = findSpTree(args.root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot add a shape', {
            partName: args.partName
        });
    }
    const existing: Array<Shape> = walkSlideShapeTree(args.root, args.limits, args.partName, args.media, args.onMutate);
    if (existing.length >= args.limits.shapesPerSlide) {
        throw new PackageLimitError('shapesPerSlide', {
            partName: args.partName,
            actual: existing.length + 1
        });
    }
    const id: string = allocateNextDrawingElementId(args.root);
    const optionsName: string = args.options != null ? args.options.name : undefined;
    const name: string = optionsName != null ? optionsName : defaultAutoShapeName(args.type);
    const prst: AutoShapePrst = autoShapePrst(args.type);
    const bounds: ShapeBounds = args.bounds;
    const sp: OoxmlElement = buildAutoShapeSp({ id, name, bounds, prst });
    asMutable(spTree).children.push(sp);
    if (args.onMutate != null) {
        args.onMutate();
    }
    return Shape.create(sp, 'sp', id, name, args.limits, args.partName, args.media, 0, args.onMutate, args.root, [spTree]); 
}
/**
 * @param {*} args - The args value.
 * @param {*} args.id - The args.id value.
 * @param {*} args.name - The args.name value.
 * @param {*} args.bounds - The args.bounds value.
 * @param {*} args.prst - The args.prst value.
 * @returns {OoxmlElement} The result.
 */
function buildAutoShapeSp(args: {
    readonly id: string;
    readonly name: string;
    readonly bounds: ShapeBounds;
    readonly prst: AutoShapePrst;
}): OoxmlElement {
    // Per-shape a16:creationId on cNvPr — same Office repair heuristic as text boxes.
    const seed: number = Number(args.id) || 1;
    const cNvPr: OoxmlElement = el(PML_NS, 'cNvPr', 'p', [attr('id', args.id), attr('name', args.name)], [
        buildCreationIdExtLst(creationIdGuid(seed))
    ]);
    // Freeform auto-shape: no txBox (text boxes set txBox="1").
    const cNvSpPr: OoxmlElement = el(PML_NS, 'cNvSpPr', 'p', [], []);
    const nvPr: OoxmlElement = el(PML_NS, 'nvPr', 'p', [], []);
    const nvSpPr: OoxmlElement = el(PML_NS, 'nvSpPr', 'p', [], [cNvPr, cNvSpPr, nvPr]);
    const off: OoxmlElement = el(DML_NS, 'off', 'a', [
        attr('x', coordinateToEmuString(args.bounds.x, 'bounds.x')),
        attr('y', coordinateToEmuString(args.bounds.y, 'bounds.y'))
    ], []);
    const ext: OoxmlElement = el(DML_NS, 'ext', 'a', [
        attr('cx', coordinateToEmuString(args.bounds.width, 'bounds.width')),
        attr('cy', coordinateToEmuString(args.bounds.height, 'bounds.height'))
    ], []);
    const xfrmEl: OoxmlElement = el(DML_NS, 'xfrm', 'a', [], [off, ext]);
    const avLst: OoxmlElement = el(DML_NS, 'avLst', 'a', [], []);
    const prstGeom: OoxmlElement = el(DML_NS, 'prstGeom', 'a', [attr('prst', args.prst)], [avLst]);
    // Closed shapes get a theme solid fill so they are visible; line/arc are
    // stroke-oriented (noFill + a:ln). schemeClr tokens are ST_SchemeColorVal
    // (dml-main); accent1 matches library fill/line fixtures and theme samples.
    // Citation: dml-main CT_ShapeProperties children solidFill | noFill | ln;
    // CT_SolidColorFillProperties / CT_SchemeColor; CT_LineProperties @w.
    const spPrChildren: OoxmlElement[] = [xfrmEl, prstGeom];
    if (args.prst === 'line' || args.prst === 'arc') {
        spPrChildren.push(el(DML_NS, 'noFill', 'a', [], []));
        spPrChildren.push(buildAccentLine());
    }
    else {
        spPrChildren.push(buildAccentSolidFill());
        spPrChildren.push(buildAccentLine());
    }
    const spPr: OoxmlElement = el(PML_NS, 'spPr', 'p', [], spPrChildren);
    return el(PML_NS, 'sp', 'p', [], [nvSpPr, spPr]);
}
/**
 *
 * @returns {OoxmlElement} The result.
 */
function buildAccentSolidFill(): OoxmlElement {
    const schemeClr: OoxmlElement = el(DML_NS, 'schemeClr', 'a', [attr('val', 'accent1')], []);
    return el(DML_NS, 'solidFill', 'a', [], [schemeClr]);
}
/**
 *
 * @returns {OoxmlElement} The result.
 */
function buildAccentLine(): OoxmlElement {
    const schemeClr: OoxmlElement = el(DML_NS, 'schemeClr', 'a', [attr('val', 'accent1')], []);
    const solidFill: OoxmlElement = el(DML_NS, 'solidFill', 'a', [], [schemeClr]);
    return el(DML_NS, 'ln', 'a', [attr('w', '12700')], [solidFill]);
}
/**
 *
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} prefixHint - The prefixHint value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function el(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
            children: ReadonlyArray<OoxmlElement | {
                readonly kind: 'text';
                readonly text: string;
            }>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint
    };
}
// Keep AutoShapeType referenced for TSDoc linkage in this module's consumers.
void AutoShapeType;

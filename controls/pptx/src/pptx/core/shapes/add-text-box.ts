/**
 * Append a minimal text box (`p:sp` + `txBody`) under a slide `p:spTree`.
 *
 * Citations (Transitional XSD / fixtures — no invented vocabulary):
 * - `pml.xsd` `CT_ShapeNonVisual` (~1260): `cNvPr`, `cNvSpPr`, `nvPr` required
 * - `pml.xsd` `CT_Shape` (~1268): `nvSpPr`, `spPr` required; `txBody` optional
 * - `dml-main.xsd` `CT_NonVisualDrawingProps` (~816): `@id`, `@name` required
 * - `dml-main.xsd` `CT_NonVisualDrawingShapeProps` (~822): `@txBox` optional
 * - `dml-main.xsd` `CT_TextBody` (~2681): `bodyPr` required; `p` minOccurs 1
 * - `dml-main.xsd` `CT_Transform2D` (~635); `CT_ShapeProperties` (~2245)
 * - `ST_ShapeType` includes `rect`; fixtures use `a:prstGeom prst="rect"` + empty `a:avLst`
 */
import { PictureMediaAccess } from '../pictures/media-access';
import { PML_NS } from '../presentation/constants';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { coordinateToEmuString } from '../util/length-units';
import { OoxmlAttribute, OoxmlElement } from '../xml/index';
import { allocateNextDrawingElementId } from './drawing-element-id';
import { buildCreationIdExtLst, creationIdGuid } from './creation-id';
import { DML_NS } from './constants';
import { asMutable, findChild } from './dom-utils';
import { Shape } from './shape';
import { walkSlideShapeTree } from './walk';
/**
 * Position and size for inserted shapes and graphic frames, in **points**.
 *
 * @remarks
 * Public authoring uses typographic points (1 pt = 1/72 in = 12_700 EMU).
 * On write, values map to DrawingML `a:off` (`@x`/`@y`) and `a:ext` (`@cx`/`@cy`)
 * integer EMU decimals (`ST_Coordinate` / `ST_PositiveCoordinate`) via
 * {@link coordinateToEmuString}. A `string` value is treated as an already-serialized
 * EMU decimal (escape hatch). Citation: `dml-main.xsd` `CT_Point2D`
 * `CT_PositiveSize2D`; `docs/api/API-RULES.md` §4.
 */
export interface ShapeBounds {
    /** Horizontal offset in points (`a:off/@x` after EMU conversion). */
    readonly x: number | string;
    /** Vertical offset in points (`a:off/@y` after EMU conversion). */
    readonly y: number | string;
    /** Width in points (written as `a:ext/@cx` after EMU conversion). */
    readonly width: number | string;
    /** Height in points (written as `a:ext/@cy` after EMU conversion). */
    readonly height: number | string;
}
/** Bounds for a text box; alias of {@link ShapeBounds}. */
export type TextBoxBounds = ShapeBounds;
/**
 * Options for {@link ShapeCollection.addTextBox}.
 */
export interface AddTextBoxOptions {
    /**
     * Initial run text under `a:txBody/a:p/a:r/a:t`.
     *
     * @defaultValue `""`
     */
    readonly text?: string;
    /**
     * `cNvPr/@name` for the new shape.
     *
     * @defaultValue `"TextBox"`
     */
    readonly name?: string;
    /**
     * Shape position and size in **points**.
     *
     * @defaultValue `{ x: 0, y: 0, width: 144, height: 72 }` (2" × 1")
     */
    readonly bounds?: ShapeBounds;
}
/** Default name when {@link AddTextBoxOptions.name} is omitted. */
export const DEFAULT_TEXT_BOX_NAME: string = 'TextBox';
/**
 * Default bounds: origin, 2" × 1" (144 pt × 72 pt).
 *
 * @remarks
 * Sizes are conventional create defaults (not read from a fixture byte-for-byte).
 * Wire EMUs are `points × 12700` (`1828800` × `914400`).
 */
export const DEFAULT_TEXT_BOX_BOUNDS: Readonly<ShapeBounds> = Object.freeze({
    x: 0,
    y: 0,
    width: 144,
    height: 72
});
/**
 * Arguments for {@link addTextBoxToSlide}.
 *
 * @internal
 */
export interface AddTextBoxToSlideArgs {
    readonly root: OoxmlElement;
    readonly limits: SecurityLimits;
    readonly partName: string;
    readonly media?: PictureMediaAccess;
    readonly options?: AddTextBoxOptions;
    /** Optional mutation hook (e.g. digital-signature warning). */
    readonly onMutate?: () => void;
}
/**
 * Appends a text box shape under the slide `p:spTree` and returns its handle.
 *
 * @throws {Error} When `shapesPerSlide` would be exceeded.
 * @throws {Error} When `p:spTree` is missing.
 * @throws {RangeError} When drawing element id space is exhausted.
 * @remarks - New id = {@link allocateNextDrawingElementId} (includes grp tree id=1). - Existing shape ids and unknown `spTree` siblings are
 * left untouched. - `cNvSpPr/@txBox="1"` marks a text box (`CT_NonVisualDrawingShapeProps`).
 * @internal
 * @param {AddTextBoxToSlideArgs} args - Live slide root, limits, and options.
 * @returns {Shape} The new {@link Shape} (`kind` `sp`) with allocated `cNvPr/@id`.
 */
export function addTextBoxToSlide(args: AddTextBoxToSlideArgs): Shape {
    const options: AddTextBoxOptions = (args.options !== null && args.options !== undefined ? args.options : {});
    const spTree: OoxmlElement = findSpTree(args.root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot add a text box', {
            partName: args.partName
        });
    }
    // Enforce shapesPerSlide consistently with walk (identifiable shape-like nodes).
    const existing: Array<Shape> = walkSlideShapeTree(args.root, args.limits, args.partName, args.media, args.onMutate);
    if (existing.length >= args.limits.shapesPerSlide) {
        throw new PackageLimitError('shapesPerSlide', {
            partName: args.partName,
            actual: existing.length + 1
        });
    }
    const id: string = allocateNextDrawingElementId(args.root);
    const name: string = (options.name !== null && options.name !== undefined ? options.name : DEFAULT_TEXT_BOX_NAME);
    const bounds: ShapeBounds = (options.bounds !== null && options.bounds !== undefined ? options.bounds : DEFAULT_TEXT_BOX_BOUNDS);
    const text: string = (options.text !== null && options.text !== undefined ? options.text : '');
    const sp: OoxmlElement = buildTextBoxSp({ id, name, bounds, text });
    asMutable(spTree).children.push(sp);
    if (args.onMutate != null) {
        args.onMutate();
    }
    return Shape.create(sp, 'sp', id, name, args.limits, args.partName, args.media, 0, args.onMutate, args.root, [spTree]); 
}
/**
 * Locates `p:cSld/p:spTree` under a slide root.
 *
 * @internal
 * @param {OoxmlElement} slideRoot - The slideRoot value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findSpTree(slideRoot: OoxmlElement): OoxmlElement | undefined {
    const cSld: OoxmlElement = findChild(slideRoot, PML_NS, 'cSld');
    if (cSld === undefined) {
        return undefined;
    }
    return findChild(cSld, PML_NS, 'spTree');
}
/**
 * @param {*} args - The args value.
 * @param {*} args.id - The args.id value.
 * @param {*} args.name - The args.name value.
 * @param {*} args.bounds - The args.bounds value.
 * @param {*} args.text - The args.text value.
 * @returns {OoxmlElement} The result.
 */
function buildTextBoxSp(args: {
    readonly id: string;
    readonly name: string;
    readonly bounds: ShapeBounds;
    readonly text: string;
}): OoxmlElement {
    // Per-shape a16:creationId on cNvPr — PowerPoint repair heuristic flags
    // shapes missing this extension. Citation: inspected
    // `temp/simple-create-output-ms_office.pptx` slide1.xml — every shape's
    // cNvPr carries <a:extLst><a:ext uri="{FF2B5EF4-…}"><a16:creationId …/>.
    const seed: number = Number(args.id) || 1;
    const cNvPr: OoxmlElement = el(PML_NS, 'cNvPr', 'p', [attr('id', args.id), attr('name', args.name)], [
        buildCreationIdExtLst(creationIdGuid(seed))
    ]);
    // txBox marks text box; boolean "1" matches useBgFill reader convention.
    const cNvSpPr: OoxmlElement = el(PML_NS, 'cNvSpPr', 'p', [attr('txBox', '1')], []);
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
    const prstGeom: OoxmlElement = el(DML_NS, 'prstGeom', 'a', [attr('prst', 'rect')], [avLst]);
    const noFill: OoxmlElement = el(DML_NS, 'noFill', 'a', [], []);
    const spPr: OoxmlElement = el(PML_NS, 'spPr', 'p', [], [xfrmEl, prstGeom, noFill]);
    // CT_TextBody: bodyPr required, lstStyle optional but always emitted by
    // Office-family generators; ≥1 paragraph (dml-main CT_TextBody). Citation:
    // `dml-main.xsd` `CT_TextBody` (~2681) — bodyPr, lstStyle, p.
    // `wrap="square"` + `rtlCol="0"` + `<a:spAutoFit/>` match MS-Office
    // authoring form for text boxes (`CT_TextBodyProperties`; `CT_TextWarpType`
    // `wrap` attribute default `square`). PowerPoint's repair heuristic flags
    // bare `<a:bodyPr/>` on text boxes.
    const spAutoFit: OoxmlElement = el(DML_NS, 'spAutoFit', 'a', [], []);
    const bodyPr: OoxmlElement = el(DML_NS, 'bodyPr', 'a', [attr('wrap', 'square'), attr('rtlCol', '0')], [spAutoFit]);
    const lstStyle: OoxmlElement = el(DML_NS, 'lstStyle', 'a', [], []);
    // Empty initial text → bare `<a:p/>` (Office-family authoring form for an
    // empty text box; `CT_TextParagraph` all children optional). Avoids seeding
    // an empty-text run, which would block `TextBody.addParagraph` reuse of the
    // empty last paragraph and leave a stray blank line above authored text.
    const p: OoxmlElement = args.text === ''
        ? el(DML_NS, 'p', 'a', [], [])
        : (() => {
            // a:rPr with lang matches Office-family output; `dirty="0"` marks the run
            // as not needing re-spellcheck. Citation: `dml-main.xsd` `CT_TextCharacterProperties`
            // — @lang (ST_TextLanguage), @dirty (xsd:boolean, default true).
            const rPr: OoxmlElement = el(DML_NS, 'rPr', 'a', [attr('lang', 'en-US'), attr('dirty', '0')], []);
            const t: OoxmlElement = el(DML_NS, 't', 'a', [], [{ kind: 'text' as 'text', text: args.text }]);
            const r: OoxmlElement = el(DML_NS, 'r', 'a', [], [rPr, t]);
            return el(DML_NS, 'p', 'a', [], [r]);
        })();
    const txBody: OoxmlElement = el(PML_NS, 'txBody', 'p', [], [bodyPr, lstStyle, p]);
    return el(PML_NS, 'sp', 'p', [], [nvSpPr, spPr, txBody]);
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

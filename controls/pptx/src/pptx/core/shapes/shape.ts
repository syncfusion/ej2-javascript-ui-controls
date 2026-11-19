import { outlineNamespace, commitOutlineFill } from './mutate-decoration-fill';
import { GradientStopEditor } from './gradient-stop-editor';
import { GradientFillOptions } from './gradient-fill-options';
import { buildGradientFill, buildSolidFill, GradientFillError } from './write-gradient-fill';
import { shapeFillNamespace, commitShapeFill, writeUseBackgroundFill } from './mutate-shape-fill';
import { ColorValue } from '../theme/color-value';
/**
 * Shape handle bound to a live shape-tree element.
 */
import { Picture, PictureMediaAccess } from '../pictures/index';
import { ReplaceImageDataOptions } from '../pictures/retarget-embedded';
import { readPlaceholderInfo } from '../placeholders/parse-ph';
import { PlaceholderInfo } from '../placeholders/placeholder-info';
import { PML_NS } from '../presentation/constants';
import { DRAWINGML_TABLE_URI, ShapeType } from '../presentation/shapetype';
import { detectGraphicKind } from '../registry/feature-registry';
import { readGroupChildSpaceFromElement, readShapeXfrm, DirectTransform, GroupChildSpace } from '../resolve/read-xfrm';
import { SecurityLimits } from '../security/limits';
import { OoxmlElement } from '../xml/index';
import { findTxBody, TextBody } from '../text/index';
import { Paragraph } from '../text/paragraph';
import { TextPart } from '../text/text-part';
import { HyperlinkView } from '../slideimplementation/slide';
import { readShapeHyperlinkView, removeShapeHyperlink, setShapeHyperlink } from '../../features/hyperlinks-actions/facade';
import { TextUnderlineTypeValue } from '../text/font-types';
import { DML_NS } from './constants';
import { partNameOptions, ShapeTextError } from './errors';
import { findChild } from './dom-utils';
import { ConnectorEnds, DirectGeometry, GeometryKind } from './connector-geometry-types';
import { DirectFill, DirectLine, ResolvedFill, ShapeStyleRefs } from './fill-line-types';
import { readConnectorEndsFromElement, readDirectGeometryFromElement, readGeometryKindFromElement } from './read-connector-geometry';
import { findShapeSpPr, readDirectFill, readDirectLine, readShapeStyleRefs, readUseBgFill, resolveFillView } from './read-fill-line';
import { readCNvPrDescr, readCNvPrHidden, readCNvPrTitle } from './read-cnvpr';
import { listDirectShapeChildren, ShapeWalkContext } from './walk';
import { ParagraphCollection } from '../text/paragraph-collection';
import { OoxmlAttribute, OoxmlText } from '../xml/dom';
import { Font } from '../text/font';
/**
 * Kind of shape-tree child recognised by the walk.
 *
 * @remarks
 * Values mirror local names under `p:spTree` / `p:grpSp` (pml.xsd group-shape content).
 * Unknown or future children are not emitted as shapes.
 */
export type ShapeElementKind = 'sp' | 'grpSp' | 'pic' | 'cxnSp' | 'graphicFrame' | 'contentPart';
/**
 * Optional-module hook so `slide.shapes[n]` can be a feature subclass (tables →
 * `Table`) without core importing that module. Return `undefined` to keep the
 * generic {@link Shape}.
 *
 * @internal
 */
export type ShapeMaterializer = (
    element: OoxmlElement,
    elementKind: ShapeElementKind,
    id: string,
    name: string,
    limits: SecurityLimits,
    partName: string | undefined,
    media: PictureMediaAccess | undefined,
    groupDepth: number,
    onMutate: (() => void) | undefined,
    hostRoot: OoxmlElement | undefined,
    groupAncestors: ReadonlyArray<OoxmlElement>
) => Shape | undefined; 
/**
 * Options for the {@link Shape.addText} quick path (API-RULES R2.6 / R5.6).
 *
 * @remarks
 * Each key maps 1:1 onto a writable direct {@link Font} surface property on the
 * text run created by `addText`. Values are authoring units, not storage
 * units: `fontSize` is points (R1.4), `color` is `'#RRGGBB'` CSS hex (R1.4
 * R2.7). `AddTextOptions` is intentionally narrower than the full `Font`
 * surface — paragraph-level concerns (`textAlign`, indents) are out of scope
 * here and live on `Paragraph` (TASK-1080); the remaining run `Font` direct
 * properties stay on `TextPart.font` directly (TASK-1081).
 *
 * Citation: `dml-main.xsd` `CT_TextCharacterProperties` (`@b`, `@i`, `@sz`,
 * `@u`, `a:solidFill/a:srgbClr`, `a:latin`).
 *
 * @public
 */
export interface AddTextOptions {
    /**
     * Latin typeface name (`a:latin` / `CT_TextFont` `@typeface`). Maps to
     * `Font.fontName`.
     */
    readonly fontName?: string;
    /**
     * Font size in typographic **points** (`@sz` is hundredths of a point). Maps
     * to `Font.fontSize`. Valid range 1–400 pt (`ST_TextFontSize`).
     */
    readonly fontSize?: number;
    /**
     * Bold (`@b` / `xsd:boolean`). Maps to `Font.bold`.
     */
    readonly bold?: boolean;
    /**
     * Italic (`@i` / `xsd:boolean`). Maps to `Font.italic`.
     */
    readonly italic?: boolean;
    /**
     * Run colour as `RRGGBB` or `#RRGGBB` CSS hex (R2.7). Maps to `Font.color`,
     * which writes `a:solidFill/a:srgbClr/@val`. Theme colour references are
     * never written by this option.
     */
    readonly color?: string;
    /**
     * Underline style (`@u` / `ST_TextUnderlineType`). Maps to `Font.underline`.
     */
    readonly underline?: TextUnderlineTypeValue;
}
/**
 * A shape (or shape-like tree node) identified by `cNvPr` id/name.
 *
 * @remarks
 * `id` and `name` are the **authored** `cNvPr/@id` and `@name` values. The library never
 * renumbers drawing element ids (animation, hyperlinks, and comments may reference them).
 *
 * `textBody` is present only when the element has a `txBody`. Setting run text mutates
 * the live slide DOM; call {@link Presentation.save} to persist.
 *
 * Nested groups: {@link Shape.children} returns **direct** children only when
 * `kind === 'grpSp'`. Depth counting matches `walk.ts` — `spTree` depth 0; first nested
 * `grpSp` depth 1; default `groupNestingDepth` 64 (`docs/specs/017-group-navigate-depth.md`).
 *
 * Common base for concrete shape handles (`slide.shapes[n]`). A `p:pic` is a
 * {@link Picture}. Optional modules register a {@link ShapeMaterializer} so a
 * recognised graphic frame is that module's subclass (tables → `Table`) without
 * core importing the feature. A wrong cast fails `instanceof`. XML detection and
 * writes stay in the existing binders.
 *
 * @public
 */
export class Shape {
    /**
     * Optional feature hook. When it returns a {@link Shape}, the walk uses that
     * instance. Core never imports feature modules.
     *
     * @internal
     */
    static materializer: ShapeMaterializer | undefined;
    /**
     * Builds the handle the slide walk exposes. Pictures are {@link Picture}.
     * A registered materializer may return a feature subclass. Does not mutate XML.
     *
     * @internal
     */
    static create(element: OoxmlElement, elementKind: ShapeElementKind, id: string, name: string, limits: SecurityLimits,
                  partName?: string, media?: PictureMediaAccess, groupDepth: number = 0, onMutate?: () => void,
                  hostRoot?: OoxmlElement, groupAncestors: ReadonlyArray<OoxmlElement> = []): Shape {
        if (elementKind === 'pic') {
            return new PictureShape(element, elementKind, id, name, limits, partName, media, groupDepth, onMutate,
                hostRoot, groupAncestors);
        } 
        const materialize: ShapeMaterializer | undefined = Shape.materializer;
        if (materialize !== undefined) {
            const specialized: Shape | undefined = materialize(element, elementKind, id, name, limits, partName, media,
                groupDepth, onMutate, hostRoot, groupAncestors);
            if (specialized !== undefined) {
                return specialized;
            }
        }
        return new Shape(element, elementKind, id, name, limits, partName, media, groupDepth, onMutate, hostRoot,
            groupAncestors);
    }
    /**
     * Copies frame identity onto a {@link Shape} subclass built before the walk
     * (tables: {@link Table} from `asTable`). Does not touch XML.
     *
     * @internal
     */
    adopt(source: Shape): void {
        this.element = source.element;
        this.partName = source.partName;
        this.limits = source.limits;
        this._id = source._id;
        this._name = source._name;
        this._elementKind = source._elementKind;
        this._kind = source._kind;
        this.groupDepth = source.groupDepth;
        this.media = source.media;
        this.onMutate = source.onMutate;
        this.hostRoot = source.hostRoot;
        this.groupAncestors = source.groupAncestors;
    }
    private element: OoxmlElement;  
    private partName: string | undefined;
    private limits: SecurityLimits;
    private _id: string;
    private _name: string;
    private _elementKind: ShapeElementKind;
    private _kind: ShapeType; 
    /**
     * Walk depth of this node: for `grpSp`, the nesting level used when this group was
     * entered (`1` = direct under `spTree`); for non-groups, parent container depth.
     */
    private groupDepth: number;
    /** Package media access for `p:pic` blip resolve (load path). */
    private media: PictureMediaAccess | undefined;
    /** Optional mutation hook (e.g. digital-signature warning) for text and nested shapes. */
    private onMutate: (() => void) | undefined; 
    /**
     * Host part document root for picture retarget (DOM refcount / identity).
     * Set by {@link walkSlideShapeTree} / insert paths that know the slide root.
     */
    private hostRoot: OoxmlElement | undefined;
    /** Outermost-first group containers carried by the existing bounded walk. */
    private groupAncestors: ReadonlyArray<OoxmlElement>; 
    /**
     * @internal
     * @param {OoxmlElement} element - The element value.
     * @param {ShapeElementKind} elementKind - The elementKind value.
     * @param {string} id - The id value.
     * @param {string} name - The name value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {PictureMediaAccess} media - The media value.
     * @param {number} groupDepth - The groupDepth value.
     * @param {*} onMutate - The onMutate value.
     * @param {OoxmlElement} hostRoot - The hostRoot value.
     * @param {ReadonlyArray<OoxmlElement>} groupAncestors - Existing enclosing group containers, outermost first.
     */
    constructor(element: OoxmlElement, elementKind: ShapeElementKind, id: string, name: string, limits: SecurityLimits, partName?: string,
                media?: PictureMediaAccess, groupDepth: number = 0, onMutate?: () => void, hostRoot?: OoxmlElement,
                groupAncestors: ReadonlyArray<OoxmlElement> = []) {
        this.element = element;
        this._elementKind = elementKind;
        this._kind = resolveShapeType(element, elementKind);
        this._id = id;
        this._name = name;
        this.limits = limits;
        this.partName = partName;
        this.media = media;
        this.groupDepth = groupDepth;
        this.onMutate = onMutate;
        this.hostRoot = hostRoot;
        this.groupAncestors = groupAncestors;
    }
    /**
     * Authored `cNvPr/@id` (`ST_DrawingElementId` as decimal string).
     *
     * @returns {string} The result.
     */
    get id(): string {
        return this._id;
    }
    /**
     * Authored `cNvPr/@name`.
     *
     * @returns {string} The result.
     */
    get name(): string {
        return this._name;
    }
    /**
     * Authored `cNvPr/@title` when present; otherwise `undefined`.
     *
     * @remarks Live DOM read — does not invent an empty title when the attribute is absent. Does not renumber `cNvPr/@id`. Hyperlink
     * children under `cNvPr` are preserved on the live tree and are never executed. Citation: Transitional `dml-main.xsd`
     * `CT_NonVisualDrawingProps`; `docs/specs/028-extended-nv-props-preserve.md`.
     * @returns {string | undefined} The result.
     */
    get title(): string | undefined {
        return readCNvPrTitle(this.element, this._elementKind);
    }
    /**
     * Authored `cNvPr/@descr` when present; otherwise `undefined`.
     *
     * @remarks Live DOM read — does not invent an empty description when the attribute is absent. Citation: Transitional `dml-main.xsd`
     * `CT_NonVisualDrawingProps`; `docs/specs/028-extended-nv-props-preserve.md`.
     * @returns {string | undefined} The result.
     */
    get descr(): string | undefined {
        return readCNvPrDescr(this.element, this._elementKind);
    }
    /**
     * `cNvPr/@hidden` (`xsd:boolean`, default false when the attribute is absent).
     *
     * @remarks Present `1` / `true` → true. Missing attribute means not hidden (schema default). Does not write defaults back on save.
     * Citation: Transitional `dml-main.xsd` `CT_NonVisualDrawingProps`; `docs/specs/028-extended-nv-props-preserve.md`.
     * @returns {boolean} The result.
     */
    get hidden(): boolean {
        return readCNvPrHidden(this.element, this._elementKind);
    }
    /**
     * Shape-tree kind (`sp`, `grpSp`, `pic`, …).
     *
     * @returns {ShapeType} The result.
     */
    get kind(): ShapeType {
        return this._kind;
    }
    /**
     * @internal
     * @returns {ShapeElementKind} The result.
     */
    get elementKind(): ShapeElementKind {
        return this._elementKind;
    }
    /**
     * Direct child shapes when {@link Shape.kind} is `grpSp`; otherwise an empty list.
     *
     * @remarks Document (z-order) order only — **not** a flattened descendant list. Nested `grpSp` children are checked at `this` group
     * depth + 1 against `limits.groupNestingDepth` (same rule as `walkSlideShapeTree`). Cycles fail closed with {@link
     * ShapeTreeCycleError}. Does not renumber `cNvPr` ids. Citation: Transitional `pml.xsd` `CT_GroupShape`;
     * `docs/specs/017-group-navigate-depth.md`.
     * @throws {Error} When nested group depth or local child count limits fail.
     * @throws {Error} When a cyclic group structure is detected.
     * @returns {*} The result.
     */
    get children(): ReadonlyArray<Shape> {
        if (this._elementKind !== 'grpSp') {
            return [];
        }
        const ctx: ShapeWalkContext = {
            limits: this.limits,
            groupAncestors: this.groupAncestors.concat([this.element]),
            ...partNameOptions(this.partName),
            ...(this.media === undefined ? {} : { media: this.media }),
            ...(this.onMutate === undefined ? {} : { onMutate: this.onMutate }),
            ...(this.hostRoot === undefined ? {} : { hostRoot: this.hostRoot })
        };
        // Parent group is at `groupDepth`; its direct child groups are checked at depth+1.
        return listDirectShapeChildren(this.element, this.groupDepth, ctx);
    }
    /**
     * Raw group child coordinate space (`chOff` / `chExt`) when this is a `grpSp`.
     *
     * @remarks Read-only from `grpSpPr`/`a:xfrm`. Does not invent missing `chOff`/`chExt` nodes and does not write scheme colours. Parent
     * `off`/`ext` are not included. Citation: Transitional `dml-main.xsd` `CT_GroupTransform2D`; ECMA-376 Part 1 §20.1.7.2.
     * @returns {GroupChildSpace | undefined} Sparse EMU child space, or `undefined` when not a group or fields absent.
     */
    readGroupChildSpace(): GroupChildSpace | undefined {
        if (this._elementKind !== 'grpSp') {
            return undefined;
        }
        return readGroupChildSpaceFromElement(this.element);
    }
    /**
     * Picture blip view when {@link Shape.kind} is `pic`; otherwise `undefined`.
     *
     * @remarks Citation: Transitional `pml.xsd` `CT_Picture`; `dml-main.xsd` `CT_Blip` / `AG_Blob`. Does not fetch `r:link` targets. Insert
     * via {@link ShapeCollection.addPicture}. Distinct from {@link Shape.fill} blip classification under `spPr` (`EG_FillProperties`):
     * picture `blipFill` is a required sibling of `spPr` under `p:pic`.
     * @returns {Picture | undefined} The result.
     */
    asPicture(): Picture | undefined {
        if (this._elementKind !== 'pic') {
            return undefined;
        }
        const mutation: {
            hostRoot?: OoxmlElement;
            partName?: string;
            limits?: SecurityLimits;
            onMutate?: () => void;
        } = { limits: this.limits };
        if (this.hostRoot !== undefined) {
            mutation.hostRoot = this.hostRoot;
        }
        if (this.partName !== undefined) {
            mutation.partName = this.partName;
        }
        if (this.onMutate !== undefined) {
            mutation.onMutate = this.onMutate;
        }
        return new Picture(this.element, this.media, mutation);
    }
    /**
     * True when this shape carries a direct `p:ph` under `nvPr`.
     *
     * @remarks Detection only — does not resolve layout/master inheritance (TASK-1014). Citation: Transitional `pml.xsd`
     * `CT_ApplicationNonVisualDrawingProps`.
     * @returns {boolean} The result.
     */
    get isPlaceholder(): boolean {
        return this.placeholder !== undefined;
    }
    /**
     * Direct placeholder metadata from this shape's `p:ph`, with XSD defaults.
     *
     * @remarks Omitted `@type` defaults to `obj`; omitted `@idx` defaults to `0` (`CT_Placeholder`). Returns `undefined` when the shape is
     * not a placeholder. Unknown children under `p:ph` remain on the live DOM for preserve.
     * @returns {PlaceholderInfo | undefined} The result.
     */
    get placeholder(): PlaceholderInfo | undefined {
        return readPlaceholderInfo(this.element, this._elementKind, this._id);
    }
    /**
     * Direct text body when this shape has a `txBody`; otherwise `undefined`.
     *
     * @remarks Presence does not imply editable runs — empty bodies may still yield a body with no paragraphs. Use {@link
     * Shape.requireTextBody} when a body is mandatory.
     * @returns {TextBody | undefined} The result.
     */
    get textBody(): TextBody | undefined {
        const txBody: OoxmlElement = findTxBody(this.element, PML_NS);
        if (txBody === undefined) {
            return undefined;
        }
        return new TextBody(txBody, this.limits, this.partName, this.onMutate, this.media);
    }
    /**
     * Alias of {@link Shape.textBody} (Syncfusion Presentation-style name).
     *
     * @remarks Same binding rules as `textBody` — present only when the shape has a `txBody`.
     * @returns {TextBody | undefined} The result.
     */
    get textFrame(): TextBody | undefined {
        return this.textBody;
    }
    /**
     * Direct fill under `spPr` (`EG_FillProperties`), or `missing` when absent.
     *
     * @remarks **Missing** (no fill child) is distinct from explicit `a:noFill`. Style matrix `fillRef` is **not** reported here — use
     * {@link Shape.styleRefs}. Classification does not fetch blip targets or collapse scheme colours to RGB. Citation: Transitional
     * `dml-main.xsd` `EG_FillProperties`.
     * @returns {DirectFill} The result.
     */
    get fill(): DirectFill {
        return readDirectFill(this.element);
    }
    /**
     * Replaces outline paint on a shape, connector or picture without changing its body fill.
     *
     * @param {GradientFillOptions} options - Validated gradient replacement.
     * @returns {void} Preserves width, dash, joins, markers, effects and unknown XML.
     * @throws Invalid gradient or unsupported/malformed outline host.
     */
    setOutlineGradientFill(options: GradientFillOptions): void {
        const ns: string = outlineNamespace(this.element, this.partName);
        const fill: OoxmlElement = buildGradientFill(options, ns, this.partName);
        if (commitOutlineFill(this.element, fill, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Resets the direct outline fill while retaining other line properties.
     *
     * @returns {void} Missing fill is a no-op.
     */
    clearOutlineFill(): void {
        if (commitOutlineFill(this.element, undefined, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Opens a selective stop session on the existing direct outline gradient.
     *
     * @returns {GradientStopEditor} Stale-checked session; dispose after use.
     * @throws Missing direct gradient or unsupported outline host.
     */
    editOutlineGradientFill(): GradientStopEditor {
        const ns: string = outlineNamespace(this.element, this.partName);
        return new GradientStopEditor((): OoxmlElement | undefined => {
            const properties: OoxmlElement | undefined = findShapeSpPr(this.element);
            const line: OoxmlElement | undefined = properties === undefined ? undefined : findChild(properties, ns, 'ln');
            return line === undefined ? undefined : findChild(line, ns, 'gradFill');
        }, this.partName, (): void => { if (this.onMutate) { this.onMutate(); } });
    }
    /**
     * Replaces the direct shape fill with a validated gradient, preserving theme references.
     *
     * @remarks Shapes, connectors and groups are supported. Missing required spPr is rejected.
     * Validation completes before mutation; positions are ratios and angles are degrees.
     * Successful explicit fill setters disable useBgFill so the new fill takes effect.
     * @param {GradientFillOptions} options - Complete replacement input, at least two stops.
     * @returns {void} Mutates the live shape after successful validation.
     * @throws Invalid target or property, with part/property identity.
     * @example
     * shape.setGradientFill({ stops: [
     *   { position: 0, color: { kind: 'scheme', val: 'accent1' } },
     *   { position: 1, color: { kind: 'srgb', val: 'FFFFFF' } }
     * ], shade: { kind: 'linear', angle: 45 } });
     */
    setGradientFill(options: GradientFillOptions): void {
        const ns: string = shapeFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = buildGradientFill(options, ns, this.partName);
        if (commitShapeFill(this.element, this.partName, fill) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Opens a selective stop editor for this shape's existing direct gradient.
     *
     * @remarks Inherited/background fills require an explicit local override first.
     * Session IDs are temporary and never serialized. Replacing the fill invalidates the session.
     * @returns {GradientStopEditor} Bound stop-editing session; dispose after use.
     * @throws Missing direct gradient, unsupported host or useBgFill enabled.
     */
    editGradientFill(): GradientStopEditor {
        const ns: string = shapeFillNamespace(this.element, this.partName);
        if (this.useBgFill) { throw new GradientFillError(this.partName, 'fill.stops.useBgFill'); }
        return new GradientStopEditor((): OoxmlElement | undefined => {
            const properties: OoxmlElement | undefined = findShapeSpPr(this.element);
            return properties === undefined || this.useBgFill ? undefined : findChild(properties, ns, 'gradFill');
        }, this.partName, (): void => { if (this.onMutate) { this.onMutate(); } });
    }

    /**
     * Replaces the direct fill with a validated authored color choice.
     *
     * @param {ColorValue} color - Theme references remain references.
     * @returns {void} Mutates after successful validation.
     * @throws Invalid target or color property.
     */
    setSolidFill(color: ColorValue): void {
        const ns: string = shapeFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = buildSolidFill(color, ns, this.partName);
        if (commitShapeFill(this.element, this.partName, fill) && this.onMutate) { this.onMutate(); }
    }
    /**
     * References the enclosing group paint without copying its colors or geometry.
     *
     * @returns {void} Mutates the supported live fill host after validation.
     * @throws Unsupported or malformed target.
     */
    setGroupFill(): void {
        const ns: string = shapeFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'grpFill', attributes: [], children: [], prefixHint: 'a' };
        if (commitShapeFill(this.element, this.partName, fill) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Writes explicit noFill, suppressing inherited paint.
     *
     * @returns {void} Mutates a supported fill host.
     */
    setNoFill(): void {
        const ns: string = shapeFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'noFill', attributes: [], children: [], prefixHint: 'a' };
        if (commitShapeFill(this.element, this.partName, fill) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Removes only the direct fill choice to restore inheritance. A missing fill is a no-op.
     *
     * @returns {void} Mutates only when a direct fill was present.
     * @throws Unsupported or malformed target.
     */
    clearFill(): void {
        if (commitShapeFill(this.element, this.partName, undefined) && this.onMutate) { this.onMutate(); }
    }

    /**
     * Direct `a:ln` under `spPr` when present; `present: false` when absent.
     *
     * @remarks Unmodeled line children remain on the live DOM. Line fill follows `EG_LineFillProperties` (no blipFill/grpFill). Citation:
     * Transitional `dml-main.xsd` `CT_LineProperties`.
     * @returns {DirectLine} The result.
     */
    get line(): DirectLine {
        return readDirectLine(this.element);
    }
    /**
     * Direct shape transform from `a:xfrm` without placeholder inheritance.
     *
     * @remarks Rotation is exposed in degrees; offsets/extents remain EMUs. Missing
     * attributes remain absent so this direct view cannot be confused with a resolved transform.
     * @returns {DirectTransform | undefined} Authored sparse transform.
     */
    get transform(): DirectTransform | undefined {
        return readShapeXfrm(this.element);
    }
    /**
     * Optional `p:style` / `CT_ShapeStyle` matrix references (`lnRef`, `fillRef`, …).
     *
     * @remarks Returns `undefined` when the shape has no `style` element. References keep matrix `idx` + optional colour choice; they must
     * not be flattened to solid RGB on save. Citation: Transitional `dml-main.xsd` `CT_ShapeStyle`.
     * @returns {ShapeStyleRefs | undefined} The result.
     */
    get styleRefs(): ShapeStyleRefs | undefined {
        return readShapeStyleRefs(this.element);
    }
    /**
     * `CT_Shape/@useBgFill` (`xsd:boolean`, default false).
     *
     * @remarks Citation: Transitional `pml.xsd` `CT_Shape`.
     * @returns {boolean} The result.
     */
    get useBgFill(): boolean {
        return readUseBgFill(this.element);
    }
    /**
     * Samples the owning page background without replacing this shape's stored fill.
     *
     * @remarks Only native PresentationML shapes own this flag. Explicit fill setters
     * disable sampling; setting false restores the preserved owned fill. Undefined
     * removes the direct flag. IDs, geometry, effects and raw color choices stay intact.
     * @param {boolean | undefined} value - On/off, or undefined to clear the authored flag.
     * @returns {void} Notifies once after a validated native attribute change.
     * @throws {GradientFillError} Invalid boolean, malformed or unsupported host.
     */
    setUseBackgroundFill(value: boolean | undefined): void {
        if (writeUseBackgroundFill(this.element, this.partName, value) && this.onMutate) { this.onMutate(); }
    }
    /**
     * View-only effective fill: direct `spPr` fill wins; else `style/fillRef` as a ref.
     *
     * @remarks Does **not** expand theme `fmtScheme` into solid RGB, and must never be written back in place of scheme or style markup.
     * Inheritance from layout/master placeholder fills is not applied here. Citation: conceptual order in
     * `docs/specs/011-fill-line-preserve.md`.
     * @returns {ResolvedFill} The result.
     */
    resolveFill(): ResolvedFill {
        return resolveFillView(this.element);
    }
    /**
     * Optional connector end attachments (`a:stCxn` / `a:endCxn`) when {@link Shape.kind}
     * is `cxnSp`.
     *
     * @remarks **Read-only.** Does not retarget ends, create connectors, or mutate markup. Path: `p:nvCxnSpPr` → `p:cNvCxnSpPr` → `a:stCxn`
     * / `a:endCxn` (`@id`, `@idx`). Citation: Transitional `pml.xsd` `CT_Connector` / `CT_ConnectorNonVisual`; `dml-main.xsd`
     * `CT_NonVisualConnectorProperties`, `CT_Connection`.
     * @returns {ConnectorEnds} Start and/or end when both required attributes are present; empty object
     */
    readConnectorEnds(): ConnectorEnds {
        return readConnectorEndsFromElement(this.element, this._elementKind === 'cxnSp');
    }
    /**
     * Geometry choice under `spPr` (`EG_Geometry`): preset, custom, or none.
     *
     * @remarks Read-only classification. Does not expand path points or rewrite `custGeom` to `prstGeom`. When both geometry children
     * appear (invalid), returns `custom` so freeform markup is not mislabeled as preset. Citation: Transitional `dml-main.xsd`
     * `EG_Geometry`, `CT_CustomGeometry2D`, `CT_PresetGeometry2D`.
     * @returns {GeometryKind} The result.
     */
    readGeometryKind(): GeometryKind {
        return readGeometryKindFromElement(this.element);
    }
    /**
     * Direct preset/custom geometry choice with authored preset adjustment guides.
     *
     * @remarks This is not an evaluated path and is never written back as a
     * replacement for the preserved geometry XML.
     * @returns {DirectGeometry} Authored geometry data.
     */
    get geometry(): DirectGeometry {
        return readDirectGeometryFromElement(this.element);
    }
    /**
     * Returns the text body or throws when the shape has no `txBody`.
     *
     * @throws {ShapeTextError} When no text body is present.
     * @returns {TextBody} The result.
     */
    requireTextBody(): TextBody {
        const frame: TextBody = this.textBody;
        if (frame === undefined) {
            throw new ShapeTextError(`Shape id "${this._id}" has no text body (txBody); cannot edit text`, partNameOptions(this.partName));
        }
        return frame;
    }
    /**
     * Single-statement quick path: append a run to the last paragraph of this
     * shape's text body and apply run-font options (API-RULES R1.5 / R2.5
     * R2.6 / R5.6).
     *
     * @remarks Composes on top of the Phase-1 object model (R1.5 — one name per concept per granularity): it appends a `new TextPart(text)`
     * to the **last existing paragraph** of `textBody.paragraphs` via the `TextPartCollection.add` path, then applies each `options` key
     * onto that run's {@link Font} direct surface. It does not duplicate the L2 object-model path at the same granularity. Behaviour per
     * R5.6: - Calling `addText` on a shape whose text body has **no paragraphs** creates the first paragraph automatically (via
     * `TextBody.addParagraph`). - A second `addText` call appends a run to the **existing last paragraph**, not a new one. To start a new
     * paragraph, add a {@link Paragraph} to `textBody.paragraphs` explicitly (the L2 path). `addText` operates on the existing text body of
     * an arbitrary shape; it is distinct from the chart-add-text-box `addTextBox` path (which creates a new shape). No `textAlign` option —
     * that is a paragraph property (TASK-1080).
     * @throws {ShapeTextError} When the shape has no `txBody` (`model/missing-text-body`).
     * @throws {Error} When `text` exceeds `SecurityLimits.textNodeLengthBytes` (delegated to the collection `add` →
     * `Paragraph.addTextPartNode` / `TextPart` construction).
     * @throws {ShapeTextError} When `options.fontSize` is outside the schema range, `options.color` is not six hex digits,
         or `options.underline` is not a `TextUnderlineType` token (delegated to the corresponding `Font` setters). Citation: `dml-main.xsd` `CT_TextBody` / `CT_TextParagraph` / `CT_RegularTextRun` / `CT_TextCharacterProperties`.
     * @example ```ts const shape = slide.shapes.addTextBox(); shape.addText('Hello', { bold: true, color: '#FF0000' }); shape.addText('
     * world'); // appends to the same paragraph ```
     * @param {string} text - `a:t` character content for the new run.
     * @param {AddTextOptions} options - Optional run-font properties (see {@link AddTextOptions}).
     * @returns {Paragraph} The {@link Paragraph} the run was appended to; the run is reachable
     */
    addText(text: string, options?: AddTextOptions): Paragraph {
        const body: TextBody = this.requireTextBody();
        const paragraphs: ParagraphCollection = body.paragraphs;
        let paragraph: Paragraph = paragraphs[paragraphs.length - 1];
        if (paragraph === undefined) {
            // No paragraphs yet — create the first one automatically (R5.6).
            paragraph = body.addParagraph();
        }
        const run: TextPart = paragraph.textParts.add(new TextPart(text));
        if (options !== undefined) {
            applyAddTextOptions(run, options);
        }
        // Return the re-walked last paragraph handle so the caller reaches the run
        // through paragraph.textParts (R2.5). `paragraph` holds the live handle.
        return paragraph;
    }
    /**
     * Notifies an attached optional adapter after a validated live DOM commit.
     *
     * @returns {void} Invokes the owning mutation hook when present.
     * @internal
     */
    notifyAdapterMutation(): void {
        if (this.onMutate) { this.onMutate(); }
    }

    /**
     * Captured enclosing group containers for internal ownership resolution.
     *
     * @remarks Outermost first, including the spTree container; never mutate this path.
     * @internal
     * @returns {ReadonlyArray<OoxmlElement>} Existing bounded ancestor path.
     */
    getGroupAncestors(): ReadonlyArray<OoxmlElement> {
        return this.groupAncestors;
    }
    /**
     * Live shape source for internal readers.
     *
     * @returns {OoxmlElement} Existing authored shape element.
     * @internal
     */
    getElement(): OoxmlElement {
        return this.element;
    }
    /**
     * Shape-tree node for walk identity (hyperlinks, remove, id). Table handles
     * keep {@link Shape.getElement} as `a:tbl` for the historic binder; after
     * {@link Shape.adopt} the frame lives here instead.
     *
     * @internal
     */
    getHostElement(): OoxmlElement {
        return this.element;
    } 
    /**
     * Limits captured at construction. Visible to shape subclasses (tables).
     *
     * @internal
     */
    protected get boundLimits(): SecurityLimits {
        return this.limits;
    }
    /**
     * Part name captured at construction. Visible to shape subclasses (tables).
     *
     * @internal
     */
    protected get boundPartName(): string | undefined {
        return this.partName;
    } 
    /**
     * Security limits bound when this shape was walked (optional feature modules).
     *
     * @internal
     * @returns {SecurityLimits} The result.
     */
    getSecurityLimits(): SecurityLimits {
        return this.limits;
    }
    /**
     * Host part name for diagnostics and text-limit errors.
     *
     * @internal
     * @returns {string | undefined} The result.
     */
    getPartName(): string | undefined {
        return this.partName;
    }
    /**
     * Slide root bound when this shape was walked.
     *
     * @internal
     * @returns {OoxmlElement | undefined} The result.
     */
    getHostRoot(): OoxmlElement | undefined {
        return this.hostRoot;
    }
    /**
     * Sets or replaces the click hyperlink (`a:hlinkClick` on `cNvPr`).
     *
     * @remarks `'1'`, `'2'`, … are 1-based slide indexes (`ppaction://hlinksldjump`). A `mailto:` or other scheme is an external URL. Any other string is a file target (`TargetMode=External`). Hover markup is left in place. Citation: Transitional `dml-main.xsd` `CT_Hyperlink`; [MS-OI29500] `ppaction://hlinksldjump`.
     * @param target - Slide index, URL, mailto, or file name.
     * @returns {HyperlinkView} The click hyperlink just written.
     */
    setHyperlink(target: string): HyperlinkView {
        return setShapeHyperlink(this, target);
    }
    /**
     * Click hyperlink view, or `undefined` when `a:hlinkClick` is absent.
     *
     * @remarks `action`, `url`, and `targetSlide` are getter-only. `screenTip` maps to `@tooltip`.
     * @returns {HyperlinkView | undefined} The result.
     */
    get hyperlink(): HyperlinkView | undefined {
        return readShapeHyperlinkView(this);
    }
    /**
     * Removes the click hyperlink. No-op when absent. Does not remove hover markup or renumber `cNvPr/@id`.
     *
     * @returns {void} Nothing.
     */
    removeHyperlink(): void {
        removeShapeHyperlink(this);
    }
}
/**
 *
 * @param {OoxmlElement} element - The element value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {ShapeType} The result.
 */
function resolveShapeType(element: OoxmlElement, elementKind: ShapeElementKind): ShapeType {
    if (elementKind === 'sp') {
        const detectedSp: ShapeType = detectGraphicKind(undefined, element);
        return detectedSp != null ? detectedSp : 'shape';
    }
    if (elementKind === 'cxnSp' || elementKind === 'contentPart' || elementKind === 'grpSp') {
        return 'shape';
    }
    if (elementKind === 'pic') {
        const detected: ShapeType = detectGraphicKind(undefined, element);
        return detected != null ? detected : 'picture';
    }
    const graphic: OoxmlElement = findChild(element, DML_NS, 'graphic');
    const graphicData: OoxmlElement = graphic != null
        ? graphic.children.find((child: OoxmlElement | OoxmlText): child is OoxmlElement => child.kind === 'element' &&
            child.localName === 'graphicData')
        : undefined;
    let uri: string | undefined;
    if (graphicData != null) {
        const uriAttr: OoxmlAttribute = graphicData.attributes.find((attribute: OoxmlAttribute) => attribute.namespaceUri === '' &&
            attribute.localName === 'uri');
        uri = uriAttr != null ? uriAttr.value : undefined;
    }
    if (uri === DRAWINGML_TABLE_URI) {
        return 'table';
    }
    const detected: ShapeType = detectGraphicKind(uri, element);
    return detected != null ? detected : 'unknown';
}
/**
 * Applies {@link AddTextOptions} keys onto a run's {@link Font} direct surface.
 *
 * Only keys that are present (`!== undefined`) are written so an omitted
 * option never clobbers an existing `Font` value or invents an attribute.
 *
 * @internal
 * @param {TextPart} run - The run value.
 * @param {AddTextOptions} options - The options value.
 * @returns {void} Nothing.
 */
function applyAddTextOptions(run: TextPart, options: AddTextOptions): void {
    const font: Font = run.font;
    if (options.fontName !== undefined) {
        font.fontName = options.fontName;
    }
    if (options.fontSize !== undefined) {
        font.fontSize = options.fontSize;
    }
    if (options.bold !== undefined) {
        font.bold = options.bold;
    }
    if (options.italic !== undefined) {
        font.italic = options.italic;
    }
    if (options.color !== undefined) {
        font.color = options.color;
    }
    if (options.underline !== undefined) {
        font.underline = options.underline;
    }

}
/**
 * `p:pic` on `slide.shapes`. Extends {@link Shape}. The public picture cast is
 * {@link Picture}: this class's prototype chain includes `Picture`, so
 * `slide.shapes[n] as Picture` and `instanceof Picture` succeed, and
 * {@link Picture.replaceImageData} runs on this instance. `asPicture()` returns
 * `this`. A table or auto-shape is not a `Picture`.
 *
 * @public
 */
export class PictureShape extends Shape {
    /**
     * Replaces the embedded image. Same write as {@link Picture.replaceImageData}.
     *
     * @param options - New image octets. Content type is inferred from magic bytes.
     * @returns {void} Nothing.
     */
    replaceImageData(options: ReplaceImageDataOptions): void {
        const picture: Picture | undefined = this.asPicture();
        if (picture === undefined) {
            return;
        }
        picture.replaceImageData(options);
    }
    /**
     * Embedded image octets, or `undefined` when there is no `r:embed`.
     *
     * @returns {Uint8Array | undefined} A copy of the media part.
     */
    readEmbeddedBytes(): Uint8Array | undefined {
        const picture: Picture | undefined = this.asPicture();
        if (picture === undefined) {
            return undefined;
        }
        return picture.readEmbeddedBytes();
    }
}   

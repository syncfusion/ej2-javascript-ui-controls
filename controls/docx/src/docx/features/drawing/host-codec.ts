/**
 * Drawing shape host encode helpers (`wp:inline` / `wp:anchor` + `wps:wsp`).
 *
 * Schema cites:
 * - ECMA-376-1 §20.4 `CT_Inline` / `CT_Anchor`, `wp:docPr` (`CT_NonVisualDrawingProps`)
 * - DrawingML `a:graphic` / `a:graphicData`, `a:prstGeom` (`ST_ShapeType`)
 * - [MS-ODRAWXML] wordprocessingShape (`wps:wsp`)
 * - ECMA-376-3 Markup Compatibility AlternateContent Choice/Fallback
 * - ECMA-376-4 VML `w:pict` / `v:shape` Fallback (Policy B dual AC; TASK-8050)
 * - VML main XSD: AG_Fill (`filled`/`fillcolor`), AG_ShapeAttributes
 *   (`stroked`/`strokecolor`/`strokeweight`), AG_StrokeAttributes / `v:stroke`,
 *   CT_Textbox (`@inset`, optional `w:txbxContent`)
 * - `vml-wordprocessingDrawing.xsd`: `w10:wrap` (`ST_WrapType`), `w10:anchorlock`
 * - ShapeRequirements Fallback samples: style tokens, `v:stroke` joinstyle miter,
 *   DML `a:tailEnd type="triangle"` → VML `endarrow="block"`
 *
 * Anchor defaults mirror images host-codec (distL/R 114300, relativeHeight
 * 251658240, layoutInCell 1, allowOverlap 1, positionH column 0, positionV
 * paragraph 0, wrapNone).
 *
 * @packageDocumentation
 */
import { BodyBlockParseContext } from '../../core/registry/block-handlers';
import { parseBodyBlocks, serializeBodyBlocks } from '../document/body-blocks';
import { BlockContent } from '../document/paragraph';
import { Emus, emuToPoint, emus } from '../document/length';
import { isWml, WML, wmlElement } from '../document/wml';
import { MARKUP_COMPATIBILITY_NAMESPACE } from '../../core/mc/index';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { HorizontalAlignment, HorizontalOrigin, TextWrappingStyle, TextWrappingType, VerticalAlignment, VerticalOrigin, isHorizontalAlignmentWire, isVerticalAlignmentWire, isHorizontalOrigin, isVerticalOrigin, isTextWrappingTypeWire, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, TextWrappingStyle as TextWrappingStyleType, TextWrappingType as TextWrappingTypeType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from '../images/layout-types';
import { buildFillElement, buildLineElement, findSpPrElement, LineCap, LineEndSize, LineEndType, LineDashing } from './sp-pr';
import { NamespaceDeclaration } from '../../core/xml/model';
/**
 * @private
 */
export const WP_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
/**
 * @private
 */
export const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
/**
 * @private
 */
export const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/**
 * @private
 */
export const WPS_NS: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape';
/**
 * @private
 */
export const WPG_NS: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup';
/**
 * @private
 */
export const WPC_NS: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas';
/**
 * @private
 */
export const VML_NS: string = 'urn:schemas-microsoft-com:vml';
/**
 * Word VML extensions namespace (`vml-wordprocessingDrawing.xsd` targetNamespace).
 * Used for `w10:wrap` / `w10:anchorlock` on authored Fallback shapes.
 *
 * @private
 */
export const W10_NS: string = 'urn:schemas-microsoft-com:office:word';
/**
 * @private
 */
export const MC_NS: string = MARKUP_COMPATIBILITY_NAMESPACE;
/** 914400 EMU = 1 inch; 12700 EMU = 1 pt. */
const EMU_PER_POINT: number = 12700;
/**
 * ST_Angle: 60000ths of a degree (ECMA-376 DrawingML `dml-main` CT_Transform2D).
 * Same unit as images host-codec; local copy avoids drawing→images encode coupling.
 *
 * @private
 */
export const ROTATION_UNITS_PER_DEGREE: number = 60000;
/**
 * @private
 */
export type DrawingHostPlacement = 'inline' | 'anchor';
/**
 * @private
 * Author / rebuild input for dual AC shape host. */
export interface EncodeDrawingShapeInput {
    readonly placement: DrawingHostPlacement;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly presetGeometry: string;
    readonly docPrId: number;
    readonly name: string;
    readonly title: string | undefined;
    readonly description: string | undefined;
    /** Clockwise degrees; wire `a:xfrm/@rot` = round(deg × 60000). Default 0. */
    readonly rotation?: number;
    /** `a:xfrm/@flipH`. Default false. */
    readonly flipHorizontal?: boolean;
    /** `a:xfrm/@flipV`. Default false. */
    readonly flipVertical?: boolean;
    /**
     * `a:graphicFrameLocks/@noChangeAspect`.
     * Author default true (images parity); omit locks attr when false.
     */
    readonly lockAspectRatio?: boolean;
    /**
     * Text wrapping style. `inline` forces `wp:inline`; other values force `wp:anchor`
     * with the matching wrap child. Default: `inline` when placement is inline, else `none`.
     */
    readonly wrapping?: TextWrappingStyleType;
    /** `wp:wrapSquare|wrapTight|wrapThrough/@wrapText`. Default bothSides. */
    readonly wrapType?: TextWrappingTypeType;
    /** `wp:inline|wp:anchor/@distT` EMU. Inline author default 0; anchor default 0. */
    readonly distanceTopEmu?: Emus;
    /** `wp:inline|wp:anchor/@distB` EMU. */
    readonly distanceBottomEmu?: Emus;
    /** `wp:inline|wp:anchor/@distL` EMU. Inline default 0; anchor default 114300. */
    readonly distanceLeftEmu?: Emus;
    /** `wp:inline|wp:anchor/@distR` EMU. Inline default 0; anchor default 114300. */
    readonly distanceRightEmu?: Emus;
    /**
     * `wp:anchor/@behindDoc` (0/1). Ignored for inline hosts.
     * Author default false.
     */
    readonly behindDocument?: boolean;
    /**
     * `wp:positionH/@relativeFrom` (`ST_RelFromH`). When undefined, the encoder
     * falls back to the residual `@relativeFrom`, then `'column'` (images parity).
     */
    readonly horizontalOrigin?: HorizontalOriginType;
    /**
     * `wp:positionV/@relativeFrom` (`ST_RelFromV`). Fallback: residual, then
     * `'paragraph'` (images parity).
     */
    readonly verticalOrigin?: VerticalOriginType;
    /**
     * `wp:positionH/wp:posOffset` EMU text. When undefined, the encoder emits the
     * residual offset, else offset `0` unless {@link horizontalAlignment} is set.
     * Negative values are schema-legal (`ST_PositionOffset` = xsd:int).
     */
    readonly horizontalPositionEmu?: Emus;
    /** `wp:positionV/wp:posOffset` EMU (fallback: residual, then `0`). */
    readonly verticalPositionEmu?: Emus;
    /**
     * `wp:positionH/wp:align` (`ST_AlignH`). XOR with posOffset per `CT_PosH`.
     */
    readonly horizontalAlignment?: HorizontalAlignmentType;
    /**
     * `wp:positionV/wp:align` (`ST_AlignV`). XOR with posOffset per `CT_PosV`.
     */
    readonly verticalAlignment?: VerticalAlignmentType;
    /**
     * `wp:anchor/@locked` (anchor position frozen for editing apps). Ignored for
     * inline hosts. Author default false.
     */
    readonly lockAnchor?: boolean;
    /** `wp:anchor/@allowOverlap`. Author default true. */
    readonly allowOverlap?: boolean;
    /** `wp:anchor/@layoutInCell`. Author default true. */
    readonly layoutInCell?: boolean;
    /**
     * Explicit horizontal position mode override. When true, `wp:positionH` is
     * rebuilt from {@link horizontalOrigin}/`posOffset`/`align` fields; when
     * false/undefined the residual position is preserved when available.
     * @private
     */
    readonly horizontalModeled?: boolean;
    /**
     * See {@link EncodeDrawingShapeInput.horizontalModeled}.
     * @private
     */
    readonly verticalModeled?: boolean;
    /**
     * Fill MVP for authored/rebuilt spPr: solid sRGB or none. When undefined and
     * a residual spPr fill exists, the residual fill element is preserved.
     * @private
     */
    readonly fill?: {
        readonly kind: 'solid';
        readonly srgb: string;
        /** DrawingML `a:alpha/@val` (0…100000). Omitted = opaque. */
        readonly alpha?: number | undefined;
    } | {
        readonly kind: 'none';
    };
    /**
     * Line MVP for authored/rebuilt spPr. When undefined and a residual `a:ln`
     * exists, the residual line element is preserved.
     * @private
     */
    readonly line?: {
        readonly kind: 'solid';
        readonly widthEmu?: Emus | undefined;
        readonly srgb: string;
        readonly dash?: LineDashing | undefined;
        readonly cap?: LineCap | undefined;
        readonly beginArrowType?: LineEndType | undefined;
        readonly beginArrowSize?: LineEndSize | undefined;
        readonly endArrowType?: LineEndType | undefined;
        readonly endArrowSize?: LineEndSize | undefined;
    } | {
        readonly kind: 'none';
        readonly widthEmu?: Emus | undefined;
        readonly cap?: LineCap | undefined;
    };
    /**
     * Original drawing residual for preserving wrap / position / host attrs when
     * rebuild does not dirty modeled layout.
     */
    readonly preservedHost?: OpenXmlElement;
    /**
     * When true, rebuild wrap (and modeled distances / behindDoc) from input fields.
     * When false and preservedHost has a matching anchor, reuse residual wrap child.
     */
    readonly layoutDirty?: boolean;
    /**
     * Serialize a text box variant: emit `wps:txbx` (with `w:txbxContent`
     * children) and `wps:bodyPr` on `wps:wsp` (TASK-8049).
     *
     * `CT_WordprocessingShape` order: cNvPr? → cNvSpPr/cNvCnPr → spPr → style? →
     * extLst? → (txbx | linkedTxbx)? → bodyPr (minOccurs 1).
     * When undefined and the preserved host has a residual `wps:txbx`, the
     * residual txbx is cloned verbatim (body preserved, content not rebuilt).
     * @private
     */
    readonly txbxContent?: ReadonlyArray<OpenXmlElement> | undefined;
    /**
     * Modeled `wps:bodyPr` (`CT_TextBodyProperties` — TASK-8049). Always emitted
     * (schema minOccurs=1) on the authored/rebuilt wsp; empty element when no
     * field is modeled.
     */
    readonly bodyPr?: OpenXmlElement | undefined;
    /**
     * Nested child elements under top-level `wpg:wgp` (TASK-8051). When defined,
     * {@link buildGraphic} emits `a:graphicData @uri=WPG` + `wpg:wgp` instead of
     * a leaf `wps:wsp`. Empty array authors an empty group.
     * @private
     */
    readonly groupChildElements?: ReadonlyArray<OpenXmlElement> | undefined;
}
/**
 * Author / rebuild input for dual AC wordprocessing group host (TASK-8051).
 * Identity lives on `wp:docPr`; children are bare nested `wps:wsp` / `wpg:grpSp`.
 *
 * @private
 */
export interface EncodeGroupInput {
    readonly placement: DrawingHostPlacement;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly docPrId: number;
    readonly name: string;
    readonly title?: string | undefined;
    readonly description?: string | undefined;
    readonly rotation?: number | undefined;
    readonly flipHorizontal?: boolean | undefined;
    readonly flipVertical?: boolean | undefined;
    readonly lockAspectRatio?: boolean | undefined;
    readonly wrapping?: TextWrappingStyleType | undefined;
    readonly distanceTopEmu?: Emus | undefined;
    readonly distanceBottomEmu?: Emus | undefined;
    readonly distanceLeftEmu?: Emus | undefined;
    readonly distanceRightEmu?: Emus | undefined;
    readonly behindDocument?: boolean | undefined;
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly verticalOrigin?: VerticalOriginType | undefined;
    readonly horizontalPositionEmu?: Emus | undefined;
    readonly verticalPositionEmu?: Emus | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    readonly lockAnchor?: boolean | undefined;
    readonly allowOverlap?: boolean | undefined;
    readonly layoutInCell?: boolean | undefined;
    readonly horizontalModeled?: boolean | undefined;
    readonly verticalModeled?: boolean | undefined;
    readonly preservedHost?: OpenXmlElement | undefined;
    readonly layoutDirty?: boolean | undefined;
    /** Nested bare `wps:wsp` / `wpg:grpSp` children (may be empty). */
    readonly children: ReadonlyArray<OpenXmlElement>;
}
/**
 * @private
 * Wrap + distance state read from residual DrawingML host. */
export interface DrawingWrapState {
    readonly placement: DrawingHostPlacement | undefined;
    readonly wrapping: TextWrappingStyleType;
    /**
     * Effective `wrapText` for square/tight/through hosts.
     * Absent attribute → Both; unrecognized token → Unknown; styles without wrapText → Both.
     */
    readonly wrapType: TextWrappingTypeType;
    readonly distanceTopEmu: Emus | undefined;
    readonly distanceBottomEmu: Emus | undefined;
    readonly distanceLeftEmu: Emus | undefined;
    readonly distanceRightEmu: Emus | undefined;
    readonly behindDocument: boolean;
    readonly lockAnchor: boolean;
    readonly allowOverlap: boolean;
    readonly layoutInCell: boolean;
    readonly presetGeometry: string | undefined;
}
/**
 * @private
 * H/V position state read from residual DrawingML host. */
export interface DrawingPositionState {
    readonly horizontalOrigin: HorizontalOriginType | undefined;
    readonly verticalOrigin: VerticalOriginType | undefined;
    readonly horizontalPosition: number | undefined;
    readonly verticalPosition: number | undefined;
    /** EMU form of {@link DrawingPositionState.horizontalPosition}. */
    readonly horizontalPositionEmu: Emus | undefined;
    /** EMU form of {@link DrawingPositionState.verticalPosition}. */
    readonly verticalPositionEmu: Emus | undefined;
    readonly horizontalAlignment: HorizontalAlignmentType | undefined;
    readonly verticalAlignment: VerticalAlignmentType | undefined;
}
/**
 * @private
 * Identity fields patched onto residual `wp:docPr`. */
export interface DrawingDocPrIdentity {
    readonly name: string | undefined;
    readonly title: string | undefined;
    readonly description: string | undefined;
    readonly docPrId: number | undefined;
}
/**
 * @private
 * Layout fields for residual hydrate / layout dirty patch. */
export interface DrawingLayoutState {
    readonly widthEmu: Emus | undefined;
    readonly heightEmu: Emus | undefined;
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
    readonly lockAspectRatio: boolean;
}
/**
 * @private
 * Layout patch payload (identity optional when only structure-adjacent). */
export interface DrawingLayoutPatch extends DrawingDocPrIdentity {
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
    readonly lockAspectRatio: boolean;
}
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function isElement(el: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return el.namespaceUri === namespaceUri && el.localName === localName;
}
/**
 * @param {OpenXmlElement} root - The root.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findFirstElement(root: OpenXmlElement, namespaceUri: string, localName: string): OpenXmlElement | undefined {
    if (isElement(root, namespaceUri, localName)) {
        return root;
    }
    for (const child of elementChildren(root)) {
        const found: OpenXmlElement = findFirstElement(child, namespaceUri, localName);
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
/**
 * @param {OpenXmlElement} el - The el.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 * @private
 */
export function attributeValue(el: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    let ts330: any;
    return (
        (ts330 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName)),
        ts330 == null ? undefined : ts330.value
    );
}
function xmlElement(namespaceUri: string, prefix: string, localName: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
    readonly namespaceDeclarations?: OpenXmlElement['namespaceDeclarations'];
}): OpenXmlElement {
    let ts331: any; let ts332: any; let ts333: any;
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefix,
        attributes: ((ts331 = options == null ? undefined : options.attributes), ts331 != null ? ts331 : []),
        namespaceDeclarations: ((ts332 = options == null ? undefined : options.namespaceDeclarations), ts332 != null ? ts332 : []),
        children: ((ts333 = options == null ? undefined : options.children), ts333 != null ? ts333 : [])
    };
}
function attr(localName: string, value: string, namespaceUri: string = '', prefix: string = ''): OpenXmlAttribute {
    return { namespaceUri, localName, prefix, value };
}
function cloneElement(el: OpenXmlElement): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: el.namespaceUri,
        localName: el.localName,
        prefix: el.prefix,
        attributes: el.attributes.map((a: OpenXmlAttribute) => ({ ...a })),
        namespaceDeclarations: el.namespaceDeclarations.map((n: NamespaceDeclaration) => ({ ...n })),
        children: el.children.map((c: OpenXmlChild): OpenXmlChild => {
            if (c.kind === 'element') {
                return cloneElement(c);
            }
            // OpenXmlChild is element | text only (src/core/xml/model.ts).
            return { kind: 'text', value: c.value };
        })
    };
}
function buildDocPr(input: EncodeDrawingShapeInput): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [
        attr('id', String(input.docPrId)),
        attr('name', input.name)
    ];
    if (input.title !== undefined && input.title.length > 0) {
        attributes.push(attr('title', input.title));
    }
    if (input.description !== undefined && input.description.length > 0) {
        attributes.push(attr('descr', input.description));
    }
    return xmlElement(WP_NS, 'wp', 'docPr', { attributes });
}
function buildEffectExtent(): OpenXmlElement {
    return xmlElement(WP_NS, 'wp', 'effectExtent', {
        attributes: [attr('l', '0'), attr('t', '0'), attr('r', '0'), attr('b', '0')]
    });
}
function buildXfrmAttributes(input: {
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
}): OpenXmlAttribute[] {
    const xfrmAttrs: OpenXmlAttribute[] = [];
    // Omit @rot when 0 — Word/images convention (ST_Angle default).
    if (input.rotation !== 0) {
        xfrmAttrs.push(attr('rot', String(Math.round(input.rotation * ROTATION_UNITS_PER_DEGREE))));
    }
    if (input.flipHorizontal) {
        xfrmAttrs.push(attr('flipH', '1'));
    }
    if (input.flipVertical) {
        xfrmAttrs.push(attr('flipV', '1'));
    }
    return xfrmAttrs;
}
function buildXfrm(input: EncodeDrawingShapeInput): OpenXmlElement {
    const rotation: number = input.rotation != null ? input.rotation : 0;
    const flipHorizontal: boolean = input.flipHorizontal != null ? input.flipHorizontal : false;
    const flipVertical: boolean = input.flipVertical != null ? input.flipVertical : false;
    const off: OpenXmlElement = xmlElement(A_NS, 'a', 'off', {
        attributes: [attr('x', '0'), attr('y', '0')]
    });
    const ext: OpenXmlElement = xmlElement(A_NS, 'a', 'ext', {
        attributes: [attr('cx', String(input.widthEmu)), attr('cy', String(input.heightEmu))]
    });
    return xmlElement(A_NS, 'a', 'xfrm', {
        attributes: buildXfrmAttributes({ rotation, flipHorizontal, flipVertical }),
        children: [off, ext]
    });
}
function buildCNvGraphicFramePr(lockAspectRatio: boolean): OpenXmlElement {
    const lockAttrs: OpenXmlAttribute[] = lockAspectRatio ? [attr('noChangeAspect', '1')] : [];
    return xmlElement(WP_NS, 'wp', 'cNvGraphicFramePr', {
        children: [
            xmlElement(A_NS, 'a', 'graphicFrameLocks', {
                attributes: lockAttrs
            })
        ]
    });
}
/**
 * Build `wps:spPr` children in `CT_ShapeProperties` schema order:
 * `a:xfrm`, `EG_Geometry` (prstGeom + avLst), `EG_FillProperties` (residual
 * preserved when unmodeled), `a:ln` (residual preserved when unmodeled), then
 * residual bag (effects/scene3d/… — GO Q9 residual).
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @param {OpenXmlElement | undefined} preservedSpPr - The preserved sp pr.
 * @returns {OpenXmlElement[]} The result.
 */
function buildSpPrChildren(input: EncodeDrawingShapeInput, preservedSpPr: OpenXmlElement | undefined): OpenXmlElement[] {
    const children: OpenXmlElement[] = [];
    children.push(buildXfrm(input));
    children.push(xmlElement(A_NS, 'a', 'prstGeom', {
        attributes: [attr('prst', input.presetGeometry)],
        children: [xmlElement(A_NS, 'a', 'avLst')]
    }));
    // Fill: modeled MVP wins; otherwise preserve the residual fill element.
    if (input.fill !== undefined) {
        children.push(buildFillElement(input.fill));
    }
    else
    {for (const localName of ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill']) {
        const residualFill: OpenXmlElement = preservedSpPr !== undefined ? findSpPrElement(preservedSpPr, A_NS, localName) : undefined;
        if (residualFill !== undefined) {
            children.push(residualFill);
            break;
        }
    }}
    // Line: modeled MVP wins; otherwise preserve the residual a:ln element.
    if (input.line !== undefined) {
        children.push(buildLineElement(input.line));
    }
    else if (preservedSpPr !== undefined) {
        const residualLn: OpenXmlElement = findSpPrElement(preservedSpPr, A_NS, 'ln');
        if (residualLn !== undefined) {
            children.push(residualLn);
        }
    }
    // Residual bag: everything after geometry known to CT_ShapeProperties that
    // the MVP does not model (effects, scene3d, sp3d, extLst) — GO Q9 deferred.
    const residualTail: OpenXmlElement[] = [];
    if (preservedSpPr !== undefined) {
        const modeledFillNames: Set<string> = new Set([
            'noFill',
            'solidFill',
            'gradFill',
            'blipFill',
            'pattFill',
            'grpFill'
        ]);
        for (const child of elementChildrenOf(preservedSpPr)) {
            if (isElement(child, A_NS, 'xfrm') ||
                isElement(child, A_NS, 'prstGeom') ||
                isElement(child, A_NS, 'custGeom') ||
                (isElement(child, A_NS, 'ln') ||
                    (child.namespaceUri === A_NS && modeledFillNames.has(child.localName)))) {
                continue;
            }
            residualTail.push(child);
        }
    }
    children.push(...residualTail);
    return children;
}
function elementChildrenOf(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function buildWpsShape(input: EncodeDrawingShapeInput): OpenXmlElement {
    let ts334: any;
    const preservedSpPr: OpenXmlElement = findResidualSpPr(input.preservedHost);
    const spPr: OpenXmlElement = xmlElement(WPS_NS, 'wps', 'spPr', {
        children: buildSpPrChildren(input, preservedSpPr)
    });
    // Text box marker (`CT_NonVisualDrawingShapeProps/@txBox`, default false) —
    // Word sets it on text box shapes; detection itself keys off the
    // `wps:txbx` child per [MS-ODRAWXML] §2.13.3.2.
    const hasTxbx: boolean = input.txbxContent !== undefined || residualHasTxbx(input.preservedHost);
    const cNvSpPr: OpenXmlElement = xmlElement(WPS_NS, 'wps', 'cNvSpPr', {
        attributes: hasTxbx ? [attr('txBox', '1')] : []
    });
    // CT_WordprocessingShape order (wordprocessingShape.xsd): cNvSpPr?, spPr,
    // style?, extLst?, (txbx|linkedTxbx)?, bodyPr (minOccurs 1). Preserve
    // residual `wps:style` on structure rebuild so solid fill dirty does not
    // drop theme refs (GO).
    const residualStyle: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'style')
        : undefined;
    const children: OpenXmlElement[] = [cNvSpPr, spPr];
    if (residualStyle !== undefined) {
        children.push(cloneElement(residualStyle));
    }
    // Text box (TASK-8049): modeled txbxContent when provided; residual txbx
    // cloned verbatim when the rebuild did not model the body (structure dirt
    // from layout/wrap mutators must not drop textbox content). linkedTxbx is
    // OOS (GO) — residual clone preserves it; author path never emits it.
    const residualTxbx: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'txbx')
        : undefined;
    const residualLinkedTxbx: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'linkedTxbx')
        : undefined;
    if (input.txbxContent !== undefined) {
        children.push(buildTxbxElement(input.txbxContent));
    }
    else if (residualTxbx !== undefined) {
        children.push(cloneElement(residualTxbx));
    }
    else if (residualLinkedTxbx !== undefined) {
        children.push(cloneElement(residualLinkedTxbx));
    }
    // bodyPr is schema-required (minOccurs 1). Modeled state wins; residual
    // bodyPr is cloned when present; otherwise an empty element is authored
    // (Word convention for a defaulted text body).
    const residualBodyPr: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'bodyPr')
        : undefined;
    children.push(((ts334 = input.bodyPr != null ? input.bodyPr : residualBodyPr), ts334 != null ? ts334 : buildEmptyBodyPr()));
    return xmlElement(WPS_NS, 'wps', 'wsp', {
        namespaceDeclarations: [{ prefix: 'wps', namespaceUri: WPS_NS }],
        children
    });
}
/**
 *  Empty `wps:bodyPr` (schema-required element with all-optional content).
 *
 * @returns {OpenXmlElement} The result.
 */
function buildEmptyBodyPr(): OpenXmlElement {
    return xmlElement(WPS_NS, 'wps', 'bodyPr');
}
/**
 * Locate the residual `wps:spPr` for fill/line preservation on rebuild.
 * Residual hosts nest `wps:spPr` under dual MC / `w:drawing` / `wp:*` /
 * `a:graphic` / `wps:wsp`, so lookup is deep.
 *
 * @param {OpenXmlElement | undefined} preservedHost - The preserved host.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findResidualSpPr(preservedHost: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (preservedHost === undefined) {
        return undefined;
    }
    return findFirstElement(preservedHost, WPS_NS, 'spPr');
}
/**
 * Build `wps:txbx` (`CT_TextboxInfo`) from serialized `w:txbxContent` children.
 *
 * Schema: `CT_TextboxInfo` = sequence `txbxContent` (minOccurs 1) + optional
 * `extLst`; optional `@id` (default 0). `w:txbxContent` is
 * `EG_BlockLevelElts` minOccurs 1 — the body must not be empty (Word authors
 * at least one `w:p`; go6 author minimum matches).
 *
 * Cites:
 * `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/dml-wordprocessingDrawing.xsd`
 * `CT_TxbxContent` / `CT_TextboxInfo`.
 *
 * @param {ReadonlyArray<OpenXmlElement>} contentChildren - The content children.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildTxbxElement(contentChildren: ReadonlyArray<OpenXmlElement>): OpenXmlElement {
    return xmlElement(WPS_NS, 'wps', 'txbx', {
        children: [
            xmlElement(WML, 'w', 'txbxContent', {
                namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML }],
                children: contentChildren
            })
        ]
    });
}
/**
 * Serialize modeled `w:txbxContent` block state into `txbxContent` element
 * children. Modeled paragraphs/tables/SDTs emit their DOM form; residual
 * blocks (opaque XML not owned by a registered feature) pass through verbatim
 * — the library never invents block OOXML it does not model.
 *
 * @param {ReadonlyArray<TxbxBlock>} blocks - The blocks.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
export function serializeTxbxContentBlocks(blocks: ReadonlyArray<TxbxBlock>): OpenXmlElement[] {
    return serializeBodyBlocks(blocks);
}
/**
 * Block model alias for text box content (same core block union).
 * @private
 */
export type TxbxBlock = BlockContent;
/**
 * Parse `w:txbxContent` children into core block state.
 *
 * Uses the same `parseBodyBlocks` path as headers/footers and table cells:
 * `w:p` → modeled `Paragraph`; `w:tbl` → modeled `Table` **only when the
 * tables feature is registered**; `w:sdt` → modeled SDT **only when the
 * content-controls feature is registered**; everything else (and any block
 * whose feature is unregistered) stays residual-opaque — never dropped, never
 * invented (GO Q6; offline policy).
 *
 * @param {OpenXmlElement} txbxContent - The txbx content.
 * @param {BodyBlockParseContext} ctx - The ctx.
 * @returns {TxbxBlock[]} The result.
 * @private
 */
export function parseTxbxContentBlocks(txbxContent: OpenXmlElement, ctx: BodyBlockParseContext): TxbxBlock[] {
    return parseBodyBlocks(txbxContent.children, ctx);
}
/**
 * Whether any `wps:wsp` under the host carries a `wps:txbx` (or `linkedTxbx`)
 * child — deep walk so dual MC Choice branches resolve.
 *
 * @param {OpenXmlElement | undefined} host - The host.
 * @returns {boolean} The result.
 * @private
 */
export function residualHasTxbx(host: OpenXmlElement | undefined): boolean {
    if (host === undefined) {
        return false;
    }
    const wsp: OpenXmlElement = findFirstElement(host, WPS_NS, 'wsp');
    if (wsp === undefined) {
        return false;
    }
    for (const child of elementChildren(wsp)) {
        if (isElement(child, WPS_NS, 'txbx') ||
            isElement(child, WPS_NS, 'linkedTxbx')) {
            return true;
        }
    }
    return false;
}
/**
 * Build top-level `wpg:wgp` group shape for graphicData (TASK-8051).
 *
 * Top-level wgp has no `cNvPr` (identity lives on `wp:docPr`). Nested groups
 * use `wpg:grpSp` with `cNvPr` — authored via residual clone or nested
 * structure paths, not this builder.
 *
 * Cites: [MS-ODRAWXML] §2.16.3.2 CT_WordprocessingGroup —
 * `cNvGrpSpPr?`, `grpSpPr`, then `(wsp|grpSp|graphicFrame|contentPart|spTree)*`.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildWpgGroup(input: EncodeDrawingShapeInput): OpenXmlElement {
    const children: ReadonlyArray<OpenXmlElement> = input.groupChildElements != null ? input.groupChildElements : [];
    const cNvGrpSpPr: OpenXmlElement = xmlElement(WPG_NS, 'wpg', 'cNvGrpSpPr');
    const xfrmChildren: OpenXmlElement[] = [
        xmlElement(A_NS, 'a', 'off', {
            attributes: [attr('x', '0'), attr('y', '0')]
        }),
        xmlElement(A_NS, 'a', 'ext', {
            attributes: [attr('cx', String(input.widthEmu)), attr('cy', String(input.heightEmu))]
        }),
        xmlElement(A_NS, 'a', 'chOff', {
            attributes: [attr('x', '0'), attr('y', '0')]
        }),
        xmlElement(A_NS, 'a', 'chExt', {
            attributes: [attr('cx', String(input.widthEmu)), attr('cy', String(input.heightEmu))]
        })
    ];
    const xfrmAttrs: OpenXmlAttribute[] = [];
    if (input.rotation !== undefined && input.rotation !== 0) {
        // ST_Angle is 60000ths of a degree.
        xfrmAttrs.push(attr('rot', String(Math.round(input.rotation * 60000))));
    }
    if (input.flipHorizontal === true) {
        xfrmAttrs.push(attr('flipH', '1'));
    }
    if (input.flipVertical === true) {
        xfrmAttrs.push(attr('flipV', '1'));
    }
    const xfrm: OpenXmlElement = xmlElement(A_NS, 'a', 'xfrm', {
        attributes: xfrmAttrs,
        children: xfrmChildren
    });
    const grpSpPr: OpenXmlElement = xmlElement(WPG_NS, 'wpg', 'grpSpPr', {
        children: [xfrm]
    });
    return xmlElement(WPG_NS, 'wpg', 'wgp', {
        namespaceDeclarations: [{ prefix: 'wpg', namespaceUri: WPG_NS }],
        children: [cNvGrpSpPr, grpSpPr, ...children]
    });
}
/**
 * Build a nested bare `wps:wsp` for group/canvas children (TASK-8051).
 * Carries `wps:cNvPr` identity after `wps:cNvSpPr` (fixture / Word order used
 * by TASK-8051 tests). No dual AC wrapper — nested children are bare wsp.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildNestedWpsShape(input: EncodeDrawingShapeInput): OpenXmlElement {
    let ts335: any;
    const preservedSpPr: OpenXmlElement = findResidualSpPr(input.preservedHost);
    const spPr: OpenXmlElement = xmlElement(WPS_NS, 'wps', 'spPr', {
        children: buildSpPrChildren(input, preservedSpPr)
    });
    const hasTxbx: boolean = input.txbxContent !== undefined || residualHasTxbx(input.preservedHost);
    const cNvSpPr: OpenXmlElement = xmlElement(WPS_NS, 'wps', 'cNvSpPr', {
        attributes: hasTxbx ? [attr('txBox', '1')] : []
    });
    // Nested identity: wps:cNvPr (id/name/title/descr). Fixture order is
    // cNvSpPr then cNvPr (tests assert ChildA / NestedRect via these attrs).
    const cNvPrAttrs: OpenXmlAttribute[] = [
        attr('id', String(input.docPrId)),
        attr('name', input.name)
    ];
    if (input.title !== undefined && input.title.length > 0) {
        cNvPrAttrs.push(attr('title', input.title));
    }
    if (input.description !== undefined && input.description.length > 0) {
        cNvPrAttrs.push(attr('descr', input.description));
    }
    const cNvPr: OpenXmlElement = xmlElement(WPS_NS, 'wps', 'cNvPr', {
        attributes: cNvPrAttrs
    });
    const residualStyle: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'style')
        : undefined;
    // Match fixture child order: cNvSpPr, cNvPr, spPr, style?, txbx?, bodyPr.
    const children: OpenXmlElement[] = [cNvSpPr, cNvPr, spPr];
    if (residualStyle !== undefined) {
        children.push(cloneElement(residualStyle));
    }
    const residualTxbx: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'txbx')
        : undefined;
    const residualLinkedTxbx: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'linkedTxbx')
        : undefined;
    if (input.txbxContent !== undefined) {
        children.push(buildTxbxElement(input.txbxContent));
    }
    else if (residualTxbx !== undefined) {
        children.push(cloneElement(residualTxbx));
    }
    else if (residualLinkedTxbx !== undefined) {
        children.push(cloneElement(residualLinkedTxbx));
    }
    const residualBodyPr: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WPS_NS, 'bodyPr')
        : undefined;
    children.push(((ts335 = input.bodyPr != null ? input.bodyPr : residualBodyPr), ts335 != null ? ts335 : buildEmptyBodyPr()));
    return xmlElement(WPS_NS, 'wps', 'wsp', {
        namespaceDeclarations: [{ prefix: 'wps', namespaceUri: WPS_NS }],
        children
    });
}
function buildGraphic(input: EncodeDrawingShapeInput): OpenXmlElement {
    if (input.groupChildElements !== undefined) {
        const graphicData: OpenXmlElement = xmlElement(A_NS, 'a', 'graphicData', {
            attributes: [attr('uri', WPG_NS)],
            children: [buildWpgGroup(input)]
        });
        return xmlElement(A_NS, 'a', 'graphic', {
            namespaceDeclarations: [{ prefix: 'a', namespaceUri: A_NS }],
            children: [graphicData]
        });
    }
    const graphicData: OpenXmlElement = xmlElement(A_NS, 'a', 'graphicData', {
        attributes: [attr('uri', WPS_NS)],
        children: [buildWpsShape(input)]
    });
    return xmlElement(A_NS, 'a', 'graphic', {
        namespaceDeclarations: [{ prefix: 'a', namespaceUri: A_NS }],
        children: [graphicData]
    });
}
/**
 * Parse wrapping from residual host placement.
 *
 * @param {OpenXmlElement} host - The host.
 * @param {DrawingHostPlacement} placement - The placement.
 * @returns {TextWrappingStyleType} The result.
 * @private
 */
export function parseDrawingWrapping(host: OpenXmlElement, placement: DrawingHostPlacement): TextWrappingStyleType {
    if (placement === 'inline') {
        return TextWrappingStyle.Inline;
    }
    if (findFirstElement(host, WP_NS, 'wrapNone') !== undefined) {
        return TextWrappingStyle.None;
    }
    if (findFirstElement(host, WP_NS, 'wrapSquare') !== undefined) {
        return TextWrappingStyle.Square;
    }
    if (findFirstElement(host, WP_NS, 'wrapTight') !== undefined) {
        return TextWrappingStyle.Tight;
    }
    if (findFirstElement(host, WP_NS, 'wrapThrough') !== undefined) {
        return TextWrappingStyle.Through;
    }
    if (findFirstElement(host, WP_NS, 'wrapTopAndBottom') !== undefined) {
        return TextWrappingStyle.TopAndBottom;
    }
    return TextWrappingStyle.None;
}
/**
 * Parse `wp:wrapSquare|wrapTight|wrapThrough/@wrapText`.
 * Absent → Both (schema default); wire token → token; other → Unknown.
 *
 * @param {OpenXmlElement | undefined} wrapEl - The wrap el.
 * @returns {TextWrappingTypeType} The result.
 * @private
 */
export function parseWrapTextAttr(wrapEl: OpenXmlElement | undefined): TextWrappingTypeType {
    if (wrapEl === undefined) {
        return TextWrappingType.Both;
    }
    const raw: string = attributeValue(wrapEl, '', 'wrapText');
    if (raw === undefined || raw.trim() === '') {
        return TextWrappingType.Both;
    }
    const token: string = raw.trim();
    if (isTextWrappingTypeWire(token)) {
        return token as TextWrappingTypeType;
    }
    return TextWrappingType.Unknown;
}

/**
 * Whether residual wrap element already carries the modeled wire wrapText (or
 * wrapText is not applicable / unmodeled / Unknown — keep residual as-is).
 *
 * @param {OpenXmlElement} residualWrap - The residual wrap.
 * @param {TextWrappingTypeType | undefined} wrapType - The wrap type.
 * @returns {boolean} The result.
 */
function residualWrapTextMatches(residualWrap: OpenXmlElement, wrapType: TextWrappingTypeType | undefined): boolean {
    if (wrapType === undefined || wrapType === TextWrappingType.Unknown) {
        return true;
    }
    if (!isTextWrappingTypeWire(wrapType)) {
        return true;
    }
    // Styles without @wrapText never carry side type on wire.
    if (residualWrap.localName === 'wrapNone' || residualWrap.localName === 'wrapTopAndBottom') {
        return true;
    }
    const residualType: TextWrappingTypeType = parseWrapTextAttr(residualWrap);
    return residualType === wrapType;
}

/**
 * Rebuild a residual wrap element with a corrected `@wrapText`, preserving
 * children (e.g. wrapPolygon) and non-wrapText attributes.
 *
 * @param {OpenXmlElement} residualWrap - The residual wrap.
 * @param {TextWrappingTypeType} wrapType - The wrap type.
 * @returns {OpenXmlElement} The result.
 */
function rebuildWrapWithWrapText(residualWrap: OpenXmlElement, wrapType: TextWrappingTypeType): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    let sawWrapText: boolean = false;
    for (const a of residualWrap.attributes) {
        if (a.namespaceUri === '' && a.localName === 'wrapText') {
            attributes.push(attr('wrapText', wrapType));
            sawWrapText = true;
        }
        else {
            attributes.push({ ...a });
        }
    }
    if (!sawWrapText) {
        attributes.push(attr('wrapText', wrapType));
    }
    return {
        kind: 'element',
        namespaceUri: residualWrap.namespaceUri,
        localName: residualWrap.localName,
        prefix: residualWrap.prefix,
        attributes,
        namespaceDeclarations: residualWrap.namespaceDeclarations.map((n: NamespaceDeclaration) => ({ ...n })),
        children: residualWrap.children.slice()
    };
}

/**
 * Build wrap element from modeled style.
 * Tight/through require wrapPolygon; without residual polygon, fall back to wrapNone
 * (library does not invent polygons — images parity).
 * When residual matches style but modeled wire wrapType differs, rebuild with
 * corrected wrapText and preserve residual children/attrs.
 *
 * @param {TextWrappingStyleType} wrapping - The wrapping.
 * @param {OpenXmlElement | undefined} residualWrap - The residual wrap.
 * @param {TextWrappingTypeType} wrapType - The wrap type.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildWrapElement(
    wrapping: TextWrappingStyleType,
    residualWrap: OpenXmlElement | undefined,
    wrapType?: TextWrappingTypeType
): OpenXmlElement {
    const residualMatchesStyle: boolean = residualWrap !== undefined &&
        ((wrapping === TextWrappingStyle.Tight && residualWrap.localName === 'wrapTight') ||
            (wrapping === TextWrappingStyle.Through && residualWrap.localName === 'wrapThrough') ||
            (wrapping === TextWrappingStyle.Square && residualWrap.localName === 'wrapSquare') ||
            (wrapping === TextWrappingStyle.None && residualWrap.localName === 'wrapNone') ||
            (wrapping === TextWrappingStyle.TopAndBottom &&
                residualWrap.localName === 'wrapTopAndBottom'));
    if (residualMatchesStyle && residualWrap !== undefined) {
        if (residualWrapTextMatches(residualWrap, wrapType)) {
            return residualWrap;
        }
        // Modeled schema wrapType differs from residual @wrapText — rebuild.
        if (wrapType !== undefined && isTextWrappingTypeWire(wrapType) &&
            (wrapping === TextWrappingStyle.Square ||
                wrapping === TextWrappingStyle.Tight ||
                wrapping === TextWrappingStyle.Through)) {
            return rebuildWrapWithWrapText(residualWrap, wrapType);
        }
        return residualWrap;
    }
    const wireWrapText: TextWrappingType = wrapType !== undefined && isTextWrappingTypeWire(wrapType)
        ? wrapType
        : TextWrappingType.Both;
    switch (wrapping) {
    case TextWrappingStyle.None:
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    case TextWrappingStyle.Square:
        return xmlElement(WP_NS, 'wp', 'wrapSquare', {
            attributes: [attr('wrapText', wireWrapText)]
        });
    case TextWrappingStyle.TopAndBottom:
        return xmlElement(WP_NS, 'wp', 'wrapTopAndBottom');
    case TextWrappingStyle.Tight:
    case TextWrappingStyle.Through:
        // CT_WrapPath requires wrapPolygon; library does not invent vertices.
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    case TextWrappingStyle.Inline:
        // Encode path never places Inline wrap on anchor (coerced earlier).
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    default:
        return xmlElement(WP_NS, 'wp', 'wrapNone');
    }
}
function findResidualWrap(anchor: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (anchor === undefined) {
        return undefined;
    }
    for (const name of [
        'wrapNone',
        'wrapSquare',
        'wrapTight',
        'wrapThrough',
        'wrapTopAndBottom'
    ]) {
        const found: OpenXmlElement = elementChildren(anchor).find((c: OpenXmlElement) => isElement(c, WP_NS, name));
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
/**
 * Locate residual `wp:positionH` / `wp:positionV` children of an anchor.
 *
 * Children are preserved as-is (unknown `@relativeFrom` tokens or extra
 * position children stay byte-identical on rebuild that does not model them).
 *
 * @param {OpenXmlElement | undefined} anchor - The anchor.
 * @returns {Object} The result.
 * @private
 */
export function findResidualPositions(anchor: OpenXmlElement | undefined): {
    readonly positionH: OpenXmlElement | undefined;
    readonly positionV: OpenXmlElement | undefined;
} {
    if (anchor === undefined) {
        return { positionH: undefined, positionV: undefined };
    }
    return {
        positionH: elementChildren(anchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionH')),
        positionV: elementChildren(anchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionV'))
    };
}
function findResidualEffectExtent(host: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (host === undefined) {
        return undefined;
    }
    return elementChildren(host).find((c: OpenXmlElement) => isElement(c, WP_NS, 'effectExtent'));
}
/**
 * Whether the host carries a local-name attribute with numeric (possibly
 * negative) integer content — used to detect residual host attrs without
 * parsing semantics.
 */
/**
 * Build `wp:positionH` for a new anchor when residual position is absent.
 * Images parity default: `relativeFrom="column"` + `posOffset 0`.
 *
 * @returns {OpenXmlElement} The result.
 */
function buildDefaultPositionH(): OpenXmlElement {
    return xmlElement(WP_NS, 'wp', 'positionH', {
        attributes: [attr('relativeFrom', HorizontalOrigin.Column)],
        children: [
            xmlElement(WP_NS, 'wp', 'posOffset', { children: [{ kind: 'text', value: '0' }] })
        ]
    });
}
/**
 * Build `wp:positionV` for a new anchor when residual position is absent.
 * Images parity default: `relativeFrom="paragraph"` + `posOffset 0`.
 *
 * @returns {OpenXmlElement} The result.
 */
function buildDefaultPositionV(): OpenXmlElement {
    return xmlElement(WP_NS, 'wp', 'positionV', {
        attributes: [attr('relativeFrom', VerticalOrigin.Paragraph)],
        children: [
            xmlElement(WP_NS, 'wp', 'posOffset', { children: [{ kind: 'text', value: '0' }] })
        ]
    });
}
/**
 * Build modeled `wp:positionH` (`CT_PosH`).
 *
 * Tokens: `ST_RelFromH` / `ST_AlignH` are imported, not invented (GO Q1 —
 * `src/features/images/layout-types.ts`). Align XOR posOffset follows the
 * `CT_PosH` schema choice. `ST_PositionOffset` is `xsd:int` (negative EMU
 * legal). Default origin `'column'`; offset default `0` (images parity).
 *
 * @param {Object} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildDrawingPositionH(input: {
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly horizontalPositionEmu?: Emus | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
}): OpenXmlElement {
    const origin: string = input.horizontalOrigin !== undefined ? input.horizontalOrigin : HorizontalOrigin.Column;
    let child: OpenXmlElement;
    // Only schema ST_AlignH tokens serialize as wp:align. Model-only None/Unknown use posOffset.
    if (input.horizontalAlignment !== undefined && isHorizontalAlignmentWire(input.horizontalAlignment)) {
        child = xmlElement(WP_NS, 'wp', 'align', {
            children: [{ kind: 'text', value: input.horizontalAlignment }]
        });
    }
    else {
        child = xmlElement(WP_NS, 'wp', 'posOffset', {
            children: [{ kind: 'text', value: String(input.horizontalPositionEmu != null ? input.horizontalPositionEmu : 0) }]
        });
    }
    return xmlElement(WP_NS, 'wp', 'positionH', {
        attributes: [attr('relativeFrom', origin)],
        children: [child]
    });
}
/**
 * Build modeled `wp:positionV` (`CT_PosV`). Default origin `'paragraph'`;
 * offset default `0` (images parity).
 *
 * @param {Object} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildDrawingPositionV(input: {
    readonly verticalOrigin?: VerticalOriginType;
    readonly verticalPositionEmu?: Emus;
    readonly verticalAlignment?: VerticalAlignmentType;
}): OpenXmlElement {
    const origin: string = input.verticalOrigin !== undefined ? input.verticalOrigin : VerticalOrigin.Paragraph;
    let child: OpenXmlElement;
    // Only schema ST_AlignV tokens serialize as wp:align. Model-only None/Unknown use posOffset.
    if (input.verticalAlignment !== undefined && isVerticalAlignmentWire(input.verticalAlignment)) {
        child = xmlElement(WP_NS, 'wp', 'align', {
            children: [{ kind: 'text', value: input.verticalAlignment }]
        });
    }
    else {
        child = xmlElement(WP_NS, 'wp', 'posOffset', {
            children: [{ kind: 'text', value: String(input.verticalPositionEmu != null ? input.verticalPositionEmu : 0) }]
        });
    }
    return xmlElement(WP_NS, 'wp', 'positionV', {
        attributes: [attr('relativeFrom', origin)],
        children: [child]
    });
}
function copyElementAttrs(source: OpenXmlElement | undefined, localNames: ReadonlyArray<string>): OpenXmlAttribute[] {
    if (source === undefined) {
        return [];
    }
    const out: OpenXmlAttribute[] = [];
    for (const name of localNames) {
        const value: string = attributeValue(source, '', name);
        if (value !== undefined) {
            out.push(attr(name, value));
        }
    }
    return out;
}
function parseEmuAttr(host: OpenXmlElement, localName: string): Emus | undefined {
    const raw: string = attributeValue(host, '', localName);
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10) as Emus;
}
function parseOnOffAttr(host: OpenXmlElement, localName: string): boolean {
    const raw: string = attributeValue(host, '', localName);
    return raw === '1' || raw === 'true';
}
function textContent(el: OpenXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        }
    }
    return out;
}
/**
 * Parse `wp:posOffset`/`wp:align` under `wp:positionH|V`.
 *
 * Cites: `CT_PosH`/`CT_PosV` — exactly one of `align` or `posOffset`
 * (`ST_PositionOffset` = `xsd:int`, so negative EMU is legal);
 * `ST_AlignH`/`ST_AlignV` token sets —
 * `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/dml-wordprocessingDrawing.xsd`.
 * Unknown align tokens are dropped from the typed model (never re-written).
 *
 * @param {OpenXmlElement | undefined} position - The position.
 * @returns {Emus | undefined} The result.
 */
function parsePosOffsetRawEmu(position: OpenXmlElement | undefined): Emus | undefined {
    if (position === undefined) {
        return undefined;
    }
    const offset: OpenXmlElement = elementChildren(position).find((c: OpenXmlElement) => isElement(c, WP_NS, 'posOffset'));
    if (offset === undefined) {
        return undefined;
    }
    const raw: string = textContent(offset).trim();
    if (!/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10) as Emus;
}
/**
 *  Point form of the parsed `wp:posOffset` EMU (undefined when absent or negative).
 *
 * @param {OpenXmlElement | undefined} position - The position.
 * @returns {number | undefined} The result.
 */
function parsePosOffsetEmu(position: OpenXmlElement | undefined): number | undefined {
    const emu: Emus = parsePosOffsetRawEmu(position);
    // Point is a non-negative brand (images parity). Negative offsets are legal
    // on the wire (ST_PositionOffset = xsd:int) but unrepresentable;
    // the raw element is preserved for round-trip (see findResidualPositions).
    return emu !== undefined && emu >= 0 ? emuToPoint(emu) : undefined;
}
/**
 * Parse `wp:align` on positionH/positionV.
 * No position -> undefined (caller). No align child -> None (posOffset axis).
 * Schema wire token -> token. Unrecognized residual token -> Unknown.
 * Never returns undefined for a present position element.
 *
 * @param {OpenXmlElement | undefined} position - The position.
 * @param {string | string} axis - The axis.
 * @returns {HorizontalAlignmentType | VerticalAlignmentType | undefined} The result.
 */
function parseAlignChild(position: OpenXmlElement | undefined, axis: 'h' | 'v'): HorizontalAlignmentType | VerticalAlignmentType | undefined {
    if (position === undefined) {
        return undefined;
    }
    const alignEl: OpenXmlElement = elementChildren(position).find((c: OpenXmlElement) => isElement(c, WP_NS, 'align'));
    if (alignEl === undefined) {
        return axis === 'h' ? HorizontalAlignment.None : VerticalAlignment.None;
    }
    const raw: string = textContent(alignEl).trim();
    if (axis === 'h') {
        if (isHorizontalAlignmentWire(raw)) {
            return raw as HorizontalAlignmentType;
        }
        return HorizontalAlignment.Unknown;
    }
    if (isVerticalAlignmentWire(raw)) {
        return raw as VerticalAlignmentType;
    }
    return VerticalAlignment.Unknown;
}
/**
 * Read wrapping, distances, behindDoc, and preset geometry from residual DrawingML.
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {DrawingWrapState} The result.
 * @private
 */
export function readDrawingWrapState(residual: OpenXmlElement): DrawingWrapState {
    let ts336: any;
    const drawing: OpenXmlElement = ((ts336 = preferredDrawingElement(residual)), ts336 != null ? ts336 : residual);
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    const host: OpenXmlElement = inline != null ? inline : anchor;
    const placement: DrawingHostPlacement | undefined = inline !== undefined ? 'inline' : anchor !== undefined ? 'anchor' : undefined;
    const wrapping: TextWrappingStyle = host !== undefined && placement !== undefined
        ? parseDrawingWrapping(host, placement)
        : TextWrappingStyle.None;
    const residualWrap: OpenXmlElement = host !== undefined ? findResidualWrap(host) : undefined;
    const wrapType: TextWrappingType =
        wrapping === TextWrappingStyle.Square ||
            wrapping === TextWrappingStyle.Tight ||
            wrapping === TextWrappingStyle.Through
            ? parseWrapTextAttr(residualWrap)
            : TextWrappingType.Both;
    const prstGeom: OpenXmlElement = findFirstElement(drawing, A_NS, 'prstGeom');
    const presetGeometry: string = prstGeom !== undefined ? attributeValue(prstGeom, '', 'prst') : undefined;
    const anchorBooleans: { behindDocument: boolean; lockAnchor: boolean; allowOverlap: boolean; layoutInCell: boolean; } = {
        behindDocument: placement === 'anchor' && host !== undefined
            ? parseOnOffAttr(host, 'behindDoc')
            : false,
        lockAnchor: placement === 'anchor' && host !== undefined
            ? parseOnOffAttr(host, 'locked')
            : false,
        allowOverlap: placement === 'anchor' && host !== undefined
            ? parseOnOffAttr(host, 'allowOverlap')
            : false,
        layoutInCell: placement === 'anchor' && host !== undefined
            ? parseOnOffAttr(host, 'layoutInCell')
            : false
    };
    if (host === undefined) {
        return {
            placement,
            wrapping,
            wrapType: TextWrappingType.Both,
            distanceTopEmu: undefined,
            distanceBottomEmu: undefined,
            distanceLeftEmu: undefined,
            distanceRightEmu: undefined,
            ...anchorBooleans,
            presetGeometry
        };
    }
    return {
        placement,
        wrapping,
        wrapType,
        distanceTopEmu: parseEmuAttr(host, 'distT'),
        distanceBottomEmu: parseEmuAttr(host, 'distB'),
        distanceLeftEmu: parseEmuAttr(host, 'distL'),
        distanceRightEmu: parseEmuAttr(host, 'distR'),
        ...anchorBooleans,
        presetGeometry
    };
}
/**
 * Read `wp:positionH` / `wp:positionV` from residual DrawingML.
 *
 * Tokens are validated against images `layout-types` sets (GO Q1 import);
 * unknown `@relativeFrom` or align text is dropped (not preserved into the
 * typed model) so the encoder never writes an invented token.
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {DrawingPositionState} The result.
 * @private
 */
export function readDrawingPositionState(residual: OpenXmlElement): DrawingPositionState {
    let ts337: any;
    const drawing: OpenXmlElement = ((ts337 = preferredDrawingElement(residual)), ts337 != null ? ts337 : residual);
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    const host: OpenXmlElement = inline != null ? inline : anchor;
    const positionH: OpenXmlElement = host !== undefined ? elementChildren(host).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionH')) : undefined;
    const positionV: OpenXmlElement = host !== undefined ? elementChildren(host).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionV')) : undefined;
    const hOriginRaw: string = positionH !== undefined ? attributeValue(positionH, '', 'relativeFrom') : undefined;
    const vOriginRaw: string = positionV !== undefined ? attributeValue(positionV, '', 'relativeFrom') : undefined;
    return {
        horizontalOrigin: hOriginRaw !== undefined && isHorizontalOrigin(hOriginRaw) ? hOriginRaw : undefined,
        verticalOrigin: vOriginRaw !== undefined && isVerticalOrigin(vOriginRaw) ? vOriginRaw : undefined,
        horizontalPosition: parsePosOffsetEmu(positionH),
        verticalPosition: parsePosOffsetEmu(positionV),
        horizontalPositionEmu: parsePosOffsetRawEmu(positionH),
        verticalPositionEmu: parsePosOffsetRawEmu(positionV),
        horizontalAlignment: parseAlignChild(positionH, 'h') as HorizontalAlignmentType | undefined,
        verticalAlignment: parseAlignChild(positionV, 'v') as VerticalAlignmentType | undefined
    };
}
/**
 * Resolve effective placement from modeled wrap + requested placement.
 * Inline wrap forces `wp:inline`; other wraps force `wp:anchor`.
 *
 * @param {DrawingHostPlacement} placement - The placement.
 * @param {TextWrappingStyleType | undefined} wrapping - The wrapping.
 * @returns {DrawingHostPlacement} The result.
 * @private
 */
export function effectiveDrawingPlacement(
    placement: DrawingHostPlacement,
    wrapping: TextWrappingStyleType | undefined
): DrawingHostPlacement {
    if (wrapping === TextWrappingStyle.Inline) {
        return 'inline';
    }
    if (wrapping !== undefined) {
        return 'anchor';
    }
    return placement;
}
/**
 * Resolve effective wrapping for encode. Anchor + Inline wrap coerces to None.
 *
 * @param {DrawingHostPlacement} placement - The placement.
 * @param {TextWrappingStyleType | undefined} wrapping - The wrapping.
 * @returns {TextWrappingStyleType} The result.
 * @private
 */
export function effectiveDrawingWrapping(
    placement: DrawingHostPlacement,
    wrapping: TextWrappingStyleType | undefined
): TextWrappingStyleType {
    if (wrapping === undefined) {
        return placement === 'inline' ? TextWrappingStyle.Inline : TextWrappingStyle.None;
    }
    if (placement === 'anchor' && wrapping === TextWrappingStyle.Inline) {
        return TextWrappingStyle.None;
    }
    if (placement === 'inline') {
        return TextWrappingStyle.Inline;
    }
    return wrapping;
}
function buildInlineHost(input: EncodeDrawingShapeInput): OpenXmlElement {
    let ts338: any;
    const preservedInline: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WP_NS, 'inline')
        : undefined;
    const effect: OpenXmlElement = ((ts338 = findResidualEffectExtent(preservedInline)), ts338 != null ? ts338 : buildEffectExtent());
    const distT: 0 | Emus = input.distanceTopEmu != null ? input.distanceTopEmu : 0;
    const distB: 0 | Emus = input.distanceBottomEmu != null ? input.distanceBottomEmu : 0;
    const distL: 0 | Emus = input.distanceLeftEmu != null ? input.distanceLeftEmu : 0;
    const distR: 0 | Emus = input.distanceRightEmu != null ? input.distanceRightEmu : 0;
    const nsDecls: Array<{
        readonly prefix: string;
        readonly namespaceUri: string;
    }> = [
        { prefix: 'wp', namespaceUri: WP_NS },
        { prefix: 'a', namespaceUri: A_NS },
        { prefix: 'wps', namespaceUri: WPS_NS }
    ];
    if (input.groupChildElements !== undefined) {
        nsDecls.push({ prefix: 'wpg', namespaceUri: WPG_NS });
    }
    return xmlElement(WP_NS, 'wp', 'inline', {
        namespaceDeclarations: nsDecls,
        attributes: [
            attr('distT', String(distT)),
            attr('distB', String(distB)),
            attr('distL', String(distL)),
            attr('distR', String(distR))
        ],
        children: [
            xmlElement(WP_NS, 'wp', 'extent', {
                attributes: [attr('cx', String(input.widthEmu)), attr('cy', String(input.heightEmu))]
            }),
            effect,
            buildDocPr(input),
            buildCNvGraphicFramePr(input.lockAspectRatio != null ? input.lockAspectRatio : true),
            buildGraphic(input)
        ]
    });
}
function buildAnchorHost(input: EncodeDrawingShapeInput): OpenXmlElement {
    let ts339: any; let ts3310: any; let ts3311: any; let ts3312: any; let ts3313: any;
    const preservedAnchor: OpenXmlElement = input.preservedHost !== undefined
        ? findFirstElement(input.preservedHost, WP_NS, 'anchor')
        : undefined;
    const defaultAttrs: OpenXmlAttribute[] = [
        attr('distT', String(input.distanceTopEmu != null ? input.distanceTopEmu : 0)),
        attr('distB', String(input.distanceBottomEmu != null ? input.distanceBottomEmu : 0)),
        attr('distL', String(input.distanceLeftEmu != null ? input.distanceLeftEmu : 114300)),
        attr('distR', String(input.distanceRightEmu != null ? input.distanceRightEmu : 114300)),
        attr('simplePos', '0'),
        attr('relativeHeight', '251658240'),
        attr('behindDoc', input.behindDocument === true ? '1' : '0'),
        attr('locked', input.lockAnchor === true ? '1' : '0'),
        attr('layoutInCell', input.layoutInCell === false ? '0' : '1'),
        attr('allowOverlap', input.allowOverlap === false ? '0' : '1')
    ];
    // When modeled host attrs are supplied, prefer them over residual attrs.
    const hasModeledHostAttrs: boolean = input.distanceTopEmu !== undefined ||
        input.distanceBottomEmu !== undefined ||
        input.distanceLeftEmu !== undefined ||
        input.distanceRightEmu !== undefined ||
        input.behindDocument !== undefined ||
        input.lockAnchor !== undefined ||
        input.allowOverlap !== undefined ||
        input.layoutInCell !== undefined ||
        input.layoutDirty === true;
    let attrs: OpenXmlAttribute[];
    if (hasModeledHostAttrs || preservedAnchor === undefined) {
        if (preservedAnchor !== undefined && !hasModeledHostAttrs) {
            const preservedAttrs: OpenXmlAttribute[] = copyElementAttrs(preservedAnchor, [
                'distT',
                'distB',
                'distL',
                'distR',
                'simplePos',
                'relativeHeight',
                'behindDoc',
                'locked',
                'layoutInCell',
                'allowOverlap',
                'hidden'
            ]);
            attrs = preservedAttrs.length > 0 ? preservedAttrs : defaultAttrs;
        }
        else if (preservedAnchor !== undefined) {
            // Merge: keep non-modeled structural attrs from residual; override the
            // modeled distance / behindDoc / anchor-option attrs.
            const base: OpenXmlAttribute[] = copyElementAttrs(preservedAnchor, [
                'simplePos',
                'relativeHeight',
                'hidden'
            ]);
            const merged: OpenXmlAttribute[] = [
                attr('distT', String(((ts339 = input.distanceTopEmu != null ? input.distanceTopEmu : parseEmuAttr(preservedAnchor, 'distT')), ts339 != null ? ts339 : 0))),
                attr('distB', String(((ts3310 = input.distanceBottomEmu != null ? input.distanceBottomEmu : parseEmuAttr(preservedAnchor, 'distB')), ts3310 != null ? ts3310 : 0))),
                attr('distL', String(((ts3311 = input.distanceLeftEmu != null ? input.distanceLeftEmu : parseEmuAttr(preservedAnchor, 'distL')), ts3311 != null ? ts3311 : 114300))),
                attr('distR', String(((ts3312 = input.distanceRightEmu != null ? input.distanceRightEmu : parseEmuAttr(preservedAnchor, 'distR')), ts3312 != null ? ts3312 : 114300))),
                ...(base.length > 0
                    ? base
                    : [
                        attr('simplePos', '0'),
                        attr('relativeHeight', '251658240')
                    ]),
                attr('behindDoc', input.behindDocument !== undefined
                    ? input.behindDocument
                        ? '1'
                        : '0'
                    : parseOnOffAttr(preservedAnchor, 'behindDoc')
                        ? '1'
                        : '0'),
                attr('locked', input.lockAnchor !== undefined
                    ? input.lockAnchor
                        ? '1'
                        : '0'
                    : parseOnOffAttr(preservedAnchor, 'locked')
                        ? '1'
                        : '0'),
                attr('allowOverlap', input.allowOverlap !== undefined
                    ? input.allowOverlap
                        ? '1'
                        : '0'
                    : parseOnOffAttr(preservedAnchor, 'allowOverlap')
                        ? '1'
                        : '0'),
                attr('layoutInCell', input.layoutInCell !== undefined
                    ? input.layoutInCell
                        ? '1'
                        : '0'
                    : parseOnOffAttr(preservedAnchor, 'layoutInCell')
                        ? '1'
                        : '0')
            ];
            attrs = merged;
        }
        else {
            attrs = defaultAttrs;
        }
    }
    else {
        const preservedAttrs: OpenXmlAttribute[] = copyElementAttrs(preservedAnchor, [
            'distT',
            'distB',
            'distL',
            'distR',
            'simplePos',
            'relativeHeight',
            'behindDoc',
            'locked',
            'layoutInCell',
            'allowOverlap',
            'hidden'
        ]);
        attrs = preservedAttrs.length > 0 ? preservedAttrs : defaultAttrs;
    }
    const residualWrap: OpenXmlElement = findResidualWrap(preservedAnchor);
    const residualEffect: OpenXmlElement =
        ((ts3313 = findResidualEffectExtent(preservedAnchor)), ts3313 != null ? ts3313 : buildEffectExtent());
    const residualSimplePos: OpenXmlElement = preservedAnchor
        ? elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'simplePos'))
        : undefined;
    const residualPositions: { readonly positionH: OpenXmlElement; readonly positionV: OpenXmlElement } =
        findResidualPositions(preservedAnchor);
    const useModeledLayout: boolean = input.layoutDirty === true || preservedAnchor === undefined;
    const wrapping: TextWrappingStyle = effectiveDrawingWrapping('anchor', input.wrapping != null ? input.wrapping : TextWrappingStyle.None);
    let simplePos: OpenXmlElement;
    let positionH: OpenXmlElement;
    let positionV: OpenXmlElement;
    let wrap: OpenXmlElement;
    const modeledModes: { readonly horizontal: boolean; readonly vertical: boolean; } = usedModeledPositionMode(input);
    if (useModeledLayout) {
        simplePos = residualSimplePos != null ? residualSimplePos : xmlElement(WP_NS, 'wp', 'simplePos', {
            attributes: [attr('x', '0'), attr('y', '0')]
        });
        // Rebuild each axis independently so setting V never rewrites H.
        positionH = modeledModes.horizontal
            ? buildDrawingPositionH(input)
            : (residualPositions.positionH != null ? residualPositions.positionH : buildDefaultPositionH());
        positionV = modeledModes.vertical
            ? buildDrawingPositionV(input)
            : (residualPositions.positionV != null ? residualPositions.positionV : buildDefaultPositionV());
        wrap = buildWrapElement(wrapping, residualWrap, input.wrapType);
    }
    else {
        const ph: OpenXmlElement = elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionH'));
        const pv: OpenXmlElement = elementChildren(preservedAnchor).find((c: OpenXmlElement) => isElement(c, WP_NS, 'positionV'));
        simplePos = residualSimplePos != null ? residualSimplePos : xmlElement(WP_NS, 'wp', 'simplePos', {
            attributes: [attr('x', '0'), attr('y', '0')]
        });
        positionH = ph != null ? ph : xmlElement(WP_NS, 'wp', 'positionH', {
            attributes: [attr('relativeFrom', 'column')],
            children: [
                xmlElement(WP_NS, 'wp', 'posOffset', {
                    children: [{ kind: 'text', value: '0' }]
                })
            ]
        });
        positionV = pv != null ? pv : xmlElement(WP_NS, 'wp', 'positionV', {
            attributes: [attr('relativeFrom', 'paragraph')],
            children: [
                xmlElement(WP_NS, 'wp', 'posOffset', {
                    children: [{ kind: 'text', value: '0' }]
                })
            ]
        });
        wrap = residualWrap != null ? residualWrap : xmlElement(WP_NS, 'wp', 'wrapNone');
    }
    const nsDecls: Array<{
        readonly prefix: string;
        readonly namespaceUri: string;
    }> = [
        { prefix: 'wp', namespaceUri: WP_NS },
        { prefix: 'a', namespaceUri: A_NS },
        { prefix: 'wps', namespaceUri: WPS_NS }
    ];
    if (input.groupChildElements !== undefined) {
        nsDecls.push({ prefix: 'wpg', namespaceUri: WPG_NS });
    }
    return xmlElement(WP_NS, 'wp', 'anchor', {
        namespaceDeclarations: nsDecls,
        attributes: attrs,
        children: [
            simplePos,
            positionH,
            positionV,
            xmlElement(WP_NS, 'wp', 'extent', {
                attributes: [attr('cx', String(input.widthEmu)), attr('cy', String(input.heightEmu))]
            }),
            residualEffect,
            wrap,
            buildDocPr(input),
            buildCNvGraphicFramePr(input.lockAspectRatio != null ? input.lockAspectRatio : true),
            buildGraphic(input)
        ]
    });
}
/** True when any anchor-option field is explicitly modeled. */
/**
 * Whether the caller explicitly modeled a position mode (offset or align).
 * Hydrated-from-residual values do NOT count: rebuilt wire must preserve the
 * residual axis bytes untouched unless the user intervened on that axis.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {Object} The result.
 * @private
 */
export function usedModeledPositionMode(input: EncodeDrawingShapeInput): {
    readonly horizontal: boolean;
    readonly vertical: boolean;
} {
    return {
        horizontal: input.horizontalModeled === true,
        vertical: input.verticalModeled === true
    };
}
function parseOnOff(raw: string | undefined): boolean {
    return raw === '1' || raw === 'true';
}
function parseExtentEmus(element: OpenXmlElement | undefined): {
    widthEmu: Emus;
    heightEmu: Emus;
} | undefined {
    if (element === undefined) {
        return undefined;
    }
    const cxRaw: string = attributeValue(element, '', 'cx');
    const cyRaw: string = attributeValue(element, '', 'cy');
    if (cxRaw === undefined || cyRaw === undefined || !/^\d+$/.test(cxRaw) || !/^\d+$/.test(cyRaw)) {
        return undefined;
    }
    return {
        widthEmu: Number.parseInt(cxRaw, 10) as Emus,
        heightEmu: Number.parseInt(cyRaw, 10) as Emus
    };
}
function parseXfrmTransform(root: OpenXmlElement): {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
    ext: {
        widthEmu: Emus;
        heightEmu: Emus;
    } | undefined;
} {
    const xfrm: OpenXmlElement = findFirstElement(root, A_NS, 'xfrm');
    if (xfrm === undefined) {
        return { rotation: 0, flipHorizontal: false, flipVertical: false, ext: undefined };
    }
    const rotRaw: string = attributeValue(xfrm, '', 'rot');
    const rotation: number = rotRaw !== undefined && /^-?\d+$/.test(rotRaw)
        ? Number.parseInt(rotRaw, 10) / ROTATION_UNITS_PER_DEGREE
        : 0;
    const extEl: OpenXmlElement = elementChildren(xfrm).find((c: OpenXmlElement) => isElement(c, A_NS, 'ext'));
    return {
        rotation,
        flipHorizontal: parseOnOff(attributeValue(xfrm, '', 'flipH')),
        flipVertical: parseOnOff(attributeValue(xfrm, '', 'flipV')),
        ext: parseExtentEmus(extEl)
    };
}
function parseLockAspect(host: OpenXmlElement): boolean {
    const locks: OpenXmlElement = findFirstElement(host, A_NS, 'graphicFrameLocks');
    if (locks === undefined) {
        return false;
    }
    return parseOnOff(attributeValue(locks, '', 'noChangeAspect'));
}
function preferHost(drawing: OpenXmlElement): OpenXmlElement | undefined {
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    return inline != null ? inline : anchor;
}
/**
 * Read size/transform/lock from preferred DrawingML host.
 * Public size prefers `wp:extent`; xfrm ext is residual until size dirty.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {DrawingLayoutState} The result.
 * @private
 */
export function readDrawingLayout(root: OpenXmlElement): DrawingLayoutState {
    let ts3314: any; let ts3315: any; let ts3316: any;
    const drawing: OpenXmlElement = ((ts3314 = preferredDrawingElement(root)), ts3314 != null ? ts3314 : (isWml(root, 'drawing') ? root : undefined));
    if (drawing === undefined) {
        return {
            widthEmu: undefined,
            heightEmu: undefined,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            lockAspectRatio: false
        };
    }
    const host: OpenXmlElement = preferHost(drawing);
    const extentEl: OpenXmlElement = host !== undefined ? findFirstElement(host, WP_NS, 'extent') : undefined;
    const fromExtent: { widthEmu: Emus; heightEmu: Emus; } = parseExtentEmus(extentEl);
    const xfrm: { rotation: number; flipHorizontal: boolean; flipVertical: boolean; ext: { widthEmu: Emus; heightEmu: Emus } } =
        parseXfrmTransform(drawing);
    return {
        widthEmu:
            ((ts3315 = fromExtent == null ? undefined : fromExtent.widthEmu),
            ts3315 != null ? ts3315 : xfrm.ext == null ? undefined : xfrm.ext.widthEmu),
        heightEmu:
            ((ts3316 = fromExtent == null ? undefined : fromExtent.heightEmu),
            ts3316 != null ? ts3316 : xfrm.ext == null ? undefined : xfrm.ext.heightEmu),
        rotation: xfrm.rotation,
        flipHorizontal: xfrm.flipHorizontal,
        flipVertical: xfrm.flipVertical,
        lockAspectRatio: host !== undefined ? parseLockAspect(host) : false
    };
}
function replaceLocalAttrs(el: OpenXmlElement, mutator: (attrs: OpenXmlAttribute[]) => OpenXmlAttribute[]): void {
    const next: OpenXmlAttribute[] = mutator([...el.attributes]);
    (el as {
        attributes: ReadonlyArray<OpenXmlAttribute>;
    }).attributes = next;
}
function setExtentAttrs(el: OpenXmlElement, widthEmu: Emus, heightEmu: Emus): void {
    replaceLocalAttrs(el, (attrs: OpenXmlAttribute[]) => {
        const next: OpenXmlAttribute[] = [];
        let sawCx: boolean = false;
        let sawCy: boolean = false;
        for (const a of attrs) {
            if (a.namespaceUri === '' && a.localName === 'cx') {
                sawCx = true;
                next.push(attr('cx', String(widthEmu)));
                continue;
            }
            if (a.namespaceUri === '' && a.localName === 'cy') {
                sawCy = true;
                next.push(attr('cy', String(heightEmu)));
                continue;
            }
            next.push(a);
        }
        if (!sawCx) {
            next.push(attr('cx', String(widthEmu)));
        }
        if (!sawCy) {
            next.push(attr('cy', String(heightEmu)));
        }
        return next;
    });
}
function patchXfrmElement(xfrm: OpenXmlElement, layout: Pick<DrawingLayoutPatch, 'widthEmu' | 'heightEmu' | 'rotation' | 'flipHorizontal' | 'flipVertical'>): void {
    replaceLocalAttrs(xfrm, (attrs: OpenXmlAttribute[]) => {
        const kept: OpenXmlAttribute[] = [];
        for (const a of attrs) {
            if (a.namespaceUri !== '') {
                kept.push(a);
                continue;
            }
            if (a.localName === 'rot' || a.localName === 'flipH' || a.localName === 'flipV') {
                continue;
            }
            kept.push(a);
        }
        return [...kept, ...buildXfrmAttributes(layout)];
    });
    let ext: OpenXmlElement = elementChildren(xfrm).find((c: OpenXmlElement) => isElement(c, A_NS, 'ext'));
    if (ext === undefined) {
        ext = xmlElement(A_NS, 'a', 'ext', {
            attributes: [attr('cx', String(layout.widthEmu)), attr('cy', String(layout.heightEmu))]
        });
        const children: OpenXmlChild[] = [...xfrm.children, ext];
        (xfrm as {
            children: ReadonlyArray<OpenXmlChild>;
        }).children = children;
    }
    else {
        setExtentAttrs(ext, layout.widthEmu, layout.heightEmu);
    }
}
function ensureXfrmOnSpPr(drawing: OpenXmlElement, layout: Pick<DrawingLayoutPatch, 'widthEmu' | 'heightEmu' | 'rotation' | 'flipHorizontal' | 'flipVertical'>): void {
    let xfrm: OpenXmlElement = findFirstElement(drawing, A_NS, 'xfrm');
    if (xfrm !== undefined) {
        patchXfrmElement(xfrm, layout);
        return;
    }
    // Insert under first wps:spPr when present (do not invent full wsp tree).
    const spPr: OpenXmlElement = findFirstElement(drawing, WPS_NS, 'spPr');
    if (spPr === undefined) {
        return;
    }
    const off: OpenXmlElement = xmlElement(A_NS, 'a', 'off', {
        attributes: [attr('x', '0'), attr('y', '0')]
    });
    const ext: OpenXmlElement = xmlElement(A_NS, 'a', 'ext', {
        attributes: [attr('cx', String(layout.widthEmu)), attr('cy', String(layout.heightEmu))]
    });
    xfrm = xmlElement(A_NS, 'a', 'xfrm', {
        attributes: buildXfrmAttributes(layout),
        children: [off, ext]
    });
    (spPr as {
        children: ReadonlyArray<OpenXmlChild>;
    }).children = [xfrm, ...spPr.children];
}
function patchCNvGraphicFramePr(host: OpenXmlElement, lockAspectRatio: boolean): void {
    let framePr: OpenXmlElement = elementChildren(host).find((c: OpenXmlElement) => isElement(c, WP_NS, 'cNvGraphicFramePr'));
    if (framePr === undefined) {
        framePr = buildCNvGraphicFramePr(lockAspectRatio);
        // Insert after docPr when possible; else append.
        const children: OpenXmlChild[] = [...host.children];
        const docPrIndex: number = children.findIndex((c: OpenXmlChild) => c.kind === 'element' && isElement(c, WP_NS, 'docPr'));
        if (docPrIndex >= 0) {
            children.splice(docPrIndex + 1, 0, framePr);
        }
        else {
            children.push(framePr);
        }
        (host as {
            children: ReadonlyArray<OpenXmlChild>;
        }).children = children;
        return;
    }
    let locks: OpenXmlElement = elementChildren(framePr).find((c: OpenXmlElement) => isElement(c, A_NS, 'graphicFrameLocks'));
    if (locks === undefined) {
        locks = xmlElement(A_NS, 'a', 'graphicFrameLocks', {
            attributes: lockAspectRatio ? [attr('noChangeAspect', '1')] : []
        });
        (framePr as {
            children: ReadonlyArray<OpenXmlChild>;
        }).children = [locks, ...framePr.children];
        return;
    }
    replaceLocalAttrs(locks, (attrs: OpenXmlAttribute[]) => {
        const kept: OpenXmlAttribute[] = [];
        for (const a of attrs) {
            if (a.namespaceUri === '' && a.localName === 'noChangeAspect') {
                continue;
            }
            kept.push(a);
        }
        if (lockAspectRatio) {
            kept.push(attr('noChangeAspect', '1'));
        }
        return kept;
    });
}
function emuToPointsString(emus: Emus): string {
    const pt: number = emus / EMU_PER_POINT;
    // Avoid scientific notation; trim trailing zeros modestly.
    const rounded: number = Math.round(pt * 1000) / 1000;
    return `${String(rounded)}pt`;
}
/**
 * Convert non-negative EMU to a bare points number string for VML CSS tokens
 * that omit the `pt` unit in ShapeRequirements samples (e.g. mso-wrap-distance-top:0).
 * Zero is emitted as `0` (no unit); positive values use `Npt`.
 *
 * @param {Emus} emus - The emus.
 * @returns {string} The result.
 */
function emuToCssLengthToken(emus: Emus): string {
    if (emus === 0) {
        return '0';
    }
    return emuToPointsString(emus);
}
/**
 * sRGB hex for VML color attributes. Strip optional leading `#`; lowercase 6-digit.
 * Returns undefined when the value is not a 6-digit hex (omit rather than invent).
 *
 * @param {string} srgb - The srgb.
 * @returns {string | undefined} The result.
 */
function srgbToVmlColor(srgb: string): string | undefined {
    const raw: string = srgb.startsWith('#') ? srgb.slice(1) : srgb;
    if (!/^[0-9A-Fa-f]{6}$/.test(raw)) {
        return undefined;
    }
    return `#${raw.toLowerCase()}`;
}
/**
 * DML `ST_LineCap` → VML `ST_StrokeEndCap` (`vml-main.xsd`: flat|square|round).
 * Cites: AG_StrokeAttributes `@endcap`; DML rnd|sq|flat.
 *
 * @param {LineCap | undefined} cap - The cap.
 * @returns {string | undefined} The result.
 */
function mapLineCapToVmlEndcap(cap: LineCap | undefined): string | undefined {
    if (cap === undefined) {
        return undefined;
    }
    switch (cap) {
    case LineCap.Round:
        return 'round';
    case LineCap.Square:
        return 'square';
    case LineCap.Flat:
        return 'flat';
    default:
        // TS 3.3: LineCap widens to string without literal asserts — no never exhaustiveness.
        return undefined;
    }
}
/**
 * DML `ST_LineEndType` → VML `ST_StrokeArrowType`.
 *
 * Locked corpus pair (ShapeRequirements connector Fallback):
 * DML `a:tailEnd type="triangle"` → VML `endarrow="block"`.
 * Identity pairs with matching ST_StrokeArrowType tokens: none, diamond, oval.
 * Unmapped (stealth, arrow) are omitted — never invent classic/open without cite.
 *
 * @param {LineEndType | undefined} type - The type.
 * @returns {string | undefined} The result.
 */
function mapLineEndTypeToVmlArrow(type: LineEndType | undefined): string | undefined {
    if (type === undefined) {
        return undefined;
    }
    switch (type) {
    case LineEndType.None:
        return 'none';
    case LineEndType.Triangle:
        return 'block';
    case LineEndType.Diamond:
        return 'diamond';
    case LineEndType.Oval:
        return 'oval';
    case LineEndType.Stealth:
    case LineEndType.Arrow:
        return undefined;
    default:
        return undefined;
    }
}
/**
 * DML arrow size (sm|med|lg) → VML ST_StrokeArrowWidth / Point
 * (narrow|medium|wide and short|medium|long). Same three-level ladder; cited
 * only when arrow type is also mapped.
 *
 * @param {LineEndSize | undefined} size - The size.
 * @returns {string | undefined} The result.
 */
function mapLineEndSizeToVmlWidth(size: LineEndSize | undefined): string | undefined {
    if (size === undefined) {
        return undefined;
    }
    switch (size) {
    case 'sm':
        return 'narrow';
    case 'med':
        return 'medium';
    case 'lg':
        return 'wide';
    default:
        // TS 3.3: LineEndSize widens to string[] element without literal asserts.
        return undefined;
    }
}
function mapLineEndSizeToVmlLength(size: LineEndSize | undefined): string | undefined {
    if (size === undefined) {
        return undefined;
    }
    switch (size) {
    case 'sm':
        return 'short';
    case 'med':
        return 'medium';
    case 'lg':
        return 'long';
    default:
        return undefined;
    }
}
/**
 * DML `ST_LineDashingVal` → VML `@dashstyle` (xsd:string on AG_StrokeAttributes).
 * Only clear literal pairs; omit unmapped (never invent dash patterns).
 *
 * @param {LineDashing | undefined} dash - The dash.
 * @returns {string | undefined} The result.
 */
function mapLineDashingToVml(dash: LineDashing | undefined): string | undefined {
    if (dash === undefined || dash === LineDashing.Unknown) {
        return undefined;
    }
    switch (dash) {
    case LineDashing.Solid:
        return 'solid';
    case LineDashing.Dash:
    case LineDashing.LargeDash:
    case LineDashing.SystemDash:
        return 'dash';
    case LineDashing.Dot:
    case LineDashing.SystemDot:
        return 'dot';
    case LineDashing.DashDot:
    case LineDashing.LargeDashDot:
    case LineDashing.SystemDashDot:
        return 'dashDot';
    case LineDashing.LargeDashDotDot:
    case LineDashing.SystemDashDotDot:
        return 'dashDotDot';
    default:
        // TS 3.3: LineDashing widens to string without literal asserts.
        return undefined;
    }
}
/**
 * `wp:wrap*` style → `w10:wrap/@type` (`ST_WrapType`) and optional
 * `mso-wrap-style` (ECMA Part 4 allows square|none only on that CSS token).
 *
 * @param {TextWrappingStyleType | undefined} wrapping - The wrapping.
 * @returns {Object} The result.
 */
function mapWrappingToVmlWrap(wrapping: TextWrappingStyleType | undefined): {
    readonly w10Type: string | undefined;
    readonly msoWrapStyle: 'square' | 'none' | undefined;
} {
    switch (wrapping) {
    case TextWrappingStyle.Square:
        return { w10Type: 'square', msoWrapStyle: 'square' };
    case TextWrappingStyle.None:
        return { w10Type: 'none', msoWrapStyle: 'none' };
    case TextWrappingStyle.Tight:
        return { w10Type: 'tight', msoWrapStyle: undefined };
    case TextWrappingStyle.Through:
        return { w10Type: 'through', msoWrapStyle: undefined };
    case TextWrappingStyle.TopAndBottom:
        return { w10Type: 'topAndBottom', msoWrapStyle: undefined };
    case TextWrappingStyle.Inline:
    case undefined:
        // Inline hosts: no w10:wrap; mso-wrap-style omitted (flow with text).
        return { w10Type: undefined, msoWrapStyle: undefined };
    default:
        // TS 3.3: TextWrappingStyle widens to string without literal asserts.
        return { w10Type: undefined, msoWrapStyle: undefined };
    }
}
/**
 * DML `ST_RelFromH` → w10 `ST_HorizontalAnchor` / mso-position-horizontal-relative.
 * Only tokens that exist on both sides: margin|page|text(←column)|char(←character).
 * Margin-side variants (leftMargin, …) are omitted rather than inventing.
 *
 * @param {HorizontalOriginType | undefined} origin - The origin.
 * @returns {string | undefined} The result.
 */
function mapHorizontalOriginToVml(origin: HorizontalOriginType | undefined): string | undefined {
    switch (origin) {
    case HorizontalOrigin.Margin:
        return 'margin';
    case HorizontalOrigin.Page:
        return 'page';
    case HorizontalOrigin.Column:
        // ShapeRequirements samples use mso-position-horizontal-relative:text for
        // column-relative anchors (w10 ST_HorizontalAnchor includes `text`).
        return 'text';
    case HorizontalOrigin.Character:
        return 'char';
    case HorizontalOrigin.LeftMargin:
    case HorizontalOrigin.RightMargin:
    case HorizontalOrigin.InsideMargin:
    case HorizontalOrigin.OutsideMargin:
    case undefined:
        return undefined;
    default:
        // TS 3.3: HorizontalOrigin widens to string without literal asserts.
        return undefined;
    }
}
/**
 * DML `ST_RelFromV` → w10 `ST_VerticalAnchor` / mso-position-vertical-relative.
 * margin|page|text(←paragraph)|line. Margin-side variants omitted.
 *
 * @param {VerticalOriginType | undefined} origin - The origin.
 * @returns {string | undefined} The result.
 */
function mapVerticalOriginToVml(origin: VerticalOriginType | undefined): string | undefined {
    switch (origin) {
    case VerticalOrigin.Margin:
        return 'margin';
    case VerticalOrigin.Page:
        return 'page';
    case VerticalOrigin.Paragraph:
        // ShapeRequirements: mso-position-vertical-relative:text
        return 'text';
    case VerticalOrigin.Line:
        return 'line';
    case VerticalOrigin.TopMargin:
    case VerticalOrigin.BottomMargin:
    case VerticalOrigin.InsideMargin:
    case VerticalOrigin.OutsideMargin:
    case undefined:
        return undefined;
    default:
        // TS 3.3: VerticalOrigin widens to string without literal asserts.
        return undefined;
    }
}
/**
 * Build VML `style` attribute from modeled layout (ShapeRequirements Fallback pattern).
 *
 * Always: width/height in pt.
 * Anchor: position:absolute; margin-left/top from offsets when modeled; z-index;
 * visibility:visible; optional mso-wrap-style (square|none only); mso-wrap-distance-*;
 * mso-position-horizontal/vertical absolute + relative tokens when origins map.
 * Rotation: CSS `rotation:N` degrees when non-zero (DML rot is 1/60000 deg).
 * Flip: `flip:x` / `flip:y` / `flip:xy` when modeled (VML style AG_Style).
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {string} The result.
 */
function buildVmlShapeStyle(input: EncodeDrawingShapeInput): string {
    let ts3317: any; let ts3318: any;
    const placement: DrawingHostPlacement = effectiveDrawingPlacement(input.placement, input.wrapping);
    const wrapping: TextWrappingStyle = effectiveDrawingWrapping(placement, input.wrapping);
    const parts: string[] = [];
    if (placement === 'anchor') {
        parts.push('position:absolute');
        const marginLeft: Emus = input.horizontalPositionEmu != null ? input.horizontalPositionEmu : (0 as Emus);
        const marginTop: Emus = input.verticalPositionEmu != null ? input.verticalPositionEmu : (0 as Emus);
        parts.push(`margin-left:${emuToPointsString(marginLeft)}`);
        parts.push(`margin-top:${emuToPointsString(marginTop)}`);
    }
    parts.push(`width:${emuToPointsString(input.widthEmu)}`);
    parts.push(`height:${emuToPointsString(input.heightEmu)}`);
    if (placement === 'anchor') {
        // Default relativeHeight matches buildAnchorHost (251658240).
        // behindDoc: Word uses negative z-index for behind-text; emit only when true.
        const zIndex: number = input.behindDocument === true ? -251658240 : 251658240;
        parts.push(`z-index:${String(zIndex)}`);
        parts.push('visibility:visible');
        const wrapMap: { readonly w10Type: string; readonly msoWrapStyle: 'none' | 'square'; } = mapWrappingToVmlWrap(wrapping);
        if (wrapMap.msoWrapStyle !== undefined) {
            parts.push(`mso-wrap-style:${wrapMap.msoWrapStyle}`);
        }
        // ShapeRequirements connector sample: mso-wrap-distance-left/right 9pt
        // (= 114300 EMU anchor default); top/bottom 0.
        const distL: Emus = input.distanceLeftEmu != null ? input.distanceLeftEmu : (114300 as Emus);
        const distT: Emus = input.distanceTopEmu != null ? input.distanceTopEmu : (0 as Emus);
        const distR: Emus = input.distanceRightEmu != null ? input.distanceRightEmu : (114300 as Emus);
        const distB: Emus = input.distanceBottomEmu != null ? input.distanceBottomEmu : (0 as Emus);
        parts.push(`mso-wrap-distance-left:${emuToCssLengthToken(distL)}`);
        parts.push(`mso-wrap-distance-top:${emuToCssLengthToken(distT)}`);
        parts.push(`mso-wrap-distance-right:${emuToCssLengthToken(distR)}`);
        parts.push(`mso-wrap-distance-bottom:${emuToCssLengthToken(distB)}`);
        parts.push('mso-position-horizontal:absolute');
        const hRel: string = ((ts3317 = mapHorizontalOriginToVml(input.horizontalOrigin)), ts3317 != null ? ts3317 :
        // Default column → text (ShapeRequirements + images parity default origin).
            'text');
        parts.push(`mso-position-horizontal-relative:${hRel}`);
        parts.push('mso-position-vertical:absolute');
        const vRel: string = ((ts3318 = mapVerticalOriginToVml(input.verticalOrigin)), ts3318 != null ? ts3318 :
        // Default paragraph → text.
            'text');
        parts.push(`mso-position-vertical-relative:${vRel}`);
    }
    const rotation: number = input.rotation != null ? input.rotation : 0;
    if (rotation !== 0) {
        // VML style rotation is degrees (not DML 60000ths).
        const rounded: number = Math.round(rotation * 1000) / 1000;
        parts.push(`rotation:${String(rounded)}`);
    }
    const flipH: boolean = input.flipHorizontal === true;
    const flipV: boolean = input.flipVertical === true;
    if (flipH && flipV) {
        parts.push('flip:xy');
    }
    else if (flipH) {
        parts.push('flip:x');
    }
    else if (flipV) {
        parts.push('flip:y');
    }
    // bodyPr spAutoFit → mso-fit-shape-to-text (Word VML textbox autofit).
    if (input.bodyPr !== undefined) {
        const hasSpAutoFit: boolean = elementChildren(input.bodyPr).some((c: OpenXmlElement) => c.namespaceUri === A_NS && c.localName === 'spAutoFit');
        if (hasSpAutoFit) {
            parts.push('mso-fit-shape-to-text:t');
        }
    }
    return parts.join(';');
}
/**
 * Read bodyPr inset attributes (lIns/tIns/rIns/bIns EMU) into VML `@inset`
 * string (`left,top,right,bottom` in pt). CT_Textbox `@inset` (vml-main.xsd).
 * Missing sides default to 0pt so the four-tuple is well-formed when any side
 * is modeled.
 *
 * @param {OpenXmlElement | undefined} bodyPr - The body pr.
 * @returns {string | undefined} The result.
 */
function bodyPrInsetsToVmlInset(bodyPr: OpenXmlElement | undefined): string | undefined {
    if (bodyPr === undefined) {
        return undefined;
    }
    const lRaw: string = attributeValue(bodyPr, '', 'lIns');
    const tRaw: string = attributeValue(bodyPr, '', 'tIns');
    const rRaw: string = attributeValue(bodyPr, '', 'rIns');
    const bRaw: string = attributeValue(bodyPr, '', 'bIns');
    if (lRaw === undefined && tRaw === undefined && rRaw === undefined && bRaw === undefined) {
        return undefined;
    }
    const parse: (raw: string) => Emus = (raw: string | undefined): Emus => {
        if (raw === undefined || raw === '') {
            return 0 as Emus;
        }
        const n: number = Number(raw);
        return (Number.isFinite(n) ? n : 0) as Emus;
    };
    return `${emuToPointsString(parse(lRaw))},${emuToPointsString(parse(tRaw))},${emuToPointsString(parse(rRaw))},${emuToPointsString(parse(bRaw))}`;
}
/**
 * Build `v:stroke` child when line endcap / dash / arrows / joinstyle need emission.
 * ShapeRequirements always emits `joinstyle="miter"` on stroke for authored shapes;
 * we emit the child whenever any stroke detail beyond shape-level color/weight is set,
 * and always include joinstyle=miter when the child is present (corpus pattern).
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement | undefined} The result.
 */
function buildVmlStrokeChild(input: EncodeDrawingShapeInput): OpenXmlElement | undefined {
    const line: EncodeDrawingShapeInput['line'] = input.line;
    if (line === undefined) {
        return undefined;
    }
    const strokeAttrs: OpenXmlAttribute[] = [];
    if (line.kind === 'none') {
        // AG_StrokeAttributes `@on` — turn stroke off (pairs with shape stroked="f").
        strokeAttrs.push(attr('on', 'f'));
    }
    else {
        const endcap: string = mapLineCapToVmlEndcap(line.cap);
        if (endcap !== undefined) {
            strokeAttrs.push(attr('endcap', endcap));
        }
        const dashstyle: string = mapLineDashingToVml(line.dash);
        if (dashstyle !== undefined && dashstyle !== 'solid') {
            // solid is the default; omit rather than noise.
            strokeAttrs.push(attr('dashstyle', dashstyle));
        }
        if (line.widthEmu !== undefined) {
            strokeAttrs.push(attr('weight', emuToPointsString(line.widthEmu)));
        }
        const color: string = srgbToVmlColor(line.srgb);
        if (color !== undefined) {
            strokeAttrs.push(attr('color', color));
        }
        const startArrow: string = mapLineEndTypeToVmlArrow(line.beginArrowType);
        if (startArrow !== undefined && startArrow !== 'none') {
            strokeAttrs.push(attr('startarrow', startArrow));
            const sw: string = mapLineEndSizeToVmlWidth(line.beginArrowSize);
            const sl: string = mapLineEndSizeToVmlLength(line.beginArrowSize);
            if (sw !== undefined) {
                strokeAttrs.push(attr('startarrowwidth', sw));
            }
            if (sl !== undefined) {
                strokeAttrs.push(attr('startarrowlength', sl));
            }
        }
        const endArrow: string = mapLineEndTypeToVmlArrow(line.endArrowType);
        if (endArrow !== undefined && endArrow !== 'none') {
            // ShapeRequirements connector: endarrow="block" (DML triangle).
            strokeAttrs.push(attr('endarrow', endArrow));
            const ew: string = mapLineEndSizeToVmlWidth(line.endArrowSize);
            const el: string = mapLineEndSizeToVmlLength(line.endArrowSize);
            if (ew !== undefined) {
                strokeAttrs.push(attr('endarrowwidth', ew));
            }
            if (el !== undefined) {
                strokeAttrs.push(attr('endarrowlength', el));
            }
        }
    }
    // Emit child when we have any stroke detail, or always for solid/none so
    // joinstyle miter matches ShapeRequirements Fallback samples.
    strokeAttrs.push(attr('joinstyle', 'miter'));
    return xmlElement(VML_NS, 'v', 'stroke', { attributes: strokeAttrs });
}
/**
 * Corpus-backed VML Fallback pict tree (Policy B dual AC — TASK-8050).
 *
 * Emits `w:pict` > `v:shape` with style, fill/stroke attrs, optional `v:stroke`,
 * `w10:wrap` / `w10:anchorlock`, and `v:textbox` (cloned txbxContent) when modeled.
 * Does not invent shapetype paths or execute VML.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildVmlFallbackStub(input: EncodeDrawingShapeInput): OpenXmlElement {
    const placement: DrawingHostPlacement = effectiveDrawingPlacement(input.placement, input.wrapping);
    const wrapping: TextWrappingStyle = effectiveDrawingWrapping(placement, input.wrapping);
    const shapeAttrs: OpenXmlAttribute[] = [
        attr('style', buildVmlShapeStyle(input)),
        attr('id', `Shape${String(input.docPrId)}`)
    ];
    // AG_Fill: filled / fillcolor (vml-main.xsd).
    if (input.fill !== undefined) {
        if (input.fill.kind === 'none') {
            shapeAttrs.push(attr('filled', 'f'));
        }
        else {
            const color: string = srgbToVmlColor(input.fill.srgb);
            if (color !== undefined) {
                shapeAttrs.push(attr('filled', 't'));
                shapeAttrs.push(attr('fillcolor', color));
            }
        }
    }
    // AG_ShapeAttributes: stroked / strokecolor / strokeweight.
    if (input.line !== undefined) {
        if (input.line.kind === 'none') {
            shapeAttrs.push(attr('stroked', 'f'));
        }
        else {
            shapeAttrs.push(attr('stroked', 't'));
            const color: string = srgbToVmlColor(input.line.srgb);
            if (color !== undefined) {
                shapeAttrs.push(attr('strokecolor', color));
            }
            if (input.line.widthEmu !== undefined) {
                shapeAttrs.push(attr('strokeweight', emuToPointsString(input.line.widthEmu)));
            }
        }
    }
    const children: OpenXmlElement[] = [];
    // v:fill opacity when solid fill has non-opaque transparency (public t = 100 - opacity%).
    if (input.fill !== undefined && input.fill.kind === 'solid') {
        const solidFill: { readonly kind: 'solid'; readonly srgb: string; readonly alpha?: number; } = input.fill;
        if (solidFill.alpha !== undefined) {
            const publicTransparency: number = Math.round(100 - solidFill.alpha / 1000);
            if (publicTransparency > 0 && publicTransparency <= 100) {
                const fillColor: string = srgbToVmlColor(solidFill.srgb);
                const fillAttrs: any[] = [];
                if (fillColor !== undefined) {
                    fillAttrs.push(attr('color', fillColor));
                }
                fillAttrs.push(attr('opacity', String(100 - publicTransparency) + '%'));
                children.push(xmlElement(VML_NS, 'v', 'fill', { attributes: fillAttrs }));
            }
        }
    }
    const strokeChild: OpenXmlElement = buildVmlStrokeChild(input);
    if (strokeChild !== undefined) {
        children.push(strokeChild);
    }
    // w10:wrap — ST_WrapType from vml-wordprocessingDrawing.xsd.
    const wrapMap: { readonly w10Type: string; readonly msoWrapStyle: 'none' | 'square'; } = mapWrappingToVmlWrap(wrapping);
    let needsW10: boolean = false;
    if (placement === 'anchor' && wrapMap.w10Type !== undefined) {
        const wrapAttrs: OpenXmlAttribute[] = [attr('type', wrapMap.w10Type)];
        const anchorx: string = mapHorizontalOriginToVml(input.horizontalOrigin);
        const anchory: string = mapVerticalOriginToVml(input.verticalOrigin);
        if (anchorx !== undefined) {
            wrapAttrs.push(attr('anchorx', anchorx));
        }
        if (anchory !== undefined) {
            wrapAttrs.push(attr('anchory', anchory));
        }
        children.push(xmlElement(W10_NS, 'w10', 'wrap', {
            attributes: wrapAttrs
        }));
        needsW10 = true;
    }
    // w10:anchorlock — empty CT when lockAnchor (vml-wordprocessingDrawing.xsd).
    if (placement === 'anchor' && input.lockAnchor === true) {
        children.push(xmlElement(W10_NS, 'w10', 'anchorlock', {}));
        needsW10 = true;
    }
    // v:textbox — CT_Textbox with optional @inset + w:txbxContent children.
    // Dual-write text box body into Fallback when txbxContent is modeled (Policy B).
    if (input.txbxContent !== undefined) {
        const textboxAttrs: OpenXmlAttribute[] = [];
        const inset: string = bodyPrInsetsToVmlInset(input.bodyPr);
        if (inset !== undefined) {
            textboxAttrs.push(attr('inset', inset));
        }
        const txbxChildren: OpenXmlElement[] = input.txbxContent.map((c: OpenXmlElement) => cloneElement(c));
        // CT_Textbox allows w:txbxContent; wrap cloned block children in w:txbxContent
        // when the payload is raw body blocks (encode path passes txbxContent element
        // children — typically already the inner blocks, or a single txbxContent).
        // Prefer a single w:txbxContent wrapper when children are not already one.
        let textboxChildEls: OpenXmlElement[];
        if (txbxChildren.length === 1 &&
            txbxChildren[0] !== undefined &&
            isWml(txbxChildren[0], 'txbxContent')) {
            textboxChildEls = txbxChildren;
        }
        else {
            textboxChildEls = [wmlElement('txbxContent', { children: txbxChildren })];
        }
        children.push(xmlElement(VML_NS, 'v', 'textbox', {
            attributes: textboxAttrs,
            children: textboxChildEls
        }));
    }
    const namespaceDeclarations: Array<{
        readonly prefix: string;
        readonly namespaceUri: string;
    }> = [{ prefix: 'v', namespaceUri: VML_NS }];
    if (needsW10) {
        namespaceDeclarations.push({ prefix: 'w10', namespaceUri: W10_NS });
    }
    const shape: OpenXmlElement = xmlElement(VML_NS, 'v', 'shape', {
        attributes: shapeAttrs,
        children
    });
    return wmlElement('pict', {
        namespaceDeclarations,
        children: [shape]
    });
}
/**
 * Build `w:drawing` with `wp:inline` or `wp:anchor` host (Choice body only).
 * Wrapping drives host kind: Inline ⇒ inline; other styles ⇒ anchor.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildDrawingMlHost(input: EncodeDrawingShapeInput): OpenXmlElement {
    const placement: DrawingHostPlacement = effectiveDrawingPlacement(input.placement, input.wrapping);
    const wrapping: TextWrappingStyle = effectiveDrawingWrapping(placement, input.wrapping);
    const resolved: EncodeDrawingShapeInput = {
        ...input,
        placement,
        wrapping
    };
    const host: OpenXmlElement = placement === 'inline' ? buildInlineHost(resolved) : buildAnchorHost(resolved);
    return wmlElement('drawing', { children: [host] });
}
/**
 * Author dual AC root: Choice(wps DrawingML) + Fallback(VML pict tree).
 * Policy B (GO Q2/Q3/Q7) — TASK-8050 corpus-backed VML Fallback.
 *
 * @param {EncodeDrawingShapeInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function encodeAuthoredDrawingShape(input: EncodeDrawingShapeInput): OpenXmlElement {
    const drawing: OpenXmlElement = buildDrawingMlHost(input);
    const fallback: OpenXmlElement = buildVmlFallbackStub(input);
    // ECMA-376-3 §7.6: Choice @Requires prefixes must be bound in scope.
    // Declare xmlns:wps (and supporting prefixes) on AlternateContent so
    // Requires="wps" resolves before Choice descends into w:drawing.
    // xmlns:w10 is always declared so anchor Fallback w10:wrap / w10:anchorlock
    // resolve under Fallback without inventing undeclared prefixes (vml-wordprocessingDrawing.xsd).
    return xmlElement(MC_NS, 'mc', 'AlternateContent', {
        namespaceDeclarations: [
            { prefix: 'mc', namespaceUri: MC_NS },
            { prefix: 'wps', namespaceUri: WPS_NS },
            { prefix: 'wp', namespaceUri: WP_NS },
            { prefix: 'a', namespaceUri: A_NS },
            { prefix: 'v', namespaceUri: VML_NS },
            { prefix: 'w10', namespaceUri: W10_NS }
        ],
        children: [
            xmlElement(MC_NS, 'mc', 'Choice', {
                attributes: [attr('Requires', 'wps')],
                children: [drawing]
            }),
            xmlElement(MC_NS, 'mc', 'Fallback', {
                children: [fallback]
            })
        ]
    });
}
/**
 * Author dual AC root for a wordprocessing group: Choice(wpg DrawingML) +
 * Fallback(VML pict stub). Policy B — TASK-8051.
 *
 * Top-level graphicData uri = WPG; body is `wpg:wgp` without cNvPr.
 * xmlns:wpg is declared on AlternateContent so Requires="wpg" resolves;
 * xmlns:wps is kept so nested authored `wps:wsp` children resolve.
 *
 * @param {EncodeGroupInput} input - The input.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function encodeAuthoredGroup(input: EncodeGroupInput): OpenXmlElement {
    // Reuse the leaf host builders via EncodeDrawingShapeInput + groupChildElements.
    // presetGeometry is a VML-fallback stub placeholder only (not written to DML).
    // TS 3.3: nested conditional object spreads explode the checker (OOM).
    // Mutable assigns only when defined — same exactOptionalPropertyTypes semantics.
    const shapeLikeMutable: {
        placement: EncodeDrawingShapeInput['placement'];
        widthEmu: EncodeDrawingShapeInput['widthEmu'];
        heightEmu: EncodeDrawingShapeInput['heightEmu'];
        presetGeometry: string;
        docPrId: number;
        name: string;
        title: EncodeDrawingShapeInput['title'];
        description: EncodeDrawingShapeInput['description'];
        rotation?: EncodeDrawingShapeInput['rotation'];
        flipHorizontal?: EncodeDrawingShapeInput['flipHorizontal'];
        flipVertical?: EncodeDrawingShapeInput['flipVertical'];
        lockAspectRatio?: EncodeDrawingShapeInput['lockAspectRatio'];
        wrapping?: EncodeDrawingShapeInput['wrapping'];
        distanceTopEmu?: EncodeDrawingShapeInput['distanceTopEmu'];
        distanceBottomEmu?: EncodeDrawingShapeInput['distanceBottomEmu'];
        distanceLeftEmu?: EncodeDrawingShapeInput['distanceLeftEmu'];
        distanceRightEmu?: EncodeDrawingShapeInput['distanceRightEmu'];
        behindDocument?: EncodeDrawingShapeInput['behindDocument'];
        horizontalOrigin?: EncodeDrawingShapeInput['horizontalOrigin'];
        verticalOrigin?: EncodeDrawingShapeInput['verticalOrigin'];
        horizontalPositionEmu?: EncodeDrawingShapeInput['horizontalPositionEmu'];
        verticalPositionEmu?: EncodeDrawingShapeInput['verticalPositionEmu'];
        horizontalAlignment?: EncodeDrawingShapeInput['horizontalAlignment'];
        verticalAlignment?: EncodeDrawingShapeInput['verticalAlignment'];
        lockAnchor?: EncodeDrawingShapeInput['lockAnchor'];
        allowOverlap?: EncodeDrawingShapeInput['allowOverlap'];
        layoutInCell?: EncodeDrawingShapeInput['layoutInCell'];
        horizontalModeled?: EncodeDrawingShapeInput['horizontalModeled'];
        verticalModeled?: EncodeDrawingShapeInput['verticalModeled'];
        preservedHost?: EncodeDrawingShapeInput['preservedHost'];
        layoutDirty?: EncodeDrawingShapeInput['layoutDirty'];
        groupChildElements: ReadonlyArray<OpenXmlElement>;
    } = {
        placement: input.placement,
        widthEmu: input.widthEmu,
        heightEmu: input.heightEmu,
        presetGeometry: 'rect',
        docPrId: input.docPrId,
        name: input.name,
        title: input.title,
        description: input.description,
        groupChildElements: input.children
    };
    if (input.rotation !== undefined) {
        shapeLikeMutable.rotation = input.rotation;
    }
    if (input.flipHorizontal !== undefined) {
        shapeLikeMutable.flipHorizontal = input.flipHorizontal;
    }
    if (input.flipVertical !== undefined) {
        shapeLikeMutable.flipVertical = input.flipVertical;
    }
    if (input.lockAspectRatio !== undefined) {
        shapeLikeMutable.lockAspectRatio = input.lockAspectRatio;
    }
    if (input.wrapping !== undefined) {
        shapeLikeMutable.wrapping = input.wrapping;
    }
    if (input.distanceTopEmu !== undefined) {
        shapeLikeMutable.distanceTopEmu = input.distanceTopEmu;
    }
    if (input.distanceBottomEmu !== undefined) {
        shapeLikeMutable.distanceBottomEmu = input.distanceBottomEmu;
    }
    if (input.distanceLeftEmu !== undefined) {
        shapeLikeMutable.distanceLeftEmu = input.distanceLeftEmu;
    }
    if (input.distanceRightEmu !== undefined) {
        shapeLikeMutable.distanceRightEmu = input.distanceRightEmu;
    }
    if (input.behindDocument !== undefined) {
        shapeLikeMutable.behindDocument = input.behindDocument;
    }
    if (input.horizontalOrigin !== undefined) {
        shapeLikeMutable.horizontalOrigin = input.horizontalOrigin;
    }
    if (input.verticalOrigin !== undefined) {
        shapeLikeMutable.verticalOrigin = input.verticalOrigin;
    }
    if (input.horizontalPositionEmu !== undefined) {
        shapeLikeMutable.horizontalPositionEmu = input.horizontalPositionEmu;
    }
    if (input.verticalPositionEmu !== undefined) {
        shapeLikeMutable.verticalPositionEmu = input.verticalPositionEmu;
    }
    if (input.horizontalAlignment !== undefined) {
        shapeLikeMutable.horizontalAlignment = input.horizontalAlignment;
    }
    if (input.verticalAlignment !== undefined) {
        shapeLikeMutable.verticalAlignment = input.verticalAlignment;
    }
    if (input.lockAnchor !== undefined) {
        shapeLikeMutable.lockAnchor = input.lockAnchor;
    }
    if (input.allowOverlap !== undefined) {
        shapeLikeMutable.allowOverlap = input.allowOverlap;
    }
    if (input.layoutInCell !== undefined) {
        shapeLikeMutable.layoutInCell = input.layoutInCell;
    }
    if (input.horizontalModeled !== undefined) {
        shapeLikeMutable.horizontalModeled = input.horizontalModeled;
    }
    if (input.verticalModeled !== undefined) {
        shapeLikeMutable.verticalModeled = input.verticalModeled;
    }
    if (input.preservedHost !== undefined) {
        shapeLikeMutable.preservedHost = input.preservedHost;
    }
    if (input.layoutDirty !== undefined) {
        shapeLikeMutable.layoutDirty = input.layoutDirty;
    }
    const shapeLike: EncodeDrawingShapeInput = shapeLikeMutable;
    const drawing: OpenXmlElement = buildDrawingMlHost(shapeLike);
    const fallback: OpenXmlElement = buildVmlFallbackStub(shapeLike);
    return xmlElement(MC_NS, 'mc', 'AlternateContent', {
        namespaceDeclarations: [
            { prefix: 'mc', namespaceUri: MC_NS },
            { prefix: 'wpg', namespaceUri: WPG_NS },
            { prefix: 'wps', namespaceUri: WPS_NS },
            { prefix: 'wp', namespaceUri: WP_NS },
            { prefix: 'a', namespaceUri: A_NS },
            { prefix: 'v', namespaceUri: VML_NS },
            { prefix: 'w10', namespaceUri: W10_NS }
        ],
        children: [
            xmlElement(MC_NS, 'mc', 'Choice', {
                attributes: [attr('Requires', 'wpg')],
                children: [drawing]
            }),
            xmlElement(MC_NS, 'mc', 'Fallback', {
                children: [fallback]
            })
        ]
    });
}
/**
 * Locate preferred DrawingML `w:drawing` for typed reads.
 * Prefer MC Choice branch when residual is AlternateContent.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function preferredDrawingElement(root: OpenXmlElement): OpenXmlElement | undefined {
    if (isWml(root, 'drawing')) {
        return root;
    }
    if (root.namespaceUri === MC_NS && root.localName === 'AlternateContent') {
        for (const child of elementChildren(root)) {
            if (child.namespaceUri !== MC_NS || child.localName !== 'Choice') {
                continue;
            }
            for (const nested of elementChildren(child)) {
                if (isWml(nested, 'drawing')) {
                    return nested;
                }
            }
        }
        // No Choice drawing — last resort scan.
        return findFirstElement(root, root.namespaceUri, 'drawing') !== undefined
            ? undefined
            : (() => {
                for (const child of elementChildren(root)) {
                    const d: OpenXmlElement = preferredDrawingElement(child);
                    if (d !== undefined) {
                        return d;
                    }
                    if (isWml(child, 'drawing')) {
                        return child;
                    }
                }
                return undefined;
            })();
    }
    return undefined;
}
/**
 * Read `wp:docPr` identity from preferred drawing host.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {Object} The result.
 * @private
 */
export function readDocPrIdentity(root: OpenXmlElement): {
    name: string | undefined;
    title: string | undefined;
    description: string | undefined;
    docPrId: number | undefined;
} {
    let ts3319: any;
    const drawing: OpenXmlElement = ((ts3319 = preferredDrawingElement(root)), ts3319 != null ? ts3319 : (isWml(root, 'drawing') ? root : undefined));
    if (drawing === undefined) {
        return { name: undefined, title: undefined, description: undefined, docPrId: undefined };
    }
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    const host: OpenXmlElement = inline != null ? inline : anchor;
    if (host === undefined) {
        return { name: undefined, title: undefined, description: undefined, docPrId: undefined };
    }
    const docPr: OpenXmlElement = findFirstElement(host, WP_NS, 'docPr');
    if (docPr === undefined) {
        return { name: undefined, title: undefined, description: undefined, docPrId: undefined };
    }
    const idRaw: string = attributeValue(docPr, '', 'id');
    const idParsed: number = idRaw !== undefined && /^\d+$/.test(idRaw) ? Number.parseInt(idRaw, 10) : undefined;
    const name: string = attributeValue(docPr, '', 'name');
    const title: string = attributeValue(docPr, '', 'title');
    const descr: string = attributeValue(docPr, '', 'descr');
    return {
        name: name !== undefined && name.length > 0 ? name : undefined,
        title: title !== undefined && title.length > 0 ? title : undefined,
        description: descr !== undefined && descr.length > 0 ? descr : undefined,
        docPrId: idParsed
    };
}
function patchDocPrOnElement(docPr: OpenXmlElement, identity: DrawingDocPrIdentity): void {
    const next: OpenXmlAttribute[] = [];
    let sawId: boolean = false;
    let sawName: boolean = false;
    let sawTitle: boolean = false;
    let sawDescr: boolean = false;
    for (const a of docPr.attributes) {
        if (a.namespaceUri !== '') {
            next.push(a);
            continue;
        }
        if (a.localName === 'id') {
            sawId = true;
            if (identity.docPrId !== undefined) {
                next.push(attr('id', String(identity.docPrId)));
            }
            else {
                next.push(a);
            }
            continue;
        }
        if (a.localName === 'name') {
            sawName = true;
            if (identity.name !== undefined) {
                next.push(attr('name', identity.name));
            }
            else {
                // Clearing name is not typical; keep residual when undefined means "no override".
                // Callers always pass concrete name when dirty from mutators.
                next.push(a);
            }
            continue;
        }
        if (a.localName === 'title') {
            sawTitle = true;
            if (identity.title === undefined) {
                continue;
            }
            next.push(attr('title', identity.title));
            continue;
        }
        if (a.localName === 'descr') {
            sawDescr = true;
            if (identity.description === undefined) {
                continue;
            }
            next.push(attr('descr', identity.description));
            continue;
        }
        next.push(a);
    }
    if (!sawId && identity.docPrId !== undefined) {
        next.unshift(attr('id', String(identity.docPrId)));
    }
    if (!sawName && identity.name !== undefined) {
        next.push(attr('name', identity.name));
    }
    if (!sawTitle && identity.title !== undefined && identity.title.length > 0) {
        next.push(attr('title', identity.title));
    }
    if (!sawDescr && identity.description !== undefined && identity.description.length > 0) {
        next.push(attr('descr', identity.description));
    }
    // Mutate in place on the clone's docPr via replacement — OpenXmlElement.attributes is readonly
    // in type but we rebuild parent instead. Use object replace:
    (docPr as {
        attributes: ReadonlyArray<OpenXmlAttribute>;
    }).attributes = next;
}
/**
 * Deep-clone residual and patch `wp:docPr` identity attributes only (identity dirty).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @param {DrawingDocPrIdentity} identity - The identity.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function patchResidualDocPr(residual: OpenXmlElement, identity: DrawingDocPrIdentity): OpenXmlElement {
    let ts3320: any;
    const cloned: OpenXmlElement = cloneElement(residual);
    const drawing: OpenXmlElement = ((ts3320 = preferredDrawingElement(cloned)), ts3320 != null ? ts3320 : (isWml(cloned, 'drawing') ? cloned : undefined));
    if (drawing === undefined) {
        return cloned;
    }
    const inline: OpenXmlElement = findFirstElement(drawing, WP_NS, 'inline');
    const anchor: OpenXmlElement = findFirstElement(drawing, WP_NS, 'anchor');
    const host: OpenXmlElement = inline != null ? inline : anchor;
    if (host === undefined) {
        return cloned;
    }
    const docPr: OpenXmlElement = findFirstElement(host, WP_NS, 'docPr');
    if (docPr === undefined) {
        return cloned;
    }
    patchDocPrOnElement(docPr, identity);
    return cloned;
}
/**
 * Deep-clone residual and patch layout: `wp:extent`, `a:xfrm` (rot/flip/ext),
 * `a:graphicFrameLocks/@noChangeAspect`, and optional `wp:docPr` identity.
 * Preserves `wp:effectExtent` and other unmodeled siblings (layout dirty path).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @param {DrawingLayoutPatch} layout - The layout.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function patchResidualLayout(residual: OpenXmlElement, layout: DrawingLayoutPatch): OpenXmlElement {
    let ts3321: any;
    const cloned: OpenXmlElement = cloneElement(residual);
    const drawing: OpenXmlElement = ((ts3321 = preferredDrawingElement(cloned)), ts3321 != null ? ts3321 : (isWml(cloned, 'drawing') ? cloned : undefined));
    if (drawing === undefined) {
        return cloned;
    }
    const host: OpenXmlElement = preferHost(drawing);
    if (host === undefined) {
        return cloned;
    }
    const extentEl: OpenXmlElement = findFirstElement(host, WP_NS, 'extent');
    if (extentEl !== undefined) {
        setExtentAttrs(extentEl, layout.widthEmu, layout.heightEmu);
    }
    else {
        const extent: OpenXmlElement = xmlElement(WP_NS, 'wp', 'extent', {
            attributes: [attr('cx', String(layout.widthEmu)), attr('cy', String(layout.heightEmu))]
        });
        const children: OpenXmlChild[] = [...host.children];
        // Prefer before effectExtent / wrap / docPr when possible.
        const insertAt: number = children.findIndex((c: OpenXmlChild) => c.kind === 'element' &&
            (isElement(c, WP_NS, 'effectExtent') ||
                isElement(c, WP_NS, 'docPr') ||
                c.localName.startsWith('wrap')));
        if (insertAt >= 0) {
            children.splice(insertAt, 0, extent);
        }
        else {
            children.unshift(extent);
        }
        (host as {
            children: ReadonlyArray<OpenXmlChild>;
        }).children = children;
    }
    ensureXfrmOnSpPr(drawing, layout);
    patchCNvGraphicFramePr(host, layout.lockAspectRatio);
    const docPr: OpenXmlElement = findFirstElement(host, WP_NS, 'docPr');
    if (docPr !== undefined) {
        patchDocPrOnElement(docPr, layout);
    }
    return cloned;
}
/**
 * True when root is MC AlternateContent owned by drawing (Choice with drawing, not picture/ink).
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {boolean} The result.
 * @private
 */
export function isDrawingAlternateContent(root: OpenXmlElement): boolean {
    return root.namespaceUri === MC_NS && root.localName === 'AlternateContent';
}
/**
 * True when residual is a nested bare drawing child (`wps:wsp` or `wpg:grpSp`)
 * rather than a top-level `w:drawing` / MC host (TASK-8051). Nested identity
 * lives on `wps:cNvPr` / `wpg:cNvPr`, not `wp:docPr`.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {boolean} The result.
 * @private
 */
export function isNestedDrawingResidual(root: OpenXmlElement): boolean {
    if (root.namespaceUri === WPS_NS && root.localName === 'wsp') {
        return true;
    }
    if (root.namespaceUri === WPG_NS && root.localName === 'grpSp') {
        return true;
    }
    return false;
}
/**
 * Read nested `cNvPr` identity from bare `wps:wsp` / `wpg:grpSp` residual.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {DrawingDocPrIdentity} The result.
 * @private
 */
export function readCNvPrIdentity(root: OpenXmlElement): DrawingDocPrIdentity {
    let ts3322: any;
    const cNvPr: OpenXmlElement = ((ts3322 = findFirstElement(root, WPS_NS, 'cNvPr')), ts3322 != null ? ts3322 : findFirstElement(root, WPG_NS, 'cNvPr'));
    if (cNvPr === undefined) {
        return { name: undefined, title: undefined, description: undefined, docPrId: undefined };
    }
    const idRaw: string = attributeValue(cNvPr, '', 'id');
    const idParsed: number = idRaw !== undefined && /^\d+$/.test(idRaw) ? Number.parseInt(idRaw, 10) : undefined;
    const name: string = attributeValue(cNvPr, '', 'name');
    const title: string = attributeValue(cNvPr, '', 'title');
    const descr: string = attributeValue(cNvPr, '', 'descr');
    return {
        name: name !== undefined && name.length > 0 ? name : undefined,
        title: title !== undefined && title.length > 0 ? title : undefined,
        description: descr !== undefined && descr.length > 0 ? descr : undefined,
        docPrId: idParsed
    };
}
/**
 * Deep-clone nested residual and patch `cNvPr` identity attributes only
 * (identity dirty on group/canvas children — TASK-8051).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @param {DrawingDocPrIdentity} identity - The identity.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function patchResidualCNvPr(residual: OpenXmlElement, identity: DrawingDocPrIdentity): OpenXmlElement {
    let ts3323: any;
    const cloned: OpenXmlElement = cloneElement(residual);
    const cNvPr: OpenXmlElement = ((ts3323 = findFirstElement(cloned, WPS_NS, 'cNvPr')), ts3323 != null ? ts3323 : findFirstElement(cloned, WPG_NS, 'cNvPr'));
    if (cNvPr === undefined) {
        return cloned;
    }
    patchDocPrOnElement(cNvPr, identity);
    return cloned;
}

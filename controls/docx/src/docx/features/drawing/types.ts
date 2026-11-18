/**
 * Public types and shared constants for the drawing feature package.
 *
 * @private
 */
import { featureId } from '../../core/registry/index';
import { Emus, emuToPoint } from '../document/length';
import { HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, TextWrappingStyle as TextWrappingStyleType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from '../images/layout-types';
import { BodyInsets, TextAnchoring, TextAutoFit, TextBodyWrap, TextHorzOverflow, TextVerticalType, TextVertOverflow } from './body-pr';
import { ShapeFill, ShapeLine } from './sp-pr';
import { FeatureId } from '../../core/registry/feature-registry';
/**
 * @private
 */
export const DIAGRAM_GRAPHIC_DATA_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/diagram';
export const DIAGRAM_GRAPHIC_DATA_URI_STRICT: string = 'http://purl.oclc.org/ooxml/drawingml/diagram';
/**
 * Chart graphicData URIs ([ISO/IEC 29500-1:2016] §21.2 / dml-chart).
 * Drawing declines these hosts so chart markup stays opaque.
 */
export const CHART_GRAPHIC_DATA_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
export const CHART_GRAPHIC_DATA_URI_STRICT: string = 'http://purl.oclc.org/ooxml/drawingml/chart';
/**
 * Wordprocessing ink graphicData URI ([MS-ODRAWXML] §2.2.7.6).
 * Drawing declines this host so ink markup stays opaque.
 */
export const WORDPROCESSING_INK_URI: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingInk';
/** Word 2010 wordml namespace used by `w14:contentPart` ink-in-group hosts. */
export const WORDML_2010_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2010/wordml';
/** Author default for `wp:anchor/@distL` and `@distR` (EMU). */
export const ANCHOR_DEFAULT_SIDE_DIST_EMU: Emus = 114300 as Emus;
/**
 * Drawing feature id.
 *
 * @private
 */
export const DRAWING: FeatureId = featureId('drawing');
/**
 * Wordprocessing Drawing placement host (`wp:inline` or `wp:anchor`).
 *
 * Distinct from images {@link PicturePlacement} (`'anchored'`): drawing uses
 * `'anchor'` to match the `wp:anchor` element local name.
 *
 * @private
 */
export type DrawingPlacement = 'inline' | 'anchor' | 'unknown';
/**
 * Drawing run-leaf encoding (`w:drawing` / MC Choice drawing vs legacy `w:pict`).
 *
 * @private
 */
export type DrawingEncoding = 'drawingml' | 'vml';
/**
 * Drawing shape variant — the kind of drawing object hosted in the run leaf.
 *
 * Detection rules (all verified against [MS-ODRAWXML] v20260217):
 *
 * | Value | DML detection | VML counterpart |
 * |---|---|---|
 * | `'shape'` | `a:graphicData @uri = WPS_NS` + `wps:wsp` without `wps:txbx` child (§2.2.7.3, §2.13) | `v:shape` / `v:rect` without `v:textbox` |
 * | `'textBox'` | `a:graphicData @uri = WPS_NS` + `wps:wsp` with `wps:txbx` child (CT_WordprocessingShape schema §2.13.3.2) | `v:shape` / `v:rect` with `v:textbox` |
 * | `'group'` | `a:graphicData @uri = WPG_NS` + `wpg:wgp` (§2.2.7.4, §2.16) | `v:group` |
 * | `'canvas'` | `a:graphicData @uri = WPC_NS` + `wpc:wpc` (§2.2.7.5, §2.17) | — (no VML canvas) |
 * | `'unknown'` | Any other `graphicData` uri (SmartArt `dgm:`, charts `c:`, WordArt) or unrecognised VML | default |
 *
 * Members are model tokens. Prefer these constants over raw strings when
 * comparing {@link DrawingShape.variant} results.
 *
 * @public
 */
/**
 * @private
 */
export enum DrawingVariant {
    Shape = 'shape',
    TextBox = 'textBox',
    Group = 'group',
    Canvas = 'canvas',
    Unknown = 'unknown'
}
/**
 * Drawing extent in `Point` units (EMU-based).
 *
 * @private
 */
export interface DrawingExtent {
    /** Width in EMU-backed point `number` units. */
    readonly width: number;
    /** Height in EMU-backed point `number` units. */
    readonly height: number;
}
/**
 * Options for {@link Paragraph.appendShape}.
 *
 * @public
 */
export interface ShapeOptions {
    /**
     * DrawingML preset geometry (`a:prstGeom/@prst`, `ST_ShapeType`).
     * Must be a schema token; invalid values throw `content/invalid-shape`.
     */
    readonly presetGeometry: string;
    /** Display width (`wp:extent/@cx`). */
    readonly width: number;
    /** Display height (`wp:extent/@cy`). */
    readonly height: number;
    /**
     * Non-visual drawing name (`wp:docPr/@name`).
     * @defaultValue `'Shape'`
     */
    readonly name?: string;
    /** Caption / accessibility title (`wp:docPr/@title`). */
    readonly title?: string;
    /** Alternative text (`wp:docPr/@descr`). */
    readonly description?: string;
    /**
     * Host placement. Default `'anchor'` (GO Q2).
     * @defaultValue `'anchor'`
     */
    readonly placement?: 'inline' | 'anchor';
    /**
     * Clockwise rotation in degrees (`a:xfrm/@rot`). Wire = degrees × 60000.
     * @defaultValue `0`
     */
    readonly rotation?: number;
    /**
     * Aspect-ratio lock (`a:graphicFrameLocks/@noChangeAspect`).
     * Author default `true`; missing locks on load read as `false` (images parity).
     * Flag only — width/height setters do **not** auto-recompute the sibling dimension.
     * @defaultValue `true`
     */
    readonly lockAspectRatio?: boolean;
    /** Horizontal flip (`a:xfrm/@flipH`). @defaultValue `false` */
    readonly flipHorizontal?: boolean;
    /** Vertical flip (`a:xfrm/@flipV`). @defaultValue `false` */
    readonly flipVertical?: boolean;
    /**
     * Text wrapping style. `'inline'` forces `wp:inline`; any other value promotes
     * to `wp:anchor` with the matching `wp:wrap*` child.
     * Prefer this over {@link placement} when both are set.
     * @defaultValue inferred from {@link placement} (`inline` or `none`)
     */
    readonly wrappingStyle?: TextWrappingStyleType;
    /**
     * Distance from text above the shape (`wp:* @distT`).
     * Anchor author default `0`.
     */
    readonly distanceTop?: number;
    /**
     * Distance from text below the shape (`wp:* @distB`).
     * Anchor author default `0`.
     */
    readonly distanceBottom?: number;
    /**
     * Distance from text to the left of the shape (`wp:* @distL`).
     * Anchor author default `emuToPoint(114300)`.
     */
    readonly distanceLeft?: number;
    /**
     * Distance from text to the right of the shape (`wp:* @distR`).
     * Anchor author default `emuToPoint(114300)`.
     */
    readonly distanceRight?: number;
    /**
     * Whether the shape is behind document text (`wp:anchor/@behindDoc`).
     * Meaningful on anchor hosts only. @defaultValue `false`
     */
    readonly behindDocument?: boolean;
    /**
     * Horizontal origin (`wp:positionH/@relativeFrom`, `ST_RelFromH`).
     * Meaningful on anchor hosts; ignored for `"inline"` placement.
     * @defaultValue `'column'` when absent on a new anchor
     */
    readonly horizontalOrigin?: HorizontalOriginType;
    /**
     * Vertical origin (`wp:positionV/@relativeFrom`, `ST_RelFromV`).
     * Meaningful on anchor hosts; ignored for `"inline"` placement.
     * @defaultValue `'paragraph'` when absent on a new anchor
     */
    readonly verticalOrigin?: VerticalOriginType;
    /**
     * Horizontal offset (`wp:positionH/wp:posOffset`). Negative values are
     * schema-legal (`ST_PositionOffset` is `xsd:int`).
     * Mutually exclusive with {@link horizontalAlignment} — the later assignment wins.
     */
    readonly horizontalPosition?: number;
    /**
     * Vertical offset (`wp:positionV/wp:posOffset`). Negative values are
     * schema-legal (`ST_PositionOffset` is `xsd:int`).
     * Mutually exclusive with {@link verticalAlignment} — the later assignment wins.
     */
    readonly verticalPosition?: number;
    /**
     * Horizontal alignment (`wp:positionH/wp:align`, `ST_AlignH`).
     * Mutually exclusive with {@link horizontalPosition}.
     */
    readonly horizontalAlignment?: HorizontalAlignmentType;
    /**
     * Vertical alignment (`wp:positionV/wp:align`, `ST_AlignV`).
     * Mutually exclusive with {@link verticalPosition}.
     */
    readonly verticalAlignment?: VerticalAlignmentType;
    /**
     * Lock anchor (`wp:anchor/@locked`): the anchor position must not be modified
     * at runtime by an application editing the document — ECMA-376-1 §20.4.2.1
     * `@locked` @defaultValue `false`
     */
    readonly lockAnchor?: boolean;
    /**
     * Allow overlap (`wp:anchor/@allowOverlap`). @defaultValue `true`
     */
    readonly allowOverlap?: boolean;
    /**
     * Layout in table cell (`wp:anchor/@layoutInCell`). @defaultValue `true`
     */
    readonly layoutInCell?: boolean;
    /**
     * Fill MVP (`a:solidFill` / `a:noFill`). Only `solid` and `none` are authorable.
     * @defaultValue omitted (Word theme / no explicit fill on wire)
     */
    readonly fill?: ShapeFill | undefined;
    /**
     * Line MVP (`a:ln`). Only `solid` and `none` are authorable.
     * @defaultValue omitted (theme / no explicit line on wire)
     */
    readonly line?: ShapeLine | undefined;
    /**
     * Author a text box variant (`wps:txbx` + `w:txbxContent`). When true the
     * shape hosts a block body — minimum one empty `w:p` (TASK-8049 GO Q6);
     * `wps:bodyPr` is emitted (required on `wps:wsp`). Author richer content via
     * {@link Shape.items} / {@link Shape.insertBodyItemAt} after creation.
     */
    readonly textBox?: boolean;
    /**
     *    * Modeled `wps:bodyPr` state for the authored text box (TASK-8049).
     * Only valid when {@link textBox} is true.
     */
    readonly bodyProperty?: ShapeBodyPrOptions | undefined;
}
/**
 * Options for {@link Paragraph.appendGroup}.
 *
 * Authors an empty wordprocessing group (`wpg:wgp` under dual AC
 * `Requires="wpg"`). Nested children are added via
 * {@link GroupShape.appendShape} on the returned group (TASK-8051).
 * No leaf geometry/fill/line/textBox fields — groups are hosts only.
 *
 *
 * @private
 */
export interface GroupOptions {
    /** Display width (`wp:extent/@cx`). */
    readonly width: number;
    /** Display height (`wp:extent/@cy`). */
    readonly height: number;
    /**
     * Non-visual drawing name (`wp:docPr/@name`).
     * @defaultValue `'Group'`
     */
    readonly name?: string;
    /** Caption / accessibility title (`wp:docPr/@title`). */
    readonly title?: string;
    /** Alternative text (`wp:docPr/@descr`). */
    readonly description?: string;
    /**
     * Host placement. Default `'anchor'` (GO Q2 / TASK-8051 parity with appendShape).
     * @defaultValue `'anchor'`
     */
    readonly placement?: 'inline' | 'anchor';
    /**
     * Clockwise rotation in degrees (`a:xfrm/@rot` on `wpg:grpSpPr`).
     * @defaultValue `0`
     */
    readonly rotation?: number;
    /**
     * Aspect-ratio lock (`a:graphicFrameLocks/@noChangeAspect`).
     * @defaultValue `true`
     */
    readonly lockAspectRatio?: boolean;
    /** Horizontal flip (`a:xfrm/@flipH`). @defaultValue `false` */
    readonly flipHorizontal?: boolean;
    /** Vertical flip (`a:xfrm/@flipV`). @defaultValue `false` */
    readonly flipVertical?: boolean;
    /**
     * Text wrapping style. `'inline'` forces `wp:inline`; any other value promotes
     * to `wp:anchor` with the matching `wp:wrap*` child.
     * Prefer this over {@link placement} when both are set.
     * @defaultValue inferred from {@link placement} (`inline` or `none`)
     */
    readonly wrappingStyle?: TextWrappingStyleType;
    /** Distance from text above the group (`wp:* @distT`). */
    readonly distanceTop?: number;
    /** Distance from text below the group (`wp:* @distB`). */
    readonly distanceBottom?: number;
    /** Distance from text to the left of the group (`wp:* @distL`). */
    readonly distanceLeft?: number;
    /** Distance from text to the right of the group (`wp:* @distR`). */
    readonly distanceRight?: number;
    /**
     * Whether the group is behind document text (`wp:anchor/@behindDoc`).
     * @defaultValue `false`
     */
    readonly behindDocument?: boolean;
    /** Horizontal origin (`wp:positionH/@relativeFrom`). @defaultValue `'column'` on anchor */
    readonly horizontalOrigin?: HorizontalOriginType;
    /** Vertical origin (`wp:positionV/@relativeFrom`). @defaultValue `'paragraph'` on anchor */
    readonly verticalOrigin?: VerticalOriginType;
    /** Horizontal offset (`wp:positionH/wp:posOffset`). XOR with {@link horizontalAlignment}. */
    readonly horizontalPosition?: number;
    /** Vertical offset (`wp:positionV/wp:posOffset`). XOR with {@link verticalAlignment}. */
    readonly verticalPosition?: number;
    /** Horizontal alignment (`wp:positionH/wp:align`). */
    readonly horizontalAlignment?: HorizontalAlignmentType;
    /** Vertical alignment (`wp:positionV/wp:align`). */
    readonly verticalAlignment?: VerticalAlignmentType;
    /** Lock anchor (`wp:anchor/@locked`). @defaultValue `false` */
    readonly lockAnchor?: boolean;
    /** Allow overlap (`wp:anchor/@allowOverlap`). @defaultValue `true` */
    readonly allowOverlap?: boolean;
    /** Layout in table cell (`wp:anchor/@layoutInCell`). @defaultValue `true` */
    readonly layoutInCell?: boolean;
}
/**
 * bodyPr author options for {@link ShapeOptions.bodyProperty}
 * (`wps:bodyPr` / `CT_TextBodyProperties` MVP — TASK-8049).
 *
 * @public
 */
export interface ShapeBodyPrOptions {
    /** Text anchor (`@anchor`, `ST_TextAnchoringType`). */
    readonly verticalAnchor?: TextAnchoring | undefined;
    /** Center anchoring (`@anchorCtr`). */
    readonly anchorCenter?: boolean | undefined;
    /** Vertical text type (`@vert`, `ST_TextVerticalType`). */
    readonly textDirection?: TextVerticalType | undefined;
    /** Text wrap inside shape (`@wrap`, `none|square only per schema). */
    readonly textWrapInside?: TextBodyWrap | undefined;
    /**
     * @private
     * Vertical text overflow (`@vertOverflow`). */
    readonly verticalOverflow?: TextVertOverflow | undefined;
    /**
     * @private
     * Horizontal text overflow (`@horzOverflow`). */
    readonly horizontalOverflow?: TextHorzOverflow | undefined;
    /**
     * @private
     * WordArt source flag (`@fromWordArt`). */
    readonly fromWordArt?: boolean | undefined;
    /** Text insets (`@lIns`/`@tIns`/`@rIns`/`@bIns`, EMU ≥ 0). */
    readonly insets?: BodyInsets | undefined;
    /** Autofit choice (`a:noAutofit` | `a:normAutofit` | `a:spAutoFit`). */
    readonly autoFit?: TextAutoFit | undefined;
}

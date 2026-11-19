import { arrayItem } from '../../core/compat/array-compat';
import { pointToTwips, twipsToPoint } from './length';
import { objectValues } from '../../core/compat/object-compat';
import { DocxError } from '../../core/errors/docx-error';
import { OpenXmlElement } from '../../core/xml/index';
import { alignmentFromJc, jcForNewAlignment, ParagraphAlignment } from './alignment';
import { Color, colorToHexWire } from './color';
import { parseOnOff, serializeOnOff } from './on-off';
import { BorderStyle as BorderStyleEnum } from './page-setup';
import {
    elementChildren,
    isWml,
    wValAttribute,
    wmlAttr,
    wmlElement
} from './wml';
import {
    CnfStyle,
    NormalizedCnfStyle,
    cnfStyleIsEmpty,
    normalizeCnfStyle,
    parseCnfStyle,
    serializeCnfStyle
} from '../tables/tbl-pr';
import { OpenXmlAttribute } from '../../core/xml/model';

// ---------------------------------------------------------------------------
// ParagraphFormat-owned pPr sub-types — §17.3.1 ECMA-376 Part 1
// ---------------------------------------------------------------------------

/**
 * Line spacing rule (`ST_LineSpacingRule`). §17.18.48
 * @public
 */
export type LineSpacingRule = 'auto' | 'exact' | 'atLeast';
/**
 * Tab stop justification / alignment (`ST_TabJc`). §17.18.83
 *
 * Prefer named members such as {@link TabJustification.Left} in authoring APIs.
 * Wire tokens are the member values and are unchanged for serialization.
 *
 * @public
 */
export enum TabJustification {
    Left = 'left',
    Center = 'center',
    Right = 'right',
    Decimal = 'decimal',
    Bar = 'bar',
    Clear = 'clear',
    Num = 'num',
    Start = 'start',
    End = 'end'
}
/**
 * Alias of {@link TabJustification} kept for older `TabStop.alignment` typing.
 *
 * @public
 */
export type TabStopAlignment = TabJustification;
/**
 * Tab stop leader character (`ST_TabTlc`). §17.18.84
 *
 * Prefer named members such as {@link TabLeader.Dot} / {@link TabLeader.NoLeader}.
 * Wire tokens are the member values and are unchanged for serialization.
 *
 * @public
 */
export enum TabLeader {
    NoLeader = 'none',
    Dot = 'dot',
    Heavy = 'heavy',
    Hyphen = 'hyphen',
    MiddleDot = 'middleDot',
    Single = 'single'
}
/**
 * Alias of {@link TabLeader} kept for older `TabStop.leader` typing.
 *
 * @public
 */
export type TabStopLeader = TabLeader;
/**
 * A single tab stop (`w:tab` inside `w:tabs`). §17.3.1.37
 * @public
 */
export interface TabStop {
    /** `@w:pos` — position in points (twips on the wire). */
    readonly position: number;
    /** `@w:val` — alignment. */
    readonly alignment: TabJustification;
    /** `@w:leader` — leader character. */
    readonly leader?: TabLeader;
}
/**
 * Mutable DocIO-style tab-stop entry backed by {@link TabStop} storage.
 * Distinct from run-level `w:r/w:tab` ({@link Tab}).
 *
 * @public
 */
export class ParagraphTabStop {
    private positionValue: number;
    private justificationValue: TabJustification;
    private leaderValue: TabLeader;
    /**
     * @param {number} position - The position.
     * @param {TabJustification} justification - The justification.
     * @param {TabLeader} leader - The leader.
     * @public
     */
    constructor(
        position: number = 0,
        justification: TabJustification = TabJustification.Left,
        leader: TabLeader = TabLeader.NoLeader
    ) {
        this.positionValue = position;
        this.justificationValue = justification;
        this.leaderValue = leader;
    }
    /** Position in points. */
    get position(): number {
        return this.positionValue;
    }
    set position(value: number) {
        this.positionValue = value;
    }
    /** Alignment / justification (`@w:val`). */
    get justification(): TabJustification {
        return this.justificationValue;
    }
    set justification(value: TabJustification) {
        this.justificationValue = value;
    }
    /** Alias of {@link ParagraphTabStop.justification}. */
    get alignment(): TabStopAlignment {
        return this.justificationValue;
    }
    set alignment(value: TabStopAlignment) {
        this.justificationValue = value;
    }
    /** Leader character. */
    get leader(): TabLeader {
        return this.leaderValue;
    }
    set leader(value: TabLeader) {
        this.leaderValue = value;
    }
    /**
     *  @private
     *
     * @returns {TabStop} The result.
     */
    toBagStop(): TabStop {
        const stop: TabStop = {
            position: this.positionValue,
            alignment: this.justificationValue
        };
        if (this.leaderValue !== TabLeader.NoLeader) {
            return { position: this.positionValue, alignment: this.justificationValue, leader: this.leaderValue };
        }
        return stop;
    }
    /**
     *  @private
     *
     * @param {TabStop} stop - The stop.
     * @returns {ParagraphTabStop} The result.
     */
    static fromTabStop(stop: TabStop): ParagraphTabStop {
        return new ParagraphTabStop(
            stop.position,
            stop.alignment,
            stop.leader !== undefined ? stop.leader : TabLeader.NoLeader
        );
    }
}
/**
 * Live collection over paragraph tab stops. Mirrors bag {@link ParagraphFormat.tabStops}.
 *
 * @public
 */
export class TabCollection {
    private readonly owner: ParagraphFormat;
    /**
     *  @private
     *
     * @param {ParagraphFormat} owner - The owner.
     */
    constructor(owner: ParagraphFormat) {
        this.owner = owner;
    }
    /** Number of tab stops. */
    get count(): number {
        const stops: TabStop[] = this.owner.tabStops;
        return stops !== undefined ? stops.length : 0;
    }
    /**
     * Tab stop at index, or `undefined`.
     *
     * @param {number} index - The index.
     * @returns {ParagraphTabStop | undefined} The result.
     */
    item(index: number): ParagraphTabStop | undefined {
        const stops: TabStop[] = this.owner.tabStops;
        if (stops === undefined || index < 0 || index >= stops.length) {
            return undefined;
        }
        return ParagraphTabStop.fromTabStop(arrayItem(stops, index));
    }
    /**
     * Add a tab stop (points / justification / leader).
     * Prefer {@link TabCollection.addTab} for DocIO-aligned naming.
     *
     * @param {number} position - The position.
     * @param {TabJustification} justification - The justification.
     * @param {TabLeader} leader - The leader.
     * @returns {ParagraphTabStop} The result.
     */
    add(position: number, justification?: TabJustification, leader?: TabLeader): ParagraphTabStop {
        return this.addTab(position, justification, leader);
    }
    /**
     * DocIO-aligned add. Zero-arg adds a default left stop at position `0`.
     *
     * @param {number} position - The position.
     * @param {TabJustification} justification - The justification.
     * @param {TabLeader} leader - The leader.
     * @returns {ParagraphTabStop} The result.
     * @example
     * ```ts
     * pf.tabs.addTab();
     * pf.tabs.addTab(36);
     * pf.tabs.addTab(72, TabJustification.Right, TabLeader.Dot);
     * ```
     */
    addTab(position?: number, justification?: TabJustification, leader?: TabLeader): ParagraphTabStop {
        const entry: ParagraphTabStop = new ParagraphTabStop(
            position !== undefined ? position : 0,
            justification !== undefined ? justification : TabJustification.Left,
            leader !== undefined ? leader : TabLeader.NoLeader
        );
        const current: TabStop[] = this.owner.tabStops;
        const next: TabStop[] = current !== undefined ? current.slice() : [];
        next.push(entry.toBagStop());
        this.owner.tabStops = next;
        return entry;
    }
    /**
     * Remove the tab stop at `index` (`0…count-1`).
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @throws RangeError when the index is out of range.
     */
    removeAt(index: number): void {
        const stops: TabStop[] = this.owner.tabStops;
        if (stops === undefined || index < 0 || index >= stops.length) {
            throw new RangeError('TabCollection.removeAt: index out of range');
        }
        if (stops.length === 1) {
            this.owner.tabStops = undefined;
            return;
        }
        const next: TabStop[] = stops.slice();
        next.splice(index, 1);
        this.owner.tabStops = next;
    }
    /**
     * Remove the first tab stop whose position equals `position` (points).
     * No-op when no matching stop exists.
     *
     * @param {number} position - The position.
     * @returns {void} Nothing is returned.
     */
    removeByPosition(position: number): void {
        const stops: TabStop[] = this.owner.tabStops;
        if (stops === undefined) {
            return;
        }
        let found: number = -1;
        for (const [i, stop] of stops.entries()) {
            if (stop.position === position) {
                found = i;
                break;
            }
        }
        if (found < 0) {
            return;
        }
        this.removeAt(found);
    }
    /**
     *  Remove all tab stops.
     *
     * @returns {void} Nothing is returned.
     */
    clear(): void {
        this.owner.tabStops = undefined;
    }
}
/**
 * Live single paragraph border edge (`w:pBdr` child).
 *
 * @public
 */
export class ParagraphBorderFace {
    private readonly owner: ParagraphFormat;
    private readonly edge: keyof ParagraphBorders;
    /**
     *  @private
     *
     * @param {ParagraphFormat} owner - The owner.
     * @param {ParagraphBorders} edge - The edge.
     */
    constructor(owner: ParagraphFormat, edge: keyof ParagraphBorders) {
        this.owner = owner;
        this.edge = edge;
    }
    private read(): ParagraphBorder | undefined {
        const bag: ParagraphBorders = this.owner.readBordersBag();
        return bag !== undefined ? bag[this.edge] : undefined;
    }
    private write(next: ParagraphBorder | undefined): void {
        const existing: ParagraphBorders = this.owner.readBordersBag();
        const bag: {
            top?: ParagraphBorder;
            left?: ParagraphBorder;
            bottom?: ParagraphBorder;
            right?: ParagraphBorder;
            between?: ParagraphBorder;
            bar?: ParagraphBorder;
        } = existing !== undefined ? { ...existing } : {};
        if (next === undefined) {
            delete bag[this.edge];
        }
        else {
            bag[this.edge] = next;
        }
        const empty: boolean =
            bag.top === undefined
            && bag.left === undefined
            && bag.bottom === undefined
            && bag.right === undefined
            && bag.between === undefined
            && bag.bar === undefined;
        this.owner.writeBordersBag(empty ? undefined : bag);
    }
    /** Line style. */
    get borderType(): BorderStyle {
        const e: ParagraphBorder = this.read();
        return e !== undefined ? e.style : 'none';
    }
    set borderType(value: BorderStyle) {
        const cur: ParagraphBorder = this.read();
        this.write({
            style: value,
            color: cur !== undefined ? cur.color : undefined,
            size: cur !== undefined ? cur.size : undefined,
            space: cur !== undefined ? cur.space : undefined
        });
    }
    /** Hex RGB or `'auto'`. Setter also accepts a {@link Color} enum value. */
    get color(): string | Color {
        const e: ParagraphBorder = this.read();
        return e !== undefined && e.color !== undefined ? e.color : 'auto';
    }
    set color(value: string | Color) {
        const cur: ParagraphBorder = this.read();
        this.write({
            style: cur !== undefined ? cur.style : 'single',
            color: borderColorToWire(value),
            size: cur !== undefined ? cur.size : undefined,
            space: cur !== undefined ? cur.space : undefined
        });
    }
    /** Thickness in points (public); stored as eighths of a point. */
    get lineWidth(): number {
        const e: ParagraphBorder = this.read();
        return e !== undefined && e.size !== undefined ? e.size / 8 : 0;
    }
    set lineWidth(value: number) {
        const cur: ParagraphBorder = this.read();
        this.write({
            style: cur !== undefined ? cur.style : 'single',
            color: cur !== undefined ? cur.color : undefined,
            size: Math.round(value * 8),
            space: cur !== undefined ? cur.space : undefined
        });
    }
    /** Space from text in points. */
    get space(): number {
        const e: ParagraphBorder = this.read();
        return e !== undefined && e.space !== undefined ? e.space : 0;
    }
    set space(value: number) {
        const cur: ParagraphBorder = this.read();
        this.write({
            style: cur !== undefined ? cur.style : 'single',
            color: cur !== undefined ? cur.color : undefined,
            size: cur !== undefined ? cur.size : undefined,
            space: value
        });
    }
}
/**
 * Live paragraph borders with per-edge access. Whole-bag assign/clear via
 * {@link ParagraphFormat.setBorders}.
 *
 * @public
 */
export class ParagraphBordersFace {
    private readonly owner: ParagraphFormat;
    private topFace: ParagraphBorderFace | undefined;
    private leftFace: ParagraphBorderFace | undefined;
    private bottomFace: ParagraphBorderFace | undefined;
    private rightFace: ParagraphBorderFace | undefined;
    private betweenFace: ParagraphBorderFace | undefined;
    private barFace: ParagraphBorderFace | undefined;
    /**
     *  @private
     *
     * @param {ParagraphFormat} owner - The owner.
     */
    constructor(owner: ParagraphFormat) {
        this.owner = owner;
    }
    get top(): ParagraphBorderFace {
        if (this.topFace === undefined) {
            this.topFace = new ParagraphBorderFace(this.owner, 'top');
        }
        return this.topFace;
    }
    get left(): ParagraphBorderFace {
        if (this.leftFace === undefined) {
            this.leftFace = new ParagraphBorderFace(this.owner, 'left');
        }
        return this.leftFace;
    }
    get bottom(): ParagraphBorderFace {
        if (this.bottomFace === undefined) {
            this.bottomFace = new ParagraphBorderFace(this.owner, 'bottom');
        }
        return this.bottomFace;
    }
    get right(): ParagraphBorderFace {
        if (this.rightFace === undefined) {
            this.rightFace = new ParagraphBorderFace(this.owner, 'right');
        }
        return this.rightFace;
    }
    get between(): ParagraphBorderFace {
        if (this.betweenFace === undefined) {
            this.betweenFace = new ParagraphBorderFace(this.owner, 'between');
        }
        return this.betweenFace;
    }
    get bar(): ParagraphBorderFace {
        if (this.barFace === undefined) {
            this.barFace = new ParagraphBorderFace(this.owner, 'bar');
        }
        return this.barFace;
    }
    /**
     *  Stamp line style onto all outer edges.
     *
     * @param {BorderStyle} value - The value.
     * @returns {void} Nothing is returned.
     */
    set borderType(value: BorderStyle) {
        this.top.borderType = value;
        this.left.borderType = value;
        this.bottom.borderType = value;
        this.right.borderType = value;
    }
    /**
     *  Stamp color onto all outer edges (hex/`'auto'` or {@link Color}).
     *
     * @param {string | Color} value - The value.
     * @returns {void} Nothing is returned.
     */
    set color(value: string | Color) {
        this.top.color = value;
        this.left.color = value;
        this.bottom.color = value;
        this.right.color = value;
    }
    /**
     *  Stamp line width (points) onto all outer edges.
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    set lineWidth(value: number) {
        this.top.lineWidth = value;
        this.left.lineWidth = value;
        this.bottom.lineWidth = value;
        this.right.lineWidth = value;
    }
    /**
     *  Stamp space from text (points) onto all outer edges.
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    set space(value: number) {
        this.top.space = value;
        this.left.space = value;
        this.bottom.space = value;
        this.right.space = value;
    }
}

/**
 * Normalize border color input to wire hex / `'auto'`.
 *
 * @param {string | Color} value - The value.
 * @returns {string} The result.
 * @private
 */
function borderColorToWire(value: string | Color): string {
    if (typeof value === 'number') {
        const hex: string = colorToHexWire(value);
        return hex.length > 0 ? hex : 'auto';
    }
    return value;
}

/**
 * Normalize shading fill/pattern-color input to wire hex / `'auto'`.
 * {@link Color} enum values become OOXML hex; {@link Color.Transparent}
 * maps to `'auto'`. Plain strings pass through for load-path compatibility.
 *
 * @param {string | Color} value - The value.
 * @returns {string} The result.
 * @private
 */
function shadingColorToWire(value: string | Color): string {
    if (typeof value === 'number') {
        const hex: string = colorToHexWire(value);
        return hex.length > 0 ? hex : 'auto';
    }
    return value;
}
/**
 * Paragraph border line style (`ST_Border` subset on `CT_Border/@w:val`).
 *
 * Authoring accepts string literals such as `'single'`; invalid tokens such as
 * `'abc'` fail at compile time. Wire tokens match the page-setup `BorderStyle`
 * enum; runtime known-set is derived from that enum (see `BORDER_STYLES`).
 *
 * @public
 */
export type BorderStyle =
    | 'nil'
    | 'none'
    | 'single'
    | 'thick'
    | 'double'
    | 'dotted'
    | 'dashed'
    | 'dotDash'
    | 'dotDotDash'
    | 'triple'
    | 'thinThickSmallGap'
    | 'thickThinSmallGap'
    | 'thinThickThinSmallGap'
    | 'thinThickMediumGap'
    | 'thickThinMediumGap'
    | 'thinThickThinMediumGap'
    | 'thinThickLargeGap'
    | 'thickThinLargeGap'
    | 'thinThickThinLargeGap'
    | 'wave'
    | 'doubleWave'
    | 'dashSmallGap'
    | 'dashDotStroked'
    | 'threeDEmboss'
    | 'threeDEngrave'
    | 'outset'
    | 'inset';
/**
 * A single paragraph border edge (`CT_Border`). §17.3.4
 * @public
 */
export interface ParagraphBorder {
    /** `@w:val` — border style (`ST_Border`). */
    readonly style: BorderStyle;
    /** `@w:color` — hex color or `'auto'`. */
    readonly color?: string;
    /** `@w:sz` — border width in eighths-of-a-point. */
    readonly size?: number;
    /** `@w:space` — space from text in points. */
    readonly space?: number;
}
/**
 * Paragraph borders (`w:pBdr`). §17.3.1.24
 * @public
 */
export interface ParagraphBorders {
    readonly top?: ParagraphBorder;
    readonly left?: ParagraphBorder;
    readonly bottom?: ParagraphBorder;
    readonly right?: ParagraphBorder;
    readonly between?: ParagraphBorder;
    readonly bar?: ParagraphBorder;
}
/**
 * Shading pattern (`ST_Shd` subset). §17.18.78
 * @public
 */
export type ShadingPattern = 'clear' | 'solid' | 'horzStripe' | 'vertStripe' | 'reverseDiagStripe' | 'diagStripe' | 'horzCross' | 'diagCross' | 'thinHorzStripe' | 'thinVertStripe' | 'thinReverseDiagStripe' | 'thinDiagStripe' | 'thinHorzCross' | 'thinDiagCross' | 'pct5' | 'pct10' | 'pct12' | 'pct15' | 'pct20' | 'pct25' | 'pct30' | 'pct35' | 'pct37' | 'pct40' | 'pct45' | 'pct50' | 'pct55' | 'pct60' | 'pct62' | 'pct65' | 'pct70' | 'pct75' | 'pct80' | 'pct85' | 'pct87' | 'pct90' | 'pct95';
/**
 * Paragraph text direction (`ST_TextDirection`). §17.18.93 / wml.xsd 798–813.
 * Twelve schema tokens; unknown loaded values round-trip via the format raw slot.
 * @public
 */
export type ParagraphTextDirection =
    | 'lr'
    | 'rl'
    | 'tb'
    | 'tbV'
    | 'rlV'
    | 'lrV'
    | 'btLr'
    | 'lrTb'
    | 'lrTbV'
    | 'tbLrV'
    | 'tbRl'
    | 'tbRlV';

/**
 * Paragraph indentation bag (`w:ind`). §17.3.1.12
 * Used by styles modeled payload codecs — not a `Paragraph` property surface.
 * Body authoring uses flat {@link ParagraphFormat} indent properties.
 * `left` may be negative (e.g. outdented list text).
 * @public
 */
export interface ParagraphIndentation {
    /** `@w:left` in points (twips on the wire); may be negative. */
    readonly left?: number;
    /** `@w:right` in points (twips on the wire). */
    readonly right?: number;
    /** `@w:firstLine` in points (twips on the wire). Mutually exclusive with `hanging`. */
    readonly firstLine?: number;
    /** `@w:hanging` in points (twips on the wire). Mutually exclusive with `firstLine`. */
    readonly hanging?: number;
}
/**
 * Paragraph spacing bag (`w:spacing`). §17.3.1.33
 * Used by styles modeled payload codecs — not a `Paragraph` property surface.
 * Body authoring uses flat {@link ParagraphFormat} spacing properties.
 * @public
 */
export interface ParagraphSpacing {
    /** `@w:before` — space before paragraph, in points (twips on the wire). */
    readonly before?: number;
    /** `@w:after` — space after paragraph, in points (twips on the wire). */
    readonly after?: number;
    /**
     * `@w:line` — line spacing in points (`w:lineRule` determines interpretation;
     * twips on the wire). Prefer {@link ParagraphSpacing.lineSpacing} in styles authoring.
     */
    readonly line?: number;
    /**
     * `@w:line` — line spacing in points (twips on the wire). Alias of
     * {@link ParagraphSpacing.line} used by the styles feature codec and builtin catalog.
     */
    readonly lineSpacing?: number;
    /** `@w:lineRule` — how `line` / `lineSpacing` is interpreted. */
    readonly lineRule?: LineSpacingRule;
    /** `@w:beforeAutospacing` — ignore `before` and use automatic spacing. */
    readonly beforeAutospacing?: boolean;
    /** `@w:afterAutospacing` — ignore `after` and use automatic spacing. */
    readonly afterAutospacing?: boolean;
}
/**
 * Paragraph shading bag (`w:shd`). §17.3.1.31
 * Used where a value-bag is required — not a `Paragraph` property surface.
 * Body authoring uses flat {@link ParagraphFormat} `backColor` / `foreColor` /
 * `shadingPattern`.
 * @public
 */
export interface ParagraphShading {
    /** `@w:fill` — background fill color (hex or `'auto'`). */
    readonly fill?: string;
    /** `@w:color` — pattern foreground color (hex or `'auto'`). */
    readonly color?: string;
    /** `@w:val` — shading pattern. */
    readonly pattern?: ShadingPattern;
}

/**
 * Baseline alignment for the paragraph's lines (`ST_TextAlignment`,
 * `w:textAlignment`). §17.3.1.39.
 * @public
 */
export type BaselineAlignment = 'auto' | 'top' | 'center' | 'baseline' | 'bottom';

/**
 * Host that owns a {@link ParagraphFormat} and receives mutation
 * notifications. Implemented by {@link Paragraph} — the host performs the
 * owner (detachment) check and invalidation.
 * @private
 */
export interface ParagraphFormatHost {
    notifyParagraphFormatMutation(): void;
    /**
     * Optional effective resolver (Paragraph host). Style-hosted PF must omit this
     * so public getters stay direct/authored-only for style-chain walks.
     * @private
     */
    resolveEffectiveParagraphValue?(key: string): unknown;
}

/**
 * @private
 * Internal indents record (`w:ind`) — round-trip slots for spellings not
 * surfaced on the public flat properties. Authored values live in the flat
 * `*Indent` properties; `start`/`end`/`*Chars` twins are preserved verbatim
 * here when loaded and re-emitted on no-op saves.
 */
export interface ParagraphIndentsRecord {
    left?: number;
    right?: number;
    firstLine?: number;
    hanging?: number;
    start?: number;
    end?: number;
    leftChars?: number;
    rightChars?: number;
    firstLineChars?: number;
    hangingChars?: number;
}

/**
 * @private
 * Internal spacing record (`w:spacing`) — authored values in the flat
 * properties plus `@w:beforeLines`/`@w:afterLines` round-trip slots.
 */
export interface ParagraphSpacingRecord {
    before?: number;
    after?: number;
    line?: number;
    lineRule?: LineSpacingRule;
    beforeAutospacing?: boolean;
    afterAutospacing?: boolean;
    beforeLines?: number;
    afterLines?: number;
}

/**
 * @private
 * Formatting snapshot for hydrate/serialize (ParagraphFormat module).
 * Wire-unit storage (twips numbers) for exact round-trips; the public
 * accessors convert to points.
 */
export interface ParagraphFormatSnapshot {
    pPrExtra: OpenXmlElement[];
    /** Raw `w:jc/@w:val` (unknown values preserved verbatim). */
    jcRaw: string | undefined;
    keepNextValue: boolean | undefined;
    keepLinesValue: boolean | undefined;
    pageBreakBeforeValue: boolean | undefined;
    /** API-only (no ECMA `w:pPr` child); store/hydrate/snapshot only. */
    pageBreakAfterValue: boolean | undefined;
    widowControlValue: boolean | undefined;
    bidiValue: boolean | undefined;
    outlineLevelValue: number | undefined;
    indentsValue: ParagraphIndentsRecord | undefined;
    spacingValue: ParagraphSpacingRecord | undefined;
    tabStopsValue: TabStop[] | undefined;
    bordersValue: ParagraphBorders | undefined;
    shadingValue: ParagraphShading | undefined;
    suppressAutoHyphensValue: boolean | undefined;
    suppressLineNumbersValue: boolean | undefined;
    contextualSpacingValue: boolean | undefined;
    mirrorIndentsValue: boolean | undefined;
    adjustRightIndentValue: boolean | undefined;
    textDirectionValue: ParagraphTextDirection | undefined;
    /** Raw `w:textDirection/@w:val` for out-of-union tokens (round-trip only). */
    textDirectionRaw: string | undefined;
    baselineAlignmentValue: BaselineAlignment | undefined;
    /** Raw `w:textAlignment/@w:val` for out-of-union tokens. */
    baselineAlignmentRaw: string | undefined;
    snapToGridValue: boolean | undefined;
    wordWrapValue: boolean | undefined;
    overflowPunctuationValue: boolean | undefined;
    autoSpaceDEValue: boolean | undefined;
    autoSpaceDNValue: boolean | undefined;
    /**
     * Round-trip only — `w:kinsoku`.
     *
     * @private
     */
    kinsokuValue: boolean | undefined;
    /**
     * Round-trip only — `w:topLinePunct`.
     *
     * @private
     */
    topLinePunctuationValue: boolean | undefined;
}

/**
 * Batch-assign delta for {@link ParagraphFormat.assign}. One optional key
 * per public property (points / booleans / string unions — no `Length`
 * brand, ADR D1).
 *
 *  Internal assign delta. Not part of the public API.
 *
 * @private
 */
export interface ParagraphFormatDelta {
    horizontalAlignment?: ParagraphAlignment;
    keepFollow?: boolean;
    keepLines?: boolean;
    pageBreakBefore?: boolean;
    /** API-only; not serialized to OOXML. */
    pageBreakAfter?: boolean;
    widowControl?: boolean;
    bidi?: boolean;
    outlineLevel?: number;
    leftIndent?: number;
    rightIndent?: number;
    firstLineIndent?: number;
    beforeSpacing?: number;
    afterSpacing?: number;
    beforeAutospacing?: boolean;
    afterAutospacing?: boolean;
    beforeLines?: number;
    afterLines?: number;
    lineSpacing?: number;
    lineSpacingRule?: LineSpacingRule;
    lineSpacingCount?: number;
    tabStops?: TabStop[];
    borders?: ParagraphBorders;
    /** Hex `RRGGBB` / `'auto'`, or a {@link Color} enum value. */
    backColor?: string | Color;
    /** Hex `RRGGBB` / `'auto'`, or a {@link Color} enum value. */
    foreColor?: string | Color;
    shadingPattern?: ShadingPattern;
    suppressAutoHyphens?: boolean;
    suppressLineNumbers?: boolean;
    contextualSpacing?: boolean;
    mirrorIndents?: boolean;
    adjustRightIndent?: boolean;
    textDirection?: ParagraphTextDirection;
    baselineAlignment?: BaselineAlignment;
    snapToGrid?: boolean;
    wordWrap?: boolean;
    overflowPunctuation?: boolean;
    autoSpaceDE?: boolean;
    autoSpaceDN?: boolean;
}

/**
 * Legal `ST_TextDirection` tokens (12, wml.xsd 798–813).
 *
 * @private
 */
const TEXT_DIRECTIONS: Set<string> = new Set<string>([
    'lr',
    'rl',
    'tb',
    'tbV',
    'rlV',
    'lrV',
    'btLr',
    'lrTb',
    'lrTbV',
    'tbLrV',
    'tbRl',
    'tbRlV'
]);

/**
 * Legal `ST_TextAlignment` tokens (wml.xsd 817–825).
 *
 * @private
 */
const BASELINE_ALIGNMENTS: Set<string> = new Set<string>([
    'auto',
    'top',
    'center',
    'baseline',
    'bottom'
]);

/**
 * Shading patterns accepted for authored writes (§17.18.78 subset).
 *
 * @private
 */
const SHADING_PATTERNS: Set<string> = new Set<string>([
    'clear', 'solid', 'horzStripe', 'vertStripe', 'reverseDiagStripe', 'diagStripe',
    'horzCross', 'diagCross', 'thinHorzStripe', 'thinVertStripe', 'thinReverseDiagStripe',
    'thinDiagStripe', 'thinHorzCross', 'thinDiagCross', 'pct5', 'pct10', 'pct12', 'pct15',
    'pct20', 'pct25', 'pct30', 'pct35', 'pct37', 'pct40', 'pct45', 'pct50', 'pct55',
    'pct60', 'pct62', 'pct65', 'pct70', 'pct75', 'pct80', 'pct85', 'pct87', 'pct90', 'pct95'
]);

/**
 * @private
 * Known `ST_Border` wire tokens for paragraph borders — derived from the
 * page-setup `BorderStyle` enum so the set stays single-sourced.
 */
const BORDER_STYLES: ReadonlySet<string> = new Set<string>(
    objectValues(BorderStyleEnum as unknown as { [key: string]: string })
);

/**
 * @returns {ParagraphFormatSnapshot} The result.
 * @private
 * Empty snapshot factory.
 */
export function emptyParagraphFormatSnapshot(): ParagraphFormatSnapshot {
    return {
        pPrExtra: [],
        jcRaw: undefined,
        keepNextValue: undefined,
        keepLinesValue: undefined,
        pageBreakBeforeValue: undefined,
        pageBreakAfterValue: undefined,
        widowControlValue: undefined,
        bidiValue: undefined,
        outlineLevelValue: undefined,
        indentsValue: undefined,
        spacingValue: undefined,
        tabStopsValue: undefined,
        bordersValue: undefined,
        shadingValue: undefined,
        suppressAutoHyphensValue: undefined,
        suppressLineNumbersValue: undefined,
        contextualSpacingValue: undefined,
        mirrorIndentsValue: undefined,
        adjustRightIndentValue: undefined,
        textDirectionValue: undefined,
        textDirectionRaw: undefined,
        baselineAlignmentValue: undefined,
        baselineAlignmentRaw: undefined,
        snapToGridValue: undefined,
        wordWrapValue: undefined,
        overflowPunctuationValue: undefined,
        autoSpaceDEValue: undefined,
        autoSpaceDNValue: undefined,
        kinsokuValue: undefined,
        topLinePunctuationValue: undefined
    };
}

// ---------------------------------------------------------------------------
// Validation helpers (ADR D9 taxonomy: RangeError for numeric ranges,
// DocxError('content/…') for tokens; unknown loaded values never throw).
// ---------------------------------------------------------------------------
function validateSignedExtentPoints(name: string, value: number): void {
    if (value < -1584 || value > 1584) {
        throw new RangeError(name + ' must be in [-1584, 1584] points, got ' + String(value));
    }
}
function validateNonNegativeExtentPoints(name: string, value: number): void {
    if (value < 0 || value > 1584) {
        throw new RangeError(name + ' must be in [0, 1584] points, got ' + String(value));
    }
}
function validateLineSpacingPoints(value: number): void {
    if (value < 0.7 || value > 1584) {
        throw new RangeError('lineSpacing must be in [0.7, 1584] points, got ' + String(value));
    }
}
function validateOutlineLevel(value: number): void {
    if (!isFinite(value) || Math.floor(value) !== value || value < 0 || value > 9) {
        throw new RangeError('outlineLevel must be an integer 0–9, got ' + String(value));
    }
}
function validateHexColor(name: string, value: string): void {
    if (!/^[0-9A-Fa-f]{6}$/.test(value) && value !== 'auto') {
        throw new DocxError('content/invalid-shading-pattern',
                            name + ' must be a six-digit hex color (RRGGBB) or "auto", got "' + value + '"');
    }
}

/**
 *  Ensure the internal indents record exists (does not notify).
 *
 * @param {ParagraphIndentsRecord | undefined} record - The record.
 * @returns {ParagraphIndentsRecord} The result.
 */
function ensureIndents(record: ParagraphIndentsRecord | undefined): ParagraphIndentsRecord {
    return record === undefined ? {} : record;
}
function indentsRecordIsEmpty(record: ParagraphIndentsRecord): boolean {
    return record.left === undefined
        && record.right === undefined
        && record.firstLine === undefined
        && record.hanging === undefined
        && record.start === undefined
        && record.end === undefined
        && record.leftChars === undefined
        && record.rightChars === undefined
        && record.firstLineChars === undefined
        && record.hangingChars === undefined;
}
/**
 *  Ensure the internal spacing record exists (does not notify).
 *
 * @param {ParagraphSpacingRecord | undefined} record - The record.
 * @returns {ParagraphSpacingRecord} The result.
 */
function ensureSpacing(record: ParagraphSpacingRecord | undefined): ParagraphSpacingRecord {
    return record === undefined ? {} : record;
}
function spacingRecordIsEmpty(record: ParagraphSpacingRecord): boolean {
    return record.before === undefined
        && record.after === undefined
        && record.line === undefined
        && record.lineRule === undefined
        && record.beforeAutospacing === undefined
        && record.afterAutospacing === undefined
        && record.beforeLines === undefined
        && record.afterLines === undefined;
}

const PARAGRAPH_FORMAT_DEFAULTS: { horizontalAlignment: 'start' | 'center' | 'end' | 'justify'; keepFollow: boolean; keepLines: boolean; pageBreakBefore: boolean; pageBreakAfter: boolean; widowControl: boolean; bidi: boolean; outlineLevel: number; leftIndent: number; rightIndent: number; firstLineIndent: number; beforeSpacing: number; afterSpacing: number; beforeAutospacing: boolean; afterAutospacing: boolean; beforeLines: number; afterLines: number; lineSpacing: number; lineSpacingRule: LineSpacingRule; lineSpacingCount: number; backColor: string; foreColor: string; suppressAutoHyphens: boolean; suppressLineNumbers: boolean; contextualSpacing: boolean; mirrorIndents: boolean; adjustRightIndent: boolean; baselineAlignment: BaselineAlignment; snapToGrid: boolean; wordWrap: boolean; overflowPunctuation: boolean; autoSpaceDE: boolean; autoSpaceDN: boolean; } = {
    horizontalAlignment: 'start' as ParagraphAlignment,
    keepFollow: false,
    keepLines: false,
    pageBreakBefore: false,
    pageBreakAfter: false,
    widowControl: true,
    bidi: false,
    outlineLevel: 9,
    leftIndent: 0,
    rightIndent: 0,
    firstLineIndent: 0,
    beforeSpacing: 0,
    afterSpacing: 0,
    beforeAutospacing: false,
    afterAutospacing: false,
    beforeLines: 0,
    afterLines: 0,
    lineSpacing: 12,
    lineSpacingRule: 'auto' as LineSpacingRule,
    lineSpacingCount: 1,
    backColor: '',
    foreColor: '',
    suppressAutoHyphens: false,
    suppressLineNumbers: false,
    contextualSpacing: false,
    mirrorIndents: false,
    adjustRightIndent: false,
    baselineAlignment: 'auto' as BaselineAlignment,
    snapToGrid: true,
    wordWrap: true,
    overflowPunctuation: true,
    autoSpaceDE: false,
    autoSpaceDN: false
};

/**
 * Direct paragraph formatting (`w:p/w:pPr`) — the only public
 * paragraph-formatting surface. One live instance per
 * {@link Paragraph}, lazily created via `paragraph.paragraphFormat`,
 * never null. Mirrors the .NET DocIO `WParagraphFormat` flat property
 * surface (ADR `docs/adr/2026-09-24-paragraph-format-facade.md`).
 *
 * @example
 * ```ts
 * paragraph.paragraphFormat.beforeSpacing = 18;
 * paragraph.paragraphFormat.lineSpacing = 10;
 * paragraph.paragraphFormat.firstLineIndent = 10;   // negative = hanging
 * paragraph.paragraphFormat.backColor = 'D3D3D3';
 * paragraph.paragraphFormat.horizontalAlignment = 'end';
 * ```
 *
 * @public
 */
export class ParagraphFormat {
    private readonly host: ParagraphFormatHost;

    private pPrExtra: OpenXmlElement[] = [];
    private jcRaw: string | undefined;
    private keepNextValue: boolean | undefined;
    private keepLinesValue: boolean | undefined;
    private pageBreakBeforeValue: boolean | undefined;
    private pageBreakAfterValue: boolean | undefined;
    private widowControlValue: boolean | undefined;
    private tabsCollection: TabCollection | undefined;
    private bordersFace: ParagraphBordersFace | undefined;
    private bidiValue: boolean | undefined;
    private outlineLevelValue: number | undefined;
    private indentsValue: ParagraphIndentsRecord | undefined;
    private spacingValue: ParagraphSpacingRecord | undefined;
    private tabStopsValue: TabStop[] | undefined;
    private bordersValue: ParagraphBorders | undefined;
    private shadingValue: ParagraphShading | undefined;
    private suppressAutoHyphensValue: boolean | undefined;
    private suppressLineNumbersValue: boolean | undefined;
    private contextualSpacingValue: boolean | undefined;
    private mirrorIndentsValue: boolean | undefined;
    private adjustRightIndentValue: boolean | undefined;
    private textDirectionValue: ParagraphTextDirection | undefined;
    private textDirectionRaw: string | undefined;
    private baselineAlignmentValue: BaselineAlignment | undefined;
    private baselineAlignmentRaw: string | undefined;
    private snapToGridValue: boolean | undefined;
    private wordWrapValue: boolean | undefined;
    private overflowPunctuationValue: boolean | undefined;
    private autoSpaceDEValue: boolean | undefined;
    private autoSpaceDNValue: boolean | undefined;
    private kinsokuValue: boolean | undefined;
    private topLinePunctuationValue: boolean | undefined;

    /**
     * @param {ParagraphFormatHost} host - The host.
     * @private
     */
    constructor(host: ParagraphFormatHost) {
        this.host = host;
    }

    private mutate(): void {
        this.host.notifyParagraphFormatMutation();
    }


    private effective<T>(key: string): T | undefined {
        const resolve: (key: string) => unknown = this.host.resolveEffectiveParagraphValue;
        const value: any = resolve !== undefined ? resolve.call(this.host, key) : undefined;
        return value !== undefined ? value as T : undefined;
    }

    private effectiveOrDefault<T>(key: string, defaultValue: T): T {
        const value: T = this.effective<T>(key);
        return value !== undefined ? value : defaultValue;
    }

    // ---- Group A: alignment (§2) ----

    /**
     * Horizontal alignment of the paragraph (`w:jc`). `undefined` = inherit.
     *
     * Loaded directional `left`/`right` wording is surfaced as the neutral
     * `start`/`end` without rewriting the stored value on a no-op save;
     * unknown `w:jc` values (distribute-family) round-trip verbatim and this
     * getter returns `undefined` for them.
     *
     * @public
     */
    get horizontalAlignment(): ParagraphAlignment | undefined {
        if (this.jcRaw !== undefined) {
            const value: ParagraphAlignment = alignmentFromJc(this.jcRaw);
            if (value !== undefined) {
                return value;
            }
        }
        return this.effective<ParagraphAlignment>('horizontalAlignment');
    }
    set horizontalAlignment(value: ParagraphAlignment | undefined) {
        if (value === undefined) {
            this.jcRaw = undefined;
            this.mutate();
            return;
        }
        const current: ParagraphAlignment = this.jcRaw === undefined ? undefined : alignmentFromJc(this.jcRaw);
        if (current === value) {
            return;
        }
        this.jcRaw = jcForNewAlignment(value);
        this.mutate();
    }

    // ---- Group A: keeps and breaks (§9) ----

    /** Keep paragraph with the next (`w:keepNext`). `undefined` = inherit. */
    get keepFollow(): boolean | undefined {
        if (this.keepNextValue !== undefined) {
            return this.keepNextValue;
        }
        return this.effective<boolean>('keepFollow');
    }
    set keepFollow(value: boolean | undefined) {
        this.keepNextValue = value;
        this.mutate();
    }

    /** Keep all lines of the paragraph on one page (`w:keepLines`). */
    get keepLines(): boolean | undefined {
        if (this.keepLinesValue !== undefined) {
            return this.keepLinesValue;
        }
        return this.effective<boolean>('keepLines');
    }
    set keepLines(value: boolean | undefined) {
        this.keepLinesValue = value;
        this.mutate();
    }

    /** Force this paragraph onto a new page (`w:pageBreakBefore`). */
    get pageBreakBefore(): boolean | undefined {
        if (this.pageBreakBeforeValue !== undefined) {
            return this.pageBreakBeforeValue;
        }
        return this.effective<boolean>('pageBreakBefore');
    }
    set pageBreakBefore(value: boolean | undefined) {
        this.pageBreakBeforeValue = value;
        this.mutate();
    }

    /**
     * DocIO-aligned page-break-after flag.
     *
     * There is no ECMA-376 `w:pageBreakAfter` on `w:pPr` (see
     * `docs/specs/paragraph-formatting.md` § deliberate omissions). The typed flag
     * is still stored for assign / clear / style resolve. On serialize, when the
     * direct value is `true`, body writers emit a **following** paragraph whose
     * only content is `w:r/w:br/@w:type="page"` after the content `w:p` — without
     * inventing a non-schema pPr child and without placing the break run inside
     * the content paragraph.
     */
    get pageBreakAfter(): boolean | undefined {
        if (this.pageBreakAfterValue !== undefined) {
            return this.pageBreakAfterValue;
        }
        return this.effective<boolean>('pageBreakAfter');
    }
    set pageBreakAfter(value: boolean | undefined) {
        this.pageBreakAfterValue = value;
        this.mutate();
    }

    /** Widow/orphan line control (`w:widowControl`). */
    get widowControl(): boolean | undefined {
        if (this.widowControlValue !== undefined) {
            return this.widowControlValue;
        }
        return this.effective<boolean>('widowControl');
    }
    set widowControl(value: boolean | undefined) {
        this.widowControlValue = value;
        this.mutate();
    }

    /** Right-to-left base flow (`w:bidi`). */
    get bidi(): boolean | undefined {
        if (this.bidiValue !== undefined) {
            return this.bidiValue;
        }
        return this.effective<boolean>('bidi');
    }
    set bidi(value: boolean | undefined) {
        this.bidiValue = value;
        this.mutate();
    }

    /**
     * Outline/navigation level (`w:outlineLvl`): 0–8 = Heading 1–9,
     * 9 = body text. `undefined` = inherit. Authoring an integer outside
     * 0–9 throws `RangeError` (no silent clamp).
     */
    get outlineLevel(): number | undefined {
        if (this.outlineLevelValue !== undefined) {
            return this.outlineLevelValue;
        }
        return this.effective<number>('outlineLevel');
    }
    set outlineLevel(value: number | undefined) {
        if (value === undefined) {
            this.outlineLevelValue = undefined;
            this.mutate();
            return;
        }
        validateOutlineLevel(value);
        this.outlineLevelValue = value;
        this.mutate();
    }

    // ---- Group A: indents (§7; ADR D1/D2/D3) ----

    /**
     * Left-of-flow indent in points (`w:ind/@w:left` authored; loaded
     * `@w:start` preserved). Signed: negative values are legal outdents.
     * Range ±1584 points; out-of-range throws `RangeError`.
     * Setting a value drops a loaded `start`/`leftChars` twin (ADR D11).
     */
    get leftIndent(): number | undefined {
        if (this.indentsValue !== undefined) {
            if (this.indentsValue.left !== undefined) {
                return twipsToPoint(this.indentsValue.left);
            }
            if (this.indentsValue.start !== undefined) {
                return twipsToPoint(this.indentsValue.start);
            }
        }
        return this.effective<number>('leftIndent');
    }
    set leftIndent(value: number | undefined) {
        const indents: ParagraphIndentsRecord = ensureIndents(this.indentsValue);
        if (value === undefined) {
            indents.left = undefined;
            this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
            this.mutate();
            return;
        }
        validateSignedExtentPoints('leftIndent', value);
        indents.left = Math.round(value * 20);
        // Authored write supersedes loaded twins (ADR D11).
        indents.start = undefined;
        indents.leftChars = undefined;
        this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
        this.mutate();
    }

    /**
     * Right-of-flow indent in points (`@w:right` authored; loaded `@w:end`
     * preserved). Signed; range ±1584 points. Setting a value drops a loaded
     * `end`/`rightChars` twin.
     */
    get rightIndent(): number | undefined {
        if (this.indentsValue !== undefined) {
            if (this.indentsValue.right !== undefined) {
                return twipsToPoint(this.indentsValue.right);
            }
            if (this.indentsValue.end !== undefined) {
                return twipsToPoint(this.indentsValue.end);
            }
        }
        return this.effective<number>('rightIndent');
    }
    set rightIndent(value: number | undefined) {
        const indents: ParagraphIndentsRecord = ensureIndents(this.indentsValue);
        if (value === undefined) {
            indents.right = undefined;
            this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
            this.mutate();
            return;
        }
        validateSignedExtentPoints('rightIndent', value);
        indents.right = Math.round(value * 20);
        indents.end = undefined;
        indents.rightChars = undefined;
        this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
        this.mutate();
    }

    /**
     * First-line indent in points, **signed** (ADR D3): positive = first-line
     * indent (`@w:firstLine`); negative = hanging indent (`@w:hanging`,
     * emitted as the absolute twips). Range ±1584 points. Setting a value
     * drops a loaded `firstLineChars` twin. Loading a legacy `w:ind` that
     * carries both `@w:firstLine` and `@w:hanging` is deterministic
     * (firstLine wins) — the pair cannot be co-authored through this API.
     */
    get firstLineIndent(): number | undefined {
        if (this.indentsValue !== undefined) {
            if (this.indentsValue.firstLine !== undefined) {
                return twipsToPoint(this.indentsValue.firstLine);
            }
            if (this.indentsValue.hanging !== undefined) {
                return -twipsToPoint(this.indentsValue.hanging);
            }
        }
        return this.effective<number>('firstLineIndent');
    }
    set firstLineIndent(value: number | undefined) {
        const indents: ParagraphIndentsRecord = ensureIndents(this.indentsValue);
        if (value === undefined) {
            indents.firstLine = undefined;
            indents.hanging = undefined;
            this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
            this.mutate();
            return;
        }
        validateSignedExtentPoints('firstLineIndent', value);
        if (value < 0) {
            indents.firstLine = undefined;
            indents.hanging = Math.round(-value * 20);
        }
        else {
            indents.firstLine = Math.round(value * 20);
            indents.hanging = undefined;
        }
        indents.firstLineChars = undefined;
        this.indentsValue = indentsRecordIsEmpty(indents) ? undefined : indents;
        this.mutate();
    }

    // ---- Group A: spacing (§8; ADR D4) ----

    /**
     * Space above the paragraph in points (`@w:before`). Range 0–1584.
     * User-set clears an explicit `beforeAutospacing` (set-path only, never
     * on load). Setting a value drops a loaded `@w:beforeLines` twin.
     */
    get beforeSpacing(): number | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.before !== undefined) {
            return twipsToPoint(this.spacingValue.before);
        }
        return this.effective<number>('beforeSpacing');
    }
    set beforeSpacing(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        if (value === undefined) {
            spacing.before = undefined;
            this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
            this.mutate();
            return;
        }
        validateNonNegativeExtentPoints('beforeSpacing', value);
        spacing.before = Math.round(value * 20);
        if (spacing.beforeAutospacing === true) {
            spacing.beforeAutospacing = undefined;
        }
        spacing.beforeLines = undefined;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /**
     * Space below the paragraph in points (`@w:after`). Range 0–1584.
     * User-set clears an explicit `afterAutospacing` and drops a loaded
     * `@w:afterLines` twin.
     */
    get afterSpacing(): number | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.after !== undefined) {
            return twipsToPoint(this.spacingValue.after);
        }
        return this.effective<number>('afterSpacing');
    }
    set afterSpacing(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        if (value === undefined) {
            spacing.after = undefined;
            this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
            this.mutate();
            return;
        }
        validateNonNegativeExtentPoints('afterSpacing', value);
        spacing.after = Math.round(value * 20);
        if (spacing.afterAutospacing === true) {
            spacing.afterAutospacing = undefined;
        }
        spacing.afterLines = undefined;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /** Automatic spacing above (`@w:beforeAutospacing`). */
    get beforeAutospacing(): boolean | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.beforeAutospacing !== undefined) {
            return this.spacingValue.beforeAutospacing;
        }
        return this.effective<boolean>('beforeAutospacing');
    }
    set beforeAutospacing(value: boolean | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        spacing.beforeAutospacing = value;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /** Automatic spacing below (`@w:afterAutospacing`). */
    get afterAutospacing(): boolean | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.afterAutospacing !== undefined) {
            return this.spacingValue.afterAutospacing;
        }
        return this.effective<boolean>('afterAutospacing');
    }
    set afterAutospacing(value: boolean | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        spacing.afterAutospacing = value;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /**
     * Line-grid spacing above in hundredths of a line (`@w:beforeLines`),
     * round-trip slot for the East-Asian line-grid authoring style. Authored
     * `beforeSpacing` drops a loaded twin.
     */
    get beforeLines(): number | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.beforeLines !== undefined) {
            return this.spacingValue.beforeLines;
        }
        return this.effective<number>('beforeLines');
    }
    set beforeLines(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        spacing.beforeLines = value;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /** Line-grid spacing below in hundredths of a line (`@w:afterLines`). */
    get afterLines(): number | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.afterLines !== undefined) {
            return this.spacingValue.afterLines;
        }
        return this.effective<number>('afterLines');
    }
    set afterLines(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        spacing.afterLines = value;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /**
     * Fixed/minimum line spacing in points (`@w:line` with
     * `lineSpacingRule` `'atLeast'` or `'exact'`). Range 0.7–1584 points.
     * Setting it clears {@link lineSpacingCount} — both are views of one
     * `@line` slot (ADR D4).
     */
    get lineSpacing(): number | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.line !== undefined
        && this.spacingValue.lineRule !== 'auto') {
            return twipsToPoint(this.spacingValue.line);
        }
        return this.effective<number>('lineSpacing');
    }
    set lineSpacing(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        if (value === undefined) {
            spacing.line = undefined;
            if (spacing.lineRule === 'exact' || spacing.lineRule === 'atLeast') {
                spacing.lineRule = undefined;
            }
            this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
            this.mutate();
            return;
        }
        validateLineSpacingPoints(value);
        spacing.line = Math.round(value * 20);
        // ADR D4: points view leaves auto-count; default rule is exact unless
        // the author already chose atLeast.
        spacing.lineRule = spacing.lineRule === 'atLeast' ? 'atLeast' : 'exact';
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /**
     * Interpretation rule for `@w:line`: `'auto'` (multiple of single
     * spacing — use {@link lineSpacingCount}), `'exact'` (exactly the given
     * height), `'atLeast'` (at least the given height). Default when
     * `lineSpacing` is authored without a rule: `'exact'`.
     */
    get lineSpacingRule(): LineSpacingRule | undefined {
        if (this.spacingValue !== undefined && this.spacingValue.lineRule !== undefined) {
            return this.spacingValue.lineRule;
        }
        return this.effective<LineSpacingRule>('lineSpacingRule');
    }
    set lineSpacingRule(value: LineSpacingRule | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        spacing.lineRule = value;
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    /**
     * Multiple-of-single line spacing (authoring view over
     * `@line = round(n × 240)` + `@lineRule="auto"`), e.g. `1.5` or `2`.
     * Range 0–100; mutually clears with {@link lineSpacing} (ADR D4).
     * Getter returns `n` only when the stored rule is `'auto'` and `@line`
     * is set; otherwise `undefined` (effective style may still resolve).
     */
    get lineSpacingCount(): number | undefined {
        if (this.spacingValue !== undefined
        && this.spacingValue.lineRule === 'auto'
        && this.spacingValue.line !== undefined) {
            return this.spacingValue.line / 240;
        }
        return this.effective<number>('lineSpacingCount');
    }
    set lineSpacingCount(value: number | undefined) {
        const spacing: ParagraphSpacingRecord = ensureSpacing(this.spacingValue);
        if (value === undefined) {
            if (spacing.lineRule === 'auto') {
                spacing.line = undefined;
                spacing.lineRule = undefined;
            }
            this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
            this.mutate();
            return;
        }
        if (value < 0 || value > 100) {
            throw new RangeError('lineSpacingCount must be in [0, 100], got ' + String(value));
        }
        spacing.line = Math.round(value * 240);
        spacing.lineRule = 'auto';
        this.spacingValue = spacingRecordIsEmpty(spacing) ? undefined : spacing;
        this.mutate();
    }

    // ---- Group A: tabs (§11), borders (§12), shading (§13) ----

    /**
     * Custom tab stops (`w:tabs`), assigned whole as an array. `undefined`
     * clears explicit stops (style/default resolution may still supply some).
     */
    get tabStops(): TabStop[] | undefined {
        if (this.tabStopsValue !== undefined) {
            return this.tabStopsValue;
        }
        return this.effective<TabStop[]>('tabStops');
    }
    set tabStops(value: TabStop[] | undefined) {
        this.tabStopsValue = value;
        this.mutate();
    }

    /**
     * Live DocIO-style tab-stop collection. Mutates the same storage as
     * {@link ParagraphFormat.tabStops}.
     */
    get tabs(): TabCollection {
        if (this.tabsCollection === undefined) {
            this.tabsCollection = new TabCollection(this);
        }
        return this.tabsCollection;
    }

    /**
     * Live paragraph borders (`w:pBdr`) facade — always a
     * {@link ParagraphBordersFace} (aggregate `borderType` / `color` /
     * `lineWidth` / `space`, plus `top` / `left` / `bottom` / `right` /
     * `horizontal` / `vertical`). Never `undefined` and never a plain bag.
     *
     * Whole-bag replace or clear: {@link ParagraphFormat.setBorders}.
     */
    get borders(): ParagraphBordersFace {
        if (this.bordersFace === undefined) {
            this.bordersFace = new ParagraphBordersFace(this);
        }
        return this.bordersFace;
    }

    /**
     * Replace or clear the whole paragraph-borders bag (`w:pBdr`).
     * Pass `undefined` to clear authored borders. Per-edge edits use
     * {@link ParagraphFormat.borders}.
     *
     * @param {ParagraphBorders | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    setBorders(value: ParagraphBorders | undefined): void {
        this.bordersValue = value;
        this.mutate();
    }

    /**
     * @returns {ParagraphBorders | undefined} The result.
     * @private
     * Direct bag read for facades / serializers (avoids face getter recursion).
     */
    readBordersBag(): ParagraphBorders | undefined {
        if (this.bordersValue !== undefined) {
            return this.bordersValue;
        }
        return this.effective<ParagraphBorders>('borders');
    }

    /**
     * @param {ParagraphBorders | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeBordersBag(value: ParagraphBorders | undefined): void {
        this.bordersValue = value;
        this.mutate();
    }

    /**
     * Background fill color (`w:shd/@w:fill`).
     *
     * - **Get (runtime)**: OOXML wire string — hex `RRGGBB`, `'auto'`, or the
     *   default `''` when unset. Loaded wire values are preserved (never a
     *   {@link Color} enum).
     * - **Set**: hex string / `'auto'`, a {@link Color} enum value (converted to
     *   hex immediately), or `undefined` to clear the authored fill.
     *
     * TypeScript 3.3 requires identical get/set types, so the declared type is
     * `string | Color | undefined`; the getter always returns a string.
     */
    get backColor(): string | Color | undefined {
        if (this.shadingValue !== undefined && this.shadingValue.fill !== undefined) {
            return this.shadingValue.fill;
        }
        return this.effectiveOrDefault('backColor', PARAGRAPH_FORMAT_DEFAULTS.backColor);
    }
    set backColor(value: string | Color | undefined) {
        const shading: { fill?: string; color?: string; pattern?: ShadingPattern } =
            this.shadingValue === undefined ? {} : { ...this.shadingValue };
        if (value === undefined) {
            shading.fill = undefined;
        }
        else {
            const wire: string = shadingColorToWire(value);
            validateHexColor('backColor', wire);
            shading.fill = wire;
        }
        this.shadingValue = shadingHasEntries(shading) ? shading : undefined;
        this.mutate();
    }

    /**
     * Pattern foreground color (`w:shd/@w:color`).
     *
     * - **Get (runtime)**: OOXML wire string — hex `RRGGBB`, `'auto'`, or the
     *   default `''` when unset. Loaded wire values are preserved (never a
     *   {@link Color} enum).
     * - **Set**: hex string / `'auto'`, a {@link Color} enum value (converted to
     *   hex immediately), or `undefined` to clear.
     *
     * TypeScript 3.3 requires identical get/set types, so the declared type is
     * `string | Color | undefined`; the getter always returns a string.
     */
    get foreColor(): string | Color | undefined {
        if (this.shadingValue !== undefined && this.shadingValue.color !== undefined) {
            return this.shadingValue.color;
        }
        return this.effectiveOrDefault('foreColor', PARAGRAPH_FORMAT_DEFAULTS.foreColor);
    }
    set foreColor(value: string | Color | undefined) {
        const shading: { fill?: string; color?: string; pattern?: ShadingPattern } =
            this.shadingValue === undefined ? {} : { ...this.shadingValue };
        if (value === undefined) {
            shading.color = undefined;
        }
        else {
            const wire: string = shadingColorToWire(value);
            validateHexColor('foreColor', wire);
            shading.color = wire;
        }
        this.shadingValue = shadingHasEntries(shading) ? shading : undefined;
        this.mutate();
    }

    /**
     * Shading pattern (`w:shd/@w:val`). Authoring an out-of-subset token
     * throws `DocxError('content/invalid-shading-pattern', …)`; unknown
     * loaded tokens round-trip via the parked-element path (never throw).
     *
     * @private
     */
    get shadingPattern(): ShadingPattern | undefined {
        if (this.shadingValue !== undefined && this.shadingValue.pattern !== undefined) {
            return this.shadingValue.pattern;
        }
        return this.effective<ShadingPattern>('shadingPattern');
    }
    set shadingPattern(value: ShadingPattern | undefined) {
        const shading: { fill?: string; color?: string; pattern?: ShadingPattern } =
            this.shadingValue === undefined ? {} : { ...this.shadingValue };
        if (value === undefined) {
            shading.pattern = undefined;
        }
        else {
            if (!SHADING_PATTERNS.has(value)) {
                throw new DocxError('content/invalid-shading-pattern',
                                    'shadingPattern must be an ST_Shd pattern token, got "' + value + '"');
            }
            shading.pattern = value;
        }
        this.shadingValue = shadingHasEntries(shading) ? shading : undefined;
        this.mutate();
    }

    // ---- Group A: misc on/off flags ----

    /**
     * Suppress automatic hyphenation for this paragraph
     * (`w:suppressAutoHyphens`, ECMA-376-1 §17.3.1.34 — the only
     * hyphenation element; ADR D5). Foreign `w:suppressHyphenation` markup
     * (not an ECMA-376 element) parks verbatim in `pPrExtra`.
     */
    get suppressAutoHyphens(): boolean {
        if (this.suppressAutoHyphensValue !== undefined) {
            return this.suppressAutoHyphensValue;
        }
        return this.effectiveOrDefault('suppressAutoHyphens', PARAGRAPH_FORMAT_DEFAULTS.suppressAutoHyphens);
    }
    set suppressAutoHyphens(value: boolean | undefined) {
        this.suppressAutoHyphensValue = value;
        this.mutate();
    }

    /** Exclude this paragraph from line numbering (`w:suppressLineNumbers`). */
    get suppressLineNumbers(): boolean {
        if (this.suppressLineNumbersValue !== undefined) {
            return this.suppressLineNumbersValue;
        }
        return this.effectiveOrDefault('suppressLineNumbers', PARAGRAPH_FORMAT_DEFAULTS.suppressLineNumbers);
    }
    set suppressLineNumbers(value: boolean | undefined) {
        this.suppressLineNumbersValue = value;
        this.mutate();
    }

    /** Ignore before/after spacing between same-style paragraphs (`w:contextualSpacing`). */
    get contextualSpacing(): boolean {
        if (this.contextualSpacingValue !== undefined) {
            return this.contextualSpacingValue;
        }
        return this.effectiveOrDefault('contextualSpacing', PARAGRAPH_FORMAT_DEFAULTS.contextualSpacing);
    }
    set contextualSpacing(value: boolean | undefined) {
        this.contextualSpacingValue = value;
        this.mutate();
    }

    /** Treat left/right indents as inside/outside for mirrored margins (`w:mirrorIndents`). */
    get mirrorIndents(): boolean {
        if (this.mirrorIndentsValue !== undefined) {
            return this.mirrorIndentsValue;
        }
        return this.effectiveOrDefault('mirrorIndents', PARAGRAPH_FORMAT_DEFAULTS.mirrorIndents);
    }
    set mirrorIndents(value: boolean | undefined) {
        this.mirrorIndentsValue = value;
        this.mutate();
    }

    /** Auto-adjust right indent against the document grid (`w:adjustRightInd`). */
    get adjustRightIndent(): boolean {
        if (this.adjustRightIndentValue !== undefined) {
            return this.adjustRightIndentValue;
        }
        return this.effectiveOrDefault('adjustRightIndent', PARAGRAPH_FORMAT_DEFAULTS.adjustRightIndent);
    }
    set adjustRightIndent(value: boolean | undefined) {
        this.adjustRightIndentValue = value;
        this.mutate();
    }

    // ---- Group A: text direction (§15; ADR D11: 12 tokens) ----

    /**
     * Physical text flow direction (`w:textDirection`,
     * `ST_TextDirection` — all 12 tokens). Unknown loaded tokens round-trip
     * verbatim (raw slot) and the getter returns `undefined` for them;
     * authoring an invalid token throws
     * `DocxError('content/invalid-text-direction', …)`.
     */
    get textDirection(): ParagraphTextDirection | undefined {
        if (this.textDirectionValue !== undefined) {
            return this.textDirectionValue;
        }
        return this.effective<ParagraphTextDirection>('textDirection');
    }
    set textDirection(value: ParagraphTextDirection | undefined) {
        if (value === undefined) {
            this.textDirectionValue = undefined;
            this.textDirectionRaw = undefined;
            this.mutate();
            return;
        }
        if (!TEXT_DIRECTIONS.has(value)) {
            throw new DocxError('content/invalid-text-direction',
                                'textDirection must be an ST_TextDirection token, got "' + value + '"');
        }
        this.textDirectionValue = value;
        this.textDirectionRaw = undefined;
        this.mutate();
    }

    // ---- Group B: baseline alignment (§16; ADR D6) ----

    /**
     * How characters of different sizes align vertically on a line
     * (`w:textAlignment`, `ST_TextAlignment`). Unknown loaded tokens
     * round-trip verbatim and the getter returns `undefined` for them;
     * authoring an invalid token throws
     * `DocxError('content/invalid-baseline-alignment', …)`.
     */
    get baselineAlignment(): BaselineAlignment | undefined {
        if (this.baselineAlignmentValue !== undefined) {
            return this.baselineAlignmentValue;
        }
        return this.effective<BaselineAlignment>('baselineAlignment');
    }
    set baselineAlignment(value: BaselineAlignment | undefined) {
        if (value === undefined) {
            this.baselineAlignmentValue = undefined;
            this.baselineAlignmentRaw = undefined;
            this.mutate();
            return;
        }
        if (!BASELINE_ALIGNMENTS.has(value)) {
            throw new DocxError('content/invalid-baseline-alignment',
                                'baselineAlignment must be an ST_TextAlignment token, got "' + value + '"');
        }
        this.baselineAlignmentValue = value;
        this.baselineAlignmentRaw = undefined;
        this.mutate();
    }

    // ---- Group B: East-Asian / grid flags ----

    /**
     * Use document grid line pitch (`w:snapToGrid`).
     *
     * @private
     */
    get snapToGrid(): boolean {
        if (this.snapToGridValue !== undefined) {
            return this.snapToGridValue;
        }
        return this.effectiveOrDefault('snapToGrid', PARAGRAPH_FORMAT_DEFAULTS.snapToGrid);
    }
    set snapToGrid(value: boolean | undefined) {
        this.snapToGridValue = value;
        this.mutate();
    }

    /**
     * Break lines on word level (`w:wordWrap`).
     *
     * @private
     */
    get wordWrap(): boolean {
        if (this.wordWrapValue !== undefined) {
            return this.wordWrapValue;
        }
        return this.effectiveOrDefault('wordWrap', PARAGRAPH_FORMAT_DEFAULTS.wordWrap);
    }
    set wordWrap(value: boolean | undefined) {
        this.wordWrapValue = value;
        this.mutate();
    }

    /**
     * Allow trailing punctuation to extend beyond the line (`w:overflowPunct`).
     *
     * @private
     */
    get overflowPunctuation(): boolean {
        if (this.overflowPunctuationValue !== undefined) {
            return this.overflowPunctuationValue;
        }
        return this.effectiveOrDefault('overflowPunctuation', PARAGRAPH_FORMAT_DEFAULTS.overflowPunctuation);
    }
    set overflowPunctuation(value: boolean | undefined) {
        this.overflowPunctuationValue = value;
        this.mutate();
    }

    /**
     * Auto space between East-Asian and Latin text (`w:autoSpaceDE`).
     *
     * @private
     */
    get autoSpaceDE(): boolean {
        if (this.autoSpaceDEValue !== undefined) {
            return this.autoSpaceDEValue;
        }
        return this.effectiveOrDefault('autoSpaceDE', PARAGRAPH_FORMAT_DEFAULTS.autoSpaceDE);
    }
    set autoSpaceDE(value: boolean | undefined) {
        this.autoSpaceDEValue = value;
        this.mutate();
    }

    /**
     * Auto space between East-Asian text and numbers (`w:autoSpaceDN`).
     *
     * @private
     */
    get autoSpaceDN(): boolean {
        if (this.autoSpaceDNValue !== undefined) {
            return this.autoSpaceDNValue;
        }
        return this.effectiveOrDefault('autoSpaceDN', PARAGRAPH_FORMAT_DEFAULTS.autoSpaceDN);
    }
    set autoSpaceDN(value: boolean | undefined) {
        this.autoSpaceDNValue = value;
        this.mutate();
    }

    // ---- Group B: internal round-trip members (@private) ----

    /**
     * @private
     * `w:kinsoku` — East-Asian line-breaking rules (round-trip only).
     */
    get kinsoku(): boolean | undefined {
        return this.kinsokuValue;
    }
    /**
     *  @private
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    set kinsoku(value: boolean | undefined) {
        this.kinsokuValue = value;
        this.mutate();
    }

    /**
     * @private
     * `w:topLinePunct` — punctuation at line start preference (round-trip only).
     */
    get topLinePunctuation(): boolean | undefined {
        return this.topLinePunctuationValue;
    }
    /**
     *  @private
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    set topLinePunctuation(value: boolean | undefined) {
        this.topLinePunctuationValue = value;
        this.mutate();
    }

    /**
     * @returns {string | undefined} The result.
     * @private
     * Raw loaded `w:textDirection/@w:val` for tokens outside the public union.
     */
    textDirectionRawValue(): string | undefined {
        return this.textDirectionRaw;
    }

    /**
     * @returns {string | undefined} The result.
     * @private
     * Raw loaded `w:textAlignment/@w:val` for tokens outside the public union.
     */
    baselineAlignmentRawValue(): string | undefined {
        return this.baselineAlignmentRaw;
    }

    // ---- Lifecycle ----

    /**
     * Apply a partial delta. Uses setters — cross-property effects
     * (autospacing clearing, mutual line-slot clearing) apply.
     *
     * @param {ParagraphFormatDelta} delta - The delta.
     * @returns {void} Nothing is returned.
     * @public
     */
    assign(delta: ParagraphFormatDelta): void {
        if (delta.horizontalAlignment !== undefined) {
            this.horizontalAlignment = delta.horizontalAlignment;
        }
        if (delta.keepFollow !== undefined) {
            this.keepFollow = delta.keepFollow;
        }
        if (delta.keepLines !== undefined) {
            this.keepLines = delta.keepLines;
        }
        if (delta.pageBreakBefore !== undefined) {
            this.pageBreakBefore = delta.pageBreakBefore;
        }
        if (delta.pageBreakAfter !== undefined) {
            this.pageBreakAfter = delta.pageBreakAfter;
        }
        if (delta.widowControl !== undefined) {
            this.widowControl = delta.widowControl;
        }
        if (delta.bidi !== undefined) {
            this.bidi = delta.bidi;
        }
        if (delta.outlineLevel !== undefined) {
            this.outlineLevel = delta.outlineLevel;
        }
        if (delta.leftIndent !== undefined) {
            this.leftIndent = delta.leftIndent;
        }
        if (delta.rightIndent !== undefined) {
            this.rightIndent = delta.rightIndent;
        }
        if (delta.firstLineIndent !== undefined) {
            this.firstLineIndent = delta.firstLineIndent;
        }
        if (delta.beforeSpacing !== undefined) {
            this.beforeSpacing = delta.beforeSpacing;
        }
        if (delta.afterSpacing !== undefined) {
            this.afterSpacing = delta.afterSpacing;
        }
        if (delta.beforeAutospacing !== undefined) {
            this.beforeAutospacing = delta.beforeAutospacing;
        }
        if (delta.afterAutospacing !== undefined) {
            this.afterAutospacing = delta.afterAutospacing;
        }
        if (delta.beforeLines !== undefined) {
            this.beforeLines = delta.beforeLines;
        }
        if (delta.afterLines !== undefined) {
            this.afterLines = delta.afterLines;
        }
        if (delta.lineSpacing !== undefined) {
            this.lineSpacing = delta.lineSpacing;
        }
        if (delta.lineSpacingRule !== undefined) {
            this.lineSpacingRule = delta.lineSpacingRule;
        }
        if (delta.lineSpacingCount !== undefined) {
            this.lineSpacingCount = delta.lineSpacingCount;
        }
        if (delta.tabStops !== undefined) {
            this.tabStops = delta.tabStops;
        }
        if (delta.borders !== undefined) {
            this.setBorders(delta.borders);
        }
        if (delta.backColor !== undefined) {
            this.backColor = delta.backColor;
        }
        if (delta.foreColor !== undefined) {
            this.foreColor = delta.foreColor;
        }
        if (delta.shadingPattern !== undefined) {
            this.shadingPattern = delta.shadingPattern;
        }
        if (delta.suppressAutoHyphens !== undefined) {
            this.suppressAutoHyphens = delta.suppressAutoHyphens;
        }
        if (delta.suppressLineNumbers !== undefined) {
            this.suppressLineNumbers = delta.suppressLineNumbers;
        }
        if (delta.contextualSpacing !== undefined) {
            this.contextualSpacing = delta.contextualSpacing;
        }
        if (delta.mirrorIndents !== undefined) {
            this.mirrorIndents = delta.mirrorIndents;
        }
        if (delta.adjustRightIndent !== undefined) {
            this.adjustRightIndent = delta.adjustRightIndent;
        }
        if (delta.textDirection !== undefined) {
            this.textDirection = delta.textDirection;
        }
        if (delta.baselineAlignment !== undefined) {
            this.baselineAlignment = delta.baselineAlignment;
        }
        if (delta.snapToGrid !== undefined) {
            this.snapToGrid = delta.snapToGrid;
        }
        if (delta.wordWrap !== undefined) {
            this.wordWrap = delta.wordWrap;
        }
        if (delta.overflowPunctuation !== undefined) {
            this.overflowPunctuation = delta.overflowPunctuation;
        }
        if (delta.autoSpaceDE !== undefined) {
            this.autoSpaceDE = delta.autoSpaceDE;
        }
        if (delta.autoSpaceDN !== undefined) {
            this.autoSpaceDN = delta.autoSpaceDN;
        }
    }

    /**
     * Clear all typed formatting. Does not clear `pPrExtra`.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    clear(): void {
        this.jcRaw = undefined;
        this.keepNextValue = undefined;
        this.keepLinesValue = undefined;
        this.pageBreakBeforeValue = undefined;
        this.pageBreakAfterValue = undefined;
        this.widowControlValue = undefined;
        this.bidiValue = undefined;
        this.outlineLevelValue = undefined;
        this.indentsValue = undefined;
        this.spacingValue = undefined;
        this.tabStopsValue = undefined;
        this.bordersValue = undefined;
        this.shadingValue = undefined;
        this.suppressAutoHyphensValue = undefined;
        this.suppressLineNumbersValue = undefined;
        this.contextualSpacingValue = undefined;
        this.mirrorIndentsValue = undefined;
        this.adjustRightIndentValue = undefined;
        this.textDirectionValue = undefined;
        this.textDirectionRaw = undefined;
        this.baselineAlignmentValue = undefined;
        this.baselineAlignmentRaw = undefined;
        this.snapToGridValue = undefined;
        this.wordWrapValue = undefined;
        this.overflowPunctuationValue = undefined;
        this.autoSpaceDEValue = undefined;
        this.autoSpaceDNValue = undefined;
        this.kinsokuValue = undefined;
        this.topLinePunctuationValue = undefined;
        this.mutate();
    }

    /**
     * @param {ParagraphFormatSnapshot} data - The data.
     * @returns {void} Nothing is returned.
     * @private
     * Load a snapshot without set-path cross-property effects.
     */
    hydrate(data: ParagraphFormatSnapshot): void {
        this.pPrExtra = data.pPrExtra;
        this.jcRaw = data.jcRaw;
        this.keepNextValue = data.keepNextValue;
        this.keepLinesValue = data.keepLinesValue;
        this.pageBreakAfterValue = data.pageBreakAfterValue;
        this.pageBreakBeforeValue = data.pageBreakBeforeValue;
        this.widowControlValue = data.widowControlValue;
        this.bidiValue = data.bidiValue;
        this.outlineLevelValue = data.outlineLevelValue;
        this.indentsValue = data.indentsValue;
        this.spacingValue = data.spacingValue;
        this.tabStopsValue = data.tabStopsValue;
        this.bordersValue = data.bordersValue;
        this.shadingValue = data.shadingValue;
        this.suppressAutoHyphensValue = data.suppressAutoHyphensValue;
        this.suppressLineNumbersValue = data.suppressLineNumbersValue;
        this.contextualSpacingValue = data.contextualSpacingValue;
        this.mirrorIndentsValue = data.mirrorIndentsValue;
        this.adjustRightIndentValue = data.adjustRightIndentValue;
        this.textDirectionValue = data.textDirectionValue;
        this.textDirectionRaw = data.textDirectionRaw;
        this.baselineAlignmentValue = data.baselineAlignmentValue;
        this.baselineAlignmentRaw = data.baselineAlignmentRaw;
        this.snapToGridValue = data.snapToGridValue;
        this.wordWrapValue = data.wordWrapValue;
        this.overflowPunctuationValue = data.overflowPunctuationValue;
        this.autoSpaceDEValue = data.autoSpaceDEValue;
        this.autoSpaceDNValue = data.autoSpaceDNValue;
        this.kinsokuValue = data.kinsokuValue;
        this.topLinePunctuationValue = data.topLinePunctuationValue;
    }

    /**
     * @returns {ParagraphFormatSnapshot} The result.
     * @private
     */
    snapshot(): ParagraphFormatSnapshot {
        return {
            pPrExtra: this.pPrExtra,
            jcRaw: this.jcRaw,
            keepNextValue: this.keepNextValue,
            keepLinesValue: this.keepLinesValue,
            pageBreakAfterValue: this.pageBreakAfterValue,
            pageBreakBeforeValue: this.pageBreakBeforeValue,
            widowControlValue: this.widowControlValue,
            bidiValue: this.bidiValue,
            outlineLevelValue: this.outlineLevelValue,
            indentsValue: this.indentsValue,
            spacingValue: this.spacingValue,
            tabStopsValue: this.tabStopsValue,
            bordersValue: this.bordersValue,
            shadingValue: this.shadingValue,
            suppressAutoHyphensValue: this.suppressAutoHyphensValue,
            suppressLineNumbersValue: this.suppressLineNumbersValue,
            contextualSpacingValue: this.contextualSpacingValue,
            mirrorIndentsValue: this.mirrorIndentsValue,
            adjustRightIndentValue: this.adjustRightIndentValue,
            textDirectionValue: this.textDirectionValue,
            textDirectionRaw: this.textDirectionRaw,
            baselineAlignmentValue: this.baselineAlignmentValue,
            baselineAlignmentRaw: this.baselineAlignmentRaw,
            snapToGridValue: this.snapToGridValue,
            wordWrapValue: this.wordWrapValue,
            overflowPunctuationValue: this.overflowPunctuationValue,
            autoSpaceDEValue: this.autoSpaceDEValue,
            autoSpaceDNValue: this.autoSpaceDNValue,
            kinsokuValue: this.kinsokuValue,
            topLinePunctuationValue: this.topLinePunctuationValue
        };
    }

    /**
     * @returns {OpenXmlElement[]} The result.
     * @private
     * Parked children (`framePr`, `pPrChange`, unknowns, foreign invalid markup).
     * Mark `w:rPr` is owned by {@link Paragraph.breakCharacterFormat}, not parked here.
     * Read/write for the paragraph-owned serializer.
     */
    extraChildren(): OpenXmlElement[] {
        return this.pPrExtra;
    }

    /**
     * @returns {CnfStyle | undefined} The result.
     * @private
     * Paragraph conditional formatting membership (`w:pPr/w:cnfStyle`).
     */
    readCnfStyle(): CnfStyle | undefined {
        for (const child of this.pPrExtra) {
            if (isWml(child, 'cnfStyle')) {
                const state: CnfStyle = parseCnfStyle(child);
                return cnfStyleIsEmpty(state) ? undefined : state;
            }
        }
        return undefined;
    }

    /**
     * @param {NormalizedCnfStyle | CnfStyle | undefined} state - The state.
     * @returns {void} Nothing is returned.
     * @private
     * Write or clear paragraph `w:cnfStyle` in parked extra children.
     * `undefined` removes the element; a supplied state always writes
     * (including all-false normalized form).
     */
    writeCnfStyle(state: NormalizedCnfStyle | CnfStyle | undefined): void {
    // Table updateConditionalFormatting may run before every paragraph is
    // body-attached; mutate only when the host is already bound.
        try {
            this.mutate();
        } catch (_e) {
            // Detached dual-hold: still update parked cnfStyle markup.
        }
        let existing: OpenXmlElement | undefined;
        let existingIndex: number = -1;
        for (const [i, child] of this.pPrExtra.entries()) {
            if (isWml(child, 'cnfStyle')) {
                existing = child;
                existingIndex = i;
                break;
            }
        }
        if (state === undefined) {
            if (existingIndex >= 0) {
                this.pPrExtra.splice(existingIndex, 1);
            }
            return;
        }
        const written: OpenXmlElement = serializeCnfStyle(normalizeCnfStyle(state), existing);
        if (existingIndex >= 0) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            this.pPrExtra[existingIndex] = written;
        } else {
            this.pPrExtra.push(written);
        }
    }

    /**
     * @param {ParagraphPPrInject} inject - The inject.
     * @returns {OpenXmlElement[]} The result.
     * @private
     * Materialize `w:pPr` children owned by this format (CT_PPrBase order).
     * Does not emit `pStyle` / `numPr` / `rPr` / `sectPr` — those stay on {@link Paragraph}.
     */
    buildPPrChildren(inject?: ParagraphPPrInject): OpenXmlElement[] {
        return buildPPrChildrenFromSnapshot(this.snapshot(), inject);
    }
}

/**
 *   `true` when the shading record carries any authored entry.
 *
 * @param {ParagraphShading} shading - The shading.
 * @returns {boolean} The result.
 * @private
 */
function shadingHasEntries(shading: ParagraphShading): boolean {
    return shading.fill !== undefined
        || shading.color !== undefined
        || shading.pattern !== undefined;
}

// ---------------------------------------------------------------------------
// TASK-9020-C/D: parse + serialize codecs (CharacterFormat ownership pattern)
// ---------------------------------------------------------------------------

/**
 * Optional inject hooks for paragraph-owned children that must sit at fixed
 * CT_PPrBase / CT_PPr positions inside the materialised `w:pPr` list.
 * @private
 */
export interface ParagraphPPrInject {
    /** Pre-built `w:numPr` element, emitted after `widowControl`. */
    numPr?: OpenXmlElement;
    /**
     * Pre-built mark `w:rPr` from {@link Paragraph.breakCharacterFormat},
     * emitted after `outlineLvl` and before `sectPr` (CT_PPr order).
     */
    rPr?: OpenXmlElement;
    /** Pre-built `w:sectPr` element, emitted after mark `rPr` and before `pPrChange`. */
    sectPr?: OpenXmlElement;
}

/**
 * Modeled `w:pPr` children owned by {@link ParagraphFormat}.
 * `pStyle` / `numPr` / `sectPr` stay on {@link Paragraph}.
 * Foreign non-schema `suppressHyphenation` is NOT modeled (parked).
 * @private
 */
const MODELED_PPR: Set<string> = new Set([
    'keepNext',
    'keepLines',
    'pageBreakBefore',
    'widowControl',
    'bidi',
    'jc',
    'outlineLvl',
    'ind',
    'spacing',
    'tabs',
    'pBdr',
    'shd',
    'suppressLineNumbers',
    'suppressAutoHyphens',
    'contextualSpacing',
    'textDirection',
    'textAlignment',
    'adjustRightInd',
    'overflowPunct',
    'autoSpaceDE',
    'autoSpaceDN',
    'snapToGrid',
    'wordWrap',
    'mirrorIndents',
    'kinsoku',
    'topLinePunct'
]);

/**
 * Schema-known children that stay parked in `pPrExtra` (deferred features /
 * markup-compat). Drain into schema slots on serialize.
 * Mark `w:rPr` is owned by {@link Paragraph.breakCharacterFormat} (not parked).
 * @private
 */
const PPR_EXTRA_ONLY: Set<string> = new Set([
    'framePr',
    'suppressOverlap',
    'textboxTightWrap',
    'divId',
    'cnfStyle',
    'pPrChange'
]);

const TAB_ALIGNMENTS: Set<string> = new Set<string>([
    'left',
    'center',
    'right',
    'decimal',
    'bar',
    'clear',
    'num',
    'start',
    'end'
]);

const TAB_LEADERS: Set<string> = new Set<string>([
    'none',
    'dot',
    'heavy',
    'hyphen',
    'middleDot',
    'underscore'
]);

function parseDecimalVal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}

function wmlAttrVal(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find(function (a: OpenXmlAttribute): boolean {
        return a.localName === localName && (a.prefix === 'w' || a.prefix === '');
    })), ts330 == null ? undefined : ts330.value);
}

function parseSignedTwipsAttr(el: OpenXmlElement, attrName: string): number | undefined {
    return parseDecimalVal(wmlAttrVal(el, attrName));
}

function parseNonNegTwipsAttr(el: OpenXmlElement, attrName: string): number | undefined {
    const n: number = parseDecimalVal(wmlAttrVal(el, attrName));
    if (n === undefined || n < 0) {
        return undefined;
    }
    return n;
}

function parseOnOffAttr(el: OpenXmlElement, attrName: string): boolean | undefined {
    const raw: string = wmlAttrVal(el, attrName);
    if (raw === '1' || raw === 'true') {
        return true;
    }
    if (raw === '0' || raw === 'false') {
        return false;
    }
    return undefined;
}

/**
 * Parse `w:ind` into a wire-twips {@link ParagraphIndentsRecord}.
 * Preserves `@start`/`@end`/`*Chars` for D2 round-trip.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ParagraphIndentsRecord | undefined} The result.
 * @private
 */
export function parseIndentsRecord(el: OpenXmlElement): ParagraphIndentsRecord | undefined {
    const ind: ParagraphIndentsRecord = {};
    const left: number = parseSignedTwipsAttr(el, 'left');
    const right: number = parseSignedTwipsAttr(el, 'right');
    const firstLine: number = parseNonNegTwipsAttr(el, 'firstLine');
    const hanging: number = parseNonNegTwipsAttr(el, 'hanging');
    const start: number = parseSignedTwipsAttr(el, 'start');
    const end: number = parseSignedTwipsAttr(el, 'end');
    const leftChars: number = parseNonNegTwipsAttr(el, 'leftChars');
    const rightChars: number = parseNonNegTwipsAttr(el, 'rightChars');
    const firstLineChars: number = parseNonNegTwipsAttr(el, 'firstLineChars');
    const hangingChars: number = parseNonNegTwipsAttr(el, 'hangingChars');
    if (left !== undefined) { ind.left = left; }
    if (right !== undefined) { ind.right = right; }
    if (firstLine !== undefined) { ind.firstLine = firstLine; }
    if (hanging !== undefined) { ind.hanging = hanging; }
    if (start !== undefined) { ind.start = start; }
    if (end !== undefined) { ind.end = end; }
    if (leftChars !== undefined) { ind.leftChars = leftChars; }
    if (rightChars !== undefined) { ind.rightChars = rightChars; }
    if (firstLineChars !== undefined) { ind.firstLineChars = firstLineChars; }
    if (hangingChars !== undefined) { ind.hangingChars = hangingChars; }
    if (indentsRecordIsEmpty(ind)) {
        return undefined;
    }
    return ind;
}

/**
 * Parse `w:spacing` into a wire-unit {@link ParagraphSpacingRecord}.
 * Preserves `@beforeLines`/`@afterLines` for round-trip.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ParagraphSpacingRecord | undefined} The result.
 * @private
 */
export function parseSpacingRecord(el: OpenXmlElement): ParagraphSpacingRecord | undefined {
    const sp: ParagraphSpacingRecord = {};
    const before: number = parseNonNegTwipsAttr(el, 'before');
    const after: number = parseNonNegTwipsAttr(el, 'after');
    const line: number = parseNonNegTwipsAttr(el, 'line');
    const lineRuleRaw: string = wmlAttrVal(el, 'lineRule');
    const lineRule: LineSpacingRule | undefined =
        lineRuleRaw === 'auto' || lineRuleRaw === 'exact' || lineRuleRaw === 'atLeast'
            ? lineRuleRaw
            : undefined;
    const beforeAutospacing: boolean = parseOnOffAttr(el, 'beforeAutospacing');
    const afterAutospacing: boolean = parseOnOffAttr(el, 'afterAutospacing');
    const beforeLines: number = parseSignedTwipsAttr(el, 'beforeLines');
    const afterLines: number = parseSignedTwipsAttr(el, 'afterLines');
    if (before !== undefined) { sp.before = before; }
    if (after !== undefined) { sp.after = after; }
    if (line !== undefined) { sp.line = line; }
    if (lineRule !== undefined) { sp.lineRule = lineRule; }
    if (beforeAutospacing !== undefined) { sp.beforeAutospacing = beforeAutospacing; }
    if (afterAutospacing !== undefined) { sp.afterAutospacing = afterAutospacing; }
    if (beforeLines !== undefined) { sp.beforeLines = beforeLines; }
    if (afterLines !== undefined) { sp.afterLines = afterLines; }
    if (spacingRecordIsEmpty(sp)) {
        return undefined;
    }
    return sp;
}

function parseTabs(el: OpenXmlElement): TabStop[] {
    let ts331: any;
    const stops: TabStop[] = [];
    for (const child of elementChildren(el)) {
        if (!isWml(child, 'tab')) {
            continue;
        }
        const posRaw: string = wmlAttrVal(child, 'pos');
        const n: number = parseDecimalVal(posRaw);
        if (n === undefined) {
            continue;
        }
        const val: string = ((ts331 = wmlAttrVal(child, 'val')), ts331 != null ? ts331 : 'left');
        const alignment: TabStopAlignment = TAB_ALIGNMENTS.has(val)
            ? (val as TabStopAlignment)
            : TabJustification.Left;
        const leaderRaw: string = wmlAttrVal(child, 'leader');
        const leader: TabLeader = leaderRaw !== undefined && TAB_LEADERS.has(leaderRaw)
            ? (leaderRaw as TabStopLeader)
            : undefined;
        stops.push({
            position: twipsToPoint(n),
            alignment: alignment,
            ...(leader !== undefined ? { leader: leader } : {})
        });
    }
    return stops;
}

function parseBorderEdge(el: OpenXmlElement): ParagraphBorder | undefined {
    const styleRaw: string = wmlAttrVal(el, 'val');
    if (styleRaw === undefined) {
        return undefined;
    }
    // Known tokens match BorderStyle (BORDER_STYLES is single-sourced from the
    // page-setup BorderStyle enum). Unknown loaded ST_Border values are still
    // stored so serialize can round-trip; load never throws (ADR D9).
    const style: BorderStyle = BORDER_STYLES.has(styleRaw)
        ? styleRaw as BorderStyle
        : styleRaw as BorderStyle;
    const colorRaw: string = wmlAttrVal(el, 'color');
    const szRaw: string = wmlAttrVal(el, 'sz');
    const sz: number = szRaw !== undefined ? parseDecimalVal(szRaw) : undefined;
    const spaceRaw: string = wmlAttrVal(el, 'space');
    const space: number = spaceRaw !== undefined ? parseDecimalVal(spaceRaw) : undefined;
    return {
        style: style,
        ...(colorRaw !== undefined ? { color: colorRaw } : {}),
        ...(sz !== undefined ? { size: sz } : {}),
        ...(space !== undefined ? { space: space } : {})
    };
}

function parsePBdr(el: OpenXmlElement): ParagraphBorders {
    let top: ParagraphBorder | undefined;
    let left: ParagraphBorder | undefined;
    let bottom: ParagraphBorder | undefined;
    let right: ParagraphBorder | undefined;
    let between: ParagraphBorder | undefined;
    let bar: ParagraphBorder | undefined;
    for (const child of elementChildren(el)) {
        if (!isWml(child, child.localName)) {
            continue;
        }
        const edge: ParagraphBorder = parseBorderEdge(child);
        if (edge === undefined) {
            continue;
        }
        if (child.localName === 'top') {
            top = edge;
        } else if (child.localName === 'left') {
            left = edge;
        } else if (child.localName === 'bottom') {
            bottom = edge;
        } else if (child.localName === 'right') {
            right = edge;
        } else if (child.localName === 'between') {
            between = edge;
        } else if (child.localName === 'bar') {
            bar = edge;
        }
    }
    return {
        ...(top !== undefined ? { top: top } : {}),
        ...(left !== undefined ? { left: left } : {}),
        ...(bottom !== undefined ? { bottom: bottom } : {}),
        ...(right !== undefined ? { right: right } : {}),
        ...(between !== undefined ? { between: between } : {}),
        ...(bar !== undefined ? { bar: bar } : {})
    };
}

function parseShd(el: OpenXmlElement): ParagraphShading {
    const fillRaw: string = wmlAttrVal(el, 'fill');
    const colorRaw: string = wmlAttrVal(el, 'color');
    const valRaw: string = wmlAttrVal(el, 'val');
    const pattern: ShadingPattern = valRaw !== undefined && SHADING_PATTERNS.has(valRaw)
        ? (valRaw as ShadingPattern)
        : undefined;
    return {
        ...(fillRaw !== undefined ? { fill: fillRaw } : {}),
        ...(colorRaw !== undefined ? { color: colorRaw } : {}),
        ...(pattern !== undefined ? { pattern: pattern } : {})
    };
}

/**
 * Parse `w:pPr` children into a {@link ParagraphFormatSnapshot}.
 * Invalid / unmodeled markup is parked in `pPrExtra` (never throws on load).
 * Does not consume `pStyle` / `numPr` / `rPr` / `sectPr` — callers handle those.
 *
 * @param {OpenXmlElement} pPrElement - The p pr element.
 * @returns {ParagraphFormatSnapshot} The result.
 * @private
 */
export function parseParagraphFormat(pPrElement: OpenXmlElement): ParagraphFormatSnapshot {
    const snap: ParagraphFormatSnapshot = emptyParagraphFormatSnapshot();
    const pPrExtra: OpenXmlElement[] = [];

    for (const prop of elementChildren(pPrElement)) {
        // Paragraph-owned children — skip (caller already handled, or ignore if orphan).
        if (isWml(prop, 'pStyle') || isWml(prop, 'numPr') || isWml(prop, 'rPr') || isWml(prop, 'sectPr')) {
            continue;
        }
        if (!isWml(prop, prop.localName)) {
            pPrExtra.push(prop);
            continue;
        }
        if (PPR_EXTRA_ONLY.has(prop.localName)) {
            pPrExtra.push(prop);
            continue;
        }
        // D5: foreign non-schema `w:suppressHyphenation` parks; never models.
        if (prop.localName === 'suppressHyphenation') {
            pPrExtra.push(prop);
            continue;
        }
        if (!MODELED_PPR.has(prop.localName)) {
            pPrExtra.push(prop);
            continue;
        }
        if (prop.localName === 'jc') {
            snap.jcRaw = wValAttribute(prop);
            continue;
        }
        if (prop.localName === 'outlineLvl') {
            const raw: string = wValAttribute(prop);
            if (raw !== undefined && /^-?\d+$/.test(raw)) {
                snap.outlineLevelValue = Number.parseInt(raw, 10);
            } else {
                pPrExtra.push(prop);
            }
            continue;
        }
        if (prop.localName === 'ind') {
            const parsed: ParagraphIndentsRecord = parseIndentsRecord(prop);
            if (parsed === undefined) {
                pPrExtra.push(prop);
            } else {
                snap.indentsValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'spacing') {
            const parsed: ParagraphSpacingRecord = parseSpacingRecord(prop);
            if (parsed === undefined) {
                pPrExtra.push(prop);
            } else {
                snap.spacingValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'tabs') {
            snap.tabStopsValue = parseTabs(prop);
            continue;
        }
        if (prop.localName === 'pBdr') {
            snap.bordersValue = parsePBdr(prop);
            continue;
        }
        if (prop.localName === 'shd') {
            snap.shadingValue = parseShd(prop);
            continue;
        }
        if (prop.localName === 'textDirection') {
            const raw: string = wValAttribute(prop);
            if (raw === undefined) {
                pPrExtra.push(prop);
                continue;
            }
            if (TEXT_DIRECTIONS.has(raw)) {
                snap.textDirectionValue = raw as ParagraphTextDirection;
                snap.textDirectionRaw = undefined;
            } else {
                // Unknown token: keep raw for RT; typed getter returns undefined.
                snap.textDirectionValue = undefined;
                snap.textDirectionRaw = raw;
            }
            continue;
        }
        if (prop.localName === 'textAlignment') {
            const raw: string = wValAttribute(prop);
            if (raw === undefined) {
                pPrExtra.push(prop);
                continue;
            }
            if (BASELINE_ALIGNMENTS.has(raw)) {
                snap.baselineAlignmentValue = raw as BaselineAlignment;
                snap.baselineAlignmentRaw = undefined;
            } else {
                snap.baselineAlignmentValue = undefined;
                snap.baselineAlignmentRaw = raw;
            }
            continue;
        }

        const flag: boolean = parseOnOff(prop);
        if (flag === undefined) {
            pPrExtra.push(prop);
            continue;
        }
        if (prop.localName === 'keepNext') {
            snap.keepNextValue = flag;
        } else if (prop.localName === 'keepLines') {
            snap.keepLinesValue = flag;
        } else if (prop.localName === 'pageBreakBefore') {
            snap.pageBreakBeforeValue = flag;
        } else if (prop.localName === 'widowControl') {
            snap.widowControlValue = flag;
        } else if (prop.localName === 'bidi') {
            snap.bidiValue = flag;
        } else if (prop.localName === 'suppressLineNumbers') {
            snap.suppressLineNumbersValue = flag;
        } else if (prop.localName === 'suppressAutoHyphens') {
            snap.suppressAutoHyphensValue = flag;
        } else if (prop.localName === 'contextualSpacing') {
            snap.contextualSpacingValue = flag;
        } else if (prop.localName === 'adjustRightInd') {
            snap.adjustRightIndentValue = flag;
        } else if (prop.localName === 'overflowPunct') {
            snap.overflowPunctuationValue = flag;
        } else if (prop.localName === 'autoSpaceDE') {
            snap.autoSpaceDEValue = flag;
        } else if (prop.localName === 'autoSpaceDN') {
            snap.autoSpaceDNValue = flag;
        } else if (prop.localName === 'snapToGrid') {
            snap.snapToGridValue = flag;
        } else if (prop.localName === 'wordWrap') {
            snap.wordWrapValue = flag;
        } else if (prop.localName === 'mirrorIndents') {
            snap.mirrorIndentsValue = flag;
        } else if (prop.localName === 'kinsoku') {
            snap.kinsokuValue = flag;
        } else if (prop.localName === 'topLinePunct') {
            snap.topLinePunctuationValue = flag;
        } else {
            pPrExtra.push(prop);
        }
    }

    snap.pPrExtra = pPrExtra;
    return snap;
}

// ---------------------------------------------------------------------------
// Serialize helpers (wire units)
// ---------------------------------------------------------------------------

function pushOnOff(children: OpenXmlElement[], localName: string, value: boolean | undefined): void {
    if (value === undefined) {
        return;
    }
    children.push(serializeOnOff(localName, value));
}

function pushParkedNamed(
    children: OpenXmlElement[],
    remaining: OpenXmlElement[],
    localName: string
): OpenXmlElement[] {
    const kept: OpenXmlElement[] = [];
    for (const element of remaining) {
        if (isWml(element, localName)) {
            children.push(element);
        } else {
            kept.push(element);
        }
    }
    return kept;
}

/**
 * Serialize wire-twips indents record → `w:ind`.
 * D2: authored `left`/`right` plus any RT `start`/`end`/`*Chars` slots.
 *
 * @param {ParagraphIndentsRecord} ind - The ind.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeIndentsRecord(ind: ParagraphIndentsRecord): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (ind.left !== undefined) {
        attrs.push(wmlAttr('left', String(ind.left)));
    }
    if (ind.right !== undefined) {
        attrs.push(wmlAttr('right', String(ind.right)));
    }
    if (ind.start !== undefined) {
        attrs.push(wmlAttr('start', String(ind.start)));
    }
    if (ind.end !== undefined) {
        attrs.push(wmlAttr('end', String(ind.end)));
    }
    if (ind.hanging !== undefined) {
        attrs.push(wmlAttr('hanging', String(ind.hanging)));
    }
    if (ind.firstLine !== undefined) {
        attrs.push(wmlAttr('firstLine', String(ind.firstLine)));
    }
    if (ind.leftChars !== undefined) {
        attrs.push(wmlAttr('leftChars', String(ind.leftChars)));
    }
    if (ind.rightChars !== undefined) {
        attrs.push(wmlAttr('rightChars', String(ind.rightChars)));
    }
    if (ind.firstLineChars !== undefined) {
        attrs.push(wmlAttr('firstLineChars', String(ind.firstLineChars)));
    }
    if (ind.hangingChars !== undefined) {
        attrs.push(wmlAttr('hangingChars', String(ind.hangingChars)));
    }
    return wmlElement('ind', { attributes: attrs });
}

/**
 * Serialize wire-unit spacing record → `w:spacing`.
 *
 * @param {ParagraphSpacingRecord} sp - The sp.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeSpacingRecord(sp: ParagraphSpacingRecord): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (sp.before !== undefined) {
        attrs.push(wmlAttr('before', String(sp.before)));
    }
    if (sp.after !== undefined) {
        attrs.push(wmlAttr('after', String(sp.after)));
    }
    if (sp.beforeLines !== undefined) {
        attrs.push(wmlAttr('beforeLines', String(sp.beforeLines)));
    }
    if (sp.afterLines !== undefined) {
        attrs.push(wmlAttr('afterLines', String(sp.afterLines)));
    }
    if (sp.line !== undefined) {
        attrs.push(wmlAttr('line', String(sp.line)));
        // Schema default is auto; emit explicitly so consumers do not have to
        // apply the XSD default when @line is present without @lineRule.
        attrs.push(wmlAttr('lineRule', sp.lineRule !== undefined ? sp.lineRule : 'auto'));
    } else if (sp.lineRule !== undefined) {
        attrs.push(wmlAttr('lineRule', sp.lineRule));
    }
    if (sp.beforeAutospacing !== undefined) {
        attrs.push(wmlAttr('beforeAutospacing', sp.beforeAutospacing ? '1' : '0'));
    }
    if (sp.afterAutospacing !== undefined) {
        attrs.push(wmlAttr('afterAutospacing', sp.afterAutospacing ? '1' : '0'));
    }
    return wmlElement('spacing', { attributes: attrs });
}

function serializeTabs(stops: TabStop[]): OpenXmlElement {
    const children: OpenXmlElement[] = stops.map(function (s: TabStop): OpenXmlElement {
        const attrs: ReturnType<typeof wmlAttr>[] = [
            wmlAttr('val', s.alignment),
            wmlAttr('pos', String(pointToTwips(s.position)))
        ];
        if (s.leader !== undefined) {
            attrs.push(wmlAttr('leader', s.leader));
        }
        return wmlElement('tab', { attributes: attrs });
    });
    return wmlElement('tabs', { children: children });
}

function serializeBorderEdge(localName: string, edge: ParagraphBorder): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [wmlAttr('val', edge.style)];
    if (edge.color !== undefined) {
        attrs.push(wmlAttr('color', edge.color));
    }
    if (edge.size !== undefined) {
        attrs.push(wmlAttr('sz', String(edge.size)));
    }
    if (edge.space !== undefined) {
        attrs.push(wmlAttr('space', String(edge.space)));
    }
    return wmlElement(localName, { attributes: attrs });
}

function serializePBdr(borders: ParagraphBorders): OpenXmlElement {
    const children: OpenXmlElement[] = [];
    if (borders.top !== undefined) {
        children.push(serializeBorderEdge('top', borders.top));
    }
    if (borders.left !== undefined) {
        children.push(serializeBorderEdge('left', borders.left));
    }
    if (borders.bottom !== undefined) {
        children.push(serializeBorderEdge('bottom', borders.bottom));
    }
    if (borders.right !== undefined) {
        children.push(serializeBorderEdge('right', borders.right));
    }
    if (borders.between !== undefined) {
        children.push(serializeBorderEdge('between', borders.between));
    }
    if (borders.bar !== undefined) {
        children.push(serializeBorderEdge('bar', borders.bar));
    }
    return wmlElement('pBdr', { children: children });
}

function serializeShd(shd: ParagraphShading): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (shd.pattern !== undefined) {
        attrs.push(wmlAttr('val', shd.pattern));
    }
    if (shd.color !== undefined) {
        attrs.push(wmlAttr('color', shd.color));
    }
    if (shd.fill !== undefined) {
        attrs.push(wmlAttr('fill', shd.fill));
    }
    return wmlElement('shd', { attributes: attrs });
}

/**
 * Materialize format-owned `w:pPr` children in CT_PPrBase / CT_PPr order.
 * Inject optional paragraph-owned `numPr` / `sectPr` at schema positions.
 * D5: never emits `w:suppressHyphenation` from typed state.
 *
 * @param {ParagraphFormatSnapshot} snap - The snap.
 * @param {ParagraphPPrInject} inject - The inject.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
export function buildPPrChildrenFromSnapshot(
    snap: ParagraphFormatSnapshot,
    inject?: ParagraphPPrInject
): OpenXmlElement[] {
    const children: OpenXmlElement[] = [];
    let remaining: OpenXmlElement[] = snap.pPrExtra.slice();

    pushOnOff(children, 'keepNext', snap.keepNextValue);
    pushOnOff(children, 'keepLines', snap.keepLinesValue);
    pushOnOff(children, 'pageBreakBefore', snap.pageBreakBeforeValue);
    remaining = pushParkedNamed(children, remaining, 'framePr');
    pushOnOff(children, 'widowControl', snap.widowControlValue);

    if (inject !== undefined && inject.numPr !== undefined) {
        children.push(inject.numPr);
    }

    pushOnOff(children, 'suppressLineNumbers', snap.suppressLineNumbersValue);

    if (snap.bordersValue !== undefined) {
        children.push(serializePBdr(snap.bordersValue));
    }
    if (snap.shadingValue !== undefined && shadingHasEntries(snap.shadingValue)) {
        children.push(serializeShd(snap.shadingValue));
    }
    if (snap.tabStopsValue !== undefined && snap.tabStopsValue.length > 0) {
        children.push(serializeTabs(snap.tabStopsValue));
    }

    // D5: only schema `w:suppressAutoHyphens` — never author-emit suppressHyphenation.
    pushOnOff(children, 'suppressAutoHyphens', snap.suppressAutoHyphensValue);
    pushOnOff(children, 'kinsoku', snap.kinsokuValue);
    pushOnOff(children, 'wordWrap', snap.wordWrapValue);
    pushOnOff(children, 'overflowPunct', snap.overflowPunctuationValue);
    pushOnOff(children, 'topLinePunct', snap.topLinePunctuationValue);
    pushOnOff(children, 'autoSpaceDE', snap.autoSpaceDEValue);
    pushOnOff(children, 'autoSpaceDN', snap.autoSpaceDNValue);
    pushOnOff(children, 'bidi', snap.bidiValue);
    pushOnOff(children, 'adjustRightInd', snap.adjustRightIndentValue);
    pushOnOff(children, 'snapToGrid', snap.snapToGridValue);

    if (snap.spacingValue !== undefined && !spacingRecordIsEmpty(snap.spacingValue)) {
        children.push(serializeSpacingRecord(snap.spacingValue));
    }
    if (snap.indentsValue !== undefined && !indentsRecordIsEmpty(snap.indentsValue)) {
        children.push(serializeIndentsRecord(snap.indentsValue));
    }

    pushOnOff(children, 'contextualSpacing', snap.contextualSpacingValue);
    pushOnOff(children, 'mirrorIndents', snap.mirrorIndentsValue);
    remaining = pushParkedNamed(children, remaining, 'suppressOverlap');

    if (snap.jcRaw !== undefined) {
        children.push(wmlElement('jc', { attributes: [wmlAttr('val', snap.jcRaw)] }));
    }

    // Prefer typed token; else raw unknown for RT.
    if (snap.textDirectionValue !== undefined) {
        children.push(wmlElement('textDirection', {
            attributes: [wmlAttr('val', snap.textDirectionValue)]
        }));
    } else if (snap.textDirectionRaw !== undefined) {
        children.push(wmlElement('textDirection', {
            attributes: [wmlAttr('val', snap.textDirectionRaw)]
        }));
    }

    if (snap.baselineAlignmentValue !== undefined) {
        children.push(wmlElement('textAlignment', {
            attributes: [wmlAttr('val', snap.baselineAlignmentValue)]
        }));
    } else if (snap.baselineAlignmentRaw !== undefined) {
        children.push(wmlElement('textAlignment', {
            attributes: [wmlAttr('val', snap.baselineAlignmentRaw)]
        }));
    }

    remaining = pushParkedNamed(children, remaining, 'textboxTightWrap');
    remaining = pushParkedNamed(children, remaining, 'divId');
    remaining = pushParkedNamed(children, remaining, 'cnfStyle');

    if (snap.outlineLevelValue !== undefined) {
        children.push(wmlElement('outlineLvl', {
            attributes: [wmlAttr('val', String(snap.outlineLevelValue))]
        }));
    }

    // Mark rPr is paragraph-owned (breakCharacterFormat); inject replaces parking.
    if (inject !== undefined && inject.rPr !== undefined) {
        children.push(inject.rPr);
    }

    if (inject !== undefined && inject.sectPr !== undefined) {
        children.push(inject.sectPr);
    }

    remaining = pushParkedNamed(children, remaining, 'pPrChange');

    // Any remaining parked / unknown / foreign (incl. suppressHyphenation if still present) at end.
    for (const element of remaining) {
        children.push(element);
    }

    return children;
}

// ---------------------------------------------------------------------------
// Styles-surface helpers (points bags + lineSpacing alias) — shared codecs
// ---------------------------------------------------------------------------

/**
 * Wire `w:spacing` → public points {@link ParagraphSpacing} with `lineSpacing` key.
 * Used by the styles feature; preserves prior payload shape.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ParagraphSpacing | undefined} The result.
 * @private
 */
export function parseParagraphSpacingPoints(el: OpenXmlElement): ParagraphSpacing | undefined {
    if (!isWml(el, 'spacing')) {
        return undefined;
    }
    const record: ParagraphSpacingRecord = parseSpacingRecord(el);
    if (record === undefined) {
        return undefined;
    }
    // Styles surface historically omitted autospacing / *Lines; keep that shape.
    if (record.before === undefined
        && record.after === undefined
        && record.line === undefined
        && record.lineRule === undefined) {
        return undefined;
    }
    return {
        ...(record.before !== undefined ? { before: twipsToPoint(record.before) } : {}),
        ...(record.after !== undefined ? { after: twipsToPoint(record.after) } : {}),
        ...(record.line !== undefined ? { lineSpacing: twipsToPoint(record.line) } : {}),
        ...(record.lineRule !== undefined ? { lineRule: record.lineRule } : {})
    };
}

/**
 * Wire `w:ind` → public points {@link ParagraphIndentation}.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ParagraphIndentation | undefined} The result.
 * @private
 */
export function parseParagraphIndentationPoints(el: OpenXmlElement): ParagraphIndentation | undefined {
    if (!isWml(el, 'ind')) {
        return undefined;
    }
    const record: ParagraphIndentsRecord = parseIndentsRecord(el);
    if (record === undefined) {
        return undefined;
    }
    // Styles surface: physical left/right only (matches prior codec).
    const left: number = record.left !== undefined
        ? twipsToPoint(record.left)
        : undefined;
    const right: number = record.right !== undefined
        ? twipsToPoint(record.right)
        : undefined;
    if (left === undefined && right === undefined
        && record.firstLine === undefined && record.hanging === undefined) {
        return undefined;
    }
    return {
        ...(left !== undefined ? { left: left } : {}),
        ...(right !== undefined ? { right: right } : {}),
        ...(record.firstLine !== undefined ? { firstLine: twipsToPoint(record.firstLine) } : {}),
        ...(record.hanging !== undefined ? { hanging: twipsToPoint(record.hanging) } : {})
    };
}

/**
 * Points {@link ParagraphSpacing} → `w:spacing` (styles `lineSpacing` key).
 *
 * @param {ParagraphSpacing} spacing - The spacing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeParagraphSpacingPoints(spacing: ParagraphSpacing): OpenXmlElement {
    const record: ParagraphSpacingRecord = {};
    if (spacing.before !== undefined) {
        record.before = pointToTwips(spacing.before);
    }
    if (spacing.after !== undefined) {
        record.after = pointToTwips(spacing.after);
    }
    const line: number = spacing.lineSpacing !== undefined
        ? spacing.lineSpacing
        : spacing.line;
    if (line !== undefined) {
        record.line = pointToTwips(line);
    }
    if (spacing.lineRule !== undefined) {
        record.lineRule = spacing.lineRule;
    }
    if (spacing.beforeAutospacing !== undefined) {
        record.beforeAutospacing = spacing.beforeAutospacing;
    }
    if (spacing.afterAutospacing !== undefined) {
        record.afterAutospacing = spacing.afterAutospacing;
    }
    return serializeSpacingRecord(record);
}

/**
 * Points {@link ParagraphIndentation} → `w:ind` (D2 left/right spellings).
 *
 * @param {ParagraphIndentation} indentation - The indentation.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeParagraphIndentationPoints(indentation: ParagraphIndentation): OpenXmlElement {
    const record: ParagraphIndentsRecord = {};
    if (indentation.left !== undefined) {
        record.left = pointToTwips(indentation.left);
    }
    if (indentation.right !== undefined) {
        record.right = pointToTwips(indentation.right);
    }
    if (indentation.firstLine !== undefined) {
        record.firstLine = pointToTwips(indentation.firstLine);
    }
    if (indentation.hanging !== undefined) {
        record.hanging = pointToTwips(indentation.hanging);
    }
    return serializeIndentsRecord(record);
}

/**
 * Worksheet conditional formatting (`CT_ConditionalFormatting` / `CT_CfRule`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.18 `conditionalFormatting` / §18.3.1.10 `cfRule`
 * - transitional sml.xsd `CT_ConditionalFormatting` / `CT_CfRule` /
 *   `ST_CfType` / `ST_ConditionalFormattingOperator` / `ST_TimePeriod` / `ST_Sqref`
 * - docs/specs/conditional-formatting.md
 * - docs/ooxml-mapping/conditional-formatting.md
 *
 * Formulas are opaque text (never evaluated). Empty collection omits all CF
 * parents. Rules sharing identical formatted sqref + pivot group into one parent
 * on serialize. Overlapping sqref is allowed; add always appends.
 */

import { formatA1Range, parseA1, parseA1Range, CellCoord, CellRange } from '../address/cell-address';
import { normalizeFormulaExpression } from '../cell/formula';
import { InvalidArgumentError, InvalidConditionalFormattingError } from '../core/errors';
import { escapeXml, unescapeXml } from '../core/xml/minimal-xml';
import { parseColorAttrs, serializeColorElement, Color, DifferentialFormatInput, DifferentialFormatView } from '../styles/styles-xml';
import { WorkbookStyles } from '../styles/workbook-styles';

/**
 * Specifies the kind of condition a formatting rule tests, such as
 * comparing values, ranking them, or matching text.
 */
export type ConditionalFormatType =
    | 'expression'
    | 'cellIs'
    | 'colorScale'
    | 'dataBar'
    | 'iconSet'
    | 'top10'
    | 'uniqueValues'
    | 'duplicateValues'
    | 'containsText'
    | 'notContainsText'
    | 'beginsWith'
    | 'endsWith'
    | 'containsBlanks'
    | 'notContainsBlanks'
    | 'containsErrors'
    | 'notContainsErrors'
    | 'timePeriod'
    | 'aboveAverage';

/**
 * Specifies the comparison a rule applies to cell values, such as
 * greater-than or between.
 */
export type ConditionalFormatOperator =
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'equal'
    | 'notEqual'
    | 'greaterThanOrEqual'
    | 'greaterThan'
    | 'between'
    | 'notBetween'
    | 'containsText'
    | 'notContains'
    | 'beginsWith'
    | 'endsWith';

/** Specifies the time period a rule matches, such as today or last month. */
export type ConditionalFormatTimePeriod =
    'today' | 'yesterday' | 'tomorrow' | 'last7Days' | 'thisMonth' | 'lastMonth' | 'nextMonth' | 'thisWeek' | 'lastWeek' | 'nextWeek';

// ── Advanced CF visual types ─────────────────────────────────────────────────

/**
 * Specifies how a threshold's value is chosen for data bar, color scale,
 * and icon set rules — for example a fixed number, a percentage, or the
 * lowest or highest value in the range.
 */
export type CfThresholdType = 'lowestValue' | 'highestValue' | 'number' | 'percent' | 'percentile' | 'formula' | 'autoMin' | 'autoMax';

/** Specifies the direction data bars are drawn, such as left to right. */
export type DataBarDirection = 'context' | 'leftToRight' | 'rightToLeft';

/** Specifies where data bars draw their axis, such as in the middle or not at all. */
export type DataBarAxisPosition = 'automatic' | 'middle' | 'none';

/**
 * Specifies the family of icons used by an icon set rule, such as three
 * arrows, five quarters, or an Excel-extended family (`3Stars`,
 * `3Triangles`, `5Boxes`). Extended families are not in transitional
 * `ST_IconSetType`; they are written on the x14 icon set and a same-count
 * fallback is written on the transitional attribute.
 */
export type IconSetType =
    | '3Arrows'
    | '3ArrowsGray'
    | '3Flags'
    | '3TrafficLights1'
    | '3TrafficLights2'
    | '3Signs'
    | '3Symbols'
    | '3Symbols2'
    | '3Stars'
    | '3Triangles'
    | '4Arrows'
    | '4ArrowsGray'
    | '4RedToBlack'
    | '4Rating'
    | '4TrafficLights'
    | '5Arrows'
    | '5ArrowsGray'
    | '5Rating'
    | '5Quarters'
    | '5Boxes';

/**
 * Defines one end of a data bar range, specifying the value the shortest or
 * longest bar represents.
 *
 * `value` is required when `type` is `'number'`, `'percent'`, `'percentile'`,
 * or `'formula'`.
 */
export interface CfValuePoint {
    /**
     * How the endpoint's value is chosen — for example, the lowest or highest
     * value, a fixed number, or a formula.
     */
    readonly type: CfThresholdType;
    /**
     * The endpoint's value, required unless `type` is `lowestValue` or
     * `highestValue`.
     */
    readonly value?: string;
}

/**
 * Defines one anchor point in a color scale rule, specifying the value and
 * color used at that point of the gradient.
 *
 * `value` is required when `type` is `'number'`, `'percent'`, `'percentile'`,
 * or `'formula'`.
 */
export interface CfColorStop {
    /**
     * How the point's value is chosen — for example, the lowest value, a
     * fixed number, or a formula.
     */
    readonly type: CfThresholdType;
    /**
     * The point's value, required unless `type` is `lowestValue` or
     * `highestValue`.
     */
    readonly value?: string;
    /** The color shown where the scale reaches this point. */
    readonly color: Color;
}

/**
 * Defines one threshold in an icon set rule, specifying the value a cell
 * must meet to receive that icon.
 *
 * When `greaterThanOrEqual` is `false`, the icon triggers on strictly
 * greater values instead of greater-than-or-equal. Default `true`.
 */
export interface CfIconCriterion {
    /**
     * How the threshold's value is chosen — for example, a fixed number, a
     * percentage, or a formula.
     */
    readonly type: CfThresholdType;
    /**
     * The threshold's value, required unless `type` is `lowestValue` or
     * `highestValue`.
     */
    readonly value?: string;
    /** Whether cells matching the threshold exactly trigger this icon. Default `true`. */
    readonly greaterThanOrEqual?: boolean;
}

/**
 * Represents the data bar settings of a conditional formatting rule,
 * letting you draw in-cell bars whose length reflects each cell's value.
 *
 * Enable with `rule.type = 'dataBar'`, then configure properties on this handle.
 * There is no public bag/input type for data bars.
 */
export interface DataBar {
    /** The color the bars are drawn in. */
    barColor: Color;
    /** The value the shortest bar represents. */
    minPoint: CfValuePoint;
    /** The value the longest bar represents. */
    maxPoint: CfValuePoint;
    /** The shortest bar's length, as a percentage of the cell width (0–100). */
    minLength: number;
    /** The longest bar's length, as a percentage of the cell width (0–100). */
    maxLength: number;
    /**
     * Whether the cell value remains visible next to its data bar. Set to
     * `false` to display the bar only. Default `true`.
     */
    showValue: boolean;
    /** Whether a border is drawn around each bar. */
    hasBorder: boolean;
    /** The border color, when bars have a border. */
    borderColor: Color | undefined;
    /** Whether bars are drawn with a gradient fade. Default `true`. */
    gradient: boolean;
    /** Which way the bars grow: with context, left to right, or right to left. */
    dataBarDirection: DataBarDirection;
    /** Whether negative-value bars use the same fill color as positive bars. Default `false`. */
    negativeBarColorSameAsPositive: boolean;
    /**
     * Fill color of the data bars drawn for negative values. Takes effect only
     * when `negativeBarColorSameAsPositive` is `false`; when `undefined`, the
     * viewer applies its built-in default (red in Excel).
     */
    negativeFillColor: Color | undefined;
    /** Whether negative-value bars use the same border color as positive bars. Default `true`. */
    negativeBarBorderColorSameAsPositive: boolean;
    /**
     * Border color of the data bars drawn for negative values. Takes effect
     * only when `hasBorder` is `true` and
     * `negativeBarBorderColorSameAsPositive` is `false`; otherwise the negative
     * bars reuse `borderColor`. When `undefined`, the viewer applies its
     * built-in default.
     */
    negativeBorderColor: Color | undefined;
    /** Where the axis line between negative and positive bars is drawn. */
    dataBarAxisPosition: DataBarAxisPosition;
    /** The color of the axis line, when shown. */
    barAxisColor: Color | undefined;
}

/**
 * Represents the gradient configuration of a color scale rule, defining the
 * colors and values for its minimum, midpoint, and maximum.
 */
export interface ColorScale {
    /** The color and value at the low end of the scale. */
    minPoint: CfColorStop;
    /** The optional middle color and value of the scale. Undefined for two-color scales. */
    midPoint: CfColorStop | undefined;
    /** The color and value at the high end of the scale. */
    maxPoint: CfColorStop;
}

/**
 * Represents the icon set settings of a conditional formatting rule,
 * letting you assign icons such as traffic lights or arrows based on each
 * cell's value.
 */
export interface IconSet {
    /**
     * The icon family the rule draws its icons from — for example
     * `'3TrafficLights1'` (red, yellow, green circles) or `'3Arrows'`.
     */
    iconSetType: IconSetType;
    /**
     * The value thresholds that decide which icon each cell gets. One entry
     * per icon in the current `iconSetType` family, in low-to-high order.
     */
    iconCriteria: CfIconCriterion[];
    /**
     * Whether the cell value remains visible next to its icon. Set to
     * `false` to display the icon only. Default `true`.
     */
    showValue: boolean;
    /**
     * Whether the thresholds in `iconCriteria` are percentages (of the
     * range's values) rather than absolute numbers. Default `true`.
     */
    usePercent: boolean;
    /**
     * Whether the icon order is flipped, so the "best" icon marks the lowest
     * values instead of the highest. Default `false`.
     */
    reverse: boolean;
}

const CF_TYPES: ReadonlySet<string> = new Set([
    'expression',
    'cellIs',
    'colorScale',
    'dataBar',
    'iconSet',
    'top10',
    'uniqueValues',
    'duplicateValues',
    'containsText',
    'notContainsText',
    'beginsWith',
    'endsWith',
    'containsBlanks',
    'notContainsBlanks',
    'containsErrors',
    'notContainsErrors',
    'timePeriod',
    'aboveAverage'
]);

const CF_OPERATORS: ReadonlySet<string> = new Set([
    'lessThan',
    'lessThanOrEqual',
    'equal',
    'notEqual',
    'greaterThanOrEqual',
    'greaterThan',
    'between',
    'notBetween',
    'containsText',
    'notContains',
    'beginsWith',
    'endsWith'
]);

const CF_TIME_PERIODS: ReadonlySet<string> = new Set([
    'today',
    'yesterday',
    'tomorrow',
    'last7Days',
    'thisMonth',
    'lastMonth',
    'nextMonth',
    'thisWeek',
    'lastWeek',
    'nextWeek'
]);

/** XSD defaults for CT_CfRule / CT_ConditionalFormatting attributes. */
const DEFAULT_TYPE: ConditionalFormatType = 'cellIs';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_STOP_IF_TRUE: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_PIVOT: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_ABOVE_AVERAGE: true = true;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_PERCENT: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_BOTTOM: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_EQUAL_AVERAGE: false = false;

// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const MAX_FORMULAS: 3 = 3;

// ── Advanced CF constants ────────────────────────────────────────────────────

/** OOXML `ST_CfvoType` → public `CfThresholdType`. */
const CFVO_TYPE_MAP: Map<string, CfThresholdType> = new Map<string, CfThresholdType>([
    ['min', 'lowestValue'],
    ['max', 'highestValue'],
    ['num', 'number'],
    ['percent', 'percent'],
    ['percentile', 'percentile'],
    ['formula', 'formula'],
    // [MS-XLSX] ST_CfvoType for x14 data bars
    ['autoMin', 'autoMin'],
    ['autoMax', 'autoMax']
]);

/** Public `CfThresholdType` → OOXML wire string. */
const CFVO_TYPE_REVERSE: Map<CfThresholdType, string> = new Map<CfThresholdType, string>([
    ['lowestValue', 'min'],
    ['highestValue', 'max'],
    ['number', 'num'],
    ['percent', 'percent'],
    ['percentile', 'percentile'],
    ['formula', 'formula'],
    ['autoMin', 'autoMin'],
    ['autoMax', 'autoMax']
]);

/** Valid `ST_IconSetType` values as a set for O(1) membership. */
const ICON_SET_TYPES: ReadonlySet<string> = new Set<string>([
    '3Arrows',
    '3ArrowsGray',
    '3Flags',
    '3TrafficLights1',
    '3TrafficLights2',
    '3Signs',
    '3Symbols',
    '3Symbols2',
    '3Stars',
    '3Triangles',
    '4Arrows',
    '4ArrowsGray',
    '4RedToBlack',
    '4Rating',
    '4TrafficLights',
    '5Arrows',
    '5ArrowsGray',
    '5Rating',
    '5Quarters',
    '5Boxes'
]);

/**
 * Icon families absent from transitional `ST_IconSetType` / `sml.xsd`.
 * Written only on x14 `CT_IconSet`. Excel paints them from that extension
 * (`Resaved.xlsx`); the transitional attribute gets a same-count fallback.
 */
const X14_ONLY_ICON_SET_TYPES: ReadonlySet<string> = new Set<string>(['3Stars', '3Triangles', '5Boxes']);

const DEFAULT_ICON_SET_TYPE: IconSetType = '3TrafficLights1';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_MIN_LENGTH: 10 = 10;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_MAX_LENGTH: 90 = 90;

/** [MS-XLSX] x14 CT_DataBar attribute defaults. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_BORDER: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_GRADIENT: true = true;
const DEFAULT_DATA_BAR_DIRECTION: DataBarDirection = 'context';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_NEG_COLOR_SAME: false = false;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DATA_BAR_NEG_BORDER_SAME: true = true;
const DEFAULT_DATA_BAR_AXIS_POSITION: DataBarAxisPosition = 'automatic';

/**
 * Sheet-level extension URI for `x14:conditionalFormattings`.
 * Citation: [MS-XLSX] extLst under worksheet; engineering pack samples.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const X14_CF_SHEET_EXT_URI: '{78C0D931-6437-407D-A8EE-F0AAD7539E65}' = '{78C0D931-6437-407D-A8EE-F0AAD7539E65}';

/**
 * Rule-level extension URI for the GUID `id` pairing transitional ↔ x14.
 * Citation: [MS-XLSX] extLst under cfRule.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const X14_CF_RULE_ID_EXT_URI: '{B025F937-C7B1-47D3-B67F-A62EFF666E3E}' = '{B025F937-C7B1-47D3-B67F-A62EFF666E3E}';

// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const X14_NS: 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main' = 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const XM_NS: 'http://schemas.microsoft.com/office/excel/2006/main' = 'http://schemas.microsoft.com/office/excel/2006/main';

const DATA_BAR_DIRECTIONS: ReadonlySet<string> = new Set(['context', 'leftToRight', 'rightToLeft']);
const DATA_BAR_AXIS_POSITIONS: ReadonlySet<string> = new Set(['automatic', 'middle', 'none']);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a single conditional formatting rule, letting you choose how
 * cells are highlighted, colored, or ranked when their values meet a
 * condition.
 *
 * Configure scalars, formulas, format, and visual models on the returned handle after
 * {@link ConditionalFormats.add}.
 */
export interface ConditionalFormat {
    /**
     * The cell range the rule applies to, such as `A1:C10`. Multiple areas can
     * be listed separated by spaces.
     */
    sqref: string;
    /** The kind of condition the rule tests, such as comparing values, ranking them, or matching text. */
    type: ConditionalFormatType;
    /** The comparison the rule applies, such as greater-than or between. Used with value-comparison rule types. */
    operator: ConditionalFormatOperator | undefined;
    /** The rule's formulas. Setting replaces the whole list at once. */
    formulas: ReadonlyArray<string>;
    /**
     * The rule's first formula — for example the threshold in a greater-than
     * rule. Clearing it removes the formula and shifts later ones forward.
     */
    firstFormula: string | undefined;
    /**
     * The rule's second formula — for example the upper bound in a between
     * rule. Can only be set when `firstFormula` is set.
     */
    secondFormula: string | undefined;
    /**
     * The rule's evaluation order. Lower numbers are evaluated first when
     * several rules overlap a cell.
     */
    priority: number;
    /**
     * When `true` and this rule matches, Excel skips any lower-priority rules
     * for the same cell.
     */
    stopIfTrue: boolean;
    /** The text a text-matching rule looks for. */
    text: string | undefined;
    /** The time period a date-matching rule tests for, such as today or last week. */
    timePeriod: ConditionalFormatTimePeriod | undefined;
    /**
     * Gets or sets the highlight formatting the rule applies when it matches
     * — font, fill, border, and number format.
     *
     * Read as {@link DifferentialFormatView}; write accepts
     * {@link DifferentialFormatInput}. Declared as a property for TypeScript 3.3
     * interface compatibility (no get/set in interfaces).
     */
    format: DifferentialFormatView | DifferentialFormatInput | undefined;
    /** How many cells a top-10 style rule affects, such as the top 10 values. */
    rank: number | undefined;
    /** When `true`, a top-10 style rule treats `rank` as a percentage — e.g. rank `10` means the top 10%. */
    percent: boolean;
    /** When `true`, a top-10 style rule targets the *bottom* values instead of the top. */
    bottom: boolean;
    /** When `true`, an average rule highlights values *above* the average; when `false`, below it. */
    aboveAverage: boolean;
    /** When `true`, an average rule also highlights cells that exactly equal the average. */
    equalAverage: boolean;
    /** When set, an average rule highlights values this many standard deviations above or below the average. */
    stdDev: number | undefined;
    /**
     * The rule's data bar settings. Available when the rule type is `dataBar`;
     * set `type = 'dataBar'` first to enable it.
     *
     * Property form for TypeScript 3.3 interface compatibility. Runtime setter
     * only accepts `undefined` (clear); enable via `type = 'dataBar'`.
     */
    dataBar: DataBar | undefined;
    /**
     * The rule's color scale settings. Available when the rule type is
     * `colorScale`; set `type = 'colorScale'` first to enable it.
     *
     * Property form for TypeScript 3.3 interface compatibility. Runtime setter
     * only accepts `undefined` (clear); enable via `type = 'colorScale'`.
     */
    colorScale: ColorScale | undefined;
    /**
     * The rule's icon set settings. Available when the rule type is `iconSet`;
     * set `type = 'iconSet'` first to enable it.
     *
     * Property form for TypeScript 3.3 interface compatibility. Runtime setter
     * only accepts `undefined` (clear); enable via `type = 'iconSet'`.
     */
    iconSet: IconSet | undefined;
}

/**
 * Represents the collection of conditional formatting rules on a worksheet,
 * letting you add, find, and remove rules.
 *
 * Overlapping sqref is allowed; {@link add} always appends a default `cellIs` rule
 * for the given sqref. Configure type, formulas, format, and visuals on the handle.
 */
export interface ConditionalFormats {
    /** The number of rules on the worksheet. */
    readonly count: number;
    /** Returns the rule at the given position, counted from zero. */
    item(index: number): ConditionalFormat;
    /**
     * Adds a new rule covering the given cell range, starting as a simple
     * value-comparison rule, and returns it for configuration.
     *
     * @throws InvalidArgumentError when sqref is empty/whitespace or not a string
     * @throws InvalidConditionalFormattingError when sqref tokens are invalid
     */
    add(sqref: string): ConditionalFormat;
    /** Removes the rule at the given position, counted from zero. */
    removeAt(index: number): void;
    /** Removes the given rule. Does nothing if it does not belong to this collection. */
    remove(rule: ConditionalFormat): void;
    /** Removes every rule from the worksheet. */
    clear(): void;
    /**
     * Returns every rule that covers the given cell, or an empty list if none.
     *
     * @throws InvalidAddressError when address is not a single cell
     */
    findByCell(address: string): ReadonlyArray<ConditionalFormat>;
}

// ── Internal structured visual-type models ───────────────────────────────────
// Not exported — public surface uses DataBar / ColorScale / IconSet interfaces.

/** Internal threshold point (includes gte flag used by iconSet cfvo). @private */
interface CfThresholdInternal {
    type: CfThresholdType;
    value: string | undefined;
    /** OOXML `CT_Cfvo/@gte` — default true; serialized only when false. */
    gte: boolean;
}

/** Internal data-bar state (transitional + x14 extended fields). @private */
interface DataBarData {
    minPoint: CfThresholdInternal;
    maxPoint: CfThresholdInternal;
    barColor: Color;
    minLength: number;
    maxLength: number;
    showValue: boolean;
    /** x14 `@border` / XlsIO HasBorder. */
    border: boolean;
    borderColor: Color | undefined;
    gradient: boolean;
    direction: DataBarDirection;
    negativeBarColorSameAsPositive: boolean;
    negativeFillColor: Color | undefined;
    negativeBarBorderColorSameAsPositive: boolean;
    negativeBorderColor: Color | undefined;
    axisPosition: DataBarAxisPosition;
    axisColor: Color | undefined;
}

/** One stop in an internal color-scale. @private */
interface ColorScaleStop {
    type: CfThresholdType;
    value: string | undefined;
    color: Color;
}

/**
 * Internal color-scale state. Preserves all parsed stops so that 4+ stop
 * scales survive round-trip even though the public API only exposes
 * min/mid/max. @private
 */
interface ColorScaleData {
    stops: ColorScaleStop[];
}

/** Internal icon-set state. @private */
interface IconSetData {
    iconSetType: IconSetType;
    iconCriteria: CfThresholdInternal[];
    showValue: boolean;
    usePercent: boolean;
    reverse: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Internal wire entry for one `cfRule` (owns its parent sqref + pivot).
 *
 * @private
 */
export interface ConditionalFormatEntry {
    ranges: CellRange[];
    pivot: boolean;
    type: ConditionalFormatType;
    priority: number;
    stopIfTrue: boolean;
    operator: ConditionalFormatOperator | undefined;
    formulas: string[];
    text: string | undefined;
    timePeriod: ConditionalFormatTimePeriod | undefined;
    rank: number | undefined;
    percent: boolean;
    bottom: boolean;
    aboveAverage: boolean;
    equalAverage: boolean;
    stdDev: number | undefined;
    /**
     * Zero-based index into stylesheet `dxfs` (`cfRule/@dxfId`).
     * Set via public `format` authoring or preserved on open.
     */
    dxfId: number | undefined;
    /** Extra attributes excluding modeled ones (XML fragment, no leading space). */
    extraAttrsXml: string;
    /**
     * Opaque child markup after modeled `formula` elements (extLst, unknown).
     * After TASK-1212 this no longer stores colorScale / dataBar / iconSet XML;
     * those live in structured fields. Rule-level x14 id pairing is stored in
     * {@link x14RuleId} rather than recomputed solely from this bag.
     */
    childrenXml: string;
    /** Parent-level extra attrs excluding pivot/sqref (rare; preserved). */
    parentExtraAttrsXml: string;
    /** Structured data-bar model; defined when `type === 'dataBar'`. */
    dataBarData: DataBarData | undefined;
    /** Structured color-scale model; defined when `type === 'colorScale'`. */
    colorScaleData: ColorScaleData | undefined;
    /** Structured icon-set model; defined when `type === 'iconSet'`. */
    iconSetData: IconSetData | undefined;
    /**
     * Pairing GUID between transitional `cfRule` and x14 rule
     * (`ST_Guid`, with braces). Present when dual-written or loaded from x14.
     * Citation: [MS-XLSX] ext `{B025F937-…}` / x14 `cfRule/@id`.
     */
    x14RuleId: string | undefined;
}

/**
 * Flat list of CF rules for worksheet XML model.
 *
 * @private
 */
export interface ConditionalFormattingModel {
    readonly entries: ReadonlyArray<ConditionalFormatEntry>;
}

/**
 * Per-save priority map so x14 icon-set priorities do not collide with
 * transitional `cfRule/@priority` ([MS-XLSX] 2.6.27).
 */
interface IconSetWirePriorities {
    readonly x14Count: number;
    readonly x14ByEntry: WeakMap<ConditionalFormatEntry, number>;
}

const iconSetWirePriorities: WeakMap<ConditionalFormattingModel, IconSetWirePriorities> = new WeakMap<
ConditionalFormattingModel,
IconSetWirePriorities
>();

/**
 * Assign non-colliding priorities for extended icon sets.
 *
 * Stars and boxes need a priority-bearing x14 rule (Excel ignores the
 * priority-less twin for those families), so transitional copies are shifted
 * above every x14 priority. [MS-XLSX] 2.6.27: an x14 `cfRule/@priority` must
 * not duplicate any other x14 or transitional `cfRule/@priority` in the same
 * worksheet.
 *
 * @param {ConditionalFormattingModel} model - Model whose entries are wired.
 * @returns {void} - Returns the result.
 */
function assignIconSetWirePriorities(model: ConditionalFormattingModel): void {
    const x14ByEntry: WeakMap<ConditionalFormatEntry, number> = new WeakMap<ConditionalFormatEntry, number>();
    let x14Count: number = 0;
    for (const e of model.entries) {
        if (e.iconSetData === undefined || !iconSetNeedsX14Priority(e.iconSetData.iconSetType)) {
            continue;
        }
        x14Count += 1;
        x14ByEntry.set(e, x14Count);
    }
    iconSetWirePriorities.set(model, { x14Count, x14ByEntry });
}

/**
 * Priority written for one entry on the named wire.
 *
 * @param {ConditionalFormattingModel | undefined} model - Model the entry belongs to.
 * @param {ConditionalFormatEntry} entry - Rule being serialized.
 * @param {'x14' | 'transitional'} which - Which priority slot to read.
 * @returns {number | undefined} Wired priority, or undefined when this entry has no x14 priority.
 */
function wirePriority(
    model: ConditionalFormattingModel | undefined,
    entry: ConditionalFormatEntry,
    which: 'x14' | 'transitional'
): number | undefined {
    if (model === undefined) {
        return undefined;
    }
    const wired: IconSetWirePriorities | undefined = iconSetWirePriorities.get(model);
    if (wired === undefined) {
        return undefined;
    }
    if (which === 'x14') {
        return wired.x14ByEntry.get(entry);
    }
    return entry.priority + wired.x14Count;
}

/**
 * Whether the icon family is not in transitional `ST_IconSetType`.
 *
 * @param {IconSetType} type - Icon family.
 * @returns {boolean} True for `3Stars`, `3Triangles`, and `5Boxes`.
 */
function isX14OnlyIconSetType(type: IconSetType): boolean {
    return X14_ONLY_ICON_SET_TYPES.has(type);
}

/**
 * Same-count transitional fallback. Omitting `@iconSet` is the schema default
 * `3TrafficLights1`, which is the `3Stars` fallback. `3Triangles` falls back
 * to `3Signs`; `5Boxes` falls back to `5Quarters`.
 *
 * @param {IconSetType} type - Extended icon family.
 * @returns {IconSetType} Transitional `ST_IconSetType` value.
 */
function transitionalIconSetFallback(type: IconSetType): IconSetType {
    if (type === '3Triangles') {
        return '3Signs';
    }
    if (type === '5Boxes') {
        return '5Quarters';
    }
    return DEFAULT_ICON_SET_TYPE;
}

/**
 * Extended families do not take the rule-id ext URI `{B025F937-…}`. Excel
 * omits it; a pairing ext made Excel paint the transitional fallback and
 * drop the id.
 *
 * @param {ConditionalFormatEntry} entry - Icon-set rule.
 * @returns {void} - Returns the result.
 */
function ensureX14IconSetPairing(entry: ConditionalFormatEntry): void {
    entry.x14RuleId = undefined;
}

/**
 * Stars and boxes need a priority-bearing x14 rule. Triangles are painted
 * from a priority-less twin alone.
 *
 * @param {IconSetType} type - Icon family.
 * @returns {boolean} True for `3Stars` and `5Boxes`.
 */
function iconSetNeedsX14Priority(type: IconSetType): boolean {
    return type === '3Stars' || type === '5Boxes';
}

/**
 * Host notifications for CF mutations.
 *
 * @private
 */
export interface ConditionalFormatsHost {
    markDirty(): void;
    /** Workbook styles table (for differential format ensure/lookup). */
    styles(): WorkbookStyles;
}

/**
 * Mutable conditional-formatting store.
 *
 * @private
 */
export class ConditionalFormatsImpl implements ConditionalFormats {
    private readonly entries: ConditionalFormatEntry[] = [];
    private readonly handles: Map<ConditionalFormatEntry, ConditionalFormatHandle> = new Map<
    ConditionalFormatEntry,
    ConditionalFormatHandle
    >();
    private host: ConditionalFormatsHost | undefined;

    /**
     * Creates an instance.
     *
     * @param {ConditionalFormattingModel} initial - The initial parameter.
     */
    public constructor(initial?: ConditionalFormattingModel) {
        if (initial !== undefined) {
            this.applyModel(initial);
        }
    }

    /**
     * bindHost method.
     *
     * @param {ConditionalFormatsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: ConditionalFormatsHost): void {
        this.host = host;
    }

    /**
     * Gets count.
     *
     * @returns {number} - Returns the result.
     */
    public get count(): number {
        return this.entries.length;
    }

    /**
     * list method.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<ConditionalFormat> {
        return this.entries.map((e: ConditionalFormatEntry): ConditionalFormat => this.handleFor(e));
    }

    /**
     * get method.
     *
     * @param {number} index - The index parameter.
     * @returns {ConditionalFormat} - Returns the result.
     */
    public get(index: number): ConditionalFormat {
        return this.item(index);
    }

    /**
     * item method.
     *
     * @param {number} index - The index parameter.
     * @returns {ConditionalFormat} - Returns the result.
     */
    public item(index: number): ConditionalFormat {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(`Conditional format index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: ConditionalFormatEntry = this.entries[index];
        if (entry === undefined) {
            throw new InvalidArgumentError(`Conditional format index ${String(index)} is out of range`);
        }
        return this.handleFor(entry);
    }

    /**
     * add method.
     *
     * @param {string} sqref - The sqref parameter.
     * @returns {ConditionalFormat} - Returns the result.
     */
    public add(sqref: string): ConditionalFormat {
        if (typeof sqref !== 'string' || sqref.trim().length === 0) {
            throw new InvalidArgumentError('Conditional format sqref must be a non-empty string');
        }
        const entry: ConditionalFormatEntry = createDefaultEntry(sqref, this.nextPriority(undefined));
        this.entries.push(entry);
        if (this.host != null) {
            this.host.markDirty();
        }
        return this.handleFor(entry);
    }

    /**
     * removeAt method.
     *
     * @param {number} index - The index parameter.
     * @returns {void} - Returns the result.
     */
    public removeAt(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(`Conditional format index ${String(index)} is out of range`);
        }
        const [removed] = this.entries.splice(index, 1);
        if (removed !== undefined) {
            this.handles.delete(removed);
        }
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * remove method.
     *
     * @param {ConditionalFormat} rule - The rule parameter.
     * @returns {void} - Returns the result.
     */
    public remove(rule: ConditionalFormat): void {
        if (!(rule instanceof ConditionalFormatHandle)) {
            throw new InvalidArgumentError('remove(rule) requires a handle from this collection');
        }
        const idx: number = this.entries.indexOf(rule.entry);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        this.handles.delete(rule.entry);
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * clear method.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        if (this.entries.length === 0) {
            return;
        }
        this.entries.length = 0;
        this.handles.clear();
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * True if any rule’s sqref contains the cell.
     *
     * @param {string} address - The address parameter.
     * @returns {boolean} - Returns the result.
     */
    public has(address: string): boolean {
        const coord: CellCoord = parseA1(address);
        return this.entries.some((e: ConditionalFormatEntry): boolean => cellInSqref(coord, e.ranges));
    }

    /**
     * findByCell method.
     *
     * @param {string} address - The address parameter.
     * @returns {Object} - Returns the result.
     */
    public findByCell(address: string): ReadonlyArray<ConditionalFormat> {
        const coord: CellCoord = parseA1(address);
        const out: ConditionalFormat[] = [];
        for (const e of this.entries) {
            if (cellInSqref(coord, e.ranges)) {
                out.push(this.handleFor(e));
            }
        }
        return out;
    }

    /**
     * Replace contents from parse (does not mark dirty).
     *
     * @param {ConditionalFormattingModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: ConditionalFormattingModel): void {
        this.applyModel(model);
    }

    /**
     * Snapshot for serialize.
     *
     * @returns {ConditionalFormattingModel} - Returns the result.
     */
    public toModel(): ConditionalFormattingModel {
        return {
            entries: this.entries.map(cloneEntry)
        };
    }

    /**
     * Merge x14 extended conditional formatting from worksheet after-sheet-data opaque bag (extLst URI 78C0D931). Soft-pairs by GUID then by dataBar order.
     *
     * @param {string} afterSheetDataXml - The afterSheetDataXml parameter.
     * @returns {void} - Returns the result.
     */
    public applyX14FromAfterSheetData(afterSheetDataXml: ReadonlyArray<string> | undefined): void {
        if (afterSheetDataXml === undefined || afterSheetDataXml.length === 0) {
            return;
        }
        mergeX14IntoEntries(this.entries, afterSheetDataXml);
    }

    /**
     * Rewrite sheet-level x14 CF ext in after-sheet-data bag. Preserves other ext entries and non-extLst siblings. Omits x14 ext when no dual-write rules.
     *
     * @param {string} afterSheetDataXml - The afterSheetDataXml parameter.
     * @returns {string[]} - Returns the result.
     */
    public rewriteAfterSheetDataXml(afterSheetDataXml: ReadonlyArray<string> | undefined): string[] {
        return rewriteX14SheetExt({ entries: this.entries }, afterSheetDataXml != null ? afterSheetDataXml : []);
    }

    /**
     * nextPriority method.
     *
     * @param {number} requested - The requested parameter.
     * @returns {number} - Returns the result.
     */
    private nextPriority(requested: number | undefined): number {
        if (requested !== undefined) {
            return requirePriority(requested);
        }
        let max: number = 0;
        for (const e of this.entries) {
            if (e.priority > max) {
                max = e.priority;
            }
        }
        return max + 1 < 1 ? 1 : max + 1;
    }

    /**
     * applyModel method.
     *
     * @param {ConditionalFormattingModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    private applyModel(model: ConditionalFormattingModel): void {
        this.entries.length = 0;
        this.handles.clear();
        for (const e of model.entries) {
            this.entries.push(cloneEntry(e));
        }
    }

    /**
     * requireStyles method.
     *
     * @returns {WorkbookStyles} - Returns the result.
     */
    private requireStyles(): WorkbookStyles {
        if (this.host === undefined) {
            throw new InvalidArgumentError('Conditional formats are not bound to a worksheet host');
        }
        return this.host.styles();
    }

    /**
     * handleFor method.
     *
     * @param {ConditionalFormatEntry} entry - The entry parameter.
     * @returns {ConditionalFormat} - Returns the result.
     */
    private handleFor(entry: ConditionalFormatEntry): ConditionalFormat {
        let h: ConditionalFormatHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new ConditionalFormatHandle(entry, {
                markDirty: (): void => {
                    if (this.host != null) {
                        this.host.markDirty();
                    }
                },
                styles: (): WorkbookStyles => this.requireStyles()
            });
            this.handles.set(entry, h);
        }
        return h;
    }
}

/**
 * Live mutable handle bound to an entry.
 */
class ConditionalFormatHandle implements ConditionalFormat {
    /** @private */
    public readonly entry: ConditionalFormatEntry;
    private readonly markDirty: () => void;
    private readonly styles: () => WorkbookStyles;

    /**
     * Creates an instance.
     *
     * @param {ConditionalFormatEntry} entry - entry value.
     * @param {*} host - host value.
     */
    public constructor(entry: ConditionalFormatEntry, host: { markDirty: () => void; styles: () => WorkbookStyles }) {
        this.entry = entry;
        this.markDirty = host.markDirty;
        this.styles = host.styles;
    }

    /**
     * Gets sqref.
     *
     * @returns {string} - Returns the result.
     */
    public get sqref(): string {
        return formatCfSqref(this.entry.ranges);
    }

    /**
     * Sets sqref.
     *
     * @param {string} value - The value parameter.
     */
    public set sqref(value: string) {
        this.entry.ranges = parseCfSqref(value);
        this.markDirty();
    }

    /**
     * Gets type.
     *
     * @returns {ConditionalFormatType} - Returns the result.
     */
    public get type(): ConditionalFormatType {
        return this.entry.type;
    }

    /**
     * Sets type.
     *
     * @param {ConditionalFormatType} value - The value parameter.
     */
    public set type(value: ConditionalFormatType) {
        const next: ConditionalFormatType = requireType(value);
        if (next === this.entry.type) {
            return;
        }
        this.entry.type = next;
        applyVisualsForType(this.entry, next);
        this.markDirty();
    }

    /**
     * Gets operator.
     *
     * @returns {*} - Returns the result.
     */
    public get operator(): ConditionalFormatOperator | undefined {
        return this.entry.operator;
    }

    /**
     * Sets operator.
     *
     * @param {*} value - The value parameter.
     */
    public set operator(value: ConditionalFormatOperator | undefined) {
        if (value === undefined) {
            this.entry.operator = undefined;
        } else {
            this.entry.operator = requireOperator(value);
        }
        this.markDirty();
    }

    /**
     * Gets formulas.
     *
     * @returns {string} - Returns the result.
     */
    public get formulas(): ReadonlyArray<string> {
        return [...this.entry.formulas];
    }

    /**
     * Sets formulas.
     *
     * @param {string} value - The value parameter.
     */
    public set formulas(value: ReadonlyArray<string>) {
        this.entry.formulas = normalizeFormulas(value);
        this.markDirty();
    }

    /**
     * Gets firstFormula.
     *
     * @returns {string} - Returns the result.
     */
    public get firstFormula(): string | undefined {
        return this.entry.formulas[0];
    }

    /**
     * Sets firstFormula.
     *
     * @param {string} value - The value parameter.
     */
    public set firstFormula(value: string | undefined) {
        setFormulaSlot(this.entry.formulas, 0, value);
        this.markDirty();
    }

    /**
     * Gets secondFormula.
     *
     * @returns {string} - Returns the result.
     */
    public get secondFormula(): string | undefined {
        return this.entry.formulas[1];
    }

    /**
     * Sets secondFormula.
     *
     * @param {string} value - The value parameter.
     */
    public set secondFormula(value: string | undefined) {
        setFormulaSlot(this.entry.formulas, 1, value);
        this.markDirty();
    }

    /**
     * Gets priority.
     *
     * @returns {number} - Returns the result.
     */
    public get priority(): number {
        return this.entry.priority;
    }

    /**
     * Sets priority.
     *
     * @param {number} value - The value parameter.
     */
    public set priority(value: number) {
        this.entry.priority = requirePriority(value);
        this.markDirty();
    }

    /**
     * Gets stopIfTrue.
     *
     * @returns {boolean} - Returns the result.
     */
    public get stopIfTrue(): boolean {
        return this.entry.stopIfTrue;
    }

    /**
     * Sets stopIfTrue.
     *
     * @param {boolean} value - The value parameter.
     */
    public set stopIfTrue(value: boolean) {
        this.entry.stopIfTrue = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string | undefined {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string | undefined) {
        this.entry.text = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets timePeriod.
     *
     * @returns {*} - Returns the result.
     */
    public get timePeriod(): ConditionalFormatTimePeriod | undefined {
        return this.entry.timePeriod;
    }

    /**
     * Sets timePeriod.
     *
     * @param {*} value - The value parameter.
     */
    public set timePeriod(value: ConditionalFormatTimePeriod | undefined) {
        if (value === undefined) {
            this.entry.timePeriod = undefined;
        } else {
            this.entry.timePeriod = requireTimePeriod(value);
        }
        this.markDirty();
    }

    /**
     * Gets rank.
     *
     * @returns {number} - Returns the result.
     */
    public get rank(): number | undefined {
        return this.entry.rank;
    }

    /**
     * Sets rank.
     *
     * @param {number} value - The value parameter.
     */
    public set rank(value: number | undefined) {
        if (value === undefined) {
            this.entry.rank = undefined;
        } else {
            this.entry.rank = requireUnsignedInt(value, 'rank');
        }
        this.markDirty();
    }

    /**
     * Gets percent.
     *
     * @returns {boolean} - Returns the result.
     */
    public get percent(): boolean {
        return this.entry.percent;
    }

    /**
     * Sets percent.
     *
     * @param {boolean} value - The value parameter.
     */
    public set percent(value: boolean) {
        this.entry.percent = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets bottom.
     *
     * @returns {boolean} - Returns the result.
     */
    public get bottom(): boolean {
        return this.entry.bottom;
    }

    /**
     * Sets bottom.
     *
     * @param {boolean} value - The value parameter.
     */
    public set bottom(value: boolean) {
        this.entry.bottom = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets aboveAverage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get aboveAverage(): boolean {
        return this.entry.aboveAverage;
    }

    /**
     * Sets aboveAverage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set aboveAverage(value: boolean) {
        this.entry.aboveAverage = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets equalAverage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get equalAverage(): boolean {
        return this.entry.equalAverage;
    }

    /**
     * Sets equalAverage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set equalAverage(value: boolean) {
        this.entry.equalAverage = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets stdDev.
     *
     * @returns {number} - Returns the result.
     */
    public get stdDev(): number | undefined {
        return this.entry.stdDev;
    }

    /**
     * Sets stdDev.
     *
     * @param {number} value - The value parameter.
     */
    public set stdDev(value: number | undefined) {
        if (value === undefined) {
            this.entry.stdDev = undefined;
        } else {
            this.entry.stdDev = requireInt(value, 'stdDev');
        }
        this.markDirty();
    }

    /**
     * Gets format.
     *
     * @returns {*} - Returns the result.
     */
    public get format(): DifferentialFormatView | undefined | DifferentialFormatInput {
        const id: number = this.entry.dxfId;
        if (id === undefined) {
            return undefined;
        }
        return this.styles().getDifferentialFormat(id);
    }

    /**
     * Sets format.
     *
     * @param {*} value - The value parameter.
     */
    public set format(value: DifferentialFormatView | undefined | DifferentialFormatInput) {
        if (value === undefined) {
            this.entry.dxfId = undefined;
        } else {
            this.entry.dxfId = this.styles().ensureDxf(value);
        }
        this.markDirty();
    }

    /**
     * Gets dataBar.
     *
     * @returns {*} - Returns the result.
     */
    public get dataBar(): DataBar | undefined {
        const d: DataBarData = this.entry.dataBarData;
        if (d === undefined) {
            return undefined;
        }
        return new DataBarHandle(d, this.markDirty);
    }

    /**
     * Sets dataBar.
     *
     * @param {*} value - The value parameter.
     */
    public set dataBar(value: DataBar | undefined) {
        if (value !== undefined) {
            throw new InvalidArgumentError('dataBar is configured on the live handle after type = \'dataBar\'; only undefined clears it');
        }
        if (this.entry.dataBarData === undefined) {
            return;
        }
        this.entry.dataBarData = undefined;
        this.entry.x14RuleId = undefined;
        if (this.entry.type === 'dataBar') {
            this.entry.type = DEFAULT_TYPE;
        }
        this.markDirty();
    }

    /**
     * Gets colorScale.
     *
     * @returns {*} - Returns the result.
     */
    public get colorScale(): ColorScale | undefined {
        const d: ColorScaleData = this.entry.colorScaleData;
        if (d === undefined) {
            return undefined;
        }
        return new ColorScaleHandle(d, this.markDirty);
    }

    /**
     * Sets colorScale.
     *
     * @param {*} value - The value parameter.
     */
    public set colorScale(value: ColorScale | undefined) {
        if (value !== undefined) {
            throw new InvalidArgumentError(
                'colorScale is configured on the live handle after type = \'colorScale\'; only undefined clears it'
            );
        }
        if (this.entry.colorScaleData === undefined) {
            return;
        }
        this.entry.colorScaleData = undefined;
        if (this.entry.type === 'colorScale') {
            this.entry.type = DEFAULT_TYPE;
        }
        this.markDirty();
    }

    /**
     * Gets iconSet.
     *
     * @returns {*} - Returns the result.
     */
    public get iconSet(): IconSet | undefined {
        const d: IconSetData = this.entry.iconSetData;
        if (d === undefined) {
            return undefined;
        }
        return new IconSetHandle(d, this.markDirty);
    }

    /**
     * Sets iconSet.
     *
     * @param {*} value - The value parameter.
     */
    public set iconSet(value: IconSet | undefined) {
        if (value !== undefined) {
            throw new InvalidArgumentError('iconSet is configured on the live handle after type = \'iconSet\'; only undefined clears it');
        }
        if (this.entry.iconSetData === undefined) {
            return;
        }
        this.entry.iconSetData = undefined;
        if (this.entry.type === 'iconSet') {
            this.entry.type = DEFAULT_TYPE;
        }
        this.markDirty();
    }
}

// ── Visual-type handle classes ────────────────────────────────────────────────

/**
 * Live handle for a `dataBar` rule's visual configuration.
 * Mutations immediately mark the worksheet dirty.
 *
 * Implements {@link DataBar}.
 */
class DataBarHandle implements DataBar {
    private readonly data: DataBarData;
    private readonly dirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {DataBarData} data - The data parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(data: DataBarData, markDirty: () => void) {
        this.data = data;
        this.dirty = markDirty;
    }

    /**
     * Gets barColor.
     *
     * @returns {Color} - Returns the result.
     */
    public get barColor(): Color {
        return { ...this.data.barColor };
    }

    /**
     * Sets barColor.
     *
     * @param {Color} value - The value parameter.
     */
    public set barColor(value: Color) {
        this.data.barColor = { ...value };
        this.dirty();
    }

    /**
     * Gets minPoint.
     *
     * @returns {CfValuePoint} - Returns the result.
     */
    public get minPoint(): CfValuePoint {
        return makeCfValuePoint(this.data.minPoint.type, this.data.minPoint.value);
    }

    /**
     * Sets minPoint.
     *
     * @param {CfValuePoint} value - The value parameter.
     */
    public set minPoint(value: CfValuePoint) {
        this.data.minPoint = { type: value.type, value: value.value, gte: true };
        this.dirty();
    }

    /**
     * Gets maxPoint.
     *
     * @returns {CfValuePoint} - Returns the result.
     */
    public get maxPoint(): CfValuePoint {
        return makeCfValuePoint(this.data.maxPoint.type, this.data.maxPoint.value);
    }

    /**
     * Sets maxPoint.
     *
     * @param {CfValuePoint} value - The value parameter.
     */
    public set maxPoint(value: CfValuePoint) {
        this.data.maxPoint = { type: value.type, value: value.value, gte: true };
        this.dirty();
    }

    /**
     * Gets minLength.
     *
     * @returns {number} - Returns the result.
     */
    public get minLength(): number {
        return this.data.minLength;
    }

    /**
     * Sets minLength.
     *
     * @param {number} value - The value parameter.
     */
    public set minLength(value: number) {
        this.data.minLength = value;
        this.dirty();
    }

    /**
     * Gets maxLength.
     *
     * @returns {number} - Returns the result.
     */
    public get maxLength(): number {
        return this.data.maxLength;
    }

    /**
     * Sets maxLength.
     *
     * @param {number} value - The value parameter.
     */
    public set maxLength(value: number) {
        this.data.maxLength = value;
        this.dirty();
    }

    /**
     * Gets showValue.
     *
     * @returns {boolean} - Returns the result.
     */
    public get showValue(): boolean {
        return this.data.showValue;
    }

    /**
     * Sets showValue.
     *
     * @param {boolean} value - The value parameter.
     */
    public set showValue(value: boolean) {
        this.data.showValue = Boolean(value);
        this.dirty();
    }

    /**
     * Gets hasBorder.
     *
     * @returns {boolean} - Returns the result.
     */
    public get hasBorder(): boolean {
        return this.data.border;
    }

    /**
     * Sets hasBorder.
     *
     * @param {boolean} value - The value parameter.
     */
    public set hasBorder(value: boolean) {
        this.data.border = Boolean(value);
        this.dirty();
    }

    /**
     * Gets borderColor.
     *
     * @returns {*} - Returns the result.
     */
    public get borderColor(): Color | undefined {
        return this.data.borderColor !== undefined ? { ...this.data.borderColor } : undefined;
    }

    /**
     * Sets borderColor.
     *
     * @param {*} value - The value parameter.
     */
    public set borderColor(value: Color | undefined) {
        this.data.borderColor = value !== undefined ? { ...value } : undefined;
        this.dirty();
    }

    /**
     * Gets gradient.
     *
     * @returns {boolean} - Returns the result.
     */
    public get gradient(): boolean {
        return this.data.gradient;
    }

    /**
     * Sets gradient.
     *
     * @param {boolean} value - The value parameter.
     */
    public set gradient(value: boolean) {
        this.data.gradient = Boolean(value);
        this.dirty();
    }

    /**
     * Gets dataBarDirection.
     *
     * @returns {DataBarDirection} - Returns the result.
     */
    public get dataBarDirection(): DataBarDirection {
        return this.data.direction;
    }

    /**
     * Sets dataBarDirection.
     *
     * @param {DataBarDirection} value - The value parameter.
     */
    public set dataBarDirection(value: DataBarDirection) {
        this.data.direction = requireDataBarDirection(value);
        this.dirty();
    }

    /**
     * Gets negativeBarColorSameAsPositive.
     *
     * @returns {boolean} - Returns the result.
     */
    public get negativeBarColorSameAsPositive(): boolean {
        return this.data.negativeBarColorSameAsPositive;
    }

    /**
     * Sets negativeBarColorSameAsPositive.
     *
     * @param {boolean} value - The value parameter.
     */
    public set negativeBarColorSameAsPositive(value: boolean) {
        this.data.negativeBarColorSameAsPositive = Boolean(value);
        this.dirty();
    }

    /**
     * Gets negativeFillColor.
     *
     * @returns {*} - Returns the result.
     */
    public get negativeFillColor(): Color | undefined {
        return this.data.negativeFillColor !== undefined ? { ...this.data.negativeFillColor } : undefined;
    }

    /**
     * Sets negativeFillColor.
     *
     * @param {*} value - The value parameter.
     */
    public set negativeFillColor(value: Color | undefined) {
        this.data.negativeFillColor = value !== undefined ? { ...value } : undefined;
        this.dirty();
    }

    /**
     * Gets negativeBarBorderColorSameAsPositive.
     *
     * @returns {boolean} - Returns the result.
     */
    public get negativeBarBorderColorSameAsPositive(): boolean {
        return this.data.negativeBarBorderColorSameAsPositive;
    }

    /**
     * Sets negativeBarBorderColorSameAsPositive.
     *
     * @param {boolean} value - The value parameter.
     */
    public set negativeBarBorderColorSameAsPositive(value: boolean) {
        this.data.negativeBarBorderColorSameAsPositive = Boolean(value);
        this.dirty();
    }

    /**
     * Gets negativeBorderColor.
     *
     * @returns {*} - Returns the result.
     */
    public get negativeBorderColor(): Color | undefined {
        return this.data.negativeBorderColor !== undefined ? { ...this.data.negativeBorderColor } : undefined;
    }

    /**
     * Sets negativeBorderColor.
     *
     * @param {*} value - The value parameter.
     */
    public set negativeBorderColor(value: Color | undefined) {
        this.data.negativeBorderColor = value !== undefined ? { ...value } : undefined;
        this.dirty();
    }

    /**
     * Gets dataBarAxisPosition.
     *
     * @returns {DataBarAxisPosition} - Returns the result.
     */
    public get dataBarAxisPosition(): DataBarAxisPosition {
        return this.data.axisPosition;
    }

    /**
     * Sets dataBarAxisPosition.
     *
     * @param {DataBarAxisPosition} value - The value parameter.
     */
    public set dataBarAxisPosition(value: DataBarAxisPosition) {
        this.data.axisPosition = requireDataBarAxisPosition(value);
        this.dirty();
    }

    /**
     * Gets barAxisColor.
     *
     * @returns {*} - Returns the result.
     */
    public get barAxisColor(): Color | undefined {
        return this.data.axisColor !== undefined ? { ...this.data.axisColor } : undefined;
    }

    /**
     * Sets barAxisColor.
     *
     * @param {*} value - The value parameter.
     */
    public set barAxisColor(value: Color | undefined) {
        this.data.axisColor = value !== undefined ? { ...value } : undefined;
        this.dirty();
    }
}

/**
 * ColorScaleHandle class.
 */
class ColorScaleHandle implements ColorScale {
    private readonly data: ColorScaleData;
    private readonly dirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {ColorScaleData} data - The data parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(data: ColorScaleData, markDirty: () => void) {
        this.data = data;
        this.dirty = markDirty;
    }

    /**
     * stopAt method.
     *
     * @param {number} idx - The idx parameter.
     * @returns {CfColorStop} - Returns the result.
     */
    private stopAt(idx: number): CfColorStop {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const s: ColorScaleStop = this.data.stops[idx];
        if (s === undefined) {
            throw new InvalidConditionalFormattingError(`No color scale stop at index ${idx}`);
        }
        return makeCfColorStop(s.type, s.value, { ...s.color });
    }

    /**
     * setStopAt method.
     *
     * @param {number} idx - The idx parameter.
     * @param {CfColorStop} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setStopAt(idx: number, value: CfColorStop): void {
        if (idx >= this.data.stops.length) {
            throw new InvalidConditionalFormattingError(`No color scale stop at index ${idx}`);
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        this.data.stops[idx] = { type: value.type, value: value.value, color: { ...value.color } };
        this.dirty();
    }

    /**
     * Gets minPoint.
     *
     * @returns {CfColorStop} - Returns the result.
     */
    public get minPoint(): CfColorStop {
        return this.stopAt(0);
    }

    /**
     * Sets minPoint.
     *
     * @param {CfColorStop} value - The value parameter.
     */
    public set minPoint(value: CfColorStop) {
        this.setStopAt(0, value);
    }

    /**
     * Gets midPoint.
     *
     * @returns {*} - Returns the result.
     */
    public get midPoint(): CfColorStop | undefined {
        if (this.data.stops.length < 3) {
            return undefined;
        }
        return this.stopAt(1);
    }

    /**
     * Sets midPoint.
     *
     * @param {*} value - The value parameter.
     */
    public set midPoint(value: CfColorStop | undefined) {
        if (value === undefined) {
            // Downgrade: remove the mid stop, preserving min and max.
            if (this.data.stops.length >= 3) {
                const last: ColorScaleStop = this.data.stops[this.data.stops.length - 1];
                if (last === undefined) {
                    return;
                }
                this.data.stops.splice(1, this.data.stops.length - 2);
                this.data.stops[1] = last;
            }
        } else {
            if (this.data.stops.length < 3) {
                // Upgrade: insert a mid stop before the max.
                const last: ColorScaleStop = this.data.stops[this.data.stops.length - 1];
                if (last === undefined) {
                    return;
                }
                this.data.stops[this.data.stops.length - 1] = { type: value.type, value: value.value, color: { ...value.color } };
                this.data.stops.push(last);
            } else {
                this.setStopAt(1, value);
                return;
            }
        }
        this.dirty();
    }

    /**
     * Gets maxPoint.
     *
     * @returns {CfColorStop} - Returns the result.
     */
    public get maxPoint(): CfColorStop {
        return this.stopAt(this.data.stops.length - 1);
    }

    /**
     * Sets maxPoint.
     *
     * @param {CfColorStop} value - The value parameter.
     */
    public set maxPoint(value: CfColorStop) {
        this.setStopAt(this.data.stops.length - 1, value);
    }
}

/**
 * Live handle for an `iconSet` rule's visual configuration.
 * Implements {@link IconSet}.
 */
class IconSetHandle implements IconSet {
    private readonly data: IconSetData;
    private readonly dirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {IconSetData} data - The data parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(data: IconSetData, markDirty: () => void) {
        this.data = data;
        this.dirty = markDirty;
    }

    /**
     * Gets iconSetType.
     *
     * @returns {IconSetType} - Returns the result.
     */
    public get iconSetType(): IconSetType {
        return this.data.iconSetType;
    }

    /**
     * Sets iconSetType.
     *
     * @param {IconSetType} value - The value parameter.
     */
    public set iconSetType(value: IconSetType) {
        if (!ICON_SET_TYPES.has(value)) {
            throw new InvalidConditionalFormattingError(`Unknown iconSetType '${value}'`);
        }
        this.data.iconSetType = value;
        // Regenerate default criteria when the count changes.
        const newCount: 3 | 4 | 5 = iconCountFor(value);
        if (this.data.iconCriteria.length !== newCount) {
            this.data.iconCriteria = generateDefaultIconCriteria(value);
        }
        this.dirty();
    }

    /**
     * Gets iconCriteria.
     *
     * @returns {CfIconCriterion[]} - Returns the result.
     */
    public get iconCriteria(): CfIconCriterion[] {
        return this.data.iconCriteria.map((c: CfThresholdInternal): CfIconCriterion => makeCfIconCriterion(c.type, c.value, c.gte));
    }

    /**
     * Sets iconCriteria.
     *
     * @param {CfIconCriterion[]} value - The value parameter.
     */
    public set iconCriteria(value: CfIconCriterion[]) {
        const expectedCount: 3 | 4 | 5 = iconCountFor(this.data.iconSetType);
        if (value.length !== expectedCount) {
            throw new InvalidConditionalFormattingError(
                `iconSet '${this.data.iconSetType}' requires exactly ${expectedCount} iconCriteria, got ${value.length}`
            );
        }
        this.data.iconCriteria = value.map((c: CfIconCriterion): { type: CfThresholdType; value: string; gte: boolean } => ({
            type: c.type,
            value: c.value,
            gte: c.greaterThanOrEqual !== undefined ? Boolean(c.greaterThanOrEqual) : true
        }));
        this.dirty();
    }

    /**
     * Gets showValue.
     *
     * @returns {boolean} - Returns the result.
     */
    public get showValue(): boolean {
        return this.data.showValue;
    }

    /**
     * Sets showValue.
     *
     * @param {boolean} value - The value parameter.
     */
    public set showValue(value: boolean) {
        this.data.showValue = Boolean(value);
        this.dirty();
    }

    /**
     * Gets usePercent.
     *
     * @returns {boolean} - Returns the result.
     */
    public get usePercent(): boolean {
        return this.data.usePercent;
    }

    /**
     * Sets usePercent.
     *
     * @param {boolean} value - The value parameter.
     */
    public set usePercent(value: boolean) {
        this.data.usePercent = Boolean(value);
        this.dirty();
    }

    /**
     * Gets reverse.
     *
     * @returns {boolean} - Returns the result.
     */
    public get reverse(): boolean {
        return this.data.reverse;
    }

    /**
     * Sets reverse.
     *
     * @param {boolean} value - The value parameter.
     */
    public set reverse(value: boolean) {
        this.data.reverse = Boolean(value);
        this.dirty();
    }
}

/**
 * requireDataBarDirection function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataBarDirection} - Returns the result.
 */
function requireDataBarDirection(value: string): DataBarDirection {
    if (!DATA_BAR_DIRECTIONS.has(value)) {
        throw new InvalidConditionalFormattingError(`Invalid dataBarDirection '${value}'`);
    }
    return value as DataBarDirection;
}

/**
 * requireDataBarAxisPosition function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataBarAxisPosition} - Returns the result.
 */
function requireDataBarAxisPosition(value: string): DataBarAxisPosition {
    if (!DATA_BAR_AXIS_POSITIONS.has(value)) {
        throw new InvalidConditionalFormattingError(`Invalid dataBarAxisPosition '${value}'`);
    }
    return value as DataBarAxisPosition;
}
/**
 * Return how many icons a given icon-set type requires.
 *
 * @param {IconSetType} type - The type parameter.
 * @returns {Object} - Returns the result.
 */
function iconCountFor(type: IconSetType): 3 | 4 | 5 {
    const first: string = type[0];
    if (first === '3') {
        return 3;
    }
    if (first === '4') {
        return 4;
    }
    return 5;
}

/**
 * Generate even-percent defaults for an icon set's criteria.
 *
 * @param {IconSetType} iconSetType - The iconSetType parameter.
 * @returns {CfThresholdInternal[]} - Returns the result.
 */
function generateDefaultIconCriteria(iconSetType: IconSetType): CfThresholdInternal[] {
    const count: 3 | 4 | 5 = iconCountFor(iconSetType);
    if (count === 3) {
        return [
            { type: 'number', value: '0', gte: true },
            { type: 'percent', value: '33', gte: true },
            { type: 'percent', value: '67', gte: true }
        ];
    }
    if (count === 4) {
        return [
            { type: 'number', value: '0', gte: true },
            { type: 'percent', value: '25', gte: true },
            { type: 'percent', value: '50', gte: true },
            { type: 'percent', value: '75', gte: true }
        ];
    }
    return [
        { type: 'number', value: '0', gte: true },
        { type: 'percent', value: '20', gte: true },
        { type: 'percent', value: '40', gte: true },
        { type: 'percent', value: '60', gte: true },
        { type: 'percent', value: '80', gte: true }
    ];
}

/**
 * Build a {@link CfValuePoint} from threshold type + optional value, respecting `exactOptionalPropertyTypes` (omit the key when undefined).
 *
 * @param {CfThresholdType} type - The type parameter.
 * @param {string} value - The value parameter.
 * @returns {CfValuePoint} - Returns the result.
 */
function makeCfValuePoint(type: CfThresholdType, value: string | undefined): CfValuePoint {
    if (value !== undefined) {
        return { type, value };
    }
    return { type };
}

/**
 * Build a {@link CfColorStop} respecting `exactOptionalPropertyTypes`.
 *
 * @param {CfThresholdType} type - The type parameter.
 * @param {string} value - The value parameter.
 * @param {Color} color - The color parameter.
 * @returns {CfColorStop} - Returns the result.
 */
function makeCfColorStop(type: CfThresholdType, value: string | undefined, color: Color): CfColorStop {
    if (value !== undefined) {
        return { type, value, color };
    }
    return { type, color };
}

/**
 * Build a {@link CfIconCriterion} respecting `exactOptionalPropertyTypes`.
 *
 * @param {CfThresholdType} type - The type parameter.
 * @param {string} value - The value parameter.
 * @param {boolean} gte - The gte parameter.
 * @returns {CfIconCriterion} - Returns the result.
 */
function makeCfIconCriterion(type: CfThresholdType, value: string | undefined, gte: boolean): CfIconCriterion {
    const base: CfIconCriterion = value !== undefined ? { type, value } : { type };
    if (!gte) {
        return { ...base, greaterThanOrEqual: false };
    }
    return base;
}

/** Default data-bar fill used when `type` is set to `dataBar`. */
const DEFAULT_DATA_BAR_COLOR: Color = { rgb: 'FF638EC6' };

/**
 * Allocate a fully defaulted internal data-bar model (classic + x14 fields).
 *
 * @returns {DataBarData} - Returns the result.
 */
function createDefaultDataBarData(): DataBarData {
    return {
        barColor: { ...DEFAULT_DATA_BAR_COLOR },
        minPoint: { type: 'lowestValue', value: undefined, gte: true },
        maxPoint: { type: 'highestValue', value: undefined, gte: true },
        minLength: DEFAULT_DATA_BAR_MIN_LENGTH,
        maxLength: DEFAULT_DATA_BAR_MAX_LENGTH,
        showValue: true,
        border: DEFAULT_DATA_BAR_BORDER,
        borderColor: undefined,
        gradient: DEFAULT_DATA_BAR_GRADIENT,
        direction: DEFAULT_DATA_BAR_DIRECTION,
        negativeBarColorSameAsPositive: DEFAULT_DATA_BAR_NEG_COLOR_SAME,
        negativeFillColor: undefined,
        negativeBarBorderColorSameAsPositive: DEFAULT_DATA_BAR_NEG_BORDER_SAME,
        negativeBorderColor: undefined,
        axisPosition: DEFAULT_DATA_BAR_AXIS_POSITION,
        axisColor: undefined
    };
}

/**
 * Allocate a fully defaulted internal icon-set model (3TrafficLights1 + even %).
 *
 * @returns {IconSetData} - Returns the result.
 */
function createDefaultIconSetData(): IconSetData {
    return {
        iconSetType: DEFAULT_ICON_SET_TYPE,
        iconCriteria: generateDefaultIconCriteria(DEFAULT_ICON_SET_TYPE),
        showValue: true,
        usePercent: true,
        reverse: false
    };
}

/** Default color-scale min stop color (Excel red-yellow-green scale). */
const DEFAULT_COLOR_SCALE_MIN: Color = { rgb: 'FFF8696B' };
/** Default color-scale max stop color (Excel red-yellow-green scale). */
const DEFAULT_COLOR_SCALE_MAX: Color = { rgb: 'FF63BE7B' };

/**
 * Default 2-color scale (Excel red→green) used when type becomes colorScale.
 *
 * @returns {ColorScaleData} - Returns the result.
 */
function createDefaultColorScaleData(): ColorScaleData {
    return {
        stops: [
            { type: 'lowestValue', value: undefined, color: { ...DEFAULT_COLOR_SCALE_MIN } },
            { type: 'highestValue', value: undefined, color: { ...DEFAULT_COLOR_SCALE_MAX } }
        ]
    };
}

/**
 * Create a bare rule entry for {@link ConditionalFormats.add}. Callers configure type, formulas, format, and visuals on the returned handle.
 *
 * @param {string} sqref - The sqref parameter.
 * @param {number} priority - The priority parameter.
 * @returns {ConditionalFormatEntry} - Returns the result.
 */
function createDefaultEntry(sqref: string, priority: number): ConditionalFormatEntry {
    return {
        ranges: parseCfSqref(sqref),
        // pivot is internal-only (load/preserve); library-authored rules default false.
        pivot: DEFAULT_PIVOT,
        type: DEFAULT_TYPE,
        priority,
        stopIfTrue: false,
        operator: undefined,
        formulas: [],
        text: undefined,
        timePeriod: undefined,
        rank: undefined,
        percent: DEFAULT_PERCENT,
        bottom: DEFAULT_BOTTOM,
        aboveAverage: DEFAULT_ABOVE_AVERAGE,
        equalAverage: DEFAULT_EQUAL_AVERAGE,
        stdDev: undefined,
        dxfId: undefined,
        extraAttrsXml: '',
        childrenXml: '',
        parentExtraAttrsXml: '',
        dataBarData: undefined,
        colorScaleData: undefined,
        iconSetData: undefined,
        x14RuleId: undefined
    };
}

/**
 * Allocate or clear structured visual data when the rule type changes. Non-visual types drop any previous visual payload and x14 pairing id.
 *
 * @param {ConditionalFormatEntry} entry - The entry parameter.
 * @param {ConditionalFormatType} type - The type parameter.
 * @returns {void} - Returns the result.
 */
function applyVisualsForType(entry: ConditionalFormatEntry, type: ConditionalFormatType): void {
    if (type === 'dataBar') {
        if (entry.dataBarData === undefined) {
            entry.dataBarData = createDefaultDataBarData();
            entry.x14RuleId = generateGuid();
        }
        entry.colorScaleData = undefined;
        entry.iconSetData = undefined;
        return;
    }
    if (type === 'colorScale') {
        if (entry.colorScaleData === undefined) {
            entry.colorScaleData = createDefaultColorScaleData();
        }
        entry.dataBarData = undefined;
        entry.x14RuleId = undefined;
        entry.iconSetData = undefined;
        return;
    }
    if (type === 'iconSet') {
        if (entry.iconSetData === undefined) {
            entry.iconSetData = createDefaultIconSetData();
        }
        entry.dataBarData = undefined;
        entry.colorScaleData = undefined;
        ensureX14IconSetPairing(entry);
        return;
    }
    entry.dataBarData = undefined;
    entry.colorScaleData = undefined;
    entry.iconSetData = undefined;
    entry.x14RuleId = undefined;
}

/**
 * Guard assigning a visual model onto an entry that already has a different visual or an explicit non-matching type.
 *
 * @param {ConditionalFormatEntry} entry - The entry parameter.
 * @param {Object} visual - The visual parameter.
 * @returns {void} - Returns the result.
 */
function assertVisualAssignable(entry: ConditionalFormatEntry, visual: 'dataBar' | 'colorScale' | 'iconSet'): void {
    const hasOther: boolean =
        (visual !== 'dataBar' && entry.dataBarData !== undefined) ||
        (visual !== 'colorScale' && entry.colorScaleData !== undefined) ||
        (visual !== 'iconSet' && entry.iconSetData !== undefined);
    if (hasOther) {
        throw new InvalidConditionalFormattingError('Only one visual type (dataBar, colorScale, or iconSet) may be set per rule');
    }
    const type: ConditionalFormatType = entry.type;
    if (type === 'dataBar' || type === 'colorScale' || type === 'iconSet') {
        if (type !== visual) {
            throw new InvalidConditionalFormattingError(`Explicit type '${type}' conflicts with the inferred visual type '${visual}'`);
        }
        return;
    }
    // Non-default scalar types (e.g. expression) conflict with attaching a visual model.
    if (type !== DEFAULT_TYPE) {
        throw new InvalidConditionalFormattingError(`Explicit type '${type}' conflicts with the inferred visual type '${visual}'`);
    }
}

/**
 * cloneEntry function.
 *
 * @param {ConditionalFormatEntry} e - The e parameter.
 * @returns {ConditionalFormatEntry} - Returns the result.
 */
function cloneEntry(e: ConditionalFormatEntry): ConditionalFormatEntry {
    return {
        ranges: e.ranges.map((r: CellRange): { startRow: number; startCol: number; endRow: number; endCol: number } => ({ ...r })),
        pivot: e.pivot,
        type: e.type,
        priority: e.priority,
        stopIfTrue: e.stopIfTrue,
        operator: e.operator,
        formulas: [...e.formulas],
        text: e.text,
        timePeriod: e.timePeriod,
        rank: e.rank,
        percent: e.percent,
        bottom: e.bottom,
        aboveAverage: e.aboveAverage,
        equalAverage: e.equalAverage,
        stdDev: e.stdDev,
        dxfId: e.dxfId,
        extraAttrsXml: e.extraAttrsXml,
        childrenXml: e.childrenXml,
        parentExtraAttrsXml: e.parentExtraAttrsXml,
        dataBarData:
            e.dataBarData !== undefined
                ? {
                    ...e.dataBarData,
                    minPoint: { ...e.dataBarData.minPoint },
                    maxPoint: { ...e.dataBarData.maxPoint },
                    barColor: { ...e.dataBarData.barColor },
                    borderColor: e.dataBarData.borderColor !== undefined ? { ...e.dataBarData.borderColor } : undefined,
                    negativeFillColor: e.dataBarData.negativeFillColor !== undefined ? { ...e.dataBarData.negativeFillColor } : undefined,
                    negativeBorderColor:
                          e.dataBarData.negativeBorderColor !== undefined ? { ...e.dataBarData.negativeBorderColor } : undefined,
                    axisColor: e.dataBarData.axisColor !== undefined ? { ...e.dataBarData.axisColor } : undefined
                }
                : undefined,
        colorScaleData:
            e.colorScaleData !== undefined
                ? { stops: e.colorScaleData.stops.map((s: ColorScaleStop): any => ({ ...s, color: { ...s.color } })) }
                : undefined,
        iconSetData:
            e.iconSetData !== undefined
                ? {
                    ...e.iconSetData,
                    iconCriteria: e.iconSetData.iconCriteria.map(
                        (c: CfThresholdInternal): { type: CfThresholdType; value: string; gte: boolean } => ({ ...c })
                    )
                }
                : undefined,
        x14RuleId: e.x14RuleId
    };
}

/**
 * Parse multi-area `ST_Sqref` into ordered ranges.
 *
 * @param {string} sqref - The sqref parameter.
 * @returns {CellRange[]} - Returns the result.
 */
export function parseCfSqref(sqref: string): CellRange[] {
    const trimmed: string = sqref.trim();
    if (trimmed.length === 0) {
        throw new InvalidConditionalFormattingError('Conditional format sqref must be non-empty');
    }
    const tokens: string[] = trimmed.split(/\s+/).filter((t: string): boolean => t.length > 0);
    if (tokens.length === 0) {
        throw new InvalidConditionalFormattingError('Conditional format sqref must be non-empty');
    }
    const ranges: CellRange[] = [];
    for (const token of tokens) {
        try {
            ranges.push(parseA1Range(token));
        } catch (err) {
            throw new InvalidConditionalFormattingError(`Invalid conditional format sqref area "${token}"`, { cause: err });
        }
    }
    return ranges;
}

/**
 * Format ranges as space-separated compact A1 sqref.
 *
 * @param {Object} ranges - The ranges parameter.
 * @returns {string} - Returns the result.
 */
export function formatCfSqref(ranges: ReadonlyArray<CellRange>): string {
    return ranges.map((r: CellRange): string => formatA1Range(r)).join(' ');
}

/**
 * cellInSqref function.
 *
 * @param {CellCoord} coord - The coord parameter.
 * @param {Object} ranges - The ranges parameter.
 * @returns {boolean} - Returns the result.
 */
function cellInSqref(coord: CellCoord, ranges: ReadonlyArray<CellRange>): boolean {
    for (const r of ranges) {
        if (coord.row >= r.startRow && coord.row <= r.endRow && coord.col >= r.startCol && coord.col <= r.endCol) {
            return true;
        }
    }
    return false;
}

/**
 * requireType function.
 *
 * @param {string} value - The value parameter.
 * @returns {ConditionalFormatType} - Returns the result.
 */
function requireType(value: string): ConditionalFormatType {
    if (!CF_TYPES.has(value)) {
        throw new InvalidConditionalFormattingError(`Unknown conditional format type "${value}"`);
    }
    return value as ConditionalFormatType;
}

/**
 * requireOperator function.
 *
 * @param {string} value - The value parameter.
 * @returns {ConditionalFormatOperator} - Returns the result.
 */
function requireOperator(value: string): ConditionalFormatOperator {
    if (!CF_OPERATORS.has(value)) {
        throw new InvalidConditionalFormattingError(`Unknown conditional format operator "${value}"`);
    }
    return value as ConditionalFormatOperator;
}

/**
 * requireTimePeriod function.
 *
 * @param {string} value - The value parameter.
 * @returns {ConditionalFormatTimePeriod} - Returns the result.
 */
function requireTimePeriod(value: string): ConditionalFormatTimePeriod {
    if (!CF_TIME_PERIODS.has(value)) {
        throw new InvalidConditionalFormattingError(`Unknown conditional format timePeriod "${value}"`);
    }
    return value as ConditionalFormatTimePeriod;
}

/**
 * requirePriority function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function requirePriority(value: number): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || !Number.isFinite(value)) {
        throw new InvalidConditionalFormattingError('Conditional format priority must be a finite integer');
    }
    return value;
}

/**
 * requireUnsignedInt function.
 *
 * @param {number} value - The value parameter.
 * @param {string} name - The name parameter.
 * @returns {number} - Returns the result.
 */
function requireUnsignedInt(value: number, name: string): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        throw new InvalidArgumentError(`${name} must be a non-negative integer`);
    }
    return value;
}

/**
 * requireInt function.
 *
 * @param {number} value - The value parameter.
 * @param {string} name - The name parameter.
 * @returns {number} - Returns the result.
 */
function requireInt(value: number, name: string): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || !Number.isFinite(value)) {
        throw new InvalidArgumentError(`${name} must be a finite integer`);
    }
    return value;
}

/**
 * normalizeOptionalString function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalString(value: string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('String attribute must be a string');
    }
    return value;
}

/**
 * normalizeFormulas function.
 *
 * @param {string} value - The value parameter.
 * @returns {string[]} - Returns the result.
 */
function normalizeFormulas(value: ReadonlyArray<string>): string[] {
    // Runtime guard for bad callers; cast avoids Array.isArray → any[] narrowing.
    if (!Array.isArray(value)) {
        throw new InvalidArgumentError('formulas must be an array of strings');
    }
    const items: ReadonlyArray<unknown> = value as ReadonlyArray<unknown>;
    if (items.length > MAX_FORMULAS) {
        throw new InvalidConditionalFormattingError(`Conditional format formulas accepts at most ${String(MAX_FORMULAS)} entries`);
    }
    const out: string[] = [];
    for (let i: number = 0; i < items.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const v: unknown = items[i];
        if (typeof v !== 'string') {
            throw new InvalidArgumentError(`formulas[${String(i)}] must be a string`);
        }
        const n: string = normalizeFormulaExpression(v);
        if (n.length === 0) {
            throw new InvalidConditionalFormattingError(`formulas[${String(i)}] must be a non-empty formula`);
        }
        out.push(n);
    }
    return out;
}

/**
 * Update public formula slots in place (0 = firstFormula, 1 = secondFormula). Wire may still hold a third formula from load (`formulas[2]`); public setters only touch slots 0–1. Gaps are not representable, so clear compacts.
 *
 * @param {string[]} formulas - The formulas parameter.
 * @param {number} index - The index parameter.
 * @param {string} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function setFormulaSlot(formulas: string[], index: number, value: string | undefined): void {
    // Public slots are first/second only (0..1). Third wire formula is not a public setter.
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const publicMax: 2 = 2;
    const slotName: string = index === 0 ? 'firstFormula' : index === 1 ? 'secondFormula' : `formula slot ${String(index)}`;
    if (index < 0 || index >= publicMax) {
        throw new InvalidArgumentError(`${slotName} is not a public formula slot`);
    }
    if (value === undefined) {
        if (index < formulas.length) {
            formulas.splice(index, 1);
        }
        return;
    }
    if (typeof value !== 'string') {
        throw new InvalidArgumentError(`${slotName} must be a string`);
    }
    const n: string = normalizeFormulaExpression(value);
    if (n.length === 0) {
        throw new InvalidConditionalFormattingError(`${slotName} must be a non-empty formula`);
    }
    if (index < formulas.length) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        formulas[index] = n;
        return;
    }
    if (index === formulas.length) {
        formulas.push(n);
        return;
    }
    const required: string = index === 1 ? 'firstFormula' : `formula slot ${String(index)}`;
    throw new InvalidConditionalFormattingError(`${slotName} requires ${required}`);
}
/**
 * CT_Worksheet local names that appear **before** `conditionalFormatting` after sheetData.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const CONDITIONAL_FORMATTING_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr'
];

/**
 * CT_Worksheet local names that appear **after** the CF block.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const CONDITIONAL_FORMATTING_SUCCESSORS: ReadonlyArray<string> = [
    'dataValidations',
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing',
    'legacyDrawing',
    'legacyDrawingHF',
    'drawingHF',
    'picture',
    'oleObjects',
    'controls',
    'webPublishItems',
    'tableParts',
    'extLst'
];

const CF_PRED_SET: ReadonlySet<string> = new Set(CONDITIONAL_FORMATTING_PREDECESSORS_AFTER_SHEET_DATA);
const CF_SUCC_SET: ReadonlySet<string> = new Set(CONDITIONAL_FORMATTING_SUCCESSORS);

/**
 * Index at which to insert the first serialized `conditionalFormatting` among after-sheetData siblings. Subsequent CF parents insert immediately after the previous one (caller inserts one-by-one or as a block).
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findConditionalFormattingInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && CF_PRED_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && CF_SUCC_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse one `conditionalFormatting` element into zero or more entries. Soft-skips individual bad cfRules (keep valid siblings).
 *
 * @param {string} xml - The xml parameter.
 * @returns {ConditionalFormatEntry[]} - Returns the result.
 */
export function parseConditionalFormattingXml(xml: string): ConditionalFormatEntry[] {
    const openAttrs: string = elementOpenAttrsLocal(xml);
    const attrs: Map<string, string> = parseAttrMapLocal(openAttrs);
    const pivot: boolean = parseBoolAttr(attrs.get('pivot'), DEFAULT_PIVOT);
    const sqrefRaw: string = attrs.get('sqref');
    const parentExtraAttrsXml: string = attrsToXmlExcludingLocal(attrs, new Set(['pivot', 'sqref']));

    let ranges: CellRange[] | undefined;
    if (sqrefRaw !== undefined && sqrefRaw.trim().length > 0) {
        try {
            ranges = parseCfSqref(sqrefRaw);
        } catch {
            // Soft-skip entire parent when sqref is unusable.
            return [];
        }
    } else {
        // sqref is optional on CT_ConditionalFormatting; empty ranges when absent.
        ranges = [];
    }

    const inner: string = elementInnerLocal(xml);
    const children: string[] = splitTopLevelLocal(inner);
    const entries: ConditionalFormatEntry[] = [];
    for (const child of children) {
        const local: string = elementLocalNameLocal(child);
        if (local !== 'cfRule') {
            // Parent extLst / unknown: attach to last rule if any, else drop with parent.
            if (entries.length > 0) {
                const last: ConditionalFormatEntry = entries[entries.length - 1];
                if (last !== undefined) {
                    last.childrenXml = last.childrenXml.length > 0 ? `${last.childrenXml}${child}` : child;
                }
            }
            continue;
        }
        const parsed: ConditionalFormatEntry = parseOneRule(child, ranges, pivot, parentExtraAttrsXml);
        if (parsed !== undefined) {
            entries.push(parsed);
        }
    }
    return entries;
}

/**
 * Serialize model to zero or more `conditionalFormatting` elements. Returns empty array when no entries (caller omits).
 *
 * @param {ConditionalFormattingModel} model - The model parameter.
 * @returns {string[]} - Returns the result.
 */
export function serializeConditionalFormattingXml(model: ConditionalFormattingModel): string[] {
    assignIconSetWirePriorities(model);
    if (model.entries.length === 0) {
        return [];
    }

    // Group by formatted sqref + pivot (first-seen group order; rules keep relative order).
    /**
     * Group.
     */
    type Group = {
        key: string;
        ranges: CellRange[];
        pivot: boolean;
        parentExtraAttrsXml: string;
        rules: ConditionalFormatEntry[];
    };
    const groups: Group[] = [];
    const indexByKey: Map<string, number> = new Map<string, number>();

    for (const e of model.entries) {
        const sq: string = formatCfSqref(e.ranges);
        const key: string = `${e.pivot ? '1' : '0'}\n${sq}`;
        const existingIdx: number = indexByKey.get(key);
        if (existingIdx !== undefined) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const g: any = groups[existingIdx];
            if (g !== undefined) {
                g.rules.push(e);
            }
            continue;
        }
        indexByKey.set(key, groups.length);
        groups.push({
            key,
            ranges: e.ranges,
            pivot: e.pivot,
            parentExtraAttrsXml: e.parentExtraAttrsXml,
            rules: [e]
        });
    }

    const out: string[] = [];
    for (const g of groups) {
        if (g.rules.length === 0) {
            continue;
        }
        const attrParts: string[] = [];
        if (g.pivot) {
            attrParts.push('pivot="1"');
        }
        const sq: string = formatCfSqref(g.ranges);
        if (sq.length > 0) {
            attrParts.push(`sqref="${escapeXml(sq)}"`);
        }
        if (g.parentExtraAttrsXml.trim().length > 0) {
            attrParts.push(g.parentExtraAttrsXml.trim());
        }
        const open: string = attrParts.length > 0 ? `<conditionalFormatting ${attrParts.join(' ')}>` : '<conditionalFormatting>';
        const parts: string[] = [open];
        for (const rule of g.rules) {
            parts.push(serializeOneRule(rule, model));
        }
        parts.push('</conditionalFormatting>');
        out.push(parts.join(''));
    }
    return out;
}

/**
 * parseOneRule function.
 *
 * @param {string} el - The el parameter.
 * @param {CellRange[]} ranges - The ranges parameter.
 * @param {boolean} pivot - The pivot parameter.
 * @param {string} parentExtraAttrsXml - The parentExtraAttrsXml parameter.
 * @returns {*} - Returns the result.
 */
function parseOneRule(el: string, ranges: CellRange[], pivot: boolean, parentExtraAttrsXml: string): ConditionalFormatEntry | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const typeRaw: string = attrs.get('type');
    if (typeRaw === undefined || !CF_TYPES.has(typeRaw)) {
        return undefined;
    }
    const type: ConditionalFormatType = typeRaw as ConditionalFormatType;

    const priorityRaw: string = attrs.get('priority');
    if (priorityRaw === undefined || priorityRaw.trim().length === 0) {
        return undefined;
    }
    const priorityNum: number = Number.parseInt(priorityRaw, 10);
    if (!Number.isFinite(priorityNum) || !Number.isInteger(priorityNum)) {
        return undefined;
    }

    let operator: ConditionalFormatOperator | undefined;
    const opRaw: string = attrs.get('operator');
    if (opRaw !== undefined && CF_OPERATORS.has(opRaw)) {
        operator = opRaw as ConditionalFormatOperator;
    }

    let timePeriod: ConditionalFormatTimePeriod | undefined;
    const tpRaw: string = attrs.get('timePeriod');
    if (tpRaw !== undefined && CF_TIME_PERIODS.has(tpRaw)) {
        timePeriod = tpRaw as ConditionalFormatTimePeriod;
    }

    const stopIfTrue: boolean = parseBoolAttr(attrs.get('stopIfTrue'), DEFAULT_STOP_IF_TRUE);
    const percent: boolean = parseBoolAttr(attrs.get('percent'), DEFAULT_PERCENT);
    const bottom: boolean = parseBoolAttr(attrs.get('bottom'), DEFAULT_BOTTOM);
    const aboveAverage: boolean = parseBoolAttr(attrs.get('aboveAverage'), DEFAULT_ABOVE_AVERAGE);
    const equalAverage: boolean = parseBoolAttr(attrs.get('equalAverage'), DEFAULT_EQUAL_AVERAGE);

    const rank: number = parseOptionalUnsigned(attrs.get('rank'));
    const stdDev: number = parseOptionalInt(attrs.get('stdDev'));
    const dxfId: number = parseOptionalUnsigned(attrs.get('dxfId'));
    const text: string = attrs.get('text');

    const extraAttrsXml: string = attrsToXmlExcludingLocal(
        attrs,
        new Set([
            'type',
            'dxfId',
            'priority',
            'stopIfTrue',
            'aboveAverage',
            'percent',
            'bottom',
            'operator',
            'text',
            'timePeriod',
            'rank',
            'stdDev',
            'equalAverage'
        ])
    );

    const formulas: string[] = [];
    const opaqueChildren: string[] = [];
    let dataBarData: DataBarData | undefined;
    let colorScaleData: ColorScaleData | undefined;
    let iconSetData: IconSetData | undefined;
    let x14RuleId: string | undefined;
    const inner: string = elementInnerLocal(el);
    for (const child of splitTopLevelLocal(inner)) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'formula' && formulas.length < MAX_FORMULAS) {
            const body: string = unescapeXml(elementInnerLocal(child));
            if (body.length > 0) {
                formulas.push(body);
            }
            continue;
        }
        if (local === 'dataBar') {
            dataBarData = parseDataBarXml(child);
        } else if (local === 'colorScale') {
            colorScaleData = parseColorScaleXml(child);
        } else if (local === 'iconSet') {
            iconSetData = parseIconSetXml(child);
        } else if (local === 'extLst') {
            const extracted: { id: string; remainderExtLst: string } = extractRuleIdFromExtLst(child);
            if (extracted.id !== undefined) {
                x14RuleId = extracted.id;
            }
            if (extracted.remainderExtLst !== undefined) {
                opaqueChildren.push(extracted.remainderExtLst);
            }
        } else {
            opaqueChildren.push(child);
        }
    }

    return {
        ranges: ranges.map((r: CellRange): { startRow: number; startCol: number; endRow: number; endCol: number } => ({ ...r })),
        pivot,
        type,
        priority: priorityNum,
        stopIfTrue,
        operator,
        formulas,
        text: text !== undefined && text.length > 0 ? text : undefined,
        timePeriod,
        rank,
        percent,
        bottom,
        aboveAverage,
        equalAverage,
        stdDev,
        dxfId,
        extraAttrsXml,
        childrenXml: opaqueChildren.join(''),
        parentExtraAttrsXml,
        dataBarData,
        colorScaleData,
        iconSetData,
        x14RuleId
    };
}

/**
 * serializeOneRule function.
 *
 * @param {ConditionalFormatEntry} e - The e parameter.
 * @param {ConditionalFormattingModel} [model] - Model used to shift priorities around x14 icon sets.
 * @returns {string} - Returns the result.
 */
function serializeOneRule(e: ConditionalFormatEntry, model?: ConditionalFormattingModel): string {
    if (e.iconSetData !== undefined && e.type === 'iconSet') {
        ensureX14IconSetPairing(e);
    }
    const attrs: string[] = [];
    attrs.push(`type="${escapeXml(e.type)}"`);
    if (e.dxfId !== undefined) {
        attrs.push(`dxfId="${String(e.dxfId)}"`);
    }
    // [MS-XLSX] 2.6.27: an x14 priority must not duplicate any other cfRule
    // priority in this worksheet part. Stars and boxes each take one, so the
    // transitional copies are shifted above all of them.
    const wiredTransitional: number | undefined = wirePriority(model, e, 'transitional');
    const transitionalPriority: number = wiredTransitional !== undefined ? wiredTransitional : e.priority;
    attrs.push(`priority="${String(transitionalPriority)}"`);
    if (e.stopIfTrue) {
        attrs.push('stopIfTrue="1"');
    }
    // Emit aboveAverage only when type is aboveAverage and value differs from default,
    // or when explicitly non-default (XSD default true).
    if (e.type === 'aboveAverage') {
        if (e.aboveAverage !== DEFAULT_ABOVE_AVERAGE) {
            attrs.push(`aboveAverage="${e.aboveAverage ? '1' : '0'}"`);
        }
        if (e.equalAverage) {
            attrs.push('equalAverage="1"');
        }
        if (e.stdDev !== undefined) {
            attrs.push(`stdDev="${String(e.stdDev)}"`);
        }
    } else if (e.aboveAverage !== DEFAULT_ABOVE_AVERAGE) {
        attrs.push(`aboveAverage="${e.aboveAverage ? '1' : '0'}"`);
    }
    if (e.percent) {
        attrs.push('percent="1"');
    }
    if (e.bottom) {
        attrs.push('bottom="1"');
    }
    if (e.operator !== undefined) {
        attrs.push(`operator="${escapeXml(e.operator)}"`);
    }
    if (e.text !== undefined) {
        attrs.push(`text="${escapeXml(e.text)}"`);
    }
    if (e.timePeriod !== undefined) {
        attrs.push(`timePeriod="${escapeXml(e.timePeriod)}"`);
    }
    if (e.rank !== undefined) {
        attrs.push(`rank="${String(e.rank)}"`);
    }
    if (e.type !== 'aboveAverage' && e.stdDev !== undefined) {
        attrs.push(`stdDev="${String(e.stdDev)}"`);
    }
    if (e.equalAverage && e.type !== 'aboveAverage') {
        attrs.push('equalAverage="1"');
    }
    if (e.extraAttrsXml.trim().length > 0) {
        attrs.push(e.extraAttrsXml.trim());
    }

    const children: string[] = [];
    for (const f of e.formulas) {
        children.push(`<formula>${escapeXml(f)}</formula>`);
    }
    // Emit structured visual XML before opaque remainder (extLst, unknowns).
    if (e.dataBarData !== undefined) {
        children.push(serializeDataBarXml(e.dataBarData));
    } else if (e.colorScaleData !== undefined) {
        children.push(serializeColorScaleXml(e.colorScaleData));
    } else if (e.iconSetData !== undefined) {
        children.push(serializeIconSetXml(e.iconSetData));
    }
    // Pairing GUID ext for x14 dual-write ([MS-XLSX] URI B025F937).
    // Strip any prior id ext from opaque children, then re-emit from x14RuleId.
    const cleanedChildren: string = stripRuleIdExtFromOpaque(e.childrenXml);
    if (cleanedChildren.length > 0) {
        children.push(cleanedChildren);
    }
    if (e.x14RuleId !== undefined && e.x14RuleId.length > 0) {
        children.push(serializeRuleIdExtLst(e.x14RuleId));
    }

    const open: string = `<cfRule ${attrs.join(' ')}`;
    if (children.length === 0) {
        return `${open}/>`;
    }
    return `${open}>${children.join('')}</cfRule>`;
}
/**
 * parseBoolAttr function.
 *
 * @param {string} raw - The raw parameter.
 * @param {boolean} defaultValue - The defaultValue parameter.
 * @returns {boolean} - Returns the result.
 */
function parseBoolAttr(raw: string | undefined, defaultValue: boolean): boolean {
    if (raw === undefined) {
        return defaultValue;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return defaultValue;
}

// ── Advanced CF parse/serialize helpers ──────────────────────────────────────

/**
 * Parse one `<cfvo …/>` element into the internal threshold model. Returns `undefined` if the `type` attribute is missing or unrecognised.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseCfvoElement(el: string): CfThresholdInternal | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const typeRaw: string = attrs.get('type');
    const type: CfThresholdType = typeRaw !== undefined ? CFVO_TYPE_MAP.get(typeRaw) : undefined;
    if (type === undefined) {
        return undefined;
    }
    const valueRaw: string = attrs.get('val');
    const value: string = valueRaw !== undefined && valueRaw.length > 0 ? valueRaw : undefined;
    const gte: boolean = parseBoolAttr(attrs.get('gte'), true);
    return { type, value, gte };
}

/**
 * Serialize one internal threshold to `<cfvo …/>`.
 *
 * @param {CfThresholdInternal} t - The t parameter.
 * @returns {string} - Returns the result.
 */
function serializeCfvo(t: CfThresholdInternal): string {
    const wireTypeRaw: string = CFVO_TYPE_REVERSE.get(t.type);
    const wireType: string = wireTypeRaw !== undefined ? wireTypeRaw : t.type;
    let attrs: string = `type="${escapeXml(wireType)}"`;
    if (t.value !== undefined) {
        attrs += ` val="${escapeXml(t.value)}"`;
    }
    if (!t.gte) {
        attrs += ' gte="0"';
    }
    return `<cfvo ${attrs}/>`;
}

/**
 * Parse a `<dataBar …>…</dataBar>` element into {@link DataBarData}. Returns `undefined` if the element lacks the minimum required children (two `cfvo` children and a `color` child).
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseDataBarXml(el: string): DataBarData | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const minLengthParsed: number = parseOptionalUnsigned(attrs.get('minLength'));
    const maxLengthParsed: number = parseOptionalUnsigned(attrs.get('maxLength'));
    const minLength: number = minLengthParsed !== undefined ? minLengthParsed : DEFAULT_DATA_BAR_MIN_LENGTH;
    const maxLength: number = maxLengthParsed !== undefined ? maxLengthParsed : DEFAULT_DATA_BAR_MAX_LENGTH;
    const showValue: boolean = parseBoolAttr(attrs.get('showValue'), true);
    const cfvos: CfThresholdInternal[] = [];
    let barColor: Color | undefined;
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'cfvo') {
            const t: CfThresholdInternal = parseCfvoElement(child);
            if (t !== undefined) {
                cfvos.push(t);
            }
        } else if (local === 'color') {
            barColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        }
    }
    if (cfvos.length < 2 || barColor === undefined) {
        return undefined;
    }
    const dbMin: CfThresholdInternal = cfvos[0];
    const dbMax: CfThresholdInternal = cfvos[1];
    if (dbMin === undefined || dbMax === undefined) {
        return undefined;
    }
    return {
        minPoint: dbMin,
        maxPoint: dbMax,
        barColor,
        minLength,
        maxLength,
        showValue,
        // Extended fields default until x14 merge overlays them.
        border: DEFAULT_DATA_BAR_BORDER,
        borderColor: undefined,
        gradient: DEFAULT_DATA_BAR_GRADIENT,
        direction: DEFAULT_DATA_BAR_DIRECTION,
        negativeBarColorSameAsPositive: DEFAULT_DATA_BAR_NEG_COLOR_SAME,
        negativeFillColor: undefined,
        negativeBarBorderColorSameAsPositive: DEFAULT_DATA_BAR_NEG_BORDER_SAME,
        negativeBorderColor: undefined,
        axisPosition: DEFAULT_DATA_BAR_AXIS_POSITION,
        axisColor: undefined
    };
}

/**
 * Serialize {@link DataBarData} to transitional `<dataBar …>…</dataBar>`.
 *
 * @param {DataBarData} d - The d parameter.
 * @returns {string} - Returns the result.
 */
function serializeDataBarXml(d: DataBarData): string {
    const lengths: { minLength: number; maxLength: number } = transitionalLengthsForSerialize(d);
    const parts: string[] = [];
    if (lengths.minLength !== DEFAULT_DATA_BAR_MIN_LENGTH) {
        parts.push(`minLength="${lengths.minLength}"`);
    }
    if (lengths.maxLength !== DEFAULT_DATA_BAR_MAX_LENGTH) {
        parts.push(`maxLength="${lengths.maxLength}"`);
    }
    if (!d.showValue) {
        parts.push('showValue="0"');
    }
    const open: string = parts.length > 0 ? `<dataBar ${parts.join(' ')}>` : '<dataBar>';
    // Transitional ST_CfvoType has no autoMin/autoMax — map to lowest/highest.
    const minPt: CfThresholdInternal =
        d.minPoint.type === 'autoMin' ? { type: 'lowestValue', value: undefined, gte: d.minPoint.gte } : d.minPoint;
    const maxPt: CfThresholdInternal =
        d.maxPoint.type === 'autoMax' ? { type: 'highestValue', value: undefined, gte: d.maxPoint.gte } : d.maxPoint;
    return `${open}` + `${serializeCfvo(minPt)}${serializeCfvo(maxPt)}` + `${serializeColorElement('color', d.barColor)}</dataBar>`;
}

/**
 * Parse a `<colorScale>…</colorScale>` element into {@link ColorScaleData}. Returns `undefined` if fewer than two matching cfvo/color pairs exist.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseColorScaleXml(el: string): ColorScaleData | undefined {
    const cfvos: CfThresholdInternal[] = [];
    const colors: Color[] = [];
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'cfvo') {
            const t: CfThresholdInternal = parseCfvoElement(child);
            if (t !== undefined) {
                cfvos.push(t);
            }
        } else if (local === 'color') {
            const c: Color = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
            if (c !== undefined) {
                colors.push(c);
            }
        }
    }
    const count: number = Math.min(cfvos.length, colors.length);
    if (count < 2) {
        return undefined;
    }
    const stops: ColorScaleStop[] = [];
    for (let i: number = 0; i < count; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const t: CfThresholdInternal = cfvos[i];
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const c: Color = colors[i];
        if (t === undefined || c === undefined) {
            continue;
        }
        stops.push({ type: t.type, value: t.value, color: c });
    }
    return { stops };
}

/**
 * Serialize {@link ColorScaleData} to `<colorScale>…</colorScale>`. OOXML layout: all cfvo children first, then all color children.
 *
 * @param {ColorScaleData} d - The d parameter.
 * @returns {string} - Returns the result.
 */
function serializeColorScaleXml(d: ColorScaleData): string {
    const cfvoParts: string = d.stops
        .map((s: ColorScaleStop): string => serializeCfvo({ type: s.type, value: s.value, gte: true }))
        .join('');
    const colorParts: string = d.stops.map((s: ColorScaleStop): string => serializeColorElement('color', s.color)).join('');
    return `<colorScale>${cfvoParts}${colorParts}</colorScale>`;
}

/**
 * Parse a `<iconSet …>…</iconSet>` element into {@link IconSetData}. Returns `undefined` if fewer than two cfvo children are present.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseIconSetXml(el: string): IconSetData | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const rawTypeAttr: string = attrs.get('iconSet');
    const rawType: string = rawTypeAttr !== undefined ? rawTypeAttr : DEFAULT_ICON_SET_TYPE;
    const iconSetType: IconSetType = ICON_SET_TYPES.has(rawType) ? (rawType as IconSetType) : DEFAULT_ICON_SET_TYPE;
    const showValue: boolean = parseBoolAttr(attrs.get('showValue'), true);
    const usePercent: boolean = parseBoolAttr(attrs.get('percent'), true);
    const reverse: boolean = parseBoolAttr(attrs.get('reverse'), false);
    const iconCriteria: CfThresholdInternal[] = [];
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        if (elementLocalNameLocal(child) === 'cfvo') {
            const t: CfThresholdInternal = parseCfvoElement(child);
            if (t !== undefined) {
                iconCriteria.push(t);
            }
        }
    }
    if (iconCriteria.length < 2) {
        return undefined;
    }
    return { iconSetType, iconCriteria, showValue, usePercent, reverse };
}

/**
 * Serialize {@link IconSetData} to `<iconSet>…</iconSet>`.
 * x14-only names are not in transitional `ST_IconSetType`; a same-count
 * fallback is written here and the real family on x14 `CT_IconSet`.
 *
 * @param {IconSetData} d - The d parameter.
 * @returns {string} - Returns the result.
 */
function serializeIconSetXml(d: IconSetData): string {
    const parts: string[] = [];
    const wireType: IconSetType = isX14OnlyIconSetType(d.iconSetType)
        ? transitionalIconSetFallback(d.iconSetType)
        : d.iconSetType;
    if (wireType !== DEFAULT_ICON_SET_TYPE) {
        parts.push(`iconSet="${escapeXml(wireType)}"`);
    }
    if (!d.showValue) {
        parts.push('showValue="0"');
    }
    if (!d.usePercent) {
        parts.push('percent="0"');
    }
    if (d.reverse) {
        parts.push('reverse="1"');
    }
    const open: string = parts.length > 0 ? `<iconSet ${parts.join(' ')}>` : '<iconSet>';
    return `${open}${d.iconCriteria.map(serializeCfvo).join('')}</iconSet>`;
}

// ─────────────────────────────────────────────────────────────────────────────

// ── x14 extended DataBar dual-write helpers ([MS-XLSX]) ───────────────────

/**
 * Generate a braced uppercase GUID for ST_Guid pairing.
 *
 * @returns {string} - Returns the result.
 */
function generateGuid(): string {
    const bytes: Uint8Array = new Uint8Array(16);
    let cryptoObj: any;
    try {
        // @ts-expect-error global undefined in TS 3.3
        cryptoObj = (function (): { getRandomValues?: (a: Uint8Array) => Uint8Array } | undefined {
            try {
                if (typeof window !== 'undefined' && window.crypto) {
                    return window.crypto;
                }
            } catch {
                // ignore
            }
            try {
                // eslint-disable-next-line no-new-func
                const g: { crypto?: Crypto } = new Function('return this')() as { crypto?: Crypto };
                if (g != null && g.crypto) {
                    return g.crypto;
                }
            } catch {
                // ignore
            }
            return undefined;
        })();
    } catch {
        cryptoObj = undefined;
    }
    if (cryptoObj !== undefined && typeof cryptoObj.getRandomValues === 'function') {
        cryptoObj.getRandomValues(bytes);
    } else {
        for (let i: number = 0; i < 16; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    // RFC 4122 version 4
    bytes[6] = ((bytes[6] != null ? bytes[6] : 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] != null ? bytes[8] : 0) & 0x3f) | 0x80;
    const hex: string = Array.from(bytes, (b: number): string => {
        const s: string = b.toString(16);
        return s.length < 2 ? '0' + s : s;
    })
        .join('')
        .toUpperCase();
    return `{${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}}`;
}

/**
 * normalizeGuid function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {string} - Returns the result.
 */
function normalizeGuid(raw: string | undefined): string | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const t: string = raw.trim();
    if (t.length === 0) {
        return undefined;
    }
    const bare: string = t.startsWith('{') && t.endsWith('}') ? t.slice(1, -1) : t;
    if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(bare)) {
        return undefined;
    }
    return `{${bare.toUpperCase()}}`;
}

/**
 * Pull pairing id from cfRule extLst URI B025F937; return remainder without that ext.
 *
 * @param {string} extLstEl - The extLstEl parameter.
 * @returns {Object} - Returns the result.
 */
function extractRuleIdFromExtLst(extLstEl: string): {
    id: string | undefined;
    remainderExtLst: string | undefined;
} {
    const kept: string[] = [];
    let id: string | undefined;
    for (const child of splitTopLevelLocal(elementInnerLocal(extLstEl))) {
        if (elementLocalNameLocal(child) !== 'ext') {
            kept.push(child);
            continue;
        }
        const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(child));
        const uri: string = attrs.get('uri');
        if (uri !== undefined && uri.toUpperCase() === X14_CF_RULE_ID_EXT_URI.toUpperCase()) {
            for (const g of splitTopLevelLocal(elementInnerLocal(child))) {
                if (elementLocalNameLocal(g) === 'id') {
                    id = normalizeGuid(unescapeXml(elementInnerLocal(g))) != null ? normalizeGuid(unescapeXml(elementInnerLocal(g))) : id;
                }
            }
            continue;
        }
        kept.push(child);
    }
    if (kept.length === 0) {
        return { id, remainderExtLst: undefined };
    }
    return { id, remainderExtLst: `<extLst>${kept.join('')}</extLst>` };
}

/**
 * Remove URI B025F937 id ext from opaque children markup (may contain extLst + others).
 *
 * @param {string} childrenXml - The childrenXml parameter.
 * @returns {string} - Returns the result.
 */
function stripRuleIdExtFromOpaque(childrenXml: string): string {
    if (childrenXml.length === 0) {
        return '';
    }
    const out: string[] = [];
    for (const child of splitTopLevelLocal(childrenXml)) {
        if (elementLocalNameLocal(child) !== 'extLst') {
            out.push(child);
            continue;
        }
        const extracted: { id: string; remainderExtLst: string } = extractRuleIdFromExtLst(child);
        if (extracted.remainderExtLst !== undefined) {
            out.push(extracted.remainderExtLst);
        }
    }
    return out.join('');
}

/**
 * serializeRuleIdExtLst function.
 *
 * @param {string} id - The id parameter.
 * @returns {string} - Returns the result.
 */
function serializeRuleIdExtLst(id: string): string {
    return `<extLst><ext uri="${X14_CF_RULE_ID_EXT_URI}">` + `<id>${escapeXml(id)}</id></ext></extLst>`;
}

/**
 * Parse x14 cfvo: type + optional gte; value via child xm:f (not @val).
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseX14CfvoElement(el: string): CfThresholdInternal | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const typeRaw: string = attrs.get('type');
    const type: CfThresholdType = typeRaw !== undefined ? CFVO_TYPE_MAP.get(typeRaw) : undefined;
    if (type === undefined) {
        return undefined;
    }
    const gte: boolean = parseBoolAttr(attrs.get('gte'), true);
    let value: string | undefined;
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        if (elementLocalNameLocal(child) === 'f') {
            const body: string = unescapeXml(elementInnerLocal(child)).trim();
            if (body.length > 0) {
                value = body;
            }
        }
    }
    // Some producers still put val on x14 cfvo — accept soft-compat without inventing.
    if (value === undefined) {
        const valAttr: string = attrs.get('val');
        if (valAttr !== undefined && valAttr.length > 0) {
            value = valAttr;
        }
    }
    return { type, value, gte };
}

/**
 * serializeX14Cfvo function.
 *
 * @param {CfThresholdInternal} t - The t parameter.
 * @returns {string} - Returns the result.
 */
function serializeX14Cfvo(t: CfThresholdInternal): string {
    const wireTypeRaw: string = CFVO_TYPE_REVERSE.get(t.type);
    const wireType: string = wireTypeRaw !== undefined ? wireTypeRaw : t.type;
    let attrs: string = `type="${escapeXml(wireType)}"`;
    if (!t.gte) {
        attrs += ' gte="0"';
    }
    if (t.value !== undefined) {
        return `<x14:cfvo ${attrs}><xm:f>${escapeXml(t.value)}</xm:f></x14:cfvo>`;
    }
    return `<x14:cfvo ${attrs}/>`;
}

/**
 * Parse x14 dataBar element into DataBarData (fillColor as barColor). Citation: [MS-XLSX] 2.6.30 CT_DataBar.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseX14DataBarXml(el: string): DataBarData | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const minLengthParsedX: number = parseOptionalUnsigned(attrs.get('minLength'));
    const maxLengthParsedX: number = parseOptionalUnsigned(attrs.get('maxLength'));
    const minLength: number = minLengthParsedX !== undefined ? minLengthParsedX : 0;
    const maxLength: number = maxLengthParsedX !== undefined ? maxLengthParsedX : 100;
    const showValue: boolean = parseBoolAttr(attrs.get('showValue'), true);
    const border: boolean = parseBoolAttr(attrs.get('border'), DEFAULT_DATA_BAR_BORDER);
    const gradient: boolean = parseBoolAttr(attrs.get('gradient'), DEFAULT_DATA_BAR_GRADIENT);
    const dirRaw: string = attrs.get('direction');
    const direction: DataBarDirection =
        dirRaw !== undefined && DATA_BAR_DIRECTIONS.has(dirRaw) ? (dirRaw as DataBarDirection) : DEFAULT_DATA_BAR_DIRECTION;
    const negativeBarColorSameAsPositive: boolean = parseBoolAttr(
        attrs.get('negativeBarColorSameAsPositive'),
        DEFAULT_DATA_BAR_NEG_COLOR_SAME
    );
    const negativeBarBorderColorSameAsPositive: boolean = parseBoolAttr(
        attrs.get('negativeBarBorderColorSameAsPositive'),
        DEFAULT_DATA_BAR_NEG_BORDER_SAME
    );
    const axisRaw: string = attrs.get('axisPosition');
    const axisPosition: DataBarAxisPosition =
        axisRaw !== undefined && DATA_BAR_AXIS_POSITIONS.has(axisRaw) ? (axisRaw as DataBarAxisPosition) : DEFAULT_DATA_BAR_AXIS_POSITION;

    const cfvos: CfThresholdInternal[] = [];
    let barColor: Color | undefined;
    let borderColor: Color | undefined;
    let negativeFillColor: Color | undefined;
    let negativeBorderColor: Color | undefined;
    let axisColor: Color | undefined;

    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'cfvo') {
            const t: CfThresholdInternal = parseX14CfvoElement(child);
            if (t !== undefined) {
                cfvos.push(t);
            }
        } else if (local === 'fillColor') {
            barColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        } else if (local === 'borderColor') {
            borderColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        } else if (local === 'negativeFillColor') {
            negativeFillColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        } else if (local === 'negativeBorderColor') {
            negativeBorderColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        } else if (local === 'axisColor') {
            axisColor = parseColorAttrs(parseAttrMapLocal(elementOpenAttrsLocal(child)));
        }
    }
    if (cfvos.length < 2 || barColor === undefined) {
        return undefined;
    }
    const dbMin: CfThresholdInternal = cfvos[0];
    const dbMax: CfThresholdInternal = cfvos[1];
    if (dbMin === undefined || dbMax === undefined) {
        return undefined;
    }
    return {
        minPoint: dbMin,
        maxPoint: dbMax,
        barColor,
        minLength,
        maxLength,
        showValue,
        border,
        borderColor,
        gradient,
        direction,
        negativeBarColorSameAsPositive,
        negativeFillColor,
        negativeBarBorderColorSameAsPositive,
        negativeBorderColor,
        axisPosition,
        axisColor
    };
}

/**
 * Length pairing: x14 0/100 pairs with transitional 10/90 ([MS-XLSX] data bar notes). Public model prefers x14 lengths when present.
 *
 * @param {*} transitional - transitional value.
 * @param {*} x14 - x14 value.
 * @returns {*} Function result.
 */
function preferX14Lengths(
    transitional: { minLength: number; maxLength: number },
    x14: { minLength: number; maxLength: number }
): { minLength: number; maxLength: number } {
    if (x14.minLength === 0 && x14.maxLength === 100) {
        // Keep public 0/100 when x14 uses the paired full range.
        return { minLength: 0, maxLength: 100 };
    }
    return { minLength: x14.minLength, maxLength: x14.maxLength };
}

/**
 * transitionalLengthsForSerialize function.
 *
 * @param {DataBarData} d - The d parameter.
 * @returns {Object} - Returns the result.
 */
function transitionalLengthsForSerialize(d: DataBarData): {
    minLength: number;
    maxLength: number;
} {
    if (d.minLength === 0 && d.maxLength === 100) {
        return {
            minLength: DEFAULT_DATA_BAR_MIN_LENGTH,
            maxLength: DEFAULT_DATA_BAR_MAX_LENGTH
        };
    }
    return { minLength: d.minLength, maxLength: d.maxLength };
}

/**
 * x14LengthsForSerialize function.
 *
 * @param {DataBarData} d - The d parameter.
 * @returns {Object} - Returns the result.
 */
function x14LengthsForSerialize(d: DataBarData): {
    minLength: number;
    maxLength: number;
} {
    // When model still holds classic 10/90 defaults with no explicit full-range,
    // Excel dual-write commonly emits x14 0/100. Keep model lengths as-is for
    // non-default lengths; for classic defaults emit the paired 0/100.
    if (d.minLength === DEFAULT_DATA_BAR_MIN_LENGTH && d.maxLength === DEFAULT_DATA_BAR_MAX_LENGTH) {
        return { minLength: 0, maxLength: 100 };
    }
    return { minLength: d.minLength, maxLength: d.maxLength };
}

/**
 * serializeX14DataBarXml function.
 *
 * @param {DataBarData} d - The d parameter.
 * @param {boolean} includeFillColor - The includeFillColor parameter.
 * @returns {string} - Returns the result.
 */
function serializeX14DataBarXml(d: DataBarData, includeFillColor: boolean): string {
    const lens: { minLength: number; maxLength: number } = x14LengthsForSerialize(d);
    const parts: string[] = [];
    parts.push(`minLength="${lens.minLength}"`);
    parts.push(`maxLength="${lens.maxLength}"`);
    if (!d.showValue) {
        parts.push('showValue="0"');
    }
    if (d.border) {
        parts.push('border="1"');
    }
    if (!d.gradient) {
        parts.push('gradient="0"');
    }
    if (d.direction !== DEFAULT_DATA_BAR_DIRECTION) {
        parts.push(`direction="${escapeXml(d.direction)}"`);
    }
    if (d.negativeBarColorSameAsPositive !== DEFAULT_DATA_BAR_NEG_COLOR_SAME) {
        parts.push(`negativeBarColorSameAsPositive="${d.negativeBarColorSameAsPositive ? '1' : '0'}"`);
    } else {
        // Schema default is false; Excel often writes it explicitly — omit when default.
    }
    if (d.negativeBarBorderColorSameAsPositive !== DEFAULT_DATA_BAR_NEG_BORDER_SAME) {
        parts.push(`negativeBarBorderColorSameAsPositive="${d.negativeBarBorderColorSameAsPositive ? '1' : '0'}"`);
    }
    if (d.axisPosition !== DEFAULT_DATA_BAR_AXIS_POSITION) {
        parts.push(`axisPosition="${escapeXml(d.axisPosition)}"`);
    }

    let body: string = serializeX14Cfvo(d.minPoint) + serializeX14Cfvo(d.maxPoint);
    // fillColor MUST when parent x14 cfRule has priority; for extension-only
    // pairing Excel still emits fillColor — always include when requested.
    if (includeFillColor) {
        body += serializeColorElement('x14:fillColor', d.barColor);
    }
    if (d.border && d.borderColor !== undefined) {
        body += serializeColorElement('x14:borderColor', d.borderColor);
    }
    if (!d.negativeBarColorSameAsPositive && d.negativeFillColor !== undefined) {
        body += serializeColorElement('x14:negativeFillColor', d.negativeFillColor);
    }
    if (d.border && !d.negativeBarBorderColorSameAsPositive && d.negativeBorderColor !== undefined) {
        body += serializeColorElement('x14:negativeBorderColor', d.negativeBorderColor);
    }
    if (d.axisPosition !== 'none' && d.axisColor !== undefined) {
        body += serializeColorElement('x14:axisColor', d.axisColor);
    }
    return `<x14:dataBar ${parts.join(' ')}>${body}</x14:dataBar>`;
}

/**
 * X14ParsedRule.
 */
interface X14ParsedRule {
    id: string | undefined;
    priority: number | undefined;
    type: string | undefined;
    /** Canonical sqref used to pair an x14 icon set with its transitional rule. */
    sqrefKey: string | undefined;
    dataBar: DataBarData | undefined;
    iconSet: IconSetData | undefined;
    /** True when the x14 icon set uses `custom` / `cfIcon` and must not be rewritten. */
    preserveIconSetOpaque: boolean;
    sqref: string | undefined;
    pivot: boolean;
}

/**
 * Parse an x14 `<iconSet>` into {@link IconSetData}.
 * Returns `undefined` for `custom="true"`, any `cfIcon` child, or an unknown
 * family so those blocks stay opaque. `@percent` is ignored ([MS-XLSX] 2.6.28).
 *
 * @param {string} el - x14 iconSet element.
 * @returns {IconSetData | undefined} Parsed icon set, or undefined to preserve opaque.
 */
function parseX14IconSetXml(el: string): IconSetData | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    if (parseBoolAttr(attrs.get('custom'), false)) {
        return undefined;
    }
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        if (elementLocalNameLocal(child) === 'cfIcon') {
            return undefined;
        }
    }
    const rawTypeAttr: string = attrs.get('iconSet');
    const rawType: string = rawTypeAttr !== undefined ? rawTypeAttr : DEFAULT_ICON_SET_TYPE;
    if (!ICON_SET_TYPES.has(rawType)) {
        return undefined;
    }
    const iconSetType: IconSetType = rawType as IconSetType;
    const showValue: boolean = parseBoolAttr(attrs.get('showValue'), true);
    const reverse: boolean = parseBoolAttr(attrs.get('reverse'), false);
    const iconCriteria: CfThresholdInternal[] = [];
    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        if (elementLocalNameLocal(child) === 'cfvo') {
            const t: CfThresholdInternal | undefined = parseX14CfvoElement(child);
            if (t !== undefined) {
                iconCriteria.push(t);
            }
        }
    }
    if (iconCriteria.length < 2) {
        return undefined;
    }
    return {
        iconSetType,
        iconCriteria,
        showValue,
        usePercent: true,
        reverse
    };
}

/**
 * First x14 icon-set cfvo is ignored ([MS-XLSX] 2.6.28). Excel's painted
 * `3Stars` / `5Boxes` rule writes it as `percent`. `3Triangles` keeps the
 * authored type: its painted rule uses `num`.
 *
 * @param {IconSetData} d - Authored icon set.
 * @returns {CfThresholdInternal[]} Criteria written on the painted x14 rule.
 */
function x14IconSetCriteria(d: IconSetData): CfThresholdInternal[] {
    if (!iconSetNeedsX14Priority(d.iconSetType)) {
        return d.iconCriteria;
    }
    const out: CfThresholdInternal[] = [];
    for (let i: number = 0; i < d.iconCriteria.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned array access with validated keys
        const c: CfThresholdInternal | undefined = d.iconCriteria[i];
        if (c === undefined) {
            continue;
        }
        if (i === 0 && c.type !== 'percent') {
            out.push({ type: 'percent', value: c.value, gte: c.gte });
        } else {
            out.push(c);
        }
    }
    return out;
}

/**
 * Excel's painted `3Stars` / `5Boxes` x14 sqref starts one row above the
 * transitional range. The public range is unchanged. `3Triangles` uses the
 * same sqref on both.
 *
 * @param {ConditionalFormatEntry} e - Icon-set rule.
 * @returns {string} Sqref written on the priority-bearing x14 rule.
 */
function x14IconSetSqref(e: ConditionalFormatEntry): string {
    const sq: string = formatCfSqref(e.ranges);
    if (
        e.iconSetData === undefined ||
        !iconSetNeedsX14Priority(e.iconSetData.iconSetType) ||
        e.ranges.length !== 1
    ) {
        return sq;
    }
    const range: CellRange | undefined = e.ranges[0];
    if (range === undefined || range.startRow <= 1) {
        return sq;
    }
    return formatCfSqref([
        {
            startRow: range.startRow - 1,
            startCol: range.startCol,
            endRow: range.endRow,
            endCol: range.endCol
        }
    ]);
}

/**
 * Serialize an icon set onto x14 `CT_IconSet` (value via `xm:f`).
 *
 * @param {IconSetData} d - Icon set.
 * @param {ReadonlyArray<CfThresholdInternal>} criteria - Criteria to write.
 * @returns {string} x14 iconSet markup.
 */
function serializeX14IconSetXml(d: IconSetData, criteria: ReadonlyArray<CfThresholdInternal>): string {
    const parts: string[] = [];
    if (d.iconSetType !== DEFAULT_ICON_SET_TYPE) {
        parts.push(`iconSet="${escapeXml(d.iconSetType)}"`);
    }
    if (!d.showValue) {
        parts.push('showValue="0"');
    }
    if (d.reverse) {
        parts.push('reverse="1"');
    }
    const open: string = parts.length > 0 ? `<x14:iconSet ${parts.join(' ')}>` : '<x14:iconSet>';
    return `${open}${criteria.map(serializeX14Cfvo).join('')}</x14:iconSet>`;
}

/**
 * One x14 conditionalFormatting block.
 * `priority` absent matches the Excel priority-less twin.
 *
 * @param {ConditionalFormatEntry} e - Source rule.
 * @param {IconSetData} d - Icon set to write.
 * @param {string} sqref - Sqref for this block.
 * @param {number | undefined} priority - x14 priority, or undefined for the twin.
 * @param {ReadonlyArray<CfThresholdInternal>} criteria - Criteria for this block.
 * @returns {string} One `x14:conditionalFormatting` element.
 */
function serializeX14IconSetBlock(
    e: ConditionalFormatEntry,
    d: IconSetData,
    sqref: string,
    priority: number | undefined,
    criteria: ReadonlyArray<CfThresholdInternal>
): string {
    const pivotAttr: '' | ' pivot="1"' = e.pivot ? ' pivot="1"' : '';
    const priorityAttr: string = priority !== undefined ? ` priority="${String(priority)}"` : '';
    const iconXml: string = serializeX14IconSetXml(d, criteria);
    // Excel declares xm on the conditionalFormatting that contains xm:f
    // and xm:sqref. A wrapper-only declaration was not the painted shape
    // of the priority-bearing rule.
    const xmDecl: string = priority !== undefined ? ` xmlns:xm="${XM_NS}"` : '';
    return (
        `<x14:conditionalFormatting${xmDecl}${pivotAttr}>` +
        `<x14:cfRule type="iconSet"${priorityAttr} id="${escapeXml(generateGuid())}">${iconXml}</x14:cfRule>` +
        `<xm:sqref>${escapeXml(sqref)}</xm:sqref>` +
        '</x14:conditionalFormatting>'
    );
}

/**
 * Canonical sqref key for pairing an x14 icon set with its transitional rule.
 * Invalid markup stays unmatched rather than failing the whole sheet open.
 *
 * @param {string} sqref - Raw sqref text.
 * @returns {string | undefined} Canonical sqref, or undefined when unparseable.
 */
function normalizeIconSetSqref(sqref: string): string | undefined {
    try {
        return formatCfSqref(parseCfSqref(sqref));
    } catch {
        return undefined;
    }
}

/**
 * Excel's painted `3Stars` / `5Boxes` sqref starts one row above the public
 * range. Pair that rule with the transitional range it was written from.
 * A multi-area sqref is not shifted.
 *
 * @param {ConditionalFormatEntry} e - Transitional icon-set rule.
 * @param {string} sqrefKey - Canonical x14 sqref.
 * @returns {boolean} True when this entry owns that sqref.
 */
function iconSetSqrefMatches(e: ConditionalFormatEntry, sqrefKey: string): boolean {
    const own: string | undefined = normalizeIconSetSqref(formatCfSqref(e.ranges));
    if (own === sqrefKey) {
        return true;
    }
    if (e.ranges.length !== 1 || e.iconSetData === undefined) {
        return false;
    }
    if (!iconSetNeedsX14Priority(e.iconSetData.iconSetType)) {
        return false;
    }
    return normalizeIconSetSqref(x14IconSetSqref(e)) === sqrefKey;
}

/**
 * Pair an x14 rule with a transitional entry of the given visual kind.
 * Does not invent a transitional twin here. Unpaired x14 icon sets are
 * promoted later by {@link entryFromUnpairedX14IconSet}; unpaired data bars
 * stay in the opaque extension bag.
 * Data bars pair by the rule-id ext. Extended icon sets pair by `sqref`
 * first: Excel omits URI `{B025F937-…}` and keeps the id only on x14.
 *
 * @param {ConditionalFormatEntry[]} entries - Transitional rules.
 * @param {Map<string, ConditionalFormatEntry>} byId - Uppercase id → entry.
 * @param {X14ParsedRule} xr - Parsed x14 rule.
 * @param {'dataBar' | 'iconSet'} kind - Visual kind to pair.
 * @returns {ConditionalFormatEntry | undefined} Matched entry, if any.
 */
function pairX14Rule(
    entries: ConditionalFormatEntry[],
    byId: Map<string, ConditionalFormatEntry>,
    xr: X14ParsedRule,
    kind: 'dataBar' | 'iconSet'
): ConditionalFormatEntry | undefined {
    let target: ConditionalFormatEntry | undefined;
    if (kind === 'iconSet' && xr.sqrefKey !== undefined) {
        for (const e of entries) {
            if (e.iconSetData !== undefined && iconSetSqrefMatches(e, xr.sqrefKey)) {
                target = e;
                break;
            }
        }
    }
    if (target === undefined && xr.id !== undefined) {
        target = byId.get(xr.id.toUpperCase());
    }
    // Data bars are paired by id, then by first unpaired data bar. Icon sets
    // are not: an x14-only rule has no transitional twin, and attaching its id
    // to the first icon set would hide that rule from promotion.
    if (target === undefined && kind === 'dataBar' && xr.id !== undefined) {
        for (const e of entries) {
            if (e.dataBarData !== undefined && e.x14RuleId === undefined) {
                e.x14RuleId = xr.id;
                byId.set(xr.id.toUpperCase(), e);
                target = e;
                break;
            }
        }
    }
    return target;
}

/**
 * Public range for an x14-only icon set.
 *
 * Excel's painted `3Stars` / `5Boxes` rule stores `xm:sqref` one row above
 * the range the user authored. When that rule has no transitional twin, the
 * public range is the shifted range moved back down one row. A priority-less
 * twin, or a range that already starts on row 1, is used as written.
 *
 * @param {X14ParsedRule} xr - Parsed x14 icon-set rule.
 * @returns {CellRange[] | undefined} Ranges for a new entry, or undefined when sqref is unusable.
 */
function rangesForUnpairedX14IconSet(xr: X14ParsedRule): CellRange[] | undefined {
    if (xr.sqref === undefined || xr.iconSet === undefined) {
        return undefined;
    }
    let ranges: CellRange[];
    try {
        ranges = parseCfSqref(xr.sqref);
    } catch {
        return undefined;
    }
    if (
        xr.priority !== undefined &&
        iconSetNeedsX14Priority(xr.iconSet.iconSetType) &&
        ranges.length === 1
    ) {
        const range: CellRange | undefined = ranges[0];
        if (range !== undefined && range.startRow > 1) {
            return [
                {
                    startRow: range.startRow + 1,
                    startCol: range.startCol,
                    endRow: range.endRow,
                    endCol: range.endCol
                }
            ];
        }
    }
    return ranges.map((r: CellRange): CellRange => ({
        startRow: r.startRow,
        startCol: r.startCol,
        endRow: r.endRow,
        endCol: r.endCol
    }));
}

/**
 * Build a transitional entry for an x14 icon set that has no legacy `cfRule`.
 *
 * Modern Excel authors extended families (`3Stars`, `5Boxes`, `3Triangles`)
 * directly under ext URI `{78C0D931-…}` and often omits the transitional twin.
 * Those rules are still conditional formats: dropping them leaves
 * `conditionalFormats` short of the rules Excel and XlsIO report.
 * [MS-XLSX] 2.6.27 requires `cfRule/@priority` when the rule is not an
 * extension of a transitional rule, so a missing priority is filled from the
 * sheet maximum rather than invented as a second visual.
 *
 * @param {X14ParsedRule} xr - Parsed unpaired x14 icon-set rule.
 * @param {number} priority - Priority when the x14 rule has none.
 * @returns {ConditionalFormatEntry | undefined} New entry, or undefined when the rule cannot be modeled.
 */
function entryFromUnpairedX14IconSet(xr: X14ParsedRule, priority: number): ConditionalFormatEntry | undefined {
    if (xr.iconSet === undefined) {
        return undefined;
    }
    const ranges: CellRange[] | undefined = rangesForUnpairedX14IconSet(xr);
    if (ranges === undefined || ranges.length === 0) {
        return undefined;
    }
    const x: IconSetData = xr.iconSet;
    return {
        ranges,
        pivot: xr.pivot,
        type: 'iconSet',
        priority: xr.priority !== undefined ? xr.priority : priority,
        stopIfTrue: DEFAULT_STOP_IF_TRUE,
        operator: undefined,
        formulas: [],
        text: undefined,
        timePeriod: undefined,
        rank: undefined,
        percent: DEFAULT_PERCENT,
        bottom: DEFAULT_BOTTOM,
        aboveAverage: DEFAULT_ABOVE_AVERAGE,
        equalAverage: DEFAULT_EQUAL_AVERAGE,
        stdDev: undefined,
        dxfId: undefined,
        extraAttrsXml: '',
        childrenXml: '',
        parentExtraAttrsXml: '',
        dataBarData: undefined,
        colorScaleData: undefined,
        iconSetData: {
            iconSetType: x.iconSetType,
            iconCriteria: x.iconCriteria.map((c: CfThresholdInternal): CfThresholdInternal => ({
                type: c.type,
                value: c.value,
                gte: c.gte
            })),
            showValue: x.showValue,
            usePercent: true,
            reverse: x.reverse
        },
        x14RuleId: xr.id
    };
}

/**
 * One worksheet extension group of x14 conditional formattings.
 * `wrapperXm` is true for the priority-less twin Excel writes with `xmlns:xm`.
 */
interface X14ConditionalFormattingGroup {
    readonly wrapperXm: boolean;
    readonly blocks: ReadonlyArray<string>;
}

/**
 * Parse all x14 conditionalFormatting blocks from a sheet ext inner payload.
 *
 * @param {string} innerXml - The innerXml parameter.
 * @returns {X14ParsedRule[]} - Returns the result.
 */
function parseX14ConditionalFormattingsInner(innerXml: string): X14ParsedRule[] {
    const rules: X14ParsedRule[] = [];
    for (const top of splitTopLevelLocal(innerXml)) {
        if (elementLocalNameLocal(top) !== 'conditionalFormattings') {
            continue;
        }
        for (const cf of splitTopLevelLocal(elementInnerLocal(top))) {
            if (elementLocalNameLocal(cf) !== 'conditionalFormatting') {
                continue;
            }
            const cfAttrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(cf));
            const pivot: boolean = parseBoolAttr(cfAttrs.get('pivot'), false);
            let sqref: string | undefined;
            let ruleEl: string | undefined;
            for (const child of splitTopLevelLocal(elementInnerLocal(cf))) {
                const local: string = elementLocalNameLocal(child);
                if (local === 'sqref') {
                    sqref = unescapeXml(elementInnerLocal(child)).trim();
                } else if (local === 'cfRule') {
                    ruleEl = child;
                }
            }
            if (ruleEl === undefined) {
                continue;
            }
            const rAttrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(ruleEl));
            const id: string = normalizeGuid(rAttrs.get('id'));
            const priority: number = parseOptionalInt(rAttrs.get('priority'));
            const type: string = rAttrs.get('type');
            let dataBar: DataBarData | undefined;
            let iconSet: IconSetData | undefined;
            let preserveIconSetOpaque: boolean = false;
            for (const ch of splitTopLevelLocal(elementInnerLocal(ruleEl))) {
                const local: string = elementLocalNameLocal(ch);
                if (local === 'dataBar') {
                    dataBar = parseX14DataBarXml(ch);
                } else if (local === 'iconSet') {
                    iconSet = parseX14IconSetXml(ch);
                    if (iconSet === undefined) {
                        preserveIconSetOpaque = true;
                    }
                }
            }
            rules.push({
                id,
                priority,
                type,
                sqrefKey: sqref !== undefined ? normalizeIconSetSqref(sqref) : undefined,
                dataBar,
                iconSet,
                preserveIconSetOpaque,
                sqref,
                pivot
            });
        }
    }
    return rules;
}

/**
 * Find URI 78C0D931 ext payload(s) inside afterSheetDataXml bag.
 *
 * @param {string} afterSheetDataXml - The afterSheetDataXml parameter.
 * @returns {string[]} - Returns the result.
 */
function extractX14CfExtPayloads(afterSheetDataXml: ReadonlyArray<string>): string[] {
    const payloads: string[] = [];
    for (const frag of afterSheetDataXml) {
        if (elementLocalNameLocal(frag) !== 'extLst') {
            continue;
        }
        for (const ext of splitTopLevelLocal(elementInnerLocal(frag))) {
            if (elementLocalNameLocal(ext) !== 'ext') {
                continue;
            }
            const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(ext));
            const uri: string = attrs.get('uri');
            if (uri !== undefined && uri.toUpperCase() === X14_CF_SHEET_EXT_URI.toUpperCase()) {
                payloads.push(elementInnerLocal(ext));
            }
        }
    }
    return payloads;
}

/**
 * mergeX14IntoEntries function.
 *
 * @param {ConditionalFormatEntry[]} entries - The entries parameter.
 * @param {ReadonlyArray<string>} afterSheetDataXml - The afterSheetDataXml parameter.
 * @returns {void} - Returns the result.
 */
function mergeX14IntoEntries(entries: ConditionalFormatEntry[], afterSheetDataXml: ReadonlyArray<string>): void {
    const byId: Map<string, ConditionalFormatEntry> = new Map<string, ConditionalFormatEntry>();
    for (const e of entries) {
        if (e.x14RuleId !== undefined) {
            byId.set(e.x14RuleId.toUpperCase(), e);
        }
    }
    const pendingIconSets: X14ParsedRule[] = [];
    const payloads: string[] = extractX14CfExtPayloads(afterSheetDataXml);
    for (const payload of payloads) {
        for (const xr of parseX14ConditionalFormattingsInner(payload)) {
            if (xr.iconSet !== undefined) {
                const iconTarget: ConditionalFormatEntry | undefined = pairX14Rule(entries, byId, xr, 'iconSet');
                if (iconTarget === undefined) {
                    // No transitional cfRule. Promote after every extension is seen
                    // so a painted copy and its twin become one entry.
                    pendingIconSets.push(xr);
                } else if (
                    iconTarget.iconSetData !== undefined &&
                    xr.id !== undefined &&
                    // The priority-bearing 3Stars / 5Boxes rule is the painted shape,
                    // but Excel also writes a priority-less twin whose first cfvo is
                    // the authored type. [MS-XLSX] 2.6.28 ignores that first cfvo, so
                    // do not let the painted percent overlay replace it.
                    (xr.priority === undefined || !iconSetNeedsX14Priority(xr.iconSet.iconSetType))
                ) {
                    if (iconTarget.x14RuleId === undefined) {
                        iconTarget.x14RuleId = xr.id;
                    }
                    const base: IconSetData = iconTarget.iconSetData;
                    const x: IconSetData = xr.iconSet;
                    iconTarget.iconSetData = {
                        iconSetType: x.iconSetType,
                        iconCriteria: x.iconCriteria.map((c: CfThresholdInternal): CfThresholdInternal => ({
                            type: c.type,
                            value: c.value,
                            gte: c.gte
                        })),
                        showValue: x.showValue,
                        // [MS-XLSX] 2.6.28: x14 @percent MUST be ignored.
                        usePercent: base.usePercent,
                        reverse: x.reverse
                    };
                    iconTarget.type = 'iconSet';
                }
            }
            if (xr.dataBar === undefined) {
                continue;
            }
            const target: ConditionalFormatEntry | undefined = pairX14Rule(entries, byId, xr, 'dataBar');
            if (target === undefined || target.dataBarData === undefined) {
                // Unpaired x14 dataBar with priority could be a full rule; skip inventing
                // a transitional twin (preserve opaque via bag). Already in afterSheetData.
                continue;
            }
            if (target.x14RuleId === undefined && xr.id !== undefined) {
                target.x14RuleId = xr.id;
            }
            const base: DataBarData = target.dataBarData;
            const x: DataBarData = xr.dataBar;
            const lens: { minLength: number; maxLength: number } = preferX14Lengths(base, x);
            target.dataBarData = {
                minPoint: { ...x.minPoint },
                maxPoint: { ...x.maxPoint },
                barColor: { ...x.barColor },
                minLength: lens.minLength,
                maxLength: lens.maxLength,
                showValue: x.showValue,
                border: x.border,
                borderColor: x.borderColor !== undefined ? { ...x.borderColor } : undefined,
                gradient: x.gradient,
                direction: x.direction,
                negativeBarColorSameAsPositive: x.negativeBarColorSameAsPositive,
                negativeFillColor: x.negativeFillColor !== undefined ? { ...x.negativeFillColor } : undefined,
                negativeBarBorderColorSameAsPositive: x.negativeBarBorderColorSameAsPositive,
                negativeBorderColor: x.negativeBorderColor !== undefined ? { ...x.negativeBorderColor } : undefined,
                axisPosition: x.axisPosition,
                axisColor: x.axisColor !== undefined ? { ...x.axisColor } : undefined
            };
        }
    }
    promoteUnpairedX14IconSets(entries, byId, pendingIconSets);
}

/**
 * Add one entry per unpaired x14 icon set.
 *
 * Excel writes both a priority-bearing rule and a priority-less twin for
 * `3Stars` and `5Boxes`. They describe one format, so the twin is preferred
 * (authored cfvo types, public sqref) and the painted copy is not a second
 * entry. A priority-bearing copy is used only when no twin shares its range.
 *
 * @param {ConditionalFormatEntry[]} entries - Sheet rules, mutated.
 * @param {Map<string, ConditionalFormatEntry>} byId - Uppercase id → entry.
 * @param {ReadonlyArray<X14ParsedRule>} pending - Unpaired x14 icon-set rules.
 * @returns {void} - Returns the result.
 */
function promoteUnpairedX14IconSets(
    entries: ConditionalFormatEntry[],
    byId: Map<string, ConditionalFormatEntry>,
    pending: ReadonlyArray<X14ParsedRule>
): void {
    const consumed: Set<X14ParsedRule> = new Set<X14ParsedRule>();
    let nextPriority: number = 0;
    for (const e of entries) {
        if (e.priority > nextPriority) {
            nextPriority = e.priority;
        }
    }
    const ordered: X14ParsedRule[] = [];
    for (const xr of pending) {
        if (xr.priority === undefined) {
            ordered.push(xr);
        }
    }
    for (const xr of pending) {
        if (xr.priority !== undefined) {
            ordered.push(xr);
        }
    }
    for (const xr of ordered) {
        if (consumed.has(xr) || xr.iconSet === undefined) {
            continue;
        }
        const created: ConditionalFormatEntry | undefined = entryFromUnpairedX14IconSet(xr, nextPriority + 1);
        if (created === undefined) {
            continue;
        }
        const ownKey: string | undefined = normalizeIconSetSqref(formatCfSqref(created.ranges));
        let duplicate: boolean = false;
        if (ownKey !== undefined) {
            for (const existing of entries) {
                if (existing.iconSetData !== undefined && iconSetSqrefMatches(existing, ownKey)) {
                    duplicate = true;
                    break;
                }
            }
        }
        if (duplicate) {
            consumed.add(xr);
            continue;
        }
        entries.push(created);
        consumed.add(xr);
        if (created.priority > nextPriority) {
            nextPriority = created.priority;
        }
        if (created.x14RuleId !== undefined) {
            byId.set(created.x14RuleId.toUpperCase(), created);
        }
        // A painted 3Stars / 5Boxes copy of this same rule must not become
        // a second entry. Pairing now sees the entry just added.
        for (const other of pending) {
            if (other === xr || consumed.has(other) || other.iconSet === undefined || other.sqrefKey === undefined) {
                continue;
            }
            if (iconSetSqrefMatches(created, other.sqrefKey)) {
                consumed.add(other);
            }
        }
    }
}

/**
 * Group x14 rules into the two extensions Excel desktop keeps.
 *
 * `Resaved.xlsx` writes exactly two worksheet ext elements of URI 78C0D931
 * per sheet (one priority-bearing, one priority-less). A third copy made
 * Excel replace the sheet part. Extra families stay inside those two
 * extensions rather than becoming more `ext` elements.
 *
 * @param {ConditionalFormattingModel} model - Rules to write.
 * @returns {X14ConditionalFormattingGroup[]} Zero, one, or two extension groups.
 */
function serializeX14ConditionalFormattingGroups(model: ConditionalFormattingModel): X14ConditionalFormattingGroup[] {
    assignIconSetWirePriorities(model);
    const shared: string[] = [];
    const priorityBlocks: string[] = [];
    const twinBlocks: string[] = [];
    for (const e of model.entries) {
        const sq: string = formatCfSqref(e.ranges);
        const pivotAttr: '' | ' pivot="1"' = e.pivot ? ' pivot="1"' : '';
        if (e.dataBarData !== undefined) {
            const id: string = e.x14RuleId != null ? e.x14RuleId : generateGuid();
            // Extension-only cfRule: id present, priority absent ([MS-XLSX] 2.6.27).
            const dataBarXml: string = serializeX14DataBarXml(e.dataBarData, true);
            shared.push(
                `<x14:conditionalFormatting${pivotAttr}>` +
                    `<x14:cfRule type="dataBar" id="${escapeXml(id)}">${dataBarXml}</x14:cfRule>` +
                    `<xm:sqref>${escapeXml(sq)}</xm:sqref>` +
                    '</x14:conditionalFormatting>'
            );
            continue;
        }
        // Extended icon families are not in transitional ST_IconSetType.
        // 3Triangles: one priority-less x14 twin, paired by sqref.
        // 3Stars / 5Boxes: a priority-less rule alone was ignored and the
        // transitional fallback was painted, so a priority-bearing rule is
        // written as well.
        if (e.iconSetData === undefined || !isX14OnlyIconSetType(e.iconSetData.iconSetType)) {
            continue;
        }
        const d: IconSetData = e.iconSetData;
        if (!iconSetNeedsX14Priority(d.iconSetType)) {
            shared.push(serializeX14IconSetBlock(e, d, sq, undefined, d.iconCriteria));
            continue;
        }
        const x14Priority: number | undefined = wirePriority(model, e, 'x14');
        if (x14Priority !== undefined) {
            priorityBlocks.push(
                serializeX14IconSetBlock(e, d, x14IconSetSqref(e), x14Priority, x14IconSetCriteria(d))
            );
        }
        twinBlocks.push(serializeX14IconSetBlock(e, d, sq, undefined, d.iconCriteria));
    }
    const groups: X14ConditionalFormattingGroup[] = [];
    if (priorityBlocks.length > 0) {
        groups.push({ wrapperXm: false, blocks: priorityBlocks });
    }
    const twinAndShared: string[] = twinBlocks.concat(shared);
    if (twinAndShared.length > 0) {
        groups.push({ wrapperXm: true, blocks: twinAndShared });
    }
    return groups;
}

/**
 * Serialize one x14 conditionalFormattings wrapper.
 * `xmlns:x14` is declared only on the parent `ext`. Repeating it here is a
 * duplicate namespace declaration Excel treats as a corrupt worksheet part.
 *
 * @param {X14ConditionalFormattingGroup} group - Blocks for one extension.
 * @returns {string} `x14:conditionalFormattings` markup.
 */
function serializeX14ConditionalFormattingsXml(group: X14ConditionalFormattingGroup): string {
    const wrapperXm: string = group.wrapperXm ? ` xmlns:xm="${XM_NS}"` : '';
    return `<x14:conditionalFormattings${wrapperXm}>` + group.blocks.join('') + '</x14:conditionalFormattings>';
}

/**
 * One worksheet `ext` for URI 78C0D931.
 * Excel desktop writes the priority-bearing extension URI with a lowercase
 * `d` in `407d`. The priority-less twin uses the uppercase form.
 *
 * @param {string} innerFormattings - `x14:conditionalFormattings` markup.
 * @param {'painted' | 'twin'} uriCase - Which URI casing to emit.
 * @returns {string} One `ext` element.
 */
function serializeX14SheetExtElement(innerFormattings: string, uriCase: 'painted' | 'twin'): string {
    const uri: string =
        uriCase === 'painted' ? '{78C0D931-6437-407d-A8EE-F0AAD7539E65}' : X14_CF_SHEET_EXT_URI;
    return `<ext uri="${uri}" xmlns:x14="${X14_NS}">` + innerFormattings + '</ext>';
}

/**
 * True when an x14 ext contains a custom icon set (`cfIcon` or `custom="…"`).
 *
 * @param {string} extXml - Ext element markup.
 * @returns {boolean} True when the ext must be preserved as opaque.
 */
function extMentionsCustomIconSet(extXml: string): boolean {
    return extXml.indexOf('cfIcon') >= 0 || extXml.indexOf('custom="') >= 0;
}

/**
 * Rewrite only URI 78C0D931 inside extLst bag entries; preserve other ext and non-extLst after-sheet fragments.
 *
 * @param {ConditionalFormattingModel} model - The model parameter.
 * @param {ReadonlyArray<string>} afterSheetDataXml - The afterSheetDataXml parameter.
 * @returns {string[]} - Returns the result.
 */
function rewriteX14SheetExt(model: ConditionalFormattingModel, afterSheetDataXml: ReadonlyArray<string>): string[] {
    // Two worksheet ext elements share URI 78C0D931. Replacing every existing
    // copy with one combined block dropped the twin Excel paints.
    const x14Exts: string[] = serializeX14ConditionalFormattingGroups(model).map(
        (group: X14ConditionalFormattingGroup): string =>
            serializeX14SheetExtElement(serializeX14ConditionalFormattingsXml(group), group.wrapperXm ? 'twin' : 'painted')
    );

    const out: string[] = [];
    let wroteX14: boolean = false;

    for (const frag of afterSheetDataXml) {
        if (elementLocalNameLocal(frag) !== 'extLst') {
            out.push(frag);
            continue;
        }
        const keptExts: string[] = [];
        let replacedUri: boolean = false;
        for (const ext of splitTopLevelLocal(elementInnerLocal(frag))) {
            if (elementLocalNameLocal(ext) !== 'ext') {
                keptExts.push(ext);
                continue;
            }
            const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(ext));
            const uri: string = attrs.get('uri');
            if (uri !== undefined && uri.toUpperCase() === X14_CF_SHEET_EXT_URI.toUpperCase()) {
                if (!replacedUri && !wroteX14) {
                    for (const x14Ext of x14Exts) {
                        keptExts.push(x14Ext);
                    }
                    replacedUri = true;
                    wroteX14 = x14Exts.length > 0;
                }
                // custom cfIcon blocks are not modeled; keep that ext if we rewrote none.
                if (x14Exts.length === 0 && extMentionsCustomIconSet(ext)) {
                    keptExts.push(ext);
                }
                continue;
            }
            keptExts.push(ext);
        }
        if (!wroteX14 && x14Exts.length > 0) {
            for (const x14Ext of x14Exts) {
                keptExts.push(x14Ext);
            }
            wroteX14 = true;
        }
        if (keptExts.length > 0) {
            out.push(`<extLst>${keptExts.join('')}</extLst>`);
        }
    }

    if (!wroteX14 && x14Exts.length > 0) {
        out.push(`<extLst>${x14Exts.join('')}</extLst>`);
    }
    return out;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseOptionalUnsigned function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalUnsigned(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}

/**
 * parseOptionalInt function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalInt(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
        return undefined;
    }
    return n;
}

/* ── minimal local XML helpers (mirror data-validations, avoid cycles) ── */

/**
 * elementLocalNameLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalNameLocal(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

/**
 * findTagEndLocal function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEndLocal(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosingLocal function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosingLocal(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}\\s*>`, 'g');
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEndLocal(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementInnerLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInnerLocal(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEndLocal(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * splitTopLevelLocal function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelLocal(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEndLocal(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalNameLocal(openTag);
        const close: number = findClosingLocal(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * parseAttrMapLocal function.
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
function parseAttrMapLocal(attrText: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        if (name === undefined) {
            continue;
        }
        const raw: string = ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[3]);
        const value: string = unescapeXml(raw);
        map.set(name, value);
        const local: string = name.includes(':') ? name.slice(name.indexOf(':') + 1) : name;
        if (!map.has(local)) {
            map.set(local, value);
        }
    }
    return map;
}

/**
 * attrsToXmlExcludingLocal function.
 *
 * @param {string} attrs - The attrs parameter.
 * @param {string} exclude - The exclude parameter.
 * @returns {string} - Returns the result.
 */
function attrsToXmlExcludingLocal(attrs: Map<string, string>, exclude: Set<string>): string {
    const parts: string[] = [];
    const seen: Set<string> = new Set<string>();
    for (const [k, v] of attrs) {
        if (exclude.has(k)) {
            continue;
        }
        const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
        if (exclude.has(local)) {
            continue;
        }
        if (k === 'xmlns' || k.startsWith('xmlns:')) {
            continue;
        }
        if (seen.has(k)) {
            continue;
        }
        seen.add(k);
        parts.push(`${k}="${escapeXml(v)}"`);
    }
    return parts.join(' ');
}

/**
 * escapeRegExpLocal function.
 *
 * @param {string} s - The s parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExpLocal(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

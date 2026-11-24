import { DetachedObjectError, DocxError, SecurityError } from '../../core/errors/docx-error';
import { FeatureId } from '../../core/registry/feature-registry';
import { serializeFeatureRunLeaf, tryParseFeatureRunLeaf, FeatureRunLeafContent } from '../../core/registry/run-leaf-handlers';
import { DEFAULT_RESOURCE_LIMITS } from '../../core/security/limits';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { assertNever } from './assert-never';
import {
    CharacterFormat,
    CharacterFormatHost,
    CharacterFormatSnapshot,
    parseCharacterFormat
} from './character-format';
import { FeatureInline } from './feature-inline';
import { FeatureRunLeaf } from './feature-run-leaf';
import { elementChildren, isWml, textContent, wmlAttr, wmlElement, xmlSpaceIsPreserve, xmlSpacePreserve } from './wml';

// ---------------------------------------------------------------------------
// Break leaf — ECMA-376-1 §17.3.3.1–2; CT_Br / ST_BrType / ST_BrClear
// ---------------------------------------------------------------------------
/**
 * Break kind for `w:br` (`ST_BrType` plus the Line default).
 *
 * OOXML has no `@w:type="line"` value: a line break is a bare `w:br` (type omitted).
 * Text-wrapping breaks use `@w:type="textWrapping"` and are modeled as
 * {@link BreakType.TextWrappingBreak} (preferred) or as {@link BreakType.Line}
 * with a non-{@link BreakClearType.None} clear (compat authoring form).
 *
 * Citation: ECMA-376-1 §17.3.3.1–2; transitional `wml.xsd` `CT_Br` / `ST_BrType`.
 *
 * @public
 */
const BreakType: { Page: 'page'; Column: 'column'; Line: 'line'; TextWrappingBreak: 'textWrapping'; } = {
    /**
     * Page break.
     *
     * Maps to `w:br` with `@w:type="page"`. Ends the current page and continues
     * on the next page of the same section.
     */
    Page: 'page',
    /**
     * Column break.
     *
     * Maps to `w:br` with `@w:type="column"`. Ends the current column and continues
     * in the next column of a multi-column section.
     */
    Column: 'column',
    /**
     * Line break (Shift+Enter / soft break).
     *
     * Maps to a bare `w:br` with `@w:type` omitted (there is no `ST_BrType` value
     * `"line"`). When authored with a non-{@link BreakClearType.None} clear, the
     * library emits `@w:type="textWrapping"` plus `@w:clear` for compatibility
     * with the older Line+clear form.
     */
    Line: 'line',
    /**
     * Text-wrapping break.
     *
     * Maps to `w:br` with `@w:type="textWrapping"`. Optional
     * {@link BreakClearType} (default {@link BreakClearType.None}) maps to
     * `@w:clear` and controls which side of floating content the break clears.
     */
    TextWrappingBreak: 'textWrapping'
};
/**
 * Break kind for `w:br`.
 *
 * @public
 */
type BreakTypeValue = (typeof BreakType)[keyof typeof BreakType];
/**
 * Text-wrapping clear for a line or text-wrapping break (`ST_BrClear`).
 *
 * Valid with {@link BreakType.TextWrappingBreak} or {@link BreakType.Line}.
 * Default for {@link Run.appendBreak} / {@link Run.insertBreakAt} is
 * {@link BreakClearType.None}. Non-`None` values on {@link BreakType.Page} or
 * {@link BreakType.Column} throw {@link DocxError} `content/invalid-break`.
 *
 * Citation: ECMA-376-1 §17.3.3.2; transitional `wml.xsd` `ST_BrClear`.
 *
 * @public
 */
const BreakClearType: { None: 'none'; Left: 'left'; Right: 'right'; All: 'all'; } = {
    /**
     * No clear (`ST_BrClear` `none`).
     *
     * Default. Does not emit `@w:clear` on write. On load, absent `@w:clear` and
     * `@w:clear="none"` both surface as this value.
     */
    None: 'none',
    /**
     * Clear left (`@w:clear="left"`).
     *
     * Restart text after floating objects on the left.
     */
    Left: 'left',
    /**
     * Clear right (`@w:clear="right"`).
     *
     * Restart text after floating objects on the right.
     */
    Right: 'right',
    /**
     * Clear all (`@w:clear="all"`).
     *
     * Restart text after floating objects on both sides.
     */
    All: 'all'
};
/**
 * Text-wrapping clear for a wrapping break (`ST_BrClear`).
 *
 * @public
 */
type BreakClearTypeValue = (typeof BreakClearType)[keyof typeof BreakClearType];
/**
 * Options for {@link Paragraph.appendBreak} / break authoring helpers.
 *
 * @public
 */
interface AppendBreakOptions {
    /**
     * Text-wrapping clear; default {@link BreakClearType.None}.
     * Only meaningful for {@link BreakType.Line} / {@link BreakType.TextWrappingBreak}.
     */
    readonly clear?: BreakClearTypeValue;
}
/**
 * Typed public view of a break leaf (`w:br` / `CT_Br`).
 *
 * Always run content (`w:r/w:br`), never a paragraph-level sibling of `w:r`.
 * The internal {@link RunLeaf} break variant may also carry unmodeled `extras`
 * for round-trip; this view omits that bag.
 *
 * Citation: ECMA-376-1 §17.3.3.1–2; transitional `wml.xsd` `CT_Br`.
 *
 * @public
 */
interface BreakLeaf {
    /**
     * Discriminant for the break leaf in {@link Run.items} / append results.
     * Always the literal `'break'`.
     */
    readonly type: 'break';
    /**
     * Break kind (`ST_BrType` plus the Line default).
     *
     * See {@link BreakType}. Page and column emit explicit `@w:type`; line omits
     * type unless a non-`None` clear forces the text-wrapping compat form.
     */
    readonly breakType: BreakTypeValue;
    /**
     * Text-wrapping clear (`ST_BrClear`).
     *
     * Always present on the public view; default {@link BreakClearType.None}.
     * Non-`None` values are only valid with {@link BreakType.TextWrappingBreak}
     * or {@link BreakType.Line} (compat text-wrapping form).
     */
    readonly clear: BreakClearTypeValue;
}
// ---------------------------------------------------------------------------
// Run content types
// ---------------------------------------------------------------------------
/**
 * Run inner content: text, tab, break, carriage return, symbol, feature, or preserved markup.
 *
 * @public
 */
type RunLeaf = {
    readonly type: 'text';
    readonly text: string;
    readonly xmlSpacePreserve: boolean;
} | {
    readonly type: 'tab';
} | {
    /**
     * Break (`w:br` / `CT_Br`). ECMA-376-1 §17.3.3.1–2.
     * Public authoring view: {@link BreakLeaf} (no `extras` bag).
     */
    readonly type: 'break';
    readonly breakType: BreakTypeValue;
    /**
     * Present for TextWrappingBreak / Line when clear is not
     * {@link BreakClearType.None} (`left`|`right`|`all`).
     */
    readonly clear?: Exclude<BreakClearTypeValue, typeof BreakClearType.None>;
    /** Unmodeled or unknown attributes (round-trip). */
    readonly extras: ReadonlyArray<OpenXmlAttribute>;
} | {
    readonly type: 'cr';
} | {
    /** Symbol character (`w:sym`). ECMA-376-1 §17.3.3.30; `CT_Sym`. */
    readonly type: 'sym';
    /** Symbol font name (`w:font`). */
    readonly font: string;
    /**
     * Character code as `ST_ShortHexNumber` hex digits (`w:char`).
     * Source casing is preserved; malformed values stay opaque on parse.
     */
    readonly char: string;
} | {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureRunLeaf;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};
/**
 * Paragraph child: a modeled run, optional feature inline, or preserved unmodeled markup.
 *
 * @public
 */
type InlineContent = {
    readonly type: 'run';
    readonly run: Run;
} | {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureInline;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};

function needsXmlSpacePreserve(text: string): boolean {
    return text.startsWith(' ') || text.endsWith(' ') || text.includes('  ') || text.includes('\n');
}
interface RunOwner {
    assertAttached(target: Run): void;
}
/**
 * Snapshot / hydrate bag for a run: leaf content, `w:r` attributes, and
 * character-format fields (merged from {@link CharacterFormat.snapshot}).
 *
 * @private
 */
interface RunHydrateData extends CharacterFormatSnapshot {
    extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    leaves: RunLeaf[];
}
/**
 * WordprocessingML run (`w:r`).
 *
 * Character formatting lives on {@link Run.characterFormat} only
 * (the format specification Rev 2).
 *
 * @public
 */
class Run implements CharacterFormatHost {
    private owner: RunOwner | undefined;
    private extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    private leaves: RunLeaf[];
    private characterFormatField: CharacterFormat | undefined;
    /**
     * @param {RunOwner | undefined} owner - The owner.
     * @private
     */
    constructor(owner: RunOwner | undefined) {
        this.owner = owner;
        this.extraAttributes = [];
        this.leaves = [];
    }
    /**
     * Character formatting for this run (`w:rPr`). Lazily constructed; never null.
     *
     * @public
     */
    get characterFormat(): CharacterFormat {
        if (this.characterFormatField === undefined) {
            this.characterFormatField = new CharacterFormat(this);
        }
        return this.characterFormatField;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyCharacterFormatMutation(): void {
        this.mutate();
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    detach(): void {
        this.owner = undefined;
    }
    /**
     * @param {RunOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     * @private
     */
    attach(owner: RunOwner): void {
        this.owner = owner;
    }
    private mutate(): void {
        if (this.owner === undefined) {
            throw new DetachedObjectError('This run is no longer in a document');
        }
        this.owner.assertAttached(this);
    }
    /** Text, tab, break, symbol, feature, and opaque leaves in order. */
    get items(): ReadonlyArray<RunLeaf> {
        return this.leaves;
    }
    /**
     * @param {RunLeaf[]} leaves - The leaves.
     * @returns {void} Nothing is returned.
     * @private
     * Replace inner content; used by feature modules.
     */
    setLeaves(leaves: RunLeaf[]): void {
        this.mutate();
        this.leaves = leaves;
    }
    /**
     * Append a symbol character (`w:sym`) to this run.
     *
     * @param {string} font - Symbol font name (`w:font`), for example `"Wingdings"`.
     * @param {string} char - `ST_ShortHexNumber` hex digits for `w:char` (four hex digits, e.g. `"F0FC"`).
     * @returns {*} This run for chaining.
     *
     * @example
     * ```ts
     * const run = paragraph.appendRun();
     * run.appendSymbol('Wingdings', 'F0FC');
     * ```
     *
     * @public
     */
    appendSymbol(font: string, char: string): this {
        this.mutate();
        this.leaves.push({ type: 'sym', font, char });
        return this;
    }
    /**
     * Append a break (`w:br`) to this run.
     *
     * Mapping (ECMA-376-1 §17.3.3.1–2; `ST_BrType` has no `"line"` value):
     * - {@link BreakType.Page} → `@w:type="page"`
     * - {@link BreakType.Column} → `@w:type="column"`
     * - {@link BreakType.Line} with {@link BreakClearType.None} → bare `<w:br/>` (type omitted)
     * - {@link BreakType.Line} with non-`None` clear → `@w:type="textWrapping"` + `@w:clear` (compat)
     * - {@link BreakType.TextWrappingBreak} → `@w:type="textWrapping"` (+ `@w:clear` when not `None`)
     *
     * @param {BreakType} type - Break kind.
     * @param {BreakClearType} clear - Text-wrapping clear; default {@link BreakClearType.None}.
     *   Only meaningful for Line / TextWrappingBreak.
     * @returns {BreakLeaf} The break leaf view (not `this`).
     * @throws {@link DocxError} `content/invalid-break` if a non-`None` clear is set on Page or Column.
     *
     * @example
     * ```ts
     * run.appendBreak(BreakType.Page);
     * run.appendBreak(BreakType.TextWrappingBreak, BreakClearType.All);
     * run.appendBreak(BreakType.Line, BreakClearType.All); // compat form
     * ```
     *
     * @public
     */
    appendBreak(type: BreakTypeValue, clear: BreakClearTypeValue = BreakClearType.None): BreakLeaf {
        this.mutate();
        const leaf: { readonly type: 'break'; readonly breakType: 'page' | 'column' | 'line' | 'textWrapping'; readonly clear?: 'left' | 'right' | 'all'; readonly extras: ReadonlyArray<OpenXmlAttribute>; } = createBreakLeaf(type, clear);
        this.leaves.push(leaf);
        return toBreakLeafView(leaf);
    }
    /**
     * Insert a break (`w:br`) at a leaf index in this run.
     *
     * Index is the position in {@link Run.items} (`0…content.length` inclusive).
     *
     * @param {number} index - Leaf index at which to insert.
     * @param {BreakType} type - Break kind.
     * @param {BreakClearType} clear - Text-wrapping clear; default {@link BreakClearType.None}.
     *   Only meaningful for Line / TextWrappingBreak.
     * @returns {BreakLeaf} The break leaf view.
     * @throws RangeError if `index` is out of range.
     * @throws {@link DocxError} `content/invalid-break` if a non-`None` clear is set on Page or Column.
     *
     * @public
     */
    insertBreakAt(index: number, type: BreakTypeValue, clear: BreakClearTypeValue = BreakClearType.None): BreakLeaf {
        this.mutate();
        if (index < 0 || index > this.leaves.length) {
            throw new RangeError(`Break leaf index ${String(index)} is out of range`);
        }
        const leaf: { readonly type: 'break'; readonly breakType: 'page' | 'column' | 'line' | 'textWrapping'; readonly clear?: 'left' | 'right' | 'all'; readonly extras: ReadonlyArray<OpenXmlAttribute>; } = createBreakLeaf(type, clear);
        this.leaves.splice(index, 0, leaf);
        return toBreakLeafView(leaf);
    }
    /**
     * Concatenated `w:t` text. Setter replaces all run leaves with a single text leaf.
     */
    get text(): string {
        let out: string = '';
        for (const leaf of this.leaves) {
            if (leaf.type === 'text') {
                out += leaf.text;
            }
        }
        return out;
    }
    set text(value: string) {
        this.mutate();
        if (value.length > DEFAULT_RESOURCE_LIMITS.textNodeLength) {
            throw new SecurityError('security/limit-exceeded', 'w:t exceeds the text node length limit');
        }
        this.leaves = [{ type: 'text', text: value, xmlSpacePreserve: needsXmlSpacePreserve(value) }];
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     * Advanced hatch: `w:r` tree. Unstable; prefer semantic properties.
     */
    toOpenXml(): OpenXmlElement {
        return serializeRun(this);
    }
    /**
     * @param {OpenXmlElement} el - The el.
     * @param {RunOwner} owner - The owner.
     * @returns {Run} The result.
     * @private
     */
    static fromXml(el: OpenXmlElement, owner: RunOwner): Run {
        return parseRun(el, owner);
    }
    /**
     * @param {RunHydrateData} data - The data.
     * @returns {void} Nothing is returned.
     * @private
     */
    hydrate(data: RunHydrateData): void {
        this.extraAttributes = data.extraAttributes;
        this.leaves = data.leaves;
        const {
            extraAttributes: _extraAttributes,
            leaves: _leaves,
            ...characterFormatData
        } = data;
        void _extraAttributes;
        void _leaves;
        this.characterFormat.hydrate(characterFormatData);
    }
    /**
     * @returns {RunHydrateData} The result.
     * @private
     */
    snapshot(): RunHydrateData {
        const cf: CharacterFormatSnapshot = this.characterFormat.snapshot();
        return {
            extraAttributes: this.extraAttributes,
            leaves: this.leaves,
            rPrExtra: cf.rPrExtra,
            styleIdValue: cf.styleIdValue,
            boldValue: cf.boldValue,
            italicValue: cf.italicValue,
            strikeValue: cf.strikeValue,
            doubleStrikeValue: cf.doubleStrikeValue,
            vanishValue: cf.vanishValue,
            legacyHiddenValue: cf.legacyHiddenValue,
            noProofValue: cf.noProofValue,
            fontSizeValue: cf.fontSizeValue,
            fontSizeBidiValue: cf.fontSizeBidiValue,
            textColorValue: cf.textColorValue,
            textColorTheme: cf.textColorTheme,
            highlightValue: cf.highlightValue,
            shadingValue: cf.shadingValue,
            underlineStyleValue: cf.underlineStyleValue,
            underlineColorValue: cf.underlineColorValue,
            vertAlignValue: cf.vertAlignValue,
            smallCapsValue: cf.smallCapsValue,
            allCapsValue: cf.allCapsValue,
            fontsValue: cf.fontsValue,
            characterScaleValue: cf.characterScaleValue,
            kerningValue: cf.kerningValue,
            characterSpacingValue: cf.characterSpacingValue,
            positionValue: cf.positionValue,
            borderValue: cf.borderValue,
            languageValue: cf.languageValue,
            embossValue: cf.embossValue,
            imprintValue: cf.imprintValue,
            outlineValue: cf.outlineValue,
            shadowValue: cf.shadowValue,
            webHiddenValue: cf.webHiddenValue,
            bidiValue: cf.bidiValue,
            complexScriptValue: cf.complexScriptValue,
            boldBidiValue: cf.boldBidiValue,
            italicBidiValue: cf.italicBidiValue,
            emphasisValue: cf.emphasisValue,
            textEffectValue: cf.textEffectValue,
            specVanishValue: cf.specVanishValue,
            snapToGridValue: cf.snapToGridValue
        };
    }
}
// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
function parseRun(el: OpenXmlElement, owner: RunOwner): Run {
    const run: Run = new Run(owner);
    const extraAttributes: ReadonlyArray<OpenXmlAttribute> = el.attributes;
    const leaves: RunLeaf[] = [];
    let characterFormatData: CharacterFormatSnapshot | undefined;
    for (const child of elementChildren(el)) {
        if (isWml(child, 'rPr')) {
            characterFormatData = parseCharacterFormat(child);
            continue;
        }
        leaves.push(parseLeaf(child));
    }
    if (characterFormatData !== undefined) {
        run.hydrate({
            extraAttributes: extraAttributes,
            leaves: leaves,
            rPrExtra: characterFormatData.rPrExtra,
            styleIdValue: characterFormatData.styleIdValue,
            boldValue: characterFormatData.boldValue,
            italicValue: characterFormatData.italicValue,
            strikeValue: characterFormatData.strikeValue,
            doubleStrikeValue: characterFormatData.doubleStrikeValue,
            vanishValue: characterFormatData.vanishValue,
            legacyHiddenValue: characterFormatData.legacyHiddenValue,
            noProofValue: characterFormatData.noProofValue,
            fontSizeValue: characterFormatData.fontSizeValue,
            fontSizeBidiValue: characterFormatData.fontSizeBidiValue,
            textColorValue: characterFormatData.textColorValue,
            textColorTheme: characterFormatData.textColorTheme,
            highlightValue: characterFormatData.highlightValue,
            shadingValue: characterFormatData.shadingValue,
            underlineStyleValue: characterFormatData.underlineStyleValue,
            underlineColorValue: characterFormatData.underlineColorValue,
            vertAlignValue: characterFormatData.vertAlignValue,
            smallCapsValue: characterFormatData.smallCapsValue,
            allCapsValue: characterFormatData.allCapsValue,
            fontsValue: characterFormatData.fontsValue,
            characterScaleValue: characterFormatData.characterScaleValue,
            kerningValue: characterFormatData.kerningValue,
            characterSpacingValue: characterFormatData.characterSpacingValue,
            positionValue: characterFormatData.positionValue,
            borderValue: characterFormatData.borderValue,
            languageValue: characterFormatData.languageValue,
            embossValue: characterFormatData.embossValue,
            imprintValue: characterFormatData.imprintValue,
            outlineValue: characterFormatData.outlineValue,
            shadowValue: characterFormatData.shadowValue,
            webHiddenValue: characterFormatData.webHiddenValue,
            bidiValue: characterFormatData.bidiValue,
            complexScriptValue: characterFormatData.complexScriptValue,
            boldBidiValue: characterFormatData.boldBidiValue,
            italicBidiValue: characterFormatData.italicBidiValue,
            emphasisValue: characterFormatData.emphasisValue,
            textEffectValue: characterFormatData.textEffectValue,
            specVanishValue: characterFormatData.specVanishValue,
            snapToGridValue: characterFormatData.snapToGridValue
        });
    }
    else {
        run.hydrate({
            extraAttributes: extraAttributes,
            leaves: leaves,
            rPrExtra: [],
            styleIdValue: undefined,
            boldValue: undefined,
            italicValue: undefined,
            strikeValue: undefined,
            doubleStrikeValue: undefined,
            vanishValue: undefined,
            legacyHiddenValue: undefined,
            noProofValue: undefined,
            fontSizeValue: undefined,
            fontSizeBidiValue: undefined,
            textColorValue: undefined,
            textColorTheme: undefined,
            highlightValue: undefined,
            shadingValue: undefined,
            underlineStyleValue: undefined,
            underlineColorValue: undefined,
            vertAlignValue: undefined,
            smallCapsValue: undefined,
            allCapsValue: undefined,
            fontsValue: undefined,
            characterScaleValue: undefined,
            kerningValue: undefined,
            characterSpacingValue: undefined,
            positionValue: undefined,
            borderValue: undefined,
            languageValue: undefined,
            embossValue: undefined,
            imprintValue: undefined,
            outlineValue: undefined,
            shadowValue: undefined,
            webHiddenValue: undefined,
            bidiValue: undefined,
            complexScriptValue: undefined,
            boldBidiValue: undefined,
            italicBidiValue: undefined,
            emphasisValue: undefined,
            textEffectValue: undefined,
            specVanishValue: undefined,
            snapToGridValue: undefined
        });
    }
    return run;
}
function parseLeaf(child: OpenXmlElement): RunLeaf {
    if (isWml(child, 't')) {
        const text: string = textContent(child);
        return {
            type: 'text',
            text,
            xmlSpacePreserve: xmlSpaceIsPreserve(child) || needsXmlSpacePreserve(text)
        };
    }
    if (isWml(child, 'tab')) {
        return { type: 'tab' };
    }
    if (isWml(child, 'br')) {
        return parseBreakLeaf(child);
    }
    if (isWml(child, 'cr')) {
        return { type: 'cr' };
    }
    if (isWml(child, 'sym')) {
        return parseSymLeaf(child);
    }
    const feature: FeatureRunLeafContent = tryParseFeatureRunLeaf(child);
    if (feature !== undefined) {
        return { type: 'feature', featureId: feature.featureId, value: feature.value };
    }
    return { type: 'opaque', xml: child };
}
/**
 * Parse `w:br` (`CT_Br`: optional `w:type`, `w:clear`).
 * Citation: ECMA-376-1 §17.3.3.1–2; transitional `wml.xsd` `CT_Br` / `ST_BrType` / `ST_BrClear`.
 *
 * @param {OpenXmlElement} child - The child.
 * @returns {Object} The result.
 */
function parseBreakLeaf(child: OpenXmlElement): Extract<RunLeaf, { type: 'break' }> {
    let breakType: BreakTypeValue = BreakType.Line;
    let clear: Exclude<BreakClearTypeValue, typeof BreakClearType.None> | undefined;
    let knownType: boolean = false;
    let knownClear: boolean = false;
    const typeRaw: string = wmlAttrValLocal(child, 'type');
    if (typeRaw === 'page') {
        breakType = BreakType.Page;
        knownType = true;
    }
    else if (typeRaw === 'column') {
        breakType = BreakType.Column;
        knownType = true;
    }
    else if (typeRaw === 'textWrapping') {
        breakType = BreakType.TextWrappingBreak;
        knownType = true;
    }
    else if (typeRaw === undefined) {
        // Default line break — type omitted.
        knownType = true;
    }
    else if (typeRaw === 'line') {
        // Non-schema value some producers emit; treat as Line and do not re-emit type="line".
        breakType = BreakType.Line;
        knownType = true;
    }
    const clearRaw: string = wmlAttrValLocal(child, 'clear');
    if (breakType === BreakType.Line || breakType === BreakType.TextWrappingBreak) {
        if (clearRaw === 'left') {
            clear = BreakClearType.Left;
            knownClear = true;
        }
        else if (clearRaw === 'right') {
            clear = BreakClearType.Right;
            knownClear = true;
        }
        else if (clearRaw === 'all') {
            clear = BreakClearType.All;
            knownClear = true;
        }
        else if (clearRaw === 'none') {
            // Public view: BreakClearType.None. Preserve attribute in extras for round-trip.
            knownClear = false;
        }
    }
    const extras: OpenXmlAttribute[] = [];
    for (const attr of child.attributes) {
        const isWmlAttr: boolean = attr.prefix === 'w' || attr.prefix === '';
        if (isWmlAttr && attr.localName === 'type') {
            if (knownType) {
                continue;
            }
            extras.push(attr);
            continue;
        }
        if (isWmlAttr && attr.localName === 'clear') {
            if (knownClear) {
                continue;
            }
            extras.push(attr);
            continue;
        }
        extras.push(attr);
    }
    if (clear !== undefined) {
        return { type: 'break', breakType, clear, extras };
    }
    return { type: 'break', breakType, extras };
}
/**
 * Serialize break leaf. Never emits `@w:type="line"`.
 * TextWrappingBreak → `textWrapping` (+ clear when not none).
 * Line + non-none clear → `textWrapping` + clear (compat); Line alone → bare `w:br`.
 *
 * @param {Object} leaf - The leaf.
 * @returns {OpenXmlElement} The result.
 */
function serializeBreakLeaf(leaf: Extract<RunLeaf, {
    type: 'break';
}>): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (leaf.breakType === BreakType.Page) {
        attributes.push(wmlAttr('type', 'page'));
    }
    else if (leaf.breakType === BreakType.Column) {
        attributes.push(wmlAttr('type', 'column'));
    }
    else if (leaf.breakType === BreakType.TextWrappingBreak) {
        attributes.push(wmlAttr('type', 'textWrapping'));
        if (leaf.clear !== undefined) {
            attributes.push(wmlAttr('clear', leaf.clear));
        }
    }
    else if (leaf.clear !== undefined) {
        // Line + clear ⇒ textWrapping (compat authoring form); never type="line".
        attributes.push(wmlAttr('type', 'textWrapping'));
        attributes.push(wmlAttr('clear', leaf.clear));
    }
    // Line without clear: omit @w:type (default line break).
    for (const extra of leaf.extras) {
        attributes.push(extra);
    }
    return wmlElement('br', { attributes });
}
function isWrappingBreakType(type: BreakTypeValue): boolean {
    return type === BreakType.Line || type === BreakType.TextWrappingBreak;
}
function createBreakLeaf(type: BreakTypeValue, clear: BreakClearTypeValue = BreakClearType.None): Extract<RunLeaf, {
    type: 'break';
}> {
    if (clear !== BreakClearType.None && !isWrappingBreakType(type)) {
        throw new DocxError('content/invalid-break', 'w:br @w:clear is only valid with a line / text-wrapping break');
    }
    // Explicit clear tokens so TS 3.3 keeps Exclude<BreakClearType, None> (no as const narrowing).
    if (clear === BreakClearType.Left || clear === BreakClearType.Right || clear === BreakClearType.All) {
        return { type: 'break', breakType: type, clear, extras: [] };
    }
    return { type: 'break', breakType: type, extras: [] };
}
function toBreakLeafView(leaf: Extract<RunLeaf, {
    type: 'break';
}>): BreakLeaf {
    return {
        type: 'break',
        breakType: leaf.breakType,
        clear: leaf.clear != null ? leaf.clear : BreakClearType.None
    };
}
/**
 * Parse `w:sym` (`CT_Sym`: optional `w:font`, `w:char` as `ST_ShortHexNumber`).
 * Unknown attributes → opaque whole element. Missing font/char or malformed char → opaque.
 * Citation: ECMA-376-1 §17.3.3.30; transitional `wml.xsd` `CT_Sym` / `ST_ShortHexNumber`.
 *
 * @param {OpenXmlElement} child - The child.
 * @returns {RunLeaf} The result.
 */
function parseSymLeaf(child: OpenXmlElement): RunLeaf {
    for (const attr of child.attributes) {
        if (attr.localName === 'font' || attr.localName === 'char') {
            if (attr.prefix !== 'w' && attr.prefix !== '') {
                return { type: 'opaque', xml: child };
            }
            continue;
        }
        // Any other attribute (including non-wml font/char lookalikes handled above) stays opaque.
        return { type: 'opaque', xml: child };
    }
    if (child.children.length > 0) {
        return { type: 'opaque', xml: child };
    }
    const font: string = wmlAttrValLocal(child, 'font');
    const char: string = wmlAttrValLocal(child, 'char');
    if (font === undefined || char === undefined) {
        return { type: 'opaque', xml: child };
    }
    // ST_ShortHexNumber = xsd:hexBinary length 2 → exactly four hex digits.
    if (!/^[0-9A-Fa-f]{4}$/.test(char)) {
        return { type: 'opaque', xml: child };
    }
    return { type: 'sym', font, char };
}
function serializeLeaf(leaf: RunLeaf): OpenXmlElement {
    switch (leaf.type) {
    case 'text': {
        const attributes: OpenXmlAttribute[] = leaf.xmlSpacePreserve ? [xmlSpacePreserve()] : [];
        return wmlElement('t', {
            attributes,
            children: [{ kind: 'text', value: leaf.text }]
        });
    }
    case 'tab':
        return wmlElement('tab');
    case 'break':
        return serializeBreakLeaf(leaf);
    case 'cr':
        return wmlElement('cr');
    case 'sym':
        return wmlElement('sym', {
            attributes: [wmlAttr('font', leaf.font), wmlAttr('char', leaf.char)]
        });
    case 'feature':
        return serializeFeatureRunLeaf(leaf);
    case 'opaque':
        return leaf.xml;
    default:
        return assertNever(leaf, 'run leaf');
    }
}
function wmlAttrValLocal(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find(function (a: OpenXmlAttribute): boolean {
        return a.localName === localName && (a.prefix === 'w' || a.prefix === '');
    })),
    ts330 == null ? undefined : ts330.value);
}
/**
 * Serialize a run. `w:rPr` children come from {@link CharacterFormat.buildRPrChildren}
 * (Spec §7.2 order).
 *
 * @param {Run} run - The run.
 * @returns {OpenXmlElement} The result.
 */
function serializeRun(run: Run): OpenXmlElement {
    const snap: RunHydrateData = run.snapshot();
    const rPrChildren: OpenXmlElement[] = run.characterFormat.buildRPrChildren();
    const children: OpenXmlElement[] = [];
    if (rPrChildren.length > 0) {
        children.push(wmlElement('rPr', { children: rPrChildren }));
    }
    for (const leaf of snap.leaves) {
        children.push(serializeLeaf(leaf));
    }
    return wmlElement('r', { attributes: snap.extraAttributes, children });
}

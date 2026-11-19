import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { buildGradientFill, buildSolidFill, GradientFillError } from '../shapes/write-gradient-fill';
import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { TextGradientDecoration, decorationNamespace, commitDecorationFill, decorationGradient,
    commitCharacterGlyphFill } from '../shapes/mutate-decoration-fill';
import { TextCharacterFills, readTextCharacterFills } from './character-fills';
/**
 * DrawingML character formatting (`CT_TextCharacterProperties` on `a:rPr` / `a:defRPr`).
 *
 * @remarks
 * **Direct properties only** — values as authored on the bound character-properties
 * element. Does not resolve inheritance from layout, master, list style, or theme.
 * Scheme colour references under `solidFill` / `highlight` are preserved on read and
 * never rewritten as `srgbClr` merely because a property was observed.
 *
 * Citation: Transitional `dml-main.xsd` `CT_TextCharacterProperties` (~2907–2944),
 * `CT_TextFont` (`latin`/`@typeface`), `CT_Color` (`highlight`), `ST_TextFontSize`,
 * `ST_Percentage` (`@baseline`).
 */
import { asMutable, findChild, getAttr, MutableOoxmlElement } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { partNameOptions, ShapeTextError } from '../shapes/errors';
import { tryParseColorChoiceChild, tryParseSolidFillColor } from '../theme/parse-color-choice';
import { OoxmlAttribute, OoxmlElement } from '../xml/index';
import { arrayAt, arraySet } from '../util/es5-compat';
import { isTextCapsType, isTextStrikeType, isTextUnderlineType, TextCapsTypeValue, TextStrikeTypeValue,
    TextUnderlineTypeValue } from './font-types';
import { ColorValue } from '../theme/color-value';
import { OoxmlText } from '../xml/dom';
/**
 * Host that supplies the live `CT_TextCharacterProperties` element (`a:rPr` or `a:defRPr`).
 *
 * @remarks
 * `ensureCharProps` creates the element on first write (and any required parents such as
 * `a:pPr`). `tryGetCharProps` returns `undefined` when nothing is authored yet so getters
 * stay sparse.
 *
 * @internal
 */
export interface FontHost {
    /** Owning DrawingML dialect, available before create-on-write. */
    readonly drawingNamespace?: string;
    /** Part name for diagnostics when mutations fail validation. */
    readonly partName: string | undefined;
    /** Optional dirty / digital-signature hook after a successful mutation. */
    readonly onMutate: (() => void) | undefined;
    /** Existing character properties, if present. */
    tryGetCharProps(): OoxmlElement | undefined;
    /** Ensure and return mutable character properties (create-on-write). */
    ensureCharProps(): OoxmlElement;
}
/** Office-common superscript baseline (`ST_Percentage` decimal = 30%). */
const SUPERSCRIPT_BASELINE: string = '30000';
/** Office-common subscript baseline (`ST_Percentage` decimal = −25%). */
const SUBSCRIPT_BASELINE: string = '-25000';
/**
 * `ST_TextFontSize` min/max (hundredths of a point).
 * Citation: `dml-main.xsd` `ST_TextFontSize` 100–400000.
 */
const FONT_SIZE_HUNDREDTHS_MIN: number = 100;
const FONT_SIZE_HUNDREDTHS_MAX: number = 400000;
/**
 * Relative schema order for children under `CT_TextCharacterProperties`.
 * Unknown local names sort after known ones so they are preserved at the end of
 * their relative group when inserting known siblings.
 *
 * Citation: `dml-main.xsd` `CT_TextCharacterProperties` sequence.
 */
const CHAR_PROPS_CHILD_ORDER: Readonly<Record<string, number>> = Object.freeze({
    ln: 10,
    // EG_FillProperties
    noFill: 20,
    solidFill: 20,
    gradFill: 20,
    blipFill: 20,
    pattFill: 20,
    grpFill: 20,
    // EG_EffectProperties
    effectLst: 30,
    effectDag: 30,
    highlight: 40,
    // EG_TextUnderlineLine
    uLnTx: 50,
    uLn: 50,
    // EG_TextUnderlineFill
    uFillTx: 60,
    uFill: 60,
    latin: 70,
    ea: 80,
    cs: 90,
    sym: 100,
    hlinkClick: 110,
    hlinkMouseOver: 120,
    rtl: 130,
    extLst: 140
});
/**
 * Character-level font formatting bound to one `a:rPr` or `a:defRPr` host.
 *
 * @remarks
 * Obtain via {@link TextPart.font} or {@link Paragraph.font}. All properties are
 * **direct**; missing attributes/children read as `undefined` / `false` as documented
 * per property. Setting a property create-on-writes the host character-properties
 * element without stripping unknown siblings.
 *
 * @public
 */
export class Font {
    private readonly host: FontHost;
    /**
     * @internal
     * @param {FontHost} host - Binding to the live `CT_TextCharacterProperties` carrier.
     */
    constructor(host: FontHost) {
        this.host = host;
    }
    /**
     * Replaces direct glyph paint with a validated authored gradient.
     *
     * @param {GradientFillOptions} options - Source colors, ordered stops and geometry; no RGB flattening.
     * @returns {void} Commits after validation, preserving decorations/highlight/links.
     * @throws {GradientFillError} Invalid options or unsupported character host, before create-on-write.
     * @example run.font.setGradientFill({ stops: [
     * { position: 0, color: { kind: 'scheme', val: 'accent1' } },
     * { position: 1, color: { kind: 'srgb', val: 'FFFFFF' } }] });
     */
    setGradientFill(options: GradientFillOptions): void {
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        const ns: string = this.glyphNamespace(existing);
        let fill: OoxmlElement = buildGradientFill(options, ns, this.host.partName);
        const properties: OoxmlElement = existing || this.host.ensureCharProps();
        const actual: string = this.glyphNamespace(properties);
        if (actual !== ns) { fill = buildGradientFill(options, actual, this.host.partName); }
        if (commitCharacterGlyphFill(properties, fill, this.host.partName) && this.host.onMutate) { this.host.onMutate(); }
    }
    /**
     * Replaces direct glyph paint with an authored solid color choice.
     *
     * @param {ColorValue} color - Source color; scheme/system values are not flattened to RGB.
     * @returns {void} Validates before create-on-write and preserves independent character formatting.
     * @throws Invalid color or unsupported character host.
     */
    setSolidFill(color: ColorValue): void {
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        const ns: string = this.glyphNamespace(existing);
        let fill: OoxmlElement = buildSolidFill(color, ns, this.host.partName);
        const properties: OoxmlElement = existing || this.host.ensureCharProps();
        const actual: string = this.glyphNamespace(properties);
        if (actual !== ns) { fill = buildSolidFill(color, actual, this.host.partName); }
        if (commitCharacterGlyphFill(properties, fill, this.host.partName) && this.host.onMutate) { this.host.onMutate(); }
    }
    /**
     * Writes explicit noFill for glyphs while preserving independent decorations.
     *
     * @returns {void} Suppresses inherited glyph ink without clearing highlight.
     */
    setNoFill(): void {
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        this.glyphNamespace(existing);
        const properties: OoxmlElement = existing || this.host.ensureCharProps();
        const fill: OoxmlElement = { kind: 'element', namespaceUri: this.glyphNamespace(properties),
            localName: 'noFill', prefixHint: 'a', attributes: [], children: [] };
        if (commitCharacterGlyphFill(properties, fill, this.host.partName) && this.host.onMutate) { this.host.onMutate(); }
    }
    /**
     * Removes direct glyph paint to restore inheritance, unlike explicit noFill.
     *
     * @returns {void} Missing fill is a no-op and creates no character properties.
     */
    clearFill(): void {
        const properties: OoxmlElement | undefined = this.host.tryGetCharProps(); this.glyphNamespace(properties);
        if (properties && commitCharacterGlyphFill(properties, undefined, this.host.partName) && this.host.onMutate) {
            this.host.onMutate();
        }
    }
    /**
     * Edits only existing direct glyph-gradient stops, preserving other source markup.
     *
     * @returns {GradientStopEditor} Stable-ID stop session; dispose when done.
     * @throws {GradientFillError} Missing direct gradient or invalid/stale host.
     */
    editGradientFill(): GradientStopEditor {
        this.glyphNamespace(this.host.tryGetCharProps());
        return new GradientStopEditor((): OoxmlElement | undefined => {
            const properties: OoxmlElement | undefined = this.host.tryGetCharProps();
            return properties ? findChild(properties, this.glyphNamespace(properties), 'gradFill') : undefined;
        }, this.host.partName, (): void => { if (this.host.onMutate) { this.host.onMutate(); } });
    }
    /**
     * @param {OoxmlElement | undefined} properties - Existing character properties, if any.
     * @returns {string} Exact owning DrawingML dialect, without creating XML.
     */
    private glyphNamespace(properties: OoxmlElement | undefined): string {
        if (properties) { return decorationNamespace(properties, 'outline', this.host.partName); }
        const ns: string = this.host.drawingNamespace || DML_NS;
        if (getGradientDrawingNamespace(ns) !== ns) { throw new GradientFillError(this.host.partName, 'glyph.host'); }
        return ns;
    }
    /**
     * Replaces one decoration's fill with a validated gradient, preserving glyphs and line metadata.
     *
     * @param {TextGradientDecoration} target - Outline, underline fill or underline outline.
     * @param {GradientFillOptions} options - Validated replacement stops and geometry.
     * @returns {void} Commits after validation, then notifies the owning document.
     * @throws Invalid gradient or unsupported target.
     */
    setDecorationGradientFill(target: TextGradientDecoration, options: GradientFillOptions): void {
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        const ns: string = this.decorationNs(target, existing);
        let fill: OoxmlElement = buildGradientFill(options, ns, this.host.partName);
        const properties: OoxmlElement = existing || this.host.ensureCharProps();
        const actual: string = decorationNamespace(properties, target, this.host.partName);
        if (actual !== ns) { fill = buildGradientFill(options, actual, this.host.partName); }
        if (commitDecorationFill(properties, target, fill, this.host.partName) && this.host.onMutate) { this.host.onMutate(); }
    }
    /**
     * Resets one decoration's fill without removing line width, dash, joins or markers.
     *
     * @param {TextGradientDecoration} target - Independent decoration lane.
     * @returns {void} Missing direct fill is a no-op; never creates character properties.
     */
    clearDecorationFill(target: TextGradientDecoration): void {
        const properties: OoxmlElement | undefined = this.host.tryGetCharProps();
        this.decorationNs(target, properties);
        if (properties && commitDecorationFill(properties, target, undefined, this.host.partName) && this.host.onMutate) {
            this.host.onMutate();
        }
    }
    /**
     * Makes an underline carrier explicitly follow the resolved glyph formatting.
     *
     * @param {string} target - Underline fill or underline outline; glyph outline is not a follow-text choice.
     * @returns {void} Replaces the exclusive underline carrier choice.
     * @throws Invalid target.
     */
    setDecorationFollowText(target: 'underline-fill' | 'underline-outline'): void {
        if (target !== 'underline-fill' && target !== 'underline-outline') { throw new GradientFillError(this.host.partName, 'decoration.followText'); }
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        this.decorationNs(target, existing);
        const properties: OoxmlElement = existing || this.host.ensureCharProps();
        if (commitDecorationFill(properties, target, undefined, this.host.partName, true) && this.host.onMutate) { this.host.onMutate(); }
    }
    /**
     * Opens a selective stop session on this decoration's existing direct gradient.
     *
     * @param {TextGradientDecoration} target - Independent decoration lane.
     * @returns {GradientStopEditor} Stale-checked editing session; dispose after use.
     * @throws Missing gradient or unsupported target.
     */
    editDecorationGradientFill(target: TextGradientDecoration): GradientStopEditor {
        this.decorationNs(target, this.host.tryGetCharProps());
        return new GradientStopEditor((): OoxmlElement | undefined => decorationGradient(this.host.tryGetCharProps(), target),
                                      this.host.partName, (): void => { if (this.host.onMutate) { this.host.onMutate(); } });
    }
    /**
     * @param {TextGradientDecoration} target - Requested decoration lane.
     * @param {OoxmlElement | undefined} properties - Optional current carrier.
     * @returns {string} Known existing dialect or create-on-write provisional dialect.
     */
    private decorationNs(target: TextGradientDecoration, properties: OoxmlElement | undefined): string {
        if (['outline', 'underline-fill', 'underline-outline'].indexOf(target) < 0) { throw new GradientFillError(this.host.partName, 'decoration.host'); }
        if (properties !== undefined) { return decorationNamespace(properties, target, this.host.partName); }
        const ns: string = this.host.drawingNamespace === undefined ? DML_NS : this.host.drawingNamespace;
        if (getGradientDrawingNamespace(ns) !== ns) { throw new GradientFillError(this.host.partName, 'decoration.host'); }
        return ns;
    }
    /**
     * Complete direct glyph/outline/underline fill data, separate from color/highlight.
     *
     * @remarks Missing, explicit noFill and follow-text stay distinct. Scheme colors,
     * sparse gradients and ordered transforms are not flattened or written back.
     * @returns {TextCharacterFills} Clone-safe authored values; does not create character XML.
     * @example const directGlyph = run.font.characterFills.glyphFill;
     */
    get characterFills(): TextCharacterFills {
        return readTextCharacterFills(this.host.tryGetCharProps(), this.host.partName);
    }

    /**
     * Bold (`@b` / `xsd:boolean`).
     *
     * @remarks Missing attribute → `false` (not inherited). Write emits `"1"` / `"0"`.
     * @returns {boolean} The result.
     */
    get bold(): boolean {
        return readOptionalBoolean(this.host.tryGetCharProps(), 'b') === true;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set bold(value: boolean) {
        this.writeBooleanAttr('b', value);
    }
    /**
     * Italic (`@i` / `xsd:boolean`).
     *
     * @remarks Missing attribute → `false` (not inherited). Write emits `"1"` / `"0"`.
     * @returns {boolean} The result.
     */
    get italic(): boolean {
        return readOptionalBoolean(this.host.tryGetCharProps(), 'i') === true;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set italic(value: boolean) {
        this.writeBooleanAttr('i', value);
    }
    /**
     * Font size in typographic **points** (`@sz` is hundredths of a point).
     *
     * @remarks Getter returns `undefined` when `@sz` is absent. Setter stores `Math.round(points * 100)` and validates `ST_TextFontSize` (1–4000 pt → 100–400000). Passing `undefined` removes `@sz`.
     * @throws {ShapeTextError} When the size is outside the schema range or not finite.
     * @returns {number | undefined} The result.
     */
    get fontSize(): number | undefined {
        const raw: string = getAttrOptional(this.host.tryGetCharProps(), 'sz');
        if (raw === undefined || !/^-?\d+$/u.test(raw)) {
            return undefined;
        }
        return Number(raw) / 100;
    }
    /**
     *
     * @param {number | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set fontSize(value: number | undefined) {
        if (value === undefined) {
            this.removeAttr('sz');
            return;
        }
        if (!Number.isFinite(value)) {
            throw new ShapeTextError('fontSize must be a finite number of points', partNameOptions(this.host.partName));
        }
        const hundredths: number = Math.round(value * 100);
        if (hundredths < FONT_SIZE_HUNDREDTHS_MIN || hundredths > FONT_SIZE_HUNDREDTHS_MAX) {
            throw new ShapeTextError(`fontSize must be between ${FONT_SIZE_HUNDREDTHS_MIN / 100} and ${FONT_SIZE_HUNDREDTHS_MAX / 100} points (ST_TextFontSize)`, partNameOptions(this.host.partName));
        }
        this.setAttr('sz', String(hundredths));
    }
    /**
     * Latin typeface name (`a:latin` / `CT_TextFont` `@typeface`).
     *
     * @remarks Does not rewrite `a:ea` / `a:cs` / `a:sym`. Missing `latin` → `undefined`. Empty string or `undefined` removes `a:latin`
     * while preserving other font children.
     * @returns {string | undefined} The result.
     */
    get fontName(): string | undefined {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return undefined;
        }
        const latin: OoxmlElement = findChild(charProps, DML_NS, 'latin');
        if (latin === undefined) {
            return undefined;
        }
        return getAttr(latin, '', 'typeface');
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set fontName(value: string | undefined) {
        if (value === undefined || value.length === 0) {
            this.removeChildLocalName('latin');
            if (this.host.onMutate != null) {
                this.host.onMutate();
            }
            return;
        }
        const charProps: OoxmlElement = this.host.ensureCharProps();
        let latin: OoxmlElement = findChild(charProps, DML_NS, 'latin');
        if (latin === undefined) {
            latin = dmlEl('latin', [attr('typeface', value)], []);
            insertCharPropsChild(charProps, latin);
        }
        else {
            setElementAttr(latin, 'typeface', value);
        }
        if (this.host.onMutate != null) {
            this.host.onMutate();
        }
    }
    /**
     * Direct solid sRGB text colour as canonical `#RRGGBB`.
     *
     * @remarks Getter returns a string only when `a:solidFill/a:srgbClr` is present. Scheme, preset,
         system, and other colour choices are **not** converted to RGB (returns `undefined`) so theme references stay intact on later save. Setter accepts `RRGGBB` or `#RRGGBB` (any hex case) and writes `a:solidFill/a:srgbClr/@val`. `undefined` removes the fill group members owned by this API (`solidFill` only — other fill kinds under EG_FillProperties are left alone unless a solid write replaces them).
     * @throws {ShapeTextError} When the colour string is not six hex digits.
     * @returns {string | undefined} The result.
     */
    get color(): string | undefined {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return undefined;
        }
        const color: ColorValue = tryParseSolidFillColor(charProps);
        if (color === undefined || color.kind !== 'srgb') {
            return undefined;
        }
        return canonicalizeSrgbHex(color.val);
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set color(value: string | undefined) {
        const existing: OoxmlElement | undefined = this.host.tryGetCharProps();
        if (value === undefined) {
            if (!existing) { return; }
            const ns: string = this.glyphNamespace(existing);
            const mutable: MutableOoxmlElement = asMutable(existing);
            const next: (OoxmlElement | OoxmlText)[] = mutable.children.filter((child: OoxmlElement | OoxmlText): boolean =>
                !(child.kind === 'element' && child.namespaceUri === ns && child.localName === 'solidFill'));
            if (next.length !== mutable.children.length) {
                mutable.children = next; if (this.host.onMutate) { this.host.onMutate(); }
            }
            return;
        }
        const hex: string = parseAuthorSrgbHex(value, this.host.partName);
        this.setSolidFill({ kind: 'srgb', val: hex });
    }
    /**
     * Underline style (`@u` / `ST_TextUnderlineType`).
     *
     * @remarks Missing → `undefined`. Setter requires a {@link TextUnderlineType} token; `undefined` removes `@u`.
     * @throws {ShapeTextError} When the value is not a known underline token.
     * @returns {TextUnderlineTypeValue | undefined} The result.
     */
    get underline(): TextUnderlineTypeValue | undefined {
        const raw: string = getAttrOptional(this.host.tryGetCharProps(), 'u');
        if (raw === undefined || !isTextUnderlineType(raw)) {
            return undefined;
        }
        return raw;
    }
    /**
     *
     * @param {TextUnderlineTypeValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set underline(value: TextUnderlineTypeValue | undefined) {
        if (value === undefined) {
            this.removeAttr('u');
            return;
        }
        if (!isTextUnderlineType(value)) {
            throw new ShapeTextError(`underline must be a TextUnderlineType token (got "${String(value)}")`,
                                     partNameOptions(this.host.partName));
        }
        this.setAttr('u', value);
    }
    /**
     * Direct underline fill colour as canonical `#RRGGBB` when sRGB.
     *
     * @remarks Maps to the `EG_TextUnderlineFill` group under `CT_TextCharacterProperties` (citation: Transitional `dml-main.xsd`). The OOXML short-codes (`uFill` / `uFillTx`) stay below the surface (API-RULES R1.4). Getter returns a string only when `a:uFill/a:solidFill/a:srgbClr` is present. `a:uFillTx` ("follow text") and non-sRGB underline fill choices (scheme / system / preset / scrgb / hsl) return `undefined` without conversion so theme references stay intact on later save. Setter writes `a:uFill/a:solidFill/a:srgbClr` and removes any existing `a:uFill` / `a:uFillTx` first (schema: `EG_TextUnderlineFill` is a choice of one). `undefined` removes the underline-fill group members owned by this API (`uFill` and `uFillTx`). Colours are authored as `RRGGBB` or `#RRGGBB` CSS hex (API-RULES R1.4). Citation: Transitional `dml-main.xsd` `EG_TextUnderlineFill` (`uFillTx` | `uFill` → `CT_TextUnderlineFillGroupWrapper` → `EG_FillProperties`), `CT_TextCharacterProperties` child sequence.
     * @throws {ShapeTextError} When the colour string is not six hex digits.
     * @returns {string | undefined} The result.
     */
    get underlineColor(): string | undefined {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return undefined;
        }
        const uFill: OoxmlElement = findChild(charProps, DML_NS, 'uFill');
        if (uFill === undefined) {
            return undefined;
        }
        const solidFill: OoxmlElement = findChild(uFill, DML_NS, 'solidFill');
        if (solidFill === undefined) {
            return undefined;
        }
        const color: ColorValue = tryParseColorChoiceChild(solidFill);
        if (color === undefined || color.kind !== 'srgb') {
            return undefined;
        }
        return canonicalizeSrgbHex(color.val);
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set underlineColor(value: string | undefined) {
        if (value === undefined) {
            this.removeChildLocalName('uFill');
            this.removeChildLocalName('uFillTx');
            if (this.host.onMutate != null) {
                this.host.onMutate();
            }
            return;
        }
        const hex: string = parseAuthorSrgbHex(value, this.host.partName);
        const charProps: OoxmlElement = this.host.ensureCharProps();
        // EG_TextUnderlineFill is a choice of one — clear prior uFill/uFillTx.
        this.removeChildLocalName('uFill');
        this.removeChildLocalName('uFillTx');
        const srgb: OoxmlElement = dmlEl('srgbClr', [attr('val', hex)], []);
        const solidFill: OoxmlElement = dmlEl('solidFill', [], [srgb]);
        const uFill: OoxmlElement = dmlEl('uFill', [], [solidFill]);
        insertCharPropsChild(charProps, uFill);
        if (this.host.onMutate != null) {
            this.host.onMutate();
        }
    }
    /**
     * Strike-through style (`@strike` / `ST_TextStrikeType`).
     *
     * @remarks Missing → `undefined`. `undefined` on set removes `@strike`.
     * @throws {ShapeTextError} When the value is not a known strike token.
     * @returns {TextStrikeTypeValue | undefined} The result.
     */
    get strikeType(): TextStrikeTypeValue | undefined {
        const raw: string = getAttrOptional(this.host.tryGetCharProps(), 'strike');
        if (raw === undefined || !isTextStrikeType(raw)) {
            return undefined;
        }
        return raw;
    }
    /**
     *
     * @param {TextStrikeTypeValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set strikeType(value: TextStrikeTypeValue | undefined) {
        if (value === undefined) {
            this.removeAttr('strike');
            return;
        }
        if (!isTextStrikeType(value)) {
            throw new ShapeTextError(`strikeType must be a TextStrikeType token (got "${String(value)}")`,
                                     partNameOptions(this.host.partName));
        }
        this.setAttr('strike', value);
    }
    /**
     * Capitalization (`@cap` / `ST_TextCapsType`).
     *
     * @remarks XSD default is `none` when the attribute is omitted; the getter returns `undefined` when absent so callers can distinguish “not authored” from an explicit `TextCapsType.None`.
     * @throws {ShapeTextError} When the value is not a known caps token.
     * @returns {TextCapsTypeValue | undefined} The result.
     */
    get capsType(): TextCapsTypeValue | undefined {
        const raw: string = getAttrOptional(this.host.tryGetCharProps(), 'cap');
        if (raw === undefined || !isTextCapsType(raw)) {
            return undefined;
        }
        return raw;
    }
    /**
     *
     * @param {TextCapsTypeValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set capsType(value: TextCapsTypeValue | undefined) {
        if (value === undefined) {
            this.removeAttr('cap');
            return;
        }
        if (!isTextCapsType(value)) {
            throw new ShapeTextError(`capsType must be a TextCapsType token (got "${String(value)}")`,
                                     partNameOptions(this.host.partName));
        }
        this.setAttr('cap', value);
    }
    /**
     * Superscript (`@baseline` positive `ST_Percentage`).
     *
     * @remarks Getter is `true` when baseline percentage is strictly greater than zero. Setter `true` writes Office-common `30000` (30%)
     * and clears a prior subscript. Setter `false` removes `@baseline` when it was positive (or zero). Mutually exclusive with {@link
     * Font.subscript}.
     * @returns {boolean} The result.
     */
    get superscript(): boolean {
        const n: number = readBaselinePercent(this.host.tryGetCharProps());
        return n !== undefined && n > 0;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set superscript(value: boolean) {
        if (value) {
            this.setAttr('baseline', SUPERSCRIPT_BASELINE);
            return;
        }
        const n: number = readBaselinePercent(this.host.tryGetCharProps());
        if (n === undefined || n > 0 || n === 0) {
            this.removeAttr('baseline');
        }
    }
    /**
     * Subscript (`@baseline` negative `ST_Percentage`).
     *
     * @remarks Getter is `true` when baseline percentage is strictly less than zero. Setter `true` writes Office-common `-25000` (−25%) and
     * clears a prior superscript. Setter `false` removes `@baseline` when it was negative. Mutually exclusive with {@link
     * Font.superscript}.
     * @returns {boolean} The result.
     */
    get subscript(): boolean {
        const n: number = readBaselinePercent(this.host.tryGetCharProps());
        return n !== undefined && n < 0;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set subscript(value: boolean) {
        if (value) {
            this.setAttr('baseline', SUBSCRIPT_BASELINE);
            return;
        }
        const n: number = readBaselinePercent(this.host.tryGetCharProps());
        if (n !== undefined && n < 0) {
            this.removeAttr('baseline');
        }
    }
    /**
     * Language id (`@lang` / `s:ST_Lang`, e.g. `en-US`).
     *
     * @remarks Missing → `undefined`. Empty / `undefined` removes `@lang`.
     * @returns {string | undefined} The result.
     */
    get languageID(): string | undefined {
        return getAttrOptional(this.host.tryGetCharProps(), 'lang');
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set languageID(value: string | undefined) {
        if (value === undefined || value.length === 0) {
            this.removeAttr('lang');
            return;
        }
        this.setAttr('lang', value);
    }
    /**
     * Highlight colour (`a:highlight` / `CT_Color`) as canonical `#RRGGBB` when sRGB.
     *
     * @remarks DrawingML highlight is a full colour choice, **not** WordprocessingML `w:highlight` / `ST_HighlightColor`. Non-sRGB choices return `undefined` without conversion. Setter writes `a:highlight/a:srgbClr`; `undefined` removes `highlight`. Citation: `dml-main.xsd` `CT_TextCharacterProperties` / `highlight` type `CT_Color`.
     * @throws {ShapeTextError} When the colour string is not six hex digits.
     * @returns {string | undefined} The result.
     */
    get highlightColor(): string | undefined {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return undefined;
        }
        const highlight: OoxmlElement = findChild(charProps, DML_NS, 'highlight');
        if (highlight === undefined) {
            return undefined;
        }
        const color: ColorValue = tryParseColorChoiceChild(highlight);
        if (color === undefined || color.kind !== 'srgb') {
            return undefined;
        }
        return canonicalizeSrgbHex(color.val);
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set highlightColor(value: string | undefined) {
        if (value === undefined) {
            this.removeChildLocalName('highlight');
            if (this.host.onMutate != null) {
                this.host.onMutate();
            }
            return;
        }
        const hex: string = parseAuthorSrgbHex(value, this.host.partName);
        const charProps: OoxmlElement = this.host.ensureCharProps();
        this.removeChildLocalName('highlight');
        const srgb: OoxmlElement = dmlEl('srgbClr', [attr('val', hex)], []);
        const highlight: OoxmlElement = dmlEl('highlight', [], [srgb]);
        insertCharPropsChild(charProps, highlight);
        if (this.host.onMutate != null) {
            this.host.onMutate();
        }
    }
    /**
     *
     * @param {string} localName - The localName value.
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    private writeBooleanAttr(localName: string, value: boolean): void {
        this.setAttr(localName, value ? '1' : '0');
    }
    /**
     *
     * @param {string} localName - The localName value.
     * @param {string} value - The value value.
     * @returns {void} Nothing.
     */
    private setAttr(localName: string, value: string): void {
        const charProps: OoxmlElement = this.host.ensureCharProps();
        setElementAttr(charProps, localName, value);
        if (this.host.onMutate != null) {
            this.host.onMutate();
        }
    }
    /**
     *
     * @param {string} localName - The localName value.
     * @returns {void} Nothing.
     */
    private removeAttr(localName: string): void {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return;
        }
        removeElementAttr(charProps, localName);
        if (this.host.onMutate != null) {
            this.host.onMutate();
        }
    }
    /**
     *
     * @param {string} localName - The localName value.
     * @returns {void} Nothing.
     */
    private removeChildLocalName(localName: string): void {
        const charProps: OoxmlElement = this.host.tryGetCharProps();
        if (charProps === undefined) {
            return;
        }
        const mutable: MutableOoxmlElement = asMutable(charProps);
        const next: Array<OoxmlElement | OoxmlText> = mutable.children.filter((c: OoxmlElement | OoxmlText) => !(c.kind === 'element' &&
            c.namespaceUri === DML_NS && c.localName === localName));
        if (next.length !== mutable.children.length) {
            mutable.children = next;
        }
    }
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
function getAttrOptional(el: OoxmlElement | undefined, localName: string): string | undefined {
    if (el === undefined) {
        return undefined;
    }
    return getAttr(el, '', localName);
}
/**
 * Parses xsd:boolean attribute tokens used by Office (`1`/`0`/`true`/`false`).
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {boolean | undefined} The result.
 */
function readOptionalBoolean(el: OoxmlElement | undefined, localName: string): boolean | undefined {
    const raw: string = getAttrOptional(el, localName);
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
 * Reads `@baseline` as a percentage in thousandths-of-percent (ST_PercentageDecimal),
 * or from a trailing-`%` form (`30%` → 30000).
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @returns {number | undefined} The result.
 */
function readBaselinePercent(el: OoxmlElement | undefined): number | undefined {
    const raw: string = getAttrOptional(el, 'baseline');
    if (raw === undefined) {
        return undefined;
    }
    // Manual parse only — no regex (security/detect-unsafe-regex).
    if (raw.charAt(raw.length - 1) === '%') {
        const n: number | undefined = parseOptionalSignedNumber(raw.slice(0, -1));
        return n === undefined ? undefined : Math.round(n * 1000);
    }
    return parseOptionalSignedInteger(raw);
}
/**
 * Parses an optional signed integer string without regex.
 *
 * @param {string} s - Raw digits string.
 * @returns {number | undefined} Parsed integer or undefined.
 */
function parseOptionalSignedInteger(s: string): number | undefined {
    if (s.length === 0) {
        return undefined;
    }
    let i: number = 0;
    if (s.charAt(0) === '-') {
        i = 1;
        if (s.length === 1) {
            return undefined;
        }
    }
    for (; i < s.length; i++) {
        const c: number = s.charCodeAt(i);
        if (c < 48 || c > 57) {
            return undefined;
        }
    }
    return Number(s);
}
/**
 * Parses an optional signed decimal number string without regex.
 *
 * @param {string} s - Raw number string.
 * @returns {number | undefined} Parsed number or undefined.
 */
function parseOptionalSignedNumber(s: string): number | undefined {
    if (s.length === 0) {
        return undefined;
    }
    let i: number = 0;
    if (s.charAt(0) === '-') {
        i = 1;
        if (s.length === 1) {
            return undefined;
        }
    }
    let sawDigit: boolean = false;
    let sawDot: boolean = false;
    for (; i < s.length; i++) {
        const c: number = s.charCodeAt(i);
        if (c >= 48 && c <= 57) {
            sawDigit = true;
            continue;
        }
        if (c === 46 && !sawDot) {
            sawDot = true;
            continue;
        }
        return undefined;
    }
    return sawDigit ? Number(s) : undefined;
}
/**
 *
 * @param {string} val - The val value.
 * @returns {string | undefined} The result.
 */
function canonicalizeSrgbHex(val: string): string | undefined {
    const m: RegExpExecArray = /^#?([0-9A-Fa-f]{6})$/u.exec(val.trim());
    if (m === null || m[1] === undefined) {
        return undefined;
    }
    return `#${m[1].toUpperCase()}`;
}
/**
 *
 * @param {string} value - The value value.
 * @param {string | undefined} partName - The partName value.
 * @returns {string} The result.
 */
function parseAuthorSrgbHex(value: string, partName: string | undefined): string {
    const canonical: string = canonicalizeSrgbHex(value);
    if (canonical === undefined) {
        throw new ShapeTextError(`color must be RRGGBB or #RRGGBB (got "${value}")`, partNameOptions(partName));
    }
    // Wire form without '#'.
    return canonical.slice(1);
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @returns {void} Nothing.
 */
function setElementAttr(el: OoxmlElement, localName: string, value: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const attrs: Array<OoxmlAttribute> = mutable.attributes.slice();
    const idx: number = attrs.findIndex((a: OoxmlAttribute) => a.namespaceUri === '' && a.localName === localName);
    const next: OoxmlAttribute = { namespaceUri: '', localName, value };
    if (idx === -1) {
        attrs.push(next);
    }
    else {
        arraySet(attrs, idx, next);
    }
    mutable.attributes = attrs;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {void} Nothing.
 */
function removeElementAttr(el: OoxmlElement, localName: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const next: Array<OoxmlAttribute> = mutable.attributes.filter((a: OoxmlAttribute) => !(a.namespaceUri === '' &&
        a.localName === localName));
    if (next.length !== mutable.attributes.length) {
        mutable.attributes = next;
    }
}
/**
 *
 * @param {OoxmlElement} charProps - The charProps value.
 * @param {OoxmlElement} child - The child value.
 * @returns {void} Nothing.
 */
function insertCharPropsChild(charProps: OoxmlElement, child: OoxmlElement): void {
    const mutable: MutableOoxmlElement = asMutable(charProps);
    const order: number = (CHAR_PROPS_CHILD_ORDER[child.localName] !== null &&
        CHAR_PROPS_CHILD_ORDER[child.localName] !== undefined ? CHAR_PROPS_CHILD_ORDER[child.localName] : 1000);
    let insertAt: number = mutable.children.length;
    for (let i: number = 0; i < mutable.children.length; i++) {
        const existing: OoxmlElement | OoxmlText = arrayAt(mutable.children, i);
        if (existing === undefined || existing.kind !== 'element' || existing.namespaceUri !== DML_NS) {
            continue;
        }
        const existingOrder: number = (CHAR_PROPS_CHILD_ORDER[existing.localName] !== null &&
            CHAR_PROPS_CHILD_ORDER[existing.localName] !== undefined ? CHAR_PROPS_CHILD_ORDER[existing.localName] : 1000);
        if (existingOrder > order) {
            insertAt = i;
            break;
        }
    }
    mutable.children.splice(insertAt, 0, child);
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
 * @param {string} localName - The localName value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function dmlEl(localName: string, attributes: ReadonlyArray<OoxmlAttribute>, children: ReadonlyArray<OoxmlElement>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName,
        attributes,
        children,
        prefixHint: 'a'
    };
}

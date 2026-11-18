/**
 * DrawingML paragraph (`a:p` / `CT_TextParagraph`) — direct text parts only.
 */
import { asMutable, findChild, getAttr, MutableOoxmlElement } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { partNameOptions, ShapeTextError } from '../shapes/errors';
import { PackageLimitError } from '../security/errors';
import { DEFAULT_SECURITY_LIMITS, SecurityLimits } from '../security/limits';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
import { Font } from './font';
import { FontHost } from './font';
import { arrayAt, arraySet } from '../util/es5-compat';
import {
    HorizontalAlignmentTypeValue,
    isHorizontalAlignmentType,
    isTextSpacingType,
    TextSpacingType,
    TextSpacingValue,
    TextSpacingTypeValue
} from './paragraph-format-types';
import { ListFormat } from './list-format';
import { PictureMediaAccess } from '../pictures/media-access';
import { TextPart } from './text-part';
import { createTextPartCollection, TextPartCollection } from './text-part-collection';
import { TextTabStop } from './text-layout-types';

/**
 * UTF-8 byte length of a string (for {@link SecurityLimits.textNodeLengthBytes}).
 *
 * @param {string} text - The text value.
 * @returns {number} The result.
 */
function utf8ByteLength(text: string): number {
    return new TextEncoder().encode(text).byteLength;
}
/**
 * A text paragraph (`a:p` / `CT_TextParagraph`) with direct text parts.
 *
 * @remarks
 * Only regular runs (`a:r`) are exposed as {@link TextPart}. Line breaks (`a:br`) and
 * fields (`a:fld`) remain in the DOM and are not rewritten by text-part edits.
 *
 * Default run character properties for the paragraph are exposed via
 * {@link Paragraph.font} on `a:pPr` / `a:defRPr`.
 */
export class Paragraph {
    private paragraph: OoxmlElement;
    private partName: string | undefined;
    private limits: SecurityLimits;
    /** Optional mutation hook forwarded to text parts. */
    private onMutate: (() => void) | undefined;
    /** Slide media access for picture bullets. */
    private media: PictureMediaAccess | undefined;
    private fontInstance: Font | undefined;
    /** Cached end-paragraph `a:endParaRPr` {@link Font} instance. */
    private endParagraphFontInstance: Font | undefined;
    /** Cached {@link TextPartCollection} proxy bound to this paragraph. */
    private textPartsCollection: TextPartCollection | undefined;
    /** Cached direct list formatting for `a:pPr`. */
    private listFormatInstance: ListFormat | undefined;
    /**
     * Creates a paragraph.
     *
     * Two construction modes are supported:
     *
     * - **Public (detached):** `new Paragraph()` builds a standalone, empty `a:p`
     *   (`CT_TextParagraph`; all children optional). The instance is **not** attached
     *   to any text body until it is passed to {@link ParagraphCollection.add}. Text
     *   parts and `font` edits made before attachment are buffered on the standalone
     *   element and grafted on attach.
     * - **Internal (live):** `new Paragraph(paragraph, limits, partName?, onMutate?)`
     *   binds to a live `a:p` element of the slide DOM (used by the read surface and
     *   {@link TextBody.addParagraph}).
     *
     * @remarks Detached UI matches API-RULES R1.5 / R5.1 ("every node is constructible detached"). The detached element is grafted into a live `txBody` by {@link ParagraphCollection.add}.
     * @example ```ts import { Paragraph, TextPart } from '@syncfusion/ej2-pptx'; const paragraph = new Paragraph();
     * paragraph.textParts.add(new TextPart('Hello')); (shape.textBody == null ? undefined : shape.textBody.paragraphs).add(paragraph); ```
     */
    constructor();
    /**
     *
     * @param {OoxmlElement} paragraph - The paragraph value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     */
    constructor(paragraph: OoxmlElement, limits: SecurityLimits, partName?: string, onMutate?: () => void,
                media?: PictureMediaAccess);
    /**
     *
     * @param {OoxmlElement} paragraph - The paragraph value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     * @param {PictureMediaAccess} media - The media value.
     */
    constructor(paragraph?: OoxmlElement, limits: SecurityLimits = DEFAULT_SECURITY_LIMITS, partName?: string,
                onMutate?: () => void, media?: PictureMediaAccess) {
        if (paragraph === undefined) {
            this.paragraph = dmlEl('p', [], []);
        }
        else {
            this.paragraph = paragraph;
        }
        this.limits = limits;
        this.partName = partName;
        this.onMutate = onMutate;
        this.media = media;
    }
    /**
     * Direct text parts (`a:r` regular runs) in document order, with an append
     * mutation surface.
     *
     * @remarks Reading returns a {@link TextPartCollection} over the live `a:r` children of this paragraph (re-evaluated on access; `a:br`
     * and `a:fld` are skipped). Use {@link TextPartCollection.add} to append a constructed {@link TextPart}, or {@link
     * Paragraph.addTextPart} for the single-statement quick path. Index access (`paragraph.textParts[i]`), `length`, and iteration behave
     * like the underlying readonly array (R3.1 / R5.5).
     * @returns {TextPartCollection} The result.
     */
    get textParts(): TextPartCollection {
        if (this.textPartsCollection === undefined) {
            this.textPartsCollection = createTextPartCollection(() => this.collectTextParts(),
                                                                (textPart: TextPart) => this.addTextPartNode(textPart));
        }
        return this.textPartsCollection;
    }
    /**
     * Alias of {@link Paragraph.textParts} (run-oriented API name).
     *
     * @returns {TextPartCollection} The result.
     */
    get runs(): TextPartCollection {
        return this.textParts;
    }
    /**
     *
     * @returns {*} The result.
     */
    private collectTextParts(): ReadonlyArray<TextPart> {
        const result: TextPart[] = [];
        for (let i: number = 0; i < this.paragraph.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(this.paragraph.children, i);
            if (child.kind === 'element' && child.namespaceUri === this.paragraph.namespaceUri && child.localName === 'r') {
                result.push(new TextPart(child, this.limits, this.partName, this.onMutate));
            }

        }
        return result;
    }
    /**
     * Direct default character formatting for this paragraph (`a:pPr` / `a:defRPr`).
     *
     * @remarks Maps to `CT_TextParagraphProperties` / `defRPr` (`CT_TextCharacterProperties`). Create-on-write ensures `a:pPr` as the first
     * child of `a:p` (schema sequence) and inserts `a:defRPr` immediately before `a:extLst` when that extension list is present; otherwise
     * appends `defRPr` as the last child of `pPr`. These are **paragraph default** direct properties, not resolved inheritance from
     * layout/master/theme. Per-run overrides live on {@link TextPart.font}. Citation: Transitional `dml-main.xsd` `CT_TextParagraph`
     * (`pPr?` first); `CT_TextParagraphProperties` (`defRPr` before `extLst`).
     * @returns {Font} The result.
     */
    get font(): Font {
        if (this.fontInstance === undefined) {
            const partName: string = this.partName;
            const onMutate: () => void = this.onMutate;
            const paragraph: OoxmlElement = this.paragraph;
            const host: FontHost = {
                partName,
                drawingNamespace: paragraph.namespaceUri,
                onMutate,
                /**
                 *
                 * @returns {OoxmlElement | undefined} The result.
                 */
                tryGetCharProps(): OoxmlElement | undefined {
                    const pPr: OoxmlElement = findChild(paragraph, paragraph.namespaceUri, 'pPr');
                    if (pPr === undefined) {
                        return undefined;
                    }
                    return findChild(pPr, paragraph.namespaceUri, 'defRPr');
                },
                /**
                 *
                 * @returns {OoxmlElement} The result.
                 */
                ensureCharProps(): OoxmlElement {
                    let pPr: OoxmlElement = findChild(paragraph, paragraph.namespaceUri, 'pPr');
                    if (pPr === undefined) {
                        pPr = dmlEl('pPr', [], [], paragraph.namespaceUri);
                        const mutableP: MutableOoxmlElement = asMutable(paragraph);
                        // CT_TextParagraph: pPr is the first child when present.
                        mutableP.children.unshift(pPr);
                    }
                    const existing: OoxmlElement = findChild(pPr, paragraph.namespaceUri, 'defRPr');
                    if (existing !== undefined) {
                        return existing;
                    }
                    const defRPr: OoxmlElement = dmlEl('defRPr', [], [], paragraph.namespaceUri);
                    const mutablePPr: MutableOoxmlElement = asMutable(pPr);
                    // CT_TextParagraphProperties: defRPr immediately before extLst.
                    const extIdx: number = mutablePPr.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
                        c.namespaceUri === paragraph.namespaceUri && c.localName === 'extLst');
                    if (extIdx === -1) {
                        mutablePPr.children.push(defRPr);
                    }
                    else {
                        mutablePPr.children.splice(extIdx, 0, defRPr);
                    }
                    return defRPr;
                }
            };
            this.fontInstance = new Font(host);
        }
        return this.fontInstance;
    }
    /**
     * Horizontal alignment of this paragraph (`a:pPr` `@algn` / `ST_TextAlignType`).
     *
     * @remarks Getter returns the **direct** value on `a:pPr@algn` (`undefined` when the attribute is absent; the schema default `l` is **not** resolved here). Set with a {@link HorizontalAlignmentType} token; pass `undefined` to remove the attribute. Setting an invalid token throws {@link ShapeTextError}. Citation: Transitional `dml-main.xsd` `CT_TextParagraphProperties` `@algn` (`ST_TextAlignType`: `l` | `ctr` | `r` | `just` | `justLow` | `dist` | `thaiDist`).
     * @example ```ts paragraph.horizontalAlignment = HorizontalAlignmentType.Center; ```
     * @returns {HorizontalAlignmentTypeValue | undefined} The result.
     */
    get horizontalAlignment(): HorizontalAlignmentTypeValue | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        const raw: string = getAttr(pPr, '', 'algn');
        if (raw === undefined) {
            return undefined;
        }
        return isHorizontalAlignmentType(raw) ? raw : undefined;
    }
    /**
     *
     * @param {HorizontalAlignmentTypeValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set horizontalAlignment(value: HorizontalAlignmentTypeValue | undefined) {
        if (value === undefined) {
            const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
            if (pPr === undefined) {
                return;
            }
            removeElementAttr(pPr, 'algn');
            if (this.onMutate != null) {
                this.onMutate();
            }
            return;
        }
        if (!isHorizontalAlignmentType(value)) {
            throw new ShapeTextError(`horizontalAlignment must be a HorizontalAlignmentType token (got "${value}")`,
                                     partNameOptions(this.partName));
        }
        const pPr: OoxmlElement = this.ensurePPr();
        setElementAttr(pPr, 'algn', value);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Direct paragraph list level (`a:pPr@lvl`), without inheritance.
     *
     * @returns {number | undefined} Zero-based level when directly authored.
     */
    get listFormat(): ListFormat {
        if (this.listFormatInstance === undefined) {
            const paragraph: Paragraph = this;
            this.listFormatInstance = new ListFormat(() => paragraph.ensurePPr(),
                                                     () => findChild(paragraph.paragraph, DML_NS, 'pPr'),
                                                     paragraph.partName, paragraph.onMutate,
                                                     () => paragraph.media, paragraph.limits);
        }
        return this.listFormatInstance;
    }
    get indentLevelNumber(): number | undefined {
        return this.level;
    }
    set indentLevelNumber(value: number | undefined) {
        if (value === undefined || typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 8) {
            throw new ShapeTextError('indentLevelNumber must be an integer in [0, 8]', partNameOptions(this.partName));
        }
        const pPr: OoxmlElement = this.ensurePPr();
        setElementAttr(pPr, 'lvl', String(value));
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    get level(): number | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        const raw: string = getAttr(pPr, '', 'lvl');
        const value: number = Number(raw);
        return raw !== undefined && Number.isInteger(value) && value >= 0 && value <= 8 ? value : undefined;
    }

    /**
     * Direct ordered tab stops (`a:pPr/a:tabLst/a:tab`) in points.
     *
     * @returns {ReadonlyArray<TextTabStop>} Direct tab stops in document order.
     */
    get tabStops(): ReadonlyArray<TextTabStop> {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        const tabList: OoxmlElement = pPr === undefined ? undefined : findChild(pPr, DML_NS, 'tabLst');
        if (tabList === undefined) {
            return [];
        }
        const result: TextTabStop[] = [];
        for (let i: number = 0; i < tabList.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(tabList.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== DML_NS || child.localName !== 'tab') {
                continue;
            }
            const rawPosition: string = getAttr(child, '', 'pos');
            const position: number = Number(rawPosition);
            if (rawPosition === undefined || !Number.isFinite(position)) {
                continue;
            }
            const rawAlignment: string = getAttr(child, '', 'algn');
            const alignment: TextTabStop['alignment'] = rawAlignment === 'l' || rawAlignment === 'ctr' ||
                rawAlignment === 'r' || rawAlignment === 'dec' ? rawAlignment : undefined;
            result.push({ position: position / 12700, alignment });
        }
        return result;
    }
    /**
     * First-line indent of this paragraph in typographic **points**
     * (`a:pPr` `@indent` / `ST_TextIndent`).
     *
     * @remarks The library converts points → EMU at the boundary (`1 pt = 12,700 EMU`). Getter returns the **direct** value on
     * `a:pPr@indent` converted back to points (`undefined` when absent). The schema range is `[-51,206,400, 51,206,400]` EMU (±4,024 pt);
     * out-of-range values throw {@link ShapeTextError}. Negative indents (hanging indents) are permitted. Citation: Transitional
     * `dml-main.xsd` `CT_TextParagraphProperties` `@indent` (`ST_TextIndent` restricts `ST_Coordinate32Unqualified` to `[-51,206,400,
     * 51,206,400]` EMU).
     * @returns {number | undefined} The result.
     */
    get firstLineIndent(): number | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        const raw: string = getAttr(pPr, '', 'indent');
        return parseIndentEmu(raw, this.partName);
    }
    /**
     *
     * @param {number | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set firstLineIndent(value: number | undefined) {
        if (value === undefined) {
            throw new TypeError('Paragraph.firstLineIndent: value is required');
        }
        const emu: number = pointsToIndentEmu('firstLineIndent', value, this.partName);
        const pPr: OoxmlElement = this.ensurePPr();
        setElementAttr(pPr, 'indent', String(emu));
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Left margin (indent) of this paragraph in typographic **points**
     * (`a:pPr` `@marL` / `ST_TextMargin`).
     *
     * @remarks The library converts points → EMU at the boundary (`1 pt = 12,700 EMU`). Getter returns the **direct** value on `a:pPr@marL`
     * converted back to points (`undefined` when absent). The schema range is `[0, 51,206,400]` EMU (`[0, 4,024]` pt); out-of-range or
     * negative values throw {@link ShapeTextError}. Citation: Transitional `dml-main.xsd` `CT_TextParagraphProperties` `@marL`
     * (`ST_TextMargin` restricts `ST_Coordinate32Unqualified` to `[0, 51,206,400]` EMU).
     * @returns {number | undefined} The result.
     */
    get leftIndent(): number | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        const raw: string = getAttr(pPr, '', 'marL');
        return parseMarginEmu(raw, this.partName);
    }
    /**
     *
     * @param {number | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set leftIndent(value: number | undefined) {
        if (value === undefined) {
            throw new TypeError('Paragraph.leftIndent: value is required');
        }
        const emu: number = pointsToMarginEmu('leftIndent', value, this.partName);
        const pPr: OoxmlElement = this.ensurePPr();
        setElementAttr(pPr, 'marL', String(emu));
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Line spacing for this paragraph (`a:pPr` / `a:lnSpc` / `CT_TextSpacing`).
     *
     * @remarks Getter returns the **direct** `CT_TextSpacing` value (`undefined` when `a:lnSpc` is absent). Does not resolve layout/master/theme inheritance or schema defaults. Setter accepts {@link TextSpacingValue}: - `type: 'points'` → `a:spcPts@val = round(points * 100)` (`ST_TextSpacingPoint` `[0, 158400]` → public `[0, 1584]` pt) - `type: 'percent'` → `a:spcPct@val = round(percent * 1000)` (`ST_TextSpacingPercent` / `ST_PercentageDecimal` `[0, 13200000]` → public `[0, 13200]` percent) Exactly one of `spcPts` | `spcPct` is written (schema choice). Setting `undefined` removes `a:lnSpc` and leaves the rest of `a:pPr` intact. Citations: Transitional `dml-main.xsd` `CT_TextParagraphProperties` sequence (`lnSpc?` first spacing child); `CT_TextSpacing`; ECMA-376-1 §21.1.2.2.5 `lnSpc`, §21.1.2.2.11–12 `spcPct` / `spcPts`.
     * @example ```ts paragraph.lineSpacing = { type: TextSpacingType.Points, value: 18 }; paragraph.lineSpacing = { type:
     * TextSpacingType.Percent, value: 90 }; paragraph.lineSpacing = undefined; ```
     * @returns {TextSpacingValue | undefined} The result.
     */
    get lineSpacing(): TextSpacingValue | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        return readTextSpacing(pPr, 'lnSpc', this.partName);
    }
    /**
     *
     * @param {TextSpacingValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set lineSpacing(value: TextSpacingValue | undefined) {
        if (value === undefined) {
            const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
            if (pPr === undefined) {
                return;
            }
            writeTextSpacing(pPr, 'lnSpc', undefined, this.partName);
            if (this.onMutate != null) {
                this.onMutate();
            }
            return;
        }
        const pPr: OoxmlElement = this.ensurePPr();
        writeTextSpacing(pPr, 'lnSpc', value, this.partName);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Space before this paragraph (`a:pPr` / `a:spcBef` / `CT_TextSpacing`).
     *
     * @remarks Same direct-only {@link TextSpacingValue} surface as {@link Paragraph.lineSpacing}. Independent of `lineSpacing` and `spaceAfter`. Citations: Transitional `dml-main.xsd` `CT_TextParagraphProperties` (`spcBef?` after `lnSpc?`); ECMA-376-1 §21.1.2.2.10 `spcBef`.
     * @example ```ts paragraph.spaceBefore = { type: TextSpacingType.Points, value: 6 }; ```
     * @returns {TextSpacingValue | undefined} The result.
     */
    get spaceBefore(): TextSpacingValue | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        return readTextSpacing(pPr, 'spcBef', this.partName);
    }
    /**
     *
     * @param {TextSpacingValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set spaceBefore(value: TextSpacingValue | undefined) {
        if (value === undefined) {
            const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
            if (pPr === undefined) {
                return;
            }
            writeTextSpacing(pPr, 'spcBef', undefined, this.partName);
            if (this.onMutate != null) {
                this.onMutate();
            }
            return;
        }
        const pPr: OoxmlElement = this.ensurePPr();
        writeTextSpacing(pPr, 'spcBef', value, this.partName);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Space after this paragraph (`a:pPr` / `a:spcAft` / `CT_TextSpacing`).
     *
     * @remarks Same direct-only {@link TextSpacingValue} surface as {@link Paragraph.lineSpacing}. Independent of `lineSpacing` and `spaceBefore`. Citations: Transitional `dml-main.xsd` `CT_TextParagraphProperties` (`spcAft?` after `spcBef?`); ECMA-376-1 §21.1.2.2.9 `spcAft`.
     * @example ```ts paragraph.spaceAfter = { type: TextSpacingType.Percent, value: 100 }; ```
     * @returns {TextSpacingValue | undefined} The result.
     */
    get spaceAfter(): TextSpacingValue | undefined {
        const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (pPr === undefined) {
            return undefined;
        }
        return readTextSpacing(pPr, 'spcAft', this.partName);
    }
    /**
     *
     * @param {TextSpacingValue | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set spaceAfter(value: TextSpacingValue | undefined) {
        if (value === undefined) {
            const pPr: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
            if (pPr === undefined) {
                return;
            }
            writeTextSpacing(pPr, 'spcAft', undefined, this.partName);
            if (this.onMutate != null) {
                this.onMutate();
            }
            return;
        }
        const pPr: OoxmlElement = this.ensurePPr();
        writeTextSpacing(pPr, 'spcAft', value, this.partName);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Character formatting that applies to the end-of-paragraph marker
     * (`a:endParaRPr` / `CT_TextCharacterProperties`).
     *
     * @remarks Per the `CT_TextParagraph` sequence, `endParaRPr` is the **last** child of `a:p` (after any runs). {@link Paragraph.font} writes the paragraph *default* run properties (`a:pPr/a:defRPr`); this surface writes the end-paragraph run properties, which Office uses to format the implicit paragraph-end marker. Create-on-write ensures `a:endParaRPr` is appended as the last child of `a:p` (after any existing runs / `a:br` / `a:fld`). These are **direct** properties only; inheritance is not resolved. Citation: Transitional `dml-main.xsd` `CT_TextParagraph` (`pPr?`, run group, `endParaRPr?`); `CT_TextCharacterProperties` (`a:endParaRPr` carries the same character-property surface as `a:rPr`).
     * @example ```ts paragraph.endParagraphFont.fontName = 'Arial'; ```
     * @returns {Font} The result.
     */
    get endParagraphFont(): Font {
        if (this.endParagraphFontInstance === undefined) {
            const partName: string = this.partName;
            const onMutate: () => void = this.onMutate;
            const paragraph: OoxmlElement = this.paragraph;
            const host: FontHost = {
                partName,
                drawingNamespace: paragraph.namespaceUri,
                onMutate,
                /**
                 *
                 * @returns {OoxmlElement | undefined} The result.
                 */
                tryGetCharProps(): OoxmlElement | undefined {
                    return findChild(paragraph, paragraph.namespaceUri, 'endParaRPr');
                },
                /**
                 *
                 * @returns {OoxmlElement} The result.
                 */
                ensureCharProps(): OoxmlElement {
                    const existing: OoxmlElement = findChild(paragraph, paragraph.namespaceUri, 'endParaRPr');
                    if (existing !== undefined) {
                        return existing;
                    }
                    const endParaRPr: OoxmlElement = dmlEl('endParaRPr', [], [], paragraph.namespaceUri);
                    // CT_TextParagraph: endParaRPr is the last child (after the run group).
                    const mutableP: MutableOoxmlElement = asMutable(paragraph);
                    mutableP.children.push(endParaRPr);
                    return endParaRPr;
                }
            };
            this.endParagraphFontInstance = new Font(host);
        }
        return this.endParagraphFontInstance;
    }
    /**
     * Ensures `a:pPr` exists as the first child of this `a:p` and returns it.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TextParagraph` — `pPr` is the first child when present. Existing children (runs /
     * `endParaRPr`) are shifted after the new `a:pPr`; their relative order is preserved.
     * @returns {OoxmlElement} The result.
     */
    private ensurePPr(): OoxmlElement {
        const existing: OoxmlElement = findChild(this.paragraph, DML_NS, 'pPr');
        if (existing !== undefined) {
            return existing;
        }
        const pPr: OoxmlElement = dmlEl('pPr', [], []);
        const mutableP: MutableOoxmlElement = asMutable(this.paragraph);
        mutableP.children.unshift(pPr);
        return pPr;
    }
    /**
     * Appends a regular text run (`a:r` / `CT_RegularTextRun`) and returns its handle.
     *
     * @throws {Error} When `text` exceeds `textNodeLengthBytes`.
     * @remarks Emits Office-family defaults on `a:rPr`: `lang="en-US"` and `dirty="0"`. Citations: - `dml-main.xsd` `CT_RegularTextRun` —
     * optional `rPr`, required `t` - `dml-main.xsd` `EG_TextRun` — `r` | `br` | `fld` - `dml-main.xsd` `CT_TextParagraph` — runs before
     * optional `endParaRPr` - `dml-main.xsd` `CT_TextCharacterProperties` — `@lang`, `@dirty` Insertion is before any existing
     * `a:endParaRPr` so schema order is preserved. Existing `a:br` / `a:fld` siblings are left untouched. Syncfusion-style alias:
     * `AddTextPart(string text)`.
     * @param {string} text - Initial `a:t` character content (may be empty).
     * @returns {TextPart} Live {@link TextPart} bound to the new `a:r`.
     */
    addTextPart(text: string = ''): TextPart {
        const byteLen: number = utf8ByteLength(text);
        if (byteLen > this.limits.textNodeLengthBytes) {
            throw new PackageLimitError('textNodeLengthBytes', this.partName === undefined
                ? { actual: byteLen }
                : { partName: this.partName, actual: byteLen });
        }
        // Match add-text-box authoring form: rPr lang/dirty + required a:t.
        const rPr: OoxmlElement = dmlEl('rPr', [attr('lang', 'en-US'), attr('dirty', '0')], []);
        const textNode: OoxmlText = { kind: 'text', text };
        const t: OoxmlElement = dmlEl('t', [], [textNode]);
        const r: OoxmlElement = dmlEl('r', [], [rPr, t]);
        const mutable: MutableOoxmlElement = asMutable(this.paragraph);
        const endIdx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' && c.namespaceUri === DML_NS &&
            c.localName === 'endParaRPr');
        if (endIdx === -1) {
            mutable.children.push(r);
        }
        else {
            mutable.children.splice(endIdx, 0, r);
        }
        if (this.onMutate != null) {
            this.onMutate();
        }
        return new TextPart(r, this.limits, this.partName, this.onMutate);
    }
    /**
     * Grafts a detached {@link TextPart} (typically `new TextPart(text)`) into this
     * paragraph and returns a live handle bound to the parent's limits / part name
     * mutation hook.
     *
     * Used by {@link TextPartCollection.add}. The detached `a:r` element held by the
     * incoming {@link TextPart} is inserted before any existing `a:endParaRPr` (so
     * `CT_TextParagraph` schema order is preserved; existing `a:br` / `a:fld`
     * siblings stay where they are).
     *
     * @internal
     * @param {TextPart} textPart - The textPart value.
     * @returns {TextPart} The same {@link TextPart} instance, re-bound to the live paragraph.
     */
    addTextPartNode(textPart: TextPart): TextPart {
        const runElement: OoxmlElement = textPart.getElement();
        const mutable: MutableOoxmlElement = asMutable(this.paragraph);
        const endIdx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' && c.namespaceUri === DML_NS &&
            c.localName === 'endParaRPr');
        if (endIdx === -1) {
            mutable.children.push(runElement);
        }
        else {
            mutable.children.splice(endIdx, 0, runElement);
        }
        textPart.bindTo(this.limits, this.partName, this.onMutate);
        if (this.onMutate != null) {
            this.onMutate();
        }
        return textPart;
    }
    /**
     * Re-binds this paragraph to its (now-live) `a:p` element with the parent text
     * body's limits / part name / mutation hook.
     *
     * @remarks Called by {@link ParagraphCollection.add} after a detached {@link Paragraph} is grafted into a live `txBody`. Recursively re-binds any {@link TextPart} handles cached against the detached element is the caller's responsibility (collections are eagerly re-walked, so cached handles are discarded on next read).
     * @internal
     * @param {SecurityLimits} limits - The limits value.
     * @param {string | undefined} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     * @returns {void} Nothing.
     */
    bindTo(limits: SecurityLimits, partName: string | undefined, onMutate: (() => void) | undefined,
           media?: PictureMediaAccess): void {
        this.limits = limits;
        this.partName = partName;
        this.onMutate = onMutate;
        this.media = media;
        this.fontInstance = undefined;
        this.endParagraphFontInstance = undefined;
        this.textPartsCollection = undefined;
        this.listFormatInstance = undefined;
    }
    /**
     * Live `a:p` element for internal readers (collection helpers).
     *
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getElement(): OoxmlElement {
        return this.paragraph;
    }
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
 * @param {string} namespaceUri - Owning DrawingML dialect.
 * @returns {OoxmlElement} The result.
 */
function dmlEl(localName: string, attributes: ReadonlyArray<OoxmlAttribute>,
               children: ReadonlyArray<OoxmlElement['children'][number]>, namespaceUri: string = DML_NS): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint: 'a'
    };
}
/**
 * EMU per typographic point (exact: `1 pt = 12,700 EMU`).
 *
 * Citation: `[MS-OI29500]` / engineering-reference-pack — `12,700 EMU per point`.
 */
const EMU_PER_POINT: number = 12700;
/**
 * `ST_TextMargin` / `ST_TextIndent` inclusive bounds in EMU.
 *
 * Citation: Transitional `dml-main.xsd` — `ST_TextMargin` `[0, 51,206,400]`;
 * `ST_TextIndent` `[-51,206,400, 51,206,400]`.
 */
const TEXT_MARGIN_EMU_MAX: number = 51206400;
const TEXT_INDENT_EMU_MIN: -51206400 = -51206400;
const TEXT_INDENT_EMU_MAX: number = 51206400;
/**
 * `ST_TextSpacingPoint` wire units per typographic point (`spcPts@val`).
 *
 * Citation: ECMA-376-1 §21.1.2.2.12 — “100 is equal to 1 point font”.
 * XSD: Transitional `dml-main.xsd` `ST_TextSpacingPoint` minInclusive 0,
 * maxInclusive 158400.
 */
const SPACING_PTS_PER_POINT: number = 100;
const ST_TEXT_SPACING_POINT_MIN: number = 0;
const ST_TEXT_SPACING_POINT_MAX: number = 158400;
/** Public points range for spacing = wire / 100 → `[0, 1584]`. */
const SPACING_POINTS_PUBLIC_MAX: number = ST_TEXT_SPACING_POINT_MAX / SPACING_PTS_PER_POINT;
/**
 * `ST_PercentageDecimal` units per public percent (`spcPct@val`).
 *
 * Citation: shared `ST_PercentageDecimal` = thousandths of a percent;
 * `ST_TextSpacingPercent` minInclusive 0, maxInclusive 13200000.
 * Template `val="90000"` ↔ 90%.
 */
const SPACING_PCT_PER_PERCENT: number = 1000;
const ST_TEXT_SPACING_PERCENT_MIN: number = 0;
const ST_TEXT_SPACING_PERCENT_MAX: number = 13200000;
/** Public percent range for spacing = wire / 1000 → `[0, 13200]`. */
const SPACING_PERCENT_PUBLIC_MAX: number = ST_TEXT_SPACING_PERCENT_MAX / SPACING_PCT_PER_PERCENT;
/**
 * `CT_TextParagraphProperties` sequence positions for spacing children.
 * Later siblings (bullets, tabLst, defRPr, extLst, unknowns) stay after these.
 */
const SPACING_CHILD_ORDER: ReadonlyArray<'lnSpc' | 'spcBef' | 'spcAft'> = ['lnSpc', 'spcBef', 'spcAft'];
/**
 * Sets / replaces a no-namespace attribute on an element (mutation view).
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
 * Removes a no-namespace attribute from an element (mutation view).
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
 * Parses an `ST_TextIndent` (EMU) attribute into points, validating the schema range.
 *
 * @param {string | undefined} raw - The raw value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number | undefined} The result.
 */
function parseIndentEmu(raw: string | undefined, partName: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/u.test(raw)) {
        return undefined;
    }
    const emu: number = Number(raw);
    if (emu < TEXT_INDENT_EMU_MIN || emu > TEXT_INDENT_EMU_MAX) {
        throw new ShapeTextError(`firstLineIndent attribute is outside ST_TextIndent range (got ${emu} EMU)`, partNameOptions(partName));
    }
    return emu / EMU_PER_POINT;
}
/**
 * Parses an `ST_TextMargin` (EMU) attribute into points, validating the schema range.
 *
 * @param {string | undefined} raw - The raw value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number | undefined} The result.
 */
function parseMarginEmu(raw: string | undefined, partName: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/u.test(raw)) {
        return undefined;
    }
    const emu: number = Number(raw);
    if (emu < 0 || emu > TEXT_MARGIN_EMU_MAX) {
        throw new ShapeTextError(`leftIndent attribute is outside ST_TextMargin range (got ${emu} EMU)`, partNameOptions(partName));
    }
    return emu / EMU_PER_POINT;
}
/**
 * Converts indent points → EMU, validating `ST_TextIndent` range and finiteness.
 *
 * @param {string} label - The label value.
 * @param {number} points - The points value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number} The result.
 */
function pointsToIndentEmu(label: string, points: number, partName: string | undefined): number {
    if (!Number.isFinite(points)) {
        throw new ShapeTextError(`${label} must be a finite number of points`, partNameOptions(partName));
    }
    const emu: number = Math.round(points * EMU_PER_POINT);
    if (emu < TEXT_INDENT_EMU_MIN || emu > TEXT_INDENT_EMU_MAX) {
        throw new ShapeTextError(`${label} must be between ${TEXT_INDENT_EMU_MIN / EMU_PER_POINT} and ${TEXT_INDENT_EMU_MAX / EMU_PER_POINT} points (ST_TextIndent)`, partNameOptions(partName));
    }
    return emu;
}
/**
 * Converts margin points → EMU, validating `ST_TextMargin` range (≥ 0) and finiteness.
 *
 * @param {string} label - The label value.
 * @param {number} points - The points value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number} The result.
 */
function pointsToMarginEmu(label: string, points: number, partName: string | undefined): number {
    if (!Number.isFinite(points)) {
        throw new ShapeTextError(`${label} must be a finite number of points`, partNameOptions(partName));
    }
    const emu: number = Math.round(points * EMU_PER_POINT);
    if (emu < 0 || emu > TEXT_MARGIN_EMU_MAX) {
        throw new ShapeTextError(`${label} must be between 0 and ${TEXT_MARGIN_EMU_MAX / EMU_PER_POINT} points (ST_TextMargin)`,
                                 partNameOptions(partName));
    }
    return emu;
}
/**
 * Reads direct `CT_TextSpacing` under `a:pPr` (`lnSpc` | `spcBef` | `spcAft`).
 *
 * @remarks Accepts integer `ST_PercentageDecimal` and trailing-`%` `ST_Percentage` forms on `a:spcPct@val` (union
 * `ST_TextSpacingPercentOrPercentString`). Writers always emit the integer decimal form.
 * @param {OoxmlElement} pPr - The pPr value.
 * @param {*} localName - The localName value.
 * @param {string | undefined} partName - The partName value.
 * @returns {TextSpacingValue | undefined} The result.
 */
function readTextSpacing(pPr: OoxmlElement, localName: 'lnSpc' | 'spcBef' | 'spcAft',
                         partName: string | undefined): TextSpacingValue | undefined {
    const spacingEl: OoxmlElement = findChild(pPr, DML_NS, localName);
    if (spacingEl === undefined) {
        return undefined;
    }
    const pts: OoxmlElement = findChild(spacingEl, DML_NS, 'spcPts');
    if (pts !== undefined) {
        const raw: string = getAttr(pts, '', 'val');
        if (raw === undefined || !/^-?\d+$/u.test(raw)) {
            throw new ShapeTextError(`${localName}/spcPts@val must be an integer ST_TextSpacingPoint (got "${raw === undefined ? '' : raw}")`, partNameOptions(partName));
        }
        const wire: number = Number(raw);
        if (wire < ST_TEXT_SPACING_POINT_MIN || wire > ST_TEXT_SPACING_POINT_MAX) {
            throw new ShapeTextError(`${localName}/spcPts@val is outside ST_TextSpacingPoint range [0, 158400] (got ${wire})`,
                                     partNameOptions(partName));
        }
        return { type: TextSpacingType.Points, value: wire / SPACING_PTS_PER_POINT };
    }
    const pct: OoxmlElement = findChild(spacingEl, DML_NS, 'spcPct');
    if (pct !== undefined) {
        const raw: string = getAttr(pct, '', 'val');
        if (raw === undefined) {
            throw new ShapeTextError(`${localName}/spcPct@val is required`, partNameOptions(partName));
        }
        const wire: number = parseSpacingPercentWire(raw, localName, partName);
        if (wire < ST_TEXT_SPACING_PERCENT_MIN || wire > ST_TEXT_SPACING_PERCENT_MAX) {
            throw new ShapeTextError(`${localName}/spcPct@val is outside ST_TextSpacingPercent range [0, 13200000] (got ${wire})`,
                                     partNameOptions(partName));
        }
        return { type: TextSpacingType.Percent, value: wire / SPACING_PCT_PER_PERCENT };
    }
    // Empty / unknown-only CT_TextSpacing: treat as absent direct value.
    return undefined;
}
/**
 * Parses `spcPct@val` as `ST_TextSpacingPercentOrPercentString`.
 *
 * @param {string} raw - The raw value.
 * @param {string} localName - The localName value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number} The result.
 */
function parseSpacingPercentWire(raw: string, localName: string, partName: string | undefined): number {
    // Manual parse only — no regex (security/detect-unsafe-regex).
    if (raw.charAt(raw.length - 1) === '%') {
        const n: number | undefined = parseOptionalSignedNumberLocal(raw.slice(0, -1));
        if (n === undefined) {
            throw new ShapeTextError(
                `${localName}/spcPct@val must be ST_PercentageDecimal or a percent string (got "${raw}")`,
                partNameOptions(partName)
            );
        }
        return Math.round(n * SPACING_PCT_PER_PERCENT);
    }
    const asInt: number | undefined = parseOptionalSignedIntegerLocal(raw);
    if (asInt !== undefined) {
        return asInt;
    }
    throw new ShapeTextError(`${localName}/spcPct@val must be ST_PercentageDecimal or a percent string (got "${raw}")`,
                             partNameOptions(partName));
}
/**
 * Parses an optional signed integer string without regex.
 *
 * @param {string} s - Raw digits string.
 * @returns {number | undefined} Parsed integer or undefined.
 */
function parseOptionalSignedIntegerLocal(s: string): number | undefined {
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
function parseOptionalSignedNumberLocal(s: string): number | undefined {
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
 * Writes or clears `CT_TextSpacing` under `a:pPr` without reordering unrelated siblings.
 *
 * @param {OoxmlElement} pPr - The pPr value.
 * @param {*} localName - The localName value.
 * @param {TextSpacingValue | undefined} value - The value value.
 * @param {string | undefined} partName - The partName value.
 * @returns {void} Nothing.
 */
function writeTextSpacing(pPr: OoxmlElement, localName: 'lnSpc' | 'spcBef' | 'spcAft', value: TextSpacingValue | undefined,
                          partName: string | undefined): void {
    if (value === undefined) {
        removeChildElement(pPr, localName);
        return;
    }
    if (value === null || typeof value !== 'object') {
        throw new ShapeTextError(`${localName} must be a TextSpacingValue or undefined`, partNameOptions(partName));
    }
    const type: TextSpacingTypeValue = value.type;
    const num: number = value.value;
    if (typeof type !== 'string' || !isTextSpacingType(type)) {
        throw new ShapeTextError(`${localName}.type must be a TextSpacingType token (got "${String(type)}")`, partNameOptions(partName));
    }
    if (typeof num !== 'number' || !Number.isFinite(num)) {
        throw new ShapeTextError(`${localName}.value must be a finite number`, partNameOptions(partName));
    }
    let choice: OoxmlElement;
    if (type === TextSpacingType.Points) {
        const wire: number = Math.round(num * SPACING_PTS_PER_POINT);
        if (wire < ST_TEXT_SPACING_POINT_MIN || wire > ST_TEXT_SPACING_POINT_MAX) {
            throw new ShapeTextError(`${localName} points must be between 0 and ${SPACING_POINTS_PUBLIC_MAX} (ST_TextSpacingPoint)`,
                                     partNameOptions(partName));
        }
        choice = dmlEl('spcPts', [attr('val', String(wire))], []);
    }
    else {
        const wire: number = Math.round(num * SPACING_PCT_PER_PERCENT);
        if (wire < ST_TEXT_SPACING_PERCENT_MIN || wire > ST_TEXT_SPACING_PERCENT_MAX) {
            throw new ShapeTextError(`${localName} percent must be between 0 and ${SPACING_PERCENT_PUBLIC_MAX} (ST_TextSpacingPercent)`,
                                     partNameOptions(partName));
        }
        choice = dmlEl('spcPct', [attr('val', String(wire))], []);
    }
    const spacingEl: OoxmlElement = dmlEl(localName, [], [choice]);
    upsertSpacingChild(pPr, localName, spacingEl);
}
/**
 * Removes the first DML child with the given local name from `pPr`.
 *
 * @param {OoxmlElement} pPr - The pPr value.
 * @param {string} localName - The localName value.
 * @returns {void} Nothing.
 */
function removeChildElement(pPr: OoxmlElement, localName: string): void {
    const mutable: MutableOoxmlElement = asMutable(pPr);
    const idx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' && c.namespaceUri === DML_NS &&
        c.localName === localName);
    if (idx !== -1) {
        mutable.children.splice(idx, 1);
    }
}
/**
 * Replaces an existing spacing child in place, or inserts one in schema order among
 * `lnSpc` / `spcBef` / `spcAft` without moving bullets, `defRPr`, `extLst`, or unknowns.
 *
 * @param {OoxmlElement} pPr - The pPr value.
 * @param {*} localName - The localName value.
 * @param {OoxmlElement} spacingEl - The spacingEl value.
 * @returns {void} Nothing.
 */
function upsertSpacingChild(pPr: OoxmlElement, localName: 'lnSpc' | 'spcBef' | 'spcAft', spacingEl: OoxmlElement): void {
    const mutable: MutableOoxmlElement = asMutable(pPr);
    const existingIdx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
        c.namespaceUri === DML_NS && c.localName === localName);
    if (existingIdx !== -1) {
        arraySet(mutable.children, existingIdx, spacingEl);
        return;
    }
    const orderIdx: number = spacingChildOrderIndex(localName);
    let insertAt: number = mutable.children.length;
    for (let i: number = 0; i < mutable.children.length; i += 1) {
        const child: OoxmlElement | OoxmlText = arrayAt(mutable.children, i);
        if (child === undefined || child.kind !== 'element' || child.namespaceUri !== DML_NS) {
            continue;
        }
        const siblingOrder: number = spacingChildOrderIndex(child.localName);
        if (siblingOrder !== -1) {
            if (siblingOrder > orderIdx) {
                insertAt = i;
                break;
            }
            continue;
        }
        // First non-spacing element (bu*, tabLst, defRPr, extLst, unknown) — insert before it.
        insertAt = i;
        break;
    }
    mutable.children.splice(insertAt, 0, spacingEl);
}
/**
 * Schema order index among `lnSpc` / `spcBef` / `spcAft`, or `-1` when not a spacing child.
 *
 * @param {string} localName - The localName value.
 * @returns {number} The result.
 */
function spacingChildOrderIndex(localName: string): number {
    for (let i: number = 0; i < SPACING_CHILD_ORDER.length; i += 1) {
        if (arrayAt(SPACING_CHILD_ORDER, i) === localName) {
            return i;
        }
    }
    return -1;
}

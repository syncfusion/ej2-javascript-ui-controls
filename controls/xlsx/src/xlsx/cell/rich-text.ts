/**
 * Rich text in a cell — different fonts on different parts of the same value.
 *
 * Typical flow: set the cell text, create a font with {@link Workbook.createFont},
 * then apply it to a character span with
 * `cell.richText.characters(start, end).font = font`.
 *
 * Character indices are inclusive and 0-based. There is no public `setFont`;
 * assign through the `characters(...).font` property.
 *
 * Citations:
 * - `docs/api/RICH-TEXT-PROPOSAL.md`
 * - `docs/specs/rich-text.md`
 * - ECMA-376-1 §18.4; transitional `sml.xsd` `CT_RElt` / `CT_RPrElt`
 */

import { InvalidArgumentError } from '../core/errors';
import { applyFontToRange, coalesceRuns, joinRunText, runsHaveFont, snapshotFontInput, RichTextRun } from '../shared-strings/rich-text-xml';
import { Color as ColorValue, Font as FontInput, FontSchemeValue, UnderlineValue } from '../styles/styles-xml';

/**
 * Font settings for a span of rich text in a cell (typeface, size, bold, color, and so on).
 *
 * Create with {@link Workbook.createFont}, set the properties you need, then assign
 * the font to a character range. The assignment copies the current values; changing
 * this object later does not update text that already received the font.
 *
 * This is independent of the workbook styles table — it does not create a shared style font.
 */
export class Font {
    /** Font family name, such as `"Calibri"` or `"Arial"`. */
    public name: string | undefined;
    /** Font size in points. */
    public size: number | undefined;
    /** Whether the text is bold. */
    public bold: boolean | undefined;
    /** Whether the text is italic. */
    public italic: boolean | undefined;
    /** Underline style, or `true`/`false` for a simple underline on/off. */
    public underline: UnderlineValue | boolean | undefined;
    /** Whether the text is struck through. */
    public strike: boolean | undefined;
    /** Text color. */
    public color: ColorValue | undefined;
    /** Font family class used by Excel (optional advanced setting). */
    public family: number | undefined;
    /** Character set used by Excel (optional advanced setting). */
    public charset: number | undefined;
    /** Theme font scheme, when the run follows a theme font. */
    public scheme: FontSchemeValue | undefined;
    /** Superscript, subscript, or baseline vertical alignment. */
    public vertAlign: string | undefined;
    /** Whether outline (hollow) text is drawn. */
    public outline: boolean | undefined;
    /** Whether a shadow effect is applied. */
    public shadow: boolean | undefined;
    /** Whether condensed spacing is applied. */
    public condense: boolean | undefined;
    /** Whether extended spacing is applied. */
    public extend: boolean | undefined;

    /**
     * Snapshot current fields as a plain {@link FontInput}.
     *
     * @returns {FontInput} - Returns the result.
     */
    public toFontInput(): FontInput {
        return {
            ...(this.name !== undefined ? { name: this.name } : {}),
            ...(this.size !== undefined ? { size: this.size } : {}),
            ...(this.bold !== undefined ? { bold: this.bold } : {}),
            ...(this.italic !== undefined ? { italic: this.italic } : {}),
            ...(this.underline !== undefined ? { underline: this.underline } : {}),
            ...(this.strike !== undefined ? { strike: this.strike } : {}),
            ...(this.color !== undefined ? { color: { ...this.color } } : {}),
            ...(this.family !== undefined ? { family: this.family } : {}),
            ...(this.charset !== undefined ? { charset: this.charset } : {}),
            ...(this.scheme !== undefined ? { scheme: this.scheme } : {}),
            ...(this.vertAlign !== undefined ? { vertAlign: this.vertAlign } : {}),
            ...(this.outline !== undefined ? { outline: this.outline } : {}),
            ...(this.shadow !== undefined ? { shadow: this.shadow } : {}),
            ...(this.condense !== undefined ? { condense: this.condense } : {}),
            ...(this.extend !== undefined ? { extend: this.extend } : {})
        };
    }

    /**
     * Populate fields from a {@link FontInput} snapshot.
     *
     * @param {*} input - The input parameter.
     * @returns {void} - Returns the result.
     */
    public copyFromInput(input: FontInput | undefined): void {
        this.name = undefined;
        this.size = undefined;
        this.bold = undefined;
        this.italic = undefined;
        this.underline = undefined;
        this.strike = undefined;
        this.color = undefined;
        this.family = undefined;
        this.charset = undefined;
        this.scheme = undefined;
        this.vertAlign = undefined;
        this.outline = undefined;
        this.shadow = undefined;
        this.condense = undefined;
        this.extend = undefined;
        if (input === undefined) {
            return;
        }
        if (input.name !== undefined) {
            this.name = input.name;
        }
        if (input.size !== undefined) {
            this.size = input.size;
        }
        if (input.bold !== undefined) {
            this.bold = input.bold;
        }
        if (input.italic !== undefined) {
            this.italic = input.italic;
        }
        if (input.underline !== undefined) {
            this.underline = input.underline;
        }
        if (input.strike !== undefined) {
            this.strike = input.strike;
        }
        if (input.color !== undefined) {
            this.color = { ...input.color };
        }
        if (input.family !== undefined) {
            this.family = input.family;
        }
        if (input.charset !== undefined) {
            this.charset = input.charset;
        }
        if (input.scheme !== undefined) {
            this.scheme = input.scheme;
        }
        if (input.vertAlign !== undefined) {
            this.vertAlign = input.vertAlign;
        }
        if (input.outline !== undefined) {
            this.outline = input.outline;
        }
        if (input.shadow !== undefined) {
            this.shadow = input.shadow;
        }
        if (input.condense !== undefined) {
            this.condense = input.condense;
        }
        if (input.extend !== undefined) {
            this.extend = input.extend;
        }
    }
}

/**
 * Host callbacks from {@link Cell} into worksheet SST / model.
 *
 * @private
 */
export interface RichTextCellHost {
    getPlainText(): string;
    getRuns(): RichTextRun[];
    commitRuns(runs: ReadonlyArray<RichTextRun>): void;
    hasRichFormatting(): boolean;
}

/**
 * Rich text for one cell: the full string plus character ranges you can format.
 *
 * Obtained from {@link Cell.richText}. Use {@link text} for the whole value and
 * {@link characters} to bold, color, or otherwise style part of it.
 */
export class RichTextString {
    private readonly host: RichTextCellHost;

    /**
     * Creates an instance.
     *
     * @param {RichTextCellHost} host - The host parameter.
     */
    public constructor(host: RichTextCellHost) {
        this.host = host;
    }

    /**
     * The full cell text as plain characters (formatting ignored when reading). Setting replaces the entire value with one unformatted run, or clears it when empty.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.host.getPlainText();
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        const next: { text: string }[] = value === '' ? [{ text: '' }] : [{ text: value }];
        this.host.commitRuns(next);
    }

    /**
     * Select a stretch of characters so you can read or set their font. Indices are 0-based and inclusive on both ends (for example, `characters(0, 2)` covers the first three characters). `end`, the range is outside the text, or the cell text is empty.
     *
     * @param {number} start - The start parameter.
     * @param {number} end - The end parameter.
     * @returns {RichTextCharacters} - Returns the result.
     */
    public characters(start: number, end: number): RichTextCharacters {
        const text: string = this.host.getPlainText();
        validateCharacterRange(start, end, text.length);
        return new RichTextCharacters(this.host, start, end);
    }

    /**
     * Structured runs (snapshot). Prefer {@link characters} for mutation.
     *
     * @returns {RichTextRun[]} - Returns the result.
     */
    public getRuns(): RichTextRun[] {
        return this.host.getRuns().map((r: RichTextRun): RichTextRun => {
            const snap: FontInput = snapshotFontInput(r.font);
            return snap !== undefined ? { text: r.text, font: snap } : { text: r.text };
        });
    }
}

/**
 * A selected range of characters inside a cell's rich text.
 *
 * Returned by {@link RichTextString.characters}. Assign {@link font} to format the span.
 */
export class RichTextCharacters {
    private readonly host: RichTextCellHost;
    private readonly start: number;
    private readonly end: number;

    /**
     * Creates an instance.
     *
     * @param {RichTextCellHost} host - The host parameter.
     * @param {number} start - The start parameter.
     * @param {number} end - The end parameter.
     */
    public constructor(host: RichTextCellHost, start: number, end: number) {
        this.host = host;
        this.start = start;
        this.end = end;
    }

    /**
     * Font applied to this character range. **Get:** returns a new {@link Font} for the first character in the range. If the range mixes several fonts, only the first character's formatting is shown. **Set:** copies the assigned {@link Font} (or plain font fields) onto every character in the range and commits coalesced runs to the cell.
     *
     * @returns {*} - Returns the result.
     */
    public get font(): Font | FontInput | undefined {
        const runs: RichTextRun[] = this.host.getRuns();
        const text: string = joinRunText(runs);
        const f: Font = new Font();
        if (text.length === 0 || this.start >= text.length) {
            return f;
        }
        let offset: number = 0;
        for (const run of runs) {
            const next: number = offset + run.text.length;
            if (this.start >= offset && this.start < next) {
                f.copyFromInput(run.font);
                return f;
            }
            offset = next;
        }
        return f;
    }

    /**
     * Sets font.
     *
     * @param {*} value - The value parameter.
     */
    public set font(value: Font | FontInput | undefined) {
        const input: FontInput = value === undefined ? undefined : value instanceof Font ? value.toFontInput() : snapshotFontInput(value);
        const current: RichTextRun[] = this.host.getRuns();
        const next: RichTextRun[] = applyFontToRange(current, this.start, this.end, input);
        this.host.commitRuns(next);
    }
}

/**
 * True when runs carry any explicit character formatting.
 *
 * @param {Object} runs - The runs parameter.
 * @returns {boolean} - Returns the result.
 */
export function richRunsIndicateRichText(runs: ReadonlyArray<RichTextRun>): boolean {
    return runsHaveFont(runs) || runs.length > 1;
}

/**
 * Coalesce helper re-export for cell host.
 *
 * @param {Object} runs - The runs parameter.
 * @returns {RichTextRun[]} - Returns the result.
 */
export function normalizeRichRuns(runs: ReadonlyArray<RichTextRun>): RichTextRun[] {
    return coalesceRuns(runs);
}

/**
 * validateCharacterRange function.
 *
 * @param {number} start - The start parameter.
 * @param {number} end - The end parameter.
 * @param {number} length - The length parameter.
 * @returns {void} - Returns the result.
 */
function validateCharacterRange(start: number, end: number, length: number): void {
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new InvalidArgumentError('Rich-text character indices must be finite numbers');
    }
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new InvalidArgumentError('Rich-text character indices must be integers');
    }
    if (length === 0) {
        throw new InvalidArgumentError('Cannot select characters on empty rich-text content');
    }
    if (start < 0 || end < 0 || start >= length || end >= length) {
        throw new InvalidArgumentError(`Rich-text character range [${start}, ${end}] is outside text length ${length}`);
    }
    if (start > end) {
        throw new InvalidArgumentError(`Rich-text character start ${start} is greater than end ${end}`);
    }
}

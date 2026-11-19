/**
 * Parse / serialize SpreadsheetML rich-text runs (`CT_RElt` / `CT_RPrElt`).
 *
 * Citations:
 * - ECMA-376-1 §18.4 Shared String Table
 * - Transitional `sml.xsd`: `CT_Rst`, `CT_RElt`, `CT_RPrElt`
 * - Path: `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/sml.xsd`
 *
 * Run typeface uses `rFont` (not styles-table `font/name`).
 *
 * @private
 */

import { escapeXml, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';
import {
    parseColorAttrs,
    serializeColorElement,
    Color as ColorValue,
    Font as FontInput,
    FontSchemeValue,
    UnderlineValue
} from '../styles/styles-xml';

/**
 * One rich-text run: text plus optional run properties.
 */
export interface RichTextRun {
    readonly text: string;
    readonly font?: FontInput;
}

/**
 * Join run texts into the plain fallback string.
 *
 * @param {Object} runs - The runs parameter.
 * @returns {string} - Returns the result.
 */
export function joinRunText(runs: ReadonlyArray<RichTextRun>): string {
    let out: string = '';
    for (const run of runs) {
        out += run.text;
    }
    return out;
}

/**
 * True when any run carries explicit font properties.
 *
 * @param {Object} runs - The runs parameter.
 * @returns {boolean} - Returns the result.
 */
export function runsHaveFont(runs: ReadonlyArray<RichTextRun>): boolean {
    for (const run of runs) {
        if (run.font !== undefined && fontInputHasProps(run.font)) {
            return true;
        }
    }
    return false;
}

/**
 * Snapshot `FontInput` (strip undefined; deep-copy color).
 *
 * @param {*} input - The input parameter.
 * @returns {*} - Returns the result.
 */
export function snapshotFontInput(input: FontInput | undefined): FontInput | undefined {
    if (input === undefined || !fontInputHasProps(input)) {
        return undefined;
    }
    return {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.size !== undefined ? { size: input.size } : {}),
        ...(input.bold !== undefined ? { bold: input.bold } : {}),
        ...(input.italic !== undefined ? { italic: input.italic } : {}),
        ...(input.underline !== undefined ? { underline: normalizeUnderline(input.underline) } : {}),
        ...(input.strike !== undefined ? { strike: input.strike } : {}),
        ...(input.color !== undefined ? { color: { ...input.color } } : {}),
        ...(input.family !== undefined ? { family: input.family } : {}),
        ...(input.charset !== undefined ? { charset: input.charset } : {}),
        ...(input.scheme !== undefined ? { scheme: input.scheme } : {}),
        ...(input.vertAlign !== undefined ? { vertAlign: input.vertAlign } : {}),
        ...(input.outline !== undefined ? { outline: input.outline } : {}),
        ...(input.shadow !== undefined ? { shadow: input.shadow } : {}),
        ...(input.condense !== undefined ? { condense: input.condense } : {}),
        ...(input.extend !== undefined ? { extend: input.extend } : {})
    };
}

/**
 * Canonical key for coalescing adjacent runs with equal fonts.
 *
 * @param {*} font - The font parameter.
 * @returns {string} - Returns the result.
 */
export function fontInputMatchKey(font: FontInput | undefined): string {
    if (font === undefined) {
        return '';
    }
    const u: UnderlineValue = font.underline === true ? 'single' : font.underline === false ? 'none' : font.underline;
    const c: ColorValue = font.color;
    const colorKey: string =
        c === undefined
            ? ''
            : [
                c.auto === true ? '1' : c.auto === false ? '0' : '',
                c.indexed != null ? c.indexed : '',
                c.rgb != null ? c.rgb : '',
                c.theme != null ? c.theme : '',
                c.tint != null ? c.tint : ''
            ].join(',');
    return [
        font.name != null ? font.name : '',
        font.size != null ? font.size : '',
        font.bold === true ? '1' : font.bold === false ? '0' : '',
        font.italic === true ? '1' : font.italic === false ? '0' : '',
        u != null ? u : '',
        font.strike === true ? '1' : font.strike === false ? '0' : '',
        colorKey,
        font.family != null ? font.family : '',
        font.charset != null ? font.charset : '',
        font.scheme != null ? font.scheme : '',
        font.vertAlign != null ? font.vertAlign : '',
        font.outline === true ? '1' : font.outline === false ? '0' : '',
        font.shadow === true ? '1' : font.shadow === false ? '0' : '',
        font.condense === true ? '1' : font.condense === false ? '0' : '',
        font.extend === true ? '1' : font.extend === false ? '0' : ''
    ].join('|');
}

/**
 * Coalesce adjacent runs that share the same font key.
 *
 * @param {Object} runs - The runs parameter.
 * @returns {RichTextRun[]} - Returns the result.
 */
export function coalesceRuns(runs: ReadonlyArray<RichTextRun>): RichTextRun[] {
    const out: RichTextRun[] = [];
    for (const run of runs) {
        if (run.text.length === 0 && out.length > 0) {
            continue;
        }
        const last: RichTextRun = out[out.length - 1];
        if (last !== undefined && fontInputMatchKey(last.font) === fontInputMatchKey(run.font)) {
            const keepFont: FontInput = snapshotFontInput(run.font != null ? run.font : last.font);
            out[out.length - 1] = keepFont !== undefined ? { text: last.text + run.text, font: keepFont } : { text: last.text + run.text };
            continue;
        }
        const snap: FontInput = snapshotFontInput(run.font);
        out.push(snap !== undefined ? { text: run.text, font: snap } : { text: run.text });
    }
    if (out.length === 0) {
        return [{ text: '' }];
    }
    return out;
}

/**
 * Expand runs to per-code-unit fonts, assign inclusive range, coalesce.
 *
 * @param {Object} runs - The runs parameter.
 * @param {number} start - The start parameter.
 * @param {number} end - The end parameter.
 * @param {*} font - The font parameter.
 * @returns {RichTextRun[]} - Returns the result.
 */
export function applyFontToRange(runs: ReadonlyArray<RichTextRun>, start: number, end: number, font: FontInput | undefined): RichTextRun[] {
    const text: string = joinRunText(runs);
    const fonts: Array<FontInput | undefined> = [];
    for (let i: number = 0; i < text.length; i += 1) {
        fonts.push(undefined);
    }
    let offset: number = 0;
    for (const run of runs) {
        const snap: FontInput = snapshotFontInput(run.font);
        for (let i: number = 0; i < run.text.length; i += 1) {
            fonts[offset + i] = snap;
        }
        offset += run.text.length;
    }
    const snapAssign: FontInput = snapshotFontInput(font);
    for (let i: number = start; i <= end; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        fonts[i] = snapAssign;
    }
    const next: RichTextRun[] = [];
    let i: number = 0;
    while (i < text.length) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const f: FontInput = fonts[i];
        let j: number = i + 1;
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        while (j < text.length && fontInputMatchKey(fonts[j]) === fontInputMatchKey(f)) {
            j += 1;
        }
        next.push({
            text: text.slice(i, j),
            ...(f !== undefined ? { font: f } : {})
        });
        i = j;
    }
    if (next.length === 0) {
        return [{ text: '' }];
    }
    return coalesceRuns(next);
}

/**
 * Parse runs from a full `<si>…</si>` or `<is>…</is>` element, or inner XML. Phonetic (`rPh` / `phoneticPr`) and unknown children are skipped on rebuild.
 *
 * @param {string} siOrInnerXml - The siOrInnerXml parameter.
 * @returns {RichTextRun[]} - Returns the result.
 */
export function parseRichRunsFromSiXml(siOrInnerXml: string): RichTextRun[] {
    const trimmed: string = siOrInnerXml.trim();
    if (trimmed.length === 0) {
        return [{ text: '' }];
    }
    const local: string = elementLocalName(trimmed);
    const inner: string = local === 'si' || local === 'is' || local === 'r' ? elementInner(trimmed) : trimmed;
    const children: string[] = splitTopLevelElements(inner);
    const runs: RichTextRun[] = [];

    for (const child of children) {
        const name: string = elementLocalName(child);
        if (name === 't') {
            runs.push({ text: parseTElement(child) });
            continue;
        }
        if (name === 'r') {
            runs.push(parseRunElement(child));
            continue;
        }
        // rPh, phoneticPr, extLst, unknown — ignored on structured rebuild
    }

    if (runs.length === 0) {
        return [{ text: '' }];
    }
    return coalesceRuns(runs);
}

/**
 * Serialize runs to a full `<si>…</si>` element (`CT_Rst` with `r*` only).
 *
 * @param {Object} runs - The runs parameter.
 * @returns {string} - Returns the result.
 */
export function serializeRichSiXml(runs: ReadonlyArray<RichTextRun>): string {
    const coalesced: RichTextRun[] = coalesceRuns(runs);
    if (
        coalesced.length === 1 &&
        coalesced[0] !== undefined &&
        (coalesced[0].font === undefined || !fontInputHasProps(coalesced[0].font))
    ) {
        return `<si>${serializeT(coalesced[0].text)}</si>`;
    }
    const parts: string[] = [];
    for (const run of coalesced) {
        parts.push(serializeRunElement(run));
    }
    return `<si>${parts.join('')}</si>`;
}

/**
 * parseRunElement function.
 *
 * @param {string} rXml - The rXml parameter.
 * @returns {RichTextRun} - Returns the result.
 */
function parseRunElement(rXml: string): RichTextRun {
    const inner: string = elementInner(rXml);
    let font: FontInput | undefined;
    let text: string = '';
    for (const child of splitTopLevelElements(inner)) {
        const name: string = elementLocalName(child);
        if (name === 'rPr') {
            font = parseRPrElement(child);
            continue;
        }
        if (name === 't') {
            text += parseTElement(child);
        }
    }
    return {
        text,
        ...(font !== undefined && fontInputHasProps(font) ? { font } : {})
    };
}

/**
 * serializeRunElement function.
 *
 * @param {RichTextRun} run - The run parameter.
 * @returns {string} - Returns the result.
 */
function serializeRunElement(run: RichTextRun): string {
    const rPr: string = run.font !== undefined && fontInputHasProps(run.font) ? serializeRPrElement(run.font) : '';
    return `<r>${rPr}${serializeT(run.text)}</r>`;
}

/**
 * Parse `CT_RPrElt` (`rPr`).
 *
 * @param {string} rPrXml - The rPrXml parameter.
 * @returns {FontInput} - Returns the result.
 */
export function parseRPrElement(rPrXml: string): FontInput {
    const trimmed: string = rPrXml.trim();
    let name: string | undefined;
    let size: number | undefined;
    let bold: boolean | undefined;
    let italic: boolean | undefined;
    let underline: UnderlineValue | boolean | undefined;
    let strike: boolean | undefined;
    let color: ColorValue | undefined;
    let family: number | undefined;
    let charset: number | undefined;
    let scheme: FontSchemeValue | undefined;
    let vertAlign: string | undefined;
    let outline: boolean | undefined;
    let shadow: boolean | undefined;
    let condense: boolean | undefined;
    let extend: boolean | undefined;

    for (const child of splitTopLevelElements(elementInner(trimmed))) {
        const local: string = elementLocalName(child);
        switch (local) {
        case 'rFont':
        case 'name':
            name = parseValString(child);
            break;
        case 'sz':
            size = parseValNumber(child);
            break;
        case 'b':
            bold = parseBooleanProperty(child);
            break;
        case 'i':
            italic = parseBooleanProperty(child);
            break;
        case 'strike':
            strike = parseBooleanProperty(child);
            break;
        case 'outline':
            outline = parseBooleanProperty(child);
            break;
        case 'shadow':
            shadow = parseBooleanProperty(child);
            break;
        case 'condense':
            condense = parseBooleanProperty(child);
            break;
        case 'extend':
            extend = parseBooleanProperty(child);
            break;
        case 'color':
            color = parseColorChild(child);
            break;
        case 'u': {
            const u: string = parseValString(child);
            // Bare `<u/>` means single underline; expose as boolean `true` so
            // author `font.underline = true` round-trips without becoming 'single'.
            if (u === undefined || u === 'single') {
                underline = true;
            } else if (u === 'none') {
                underline = false;
            } else {
                underline = u as UnderlineValue;
            }
            break;
        }
        case 'family':
            family = parseValInt(child);
            break;
        case 'charset':
            charset = parseValInt(child);
            break;
        case 'scheme': {
            const sch: string = parseValString(child);
            if (sch === 'none' || sch === 'major' || sch === 'minor') {
                scheme = sch;
            }
            break;
        }
        case 'vertAlign':
            vertAlign = parseValString(child);
            break;
        default:
            break;
        }
    }

    return {
        ...(name !== undefined ? { name } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(bold !== undefined ? { bold } : {}),
        ...(italic !== undefined ? { italic } : {}),
        ...(underline !== undefined ? { underline } : {}),
        ...(strike !== undefined ? { strike } : {}),
        ...(color !== undefined ? { color } : {}),
        ...(family !== undefined ? { family } : {}),
        ...(charset !== undefined ? { charset } : {}),
        ...(scheme !== undefined ? { scheme } : {}),
        ...(vertAlign !== undefined ? { vertAlign } : {}),
        ...(outline !== undefined ? { outline } : {}),
        ...(shadow !== undefined ? { shadow } : {}),
        ...(condense !== undefined ? { condense } : {}),
        ...(extend !== undefined ? { extend } : {})
    };
}

/**
 * Serialize `CT_RPrElt` with `rFont` for typeface.
 *
 * @param {FontInput} font - The font parameter.
 * @returns {string} - Returns the result.
 */
export function serializeRPrElement(font: FontInput): string {
    const parts: string[] = [];
    if (font.name !== undefined) {
        parts.push(`<rFont val="${escapeXml(font.name)}"/>`);
    }
    if (font.charset !== undefined) {
        parts.push(`<charset val="${font.charset}"/>`);
    }
    if (font.family !== undefined) {
        parts.push(`<family val="${font.family}"/>`);
    }
    parts.push(serializeBooleanProp('b', font.bold));
    parts.push(serializeBooleanProp('i', font.italic));
    parts.push(serializeBooleanProp('strike', font.strike));
    parts.push(serializeBooleanProp('outline', font.outline));
    parts.push(serializeBooleanProp('shadow', font.shadow));
    parts.push(serializeBooleanProp('condense', font.condense));
    parts.push(serializeBooleanProp('extend', font.extend));
    parts.push(serializeColorElement('color', font.color));
    if (font.size !== undefined) {
        parts.push(`<sz val="${font.size}"/>`);
    }
    if (font.underline !== undefined) {
        if (font.underline === true || font.underline === 'single') {
            parts.push('<u/>');
        } else if (font.underline === false) {
            parts.push('<u val="none"/>');
        } else {
            parts.push(`<u val="${font.underline}"/>`);
        }
    }
    if (font.vertAlign !== undefined) {
        parts.push(`<vertAlign val="${escapeXml(font.vertAlign)}"/>`);
    }
    if (font.scheme !== undefined) {
        parts.push(`<scheme val="${font.scheme}"/>`);
    }
    const body: string = parts.filter((p: string): boolean => p.length > 0).join('');
    return `<rPr>${body}</rPr>`;
}

/**
 * Collapse OOXML default single underline aliases to boolean `true`/`false` so author-side `font.underline = true` is stable after snapshot/parse.
 *
 * @param {boolean} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function normalizeUnderline(value: UnderlineValue | boolean): UnderlineValue | boolean {
    if (value === 'single' || value === true) {
        return true;
    }
    if (value === 'none' || value === false) {
        return false;
    }
    return value;
}

/**
 * fontInputHasProps function.
 *
 * @param {FontInput} font - The font parameter.
 * @returns {boolean} - Returns the result.
 */
function fontInputHasProps(font: FontInput): boolean {
    return (
        font.name !== undefined ||
        font.size !== undefined ||
        font.bold !== undefined ||
        font.italic !== undefined ||
        font.underline !== undefined ||
        font.strike !== undefined ||
        font.color !== undefined ||
        font.family !== undefined ||
        font.charset !== undefined ||
        font.scheme !== undefined ||
        font.vertAlign !== undefined ||
        font.outline !== undefined ||
        font.shadow !== undefined ||
        font.condense !== undefined ||
        font.extend !== undefined
    );
}

/**
 * serializeT function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function serializeT(text: string): string {
    const space: '' | ' xml:space="preserve"' =
        text.length > 0 && (/^\s|\s$/.test(text) || text.includes('\n') || text.includes('\t')) ? ' xml:space="preserve"' : '';
    return `<t${space}>${escapeXml(text)}</t>`;
}

/**
 * parseTElement function.
 *
 * @param {string} tXml - The tXml parameter.
 * @returns {string} - Returns the result.
 */
function parseTElement(tXml: string): string {
    return unescapeXml(elementInner(tXml));
}

/**
 * serializeBooleanProp function.
 *
 * @param {string} name - The name parameter.
 * @param {boolean} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function serializeBooleanProp(name: string, value: boolean | undefined): string {
    if (value === undefined) {
        return '';
    }
    if (value) {
        return `<${name}/>`;
    }
    return `<${name} val="0"/>`;
}

/**
 * parseBooleanProperty function.
 *
 * @param {string} el - The el parameter.
 * @returns {boolean} - Returns the result.
 */
function parseBooleanProperty(el: string): boolean {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const v: boolean = parseOptionalBool(attrs.get('val'));
    return v === undefined ? true : v;
}

/**
 * parseValString function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function parseValString(el: string): string | undefined {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    return attrs.get('val');
}

/**
 * parseValNumber function.
 *
 * @param {string} el - The el parameter.
 * @returns {number} - Returns the result.
 */
function parseValNumber(el: string): number | undefined {
    const raw: string = parseValString(el);
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * parseValInt function.
 *
 * @param {string} el - The el parameter.
 * @returns {number} - Returns the result.
 */
function parseValInt(el: string): number | undefined {
    const raw: string = parseValString(el);
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * parseColorChild function.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseColorChild(el: string): ColorValue | undefined {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    return parseColorAttrs(attrs);
}

/**
 * parseOptionalBool function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {boolean} - Returns the result.
 */
function parseOptionalBool(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return undefined;
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(s: string): string[] {
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
        const openEnd: number = findTagEnd(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalName(openTag);
        const close: number = findClosing(s, local, openEnd + 1);
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
 * findTagEnd function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEnd(s: string, from: number): number {
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
 * findClosing function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosing(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}\\s*>`, 'g');
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
            const tagEnd: number = findTagEnd(s, om.index);
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
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEnd(trimmed, 0);
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
 * escapeRegExp function.
 *
 * @param {string} s - The s parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

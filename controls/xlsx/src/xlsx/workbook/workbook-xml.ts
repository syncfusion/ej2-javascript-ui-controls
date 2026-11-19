/**
 * Parse / serialize SpreadsheetML workbook part (`CT_Workbook`).
 *
 * Citations:
 * - `CT_Workbook`, `CT_Sheets`, `CT_Sheet`, `CT_WorkbookPr`, `ST_SheetState`:
 *   `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/sml.xsd`
 * - `date1904` default false: same schema + ECMA-376-1 workbookPr
 * - `definedNames` order after sheets/functionGroups/externalReferences:
 *   transitional sml.xsd `CT_Workbook` sequence
 *
 * Unknown workbook children are preserved as ordered XML snippets.
 *
 * @private
 */

import { InvalidWorkbookError } from '../core/errors';
import { OFFICE_DOCUMENT_RELATIONSHIPS_NS, SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { attrsToXmlExcluding, decodeUtf8, encodeUtf8, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';
import { mergePivotCachesXml } from '../pivot/pivot-xml';
import { parseDefinedNamesXml, serializeDefinedNamesXml, workbookChildOrderRank, DefinedNameEntry } from './defined-names';
import { parseWorkbookProtectionXml, serializeWorkbookProtectionXml, WorkbookProtectionModel } from './workbook-protection';

/** Specifies whether a sheet is visible, hidden, or very hidden. */
export type SheetVisibility = 'visible' | 'hidden' | 'veryHidden';

/** Distinguishes a normal worksheet from another kind of sheet, such as a chartsheet. */
export type SheetKind = 'worksheet' | 'other';

/**
 * One `sheet` entry from `CT_Sheets`.
 */
export interface SheetXmlEntry {
    readonly name: string;
    readonly sheetId: number;
    readonly relId: string;
    readonly state: SheetVisibility;
    /** Raw attribute text for unknown attrs (name=value pairs already escaped). */
    readonly extraAttrsXml: string;
}

/**
 * Parsed workbook.xml model (structure only).
 */
export interface WorkbookXmlModel {
    readonly date1904: boolean;
    /** Raw `workbookPr` element inner attribute remainder excluding date1904 (for preserve). */
    readonly workbookPrExtraAttrsXml: string | undefined;
    /** True when a workbookPr element was present on read. */
    readonly hasWorkbookPr: boolean;
    /**
     * Workbook structure/windows protection (`CT_WorkbookProtection`).
     * Absent when no `workbookProtection` element was present / authored.
     */
    readonly workbookProtection: WorkbookProtectionModel | undefined;
    readonly sheets: ReadonlyArray<SheetXmlEntry>;
    /** Defined name entries (`CT_DefinedNames`); empty when absent. */
    readonly definedNames: ReadonlyArray<DefinedNameEntry>;
    /**
     * Ordered non-modeled top-level child XML (excluding sheets, workbookPr,
     * workbookProtection, definedNames), each a full element string including tags.
     */
    readonly preserveChildrenXml: ReadonlyArray<string>;
    /** Namespace declarations found on the root (excluding xmlns default and r), raw. */
    readonly rootExtraxmlnsXml: string;
    /** Zero-based active worksheet index from `bookViews/workbookView@activeTab`. */
    readonly activeTab: number;
    /**
     * Authored pivot caches to add to `pivotCaches` on serialize
     * (`CT_PivotCache`: `cacheId` + `r:id`). Loaded `pivotCaches` stay in
     * {@link preserveChildrenXml}; this list is only what the library wrote.
     */
    readonly pivotCaches?: ReadonlyArray<{ readonly cacheId: number; readonly relId: string }>;
}

const SML_NS: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main' = SPREADSHEETML_NS_TRANSITIONAL;
const R_NS: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships' = OFFICE_DOCUMENT_RELATIONSHIPS_NS;

/**
 * Parse workbook part bytes into a structure model.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @param {string} partName - The partName parameter.
 * @returns {WorkbookXmlModel} - Returns the result.
 */
export function parseWorkbookXml(bytes: Uint8Array, partName: string): WorkbookXmlModel {
    const xml: string = decodeUtf8(bytes);
    const trimmed: string = stripPrologAndComments(xml);
    const root: { inner: string; extraXmlns: string } = matchRoot(trimmed, partName);
    const inner: string = root.inner;
    const children: string[] = splitTopLevelElements(inner);

    let date1904: boolean = false;
    let hasWorkbookPr: boolean = false;
    let workbookPrExtraAttrsXml: string | undefined;
    let workbookProtection: WorkbookProtectionModel | undefined;
    let sheets: SheetXmlEntry[] | undefined;
    let definedNames: DefinedNameEntry[] = [];
    const preserveChildrenXml: string[] = [];
    const rootExtraxmlnsXml: string = root.extraXmlns;
    let activeTab: number = 0;

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'workbookPr') {
            hasWorkbookPr = true;
            const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(child));
            const raw: string = attrs.get('date1904');
            if (raw !== undefined) {
                date1904 = parseOnOff(raw);
            }
            workbookPrExtraAttrsXml = attrsToXmlExcluding(attrs, new Set(['date1904']));
            if (workbookPrExtraAttrsXml === '') {
                workbookPrExtraAttrsXml = undefined;
            }
            continue;
        }
        if (local === 'workbookProtection') {
            // CT_Workbook: after workbookPr, before bookViews (rank 40).
            workbookProtection = parseWorkbookProtectionXml(child);
            continue;
        }
        if (local === 'sheets') {
            sheets = parseSheetsElement(child, partName);
            continue;
        }
        if (local === 'bookViews') {
            activeTab = parseActiveTab(child);
        }
        if (local === 'definedNames') {
            definedNames = parseDefinedNamesXml(child);
            continue;
        }
        preserveChildrenXml.push(child);
    }

    if (sheets === undefined) {
        throw new InvalidWorkbookError(`Workbook part "${partName}" is missing required sheets element`, {
            partName
        });
    }

    return {
        date1904,
        hasWorkbookPr,
        workbookProtection,
        sheets,
        definedNames,
        preserveChildrenXml,
        rootExtraxmlnsXml,
        workbookPrExtraAttrsXml,
        activeTab
    };
}

/**
 * Serialize workbook structure to Transitional SpreadsheetML bytes. Child order follows CT_Workbook ranks: preserve peers before `workbookPr` (e.g. `fileVersion`), then modeled `workbookPr` when needed, then remaining pre-`sheets` peers (`bookViews`, MC/revision markers, …). `sheets` and `definedNames` split later bands so mutual order of unknown siblings is kept.
 *
 * @param {WorkbookXmlModel} model - The model parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function serializeWorkbookXml(model: WorkbookXmlModel): Uint8Array {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    const extraNs: string = model.rootExtraxmlnsXml.length > 0 ? ` ${model.rootExtraxmlnsXml.trim()}` : '';
    lines.push(`<workbook xmlns="${SML_NS}" xmlns:r="${R_NS}"${extraNs}>`);

    const needWorkbookPr: boolean =
        model.hasWorkbookPr || model.date1904 || (model.workbookPrExtraAttrsXml !== undefined && model.workbookPrExtraAttrsXml.length > 0);
    const workbookPrXml: string = needWorkbookPr
        ? ((): string => {
            const dateAttr: '' | ' date1904="1"' = model.date1904 ? ' date1904="1"' : '';
            const extra: string =
                  model.workbookPrExtraAttrsXml !== undefined && model.workbookPrExtraAttrsXml.length > 0
                      ? ` ${model.workbookPrExtraAttrsXml.trim()}`
                      : '';
            return `<workbookPr${dateAttr}${extra}/>`;
        })()
        : undefined;

    // CT_Workbook sequence: fileVersion → … → workbookPr → workbookProtection →
    // bookViews → sheets → functionGroups → externalReferences → definedNames → …
    // Unknown siblings keep mutual order within each band. Modeled protection is
    // stripped from preserve and re-emitted after workbookPr (rank 40).
    const workbookPrRank: number = workbookChildOrderRank('workbookPr');
    const sheetsRank: number = workbookChildOrderRank('sheets');
    const definedNamesRank: number = workbookChildOrderRank('definedNames');
    const beforeWorkbookPr: string[] = [];
    const betweenWorkbookPrAndSheets: string[] = [];
    const betweenSheetsAndDefinedNames: string[] = [];
    const afterDefinedNames: string[] = [];
    const preserved: string[] = mergePivotCachesXml(
        model.preserveChildrenXml,
        model.pivotCaches !== undefined ? model.pivotCaches : [],
        workbookChildOrderRank,
        elementLocalName,
    );
    for (const snip of preserved) {
        const local: string = elementLocalName(snip);
        // First-class model owns workbookProtection; never double-emit from preserve.
        if (local === 'workbookProtection') {
            continue;
        }
        const rank: number = workbookChildOrderRank(local);
        if (rank < workbookPrRank) {
            beforeWorkbookPr.push(snip);
        } else if (rank < sheetsRank) {
            betweenWorkbookPrAndSheets.push(snip);
        } else if (rank < definedNamesRank) {
            betweenSheetsAndDefinedNames.push(snip);
        } else {
            afterDefinedNames.push(snip);
        }
    }

    for (const snip of beforeWorkbookPr) {
        lines.push(snip);
    }
    if (workbookPrXml !== undefined) {
        lines.push(workbookPrXml);
    }
    const workbookProtectionXml: string = serializeWorkbookProtectionXml(model.workbookProtection);
    if (workbookProtectionXml !== undefined) {
        lines.push(workbookProtectionXml);
    }
    let wroteBookViews: boolean = false;
    for (const snip of betweenWorkbookPrAndSheets) {
        if (elementLocalName(snip) === 'bookViews') {
            lines.push(serializeBookViews(snip, model.activeTab));
            wroteBookViews = true;
        } else {
            lines.push(snip);
        }
    }
    if (!wroteBookViews) {
        lines.push(`<bookViews><workbookView activeTab="${model.activeTab}"/></bookViews>`);
    }

    lines.push('<sheets>');
    for (const s of model.sheets) {
        const stateAttr: string = s.state === 'visible' ? '' : ` state="${escapeXml(s.state)}"`;
        const extra: string = s.extraAttrsXml.length > 0 ? ` ${s.extraAttrsXml.trim()}` : '';
        lines.push(`<sheet name="${escapeXml(s.name)}" sheetId="${s.sheetId}" r:id="${escapeXml(s.relId)}"${stateAttr}${extra}/>`);
    }
    lines.push('</sheets>');

    for (const snip of betweenSheetsAndDefinedNames) {
        lines.push(snip);
    }

    const definedNamesXml: string = serializeDefinedNamesXml(
        model.definedNames,
        model.sheets.map((s: SheetXmlEntry): string => s.name)
    );
    if (definedNamesXml !== undefined) {
        lines.push(definedNamesXml);
    }

    for (const snip of afterDefinedNames) {
        lines.push(snip);
    }

    lines.push('</workbook>');
    return encodeUtf8(lines.join(''));
}

/**
 * Minimal empty worksheet part (Transitional) with empty sheetData.
 *
 * @returns {string} - Returns the result.
 */
export function emptyWorksheetXml(): string {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + `<worksheet xmlns="${SML_NS}">` + '<sheetData/>' + '</worksheet>';
}

/**
 * parseActiveTab function.
 *
 * @param {string} bookViewsXml - The bookViewsXml parameter.
 * @returns {number} - Returns the result.
 */
function parseActiveTab(bookViewsXml: string): number {
    const view: string = ((m: RegExpExecArray): string => {
        const v: string = m == null ? undefined : m[1];
        return v != null ? v : '';
    })(/<workbookView\b([^>]*)>/i.exec(bookViewsXml));
    const raw: string = parseAttrMap(view).get('activeTab');
    const value: number = raw === undefined ? 0 : Number.parseInt(raw, 10);
    return Number.isInteger(value) && value >= 0 ? value : 0;
}

/**
 * serializeBookViews function.
 *
 * @param {string} bookViewsXml - The bookViewsXml parameter.
 * @param {number} activeTab - The activeTab parameter.
 * @returns {string} - Returns the result.
 */
function serializeBookViews(bookViewsXml: string, activeTab: number): string {
    const active: string = String(Math.max(0, Math.trunc(activeTab)));
    return bookViewsXml.replace(/(<workbookView\b[^>]*?)(\s*\/?>)/i, (_match: string, attrs: string, close: string): string => {
        const withoutActive: string = attrs.replace(/\s+activeTab\s*=\s*(?:"[^"]*"|'[^']*')/i, '');
        return `${withoutActive} activeTab="${active}"${close}`;
    });
}

/**
 * parseSheetsElement function.
 *
 * @param {string} sheetsXml - The sheetsXml parameter.
 * @param {string} partName - The partName parameter.
 * @returns {SheetXmlEntry[]} - Returns the result.
 */
function parseSheetsElement(sheetsXml: string, partName: string): SheetXmlEntry[] {
    const inner: string = elementInner(sheetsXml);
    const sheetEls: string[] = splitTopLevelElements(inner).filter((el: string): boolean => elementLocalName(el) === 'sheet');
    if (sheetEls.length === 0) {
        throw new InvalidWorkbookError(`Workbook part "${partName}" sheets element has no sheet children`, {
            partName
        });
    }
    const out: SheetXmlEntry[] = [];
    for (const el of sheetEls) {
        const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(el));
        const name: string = attrs.get('name');
        const sheetIdRaw: string = attrs.get('sheetId');
        const relId: string = attrs.get('id') != null ? attrs.get('id') : attrs.get('r:id');
        if (name === undefined || sheetIdRaw === undefined || relId === undefined) {
            throw new InvalidWorkbookError(`sheet element missing name, sheetId, or r:id in "${partName}"`, { partName });
        }
        const sheetId: number = Number.parseInt(sheetIdRaw, 10);
        if (!Number.isFinite(sheetId) || sheetId < 1) {
            throw new InvalidWorkbookError(`Invalid sheetId "${sheetIdRaw}" in "${partName}"`, {
                partName
            });
        }
        const stateRaw: string = attrs.get('state');
        let state: SheetVisibility = 'visible';
        if (stateRaw !== undefined) {
            if (stateRaw === 'visible' || stateRaw === 'hidden' || stateRaw === 'veryHidden') {
                state = stateRaw;
            } else {
                throw new InvalidWorkbookError(`Invalid sheet state "${stateRaw}" in "${partName}"`, {
                    partName
                });
            }
        }
        const extraAttrsXml: string = attrsToXmlExcluding(attrs, new Set(['name', 'sheetId', 'id', 'r:id', 'state']));
        out.push({ name, sheetId, relId, state, extraAttrsXml });
    }
    return out;
}

/**
 * parseOnOff function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {boolean} - Returns the result.
 */
function parseOnOff(raw: string): boolean {
    const v: string = raw.trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'on';
}

/**
 * matchRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRoot(xml: string, partName: string): { inner: string; extraXmlns: string } {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const openRe: RegExp = /^<([A-Za-z_][\w.-]*:)?workbook\b([^>]*)>/i;
    const m: RegExpExecArray = openRe.exec(xml);
    if (m === null) {
        throw new InvalidWorkbookError(`Expected root element "workbook" in part "${partName}"`, {
            partName
        });
    }
    const openAttrText: string = m[2] != null ? m[2] : '';
    const openFull: string = m[0];
    const selfClosing: boolean = /\/\s*>$/.test(openFull);
    if (selfClosing) {
        return { inner: '', extraXmlns: filterExtraXmlns(openAttrText) };
    }
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const closeRe: RegExp = /<\/([A-Za-z_][\w.-]*:)?workbook\s*>/i;
    const closeMatch: RegExpExecArray = closeRe.exec(xml);
    if (closeMatch === null || closeMatch.index < openFull.length) {
        throw new InvalidWorkbookError(`Unclosed workbook root in part "${partName}"`, { partName });
    }
    const inner: string = xml.slice(openFull.length, closeMatch.index);
    return { inner, extraXmlns: filterExtraXmlns(openAttrText) };
}

/**
 * Preserve root attributes other than the default SML xmlns and the r relationship xmlns that serializeWorkbookXml always re-emits. Keeps Markup Compatibility (`mc:Ignorable`, …) and extra namespace declarations.
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
function filterExtraXmlns(attrText: string): string {
    const attrs: Map<string, string> = parseAttrMap(attrText);
    return attrsToXmlExcluding(attrs, new Set(['xmlns', 'xmlns:r', 'xmlns:R']));
}

/**
 * stripPrologAndComments function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripPrologAndComments(xml: string): string {
    return xml
        .replace(/^\uFEFF/, '')
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(inner: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    const s: string = inner;
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
 * elementOpenAttrs function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrs(el: string): string {
    const m: RegExpExecArray = /^<[^>\s]+([^>]*)>/.exec(el.trim());
    if (m === null) {
        return '';
    }
    let attrs: string = m[1] != null ? m[1] : '';
    attrs = attrs.replace(/\/\s*$/, '');
    return attrs;
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
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

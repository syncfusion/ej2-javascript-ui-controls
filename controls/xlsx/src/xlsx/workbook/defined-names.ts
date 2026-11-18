/**
 * Workbook defined names (`CT_DefinedNames` / `CT_DefinedName`).
 *
 * Citations:
 * - ECMA-376-1 §18.2.5 `definedNames` / §18.2.6 `definedName`
 * - transitional sml.xsd `CT_DefinedNames` / `CT_DefinedName` / `CT_Workbook` sequence
 * - docs/specs/named-ranges.md; docs/ooxml-mapping/named-ranges.md
 *
 * Content text is opaque — never evaluated, never resolved as an external link.
 */

import { normalizeFormulaExpression } from '../cell/formula';
import { InvalidArgumentError, InvalidDefinedNameError } from '../core/errors';
import { attrsToXmlExcluding, escapeXml, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';

/**
 * Represents a named cell range or formula in a workbook, letting you refer
 * to it by name elsewhere in the document.
 */
export interface DefinedName {
    /** The name used in formulas — for example `'TaxRate'` or `'Sales'`. */
    readonly name: string;
    /**
     * What the name refers to — for example `'Sheet1!$A$1:$A$10'` or `0.2`.
     * Stored as text and never evaluated by the library.
     */
    readonly content: string;
    /**
     * The zero-based position of the sheet the name belongs to. `undefined`
     * when the name applies to the whole workbook.
     */
    readonly sheetIndex?: number;
    /**
     * Whether the name is hidden from Excel's name manager. `undefined` means
     * not hidden.
     */
    readonly hidden?: boolean;
}

/**
 * Represents the collection of defined names in a workbook, letting you add,
 * find, and remove named ranges and formulas.
 *
 * Key is `(name, sheetIndex | global)`. Same name may exist once globally and
 * once per local sheet index. {@link DefinedNames.add} is the sole public
 * add-or-replace write (API-RULES R1.5); `set` is `@private`.
 */
export interface DefinedNames {
    /** The number of defined names in the workbook. */
    readonly count: number;
    /**
     * Get all defined names as a list, in the order they appear in the
     * workbook.
     *
     * @returns {*} the current defined names.
     */
    list(): ReadonlyArray<DefinedName>;
    /**
     * Get a defined name by its name and optional scope.
     *
     * @param name - The name used in formulas, like `'TaxRate'`.
     * @param sheetIndex - The zero-based position of the sheet the name
     *   belongs to; omit it (or pass `undefined`) to get the workbook-wide
     *   entry.
     * @returns {*} the matching defined name, or `undefined` when there is none.
     */
    get(name: string, sheetIndex?: number): DefinedName | undefined;
    /**
     * Add a defined name, or update it when the same name already exists in
     * the same scope. A single leading `=` on `content` is stripped, so
     * `'=Sheet1!$A$1'` and `'Sheet1!$A$1'` are stored the same way.
     *
     * @param name - The name used in formulas, like `'TaxRate'`.
     * @param content - What the name refers to, like `'Sheet1!$A$1:$A$10'`.
     * @param sheetIndex - The zero-based position of the sheet the name belongs
     *   to; omit / `undefined` for workbook-global.
     * @param hidden - When true, the name is hidden from Excel's name manager.
     * @returns {*} an object describing the added or updated defined name.
     * @throws InvalidDefinedNameError when name or content is empty
     * @throws InvalidArgumentError when `sheetIndex` is out of sheet range
     */
    add(name: string, content: string, sheetIndex?: number, hidden?: boolean): DefinedName;
    /**
     * Add or update a defined name without returning it. Prefer
     * {@link DefinedNames.add}, which returns the defined name.
     *
     * @param name - The name used in formulas, like `'TaxRate'`.
     * @param content - What the name refers to, like `'Sheet1!$A$1:$A$10'`.
     * @param sheetIndex - The zero-based position of the sheet the name belongs
     *   to; omit / `undefined` for workbook-global.
     * @param hidden - When true, the name is hidden from Excel's name manager.
     * @throws InvalidDefinedNameError when name or content is empty
     * @throws InvalidArgumentError when `sheetIndex` is out of sheet range
     *
     * @private
     */
    set(name: string, content: string, sheetIndex?: number, hidden?: boolean): void;
    /**
     * Remove a defined name.
     *
     * @param name - The name used in formulas, like `'TaxRate'`.
     * @param sheetIndex - The zero-based position of the sheet the name
     *   belongs to; omit it (or pass `undefined`) for the workbook-wide
     *   entry.
     * @returns {*} `true` when a defined name was removed, `false` when none
     *   matched.
     */
    remove(name: string, sheetIndex?: number): boolean;
    /** Remove every defined name from the workbook. */
    clear(): void;
}

/**
 * Internal record including preserve bag for unknown attributes.
 *
 * @private
 */
export interface DefinedNameEntry {
    name: string;
    content: string;
    sheetIndex: number | undefined;
    hidden: boolean;
    /** Extra attributes excluding name / localSheetId (wire) / hidden (XML fragment, no leading space). */
    extraAttrsXml: string;
}

/**
 * Host notifications for defined-name mutations and sheet-count checks.
 *
 * @private
 */
export interface DefinedNamesHost {
    markDirty(): void;
    /** Current workbook sheet count (for sheetIndex validation). */
    sheetCount(): number;
}

/**
 * Mutable defined-names store.
 *
 * @private
 */
export class DefinedNamesImpl implements DefinedNames {
    private readonly entries: DefinedNameEntry[] = [];
    private host: DefinedNamesHost | undefined;

    /**
     * Creates an instance.
     *
     * @param {Object} initial - The initial parameter.
     */
    public constructor(initial?: ReadonlyArray<DefinedNameEntry>) {
        if (initial !== undefined) {
            for (const e of initial) {
                this.entries.push({
                    name: e.name,
                    content: e.content,
                    sheetIndex: e.sheetIndex,
                    hidden: e.hidden,
                    extraAttrsXml: e.extraAttrsXml
                });
            }
        }
    }

    /**
     * bindHost method.
     *
     * @param {DefinedNamesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: DefinedNamesHost): void {
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
    public list(): ReadonlyArray<DefinedName> {
        return this.entries.map(toPublic);
    }

    /**
     * get method.
     *
     * @param {string} name - The name parameter.
     * @param {number} sheetIndex - The sheetIndex parameter.
     * @returns {*} - Returns the result.
     */
    public get(name: string, sheetIndex?: number): DefinedName | undefined {
        const idx: number = this.findIndex(name, sheetIndex);
        if (idx < 0) {
            return undefined;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: DefinedNameEntry = this.entries[idx];
        return entry === undefined ? undefined : toPublic(entry);
    }

    /**
     * Add or replace a defined name. Sole public defined-name write surface (API-RULES R1.5). Citations: ECMA-376-1 §18.2.5; docs/specs/defined-names.md; API-RULES R1.5.
     *
     * @param {string} name - The name parameter.
     * @param {string} content - The content parameter.
     * @param {number} sheetIndex - The sheetIndex parameter.
     * @param {boolean} hidden - The hidden parameter.
     * @returns {DefinedName} - Returns the result.
     */
    public add(name: string, content: string, sheetIndex?: number, hidden?: boolean): DefinedName {
        this.set(name, content, sheetIndex, hidden);
        const found: DefinedName = this.get(name.trim(), sheetIndex);
        if (found === undefined) {
            // set() either threw or wrote the entry; get must succeed after a successful set.
            throw new InvalidDefinedNameError('Defined name was not retained after add');
        }
        return found;
    }

    /**
     * Internal void add-or-replace. Prefer {@link DefinedNames.add}.
     *
     * @param {string} name - The name parameter.
     * @param {string} content - The content parameter.
     * @param {number} sheetIndex - The sheetIndex parameter.
     * @param {boolean} hidden - The hidden parameter.
     * @returns {void} - Returns the result.
     */
    public set(name: string, content: string, sheetIndex?: number, hidden?: boolean): void {
        const trimmedName: string = name.trim();
        if (trimmedName.length === 0) {
            throw new InvalidDefinedNameError('Defined name must be a non-empty string');
        }
        // Strip one leading `=` so API input matches Excel/ECMA name-formula wire form.
        // Citation: ECMA-376-1 §18.2.5 examples; cell parallel normalizeFormulaExpression.
        const normalizedContent: string = normalizeFormulaExpression(content);
        if (normalizedContent.trim().length === 0) {
            throw new InvalidDefinedNameError('Defined name content must be a non-empty string');
        }

        if (sheetIndex !== undefined) {
            if (!Number.isInteger(sheetIndex) || sheetIndex < 0) {
                throw new InvalidArgumentError(`sheetIndex must be a non-negative integer, got ${String(sheetIndex)}`);
            }
            const sheetCount: number = ((__t: number): number => (__t != null ? __t : Number.POSITIVE_INFINITY))(
                this.host == null ? undefined : this.host.sheetCount()
            );
            if (sheetIndex >= sheetCount) {
                throw new InvalidArgumentError(`sheetIndex ${sheetIndex} is out of range for sheet count ${sheetCount}`);
            }
        }

        const isHidden: boolean = hidden === true;
        const idx: number = this.findIndex(trimmedName, sheetIndex);
        if (idx >= 0) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const existing: DefinedNameEntry = this.entries[idx];
            if (existing === undefined) {
                return;
            }
            existing.name = trimmedName;
            existing.content = normalizedContent;
            existing.sheetIndex = sheetIndex;
            existing.hidden = isHidden;
            // Keep extraAttrsXml on replace so unknown flags round-trip when only content changes.
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }

        this.entries.push({
            name: trimmedName,
            content: normalizedContent,
            sheetIndex,
            hidden: isHidden,
            extraAttrsXml: ''
        });
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * remove method.
     *
     * @param {string} name - The name parameter.
     * @param {number} sheetIndex - The sheetIndex parameter.
     * @returns {boolean} - Returns the result.
     */
    public remove(name: string, sheetIndex?: number): boolean {
        const idx: number = this.findIndex(name, sheetIndex);
        if (idx < 0) {
            return false;
        }
        this.entries.splice(idx, 1);
        if (this.host != null) {
            this.host.markDirty();
        }
        return true;
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
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Drop sheet-local names for `deletedIndex` and decrement higher ids. Global name content is left unchanged (no formula rewrite).
     *
     * @param {number} deletedIndex - The deletedIndex parameter.
     * @returns {void} - Returns the result.
     */
    public onSheetRemoved(deletedIndex: number): void {
        if (!Number.isInteger(deletedIndex) || deletedIndex < 0) {
            return;
        }
        let changed: boolean = false;
        for (let i: number = this.entries.length - 1; i >= 0; i -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: DefinedNameEntry = this.entries[i];
            if (e === undefined || e.sheetIndex === undefined) {
                continue;
            }
            if (e.sheetIndex === deletedIndex) {
                this.entries.splice(i, 1);
                changed = true;
                continue;
            }
            if (e.sheetIndex > deletedIndex) {
                e.sheetIndex -= 1;
                changed = true;
            }
        }
        if (changed) {
            if (this.host != null) {
                this.host.markDirty();
            }
        }
    }

    /**
     * Remap sheet-local ids after a sheet reorder (`Array` move semantics).
     *
     * @param {number} fromIndex - The fromIndex parameter.
     * @param {number} toIndex - The toIndex parameter.
     * @returns {void} - Returns the result.
     */
    public onSheetMoved(fromIndex: number, toIndex: number): void {
        if (fromIndex === toIndex) {
            return;
        }
        if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
            return;
        }
        if (fromIndex < 0 || toIndex < 0) {
            return;
        }
        let changed: boolean = false;
        for (const e of this.entries) {
            if (e.sheetIndex === undefined) {
                continue;
            }
            const next: number = remapIndexAfterMove(e.sheetIndex, fromIndex, toIndex);
            if (next !== e.sheetIndex) {
                e.sheetIndex = next;
                changed = true;
            }
        }
        if (changed) {
            if (this.host != null) {
                this.host.markDirty();
            }
        }
    }

    /**
     * toEntries method.
     *
     * @returns {Object} - Returns the result.
     */
    public toEntries(): ReadonlyArray<DefinedNameEntry> {
        return this.entries.map(
            (e: DefinedNameEntry): { name: string; content: string; sheetIndex: number; hidden: boolean; extraAttrsXml: string } => ({
                name: e.name,
                content: e.content,
                sheetIndex: e.sheetIndex,
                hidden: e.hidden,
                extraAttrsXml: e.extraAttrsXml
            })
        );
    }

    /**
     * findIndex method.
     *
     * @param {string} name - The name parameter.
     * @param {number} sheetIndex - The sheetIndex parameter.
     * @returns {number} - Returns the result.
     */
    private findIndex(name: string, sheetIndex?: number): number {
        const keyName: string = name.trim();
        for (let i: number = 0; i < this.entries.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: DefinedNameEntry = this.entries[i];
            if (e === undefined) {
                continue;
            }
            if (e.name !== keyName) {
                continue;
            }
            if (sameLocalScope(e.sheetIndex, sheetIndex)) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * toPublic function.
 *
 * @param {DefinedNameEntry} e - The e parameter.
 * @returns {DefinedName} - Returns the result.
 */
function toPublic(e: DefinedNameEntry): DefinedName {
    if (e.sheetIndex !== undefined && e.hidden) {
        return {
            name: e.name,
            content: e.content,
            sheetIndex: e.sheetIndex,
            hidden: true
        };
    }
    if (e.sheetIndex !== undefined) {
        return {
            name: e.name,
            content: e.content,
            sheetIndex: e.sheetIndex
        };
    }
    if (e.hidden) {
        return {
            name: e.name,
            content: e.content,
            hidden: true
        };
    }
    return {
        name: e.name,
        content: e.content
    };
}

/**
 * sameLocalScope function.
 *
 * @param {number} a - The a parameter.
 * @param {number} b - The b parameter.
 * @returns {boolean} - Returns the result.
 */
function sameLocalScope(a: number | undefined, b: number | undefined): boolean {
    if (a === undefined && b === undefined) {
        return true;
    }
    return a === b;
}

/**
 * After moving index `from` to `to` in an array, map an old index to the new one.
 *
 * @param {number} index - The index parameter.
 * @param {number} from - The from parameter.
 * @param {number} to - The to parameter.
 * @returns {number} - Returns the result.
 */
function remapIndexAfterMove(index: number, from: number, to: number): number {
    if (index === from) {
        return to;
    }
    if (from < to) {
        // [from+1 .. to] shift left by 1
        if (index > from && index <= to) {
            return index - 1;
        }
        return index;
    }
    // to < from: [to .. from-1] shift right by 1
    if (index >= to && index < from) {
        return index + 1;
    }
    return index;
}

/**
 * Parse a `definedNames` element string into entries.
 *
 * @param {string} definedNamesXml - The definedNamesXml parameter.
 * @returns {DefinedNameEntry[]} - Returns the result.
 */
export function parseDefinedNamesXml(definedNamesXml: string): DefinedNameEntry[] {
    const inner: string = elementInner(definedNamesXml);
    const children: string[] = splitTopLevelElements(inner);
    const out: DefinedNameEntry[] = [];
    for (const child of children) {
        if (elementLocalName(child) !== 'definedName') {
            continue;
        }
        const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(child));
        const name: string = attrs.get('name');
        if (name === undefined || name.length === 0) {
            // Skip malformed entry without required name (preserve-unknown elsewhere).
            continue;
        }
        const content: string = unescapeXml(elementInnerText(child));
        let sheetIndex: number | undefined;
        const localRaw: string = attrs.get('localSheetId');
        if (localRaw !== undefined) {
            const n: number = Number.parseInt(localRaw, 10);
            if (Number.isFinite(n) && n >= 0) {
                sheetIndex = n;
            }
        }
        const hiddenRaw: string = attrs.get('hidden');
        const hidden: boolean = hiddenRaw !== undefined ? parseOnOff(hiddenRaw) : false;
        const extraAttrsXml: string = attrsToXmlExcluding(attrs, new Set(['name', 'localSheetId', 'hidden']));
        out.push({
            name,
            content,
            sheetIndex,
            hidden,
            extraAttrsXml
        });
    }
    return out;
}

/**
 * Serialize defined name entries to a `definedNames` element, or `undefined` when empty.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {string} - Returns the result.
 */
/**
 * Excel rejects `_xlnm.Print_Area` / `_xlnm.Print_Titles` when the formula is a
 * bare ref (`A1:F12`). CT_DefinedName content is ST_Formula and must be
 * sheet-qualified (`Sheet1!$A$1:$F$12`). ECMA-376-1 §18.2.5.
 */
function quoteSheetForFormula(name: string): string {
    return /^[A-Za-z_][A-Za-z0-9_.]*$/.test(name) ? name : `'${name.replace(/'/g, "''")}'`;
}

function normalizeBuiltinPrintName(name: string, content: string, sheetName: string | undefined): string {
    if (name !== '_xlnm.Print_Area' && name !== '_xlnm.Print_Titles') {
        return content;
    }
    if (sheetName === undefined || sheetName.length === 0) {
        return content;
    }
    const sheet: string = quoteSheetForFormula(sheetName);
    return content.split(',').map((part: string): string => {
        const trimmed: string = part.trim();
        if (trimmed.length === 0 || trimmed.indexOf('!') >= 0) {
            return trimmed;
        }
        const abs: string = trimmed.replace(/\$?([A-Za-z]+)\$?(\d+)/g, (_m: string, col: string, row: string): string => {
            return `$${col}$${row}`;
        });
        return `${sheet}!${abs}`;
    }).join(',');
}

export function serializeDefinedNamesXml(
    entries: ReadonlyArray<DefinedNameEntry>,
    sheetNames?: ReadonlyArray<string>
): string | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const parts: string[] = ['<definedNames>'];
    for (const e of entries) {
        const localAttr: string = e.sheetIndex !== undefined ? ` localSheetId="${e.sheetIndex}"` : '';
        const hiddenAttr: '' | ' hidden="1"' = e.hidden ? ' hidden="1"' : '';
        const extra: string = e.extraAttrsXml.length > 0 ? ` ${e.extraAttrsXml.trim()}` : '';
        // Safety net: loaded odd files may still carry a leading `=`; Excel name
        // formulas must not (ECMA-376-1 §18.2.5; [MS-OI29500] 2.1.568 / Name Formulas).
        const sheetName: string | undefined = e.sheetIndex !== undefined && sheetNames !== undefined
            ? sheetNames[e.sheetIndex]
            : undefined;
        const wireContent: string = normalizeBuiltinPrintName(e.name, normalizeFormulaExpression(e.content), sheetName);
        parts.push(`<definedName name="${escapeXml(e.name)}"${localAttr}${hiddenAttr}${extra}>${escapeXml(wireContent)}</definedName>`);
    }
    parts.push('</definedNames>');
    return parts.join('');
}

/**
 * XSD relative rank for workbook children (lower = earlier). `sheets` = 50; `definedNames` = 80.
 *
 * @param {string} localName - The localName parameter.
 * @returns {number} - Returns the result.
 */
export function workbookChildOrderRank(localName: string): number {
    switch (localName) {
    case 'fileVersion':
        return 10;
    case 'fileSharing':
        return 20;
    case 'workbookPr':
        return 30;
        // Excel revision / Markup Compatibility peers sit after workbookPr and
        // before bookViews (observed on real Excel packages; not in CT_Workbook XSD).
    case 'AlternateContent':
        return 32;
    case 'revisionPtr':
        return 35;
    case 'workbookProtection':
        return 40;
    case 'bookViews':
        return 45;
    case 'sheets':
        return 50;
    case 'functionGroups':
        return 60;
    case 'externalReferences':
        return 70;
    case 'definedNames':
        return 80;
    case 'calcPr':
        return 90;
    case 'oleSize':
        return 100;
    case 'customWorkbookViews':
        return 110;
    case 'pivotCaches':
        return 120;
    case 'smartTagPr':
        return 130;
    case 'smartTagTypes':
        return 140;
    case 'webPublishing':
        return 150;
    case 'fileRecoveryPr':
        return 160;
    case 'webPublishObjects':
        return 170;
    case 'extLst':
        return 180;
    default:
        // Unknown: keep after sheets / with late peers so modeled sheets+definedNames stay valid.
        return 175;
    }
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
 * Text content only (no child elements expected for CT_DefinedName simple content).
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInnerText(el: string): string {
    return elementInner(el);
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
 * escapeRegExp function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

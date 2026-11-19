import { pointToTwips, twipsToPoint } from '../document/length';
import { elementChildren, isWml, wmlAttr, wmlElement, WML } from '../document/wml';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { Column } from './column';
import {
    DEFAULT_COLUMN_SPACE,
    TEXT_COLUMNS_MAX,
    sectionsError,
    validateColumnCount,
    validateSectionLength
} from './section-validation';

/**
 * Ordered text columns for a section (`w:cols` / `CT_Columns`).
 *
 * Public surface is add-only: {@link count}, {@link add}, index properties, and iteration.
 * Equal-width / separator / default spacing stay internal for OOXML round-trip.
 *
 * @public
 */
export class ColumnCollection {
    private readonly items: Column[] = [];
    private equalWidthValue: boolean = true;
    private separatorValue: boolean = false;
    private spacingValue: number = DEFAULT_COLUMN_SPACE;
    /** When equal-width, schema `w:num` may exceed authored `w:col` children. */
    private equalWidthCount: number = 1;

    /**
     * @private
     */
    constructor() {
        // Default: one equal-width column (omit `w:cols` on serialize).
    }

    /**
     * Number of columns in this section.
     */
    get count(): number {
        if (this.equalWidthValue) {
            return this.equalWidthCount;
        }
        return this.items.length === 0 ? 1 : this.items.length;
    }

    /**
     * Append a column definition (switches the section to unequal widths).
     *
     * @param {number} width - Column width in points
     * @param {number} space - Space after this column in points (default: half-inch)
     * @returns {Column} The result.
     */
    add(width: number, space: number = DEFAULT_COLUMN_SPACE): Column {
        validateSectionLength(width, 'Column.width');
        validateSectionLength(space, 'Column.space');
        if (this.items.length >= TEXT_COLUMNS_MAX) {
            throw sectionsError(`text columns cannot exceed ${String(TEXT_COLUMNS_MAX)}`);
        }
        if (this.equalWidthValue) {
            // Transition: freeze equal-width into explicit columns when first unequal add occurs.
            this.equalWidthValue = false;
            if (this.items.length === 0 && this.equalWidthCount > 1) {
                // No prior authored cols — start fresh with the added column only.
                this.equalWidthCount = 1;
            }
        }
        const column: Column = new Column(width, space);
        this.items.push(column);
        return column;
    }

    /**
     * Column at zero-based index, or `undefined` when out of range.
     *
     * @param {number} index - The index.
     * @returns {Column | undefined} The result.
     */
    item(index: number): Column | undefined {
        if (!Number.isInteger(index) || index < 0) {
            return undefined;
        }
        if (this.equalWidthValue) {
            // Equal-width mode has no stable per-column objects unless previously materialized.
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            return this.items[index];
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return this.items[index];
    }

    [index: number]: Column;

    /**
     * Iterate authored column definitions (empty when equal-width with no `w:col` children).
     *
     * @returns {Iterator<Column>} The result.
     */
    [Symbol.iterator](): Iterator<Column> {
        const snapshot: Column[] = this.items.slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Column> {
                if (i >= snapshot.length) {
                    return { done: true, value: undefined as never };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Column = snapshot[i];
                i += 1;
                return { done: false, value: value as Column };
            }
        };
    }

    // —— internal OOXML state (not public API) ——

    /**
     * @private
     */
    get equalWidth(): boolean {
        return this.equalWidthValue;
    }

    /**
     * @param {boolean} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setEqualWidth(value: boolean): void {
        this.equalWidthValue = value === true;
        if (this.equalWidthValue && this.equalWidthCount < 1) {
            this.equalWidthCount = 1;
        }
    }

    /**
     * @private
     */
    get separator(): boolean {
        return this.separatorValue;
    }

    /**
     * @param {boolean} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setSeparator(value: boolean): void {
        this.separatorValue = value === true;
    }

    /**
     * @private
     */
    get spacing(): number {
        return this.spacingValue;
    }

    /**
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setSpacing(value: number): void {
        validateSectionLength(value, 'ColumnCollection.spacing');
        this.spacingValue = value;
    }

    /**
     * @param {number} count - The count.
     * @returns {void} Nothing is returned.
     * @private
     */
    setEqualWidthCount(count: number): void {
        validateColumnCount(count);
        this.equalWidthCount = count;
        this.equalWidthValue = true;
    }

    /**
     * @param {Object} options - The options.
     * @returns {void} Nothing is returned.
     * @private
     * Replace contents from a parsed `w:cols` model (atomic).
     */
    replaceFromParsed(options: {
        readonly equalWidth: boolean;
        readonly separator: boolean;
        readonly spacing: number;
        readonly count: number;
        readonly columns: ReadonlyArray<{ readonly width: number; readonly space: number }>;
    }): void {
        this.equalWidthValue = options.equalWidth;
        this.separatorValue = options.separator;
        this.spacingValue = options.spacing;
        this.equalWidthCount = options.count;
        this.items.length = 0;
        for (const column of options.columns) {
            if (column === undefined) {
                continue;
            }
            this.items.push(new Column(column.width, column.space));
        }
        if (!this.equalWidthValue && this.items.length > 0) {
            this.equalWidthCount = this.items.length;
        }
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    clearToDefault(): void {
        this.items.length = 0;
        this.equalWidthValue = true;
        this.separatorValue = false;
        this.spacingValue = DEFAULT_COLUMN_SPACE;
        this.equalWidthCount = 1;
    }

    /**
     * @returns {ColumnCollection} The result.
     * @private
     */
    cloneDeep(): ColumnCollection {
        const copy: ColumnCollection = new ColumnCollection();
        copy.replaceFromParsed({
            equalWidth: this.equalWidthValue,
            separator: this.separatorValue,
            spacing: this.spacingValue,
            count: this.equalWidthCount,
            columns: this.items.map((c: Column) => ({ width: c.width, space: c.spacing }))
        });
        return copy;
    }

    /**
     * @returns {boolean} The result.
     * @private
     * `true` when serialization may omit `w:cols` (schema default single equal column).
     */
    isDefault(): boolean {
        return (this.isDefaultTextColumns());
    }

    /**
     * @returns {boolean} The result.
     * @private
     */
    isDefaultTextColumns(): boolean {
        if (!this.equalWidthValue) {
            return false;
        }
        if (this.separatorValue) {
            return false;
        }
        if (this.equalWidthCount !== 1) {
            return false;
        }
        if ((this.spacingValue as number) !== (DEFAULT_COLUMN_SPACE as number)) {
            return false;
        }
        return this.items.length === 0;
    }

    /**
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     */
    toOpenXmlElement(): OpenXmlElement | undefined {
        if (this.isDefaultTextColumns()) {
            return undefined;
        }
        return serializeTextColumns(this);
    }
}

// Indexer implementation for `columns[i]` — assign on prototype for ES5 emit.
function defineColumnIndexAccessors(): void {
    const proto: ColumnCollection & { [k: number]: Column } = ColumnCollection.prototype as ColumnCollection & {
        [k: number]: Column | undefined;
    };
    for (let i: number = 0; i < TEXT_COLUMNS_MAX; i++) {
        const index: number = i;
        Object.defineProperty(proto, index, {
            configurable: true,
            enumerable: false,
            get(): Column | undefined {
                return (this as ColumnCollection).item(index);
            }
        });
    }
}
defineColumnIndexAccessors();

/**
 * Factory: n equal-width columns.
 *
 * @param {number} count - The count.
 * @param {number} spacing - The spacing.
 * @returns {ColumnCollection} The result.
 * @private
 */
export function equalWidthColumns(count: number, spacing: number = DEFAULT_COLUMN_SPACE): ColumnCollection {
    validateColumnCount(count);
    validateSectionLength(spacing, 'spacing');
    const cols: ColumnCollection = new ColumnCollection();
    cols.setSpacing(spacing);
    cols.setEqualWidthCount(count);
    cols.setSeparator(false);
    return cols;
}

/**
 * @param {OpenXmlElement} element - The element.
 * @returns {ColumnCollection | undefined} The result.
 * @private
 */
export function parseTextColumns(element: OpenXmlElement): ColumnCollection | undefined {
    const equalWidthRaw: string = wmlAttributeLocal(element, 'equalWidth');
    // Schema default equalWidth=true when attribute omitted.
    let equalWidth: boolean = true;
    if (equalWidthRaw !== undefined) {
        const parsed: boolean = parseOnOffAttributeLocal(equalWidthRaw);
        if (parsed === undefined) {
            return undefined;
        }
        equalWidth = parsed;
    }

    const sepRaw: string = wmlAttributeLocal(element, 'sep');
    let separator: boolean = false;
    if (sepRaw !== undefined) {
        const parsed: boolean = parseOnOffAttributeLocal(sepRaw);
        if (parsed === undefined) {
            return undefined;
        }
        separator = parsed;
    }

    let spacing: number = DEFAULT_COLUMN_SPACE;
    const spaceRaw: string = wmlAttributeLocal(element, 'space');
    if (spaceRaw !== undefined) {
        const tw: number = parseTwipsLocal(spaceRaw);
        if (tw === undefined) {
            return undefined;
        }
        spacing = twipsToPoint(tw);
    }

    let count: number = 1;
    const numRaw: string = wmlAttributeLocal(element, 'num');
    if (numRaw !== undefined) {
        if (!/^\d+$/.test(numRaw)) {
            return undefined;
        }
        count = Number.parseInt(numRaw, 10);
        if (count < 1 || count > TEXT_COLUMNS_MAX) {
            return undefined;
        }
    }

    const columns: { width: number; space: number }[] = [];
    for (const child of elementChildren(element)) {
        if (!isWml(child, 'col')) {
            // Unmodeled child → keep whole cols opaque at caller.
            return undefined;
        }
        const wRaw: string = wmlAttributeLocal(child, 'w');
        if (wRaw === undefined) {
            return undefined;
        }
        const wTw: number = parseTwipsLocal(wRaw);
        if (wTw === undefined) {
            return undefined;
        }
        let colSpace: number = DEFAULT_COLUMN_SPACE;
        const colSpaceRaw: string = wmlAttributeLocal(child, 'space');
        if (colSpaceRaw !== undefined) {
            const sTw: number = parseTwipsLocal(colSpaceRaw);
            if (sTw === undefined) {
                return undefined;
            }
            colSpace = twipsToPoint(sTw);
        }
        columns.push({ width: twipsToPoint(wTw), space: colSpace });
        if (columns.length > TEXT_COLUMNS_MAX) {
            return undefined;
        }
    }

    // When unequal and authored cols present, prefer list length as count.
    if (!equalWidth && columns.length > 0) {
        count = columns.length;
    } else if (equalWidth && columns.length === 0 && numRaw === undefined) {
        count = 1;
    }

    const result: ColumnCollection = new ColumnCollection();
    result.replaceFromParsed({
        equalWidth,
        separator,
        spacing,
        count,
        columns
    });
    return result;
}

/**
 * @param {ColumnCollection} value - The value.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTextColumns(value: ColumnCollection): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [];
    const equalWidth: boolean = value.equalWidth;
    const count: number = value.count;
    const spacing: number = value.spacing;
    const separator: boolean = value.separator;

    if (!equalWidth) {
        attrs.push(wmlAttr('equalWidth', '0'));
    }
    // Emit num when not the default single column.
    if (count !== 1) {
        attrs.push(wmlAttr('num', String(count)));
    }
    if ((spacing as number) !== (DEFAULT_COLUMN_SPACE as number)) {
        attrs.push(wmlAttr('space', String(pointToTwips(spacing))));
    }
    if (separator) {
        attrs.push(wmlAttr('sep', '1'));
    }

    const children: OpenXmlElement[] = [];
    if (!equalWidth) {
        for (const col of value) {
            const colAttrs: OpenXmlAttribute[] = [
                wmlAttr('w', String(pointToTwips(col.width)))
            ];
            if ((col.spacing as number) !== (DEFAULT_COLUMN_SPACE as number)) {
                colAttrs.push(wmlAttr('space', String(pointToTwips(col.spacing))));
            }
            children.push(wmlElement('col', { attributes: colAttrs }));
        }
    } else {
        // Equal-width may still carry residual authored `w:col` children for preservation.
        for (const col of value) {
            const colAttrs: OpenXmlAttribute[] = [
                wmlAttr('w', String(pointToTwips(col.width)))
            ];
            if ((col.spacing as number) !== (DEFAULT_COLUMN_SPACE as number)) {
                colAttrs.push(wmlAttr('space', String(pointToTwips(col.spacing))));
            }
            children.push(wmlElement('col', { attributes: colAttrs }));
        }
    }

    return wmlElement('cols', {
        attributes: attrs,
        children: children.length === 0 ? undefined : children
    });
}

function wmlAttributeLocal(el: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find(
        (a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === WML || a.namespaceUri === '')
    );
    return found == null ? undefined : found.value;
}

function parseTwipsLocal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    // Imported bound matches section-validation TWIPS_MAX via page size path; keep local for cols.
    if (n < 0 || n > 31680) {
        return undefined;
    }
    return n;
}

function parseOnOffAttributeLocal(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw.length === 0) {
        return true;
    }
    const normalized: string = raw.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}

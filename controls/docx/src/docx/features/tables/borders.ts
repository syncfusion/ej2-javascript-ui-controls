/**
 * Customer-facing table/cell border facades (`Border` / `Borders`).
 *
 * Backed by internal `TableBorder` bags; unknown `@w:val` tokens stay on the
 * wire bag and do not surface as public BorderStyle values.
 * `space` lives on Borders only (not on Border).
 */
import { objectValues } from '../../core/compat/object-compat';
import { BorderStyle } from '../document/page-setup';
import { Color, colorToHexWire, normalizeColorHex } from '../document/color';
import { TableBorder, TableBorders, TableCellBorders } from './tbl-pr';
import { borderStyleFromWire, borderStyleToWire, isKnownBorderWire } from './border-style-map';

/**
 * @private
 */
export type BorderBagHost = {
    readEdge(key: BorderEdgeKey): TableBorder | undefined;
    writeEdge(key: BorderEdgeKey, edge: TableBorder | undefined): void;
};

/**
 * Keys for outer and inside edges (no diagonals on the public surface).
 *
 * @private
 */
export type BorderEdgeKey = 'top' | 'bottom' | 'left' | 'right' | 'insideH' | 'insideV';

/**
 * Mutable edge record used while rewriting a border bag.
 *
 * @private
 */
export interface MutableBorderEdges {
    top?: TableBorder;
    left?: TableBorder;
    bottom?: TableBorder;
    right?: TableBorder;
    insideH?: TableBorder;
    insideV?: TableBorder;
}

/**
 * Reads one edge from a border bag by explicit property access.
 *
 * @param {TableBorders} bag - The border bag.
 * @param {BorderEdgeKey} key - The edge to read.
 * @returns {TableBorder | undefined} The edge, or `undefined` when absent.
 * @private
 */
export function readBorderEdge(bag: TableBorders, key: BorderEdgeKey): TableBorder | undefined {
    switch (key) {
    case 'top':
        return bag.top;
    case 'bottom':
        return bag.bottom;
    case 'left':
        return bag.left;
    case 'right':
        return bag.right;
    case 'insideH':
        return bag.insideH;
    default:
        return bag.insideV;
    }
}

/**
 * Sets (or, when `edge` is `undefined`, removes) one edge on a mutable border record.
 *
 * @param {MutableBorderEdges} bag - The mutable edge record.
 * @param {BorderEdgeKey} key - The edge to write.
 * @param {TableBorder | undefined} edge - The new edge, or `undefined` to remove the property.
 * @returns {void} Nothing is returned.
 * @private
 */
export function writeBorderEdge(bag: MutableBorderEdges, key: BorderEdgeKey, edge: TableBorder | undefined): void {
    switch (key) {
    case 'top':
        if (edge === undefined) { delete bag.top; } else { bag.top = edge; }
        break;
    case 'bottom':
        if (edge === undefined) { delete bag.bottom; } else { bag.bottom = edge; }
        break;
    case 'left':
        if (edge === undefined) { delete bag.left; } else { bag.left = edge; }
        break;
    case 'right':
        if (edge === undefined) { delete bag.right; } else { bag.right = edge; }
        break;
    case 'insideH':
        if (edge === undefined) { delete bag.insideH; } else { bag.insideH = edge; }
        break;
    default:
        if (edge === undefined) { delete bag.insideV; } else { bag.insideV = edge; }
        break;
    }
}

const ALL_EDGE_KEYS: BorderEdgeKey[] = ['top', 'bottom', 'left', 'right', 'insideH', 'insideV'];
const OUTER_EDGE_KEYS: BorderEdgeKey[] = ['top', 'bottom', 'left', 'right'];

const DEFAULT_BORDER_TYPE: BorderStyle.None = BorderStyle.None;
const DEFAULT_COLOR: string = 'auto';
const DEFAULT_LINE_WIDTH: number = 0;
const DEFAULT_SPACE: number = 0;
const DEFAULT_SHADOW: boolean = false;

function requireFiniteNonNegative(value: number, label: string): void {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) {
        throw new RangeError(label + ' must be a finite non-negative number');
    }
}

function isBorderStyleValue(value: unknown): value is BorderStyle {
    if (typeof value !== 'string') {
        return false;
    }
    if (isKnownBorderWire(value)) {
        return true;
    }
    if (borderStyleFromWire(value) !== undefined) {
        return true;
    }
    return objectValues(BorderStyle as unknown as { [key: string]: string }).indexOf(value) !== -1;
}

/**
 * Normalize border color input to OOXML wire (`RRGGBB` / `'auto'`).
 * {@link Color} becomes hex; {@link Color.Transparent} maps to `'auto'`.
 * Strings may include a leading `#`.
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
    if (typeof value !== 'string') {
        throw new RangeError('Border color must be a string, Color, or hex color');
    }
    const raw: string = value.trim();
    if (raw.length === 0) {
        throw new RangeError('Border color must be a non-empty string');
    }
    if (raw.toLowerCase() === 'auto') {
        return 'auto';
    }
    const hex: string = normalizeColorHex(raw);
    if (hex !== undefined) {
        return hex;
    }
    // Preserve unknown loaded tokens for round-trip (e.g. theme-ish values).
    return value;
}

/**
 * One border edge.
 *
 * @public
 */
export class Border {
    private readonly host: BorderBagHost;
    private readonly key: BorderEdgeKey;

    /**
     * @param {BorderBagHost} host - The host.
     * @param {BorderEdgeKey} key - The key.
     * @private
     */
    constructor(host: BorderBagHost, key: BorderEdgeKey) {
        this.host = host;
        this.key = key;
    }

    private current(): TableBorder {
        const edge: TableBorder = this.host.readEdge(this.key);
        return edge !== undefined ? edge : {};
    }

    private commit(next: TableBorder): void {
        const has: boolean =
            next.style !== undefined ||
            next.color !== undefined ||
            next.size !== undefined ||
            next.space !== undefined ||
            next.shadow !== undefined;
        this.host.writeEdge(this.key, has ? next : undefined);
    }

    /**
     * Wire `@w:val` for commits. When the edge has no style yet, default to
     * `'single'` so color/size/space/shadow survive `serializeBorderEdge`
     * (which requires `w:val`) and round-trip through tblPr XML — same as
     * paragraph border faces.
     *
     * @param {TableBorder} cur - The cur.
     * @returns {string} The result.
     * @private
     */
    private styleWireForCommit(cur: TableBorder): string {
        return cur.style !== undefined ? cur.style : 'single';
    }

    /** Line style. Unknown loaded values return the public default and round-trip. */
    get borderType(): BorderStyle {
        const style: string = this.current().style;
        if (style === undefined) {
            return DEFAULT_BORDER_TYPE;
        }
        const mapped: BorderStyle = borderStyleFromWire(style);
        return mapped !== undefined ? mapped : DEFAULT_BORDER_TYPE;
    }
    set borderType(value: BorderStyle) {
        if (!isBorderStyleValue(value)) {
            throw new RangeError('Unsupported BorderStyle value');
        }
        const cur: TableBorder = this.current();
        this.commit({
            style: borderStyleToWire(value),
            color: cur.color,
            size: cur.size,
            space: cur.space,
            shadow: cur.shadow
        });
    }

    /**
     * Hex RGB or `'auto'`.
     * Setter also accepts a {@link Color} enum value and optional leading `#` on hex strings.
     * Getter always returns the OOXML wire string.
     * Setting color without a prior `borderType` defaults the edge to single so the edge serializes.
     */
    get color(): string | Color {
        const c: string = this.current().color;
        return c !== undefined ? c : DEFAULT_COLOR;
    }
    set color(value: string | Color) {
        const wire: string = borderColorToWire(value);
        const cur: TableBorder = this.current();
        this.commit({
            style: this.styleWireForCommit(cur),
            color: wire,
            size: cur.size,
            space: cur.space,
            shadow: cur.shadow
        });
    }

    /**
     * Thickness in points (public); stored as eighths of a point on the wire.
     * Setting lineWidth without a prior `borderType` defaults the edge to single so the edge serializes.
     */
    get lineWidth(): number {
        const size: number = this.current().size;
        return size !== undefined ? size / 8 : DEFAULT_LINE_WIDTH;
    }
    set lineWidth(value: number) {
        requireFiniteNonNegative(value, 'Border lineWidth');
        const cur: TableBorder = this.current();
        this.commit({
            style: this.styleWireForCommit(cur),
            color: cur.color,
            size: Math.round(value * 8),
            space: cur.space,
            shadow: cur.shadow
        });
    }

    /** Shadow flag (`w:shadow`). */
    get shadow(): boolean {
        const s: boolean = this.current().shadow;
        return s !== undefined ? s : DEFAULT_SHADOW;
    }
    set shadow(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new RangeError('Border shadow must be a boolean');
        }
        const cur: TableBorder = this.current();
        this.commit({
            style: this.styleWireForCommit(cur),
            color: cur.color,
            size: cur.size,
            space: cur.space,
            shadow: value
        });
    }

    /**
     * @returns {number} The result.
     * @private
     * Internal edge space (points) used by Borders.space.
     */
    readSpacePoints(): number {
        const s: number = this.current().space;
        return s !== undefined ? s : DEFAULT_SPACE;
    }

    /**
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeSpacePoints(value: number): void {
        requireFiniteNonNegative(value, 'Borders space');
        const cur: TableBorder = this.current();
        this.commit({
            style: this.styleWireForCommit(cur),
            color: cur.color,
            size: cur.size,
            space: value,
            shadow: cur.shadow
        });
    }
}

/**
 * Aggregate borders for a table or cell (no public diagonals).
 *
 * @public
 */
export class Borders {
    private readonly host: BorderBagHost;
    private readonly topBorder: Border;
    private readonly bottomBorder: Border;
    private readonly leftBorder: Border;
    private readonly rightBorder: Border;
    private readonly horizontalBorder: Border;
    private readonly verticalBorder: Border;
    private readonly includeInside: boolean;

    /**
     * @param {BorderBagHost} host - The host.
     * @param {boolean} includeInside - The include inside.
     * @private
     */
    constructor(host: BorderBagHost, includeInside: boolean = true) {
        this.host = host;
        this.includeInside = includeInside;
        this.topBorder = new Border(host, 'top');
        this.bottomBorder = new Border(host, 'bottom');
        this.leftBorder = new Border(host, 'left');
        this.rightBorder = new Border(host, 'right');
        this.horizontalBorder = new Border(host, 'insideH');
        this.verticalBorder = new Border(host, 'insideV');
    }

    get top(): Border {
        return this.topBorder;
    }
    get bottom(): Border {
        return this.bottomBorder;
    }
    get left(): Border {
        return this.leftBorder;
    }
    get right(): Border {
        return this.rightBorder;
    }
    get horizontal(): Border {
        return this.horizontalBorder;
    }
    get vertical(): Border {
        return this.verticalBorder;
    }

    private aggregateKeys(): BorderEdgeKey[] {
        return this.includeInside ? ALL_EDGE_KEYS : OUTER_EDGE_KEYS;
    }

    private edgeAt(key: BorderEdgeKey): Border {
        return new Border(this.host, key);
    }

    /**
     * Common border type across applicable edges.
     * Mixed or absent edges return the public default (BorderStyle.None).
     */
    get borderType(): BorderStyle {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        let common: BorderStyle | undefined;
        let saw: boolean = false;
        for (const key of keys) {
            const t: BorderStyle = this.edgeAt(key).borderType;
            if (!saw) {
                common = t;
                saw = true;
            } else if (t !== common) {
                return DEFAULT_BORDER_TYPE;
            }
        }
        return common !== undefined ? common : DEFAULT_BORDER_TYPE;
    }
    set borderType(value: BorderStyle) {
        if (!isBorderStyleValue(value)) {
            throw new RangeError('Unsupported BorderStyle value');
        }
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        for (const key of keys) {
            this.edgeAt(key).borderType = value;
        }
    }

    /**
     * Common border color across applicable edges.
     * Mixed edges return the public default (`'auto'`).
     * Setter accepts hex/`'auto'`, optional leading `#`, or a {@link Color} enum value.
     */
    get color(): string | Color {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        let common: string | undefined;
        let saw: boolean = false;
        for (const key of keys) {
            const c: string | Color = this.edgeAt(key).color;
            if (!saw) {
                common = c as string;
                saw = true;
            } else if (c !== common) {
                return DEFAULT_COLOR;
            }
        }
        return common !== undefined ? common : DEFAULT_COLOR;
    }
    set color(value: string | Color) {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        for (const key of keys) {
            this.edgeAt(key).color = value;
        }
    }

    get lineWidth(): number {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        let common: number | undefined;
        let saw: boolean = false;
        for (const key of keys) {
            const w: number = this.edgeAt(key).lineWidth;
            if (!saw) {
                common = w;
                saw = true;
            } else if (w !== common) {
                return DEFAULT_LINE_WIDTH;
            }
        }
        return common !== undefined ? common : DEFAULT_LINE_WIDTH;
    }
    set lineWidth(value: number) {
        requireFiniteNonNegative(value, 'Borders lineWidth');
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        for (const key of keys) {
            this.edgeAt(key).lineWidth = value;
        }
    }

    /**
     * Common edge w:space (points) across applicable edges.
     * Mixed values return the public default 0.
     */
    get space(): number {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        let common: number | undefined;
        let saw: boolean = false;
        for (const key of keys) {
            const s: number = this.edgeAt(key).readSpacePoints();
            if (!saw) {
                common = s;
                saw = true;
            } else if (s !== common) {
                return DEFAULT_SPACE;
            }
        }
        return common !== undefined ? common : DEFAULT_SPACE;
    }
    set space(value: number) {
        requireFiniteNonNegative(value, 'Borders space');
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        for (const key of keys) {
            this.edgeAt(key).writeSpacePoints(value);
        }
    }

    get shadow(): boolean {
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        let common: boolean | undefined;
        let saw: boolean = false;
        for (const keyItem9 of keys) {
            const s: boolean = this.edgeAt(keyItem9!).shadow;
            if (!saw) {
                common = s;
                saw = true;
            } else if (s !== common) {
                return DEFAULT_SHADOW;
            }
        }
        return common !== undefined ? common : DEFAULT_SHADOW;
    }
    set shadow(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new RangeError('Borders shadow must be a boolean');
        }
        const keys: BorderEdgeKey[] = this.aggregateKeys();
        for (const keyItem9 of keys) {
            this.edgeAt(keyItem9!).shadow = value;
        }
    }
}

/**
 * Host that reads/writes a full TableBorders bag via callbacks.
 *
 * @param {Function} read - The read.
 * @param {Function} write - The write.
 * @returns {BorderBagHost} The result.
 * @private
 */
export function createTableBordersHost(
    read: () => TableBorders | undefined,
    write: (value: TableBorders | undefined) => void
): BorderBagHost {
    return {
        readEdge(key: BorderEdgeKey): TableBorder | undefined {
            const bag: TableBorders = read();
            if (bag === undefined) {
                return undefined;
            }
            return readBorderEdge(bag, key);
        },
        writeEdge(key: BorderEdgeKey, edge: TableBorder | undefined): void {
            const prev: TableBorders = read();
            const next: TableBorders = prev !== undefined ? { ...prev } : {};
            writeBorderEdge(next as MutableBorderEdges, key, edge);
            const has: boolean =
                next.top !== undefined ||
                next.bottom !== undefined ||
                next.left !== undefined ||
                next.right !== undefined ||
                next.insideH !== undefined ||
                next.insideV !== undefined;
            write(has ? next : undefined);
        }
    };
}

/**
 * Host for cell borders; preserves diagonal edges when rewriting.
 *
 * @param {Function} read - The read.
 * @param {Function} write - The write.
 * @returns {BorderBagHost} The result.
 * @private
 */
export function createCellBordersHost(
    read: () => TableCellBorders | undefined,
    write: (value: TableCellBorders | undefined) => void
): BorderBagHost {
    return {
        readEdge(key: BorderEdgeKey): TableBorder | undefined {
            const bag: TableCellBorders = read();
            if (bag === undefined) {
                return undefined;
            }
            return readBorderEdge(bag, key);
        },
        writeEdge(key: BorderEdgeKey, edge: TableBorder | undefined): void {
            const prev: TableCellBorders = read();
            const next: TableCellBorders = prev !== undefined ? { ...prev } : {};
            writeBorderEdge(next as MutableBorderEdges, key, edge);
            const has: boolean =
                next.top !== undefined ||
                next.bottom !== undefined ||
                next.left !== undefined ||
                next.right !== undefined ||
                next.insideH !== undefined ||
                next.insideV !== undefined ||
                next.tl2br !== undefined ||
                next.tr2bl !== undefined;
            write(has ? next : undefined);
        }
    };
}

/**
 * Create an inline DrawingML table on a slide (`addTable`).
 *
 * @remarks
 * Algorithm (spec 038 / TASK-1082):
 * 1. Validate options (`TablesError` before any DOM write).
 * 2. Enforce `shapesPerSlide`.
 * 3. Allocate **new** `cNvPr/@id` only ({@link allocateNextDrawingElementId}).
 * 4. Build seed via {@link buildTableGraphicFrame} (TASK-1081).
 * 5. Append `p:graphicFrame` under `p:spTree`.
 * 6. Return live {@link Table} (sync; inline `a:tbl`, no package parts).
 *
 * Citations: req/spec **038**; ADR `2026-09-22-table-create-structural`;
 * TASK-1080 lock; `pml.xsd` `CT_GraphicalObjectFrame`; `dml-main.xsd` `CT_Table`.
 *
 * @internal
 */
import { InvalidPackageError, PackageLimitError } from '../../core/security/errors';
import { allocateNextDrawingElementId } from '../../core/shapes/drawing-element-id';
import { asMutable } from '../../core/shapes/dom-utils';
import { findSpTree, ShapeBounds } from '../../core/shapes/add-text-box';
import { Shape } from '../../core/shapes/shape';
import { walkSlideShapeTree } from '../../core/shapes/walk';
import { Slide } from '../../core/slideimplementation/slide';
import { arrayAt, objectGet } from '../../core/util/es5-compat';
import { asTable } from './as-table';
import { BuiltInTableStyle, isBuiltInTableStyle } from './built-in-table-style';
import { builtinTableStyleGuid } from './builtin-table-style-ids';
import { DEFAULT_TABLE_BOUNDS, DEFAULT_TABLE_NAME, buildTableGraphicFrame } from './create-table-seed';
import { partNameOptions, TablesError } from './errors';
import { Table } from './table';
import { OoxmlElement } from '../../core/xml/dom';
import { SecurityLimits } from '../../core/security/limits';
/**
 * Options for {@link addTable} / `slide.shapes.addTable`.
 *
 * @remarks
 * Locked TASK-1080. Both `rows` and `columns` required (integer ≥ 1). `bounds` is
 * the existing points-based {@link ShapeBounds} used by shapes/charts
 * (`x`/`y`/`width`/`height`).
 *
 * @public
 */
export interface AddTableOptions {
    /** Row count (integer ≥ 1). */
    readonly rows: number;
    /** Column count (integer ≥ 1). */
    readonly columns: number;
    /**
     * Frame transform in **points** (`a:off` / `a:ext` via seed `p:xfrm` EMU).
     * When omitted, uses {@link DEFAULT_TABLE_BOUNDS} (SF-cited extents).
     */
    readonly bounds?: ShapeBounds;
    /**
     * Per-row heights in **points** (written as `a:tr/@h` EMU). Omitted or empty
     * → equal-split of frame height. When set with length > 0, length must equal
     * `rows`; each value must be a finite number of points that converts to
     * integer EMU ≥ 1.
     */
    readonly rowHeights?: ReadonlyArray<number>;
    /**
     * Per-column widths in **points** (written as `a:gridCol/@w` EMU). Omitted or
     * empty → equal-split of frame width. When set with length > 0, length must
     * equal `columns`; each value must convert to integer EMU ≥ 1.
     */
    readonly columnWidths?: ReadonlyArray<number>;
    /**
     * `a:tableStyleId` GUID text. Default seed uses create-skeleton
     * `DEFAULT_TABLE_STYLE_LIST_DEF` when omitted.
     */
    readonly tableStyleId?: string;
    /**
     * Cited gallery member. Writes the matching `a:tableStyleId`. Must not
     * disagree with `tableStyleId` when both are set. `none` and `custom` are
     * rejected at create time.
     */
    readonly builtInStyle?: BuiltInTableStyle;
    /** `cNvPr/@name`. @defaultValue `"Table"` */
    readonly title?: string;
}
/**
 * Appends an inline table graphic frame under the slide `p:spTree`.
 *
 * @throws {Error} When options fail validation (before DOM write).
 * @throws {Error} When `shapesPerSlide` would be exceeded.
 * @throws {Error} When `p:spTree` is missing.
 * @throws {RangeError} When drawing element id space is exhausted.
 * @public
 * @param {Slide} slide - Live slide.
 * @param {AddTableOptions} options - Grid dimensions and optional bounds/name/style/widths.
 * @returns {Table} Bound {@link Table} on the live `a:tbl`.
 */
export function addTable(slide: Slide, options: AddTableOptions): Table {
    const partOpts: { readonly partName?: string; } = partNameOptions(slide.partName);
    validateAddTableOptions(options, partOpts);
    const resolvedStyleId: string | undefined = resolveCreateStyleId(options, partOpts);
    const root: OoxmlElement = slide.getRoot();
    const limits: SecurityLimits = slide.getLimits();
    const spTree: OoxmlElement = findSpTree(root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot add table', {
            partName: slide.partName
        });
    }
    const existingShapes: Array<Shape> = walkSlideShapeTree(root, limits, slide.partName, undefined, (): void => {
        slide.notifyMutate();
    });
    if (existingShapes.length >= limits.shapesPerSlide) {
        throw new PackageLimitError('shapesPerSlide', {
            partName: slide.partName,
            actual: existingShapes.length + 1
        });
    }
    const id: string = allocateNextDrawingElementId(root);
    const name: string = (options.title !== null && options.title !== undefined ? options.title : DEFAULT_TABLE_NAME);
    const bounds: ShapeBounds = (options.bounds !== null && options.bounds !== undefined ? options.bounds : DEFAULT_TABLE_BOUNDS);
    const frame: OoxmlElement = buildTableGraphicFrame({
        id,
        name,
        bounds,
        rows: options.rows,
        columns: options.columns,
        ...(options.rowHeights !== undefined ? { rowHeights: options.rowHeights } : {}),
        ...(options.columnWidths !== undefined ? { columnWidths: options.columnWidths } : {}),
        ...(resolvedStyleId !== undefined ? { tableStyleId: resolvedStyleId } : {})
    });
    asMutable(spTree).children.push(frame);
    slide.notifyMutate();
    const shape: Shape = Shape.create(frame, 'graphicFrame', id, name, limits, slide.partName, slide.getMediaAccess(), 0, (): void => {
        slide.notifyMutate();
    }, slide.getRoot(), [spTree]);
    const table: Table = shape instanceof Table ? shape : asTable(shape); 
    if (table === undefined) {
        throw new TablesError('Failed to bind newly added table graphicFrame', partOpts);
    }
    return table;
}
/**
 * @param {AddTableOptions} options - The options value.
 * @param {object} partOpts - The partOpts value.
 * @param {*} partOpts.partName - The partOpts.partName value.
 * @returns {void} Nothing.
 */
function validateAddTableOptions(options: AddTableOptions, partOpts: {
    readonly partName?: string;
}): void {
    if (!Number.isInteger(options.rows) || options.rows < 1) {
        throw new TablesError('addTable rows must be an integer >= 1', partOpts);
    }
    if (!Number.isInteger(options.columns) || options.columns < 1) {
        throw new TablesError('addTable columns must be an integer >= 1', partOpts);
    }
    if (options.bounds !== undefined) {
        validateBounds(options.bounds, partOpts);
    }
    if (options.rowHeights !== undefined && options.rowHeights.length > 0) {
        validatePositivePointsArray(options.rowHeights, options.rows, 'rowHeights', partOpts);
    }
    if (options.columnWidths !== undefined && options.columnWidths.length > 0) {
        validatePositivePointsArray(options.columnWidths, options.columns, 'columnWidths', partOpts);
    }
    if (options.title !== undefined && typeof options.title !== 'string') {
        throw new TablesError('addTable name must be a string when provided', partOpts);
    }
    if (options.tableStyleId !== undefined && typeof options.tableStyleId !== 'string') {
        throw new TablesError('addTable tableStyleId must be a string when provided', partOpts);
    }
}

/**
 * Resolves the create-time style id before any DOM write.
 *
 * Omitted `builtInStyle` leaves the seed default (or the raw `tableStyleId`) alone.
 * A cited member must agree with `tableStyleId` when both are set.
 *
 * @param options - Caller options.
 * @param partOpts - Part name for {@link TablesError}.
 * @returns Style id to pass to the seed, or `undefined` to keep the seed default.
 */
function resolveCreateStyleId(options: AddTableOptions, partOpts: { readonly partName?: string }): string | undefined {
    if (options.builtInStyle === undefined) {
        return options.tableStyleId;
    }
    if (!isBuiltInTableStyle(options.builtInStyle) || options.builtInStyle === BuiltInTableStyle.custom
        || options.builtInStyle === BuiltInTableStyle.none) {
        throw new TablesError('addTable builtInStyle must be a cited BuiltInTableStyle member', partOpts);
    }
    const cited: string | undefined = builtinTableStyleGuid(options.builtInStyle);
    if (cited === undefined) {
        throw new TablesError(
            'addTable builtInStyle ' + options.builtInStyle + ' has no cited tableStyleId (TASK-1110)',
            partOpts);
    }
    if (options.tableStyleId !== undefined && options.tableStyleId.toUpperCase() !== cited.toUpperCase()) {
        throw new TablesError('addTable builtInStyle and tableStyleId disagree', partOpts);
    }
    return cited;
}
/**
 * @param {ShapeBounds} bounds - The bounds value.
 * @param {object} partOpts - The partOpts value.
 * @param {*} partOpts.partName - The partOpts.partName value.
 * @returns {void} Nothing.
 */
function validateBounds(bounds: ShapeBounds, partOpts: {
    readonly partName?: string;
}): void {
    const labels: (keyof ShapeBounds)[] = ['x', 'y', 'width', 'height'];
    for (let i: number = 0; i < labels.length; i++) {
        const key: string = arrayAt(labels, i);
        const raw: string | number | undefined = objectGet<string | number>(bounds, String(key));
        if (typeof raw !== 'number' && typeof raw !== 'string') {
            throw new TablesError(`addTable bounds.${String(key)} must be a number or decimal string`, partOpts);
        }
        if (typeof raw === 'number') {
            if (!Number.isFinite(raw)) {
                throw new TablesError(`addTable bounds.${String(key)} must be a finite number of points`, partOpts);
            }
            if ((key === 'width' || key === 'height') && raw <= 0) {
                throw new TablesError(`addTable bounds.${String(key)} must be a positive number of points`, partOpts);
            }
        }
        else {
            const n: number = Number(raw);
            if (!Number.isFinite(n)) {
                throw new TablesError(`addTable bounds.${String(key)} must be a finite EMU decimal string`, partOpts);
            }
            if ((key === 'width' || key === 'height') && (!Number.isInteger(n) || n < 1)) {
                throw new TablesError(`addTable bounds.${String(key)} EMU string must be an integer >= 1`, partOpts);
            }
            if ((key === 'x' || key === 'y') && !Number.isInteger(n)) {
                throw new TablesError(`addTable bounds.${String(key)} EMU string must be an integer`, partOpts);
            }
        }

    }
}
/**
 * @param {*} values - The values value.
 * @param {number} expectedLength - The expectedLength value.
 * @param {string} label - The label value.
 * @param {object} partOpts - The partOpts value.
 * @param {*} partOpts.partName - The partOpts.partName value.
 * @returns {void} Nothing.
 */
function validatePositivePointsArray(values: ReadonlyArray<number>, expectedLength: number, label: string, partOpts: {
    readonly partName?: string;
}): void {
    if (values.length !== expectedLength) {
        throw new TablesError(`addTable ${label} length ${String(values.length)} must equal dimension ${String(expectedLength)}`,
                              partOpts);
    }
    for (let i: number = 0; i < values.length; i += 1) {
        const v: number | undefined = arrayAt(values, i);
        if (v === undefined || typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
            throw new TablesError(`addTable ${label}[${String(i)}] must be a finite positive number of points`, partOpts);
        }
    }
}

/**
 * Chart-local cell grid used as the dual-write sheet (not a live host workbook).
 *
 * @remarks
 * Satisfies {@link HostWorksheet} `name` / `getCell` so cache enrichment and
 * formula writes stay synchronous. `addChart` throws — host charts are built
 * with {@link createWorkbook}, not on this grid.
 *
 * @internal
 */
import { ChartsError } from './errors';
import { HostChart, HostWorksheet, HostWorksheetCell } from './xlsx-chart-api';
import { getXlsxRootRequired } from './xlsx-surface';
import { getXlsxChartHostApi } from './xlsx-chart-api';
/**
 * Cell value stored on the chart-local grid.
 *
 * @public
 */
export type ChartCellValue = string | number | boolean | Date | null | undefined;
/**
 * Mutable A1 cell backed by a map.
 */
class LocalCell implements HostWorksheetCell {
    /** Current value. */
    value: ChartCellValue;
    /**
     * @param {ChartCellValue} initial - Starting value.
     */
    constructor(initial: ChartCellValue) {
        this.value = initial;
    }
}
/**
 * In-memory worksheet for chart dual-write cells.
 *
 * @internal
 */
export class ChartCellSheet implements HostWorksheet {
    private readonly cells: Map<string, LocalCell> = new Map<string, LocalCell>();
    /**
     * @param {string} name - Tab name written into embedding `sheet/@name`.
     */
    constructor(readonly name: string) {
    }
    /**
     * @param {string} address - A1 address.
     * @returns {HostWorksheetCell} Mutable cell (created on demand).
     */
    getCell(address: string): HostWorksheetCell {
        const key: string = address.trim().toUpperCase();
        const existing: LocalCell | undefined = this.cells.get(key);
        if (existing !== undefined) {
            return existing;
        }
        const created: LocalCell = new LocalCell(undefined);
        this.cells.set(key, created);
        return created;
    }
    /**
     * Creates a host chart on a real worksheet that mirrors this grid.
     *
     * @remarks Refresh and loaded-deck edits call `sheet.addChart`. The cell
     * map stays the dual-write authority; the host worksheet is only the engine
     * binding. Cell values are copied across before the chart is created.
     * @param {string} chartType - Engine chart type.
     * @param {number} row - Anchor row.
     * @param {number} column - Anchor column.
     * @param {number} height - Anchor height.
     * @param {number} width - Anchor width.
     * @param {string} categoryRange - Category A1 range.
     * @param {string} valueRange - Value A1 range.
     * @returns {HostChart} Engine chart bound to the mirrored host sheet.
     */
    addChart(chartType: string, row: number, column: number, height: number, width: number,
             categoryRange: string, valueRange: string): HostChart {
        const api = getXlsxChartHostApi(getXlsxRootRequired());
        const hostSheet: HostWorksheet | undefined = api.createWorkbook().worksheets[0];
        if (hostSheet === undefined) {
            throw new ChartsError('Workbook has no worksheets');
        }
        const occupied = this.occupiedCells();
        for (let i: number = 0; i < occupied.length; i++) {
            const cell = occupied[i];
            hostSheet.getCell(columnLetters(cell.col) + String(cell.row)).value = cell.value;
        }
        return hostSheet.addChart(chartType, row, column, height, width, categoryRange, valueRange);
    }
    /**
     * Snapshot of cells that have a value, for the embedding writer.
     *
     * @returns {ReadonlyArray<{ col: number; row: number; value: ChartCellValue }>} Occupied cells.
     */
    occupiedCells(): ReadonlyArray<{ col: number; row: number; value: ChartCellValue }> {
        const out: Array<{ col: number; row: number; value: ChartCellValue }> = [];
        const keys: string[] = Array.from(this.cells.keys());
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i];
            const cell: LocalCell | undefined = this.cells.get(key);
            if (cell === undefined || cell.value === undefined || cell.value === null) {
                continue;
            }
            const parsed: { col: number; row: number } | undefined = parseA1(key);
            if (parsed === undefined) {
                continue;
            }
            out.push({ col: parsed.col, row: parsed.row, value: cell.value });
        }
        return out;
    }
}
/**
 *
 * @param {string} address - A1.
 * @returns {{ col: number; row: number } | undefined} Parsed address.
 */
function columnLetters(col0: number): string {
    let n: number = col0 + 1;
    let letters: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        letters = String.fromCharCode(65 + rem) + letters;
        n = Math.floor((n - 1) / 26);
    }
    return letters;
}
function parseA1(address: string): { col: number; row: number } | undefined {
    const m: RegExpExecArray | null = /^([A-Z]+)([1-9][0-9]*)$/.exec(address);
    if (m === null || m[1] === undefined || m[2] === undefined) {
        return undefined;
    }
    let n: number = 0;
    const letters: string = m[1];
    for (let i: number = 0; i < letters.length; i++) {
        n = n * 26 + (letters.charCodeAt(i) - 64);
    }
    return { col: n - 1, row: Number.parseInt(m[2], 10) };
}

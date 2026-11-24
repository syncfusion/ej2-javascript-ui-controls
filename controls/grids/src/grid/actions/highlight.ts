import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { IGrid, IAction, CellSaveArgs, FlashOptions, SaveEventArgs } from '../base/interface';
import { HighlightSettingsModel } from '../models/highlight-settings';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { HighlightService } from '../services/highlight-service';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { addRemoveEventListener } from '../base/util';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';

type CellValue = string | number | boolean | Date | null;
type RecordKey = string | number;

/** Child property classes keep their values in `properties`. */
interface ChildPropertyLike {
    properties?: HighlightSettingsModel;
}

/**
 * The `Highlight` module is used to handle cell and row highlighting when data changes.
 * It uses the HighlightService to compare old and new data, and applies CSS animations.
 *
 * @hidden
 */
export class Highlight implements IAction {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private highlightService: HighlightService;
    private evtHandlers: Array<{event: string; handler: Function}> = [];

    /**
     * Constructor for the Grid highlight module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the service locator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        initializeTelemetryFeature('Highlight', 'DataGrid');
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.highlightService = new HighlightService(this.parent);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} The module name
     * @private
     */
    public getModuleName(): string {
        return 'highlight';
    }

    /**
     * For internal use only - Get the Highlight service instance.
     *
     * @returns {HighlightService} The highlight service
     * @hidden
     */
    public getService(): HighlightService {
        return this.highlightService;
    }

    /**
     * For internal use only - Wrap grid methods for highlighting.
     * This implements Strategy B: method wrapping for programmatic updates.
     * Methods are wrapped unconditionally; the decision to highlight is made in the handlers.
     *
     * @returns {void}
     * @hidden
     */
    public wrapGridMethods(): void {
        // Wrap setCellValue to trigger highlight - wrap unconditionally
        const originalSetCellValue: IGrid['setCellValue'] = this.parent.setCellValue.bind(this.parent);
        this.parent.setCellValue = (key: string | number, field: string, value: CellValue): void => {
            originalSetCellValue(key, field, value);
            this.onProgrammaticCellUpdate(key, field, value);
        };

        // Wrap setRowData to trigger highlight - wrap unconditionally
        const originalSetRowData: IGrid['setRowData'] = this.parent.setRowData.bind(this.parent);
        this.parent.setRowData = (key: string | number, rowData?: Object): void => {
            const previousData: Object = this.getPreviousRowData(key);
            originalSetRowData(key, rowData);
            this.onProgrammaticRowUpdate(key, rowData, previousData);
        };
    }

    /**
     * Handle programmatic cell updates (Strategy B).
     *
     * @param {string | number} key - The primary key
     * @param {string} field - The field name
     * @param {CellValue} value - The new value
     * @returns {void}
     * @private
     */
    private onProgrammaticCellUpdate(key: string | number, field: string, value: CellValue): void {
        const settings: HighlightSettingsModel = this.parent.highlightSettings;
        if (isNullOrUndefined(settings) || !this.shouldHighlightColumn(this.parent.getColumnIndexByField(field))) {
            return;
        }

        // Find the row with this key
        const pkName: string = this.parent.getPrimaryKeyFieldNames()[0];
        const rows: Row<Column>[] = (this.parent.contentModule.getRows() as Row<Column>[]);
        // eslint-disable-next-line security/detect-object-injection
        const findRow: (r: Row<Column>) => boolean = (r: Row<Column>) => r && r.data && r.data[pkName] === key;
        const selectedRow: Row<Column> = rows.find(findRow);

        if (selectedRow) {
            const colIndex: number = this.parent.getColumnIndexByField(field);
            const cellElement: Element = this.parent.getCellFromIndex(selectedRow.index, colIndex);
            if (cellElement && cellElement instanceof HTMLElement) {
                this.highlightService.highlightCell(cellElement, selectedRow.index, colIndex, settings);
            }
        }
    }

    /**
     * Handle programmatic row updates (Strategy B).
     *
     * @param {string | number} key - The primary key
     * @param {Object} rowData - The new row data
     * @param {Object} previousData - The previous row data
     * @returns {void}
     * @private
     */
    private onProgrammaticRowUpdate(key: string | number, rowData: Object, previousData: Object): void {
        if (!this.parent.enableHighlightOnDataChange || !rowData) {
            return;
        }

        const settings: HighlightSettingsModel = this.parent.highlightSettings;
        if (isNullOrUndefined(settings)) {
            return;
        }

        // Find the row element
        const pkName: string = this.parent.getPrimaryKeyFieldNames()[0];
        const rows: Row<Column>[] = (this.parent.contentModule.getRows() as Row<Column>[]);
        // eslint-disable-next-line security/detect-object-injection
        const selectedRow: Row<Column> = rows.find((r: Row<Column>) => r.data && r.data[pkName] === key);

        if (selectedRow) {
            const rowElement: Element = this.parent.getRowByIndex(selectedRow.index);
            if (rowElement && rowElement instanceof HTMLElement) {
                // Compare and highlight changed cells
                const columns: Column[] = this.parent.getVisibleColumns();
                const onUpdateCell: (col: Column, colIndex: number) => void = (col: Column, colIndex: number) => {
                    if (!col.field) {
                        return;
                    }

                    const fieldKey: string = col.field;
                    // eslint-disable-next-line security/detect-object-injection
                    const newValue: unknown = rowData[fieldKey];
                    // eslint-disable-next-line security/detect-object-injection
                    const oldValue: unknown = previousData ? previousData[fieldKey] : undefined;

                    if (!this.valuesEqual(newValue, oldValue)) {
                        const cellElement: Element = this.parent.getCellFromIndex(selectedRow.index, colIndex);
                        if (cellElement && cellElement instanceof HTMLElement) {
                            this.highlightService.highlightCell(cellElement, selectedRow.index, colIndex, settings);
                        }
                    }
                };
                columns.forEach(onUpdateCell);
            }
        }
    }

    /**
     * Get the previous data for a row to compare with the new data.
     *
     * @param {string | number} key - The primary key
     * @returns {Object} The previous row data
     * @private
     */
    private getPreviousRowData(key: string | number): Object {
        const pkName: string = this.parent.getPrimaryKeyFieldNames()[0];
        const rows: Row<Column>[] = (this.parent.contentModule.getRows() as Row<Column>[]);
        // eslint-disable-next-line security/detect-object-injection
        const selectedRow: Row<Column> = rows.find((r: Row<Column>) => r.data && r.data[pkName] === key);

        if (selectedRow && selectedRow.data) {
            return Object.assign({}, selectedRow.data);
        }
        return null;
    }

    /**
     * Compare two values for equality.
     *
     * @param {unknown} val1 - First value
     * @param {unknown} val2 - Second value
     * @returns {boolean} True if equal
     * @private
     */
    private valuesEqual(val1: unknown, val2: unknown): boolean {
        if (isNullOrUndefined(val1) && isNullOrUndefined(val2)) {
            return true;
        }
        if (isNullOrUndefined(val1) || isNullOrUndefined(val2)) {
            return false;
        }

        if (val1 instanceof Date && val2 instanceof Date) {
            return val1.getTime() === val2.getTime();
        }

        return val1 === val2;
    }

    /**
     * Register event listeners for highlighting.
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }

        // contentReady is raised with notify(), so it uses the internal observer
        this.evtHandlers = [
            { event: events.contentReady, handler: this.onContentReady },
            { event: events.destroy, handler: this.destroy }
        ];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);

        // cellSaved, dataBound and actionComplete are raised with trigger(), which only reaches addEventListener handlers
        this.parent.addEventListener(events.cellSaved, this.onCellSaved);
        this.parent.addEventListener(events.dataBound, this.onDataBound);
        this.parent.addEventListener(events.actionComplete, this.onActionComplete);

        // Wrap grid methods for Strategy B (programmatic updates)
        this.wrapGridMethods();
    }

    /**
     * Remove event listeners (called during destroy).
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
        this.parent.removeEventListener(events.cellSaved, this.onCellSaved);
        this.parent.removeEventListener(events.dataBound, this.onDataBound);
        this.parent.removeEventListener(events.actionComplete, this.onActionComplete);
    }

    /**
     * Handle contentReady event to initialize highlight state.
     *
     * @returns {void}
     * @private
     */
    private onContentReady = (): void => {
        this.highlightService.initialize();
        this.highlightService.reapplyDetached();
    };

    /**
     * Handle dataBound event to reinitialize highlight state.
     *
     * @returns {void}
     * @private
     */
    private onDataBound = (): void => {
        this.highlightService.initialize();
    };

    /**
     * Handle actionComplete event to highlight changed cells during inline edits.
     * This handles cell edits that don't trigger cellSaved event.
     * Only highlights cells where values actually changed and column allows it.
     *
     * @param {SaveEventArgs} args - The action complete event arguments
     * @returns {void}
     * @hidden
     */
    public onActionComplete = (args: SaveEventArgs): void => {
        if (!args || args.requestType !== 'save' || args.action === 'add' || !args.data) {
            return;
        }
        const settings: HighlightSettingsModel = this.parent.highlightSettings;
        if (isNullOrUndefined(settings)) {
            return;
        }
        // The save args carry no row index, so resolve it from the primary key (when the grid has one)
        let rowIndex: number = this.parent.getPrimaryKeyFieldNames()[0] ? this.parent.getRowIndexByPrimaryKey(args.data) : -1;
        if (isNullOrUndefined(rowIndex) || rowIndex < 0) {
            rowIndex = args.index;
        }
        if (isNullOrUndefined(rowIndex) || rowIndex < 0) {
            return;
        }
        this.highlightChangedCells(rowIndex, args.data, settings);
    };

    private highlightChangedCells(rowIndex: number, data: Object, settings: HighlightSettingsModel): void {
        const changedColumns: number[] | null = this.highlightService.compareRow(rowIndex, data);
        if (!changedColumns || changedColumns.length === 0) {
            return;
        }
        const pkName: string = this.parent.getPrimaryKeyFieldNames()[0];
        const pkValue: RecordKey = pkName ? getValue(pkName, data) : undefined;
        changedColumns.forEach((colIndex: number) => {
            if (this.shouldHighlightColumn(colIndex)) {
                // Prefer the rendered row of this record: after a sort the saved row index can be stale
                const located: {cell: HTMLElement; rowIndex: number} = isNullOrUndefined(pkValue) ? null
                    : this.highlightService.findRenderedCell(pkValue, colIndex);
                const cellElement: Element = located ? located.cell : this.parent.getCellFromIndex(rowIndex, colIndex);
                if (cellElement && cellElement instanceof HTMLElement) {
                    this.highlightService.highlightCell(cellElement, located ? located.rowIndex : rowIndex, colIndex, settings);
                }
            }
        });
    }

    /**
     * Handle cellSaved event to highlight changed cells.
     * Only highlights cells where values actually changed and column allows it.
     *
     * @param {CellSaveArgs} args - The cell save event arguments
     * @returns {void}
     * @hidden
     */
    public onCellSaved = (args: CellSaveArgs): void => {
        const settings: HighlightSettingsModel = this.parent.highlightSettings;
        if (isNullOrUndefined(settings) || args.cancel) {
            return;
        }
        // Batch edit raises cellSaved per cell without data/rowIndex; use the saved cell directly
        if (args.cell && args.columnName) {
            const tr: Element = args.cell.parentElement;
            const colIndex: number = this.parent.getColumnIndexByField(args.columnName);
            const rowIndex: number = tr ? parseInt(tr.getAttribute('aria-rowindex'), 10) - 1 : -1;
            const changed: boolean = (!isNullOrUndefined(args.previousValue) && !isNullOrUndefined(args.value)) ?
                args.previousValue.toString() !== args.value.toString() : args.previousValue !== args.value;
            if (changed && colIndex >= 0 && rowIndex >= 0 && args.cell instanceof HTMLElement
                && this.shouldHighlightColumn(colIndex)) {
                this.highlightService.highlightCell(args.cell, rowIndex, colIndex, settings);
            }
            return;
        }
        if (!args.data) {
            return;
        }
        this.highlightChangedCells(args.rowIndex, args.data, settings);
    };

    /**
     * Flash rows, columns or specific cells.
     *
     * @param {FlashOptions | Array<{rowIndex: number, colIndex: number}>} options - rowNodes and/or columns
     * @returns {void}
     */
    public flash(options: FlashOptions | Array<{rowIndex: number; colIndex: number}>): void {
        if (!this.highlightService || !options) {
            return;
        }
        // Per-call settings override the grid's highlightSettings; anything not given falls back to the grid
        const overrides: HighlightSettingsModel = Array.isArray(options) ? null : options.highlightSettings;
        const gridSettings: HighlightSettingsModel =
            (this.parent.highlightSettings as ChildPropertyLike).properties || this.parent.highlightSettings;
        const settings: HighlightSettingsModel = extend({}, gridSettings, overrides, true);
        if (Array.isArray(options)) {
            this.highlightService.highlightCells(options, settings);
            return;
        }
        const rowIndexes: number[] = this.resolveRowIndexes(options.rowNodes);
        const hasRows: boolean = !isNullOrUndefined(options.rowNodes);
        const fields: string[] = options.columns;
        if (!fields || !fields.length) {
            this.highlightService.highlightRows(rowIndexes, settings);
            return;
        }
        const rows: number[] = hasRows ? rowIndexes : this.parent.getRows().map((r: Element, i: number) => i);
        const cells: Array<{rowIndex: number; colIndex: number}> = [];
        fields.forEach((field: string) => {
            const colIndex: number = this.parent.getColumnIndexByField(field);
            if (colIndex >= 0) {
                rows.forEach((rowIndex: number) => cells.push({ rowIndex: rowIndex, colIndex: colIndex }));
            }
        });
        this.highlightService.highlightCells(cells, settings);
    }

    private resolveRowIndexes(rowNodes: Array<number | Element | Object>): number[] {
        const result: number[] = [];
        (rowNodes || []).forEach((node: number | Element | Object) => {
            let index: number = -1;
            if (typeof node === 'number') {
                index = node;
            } else if (node instanceof HTMLElement) {
                index = parseInt(node.getAttribute('aria-rowindex'), 10) - 1;
            } else if (node && typeof (node as Row<Column>).index === 'number') {
                index = (node as Row<Column>).index;
            } else if (node && this.parent.getPrimaryKeyFieldNames()[0]) {
                index = this.parent.getRowIndexByPrimaryKey(node);
            }
            if (index >= 0) {
                result.push(index);
            }
        });
        return result;
    }

    /**
     * Programmatically highlight one or more cells.
     *
     * @param {any} cells - Array of cells to highlight
     * @returns {void}
     */
    public highlightCells(cells: Array<{rowIndex: number; colIndex: number}>): void {
        if (this.highlightService) {
            this.highlightService.highlightCells(cells, this.parent.highlightSettings);
        }
    }

    /**
     * Programmatically highlight one or more rows.
     *
     * @param {number[]} rows - Array of row indices to highlight
     * @returns {void}
     */
    public highlightRows(rows: number[]): void {
        if (this.highlightService) {
            this.highlightService.highlightRows(rows, this.parent.highlightSettings);
        }
    }

    /**
     * Check if highlighting should occur for a specific column.
     * Considers both grid-level and column-level enableHighlightOnDataChange property.
     *
     * @param {number} colIndex - The column index
     * @returns {boolean} True if highlighting should occur for this column
     * @private
     */
    private shouldHighlightColumn(colIndex: number): boolean {
        const column: Column = this.parent.getColumnByIndex(colIndex);
        if (!column) {
            return this.parent.enableHighlightOnDataChange;
        }

        // Column has explicit setting - use it
        if (column.enableHighlightOnDataChange !== null && column.enableHighlightOnDataChange !== undefined) {
            return column.enableHighlightOnDataChange;
        }

        // Fall back to grid-level setting
        return this.parent.enableHighlightOnDataChange;
    }

    /**
     * Destroy the highlight module and clean up resources.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.highlightService) {
            this.highlightService.destroy();
        }
    }
}

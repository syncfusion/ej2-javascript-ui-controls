import { createElement, closest, detach, Browser, isNullOrUndefined as isNOU, KeyboardEventArgs, EventHandler, addClass } from '../../../../base'; /*externalscript*/
import * as CONSTANT from './../base/constant';
import { IHtmlItem, IHtmlSubCommands } from './../base/interface';
import { InsertHtml } from './inserthtml';
import { removeClassWithAttr, getCorrespondingColumns, getCorrespondingIndex, getColGroup, insertColGroupWithSizes, convertPixelToPercentage, getCellIndex, getMaxCellCount, cleanupInternalElements } from '../../common/util';
import * as EVENTS from '../../common/constant';
import { ClickEventArgs } from '../../../../navigations/src'; /*externalscript*/
import { CLS_TABLE_MULTI_CELL, CLS_TABLE_SEL, CLS_TABLE_SEL_END } from '../../common/constant';
import { NodeSelection } from '../../selection';
import { IEditorModel, ITableModel, NotifyArgs, OffsetPosition, ResizeArgs, ITableNotifyArgs } from '../../common/interface';
import { TABLE_SELECTION_STATE_ALLOWED_ACTIONKEYS } from '../../common/config';
import { TablePasting } from './table-pasting';
import { IFrameSettingsModel } from '../../models';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class TableCommand {
    private parent: IEditorModel;
    public activeCell: HTMLElement;
    public curTable: HTMLTableElement;
    private resizeBtnStat: { [key: string]: boolean };
    public isTableMoveActive: boolean = false;
    private pageX: number | null = null;
    private pageY: number | null = null;
    public helper: HTMLElement;
    private isResizeBind: boolean = true;
    private tableModel: ITableModel;
    private currentColumnResize: string = '';
    private iframeSettings: IFrameSettingsModel;
    private colIndex: number;
    private columnEle: HTMLTableDataCellElement;
    private rowEle: HTMLTableRowElement;
    public resizeEndTime: number = 0;
    private previousTableElement: HTMLElement;
    public ensureInsideTableList: boolean = true;
    private keyDownEventInstance: KeyboardEventArgs;
    public dlgDiv: HTMLElement;
    public tblHeader: HTMLElement;
    private resizeIconPositionTime: number;
    public tablePastingObj: TablePasting;

    /**
     * Constructor for creating the Formats plugin
     *
     * @param {IEditorModel} parent - specifies the parent element
     * @param {ITableModel} tableModel - specifies the table model instance
     * @param {IFrameSettings} iframeSettings - specifies the table model instance
     * @hidden
     * @deprecated
     */
    public constructor(parent: IEditorModel, tableModel: ITableModel, iframeSettings: IFrameSettingsModel) {
        this.parent = parent;
        this.tablePastingObj = new TablePasting();
        this.tableModel = tableModel;
        this.iframeSettings = iframeSettings;
        this.addEventListener();
    }

    /*
     * Registers all event listeners for table operations
     */
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.TABLE, this.createTable, this);
        this.parent.observer.on(CONSTANT.INSERT_ROW, this.insertRow, this);
        this.parent.observer.on(CONSTANT.INSERT_COLUMN, this.insertColumn, this);
        this.parent.observer.on(CONSTANT.DELETEROW, this.deleteRow, this);
        this.parent.observer.on(CONSTANT.DELETECOLUMN, this.deleteColumn, this);
        this.parent.observer.on(CONSTANT.REMOVETABLE, this.removeTable, this);
        this.parent.observer.on(CONSTANT.TABLEHEADER, this.tableHeader, this);
        this.parent.observer.on(CONSTANT.TABLE_VERTICAL_ALIGN, this.tableVerticalAlign, this);
        this.parent.observer.on(CONSTANT.TABLE_MERGE, this.cellMerge, this);
        this.parent.observer.on(CONSTANT.TABLE_HORIZONTAL_SPLIT, this.horizontalSplit, this);
        this.parent.observer.on(CONSTANT.TABLE_VERTICAL_SPLIT, this.verticalSplit, this);
        this.parent.observer.on(CONSTANT.TABLE_STYLES, this.tableStyles, this);
        this.parent.observer.on(CONSTANT.TABLE_BACKGROUND_COLOR, this.setBGColor, this);
        this.parent.observer.on(CONSTANT.TABLE_MOVE, this.tableMove, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    /*
     * Removes all registered event listeners
     */
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.TABLE, this.createTable);
        this.parent.observer.off(CONSTANT.INSERT_ROW, this.insertRow);
        this.parent.observer.off(CONSTANT.INSERT_COLUMN, this.insertColumn);
        this.parent.observer.off(CONSTANT.DELETEROW, this.deleteRow);
        this.parent.observer.off(CONSTANT.DELETECOLUMN, this.deleteColumn);
        this.parent.observer.off(CONSTANT.REMOVETABLE, this.removeTable);
        this.parent.observer.off(CONSTANT.TABLEHEADER, this.tableHeader);
        this.parent.observer.off(CONSTANT.TABLE_VERTICAL_ALIGN, this.tableVerticalAlign);
        this.parent.observer.off(CONSTANT.TABLE_MERGE, this.cellMerge);
        this.parent.observer.off(CONSTANT.TABLE_HORIZONTAL_SPLIT, this.horizontalSplit);
        this.parent.observer.off(CONSTANT.TABLE_VERTICAL_SPLIT, this.verticalSplit);
        this.parent.observer.off(CONSTANT.TABLE_STYLES, this.tableStyles);
        this.parent.observer.off(CONSTANT.TABLE_BACKGROUND_COLOR, this.setBGColor);
        this.parent.observer.off(CONSTANT.TABLE_MOVE, this.tableMove);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);

        // Browser-specific event handlers for table resizing
        if (!Browser.isDevice && this.tableModel.tableSettings.resize) {
            EventHandler.remove(this.iframeSettings.enable ? this.tableModel.getEditPanel() :
                this.tableModel.getEditPanel().parentElement, 'mouseover', this.resizeHelper);
            EventHandler.remove(this.iframeSettings.enable ? this.tableModel.getEditPanel() :
                this.tableModel.getEditPanel().parentElement, Browser.touchStartEvent, this.resizeStart);
        }
        if (this.curTable) {
            EventHandler.remove(this.curTable, 'mouseleave', this.tableMouseLeave);
        }
        EventHandler.remove(this.tableModel.getDocument(), 'selectionchange', this.tableCellsKeyboardSelection);
    }

    /**
     * Copies the selected table cells to clipboard.
     * Creates a temporary table with only the selected cells' content.
     *
     * @param {boolean} isCut - Indicates whether the operation is a cut (true) or copy (false).
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public copy(isCut: boolean): void {
        const copyTable: HTMLTableElement = this.extractSelectedTable(this.curTable, isCut);
        if (copyTable) {
            const tableHtml: string = cleanupInternalElements(copyTable.outerHTML, this.tableModel.editorMode);
            try {
                const htmlBlob: Blob = new Blob([tableHtml], { type: 'text/html' });
                const clipboardItem: any = new (window as any).ClipboardItem({
                    'text/html': htmlBlob
                });
                (navigator as any).clipboard.write([clipboardItem as any]);
            } catch (e) {
                console.error('Clipboard API not supported in this browser');
            }
        }
    }

    /**
     * Updates the table command object with the latest table model configuration and settings
     *
     * @param {ITableModel} updatedTableMode - The updated table model with latest configuration
     * @returns {void} - This method does not return a value
     * @public
     * @hidden
     */
    public updateTableModel(updatedTableMode: ITableModel): void {
        this.tableModel = updatedTableMode;
    }

    /*
     * Extracts a cloned HTMLTableElement containing only the selected cells,
     * preserving their original row and column positions. All non-selected
     * rows and cells are removed. If `isCut` is true, the original cell content
     * is cleared by replacing it with a <br>.
     */
    private extractSelectedTable(originalTable: HTMLTableElement, isCut: boolean): HTMLTableElement | null {
        const selectedCells: NodeListOf<HTMLTableCellElement> = originalTable.querySelectorAll('.e-cell-select.e-multi-cells-select');
        if (!selectedCells || selectedCells.length === 0) {
            return null;
        }
        const clonedTable: HTMLTableElement = originalTable.cloneNode(true) as HTMLTableElement;
        const rowsWithSelection: Map<number, Set<number>> = this.buildSelectionMap(originalTable, selectedCells, isCut);

        this.cleanTableToSelection(clonedTable, rowsWithSelection);
        this.removeColGroup(clonedTable);

        return clonedTable;
    }

    /* Builds a map of selected cell coordinates and clears original cell content if cut */
    private buildSelectionMap(
        originalTable: HTMLTableElement,
        selectedCells: NodeListOf<HTMLTableCellElement>,
        isCut: boolean
    ): Map<number, Set<number>> {
        const selectionMap: Map<number, Set<number>> = new Map<number, Set<number>>();

        for (let i: number = 0; i < selectedCells.length; i++) {
            const cell: HTMLTableCellElement = selectedCells[i as number];
            const row: HTMLTableRowElement = cell.parentElement as HTMLTableRowElement;
            const rowIndex: number = Array.prototype.indexOf.call(originalTable.rows, row);
            const cellIndex: number = Array.prototype.indexOf.call(row.cells, cell);
            const rowSpan: number = parseInt(cell.getAttribute('rowspan') || '1', 10);
            for (let r: number = 0; r < rowSpan; r++) {
                const rowPosition: number = r + rowIndex;
                if (!selectionMap.has(rowPosition)) {
                    selectionMap.set(rowPosition, new Set<number>());
                }
                if (r === 0) {
                    (selectionMap.get(rowPosition) as Set<number>).add(cellIndex);
                }
            }
            if (isCut) {
                const originalCell: HTMLTableCellElement = originalTable.rows[rowIndex as number].cells[cellIndex as number];
                originalCell.innerHTML = '<br>';
            }
        }

        return selectionMap;
    }

    /* Modifies the cloned table by removing non-selected rows and cells */
    private cleanTableToSelection(
        table: HTMLTableElement,
        selectionMap: Map<number, Set<number>>
    ): void {
        for (let rowIndex: number = table.rows.length - 1; rowIndex >= 0; rowIndex--) {
            const row: HTMLTableRowElement = table.rows[rowIndex as number];

            if (!selectionMap.has(rowIndex)) {
                detach(row);
                continue;
            }

            const selectedCellIndices: Set<number> = selectionMap.get(rowIndex) as Set<number>;

            for (let cellIndex: number = row.cells.length - 1; cellIndex >= 0; cellIndex--) {
                if (!selectedCellIndices.has(cellIndex)) {
                    row.deleteCell(cellIndex);
                }
            }
        }
    }

    /* Removes the <colgroup> from the cloned table if it exists */
    private removeColGroup(table: HTMLTableElement): void {
        const colGroup: HTMLTableColElement | null = getColGroup(table);
        if (colGroup) {
            detach(colGroup);
        }
    }

    /*
     * Creates and inserts a table based on the specified configuration.
     */
    private createTable(e: IHtmlItem): HTMLElement {
        const table: HTMLElement = this.createTableStructure(e);
        this.insertTableInDocument(table, e);
        this.handlePostTableInsertion(table, e);
        return table;
    }

    /*
     * Creates the table structure with rows and columns.
     */
    private createTableStructure(e: IHtmlItem): HTMLElement {
        const table: HTMLElement = createElement('table', { className: 'e-rte-table' });
        this.applyTableDimensions(table, e.item.width);
        const cellWidth: number = this.calculateCellWidth(e.item.width.width, e.item.columns);
        // Create colgroup with columns
        const colGroup: HTMLElement = this.createInitialColgroup(e.item.columns, cellWidth);
        table.appendChild(colGroup);
        const tblBody: HTMLElement = createElement('tbody');
        this.createRowsAndCells(tblBody, e.item.rows, e.item.columns);
        table.appendChild(tblBody);
        return table;
    }

    /*
     * Creates a colgroup element with evenly distributed columns
     */
    private createInitialColgroup(columnCount: number, cellWidth: number): HTMLElement {
        const colGroup: HTMLElement = createElement('colgroup');
        for (let i: number = 0; i < columnCount; i++) {
            const col: HTMLElement = createElement('col');
            col.appendChild(createElement('br'));
            col.style.width = cellWidth + '%';
            colGroup.appendChild(col);
        }
        return colGroup;
    }

    /*
     * Applies width dimensions to the table.
     */
    private applyTableDimensions(table: HTMLElement, widthConfig: {
        minWidth?: string | number,
        maxWidth?: string | number,
        width?: string | number
    }): void {
        if (!isNOU(widthConfig.width)) {
            table.style.width = this.calculateStyleValue(widthConfig.width);
        }
        if (!isNOU(widthConfig.minWidth)) {
            table.style.minWidth = this.calculateStyleValue(widthConfig.minWidth);
        }
        if (!isNOU(widthConfig.maxWidth)) {
            table.style.maxWidth = this.calculateStyleValue(widthConfig.maxWidth);
        }
    }

    /*
     * Calculates appropriate cell width based on table width and column count.
     */
    private calculateCellWidth(width: string | number, columns: number): number {
        return parseInt(width as string, 10) > 100 ?
            100 / columns : parseInt(width as string, 10) / columns;
    }

    /*
     * Creates rows and cells in the table body.
     */
    private createRowsAndCells(tblBody: HTMLElement, rowCount: number, columnCount: number): void {
        for (let i: number = 0; i < rowCount; i++) {
            const row: HTMLElement = createElement('tr');
            for (let j: number = 0; j < columnCount; j++) {
                const cell: HTMLElement = createElement('td');
                cell.appendChild(createElement('br'));
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
    }

    /*
     * Inserts the table into the document.
     */
    private insertTableInDocument(table: HTMLElement, e: IHtmlItem): void {
        e.item.selection.restore();
        InsertHtml.Insert(this.tableModel.getDocument(), table, this.tableModel.getEditPanel());
        e.item.selection.setSelectionText(
            this.tableModel.getDocument(),
            table.querySelector('td'),
            table.querySelector('td'),
            0, 0
        );
    }

    /*
     * Handles post-insertion operations for the table.
     */
    private handlePostTableInsertion(table: HTMLElement, e: IHtmlItem): void {
        this.insertElementAfterTableIfNeeded(table, e.enterAction);
        if (table.classList.contains('ignore-table')) {
            removeClassWithAttr([table], ['ignore-table']);
        }
        table.querySelector('td').classList.add('e-cell-select');
        if (e.callBack) {
            e.callBack({
                requestType: 'Table',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.tableModel.getDocument()),
                elements: [table] as Element[]
            });
        }
    }

    /*
     * Inserts an appropriate element after the table if needed.
     */
    private insertElementAfterTableIfNeeded(table: HTMLElement, enterAction: string): void {
        if (table.nextElementSibling === null && !table.classList.contains('ignore-table')) {
            let insertElem: HTMLElement;
            if (enterAction === 'DIV') {
                insertElem = createElement('div');
                insertElem.appendChild(createElement('br'));
            } else if (enterAction === 'BR') {
                insertElem = createElement('br');
            } else {
                insertElem = createElement('p');
                insertElem.appendChild(createElement('br'));
            }
            this.insertAfter(insertElem, table);
        }
    }

    /*
     * Calculates CSS style value by appending appropriate units.
     * If the value is a string with a unit (px, %, auto), it returns the original value.
     * Otherwise, it appends 'px' to the value.
     */
    private calculateStyleValue(value: string | number): string {
        let styleValue: string;
        if (typeof value === 'string') {
            if (value.indexOf('px') >= 0 || value.indexOf('%') >= 0 || value.indexOf('auto') >= 0) {
                styleValue = value;
            } else {
                styleValue = value + 'px';
            }
        } else {
            styleValue = value + 'px';
        }
        return styleValue;
    }

    /*
     * Inserts a node after the specified reference node.
     * Acts as a helper method since there's no direct insertAfter method in DOM.
     */
    private insertAfter(newNode: Element, referenceNode: Element): void {
        if (!referenceNode.parentNode) {
            return;
        }
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    /*
     * Determines the minimum and maximum row/column indexes of selected cells.
     * This method calculates the bounding box that encloses all selected cells in the table.
     */
    private getSelectedCellMinMaxIndex(cellsMatrix: HTMLElement[][]): MinMax {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        let minRowIndex: number = cellsMatrix.length;
        let maxRowIndex: number = 0;
        let minColIndex: number = cellsMatrix[0].length;
        let maxColIndex: number = 0;
        for (let i: number = 0; i < selectedCells.length; i++) {
            const selectedCellPosition: number[] = getCorrespondingIndex(selectedCells[i as number], cellsMatrix);
            const cellEndPosition: number[] = this.FindIndex(selectedCellPosition[0], selectedCellPosition[1], cellsMatrix);
            minRowIndex = Math.min(selectedCellPosition[0], minRowIndex);
            maxRowIndex = Math.max(cellEndPosition[0], maxRowIndex);
            minColIndex = Math.min(selectedCellPosition[1], minColIndex);
            maxColIndex = Math.max(cellEndPosition[1], maxColIndex);
        }
        return {
            startRow: minRowIndex,
            endRow: maxRowIndex,
            startColumn: minColIndex,
            endColumn: maxColIndex
        };
    }

    /*
     * Inserts a new row before or after the selected row in a table.
     */
    private insertRow(e: IHtmlItem): void {
        const isBelow: boolean = e.item.subCommand === 'InsertRowBefore' ? false : true;
        this.curTable = closest(this.parent.nodeSelection.range.startContainer.parentElement, 'table') as HTMLTableElement;
        if (this.curTable.querySelectorAll('.e-cell-select').length === 0) {
            this.addRowWithoutCellSelection();
        } else {
            this.addRowWithCellSelection(e, isBelow);
        }
        this.updateSelectionAfterRowInsertion(e);
        this.executeCallback(e);
    }

    /*
     * Adds a new row when no cell is specifically selected.
     * Clones the last row and appends it to the table.
     */
    private addRowWithoutCellSelection(): void {
        const lastRow: Element = this.curTable.rows[this.curTable.rows.length - 1];
        const cloneRow: Node = lastRow.cloneNode(true);
        (cloneRow as HTMLElement).removeAttribute('rowspan');
        this.insertAfter(cloneRow as HTMLElement, lastRow);
    }

    /*
     * Adds a new row when a cell is selected, handling rowspan adjustments.
     */
    private addRowWithCellSelection(e: IHtmlItem, isBelow: boolean): void {
        const allCells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const minMaxIndex: MinMax = this.getSelectedCellMinMaxIndex(allCells);
        const minVal: number = isBelow ? minMaxIndex.endRow : minMaxIndex.startRow;
        const newRow: Element = createElement('tr');
        const isHeaderSelect: boolean = this.curTable.querySelectorAll('th.e-cell-select').length > 0;
        this.createCellsForNewRow(allCells, minVal, isBelow, isHeaderSelect, newRow);
        this.insertNewRowAtPosition(e, isBelow, isHeaderSelect, minVal, newRow);
    }

    /*
     * Creates cells for the new row, handling rowspan adjustments and styles.
     */
    private createCellsForNewRow(
        allCells: HTMLElement[][],
        minVal: number,
        isBelow: boolean,
        isHeaderSelect: boolean,
        newRow: Element
    ): void {
        for (let i: number = 0; i < allCells[minVal as number].length; i++) {
            if (this.isCellAffectedByRowspan(allCells, minVal, i, isBelow)) {
                if (this.isFirstCellInSpan(allCells, minVal, i)) {
                    this.incrementRowspan(allCells[minVal as number][i as number]);
                }
            } else {
                this.createNewCellForRow(allCells, minVal, i, isHeaderSelect, isBelow, newRow);
            }
        }
    }

    /*
     * Checks if a cell position is affected by a rowspan.
     */
    private isCellAffectedByRowspan(
        allCells: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        isBelow: boolean
    ): boolean {
        return (isBelow &&
            rowIndex < allCells.length - 1 &&
            allCells[rowIndex as number][colIndex as number] === allCells[rowIndex + 1][colIndex as number]) ||
            (!isBelow &&
                0 < rowIndex &&
                allCells[rowIndex as number][colIndex as number] === allCells[rowIndex - 1][colIndex as number]);
    }

    /*
     * Checks if this cell is the first cell in a rowspan/colspan.]
     */
    private isFirstCellInSpan(
        allCells: HTMLElement[][],
        rowIndex: number,
        colIndex: number
    ): boolean {
        return 0 === colIndex ||
            (0 < colIndex && allCells[rowIndex as number][colIndex as number] !== allCells[rowIndex as number][colIndex - 1]);
    }

    /*
     * Increments the rowspan attribute of a cell.
     */
    private incrementRowspan(cell: HTMLElement): void {
        const currentRowspan: number = parseInt(cell.getAttribute('rowspan'), 10) || 1;
        cell.setAttribute('rowspan', (currentRowspan + 1).toString());
    }

    /*
     * Creates a new cell for the new row.
     */
    private createNewCellForRow(
        allCells: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        isHeaderSelect: boolean,
        isBelow: boolean,
        newRow: Element
    ): void {
        const tdElement: HTMLElement = createElement('td');
        tdElement.appendChild(createElement('br'));
        newRow.appendChild(tdElement);
        const referenceRowIndex: number = this.getReferenceRowIndex(allCells, rowIndex, isHeaderSelect, isBelow);
        const styleValue: string = allCells[referenceRowIndex as number][colIndex as number].getAttribute('style');
        if (styleValue) {
            const updatedStyle: string = this.cellStyleCleanup(styleValue);
            tdElement.style.cssText = updatedStyle;
        }
    }

    /*
     * Gets the appropriate reference row index for styling.
     */
    private getReferenceRowIndex(
        allCells: HTMLElement[][],
        rowIndex: number,
        isHeaderSelect: boolean,
        isBelow: boolean
    ): number {
        if (isHeaderSelect && isBelow) {
            // If header is selected and inserting below, use first body row if available
            return (rowIndex + 1 < allCells.length) ? (rowIndex + 1) : rowIndex;
        }
        return rowIndex;
    }

    /*
     * Inserts the new row at the appropriate position in the table.
     */
    private insertNewRowAtPosition(
        e: IHtmlItem,
        isBelow: boolean,
        isHeaderSelect: boolean,
        rowIndex: number,
        newRow: Element
    ): void {
        let selectedRow: Element;

        if (isHeaderSelect && isBelow) {
            selectedRow = this.curTable.querySelector('tbody').childNodes[0] as Element;
        } else {
            selectedRow = this.curTable.rows[rowIndex as number];
        }

        if (e.item.subCommand === 'InsertRowBefore') {
            selectedRow.parentElement.insertBefore(newRow, selectedRow);
        } else if (isHeaderSelect) {
            selectedRow.parentElement.insertBefore(newRow, selectedRow);
        } else {
            this.insertAfter(newRow, selectedRow);
        }
    }

    /*
     * Updates the selection after row insertion.
     */
    private updateSelectionAfterRowInsertion(e: IHtmlItem): void {
        e.item.selection.setSelectionText(
            this.tableModel.getDocument(),
            e.item.selection.range.startContainer,
            e.item.selection.range.startContainer,
            0,
            0
        );
    }

    /*
     * Executes the callback function if provided.
     */
    private executeCallback(e: IHtmlItem): void {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.tableModel.getDocument()),
                elements: this.parent.nodeSelection.getSelectedNodes(this.tableModel.getDocument()) as Element[]
            });
        }
    }

    /*
     * Inserts a new column before or after the selected column in a table.
     */
    private insertColumn(e: IHtmlItem): void {
        // Locate the selected cell
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (!(selectedCell.nodeName === 'TH' || selectedCell.nodeName === 'TD')) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        const curRow: HTMLElement = closest(selectedCell, 'tr') as HTMLElement;
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = (closest(curRow, 'table') as HTMLTableElement).rows;
        const colIndex: number = Array.prototype.slice.call(curRow.querySelectorAll(':scope > td, :scope > th')).indexOf(selectedCell);
        this.prepareTableForColumnInsertion(e, curRow);
        this.insertCellsInAllRows(e, allRows, colIndex);
        this.finalizeColumnInsertion(e, selectedCell);
    }

    /*
     * Prepares the table for column insertion by calculating and storing widths.
     */
    private prepareTableForColumnInsertion(e: IHtmlItem, curRow: HTMLElement): void {
        const currentTabElm: Element = closest(curRow, 'table');
        const thTdElm: NodeListOf<HTMLElement> = currentTabElm.querySelectorAll('th,td');

        for (let i: number = 0; i < thTdElm.length; i++) {
            thTdElm[i as number].dataset.oldWidth =
                (thTdElm[i as number].offsetWidth / (currentTabElm as HTMLElement).offsetWidth * 100) + '%';
        }

        if (isNOU((currentTabElm as HTMLElement).style.width) || (currentTabElm as HTMLElement).style.width === '') {
            (currentTabElm as HTMLElement).style.width = (currentTabElm as HTMLElement).offsetWidth + 'px';
        }
    }

    /*
     * Inserts new cells in all rows at the specified column index.
     */
    private insertCellsInAllRows(e: IHtmlItem, allRows: HTMLCollectionOf<HTMLTableRowElement>, colIndex: number): void {
        // Get current table to calculate proper column width
        const currentTabElm: Element = closest(allRows[0], 'table');
        const thTdElm: NodeListOf<HTMLElement> = currentTabElm.querySelectorAll('th,td');
        const currentCellCount: number = allRows[0].querySelectorAll(':scope > td, :scope > th').length;
        const currentWidth: number = parseInt(e.item.width as string, 10) / (currentCellCount + 1);
        const previousWidth: number = parseInt(e.item.width as string, 10) / currentCellCount;

        // update column group
        const cols: NodeListOf<HTMLElement> = this.updateColumnGroup(
            currentTabElm,
            colIndex,
            e.item.subCommand,
            currentWidth
        );

        //update the column
        for (let i: number = 0; i < allRows.length; i++) {
            const curCell: Element = allRows[i as number].querySelectorAll(':scope > td, :scope > th')[colIndex as number];
            const colTemplate: HTMLElement = this.createColumnCell(curCell);

            if (e.item.subCommand === 'InsertColumnLeft') {
                curCell.parentElement.insertBefore(colTemplate, curCell);
            } else {
                this.insertAfter(colTemplate, curCell);
            }

            delete colTemplate.dataset.oldWidth;
        }

        this.redistributeCellWidths(thTdElm, previousWidth, currentWidth, cols);
    }

    /*
     * Updates colgroup structure during column insertion
     */
    private updateColumnGroup(
        currentTabElm: Element,
        colIndex: number,
        subCommand: string,
        currentWidth: number
    ): NodeListOf<HTMLElement> {
        insertColGroupWithSizes(currentTabElm as HTMLTableElement);
        const colGroup: HTMLElement = getColGroup(currentTabElm as HTMLTableElement);
        const newCol: HTMLElement = createElement('col');
        newCol.appendChild(createElement('br'));
        newCol.style.width = currentWidth.toFixed(4) + '%';
        const cols: NodeListOf<HTMLElement> = colGroup.querySelectorAll('col');
        if (cols.length > 0 && colIndex < cols.length) {
            const curCol: HTMLElement = cols[colIndex as number];
            if (subCommand === 'InsertColumnLeft') {
                colGroup.insertBefore(newCol, curCol);
            } else {
                this.insertAfter(newCol, curCol);
            }
        } else {
            colGroup.appendChild(newCol);
        }
        return colGroup.querySelectorAll('col');
    }

    /*
     * Creates a new cell for column insertion with proper attributes.
     */
    private createColumnCell(referenceCell: Element): HTMLElement {
        const colTemplate: HTMLElement = (referenceCell as HTMLElement).cloneNode(true) as HTMLElement;

        const style: string = colTemplate.getAttribute('style');
        if (style) {
            const updatedStyle: string = this.cellStyleCleanup(style);
            colTemplate.style.cssText = updatedStyle;
        }

        colTemplate.innerHTML = '';
        colTemplate.appendChild(createElement('br'));
        colTemplate.removeAttribute('class');
        colTemplate.removeAttribute('colspan');
        colTemplate.removeAttribute('rowspan');

        return colTemplate;
    }

    /*
     * Redistributes cell widths after column insertion.
     */
    private redistributeCellWidths(cells: NodeListOf<HTMLElement>, previousWidth: number,
                                   currentWidth: number, cols: NodeListOf<HTMLElement>): void {
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i as number].dataset.oldWidth) {
                const oldWidthValue: number = Number(cells[i as number].dataset.oldWidth.split('%')[0]);
                const colIndex: number = Array.prototype.slice.call(cells[i as number].
                    parentElement.querySelectorAll(':scope > td, :scope > th')).indexOf(cells[i as number]);
                cols[colIndex as number].style.width = (oldWidthValue * currentWidth / previousWidth).toFixed(4) + '%';
                delete cells[i as number].dataset.oldWidth;
            }
        }
    }

    /*
     * Finalizes column insertion by updating selection and executing callbacks.
     */
    private finalizeColumnInsertion(e: IHtmlItem, selectedCell: HTMLElement): void {
        e.item.selection.setSelectionText(
            this.tableModel.getDocument(),
            selectedCell,
            selectedCell,
            0, 0
        );
        this.executeCallback(e);
    }

    /*
     * Sets the background color for selected table cells.
     */
    private setBGColor(args: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.tableModel.getDocument());
        const start: HTMLElement = range.startContainer.nodeType === 3 ?
            range.startContainer.parentNode as HTMLElement : range.startContainer as HTMLElement;
        this.curTable = start.closest('table') as HTMLTableElement;
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        for (let i: number = 0; i < selectedCells.length; i++) {
            selectedCells[i as number].style.backgroundColor = args.value.toString();
        }
        this.parent.undoRedoManager.saveData();
        this.parent.observer.notify(EVENTS.hideTableQuickToolbar, {});
        this.executeBgColorCallback(args);
    }

    /*
     * Executes callback after setting background color.
     */
    private executeBgColorCallback(args: IHtmlSubCommands): void {
        if (args.callBack) {
            args.callBack({
                requestType: args.subCommand,
                editorMode: 'HTML',
                event: args.event,
                range: this.parent.nodeSelection.getRange(this.tableModel.getDocument()),
                elements: this.parent.nodeSelection.getSelectedNodes(this.tableModel.getDocument()) as Element[]
            });
        }
    }

    /**
     * Applies table styles.
     * This method handles various table styling operations like adding dashed borders,
     * alternating borders, or custom CSS classes.
     *
     * @param {IHtmlItem} e - The click event arguments
     * @returns {void}
     * @private
     */
    private tableStyles(e: IHtmlItem): void {
        const args: ITableNotifyArgs = e.event as ITableNotifyArgs;
        const command: string = e.item.subCommand;
        const table: HTMLTableElement = closest(args.selectParent[0], 'table') as HTMLTableElement;
        this.applyTableStyleCommand(command, table);
        this.applyCustomCssClasses(args, table);
        this.parent.undoRedoManager.saveData();
        this.parent.observer.notify(EVENTS.hideTableQuickToolbar, {});
        this.parent.nodeSelection.restore();
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: args.args as KeyboardEvent | MouseEvent,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    /**
     * Applies a specific table style command.
     * This helper method handles the actual application of built-in table styles
     * such as dashed or alternating borders.
     *
     * @param {string} command - The style command to apply
     * @param {HTMLTableElement} table - The table element to style
     * @returns {void}
     * @private
     */
    private applyTableStyleCommand(command: string, table: HTMLTableElement): void {
        if (command === 'Dashed') {
            const hasParentClass: boolean = this.parent.editableElement.classList.contains(EVENTS.CLS_TB_DASH_BOR);
            if (hasParentClass) {
                removeClassWithAttr([this.parent.editableElement], EVENTS.CLS_TB_DASH_BOR);
            } else {
                this.parent.editableElement.classList.add(EVENTS.CLS_TB_DASH_BOR);
            }
            const hasTableClass: boolean = table.classList.contains(EVENTS.CLS_TB_DASH_BOR);
            if (hasTableClass) {
                removeClassWithAttr([table], EVENTS.CLS_TB_DASH_BOR);
            } else {
                table.classList.add(EVENTS.CLS_TB_DASH_BOR);
            }
        } else if (command === 'Alternate') {
            const hasParentClass: boolean = this.parent.editableElement.classList.contains(EVENTS.CLS_TB_ALT_BOR);
            if (hasParentClass) {
                removeClassWithAttr([this.parent.editableElement], EVENTS.CLS_TB_ALT_BOR);
            } else {
                this.parent.editableElement.classList.add(EVENTS.CLS_TB_ALT_BOR);
            }
            const hasTableClass: boolean = table.classList.contains(EVENTS.CLS_TB_ALT_BOR);
            if (hasTableClass) {
                removeClassWithAttr([table], EVENTS.CLS_TB_ALT_BOR);
            } else {
                table.classList.add(EVENTS.CLS_TB_ALT_BOR);
            }
        }
    }

    /**
     * Applies custom CSS classes to a table.
     * This helper method processes any custom CSS classes specified in the
     * command arguments and toggles them on the table.
     *
     * @param {ITableNotifyArgs} args - The table notification arguments
     * @param {HTMLTableElement} table - The table element to style
     * @returns {void}
     * @private
     */
    private applyCustomCssClasses(args: ITableNotifyArgs, table: HTMLTableElement): void {
        const clickArgs: ClickEventArgs = args.args as ClickEventArgs;
        if (clickArgs && clickArgs.item.cssClass) {
            const classList: string[] = clickArgs.item.cssClass.split(' ');
            for (let i: number = 0; i < classList.length; i++) {
                const className: string = classList[i as number];
                if (table.classList.contains(className)) {
                    removeClassWithAttr([table], className);
                } else {
                    table.classList.add(className);
                }
            }
        }
    }

    /*
     * Deletes a column from the table.
     */
    private deleteColumn(e: IHtmlItem): void {
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (selectedCell.nodeType === 3) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        const tBodyHeadEle: Element = closest(selectedCell, selectedCell.tagName === 'TH' ? 'thead' : 'tbody');
        const rowIndex: number = tBodyHeadEle &&
            Array.prototype.indexOf.call(tBodyHeadEle.childNodes, selectedCell.parentNode);
        this.curTable = closest(selectedCell, 'table') as HTMLTableElement;

        // If only one column remains, remove the entire table
        const curRow: HTMLTableRowElement = closest(selectedCell, 'tr') as HTMLTableRowElement;
        if (curRow.querySelectorAll('th,td').length === 1) {
            this.removeEntireTable(e);
        } else {
            insertColGroupWithSizes(this.curTable);
            const selectedMinMaxIndex: MinMax = this.removeSelectedColumns(e, tBodyHeadEle, rowIndex);
            // Update colgroup structure after deletion
            this.updateColgroupAfterColumnDeletion(this.curTable, selectedMinMaxIndex.startColumn, selectedMinMaxIndex.endColumn);
        }

        this.executeDeleteColumnCallback(e);
    }

    /*
     * Updates colgroup structure after column deletion
     */
    private updateColgroupAfterColumnDeletion(table: HTMLTableElement, startColIndex: number, endColIndex: number): void {
        const colGroup: HTMLElement = getColGroup(table);
        let cols: NodeListOf<HTMLElement> = colGroup.querySelectorAll('col');
        const deleteCount: number = endColIndex - startColIndex + 1;

        // Remove cols in the deleted range
        for (let i: number = 0; i < deleteCount; i++) {
            if (startColIndex < cols.length) {
                colGroup.removeChild(cols[startColIndex as number]);
                cols = colGroup.querySelectorAll('col');
            }
        }

        // Redistribute widths of remaining columns
        const remainingCount: number = cols.length;
        const tableWidth: number = table.offsetWidth;
        const colWidths: number[] = new Array(remainingCount);

        // Get all column offsetWidths in one pass to avoid reflow issues
        for (let i: number = 0; i < remainingCount; i++) {
            colWidths[i as number] = cols[i as number].offsetWidth;
        }

        // Now apply percentage widths all at once
        for (let i: number = 0; i < remainingCount; i++) {
            cols[i as number].style.width = convertPixelToPercentage(colWidths[i as number], tableWidth).toFixed(4) + '%';
        }
    }

    /*
     * Removes the entire table when the last column is being deleted.
     */
    private removeEntireTable(e: IHtmlItem): void {
        e.item.selection.restore();
        const selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        detach(closest(selectedCell.parentElement, 'table'));
    }

    /*
     * Removes selected columns, handling colspan adjustments.
     */
    private removeSelectedColumns(e: IHtmlItem, tBodyHeadEle: Element, rowIndex: number): MinMax {
        let deleteIndex: number = -1;
        const allCells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const selectedMinMaxIndex: MinMax = this.getSelectedCellMinMaxIndex(allCells);
        const minCol: number = selectedMinMaxIndex.startColumn;
        const maxCol: number = selectedMinMaxIndex.endColumn;

        for (let i: number = 0; i < allCells.length; i++) {
            const currentRow: HTMLElement[] = allCells[i as number];
            for (let j: number = 0; j < currentRow.length; j++) {
                const currentCell: HTMLElement = currentRow[j as number];
                const currentCellIndex: number[] = getCorrespondingIndex(currentCell, allCells);
                const colSpanVal: number = parseInt(currentCell.getAttribute('colspan'), 10) || 1;

                if (this.isCellAffectedByDeletedColumns(currentCellIndex[1], colSpanVal, minCol, maxCol)) {
                    if (colSpanVal > 1) {
                        this.adjustColspan(currentCell, colSpanVal);
                    } else {
                        detach(currentCell);
                        deleteIndex = j;
                        this.handleIESpecificSelection(e, Browser.isIE);
                    }
                }
            }
        }

        this.updateSelectionAfterColumnDelete(e, tBodyHeadEle, rowIndex, deleteIndex);
        return selectedMinMaxIndex;
    }

    /*
     * Checks if a cell is affected by the deleted columns.
     */
    private isCellAffectedByDeletedColumns(
        cellColIndex: number,
        colSpanVal: number,
        minCol: number,
        maxCol: number
    ): boolean {
        return cellColIndex + (colSpanVal - 1) >= minCol && cellColIndex <= maxCol;
    }

    /*
     * Adjusts the colspan attribute of a cell during column deletion.
     */
    private adjustColspan(cell: HTMLElement, currentColspan: number): void {
        cell.setAttribute('colspan', (currentColspan - 1).toString());
    }

    /*
     * Handles IE-specific selection issues during column deletion.
     */
    private handleIESpecificSelection(e: IHtmlItem, isIE: boolean): void {
        if (isIE) {
            const firstCell: HTMLElement = this.curTable.querySelector('td');
            e.item.selection.setSelectionText(
                this.tableModel.getDocument(),
                firstCell,
                firstCell,
                0, 0
            );
            firstCell.classList.add('e-cell-select');
        }
    }

    /*
     * Updates selection after column deletion.
     */
    private updateSelectionAfterColumnDelete(
        e: IHtmlItem,
        tBodyHeadEle: Element,
        rowIndex: number,
        deleteIndex: number
    ): void {
        if (deleteIndex > -1) {
            const rowHeadEle: Element = tBodyHeadEle && tBodyHeadEle.children[rowIndex as number];
            const cellIndex: number = deleteIndex <= (rowHeadEle && rowHeadEle.children.length - 1)
                ? deleteIndex
                : deleteIndex - 1;

            const nextFocusCell: HTMLElement = rowHeadEle &&
                rowHeadEle.children[cellIndex as number] as HTMLElement;

            if (nextFocusCell) {
                e.item.selection.setSelectionText(
                    this.tableModel.getDocument(),
                    nextFocusCell,
                    nextFocusCell,
                    0, 0
                );
                nextFocusCell.classList.add('e-cell-select');
            }
        }
    }

    /*
     * Executes the callback after column deletion with additional cursor handling.
     */
    private executeDeleteColumnCallback(e: IHtmlItem): void {
        if (e.callBack) {
            const sContainer: Node = this.parent.nodeSelection.getRange(this.tableModel.getDocument()).startContainer;

            // Handle selection if not directly in a TD element
            if (sContainer.nodeName !== 'TD') {
                const startChildLength: number = this.parent.nodeSelection.
                    getRange(this.tableModel.getDocument()).startOffset;
                const focusNode: Element = (sContainer as HTMLElement).children[startChildLength as number];
                if (focusNode) {
                    this.parent.nodeSelection.setCursorPoint(this.tableModel.getDocument(), focusNode, 0);
                }
            }

            this.executeCallback(e);
        }
    }

    /*
     * Deletes selected rows from the table.
     */
    private deleteRow(e: IHtmlItem): void {
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (selectedCell.nodeType === 3) { // Text node
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }

        const colIndex: number = Array.prototype.indexOf.call(selectedCell.parentNode.childNodes, selectedCell);
        this.curTable = closest(selectedCell, 'table') as HTMLTableElement;
        const allCells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const minMaxIndex: MinMax = this.getSelectedCellMinMaxIndex(allCells);

        if (this.curTable.rows.length === 1) {
            this.removeEntireTable(e);
        } else {
            this.deleteSelectedRows(e, minMaxIndex, allCells, colIndex);
        }

        this.executeCallback(e);
    }

    /*
     * Deletes the selected rows and adjusts the table structure.
     */
    private deleteSelectedRows(e: IHtmlItem, minMaxIndex: MinMax, allCells: HTMLElement[][], colIndex: number): void {
        for (let rowIndex: number = minMaxIndex.endRow; rowIndex >= minMaxIndex.startRow; rowIndex--) {
            const currentRow: HTMLTableRowElement = this.curTable.rows[rowIndex as number];
            this.adjustRowSpans(rowIndex, allCells);
            this.repositionSpannedCells(rowIndex, allCells);
            const deleteIndex: number = currentRow.rowIndex;
            this.curTable.deleteRow(deleteIndex);
            this.restoreFocusAfterRowDeletion(e, deleteIndex, colIndex);
        }
    }

    /*
     * Adjusts rowspan attributes of cells when a row is deleted.
     */
    private adjustRowSpans(rowIndex: number, allCells: HTMLElement[][]): void {
        for (let colIndex: number = 0; colIndex < allCells[rowIndex as number].length; colIndex++) {
            if (colIndex !== 0 && allCells[rowIndex as number][colIndex as number] === allCells[rowIndex as number][colIndex - 1]) {
                continue;
            }

            const currentCell: HTMLElement = allCells[rowIndex as number][colIndex as number];
            const rowspanAttr: string | null = currentCell.getAttribute('rowspan');

            if (rowspanAttr && parseInt(rowspanAttr, 10) > 1) {
                const rowSpanVal: number = parseInt(rowspanAttr, 10) - 1;

                if (rowSpanVal === 1) {
                    currentCell.removeAttribute('rowspan');
                    this.createReplacementCellIfNeeded(colIndex);
                } else {
                    currentCell.setAttribute('rowspan', rowSpanVal.toString());
                }
            }
        }
    }

    /*
     * Creates a replacement cell if needed for a merged row.
     */
    private createReplacementCellIfNeeded(colIndex: number): void {
        const mergedRowCells: HTMLElement[] = this.getMergedRow(getCorrespondingColumns(this.curTable));

        if (mergedRowCells && colIndex < mergedRowCells.length) {
            const cell: HTMLElement = mergedRowCells[colIndex as number];

            if (cell) {
                const cloneNode: Node = cell.cloneNode(true);
                (cloneNode as HTMLElement).innerHTML = '<br>';

                if (cell.parentElement) {
                    cell.parentElement.insertBefore(cloneNode, cell);
                }
            }
        }
    }

    /*
     * Repositions cells that span multiple rows when a row is deleted.
     */
    private repositionSpannedCells(rowIndex: number, allCells: HTMLElement[][]): void {
        for (let colIndex: number = 0; colIndex < allCells[rowIndex as number].length; colIndex++) {
            const currentCell: HTMLElement = allCells[rowIndex as number][colIndex as number];
            const isSpanningToNextRow: boolean = rowIndex < allCells.length - 1 &&
                currentCell === allCells[rowIndex + 1][colIndex as number];
            const isBeginningOfSpan: boolean = rowIndex === 0 ||
                currentCell !== allCells[rowIndex - 1][colIndex as number];

            if (isSpanningToNextRow && isBeginningOfSpan) {
                let firstCellIndex: number = colIndex;
                while (firstCellIndex > 0 &&
                    currentCell === allCells[rowIndex as number][firstCellIndex - 1]) {
                    if (firstCellIndex === 0) {
                        (this.curTable.rows[rowIndex + 1] as HTMLElement).prepend(currentCell);
                    } else {
                        const previousCell: HTMLElement = allCells[rowIndex + 1][firstCellIndex - 1];
                        previousCell.insertAdjacentElement('afterend', currentCell);
                    }
                    firstCellIndex--;
                }
            }
        }
    }

    /*
     * Restores focus to an appropriate cell after row deletion.
     */
    private restoreFocusAfterRowDeletion(e: IHtmlItem, deleteIndex: number, colIndex: number): void {
        // Find a suitable row element (either at same index or previous one)
        const focusTrEle: Element = !isNOU(this.curTable.rows[deleteIndex as number])
            ? this.curTable.querySelectorAll('tbody tr')[deleteIndex as number]
            : this.curTable.querySelectorAll('tbody tr')[deleteIndex - 1];

        // Find a suitable cell in that row
        const nextFocusCell: HTMLElement = focusTrEle &&
            focusTrEle.querySelectorAll('td')[colIndex as number] as HTMLElement;

        if (nextFocusCell) {
            e.item.selection.setSelectionText(
                this.tableModel.getDocument(),
                nextFocusCell,
                nextFocusCell,
                0, 0
            );
            nextFocusCell.classList.add('e-cell-select');
        } else {
            const firstCell: HTMLElement = this.curTable.querySelector('td');
            e.item.selection.setSelectionText(
                this.tableModel.getDocument(),
                firstCell,
                firstCell,
                0, 0
            );
            firstCell.classList.add('e-cell-select');
        }
    }

    /*
     * Finds the first row in the table that has merged cells (different cell count than the first row).
     */
    private getMergedRow(cells: HTMLElement[][]): HTMLElement[] | undefined {
        let mergedRow: HTMLElement[] | undefined;
        const firstRowCellCount: number = this.curTable.rows[0].childNodes.length;

        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i as number].length !== firstRowCellCount) {
                mergedRow = cells[i as number];
                break;
            }
        }

        return mergedRow;
    }

    /*
     * Removes the entire table from the document and restores selection.
     */
    private removeTable(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        const selectedTable: HTMLElement = closest(selectedCell.parentElement, 'table') as HTMLElement;
        if (selectedTable) {
            detach(selectedTable);
            e.item.selection.restore();
        }
        this.executeCallback(e);
    }

    /*
     * Toggles table header (THEAD) on or off in the selected table.
     * If the table doesn't have a header, one will be created.
     * If it already has a header, it will be removed.
     */
    private tableHeader(e: IHtmlItem): void {
        const tableElement: HTMLTableElement = this.getTableFromSelection(e);
        const hasHeader: boolean = this.checkIfTableHasHeader(tableElement);

        if (tableElement && !hasHeader) {
            this.createTableHeader(tableElement);
        } else {
            tableElement.deleteTHead();
        }

        this.executeCallback(e);
    }

    /*
     * Gets the table element from the current selection.
     */
    private getTableFromSelection(e: IHtmlItem): HTMLTableElement {
        let selectedCell: Node = e.item.selection.range.startContainer;
        if (selectedCell.nodeName === 'TABLE') {
            return selectedCell as HTMLTableElement;
        }
        if (selectedCell.nodeType === 3) {
            selectedCell = selectedCell.parentNode;
        }
        return closest(selectedCell.parentElement, 'table') as HTMLTableElement;
    }

    /*
     * Checks if the table already has a header element.
     */
    private checkIfTableHasHeader(table: HTMLTableElement): boolean {
        let headerExists: boolean = false;

        Array.prototype.slice.call(table.childNodes).forEach((childNode: Element): void => {
            if (childNode.nodeName === 'THEAD') {
                headerExists = true;
            }
        });

        return headerExists;
    }

    /*
     * Creates a header row for the table with appropriate number of cells.
     */
    private createTableHeader(table: HTMLTableElement): void {
        const firstRow: HTMLTableRowElement = table.querySelector('tr');
        const cellCount: number = firstRow.childElementCount;
        let totalCellCount: number = 0;

        for (let i: number = 0; i < cellCount; i++) {
            const colspanValue: number = parseInt(firstRow.children[i as number].getAttribute('colspan'), 10) || 1;
            totalCellCount += colspanValue;
        }

        const headerSection: HTMLTableSectionElement = table.createTHead();
        const headerRow: HTMLTableRowElement = headerSection.insertRow(0);

        this.createHeaderCells(headerRow, totalCellCount);
    }

    /*
     * Creates the appropriate number of header cells in the header row.
     */
    private createHeaderCells(headerRow: HTMLTableRowElement, cellCount: number): void {
        for (let j: number = 0; j < cellCount; j++) {
            const thElement: HTMLElement = createElement('th');
            thElement.appendChild(createElement('br'));
            headerRow.appendChild(thElement);
        }
    }

    /*
     * Sets the vertical alignment for the selected table cell.
     */
    private tableVerticalAlign(e: IHtmlItem): void {
        const alignValue: string = this.getVerticalAlignmentValue(e.item.subCommand);
        this.applyVerticalAlignment(e.item.tableCell, alignValue);
        this.executeCallback(e);
    }

    /*
     * Determines the vertical alignment CSS value based on the subcommand.
     */
    private getVerticalAlignmentValue(subCommand: string): string {
        switch (subCommand) {
        case 'AlignTop':
            return 'top';
        case 'AlignMiddle':
            return 'middle';
        case 'AlignBottom':
            return 'bottom';
        default:
            return '';
        }
    }

    /*
     * Applies the vertical alignment to the table cell and removes any obsolete
     * valign attribute if necessary.
     */
    private applyVerticalAlignment(cell: HTMLElement, value: string): void {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable && this.curTable.querySelectorAll('.e-cell-select');
        if (selectedCells && selectedCells.length > 0) {
            for (let i: number = 0; i < selectedCells.length; i++) {
                (selectedCells[i as number] as HTMLElement).style.verticalAlign = value;
            }
        }
        else {
            cell.style.verticalAlign = value;
        }
        if (value && value !== '' && cell.getAttribute('valign')) {
            cell.removeAttribute('valign');
        }
    }

    /*
     * Merges selected table cells into a single cell, preserving content and handling
     * rowspan/colspan attributes appropriately.
     */
    private cellMerge(e: IHtmlItem): void {
        if (isNOU(this.curTable)) {
            this.curTable = closest(this.parent.nodeSelection.range.startContainer.parentElement, 'table') as HTMLTableElement;
        }
        const selectedCells: NodeListOf<Element> = this.curTable.querySelectorAll('.e-cell-select');
        if (selectedCells.length < 2) {
            return;
        }
        insertColGroupWithSizes(this.curTable);
        const beforeMergeCellCount: number = getMaxCellCount(this.curTable);
        this.mergeCellContent();
        const minMaxIndexes: MinMax = this.getSelectedMinMaxIndexes(getCorrespondingColumns(this.curTable));
        this.configureFirstCellForMerge(selectedCells, minMaxIndexes);
        this.cleanupAfterMerge(selectedCells);
        this.updateTableStructureAfterMerge(minMaxIndexes);
        // Update colgroup after merging cells
        this.updateColgroupAfterMerge(minMaxIndexes.startColumn, minMaxIndexes.endColumn, beforeMergeCellCount);
        this.updateSelectionAfterMerge(e, selectedCells[0]);
        this.executeCallback(e);
    }

    /*
     * Configures the first cell with proper width, height, rowspan and colspan attributes.
     */
    private configureFirstCellForMerge(selectedCells: NodeListOf<Element>, minMaxIndexes: MinMax): void {
        const firstCell: HTMLElement = selectedCells[0] as HTMLElement;
        const rowSelectedCells: NodeListOf<HTMLElement> = firstCell.parentElement.querySelectorAll('.e-cell-select');
        if (minMaxIndexes.startColumn < minMaxIndexes.endColumn) {
            firstCell.setAttribute('colspan', (minMaxIndexes.endColumn - minMaxIndexes.startColumn + 1).toString());
        }
        if (minMaxIndexes.startRow < minMaxIndexes.endRow) {
            firstCell.setAttribute('rowspan', (minMaxIndexes.endRow - minMaxIndexes.startRow + 1).toString());
        }
        const maxHeight: number = this.calculateMaxCellHeight(rowSelectedCells);
        firstCell.style.height = maxHeight + 'px';
    }

    /*
     * Updates colgroup structure after cells are merged
     */
    private updateColgroupAfterMerge(startCol: number, endCol: number, beforeMergeCellCount: number): void {
        const colGroup: HTMLElement = getColGroup(this.curTable);
        const diffCount: number = this.isEntireColumnsMerged(beforeMergeCellCount);
        // Only proceed if multiple columns are merged
        if (startCol < endCol && diffCount > 0) {
            let cols: NodeListOf<HTMLElement> = colGroup.querySelectorAll('col');
            let totalWidth: number = parseFloat(cols[startCol as number].style.width) || 0;
            if (startCol < cols.length) {
                for (let i: number = 0; i < diffCount; i++) {
                    const colIndex: number = startCol + 1; // Always remove the column after startCol
                    if (colIndex < cols.length) {
                        totalWidth += parseFloat(cols[colIndex as number].style.width);
                        colGroup.removeChild(cols[colIndex as number]);
                        cols = colGroup.querySelectorAll('col');
                    }
                }
            }
            cols[startCol as number].style.width = totalWidth + '%';
        }
    }

    /*
     * Checks if the entire columns have been merged across all rows
     */
    private isEntireColumnsMerged(beforeMergeCellCount: number): number {
        const afterMergeCellCount: number = getMaxCellCount(this.curTable);
        // Check if cell count decreased, indicating columns were merged
        const diffCount: number = beforeMergeCellCount - afterMergeCellCount;
        return diffCount;
    }

    /*
     * Calculates the maximum height among cells in the same row.
     */
    private calculateMaxCellHeight(cells: NodeListOf<HTMLElement>): number {
        let maxHeight: number = 0;
        for (let j: number = 0; j < cells.length; j++) {
            const cellHeight: number = cells[j as number].offsetHeight;
            if (cellHeight > maxHeight) {
                maxHeight = cellHeight;
            }
        }
        return maxHeight;
    }

    /*
     * Removes the other cells after merge and cleans up empty rows.
     */
    private cleanupAfterMerge(selectedCells: NodeListOf<Element>): void {
        for (let i: number = 1; i < selectedCells.length; i++) {
            detach(selectedCells[i as number]);
        }
        for (let i: number = 0; i < this.curTable.rows.length; i++) {
            if (this.curTable.rows[i as number].innerHTML.trim() === '') {
                detach(this.curTable.rows[i as number]);
            }
        }
        removeClassWithAttr(this.curTable.querySelectorAll('table td, table th'), 'e-multi-cells-select');
        removeClassWithAttr(this.curTable.querySelectorAll('table td, table th'), 'e-cell-select-end');
    }

    /*
     * Updates table structure after merge to maintain proper rowspan/colspan relationships.
     */
    private updateTableStructureAfterMerge(minMaxIndexes: MinMax): void {
        this.updateRowSpanStyle(minMaxIndexes.startRow, minMaxIndexes.endRow, getCorrespondingColumns(this.curTable));
        this.updateColSpanStyle(minMaxIndexes.startColumn, minMaxIndexes.endColumn, getCorrespondingColumns(this.curTable));
    }

    /*
     * Updates selection after merge operation to focus on the first cell.
     */
    private updateSelectionAfterMerge(e: IHtmlItem, firstCell: Node): void {
        e.item.selection.setSelectionText(
            this.tableModel.getDocument(),
            e.item.selection.range.startContainer,
            e.item.selection.range.startContainer,
            0, 0
        );
        if (this.parent.nodeSelection && firstCell) {
            this.parent.nodeSelection.setCursorPoint(
                this.tableModel.getDocument(),
                firstCell as HTMLElement,
                0
            );
        }
    }

    /*
     * Updates the colspan attributes of cells in a specified range within the table.
     * This method handles the complex logic of adjusting colspan values when cells are merged or split.
     */
    private updateColSpanStyle(min: number, max: number, elements: HTMLElement[][]): void {
        let colIndex: number;
        let index: number = 0;
        let count: number = 0;
        const eleArray: HTMLElement[][] = elements;
        max = Math.min(max, eleArray[0].length - 1);
        if (min < max) {
            for (colIndex = min; colIndex <= max; colIndex++) {
                index = this.getEffectiveColspan(eleArray[0][colIndex as number], max - min + 1);
                if (this.isValidColspanStart(eleArray[0], min, colIndex, index)) {
                    count = this.processRowsForColspan(eleArray, colIndex, index);
                    if (!count) {
                        break;
                    }
                }
            }
            // Apply the calculated colspan adjustments if needed
            if (count) {
                this.updateCellAttribute(eleArray, count, 'colspan', 0, eleArray.length - 1, min, max);
            }
        }
    }

    /*
     * Gets the effective colspan value of a cell, capped by a maximum value.
     */
    private getEffectiveColspan(cell: HTMLElement, maxAllowed: number): number {
        const colspanAttr: string | null = cell.getAttribute('colspan');
        const colspan: number = colspanAttr ? parseInt(colspanAttr, 10) : 1;
        return Math.min(colspan, maxAllowed);
    }

    /*
     * Determines if a cell is a valid starting point for colspan processing.
     * A valid starting cell is one that isn't part of a previous colspan
     * and has colspan > 1 and continues to next cell.
     */
    private isValidColspanStart(row: HTMLElement[], min: number, colIndex: number, colspan: number): boolean {
        const isPreviousCellContinuation: boolean = min < colIndex && row[colIndex as number] === row[colIndex - 1];
        const hasValidColspan: boolean = colspan > 1 && row[colIndex as number] === row[colIndex + 1];
        return !isPreviousCellContinuation && hasValidColspan;
    }

    /*
     * Processes all rows to ensure consistent colspan structure.
     */
    private processRowsForColspan(eleArray: HTMLElement[][], colIndex: number, index: number): number {
        let count: number = index - 1;
        for (let rowIndex: number = 1; rowIndex < eleArray.length; rowIndex++) {
            if (eleArray[rowIndex as number][colIndex as number] !== eleArray[rowIndex - 1][colIndex as number]) {
                count = this.processRowCells(eleArray, rowIndex, colIndex, index, count);
                if (!count) {
                    break;
                }
            }
        }
        return count;
    }

    /*
     * Processes cells in a specific row to adjust colspan values.
     */
    private processRowCells(eleArray: HTMLElement[][], rowIndex: number, colIndex: number, index: number, count: number): number {
        let updatedCount: number = count;

        for (let colMin: number = colIndex; colMin < colIndex + index; colMin++) {
            const attrValue: number = parseInt(
                eleArray[rowIndex as number][colMin as number].getAttribute('colspan'), 10
            ) || 1;
            if (attrValue > 1 &&
                eleArray[rowIndex as number][colMin as number] === eleArray[rowIndex as number][colMin + 1]) {
                colMin += updatedCount = Math.min(updatedCount, attrValue - 1);
            } else {
                updatedCount = Math.max(0, updatedCount - 1);
                if (updatedCount === 0) {
                    break;
                }
            }
        }
        return updatedCount;
    }

    /*
     * Updates rowspan attributes of cells in the specified range within the table.
     * This complex method manages rowspans when merging or splitting cells.
     */
    private updateRowSpanStyle(min: number, max: number, ele: HTMLElement[][]): void {
        const eleArray: HTMLElement[][] = ele;
        let count: number = 0;
        max = Math.min(max, eleArray.length - 1);
        if (min < max) {
            for (let rowValue: number = min; rowValue <= max; rowValue++) {
                if (this.isValidRowspanStart(eleArray, min, rowValue, max)) {
                    const index: number = this.getEffectiveRowspan(eleArray[rowValue as number][0], max - min + 1);
                    count = this.processColumnsForRowspan(eleArray, rowValue, index);
                    if (!count) {
                        break;
                    }
                }
            }
            if (count) {
                this.updateCellAttribute(eleArray, count, 'rowspan', min, max, 0, eleArray[0].length - 1);
            }
        }
    }

    /*
     * Determines if a row is a valid starting point for rowspan processing.
     * Valid if it's not part of a previous row's rowspan and has rowspan > 1.
     */
    private isValidRowspanStart(eleArray: HTMLElement[][], min: number, rowValue: number, max: number): boolean {
        const notContinuingPreviousSpan: boolean = !(min < rowValue &&
            eleArray[rowValue as number][0] === eleArray[rowValue - 1][0]);
        const cellExists: boolean = !!eleArray[rowValue as number][0];
        let rowspan: number = 0;
        if (cellExists) {
            const rowspanAttr: string = eleArray[rowValue as number][0].getAttribute('rowspan');
            rowspan = rowspanAttr ? parseInt(rowspanAttr, 10) : 1;
            rowspan = Math.min(rowspan, max - min + 1);
        }
        const spansToNextRow: boolean = rowspan > 1 &&
            rowValue + 1 <= max &&
            eleArray[rowValue as number][0] === eleArray[rowValue + 1][0];
        return notContinuingPreviousSpan && cellExists && rowspan > 1 && spansToNextRow;
    }

    /*
     * Gets the effective rowspan value for a cell, capped by the maximum allowed value.
     */
    private getEffectiveRowspan(cell: HTMLElement, maxAllowed: number): number {
        const rowspanAttr: string = cell.getAttribute('rowspan');
        const rowspan: number = rowspanAttr ? parseInt(rowspanAttr, 10) : 1;
        return Math.min(rowspan, maxAllowed);
    }

    /*
     * Processes all columns to ensure consistent rowspan structure.
     */
    private processColumnsForRowspan(eleArray: HTMLElement[][], rowValue: number, index: number): number {
        let count: number = index - 1;
        for (let colIndex: number = 1; colIndex < eleArray[0].length; colIndex++) {
            if (eleArray[rowValue as number][colIndex as number] !== eleArray[rowValue as number][colIndex - 1]) {
                count = this.processColumnCells(eleArray, rowValue, colIndex, index, count);
                if (!count) {
                    break;
                }
            }
        }
        return count;
    }

    /*
     * Processes cells in a specific column to adjust rowspan values.
     */
    private processColumnCells(
        eleArray: HTMLElement[][],
        rowValue: number,
        colIndex: number,
        index: number,
        count: number
    ): number {
        let updatedCount: number = count;
        for (let rowMin: number = rowValue; rowMin < rowValue + index; rowMin++) {
            const attrValue: number = parseInt(
                eleArray[rowMin as number][colIndex as number].getAttribute('rowspan'), 10
            ) || 1;
            if (attrValue > 1 &&
                rowMin + 1 < eleArray.length &&
                eleArray[rowMin as number][colIndex as number] === eleArray[rowMin + 1][colIndex as number]) {
                rowMin += updatedCount = Math.min(updatedCount, attrValue - 1);
            } else {
                updatedCount = Math.max(0, updatedCount - 1);
                if (updatedCount === 0) {
                    break;
                }
            }
        }
        return updatedCount;
    }

    /*
     * Updates cell attributes for spans (colspan/rowspan) within a specified range of cells.
     * Decrements or removes span attributes based on the merging/splitting operation.
     */
    private updateCellAttribute(
        elements: HTMLElement[][],
        index: number,
        attr: string,
        min: number,
        max: number,
        firstIndex: number,
        length: number
    ): void {
        for (let rowIndex: number = min; rowIndex <= max; rowIndex++) {
            for (let colIndex: number = firstIndex; colIndex <= length; colIndex++) {
                const spanCount: number = parseInt(elements[rowIndex as number][colIndex as number].getAttribute(attr), 10) || 1;
                if (this.shouldUpdateCellAttribute(elements, rowIndex, colIndex, min, firstIndex, spanCount)) {
                    const newSpanValue: number = spanCount - index;
                    this.updateSpanAttribute(elements[rowIndex as number][colIndex as number], attr, newSpanValue);
                }
            }
        }
    }

    /*
     * Determines if a cell's span attribute should be updated.
     */
    private shouldUpdateCellAttribute(
        elements: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        minRow: number,
        firstColIndex: number,
        spanCount: number
    ): boolean {
        const isPartOfVerticalSpan: boolean = minRow < rowIndex &&
            elements[rowIndex as number][colIndex as number] === elements[rowIndex - 1][colIndex as number];
        const isPartOfHorizontalSpan: boolean = firstColIndex < colIndex &&
            elements[rowIndex as number][colIndex as number] === elements[rowIndex as number][colIndex - 1];
        const hasSpanGreaterThanOne: boolean = spanCount > 1;
        return isPartOfVerticalSpan || isPartOfHorizontalSpan || hasSpanGreaterThanOne;
    }

    /*
     * Updates the span attribute of a cell or removes it if the new value is 1.
     */
    private updateSpanAttribute(cell: HTMLElement, attr: string, newValue: number): void {
        if (newValue > 1) {
            cell.setAttribute(attr, newValue.toString());
        } else {
            cell.removeAttribute(attr);
        }
    }

    /*
     * Merges the content of all selected cells into the first cell.
     * Empty cells or cells with only a <br> tag are treated as empty.
     */
    private mergeCellContent(): void {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        let innerHtml: string = this.isCellEmpty(selectedCells[0]) ? '' : selectedCells[0].innerHTML;
        for (let i: number = 1; i < selectedCells.length; i++) {
            const currentCell: HTMLElement = selectedCells[i as number];
            if (!this.isCellEmpty(currentCell)) {
                innerHtml = this.appendCellContent(innerHtml, currentCell.innerHTML);
            }
        }
        selectedCells[0].innerHTML = innerHtml;
    }

    /*
     * Checks if a cell is empty or contains only a <br> tag.
     */
    private isCellEmpty(cell: HTMLElement): boolean {
        return cell.innerHTML === '<br>' || cell.innerHTML === '';
    }

    /*
     * Appends cell content with appropriate separator.
     */
    private appendCellContent(existingContent: string, newContent: string): string {
        return existingContent ? existingContent + '<br>' + newContent : newContent;
    }

    /*
     * Calculates the min and max row/column indexes of selected cells.
     * This is used to determine the boundaries of the area being merged.
     */
    private getSelectedMinMaxIndexes(correspondingCells: HTMLElement[][]): MinMax | null {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        if (selectedCells.length > 0) {
            let minMaxData: MinMax = this.initializeMinMaxData(correspondingCells);
            for (let i: number = 0; i < selectedCells.length; i++) {
                minMaxData = this.updateMinMaxWithCell(
                    minMaxData,
                    selectedCells[i as number],
                    correspondingCells
                );
            }
            return minMaxData;
        }
        return null;
    }

    /*
     * Initializes MinMax data structure with default boundary values.
     */
    private initializeMinMaxData(cells: HTMLElement[][]): MinMax {
        return {
            startRow: cells.length,
            endRow: 0,
            startColumn: cells[0].length,
            endColumn: 0
        };
    }

    /*
     * Updates MinMax boundaries based on a specific cell.
     */
    private updateMinMaxWithCell(
        currentMinMax: MinMax,
        cell: HTMLElement,
        cells: HTMLElement[][]
    ): MinMax {
        const currentRowCol: number[] = getCorrespondingIndex(cell, cells);
        const targetRowCol: number[] = this.FindIndex(currentRowCol[0], currentRowCol[1], cells);
        return {
            startRow: Math.min(currentRowCol[0], currentMinMax.startRow),
            endRow: Math.max(targetRowCol[0], currentMinMax.endRow),
            startColumn: Math.min(currentRowCol[1], currentMinMax.startColumn),
            endColumn: Math.max(targetRowCol[1], currentMinMax.endColumn)
        };
    }

    /*
     * Splits a selected table cell horizontally into two cells.
     * The selected cell's rowspan will be divided between the original and new cell.
     */
    private horizontalSplit(e: IHtmlItem): void {
        const selectedCell: Node = e.item.selection.range.startContainer;
        this.curTable = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        if ((this.curTable as HTMLElement).querySelectorAll('.e-cell-select').length > 1) {
            return;
        }
        this.activeCell = this.curTable.querySelector('.e-cell-select');
        const newCell: HTMLElement = this.prepareNewCellForSplit();
        const activeCellIndex: number[] = getCorrespondingIndex(this.activeCell, getCorrespondingColumns(this.curTable));
        const correspondingCells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const activeCellRowSpan: number = this.getRowSpanValue(this.activeCell);
        if (activeCellRowSpan > 1) {
            this.splitCellWithRowspan(activeCellRowSpan, activeCellIndex, correspondingCells, newCell);
        } else {
            this.splitCellWithoutRowspan(activeCellIndex, correspondingCells, newCell);
        }
        this.executeCallback(e);
    }

    /*
     * Prepares a new table cell by cloning the active cell and resetting its properties.
     */
    private prepareNewCellForSplit(): HTMLElement {
        const newCell: HTMLElement = this.activeCell.cloneNode(true) as HTMLElement;
        newCell.removeAttribute('class');
        newCell.innerHTML = '<br>';
        return newCell;
    }

    /*
     * Gets the rowspan value of a cell, defaulting to 1 if not specified.
     */
    private getRowSpanValue(cell: HTMLElement): number {
        return cell.getAttribute('rowspan') ? parseInt(cell.getAttribute('rowspan'), 10) : 1;
    }

    /*
     * Splits a cell that has rowspan > 1 by distributing the rowspan between the cells.
     */
    private splitCellWithRowspan(
        currentRowspan: number,
        activeCellIndex: number[],
        correspondingCells: HTMLElement[][],
        newCell: HTMLElement
    ): void {
        const topHalfRowspan: number = Math.ceil(currentRowspan / 2);
        const bottomHalfRowspan: number = currentRowspan - topHalfRowspan;
        this.updateRowspanAttributes(this.activeCell, newCell, topHalfRowspan, bottomHalfRowspan);
        const avgRowIndex: number = activeCellIndex[0] + topHalfRowspan;
        const insertionColIndex: number = this.findInsertionColumnIndex(correspondingCells, avgRowIndex, activeCellIndex[1]);
        this.insertNewCellIntoRow(correspondingCells, avgRowIndex, insertionColIndex, newCell);
    }

    /*
     * Updates rowspan attributes for both cells in the split operation.
     */
    private updateRowspanAttributes(
        activeCell: HTMLElement,
        newCell: HTMLElement,
        topHalfRowspan: number,
        bottomHalfRowspan: number
    ): void {
        if (topHalfRowspan > 1) {
            activeCell.setAttribute('rowspan', topHalfRowspan.toString());
        } else {
            activeCell.removeAttribute('rowspan');
        }
        if (bottomHalfRowspan > 1) {
            newCell.setAttribute('rowspan', bottomHalfRowspan.toString());
        } else {
            newCell.removeAttribute('rowspan');
        }
    }

    /*
     * Finds the appropriate column index to insert the new cell.
     */
    private findInsertionColumnIndex(
        correspondingCells: HTMLElement[][],
        rowIndex: number,
        originalColIndex: number
    ): number {
        let colIndex: number = originalColIndex === 0 ? originalColIndex : originalColIndex - 1;
        while (colIndex >= 0) {
            const isPartOfHorizontalSpan: boolean =
                correspondingCells[rowIndex as number][colIndex as number] ===
                correspondingCells[rowIndex as number][colIndex - 1];
            const isPartOfVerticalSpan: boolean =
                rowIndex > 0 &&
                correspondingCells[rowIndex as number][colIndex as number] ===
                correspondingCells[rowIndex - 1][colIndex as number];
            if (!(isPartOfHorizontalSpan || isPartOfVerticalSpan)) {
                break;
            }
            colIndex--;
        }
        return colIndex;
    }

    /*
     * Inserts the new cell into the appropriate row.
     */
    private insertNewCellIntoRow(
        correspondingCells: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        newCell: HTMLElement
    ): void {
        if (colIndex === -1) {
            const targetRow: HTMLElement = this.curTable.rows[rowIndex as number];
            if (targetRow.firstChild) {
                targetRow.prepend(newCell);
            } else {
                this.curTable.appendChild(newCell);
            }
        } else {
            correspondingCells[rowIndex as number][colIndex as number].insertAdjacentElement('afterend', newCell);
        }
    }

    /*
     * Splits a cell without rowspan by creating a new row with the new cell.
     */
    private splitCellWithoutRowspan(
        activeCellIndex: number[],
        correspondingCells: HTMLElement[][],
        newCell: HTMLElement
    ): void {
        const newRow: HTMLElement = createElement('tr');
        newRow.appendChild(newCell);
        const selectedRow: HTMLElement[] = correspondingCells[activeCellIndex[0]];
        this.adjustRowspansInRow(selectedRow);
        (this.activeCell.parentNode as HTMLElement).insertAdjacentElement('afterend', newRow);
    }

    /*
     * Adjusts rowspan attributes of other cells in the row being split.
     */
    private adjustRowspansInRow(rowCells: HTMLElement[]): void {
        for (let j: number = 0; j <= rowCells.length - 1; j++) {
            if (rowCells[j as number] !== rowCells[j - 1] && rowCells[j as number] !== this.activeCell) {
                const currentRowspan: number = parseInt(rowCells[j as number].getAttribute('rowspan'), 10) || 1;
                rowCells[j as number].setAttribute('rowspan', (currentRowspan + 1).toString());
            }
        }
    }

    /*
     * Splits a selected table cell vertically into two cells.
     * The selected cell's colspan will be divided between the original and new cell.
     */
    private verticalSplit(e: IHtmlItem): void {
        const selectedCell: Node = e.item.selection.range.startContainer;
        this.curTable = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        if ((this.curTable as HTMLElement).querySelectorAll('.e-cell-select').length > 1) {
            return;
        }
        insertColGroupWithSizes(this.curTable);
        const beforeSplitsCellCount: number = getMaxCellCount(this.curTable);
        this.activeCell = this.curTable.querySelector('.e-cell-select');
        const newCell: HTMLElement = this.prepareNewCellForVerticalSplit();
        const activeCellIndex: number[] = getCorrespondingIndex(this.activeCell, getCorrespondingColumns(this.curTable));
        const correspondingColumns: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const activeCellColSpan: number = this.getColSpanValue(this.activeCell);
        let splitedCellsWidth: { leftCellWidth: number; rightCellWidth: number } = { leftCellWidth: 0, rightCellWidth: 0 };
        if (activeCellColSpan > 1) {
            splitedCellsWidth = this.splitCellWithColspan(activeCellColSpan, activeCellIndex, newCell);
        } else {
            splitedCellsWidth = this.splitCellWithoutColspan(activeCellIndex, correspondingColumns);
        }
        this.activeCell.parentNode.insertBefore(newCell, this.activeCell.nextSibling);
        this.updateColgroupAfterVerticalSplit(this.curTable, activeCellIndex[1], splitedCellsWidth, beforeSplitsCellCount);
        this.executeCallback(e);
    }

    /*
        * Updates colgroup structure after vertical split
    */
    private updateColgroupAfterVerticalSplit(
        table: HTMLTableElement,
        originalColIndex: number,
        splitedCellsWidth: { leftCellWidth: number; rightCellWidth: number },
        beforeSplitsCellCount: number
    ): void {
        const colGroup: HTMLElement = getColGroup(table);
        const afterSplitsCellCount: number = getMaxCellCount(table);
        const cols: NodeListOf<HTMLElement> = colGroup.querySelectorAll('col');
        if (originalColIndex < cols.length && beforeSplitsCellCount < afterSplitsCellCount) {
            cols[originalColIndex as number].style.width = splitedCellsWidth.leftCellWidth + '%';
            const newCol: HTMLElement = createElement('col');
            newCol.appendChild(createElement('br'));
            newCol.style.width = splitedCellsWidth.rightCellWidth + '%';
            cols[originalColIndex as number].parentNode.insertBefore(newCol, cols[originalColIndex as number].nextSibling);
        }
    }

    /*
     * Prepares a new table cell by cloning the active cell and resetting its properties.
     */
    private prepareNewCellForVerticalSplit(): HTMLElement {
        const newCell: HTMLElement = this.activeCell.cloneNode(true) as HTMLElement;
        newCell.removeAttribute('class');
        newCell.innerHTML = '<br>';
        return newCell;
    }

    /*
     * Gets the colspan value of a cell, defaulting to 1 if not specified.
     */
    private getColSpanValue(cell: HTMLElement): number {
        return parseInt(cell.getAttribute('colspan'), 10) || 1;
    }

    /*
     * Splits a cell that has colspan > 1 by distributing the colspan between the cells.
     */
    private splitCellWithColspan(
        currentColspan: number,
        activeCellIndex: number[],
        newCell: HTMLElement
    ): { leftCellWidth: number; rightCellWidth: number } {
        const leftHalfColspan: number = Math.ceil(currentColspan / 2);
        const rightHalfColspan: number = currentColspan - leftHalfColspan;
        const colSizes: number[] = this.getColSizes(this.curTable);
        const leftCellWidth: number = this.calculateLeftCellWidth(
            activeCellIndex[1],
            leftHalfColspan,
            colSizes
        );
        const rightCellWidth: number = this.calculateRightCellWidth(
            activeCellIndex[1],
            leftHalfColspan,
            currentColspan,
            colSizes,
            leftCellWidth
        );
        this.updateColspanAttributes(this.activeCell, newCell, leftHalfColspan, rightHalfColspan);
        return { leftCellWidth: leftCellWidth, rightCellWidth: rightCellWidth };
    }

    /*
     * Calculates the width for the left cell after splitting.
     */
    private calculateLeftCellWidth(
        startColIndex: number,
        leftHalfColspan: number,
        colSizes: number[]
    ): number {
        return this.getSplitColWidth(
            startColIndex,
            startColIndex + leftHalfColspan - 1,
            colSizes
        );
    }

    /*
     * Calculates the width for the right cell after splitting.
     */
    private calculateRightCellWidth(
        startColIndex: number,
        leftHalfColspan: number,
        totalColspan: number,
        colSizes: number[],
        leftCellWidth: number
    ): number {
        const calculatedWidth: number = this.getSplitColWidth(
            startColIndex + leftHalfColspan,
            startColIndex + totalColspan - 1,
            colSizes
        );
        const activeCellWidth: number = convertPixelToPercentage(
            this.activeCell.offsetWidth,
            this.curTable.offsetWidth
        );
        return (activeCellWidth - leftCellWidth) < calculatedWidth ?
            (activeCellWidth - leftCellWidth) : calculatedWidth;
    }

    /*
     * Updates colspan attributes for both cells in the split operation.
     */
    private updateColspanAttributes(
        activeCell: HTMLElement,
        newCell: HTMLElement,
        leftHalfColspan: number,
        rightHalfColspan: number
    ): void {
        if (leftHalfColspan > 1) {
            activeCell.setAttribute('colspan', leftHalfColspan.toString());
        } else {
            activeCell.removeAttribute('colspan');
        }
        if (rightHalfColspan > 1) {
            newCell.setAttribute('colspan', rightHalfColspan.toString());
        } else {
            newCell.removeAttribute('colspan');
        }
    }


    /*
     * Splits a cell without colspan by creating two cells with equal width.
     */
    private splitCellWithoutColspan(
        activeCellIndex: number[],
        correspondingColumns: HTMLElement[][]
    ): { leftCellWidth: number; rightCellWidth: number } {
        const avgWidth: number = convertPixelToPercentage(this.activeCell.offsetWidth, this.curTable.offsetWidth) / 2;
        this.adjustColspansInColumn(correspondingColumns, activeCellIndex);
        return { leftCellWidth: avgWidth, rightCellWidth: avgWidth };
    }

    /*
     * Adjusts colspan attributes of other cells in the column being split.
     */
    private adjustColspansInColumn(
        correspondingColumns: HTMLElement[][],
        activeCellIndex: number[]
    ): void {
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = this.curTable.rows;
        for (let i: number = 0; i <= allRows.length - 1; i++) {
            if (this.shouldAdjustColspanForCell(i, correspondingColumns, activeCellIndex)) {
                const currentCell: HTMLElement = correspondingColumns[i as number][activeCellIndex[1]];
                this.incrementColspan(currentCell);
            }
        }
    }

    /*
     * Determines if a cell's colspan should be adjusted during a vertical split.
     */
    private shouldAdjustColspanForCell(
        rowIndex: number,
        correspondingColumns: HTMLElement[][],
        activeCellIndex: number[]
    ): boolean {
        return (rowIndex === 0 ||
            correspondingColumns[rowIndex as number][activeCellIndex[1]] !== correspondingColumns[rowIndex - 1][activeCellIndex[1]]) &&
            correspondingColumns[rowIndex as number][activeCellIndex[1]] !== this.activeCell;
    }

    /*
     * Increments the colspan attribute of a cell.
     */
    private incrementColspan(cell: HTMLElement): void {
        const currentColspan: number = parseInt(cell.getAttribute('colspan'), 10) || 1;
        cell.setAttribute('colspan', (currentColspan + 1).toString());
    }

    /*
     * Calculates the width of a specific column range for splitting.
     */
    private getSplitColWidth(startIndex: number, endIndex: number, sizes: number[]): number {
        let width: number = 0;
        for (let i: number = startIndex; i <= endIndex; i++) {
            width += sizes[i as number];
        }
        return convertPixelToPercentage(width, this.curTable.offsetWidth);
    }

    /*
     * Calculates column widths for table cells, handling complex layouts with rowspan and colspan.
     * Used during table operations such as split cell to maintain proper proportions.
     */
    private getColSizes(curTable: HTMLTableElement): number[] {
        const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = curTable.rows[0].cells;
        let cellCount: number = 0;
        for (let cell: number = 0; cell < cellColl.length; cell++) {
            cellCount = cellCount + cellColl[cell as number].colSpan;
        }
        const sizes: number[] = new Array(cellCount);
        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
        for (let i: number = 0; i < curTable.rows.length; i++) {
            let currentColIndex: number = 0;
            for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                this.mapRowspanCells(curTable, rowSpanCells, i, k, currentColIndex);
                const cellIndex: number = getCellIndex(rowSpanCells, i, k);
                if (cellIndex > currentColIndex) {
                    currentColIndex = cellIndex;
                }
                this.storeCellWidth(curTable, sizes, currentColIndex, i, k);
                currentColIndex += 1 + curTable.rows[i as number].cells[k as number].colSpan - 1;
            }
        }
        return sizes;
    }

    /*
     * Maps cells with rowspan attributes for tracking complex table layouts.
     */
    private mapRowspanCells(
        curTable: HTMLTableElement,
        rowSpanCells: Map<string, HTMLTableDataCellElement>,
        rowIndex: number,
        cellIndex: number,
        colIndex: number
    ): void {
        for (let l: number = 1; l < curTable.rows[rowIndex as number].cells[cellIndex as number].rowSpan; l++) {
            const key: string = `${rowIndex + l}${colIndex}`;
            rowSpanCells.set(key, curTable.rows[rowIndex as number].cells[cellIndex as number]);
        }
    }

    /*
     * Stores the width of a cell in the sizes array if it's smaller than existing width or not yet set.
     */
    private storeCellWidth(
        curTable: HTMLTableElement,
        sizes: number[],
        colIndex: number,
        rowIndex: number,
        cellIndex: number
    ): void {
        const width: number = curTable.rows[rowIndex as number].cells[cellIndex as number].offsetWidth;
        if (!sizes[colIndex as number] || width < sizes[colIndex as number]) {
            sizes[colIndex as number] = width;
        }
    }

    /*
     * Finds the end indices of a cell in the table matrix, considering rowspan and colspan.
     */
    private FindIndex(rowIndex: number, columnIndex: number, cells: HTMLElement[][]): number[] {
        let endRowIndex: number = rowIndex + 1;
        let endColumnIndex: number = columnIndex + 1;
        while (endRowIndex < cells.length) {
            if (cells[endRowIndex as number][columnIndex as number] !== cells[rowIndex as number][columnIndex as number]) {
                endRowIndex--;
                break;
            }
            endRowIndex++;
        }
        if (endRowIndex === cells.length) {
            endRowIndex--;
        }
        while (endColumnIndex < cells[rowIndex as number].length) {
            if (cells[rowIndex as number][endColumnIndex as number] !== cells[rowIndex as number][columnIndex as number]) {
                endColumnIndex--;
                break;
            }
            endColumnIndex++;
        }
        if (endColumnIndex === cells[rowIndex as number].length) {
            endColumnIndex--;
        }
        return [endRowIndex, endColumnIndex];
    }

    /*
     * Checks if the cell has a rowspan or colspan greater than 1.
     */
    private isMergedCell(cell: HTMLElement): boolean {
        return (
            (parseInt(cell.getAttribute('rowspan') || '1', 10) > 1) ||
            (parseInt(cell.getAttribute('colspan') || '1', 10) > 1)
        );
    }

    /*
     * Adjusts the selection boundary based on merged cells (rowspan/colspan).
     */
    private adjustBoundary(
        rowIndex: number,
        colIndex: number,
        eleArray: HTMLElement[][],
        minRowIndex: number,
        maxRowIndex: number,
        minColIndex: number,
        maxColIndex: number
    ): [number, number, number, number] {
        const startCell: number[] = getCorrespondingIndex(eleArray[rowIndex as number][colIndex as number], eleArray);
        const endCell: number[] = this.FindIndex(startCell[0], startCell[1], eleArray);

        if (endCell) {
            minRowIndex = Math.min(startCell[0], minRowIndex);
            maxRowIndex = Math.max(endCell[0], maxRowIndex);
            minColIndex = Math.min(startCell[1], minColIndex);
            maxColIndex = Math.max(endCell[1], maxColIndex);
        }

        return [minRowIndex, maxRowIndex, minColIndex, maxColIndex];
    }

    /*
     * Highlights a range of cells in a table, accounting for merged cells (rowspan/colspan)
     * by expanding the selection to fully include any partially selected merged cells.
     */
    private highlightCells(
        minRow: number,
        maxRow: number,
        minCol: number,
        maxCol: number,
        eleArray: HTMLElement[][]
    ): MinMax {
        let minRowIndex: number = minRow;
        let maxRowIndex: number = maxRow;
        let minColIndex: number = minCol;
        let maxColIndex: number = maxCol;

        // Loop through rows to adjust selection boundaries
        for (let j: number = minRowIndex; j <= maxRowIndex; j++) {
            if (this.isMergedCell(eleArray[j as number][minColIndex as number])) {
                [minRowIndex, maxRowIndex, minColIndex, maxColIndex] =
                    this.adjustBoundary(j, minColIndex, eleArray, minRowIndex, maxRowIndex, minColIndex, maxColIndex);
            }
            if (this.isMergedCell(eleArray[j as number][maxColIndex as number])) {
                [minRowIndex, maxRowIndex, minColIndex, maxColIndex] =
                    this.adjustBoundary(j, maxColIndex, eleArray, minRowIndex, maxRowIndex, minColIndex, maxColIndex);
            }

            // Loop through columns to adjust selection boundaries
            for (let k: number = minColIndex; k <= maxColIndex; k++) {
                if (this.isMergedCell(eleArray[minRowIndex as number][k as number])) {
                    [minRowIndex, maxRowIndex, minColIndex, maxColIndex] =
                        this.adjustBoundary(minRowIndex, k, eleArray, minRowIndex, maxRowIndex, minColIndex, maxColIndex);
                }
                if (this.isMergedCell(eleArray[maxRowIndex as number][k as number])) {
                    [minRowIndex, maxRowIndex, minColIndex, maxColIndex] =
                        this.adjustBoundary(maxRowIndex, k, eleArray, minRowIndex, maxRowIndex, minColIndex, maxColIndex);
                }
            }
        }

        // If the selection has expanded, recursively check for further expansions
        return (minRowIndex === minRow && maxRowIndex === maxRow && minColIndex === minCol && maxColIndex === maxCol)
            ? { startRow: minRow, endRow: maxRow, startColumn: minCol, endColumn: maxCol }
            : this.highlightCells(minRowIndex, maxRowIndex, minColIndex, maxColIndex, eleArray);
    }

    /*
     * Restores the selection range to a specific table cell
     */
    private restoreRange(target: HTMLElement): void {
        // Special handling for Safari browser
        if (this.parent.userAgentData.isSafari()) {
            this.parent.nodeSelection.Clear(this.tableModel.getDocument());
            return;
        }

        // Only set cursor in table cells and when a valid selection exists
        const isTableCell: boolean = target.nodeName === 'TD' || target.nodeName === 'TH';
        const hasValidSelection: boolean = this.tableModel.getDocument().getSelection().rangeCount > 0;

        if (hasValidSelection && isTableCell) {
            this.parent.nodeSelection.setCursorPoint(
                this.tableModel.getDocument(),
                target,
                0
            );
        }
    }

    /*
     * Applies table style and executes the associated callback
     */
    private tableStyle(e: IHtmlItem): void {
        this.executeCallback(e);
    }

    /*
     * Handles table cell selection and highlighting when moving across cells
     */
    private tableMove(e: IHtmlItem): void {
        this.activeCell = e.selectNode[0] as HTMLElement;
        if (!this.activeCell){
            return;
        }
        let target: HTMLElement = e.event.target as HTMLElement;
        if (!this.isValidCellTarget(target)) {
            let closestCell: Element = null;
            if (target.nodeType !== Node.ELEMENT_NODE) {
                closestCell = target.parentElement;
            } else {
                closestCell = target as Element;
            }
            if (closestCell && closestCell.tagName !== 'TD' && closestCell.tagName !== 'TH') {
                closestCell = closest(closestCell, 'TD') || closest(closestCell, 'TH');
            }
            if (closestCell) {
                target = closestCell as HTMLTableCellElement;
            } else {
                return;
            }
        }
        this.curTable = closest(target, 'table') as HTMLTableElement;
        const activeCellTable: HTMLTableElement = closest(this.activeCell, 'table') as HTMLTableElement;
        if (activeCellTable.contains(this.curTable)) {
            const targetCell: HTMLTableCellElement = this.findContainingCell(activeCellTable, this.curTable);
            if (targetCell) {
                this.curTable = activeCellTable;
                target = targetCell;
            }
        }
        if (!this.areCellsInSameTable(this.curTable, activeCellTable)) {
            return;
        }
        const correspondingCells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const activeIndexes: number[] = getCorrespondingIndex(this.activeCell, correspondingCells);
        const targetIndexes: number[] = getCorrespondingIndex(target as HTMLElement, correspondingCells);
        const activeCellList: NodeListOf<HTMLElement> = this.clearPreviousSelection();
        if (this.isSameCellSelected(activeIndexes, targetIndexes, activeCellList)) {
            return;
        }
        this.selectCellRange(activeIndexes, targetIndexes, correspondingCells);
        target.classList.add('e-cell-select-end');
        if (e.event.type) {
            e.event.preventDefault();
        }
        this.restoreRange(target);
    }

    /*
    * Finds the table cell that contains the specified target element.
    * Iterates through all rows and cells in the table to locate the containing cell.
    */
    private findContainingCell(table: HTMLTableElement, targetElement: HTMLElement): HTMLTableCellElement | null {
        const rows: HTMLCollectionOf<HTMLTableRowElement> = table.rows;
        for (let i: number = 0; i < rows.length; i++) {
            const cells: HTMLCollectionOf<HTMLTableCellElement> = rows[i as number].cells;
            for (let j: number = 0; j < cells.length; j++) {
                const cell: HTMLTableCellElement = cells[j as number];
                if (cell.contains(targetElement)) {
                    return cell;
                }
            }
        }
        return null;
    }

    /*
     * Checks if the target element is a valid table cell
     */
    private isValidCellTarget(target: HTMLElement): boolean {
        if (!this.activeCell || !target) {
            return false;
        }
        const activeCellTag: string = this.activeCell.tagName;
        const targetCellTag: string = target.tagName;
        const isTableCell: boolean = target.tagName === 'TD' || target.tagName === 'TH';
        return isTableCell || activeCellTag === targetCellTag;
    }

    /*
     * Checks if two cells are in the same table
     */
    private areCellsInSameTable(table1: HTMLTableElement, table2: HTMLTableElement): boolean {
        return !isNOU(table1) && !isNOU(table2) && table1 === table2;
    }

    /*
     * Clears all existing table cell selections
     */
    private clearPreviousSelection(): NodeListOf<HTMLElement> {
        const activeCellList: NodeListOf<HTMLElement> = this.curTable.querySelectorAll(
            '.e-cell-select, .e-multi-cells-select, .e-cell-select-end'
        );
        for (let i: number = activeCellList.length - 1; i >= 0; i--) {
            const index: number = i as number; // Fix for Generic Object Injection Sink
            if (this.activeCell !== activeCellList[index as number]) {
                removeClassWithAttr([activeCellList[index as number]], ['e-cell-select']);
            }
            removeClassWithAttr([activeCellList[index as number]], ['e-multi-cells-select']);
            removeClassWithAttr([activeCellList[index as number]], ['e-cell-select-end']);
        }
        return activeCellList;
    }

    /*
     * Checks if the same cell is being selected
     */
    private isSameCellSelected(activeIndexes: number[], targetIndexes: number[], activeCellList: NodeListOf<HTMLElement>): boolean {
        const isSameCell: boolean = activeIndexes[0] === targetIndexes[0] &&
            activeIndexes[1] === targetIndexes[1];
        if (isSameCell) {
            if (activeCellList.length > 1) {
                this.restoreRange(this.activeCell);
            }
            return true;
        }
        return false;
    }

    /*
     * Selects a range of cells between the active cell and target cell
     */
    private selectCellRange(
        activeIndexes: number[],
        targetIndexes: number[],
        correspondingCells: HTMLElement[][]
    ): void {
        // Calculate selection boundaries, accounting for merged cells
        const minMaxIndexes: MinMax = this.highlightCells(
            Math.min(activeIndexes[0], targetIndexes[0]),
            Math.max(activeIndexes[0], targetIndexes[0]),
            Math.min(activeIndexes[1], targetIndexes[1]),
            Math.max(activeIndexes[1], targetIndexes[1]),
            correspondingCells
        );
        for (let rowIndex: number = minMaxIndexes.startRow; rowIndex <= minMaxIndexes.endRow; rowIndex++) {
            const row: number = rowIndex as number;
            for (let colIndex: number = minMaxIndexes.startColumn; colIndex <= minMaxIndexes.endColumn; colIndex++) {
                const col: number = colIndex as number;
                correspondingCells[row as number][col as number].classList.add('e-cell-select');
                correspondingCells[row as number][col as number].classList.add('e-multi-cells-select');
            }
        }
    }

    /**
     * Cleans up resources by removing all event listeners
     *
     * @public
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.resizeIconPositionTime) {
            clearTimeout(this.resizeIconPositionTime);
            this.resizeIconPositionTime = null;
        }
    }

    /*
     * Filters out specific CSS style properties from a style string
     * This method is used to clean up cell styles when copying/cloning cells
     */
    private cellStyleCleanup(value: string): string {
        const styles: string[] = value.split(';');
        const newStyles: string[] = [];
        const deniedFormats: string[] = [
            'background-color',
            'vertical-align',
            'text-align'
        ];
        for (let i: number = 0; i < styles.length; i++) {
            const index: number = i as number;
            const style: string = styles[index as number];
            let isAllowed: boolean = true;
            for (let j: number = 0; j < deniedFormats.length; j++) {
                const formatIndex: number = j as number;
                const deniedStyle: string = deniedFormats[formatIndex as number];
                if (style.indexOf(deniedStyle) > -1) {
                    isAllowed = false;
                    break;
                }
            }
            if (isAllowed) {
                newStyles.push(style);
            }
        }
        return newStyles.join(';');
    }

    /**
     * Calculates the collection of the minimum width cells from each column in the table,
     * considering colSpan and rowSpan for proper cell indexing.
     *
     * @param {HTMLTableElement} curTable - The current table element to process.
     * @returns {HTMLTableDataCellElement[]} - Returns an array of HTMLTableDataCellElement representing each column's minimum width cell.
     * @public
     */
    public calMaxCol(curTable: HTMLTableElement): HTMLTableDataCellElement[] {
        if (!curTable || !curTable.rows || curTable.rows.length === 0 || !curTable.rows[0] || !curTable.rows[0].cells) {
            return [];
        }
        const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = curTable.rows[0].cells;
        let cellCount: number = 0;
        for (let cell: number = 0; cell < cellColl.length; cell++) {
            cellCount = cellCount + cellColl[cell as number].colSpan;
        }
        const cells: HTMLTableDataCellElement[] = new Array(cellCount);
        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
        for (let i: number = 0; i < curTable.rows.length; i++) {
            let currentColIndex: number = 0;
            for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                for (let l: number = 1; l < curTable.rows[i as number].cells[k as number].rowSpan; l++) {
                    const key: string = `${i + l}${currentColIndex}`;
                    rowSpanCells.set(key, curTable.rows[i as number].cells[k as number]);
                }
                const cellIndex: number = getCellIndex(rowSpanCells, i, k);
                if (cellIndex > currentColIndex) {
                    currentColIndex = cellIndex;
                }
                const width: number = curTable.rows[i as number].cells[k as number].offsetWidth;
                if (!cells[currentColIndex as number] || width < cells[currentColIndex as number].offsetWidth) {
                    cells[currentColIndex as number] = curTable.rows[i as number].cells[k as number];
                }
                currentColIndex += 1 + curTable.rows[i as number].cells[k as number].colSpan - 1;
            }
        }
        return cells;
    }

    /**
     * Initializes the resize button state for columns, rows, and table box.
     *
     * @returns {Object} - An object representing the resize button state.
     * @public
     */
    public resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    }

    /**
     * Calculates the offset position of the given element relative to its offset parent.
     *
     * @param {HTMLElement} elem - The element for which to calculate the position.
     * @returns {OffsetPosition} - The top and left offset position of the element.
     * @public
     */
    public calcPos(elem: HTMLElement): OffsetPosition {
        let parentOffset: OffsetPosition = { top: 0, left: 0 };
        if (!elem) {
            return parentOffset;
        }
        const offset: OffsetPosition = elem.getBoundingClientRect();
        const doc: Document = elem.ownerDocument;
        let offsetParent: Node = elem.offsetParent || doc.documentElement;
        let isNestedTable: boolean = false;
        // Traverse up to find non-static positioned parent
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        // Check for nested table inside TD
        if (offsetParent && offsetParent.nodeName === 'TD' && elem.nodeName === 'TABLE') {
            offsetParent = closest(offsetParent, '.e-rte-content');
            isNestedTable = true;
        }
        // Get parent offset if available
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        // Adjust position if it's a nested table
        if (isNestedTable) {
            isNestedTable = false;
            const scrollTop: number = (this.tableModel.getEditPanel()
                && this.tableModel.getEditPanel().scrollTop) || 0;
            const scrollLeft: number = (this.tableModel.getEditPanel()
                && this.tableModel.getEditPanel().scrollLeft) || 0;
            const topValue: number = (scrollTop > 0 ? (scrollTop + offset.top) - parentOffset.top : offset.top - parentOffset.top);
            const leftValue: number = (scrollLeft > 0 ? (scrollLeft + offset.left) - parentOffset.left : offset.left - parentOffset.left);
            return { top: topValue, left: leftValue };
        } else if (offsetParent !== this.tableModel.getEditPanel() && elem.nodeName === 'TABLE') {
            let tableParent: HTMLElement = elem;
            while (tableParent && tableParent.parentElement !== this.tableModel.getEditPanel()) {
                tableParent = tableParent.parentElement;
            }
            const tableParentOffset: OffsetPosition = tableParent.getBoundingClientRect();
            return {
                top: this.iframeSettings.enable ? offset.top : tableParent.offsetTop + offset.top - tableParentOffset.top,
                left: offset.left - tableParentOffset.left + 1
            };
        } else {
            return { top: this.iframeSettings.enable ? elem.offsetTop : offset.top - parentOffset.top,
                left: offset.left - parentOffset.left };
        }
    }

    /*
     * Gets the X coordinate from a PointerEvent or TouchEvent.
     */
    private getPointX(e: PointerEvent | TouchEvent): number {
        const touchEvent: TouchEvent = <TouchEvent>e;
        const pointerEvent: PointerEvent = <PointerEvent>e;
        if (touchEvent.touches && touchEvent.touches.length > 0) {
            return touchEvent.touches[0].pageX;
        } else {
            return pointerEvent.pageX;
        }
    }

    /*
     * Gets the Y coordinate from a PointerEvent or TouchEvent.
     */
    private getPointY(e: PointerEvent | TouchEvent): number {
        const touchEvent: TouchEvent = <TouchEvent>e;
        const pointerEvent: PointerEvent = <PointerEvent>e;
        if (touchEvent.touches && touchEvent.touches.length > 0) {
            return touchEvent.touches[0].pageY;
        } else {
            return pointerEvent.pageY;
        }
    }

    /*
     * Calculates the current column width as a percentage of the table width.
     */
    private getCurrentColWidth(col: HTMLTableColElement, tableWidth: number): number {
        let currentColWidth: number = 0;
        if (col && col.style && col.style.width !== '') {
            const widthValue: string = col.style.width;
            if (widthValue.indexOf('%') !== -1) {
                currentColWidth = parseFloat(widthValue.split('%')[0]);
            } else {
                currentColWidth = convertPixelToPercentage(col.offsetWidth, tableWidth);
            }
        } else {
            if (col && tableWidth > 0) {
                currentColWidth = convertPixelToPercentage(col.offsetWidth, tableWidth);
            }
        }
        return currentColWidth;
    }

    /*
     * Removes all resize helper elements and converts cell widths from pixels to percentages.
     */
    private resetResizeHelper(curTable: HTMLTableElement): void {
        const colHelper: NodeListOf<Element> = this.tableModel.rteElement.querySelectorAll('.e-table-rhelper.e-column-helper');
        Array.from(colHelper).forEach((element: Element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        const rowHelper: NodeListOf<Element> = this.tableModel.rteElement.querySelectorAll('.e-table-rhelper.e-row-helper');
        Array.from(rowHelper).forEach((element: Element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        if (parseInt(curTable.style.width, 10) === 0) {
            curTable.style.width = curTable.offsetWidth + 'px';
        }
    }

    /*
     * Handles the start of a table resize operation when user interacts with the resizer.
     */
    private resizeStart(e: PointerEvent | TouchEvent): void {
        if (!this.parent || !this.tableModel || this.tableModel.readonly) {
            return;
        }
        if (Browser.isDevice) {
            this.resizeHelper(e);
        }
        const target: HTMLElement = e.target as HTMLElement;
        if (!target || !(target.classList.contains(EVENTS.CLS_TB_COL_RES) ||
            target.classList.contains(EVENTS.CLS_TB_ROW_RES) ||
            target.classList.contains(EVENTS.CLS_TB_BOX_RES))) {
            return;
        }
        this.resetResizeHelper(this.curTable);
        e.preventDefault();
        this.tableModel.preventDefaultResize(e as PointerEvent);
        if (!target.classList.contains(EVENTS.CLS_TB_BOX_RES)) {
            const rzBox: Element = this.tableModel.getEditPanel().querySelector('.e-table-box');
            if (!isNOU(rzBox) &&
                parseInt(target.getAttribute('data-col'), 10) !== this.calMaxCol(this.curTable).length) {
                rzBox.classList.add('e-hide');
            }
        }
        removeClassWithAttr(this.curTable.querySelectorAll('td,th'), CLS_TABLE_SEL);
        this.removeTableSelection();
        this.pageX = this.getPointX(e);
        this.pageY = this.getPointY(e);
        this.resizeBtnStat = this.resizeBtnInit();
        this.tableModel.hideTableQuickToolbar();
        if (target.classList.contains(EVENTS.CLS_TB_COL_RES)) {
            this.handleColumnResize(target);
        } else if (target.classList.contains(EVENTS.CLS_TB_ROW_RES)) {
            this.handleRowResize(target);
        } else if (target.classList.contains(EVENTS.CLS_TB_BOX_RES)) {
            this.resizeBtnStat.tableBox = true;
        }
        if (Browser.isDevice && this.helper && !this.helper.classList.contains('e-reicon')) {
            this.helper.classList.add('e-reicon');
            EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
            EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
        } else {
            const args: ResizeArgs = { event: e, requestType: 'Table' };
            this.tableModel.resizeStart(args);
        }
        if (this.isResizeBind) {
            EventHandler.add(this.tableModel.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.tableModel.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
            this.isResizeBind = false;
        }
    }

    /*
     * Handles column resize setup.
     */
    private handleColumnResize(target: HTMLElement): void {
        this.resizeBtnStat.column = true;
        insertColGroupWithSizes(this.curTable);
        const dataColAttr: string = target.getAttribute('data-col') || '0';
        const dataCol: number = parseInt(dataColAttr, 10);
        if (dataCol === this.calMaxCol(this.curTable).length) {
            this.currentColumnResize = 'last';
            this.colIndex = dataCol - 1;
            this.columnEle = this.calMaxCol(this.curTable)[this.colIndex] as HTMLTableDataCellElement;
        } else {
            this.currentColumnResize = (dataCol === 0) ? 'first' : 'middle';
            this.colIndex = dataCol;
            this.columnEle = this.calMaxCol(this.curTable)[this.colIndex] as HTMLTableDataCellElement;
        }
        this.appendHelper();
    }

    /*
     * Appends a helper element to visualize the resize operation.
     */
    private appendHelper(): void {
        const cssClass: string = 'e-table-rhelper' + this.tableModel.getCssClass(true);
        this.helper = createElement('div', { className: cssClass });
        if (Browser.isDevice) {
            this.helper.classList.add('e-reicon');
        }
        this.tableModel.getEditPanel().appendChild(this.helper);
        this.setHelperHeight();
    }

    /*
     * Sets the position and size of the helper element based on the resize type (column or row).
     */
    private setHelperHeight(): void {
        const pos: OffsetPosition = this.calcPos(this.curTable);
        // Check if resize button state and helper are available
        if (this.resizeBtnStat && this.resizeBtnStat.column) {
            this.helper.classList.add('e-column-helper');
            const tableHeight: string = getComputedStyle(this.curTable).height;
            const columnLeft: number = pos.left + this.calcPos(this.columnEle).left;
            const offset: number = (this.currentColumnResize === 'last') ? this.columnEle.offsetWidth : 0;
            const leftPosition: number = columnLeft + offset - 1;
            (this.helper as HTMLElement).style.cssText =
                'height: ' + tableHeight + '; ' +
                'top: ' + pos.top + 'px; ' +
                'left: ' + leftPosition + 'px;';
        } else {
            this.helper.classList.add('e-row-helper');
            const tableWidth: string = getComputedStyle(this.curTable).width;
            const rowTop: number = this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight - 1;
            const rowLeft: number = this.calcPos(this.rowEle).left + pos.left;
            (this.helper as HTMLElement).style.cssText =
                'width: ' + tableWidth + '; ' +
                'top: ' + rowTop + 'px; ' +
                'left: ' + rowLeft + 'px;';
        }
    }

    /*
     * Updates the position of the helper element during the resize operation.
     */
    private updateHelper(): void {
        if (!this.helper) {
            return;
        }
        const pos: OffsetPosition = this.calcPos(this.curTable);
        // Check if the current operation is a column resize
        if (this.resizeBtnStat && this.resizeBtnStat.column) {
            const columnLeft: number = pos.left + this.calcPos(this.columnEle as HTMLElement).left;
            const offset: number = (this.currentColumnResize === 'last') ? this.columnEle.offsetWidth : 0;
            const left: number = columnLeft + offset - 1;
            this.helper.style.left = left + 'px';
            this.helper.style.height = this.curTable.offsetHeight + 'px';
        } else {
            // Handle row resize
            const rowTop: number = this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight - 1;
            this.helper.style.top = rowTop + 'px';
        }
    }

    /*
     * Handles row resize setup.
     */
    private handleRowResize(target: HTMLElement): void {
        const dataRowAttr: string = target.getAttribute('data-row') || '0';
        const dataRow: number = parseInt(dataRowAttr, 10);
        this.rowEle = this.curTable.rows[dataRow as number] as HTMLTableRowElement;
        this.resizeBtnStat.row = true;
        this.appendHelper();
    }

    /**
     * Adds resize-related event handlers to the editor panel.
     * Registers touch events for all devices and mouseover for non-mobile devices.
     *
     * @returns {void} - This method does not return a value
     * @private
     */
    public addResizeEventHandlers(): void {
        const editPanel: Element = this.iframeSettings.enable ? this.tableModel.getEditPanel() :
            this.tableModel.getEditPanel().parentElement;
        // Add touch event handlers for resizing on all devices
        EventHandler.add(editPanel, Browser.touchStartEvent, this.resizeStart, this);
        // Add mouseover handler for non-mobile devices only
        if (!Browser.isDevice) {
            EventHandler.add(editPanel, 'mouseover', this.resizeHelper, this);
        }
    }

    /*
     * Handles table resize helper logic when hovering or interacting with table elements.
     */
    private resizeHelper(e: PointerEvent | TouchEvent): void {
        if (!this.parent || !this.tableModel || this.tableModel.readonly) {
            return;
        }
        if (this.isTableMoveActive) {
            return;
        }
        if (e && (e as PointerEvent).buttons && (e as PointerEvent).buttons > 0) {
            return;
        }
        let target: HTMLElement = null;
        if (e && (e as TouchEvent).targetTouches && (e as TouchEvent).targetTouches.length > 0) {
            target = (e as TouchEvent).targetTouches[0].target as HTMLElement;
        } else if (e && (e as PointerEvent).target) {
            target = (e as PointerEvent).target as HTMLElement;
        }
        if (!target) {
            return;
        }
        const closestTable: Element = closest(target, 'table.e-rte-table, table.e-rte-paste-table, table.e-rte-custom-table');
        const editPanel: HTMLElement = this.tableModel.getEditPanel() as HTMLElement;
        const isResizing: boolean = editPanel.querySelectorAll(
            '.e-table-box.e-rbox-select, .e-table-rhelper.e-column-helper, .e-table-rhelper.e-row-helper'
        ).length > 0;
        if (!isResizing && !isNOU(this.curTable) && !isNOU(closestTable) &&
            closestTable !== this.curTable && editPanel.contains(closestTable)) {
            this.removeResizeElement();
            this.removeHelper(e as MouseEvent);
            this.cancelResizeAction();
        }
        if (!isResizing &&
            (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH')) {
            if (closestTable && editPanel.contains(closestTable) &&
                (target.nodeName === 'TD' || target.nodeName === 'TH')) {
                this.curTable = closestTable as HTMLTableElement;
            } else {
                this.curTable = target as HTMLTableElement;
            }
            this.removeResizeElement();
            this.tableResizeEleCreation(this.curTable, e as PointerEvent);
        }
    }

    /*
     * Finalizes the table resize operation, removes event handlers, and adjusts table row heights to percentages.
     */
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        if (!this.parent) {
            return;
        }
        this.resizeBtnInit();
        this.isResizeBind = true;
        EventHandler.remove(this.tableModel.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.tableModel.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        const editorPanel: Element = this.iframeSettings.enable ? this.tableModel.getEditPanel() :
            this.tableModel.getEditPanel().parentElement;
        if (editorPanel.querySelector('.e-table-box') &&
            editorPanel.contains(editorPanel.querySelector('.e-table-box'))) {
            const rzBox: Element = editorPanel.querySelector('.e-table-box');
            if (!isNOU(rzBox)) {
                rzBox.classList.remove('e-hide');
            }
            if (!Browser.isDevice) {
                EventHandler.add(editorPanel, 'mouseover', this.resizeHelper, this);
            }
            this.removeResizeElement();
        }
        if (this.helper && editorPanel.contains(this.helper)) {
            detach(this.helper);
            this.helper = null;
        }
        this.resetResizeHelper(this.curTable);
        this.pageX = null;
        this.pageY = null;
        const currentTableTrElement: NodeListOf<Element> = this.curTable.querySelectorAll('tr');
        const tableTrPercentage: number[] = [];
        for (let i: number = 0; i < currentTableTrElement.length; i++) {
            const percentage: number = (parseFloat(currentTableTrElement[i as number].clientHeight.toString())
                / parseFloat(this.curTable.clientHeight.toString())) * 100;
            tableTrPercentage[i as number] = percentage;
        }
        for (let i: number = 0; i < currentTableTrElement.length; i++) {
            if ((currentTableTrElement[i as number] as HTMLElement).style.height) {
                if ((currentTableTrElement[i as number] as HTMLElement).parentElement.nodeName === 'THEAD') {
                    (currentTableTrElement[i as number] as HTMLElement).parentElement.style.height = tableTrPercentage[i as number] + '%';
                    (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrPercentage[i as number] + '%';
                }
                else {
                    (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrPercentage[i as number] + '%';
                }
            }
        }
        const args: ResizeArgs = { event: e, requestType: 'table' };
        this.tableModel.resizeEnd(args);
        this.resizeEndTime = new Date().getTime();
    }

    /**
     * Cancels the current table resize operation and cleans up event handlers.
     *
     * @public
     * @returns {void} - This method does not return a value.
     */
    public cancelResizeAction(): void {
        this.isResizeBind = true;
        EventHandler.remove(this.tableModel.getEditPanel(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.tableModel.getEditPanel(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeElement();
    }

    /*
     * Removes all table resize elements from the editor panel.
     *
     * @returns {void} - Does not return anything.
     * @private
     */
    public removeResizeElement(): void {
        const selector: string = '.e-column-resize, .e-row-resize, .e-table-box, .e-table-rhelper';
        const editPanel: Element = this.iframeSettings.enable ? this.tableModel.getEditPanel() :
            this.tableModel.getEditPanel().parentElement;
        const items: NodeListOf<Element> = editPanel.querySelectorAll(selector);
        if (items && items.length > 0) {
            for (let i: number = 0; i < items.length; i++) {
                if (items[i as number]) {
                    detach(items[i as number] as Element);
                }
            }
        }
    }

    /*
     * Removes the resize helper element when the user ends interaction outside the resize icon.
     */
    private removeHelper(e: MouseEvent): void {
        const target: HTMLElement = e ? (e.target as HTMLElement) : null;
        const cls: DOMTokenList = target ? target.classList : null;
        if (cls && !cls.contains('e-reicon') && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            if (this.tableModel.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
            this.pageX = null;
            this.helper = null;
        }
    }

    /*
     * Creates and appends resize elements (column, row, and corner) to the given table for resizing.
     */
    private tableResizeEleCreation(table: HTMLTableElement, e: MouseEvent): void {
        if (!table || !e) {
            return;
        }
        this.tableModel.preventDefaultResize(e);
        const columns: HTMLTableDataCellElement[] = this.calMaxCol(this.curTable);
        const rows: HTMLElement[] = this.getTableRowsWithoutRowspan(table);
        const height: number = parseInt(getComputedStyle(table).height, 10) || 0;
        const width: number = parseInt(getComputedStyle(table).width, 10) || 0;
        const pos: OffsetPosition = this.calcPos(table);
        this.createColumnResizers(columns, height, pos);
        this.createRowResizers(rows, table, width, pos);
        this.createResizeBox(columns.length, pos, width, height);
    }

    /*
     * Handles the resizing logic when a pointer or touch event occurs on the table.
     */
    private resizing(e: PointerEvent | TouchEvent): void {
        if (!this.parent || !this.tableModel) {
            return;
        }
        const args: ResizeArgs = { event: e, requestType: 'table' };
        this.tableModel.resizing(args);
    }

    /**
     * Handles the resizing logic when a pointer or touch event occurs on the table.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer or touch event triggering the resize.
     * @returns {void} - This function does not return a value.
     * @public
     */
    public perfomResizing(e: PointerEvent | TouchEvent): void {
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        let mouseX: number = (this.tableModel.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.tableModel.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        let maxiumWidth: number;
        const currentTdElement: HTMLElement = this.curTable.closest('td');
        const editorPanel: Element = this.iframeSettings.enable ? this.tableModel.getEditPanel() :
            this.tableModel.getEditPanel().parentElement;
        const tableReBox: HTMLElement = editorPanel.querySelector('.e-table-box') as HTMLElement;
        const tableWidth: number = parseInt(getComputedStyle(this.curTable).width as string, 10);
        const tableHeight: number = !isNaN(parseInt(this.curTable.style.height, 10)) ?
            parseInt(this.curTable.style.height, 10) : parseInt(getComputedStyle(this.curTable).height, 10);
        const paddingSize: number = +getComputedStyle(this.tableModel.getEditPanel()).paddingRight.match(/\d/g).join('');
        const rteWidth: number = (this.tableModel.getEditPanel() as HTMLElement).offsetWidth -
            ((this.tableModel.getEditPanel() as HTMLElement).offsetWidth -
                (this.tableModel.getEditPanel() as HTMLElement).clientWidth) - paddingSize * 2;
        let widthCompare: number;
        const tableParentElement: HTMLElement = this.curTable && this.curTable.parentElement;
        if (!isNOU(this.curTable.parentElement.closest('table')) && !isNOU(this.curTable.closest('td')) &&
            (this.tableModel.getEditPanel() as HTMLElement).contains(this.curTable.closest('td'))) {
            const currentTd: HTMLElement = this.curTable.closest('td');
            const currentTDPad: number = +getComputedStyle(currentTd).paddingRight.match(/\d/g).join('');
            // Padding of the current table with the parent element multiply with 2.
            widthCompare = currentTd.offsetWidth - (currentTd.offsetWidth - currentTd.clientWidth) - currentTDPad * 2;
        } else if (tableParentElement && tableParentElement !== this.tableModel.getEditPanel() &&
            tableParentElement.clientWidth !== rteWidth) {
            widthCompare = tableParentElement.clientWidth - +getComputedStyle(tableParentElement).paddingRight.match(/\d/g).join('') * 2;
        } else {
            widthCompare = rteWidth;
        }
        if (this.resizeBtnStat.column) {
            if (this.curTable.closest('li')) {
                widthCompare = this.curTable.closest('li').offsetWidth;
            }
            const colGroup: NodeListOf<HTMLTableColElement> = this.curTable.querySelectorAll('colgroup > col');
            let currentTableWidth: number;
            if (this.curTable.style.width !== '' && this.curTable.style.width.includes('%')) {
                currentTableWidth = parseFloat(this.curTable.style.width.split('%')[0]);
            }
            else {
                currentTableWidth = this.getCurrentTableWidth(this.curTable.offsetWidth,
                                                              (this.tableModel.getEditPanel() as HTMLElement).offsetWidth);
            }
            const currentCol: HTMLTableColElement = colGroup[this.colIndex];
            const currentColResizableWidth: number = this.getCurrentColWidth(currentCol, tableWidth);
            if (this.currentColumnResize === 'first') {
                mouseX = mouseX - 0.75; //This was done for to make the gripper and the table first/last column will be close.
                this.removeResizeElement();
                if (currentTdElement) {
                    maxiumWidth = this.curTable.getBoundingClientRect().right - this.calcPos(currentTdElement).left;
                    this.curTable.style.maxWidth = maxiumWidth + 'px';
                }
                // Below the value '100' is the 100% width of the parent element.
                if (((mouseX !== 0 && 5 < currentColResizableWidth) || mouseX < 0) && currentTableWidth <= 100 &&
                    convertPixelToPercentage(tableWidth - mouseX, widthCompare) <= 100) {
                    const firstColumnsCell: HTMLTableColElement = colGroup[this.colIndex];
                    this.curTable.style.width = convertPixelToPercentage(tableWidth - mouseX, widthCompare) > 100 ? (100 + '%') :
                        (convertPixelToPercentage(tableWidth - mouseX, widthCompare) + '%');
                    const differenceWidth: number = currentTableWidth - convertPixelToPercentage(
                        tableWidth - mouseX, widthCompare);
                    let preMarginLeft: number = 0;
                    const widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
                    if (!widthType && this.curTable.offsetWidth >
                        (this.tableModel.getEditPanel() as HTMLElement).offsetWidth) {
                        this.curTable.style.width = rteWidth + 'px';
                        return;
                    }
                    if (widthType && parseFloat(this.curTable.style.width.split('%')[0]) > 100) {
                        this.curTable.style.width = '100%';
                        return;
                    }
                    if (!isNOU(this.curTable.style.marginLeft) && this.curTable.style.marginLeft !== '') {
                        const regex: RegExp = /[-+]?\d*\.\d+|\d+/;
                        const value: RegExpMatchArray | null = this.curTable.style.marginLeft.match(regex);
                        if (!isNOU(value)) {
                            preMarginLeft = parseFloat(value[0]);
                        }
                    }
                    let currentMarginLeft: number = preMarginLeft + differenceWidth;
                    if (currentMarginLeft && currentMarginLeft > 100) {
                        const width: number = parseFloat(this.curTable.style.width);
                        currentMarginLeft = 100 - width;
                    }
                    // For table pasted from word, Margin left can be anything so we are avoiding the below process.
                    if (!this.curTable.classList.contains('e-rte-paste-table') && currentMarginLeft && currentMarginLeft < 1) {
                        this.curTable.style.marginLeft = null;
                        this.curTable.style.width = '100%';
                        return;
                    }
                    this.curTable.style.marginLeft = 'calc(' + (this.curTable.style.width === '100%' ? 0 : currentMarginLeft) + '%)';
                    const currentColumnCellWidth: number = this.getCurrentColWidth(firstColumnsCell, tableWidth);
                    firstColumnsCell.style.width = (currentColumnCellWidth - differenceWidth) + '%';
                }
            } else if (this.currentColumnResize === 'last') {
                mouseX = mouseX + 0.75; //This was done for to make the gripper and the table first/last column will be close.
                this.removeResizeElement();
                if (currentTdElement) {
                    maxiumWidth = currentTdElement.getBoundingClientRect().right - this.curTable.getBoundingClientRect().left;
                    this.curTable.style.maxWidth = maxiumWidth + 'px';
                }
                // Below the value '100' is the 100% width of the parent element.
                if (((mouseX !== 0 && 5 < currentColResizableWidth) || mouseX > 0) &&
                    currentTableWidth <= 100 && convertPixelToPercentage(tableWidth + mouseX, widthCompare) <= 100) {
                    const lastColumnsCell: HTMLTableColElement = colGroup[this.colIndex];
                    this.curTable.style.width = convertPixelToPercentage(tableWidth + mouseX, widthCompare) > 100 ? (100 + '%') : (convertPixelToPercentage(tableWidth + mouseX, widthCompare) + '%');
                    const differenceWidth: number = currentTableWidth - convertPixelToPercentage(
                        tableWidth + mouseX, widthCompare);
                    const currentColumnCellWidth: number = this.getCurrentColWidth(lastColumnsCell, tableWidth);
                    lastColumnsCell.style.width = (currentColumnCellWidth - differenceWidth) + '%';
                }
            } else {
                const actualwid: number = colGroup[this.colIndex].offsetWidth - mouseX;
                // eslint-disable-next-line
                const totalwid: number = (colGroup[this.colIndex] as HTMLTableColElement).offsetWidth + colGroup[this.colIndex - 1].offsetWidth;
                if ((totalwid - actualwid) > 20 && actualwid > 20) {
                    const leftColumnWidth: number = totalwid - actualwid;
                    const rightColWidth: number = actualwid;
                    colGroup[this.colIndex - 1].style.width = convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                    colGroup[this.colIndex].style.width = convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                }
            }
            this.updateHelper();
        } else if (this.resizeBtnStat.row) {
            this.tableModel.preventDefaultResize(e as PointerEvent);
            const tableTrElementPixel: number[] = [];
            const currentTableTrElement: NodeListOf<Element> = this.curTable.querySelectorAll('tr');
            for (let i: number = 0; i < currentTableTrElement.length; i++) {
                if (this.rowEle !== currentTableTrElement[i as number]) {
                    tableTrElementPixel[i as number] = (parseFloat(currentTableTrElement[i as number].clientHeight.toString()));
                }
            }
            this.curTable.style.height = (parseFloat(this.curTable.clientHeight.toString()) + ((mouseY > 0) ? 0 : mouseY)) + 'px';
            for (let i: number = 0; i < currentTableTrElement.length; i++) {
                if (this.rowEle === currentTableTrElement[i as number]) {
                    (currentTableTrElement[i as number] as HTMLElement).style.height = (parseFloat(currentTableTrElement[i as number].clientHeight.toString()) + mouseY) + 'px';
                }
                else {
                    (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrElementPixel[i as number] + 'px';
                }
            }
            if (!isNOU(tableReBox)) {
                tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                    'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
            }
            this.updateHelper();
        } else if (this.resizeBtnStat.tableBox) {
            if (currentTdElement) {
                const tableBoxPosition: number = this.curTable.getBoundingClientRect().left
                    - currentTdElement.getBoundingClientRect().left;
                maxiumWidth = Math.abs(tableBoxPosition - currentTdElement.getBoundingClientRect().width) - 5;
                this.curTable.style.maxWidth = maxiumWidth + 'px';
            }
            this.curTable.style.height = tableHeight + mouseY + 'px';
            if (!isNOU(tableReBox)) {
                tableReBox.classList.add('e-rbox-select');
                tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + parseInt(getComputedStyle(this.curTable).height, 10) - 4) +
                    'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
            }
            if (this.curTable.closest('li')) {
                widthCompare = this.curTable.closest('li').offsetWidth;
            }
            const widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
            if (widthType && parseFloat(this.curTable.style.width.split('%')[0]) > 100) {
                this.curTable.style.width = '100%';
                return;
            }
            if (!widthType && this.curTable.offsetWidth > (this.tableModel.getEditPanel() as HTMLElement).offsetWidth) {
                this.curTable.style.width = rteWidth + 'px';
                return;
            }
            this.curTable.style.width = widthType ? convertPixelToPercentage(tableWidth + mouseX, widthCompare) + '%'
                : tableWidth + mouseX + 'px';
        }
    }

    /*
     * Calculates the current table width as a percentage of the parent width.
     */
    private getCurrentTableWidth(tableWidth: number, parentWidth: number): number {
        // Avoid division by zero
        if (parentWidth === 0) {
            return 0;
        }
        const currentTableWidth: number = (tableWidth / parentWidth) * 100;
        return currentTableWidth;
    }

    /*
     * Extracts the first cell from each row that doesn't have rowspan.
     */
    private getTableRowsWithoutRowspan(table: HTMLTableElement): HTMLElement[] {
        const rows: HTMLElement[] = [];
        for (let i: number = 0; i < table.rows.length; i++) {
            for (let j: number = 0; j < table.rows[i as number].cells.length; j++) {
                if (!table.rows[i as number].cells[j as number].hasAttribute('rowspan')) {
                    rows.push(table.rows[i as number].cells[j as number] as HTMLElement);
                    break;
                }
            }
        }
        return rows;
    }

    /*
     * Creates column resizer handles.
     */
    private createColumnResizers(columns: HTMLTableDataCellElement[], height: number, pos: OffsetPosition): void {
        for (let i: number = 0; i <= columns.length; i++) {
            const colReEle: HTMLElement = createElement('span', {
                attrs: { 'data-col': i.toString(), 'unselectable': 'on', 'contenteditable': 'false' }
            });
            colReEle.classList.add(EVENTS.CLS_RTE_TABLE_RESIZE, EVENTS.CLS_TB_COL_RES);
            let colPos: number = 0;
            if (i === columns.length) {
                const prevCol: HTMLTableDataCellElement = columns[i - 1] as HTMLTableDataCellElement;
                const isMultiCell: boolean = (prevCol && prevCol.classList && prevCol.classList.contains('e-multi-cells-select')) ? true : false;
                const leftOffset: number = isMultiCell ? 0 : pos.left;
                colPos = leftOffset + this.calcPos(prevCol).left + prevCol.offsetWidth - 2;
            } else {
                const curCol: HTMLTableDataCellElement = columns[i as number] as HTMLTableDataCellElement;
                const isMultiCell: boolean = (curCol && curCol.classList && curCol.classList.contains('e-multi-cells-select')) ? true : false;
                const leftOffset: number = isMultiCell ? 0 : pos.left;
                colPos = leftOffset + this.calcPos(curCol).left - 2;
            }
            colReEle.style.cssText = 'height:' + height + 'px;width:4px;top:' + pos.top + 'px;left:' + colPos + 'px; z-index: 2';
            if (this.iframeSettings.enable) {
                this.tableModel.getEditPanel().appendChild(colReEle);
            }
            else {
                this.tableModel.getEditPanel().parentElement.appendChild(colReEle);
            }
        }
    }

    /*
     * Creates row resizer handles.
     */
    private createRowResizers(rows: Element[], table: HTMLTableElement, width: number, pos: OffsetPosition): void {
        for (let i: number = 0; i < rows.length; i++) {
            const row: Element = rows[i as number] as HTMLElement;
            const rowReEle: HTMLElement = createElement('span', {
                attrs: { 'data-row': i.toString(), 'unselectable': 'on', 'contenteditable': 'false' }
            });
            rowReEle.classList.add(EVENTS.CLS_RTE_TABLE_RESIZE, EVENTS.CLS_TB_ROW_RES);
            const hasCellSpacing: boolean = table.getAttribute('cellspacing') !== null && table.getAttribute('cellspacing') !== '';
            const rowPosLeft: number = hasCellSpacing ? 0 : this.calcPos(row as HTMLElement).left;
            const isMultiCell: boolean = (row.classList && row.classList.contains('e-multi-cells-select')) ? true : false;
            const topPos: number = this.calcPos(row as HTMLElement).top + (isMultiCell ? 0 :
                pos.top) + (row as HTMLElement).offsetHeight - 2;
            rowReEle.style.cssText = 'width:' + width + 'px;height:4px;top:' + topPos + 'px;left:' + (rowPosLeft + pos.left) + 'px; z-index: 2';
            if (this.iframeSettings.enable) {
                this.tableModel.getEditPanel().appendChild(rowReEle);
            }
            else {
                this.tableModel.getEditPanel().parentElement.appendChild(rowReEle);
            }
        }
    }

    /*
     * Creates the table resize corner box.
     */
    private createResizeBox(colCount: number, pos: OffsetPosition, width: number, height: number): void {
        const tableReBox: HTMLElement = createElement('span', {
            className: EVENTS.CLS_TB_BOX_RES + this.tableModel.getCssClass(true),
            attrs: { 'data-col': colCount.toString(), 'unselectable': 'on', 'contenteditable': 'false' }
        });
        tableReBox.style.cssText = 'top:' + (pos.top + height - 4) + 'px;left:' + (pos.left + width - 4) + 'px;z-index: 2';
        if (Browser.isDevice) {
            tableReBox.classList.add('e-rmob');
        }
        if (this.iframeSettings.enable) {
            this.tableModel.getEditPanel().appendChild(tableReBox);
        }
        else {
            this.tableModel.getEditPanel().parentElement.appendChild(tableReBox);
        }
    }

    /**
     * Removes table selection styling and fake selection elements.
     * This cleanup method removes the selection class from tables and
     * cleans up any fake selection elements that may have been created
     * during the table selection process.
     *
     * @returns {void}
     * @public
     */
    public removeTableSelection(): void {
        const table: HTMLElement = this.tableModel.getEditPanel().querySelector('table.e-cell-select');
        if (table) {
            removeClassWithAttr([table], CLS_TABLE_SEL);
        }
        // Remove all fake selection elements used for deletion operations
        this.removeAllFakeSelectionEles();
    }

    /*
     * Removes all fake selection elements from the editor.
     * This cleanup method ensures that all temporary selection elements
     * are removed from the DOM after they are no longer needed.
     */
    private removeAllFakeSelectionEles(): void {
        const fakeSelectionEles: NodeListOf<HTMLElement> = this.tableModel.getEditPanel().querySelectorAll('.e-table-fake-selection');
        if (fakeSelectionEles && fakeSelectionEles.length > 0) {
            fakeSelectionEles.forEach((element: HTMLElement) => {
                detach(element);
            });
        }
    }

    /**
     * Handles arrow key navigation between table cells
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @param {NodeSelection} selection - The current selection
     * @param {HTMLElement} ele - The current table cell element
     * @returns {void}
     * @public
     */
    public tableArrowNavigation(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        this.previousTableElement = ele;
        if (this.shouldSkipArrowNavigation(event, selection)) {
            return;
        }
        event.preventDefault();
        this.clearSelectionState(ele);
        const targetElement: HTMLElement | null = this.getTargetCellForArrowNavigation(event, ele);
        if (targetElement) {
            selection.setSelectionText(this.tableModel.getDocument(), targetElement, targetElement, 0, 0);
        }
    }

    /*
     * Determines if arrow key navigation should be skipped
     */
    private shouldSkipArrowNavigation(event: KeyboardEvent, selection: NodeSelection): boolean {
        const selText: Node = selection.range.startContainer;
        // Skip for down arrow with text node that has BR sibling or non-TD parent
        if (event.keyCode === 40 && selText.nodeType === 3 &&
            ((selText.nextSibling && selText.nextSibling.nodeName === 'BR') ||
                (selText.parentNode && !(selText.parentNode as HTMLElement).closest('td')))) {
            return true;
        }
        // Skip for up arrow with text node that has BR sibling or non-TD parent
        if (event.keyCode === 38 && selText.nodeType === 3 &&
            ((selText.previousSibling && selText.previousSibling.nodeName === 'BR') ||
                (selText.parentNode && !(selText.parentNode as HTMLElement).closest('td')))) {
            return true;
        }
        return false;
    }

    /*
     * Clears selection state before navigation
     */
    private clearSelectionState(element: HTMLElement): void {
        removeClassWithAttr([element], CLS_TABLE_SEL);
        this.removeTableSelection();
    }

    /*
     * Gets the target cell for arrow key navigation
     */
    private getTargetCellForArrowNavigation(event: KeyboardEvent, element: HTMLElement): HTMLElement | null {
        // Handle down arrow navigation
        if (event.keyCode === 40) {
            return this.getNextRowCell(element);
        }
        // Handle up arrow navigation
        else {
            return this.getPreviousRowCell(element);
        }
    }

    /*
     * Gets the cell below the current cell (next row)
     */
    private getNextRowCell(element: HTMLElement): HTMLElement {
        const parentRow: Element = closest(element, 'tr');
        const parentTable: HTMLTableElement = closest(element, 'table') as HTMLTableElement;
        // Check if we have a next row within the same table
        if (parentRow && parentRow.nextElementSibling) {
            const cellIndex: number = (element as HTMLTableDataCellElement).cellIndex;
            return (parentRow.nextElementSibling as Element).children[cellIndex as number] as HTMLElement;
        }
        // If we're in a header row, move to the first body row
        if (parentTable.tHead && element.nodeName === 'TH') {
            if (parentTable.rows.length > 1) {
                return parentTable.rows[1].cells[(element as HTMLTableDataCellElement).cellIndex] as HTMLElement;
            }
        }
        if (parentTable.nextSibling) {
            return parentTable.nextSibling as HTMLElement;
        }
        return element;
    }

    /*
     * Gets the cell above the current cell (previous row)
     */
    private getPreviousRowCell(element: HTMLElement): HTMLElement {
        const parentRow: Element = closest(element, 'tr');
        const parentTable: HTMLTableElement = closest(element, 'table') as HTMLTableElement;
        if (parentRow && parentRow.previousElementSibling) {
            const cellIndex: number = (element as HTMLTableDataCellElement).cellIndex;
            return (parentRow.previousElementSibling as Element).children[cellIndex as number] as HTMLElement;
        }
        if (parentTable.tHead && element.nodeName !== 'TH') {
            return parentTable.tHead.rows[0].cells[(element as HTMLTableDataCellElement).cellIndex] as HTMLElement;
        }
        if (parentTable.previousSibling) {
            return parentTable.previousSibling as HTMLElement;
        }
        return element;
    }

    /**
     * Handles tab key navigation within table cells
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @param {NodeSelection} selection - The current selection
     * @param {HTMLElement} ele - The current table cell element
     * @returns {void}
     * @public
     */
    public tabSelection(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        this.cleanTableRows(ele);
        this.previousTableElement = ele;
        if (this.shouldSkipTabNavigation(event, selection)) {
            return;
        }
        event.preventDefault();
        this.clearSelectionState(ele);
        // Forward navigation (Tab)
        if (!event.shiftKey && event.keyCode !== 37) {
            this.handleForwardTabNavigation(ele, selection, event);
        }
        // Backward navigation (Shift+Tab)
        else {
            this.handleBackwardTabNavigation(ele, selection, event);
        }
    }

    /*
     * Removes empty text nodes from table rows for cleaner structure
     */
    private cleanTableRows(element: HTMLElement): void {
        const table: HTMLTableElement = element.closest('table');
        if (!table) {
            return;
        }
        const allHeadBodyTRElements: NodeListOf<HTMLTableRowElement> = table.querySelectorAll('thead, tbody, tr');
        for (let i: number = 0; i < allHeadBodyTRElements.length; i++) {
            this.removeEmptyTextNodes(allHeadBodyTRElements[i as number]);
        }
    }

    /*
     * Removes empty text nodes from a table row element
     */
    private removeEmptyTextNodes(element: HTMLTableRowElement): void {
        const children: NodeListOf<ChildNode> = element.childNodes;
        for (let i: number = children.length - 1; i >= 0; i--) {
            const node: ChildNode = children[i as number];
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === '') {
                element.removeChild(node);
            }
        }
    }

    /*
     * Determines if tab navigation should be skipped
     */
    private shouldSkipTabNavigation(event: KeyboardEvent, selection: NodeSelection): boolean {
        return (event.keyCode === 37 || event.keyCode === 39) || this.insideList(selection.range);
    }

    /*
     * Checks if the current selection is inside a list element
     */
    private insideList(range: Range): boolean {
        const blockNodes: Element[] = this.getBlockNodesInSelection(range);
        const listNodes: Element[] = this.getListNodesFromBlocks(blockNodes);
        if (listNodes.length > 1 || (listNodes.length && (range.startOffset === 0 && range.endOffset === 0))) {
            this.ensureInsideTableList = true;
            return true;
        } else {
            this.ensureInsideTableList = false;
            return false;
        }
    }

    /*
     * Filters list-related nodes from block elements
     */
    private getListNodesFromBlocks(blockNodes: Element[]): Element[] {
        const nodes: Element[] = [];
        for (let i: number = 0; i < blockNodes.length; i++) {
            const currentNode: Element = blockNodes[i as number];
            const parentNode: Element = currentNode.parentNode as Element;
            if (parentNode.tagName === 'LI') {
                nodes.push(parentNode);
            } else if (currentNode.tagName === 'LI' &&
                this.isSimpleListItem(currentNode)) {
                nodes.push(currentNode);
            }
        }
        return nodes;
    }

    /*
     * Checks if a list item is a simple list item (not containing nested lists)
     */
    private isSimpleListItem(listItem: Element): boolean {
        if (!listItem.childNodes.length) {
            return false;
        }
        const firstChild: Element = listItem.childNodes[0] as Element;
        return firstChild.tagName !== 'P' &&
            firstChild.tagName !== 'OL' &&
            firstChild.tagName !== 'UL';
    }

    /*
     * Gets all block-level elements within the current selection range
     */
    private getBlockNodesInSelection(range: Range): Element[] {
        const blockTags: string[] = [
            'DIV', 'SECTION', 'HEADER', 'FOOTER', 'ARTICLE', 'NAV',
            'P', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI', 'PRE',
            'TD', 'TH', 'FORM', 'FIELDSET', 'LEGEND', 'LABEL', 'TEXTAREA'
        ];
        const blockNodes: Set<Element> = new Set();
        if (range.collapsed) {
            this.handleCollapsedRangeBlockNodes(range, blockTags, blockNodes);
        } else {
            this.handleExpandedRangeBlockNodes(range, blockTags, blockNodes);
        }
        return Array.from(blockNodes);
    }

    /*
     * Handles finding block nodes when the selection range is collapsed
     */
    private handleCollapsedRangeBlockNodes(range: Range, blockTags: string[], blockNodes: Set<Element>): void {
        const blockNode: Element = this.getImmediateBlockNode(range.startContainer, blockTags);
        if (blockNode) {
            blockNodes.add(blockNode);
        }
    }

    /*
     * Handles finding block nodes when the selection range is expanded
     */
    private handleExpandedRangeBlockNodes(range: Range, blockTags: string[], blockNodes: Set<Element>): void {
        const treeWalker: TreeWalker = this.tableModel.getDocument().createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT, {
                acceptNode: (node: Node) => (range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
            }
        );
        while (treeWalker.nextNode()) {
            const blockNode: Element = this.getImmediateBlockNode(treeWalker.currentNode, blockTags);
            if (blockNode) {
                blockNodes.add(blockNode);
            }
        }
    }

    /*
     * Finds the closest block-level parent element of a node
     */
    private getImmediateBlockNode(node: Node, blockTags: string[]): Element | null {
        let parentNode: Node = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
        while (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
            const element: Element = parentNode as Element;
            if (blockTags.indexOf(element.tagName) > -1) {
                return element;
            }
            parentNode = parentNode.parentNode;
        }
        return null;
    }

    /*
     * Handles forward tab navigation (Tab key)
     */
    private handleForwardTabNavigation(element: HTMLElement, selection: NodeSelection, event: KeyboardEvent): void {
        let nextElement: HTMLElement | Element | Node = this.findNextElementForward(element);
        if (element === nextElement && element.nodeName === 'TH') {
            nextElement = (closest(element, 'table') as HTMLTableElement).rows[1].cells[0];
        }
        if (event.keyCode === 39 && element === nextElement) {
            nextElement = closest(element, 'table').nextSibling;
        }
        if (nextElement) {
            this.setSelectionForElement(nextElement, selection);
        }
        if (element === nextElement && event.keyCode !== 39 && nextElement) {
            this.addNewRowAndNavigate(element, nextElement, selection, event);
        }
    }

    /*
     * Finds the next element when navigating forward with Tab
     */
    private findNextElementForward(element: HTMLElement): HTMLElement | Element | Node {
        if (!isNOU(element.nextSibling)) {
            return element.nextSibling;
        }
        const nextRow: Node = closest(element, 'tr').nextSibling;
        if (!isNOU(nextRow)) {
            return nextRow.childNodes[0];
        }
        const nextSibling: Node = closest(element, 'table').nextSibling;
        if (!isNOU(nextSibling)) {
            return (nextSibling.nodeName.toLowerCase() === 'td') ? nextSibling : element;
        }
        return element;
    }

    /*
     * Adds a new row when tabbing from the last cell and navigates to it
     */
    private addNewRowAndNavigate(element: HTMLElement, nextElement: HTMLElement | Element | Node, selection: NodeSelection,
                                 event: KeyboardEvent): void {
        element.classList.add(CLS_TABLE_SEL);
        this.tableModel.addRow(selection, event, true);
        this.clearSelectionState(element);
        const parentElement: HTMLElement = nextElement.parentElement;
        nextElement = parentElement.nextSibling ?
            parentElement.nextSibling.firstChild as HTMLElement :
            parentElement.firstChild;
        this.setSelectionForElement(nextElement, selection);
    }

    /**
     * Removes all cell selection-related CSS classes from table cells.
     *
     * @returns {void} - Does not return a value.
     * @public
     */
    public removeCellSelectClasses(): void {
        removeClassWithAttr(this.tableModel.getEditPanel().querySelectorAll('table td, table th'), CLS_TABLE_SEL_END);
        removeClassWithAttr(this.tableModel.getEditPanel().querySelectorAll('table td, table th'), CLS_TABLE_MULTI_CELL);
        removeClassWithAttr(this.tableModel.getEditPanel().querySelectorAll('table td, table th'), CLS_TABLE_SEL);
    }

    /*
     * Handles backward tab navigation (Shift+Tab)
     */
    private handleBackwardTabNavigation(element: HTMLElement, selection: NodeSelection, event: KeyboardEvent): void {
        let prevElement: HTMLElement | Node = this.findPreviousElementBackward(element);
        if (this.shouldNavigateToTableHeader(element, prevElement)) {
            const clsTable: HTMLTableElement = closest(element, 'table') as HTMLTableElement;
            prevElement = clsTable.rows[0].cells[clsTable.rows[0].cells.length - 1];
        }
        if (element === prevElement && event.keyCode === 37) {
            prevElement = closest(element, 'table').previousSibling;
        }
        prevElement = this.handleNestedTableNavigation(prevElement);
        if (prevElement) {
            this.setSelectionForElement(prevElement, selection);
        }
    }

    /*
     * Finds the previous element when navigating backward with Shift+Tab
     */
    private findPreviousElementBackward(element: HTMLElement): HTMLElement | Node {
        if (!isNOU(element.previousSibling)) {
            return element.previousSibling;
        }
        const prevRow: Node = closest(element, 'tr').previousSibling;
        if (!isNOU(prevRow)) {
            return prevRow.childNodes[prevRow.childNodes.length - 1];
        }
        const prevSibling: Node = closest(element, 'table').previousSibling;
        if (!isNOU(prevSibling)) {
            return (prevSibling.nodeName.toLowerCase() === 'td') ? prevSibling : element;
        }
        return element;
    }

    /*
     * Checks if navigation should move from first body cell to last header cell
     */
    private shouldNavigateToTableHeader(element: HTMLElement, prevElement: HTMLElement | Node): boolean {
        return element === prevElement &&
            (element as HTMLTableDataCellElement).cellIndex === 0 &&
            (closest(element, 'table') as HTMLTableElement).tHead &&
            element.nodeName !== 'TH';
    }

    /*
     * Finds the innermost cell when navigating through nested tables
     */
    private handleNestedTableNavigation(element: HTMLElement | Node): HTMLElement | Node {
        if (!isNOU(element) && (element as HTMLElement).firstChild &&
            (element as HTMLElement).firstChild.nodeName === 'TABLE') {
            let tableChild: Node = element;
            while (!isNOU(tableChild.firstChild) &&
                tableChild.firstChild.nodeName === 'TABLE' &&
                (tableChild.firstChild as HTMLTableElement).rows.length > 0 &&
                (tableChild.firstChild as HTMLTableElement).rows[0].cells.length > 0) {
                tableChild = (tableChild.firstChild as HTMLTableElement).rows[0].cells[0];
            }
            return tableChild;
        }
        return element;
    }

    /*
     * Sets selection to the target element during navigation
     */
    private setSelectionForElement(element: HTMLElement | Element | Node, selection: NodeSelection): void {
        if ((element.textContent.trim() !== '' && closest(element, 'td'))) {
            selection.setSelectionNode(this.tableModel.getDocument(), element);
        } else {
            selection.setSelectionText(
                this.tableModel.getDocument(),
                element,
                element,
                0,
                0
            );
        }
    }

    /**
     * Resets all table selection states and visual indicators
     *
     * This method clears all selection-related CSS classes from table cells,
     * resets the active cell reference, and ensures proper selection is applied
     * to the current table when needed.
     *
     * @public
     * @returns {void}
     */
    public resetTableSelection(): void {
        const selectedEndCell: NodeListOf<HTMLElement> = this.tableModel.getEditPanel()
            .querySelectorAll('.e-cell-select-end');
        if (!isNOU(selectedEndCell) && selectedEndCell.length > 0) {
            this.parent.nodeSelection.setSelectionNode(
                this.tableModel.getDocument(),
                this.curTable
            );
        }
        this.removeCellSelectClasses();
        this.removeTableSelection();
    }

    /**
     * Sets up event handler for shift key table selection
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {void}
     * @public
     */
    public handleShiftKeyTableSelection(event: KeyboardEventArgs): void {
        const isArrowKey: boolean = event.keyCode === 39 || event.keyCode === 37 ||
            event.keyCode === 38 || event.keyCode === 40;
        if (event.shiftKey && isArrowKey) {
            this.keyDownEventInstance = event;
            EventHandler.add(
                this.tableModel.getDocument(),
                'selectionchange',
                this.tableCellsKeyboardSelection,
                this
            );
        }
    }

    /**
     * Handles keyboard-based selection of table cells
     *
     * This method processes the selection changes when using arrow keys with shift key
     * for selecting multiple cells in a table.
     *
     * @param {Event} e - The selection change event
     * @returns {void}
     * @public
     */
    public tableCellsKeyboardSelection(e: Event): void {
        EventHandler.remove(this.tableModel.getDocument(), 'selectionchange', this.tableCellsKeyboardSelection);
        this.setupSelectionState();
        const selectedEndCell: NodeListOf<HTMLElement> = this.tableModel.getEditPanel().querySelectorAll('.e-cell-select-end');
        const isMultiSelect: boolean = this.isTableMultiSelectActive();
        if (isMultiSelect || (!isNOU(selectedEndCell) && selectedEndCell.length > 0)) {
            this.handleTableCellArrowNavigation(selectedEndCell);
        } else {
            if (!this.curTable || !this.parent || !this.tableModel) {
                return;
            }
            const selectedCells: NodeListOf<HTMLTableCellElement> = this.curTable.querySelectorAll('.e-cell-select');
            if (!selectedCells || selectedCells.length < 1) {
                const range: Range = this.parent.nodeSelection.getRange(this.tableModel.getDocument());
                if (!range) {
                    return;
                }
                let elem: HTMLElement | null = null;
                if (range.endContainer.nodeType === Node.ELEMENT_NODE) {
                    elem = range.endContainer as HTMLElement;
                } else {
                    elem = (range.endContainer.parentElement as HTMLElement) || null;
                }
                if (elem && elem.tagName !== 'TD' && elem.tagName !== 'TH') {
                    elem = (closest(elem, 'TD') as HTMLElement) || (closest(elem, 'TH') as HTMLElement) || null;
                }
                if (elem && this.curTable.contains(elem)) {
                    this.moveToTargetCell(elem);
                }
            }
        }
        if (selectedEndCell.length > 0) {
            this.keyDownEventInstance.preventDefault();
            e.preventDefault();
        }
    }

    /*
     * Handles arrow key navigation between table cells during selection
     */
    private handleTableCellArrowNavigation(selectedEndCell: NodeListOf<HTMLElement>): void {
        const cells: HTMLElement[][] = getCorrespondingColumns(this.curTable);
        const cell: HTMLElement = !isNOU(selectedEndCell) &&
            selectedEndCell.length > 0 ?
            selectedEndCell[0] :
            this.activeCell;
        const activeIndexes: number[] = getCorrespondingIndex(cell, cells);
        const rowIndex: number = activeIndexes[0 as number];
        const colIndex: number = activeIndexes[1 as number];
        let target: HTMLElement;
        switch (this.keyDownEventInstance.keyCode) {
        case 39: // Right arrow
            target = this.handleRightArrowNavigation(cells, rowIndex, colIndex, selectedEndCell);
            break;
        case 37: // Left arrow
            target = this.handleLeftArrowNavigation(cells, rowIndex, colIndex, selectedEndCell);
            break;
        case 38: // Up arrow
            target = this.handleUpArrowNavigation(cells, rowIndex, colIndex);
            break;
        case 40: // Down arrow
            target = this.handleDownArrowNavigation(cells, rowIndex, colIndex);
            break;
        }
        if (target) {
            this.moveToTargetCell(target);
        }
    }

    /*
     * Moves selection to the target cell and updates UI
     */
    private moveToTargetCell(target: HTMLElement): void {
        this.parent.observer.notify('TABLE_MOVE', {
            event: { target: target },
            selectNode: [this.activeCell]
        });
    }

    /*
     * Sets up the selection state by clearing any existing selection and positioning cursor
     */
    private setupSelectionState(): void {
        const selectedEndCell: NodeListOf<HTMLElement> = this.tableModel.getEditPanel().querySelectorAll('.e-cell-select-end');
        if (!isNOU(selectedEndCell) && selectedEndCell.length > 0) {
            this.parent.nodeSelection.Clear(this.tableModel.getDocument());
            this.parent.nodeSelection.setSelectionText(
                this.tableModel.getDocument(),
                selectedEndCell[0],
                selectedEndCell[0],
                0,
                0
            );
            this.parent.nodeSelection.setCursorPoint(
                this.tableModel.getDocument(),
                selectedEndCell[0],
                0
            );
        }
    }

    /*
     * Checks if table multi-select mode is active based on the current selection
     */
    private isTableMultiSelectActive(): boolean {
        const range: Range = this.parent.nodeSelection.getRange(this.tableModel.getDocument());
        if (isNOU(range) || isNOU(range.commonAncestorContainer) || isNOU(this.activeCell)) {
            return false;
        }
        const commonAncestor: Node = range.commonAncestorContainer;
        if (commonAncestor.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        const ancestorElement: Element = commonAncestor as Element;
        const ancestorTagName: string = ancestorElement.tagName;
        const isTableRelatedAncestor: boolean =
            ancestorTagName === 'TR' ||
            ancestorTagName === 'TBODY' ||
            ancestorTagName === 'THEAD' ||
            ancestorTagName === 'TABLE';
        if (ancestorTagName === 'TABLE') {
            const selectedCells: NodeListOf<HTMLElement> = (ancestorElement as HTMLTableElement)
                .querySelectorAll('.e-cell-select, .e-multi-cells-select');
            if (selectedCells.length > 1) {
                return true;
            }
            const activeCell: HTMLElement = this.activeCell;
            const startContainer: Node = range.startContainer;
            let startCell : HTMLElement = null;
            if (startContainer.nodeType === Node.ELEMENT_NODE) {
                startCell  = startContainer as HTMLElement;
            } else {
                startCell  = startContainer.parentElement;
            }
            if (startCell && startCell.tagName !== 'TD' && startCell.tagName !== 'TH') {
                startCell = closest(startCell, 'td,th') as HTMLElement;
            }
            if (startCell && startCell !== activeCell) {
                return true;
            }
            const selectionEndContainer: Node = range.endContainer;
            let endCell: HTMLElement = null;
            if (selectionEndContainer.nodeType === Node.ELEMENT_NODE) {
                endCell = selectionEndContainer as HTMLElement;
            } else {
                endCell = selectionEndContainer.parentElement;
            }
            if (endCell && endCell.tagName !== 'TD' && endCell.tagName !== 'TH') {
                endCell = closest(endCell, 'td,th') as HTMLElement;
            }
            return endCell !== null && endCell !== activeCell;
        }
        return isTableRelatedAncestor;
    }

    /*
     * Handles right arrow key navigation logic
     */
    private handleRightArrowNavigation(
        cells: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        selectedEndCell: NodeListOf<HTMLElement>
    ): HTMLElement {
        if (colIndex < cells[0].length - 1) {
            // Move to next cell in same row
            return cells[rowIndex as number][(colIndex + 1) as number];
        } else if (rowIndex < cells.length - 1) {
            // Move to first cell of next row
            if (selectedEndCell.length === 0 && rowIndex < cells.length - 1) {
                this.activeCell = cells[rowIndex as number][0 as number];
            }
            return cells[(rowIndex + 1) as number][colIndex as number];
        } else {
            // At last cell, reset selection
            this.resetTableSelection();
            return null;
        }
    }

    /*
     * Handles left arrow key navigation logic
     */
    private handleLeftArrowNavigation(
        cells: HTMLElement[][],
        rowIndex: number,
        colIndex: number,
        selectedEndCell: NodeListOf<HTMLElement>
    ): HTMLElement {
        if (0 < colIndex) {
            // Move to previous cell in same row
            return cells[rowIndex as number][(colIndex - 1) as number];
        } else if (0 < rowIndex) {
            // Move to last cell of previous row
            if (selectedEndCell.length === 0 && 0 < rowIndex) {
                this.activeCell = cells[rowIndex as number][(cells[rowIndex as number].length - 1) as number];
            }
            return cells[(rowIndex - 1) as number][colIndex as number];
        } else {
            // At first cell, reset selection
            this.resetTableSelection();
            return null;
        }
    }

    /*
     * Handles up arrow key navigation logic
     */
    private handleUpArrowNavigation(
        cells: HTMLElement[][],
        rowIndex: number,
        colIndex: number
    ): HTMLElement {
        if (0 < rowIndex) {
            // Move to cell above in previous row
            return cells[(rowIndex - 1) as number][colIndex as number];
        } else {
            // At first row, reset selection
            this.resetTableSelection();
            return null;
        }
    }

    /*
     * Handles down arrow key navigation logic
     */
    private handleDownArrowNavigation(
        cells: HTMLElement[][],
        rowIndex: number,
        colIndex: number
    ): HTMLElement {
        if (rowIndex < cells.length - 1) {
            // Move to cell below in next row
            return cells[(rowIndex + 1) as number][colIndex as number];
        } else {
            // At last row, reset selection
            this.resetTableSelection();
            return null;
        }
    }

    /**
     * Checks if table interaction is possible based on current selection and editor state
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {boolean} True if table interaction is possible
     * @public
     */
    public isTableInteractionPossible(event: KeyboardEventArgs): boolean {
        return !isNOU(this.parent.nodeSelection) &&
            this.tableModel.getEditPanel() &&
            event.code !== 'KeyK';
    }

    /**
     * Handles keyboard interactions within table elements
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {void}
     * @public
     */
    public handleTableKeyboardInteractions(event: KeyboardEventArgs): void {
        const range: Range = this.parent.nodeSelection.getRange(this.tableModel.getDocument());
        let ele: HTMLElement = this.parent.nodeSelection.getParentNodeCollection(range)[0] as HTMLElement;
        ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
        this.handleTableDeleteOperations(event, range, ele);
        ele = this.findClosestTableCell(ele);
        this.handleTableCellNavigation(event, range, ele);
    }

    /*
     * Handles Delete/Backspace/Cut operations on tables
     */
    private handleTableDeleteOperations(event: KeyboardEventArgs, range: Range, ele: HTMLElement): void {
        const isDeleteKey: boolean = event.keyCode === 8 || event.keyCode === 46;
        const isCutOperation: boolean = event.ctrlKey && event.keyCode === 88;
        if (isDeleteKey || isCutOperation) {
            if (ele && ele.tagName === 'TBODY') {
                if (!isNOU(this.parent) && this.tableModel.getDocument() &&
                    this.tableModel.getDocument()) {
                    const selection: NodeSelection = this.parent.nodeSelection.save(range, this.tableModel.getDocument());
                    event.preventDefault();
                    this.tableModel.removeTable(selection, event as KeyboardEventArgs, true);
                }
            } else if (ele && ele.querySelectorAll('table').length > 0) {
                this.removeResizeElement();
                this.tableModel.hideTableQuickToolbar();
            }
        }
    }

    /*
     * Finds the closest table cell element from the current element
     */
    private findClosestTableCell(ele: HTMLElement): HTMLElement {
        if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
            const closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
            return !isNOU(closestTd) && this.tableModel.getEditPanel().contains(closestTd) ? closestTd : ele;
        }
        return ele;
    }

    /*
     * Handles keyboard navigation within table cells
     */
    private handleTableCellNavigation(event: KeyboardEventArgs, range: Range, ele: HTMLElement): void {
        if (ele && (ele.tagName === 'TD' || ele.tagName === 'TH')) {
            const selectedEndCell: NodeListOf<HTMLElement> = this.tableModel.getEditPanel().querySelectorAll('.e-cell-select-end');
            // Update active cell if needed
            if ((isNOU(this.activeCell) || this.activeCell !== ele) && !isNOU(selectedEndCell) && selectedEndCell.length === 0
                && (range.collapsed || event.keyCode === 9)) {
                this.activeCell = ele;
            }
            // Save selection for navigation operations
            let selection: NodeSelection;
            if (!isNOU(this.parent.nodeSelection)) {
                selection = this.parent.nodeSelection.save(range, this.tableModel.getDocument());
            }
            // Process navigation keys without shift (or with shift only for Tab)
            if (!(event.shiftKey) || (event.shiftKey && event.keyCode === 9)) {
                switch (event.keyCode) {
                case 9:  // Tab
                case 37: // Left arrow
                case 39: // Right arrow
                    this.tabSelection(event, selection, ele);
                    break;
                case 40: // Down arrow
                case 38: // Up arrow
                    this.tableArrowNavigation(event, selection, ele);
                    break;
                }
            }
        }
    }

    /**
     * Handles global keyboard shortcuts like Ctrl+A
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {void}
     * @public
     */
    public handleGlobalKeyboardShortcuts(event: KeyboardEventArgs): void {
        if (event.ctrlKey && event.key === 'a') {
            this.handleSelectAll();
        }
    }

    /*
     * Handles Ctrl+A (Select All) action in the context of tables.
     * This method ensures proper cleanup of table selection indicators
     * when the user performs a select all operation.
     */
    private handleSelectAll(): void {
        this.cancelResizeAction();
        const selectedCells: NodeListOf<Element> = this.tableModel.getEditPanel().querySelectorAll('.' + CLS_TABLE_SEL);
        removeClassWithAttr(selectedCells, CLS_TABLE_SEL);
        this.removeTableSelection();
    }

    /**
     * Handles table deletion with Delete/Backspace keys
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {void}
     * @public
     */
    public handleTableDeletion(event: KeyboardEventArgs): void {
        const isDeleteKey: boolean = event.code === 'Delete' && event.which === 46;
        const isBackspaceKey: boolean = event.code === 'Backspace' && event.which === 8;
        if ((isDeleteKey || isBackspaceKey) && this.tableModel.editorMode === 'HTML') {
            const range: Range = this.parent.nodeSelection.getRange(
                this.tableModel.getDocument()
            );
            // Handle fake selection deletion
            if (this.isFakeTableSelectionElement(range.startContainer)) {
                this.deleteTable();
                event.preventDefault();
                return;
            }
            // Handle adjacent table deletion
            const table: HTMLElement = this.getAdjacentTableElement(range, isDeleteKey);
            if (table) {
                this.updateTableSelection(table);
                event.preventDefault();
            }
        }
    }

    /*
     * Applies selection styling to a table element.
     * This method adds the appropriate CSS class to visually indicate
     * that a table has been selected.
     */
    private updateTableSelection(table: HTMLElement): void {
        addClass([table], 'e-cell-select');
    }

    /*
     * Finds an adjacent table element relative to the current selection
     * This method identifies table elements that are next to the current cursor position
     * when the user presses Delete or Backspace keys at content boundaries.
     */
    private getAdjacentTableElement(range: Range, isdelKey: boolean): HTMLElement | null {
        if (!range.collapsed || (!isdelKey && this.tableModel.isTableQuickToolbarVisible())) {
            return null;
        }
        const nodeCollection: Node[] = this.getNodeCollection(range);
        const startContainer: HTMLElement = (range.collapsed && this.tableModel.getEditPanel() === range.startContainer
            && nodeCollection && nodeCollection.length > 0 && nodeCollection[0] ?
            nodeCollection[0] : range.startContainer) as HTMLElement;
        let adjacentElement: HTMLElement = this.getSelectedTableEle(nodeCollection);
        const isBrEle: HTMLElement = this.getBrElement(range, nodeCollection);
        if (this.shouldSkipForMediaElement(startContainer, range, isdelKey)) {
            return null;
        }
        if (this.shouldSkipForTextNode(startContainer, range, isdelKey)) {
            return null;
        }
        if (startContainer && startContainer.nodeType === Node.ELEMENT_NODE && startContainer.tagName === 'TABLE') {
            adjacentElement = startContainer;
        }
        if (adjacentElement) {
            const currentEleIndex: number = this.parent.nodeSelection.getIndex(adjacentElement);
            if (!((range.startOffset === currentEleIndex && isdelKey) ||
                (range.startOffset !== currentEleIndex && !isdelKey))) {
                adjacentElement = null;
            }
        }
        if (!adjacentElement && startContainer) {
            adjacentElement = this.getAdjacentElementFromDom(startContainer, isBrEle, isdelKey);
        }
        if (adjacentElement && adjacentElement.nodeType === Node.ELEMENT_NODE &&
            adjacentElement.tagName === 'TABLE') {
            this.setSelection(adjacentElement, isBrEle);
            return adjacentElement;
        }
        return null;
    }

    /*
     * Checks if the operation should be skipped because of media elements
     */
    private shouldSkipForMediaElement(element: HTMLElement, range: Range, isdelKey: boolean): boolean {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
            const isMediaElement: boolean =
                element.tagName === 'IMG' ||
                !!element.querySelector('img') ||
                element.tagName === 'AUDIO' ||
                !!element.querySelector('audio') ||
                element.tagName === 'VIDEO' ||
                !!element.querySelector('video') ||
                !!element.querySelector('.e-video-clickelem');
            if (isMediaElement) {
                const compareRange: Range = this.tableModel.getDocument().createRange();
                compareRange.collapse(true);
                compareRange.selectNodeContents(element);
                const nodeIndex: number = this.parent.nodeSelection.getIndex(element);
                return (isdelKey && compareRange.startOffset >= range.startOffset) ||
                    (!isdelKey && (element.tagName !== 'IMG' && compareRange.startOffset !== range.startOffset
                        || element.tagName === 'IMG' && nodeIndex !== range.startOffset));
            }
        }
        return false;
    }

    /*
     * Checks if the operation should be skipped for text nodes
     */
    private shouldSkipForTextNode(startContainer: HTMLElement, range: Range, isdelKey: boolean): boolean {
        if (startContainer && startContainer.nodeType === Node.TEXT_NODE) {
            if (isdelKey) {
                if (range.endOffset !== range.endContainer.textContent.length) {
                    if (range.endOffset !== range.endContainer.textContent.trim().length) {
                        return true;
                    }
                }
            } else if (range.startOffset !== 0) {
                return true;
            }
        }
        return false;
    }

    /*
     * Finds adjacent elements by traversing through the DOM hierarchy.
     * This method recursively searches for adjacent elements by traversing up the DOM tree
     * and checking siblings at each level until it finds a suitable element.
     */
    private getAdjacentElementFromDom(startContainer: HTMLElement, isBrEle: HTMLElement, isdelKey: boolean): HTMLElement {
        let adjacentElement: HTMLElement;
        let parentElement: HTMLElement = (isBrEle ? isBrEle : startContainer.parentNode) as HTMLElement;
        let currentElement: HTMLElement = startContainer;
        while (parentElement && !adjacentElement && parentElement.parentNode) {
            const childNodes: ChildNode[] = Array.from(parentElement.childNodes);
            const startContainerIndex: number = childNodes.indexOf(currentElement);
            // Check if we can find an adjacent sibling within the parent
            if (startContainerIndex !== -1 && ((isdelKey && startContainerIndex < childNodes.length - 1)
                || (!isdelKey && startContainerIndex > 0))) {
                adjacentElement = (childNodes[isdelKey ?
                    startContainerIndex + 1 as number :
                    startContainerIndex - 1 as number]) as HTMLElement;
            } else {
                // Otherwise, look at parent's siblings
                adjacentElement = (isdelKey ? parentElement.nextSibling : parentElement.previousSibling) as HTMLElement;
                currentElement = parentElement;
            }
            // Handle special case for BR elements
            if (this.isBrElement(isBrEle, startContainer, adjacentElement)) {
                isBrEle = currentElement = parentElement = adjacentElement;
                adjacentElement = null;
                continue;
            }
            // Skip empty text nodes
            if (this.isEmptyTextNode(isBrEle, adjacentElement)) {
                currentElement = parentElement = adjacentElement.parentNode as HTMLElement;
                adjacentElement = null;
                continue;
            }
            // Handle list elements specially
            if (this.isListElement(adjacentElement)) {
                adjacentElement = this.getAdjacentElementFromList(adjacentElement, isdelKey);
                if (!adjacentElement) {
                    return null;
                }
            }
            // Special handling for list items
            if (this.isLiElement(parentElement, isdelKey)) {
                adjacentElement = parentElement;
            }
            parentElement = parentElement.parentNode as HTMLElement;
        }
        return adjacentElement;
    }

    /*
     * Checks if the given element is a BR element that needs special handling
     */
    private isBrElement(isBrEle: HTMLElement, startContainer: HTMLElement, adjacentElement: HTMLElement): boolean {
        return !isBrEle &&
            startContainer.nodeType === Node.TEXT_NODE &&
            adjacentElement &&
            adjacentElement.tagName &&
            adjacentElement.tagName.toUpperCase() === 'BR';
    }

    /*
     * Checks if the given element is an empty text node
     */
    private isEmptyTextNode(isBrEle: HTMLElement, adjacentElement: HTMLElement): boolean {
        return !isBrEle &&
            adjacentElement &&
            !(adjacentElement.nodeType === Node.ELEMENT_NODE && adjacentElement.tagName === 'TABLE') &&
            !isNOU(adjacentElement.textContent) &&
            !adjacentElement.textContent.trim();
    }

    /*
     * Checks if the given element is a list element
     */
    private isListElement(element: HTMLElement): boolean {
        return element &&
            element.tagName &&
            ['UL', 'OL', 'LI'].indexOf(element.tagName.toUpperCase()) !== -1;
    }

    /*
     * Checks if the given element is a list item element in a special case
     */
    private isLiElement(element: HTMLElement, isdelKey: boolean): boolean {
        return element &&
            element.tagName &&
            element.tagName.toUpperCase() === 'LI' &&
            !isdelKey;
    }

    /*
     * Recursively finds the appropriate adjacent element within list structures.
     * This method handles the special case of navigating within nested lists
     * by finding the correct target element.
     */
    private getAdjacentElementFromList(adjacentElement: HTMLElement, isdelKey: boolean): HTMLElement {
        while (adjacentElement) {
            if (adjacentElement.tagName &&
                ['UL', 'OL', 'LI'].indexOf(adjacentElement.tagName.toUpperCase()) === -1) {
                if (!(adjacentElement.nodeType === Node.ELEMENT_NODE && adjacentElement.tagName === 'TABLE')) {
                    adjacentElement = (isdelKey ?
                        adjacentElement.firstChild :
                        adjacentElement.lastChild) as HTMLElement;
                }
                break;
            }
            adjacentElement = (isdelKey ?
                adjacentElement.firstChild :
                adjacentElement.lastChild) as HTMLElement;
        }
        return adjacentElement;
    }

    /*
     * Retrieves a collection of DOM nodes from the current selection range.
     * This method extracts relevant nodes based on whether the range is collapsed
     * or expanded, handling the special case of a collapsed range at the edit panel.
     */
    private getNodeCollection(range: Range): Node[] {
        let nodes: Node[] = [];
        if (range.collapsed && this.tableModel.getEditPanel() === range.startContainer
            && range.startContainer.childNodes.length > 0) {
            const index: number = Math.max(0, Math.min(
                range.startContainer.childNodes.length - 1,
                range.endOffset - 1
            ));
            nodes.push(range.startContainer.childNodes[index as number]);
        } else {
            nodes = this.parent.nodeSelection.getNodeCollection(range);
        }
        return nodes;
    }

    /*
     * Finds the first table element within a collection of nodes.
     * This method scans the provided node collection and returns the first
     * node that is a TABLE element.
     */
    private getSelectedTableEle(nodeCollection: Node[]): HTMLElement | null {
        if (nodeCollection && nodeCollection.length > 0) {
            for (const element of Array.from(nodeCollection)) {
                if (element && (element as HTMLElement).tagName === 'TABLE') {
                    return element as HTMLElement;
                }
            }
        }
        return null;
    }

    /*
     * Finds a BR element within the range or node collection.
     * This method checks whether the range's end container is a BR element
     * or if the node collection contains exactly one BR element.
     */
    private getBrElement(range: Range, nodeCollection: Node[]): HTMLElement | null {
        if ((range.endContainer as HTMLElement).tagName === 'BR') {
            return range.endContainer as HTMLElement;
        }
        // Check if the node collection contains exactly one BR element
        if (nodeCollection.length === 1 && nodeCollection[0] &&
            (nodeCollection[0] as HTMLElement).tagName === 'BR') {
            return nodeCollection[0] as HTMLElement;
        }
        return null;
    }

    /*
     * Sets up selection for a table element about to be deleted.
     * This method prepares the editor for table deletion by creating a fake selection
     * element and removing any BR elements that might interfere with the process.
     */
    private setSelection(nextElement: HTMLElement, isBrEle: HTMLElement): void {
        if (!nextElement.classList.contains('e-cell-select')) {
            this.parent.nodeSelection.Clear(this.tableModel.getDocument());
            if (isBrEle) {
                if (isBrEle.parentNode &&
                    isBrEle.parentNode.childNodes.length === 1 &&
                    isBrEle.parentNode.firstChild.nodeName === 'BR') {
                    detach(isBrEle.parentNode);
                } else {
                    detach(isBrEle);
                }
            }
            // Create and add a fake selection element
            const fakeSelectionEle: HTMLElement = createElement('div', {
                className: 'e-table-fake-selection'
            });
            fakeSelectionEle.setAttribute('contenteditable', 'false');
            this.tableModel.getEditPanel().appendChild(fakeSelectionEle);
            this.parent.nodeSelection.setSelectionNode(
                this.tableModel.getDocument(),
                fakeSelectionEle
            );
        }
    }

    /*
     * Removes a table from the document and replaces it with an appropriate container element.
     * This method deletes the selected table and inserts a proper container element (p, div, or br)
     * based on the editor's configuration. It then positions the cursor at the new container.
     */
    private deleteTable(): void {
        const table: HTMLElement = this.tableModel.getEditPanel().querySelector('table.e-cell-select');
        this.removeResizeElement();
        if (table) {
            const brElement: HTMLBRElement = document.createElement('br');
            let containerEle: HTMLElement = brElement;
            if (this.tableModel.enterKey === 'DIV') {
                containerEle = document.createElement('div');
                containerEle.appendChild(brElement);
            } else if (this.tableModel.enterKey === 'P') {
                containerEle = document.createElement('p');
                containerEle.appendChild(brElement);
            }
            table.parentNode.replaceChild(containerEle, table);
            this.parent.nodeSelection.setSelectionText(
                this.tableModel.getDocument(),
                containerEle,
                containerEle,
                0,
                0
            );
            this.removeTableSelection();
        }
    }

    /*
     * Checks if the element is a fake table selection div
     */
    private isFakeTableSelectionElement(element: Node): boolean {
        return element.nodeType === Node.ELEMENT_NODE &&
            element.nodeName === 'DIV' &&
            (element as HTMLElement).classList.contains('e-table-fake-selection');
    }

    /**
     * Handles deselection when typing or using action keys
     *
     * @param {KeyboardEventArgs} event - The keyboard event arguments
     * @returns {void}
     * @public
     */
    public handleDeselectionOnTyping(event: KeyboardEventArgs): void {
        const isShiftEnter: boolean = event.shiftKey && event.key === 'Enter';
        const isActionKey: boolean = TABLE_SELECTION_STATE_ALLOWED_ACTIONKEYS.indexOf(event.key) !== -1;
        const isSingleCharKey: boolean = event.key && event.key.length === 1;

        if (isShiftEnter || isActionKey || isSingleCharKey) {
            const table: HTMLElement = this.tableModel.getEditPanel().querySelector('table.e-cell-select');

            if (table) {
                if (event.keyCode === 39 || event.keyCode === 37) {
                    this.parent.nodeSelection.setCursorPoint(
                        this.tableModel.getDocument(),
                        table,
                        0
                    );
                } else {
                    const firstTd: HTMLElement = table.querySelector('tr').cells[0];
                    this.parent.nodeSelection.setSelectionText(
                        this.tableModel.getDocument(),
                        firstTd,
                        firstTd,
                        0,
                        0
                    );
                }

                this.removeTableSelection();
            }
        }
    }

    /**
     * Sets appropriate default content when the editor is empty based on the configured enter key behavior.
     *
     * @returns {void} - This method does not return a value
     * @public
     */
    public setDefaultEmptyContent(): void {
        if (this.tableModel.getEditPanel().innerHTML === null || this.tableModel.getEditPanel().innerHTML === '') {
            const editPanel: Element = this.tableModel.getEditPanel();
            if (this.tableModel.enterKey === 'DIV') {
                editPanel.innerHTML = '<div><br/></div>';
            } else if (this.tableModel.enterKey === 'BR') {
                editPanel.innerHTML = '<br/>';
            } else {
                editPanel.innerHTML = '<p><br/></p>';
            }
        }
    }

    /**
     * Handles keyboard events after key up in tables.
     * This method identifies the current table cell element based on selection,
     * applies appropriate CSS classes, and manages selection state transitions
     * when navigating between cells.
     *
     * @param {NotifyArgs} e - The notification arguments containing event data
     * @returns {void}
     * @private
     */
    public tableModulekeyUp(e: NotifyArgs): void {
        if (!isNOU(this.parent.nodeSelection) && this.tableModel.getEditPanel()) {
            const range: Range = this.parent.nodeSelection.getRange(
                this.tableModel.getDocument()
            );
            const ele: HTMLElement = this.getSelectedElementFromRange(range);
            if ((ele && (ele.tagName === 'TD' || ele.tagName === 'TH')) &&
                !ele.classList.contains(CLS_TABLE_SEL) && (range.collapsed || (e.args as KeyboardEventArgs).keyCode === 9)) {
                ele.classList.add(CLS_TABLE_SEL);
            }
            this.handleTableElementTransition(ele, e.args as KeyboardEventArgs);
        }
    }

    /*
     * Gets the selected element from the current range.
     * This method extracts the parent element of the selection and ensures
     * it's the actual table cell (TD or TH) by traversing up if needed.
     */
    private getSelectedElementFromRange(range: Range): HTMLElement {
        let ele: HTMLElement = this.parent.nodeSelection
            .getParentNodeCollection(range)[0] as HTMLElement;
        ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
        if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
            const closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
            ele = !isNOU(closestTd) && this.tableModel.getEditPanel().contains(closestTd) ?
                closestTd : ele;
        }
        return ele;
    }

    /*
     * Handles transitions between table elements during navigation.
     * This method cleans up selection states when moving between different
     * table cells using arrow keys.
     */
    private handleTableElementTransition(currentElement: HTMLElement, eventArgs: KeyboardEventArgs): void {
        const isNewElement: boolean = this.previousTableElement !== currentElement;
        const isPreviousElementValid: boolean = !isNOU(this.previousTableElement);
        const isArrowNavigation: boolean = !eventArgs.shiftKey &&
            (eventArgs.keyCode === 39 || eventArgs.keyCode === 37 ||
                eventArgs.keyCode === 38 || eventArgs.keyCode === 40);
        // If moving from one cell to another with arrow keys, clean up previous cell
        if (isNewElement && isPreviousElementValid && isArrowNavigation) {
            removeClassWithAttr([this.previousTableElement], CLS_TABLE_SEL);
            this.removeTableSelection();
        }
        if ((eventArgs.which === 8 && eventArgs.code === 'Backspace') || (eventArgs.which === 46 && eventArgs.code === 'Delete')) {
            this.tableModel.hideTableQuickToolbar();
        }
    }

    /**
     * Handles cell selection in a table when a cell is clicked.
     *
     * @param {ITableNotifyArgs} e - The event arguments containing information about the cell selection event.
     * @returns {void} - This method does not return a value.
     * @public
     */
    public cellSelect(e: ITableNotifyArgs): void {
        if (!e || !e.args) {
            return;
        }
        const target: HTMLTableCellElement = this.getTargetCell(e);
        if (this.isShiftKeyTableMove(e, target)) {
            this.handleShiftKeyTableMove(e);
            return;
        }
        this.resetTableSelectionState(e, target);
        if (this.isValidTableCell(target)) {
            this.setActiveCell(target);
        }
    }

    /*
     * Resets the table selection state.
     */
    private resetTableSelectionState(e: ITableNotifyArgs, target: HTMLTableCellElement): void {
        const mouseEvent: MouseEvent = e.args as MouseEvent;
        const isRightClickOnSelectedCell: boolean = this.tableModel.quickToolbarSettings.showOnRightClick &&
            mouseEvent.which === 3 &&
            target.classList.contains(CLS_TABLE_SEL);
        if (!isRightClickOnSelectedCell) {
            if (this && this.isTableMoveActive) {
                this.unwireTableSelectionEvents();
                this.isTableMoveActive = false;
                this.activeCell = null;
            }
            this.heightcheck();
            if (this) {
                this.removeCellSelectClasses();
                this.removeTableSelection();
            }
        }
    }

    /*
     * Unwires (detaches) mouse events related to table selection functionality.
     */
    private unwireTableSelectionEvents(): void {
        if (!this.curTable) {
            return;
        }
        EventHandler.remove(this.curTable, 'mousemove', this.tableMouseMove);
        EventHandler.remove(this.tableModel.getDocument(), 'mouseup', this.tableMouseUp);
        EventHandler.remove(this.curTable, 'mouseleave', this.tableMouseLeave);
    }

    /*
     * Handles the mousemove event during table selection.
     */
    private tableMouseMove(event: MouseEvent): void {
        this.parent.observer.notify(
            'TABLE_MOVE',
            { event: event, selectNode: [this.activeCell] }
        );
    }

    /*
     * Handles mouse up event during table selection.
     */
    private tableMouseUp(): void {
        this.unwireTableSelectionEvents();
        this.handleTableSelectionEnd();
        this.isTableMoveActive = false;
    }

    /*
     * Clears active table selection state if the selection was not finalized.
     */
    private handleTableSelectionEnd(): void {
        if (this.activeCell &&
            !this.activeCell.classList.contains(CLS_TABLE_SEL) &&
            this.isTableMoveActive) {
            this.activeCell = null;
        }
    }

    /*
     * Handles mouse leave event when selecting a table.
     */
    private tableMouseLeave(): void {
        if (!Browser.isDevice) {
            this.resetTableSelection();
        }
    }

    /*
     * Gets the target table cell element from the event.
     */
    private getTargetCell(e: ITableNotifyArgs): HTMLTableCellElement {
        const mouseEvent: MouseEvent = e.args as MouseEvent;
        const target: HTMLTableCellElement = mouseEvent.target as HTMLTableCellElement;
        const tdNode: Element = closest(target, 'td,th') as HTMLTableCellElement;
        const isTargetNotCell: boolean = target.nodeName !== 'TD';
        const isTdNodeValid: boolean = tdNode !== null && tdNode !== undefined;
        const isInEditPanel: boolean = isTdNodeValid &&
            this.tableModel.getEditPanel().contains(tdNode);
        return (isTargetNotCell && isTdNodeValid && isInEditPanel) ?
            tdNode as HTMLTableCellElement : target;
    }

    /*
     * Checks if the event is a shift key press for table movement.
     */
    private isShiftKeyTableMove(e: ITableNotifyArgs, target: HTMLTableCellElement): boolean {
        const mouseEvent: MouseEvent = e.args as MouseEvent;
        return this && !isNOU(this.activeCell) &&
            mouseEvent.shiftKey &&
            !isNOU(target) &&
            !isNOU(target.tagName) &&
            (target.tagName === 'TD' || target.tagName === 'TH') &&
            this.activeCell !== target;
    }

    /*
     * Handles table movement with shift key pressed.
     */
    private handleShiftKeyTableMove(e: ITableNotifyArgs): void {
        this.parent.observer.notify('TABLE_MOVE', {
            event: e.args,
            selectNode: [this.activeCell]
        });
        (e.args as MouseEvent).preventDefault();
    }

    /*
     * Checks if the target is a valid table cell (TD or TH).
     */
    private isValidTableCell(target: HTMLTableCellElement): boolean {
        return target &&
            target.tagName &&
            (target.tagName === 'TD' || target.tagName === 'TH');
    }

    /*
     * Sets the active cell and initializes table selection.
     */
    private setActiveCell(target: HTMLTableCellElement): void {
        addClass([target], CLS_TABLE_SEL);
        this.activeCell = target;
        if (!this.curTable) {
            this.curTable = closest(target, 'table') as HTMLTableElement;
        }
        this.wireTableSelectionEvents();
        this.isTableMoveActive = true;
        this.removeResizeElement();
        if (this.helper && this.tableModel.getEditPanel().contains(this.helper)) {
            detach(this.helper);
        }
    }

    /*
     * Checks and corrects the height of a table cell if it contains an image with percentage-based height.
     */
    private heightcheck(): void {
        const editPanel: HTMLElement = this.tableModel.getEditPanel() as HTMLElement;
        const tableCell: HTMLElement = editPanel.querySelector('td.e-cell-select') as HTMLElement;
        if (!tableCell) {
            return;
        }
        const image: HTMLImageElement = tableCell.querySelector('img') as HTMLImageElement;
        if (!image || !image.style || typeof image.style.height !== 'string') {
            return;
        }
        if (image.style.height.indexOf('%') !== -1) {
            tableCell.style.height = 'inherit';
        }
    }

    /*
     * Wires (attaches) mouse events for table selection functionality.
     */
    private wireTableSelectionEvents(): void {
        if (!this.curTable) {
            return;
        }
        EventHandler.add(this.curTable, 'mousemove', this.tableMouseMove, this);
        EventHandler.add(this.tableModel.getDocument(), 'mouseup', this.tableMouseUp, this);
        EventHandler.add(this.curTable, 'mouseleave', this.tableMouseLeave, this);
    }

    /**
     * Handles table cell selection based on mouse position.
     *
     * @param {MouseEvent} [e] - The mouse event triggering the selection.
     * @returns {void} - Does not return a value.
     * @public
     */
    public tableCellSelect(e?: MouseEvent): void {
        if (!e) {
            return;
        }
        const target: EventTarget = e.target;
        if (!target) {
            return;
        }
        const parentRow: HTMLElement = (target as HTMLElement).parentElement;
        const tableRow: HTMLElement = parentRow ? parentRow.parentElement : null;
        if (!parentRow || !tableRow) {
            return;
        }
        const row: number = Array.prototype.slice.call(tableRow.children).indexOf(parentRow);
        const col: number = Array.prototype.slice.call(parentRow.children).indexOf(target);
        const list: NodeListOf<Element> = this.dlgDiv.querySelectorAll('.e-rte-tablecell');
        Array.prototype.forEach.call(list, function (item: HTMLElement): void {
            const itemParentRow: HTMLElement = item.parentElement;
            const itemTableRow: HTMLElement = itemParentRow ? itemParentRow.parentElement : null;
            if (!itemParentRow || !itemTableRow) {
                return;
            }
            const parentIndex: number = Array.prototype.slice.call(itemTableRow.children).indexOf(itemParentRow);
            const cellIndex: number = Array.prototype.slice.call(itemParentRow.children).indexOf(item);
            removeClassWithAttr([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) {
                addClass([item], 'e-active');
            }
        });
        this.tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    }

    /**
     * Handles mouse leave event on table cell to reset selection.
     *
     * @param {MouseEvent} [e] - The mouse event.
     * @returns {void} - Does not return a value.
     * @public
     */
    public tableCellLeave(e?: MouseEvent): void {
        removeClassWithAttr(this.dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
        const firstCell: Element = this.dlgDiv.querySelector('.e-rte-tablecell');
        if (firstCell) {
            addClass([firstCell], 'e-active');
        }
        this.tblHeader.innerHTML = '1x1';
    }

    /**
     * Updates the table resize handles after a key is pressed.
     *
     * @returns {void} - This method does not return a value
     * @public
     */
    public afterKeyDown(): void {
        if (this.curTable) {
            this.resizeIconPositionTime = setTimeout(() => {
                this.updateResizeIconPosition();
            }, 1);
        }
    }

    /*
     * Updates the position of resize icons based on the current table dimensions.
     */
    private updateResizeIconPosition(): void {
        if (this.curTable) {
            const tableReBox: HTMLElement = this.tableModel.getEditPanel().querySelector('.e-table-box');
            if (!isNOU(tableReBox)) {
                const tablePosition: OffsetPosition = this.calcPos(this.curTable);
                tableReBox.style.cssText = 'top: ' + (tablePosition.top + parseInt(getComputedStyle(this.curTable).height, 10) - 4) +
                    'px; left:' + (tablePosition.left + parseInt(getComputedStyle(this.curTable).width, 10) - 4) + 'px;';
            }
        }
    }
}

/*
 * Class representing table cell selection boundaries
 * Used to track the start and end positions of selected cells in a table
 */
class MinMax {
    /**
     * Starting row index of the selection
     *
     * @public
     * @type {number}
     */
    public startRow: number;

    /**
     * Ending row index of the selection
     *
     * @public
     * @type {number}
     */
    public endRow: number;

    /**
     * Starting column index of the selection
     *
     * @public
     * @type {number}
     */
    public startColumn: number;

    /**
     * Ending column index of the selection
     *
     * @public
     * @type {number}
     */
    public endColumn: number;
}

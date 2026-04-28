import { BlockManager } from '../base/block-manager';
import * as constants from '../../common/constant';
import { ITableBlockSettings, TableRowModel, TableColumnModel, TableCellModel, BlockModel } from '../../models/index';
import { setCursorPosition, decoupleReference, generateUniqueId, getBlockContentElement, getBlockModelById,
    removeFocusFromAllCells, projectEqualPercentFits, applyEqualPercent, changeColWidthToPxUnits, getWidthMode,
    getColgroupChildren } from '../../common/utils/index';
import { createElement } from '@syncfusion/ej2-base';
import { BlockFactory } from './block-factory';
import { findClosestParent } from '../../common/utils/dom';
import { ITableColumnDeletionOptions, ITableColumnInsertOptions, ITableRowDeletionOptions, ITableRowInsertOptions, PayloadCell } from '../base/interface';
import { TableUIManager } from '../plugins/table/ui-manager';


/**
 * Manages core table block actions
 *
 * @hidden
 */
export class TableService {
    private parent: BlockManager;

    /**
     * Creates a new BlockCommandManager instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Creates and returns a fully rendered <tr> element for the given row model.
     *
     * @param {number} visualRowIndex - The visual row index in DOM (1-based, accounts for header if present)
     * @param {ITableBlockSettings} settings - Current table configuration (columns, enableHeader, enableRowNumbers, etc.)
     * @param {BlockModel} block - The parent table BlockModel
     * @param {TableRowModel} TableRowModel - The row data model to render
     * @returns {HTMLTableRowElement} The created <tr> element with all cells appended
     *
     * @hidden
     */
    public createRow(
        visualRowIndex: number,
        settings: ITableBlockSettings,
        block: BlockModel,
        TableRowModel: TableRowModel
    ): HTMLTableRowElement {
        const rowEl: HTMLTableRowElement = createElement('tr') as HTMLTableRowElement;
        const columns: TableColumnModel[] = settings.columns;
        rowEl.dataset.row = visualRowIndex.toString();

        // Row number cell
        if (settings.enableRowNumbers) {
            const rn: HTMLTableCellElement = createElement('td', {
                className: 'e-row-number',
                attrs: { tabindex: '-1', 'aria-hidden': 'true', contenteditable: 'false' }
            }) as HTMLTableCellElement;
            rn.textContent = (settings.enableHeader ? (visualRowIndex) : (visualRowIndex + 1)).toString();
            rowEl.appendChild(rn);
        }

        // Data cells
        columns.forEach((colModel: TableColumnModel, cIdx: number) => {
            const td: HTMLTableCellElement = createElement('td') as HTMLTableCellElement;
            td.dataset.row = visualRowIndex.toString();
            td.dataset.col = cIdx.toString();
            td.tabIndex = 0;
            td.setAttribute('role', 'gridcell');
            const cell: TableCellModel = (TableRowModel.cells).find((c: TableCellModel) => c.columnId === colModel.id);
            const cellBlockContainer: HTMLElement = createElement('div', {
                id: cell.id,
                className: 'e-cell-blocks-container'
            });
            if (cell) {
                cell.blocks.forEach((innerBlock: BlockModel) => {
                    const innerEl: HTMLElement = this.parent.blockRenderer.createBlockElement(innerBlock);
                    cellBlockContainer.appendChild(innerEl);
                });
            }
            td.appendChild(cellBlockContainer);
            rowEl.appendChild(td);
        });
        return rowEl;
    }

    /**
     * Inserts a new row at the specified position in both model and DOM.
     * Automatically updates row numbers and dataset indices.
     *
     * @param {ITableRowInsertOptions} options - arguments needed for row insertion in specified position.
     * @returns {void}
     *
     * @hidden
     */
    public addRowAt(options: ITableRowInsertOptions): void {
        const { blockId, rowIndex, rowModel, isUndoRedoAction } = options;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        const table: HTMLTableElement = blockElement.querySelector('table.e-table-element');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        this.removeCellFocus(table);
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;
        const tbody: HTMLTableSectionElement = table.tBodies[0];

        const newTableRowModel: TableRowModel = rowModel || this.createRowModel(settings);
        settings.rows.splice(rowIndex, 0, newTableRowModel);

        // Render DOM row from model
        const newRowEl: HTMLTableRowElement = this.createRow(rowIndex, settings, block, newTableRowModel);
        const rows: HTMLTableRowElement[] = Array.from(tbody.rows);
        tbody.insertBefore(newRowEl, rows[rowIndex as number]);
        // Update dataset indices
        Array.from(tbody.rows).forEach(( row: HTMLTableRowElement, rIdx: number ) => {
            row.dataset.row = settings.enableHeader ? (rIdx + 1).toString() : rIdx.toString();
            Array.from(row.cells).forEach((cell: HTMLTableCellElement) => {
                if (cell.tagName === 'TD') {
                    cell.dataset.row = (rIdx + 1).toString();
                    cell.setAttribute('aria-rowindex', (rIdx + 1).toString());
                }
            });
        });
        this.addCellFocus(newRowEl.cells[0], true);
        this.updateRowNumbers(table, settings);
        const deCoupledRowModel: TableRowModel = decoupleReference(newTableRowModel);
        this.parent.undoRedoAction.trackTableRowInsertionForUndoRedo({
            blockId, rowIndex, rowModel: deCoupledRowModel, isUndoRedoAction
        });
        this.triggerBlockUpdate(block, oldBlock);
    }

    /**
     * Inserts a new column at the specified position in both model and DOM.
     * Handles column model creation, width redistribution, and cell block containers.
     *
     * @param {ITableColumnInsertOptions} options - arguments needed for column insertion in specified position.
     * @returns {void}
     *
     * @hidden
     */
    public addColumnAt(options: ITableColumnInsertOptions): void {
        const { blockId, colIndex, columnModel, columnCells, isUndoRedoAction } = options;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        const table: HTMLTableElement = blockElement.querySelector('table.e-table-element');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const tableBlockElement: HTMLElement = findClosestParent(table, '.' + constants.TABLE_BLOCK_CLS);
        const targetColIndex: number = colIndex;
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;
        const colIndicator: HTMLElement = tableBlockElement.querySelector('.e-col-insert-handle');
        const colLine: HTMLElement = tableBlockElement.querySelector('.e-col-hover-line');
        const colResizeHandle: HTMLElement = tableBlockElement.querySelector('.e-col-resize-handle');
        const mode: 'px' | 'percent' = getWidthMode(table);
        const containerWidth: number = table.clientWidth;
        this.updateDataColCount(table, false);
        const newCount: number = parseInt(table.getAttribute('data-col-counter'), 10);
        table.setAttribute('data-col-counter', newCount.toString());
        colIndicator.style.display = 'none';
        colLine.style.display = 'none';
        colResizeHandle.style.display = 'none';

        // Insert TableColumnModel into settings.columns
        const newColModel: TableColumnModel = columnModel || this.createColumnModel(newCount);
        const newColCells: TableCellModel[] = [];

        (settings.columns as TableColumnModel[]).splice(targetColIndex, 0, newColModel);

        // Insert a new cell into each row model at the same index, populate blocks if provided
        (settings.rows).forEach((row: TableRowModel, rIdx: number) => {
            const newCell: TableCellModel = columnModel ? columnCells[rIdx as number] : this.createTableCell(newColModel.id);
            (row.cells as TableCellModel[]).splice(targetColIndex, 0, newCell);
            newColCells.push(decoupleReference(newCell));
        });

        // Update colgroup visuals
        const colgroup: HTMLElement = table.querySelector('colgroup');
        const newColEl: HTMLTableColElement = createElement('col') as HTMLTableColElement;
        colgroup.insertBefore(newColEl, colgroup.children[(settings.enableRowNumbers ? targetColIndex + 1 : targetColIndex) as number]);

        if (mode === 'percent') {
            // Decide if we can keep equal percent after insertion
            const n: number = settings.columns.length;
            const canStayPercent: boolean = projectEqualPercentFits(containerWidth, n, constants.TABLE_NEW_COL_WIDTH);
            if (canStayPercent) {
                // Equal % distribution
                applyEqualPercent(table, settings);
            } else {
                // Switch to px mode: keep existing px widths and give new column 120px
                changeColWidthToPxUnits(table, settings, { index: targetColIndex, width: constants.TABLE_NEW_COL_WIDTH });
            }
        } else {
            // Already in px mode: keep existing px widths, assign 120px to new col
            const dataCols: HTMLTableColElement[] = getColgroupChildren(table);
            dataCols[targetColIndex as number].style.width = `${constants.TABLE_NEW_COL_WIDTH}px`;
        }

        // Update rows DOM
        const rowsEl: HTMLTableRowElement[] = Array.from(table.rows);
        rowsEl.forEach((rowEl: HTMLTableRowElement, rIdx: number) => {
            const isHeader: boolean = rowEl.parentElement.tagName === 'THEAD';
            const newCellEl: HTMLElement = createElement(isHeader ? 'th' : 'td');
            newCellEl.dataset.row = isHeader ? '0' : (rIdx).toString();
            newCellEl.dataset.col = targetColIndex.toString();
            newCellEl.tabIndex = 0;
            if (isHeader) {
                newCellEl.textContent = newColModel.headerText;
                newCellEl.setAttribute('role', 'columnheader');
                newCellEl.setAttribute('contenteditable', 'true');
            } else {
                newCellEl.setAttribute('role', 'gridcell');
                const cellBlockContainer: HTMLElement = createElement('div', {
                    id: (settings.rows[rIdx - (settings.enableHeader ? 1 : 0)].cells[targetColIndex as number]).id,
                    className: constants.TABLE_CELL_BLK_CONTAINER
                });
                const innerBlock: BlockModel = (settings.rows[rIdx - (settings.enableHeader ? 1 : 0)]
                    .cells[targetColIndex as number]).blocks[0];
                if (innerBlock) {
                    const innerEl: HTMLElement = this.parent.blockRenderer.createBlockElement(innerBlock);
                    cellBlockContainer.appendChild(innerEl);
                }
                newCellEl.appendChild(cellBlockContainer);
            }
            rowEl.insertBefore(newCellEl, rowEl.cells[(settings.enableRowNumbers ? targetColIndex + 1 : targetColIndex) as number]);
            // Shift col data attributes for cells to the right
            for (let i: number = targetColIndex + 1; i < rowEl.cells.length; i++) {
                const cell: HTMLTableCellElement = rowEl.cells[(settings.enableRowNumbers ? i + 1 : i) as number] as HTMLTableCellElement;
                if (cell && cell.dataset.col) { cell.dataset.col = i.toString(); }
            }
        });

        this.assertColDataset(table);

        // Focus first cell of the newly added column in the first body row
        const firstBodyRow: HTMLTableRowElement = table.tBodies[0].rows[0];
        if (firstBodyRow) {
            const domCol: number = settings.enableRowNumbers ? targetColIndex + 1 : targetColIndex;
            const focusCell: HTMLElement = firstBodyRow.cells[domCol as number] as HTMLElement;
            if (focusCell) { this.removeCellFocus(table); this.addCellFocus(focusCell, true); }
        }
        const deCoupledColModel: TableColumnModel = decoupleReference(newColModel);
        this.parent.undoRedoAction.trackTableColumnInsertionForUndoRedo({
            blockId, colIndex: targetColIndex, columnModel: deCoupledColModel, columnCells: newColCells, isUndoRedoAction
        });
        this.triggerBlockUpdate(block, oldBlock);
    }

    /**
     * Deletes a row from the table at the given DOM/visual row index.
     * Updates model, DOM, row numbers, and dataset attributes.
     *
     * @param {ITableRowDeletionOptions} options - arguments needed for row deletion in specified index.
     * @returns {void}
     *
     * @hidden
     */
    public deleteRowAt(options: ITableRowDeletionOptions): void {
        const { blockId , modelIndex, isUndoRedoAction  } = options;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        const table: HTMLTableElement = blockElement.querySelector('table');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;
        const tbody: HTMLTableSectionElement = table.tBodies[0];
        if (modelIndex < 0 || modelIndex >= props.rows.length) { return; }
        const rowModel: TableRowModel = props.rows[modelIndex as number];
        props.rows.splice(modelIndex, 1);
        const rowEl: HTMLTableRowElement = tbody.rows[modelIndex as number] as HTMLTableRowElement;
        const previousRowEle: HTMLTableRowElement = rowEl.previousElementSibling as HTMLTableRowElement;
        this.removeCellFocus(table);
        if (rowEl) { rowEl.remove(); }
        Array.from(tbody.rows).forEach((row: HTMLTableRowElement, rIdx: number) => {
            row.dataset.row = props.enableHeader ? (rIdx + 1).toString() : rIdx.toString();
            Array.from(row.cells).forEach((cell: HTMLTableCellElement) => {
                if (cell.tagName === 'TD') {
                    const vis: number = props.enableHeader ? rIdx + 1 : rIdx;
                    cell.dataset.row = vis.toString();
                    cell.setAttribute('aria-rowindex', (rIdx + 1).toString());
                }
            });
        });
        if (tbody.rows.length > 0){
            this.addCellFocus(tbody.rows[modelIndex - (modelIndex > 0 ? 1 : 0)].cells[0], true);
        }
        else{
            if (props.enableHeader){
                const headerRow: HTMLTableRowElement = table.querySelector('thead tr') as HTMLTableRowElement;
                const firstHeaderCell: HTMLTableCellElement = headerRow.cells[props.enableRowNumbers ? 1 : 0] as HTMLTableCellElement;
                this.addCellFocus(firstHeaderCell, true);
            }
            else {
                const nextBlock: HTMLElement = blockElement.nextElementSibling as HTMLElement;
                const previousBlock: HTMLElement = blockElement.previousElementSibling as HTMLElement;
                this.parent.setFocusToBlock(nextBlock || previousBlock);
            }
        }
        this.updateRowNumbers(table, props);
        const deCoupledRowModel: TableRowModel = decoupleReference(rowModel);
        this.parent.undoRedoAction.trackTableRowDeletionForUndoRedo({
            blockId, rowIndex: modelIndex, rowModel: deCoupledRowModel, isUndoRedoAction
        });
        this.triggerBlockUpdate(block, oldBlock);
    }

    /**
     * Deletes a column from the table at the given data column index.
     * Updates model, colgroup, DOM cells, and dataset attributes.
     *
     * @param {HTMLTableElement} options - The table element
     * @returns {void}
     *
     * @hidden
     */
    public deleteColumnAt(options: ITableColumnDeletionOptions): void {
        const { blockId, colIndex, isUndoRedoAction } = options;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        const table: HTMLTableElement = blockElement.querySelector('table');
        const tbody: HTMLTableSectionElement = table.tBodies[0];
        const rowElToUpdateCellFocus: HTMLTableRowElement = tbody.rows[0 as number] as HTMLTableRowElement;
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;
        const colModel: TableRowModel = props.columns[colIndex as number];
        const deletedColCells: TableCellModel[] = [];
        const mode: 'px' | 'percent' = getWidthMode(table);

        // Model
        props.columns.splice(colIndex, 1);
        props.rows.forEach((r: TableRowModel) => { if (r.cells[colIndex as number]) {
            deletedColCells.push(decoupleReference(r.cells[colIndex as number]));
            r.cells.splice(colIndex, 1); }
        });

        //DOM
        this.removeCellFocus(table);
        const colgroup: HTMLTableColElement = table.querySelector('colgroup');
        const colChildren: HTMLElement[] = Array.from(colgroup.children).filter(
            (col: HTMLElement) => !col.classList.contains('e-col-row-number')) as HTMLElement[];
        if (colChildren[colIndex as number]) {
            colgroup.removeChild(colChildren[colIndex as number]);
        }

        if (mode === 'percent') {
            // Stay in percent: redistribute equally after deletion
            applyEqualPercent(table, props);
        } else {
            changeColWidthToPxUnits(table, props);
        }

        Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
            const cells: HTMLTableCellElement[] = Array.from(row.cells).filter((cell: HTMLElement) => !cell.classList.contains('e-row-number'));
            const indexToDelete: number = Array.from(row.cells).indexOf(cells[colIndex as number]);
            if (indexToDelete >= 0) { row.deleteCell(indexToDelete); }
            // Shift col data attributes for cells to the right
            for (let i: number = colIndex; i < row.cells.length; i++) {
                const cell: HTMLTableCellElement = row.cells[(props.enableRowNumbers ? i + 1 : i) as number] as HTMLTableCellElement;
                if (cell && cell.dataset.col) { cell.dataset.col = i.toString(); }
            }
        });

        this.assertColDataset(table);

        const uiManager: TableUIManager = this.parent.blockRenderer.tableRenderer.getManager(blockId);
        if (uiManager) {
            uiManager.hideAllPinnedColBars();  // Removes all .e-col-action-handle.e-pinned
            uiManager.removeRowColSelection(table);
        }
        this.addCellFocus(rowElToUpdateCellFocus.cells[colIndex as number], true);
        this.updateDataColCount(table, true);
        const deCoupledColModel: TableColumnModel = decoupleReference(colModel);
        this.parent.undoRedoAction.trackTableColumnDeletionForUndoRedo({
            blockId, colIndex: colIndex, columnModel: deCoupledColModel, columnCells: deletedColCells, isUndoRedoAction
        });
        this.triggerBlockUpdate(block, oldBlock);
    }

    private assertColDataset(table: HTMLTableElement): void {
        Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
            const dataCells: HTMLTableCellElement[] = Array.from(row.cells).filter(
                (cell: HTMLTableCellElement) => !cell.classList.contains('e-row-number')
            ) as HTMLTableCellElement[];

            dataCells.forEach((cell: HTMLTableCellElement, dataColIdx: number) => {
                cell.dataset.col = dataColIdx.toString();
            });
        });
    }

    /**
     * Clears the content of specified table cells (model + DOM).
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement[]} domCells - Collection of table cell elements to clear contents
     * @returns {void}
     *
     * @hidden
     */
    public clearCellContents(table: HTMLTableElement, domCells: HTMLTableCellElement[] | NodeListOf<HTMLTableCellElement>): void {
        const blockId: string = table.getAttribute('data-block-id');
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;

        const payloadCells: PayloadCell[] = Array.from(domCells).map((cell: HTMLTableCellElement) => {
            if (!cell || cell.classList.contains('e-row-number')) { return { dataRow: -1, dataCol: -1, prevBlocks: [] }; }
            const domRow: number = parseInt(cell.dataset.row, 10);
            const domCol: number = parseInt(cell.dataset.col, 10);
            const dataRow: number = props.enableHeader ? domRow - 1 : domRow;
            const dataCol: number = domCol;

            // Header
            if (domRow === 0 && props.enableHeader && cell.tagName === 'TH') {
                const prevHeaderText: string = props.columns[dataCol as number].headerText;
                return { dataRow: -1, dataCol, prevBlocks: [], prevHeaderText, isHeader: true } as PayloadCell;
            }

            // Body
            const prevBlocks: BlockModel[] = props.rows[dataRow as number].cells[dataCol as number].blocks.map(
                (b: BlockModel) => ({ ...b })
            );
            return { dataRow, dataCol, prevBlocks };
        });

        payloadCells.forEach((cell: PayloadCell) => this.applyCellChange(table, cell, 'clear'));

        this.parent.undoRedoAction.trackTableCellsClearForUndoRedo({ blockId, cells: payloadCells });
        this.triggerBlockUpdate(block, oldBlock);
    }

    public applyCellChange(table: HTMLTableElement, cell: PayloadCell, mode: 'clear' | 'restore'): void {
        if (cell.isHeader) {
            const headerText: string = mode === 'restore' ? (cell.prevHeaderText) : '';
            this.setHeaderText(table, cell.dataCol, headerText);
        } else {
            const blocks: BlockModel[] = mode === 'restore' ? (cell.prevBlocks) : [BlockFactory.createParagraphBlock()];
            this.setCellBlocks(table, cell.dataRow, cell.dataCol, blocks);
        }
    }

    /**
     * Replaces the blocks inside a specific table cell with the provided blocks.
     * Updates both the data model and the DOM cell content.
     *
     * @param {HTMLTableElement} table - The table element
     * @param {number} dataRowIndex - The data row index in the model (0-based, excludes header)
     * @param {number} dataColIndex - The data column index in the model (0-based, excludes row-number column)
     * @param {BlockModel[]} blocks - Array of blocks to set as cell content
     * @returns {void}
     *
     * @hidden
     */
    public setCellBlocks(table: HTMLTableElement, dataRowIndex: number, dataColIndex: number, blocks: BlockModel[]): void {
        const blockId: string = table.getAttribute('data-block-id');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;

        if (!props.rows[dataRowIndex as number] || !props.rows[dataRowIndex as number].cells[dataColIndex as number]) { return; }

        const cell: TableCellModel = props.rows[dataRowIndex as number].cells[dataColIndex as number];
        cell.blocks = blocks && blocks.length
            ? BlockFactory.populateBlockProperties(blocks, cell.id)
            : [BlockFactory.createParagraphBlock({ parentId: cell.id })];

        const domColIndex: number = (props.enableRowNumbers ? dataColIndex + 1 : dataColIndex);
        const td: HTMLTableCellElement = table.tBodies[0].rows[dataRowIndex as number].cells[domColIndex as number];
        if (!td) { return; }
        const container: HTMLElement = td.querySelector('.' + constants.TABLE_CELL_BLK_CONTAINER) as HTMLElement;
        if (container) { container.innerHTML = ''; }

        cell.blocks.forEach((innerBlock: BlockModel) => {
            const innerEl: HTMLElement = this.parent.blockRenderer.createBlockElement(innerBlock);
            container.appendChild(innerEl);
        });
    }

    /**
     * Sets the header content with the provided value
     * Updates both the data model and the DOM cell content.
     *
     * @param {HTMLTableElement} table - The table element
     * @param {number} dataColIndex - The data column index in the model (0-based, excludes row-number column)
     * @param {string} text - Value to set
     * @returns {void}
     *
     * @hidden
     */
    public setHeaderText(table: HTMLTableElement, dataColIndex: number, text: string): void {
        const blockId: string = table.getAttribute('data-block-id');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;

        if (!props.columns[dataColIndex as number]) { return; }

        // Model
        props.columns[dataColIndex as number].headerText = text;

        // DOM
        const th: HTMLTableCellElement = table.querySelector(`th[data-col="${dataColIndex}"]`) as HTMLTableCellElement;
        th.textContent = text;
    }

    /**
     * Applies visual focus to a table cell and optionally focuses its inner editable block.
     *
     * @param {HTMLElement} cell - The <td> or <th> element to focus
     * @param {boolean} focusInnerBlock - If true, places caret inside the last block of the cell
     * @param {boolean} cursorAtStart - If true and focusing inner block, places cursor at start instead of end
     * @returns {void}
     *
     * @hidden
     */
    public addCellFocus(cell: HTMLElement, focusInnerBlock?: boolean, cursorAtStart?: boolean): void {
        if (cell.classList.contains('e-row-number')) {
            // Find the next data cell in the same row
            const row: HTMLTableRowElement = cell.closest('tr');
            if (row) {
                const next: HTMLElement = Array.from(row.cells).find((cell: HTMLElement) => !cell.classList.contains('e-row-number')) as HTMLElement;
                if (next) { return this.addCellFocus(next, true); }
            }
            return;
        }

        cell.classList.add(constants.TABLE_CELL_FOCUS);
        if (focusInnerBlock) {
            const tag: string = cell.tagName.toLowerCase();
            if (tag === 'td') {
                this.shiftFocusToBlockInCell(cell, cursorAtStart);
                return;
            }
            if (tag === 'th') {
                const pos: number = cursorAtStart ? 0 : (cell.textContent).length;
                this.parent.setFocusToBlock((cell.closest('.' + constants.TABLE_BLOCK_CLS)) as HTMLElement);
                setCursorPosition(cell, pos);
            }
        }
    }

    /**
     * Removes the focus highlight from all cells in the given table.
     *
     * @param {Element} table - The table element or any element containing the table
     * @returns {void}
     *
     * @hidden
     */
    public removeCellFocus(table: Element): void {
        removeFocusFromAllCells(table);
    }

    /**
     * Triggers the block update event.
     *
     * @param {BlockModel} block - the block with updated changes.
     * @param {BlockModel} oldBlock - old block
     * @returns {void}
     *
     * @hidden
     */
    public triggerBlockUpdate(block: BlockModel, oldBlock: BlockModel): void {
        this.parent.eventService.addChange({
            action: 'Update',
            data: {
                block: block,
                prevBlock: oldBlock
            }
        });
        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    public shiftFocusToBlockInCell(cell: HTMLElement, cursorAtStart?: boolean): void {
        const innerBlockEl: HTMLElement = cell.querySelector('.e-block:last-child') as HTMLElement;
        if (innerBlockEl) {
            const contentEl: HTMLElement = getBlockContentElement(innerBlockEl);
            this.parent.setFocusToBlock(innerBlockEl);
            setCursorPosition(contentEl, cursorAtStart ? 0 : contentEl.textContent.length);
        }
    }

    private setColumnWidth(colgroup: HTMLElement, isAdd?: boolean): string {
        const colChildren: HTMLElement[] = Array.from(colgroup.children).filter(
            (col: HTMLElement) => !col.classList.contains('e-col-row-number')) as HTMLElement[];
        const totalCols: number = colChildren.length + (isAdd ? 1 : 0);
        const newWidth: string = 100 / totalCols + '%';
        colChildren.forEach((col: HTMLElement) => {
            (col as HTMLTableColElement).style.width = newWidth;
        });
        return newWidth;
    }

    private createRowModel(settings: ITableBlockSettings): TableRowModel {
        const cells: TableCellModel[] = settings.columns.map((column: TableColumnModel) => this.createTableCell(column.id));
        return { id: generateUniqueId('row_'), cells };
    }

    private createColumnModel(newCount: number): TableColumnModel {
        const newColId: string = generateUniqueId('col_');
        return { id: newColId, type: 'Text', headerText: `Column ${newCount}` };
    }

    private updateDataColCount(table: HTMLTableElement, isDeletion: boolean): void {
        const currentCount: number = parseInt(table.getAttribute('data-col-counter'), 10);
        const newCount: number = currentCount + (isDeletion ? -1 : 1);
        table.setAttribute('data-col-counter', newCount.toString());
    }

    private updateRowNumbers(table: HTMLTableElement, settings: ITableBlockSettings): void {
        if (!settings.enableRowNumbers) { return; }
        const tbody: HTMLTableSectionElement = table.tBodies[0];

        // Body rows: 1..n (independent of enableHeader)
        Array.from(tbody.rows).forEach((tr: HTMLTableRowElement, i: number) => {
            const rnTd: HTMLTableCellElement = tr.querySelector('td.e-row-number') as HTMLTableCellElement;
            if (rnTd) { rnTd.textContent = String(i + 1); }
        });
    }

    private createTableCell(columnId: string): TableCellModel {
        const cellId: string = generateUniqueId('cell_');
        return {
            id: cellId,
            columnId: columnId,
            blocks: [BlockFactory.createParagraphBlock({ parentId: cellId })]
        };
    }
}

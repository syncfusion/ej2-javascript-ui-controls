import * as Y from '../yjs-types';
import { BlockManager } from '../../../block-manager/base/block-manager';
import { ITableBlockSettings, TableCellModel, TableColumnModel, TableRowModel } from '../../../models/block/block-props';
import { BlockModel } from '../../../models/block/block-model';
import { InternalYRuntime, TableSnapshot, XmlElement, YjsDelta } from '../base/interface';
import { toDomCol } from '../../../common/utils/table-utils';
import { TableColumnType } from '../../../models/types';
import { Collaboration } from '../base/collaboration';
import { BlockEditorBinding } from '../plugins/sync-plugin';
import { BlockFactory } from '../../../block-manager/services/block-factory';

/**
 * Utilities for synchronizing table structures between editor and Yjs.
 *
 * @hidden
 */
export class TableAction {
    private parent: BlockEditorBinding
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(parent: BlockEditorBinding, manager: Collaboration) {
        this.parent = parent;
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Returns column elements from a Y table element.
     *
     * @param {Y.XmlElement} yTable - The Y table element
     * @returns {Y.XmlElement[]} - Array of column elements
     * @hidden
     */
    public getYColumns(yTable: Y.XmlElement): Y.XmlElement[] {
        return yTable.toArray().filter(
            (c: Y.XmlElement): c is Y.XmlElement => c instanceof this.YRuntime.XmlElement && c.nodeName === 'tableColumn'
        );
    }

    /**
     * Returns row elements from a Y table element.
     *
     * @param {Y.XmlElement} yTable - The Y table element
     * @returns {Y.XmlElement[]} - Array of row elements
     * @hidden
     */
    public getYRows(yTable: Y.XmlElement): Y.XmlElement[] {
        return yTable.toArray().filter(
            (c: Y.XmlElement): c is Y.XmlElement => c instanceof this.YRuntime.XmlElement && c.nodeName === 'tableRow'
        );
    }

    /**
     * Returns cell elements from a Y table row element.
     *
     * @param {Y.XmlElement} yRow - The Y table row element
     * @returns {Y.XmlElement[]} - Array of cell elements
     * @hidden
     */
    public getYCells(yRow: Y.XmlElement): Y.XmlElement[] {
        return yRow.toArray().filter(
            (c: Y.XmlElement): c is Y.XmlElement => c instanceof this.YRuntime.XmlElement && c.nodeName === 'tableCell'
        );
    }

    /**
     * Finds a column element by its id attribute.
     *
     * @param {Y.XmlElement} yTable - The Y table element
     * @param {string} colId - Column id to find
     * @returns {Y.XmlElement | null} - The found column or null
     * @hidden
     */
    public findYColumnById(yTable: Y.XmlElement, colId: string): Y.XmlElement | null {
        return this.getYColumns(yTable).find((yCol: Y.XmlElement) => yCol.getAttribute('id') === colId);
    }

    /**
     * Finds a row element by its id attribute.
     *
     * @param {Y.XmlElement} yTable - The Y table element
     * @param {string} rowId - Row id to find
     * @returns {Y.XmlElement | null} - The found row or null
     * @hidden
     */
    public findYRowById(yTable: Y.XmlElement, rowId: string): Y.XmlElement | null {
        return this.getYRows(yTable).find((yRow: Y.XmlElement) => yRow.getAttribute('id') === rowId);
    }

    /**
     * Finds a cell element by its id attribute.
     *
     * @param {Y.XmlElement} yRow - The Y table row element
     * @param {string} cellId - Cell id to find
     * @returns {Y.XmlElement | null} - The found cell or null
     * @hidden
     */
    public findYCellById(yRow: Y.XmlElement, cellId: string): Y.XmlElement | null {
        return this.getYCells(yRow).find((yCell: Y.XmlElement) => yCell.getAttribute('id') === cellId);
    }

    /**
     * Creates a Y.XmlElement representing a table column.
     *
     * @param {TableColumnModel} col - Column model to convert
     * @returns {Y.XmlElement} - The created column element
     * @hidden
     */
    public createYColumn(col: TableColumnModel): Y.XmlElement {
        const yCol: Y.XmlElement = new this.YRuntime.XmlElement('tableColumn');

        if (col.id) { yCol.setAttribute('id', col.id); }
        if (col.type) { yCol.setAttribute('type', String(col.type)); }
        if (col.headerText) { yCol.setAttribute('headerText', col.headerText); }
        if (col.width) { yCol.setAttribute('width', String(col.width)); }
        return yCol;
    }

    /**
     * Creates a Y.XmlElement representing a table cell.
     *
     * @param {TableCellModel} cell - Cell model to convert
     * @returns {Y.XmlElement} - The created cell element
     * @hidden
     */
    public createYCell(cell: TableCellModel): Y.XmlElement {
        const yCell: Y.XmlElement = new this.YRuntime.XmlElement('tableCell');
        if (cell.id) { yCell.setAttribute('id', cell.id); }
        if (cell.columnId) { yCell.setAttribute('columnId', cell.columnId); }
        for (const cellBlock of cell.blocks) {
            yCell.push([this.parent.conversion.blockModelToYElement(cellBlock)]);
        }
        return yCell;
    }

    /**
     * Creates a Y.XmlElement representing a table row.
     *
     * @param {TableRowModel} row - Row model to convert
     * @returns {Y.XmlElement} - The created row element
     * @hidden
     */
    public createYRow(row: TableRowModel): Y.XmlElement {
        const yRow: Y.XmlElement = new this.YRuntime.XmlElement('tableRow');
        if (row.id) { yRow.setAttribute('id', row.id); }

        for (const cell of row.cells) {
            yRow.push([this.createYCell(cell)]);
        }
        return yRow;
    }

    /**
     * Syncs table block updates from editor to Yjs representation.
     *
     * @param {Y.XmlElement} yTable - Target Y table element
     * @param {BlockModel} prevBlock - Previous block model
     * @param {BlockModel} block - Current block model
     * @param {Y.Doc} doc - Yjs document context
     * @returns {void} - No return value
     * @hidden
     */
    public syncTableUpdateToYjs(
        yTable: Y.XmlElement,
        prevBlock: BlockModel,
        block: BlockModel,
        doc: Y.Doc
    ): void {
        const prevProps: ITableBlockSettings = prevBlock.properties as ITableBlockSettings;
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;

        if (!prevProps || !props) { return; }

        const prevCols: TableColumnModel[] = prevProps.columns;
        const currCols: TableColumnModel[] = props.columns;
        const prevRows: TableRowModel[] = prevProps.rows;
        const currRows: TableRowModel[] = props.rows;

        if (currCols.length !== prevCols.length) {
            this.syncColumnStructure(yTable, prevCols, currCols, prevRows, currRows);
        }
        if (currRows.length !== prevRows.length) {
            this.syncRowStructure(yTable, prevRows, currRows, currCols.length);
        }

        this.syncColumnProperties(yTable, prevCols, currCols);
        this.syncCellBlockStructure(yTable, prevRows, currRows);
    }

    /**
     * Reconciles column additions/removals between previous and current models.
     *
     * @param {Y.XmlElement} yTable - Target Y table element
     * @param {TableColumnModel[]} prevCols - Previous column models
     * @param {TableColumnModel[]} currCols - Current column models
     * @param {TableRowModel[]} prevRows - Previous row models
     * @param {TableRowModel[]} currRows - Current row models
     * @returns {void} - No return value
     * @hidden
     */
    public syncColumnStructure(
        yTable: Y.XmlElement,
        prevCols: TableColumnModel[],
        currCols: TableColumnModel[],
        prevRows: TableRowModel[],
        currRows: TableRowModel[]
    ): void {
        const prevColIds: Set<string> = new Set(prevCols.map((c: TableColumnModel) => c.id));
        const currColIds: Set<string> = new Set(currCols.map((c: TableColumnModel) => c.id));

        // Columns added
        for (const col of currCols) {
            if (prevColIds.has(col.id)) { continue; }
            const colIndex: number = currCols.indexOf(col);

            // Insert tableColumn element at correct position (after preceding columns)
            const yCol: Y.XmlElement = this.createYColumn(col);
            yTable.insert(colIndex, [yCol]);

            // Insert a cell into every existing row at the same column index
            const yRows: Y.XmlElement[] = this.getYRows(yTable);
            yRows.forEach((yRow: Y.XmlElement, rIdx: number) => {
                const newCell: TableCellModel = currRows[rIdx as number].cells[colIndex as number];
                if (newCell) {
                    yRow.insert(colIndex, [this.createYCell(newCell)]);
                }
            });
        }

        // Columns removed
        for (const col of prevCols) {
            if (currColIds.has(col.id)) { continue; }

            const yCol: Y.XmlElement = this.findYColumnById(yTable, col.id);
            if (yCol) {
                const idx: number = yTable.toArray().indexOf(yCol);
                yTable.delete(idx, 1);
            }

            // Remove corresponding cell from every row
            this.getYRows(yTable).forEach((yRow: Y.XmlElement) => {
                const yCell: Y.XmlElement = this.getYCells(yRow).find((c: Y.XmlElement) => c.getAttribute('columnId') === col.id);
                if (yCell) {
                    const idx: number = yRow.toArray().indexOf(yCell);
                    yRow.delete(idx, 1);
                }
            });
        }
    }

    /**
     * Reconciles row additions/removals between previous and current models.
     *
     * @param {Y.XmlElement} yTable - Target Y table element
     * @param {TableRowModel[]} prevRows - Previous row models
     * @param {TableRowModel[]} currRows - Current row models
     * @param {number} colCount - Number of column elements present
     * @returns {void} - No return value
     * @hidden
     */
    public syncRowStructure(
        yTable: Y.XmlElement,
        prevRows: TableRowModel[],
        currRows: TableRowModel[],
        colCount: number
    ): void {
        const prevRowIds: Set<string> = new Set(prevRows.map((r: TableRowModel) => r.id));
        const currRowIds: Set<string> = new Set(currRows.map((r: TableRowModel) => r.id));

        // Rows added
        for (const row of currRows) {
            if (prevRowIds.has(row.id)) { continue; }

            const rowIndex: number = currRows.indexOf(row);
            const yRow: Y.XmlElement = this.createYRow(row);
            // Rows are positioned after all column elements
            yTable.insert(colCount + rowIndex, [yRow]);
        }

        // Rows removed
        for (const row of prevRows) {
            if (currRowIds.has(row.id)) { continue; }

            const yRow: Y.XmlElement = this.findYRowById(yTable, row.id);
            if (yRow) {
                const idx: number = yTable.toArray().indexOf(yRow);
                yTable.delete(idx, 1);
            }
        }
    }

    /**
     * Updates Y column attributes when column properties change.
     *
     * @param {Y.XmlElement} yTable - Target Y table element
     * @param {TableColumnModel[]} prevCols - Previous column models
     * @param {TableColumnModel[]} currCols - Current column models
     * @returns {void} - No return value
     * @hidden
     */
    public syncColumnProperties(
        yTable: Y.XmlElement,
        prevCols: TableColumnModel[],
        currCols: TableColumnModel[]
    ): void {
        for (const col of currCols) {
            const prev: TableColumnModel = prevCols.find((p: TableColumnModel) => p.id === col.id);
            if (!prev) { continue; }

            const yCol: Y.XmlElement = this.findYColumnById(yTable, col.id);
            if (!yCol) { continue; }

            yCol.setAttribute('width', col.width ? String(col.width) : '');
            if (col.headerText !== prev.headerText) {
                yCol.setAttribute('headerText', col.headerText);
            }
            if (col.type !== prev.type) {
                yCol.setAttribute('type', col.type ? String(col.type) : '');
            }
        }
    }

    /**
     * Synchronizes block structure inside table cells between versions.
     *
     * @param {Y.XmlElement} yTable - Target Y table element
     * @param {TableRowModel[]} prevRows - Previous row models
     * @param {TableRowModel[]} currRows - Current row models
     * @returns {void} - No return value
     * @hidden
     */
    public syncCellBlockStructure(
        yTable: Y.XmlElement,
        prevRows: TableRowModel[],
        currRows: TableRowModel[]
    ): void {
        const yRows: Y.XmlElement[] = this.getYRows(yTable);

        for (const row of currRows) {
            const prevRow: TableRowModel = prevRows.find((r: TableRowModel) => r.id === row.id);
            if (!prevRow) { continue; }

            const yRow: Y.XmlElement = yRows.find((yr: Y.XmlElement) => yr.getAttribute('id') === row.id);
            if (!yRow) { continue; }

            for (const cell of row.cells) {
                const prevCell: TableCellModel = prevRow.cells.find((c: TableCellModel) => c.id === cell.id);
                if (!prevCell) { continue; }

                const currBlocks: BlockModel[] = cell.blocks;
                const prevBlocks: BlockModel[] = prevCell.blocks;

                const yCell: Y.XmlElement = this.findYCellById(yRow, cell.id);
                if (!yCell) { continue; }

                this.reconcileCellBlocks(yCell, prevBlocks, currBlocks);
            }
        }
    }

    /**
     * Reconciles blocks within a Y cell: inserts and deletes as needed.
     *
     * @param {Y.XmlElement} yCell - The target Y cell element
     * @param {BlockModel[]} prevBlocks - Previous blocks in the cell
     * @param {BlockModel[]} currBlocks - Current blocks in the cell
     * @returns {void} - No return value
     * @hidden
     */
    public reconcileCellBlocks(
        yCell: Y.XmlElement,
        prevBlocks: BlockModel[],
        currBlocks: BlockModel[]
    ): void {
        const prevIds: Set<string> = new Set(prevBlocks.map((b: BlockModel) => b.id));
        const currIds: Set<string> = new Set(currBlocks.map((b: BlockModel) => b.id));

        // Blocks added
        for (const block of currBlocks) {
            if (prevIds.has(block.id)) { continue; }
            const insertIndex: number = currBlocks.indexOf(block);
            yCell.insert(insertIndex, [this.parent.conversion.blockModelToYElement(block)]);
        }

        // Blocks removed
        for (const block of prevBlocks) {
            if (currIds.has(block.id)) { continue; }

            const yCellChildren: XmlElement[] = yCell.toArray();
            const target: XmlElement = yCellChildren.find(
                (c: Y.XmlElement) => c instanceof this.YRuntime.XmlElement && (c as Y.XmlElement).getAttribute('id') === block.id
            );
            if (target) {
                yCell.delete(yCellChildren.indexOf(target), 1);
            }
        }
    }

    // ============================================================================
    // Inbound: Yjs → local editor
    // ============================================================================

    /**
     * Applies structural table changes originating from remote Yjs updates.
     *
     * @param {Y.XmlEvent} event - The Y event describing changes
     * @param {string} tableBlockId - Local block id for the table
     * @param {BlockManager} blockManager - Block manager instance
     * @param {TableSnapshot | null} snapshot - Pre-transaction snapshot
     * @returns {void} - No return value
     * @hidden
     */
    public applyRemoteTableStructuralChange(
        event: Y.XmlEvent,
        tableBlockId: string,
        blockManager: BlockManager,
        snapshot: TableSnapshot | null
    ): void {
        const yTable: Y.XmlElement = event.target as Y.XmlElement;
        const delta: YjsDelta[] = event.changes.delta;
        if (!delta || delta.length === 0 || !snapshot) { return; }

        // Build a flat pre-transaction ordered list of (id, nodeName) from snapshot
        const preColumnIds: string[] = snapshot.columnIds;
        const preRowIds: string[] = snapshot.rowIds;

        let colDeltaIdx: number = 0;
        let rowDeltaIdx: number = 0;

        for (const op of delta) {
            if (op.retain !== undefined) {
                // Advance both cursors by retain count across mixed children
                // Determine how many are columns vs rows from the snapshot
                const retaining: number = op.retain as number;
                let remaining: number = retaining;
                while (remaining > 0 && colDeltaIdx < preColumnIds.length) {
                    colDeltaIdx++; remaining--;
                }
                while (remaining > 0 && rowDeltaIdx < preRowIds.length) {
                    rowDeltaIdx++; remaining--;
                }
            } else if (op.insert && Array.isArray(op.insert)) {
                for (const yEl of op.insert as Y.XmlElement[]) {
                    if (!(yEl instanceof this.YRuntime.XmlElement)) { continue; }

                    if (yEl.nodeName === 'tableColumn') {
                        const colModel: TableColumnModel = this.reconstructColumnModel(yEl);
                        const colIndex: number = colDeltaIdx;
                        const currYRows: Y.XmlElement[] = this.getYRows(yTable);
                        const columnCells: TableCellModel[] = currYRows.map((yRow: Y.XmlElement) => {
                            const yCells: Y.XmlElement[] = this.getYCells(yRow);
                            const yCell: Y.XmlElement = yCells[colIndex as number];
                            return yCell ? this.reconstructCellModel(yCell) : blockManager.tableService.createTableCell(colModel.id);
                        });

                        blockManager.tableService.addColumnAt({
                            blockId: tableBlockId,
                            colIndex,
                            columnModel: colModel,
                            columnCells,
                            preventTracking: true
                        });
                        colDeltaIdx++;

                    } else if (yEl.nodeName === 'tableRow') {
                        const rowModel: TableRowModel = this.reconstructRowModel(yEl);
                        const rowIndex: number = rowDeltaIdx;
                        blockManager.tableService.addRowAt({
                            blockId: tableBlockId,
                            rowIndex,
                            rowModel,
                            preventTracking: true
                        });
                        rowDeltaIdx++;
                    }
                }
            } else if (op.delete !== undefined) {
                const deleteCount: number = op.delete as number;
                // Determine from snapshot whether these were columns or rows
                for (let i: number = 0; i < deleteCount; i++) {
                    if (colDeltaIdx < preColumnIds.length) {
                        // Deleting a column
                        blockManager.tableService.deleteColumnAt({
                            blockId: tableBlockId,
                            colIndex: colDeltaIdx,
                            preventTracking: true
                        });
                        // Don't advance colDeltaIdx — after deletion, same index points to next col
                    } else {
                        // Deleting a row
                        blockManager.tableService.deleteRowAt({
                            blockId: tableBlockId,
                            modelIndex: rowDeltaIdx,
                            preventTracking: true
                        });
                    }
                }
            }
        }
    }

    /**
     * Applies remote column attribute changes to local DOM and models.
     *
     * @param {Y.XmlEvent} event - The Y event containing attribute changes
     * @param {string} tableBlockId - Local block id for the table
     * @param {BlockManager} blockManager - Block manager instance
     * @returns {void} - No return value
     * @hidden
     */
    public applyRemoteColumnPropertyChange(
        event: Y.XmlEvent,
        tableBlockId: string,
        blockManager: BlockManager
    ): void {
        const yColumn: Y.XmlElement = event.target as Y.XmlElement;
        const colId: string = yColumn.getAttribute('id') as string;
        const blockElement: HTMLElement = blockManager.getBlockElementById(tableBlockId);
        const table: HTMLTableElement = blockElement.querySelector('table.e-table-element') as HTMLTableElement;
        const block: BlockModel = blockManager.editorMethods.getBlock(tableBlockId);
        if (!table || !block || !colId) { return; }

        const props: ITableBlockSettings = block.properties as ITableBlockSettings;
        const colIndex: number = (props.columns).findIndex((c: TableColumnModel) => c.id === colId);
        const changedKeys: Map<string, any> = event.changes.keys;

        changedKeys.forEach((_change: any, key: string) => {
            const newValue: string = yColumn.getAttribute(key) as string;

            if (key === 'width') {
                const colgroup: HTMLTableColElement = table.querySelector('colgroup') as HTMLTableColElement;
                const domColIndex: number = toDomCol(colIndex, props.enableRowNumbers);
                const colEl: HTMLTableColElement = colgroup.children[domColIndex as number] as HTMLTableColElement;
                if (colEl) { colEl.style.width = newValue; }
                props.columns[colIndex as number].width = newValue;

            } else if (key === 'headerText') {
                blockManager.tableService.setHeaderText(table, colIndex, newValue);
            } else if (key === 'type') {
                props.columns[colIndex as number].type = newValue as any;
            }
        });
    }

    /**
     * Applies remote changes to blocks inside a table cell.
     *
     * @param {Y.XmlEvent} event - The Y event for the cell
     * @param {string} tableBlockId - Local block id for the table
     * @param {string} cellId - The id of the affected cell
     * @param {BlockManager} blockManager - Block manager instance
     * @returns {void} - No return value
     * @hidden
     */
    public applyRemoteCellBlockChange(
        event: Y.XmlEvent,
        tableBlockId: string,
        cellId: string,
        blockManager: BlockManager
    ): void {
        const yCell: Y.XmlElement = event.target as Y.XmlElement;
        const block: BlockModel = blockManager.editorMethods.getBlock(tableBlockId);
        const blockElement: HTMLElement = blockManager.getBlockElementById(tableBlockId);
        const table: HTMLTableElement = blockElement.querySelector('table.e-table-element') as HTMLTableElement;
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;

        // Locate the row and column indices for this cell
        let dataRowIndex: number = -1;
        let dataColIndex: number = -1;

        for (let r: number = 0; r < (props.rows).length; r++) {
            const row: TableRowModel = props.rows[r as number];
            for (let c: number = 0; c < (row.cells).length; c++) {
                if (row.cells[c as number].id === cellId) {
                    dataRowIndex = r;
                    dataColIndex = c;
                    break;
                }
            }
            if (dataRowIndex >= 0) { break; }
        }

        // Reconstruct blocks from the current Yjs cell state
        const newBlocks: BlockModel[] = yCell.toArray()
            .filter((c: Y.XmlElement): c is Y.XmlElement => c instanceof this.YRuntime.XmlElement)
            .map((yCellBlock: Y.XmlElement) => BlockFactory.createBlockFromPartial(
                this.parent.conversion.yElementToBlockModel(yCellBlock, cellId)
            ));

        blockManager.tableService.setCellBlocks(table, dataRowIndex, dataColIndex, newBlocks);
    }

    /**
     * Builds a TableColumnModel from a Y column element.
     *
     * @param {Y.XmlElement} yCol - The Y column element
     * @returns {TableColumnModel} - The reconstructed column model
     * @hidden
     */
    public reconstructColumnModel(yCol: Y.XmlElement): TableColumnModel {
        const col: TableColumnModel = {};
        const id: string = yCol.getAttribute('id');
        const type: string = yCol.getAttribute('type');
        const headerText: string = yCol.getAttribute('headerText');
        const width: string = yCol.getAttribute('width');

        if (id) { col.id = id; }
        if (type) { col.type = type as TableColumnType; }
        if (headerText) { col.headerText = headerText; }
        if (width) { col.width = width; }
        return col;
    }

    /**
     * Builds a TableCellModel from a Y cell element.
     *
     * @param {Y.XmlElement} yCell - The Y cell element
     * @returns {TableCellModel} - The reconstructed cell model
     * @hidden
     */
    public reconstructCellModel(yCell: Y.XmlElement): TableCellModel {
        const cell: TableCellModel = {};
        const id: string = yCell.getAttribute('id');
        const columnId: string = yCell.getAttribute('columnId');
        if (id) { cell.id = id; }
        if (columnId) { cell.columnId = columnId; }

        cell.blocks = yCell.toArray()
            .filter((c: Y.XmlElement): c is Y.XmlElement => c instanceof this.YRuntime.XmlElement)
            .map((yCellBlock: Y.XmlElement) => BlockFactory.createBlockFromPartial(
                this.parent.conversion.yElementToBlockModel(yCellBlock, id)
            ));
        return cell;
    }

    /**
     * Builds a TableRowModel from a Y row element.
     *
     * @param {Y.XmlElement} yRow - The Y row element
     * @returns {TableRowModel} - The reconstructed row model
     * @hidden
     */
    public reconstructRowModel(yRow: Y.XmlElement): TableRowModel {
        const row: TableRowModel = {};
        const rowId: string = yRow.getAttribute('id');
        if (rowId) { row.id = rowId; }
        row.cells = this.getYCells(yRow).map((yCell: Y.XmlElement) => this.reconstructCellModel(yCell));
        return row;
    }
}

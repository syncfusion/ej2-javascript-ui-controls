import { closest } from '@syncfusion/ej2-base';
import { getCorrespondingColumns, getCorrespondingIndex, insertColGroupWithSizes } from './../../common/util';

/**
 * Handles table pasting operations within the editor
 *
 * This class provides functionality for pasting table content from one location to another,
 * handling complex scenarios such as:
 * - Merging and splitting cells
 * - Preserving row and column spans
 * - Managing cell content and styles
 * - Preventing overflow when pasting into selected regions
 * - Adjusting table structure to accommodate pasted content
 *
 * @hidden
 * @deprecated
 */
export class TablePasting {
    private allCells: HTMLElement[][] = [];
    private hasCellsUpdated: boolean = false;
    private preventOverflowCells: boolean = false;

    /**
     * Handles pasting a table into the target table at the specified cell
     *
     * This method processes the inserted table and integrates it into the target location,
     * handling cell merging, content preservation, and structural adjustments.
     * When multiple cells are selected, it ensures proper distribution of content.
     *
     * @param {HTMLTableElement} insertedTable - The table being pasted
     * @param {NodeListOf<Element>} targetCells - Collection of cells where the paste operation targets
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public handleTablePaste(insertedTable: HTMLTableElement, targetCells: NodeListOf<Element>): void {
        if (!insertedTable || !targetCells || targetCells.length < 1) {
            return;
        }

        this.hasCellsUpdated = false;
        const targetCell: HTMLTableCellElement = targetCells[0] as HTMLTableCellElement;
        this.preventOverflowCells = targetCells.length > 1;

        const targetTable: HTMLTableElement | null = this.getClosestTable(targetCell);
        if (!targetTable) {
            return;
        }

        const pastedRows: HTMLTableRowElement[] = this.getTableRows(insertedTable);
        const startRowIndex: number = this.getRowIndex(targetCell);

        // Fix missing cells in existing rows
        this.allCells = getCorrespondingColumns(targetTable);
        const startCellIndex: number = this.getCellIndex(targetCell, startRowIndex);
        const pastedTableAllCells: HTMLElement[][] = getCorrespondingColumns(insertedTable);

        this.pasteMultipleRows(targetTable, pastedRows, startRowIndex, startCellIndex, pastedTableAllCells);

        if (this.hasCellsUpdated) {
            insertColGroupWithSizes(targetTable, true);
        }
    }

    /* Gets the closest parent table of the given cell */
    private getClosestTable(cell: HTMLTableCellElement): HTMLTableElement | null {
        return closest(cell, 'table') as HTMLTableElement;
    }

    /* Gets all table rows from the given table */
    private getTableRows(table: HTMLTableElement): HTMLTableRowElement[] {
        const rows: HTMLTableRowElement[] = [];
        const totalRows: number = table.rows.length;
        for (let i: number = 0; i < totalRows; i++) {
            const row: HTMLTableRowElement | null = table.rows.item(i);
            if (row !== null) {
                rows.push(row);
            }
        }
        return rows;
    }

    /* Gets the row index of a cell */
    private getRowIndex(cell: HTMLTableCellElement): number {
        const row: HTMLTableRowElement | null = cell.parentElement as HTMLTableRowElement;
        return row !== null ? row.rowIndex : 0;
    }

    /* Gets the cell index of a cell */
    private getCellIndex(selectedCell: HTMLTableCellElement,
                         startRowIndex: number = 0): number {
        for (let rowIndex: number = startRowIndex; rowIndex < this.allCells.length; rowIndex++) {
            const row: HTMLElement[] = this.allCells[rowIndex as number];

            for (let colIndex: number = 0; colIndex < row.length; colIndex++) {
                if (this.allCells[rowIndex as number][colIndex as number] === selectedCell) {
                    return colIndex;
                }
            }
        }

        return selectedCell.cellIndex >= 0 ? selectedCell.cellIndex : 0;
    }

    /* Pastes multiple rows into the target table, creating rows/columns if needed */
    private pasteMultipleRows(targetTable: HTMLTableElement, pastedRows: HTMLTableRowElement[],
                              startRowIndex: number, startCellIndex: number, pastedTableAllCells: HTMLElement[][]): void {
        for (let i: number = 0; i < pastedRows.length; i++) {
            const pastedRow: HTMLTableRowElement = pastedRows[i as number];
            this.pasteRowContent(targetTable, pastedRow, startCellIndex, startRowIndex, pastedTableAllCells);
        }
    }

    /* Ensures the row has at least the required number of cells */
    private ensureCellCount(row: HTMLTableRowElement, requiredCellCount: number, presentCellCount: number): void {
        if (presentCellCount < requiredCellCount) {
            this.hasCellsUpdated = true;
            while (presentCellCount < requiredCellCount) {
                const newCell: HTMLTableCellElement = row.insertCell();
                newCell.innerHTML = '<br>';
                presentCellCount++;
            }
        }
    }

    /* Gets or creates a row at the given index */
    private getOrCreateRow(table: HTMLTableElement, rowIndex: number): HTMLTableRowElement | null {
        if (rowIndex < table.rows.length) {
            return table.rows.item(rowIndex) as HTMLTableRowElement;
        }

        if (!this.preventOverflowCells) {
            const newRow: HTMLTableRowElement = table.insertRow();
            this.fillRowWithEmptyCells(newRow, this.getMaxColumnCount(table.rows[0].cells));
            this.allCells = getCorrespondingColumns(table);
            return newRow;
        }

        return null;
    }

    /* Fills a row with empty cells to match a given column count */
    private fillRowWithEmptyCells(row: HTMLTableRowElement, columnCount: number): void {
        for (let i: number = 0; i < columnCount; i++) {
            const newCell: HTMLTableCellElement = row.insertCell();
            newCell.innerHTML = '<br>';
        }
    }

    /* Returns the maximum number of columns in the table */
    private getMaxColumnCount(cellColl: HTMLCollectionOf<HTMLTableDataCellElement> | HTMLTableCellElement[]): number {
        let cellCount: number = 0;
        for (let cell: number = 0; cell < cellColl.length; cell++) {
            cellCount += cellColl[cell as number].colSpan;
        }
        return cellCount;
    }

    /* Pastes the content from the pasted row into the target row starting from a specific cell */
    private pasteRowContent(targetTable: HTMLTableElement,
                            pastedRow: HTMLTableRowElement, startCellIndex: number,
                            startRowIndex: number, pastedTableAllCells: HTMLElement[][]): void {
        const pastedCells: HTMLTableCellElement[] = this.getRowCells(pastedRow);
        this.allCells = getCorrespondingColumns(targetTable);

        if (!this.preventOverflowCells) {
            this.ensureTargetTableCapacity(targetTable, startCellIndex, pastedTableAllCells);
        }

        for (let i: number = 0; i < pastedCells.length; i++) {
            const pastedCell: HTMLTableCellElement = pastedCells[i as number];
            this.allCells = getCorrespondingColumns(targetTable);

            const cellIndex: number[] = getCorrespondingIndex(pastedCell, pastedTableAllCells);
            const currentTargetRowIndex: number = startRowIndex + cellIndex[0];
            const colIndex: number = startCellIndex + cellIndex[1];

            if (this.preventOverflowCells) {
                this.adjustCellSpans(pastedCell, currentTargetRowIndex, colIndex, targetTable);
            }

            const targetRow: HTMLTableRowElement = this.getOrCreateRow(targetTable, currentTargetRowIndex);
            if (!targetRow) {
                continue;
            }

            const targetCell: HTMLTableCellElement =
                this.allCells[currentTargetRowIndex as number][colIndex as number] as HTMLTableCellElement;

            if (!targetCell || this.shouldSkipCell(targetCell)) {
                continue;
            }

            this.copyCellAttributes(targetCell, pastedCell, currentTargetRowIndex, colIndex, targetTable, targetRow);
        }
    }

    /*
     * Adjusts rowspan and colspan attributes of a cell to prevent overflow
     */
    private adjustCellSpans(cell: HTMLTableCellElement, rowIndex: number, colIndex: number, targetTable: HTMLTableElement): void {
        const rowSpan: number = parseInt(cell.getAttribute('rowspan') || '1', 10);
        const colSpan: number = parseInt(cell.getAttribute('colspan') || '1', 10);

        // Adjust rowspan if needed
        if (rowSpan > 1) {
            const adjustedRowSpan: number = this.calculateAdjustedRowSpan(cell, rowIndex, colIndex, rowSpan, targetTable);
            cell.setAttribute('rowspan', adjustedRowSpan.toString());
        }

        // Adjust colspan if needed
        if (colSpan > 1) {
            const adjustedColSpan: number = this.calculateAdjustedColSpan(rowIndex, colIndex, colSpan);
            cell.setAttribute('colspan', adjustedColSpan.toString());
        }
    }

    /*
     * Calculates the adjusted rowspan value based on available target cells
     */
    private calculateAdjustedRowSpan(
        cell: HTMLTableCellElement,
        rowIndex: number,
        colIndex: number,
        originalRowSpan: number,
        targetTable: HTMLTableElement
    ): number {
        let adjustedRowSpan: number = originalRowSpan;

        for (let offset: number = 1; offset < originalRowSpan; offset++) {
            const targetRowIndex: number = rowIndex + offset;
            const targetRow: HTMLTableRowElement =
                this.getOrCreateRow(targetTable, targetRowIndex);

            if (!targetRow) {
                --adjustedRowSpan;
            } else {
                const nextTargetCell: HTMLTableCellElement =
                    this.allCells[targetRowIndex as number][colIndex as number] as HTMLTableCellElement;
                if (!nextTargetCell || this.shouldSkipCell(nextTargetCell)) {
                    --adjustedRowSpan;
                }
            }
        }

        const rowSpanDifference: number = originalRowSpan - adjustedRowSpan;
        if (rowSpanDifference > 0) {
            this.adjustCellHeights(cell, null, adjustedRowSpan, rowSpanDifference);
        }

        return adjustedRowSpan;
    }

    /*
     * Calculates the adjusted colspan value based on available target cells
     */
    private calculateAdjustedColSpan(rowIndex: number, colIndex: number, originalColSpan: number): number {
        let adjustedColSpan: number = originalColSpan;

        for (let colOffset: number = 0; colOffset < originalColSpan; colOffset++) {
            const columnIndex: number = colIndex + colOffset;
            const nextTargetCell: HTMLTableCellElement = this.allCells[rowIndex as number][columnIndex as number] as HTMLTableCellElement;

            if (!nextTargetCell || this.shouldSkipCell(nextTargetCell)) {
                --adjustedColSpan;
            }
        }

        return adjustedColSpan;
    }

    /*
     * Ensures the target table has enough cells to accommodate the pasted content
     */
    private ensureTargetTableCapacity(
        table: HTMLTableElement,
        startCellIndex: number,
        pastedCells: HTMLElement[][]
    ): void {
        if (!pastedCells[0]) {
            return;
        }
        for (let i: number = 0; i < table.rows.length; i++) {
            const row: HTMLTableRowElement = table.rows[i as number];
            const presentCellCount: number = this.allCells[i as number].length;
            const requiredCellCount: number = startCellIndex + pastedCells[0].length;

            this.ensureCellCount(row, requiredCellCount, presentCellCount);
        }
    }

    /*
     * Determines if a cell should be skipped during paste operation
     */
    private shouldSkipCell(cell: HTMLTableCellElement): boolean {
        return this.preventOverflowCells &&
            !(cell.classList.contains('e-cell-select') &&
                cell.classList.contains('e-multi-cells-select'));
    }

    /* Gets all cells from a row */
    private getRowCells(row: HTMLTableRowElement): HTMLTableCellElement[] {
        const cells: HTMLTableCellElement[] = [];
        const totalCells: number = row.cells.length;
        for (let i: number = 0; i < totalCells; i++) {
            const cell: HTMLTableCellElement | null = row.cells.item(i);
            if (cell !== null) {
                cells.push(cell);
            }
        }
        return cells;
    }

    /*
     * Copies the attributes and styles from a source table cell to a target cell,
     * handling both rowspan and colspan, and updating the table structure accordingly.
     */
    private copyCellAttributes(
        targetCell: HTMLTableCellElement,
        sourceCell: HTMLTableCellElement,
        rowIndex: number,
        targetCellIndex: number,
        targetTable: HTMLTableElement,
        targetRow: HTMLTableRowElement
    ): void {
        if (!sourceCell) {
            return;
        }

        // Handle cell insertion location
        targetCell = this.handleCellInsertLocation(targetCell, targetRow, rowIndex, targetCellIndex);

        // Handle parent element mismatch
        targetCell = this.handleInsertRowMismatch(targetCell, targetRow, rowIndex, targetCellIndex, targetTable);

        // Get span attributes
        const spanAttributes: CellSpanAttributes = this.getCellSpanAttributes(targetCell, sourceCell);

        // Handle colspan changes
        targetCell = this.handleColspanChanges(
            targetCell,
            spanAttributes.oldColSpan,
            spanAttributes.newColSpan,
            rowIndex,
            targetCellIndex,
            targetRow,
            targetTable
        );

        // Handle rowspan changes
        targetCell = this.handleRowspanChanges(
            targetCell,
            spanAttributes.oldRowSpan,
            spanAttributes.newRowSpan,
            rowIndex,
            targetCellIndex,
            targetTable,
            spanAttributes.newColSpan
        );

        // Apply content and styles
        targetCell.innerHTML = sourceCell.innerHTML;
        targetCell.style.cssText = sourceCell.style.cssText;
    }

    /*
     * Gets span attributes from cells
     */
    private getCellSpanAttributes(targetCell: HTMLTableCellElement, sourceCell: HTMLTableCellElement): CellSpanAttributes {
        return {
            oldRowSpan: parseInt(targetCell.getAttribute('rowspan') || '1', 10),
            oldColSpan: parseInt(targetCell.getAttribute('colspan') || '1', 10),
            newRowSpan: parseInt(sourceCell.getAttribute('rowspan') || '1', 10),
            newColSpan: parseInt(sourceCell.getAttribute('colspan') || '1', 10)
        };
    }

    /*
     * Handles cell insertion location adjustments
     */
    private handleCellInsertLocation(
        targetCell: HTMLTableCellElement,
        targetRow: HTMLTableRowElement,
        rowIndex: number,
        targetCellIndex: number
    ): HTMLTableCellElement {
        const cellInsertLocation: number = this.getInsertionColIndex(targetCellIndex, targetRow, rowIndex);

        if (cellInsertLocation < targetCellIndex) {
            const currentColSpan: number = parseInt(targetCell.getAttribute('colspan') || '1', 10);
            const newColSpan: number = currentColSpan - (targetCellIndex - cellInsertLocation);

            if (newColSpan > 0) {
                const insertAt: number = cellInsertLocation + 1;
                const newCell: HTMLTableCellElement = targetRow.insertCell(insertAt);
                newCell.innerHTML = '<br>'; // fill with empty
                newCell.style.cssText = targetCell.style.cssText;
                newCell.className = targetCell.className;
                targetCell.setAttribute('colspan', (currentColSpan - newColSpan).toString());
                this.allCells[rowIndex as number][targetCellIndex as number] = newCell;
                newCell.setAttribute('colspan', newColSpan.toString());

                if (targetCell.hasAttribute('rowspan')) {
                    newCell.setAttribute('rowspan', targetCell.getAttribute('rowspan'));
                }

                return newCell;
            }
        }

        return targetCell;
    }

    /*
     * Handles parent element mismatch between cell and row
     */
    private handleInsertRowMismatch(
        targetCell: HTMLTableCellElement,
        targetRow: HTMLTableRowElement,
        rowIndex: number,
        targetCellIndex: number,
        targetTable: HTMLTableElement
    ): HTMLTableCellElement {
        if (targetCell.parentElement !== targetRow) {
            const rowSpan: number = parseInt(targetCell.getAttribute('rowspan') || '1', 10);
            const targetRowIndex: number = this.getRowIndex(targetCell);
            const remainingRowSpan: number = rowSpan - (rowIndex - targetRowIndex);
            const newRowSpan: number = rowSpan - remainingRowSpan;

            if (rowSpan > 1) {
                this.removeRowspanAttributes(targetTable, rowIndex, targetCellIndex);
                const newCell: HTMLTableCellElement = this.allCells[rowIndex as number][targetCellIndex as number] as HTMLTableCellElement;
                newCell.innerHTML = targetCell.innerHTML;
                newCell.style.cssText = targetCell.style.cssText;
                newCell.className = targetCell.className;

                if (targetCell.hasAttribute('colspan')) {
                    newCell.setAttribute('colspan', targetCell.getAttribute('colspan'));
                }

                if (remainingRowSpan === 1) {
                    newCell.removeAttribute('rowspan');
                } else {
                    newCell.setAttribute('rowspan', remainingRowSpan.toString());
                }

                if (newRowSpan > 1) {
                    targetCell.setAttribute('rowspan', newRowSpan.toString());
                } else {
                    targetCell.removeAttribute('rowspan');
                }

                this.adjustCellHeights(targetCell, newCell, newRowSpan, remainingRowSpan);
                return newCell;
            }
        }

        return targetCell;
    }

    /*
     * Adjusts cell heights based on rowspan distribution
     */
    private adjustCellHeights(
        targetCell: HTMLTableCellElement,
        newCell: HTMLTableCellElement,
        newRowSpan: number,
        remainingRowSpan: number
    ): void {
        if (targetCell.style.height) {
            const heightStr: string = targetCell.style.height;
            const heightValue: number = parseFloat(heightStr);

            // Check if we got a valid number
            if (!isNaN(heightValue) && heightValue > 0) {
                const totalRowSpan: number = newRowSpan + remainingRowSpan;
                const height: number = heightValue / totalRowSpan;

                targetCell.style.height = (newRowSpan * height) + 'px';
                if (newCell) {
                    newCell.style.height = (remainingRowSpan * height) + 'px';
                }
            }
        }
    }

    /*
     * Handles rowspan changes between old and new values
     */
    private handleRowspanChanges(
        targetCell: HTMLTableCellElement,
        oldRowSpan: number,
        newRowSpan: number,
        rowIndex: number,
        targetCellIndex: number,
        targetTable: HTMLTableElement,
        newColSpan: number
    ): HTMLTableCellElement {
        // Decrease rowspan to 1
        if (oldRowSpan > 1 && newRowSpan <= 1) {
            const remainingRowSpan: number = oldRowSpan - newRowSpan;
            const nextRowIndex: number = rowIndex + 1;

            this.removeRowspanAttributes(targetTable, nextRowIndex, targetCellIndex);
            const newCell: HTMLTableCellElement = this.allCells[nextRowIndex as number][targetCellIndex as number] as HTMLTableCellElement;
            newCell.innerHTML = targetCell.innerHTML;
            newCell.style.cssText = targetCell.style.cssText;
            newCell.className = targetCell.className;

            if (targetCell.hasAttribute('colspan')) {
                newCell.setAttribute('colspan', targetCell.getAttribute('colspan'));
            }

            if (remainingRowSpan === 1) {
                newCell.removeAttribute('rowspan');
            } else {
                newCell.setAttribute('rowspan', remainingRowSpan.toString());
            }

            targetCell.removeAttribute('rowspan');
            this.adjustCellHeights(targetCell, newCell, newRowSpan, remainingRowSpan);
        }
        // Both have rowspan > 1
        else if (oldRowSpan > 1 && newRowSpan > 1) {
            const delta: number = newRowSpan - oldRowSpan;

            if (delta > 0) { // Increase rowspan
                this.applyRowspanAttributes(targetTable, rowIndex, targetCellIndex, newRowSpan, newColSpan);
                targetCell.setAttribute('rowspan', newRowSpan.toString());
            } else if (delta < 0) { // Decrease rowspan
                const nextRowIndex: number = rowIndex + newRowSpan;

                this.removeRowspanAttributes(targetTable, nextRowIndex, targetCellIndex);
                const newCell: HTMLTableCellElement =
                    this.allCells[nextRowIndex as number][targetCellIndex as number] as HTMLTableCellElement;
                newCell.innerHTML = targetCell.innerHTML;
                newCell.style.cssText = targetCell.style.cssText;
                newCell.className = targetCell.className;

                if (targetCell.hasAttribute('colspan')) {
                    newCell.setAttribute('colspan', targetCell.getAttribute('colspan'));
                }

                if (-delta === 1) {
                    newCell.removeAttribute('rowspan');
                } else {
                    newCell.setAttribute('rowspan', (-delta).toString());
                }

                targetCell.setAttribute('rowspan', newRowSpan.toString());
                this.adjustCellHeights(targetCell, newCell, newRowSpan, -delta);
            }
        }
        // Increase rowspan from 1
        else if (newRowSpan > 1 && oldRowSpan <= 1) {
            this.applyRowspanAttributes(targetTable, rowIndex, targetCellIndex, newRowSpan, newColSpan);
            targetCell.setAttribute('rowspan', newRowSpan.toString());
        }

        return targetCell;
    }

    /*
     * Handles colspan changes between old and new values
     */
    private handleColspanChanges(
        targetCell: HTMLTableCellElement,
        oldColSpan: number,
        newColSpan: number,
        rowIndex: number,
        targetCellIndex: number,
        targetRow: HTMLTableRowElement,
        targetTable: HTMLTableElement
    ): HTMLTableCellElement {
        // Decrease colspan to 1
        if (oldColSpan > 1 && newColSpan <= 1) {
            const targetNewCellSpan: number = oldColSpan - newColSpan;

            this.insertFollowingSiblings(targetRow, targetCellIndex, rowIndex, newColSpan);

            if (targetNewCellSpan === 1) {
                targetCell.removeAttribute('colspan');
            } else {
                targetCell.setAttribute('colspan', targetNewCellSpan.toString());
            }

            targetCell.innerHTML = '';
            const newCell: HTMLTableCellElement = this.allCells[rowIndex as number][targetCellIndex as number] as HTMLTableCellElement;
            newCell.className = targetCell.className;
            targetCell = newCell;
        }
        // Increase colspan from 1
        else if (newColSpan > 1 && oldColSpan <= 1) {
            const deleteCellCount: number = newColSpan - oldColSpan;

            if (deleteCellCount > 0) {
                this.removeFollowingSiblings(this.allCells[rowIndex as number], targetCellIndex + oldColSpan,
                                             deleteCellCount, targetTable, targetRow, rowIndex);
                targetCell.setAttribute('colspan', newColSpan.toString());
            }
        }
        // Both have colspan > 1
        else if (newColSpan > 1 && oldColSpan > 1) {
            const colSpanDiff: number = newColSpan - oldColSpan;

            if (colSpanDiff > 0) { // Increase colspan
                this.removeFollowingSiblings(this.allCells[rowIndex as number], targetCellIndex + oldColSpan, colSpanDiff,
                                             targetTable, targetRow, rowIndex);
                targetCell.setAttribute('colspan', newColSpan.toString());
            } else if (colSpanDiff < 0) { // Decrease colspan
                this.insertFollowingSiblings(targetRow, targetCellIndex, rowIndex, 1);
                targetCell.setAttribute('colspan', (-colSpanDiff).toString());
                targetCell.innerHTML = '';
                const newCell: HTMLTableCellElement = this.allCells[rowIndex as number][targetCellIndex as number] as HTMLTableCellElement;
                newCell.className = targetCell.className;
                targetCell = newCell;
                targetCell.setAttribute('colspan', newColSpan.toString());
            }
        }

        return targetCell;
    }

    /* Applies rowspan logic by removing redundant cells and tracking rowspan spans */
    private applyRowspanAttributes(
        targetTable: HTMLTableElement,
        baseRowIndex: number,
        startCellIndex: number,
        rowSpan: number,
        colSpan: number
    ): void {
        for (let offset: number = 1; offset < rowSpan; offset++) {
            const targetRowIndex: number = baseRowIndex + offset;

            for (let colOffset: number = 0; colOffset < colSpan; colOffset++) {
                const columnIndex: number = startCellIndex + colOffset;
                this.processRowspanCell(targetTable, targetRowIndex, columnIndex);
            }
        }
    }

    /* Processes a single cell for rowspan application */
    private processRowspanCell(
        targetTable: HTMLTableElement,
        targetRowIndex: number,
        columnIndex: number
    ): void {
        const targetRow: HTMLTableRowElement = this.getOrCreateRow(targetTable, targetRowIndex);
        const cellToRemove: HTMLElement = this.allCells[targetRowIndex as number][columnIndex as number];
        const index: number = Array.prototype.indexOf.call(targetRow.cells, cellToRemove);

        if (!cellToRemove || !cellToRemove.parentElement || index === -1) {
            return;
        }

        const currentColSpan: number = parseInt(cellToRemove.getAttribute('colspan') || '1', 10);
        const currentRowSpan: number = parseInt(cellToRemove.getAttribute('rowspan') || '1', 10);
        const shouldRemoveCompletely: boolean = currentColSpan <= 1 && currentRowSpan <= 1;

        if (!shouldRemoveCompletely) {
            this.handleComplexCellRemoval(targetTable, targetRow, cellToRemove, targetRowIndex,
                                          columnIndex, currentColSpan, currentRowSpan);
        }

        targetRow.removeChild(cellToRemove);
        this.allCells[targetRowIndex as number][columnIndex as number] = null;
    }

    /* Handles removal of cells with colspan or rowspan */
    private handleComplexCellRemoval(
        targetTable: HTMLTableElement,
        targetRow: HTMLTableRowElement,
        cellToRemove: HTMLElement,
        targetRowIndex: number,
        columnIndex: number,
        currentColSpan: number,
        currentRowSpan: number
    ): void {
        if (currentColSpan > 1) {
            this.handleColspanCellRemoval(targetRow, cellToRemove, targetRowIndex, columnIndex, currentColSpan);
        }

        if (currentRowSpan > 1) {
            this.handleRowspanCellRemoval(targetTable, cellToRemove, targetRowIndex, columnIndex, currentRowSpan);
        }
    }

    /* Handles removal of a cell with colspan */
    private handleColspanCellRemoval(
        targetRow: HTMLTableRowElement,
        cellToRemove: HTMLElement,
        targetRowIndex: number,
        columnIndex: number,
        currentColSpan: number
    ): void {
        this.insertFollowingSiblings(targetRow, columnIndex, targetRowIndex, 1);
        const newColSpan: number = currentColSpan - 1;
        const newCell: HTMLTableCellElement = this.allCells[targetRowIndex as number][columnIndex as number] as HTMLTableCellElement;

        newCell.innerHTML = '<br>';
        newCell.style.cssText = cellToRemove.style.cssText;
        newCell.className = cellToRemove.className;

        if (newColSpan === 1) {
            newCell.removeAttribute('colspan');
        } else {
            newCell.setAttribute('colspan', newColSpan.toString());
        }
    }

    /* Handles removal of a cell with rowspan */
    private handleRowspanCellRemoval(
        targetTable: HTMLTableElement,
        cellToRemove: HTMLElement,
        targetRowIndex: number,
        columnIndex: number,
        currentRowSpan: number
    ): void {
        this.removeRowspanAttributes(targetTable, targetRowIndex + 1, columnIndex);
        const newCell: HTMLTableCellElement = this.allCells[targetRowIndex + 1][columnIndex as number] as HTMLTableCellElement;
        const newRowSpan: number = currentRowSpan - 1;

        newCell.innerHTML = cellToRemove.innerHTML;
        newCell.style.cssText = cellToRemove.style.cssText;
        newCell.className = cellToRemove.className;

        if (newRowSpan === 1) {
            newCell.removeAttribute('rowspan');
        } else {
            newCell.setAttribute('rowspan', newRowSpan.toString());
        }
        this.adjustCellHeights(cellToRemove as HTMLTableCellElement, newCell, currentRowSpan, newRowSpan);
    }

    /* Removes rowspan logic by adding cells to rows that were previously spanned */
    private removeRowspanAttributes(
        targetTable: HTMLTableElement,
        nextRowIndex: number,
        targetCellIndex: number
    ): void {
        const nextRow: HTMLTableRowElement = this.getOrCreateRow(targetTable, nextRowIndex);
        const insertionColIndex: number = this.getInsertionColIndex(targetCellIndex, nextRow, nextRowIndex);
        const newCell: HTMLTableCellElement = nextRow.insertCell(insertionColIndex);
        this.allCells[nextRowIndex as number][targetCellIndex as number] = newCell;
    }

    /* Retrieves or creates a row at the specified index in the table */
    private getInsertionColIndex(targetCellIndex: number, nextRow: HTMLTableRowElement, rowIndex: number): number {

        // Handle empty rows
        if (!nextRow || nextRow.cells.length === 0) {
            return 0;
        }

        let insertionColIndex: number = targetCellIndex;
        const rowCells: HTMLElement[] = this.allCells[rowIndex as number] || [];

        // Try to find a matching cell by incrementing the index
        insertionColIndex = this.findMatchingCellIndex(rowCells, nextRow, insertionColIndex, true);

        const visualStartIndex: number = rowCells.indexOf(nextRow.cells[0]);

        // If no match found or index out of bounds, try decrementing approach
        if (rowCells.length <= insertionColIndex ||
                (nextRow.cells.length <= targetCellIndex && visualStartIndex !== -1 && visualStartIndex < insertionColIndex)) {
            insertionColIndex = targetCellIndex;
            insertionColIndex = this.findMatchingCellIndex(rowCells, nextRow, insertionColIndex, false);
        }

        // Get the actual cell index if a cell was found
        if (rowCells[insertionColIndex as number]) {
            const cell: HTMLTableCellElement = rowCells[insertionColIndex as number] as HTMLTableCellElement;
            insertionColIndex = cell.cellIndex;

            // Adjust index for cases where target exceeds available cells
            if (nextRow.cells.length <= targetCellIndex && visualStartIndex !== -1 && targetCellIndex > visualStartIndex) {
                insertionColIndex++;
            }
        } else {
            // Fallback to the original target index
            insertionColIndex = targetCellIndex;
        }

        return insertionColIndex;
    }

    /*
     * Finds a matching cell index by incrementing or decrementing from the starting index
     */
    private findMatchingCellIndex(
        rowCells: HTMLElement[],
        nextRow: HTMLTableRowElement,
        startIndex: number,
        increment: boolean
    ): number {
        let index: number = startIndex;

        while (
            rowCells &&
            index >= 0 &&
            rowCells[index as number] &&
            nextRow &&
            Array.prototype.indexOf.call(nextRow.cells, rowCells[index as number]) === -1
        ) {
            index = increment ? index + 1 : index - 1;
        }

        return index;
    }

    /* Removes (colSpan - 1) cells following the given cell index in a row */
    private removeFollowingSiblings(
        row: HTMLElement[],
        deleteCellIndex: number,
        colSpan: number,
        targetTable: HTMLTableElement,
        targetRow: HTMLTableRowElement,
        targetRowIndex: number
    ): void {
        for (let offset: number = 0; offset < colSpan; offset++) {
            const cellToRemove: HTMLElement = row[deleteCellIndex as number];
            if (cellToRemove && cellToRemove.parentElement) {
                const currentColSpan: number = parseInt(cellToRemove.getAttribute('colspan') || '1', 10);
                const currentRowSpan: number = parseInt(cellToRemove.getAttribute('rowspan') || '1', 10);
                const shouldRemoveCompletely: boolean = currentColSpan <= 1 && currentRowSpan <= 1;
                if (!shouldRemoveCompletely) {
                    this.handleComplexCellRemoval(targetTable, targetRow, cellToRemove, targetRowIndex,
                                                  deleteCellIndex, currentColSpan, currentRowSpan);
                }
                cellToRemove.parentElement.removeChild(cellToRemove);
                row[deleteCellIndex as number] = null;
            }
        }
    }

    private insertFollowingSiblings(
        row: HTMLTableRowElement,
        startCellIndex: number,
        rowIndex: number,
        oldColSpan: number
    ): void {
        const cellInsertLocation: number = this.getInsertionColIndex(startCellIndex, row, rowIndex);
        for (let offset: number = 0; offset < oldColSpan; offset++) {
            const newCell: HTMLTableCellElement = row.insertCell(cellInsertLocation);
            newCell.innerHTML = '<br>'; // fill with empty
            this.allCells[rowIndex as number][startCellIndex as number] = newCell;
        }
    }

    /**
     * Retrieves a valid table element from the pasted content if it exists and is valid
     *
     * This method examines the pasted content to find a table element. It handles three scenarios:
     * 1. The inserted node is already a table
     * 2. The inserted node contains a table that needs to be extracted
     * 3. The inserted node contains a table with wrapper elements that should be preserved
     *
     * If the content is not a valid table or a valid wrapper around a table, returns null.
     *
     * @param {HTMLElement} insertedNode - The node that was pasted into the editor
     * @returns {HTMLElement | null} - The valid table element or wrapper, or null if no valid table found
     * @hidden
     * @deprecated
     */
    public getValidTableFromPaste(insertedNode: HTMLElement): HTMLElement | null {
        if (insertedNode.nodeName.toLowerCase() === 'table') {
            return insertedNode;
        }
        const tableElement: HTMLElement = insertedNode.querySelector('table');
        if (!tableElement) {
            return null;
        }
        return this.getWrapperNodeForTable(insertedNode, tableElement);
    }

    /*
    * Retrieves the wrapper node around the table if it is valid (only the table inside a single wrapper element).
    * If the wrapper is invalid or contains extra elements, returns null.
    */
    private getWrapperNodeForTable(container: HTMLElement, tableElement: Element): HTMLElement | null {
        let currentNode: Node = container;
        while (currentNode !== tableElement) {
            const nonCommentChildren: Node[] = Array.from(currentNode.childNodes)
                .filter((node: Node) => node.nodeType !== Node.COMMENT_NODE &&
                            !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === ''));
            if (nonCommentChildren.length !== 1) {
                return null;
            }
            currentNode = nonCommentChildren[0];
        }
        return currentNode as HTMLElement;
    }
}

/**
 * Represents the span attributes of a table cell before and after modification
 *
 * This interface tracks changes to rowspan and colspan values during table operations
 * to facilitate proper cell merging and splitting.
 *
 * @hidden
 */
interface CellSpanAttributes {
    oldRowSpan: number;
    oldColSpan: number;
    newRowSpan: number;
    newColSpan: number;
}

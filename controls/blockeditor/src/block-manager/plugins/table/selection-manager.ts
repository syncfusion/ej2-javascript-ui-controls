import { BlockManager } from '../../base/block-manager';
import { ITableBlockSettings, BlockModel, TableCellModel, TableRowModel } from '../../../models/index';
import * as constants from '../../../common/constant';
import { events } from '../../../common/constant';
import { findCellById, getAdjacentBlock, getAdjacentCell, getBlockContentElement, getBlockModelById, getDataCell, getDeepestTextNode, getNormalizedKey, getSelectedRange, isAtEndOfBlock, isAtStartOfBlock, setCursorPosition, toDomCol } from '../../../common/utils/index';

export class TableSelectionManager {
    private parent: BlockManager;

    // rectangle selection anchors
    private multiselectStartRow: number | null = null;
    private multiselectEndRow: number | null = null;
    private multiselectStartCol: number | null = null;
    private multiselectEndCol: number | null = null;

    constructor(parent: BlockManager) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on('keydown', this.handleKeyDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off('keydown', this.handleKeyDown);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    public attachTableEvents(table: HTMLTableElement, blockElement: HTMLElement): void {
        let isMouseSelecting: boolean = false;
        let dragStartCell: HTMLTableCellElement | null = null;
        let selectionRectActive: boolean = false;

        const onMouseDown: (e: MouseEvent) => void = (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const cell: HTMLTableCellElement = target.closest('td, th') as HTMLTableCellElement;
            if (!cell || cell.classList.contains('e-row-number')) { return; }
            isMouseSelecting = true;
            dragStartCell = cell;
            selectionRectActive = false;

            const startRow: number = parseInt(cell.dataset.row, 10);
            const startCol: number = parseInt(cell.dataset.col, 10);
            this.multiselectStartRow = startRow;
            this.multiselectStartCol = startCol;
            this.multiselectEndRow = startRow;
            this.multiselectEndCol = startCol;
        };

        const onMouseMove: (e: MouseEvent) => void = (e: MouseEvent) => {
            if (!isMouseSelecting) { return; }
            const target: HTMLElement = e.target as HTMLElement;
            const cell: HTMLTableCellElement = target.closest('td, th') as HTMLTableCellElement;
            if (!cell || cell.classList.contains('e-row-number')) { return; }

            if (!selectionRectActive && dragStartCell && cell !== dragStartCell) {
                selectionRectActive = true;
                (blockElement as HTMLElement).style.userSelect = 'none';
                (table as HTMLElement).style.userSelect = 'none';
            }
            if (!selectionRectActive) { return; }

            const endRow: number = parseInt(cell.dataset.row, 10);
            const endCol: number = parseInt(cell.dataset.col, 10);
            this.updateRectangleFocus(this.multiselectStartRow, this.multiselectStartCol, endRow, endCol, table);
            this.multiselectEndRow = endRow;
            this.multiselectEndCol = endCol;

            // Clear any native selection range while dragging across cells
            this.clearRangeAndSetCursor(table);

            e.preventDefault();
            e.stopPropagation();
        };

        const onMouseUp: () => void = () => {
            isMouseSelecting = false;
            dragStartCell = null;
            selectionRectActive = false;
            this.multiselectStartRow = null;
            this.multiselectStartCol = null;
            this.multiselectEndRow = null;
            this.multiselectEndCol = null;
            (blockElement as HTMLElement).style.userSelect = '';
            (table as HTMLElement).style.userSelect = '';
        };

        table.addEventListener('mousedown', onMouseDown);
        table.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    public getAllCellBlocks(tableBlock: HTMLElement): BlockModel[] {
        const tableBlockModel: BlockModel = getBlockModelById(tableBlock.id, this.parent.getEditorBlocks());
        const allBlocks: BlockModel[] = [];

        (tableBlockModel.properties as ITableBlockSettings).rows.forEach((row: TableRowModel) => {
            row.cells.forEach((cell: TableCellModel) => {
                allBlocks.push(...cell.blocks);
            });
        });

        return allBlocks;
    }

    public getSelectedCells(tableBlock: HTMLElement): NodeListOf<HTMLTableCellElement> {
        const table: HTMLTableElement = tableBlock.querySelector('table') as HTMLTableElement;
        // 1. Whole row selection
        if (table.querySelector('tr.e-row-selected')) {
            return table.querySelectorAll('tr.e-row-selected td:not(.e-row-number)') as NodeListOf<HTMLTableCellElement>;
        }

        // 2. Whole column selection
        if (table.querySelector('td.e-col-selected')) {
            return table.querySelectorAll('td.e-col-selected, th.e-col-selected') as NodeListOf<HTMLTableCellElement>;
        }

        // 3. Default: individually focused cells
        return table.querySelectorAll(
            `td.${constants.TABLE_CELL_FOCUS}, th.${constants.TABLE_CELL_FOCUS}`
        ) as NodeListOf<HTMLTableCellElement>;
    }

    public getSelectedCellBlocks(tableBlock: HTMLElement): BlockModel[] {
        const tableBlockModel: BlockModel = getBlockModelById(tableBlock.id, this.parent.getEditorBlocks());
        const selectedCells: NodeListOf<HTMLTableCellElement> = this.getSelectedCells(tableBlock);
        const selectedBlocks: BlockModel[] = [];

        selectedCells.forEach((cell: HTMLTableCellElement) => {
            if (cell.tagName === 'TH') { return; }

            const cellId: string = cell.querySelector(`.${constants.TABLE_CELL_BLK_CONTAINER}`).id;
            const cellModel: TableCellModel = findCellById(cellId, [tableBlockModel]);
            selectedBlocks.push(...cellModel.blocks);
        });
        return selectedBlocks;
    }

    private isCaretAtHeaderBoundary(th: HTMLElement, edge: 'start' | 'end'): boolean {
        const sel: Selection = this.parent.nodeSelection.getSelection();
        if (!sel || sel.rangeCount === 0) { return true; }
        const range: Range = sel.getRangeAt(0);
        if (!th.contains(range.startContainer) || !th.contains(range.endContainer)) { return true; }

        // Compute start: at beginning of th
        if (edge === 'start') {
            return range.collapsed && range.startOffset === 0;
        }

        // Compute end: at end of th
        // Try to use endContainer length
        const endNodeText: string = (range.endContainer && (range.endContainer.textContent || '')) || '';
        if (range.endOffset === endNodeText.length && th.contains(range.endContainer)) {
            return true;
        }
        const thTextLen: number = (th.textContent || '').length;
        return thTextLen === 0 || range.toString().length === 0;
    }

    private shouldMoveHorizFromHeader(direction: string, headerCell: HTMLElement): boolean {
        return direction === 'left'
            ? this.isCaretAtHeaderBoundary(headerCell, 'start')
            : this.isCaretAtHeaderBoundary(headerCell, 'end');
    }

    private handleKeyDown(e: KeyboardEvent): void {
        const targetEl: HTMLElement = (e.target as Node) as HTMLElement;
        const focusedBlk: HTMLElement = this.parent.currentFocusedBlock;
        const tableBlockElement: HTMLElement = targetEl.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement
            || (focusedBlk && focusedBlk.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement);
        if (!tableBlockElement) { return; }

        if (focusedBlk && this.parent.eventAction.isAnyPopupOpen()) { return; }

        const table: HTMLTableElement = tableBlockElement.querySelector('table');
        const cell: HTMLElement = targetEl.closest('td, th') as HTMLElement
                    || (tableBlockElement.querySelector('td.e-cell-focus, th.e-cell-focus') as HTMLElement)
                    || (focusedBlk.closest('td, th') as HTMLElement);
        if (!cell) { return; }
        const block: BlockModel = getBlockModelById(tableBlockElement.id, this.parent.getEditorBlocks());

        if (!cell) { return; }

        const rowIdx: number = parseInt(cell.dataset.row, 10);
        const colIdx: number = parseInt(cell.dataset.col, 10);

        switch (e.key) {
        case 'Tab':
            e.preventDefault();
            this.moveFocus(table, rowIdx, colIdx, !e.shiftKey, block);
            break;
        case 'Escape':
            e.preventDefault();
            this.exitTableNavigation(table, block, 'forward');
            break;
        case 'Enter':
        case 'Backspace':
        case 'Delete': {
            if (this.hasActiveTableSelection(tableBlockElement)) {
                const selectedCells: NodeListOf<HTMLTableCellElement> = this.getSelectedCells(tableBlockElement);
                if (selectedCells.length <= 1) { return; }

                e.preventDefault();
                e.stopPropagation();
                if (e.key === 'Enter') {
                    // Focus last selected cell
                    this.parent.tableService.removeCellFocus(table);
                    this.parent.tableService.addCellFocus(selectedCells[(selectedCells.length - 1) as number]);
                    return;
                }
                this.parent.tableService.clearCellContents(table, selectedCells);
            }
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
            const direction: string = (e.key as string).replace('Arrow', '').toLowerCase();
            if (e.shiftKey) {
                if (!this.canAllowMultiSelection(cell, direction)) { return; }

                this.parent.tableService.removeCellFocus(table);
                if (this.multiselectStartRow == null || this.multiselectStartCol == null) {
                    this.multiselectStartRow = rowIdx;
                    this.multiselectStartCol = colIdx;
                }
                if (this.multiselectEndRow == null || this.multiselectEndCol == null) {
                    this.multiselectEndRow = rowIdx;
                    this.multiselectEndCol = colIdx;
                }
                e.preventDefault();
                this.handleMultiselect(direction, table);
                this.clearRangeAndSetCursor(table);
            } else {
                this.multiselectStartRow = null;
                this.multiselectStartCol = null;
                this.multiselectEndRow = null;
                this.multiselectEndCol = null;
                const selectedCells: NodeListOf<HTMLTableCellElement> = this.getSelectedCells(tableBlockElement);
                const cellName: string = cell.tagName.toLowerCase();
                if (this.hasActiveTableSelection(tableBlockElement) && (selectedCells && selectedCells.length > 1)) {
                    if (cellName === 'td') {
                        this.parent.tableService.shiftFocusToBlockInCell(cell);
                    } else {
                        // keep caret inside header cell (TH)
                        const th: HTMLElement = cell as HTMLElement;
                        // default position: keep current if selection is already inside th,
                        // else move caret to end (right/down) or start (left/up)
                        const moveToEnd: boolean = false;
                        setCursorPosition(th, moveToEnd ? (th.textContent || '').length : 0);
                    }
                }

                const isHorizontal: boolean = direction === 'left' || direction === 'right';
                if (isHorizontal) {
                    const isHeader: boolean = cellName === 'th';
                    const shouldMoveHoriz: boolean = isHeader
                        ? this.shouldMoveHorizFromHeader(direction, cell as HTMLElement)
                        : this.shouldMoveToAdjacentCell(direction, this.parent.currentFocusedBlock, block);
                    if (shouldMoveHoriz) {
                        e.preventDefault();
                        this.parent.tableService.removeCellFocus(table);
                        this.moveCellFocus(table, rowIdx, colIdx, direction);
                    }
                } else {
                    // Vertical navigation (up/down)
                    const isHeaderCell: boolean = cellName === 'th';

                    // From any header cell, ArrowUp exits the table backward
                    if (isHeaderCell && direction === 'up') {
                        e.preventDefault();
                        this.parent.tableService.removeCellFocus(table);
                        this.exitTableNavigation(table, block, 'backward');
                        return;
                    }
                    // Use the TH itself as the source when in header (no inner block exists)
                    // Use the currentFocusedBlock only for TD cells
                    const sourceForNav: HTMLElement = isHeaderCell
                        ? cell
                        : this.parent.currentFocusedBlock;
                    const nextCellEl: HTMLElement = this.shouldMoveCellFocus(direction, sourceForNav, table);
                    if (nextCellEl) {
                        e.preventDefault();
                        this.parent.tableService.removeCellFocus(table);
                        this.moveCellFocus(table, rowIdx, colIdx, direction);
                    } else {
                        // Consider exiting the table if:
                        // - caret is at the correct boundary of the current focused block, AND
                        // - there is no adjacent block inside this cell in that direction, AND
                        // - we are at the first/last table row.
                        const settings: ITableBlockSettings = (block.properties as ITableBlockSettings);
                        const totalRows: number = settings.rows.length + (settings.enableHeader ? 1 : 0);

                        const atBoundary: boolean = isHeaderCell
                            ? (direction === 'up'
                                ? this.isCaretAtHeaderBoundary(cell as HTMLElement, 'start')
                                : this.isCaretAtHeaderBoundary(cell as HTMLElement, 'end'))
                            : (direction === 'up'
                                ? isAtStartOfBlock(this.parent.currentFocusedBlock)
                                : isAtEndOfBlock(this.parent.currentFocusedBlock));

                        const isEdgeRow: boolean = direction === 'up'
                            ? rowIdx === 0
                            : rowIdx === (totalRows - 1);

                        // For headers, there is no inner adjacent block constraint
                        const hasAdjacentBlockInCell: boolean = isHeaderCell
                            ? false
                            : !!getAdjacentBlock(
                                this.parent.currentFocusedBlock,
                                direction === 'up' ? 'previous' : 'next'
                            );

                        if (atBoundary && isEdgeRow && !hasAdjacentBlockInCell) {
                            e.preventDefault();
                            this.exitTableNavigation(table, block, direction === 'up' ? 'backward' : 'forward');
                            return;
                        }
                    }
                }
            }
            break;
        }
        }
    }

    private clearRangeAndSetCursor(tableEle: HTMLTableElement): void {
        this.parent.nodeSelection.clearSelection();
        const lastSelectedCell: HTMLTableCellElement = getDataCell(tableEle, this.multiselectEndRow, this.multiselectEndCol);
        if (lastSelectedCell) {
            setCursorPosition(lastSelectedCell, 0);
        }
    }

    private shouldMoveCellFocus(direction: string, cellBlock: HTMLElement, table: HTMLElement): HTMLElement {
        const isUp: boolean = direction === 'up';
        const isDown: boolean = direction === 'down';
        const isLeft: boolean = direction === 'left';

        if (!cellBlock) { return null; }

        const hostCell: HTMLTableCellElement | null = cellBlock.closest('td, th') as HTMLTableCellElement | null;
        if (!hostCell) { return null; }
        const isHeader: boolean = hostCell.tagName.toLowerCase() === 'th';

        if (!isHeader) {
            const adjacentBlock: HTMLElement = getAdjacentBlock(cellBlock, (isUp || isLeft) ? 'previous' : 'next');
            if (adjacentBlock) { return null; }
        }

        if (isUp || isDown) {
            return getAdjacentCell(table, direction, hostCell);
        }
        return null;
    }

    // Move to adjacent cell only when,
    // * caret is at boundary AND there is no adjacent block inside the cell
    // * cell is empty
    private shouldMoveToAdjacentCell(direction: string, cellBlock: HTMLElement, blockModel: BlockModel): boolean {
        const atStart: boolean = isAtStartOfBlock(cellBlock);
        const atEnd: boolean = isAtEndOfBlock(cellBlock);
        const isEmptyCell: boolean = cellBlock.textContent.trim() === '';

        if (isEmptyCell) { return true; }
        if (direction === 'left') {
            const prev: HTMLElement = getAdjacentBlock(cellBlock, 'previous');
            const firstCellBlockId: string = (blockModel.properties as ITableBlockSettings).rows[0].cells[0].blocks[0].id;
            return atStart && !prev && (cellBlock.id !== firstCellBlockId);
        }
        const next: HTMLElement = getAdjacentBlock(cellBlock, 'next');
        return atEnd && !next;
    }

    // Returns true if there is any visual selection in the table block
    public hasActiveTableSelection(tableBlockElement: HTMLElement): boolean {
        if (!tableBlockElement) { return false; }

        const selectedCells: NodeListOf<HTMLTableCellElement> = this.getSelectedCells(tableBlockElement);
        // Rectangle selection
        if (selectedCells && selectedCells.length > 1) { return true; }
        // Row selection
        if (tableBlockElement.querySelector('tbody tr.e-row-selected')) { return true; }
        // Column selection
        if (tableBlockElement.querySelector('td.e-col-selected, th.e-col-selected')) { return true; }
        return false;
    }

    // Helpers for keyboard shift selection behavior
    private isSelectionWithinCell(cell: HTMLElement): boolean {
        const sel: Selection = this.parent.nodeSelection.getSelection();
        const anchorNode: Node = sel.anchorNode;
        const focusNode: Node = sel.focusNode;
        return cell.contains(anchorNode) && cell.contains(focusNode);
    }

    private getCellBlockContentElements(cell: HTMLElement): HTMLElement[] {
        const blocks: HTMLElement[] = Array.from(cell.querySelectorAll('.e-block')) as HTMLElement[];
        const contents: HTMLElement[] = blocks
            .map((b: HTMLElement) => getBlockContentElement(b))
            .filter((el: HTMLElement) => !!el);
        return contents;
    }

    private canAllowMultiSelection(cell: HTMLElement, direction: string): boolean {
        if (this.multiselectEndRow || this.multiselectEndCol) {
            return true;
        }
        const sel: Selection = window.getSelection && window.getSelection();
        if (!sel || sel.rangeCount === 0) { return false; }
        if (!this.isSelectionWithinCell(cell)) { return false; }

        const isLeft: boolean = direction === 'left';
        const isRight: boolean = direction === 'right';
        const isUpDown: boolean = direction === 'up' || direction === 'down';
        const range: Range = sel.getRangeAt(0);
        if (cell.tagName === 'TH') {
            const startsAtFirst: boolean = range.startOffset === 0 && (isLeft || isUpDown);
            const endsAtLast: boolean = range.endOffset === cell.textContent.length && (isRight || isUpDown);
            return startsAtFirst || endsAtLast;
        }
        const contents: HTMLElement[] = this.getCellBlockContentElements(cell);
        const isFirstTextNode: boolean = (!contents[0].firstChild ||
            (contents[0].firstChild && contents[0].firstChild.nodeType === Node.TEXT_NODE));
        const firstChild: HTMLElement = isFirstTextNode
            ? contents[0]
            : contents[0].firstChild as HTMLElement;
        const lastContent: HTMLElement = contents[contents.length - 1];
        const isLastTextNode: boolean = (!lastContent.lastChild ||
            (lastContent.lastChild && lastContent.lastChild.nodeType === Node.TEXT_NODE));
        const lastChild: HTMLElement = isLastTextNode
            ? lastContent
            : lastContent.lastChild as HTMLElement;
        const expectedStartNode: Node = getDeepestTextNode(firstChild) || contents[0];
        const expectedEndNode: Node = getDeepestTextNode(lastChild) || lastContent;
        const startsAtFirst: boolean = (
            expectedStartNode && expectedStartNode.contains(range.startContainer) &&
            range.startOffset === 0 && (isLeft || isUpDown)
        );
        const endsAtLast: boolean = (
            expectedEndNode && expectedEndNode.contains(range.endContainer) &&
            range.endOffset === lastChild.textContent.length && (isRight || isUpDown)
        );
        return startsAtFirst || endsAtLast;
    }

    private handleMultiselect(
        direction: string,
        table: HTMLTableElement
    ): void {
        if (this.multiselectEndRow == null || this.multiselectEndCol == null) { return; }

        const blockId: string = table.getAttribute('data-block-id');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;
        const totalRows: number = (settings.rows).length + (settings.enableHeader ? 1 : 0);
        const totalCols: number = (settings.columns).length;

        let newEndRow: number = this.multiselectEndRow;
        let newEndCol: number = this.multiselectEndCol;

        switch (direction) {
        case 'up':
            newEndRow = Math.max(0, newEndRow - 1);
            break;
        case 'down':
            newEndRow = Math.min(totalRows - 1, newEndRow + 1);
            break;
        case 'left':
            newEndCol = Math.max(0, newEndCol - 1);
            break;
        case 'right':
            newEndCol = Math.min(totalCols - 1, newEndCol + 1);
            break;
        }

        this.updateRectangleFocus(
            this.multiselectStartRow,
            this.multiselectStartCol,
            newEndRow,
            newEndCol,
            table
        );
        this.multiselectEndRow = newEndRow;
        this.multiselectEndCol = newEndCol;
    }

    private moveCellFocus(
        table: HTMLTableElement,
        rowIdx: number,
        colIdx: number,
        direction: string
    ): void {
        const blockId: string = table.getAttribute('data-block-id');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;

        const totalRows: number = (settings.rows).length + (settings.enableHeader ? 1 : 0);
        const totalCols: number = (settings.columns).length;

        let targetRow: number = rowIdx;
        let targetCol: number = colIdx;

        switch (direction) {
        case 'up':
            if (rowIdx > 0) { targetRow = rowIdx - 1; }
            break;
        case 'down':
            if (rowIdx + 1 < totalRows) { targetRow = rowIdx + 1; }
            break;
        case 'left':
            if (colIdx > 0) {
                targetCol = colIdx - 1;
            } else if (rowIdx > 0) {
                targetRow = rowIdx - 1;
                targetCol = totalCols - 1;
            }
            break;
        case 'right':
            if (colIdx + 1 < totalCols) {
                targetCol = colIdx + 1;
            } else if (rowIdx + 1 < totalRows) {
                targetRow = rowIdx + 1;
                targetCol = 0;
            }
            break;
        }

        if (targetRow === rowIdx && targetCol === colIdx) { return; }
        const domCol: number = toDomCol(targetCol, settings.enableRowNumbers);
        const rowEl: HTMLTableRowElement = table.rows[targetRow as number];
        const nextCell: HTMLElement = rowEl && rowEl.cells[domCol as number];
        const cursorAtStart: boolean = direction === 'right' || direction === 'up' || direction === 'down';
        if (nextCell) {
            this.parent.tableService.removeCellFocus(table);
            this.parent.tableService.addCellFocus(nextCell, true, cursorAtStart);

            // If header cell, set caret directly in TH so cursor doesn’t remain in previous row’s TD
            if (nextCell.tagName && nextCell.tagName.toLowerCase() === 'th') {
                const th: HTMLElement = nextCell as HTMLElement;
                const placeAtEnd: boolean = direction === 'left' ? true : false; // moving left -> end, right -> start
                // For vertical moves, default to start
                requestAnimationFrame(() => {
                    setCursorPosition(th, placeAtEnd ? (th.textContent).length : 0);
                });
            }
        }
    }

    private updateRectangleFocus(row1: number, col1: number, row2: number, col2: number, table: HTMLTableElement): void {
        const blockId: string = table.getAttribute('data-block-id');
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;

        this.parent.tableService.removeCellFocus(table);
        const minRow: number = Math.min(row1, row2);
        const maxRow: number = Math.max(row1, row2);
        const minCol: number = Math.min(col1, col2);
        const maxCol: number = Math.max(col1, col2);
        for (let r: number = minRow; r <= maxRow; r++) {
            const tr: HTMLTableRowElement = table.rows[r as number];
            for (let c: number = minCol; c <= maxCol; c++) {
                const domCol: number = toDomCol(c, settings.enableRowNumbers);
                const cellEl: HTMLElement = tr.cells[domCol as number];
                if (cellEl) { cellEl.classList.add(constants.TABLE_CELL_FOCUS); }
            }
        }
    }

    private moveFocus(table: HTMLTableElement, row: number, col: number, forward: boolean, block: BlockModel): void {
        const settings: ITableBlockSettings = block.properties as ITableBlockSettings;
        this.parent.tableService.removeCellFocus(table);

        const headerOffset: number = settings.enableHeader ? 1 : 0;
        const totalRows: number = (settings.rows).length + headerOffset;
        const totalCols: number = (settings.columns).length;

        let nextRow: number = row;
        let nextCol: number = col;

        if (forward) {
            nextCol++;
            if (nextCol >= totalCols) { nextRow++; }
        } else {
            nextCol--;
            if (nextCol < 0) { nextRow--; }
        }
        // Forward past the last cell -> add a new row
        if (nextRow >= totalRows && nextCol >= totalCols) {
            // Add new row and focus its first cell
            this.parent.tableService.addRowAt({
                blockId: block.id,
                rowIndex: totalRows - headerOffset
            });
            const newLastRow: HTMLTableRowElement = table.rows[(table.rows.length - 1 as number)];
            this.parent.tableService.addCellFocus(newLastRow.cells[toDomCol(0, settings.enableRowNumbers)], true);
            return;
        }
        // Backward past the header (or top when no header) -> exit table
        // Note: only exit when we went before row 0 entirely.
        if (!forward && nextRow < 0 && nextCol < 0) {
            this.exitTableNavigation(table, block, 'backward');
            return;
        }
        // Clamp candidate row into [0, totalRows-1] to allow selecting header row as well
        const targetDOMRowIndex: number = Math.max(0, Math.min(nextRow, totalRows - 1));
        const rowElement: HTMLTableRowElement = table.rows[targetDOMRowIndex as number];
        if (rowElement && nextCol >= 0 && nextCol < totalCols) {
            const domCol: number = toDomCol(nextCol, settings.enableRowNumbers);
            const targetCell: HTMLElement = rowElement.cells[domCol as number];
            if (targetCell) {
                this.parent.tableService.addCellFocus(targetCell, true);
                if (targetCell.tagName.toLowerCase() === 'th') {
                    const th: HTMLElement = targetCell as HTMLElement;
                    // For Tab forward, place at start; for Shift+Tab, place at end
                    requestAnimationFrame(() => {
                        setCursorPosition(th, forward ? 0 : (th.textContent || '').length);
                    });
                }
                return;
            }
        }

        if (forward && targetDOMRowIndex < totalRows) {
            const domCol: number = toDomCol(0, settings.enableRowNumbers);
            const fallbackCell: HTMLElement = table.rows[targetDOMRowIndex as number].cells[domCol as number] as HTMLElement;
            this.parent.tableService.addCellFocus(fallbackCell, true);
            if (fallbackCell && fallbackCell.tagName.toLowerCase() === 'th') {
                const th: HTMLElement = fallbackCell as HTMLElement;
                requestAnimationFrame(() => setCursorPosition(th, 0));
            }

        } else if (!forward && targetDOMRowIndex >= 0) {
            const domCol: number = toDomCol(totalCols - 1, settings.enableRowNumbers);
            const fallbackCell: HTMLElement = table.rows[targetDOMRowIndex as number].cells[domCol as number] as HTMLElement;
            this.parent.tableService.addCellFocus(fallbackCell, true);
            if (fallbackCell && fallbackCell.tagName.toLowerCase() === 'th') {
                const th: HTMLElement = fallbackCell as HTMLElement;
                requestAnimationFrame(() => setCursorPosition(th, (th.textContent || '').length));
            }
        }
    }

    private exitTableNavigation(table: HTMLTableElement, block: BlockModel, direction: 'forward' | 'backward'): void {
        const blockEl: HTMLElement = table.closest('.e-block') as HTMLElement;
        const nextBlock: HTMLElement = (direction === 'forward'
            ? blockEl.nextElementSibling : blockEl.previousElementSibling) as HTMLElement;
        if (nextBlock) {
            setCursorPosition(getBlockContentElement(nextBlock), 0);
            this.parent.setFocusToBlock(nextBlock);
            this.parent.tableService.removeCellFocus(table);
        }
    }

    private destroy(): void {
        this.removeEventListener();
    }
}

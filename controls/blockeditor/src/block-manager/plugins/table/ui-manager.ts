import { createElement } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { BlockManager } from '../../base/block-manager';
import * as constants from '../../../common/constant';
import { BlockModel, ITableBlockSettings, TableCellModel, TableColumnModel, TableRowModel } from '../../../models/index';
import { IPopupRenderOptions } from '../../../common';
import { decoupleReference, getBlockContentElement, getBlockModelById, getDataCell, getSelectedCells, setCursorPosition, setTableWidthMode, toDomCol, toModelRow } from '../../../common/utils/index';

export class TableUIManager {
    private parent: BlockManager;
    // Refs set during init
    private table: HTMLTableElement;
    private tableContainer: HTMLElement;
    private blockElement: HTMLElement;
    private blockModel: BlockModel;
    private blockId: string;

    // UI elements
    private rowInsertHandle: HTMLElement;
    private rowActionHandle: HTMLElement;
    private rowHoverLine: HTMLElement;
    private rowTopDot: HTMLElement;
    private rowBottomDot: HTMLElement;
    private colInsertHandle: HTMLElement;
    private colActionHandle: HTMLElement;
    private colHoverLine: HTMLElement;
    private colLeftDot: HTMLElement;
    private colRightDot: HTMLElement;
    private rowPinned: HTMLElement;
    private colPinned: HTMLElement;
    private rowTopHit: HTMLElement;
    private rowBottomHit: HTMLElement;
    private colLeftHit: HTMLElement;
    private colRightHit: HTMLElement;
    private colResizeHandle: HTMLElement;

    // State
    private hoveredRow: HTMLTableRowElement | null = null;
    private hoveredColIndex: number | null = null;
    private isMultiSelecting: boolean = false;
    private isResizing: boolean = false;

    // Instance
    public popupObj: Popup;
    private lastRowAnchorIndex: number | null = null;
    private lastColAnchorIndex: number | null = null;

    constructor(parent: BlockManager) { this.parent = parent; }

    public init(
        table: HTMLTableElement,
        blockElement: HTMLElement,
        blockModel: BlockModel
    ): void {
        this.table = table;
        this.tableContainer = table.parentElement;
        this.blockElement = blockElement;
        this.blockModel = blockModel;
        this.blockId = table.getAttribute('data-block-id');

        this.createUiElements();
        this.mountUiElements();
        this.wireDelegatedMousemove();
        this.wireRowInsert();
        this.wireActionHandles();
        this.wireColInsert();
        this.wireColResize();
        this.wireFocusAndCleanup();
        this.wireObservers();
    }

    // 1) Create all UI elements
    private createUiElements(): void {
        this.rowInsertHandle = createElement('div', { className: 'e-row-insert-handle e-icons e-plus', attrs: { contenteditable: 'false' }, styles: 'display: none' }) as HTMLElement;
        this.rowActionHandle = createElement('div', { className: 'e-row-action-handle e-action-handle', attrs: { contenteditable: 'false', 'data-block-id': this.blockId, 'data-icon-type': 'row' }, styles: 'display: none' }) as HTMLElement;
        const rowActionHandleIcon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        this.rowActionHandle.appendChild(rowActionHandleIcon);
        this.rowHoverLine = createElement('div', { className: 'e-row-hover-line', styles: 'display: none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.rowTopDot = createElement('div', { className: 'e-row-dot', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.rowBottomDot = createElement('div', { className: 'e-row-dot', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;

        this.colInsertHandle = createElement('div', { className: 'e-col-insert-handle e-icons e-plus', attrs: { contenteditable: 'false' }, styles: 'display: none' }) as HTMLElement;
        this.colActionHandle = createElement('div', { className: 'e-col-action-handle e-action-handle', attrs: { contenteditable: 'false', 'data-block-id': this.blockId, 'data-icon-type': 'col' }, styles: 'display: none' }) as HTMLElement;
        const colActionHandleIcon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        colActionHandleIcon.style.transform = 'rotate(90deg)';
        this.colActionHandle.appendChild(colActionHandleIcon);

        this.colHoverLine = createElement('div', { className: 'e-col-hover-line', styles: 'display: none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.colLeftDot = createElement('div', { className: 'e-col-dot', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.colRightDot = createElement('div', { className: 'e-col-dot', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;

        this.rowPinned = createElement('div', { className: 'e-row-action-handle e-pinned e-action-handle', attrs: { contenteditable: 'false', 'data-icon-type': 'row' }, styles: 'display: none' }) as HTMLElement;
        const rowPinnedHandleIcon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        this.rowPinned.appendChild(rowPinnedHandleIcon);
        this.colPinned = createElement('div', { className: 'e-col-action-handle e-pinned e-action-handle', attrs: { contenteditable: 'false', 'data-icon-type': 'col' }, styles: 'display: none' }) as HTMLElement;
        const colPinnedHandleIcon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        colPinnedHandleIcon.style.transform = 'rotate(90deg)';
        this.colPinned.appendChild(colPinnedHandleIcon);

        this.rowTopHit = createElement('div', { className: 'e-row-dot-hit', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.rowBottomHit = createElement('div', { className: 'e-row-dot-hit', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.colLeftHit = createElement('div', { className: 'e-col-dot-hit', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;
        this.colRightHit = createElement('div', { className: 'e-col-dot-hit', styles: 'display:none', attrs: { contenteditable: 'false' } }) as HTMLElement;

        // full-height column-resize handle (invisible until needed)
        this.colResizeHandle = createElement('div', {
            className: 'e-col-resize-handle',
            attrs: { contenteditable: 'false' },
            styles: 'display:none; position:absolute; pointer-events:auto;'
        }) as HTMLElement;
    }

    // 2) Mount elements to block element in the same order
    private mountUiElements(): void {
        [this.rowInsertHandle, this.rowHoverLine, this.rowActionHandle, this.rowTopDot, this.rowBottomDot, this.colInsertHandle,
            this.colHoverLine, this.colActionHandle, this.colLeftDot, this.colRightDot, this.rowPinned, this.colPinned]
            .forEach((el: HTMLElement) => this.blockElement.appendChild(el));

        [this.rowTopHit, this.rowBottomHit, this.colLeftHit, this.colRightHit]
            .forEach((el: HTMLElement) => this.blockElement.appendChild(el));

        // mount the resize handle on top
        this.blockElement.appendChild(this.colResizeHandle);
    }

    // 3) Delegated mouse move handling (exact logic preserved)
    private wireDelegatedMousemove(): void {
        this.table.addEventListener('mousemove', (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const isRowNumberCell: boolean = target.closest('td.e-row-number, th.e-row-number') !== null;
            const isPlainHeaderCell: boolean = target.closest('th.e-row-number') !== null;
            const hasBodyRows: boolean = this.table.tBodies[0].rows.length > 0 ? true : false;

            if (this.isMultiSelecting || this.isResizing || !target.closest('td, th')) {
                this.hideRowUI();
                this.hideColUI();
                this.hideHitZones();
                return;
            }

            // Hide row UI only for plain header cell when body rows exist
            if (isPlainHeaderCell && hasBodyRows) {
                this.hideRowUI();
                this.hideColUI();
                this.hideHitZones();
                return;
            }

            // hide the resize handle by default; we'll re-show if near a column boundary
            this.colResizeHandle.style.display = 'none';
            const xLeft: number = this.table.parentElement.offsetLeft - 8;

            // Row positioning (dots only)
            const row: HTMLTableRowElement = target.closest('tr');
            this.hoveredRow = row;
            const rowRect: DOMRect = row.getBoundingClientRect() as DOMRect;
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;

            this.rowActionHandle.dataset.rowIndex = Array.from(this.table.rows).indexOf(row).toString();
            this.rowActionHandle.style.top = rowRect.top - blockRect.top + 'px';
            this.rowActionHandle.style.height = `${rowRect.height}` + 'px';
            this.rowActionHandle.style.display = target.tagName === 'TH' ? 'none' : 'flex';

            const isHeaderRow: boolean = this.hoveredRow && this.hoveredRow.querySelector('th') !== null;
            let showTopDot: boolean = true;
            let showBottomDot: boolean = true;

            if (isHeaderRow) {
                if (hasBodyRows) {
                    // Normal case: header with body rows → hide both dots
                    showTopDot = false;
                    showBottomDot = false;
                } else {
                    // Only header exists → show ONLY bottom dot
                    showTopDot = false;
                    showBottomDot = true;
                }
            } else {
                // Body row → show both dots normally
                showTopDot = true;
                showBottomDot = true;
            }

            if (showTopDot || showBottomDot) {
                // Show row dots at left side (top and bottom of row)
                this.rowTopDot.style.left = `${xLeft - 4}` + 'px';
                this.rowBottomDot.style.left = `${xLeft - 4}` + 'px';
                this.rowTopDot.style.top = `${rowRect.top - blockRect.top - 3}` + 'px';
                this.rowBottomDot.style.top = `${rowRect.bottom - blockRect.top - 3}` + 'px';
                this.rowTopDot.style.display = showTopDot ? 'block' : 'none';
                this.rowBottomDot.style.display = showBottomDot ? 'block' : 'none';
            }
            else {
                this.rowTopDot.style.display = 'none';
                this.rowBottomDot.style.display = 'none';
            }

            // Hit zones at left side for dot
            const xLeftHit: number = xLeft - 12;
            this.rowTopHit.style.left = `${xLeftHit}` + 'px';
            this.rowBottomHit.style.left = `${xLeftHit}` + 'px';
            this.rowTopHit.style.top = `${rowRect.top - blockRect.top - 15}` + 'px';
            this.rowBottomHit.style.top = `${rowRect.bottom - blockRect.top - 15}` + 'px';
            this.rowTopHit.style.display = 'block';
            this.rowBottomHit.style.display = 'block';

            // Column positioning (dots only)
            const cell: HTMLTableCellElement = target.closest('td, th') as HTMLTableCellElement;
            const cellRect: DOMRect = cell.getBoundingClientRect() as DOMRect;
            const rowEl: HTMLTableRowElement = cell.parentElement as HTMLTableRowElement;
            const colIndex: number = Array.from(rowEl.cells).filter((c: HTMLElement) => !c.classList.contains('e-row-number')).indexOf(cell);
            this.hoveredColIndex = colIndex;

            const dotY: number = this.table.parentElement.offsetTop - 8;
            const dotHalfWidth: number = 3.2;
            const borderValue: number = Math.round(parseFloat(getComputedStyle(cell).borderWidth));
            const leftColX: number = cellRect.left - blockRect.left - borderValue - dotHalfWidth;
            const rightColX: number = cellRect.right - blockRect.left - borderValue - dotHalfWidth;
            this.colLeftDot.style.left = `${leftColX}` + 'px';
            this.colRightDot.style.left = `${rightColX}` + 'px';
            this.colLeftDot.style.top = `${dotY - 4}` + 'px';
            this.colRightDot.style.top = `${dotY - 4}` + 'px';
            this.colLeftDot.style.display = 'block';
            this.colRightDot.style.display = 'block';

            if (cell.classList.contains('e-row-number')) {
                this.colLeftDot.style.display = 'none';
                this.colRightDot.style.display = 'none';
            }

            this.colLeftHit.style.left = `${leftColX - 10}` + 'px';
            this.colRightHit.style.left = `${rightColX - 10}` + 'px';
            this.colLeftHit.style.top = `${dotY - 12}` + 'px';
            this.colRightHit.style.top = `${dotY - 12}` + 'px';
            this.colLeftHit.style.display = 'block';
            this.colRightHit.style.display = 'block';

            if (!isRowNumberCell) {
                const headerCell: HTMLTableCellElement = this.table.querySelectorAll('thead th:not(.e-row-number)')[colIndex as number] as HTMLTableCellElement;
                if (headerCell) {
                    const headerRect: DOMRect = headerCell.getBoundingClientRect() as DOMRect;
                    const borderValue: number = Math.round(parseFloat(getComputedStyle(headerCell).borderWidth));
                    this.colActionHandle.style.left = `${(headerRect.left - borderValue) - blockRect.left}` + 'px';
                    this.colActionHandle.style.width = `${headerRect.width + borderValue}` + 'px';
                } else {
                    this.colActionHandle.style.left = `${(cellRect.left - borderValue) - blockRect.left}` + 'px';
                    this.colActionHandle.style.width = `${cellRect.width + borderValue}` + 'px';
                }
                this.colActionHandle.dataset.colIndex = colIndex.toString();
                this.colActionHandle.style.display = 'flex';

                const proximity: number = 6;
                const distanceFromRight: number = cellRect.right - e.clientX;
                const distanceFromLeft: number = e.clientX - cellRect.left;
                const isNearColumnRightBoundary: boolean = distanceFromRight <= proximity;
                const isNearColumnLeftBoundary: boolean = distanceFromLeft <= proximity;
                if (isNearColumnLeftBoundary || isNearColumnRightBoundary) {
                    // Determine which two columns the boundary separates
                    const leftDataIdx: number = isNearColumnRightBoundary ? colIndex : colIndex - 1;
                    if (leftDataIdx < 0) {
                        // Do not show resize handle for first column
                        this.colResizeHandle.style.display = 'none';
                    } else {
                        const boundary: number = isNearColumnRightBoundary ? cellRect.right : cellRect.left;
                        const leftOffset: number = boundary - blockRect.left - 2.5;
                        this.colResizeHandle.style.left = `${leftOffset}px`;
                        this.colResizeHandle.style.top = `${this.table.parentElement.offsetTop}px`;
                        this.colResizeHandle.style.height = `${this.table.offsetHeight}px`;
                        this.colResizeHandle.style.display = 'block';
                        this.colResizeHandle.setAttribute('data-resize-index', String(leftDataIdx));
                    }
                }
            }
            else {
                this.colActionHandle.style.display = 'none';
            }
        });
    }

    // 4) Row insert UI and handlers
    private wireRowInsert(): void {
        const showRowLine: (which: 'top' | 'bottom') => void = (which: 'top' | 'bottom') => {
            if (!this.hoveredRow) { return; }
            const rowRect: DOMRect = this.hoveredRow.getBoundingClientRect() as DOMRect;
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;
            const tbody: HTMLTableSectionElement = this.table.tBodies[0];
            const hasBodyRows: boolean = tbody && tbody.rows.length > 0;

            this.rowHoverLine.style.top = `${(which === 'top' ? rowRect.top : rowRect.bottom) - blockRect.top - 2}` + 'px';
            this.rowHoverLine.style.left = `${this.table.parentElement.offsetLeft}` + 'px';
            this.rowHoverLine.style.width = `${this.table.offsetWidth}` + 'px';
            this.rowHoverLine.style.display = 'block';

            const dotTop: HTMLElement = which === 'top' ? this.rowTopDot : this.rowBottomDot;
            const dotRect: DOMRect = dotTop.getBoundingClientRect() as DOMRect;
            this.rowInsertHandle.style.top = `${dotRect.top - blockRect.top - 7}` + 'px';
            this.rowInsertHandle.style.left = `${dotRect.left - blockRect.left - 7}` + 'px';
            this.rowInsertHandle.style.display = 'flex';


            // In header-only case, keep bottom dot visible
            if (!hasBodyRows && this.hoveredRow.querySelector('th')) {
                // Only bottom dot visible → don't hide it when showing line
                if (which === 'top') {
                    this.rowTopDot.style.visibility = 'hidden'; // top never shown anyway
                } else {
                    this.rowBottomDot.style.visibility = ''; // keep visible
                }
            } else {
                dotTop.style.visibility = 'hidden';
            }

            const index: number = Array.from(tbody.rows).indexOf(this.hoveredRow as HTMLTableRowElement);
            this.rowInsertHandle.dataset.rowIndex = (which === 'top' ? index : index + 1).toString();
        };

        const hideRowLine: () => void = () => {
            this.rowHoverLine.style.display = 'none';
            this.rowInsertHandle.style.display = 'none';
            // Restore visibility, but keep bottom dot visible if only header
            const tbody: HTMLTableSectionElement = this.table.tBodies[0];
            const hasBodyRows: boolean = tbody && tbody.rows.length > 0;

            if (!hasBodyRows) {
                this.rowTopDot.style.visibility = 'hidden';   // no top dot
                this.rowTopHit.style.visibility = 'hidden';
                this.rowBottomDot.style.visibility = '';      // keep bottom dot visible
            } else {
                this.rowTopDot.style.visibility = '';
                this.rowTopHit.style.visibility = '';
                this.rowBottomDot.style.visibility = '';
            }
        };

        this.rowTopHit.addEventListener('mouseenter', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.rowInsertHandle)) { return; }
            showRowLine('top');
        });
        this.rowBottomHit.addEventListener('mouseenter', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.rowInsertHandle)) { return; }
            showRowLine('bottom');
        });
        this.rowInsertHandle.addEventListener('mouseleave', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.rowBottomHit) || this.isFromInsertHandle(e, this.rowTopHit)) { return; }
            hideRowLine();
        });
        this.rowTopHit.addEventListener('mouseleave', (e: MouseEvent) => {
            e.stopPropagation();
            if (this.isFromInsertHandle(e, this.rowInsertHandle)) { return; }
            hideRowLine();
        });
        this.rowBottomHit.addEventListener('mouseleave', (e: MouseEvent) => {
            e.stopPropagation();
            if (this.isFromInsertHandle(e, this.rowInsertHandle)) { return; }
            hideRowLine();
        });

        this.rowInsertHandle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const index: number = parseInt(this.rowInsertHandle.dataset.rowIndex, 10);
            this.parent.tableService.addRowAt({
                blockId: this.blockElement.id,
                rowIndex: index
            });
            this.hideRowGripper();                    // Hides row pinned bars
            this.hideAllPinnedColBars();              // Hides col pinned bars
            requestAnimationFrame(() => {
                this.hideRowUI();
            });
            this.rowTopHit.style.display = 'none';
            this.rowBottomHit.style.display = 'none';
            this.clearPinnedGripperSelection();
        });
    }

    // 5) Column insert UI and handlers
    private wireColInsert(): void {
        const showColLine: (side: 'left' | 'right') => void = (side: 'left' | 'right') => {
            if (this.hoveredColIndex == null) { return; }
            const rows: HTMLTableRowElement[] = Array.from(this.table.rows) as HTMLTableRowElement[];
            const cells: HTMLTableCellElement[] = Array.from(rows[0].cells).filter(((cell: HTMLElement) => !cell.classList.contains('e-row-number'))) as HTMLTableCellElement[];
            const anyRowCell: HTMLTableCellElement = cells[this.hoveredColIndex as number];
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;
            const rect: DOMRect = anyRowCell.getBoundingClientRect() as DOMRect;
            const boundary: number = side === 'right' ? rect.right : rect.left;
            this.colHoverLine.style.left = `${boundary - blockRect.left - 2}` + 'px';
            this.colHoverLine.style.top = `${this.table.parentElement.offsetTop}` + 'px';
            this.colHoverLine.style.height = `${this.table.offsetHeight}` + 'px';
            this.colHoverLine.style.display = 'block';

            const dotEl: HTMLElement = side === 'left' ? this.colLeftDot : this.colRightDot;
            const dotRect: DOMRect = dotEl.getBoundingClientRect() as DOMRect;
            this.colInsertHandle.style.left = `${dotRect.left - blockRect.left - 6}` + 'px';
            this.colInsertHandle.style.top = `${dotRect.top - blockRect.top - 7}` + 'px';
            this.colInsertHandle.style.display = 'flex';
            dotEl.style.visibility = 'hidden';

            this.colInsertHandle.dataset.colIndex = (side === 'right' ? (this.hoveredColIndex as number) + 1 : this.hoveredColIndex as number).toString();
        };

        const hideColLine: () => void  = () => {
            this.colHoverLine.style.display = 'none';
            this.colInsertHandle.style.display = 'none';
            this.colLeftDot.style.visibility = '';
            this.colRightDot.style.visibility = '';
        };

        this.colLeftHit.addEventListener('mouseenter', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.colInsertHandle)) { return; }
            showColLine('left');
        });
        this.colRightHit.addEventListener('mouseenter', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.colInsertHandle)) { return; }
            showColLine('right');
        });
        this.colInsertHandle.addEventListener('mouseleave', (e: MouseEvent) => {
            if (this.isFromInsertHandle(e, this.colLeftHit) || this.isFromInsertHandle(e, this.colRightHit)) { return; }
            hideColLine();
        });
        this.colLeftHit.addEventListener('mouseleave', (e: MouseEvent) => {
            e.stopPropagation();
            if (this.isFromInsertHandle(e, this.colInsertHandle)) { return; }
            hideColLine();
        });
        this.colRightHit.addEventListener('mouseleave', (e: MouseEvent) => {
            e.stopPropagation();
            if (this.isFromInsertHandle(e, this.colInsertHandle)) { return; }
            hideColLine();
        });

        this.colInsertHandle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const index: number = parseInt(this.colInsertHandle.dataset.colIndex, 10);
            this.parent.tableService.addColumnAt({
                blockId: this.blockElement.id,
                colIndex: index
            });
            this.hideRowGripper();                    // Hides row pinned bars
            this.hideAllPinnedColBars();              // Hides col pinned bars
            requestAnimationFrame(() => {
                this.hideColUI();
            });
            this.colLeftHit.style.display = 'none';
            this.colRightHit.style.display = 'none';
            this.clearPinnedGripperSelection();
        });
    }

    private isFromInsertHandle(e: MouseEvent, insertHandle: HTMLElement): boolean {
        const relatedTarget: HTMLElement = e.relatedTarget as HTMLElement | null;
        return ( relatedTarget !== null && insertHandle !== null && (relatedTarget === insertHandle));
    }

    /**
     * Displays a row gripper for the specified DOM row index.
     * Handles row selection, focus, pinned bar creation, and optional gripper popup.
     * Updates DOM elements, dataset attributes, and integrates with undo/redo tracking.
     *
     * @param {number} domRowIdx - The DOM/visual row index to show the gripper for.
     * @param {boolean} [isFirstRow=false] - Indicates if the row is the first row, triggering popup options.
     * @returns {void}
     *
     * @hidden
     */
    public showRowGripperForDomRow(domRowIdx: number, isFirstRow: boolean = false): void {
        const rowEl: HTMLTableRowElement = this.table.rows[parseInt(domRowIdx.toString(), 10)] as HTMLTableRowElement;
        const cellBlock: HTMLElement = rowEl.querySelector('.e-block') as HTMLElement;
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        // No gripper or popup for header
        if (props.enableHeader && domRowIdx === 0) { return; }
        const rowRect: DOMRect = rowEl.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;

        this.addRowSelection(this.table, domRowIdx);
        this.focusCellsInRows([domRowIdx]);

        // Focus first cell in the row
        setCursorPosition(getBlockContentElement(cellBlock), 0);
        this.parent.setFocusToBlock(cellBlock);

        // Create and position a new pinned bar for this row
        const rowPinned: HTMLElement = this.createPinnedRowBar();
        rowPinned.style.top = `${Math.round(rowRect.top - blockRect.top - 1)}px`;
        rowPinned.style.height = `${rowRect.height + 1}px`;
        rowPinned.classList.add('e-action-bar-active');
        rowPinned.style.display = 'flex';
        rowPinned.dataset.rowIndex = domRowIdx.toString();
        this.blockElement.appendChild(rowPinned);
        this.rowPinned = rowPinned;

        rowPinned.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const clickedDomRowIdx: number = parseInt(rowPinned.dataset.rowIndex, 10);

            // Clear all selections and grippers
            this.resetAllTableSelectionUI();
            // Re-show gripper + popup for the clicked row
            this.showRowGripperForDomRow(clickedDomRowIdx, true);

            // Refocus the clicked row (optional but good UX)
            const clickedRowEl: HTMLTableRowElement = this.table.rows[parseInt(clickedDomRowIdx.toString(), 10)];
            const cellBlock: HTMLElement = clickedRowEl.querySelector('.e-block') as HTMLElement;
            if (cellBlock) {
                setCursorPosition(getBlockContentElement(cellBlock), 0);
                this.parent.setFocusToBlock(cellBlock);
            }
        });

        this.rowActionHandle.style.display = 'none';
        this.colPinned.style.display = 'none';
        this.colPinned.classList.remove('e-action-bar-active');
        if (isFirstRow) {
            this.showGripperPopup(this.rowActionHandle, rowPinned, this.blockModel, {
                label: 'Delete Row',
                iconCss: 'e-trash',
                callback: () => { this.deleteSelectedRows(domRowIdx); }
            });
        }
    }

    public deleteSelectedRows(domRowIdx: number): void {
        const selectedRows: NodeListOf<HTMLTableRowElement> = this.table.querySelectorAll('tr.e-row-selected');
        const selectedCount: number = selectedRows.length;
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        if (selectedCount === 0) {
            return;  // nothing selected → no-op, no undo entry
        }
        if (selectedCount === 1) {
            const modelIdx: number = toModelRow(domRowIdx, props.enableHeader);
            this.parent.tableService.deleteRowAt({
                blockId: this.blockId,
                modelIndex: modelIdx
            });
        } else {
            const rowsMeta: Array<{ index: number; rowModel: TableRowModel }> = [];
            // Collect metadata for undo/redo
            Array.from(selectedRows)
                .map((row: HTMLTableRowElement) => parseInt((row as HTMLTableRowElement).dataset.row, 10))
                .sort((a: number, b: number) => b - a)
                .forEach((domRowIdx: number) => {
                    const modelIdx: number = toModelRow(domRowIdx, props.enableHeader);
                    const rowModel: TableRowModel = props.rows[parseInt(modelIdx.toString(), 10)];

                    if (rowModel) {
                        rowsMeta.push({
                            index: modelIdx,
                            rowModel: decoupleReference(rowModel)
                        });
                    }
                });

            // Track bulk undo/redo **once**
            this.parent.undoRedoAction.trackBulkRowDeletionForUndoRedo({
                blockId: this.blockId,
                rows: rowsMeta
            });

            // Perform deletions (skip internal single tracking)
            rowsMeta.forEach(({ index }: { index: number }) => {
                this.parent.tableService.deleteRowAt({
                    blockId: this.blockId,
                    modelIndex: index,
                    isUndoRedoAction: true
                });
            });
        }
    }

    /**
     * Displays a column gripper for the specified DOM column index.
     * Handles column selection, focus, pinned bar creation, and optional gripper popup.
     * Updates DOM elements, dataset attributes, and integrates with undo/redo tracking.
     *
     * @param {number} domColIdx - The DOM/visual column index to show the gripper for.
     * @param {boolean} [isFirstCol=false] - Indicates if the column is the first column, triggering popup options.
     * @returns {void}
     *
     * @hidden
     */
    public showColGripperForDomCol(domColIdx: number, isFirstCol: boolean = false): void {
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;

        // 1. Get top cell for popup positioning (header if exists, else first body)
        let topCell: HTMLTableCellElement;
        if (props.enableHeader) {
            const headerCells: NodeListOf<Element> = this.table.querySelectorAll('thead th:not(.e-row-number)');
            topCell = headerCells[parseInt(domColIdx.toString(), 10)] as HTMLTableCellElement;
        } else {
            topCell = getDataCell(this.table, 0, domColIdx) as HTMLTableCellElement;
        }

        // 2. Get target cell for focus + pinned bar positioning (body cell, or header if no body logic needed)
        const headerCell: HTMLTableCellElement = props.enableHeader
            ? (this.table.querySelectorAll('thead th:not(.e-row-number)')[parseInt(domColIdx.toString(), 10)] as HTMLTableCellElement)
            : null;

        const targetCell: HTMLTableCellElement = getDataCell(this.table, (headerCell ? 1 : 0), domColIdx) as HTMLTableCellElement;
        const cellBlock: HTMLElement = targetCell.querySelector('.e-block') as HTMLElement;
        const cellRect: DOMRect = targetCell.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;

        // Add column selection without clearing others
        this.addColumnSelection(this.table, domColIdx);
        // add e-cell-focus class to selected col cells
        this.focusCellsInColumns([domColIdx]);

        // Focus
        setCursorPosition(getBlockContentElement(cellBlock), 0);
        this.parent.setFocusToBlock(cellBlock);

        let colPinnedLeftOffset: number = cellRect.left - blockRect.left;
        let colPinnedWidth: number = cellRect.width;

        if (headerCell) {
            const headerRect: DOMRect = headerCell.getBoundingClientRect() as DOMRect;
            const headerBorderValue: number = Math.round(parseFloat(getComputedStyle(headerCell).borderWidth));
            colPinnedLeftOffset = (headerRect.left - headerBorderValue) - blockRect.left;
            colPinnedWidth = headerRect.width + headerBorderValue;
        }

        // Create and position pinned bar
        const colPinned: HTMLElement = this.createPinnedColBar();
        colPinned.style.left = `${colPinnedLeftOffset}px`;
        colPinned.style.width = `${colPinnedWidth}px`;
        colPinned.classList.add('e-action-bar-active');
        colPinned.style.display = 'flex';
        colPinned.dataset.colIndex = domColIdx.toString();
        this.blockElement.appendChild(colPinned);
        this.colPinned = colPinned;

        colPinned.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const clickedDomColIdx: number = parseInt(colPinned.dataset.colIndex, 10);

            // Focus only this column (clear others + re-apply this one)
            this.focusSinglePinnedColumn(clickedDomColIdx);
        });

        // Hide regular handles
        this.colActionHandle.style.display = 'none';
        if (isFirstCol){
            this.showGripperPopup(this.colActionHandle, colPinned, this.blockModel, {
                label: 'Delete Column',
                iconCss: 'e-trash',
                callback: () => { this.deleteSelectedColumns(); }
            });
        }
    }

    public deleteSelectedColumns(): void {
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        const selectedCells: NodeListOf<HTMLTableCellElement> = this.blockElement.querySelectorAll('td.e-col-selected, th.e-col-selected');
        const uniqueColIndices: Set<number> = new Set<number>();
        selectedCells.forEach((cell: HTMLTableCellElement) => {
            const colIdx: number = parseInt((cell as HTMLElement).dataset.col || '-1', 10);
            if (colIdx >= 0) { uniqueColIndices.add(colIdx); }
        });
        const selectedCount: number = uniqueColIndices.size;
        const totalDataColumns: number = props.columns.length;
        if (selectedCount === totalDataColumns && totalDataColumns > 0) {
            // Full table columns selected → delete entire block directly
            const block: BlockModel = getBlockModelById(this.blockId, this.parent.getEditorBlocks());
            const blockElement: HTMLElement = this.parent.getBlockElementById(this.blockId);
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.parent.setFocusAndUIForNewBlock(adjacentBlock);
            }
            if (block && blockElement) {
                this.parent.lastHighlightedBlockId = this.blockId;
                this.parent.execCommand({
                    command: 'DeleteBlock',
                    state: {
                        blockElement,
                        isUndoRedoAction: false,
                        preventMinimumOne: true,
                        preventEventTrigger: false
                    }
                });
            }
            return;
        }
        const sortedIndices: number[] = Array.from(uniqueColIndices).sort((a: number, b: number) => b - a);
        if (sortedIndices.length > 1) {
            const colsMeta: Array<{ index: number; columnModel: TableColumnModel; columnCells: TableCellModel[] }> = [];
            sortedIndices.forEach((dataColIdx: number) => {
                const colModel: TableColumnModel = props.columns[parseInt(dataColIdx.toString(), 10)];
                const columnCells: TableCellModel[] = props.rows.map((r: TableRowModel) => {
                    const cell: TableCellModel = r.cells[parseInt(dataColIdx.toString(), 10)];
                    return decoupleReference(cell);
                });
                colsMeta.push({
                    index: dataColIdx,
                    columnModel: decoupleReference(colModel),
                    columnCells
                });
            });

            this.parent.undoRedoAction.trackBulkColumnDeletionForUndoRedo({
                blockId: this.blockId,
                cols: colsMeta
            });

            sortedIndices.forEach((dataColIdx: number) => {
                this.parent.tableService.deleteColumnAt({
                    blockId: this.blockId,
                    colIndex: dataColIdx,
                    isUndoRedoAction: true
                });
            });
        } else if (sortedIndices.length === 1) {
            // Single column — normal deletion
            this.parent.tableService.deleteColumnAt({
                blockId: this.blockId,
                colIndex: sortedIndices[0]
            });
        }
    }

    private focusSinglePinnedColumn(domColIdx: number): void {
        // Clear everything first
        this.resetAllTableSelectionUI();

        // Re-select only the clicked column
        this.addColumnSelection(this.table, domColIdx);
        this.focusCellsInColumns([domColIdx]);

        // Re-show gripper + popup for the clicked column
        this.showColGripperForDomCol(domColIdx, true);

        // Refocus the first body cell in that column (or header if no body)
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        const startRow: number = props.enableHeader ? 1 : 0; // skip header if present
        const rowEl: HTMLTableRowElement = this.table.tBodies[0].rows[parseInt(startRow.toString(), 10)];
        const domCol: number = toDomCol(domColIdx, props.enableRowNumbers);
        const cell: HTMLTableCellElement = rowEl.cells[parseInt(domCol.toString(), 10)];

        this.parent.tableService.removeCellFocus(this.table);
        this.parent.tableService.addCellFocus(cell as HTMLElement, true);
        const cellBlock: HTMLElement = cell.querySelector('.e-block') as HTMLElement;

        setCursorPosition(getBlockContentElement(cellBlock), 0);
        this.parent.setFocusToBlock(cellBlock);
    }

    /**
     * Adds a selection state to the specified row in the table.
     * Does not clear previous selections, allowing multiple rows to be selected.
     *
     * @param {HTMLTableElement} table - The table element containing the row.
     * @param {number} rowIndex - The index of the row to mark as selected.
     * @returns {void}
     *
     * @hidden
     */
    public addRowSelection(table: HTMLTableElement, rowIndex: number): void {
        // Add selection without removing previous
        if (rowIndex == null || rowIndex < 0) { return; }
        const row: HTMLTableRowElement = table.rows[rowIndex as number] as HTMLTableRowElement;
        if (row) { row.classList.add('e-row-selected'); }
    }

    private createPinnedRowBar(): HTMLElement {
        const pinned: HTMLElement = createElement('div', { className: 'e-row-action-handle e-pinned e-action-handle', attrs: { contenteditable: 'false', 'data-icon-type': 'row' } }) as HTMLElement;
        const pinnedIcon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        pinned.appendChild(pinnedIcon);
        return pinned;
    }

    /**
     * Hides all pinned row grippers from the table block element.
     * Removes pinned row action handles from the DOM and restores the default row action handle display.
     *
     * @returns {void}
     *
     * @hidden
     */
    public hideRowGripper(): void {
        const allPinnedRows: NodeListOf<Element> = this.blockElement.querySelectorAll('.e-row-action-handle.e-pinned');
        allPinnedRows.forEach((pinned: Element) => {
            pinned.parentElement.removeChild(pinned);
        });

        if (this.rowActionHandle) {
            this.rowActionHandle.style.display = 'none';
        }
    }

    // 6) Row/Col action handle wiring
    private wireActionHandles(): void {
        // Row action
        this.rowActionHandle.addEventListener('click', (e: MouseEvent) => {
            if (this.rowInsertHandle.style.display !== 'none') { return; }
            e.preventDefault();
            const domRowIdx: number = parseInt(this.rowActionHandle.dataset.rowIndex, 10);
            if (e.shiftKey) {
                let start: number;
                let end: number;
                // Case 1: Anchor already set from previous gripper click
                if (this.lastRowAnchorIndex !== null) {
                    start = Math.min(this.lastRowAnchorIndex, domRowIdx);
                    end   = Math.max(this.lastRowAnchorIndex, domRowIdx);
                }
                // Case 2: No anchor → fall back to currently selected rows (mouse drag / Shift+Arrow)
                else {
                    const selectedRows: NodeListOf<HTMLTableRowElement> = this.table.querySelectorAll('tr.e-row-selected');
                    if (selectedRows.length === 0) {
                        // No existing selection → treat as normal single click
                        start = end = domRowIdx;
                    } else {
                        const indices: number[] = Array.from(selectedRows).map((tr: HTMLTableRowElement) => parseInt(tr.dataset.row, 10));
                        start = Math.min(...indices, domRowIdx);
                        end   = Math.max(...indices, domRowIdx);
                    }
                }
                this.removeRowColSelection(this.table);
                this.hideRowGripper();
                this.hideAllPinnedColBars();
                this.parent.tableService.removeCellFocus(this.table);
                let isFirst: boolean = true;
                for (let rowIndex: number = start; rowIndex <= end; rowIndex++) {
                    if (!this.hasPinnedRowGripper(rowIndex)) {
                        this.showRowGripperForDomRow(rowIndex, isFirst);
                        isFirst = false;
                    }
                }
            }
            else {
                // Normal single click (unchanged)
                this.resetAllTableSelectionUI();
                this.showRowGripperForDomRow(domRowIdx, true);
                // Remember this row as anchor for next Shift+click
                this.lastRowAnchorIndex = domRowIdx;
            }
        });

        // Column action
        this.colActionHandle.addEventListener('mousedown', (e: MouseEvent) => e.preventDefault());
        this.colActionHandle.addEventListener('click', (e: MouseEvent) => {
            if (this.colInsertHandle.style.display !== 'none') { return; }
            e.preventDefault();
            const domColIdx: number = parseInt(this.colActionHandle.dataset.colIndex, 10);
            if (e.shiftKey) {
                let start: number;
                let end: number;

                // Case 1: Anchor already set from previous gripper click
                if (this.lastColAnchorIndex !== null) {
                    start = Math.min(this.lastColAnchorIndex, domColIdx);
                    end   = Math.max(this.lastColAnchorIndex, domColIdx);
                }
                // Case 2: No anchor → fall back to currently selected columns (mouse drag / Shift+Arrow)
                else {
                    const selectedColCells: NodeListOf<HTMLTableCellElement> = this.table.querySelectorAll('td.e-col-selected, th.e-col-selected');
                    if (selectedColCells.length === 0) {
                        // No existing selection → treat as normal single click
                        start = end = domColIdx;
                    } else {
                        const indices: number[] = [];
                        const colMap: Set<number> = new Set<number>(); // to deduplicate
                        Array.from(selectedColCells).forEach((cell: HTMLTableCellElement) => {
                            const col: number = parseInt(cell.dataset.col, 10);
                            if (!colMap.has(col)) {
                                colMap.add(col);
                                indices.push(col);
                            }
                        });
                        start = Math.min(...indices, domColIdx);
                        end   = Math.max(...indices, domColIdx);
                    }
                }
                this.resetAllTableSelectionUI();
                let isFirst: boolean = true;
                for (let colIndex: number = start; colIndex <= end; colIndex++) {
                    if (!this.hasPinnedColGripper(colIndex)) {
                        this.showColGripperForDomCol(colIndex, isFirst);
                        isFirst = false;
                    }
                }
            }
            else {
                // Normal single click (unchanged)
                this.resetAllTableSelectionUI();
                this.showColGripperForDomCol(domColIdx, true);
                // Remember this column as anchor for next Shift+click
                this.lastColAnchorIndex = domColIdx;
            }
        });
    }

    private hasPinnedColGripper(colIndex: number): boolean {
        return !!this.blockElement.querySelector(`.e-col-action-handle.e-pinned[data-col-index="${colIndex}"]`);
    }

    private hasPinnedRowGripper(rowIndex: number): boolean {
        return !!this.blockElement.querySelector(`.e-row-action-handle.e-pinned[data-row-index="${rowIndex}"]`);
    }

    /**
     * Adds a selection state to the specified column in the table.
     * Does not clear previous selections, allowing multiple columns to be selected.
     *
     * @param {HTMLTableElement} table - The table element containing the column.
     * @param {number} colIndex - The index of the column to mark as selected.
     * @returns {void}
     *
     * @hidden
     */
    public addColumnSelection(table: HTMLTableElement, colIndex: number): void {
        if (colIndex == null || colIndex < 0) { return; }

        Array.from(table.rows).forEach((r: HTMLTableRowElement) => {
            const cells: HTMLElement[] = Array.from(r.cells).filter(
                (cell: HTMLElement) => !cell.classList.contains('e-row-number')
            );
            if (cells[parseInt(colIndex.toString(), 10)]) {
                cells[parseInt(colIndex.toString(), 10)].classList.add('e-col-selected');
            }
        });
    }

    private createPinnedColBar(): HTMLElement {
        const pinned: HTMLElement = createElement('div', {
            className: 'e-col-action-handle e-pinned e-action-handle',
            attrs: { contenteditable: 'false', 'data-icon-type': 'col' }
        }) as HTMLElement;
        const icon: HTMLElement = createElement('span', { className: 'e-icons e-block-drag-icon' }) as HTMLElement;
        icon.style.transform = 'rotate(90deg)';
        pinned.appendChild(icon);
        return pinned;
    }

    /**
     * Removes all pinned column bars from the table block element.
     * Queries for pinned column action handles and deletes them from the DOM.
     *
     * @returns {void}
     *
     * @hidden
     */
    public hideAllPinnedColBars(): void {
        const allPinnedCols: NodeListOf<HTMLElement> = this.blockElement.querySelectorAll('.e-col-action-handle.e-pinned');
        allPinnedCols.forEach((el: HTMLElement) => el.remove());
    }

    // 7) Table focus, mouseleave, and outside-click cleanup
    private wireFocusAndCleanup(): void {
        this.table.addEventListener('focusin', () => {
            this.removeRowColSelection(this.table);
            this.rowPinned.style.display = 'none';
            this.colPinned.style.display = 'none';
        });

        this.blockElement.addEventListener('mouseleave', () => {
            this.hideRowUI();
            this.hideColUI();
            this.hideHitZones();

            this.rowTopDot.style.visibility = '';
            this.rowBottomDot.style.visibility = '';
            this.colLeftDot.style.visibility = '';
            this.colRightDot.style.visibility = '';
            this.colResizeHandle.style.display = 'none';
        });

        this.table.addEventListener('mousedown', (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const cell: HTMLTableCellElement | Element = target.closest('td, th');
            if (!cell || (cell && cell.classList.contains('e-row-number'))) { return; }
            if (cell.classList.contains('e-cell-focus')) {
                const selectedCells: NodeListOf<HTMLTableCellElement> = getSelectedCells(
                    this.blockElement
                );
                if (selectedCells && selectedCells.length === 1) { return; }
            }
            this.parent.tableService.removeCellFocus(this.table);
            this.parent.tableService.addCellFocus(cell as HTMLElement, true);
            this.hideRowGripper();
            this.hideAllPinnedColBars();
        });

        const onDocClick: (e: MouseEvent) => void = (e: MouseEvent) => {
            const t: HTMLElement = e.target as HTMLElement;
            const inside: boolean = !!t.closest(`table.e-table-element[data-block-id="${this.blockId}"]`);
            const blkEl: HTMLElement = t.closest('.e-table-block') as HTMLElement;
            const tableSlashItem: HTMLElement = t.closest('.e-list-item[data-value="Table"]') as HTMLElement;
            if (inside || (blkEl && blkEl.contains(t)) || tableSlashItem) { return; }

            this.removeRowColSelection(this.table);
            document.querySelectorAll('.e-row-action-handle.e-pinned').forEach((node: HTMLElement) => (node.style.display = 'none'));
            document.querySelectorAll('.e-col-action-handle.e-pinned').forEach((node: HTMLElement) => (node.style.display = 'none'));

            if (this.parent.tableService) {
                this.parent.tableService.removeCellFocus(this.table);
            }
        };
        document.addEventListener('click', onDocClick);
    }

    // 8) Observers and sync helpers
    private wireObservers(): void {
        const RO: any = (window as any).ResizeObserver;
        if (RO) {
            const ro: any = new RO(() => { this.syncRowUI(); });
            ro.observe(this.table);
            Array.from(this.table.rows).forEach((r: HTMLTableRowElement) => ro.observe(r));
            Array.from(this.table.querySelectorAll('th')).forEach((th: Element) => ro.observe(th as HTMLElement));
        }
        this.parent.observer.on('handleEscapeKey', this.handleEscapeAction, this);
    }

    // 9) Column resize wiring
    private wireColResize(): void {
        let startMouseX: number = 0;
        let initialColumnWidthPx: number = 0;
        let initialHoverLineLeft: number = 0;
        let resizingColumnIndex: number = -1; // data index of the column being resized
        let tableRect: DOMRect;
        let blockRect: DOMRect;

        // Clamp width and compute hover line position
        const computeResizedValues: (deltaX: number) => number = (deltaX: number): number => {
            const unclampedWidth: number = initialColumnWidthPx + deltaX;
            const newWidthPx: number = Math.max(constants.TABLE_COL_MIN_WIDTH, unclampedWidth);
            return newWidthPx;
        };

        const onMouseMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
            if (!this.isResizing) { return; }
            e.preventDefault();
            this.hideColUI();

            const deltaX: number = (e.clientX + this.tableContainer.scrollLeft) - startMouseX;
            const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
            const colgroup: HTMLTableColElement = this.table.querySelector('colgroup') as HTMLTableColElement;
            const domColIndex: number = toDomCol(resizingColumnIndex, props.enableRowNumbers);

            const newWidthPx: number = computeResizedValues(deltaX);

            // Update left column width (Only DOM here)
            const leftColEl: HTMLTableColElement = colgroup.children[domColIndex as number] as HTMLTableColElement;
            leftColEl.style.width = `${newWidthPx.toFixed(0)}px`;

            // Update hover line
            this.colHoverLine.style.display = 'block';
            this.colHoverLine.style.left = `${leftColEl.getBoundingClientRect().right - blockRect.left - 2}px`;
            this.colHoverLine.style.height = this.table.getBoundingClientRect().height - 2 + 'px';

            this.colResizeHandle.style.left = `${leftColEl.getBoundingClientRect().right - blockRect.left - 2}px`;
            this.colHoverLine.style.display = 'block';

            // Shrink table width when dragging left
            if (deltaX < 0) {
                const currentTableWidth: number = this.table.offsetWidth;
                this.table.style.width = `${currentTableWidth + deltaX}px`;
            }
        };

        const onMouseUp: (e: MouseEvent) => void = (e: MouseEvent): void => {
            if (!this.isResizing) { return; }

            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const deltaX: number = (e.clientX + this.tableContainer.scrollLeft) - startMouseX;
            if (deltaX === 0) {
                this.colHoverLine.style.display = 'none';
                setResizeStatus(false);
                return;
            }

            const newWidthPx: number = computeResizedValues(deltaX);
            const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
            const oldBlock: BlockModel = decoupleReference(getBlockModelById(this.blockId, this.parent.getEditorBlocks()));

            // Final update
            const colgroup: HTMLTableColElement = this.table.querySelector('colgroup') as HTMLTableColElement;
            const domColIndex: number = toDomCol(resizingColumnIndex, props.enableRowNumbers);
            const leftColEl: HTMLTableColElement = colgroup.children[domColIndex as number] as HTMLTableColElement;

            leftColEl.style.width = `${newWidthPx.toFixed(0)}px`;
            props.columns[resizingColumnIndex as number].width = `${newWidthPx.toFixed(0)}px`;

            this.colHoverLine.style.display = 'none';
            setResizeStatus(false);

            // Notify changes and track
            this.parent.tableService.triggerBlockUpdate(this.blockModel, oldBlock);
            this.parent.undoRedoAction.trackTableColumnResizeForUndoRedo({
                blockId: this.blockId,
                resizedColIndex: resizingColumnIndex,
                oldWidthValue: initialColumnWidthPx,
                newWidthValue: newWidthPx
            });
        };

        // Start resize
        this.colResizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
            const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
            if (props.readOnly) { return; }

            e.preventDefault();
            this.clearPinnedGripperSelection();
            this.hideColUI();
            this.hideRowUI();
            this.parent.tableService.removeCellFocus(this.table);

            const colIndexAttr: string = this.colResizeHandle.getAttribute('data-resize-index');
            if (!colIndexAttr) { return; }

            resizingColumnIndex = parseInt(colIndexAttr, 10);

            // Switch to px mode if not already
            if (this.table.getAttribute('data-col-width-mode') !== 'px') {
                this.convertColgroupToPxMode();
            }

            tableRect = this.table.getBoundingClientRect() as DOMRect;
            blockRect = this.blockElement.getBoundingClientRect() as DOMRect;

            const colgroup: HTMLTableColElement = this.table.querySelector('colgroup') as HTMLTableColElement;
            const domColIndex: number = toDomCol(resizingColumnIndex, props.enableRowNumbers);
            const columnEl: HTMLTableColElement = colgroup.children[domColIndex as number] as HTMLTableColElement;

            initialColumnWidthPx = columnEl.getBoundingClientRect().width;
            startMouseX = e.clientX + this.tableContainer.scrollLeft;
            initialHoverLineLeft = columnEl.getBoundingClientRect().right - blockRect.left - 2;

            // Show hover line
            this.colHoverLine.style.top = `${tableRect.top - blockRect.top}px`;
            this.colHoverLine.style.height = `${tableRect.height - 2}px`;
            this.colHoverLine.style.left = `${initialHoverLineLeft}px`;
            this.colHoverLine.style.display = 'block';

            this.colResizeHandle.style.left = `${initialHoverLineLeft}px`;
            this.colHoverLine.style.display = 'block';

            document.body.style.userSelect = 'none';
            setResizeStatus(true);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Hide UI elements on horizontal scroll
        this.table.parentElement.addEventListener('scroll', () => {
            this.hideColUI();
            this.hideRowUI();
            this.hideHitZones();
            this.clearPinnedGripperSelection();
        });

        const setResizeStatus: (value: boolean) => void = (value: boolean) => {
            this.isResizing = value;
            this.table.setAttribute('data-resizing', value ? 'true' : 'false');
        };
    }

    private convertColgroupToPxMode(): void {
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        const colgroup: HTMLTableColElement = this.table.querySelector('colgroup') as HTMLTableColElement;

        props.columns.forEach((col: TableColumnModel , i: number) => {
            const domIdx: number = toDomCol(i, props.enableRowNumbers);
            const colEl: HTMLTableColElement = colgroup.children[domIdx as number] as HTMLTableColElement;
            const currentWidthPx: number = colEl.getBoundingClientRect().width;
            const pxWidth: string = currentWidthPx.toFixed(0);
            colEl.style.width = `${pxWidth}px`;
            col.width = `${pxWidth}px`;
        });

        setTableWidthMode(this.table, 'px');
        this.parent.observer.on('handleEscapeKey', this.handleEscapeAction, this);
    }

    private syncRowUI(): void {
        if (!this.hoveredRow || (this.table && this.table.querySelectorAll('tr.e-row-selected').length > 1)) { return; }
        const rowRect: DOMRect = this.hoveredRow.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;
        const xLeft: number = this.table.offsetLeft - 8;
        this.rowTopDot.style.left = `${xLeft - 4}` + 'px';
        this.rowBottomDot.style.left = `${xLeft - 4}` + 'px';
        this.rowTopDot.style.top = `${rowRect.top - blockRect.top - 3}` + 'px';
        this.rowBottomDot.style.top = `${rowRect.bottom - blockRect.top - 3}` + 'px';

        if (this.rowActionHandle.style.display !== 'none') {
            this.rowActionHandle.style.top = `${rowRect.top - blockRect.top}` + 'px';
            this.rowActionHandle.style.height = `${rowRect.height}` + 'px';
        }

        const pinnedRow: HTMLElement = this.blockElement.querySelector('.e-row-action-handle.e-pinned') as HTMLElement;
        if (pinnedRow && pinnedRow.style.display !== 'none') {
            pinnedRow.style.top = `${rowRect.top - blockRect.top}` + 'px';
            pinnedRow.style.height = `${rowRect.height}` + 'px';
        }
    }

    private hideRowUI(): void {
        this.rowInsertHandle.style.display = 'none';
        this.rowHoverLine.style.display = 'none';
        this.rowActionHandle.style.display = 'none';
        this.rowTopDot.style.display = 'none';
        this.rowBottomDot.style.display = 'none';
    }

    private hideColUI(): void {
        this.colInsertHandle.style.display = 'none';
        this.colHoverLine.style.display = 'none';
        this.colActionHandle.style.display = 'none';
        this.colLeftDot.style.display = 'none';
        this.colRightDot.style.display = 'none';
    }

    private hideHitZones(): void {
        [this.rowTopHit, this.rowBottomHit, this.colLeftHit, this.colRightHit].forEach((el: HTMLElement) => el.style.display = 'none');
    }

    /**
     * Removes all row and column selection states from the given table.
     * Clears the `e-row-selected` class from rows and the `e-col-selected` class from cells.
     *
     * @param {HTMLTableElement} table - The table element to clear selections from.
     * @returns {void}
     *
     * @hidden
     */
    public removeRowColSelection(table: HTMLTableElement): void {
        Array.from(table.rows).forEach((r: HTMLTableRowElement) => r.classList.remove('e-row-selected'));
        Array.from(table.querySelectorAll('td, th')).forEach((c: HTMLTableCellElement) => {
            const cell: HTMLTableCellElement = c as HTMLTableCellElement;
            cell.classList.remove('e-col-selected');
        });
        this.lastRowAnchorIndex = null;
        this.lastColAnchorIndex = null;
    }

    private clearPinnedGripperSelection(): void {
        // Clear selections
        this.removeRowColSelection(this.table);
        // hide pinned handles
        this.rowPinned.style.display = 'none';
        this.rowPinned.classList.remove('e-action-bar-active');
        this.colPinned.style.display = 'none';
        this.colPinned.classList.remove('e-action-bar-active');
        this.lastRowAnchorIndex = null;
        this.lastColAnchorIndex = null;
    }

    private showGripperPopup(
        actionHandle: HTMLElement,
        pinnedActionHandle: HTMLElement,
        blockModel: BlockModel,
        action: { label: string; iconCss: string; callback: () => void }
    ): void {
        const existingPopup: HTMLElement | null = this.parent.rootEditorElement.querySelector('.e-table-gripper-action-popup');
        if (existingPopup && existingPopup.parentElement) {
            existingPopup.parentElement.removeChild(existingPopup);
        }
        const popup: HTMLElement = createElement('div', {
            className: 'e-table-gripper-action-popup'
        }) as HTMLElement;
        this.parent.rootEditorElement.appendChild(popup);

        const item: HTMLElement = createElement('div', {
            className: `e-table-gripper-action-item e-icons ${action.iconCss}`
        }) as HTMLElement;
        item.setAttribute('title', 'Delete');

        item.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            try {
                action.callback();
            } finally {
                // Cleanup
                if (this.popupObj && this.parent && this.parent.popupRenderer) {
                    this.popupObj.hide();
                    this.parent.popupRenderer.destroyPopup(this.popupObj);
                    this.popupObj = null;
                }
                actionHandle.style.display = 'none';
                pinnedActionHandle.style.display = 'none';
                this.hideRowGripper();
                this.hideAllPinnedColBars();
            }
        });
        popup.appendChild(item);
        const iconType: string = actionHandle.getAttribute('data-icon-type');
        const args: IPopupRenderOptions = {
            element: popup,
            content: item,
            width: 'auto',
            height: 'auto',
            relateTo: actionHandle,
            position: { X: 'left', Y: 'top' },
            offsetX: iconType === 'col' ? 20 : -11,
            offsetY: iconType === 'col' ? -8 : 21
        };

        this.popupObj = this.parent.popupRenderer.renderPopup(args);
        this.popupObj.show();
        this.parent.popupRenderer.adjustPopupPositionRelativeToTarget(pinnedActionHandle, this.popupObj);

        const removePopup: (e: MouseEvent) => void = (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            // Find the current popup from DOM (not from closure)
            const currentPopup: HTMLElement = this.parent.rootEditorElement.querySelector('.e-table-gripper-action-popup') as HTMLElement;
            if (currentPopup && !currentPopup.contains(target) && !target.closest('.e-action-handle')) {
                this.handleRemovePopup();
                document.removeEventListener('mousedown', removePopup);
            }
        };
        document.addEventListener('mousedown', removePopup);
    }

    /**
     * Handles removal of the active popup instance.
     * Hides the popup, destroys it via the parent renderer, and clears the reference.
     *
     * @returns {void}
     *
     * @hidden
     */
    public handleRemovePopup(): void {
        if (this.popupObj && this.parent && this.parent.popupRenderer) {
            this.popupObj.hide();
            this.parent.popupRenderer.destroyPopup(this.popupObj);
            this.popupObj = null;
        }
    }

    private handleEscapeAction(): void {
        this.handleRemovePopup();
        const isColumnGripper: boolean = this.colPinned.classList.contains('e-action-bar-active');
        const isRowGripper: boolean = this.rowPinned.classList.contains('e-action-bar-active');
        if (isColumnGripper) {
            const focusCell: HTMLElement = this.table.querySelector('thead th.e-col-selected');
            if (focusCell) {
                this.parent.tableService.addCellFocus(focusCell, true);
            }
        }
        else if (isRowGripper) {
            const selectedRow: HTMLElement = this.table.querySelector('.e-row-selected');
            if (selectedRow) {
                const focusCell: HTMLElement = selectedRow.querySelector('td:not(.e-row-number)');
                this.parent.tableService.addCellFocus(focusCell, true);
            }
        }
        this.clearPinnedGripperSelection();
    }

    private focusCellsInRows(rowIndices: number[]): void {
        rowIndices.forEach((rowIndex: number) => {
            const row: HTMLTableRowElement = this.table.rows[parseInt(rowIndex.toString(), 10)];
            if (!row) { return; }
            Array.from(row.cells).forEach((cell: HTMLTableCellElement) => {
                if (!cell.classList.contains('e-row-number')) {
                    cell.classList.add(constants.TABLE_CELL_FOCUS);
                }
            });
        });
    }

    private focusCellsInColumns(colIndices: number[]): void {
        const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
        const enableRowNumbers: boolean = props.enableRowNumbers;

        colIndices.forEach((colIndex: number) => {
            const domCol: number = toDomCol(colIndex, enableRowNumbers);
            for (let r: number = 0; r < this.table.rows.length; r++) {
                const cell: HTMLTableCellElement = this.table.rows[parseInt(r.toString(), 10)].cells[parseInt(domCol.toString(), 10)];
                if (cell && !cell.classList.contains('e-row-number')) {
                    cell.classList.add(constants.TABLE_CELL_FOCUS);
                }
            }
        });
    }

    /**
     * Resets all row/column selection UI states: clears visual selection classes,
     * hides floating and pinned grippers (both row and column), and removes cell focus.
     * @returns {void}
     *
     * @hidden
     */
    public resetAllTableSelectionUI(): void {
        this.removeRowColSelection(this.table);         // clears .e-row-selected / .e-col-selected
        this.hideRowGripper();                          // hides floating row gripper
        this.hideAllPinnedColBars();                    // hides floating column grippers
        this.parent.tableService.removeCellFocus(this.table);  // removes .e-cell-focus from all cells
    }

    public destroy(): void {
        this.rowInsertHandle = null;
        this.rowActionHandle = null;
        this.rowHoverLine = null;
        this.rowTopDot = null;
        this.rowBottomDot = null;
        this.colInsertHandle = null;
        this.colActionHandle = null;
        this.colHoverLine = null;
        this.colLeftDot = null;
        this.colRightDot = null;
        this.rowPinned = null;
        this.colPinned = null;
        this.rowTopHit = null;
        this.rowBottomHit = null;
        this.colLeftHit = null;
        this.colRightHit = null;

        // State
        this.hoveredRow = null;
        this.hoveredColIndex = null;
        this.isMultiSelecting = null;

        // Instance
        if (this.popupObj) {
            this.parent.popupRenderer.destroyPopup(this.popupObj);
            this.popupObj = null;
        }
        this.parent.observer.off('handleEscapeKey', this.handleEscapeAction);
    }
}

import { createElement } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { BlockManager } from '../../base/block-manager';
import { BlockModel, ITableBlockSettings } from '../../../models/index';
import { IPopupRenderOptions } from '../../../common';
import { getDataCell, toModelRow } from '../../../common/utils/index';

export class TableUIManager {
    private parent: BlockManager;

    // Refs set during init
    private table: HTMLTableElement;
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

    // State
    private hoveredRow: HTMLTableRowElement | null = null;
    private hoveredColIndex: number | null = null;
    private isMultiSelecting: boolean = false;

    // Instance
    public popupObj: Popup;

    constructor(parent: BlockManager) { this.parent = parent; }

    public init(
        table: HTMLTableElement,
        blockElement: HTMLElement,
        blockModel: BlockModel
    ): void {
        this.table = table;
        this.blockElement = blockElement;
        this.blockModel = blockModel;
        this.blockId = table.getAttribute('data-block-id');

        this.createUiElements();
        this.mountUiElements();
        this.wireDelegatedMousemove();
        this.wireRowInsert();
        this.wireActionHandles();
        this.wireColInsert();
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
    }

    // 2) Mount elements to block element in the same order
    private mountUiElements(): void {
        [this.rowInsertHandle, this.rowHoverLine, this.rowActionHandle, this.rowTopDot, this.rowBottomDot, this.colInsertHandle,
            this.colHoverLine, this.colActionHandle, this.colLeftDot, this.colRightDot, this.rowPinned, this.colPinned]
            .forEach((el: HTMLElement) => this.blockElement.appendChild(el));

        [this.rowTopHit, this.rowBottomHit, this.colLeftHit, this.colRightHit]
            .forEach((el: HTMLElement) => this.blockElement.appendChild(el));
    }

    // 3) Delegated mouse move handling (exact logic preserved)
    private wireDelegatedMousemove(): void {
        this.table.addEventListener('mousemove', (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            if (this.isMultiSelecting || !target.closest('td, th') || target.matches('th.e-row-number')) {
                this.hideRowUI(this.rowInsertHandle, this.rowHoverLine, this.rowActionHandle, this.rowTopDot, this.rowBottomDot);
                this.hideColUI(this.colInsertHandle, this.colHoverLine, this.colActionHandle, this.colLeftDot, this.colRightDot);
                [this.rowTopHit, this.rowBottomHit, this.colLeftHit, this.colRightHit].forEach((el: HTMLElement) => el.style.display = 'none');
                return;
            }

            // Row positioning (dots only)
            const row: HTMLTableRowElement = target.closest('tr');
            this.hoveredRow = row;
            const rowRect: DOMRect = row.getBoundingClientRect() as DOMRect;
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;

            this.rowActionHandle.dataset.rowIndex = Array.from(this.table.rows).indexOf(row).toString();
            this.rowActionHandle.style.top = rowRect.top - blockRect.top + 'px';
            this.rowActionHandle.style.height = `${rowRect.height}` + 'px';
            this.rowActionHandle.style.display = target.tagName === 'TH' ? 'none' : 'flex';

            // Show row dots at left side (top and bottom of row)
            const xLeft: number = this.table.offsetLeft - 8;
            this.rowTopDot.style.left = `${xLeft}` + 'px';
            this.rowBottomDot.style.left = `${xLeft}` + 'px';
            this.rowTopDot.style.top = `${rowRect.top - blockRect.top - 2}` + 'px';
            this.rowBottomDot.style.top = `${rowRect.bottom - blockRect.top - 2}` + 'px';
            this.rowTopDot.style.display = 'block';
            this.rowBottomDot.style.display = 'block';

            // Ignore row dots when hover over table header
            if (this.hoveredRow.querySelector('th')) {
                this.rowTopDot.style.display = 'none';
                this.rowBottomDot.style.display = 'none';
            }

            // Hit zones at left side for dot
            const xLeftHit: number = xLeft - 5;
            this.rowTopHit.style.left = `${xLeftHit}` + 'px';
            this.rowBottomHit.style.left = `${xLeftHit}` + 'px';
            this.rowTopHit.style.top = `${rowRect.top - blockRect.top - 9}` + 'px';
            this.rowBottomHit.style.top = `${rowRect.bottom - blockRect.top - 9}` + 'px';
            this.rowTopHit.style.display = 'block';
            this.rowBottomHit.style.display = 'block';

            // Column positioning (dots only)
            const cell: HTMLTableCellElement = target.closest('td, th') as HTMLTableCellElement;
            const isRowNumberCell: boolean = cell.classList.contains('e-row-number');
            const cellRect: DOMRect = cell.getBoundingClientRect() as DOMRect;
            const rowEl: HTMLTableRowElement = cell.parentElement as HTMLTableRowElement;
            const colIndex: number = Array.from(rowEl.cells).filter((c: HTMLElement) => !c.classList.contains('e-row-number')).indexOf(cell);
            this.hoveredColIndex = colIndex;

            const dotY: number = this.table.offsetTop - 8;
            const dotHalfWidth: number = 2;
            const borderValue: number = Math.round(parseFloat(getComputedStyle(cell).borderWidth));
            const leftColX: number = cellRect.left - blockRect.left - borderValue - dotHalfWidth;
            const rightColX: number = cellRect.right - blockRect.left - borderValue - dotHalfWidth;
            this.colLeftDot.style.left = `${leftColX}` + 'px';
            this.colRightDot.style.left = `${rightColX}` + 'px';
            this.colLeftDot.style.top = `${dotY}` + 'px';
            this.colRightDot.style.top = `${dotY}` + 'px';
            this.colLeftDot.style.display = 'block';
            this.colRightDot.style.display = 'block';

            if (cell.classList.contains('e-row-number')) {
                this.colLeftDot.style.display = 'none';
                this.colRightDot.style.display = 'none';
            }

            this.colLeftHit.style.left = `${leftColX - 5}` + 'px';
            this.colRightHit.style.left = `${rightColX - 5}` + 'px';
            this.colLeftHit.style.top = `${dotY - 7}` + 'px';
            this.colRightHit.style.top = `${dotY - 7}` + 'px';
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
            } else {
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
            const index: number = Array.from(tbody.rows).indexOf(this.hoveredRow as HTMLTableRowElement);

            this.rowHoverLine.style.top = `${(which === 'top' ? rowRect.top : rowRect.bottom) - blockRect.top - 2}` + 'px';
            this.rowHoverLine.style.left = `${this.table.offsetLeft}` + 'px';
            this.rowHoverLine.style.width = `${this.table.offsetWidth}` + 'px';
            this.rowHoverLine.style.display = 'block';

            const dotTop: HTMLElement = which === 'top' ? this.rowTopDot : this.rowBottomDot;
            const dotRect: DOMRect = dotTop.getBoundingClientRect() as DOMRect;
            this.rowInsertHandle.style.top = `${dotRect.top - blockRect.top - 7}` + 'px';
            this.rowInsertHandle.style.left = `${dotRect.left - blockRect.left - 11}` + 'px';
            this.rowInsertHandle.style.display = 'flex';
            dotTop.style.visibility = 'hidden';
            this.rowTopHit.style.display = 'none';
            this.rowBottomHit.style.display = 'none';
            this.rowInsertHandle.dataset.rowIndex = (which === 'top' ? index : index + 1).toString();
        };

        const hideRowLine: () => void = () => {
            this.rowHoverLine.style.display = 'none';
            this.rowInsertHandle.style.display = 'none';
            this.rowTopDot.style.visibility = '';
            this.rowBottomDot.style.visibility = '';
        };

        this.rowTopHit.addEventListener('mouseenter', () => showRowLine('top'));
        this.rowBottomHit.addEventListener('mouseenter', () => showRowLine('bottom'));
        this.rowInsertHandle.addEventListener('mouseleave', hideRowLine);

        this.rowInsertHandle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const index: number = parseInt(this.rowInsertHandle.dataset.rowIndex, 10);
            this.parent.tableService.addRowAt({
                blockId: this.blockElement.id,
                rowIndex: index
            });
            requestAnimationFrame(() => {
                this.hideRowUI(this.rowInsertHandle, this.rowHoverLine, this.rowActionHandle, this.rowTopDot, this.rowBottomDot);
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
            this.colHoverLine.style.top = `${this.table.offsetTop}` + 'px';
            this.colHoverLine.style.height = `${this.table.offsetHeight}` + 'px';
            this.colHoverLine.style.display = 'block';

            const dotEl: HTMLElement = side === 'left' ? this.colLeftDot : this.colRightDot;
            const dotRect: DOMRect = dotEl.getBoundingClientRect() as DOMRect;
            this.colInsertHandle.style.left = `${dotRect.left - blockRect.left - 7}` + 'px';
            this.colInsertHandle.style.top = `${dotRect.top - blockRect.top - 11}` + 'px';
            this.colInsertHandle.style.display = 'flex';
            dotEl.style.visibility = 'hidden';
            this.colLeftHit.style.display = 'none';
            this.colRightHit.style.display = 'none';

            this.colInsertHandle.dataset.colIndex = (side === 'right' ? (this.hoveredColIndex as number) + 1 : this.hoveredColIndex as number).toString();
        };

        const hideColLine: () => void  = () => {
            this.colHoverLine.style.display = 'none';
            this.colInsertHandle.style.display = 'none';
            this.colLeftDot.style.visibility = '';
            this.colRightDot.style.visibility = '';
        };

        this.colLeftHit.addEventListener('mouseenter', () => showColLine('left'));
        this.colRightHit.addEventListener('mouseenter', () => showColLine('right'));
        this.colInsertHandle.addEventListener('mouseleave', hideColLine);

        this.colInsertHandle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const index: number = parseInt(this.colInsertHandle.dataset.colIndex, 10);
            this.parent.tableService.addColumnAt({
                blockId: this.blockElement.id,
                colIndex: index
            });
            requestAnimationFrame(() => {
                this.hideColUI(this.colInsertHandle, this.colHoverLine, this.colActionHandle, this.colLeftDot, this.colRightDot);
            });
            this.colLeftHit.style.display = 'none';
            this.colRightHit.style.display = 'none';
            this.clearPinnedGripperSelection();
        });
    }

    // 6) Row/Col action handle wiring
    private wireActionHandles(): void {
        // Row action
        this.rowActionHandle.addEventListener('click', (e: MouseEvent) => {
            if (this.rowInsertHandle.style.display !== 'none') { return; }
            e.preventDefault();
            const domRowIdx: number = parseInt(this.rowActionHandle.dataset.rowIndex, 10);
            this.parent.tableService.removeCellFocus(this.table);
            this.applyRowSelection(this.table, domRowIdx);

            const rowEl: HTMLTableRowElement = this.table.rows[domRowIdx as number] as HTMLTableRowElement;
            const props: ITableBlockSettings = this.blockModel.properties as ITableBlockSettings;
            const modelIndex: number = toModelRow(domRowIdx, props.enableHeader);
            const rowRect: DOMRect = rowEl.getBoundingClientRect() as DOMRect;
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;

            this.rowPinned.style.top = `${Math.round(rowRect.top - blockRect.top - 1)}` + 'px';
            this.rowPinned.style.height = `${rowRect.height + 1}` + 'px';
            this.rowPinned.classList.add('e-action-bar-active');
            this.rowPinned.style.display = 'flex';

            this.rowActionHandle.style.display = 'none';
            this.colPinned.style.display = 'none';
            this.colPinned.classList.remove('e-action-bar-active');
            this.showGripperPopup(this.rowActionHandle, this.rowPinned, this.blockModel, {
                label: 'Delete Row', iconCss: 'e-trash', callback: () => {
                    this.parent.tableService.deleteRowAt({
                        blockId: this.blockElement.id,
                        modelIndex: modelIndex
                    });
                }
            });
        });

        // Column action
        this.colActionHandle.addEventListener('mousedown', (e: MouseEvent) => e.preventDefault());
        this.colActionHandle.addEventListener('click', (e: MouseEvent) => {
            if (this.colInsertHandle.style.display !== 'none') { return; }
            e.preventDefault();
            const domColIdx: number = parseInt(this.colActionHandle.dataset.colIndex, 10);
            this.parent.tableService.removeCellFocus(this.table);
            this.applyColumnSelection(this.table, domColIdx);

            const headerCell: HTMLTableCellElement = this.table.querySelectorAll('thead th:not(.e-row-number)')[domColIdx as number] as HTMLTableCellElement;
            const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;
            const cell: HTMLTableCellElement = getDataCell(this.table, 0, this.hoveredColIndex);
            const cellRect: DOMRect = cell.getBoundingClientRect() as DOMRect;
            const cellBorderValue: number = Math.round(parseFloat(getComputedStyle(cell).borderWidth));
            let colPinnedLeftOffset: number = (cellRect.left - cellBorderValue) - blockRect.left;
            let colPinnedWidth: number = cellRect.width + cellBorderValue;
            if (headerCell) {
                const headerRect: DOMRect = headerCell.getBoundingClientRect() as DOMRect;
                const headerBorderValue: number = Math.round(parseFloat(getComputedStyle(headerCell).borderWidth));
                colPinnedLeftOffset = (headerRect.left - headerBorderValue) - blockRect.left;
                colPinnedWidth = headerRect.width + headerBorderValue;
            }

            this.colPinned.style.left = `${colPinnedLeftOffset}` + 'px';
            this.colPinned.style.width = `${colPinnedWidth}` + 'px';
            this.colPinned.classList.add('e-action-bar-active');
            this.colPinned.style.display = 'flex';
            this.colActionHandle.style.display = 'none';
            this.rowPinned.style.display = 'none';
            this.rowPinned.classList.remove('e-action-bar-active');

            this.showGripperPopup(this.colActionHandle, this.colPinned, this.blockModel, {
                label: 'Delete Column', iconCss: 'e-trash', callback: () => {
                    this.parent.tableService.deleteColumnAt({
                        blockId: this.blockElement.id,
                        colIndex: domColIdx
                    });
                }
            });
        });
    }

    private clearPinnedGripperSelection(): void {
        // Clear selections
        this.applyRowSelection(this.table, -1);
        this.applyColumnSelection(this.table, -1);
        // hide pinned handles
        this.rowPinned.style.display = 'none';
        this.rowPinned.classList.remove('e-action-bar-active');
        this.colPinned.style.display = 'none';
        this.colPinned.classList.remove('e-action-bar-active');
    }

    // 7) Table focus, mouseleave, and outside-click cleanup
    private wireFocusAndCleanup(): void {
        this.table.addEventListener('focusin', () => {
            this.applyRowSelection(this.table, -1);
            this.applyColumnSelection(this.table, -1);
            this.rowPinned.style.display = 'none';
            this.colPinned.style.display = 'none';
        });

        this.blockElement.addEventListener('mouseleave', () => {
            this.hideRowUI(this.rowInsertHandle, this.rowHoverLine, this.rowActionHandle, this.rowTopDot, this.rowBottomDot);
            this.hideColUI(this.colInsertHandle, this.colHoverLine, this.colActionHandle, this.colLeftDot, this.colRightDot);
            [this.rowTopHit, this.rowBottomHit, this.colLeftHit, this.colRightHit].forEach((el: HTMLElement) => el.style.display = 'none');

            this.rowTopDot.style.visibility = '';
            this.rowBottomDot.style.visibility = '';
            this.colLeftDot.style.visibility = '';
            this.colRightDot.style.visibility = '';
        });

        this.table.addEventListener('mousedown', (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const cell: HTMLTableCellElement | Element = target.closest('td, th');
            if (!cell || (cell && cell.classList.contains('e-row-number'))) { return; }
            if (cell.classList.contains('e-cell-focus')) {
                const selectedCells: NodeListOf<HTMLTableCellElement> = this.parent.tableSelectionManager.getSelectedCells(
                    this.blockElement
                );
                if (selectedCells && selectedCells.length === 1) { return; }
            }
            this.parent.tableService.removeCellFocus(this.table);
            this.parent.tableService.addCellFocus(cell as HTMLElement, true);
        });

        const onDocClick: (e: MouseEvent) => void = (e: MouseEvent) => {
            const t: HTMLElement = e.target as HTMLElement;
            const inside: boolean = !!t.closest(`table.e-table-element[data-block-id="${this.blockId}"]`);
            const blkEl: HTMLElement = t.closest('.e-table-block') as HTMLElement;
            const tableSlashItem: HTMLElement = t.closest('.e-list-item[data-value="Table"]') as HTMLElement;
            if (inside || (blkEl && blkEl.contains(t)) || tableSlashItem) { return; }

            this.applyRowSelection(this.table, -1);
            this.applyColumnSelection(this.table, -1);
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
    }

    private syncRowUI(): void {
        if (!this.hoveredRow) { return; }
        const rowRect: DOMRect = this.hoveredRow.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.blockElement.getBoundingClientRect() as DOMRect;
        const xLeft: number = this.table.offsetLeft - 8;
        this.rowTopDot.style.left = `${xLeft}` + 'px';
        this.rowBottomDot.style.left = `${xLeft}` + 'px';
        this.rowTopDot.style.top = `${rowRect.top - blockRect.top - 2}` + 'px';
        this.rowBottomDot.style.top = `${rowRect.bottom - blockRect.top - 2}` + 'px';

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

    private hideRowUI(
        insertHandle: HTMLElement, line: HTMLElement, actionHandle: HTMLElement, dotTop: HTMLElement, dotBottom: HTMLElement
    ): void {
        insertHandle.style.display = 'none';
        line.style.display = 'none';
        actionHandle.style.display = 'none';
        dotTop.style.display = 'none';
        dotBottom.style.display = 'none';
    }

    private hideColUI(
        insertHandle: HTMLElement, line: HTMLElement, actionHandle: HTMLElement, dotLeft: HTMLElement, dotRight: HTMLElement
    ): void {
        insertHandle.style.display = 'none';
        line.style.display = 'none';
        actionHandle.style.display = 'none';
        dotLeft.style.display = 'none';
        dotRight.style.display = 'none';
    }

    private applyRowSelection(table: HTMLTableElement, rowIndex: number): void {
        Array.from(table.rows).forEach((r: HTMLTableRowElement) => r.classList.remove('e-row-selected'));
        Array.from(table.querySelectorAll('td, th')).forEach((c: Element) => (c as HTMLElement).classList.remove('e-col-selected'));
        if (rowIndex == null || rowIndex < 0) { return; }
        const row: HTMLTableRowElement = table.rows[rowIndex as number] as HTMLTableRowElement;
        if (row) { row.classList.add('e-row-selected'); }
    }

    private applyColumnSelection(table: HTMLTableElement, colIndex: number): void {
        Array.from(table.rows).forEach((r: HTMLTableRowElement) => r.classList.remove('e-row-selected'));
        Array.from(table.querySelectorAll('td, th')).forEach((c: Element) => (c as HTMLElement).classList.remove('e-col-selected'));
        if (colIndex == null || colIndex < 0) { return; }
        Array.from(table.rows).forEach((r: HTMLTableRowElement) => {
            const cells: HTMLElement[] = Array.from(r.cells).filter((cell: HTMLElement) => !cell.classList.contains('e-row-number'));
            if (cells[colIndex as number]) {
                cells[colIndex as number].classList.add('e-col-selected');
            }
        });
    }

    private showGripperPopup(
        actionHandle: HTMLElement,
        pinnedActionHandle: HTMLElement,
        blockModel: BlockModel,
        action: { label: string; iconCss: string; callback: () => void }
    ): void {
        const existingPopup: HTMLElement | null = this.parent.rootEditorElement.querySelector('.e-table-gripper-action-popup');
        const isColumnGripper: boolean = actionHandle.classList.contains('e-col-action-handle');
        const isRowGripper: boolean = actionHandle.classList.contains('e-row-action-handle');
        const props: ITableBlockSettings = blockModel.properties as ITableBlockSettings;
        if (existingPopup && existingPopup.parentElement) {
            existingPopup.parentElement.removeChild(existingPopup);
        }
        if ((isColumnGripper && props.columns.length <= 1) || (isRowGripper && props.rows.length <= 1)) {
            return;
        }
        const removePopup: (e: MouseEvent) => void = (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            if (!popup.contains(target) && !target.closest('.e-action-handle')) {
                if (this.popupObj && this.parent && this.parent.popupRenderer) {
                    this.popupObj.hide();
                    this.parent.popupRenderer.destroyPopup(this.popupObj);
                    this.popupObj = null;
                }
                document.removeEventListener('click', removePopup);
            }
        };
        document.addEventListener('click', removePopup);
        const popup: HTMLElement = createElement('div', {
            className: 'e-table-gripper-action-popup'
        }) as HTMLElement;
        this.parent.rootEditorElement.appendChild(popup);

        const item: HTMLElement = createElement('div', {
            className: `e-table-gripper-action-item e-icons ${action.iconCss}`
        }) as HTMLElement;

        item.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            action.callback();
            if (this.popupObj && this.parent && this.parent.popupRenderer) {
                this.popupObj.hide();
                this.parent.popupRenderer.destroyPopup(this.popupObj);
                actionHandle.style.display = 'none';
                pinnedActionHandle.style.display = 'none';
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
    }
}

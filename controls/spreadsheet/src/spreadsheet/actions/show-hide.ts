import { Spreadsheet } from '../base/index';
import { spreadsheetDestroyed, hideShowCol, hideShowRow, IRowRenderer, HideShowEventArgs } from '../common/index';
import { autoFit } from '../common/index';
import { SheetModel, getCellAddress, isHiddenRow, setRow } from '../../workbook/index';
import { detach } from '@syncfusion/ej2-base';

/**
 * The `ShowHide` module is used to perform hide/show the rows and columns.
 * @hidden
 */
export class ShowHide {
    private parent: Spreadsheet;
    /**
     * Constructor for the Spreadsheet show hide module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    // tslint:disable-next-line
    private showHideRow(args: HideShowEventArgs): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let count: number = 0; let idx: number;
        if (args.hide) {
            let content: HTMLTableElement; let rowHdr: HTMLTableElement; let row: HTMLTableRowElement;
            for (let i: number = args.startRow; i <= args.endRow; i++) {
                if (isHiddenRow(sheet, i)) { continue; }
                if (idx === undefined) {
                    if (sheet.showHeaders) { rowHdr = this.parent.getRowHeaderTable(); }
                    content = this.parent.getContentTable();
                    idx = this.getViewportIdx(i); count = 0;
                }
                setRow(sheet, i, { hidden: true });
                row = content.rows[idx];
                if (row) {
                    if (sheet.showHeaders) { detach(rowHdr.rows[idx]); }
                    detach(row); count++;
                } else {
                    count--;
                }
            }
            if (!count) { return; }
            this.parent.selectRange(sheet.selectedRange);
            if (this.parent.viewport.topIndex >= args.startRow) { this.parent.viewport.topIndex = args.endRow + 1; }
            if (this.parent.scrollSettings.enableVirtualization) {
                args.startRow = this.parent.viewport.bottomIndex + 1; args.endRow = args.startRow + count - 1;
                let indexes: number[] = this.parent.skipHiddenRows(args.startRow, args.endRow);
                args.startRow = indexes[0]; args.endRow = indexes[1];
                this.parent.viewport.bottomIndex = args.endRow;
                this.parent.renderModule.refreshUI(
                    { colIndex: this.parent.viewport.leftIndex, direction: '', refresh: 'RowPart' },
                    `${getCellAddress(args.startRow, this.parent.viewport.leftIndex)}:${getCellAddress(
                        args.endRow,
                        this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2))}`);
            }
            if (sheet.showHeaders) {
                if (idx === 0) {
                    rowHdr.rows[0].classList.add('e-hide-end');
                } else {
                    rowHdr.rows[idx - 1].classList.add('e-hide-start');
                    rowHdr.rows[idx].classList.add('e-hide-end');
                }
            }
        } else {
            let hFrag: DocumentFragment; let frag: DocumentFragment; let hRow: Element;
            let rowRenderer: IRowRenderer; let rTBody: Element; let tBody: Element;
            let endRow: number = args.startRow - 1; let newStartRow: number;
            for (let i: number = args.startRow, len: number = args.endRow; i <= len; i++) {
                if (!isHiddenRow(sheet, i)) {
                    if (args.startRow === args.endRow) { return; }
                    if (idx === undefined) {
                        endRow++;
                    } else {
                        newStartRow = i;
                    }
                    continue;
                }
                if (newStartRow !== undefined) { len = i; continue; }
                if (i > this.parent.viewport.bottomIndex) {
                    setRow(sheet, i, { hidden: false });
                    continue;
                }
                setRow(sheet, i, { hidden: false });
                if (idx === undefined) {
                    hFrag = document.createDocumentFragment(); frag = document.createDocumentFragment();
                    rowRenderer = this.parent.serviceLocator.getService<IRowRenderer>('row');
                    if (sheet.showHeaders) { rTBody = this.parent.getRowHeaderTable().tBodies[0]; }
                    tBody = this.parent.getContentTable().tBodies[0];
                    if (i < this.parent.viewport.topIndex) { this.parent.viewport.topIndex = i; }
                    if (i === 0) {
                        idx = 0;
                    } else {
                        idx = this.getViewportIdx(i);
                    }
                }
                endRow++;
                hRow = rowRenderer.refresh(i);
                hFrag.appendChild(hRow);
                frag.appendChild(rowRenderer.refresh(i, hRow));
                if (sheet.showHeaders) { detach(rTBody.lastElementChild); }
                detach(tBody.lastElementChild);
            }
            this.parent.viewport.bottomIndex = this.parent.viewport.topIndex + this.parent.viewport.rowCount +
                (this.parent.getThreshold('row') * 2);
            count = this.parent.hiddenRowsCount(this.parent.viewport.topIndex, args.startRow) +
                this.parent.hiddenRowsCount(args.endRow + 1, this.parent.viewport.bottomIndex);
            this.parent.viewport.bottomIndex += count;
            args.insertIdx = idx; args.row = frag.querySelector('.e-row');
            if (sheet.showHeaders) {
                args.hdrRow = hFrag.querySelector('.e-row');
                if (idx !== 0 && !isHiddenRow(sheet, endRow - 1)) {
                    rTBody.children[idx - 1].classList.remove('e-hide-start');
                }
                if (args.startRow !== 0 && isHiddenRow(sheet, args.startRow - 1)) {
                    args.hdrRow.classList.add('e-hide-end');
                }
                if (isHiddenRow(sheet, endRow + 1)) {
                    hFrag.lastElementChild.classList.add('e-hide-start');
                } else {
                    rTBody.children[idx].classList.remove('e-hide-end');
                }
            }
            if (args.skipAppend) { return; }
            if (sheet.showHeaders) { rTBody.insertBefore(hFrag, rTBody.children[idx]); }
            tBody.insertBefore(frag, tBody.children[idx]); this.parent.selectRange(sheet.selectedRange);
            if (args.autoFit && sheet.showHeaders) {
                this.parent.notify(autoFit, { startIndex: args.startRow, endIndex: args.endRow, isRow: true });
            }
            if (newStartRow !== undefined && newStartRow !== args.endRow) {
                args.startRow = newStartRow;
                this.showHideRow(args);
            }
        }
    }
    private showHideCol(): void {
        /** */
    }
    private getViewportIdx(index: number): number {
        if (this.parent.scrollSettings.enableVirtualization) {
            index -= this.parent.hiddenRowsCount(this.parent.viewport.topIndex, index);
            index -= this.parent.viewport.topIndex;
        }
        return index;
    }
    private addEventListener(): void {
        this.parent.on(hideShowRow, this.showHideRow, this);
        this.parent.on(hideShowCol, this.showHideCol, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        this.parent.off(hideShowRow, this.showHideRow);
        this.parent.off(hideShowCol, this.showHideCol);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}
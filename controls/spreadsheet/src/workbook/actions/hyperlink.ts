import { Workbook, SheetModel, CellModel, getCell, getSheet, getSheetIndex, getColumn } from '../base/index';
import { setLinkModel, getRangeIndexes, updateCell, getSwapRange, isLocked } from '../common/index';
import { HyperlinkModel } from '../common/class-model';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export class WorkbookHyperlink {
    private parent: Workbook;
    /**
     * Constructor for WorkbookSort module.
     *
     * @param {Workbook} parent - Specifies the workbook.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module.
     *
     * @returns {void} - To destroy the sort module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(setLinkModel, this.setLinkHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setLinkModel, this.setLinkHandler);
        }
    }

    public setLinkHandler(args: {
        hyperlink: string | HyperlinkModel, cell: string, displayText: string, triggerEvt?: boolean,
        isUndoRedo?: boolean
    }): void {
        let hyperlink: string | HyperlinkModel = args.hyperlink;
        let cellAddr: string = args.cell;
        let sheet: SheetModel;
        if (cellAddr && cellAddr.indexOf('!') !== -1) {
            const lastIndex: number = cellAddr.lastIndexOf('!');
            sheet = getSheet(this.parent, getSheetIndex(this.parent, cellAddr.substring(0, lastIndex)));
            cellAddr = cellAddr.substring(lastIndex + 1);
            if (!sheet) {
                return;
            }
        } else {
            sheet = this.parent.getActiveSheet();
            cellAddr = cellAddr || sheet.selectedRange;
        }
        const isProtected: boolean = !args.triggerEvt && sheet.isProtected;
        if (isProtected && !sheet.protectSettings.insertLink) {
            return;
        }
        const cellIdx: number[] = getSwapRange(getRangeIndexes(cellAddr));
        if (typeof (hyperlink) === 'string') {
            if (hyperlink.toLowerCase().indexOf('www.') === 0) {
                hyperlink = 'http://' + hyperlink;
            }
        } else {
            if (hyperlink.address.toLowerCase().indexOf('www.') === 0) {
                hyperlink.address =  'http://' + hyperlink.address;
            }
        }
        let cellModel: CellModel;
        const activeCell: number[] = getRangeIndexes(sheet.activeCell);
        for (let rIdx: number = cellIdx[0]; rIdx <= cellIdx[2]; rIdx++) {
            for (let cIdx: number = cellIdx[1]; cIdx <= cellIdx[3]; cIdx++) {
                if (isProtected && isLocked(getCell(rIdx, cIdx, sheet), getColumn(sheet, cIdx))) {
                    continue;
                }
                const cell: CellModel = getCell(rIdx, cIdx, sheet, null, true);
                if (cell.rowSpan < 1 || cell.colSpan < 1) {
                    continue;
                }
                cellModel = { hyperlink: typeof hyperlink === 'object' ? Object.assign({}, hyperlink) : hyperlink };
                if (!isNullOrUndefined(args.displayText)) {
                    if (args.triggerEvt || args.isUndoRedo) {
                        if (rIdx === activeCell[0] && cIdx === activeCell[1]) {
                            cellModel.value = args.displayText;
                            delete cellModel.formattedText;
                        }
                    } else {
                        cellModel.value = args.displayText;
                        delete cellModel.formattedText;
                    }
                }
                cellModel.style = { textDecoration: 'underline', color: '#00e' };
                updateCell(this.parent, sheet, { cell: cellModel, rowIdx: rIdx, colIdx: cIdx, preventEvt: !args.triggerEvt });
                if (!isNullOrUndefined(args.triggerEvt)) {
                    this.parent.setUsedRange(rIdx, cIdx, sheet);
                }
            }
        }
        this.parent.setUsedRange(cellIdx[2], cellIdx[3]);
    }

    /**
     * Gets the module name.
     *
     *@returns {string} - returns the module name.
     */
    protected getModuleName(): string {
        return 'workbookHyperlink';
    }
}

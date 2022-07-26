import { Workbook, SheetModel, CellModel, getCell, getSheet, getSheetIndex } from '../base/index';
import { setLinkModel, getRangeIndexes, updateCell, getSwapRange } from '../common/index';
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

    public setLinkHandler(args: { hyperlink: string | HyperlinkModel, cell: string, displayText: string, triggerEvt?: boolean }): void {
        let hyperlink: string | HyperlinkModel = args.hyperlink;
        let cellAddr: string = args.cell;
        let sheet: SheetModel;
        if (cellAddr && cellAddr.indexOf('!') !== -1) {
            const addrArr: string[] = cellAddr.split('!');
            sheet = getSheet(this.parent, getSheetIndex(this.parent, addrArr[0]));
            cellAddr = addrArr[1];
            if (!sheet) {
                return;
            }
        } else {
            sheet = this.parent.getActiveSheet();
            cellAddr = cellAddr || sheet.selectedRange;
        }
        const cellIdx: number[] = getSwapRange(getRangeIndexes(cellAddr));
        const cell: CellModel = {};
        if (typeof (hyperlink) === 'string') {
            if (hyperlink.toLowerCase().indexOf('www.') === 0) {
                hyperlink = 'http://' + hyperlink;
            }
            cell.hyperlink = hyperlink;
        } else {
            let address: string = hyperlink.address;
            if (address.toLowerCase().indexOf('www.') === 0) {
                address =  'http://' + address;
            }
            cell.hyperlink = { address: address };
        }
        if (args.displayText) {
            cell.value = args.displayText;
        }
        let cellModel: CellModel;
        for (let rIdx: number = cellIdx[0]; rIdx <= cellIdx[2]; rIdx++) {
            for (let cIdx: number = cellIdx[1]; cIdx <= cellIdx[3]; cIdx++) {
                cellModel = cell.value ? getCell(rIdx, cIdx, sheet) || {} : cell;
                cellModel.hyperlink = hyperlink;
                if (isNullOrUndefined(cellModel.value)) {
                    cellModel.value = cell.value;
                }
                if (!updateCell(this.parent, sheet, { cell: cellModel, rowIdx: rIdx, colIdx: cIdx, preventEvt: !args.triggerEvt })) {
                    updateCell(
                        this.parent, sheet, { rowIdx: rIdx, colIdx: cIdx, preventEvt: true, cell: { style:
                            { textDecoration: 'underline', color: '#00e' } }});
                }
            }
        }
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

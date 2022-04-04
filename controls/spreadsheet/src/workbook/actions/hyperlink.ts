import { Workbook, SheetModel, CellModel, setCell } from '../base/index';
import { setLinkModel, getRangeIndexes, updateCell } from '../common/index';
import { HyperlinkModel } from '../common/class-model';

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
        let range: string[];
        let sheetIdx: number;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let address: string;
        if (cellAddr && cellAddr.indexOf('!') !== -1) {
            range = cellAddr.split('!');
            const sheets: SheetModel[] = this.parent.sheets;
            for (let idx: number = 0; idx < sheets.length; idx++) {
                if (sheets[idx].name === range[0]) {
                    sheetIdx = idx;
                }
            }
            sheet = this.parent.sheets[sheetIdx];
            cellAddr = range[1];
        }
        cellAddr = cellAddr ? cellAddr : this.parent.getActiveSheet().activeCell;
        const cellIdx: number[] = getRangeIndexes(cellAddr);
        const rowIdx: number = cellIdx[0];
        const colIdx: number = cellIdx[1];
        if (!sheet) {
            return;
        }
        const cell: CellModel = {};
        if (typeof (hyperlink) === 'string') {
            if (hyperlink.indexOf('http://') !== 0 && hyperlink.indexOf('https://') !== 0 && hyperlink.indexOf('ftp://') !== 0) {
                hyperlink = hyperlink.toLowerCase().indexOf('www.') === 0 ? 'http://' + hyperlink : hyperlink;
                address = hyperlink;
            }
            cell.hyperlink = hyperlink;
        } else {
            address = hyperlink.address;
            if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                address = address.toLowerCase().indexOf('www.') === 0 ? 'http://' + address : address;
            }
            cell.hyperlink = {
                address: address
            };
        }
        if (args.displayText) {
            cell.value = args.displayText;
        }
        if (!updateCell(this.parent, sheet, { cell: cell, rowIdx: rowIdx, colIdx: colIdx, preventEvt: !args.triggerEvt })) {
            if (!sheet.rows[rowIdx].cells[colIdx].style) {
                sheet.rows[rowIdx].cells[colIdx].style = {};
            }
            sheet.rows[rowIdx].cells[colIdx].style.textDecoration = 'underline';
            sheet.rows[rowIdx].cells[colIdx].style.color = '#00e';
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

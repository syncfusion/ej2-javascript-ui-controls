import { Workbook, SheetModel } from '../base/index';
import { setLinkModel } from '../common/event';
import { HyperlinkModel } from '../common/class-model';
import { getRangeIndexes } from '../common/address';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export class WorkbookHyperlink {
    private parent: Workbook;
    /**
     * Constructor for WorkbookSort module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module. 
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

    public setLinkHandler(args: { hyperlink: string | HyperlinkModel, cell: string }): void {
        let hyperlink: string | HyperlinkModel = args.hyperlink;
        let cellAddr: string = args.cell;
        let range: string[];
        let sheetIdx: number;
        let cellIdx: number[];
        let sheet: SheetModel = this.parent.getActiveSheet();
        let address: string;
        if (cellAddr && cellAddr.indexOf('!') !== -1) {
            range = cellAddr.split('!');
            sheetIdx = parseInt(range[0].replace(/\D/g, ''), 10) - 1;
            sheet = this.parent.sheets[sheetIdx];
            cellAddr = range[1];
        }
        cellAddr = cellAddr ? cellAddr : this.parent.getActiveSheet().activeCell;
        cellIdx = getRangeIndexes(cellAddr);
        let rowIdx: number = cellIdx[0];
        let colIdx: number = cellIdx[1];
        if (!sheet) {
           return;
        }
        if (isNullOrUndefined(sheet.rows[rowIdx])) {
            sheet.rows[rowIdx] = {};
        }
        if (isNullOrUndefined(sheet.rows[rowIdx].cells)) {
            sheet.rows[rowIdx].cells = [];
        }
        if (isNullOrUndefined(sheet.rows[rowIdx].cells[colIdx])) {
            sheet.rows[rowIdx].cells[colIdx] = {};
        }
        if (typeof (hyperlink) === 'string') {
            if (hyperlink.indexOf('http://') === -1 && hyperlink.indexOf('www.') !== -1) {
                address = 'http://' + hyperlink;
            } else {
                address = hyperlink;
            }
            sheet.rows[rowIdx].cells[colIdx].hyperlink = address;
        } else {
            if (hyperlink.address.indexOf('http://') === -1 && hyperlink.address.indexOf('www.') !== -1) {
                address = 'http://' + hyperlink.address;
            } else {
                address = hyperlink.address;
            }
            sheet.rows[rowIdx].cells[colIdx].hyperlink = {
                address: address,
            };
        }

    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookHyperlink';
    }
}
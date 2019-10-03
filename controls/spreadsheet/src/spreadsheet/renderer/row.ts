import { Spreadsheet } from '../base/index';
import { IRowRenderer } from '../common/interface';
import { getRowHeight, SheetModel } from '../../workbook/base/index';
import { attributes } from '@syncfusion/ej2-base';

/**
 * Sheet module is used for creating row element
 * @hidden
 */
export class RowRenderer implements IRowRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableRowElement;

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { 'role': 'row' } }) as HTMLTableRowElement;
    }

    public render(index?: number, isRowHeader?: boolean): Element {
        let row: HTMLElement = this.element.cloneNode() as HTMLElement;
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        let sheet: SheetModel = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        row.style.height = `${getRowHeight(sheet, index)}px`;
        return row;
    }
}
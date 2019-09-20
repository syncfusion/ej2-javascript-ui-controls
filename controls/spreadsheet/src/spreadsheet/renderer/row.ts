import { Spreadsheet } from '../base/index';
import { IRowRenderer } from '../common/interface';
import { getRowHeight } from '../../workbook/base/index';
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
        this.element = this.parent.createElement('tr') as HTMLTableRowElement;
    }

    public render(isHeader: boolean, index?: number): Element {
        let row: HTMLElement = this.element.cloneNode() as HTMLElement;
        if (isHeader) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        attributes(row, { 'role': 'row', 'aria-rowindex': index.toString() });
        row.style.height = `${getRowHeight(this.parent.getActiveSheet(), index)}px`;
        return row;
    }
}
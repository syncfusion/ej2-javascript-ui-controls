import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { IGrid } from '../base/interface';
import { appendChildren, templateCompiler } from '../base/util';
import { GroupedData } from '../services/group-model-generator';

/**
 * GroupCaptionCellRenderer class which responsible for building group caption cell. 
 * @hidden
 */
export class GroupCaptionCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent
    .createElement('TD', { className: 'e-groupcaption', attrs: { role: 'gridcell', tabindex: '-1' } });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    public render(cell: Cell<Column>, data: GroupedData): Element {
        let node: Element = this.element.cloneNode() as Element;
        let gObj: IGrid = this.parent;
        let result: Element[];
        let helper: object = {};
        let fKeyValue: string;
        data.headerText = cell.column.headerText;
        if (cell.isForeignKey) {
            fKeyValue = this.format(cell.column,  (cell.column.valueAccessor as Function)('foreignKey', data, cell.column));
          }
        let value: string = cell.isForeignKey ? fKeyValue : cell.column.enableGroupByFormat ? data.key :
        this.format(cell.column, (cell.column.valueAccessor as Function)('key', data, cell.column));
        if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
            if (gObj.groupSettings.captionTemplate.indexOf('#') !== -1) {
                result = templateCompiler(document.querySelector(gObj.groupSettings.captionTemplate).innerHTML.trim())(data);
            } else {
                result = templateCompiler(gObj.groupSettings.captionTemplate)(data);
            }
            appendChildren(node, result);
        } else {
            node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
                (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'));
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + ' is groupcaption cell');
        node.setAttribute('title', node.innerHTML);
        return node;
    }
}

/**
 * GroupCaptionEmptyCellRenderer class which responsible for building group caption empty cell. 
 * @hidden
 */
export class GroupCaptionEmptyCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', { className: 'e-groupcaption' });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    public render(cell: Cell<Column>, data: { field: string, key: string, count: number }): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.innerHTML = '&nbsp;';
        node.setAttribute('colspan', cell.colSpan.toString());
        return node;
    }
}


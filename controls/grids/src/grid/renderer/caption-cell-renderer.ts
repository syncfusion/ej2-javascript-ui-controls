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
 *
 * @hidden
 */
export class GroupCaptionCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent
        .createElement('TD', { className: 'e-groupcaption',
            attrs: { id: this.parent.element.id + 'captioncell', role: 'gridcell', tabindex: '-1' } });

    /**
     * Function to render the cell content based on Column object.
     *
     * @param  {Cell} cell - specifies the cell
     * @param  {Object} data - specifies the GroupedData
     * @returns {Element} returns the element
     */
    public render(cell: Cell<Column>, data: GroupedData): Element {
        const node: Element = this.element.cloneNode() as Element;
        const gObj: IGrid = this.parent;
        let result: Element[];
        let fKeyValue: string;
        data.headerText = cell.column.headerText;
        if (cell.isForeignKey) {
            fKeyValue = this.format(cell.column, (cell.column.valueAccessor as Function)('foreignKey', data, cell.column));
        }
        const value: string = cell.isForeignKey ? fKeyValue : cell.column.enableGroupByFormat ? data.key :
            this.format(cell.column, (cell.column.valueAccessor as Function)('key', data, cell.column));
        if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
            const isReactCompiler: boolean = this.parent.isReact && typeof (gObj.groupSettings.captionTemplate) !== 'string';
            if (isReactCompiler) {
                const tempID: string = gObj.element.id + 'captionTemplate';
                templateCompiler(gObj.groupSettings.captionTemplate)(data, this.parent, 'captionTemplate', tempID, null, null, node);
                this.parent.renderTemplates();
            } else if (this.parent.isVue) {
                result = templateCompiler(gObj.groupSettings.captionTemplate)(data, this.parent);
            } else {
                result = templateCompiler(gObj.groupSettings.captionTemplate)(data);
            }
            if (!isReactCompiler) {
                appendChildren(node, result);
            }
        } else {
            if (gObj.groupSettings.enableLazyLoading) {
                node.innerHTML = cell.column.headerText + ': ' + value;
            } else {
                node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
                    (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'));
            }
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + ' is groupcaption cell');
        node.setAttribute('title', node.innerHTML);
        return node;
    }
}

/**
 * GroupCaptionEmptyCellRenderer class which responsible for building group caption empty cell.
 *
 * @hidden
 */
export class GroupCaptionEmptyCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', { className: 'e-groupcaption' });

    /**
     * Function to render the cell content based on Column object.
     *
     * @param {Cell} cell - specifies the cell
     * @param {Object} data - specifies the Object
     * @param {string} data.field - Defines the field
     * @param {string} data.key - Defines the key
     * @param {number} data.count - Defines the count
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: { field: string, key: string, count: number }): Element {
        const node: Element = this.element.cloneNode() as Element;
        node.innerHTML = '&nbsp;';
        node.setAttribute('colspan', cell.colSpan.toString());
        return node;
    }
}

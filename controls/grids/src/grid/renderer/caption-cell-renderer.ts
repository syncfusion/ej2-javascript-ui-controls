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

    public cellUid : number = 0;
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
        this.element.id = this.parent.element.id + 'captioncell' + this.cellUid++;
        const node: Element = this.element.cloneNode() as Element;
        const gObj: IGrid = this.parent;
        let result: Element[];
        let fKeyValue: string;
        let gTemplateValue: string;
        data.headerText = cell.column.headerText;
        if (cell.isForeignKey) {
            fKeyValue = this.format(cell.column, (cell.column.valueAccessor as Function)('foreignKey', data, cell.column));
        }
        const value: string = cell.isForeignKey ? fKeyValue : cell.column.enableGroupByFormat ? data.key :
            this.format(cell.column, (cell.column.valueAccessor as Function)('key', data, cell.column));
        for (let j: number = 0; j < gObj.aggregates.length; j++){
            for (let i: number = 0; i < gObj.aggregates[j].columns.length; i++){
                if (gObj.getVisibleColumns()[0].field === gObj.aggregates[j].columns[i].field &&
                    gObj.aggregates[j].columns[i].groupCaptionTemplate) {
                    if (gObj.aggregates[j].columns[i].groupCaptionTemplate.includes('$')) {
                        gTemplateValue = gObj.aggregates[j].columns[i].groupCaptionTemplate.split('$')[0] + data[gObj.getVisibleColumns()[0].field][gObj.aggregates[j].columns[i].type] +
                        gObj.aggregates[j].columns[i].groupCaptionTemplate.split('}')[1];
                    }
                    else {
                        gTemplateValue = gObj.aggregates[j].columns[i].groupCaptionTemplate;
                    }
                    break;
                }
            }
        }
        if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
            const isReactCompiler: boolean = this.parent.isReact && typeof (gObj.groupSettings.captionTemplate) !== 'string';
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            if (isReactCompiler || isReactChild) {
                const tempID: string = gObj.element.id + 'captionTemplate';
                templateCompiler(gObj.groupSettings.captionTemplate as string)(data, this.parent, 'captionTemplate', tempID, null, null, node);
                this.parent.renderTemplates();
            } else if (this.parent.isVue) {
                result = templateCompiler(gObj.groupSettings.captionTemplate as string)(data, this.parent);
            } else {
                result = templateCompiler(gObj.groupSettings.captionTemplate as string)(data);
            }
            if (!isReactCompiler && !isReactChild) {
                appendChildren(node, result);
            }
        } else {
            if (gObj.groupSettings.enableLazyLoading) {
                node.innerHTML = cell.column.headerText + ': ' + value + (gTemplateValue ? '   ' + gTemplateValue : '');
            } else {
                node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
                (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'))
                + (gTemplateValue ? '   ' + gTemplateValue : '');
            }
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + this.localizer.getConstant('GroupCaption'));
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

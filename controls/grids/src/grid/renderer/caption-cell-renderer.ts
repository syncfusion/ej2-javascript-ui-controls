import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { IGrid } from '../base/interface';
import { appendChildren, templateCompiler } from '../base/util';
import { CellType } from '../base/enum';
import { GroupedData } from '../services/group-model-generator';
import { AggregateColumn } from '../models/aggregate';

/**
 * GroupCaptionCellRenderer class which responsible for building group caption cell.
 *
 * @hidden
 */
export class GroupCaptionCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public cellUid : number = 0;
    public element: HTMLElement = this.parent
        .createElement('TD', { className: 'e-groupcaption',
            attrs: { id: this.parent.element.id + 'captioncell', tabindex: '-1' } });

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
        const column: Column = cell.column;
        const domSetter: string = column.getDomSetter ? column.getDomSetter() : 'innerHTML';
        let result: Element[];
        let fKeyValue: string;
        let gTemplateValue: string | Function | NodeList;
        data.headerText = cell.column.headerText;
        if (cell.isForeignKey) {
            fKeyValue = this.format(cell.column, (cell.column.valueAccessor as Function)('foreignKey', data, cell.column));
        }
        const value: string = cell.isForeignKey ? fKeyValue : cell.column.enableGroupByFormat ? data.key :
            this.format(cell.column, (cell.column.valueAccessor as Function)('key', data, cell.column));
        for (let j: number = 0; j < gObj.aggregates.length; j++){
            for (let i: number = 0; i < gObj.aggregates[parseInt(j.toString(), 10)].columns.length; i++){
                if (gObj.getVisibleColumns()[0].field === gObj.aggregates[parseInt(j.toString(), 10)].columns[parseInt(i.toString(), 10)]
                    .field && gObj.aggregates[parseInt(j.toString(), 10)].columns[parseInt(i.toString(), 10)].groupCaptionTemplate) {
                    const gCaptionTemp: string | Function = (gObj.aggregates[parseInt(j.toString(), 10)]
                        .columns[parseInt(i.toString(), 10)].groupCaptionTemplate as string);
                    if (typeof gCaptionTemp === 'string' && gCaptionTemp.includes('$')) {
                        gTemplateValue = (gObj.aggregates[parseInt(j.toString(), 10)].columns[parseInt(i.toString(), 10)]
                            .groupCaptionTemplate as string).split('$')[0] + data[gObj.getVisibleColumns()[0].field][gObj
                            .aggregates[parseInt(j.toString(), 10)].columns[parseInt(i.toString(), 10)].type] +
                            (gObj.aggregates[parseInt(j.toString(), 10)].columns[parseInt(i.toString(), 10)]
                                .groupCaptionTemplate as string).split('}')[1];
                    }
                    else {
                        const column: AggregateColumn = <AggregateColumn>(gObj.aggregates[parseInt(j.toString(), 10)]
                            .columns[parseInt(i.toString(), 10)]);
                        const tempObj: { fn: Function, property: string } = column.getTemplate(CellType.CaptionSummary);
                        const tempID: string = '';
                        if (!isNullOrUndefined(tempObj)) {
                            const tempValue: NodeList = tempObj.fn(data[column.columnName], this.parent, tempObj.property, tempID);
                            const isReactPrintGrid: boolean = this.parent.printGridParent
                                && this.parent.printGridParent.isReact;
                            if ((this.parent.isReact || isReactPrintGrid) && typeof column.groupCaptionTemplate !== 'string') {
                                this.parent.renderTemplates(function (): void {
                                    if (tempValue && tempValue.length) {
                                        if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
                                            node.appendChild(tempValue[0]);
                                        }
                                        else {
                                            (node as HTMLElement).innerText += ' ' + tempValue[0].textContent;
                                        }
                                    }
                                });
                            } else {
                                if (tempValue && tempValue.length) {
                                    if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
                                        gTemplateValue = tempValue;
                                    } else {
                                        gTemplateValue = tempValue[0].textContent;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (!isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
            const isReactCompiler: boolean = this.parent.isReact && typeof (gObj.groupSettings.captionTemplate) !== 'string' &&
                !((gObj.groupSettings.captionTemplate as Function).prototype &&
                (gObj.groupSettings.captionTemplate as Function).prototype.CSPTemplate);
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
            if (isReactCompiler || isReactChild || isReactPrintGrid) {
                const tempID: string = gObj.element.id + 'captionTemplate';
                const groupKey: string = 'groupKey'; const key: string = 'key';
                data[`${groupKey}`] = data[`${key}`];
                templateCompiler(gObj.groupSettings.captionTemplate as string)(data, this.parent, 'captionTemplate', tempID, null, null, node);
                this.parent.renderTemplates();
            } else if (this.parent.isVue
                || (gObj.parentDetails && gObj.parentDetails.parentInstObj && gObj.parentDetails.parentInstObj.isVue)) {
                result = templateCompiler(gObj.groupSettings.captionTemplate as string)(
                    data, this.parent, 'captionTemplate', null, null, null, null, gObj.root);
            } else {
                result = templateCompiler(gObj.groupSettings.captionTemplate as string)(data);
            }
            if (!isReactCompiler && !isReactChild && !isReactPrintGrid) {
                appendChildren(node, result);
                if (gTemplateValue && gTemplateValue.length && gTemplateValue[0].textContent) {
                    node.appendChild(gTemplateValue[0]);
                }
            }
        } else {
            if (gObj.groupSettings.enableLazyLoading) {
                node[`${domSetter}`] = this.parent.sanitize(cell.column.headerText) + ': ' + this.parent.sanitize(value) +
                (gTemplateValue ? '   ' + gTemplateValue : '');
            } else {
                node[`${domSetter}`] =  this.parent.sanitize(cell.column.headerText) + ': ' + this.parent.sanitize(value) +
                ' - ' + data.count + ' ' + (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'))
                + (gTemplateValue ? '   ' + gTemplateValue : '');
            }
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + this.localizer.getConstant('GroupCaption'));
        node.setAttribute('title', node.textContent);
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

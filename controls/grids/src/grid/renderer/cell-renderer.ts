import { L10n, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend, isBlazor, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IValueFormatter, ICellFormatter, IGrid, ICell } from '../base/interface';
import { doesImplementInterface, setStyleAndAttributes, appendChildren, extendObjWithFn } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { foreignKeyData } from '../base/constant';

/**
 * CellRenderer class which responsible for building cell content. 
 * @hidden
 */
export class CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement;
    private rowChkBox: Element;
    protected localizer: L10n;
    protected formatter: IValueFormatter;
    protected parent: IGrid;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.localizer = locator.getService<L10n>('localization');
        this.formatter = locator.getService<IValueFormatter>('valueFormatter');
        this.parent = parent;
        this.element = this.parent.createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell', tabindex: '-1' } });
        this.rowChkBox = this.parent.createElement('input', { className: 'e-checkselect', attrs: { 'type': 'checkbox' } });
    }
    /**
     * Function to return the wrapper for the TD content
     * @returns string
     */
    public getGui(): string | Element {
        return '';
    }

    /**
     * Function to format the cell value.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    public format(column: Column, value: Object, data?: Object): string {
        if (!isNullOrUndefined(column.format)) {

            if (column.type === 'number' && isNaN(parseInt(value as string, 10))) {
                value = null;
            }
            value = this.formatter.toView(value as number | Date, column.getFormatter());
        }

        return isNullOrUndefined(value) ? '' : value.toString();
    }

    public evaluate(node: Element, cell: Cell<Column>, data: Object, attributes?: Object, fData?: Object, isEdit?: boolean): boolean {
        let result: Element[];
        if (cell.column.template) {
            let isReactCompiler: boolean = this.parent.isReact && typeof (cell.column.template) !== 'string';
            let literals: string[] = ['index'];
            let dummyData: Object = extendObjWithFn({}, data, { [foreignKeyData]: fData, column: cell.column });
            let templateID: string = this.parent.element.id + cell.column.uid;
            let str: string = 'isStringTemplate';
            let index: string = 'index';
            if (isBlazor() && isEdit) {
                let rNumber: number = this.parent.editSettings.mode !== 'Batch' ? parseInt(attributes[index], 10) : null;
                result = cell.column.getColumnTemplate()(
                    extend({ 'index': attributes[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str],
                    rNumber);
                window[templateID] = null;
                if (this.parent.editSettings.mode !== 'Batch') {
                    updateBlazorTemplate(templateID, 'Template', cell.column, false);
                }
            } else {
                if (isReactCompiler) {
                    let copied: Object = { 'index': attributes[literals[0]] };
                    cell.column.getColumnTemplate()(
                        extend(copied, dummyData), this.parent, 'columnTemplate', templateID, this.parent[str], null, node);
                    this.parent.renderTemplates();
                } else {
                    result = cell.column.getColumnTemplate()(
                        extend({ 'index': attributes[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str]);
                }
            }
            if (!isReactCompiler) {
                appendChildren(node, result);
            }
            this.parent.notify('template-result', { template: result });
            result = null;
            node.setAttribute('aria-label', (<HTMLElement>node).innerText + ' is template cell' + ' column header ' +
                cell.column.headerText);
            return false;
        }
        return true;
    }

    /**
     * Function to invoke the custom formatter available in the column object.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    public invokeFormatter(column: Column, value: Object, data: Object): Object {
        if (!isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                let formatter: { new(): ICellFormatter } = <{ new(): ICellFormatter }>column.formatter;
                value = new formatter().getValue(column, data);

            } else if (typeof column.formatter === 'function') {
                value = (column.formatter as Function)(column, data);
            } else {
                value = (column.formatter as ICellFormatter).getValue(column, data);
            }
        }
        return value;
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }, isExpand?: boolean, isEdit?: boolean): Element {
        return this.refreshCell(cell, data, attributes, isEdit);
    }

    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    public refreshTD(td: Element, cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): void {
        let isEdit: boolean = this.parent.editSettings.mode === 'Batch' && td.classList.contains('e-editedbatchcell');
        if (this.parent.isReact) {
            td.innerHTML = '';
            let cellIndex: number = (td as HTMLTableCellElement).cellIndex;
            let parentRow: HTMLTableRowElement = td.parentElement as HTMLTableRowElement;
            remove(td);
            let newTD: Element = this.refreshCell(cell, data, attributes, isEdit);
            this.cloneAttributes(newTD, td);
            parentRow.cells.length !== cellIndex - 1 ? parentRow.insertBefore(newTD, parentRow.cells[cellIndex])
                : parentRow.appendChild(newTD);
        } else {
            let node: Element = this.refreshCell(cell, data, attributes, isEdit);
            td.innerHTML = '';
            td.setAttribute('aria-label', node.getAttribute('aria-label'));
            let elements: Element[] = [].slice.call(node.childNodes);
            for (let elem of elements) {
                td.appendChild(elem);
            }
        }
    }

    // tslint:disable-next-line:no-any
    private cloneAttributes(target: Element, source: any): void {
        // tslint:disable-next-line:no-any
        let attrs: any = source.attributes;
        // tslint:disable-next-line:no-any
        let i: any = attrs.length;
        // tslint:disable-next-line:no-any
        let attr: any;
        while (i--) {
            attr = attrs[i];
            target.setAttribute(attr.name, attr.value);
        }
    }

    private refreshCell(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }, isEdit?: boolean): Element {
        let node: Element = this.element.cloneNode() as Element;
        let column: Column = cell.column;
        let fData: Object;
        if (cell.isForeignKey) {
            fData = cell.foreignKeyData[0] || { [column.foreignKeyValue]: column.format ? null : '' };
        }
        //Prepare innerHtml
        let innerHtml: string = <string>this.getGui();

        let value: Object = cell.isForeignKey ? this.getValue(column.foreignKeyValue, fData, column) :
            this.getValue(column.field, data, column);

        if ((column.type === 'date' || column.type === 'datetime') && !isNullOrUndefined(value)) {
            value = new Date(value as string);
        }
        value = this.format(column, value, data);

        innerHtml = value.toString();

        if (column.type === 'boolean' && !column.displayAsCheckBox) {
            let localeStr: string = (value !== 'true' && value !== 'false') ? null : value === 'true' ? 'True' : 'False';
            innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
        }

        let fromFormatter: Object = this.invokeFormatter(column, value, data);

        innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
        node.setAttribute('aria-label', innerHtml + ' column header ' + cell.column.headerText);
        if (this.evaluate(node, cell, data, attributes, fData, isEdit) && column.type !== 'checkbox') {
            this.appendHtml(node, innerHtml, column.getDomSetter ? column.getDomSetter() : 'innerHTML');
        } else if (column.type === 'checkbox') {
            node.classList.add('e-gridchkbox');
            node.setAttribute('aria-label', 'checkbox');
            if (this.parent.selectionSettings.persistSelection) {
                value = value === 'true';
            } else {
                value = false;
            }
            let checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
            checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
            node.appendChild(checkWrap);
        }

        if (this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            cell.isSelected = true;
        }

        this.setAttributes(<HTMLElement>node, cell, attributes);

        if (column.type === 'boolean' && column.displayAsCheckBox) {
            let checked: boolean = isNaN(parseInt(value.toString(), 10)) ? value === 'true' : parseInt(value.toString(), 10) > 0;
            let checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: checked, label: ' ' });
            node.innerHTML = '';
            checkWrap.classList.add('e-checkbox-disabled');
            node.appendChild(checkWrap);
            node.setAttribute('aria-label', checked + ' column header ' + cell.column.headerText);
        }

        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element, property: string = 'innerHTML'): Element {
        node[property] = innerHtml as string;
        return node;
    }
    /**
     * @hidden
     */
    public setAttributes(node: HTMLElement, cell: Cell<Column>, attributes?: { [x: string]: Object }): void {
        let column: Column = cell.column;
        this.buildAttributeFromCell(node, cell, column.type === 'checkbox');

        setStyleAndAttributes(node, attributes);
        setStyleAndAttributes(node, cell.attributes);

        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }

        if (column.textAlign) {
            node.style.textAlign = column.textAlign;
        }

        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        } else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
    }

    public buildAttributeFromCell<Column>(node: HTMLElement, cell: Cell<Column>, isCheckBoxType?: boolean): void {
        let attr: ICell<Column> & { 'class'?: string[] } = {};
        let prop: { 'colindex'?: string } = { 'colindex': 'aria-colindex' };
        let classes: string[] = [];

        if (cell.colSpan) {
            attr.colSpan = cell.colSpan;
        }

        if (cell.rowSpan) {
            attr.rowSpan = cell.rowSpan;
        }

        if (cell.isTemplate) {
            classes.push('e-templatecell');
        }

        if (cell.isSelected) {
            classes.push(...['e-selectionbackground', 'e-active']);
            if (isCheckBoxType) {
                node.querySelector('.e-frame').classList.add('e-check');
            }
        }

        if (!isNullOrUndefined(cell.index)) {
            attr[prop.colindex] = cell.index;
        }

        if (!cell.visible) {
            classes.push('e-hide');
        }

        attr.class = classes;

        setStyleAndAttributes(node, attr);
    }

    public getValue(field: string, data: Object, column: Column): Object {
        return (column.valueAccessor as Function)(field, data, column);
    }
}

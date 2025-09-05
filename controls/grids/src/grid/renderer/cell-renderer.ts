import { L10n, remove, addClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IValueFormatter, ICellFormatter, IGrid, ICell } from '../base/interface';
import { doesImplementInterface, setStyleAndAttributes, appendChildren, extendObjWithFn, addStickyColumnPosition } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { foreignKeyData } from '../base/constant';
import { CellType } from '../base/enum';
import * as literals from '../base/string-literals';

/**
 * CellRenderer class which responsible for building cell content.
 *
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
        this.element = this.parent.createElement('TD', { className: literals.rowCell, attrs: { role: 'gridcell', tabindex: '-1' } });
        this.rowChkBox = this.parent.createElement('input', { className: 'e-checkselect', attrs: { 'type': 'checkbox', 'aria-label': this.localizer.getConstant('SelectRow') } });
    }
    /**
     * Function to return the wrapper for the TD content
     *
     * @returns {string | Element} returns the string
     */
    public getGui(): string | Element {
        return '';
    }

    /**
     * Function to format the cell value.
     *
     * @param  {Column} column - specifies the column
     * @param  {Object} value - specifies the value
     * @param  {Object} data - specifies the data
     * @returns {string} returns the format
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public format(column: Column, value: Object, data?: Object): string {
        if (!isNullOrUndefined(column.format)) {

            if (column.type === 'number' && isNaN(parseInt(value as string, 10))) {
                value = null;
            }
            if (column.type === 'dateonly' && typeof value === 'string' && value) {
                const arr: string[] = value.split(/[^0-9.]/);
                value = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10));
            }
            value = this.formatter.toView(value as number | Date, column.getFormatter());
        }

        return isNullOrUndefined(value) ? '' : value.toString();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public evaluate(node: Element, cell: Cell<Column>, data: Object, attributes?: Object, fData?: Object, isEdit?: boolean): boolean {
        let result: Element[];
        if (cell.column.template) {
            const isReactCompiler: boolean = this.parent.isReact && typeof (cell.column.template) !== 'string' && !(cell.column.template.prototype && cell.column.template.prototype.CSPTemplate);
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
            const literals: string[] = ['data-index'];
            const dummyData: Object = extendObjWithFn({}, data, { [foreignKeyData]: fData, column: cell.column });
            const templateID: string = this.parent.element.id + cell.column.uid;
            const str: string = 'isStringTemplate';
            if (isReactCompiler || isReactChild || isReactPrintGrid) {
                const copied: Object = { 'index': attributes[literals[0]] };
                cell.column.getColumnTemplate()(
                    extend(copied, dummyData), this.parent, 'columnTemplate', templateID, this.parent[`${str}`], null, node);
            } else {
                result = cell.column.getColumnTemplate()(
                    extend({ 'index': attributes[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[`${str}`], undefined, undefined, this.parent['root']);
            }
            if (!isReactCompiler && !isReactChild && !isReactPrintGrid) {
                appendChildren(node, result);
            }
            this.parent.notify('template-result', { template: result });
            result = null;
            if (cell.column.templateOptions.enableAriaLabel) {
                node.setAttribute('aria-label', (<HTMLElement>node).innerText + this.localizer.getConstant('TemplateCell') +
                    this.localizer.getConstant('ColumnHeader') + cell.column.headerText);
            }
            return false;
        }
        return true;
    }

    /**
     * Function to invoke the custom formatter available in the column object.
     *
     * @param  {Column} column - specifies the column
     * @param  {Object} value - specifies the value
     * @param  {Object} data - specifies the data
     * @returns {Object} returns the object
     */
    public invokeFormatter(column: Column, value: Object, data: Object): Object {
        if (!isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                const formatter: { new(): ICellFormatter } = <{ new(): ICellFormatter }>column.formatter;
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
     *
     * @param {Cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {Object} attributes - specifies the attributes
     * @param {boolean} isExpand - specifies the boolean for expand
     * @param {boolean} isEdit - specifies the boolean for edit
     * @returns {Element} returns the element
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }, isExpand?: boolean, isEdit?: boolean): Element {
        return this.refreshCell(cell, data, attributes, isEdit);
    }

    /**
     * Function to refresh the cell content based on Column object.
     *
     * @param {Element} td - specifies the element
     * @param {Cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {Object} attributes - specifies the attribute
     * @returns {void}
     */
    public refreshTD(td: Element, cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): void {
        const isEdit: boolean = this.parent.editSettings.mode === 'Batch' && td.classList.contains('e-editedbatchcell');
        if (this.parent.isReact) {
            const cellIndex: number = (td as HTMLTableCellElement).cellIndex;
            const parentRow: HTMLTableRowElement = td.parentElement as HTMLTableRowElement;
            remove(td);
            const newTD: Element = this.refreshCell(cell, data, attributes, isEdit);
            this.cloneAttributes(newTD, td);
            if (parentRow.cells.length !== cellIndex - 1) {
                parentRow.insertBefore(newTD, parentRow.cells[parseInt(cellIndex.toString(), 10)]);
            } else {
                parentRow.appendChild(newTD);
            }
        } else {
            const node: Element = this.refreshCell(cell, data, attributes, isEdit);
            td.innerHTML = '';
            const arialabelText: string = node.getAttribute('aria-label');
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            arialabelText ? td.setAttribute('aria-label', arialabelText) : null;
            const elements: Element[] = [].slice.call(node.childNodes);
            for (const elem of elements) {
                td.appendChild(elem);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cloneAttributes(target: Element, source: any): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrs: any = source.attributes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let i: any = attrs.length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let attr: any;
        while (i--) {
            attr = attrs[parseInt(i.toString(), 10)];
            target.setAttribute(attr.name, attr.value);
        }
    }

    private refreshCell(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }, isEdit?: boolean): Element {
        const node: Element = this.element.cloneNode() as Element;
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
        if (column.type === 'dateonly' && !isNullOrUndefined(value) && typeof value === 'string') {
            const arr: string[] = value.split(/[^0-9.]/);
            value = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10));
        }
        value = this.format(column, value, data);

        innerHtml = value.toString();

        if (column.type === 'boolean' && !column.displayAsCheckBox) {
            const localeStr: string = (value !== 'true' && value !== 'false') ? null : value === 'true' ? 'True' : 'False';
            innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
        }

        const fromFormatter: Object = this.invokeFormatter(column, value, data);

        innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
        if (this.evaluate(node, cell, data, attributes, fData, isEdit) && column.type !== 'checkbox') {
            this.appendHtml(node, this.parent.sanitize(innerHtml), column.getDomSetter ? column.getDomSetter() : 'innerHTML');
        } else if (column.type === 'checkbox') {
            node.classList.add(literals.gridChkBox);
            if (this.parent.selectionSettings.persistSelection) {
                value = value === 'true';
            } else {
                value = false;
            }
            const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
            if (this.parent.cssClass) {
                addClass([checkWrap], [this.parent.cssClass]);
            }
            this.rowChkBox.id = 'checkbox-' + cell.rowID;
            checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
            node.appendChild(checkWrap);
        }

        if (this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            cell.isSelected = true;
        }

        this.setAttributes(<HTMLElement>node, cell, attributes);

        if (column.type === 'boolean' && column.displayAsCheckBox) {
            const checked: boolean = isNaN(parseInt(value.toString(), 10)) ? value === 'true' : parseInt(value.toString(), 10) > 0;
            const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: checked, label: ' ' });
            node.innerHTML = '';
            node.classList.add('e-gridchkbox-cell');
            checkWrap.classList.add('e-checkbox-disabled');
            if (this.parent.cssClass) {
                addClass([checkWrap], [this.parent.cssClass]);
            }
            node.appendChild(checkWrap);
        }
        if (node.classList.contains('e-summarycell') && !(<{key?: string}>data).key) {
            const uid: string = node.getAttribute('data-mappinguid');
            column = this.parent.getColumnByUid(uid);
            node.setAttribute('aria-label', innerHtml + this.localizer.getConstant('ColumnHeader') + cell.column.headerText);
        }
        if (this.parent.isFrozenGrid() && (!data || (data && !(<{key?: string}>data).key))) {
            addStickyColumnPosition(this.parent, column, node);
        }

        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     *
     * @param {Element} node - specifies the node
     * @param {string|Element} innerHtml - specifies the innerHTML
     * @param {string} property - specifies the element
     * @returns {Element} returns the element
     */
    public appendHtml(node: Element, innerHtml: string | Element, property: string = 'innerHTML'): Element {
        node[`${property}`] = innerHtml as string;
        return node;
    }

    /**
     * @param {HTMLElement} node - specifies the node
     * @param {cell<Column>} cell - specifies the cell
     * @param {Object} attributes - specifies the attributes
     * @returns {void}
     * @hidden
     */
    public setAttributes(node: HTMLElement, cell: Cell<Column>, attributes?: { [x: string]: Object }): void {
        const column: Column = cell.column;
        this.buildAttributeFromCell(node, cell, column.type === 'checkbox');

        setStyleAndAttributes(node, attributes);
        setStyleAndAttributes(node, cell.attributes);

        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }

        if (this.parent.rowRenderingMode === 'Vertical') {
            setStyleAndAttributes(node, { 'data-cell': column.headerText });
        }

        if (column.textAlign) {
            const alignmentClassMap: { [key in string]?: string } = { right: 'e-rightalign', left: 'e-leftalign', center: 'e-centeralign', justify: 'e-justifyalign' };
            if (alignmentClassMap[column.textAlign.toLowerCase()]) {
                node.classList.add(alignmentClassMap[column.textAlign.toLowerCase()]);
            }
        }

        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        } else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')
            && !(this.parent.allowTextWrap && (this.parent.textWrapSettings.wrapMode === 'Content'
            || this.parent.textWrapSettings.wrapMode === 'Both'))) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
    }

    public buildAttributeFromCell<Column>(node: HTMLElement, cell: Cell<Column>, isCheckBoxType?: boolean): void {
        const attr: ICell<Column> & { 'class'?: string[] } = {};
        const classes: string[] = [];

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

        if (cell.isColumnSelected) {
            classes.push(...['e-columnselection']);
        }

        if (cell.cellType === CellType.Header) {
            attr[literals.ariaColIndex] = cell.colIndex + 1;
        }   else if (!isNullOrUndefined(cell.index)) {
            attr[literals.ariaColIndex] = cell.index + 1;
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

import { isNullOrUndefined, extend, addClass } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IGrid } from '../base/interface';
import { setStyleAndAttributes, appendChildren, addStickyColumnPosition } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService, IAriaOptions } from '../services/aria-service';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { headerCellInfo } from '../base/constant';
/**
 * HeaderCellRenderer class which responsible for building header cell content.
 *
 * @hidden
 */
export class HeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent
        .createElement('TH', { className: 'e-headercell', attrs: { tabindex: '-1', role: 'columnheader' } });
    private ariaService: AriaService = new AriaService();
    private hTxtEle: Element = this.parent.createElement('span', { className: 'e-headertext' });
    private sortEle: Element = this.parent.createElement('div', { className: 'e-sortfilterdiv e-icons', attrs: {'aria-hidden': 'true'} });
    private gui: Element = this.parent.createElement('div');
    private chkAllBox: Element = this.parent.createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox', 'aria-label': this.localizer.getConstant('SelectAllCheckbox') } });
    /**
     * Function to return the wrapper for the TH content.
     *
     * @returns {string | Element} returns the element
     */
    public getGui(): string | Element {
        return <Element>this.gui.cloneNode();
    }

    /**
     * Function to render the cell content based on Column object.
     *
     * @param {Cell} cell - specifies the column
     * @param {Object} data - specifies the data
     * @param {object} attributes - specifies the aattributes
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {
        const node: Element = this.element.cloneNode() as Element;
        const fltrMenuEle: Element = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter', attrs: {'aria-hidden': 'true'} });
        return this.prepareHeader(cell, node, fltrMenuEle);
    }

    /**
     * Function to refresh the cell content based on Column object.
     *
     * @param  {Cell} cell - specifies the cell
     * @param  {Element} node - specifies the noe
     * @returns {Element} returns the element
     */
    public refresh(cell: Cell<Column>, node: Element): Element {
        this.clean(node);
        const fltrMenuEle: Element = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter', attrs: {'aria-hidden': 'true'} });
        return this.prepareHeader(cell, node, fltrMenuEle);
    }

    private clean(node: Element): void {
        node.innerHTML = '';
    }

    /* tslint:disable-next-line:max-func-body-length */
    private prepareHeader(cell: Cell<Column>, node: Element, fltrMenuEle: Element): Element {
        const column: Column = cell.column; const ariaAttr: IAriaOptions<boolean> = {};
        let elementDesc: string = '';
        //Prepare innerHtml
        const innerDIV: HTMLDivElement = <HTMLDivElement>this.getGui();
        let hValueAccer: string;
        attributes(innerDIV, {
            'data-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        if (!isNullOrUndefined(column.headerValueAccessor)) {
            hValueAccer = (this.getValue(column.headerText, column) as string);
        }
        if (this.parent.rowHeight && this.parent.allowSorting && column.allowSorting && !isNullOrUndefined(column.field)) {
            node.classList.add('e-sort-icon');
        }
        if (column.type !== 'checkbox') {
            let value: string = column.headerText;
            if (!isNullOrUndefined(hValueAccer)) {
                value = hValueAccer; }
            const headerText: Element = <Element>this.hTxtEle.cloneNode();
            headerText[column.getDomSetter()] = this.parent.sanitize(value);
            innerDIV.appendChild(headerText);
        } else {
            column.editType = 'booleanedit';
            const checkAllWrap: Element = createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
            this.chkAllBox.id = 'checkbox-' + column.uid;
            checkAllWrap.insertBefore(this.chkAllBox.cloneNode(), checkAllWrap.firstChild);
            if (this.parent.cssClass) {
                addClass([checkAllWrap], [this.parent.cssClass]);
            }
            innerDIV.appendChild(checkAllWrap);
            innerDIV.classList.add('e-headerchkcelldiv');
        }
        this.buildAttributeFromCell(node as HTMLElement, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(this.sortEle.cloneNode());
        if ((this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') &&
            (column.allowFiltering && !isNullOrUndefined(column.field)) &&
            !(this.parent.showColumnMenu && column.showColumnMenu)) {
            attributes(fltrMenuEle, {
                'data-mappinguid': 'e-flmenu-' + column.uid
            });
            elementDesc = elementDesc.length ? elementDesc + '. ' + this.localizer.getConstant('FilterDescription') : this.localizer.getConstant('FilterDescription');
            node.classList.add('e-fltr-icon');
            const matchFlColumns: Object[] = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFlColumns.length) {
                const foreignColumn: Column[] = this.parent.getForeignKeyColumns();
                for (let index: number = 0; index < this.parent.columns.length; index++) {
                    for (let count: number = 0; count < this.parent.filterSettings.columns.length; count++) {
                        if (this.parent.filterSettings.columns[parseInt(count.toString(), 10)].field === column.field
                            || (foreignColumn.length
                            && column.foreignKeyValue === this.parent.filterSettings.columns[parseInt(count.toString(), 10)].field)) {
                            fltrMenuEle.classList.add('e-filtered');
                            matchFlColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.appendChild(fltrMenuEle.cloneNode());
        }

        if (cell.className) {
            node.classList.add(cell.className);
        }

        if (column.customAttributes) {
            setStyleAndAttributes(node as HTMLElement, column.customAttributes);
        }

        if (this.parent.allowSorting && column.allowSorting) {
            ariaAttr.sort = 'none';
            elementDesc = elementDesc.length ? elementDesc + '. ' + this.localizer.getConstant('SortDescription') : this.localizer.getConstant('SortDescription');
        }
        if ((this.parent.allowGrouping && column.allowGrouping) || this.parent.allowReordering && column.allowReordering) {
            ariaAttr.grabbed = false;
            elementDesc = elementDesc.length ? elementDesc + '. ' + this.localizer.getConstant('GroupDescription') : this.localizer.getConstant('GroupDescription');
        }
        if (this.parent.showColumnMenu && column.type !== 'checkbox' && !column.template) {
            elementDesc = elementDesc.length ? elementDesc + '. ' + this.localizer.getConstant('ColumnMenuDescription') : this.localizer.getConstant('ColumnMenuDescription');
        }
        node = this.extendPrepareHeader(column, node);
        let result: Element[];
        const gridObj: IGrid = this.parent;
        const colIndex: number = gridObj.getColumnIndexByField(column.field);
        if (!isNullOrUndefined(column.headerTemplate)) {
            //need to pass the template id for blazor headertemplate
            const headerTempID: string = gridObj.element.id + column.uid + 'headerTemplate';
            const str: string = 'isStringTemplate';
            const col: Column = column;
            const isReactCompiler: boolean = this.parent.isReact && typeof (column.headerTemplate) !== 'string' && !(column.headerTemplate.prototype && column.headerTemplate.prototype.CSPTemplate);
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
            if (isReactCompiler || isReactChild || isReactPrintGrid) {
                const copied: Object = { 'index': colIndex };
                node.firstElementChild.innerHTML = '';
                column.getHeaderTemplate()(
                    extend(copied, col), gridObj, 'headerTemplate', headerTempID, this.parent[`${str}`], null, node.firstElementChild);
                this.parent.renderTemplates();
            } else {
                result = column.getHeaderTemplate()(
                    extend({ 'index': colIndex }, col), gridObj, 'headerTemplate', headerTempID, this.parent[`${str}`], undefined, undefined, this.parent['root']);
                node.firstElementChild.innerHTML = '';
                appendChildren(node.firstElementChild, result);
            }
        }
        this.ariaService.setOptions(<HTMLElement>node, ariaAttr);
        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            const alignment: string = column.headerTextAlign || column.textAlign;
            if (alignment.toLowerCase() === 'right' || alignment.toLowerCase() === 'left') {
                node.classList.add(alignment.toLowerCase() === 'right' ? 'e-rightalign' : 'e-leftalign');
            } else if (alignment.toLowerCase() === 'center') {
                node.classList.add('e-centeralign');
            } else if (alignment.toLowerCase() === 'justify') {
                node.classList.add('e-justifyalign');
            }
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        } else if ((column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip'))
            && !(gridObj.allowTextWrap && (gridObj.textWrapSettings.wrapMode === 'Header'
            || gridObj.textWrapSettings.wrapMode === 'Both'))) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
        if (elementDesc) {
            const titleElem: HTMLElement = (this.parent.createElement('span', { id: 'headerTitle-' + column.uid , innerHTML: elementDesc }));
            titleElem.style.display = 'none';
            node.appendChild(titleElem);
            node.setAttribute('aria-describedby', titleElem.id);
        }
        node.setAttribute('aria-rowspan', (!isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
            this.parent.parentDetails.parentInstObj.isReact;
        if (((this.parent.isReact && this.parent.requireTemplateRef)
            || (isReactChild && this.parent.parentDetails.parentInstObj.requireTemplateRef))
            && !isNullOrUndefined(column.headerTemplate)) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const thisRef: HeaderCellRenderer = this;
            thisRef.parent.renderTemplates(function(): void {
                thisRef.parent.trigger(headerCellInfo, {cell, node});
            });
        }
        else {
            this.parent.trigger(headerCellInfo, {cell, node});
        }
        if (this.parent.isFrozenGrid()) {
            addStickyColumnPosition(this.parent, column, node);
        }
        return node;
    }

    public getValue(field: string, column: Column): Object {
        return (column.headerValueAccessor as Function)(field, column);
    }

    private extendPrepareHeader(column: Column, node: Element): Element {
        if (this.parent.showColumnMenu && column.showColumnMenu && !isNullOrUndefined(column.field)) {
            const element: Element = (this.parent.createElement('div', { className: 'e-icons e-columnmenu', attrs: {'aria-hidden': 'true'} }));
            const matchFilteredColumns: Object[] = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFilteredColumns.length) {
                for (let i: number = 0; i < this.parent.columns.length; i++) {
                    for (let j: number = 0; j < this.parent.filterSettings.columns.length; j++) {
                        if (this.parent.filterSettings.columns[parseInt(j.toString(), 10)].field === column.field) {
                            element.classList.add('e-filtered');
                            matchFilteredColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.classList.add('e-fltr-icon');
            node.appendChild(element);
        }

        if (this.parent.allowResizing) {
            const handler: HTMLElement = this.parent.createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     *
     * @param  {Element} node - specifies the node
     * @param  {string|Element} innerHtml - specifies the innerHtml
     * @returns {Element} returns the element
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        node.appendChild(<Element>innerHtml);
        return node;
    }
}

import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IGrid } from '../base/interface';
import { setStyleAndAttributes, appendChildren } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService, IAriaOptions } from '../services/aria-service';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { headerCellInfo } from '../base/constant';
/**
 * HeaderCellRenderer class which responsible for building header cell content. 
 * @hidden
 */
export class HeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent
    .createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
    private ariaService: AriaService = new AriaService();
    private hTxtEle: Element = this.parent.createElement('span', { className: 'e-headertext' });
    private sortEle: Element = this.parent.createElement('div', { className: 'e-sortfilterdiv e-icons' });
    private gui: Element = this.parent.createElement('div');
    private chkAllBox: Element = this.parent.createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox' } });
    /**
     * Function to return the wrapper for the TH content.
     * @returns string 
     */
    public getGui(): string | Element {
        return <Element>this.gui.cloneNode();
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data     
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {
        let node: Element = this.element.cloneNode() as Element;
        let fltrMenuEle: Element = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    }

    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Element} node          
     */
    public refresh(cell: Cell<Column>, node: Element): Element {
        this.clean(node);
        let fltrMenuEle: Element = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    }

    private clean(node: Element): void {
        node.innerHTML = '';
    }

    private prepareHeader(cell: Cell<Column>, node: Element, fltrMenuEle: Element): Element {
        let column: Column = cell.column; let ariaAttr: IAriaOptions<boolean> = {};
        //Prepare innerHtml
        let innerDIV: HTMLDivElement = <HTMLDivElement>this.getGui();

        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });

        if (column.type !== 'checkbox') {
            let value: string = column.headerText;
            let headerText: Element = <Element>this.hTxtEle.cloneNode();
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
        } else {
            column.editType = 'booleanedit';
            let checkAllWrap: Element = createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
            checkAllWrap.insertBefore(this.chkAllBox.cloneNode(), checkAllWrap.firstChild);
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
                'e-mappinguid': 'e-flmenu-' + column.uid,
            });
            node.classList.add('e-fltr-icon');
            let matchFlColumns: Object[] = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFlColumns.length) {
                for (let index: number = 0; index < this.parent.columns.length; index++) {
                    for (let count: number = 0; count < this.parent.filterSettings.columns.length; count++) {
                        if (this.parent.filterSettings.columns[count].field === column.field) {
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

        if (column.allowSorting) {
            ariaAttr.sort = 'none';
        }
        if (column.allowGrouping) {
            ariaAttr.grabbed = false;
        }
        node = this.extendPrepareHeader(column, node);
        let result: Element[];
        let gridObj: IGrid = this.parent;
        let colIndex: number = gridObj.getColumnIndexByField(column.field);
        if (!isNullOrUndefined(column.headerTemplate)) {
            result = column.getHeaderTemplate()(extend({ 'index': colIndex }, column), gridObj, 'headerTemplate');
            node.firstElementChild.innerHTML = '';
            appendChildren(node.firstElementChild, result);

        }

        this.ariaService.setOptions(<HTMLElement>node, ariaAttr);

        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            let alignment: string = column.headerTextAlign || column.textAlign;
            (innerDIV as HTMLElement).style.textAlign = alignment;
            if (alignment === 'Right' || alignment === 'Left') {
                node.classList.add(alignment === 'Right' ? 'e-rightalign' : 'e-leftalign');
            } else if (alignment === 'Center') {
                node.classList.add('e-centeralign');
            }
        }

        if (column.clipMode === 'Clip') {
            node.classList.add('e-gridclip');
        } else if (column.clipMode === 'EllipsisWithTooltip') {
            node.classList.add('e-ellipsistooltip');
        }
        node.setAttribute('aria-rowspan', (!isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        this.parent.trigger(headerCellInfo, {cell, node});
        return node;
    }

    private extendPrepareHeader(column: Column, node: Element): Element {
        if (this.parent.showColumnMenu && column.showColumnMenu && !isNullOrUndefined(column.field)) {
            let element: Element = (this.parent.createElement('div', { className: 'e-icons e-columnmenu' }));
            let matchFilteredColumns: Object[] = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFilteredColumns.length) {
                for (let i: number = 0; i < this.parent.columns.length; i++) {
                    for (let j: number = 0; j < this.parent.filterSettings.columns.length; j++) {
                        if (this.parent.filterSettings.columns[j].field === column.field) {
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
            let handler: HTMLElement = this.parent.createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        node.appendChild(<Element>innerHtml);
        return node;
    }
}
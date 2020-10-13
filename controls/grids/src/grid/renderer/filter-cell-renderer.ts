import { isNullOrUndefined, getValue, closest } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IGrid } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Input } from '@syncfusion/ej2-inputs';
import { appendChildren } from '../base/util';
import { InputArgs }  from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import * as events from '../base/constant';

/**
 * FilterCellRenderer class which responsible for building filter cell.
 * @hidden 
 */
export class FilterCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TH', { className: 'e-filterbarcell' });
    private dropOptr: DropDownList;
    /**
     * Function to return the wrapper for the TH content.
     * @returns string 
     */
    public getGui(): string | Element {
        return this.parent.createElement('div');
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    /* tslint:disable-next-line:max-func-body-length */
    public render(cell: Cell<Column>, data: Object): Element {
        let tr: Element = this.parent.element.querySelector('.e-filterbar');
        let node: Element = this.element.cloneNode() as Element;
        let innerDIV: HTMLDivElement = <HTMLDivElement>this.getGui();
        let input: Element;
        let column: Column = cell.column;
        tr.appendChild(node);
        node.setAttribute('e-mappinguid', column.uid);
        if (column.filterTemplate) {
            let fltrData: Object = {};
            if (data) { fltrData[column.field] = data[column.field]; }
            let col: string = 'column';
            fltrData[col] = column;
            if (column.visible) {
                let isReactCompiler: boolean = this.parent.isReact && typeof (column.filterTemplate) !== 'string';
                let tempID: string = this.parent.element.id + column.uid + 'filterTemplate';
                if (isReactCompiler) {
                    column.getFilterTemplate()(fltrData, this.parent, 'filterTemplate', tempID, null, null, node);
                    this.parent.renderTemplates();
                } else {
                    let element: Element[] = column.getFilterTemplate()(fltrData, this.parent, 'filterTemplate', tempID);
                    appendChildren(node, element);
                }
            } else { node.classList.add('e-hide'); }
        } else {
            if (column.type !== 'checkbox') {
                if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                    node.classList.add('e-fltrtemp');
                    attributes(innerDIV, {
                        'class': 'e-fltrtempdiv'
                    });
                    if (isNullOrUndefined(column.filterBarTemplate.create)) {
                        input = this.parent.createElement('input', {
                            id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                            attrs: { type: 'search', title: column.headerText }
                        });
                        innerDIV.appendChild(input);
                    } else {
                        let args: Object = { column: column, node: Element };
                        let temp: Function = column.filterBarTemplate.create as Function;
                        if (typeof temp === 'string') {
                            temp = getValue(temp, window);
                        }
                        input = temp(args);
                        if (typeof input === 'string') {
                            let div: Element = this.parent.createElement('div');
                            div.innerHTML = input;
                            input = div.firstChild as Element;
                        }
                        attributes(innerDIV, {
                            class: 'e-filterUi_input e-filtertext e-fltrTemp',
                            title: column.headerText,
                            id: column.field + '_filterBarcell',
                        });
                        innerDIV.appendChild(input);
                    }
                } else {
                    attributes(innerDIV, {
                        'class': 'e-filterdiv e-fltrinputdiv'
                    });
                    input = this.parent.createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filtertext',
                        attrs: {
                            type: 'search', title: column.headerText + (cell.attributes as { title: string }).title,
                            value: data[cell.column.field] ? data[cell.column.field] : '', role: 'search'
                        }
                    });
                    innerDIV.appendChild(input);
                    let args: InputArgs = {
                        element: input as HTMLInputElement, floatLabelType: 'Never',
                        properties: {
                            enableRtl: this.parent.enableRtl, showClearButton: true
                        }
                    };
                    Input.createInput(args, this.parent.createElement);
                }
                //TODO: apply intial filtering
                if (column.allowFiltering === false || column.field === '' || isNullOrUndefined(column.field)) {
                    input.setAttribute('disabled', 'true');
                    input.classList.add('e-disable');
                }
                if (!column.visible) {
                    node.classList.add('e-hide');
                }

                this.appendHtml(node, innerDIV);
                // render's the dropdownlist component if showFilterBarOperator sets to true
                if (this.parent.filterSettings.showFilterBarOperator && this.parent.filterSettings.type === 'FilterBar'
                    && !this.parent.isPrinting && isNullOrUndefined(column.filterTemplate)) {
                    this.operatorIconRender(innerDIV, column, cell);
                }

                if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                    let templateWrite: Function = column.filterBarTemplate.write as Function;
                    let args: { element: Element, column: Column } = { element: input, column: column };
                    if (typeof templateWrite === 'string') {
                        templateWrite = getValue(templateWrite, window);
                    }
                    templateWrite.call(this, args);
                }
            }
        }
        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHTML
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        node.appendChild(<Element>innerHtml);
        return node;
    }

    private operatorIconRender(innerDIV: HTMLElement, column: Column, cell: Cell<Column>): void {
        let gObj: IGrid = this.parent;
        let fbicon: HTMLElement = this.parent.createElement('input', {
            className: ' e-filterbaroperator e-icons e-icon-filter',
            id: cell.column.uid
        });
        innerDIV.querySelector('span').appendChild(fbicon);
        let operators: string = (column.filter && column.filter.operator) ? column.filter.operator as string : 'equal';
        if (!isNullOrUndefined(gObj.filterModule.operators[column.field])) {
            operators = gObj.filterModule.operators[column.field];
        }
        this.dropOptr = new DropDownList({
            fields: { text: 'text', value: 'value' },
            popupHeight: 'auto',
            value: operators,
            width: '0px',
            enabled: column.allowFiltering,
            popupWidth: 'auto',
            enableRtl: this.parent.enableRtl,
            change: this.internalEvent.bind(this),
            beforeOpen: function (): void {
                let operator: Object = gObj.filterModule.customOperators;
                this.dataSource = operator[gObj.getColumnByUid(this.element.id).type + 'Operator'];
                for (let i: number = 0; i < this.dataSource.length; i++) {
                    if (column.filter && column.filter.operator && isNullOrUndefined(gObj.filterModule.operators[column.field]) &&
                        this.dataSource[i].value === column.filter.operator) {
                        this.value = column.filter.operator;
                    }
                }
            },
        });
        this.dropOptr.appendTo(fbicon);
        let spanElmt: Element = closest(this.dropOptr.element, 'span');
        spanElmt.classList.add('e-filterbardropdown');
        spanElmt.removeAttribute('tabindex');
    }

    private internalEvent(e: object): void {
        let gObj: IGrid = this.parent;
        let col: Column = gObj.getColumnByUid((<{ element?: HTMLElement }>e).element.getAttribute('id'));
        (<{ column?: object }>e).column = col;
        gObj.filterModule.operators[col.field] = (<{value ?: string }>e).value;
        gObj.notify(events.getFilterBarOperator, e);
    }
}
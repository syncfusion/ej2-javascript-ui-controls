import { IGrid } from '../base/interface';
import { isNullOrUndefined, closest, extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { InlineEditRender } from './inline-edit-renderer';
import { BatchEditRender } from './batch-edit-renderer';
import { DialogEditRender } from './dialog-edit-renderer';
import { attributes, classList, select } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { CellType } from '../base/enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { RowModelGenerator } from '../services/row-model-generator';
import { IModelGenerator, ICellRenderer } from '../base/interface';
import { Cell } from '../models/cell';
import { FocusStrategy } from '../services/focus-strategy';
import { getComplexFieldID, getObject, appendChildren, parentsUntil, extendObjWithFn, padZero } from '../base/util';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';
import { VirtualContentRenderer } from './virtual-content-renderer';

/**
 * Edit render module is used to render grid edit row.
 *
 * @hidden
 */
export class EditRender {
    //Internal variables
    private editType: Object = {
        'Inline': InlineEditRender,
        'Normal': InlineEditRender, 'Batch': BatchEditRender, 'Dialog': DialogEditRender
    };
    //Module declarations
    protected parent: IGrid;
    private renderer: InlineEditRender;
    protected serviceLocator: ServiceLocator;
    private focus: FocusStrategy;

    /**
     * Constructor for render module
     *
     * @param {IGrid} parent -specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = new this.editType[this.parent.editSettings.mode](parent, serviceLocator);
        this.focus = serviceLocator.getService<FocusStrategy>('focus');
    }

    public addNew(args: Object): void {
        this.renderer.addNew(this.getEditElements(args), args);
        this.convertWidget(args);
    }

    public update(args: Object): void {
        this.renderer.update(this.getEditElements(args), args);
        const isCustomFormValidation: boolean = (<{ isCustomFormValidation?: boolean }>args).isCustomFormValidation;
        if (!isCustomFormValidation) {
            this.parent.notify(events.beforeStartEdit, args);
            this.convertWidget(args);
        }
    }

    private convertWidget(args: {
        rowData?: Object, columnName?: string, requestType?: string, row?: Element, type?: string,
        foreignKeyData?: Object, frozenRightForm?: Element, isScroll?: boolean, form?: Element
    }): void {
        const gObj: IGrid = this.parent;
        let isFocused: boolean;
        let cell: HTMLElement;
        let value: string;
        const form: Element = gObj.editSettings.mode === 'Dialog' ?
            select('#' + gObj.element.id + '_dialogEdit_wrapper .e-gridform', document) : gObj.editSettings.showAddNewRow &&
            gObj.element.querySelector('.e-editedrow') ? gObj.element.querySelector('.e-editedrow').getElementsByClassName('e-gridform')[0]
                : gObj.element.getElementsByClassName('e-gridform')[0];
        const cols: Column[] = gObj.editSettings.mode !== 'Batch' ? gObj.getColumns() as Column[] : [gObj.getColumnByField(args.columnName)];
        for (const col of cols) {
            if (this.parent.editSettings.template && !isNullOrUndefined(col.field)) {
                const cellArgs: Object = extend({}, args);
                (<{element: Element}>cellArgs).element = form.querySelector('[name=' + getComplexFieldID(col.field) + ']');
                if (typeof col.edit.write === 'string') {
                    getObject(col.edit.write, window)(cellArgs);
                } else {
                    (col.edit.write as Function)(cellArgs);
                }
                continue;
            }
            if (this.parent.editModule.checkColumnIsGrouped(col) || col.commands) {
                continue;
            }
            // eslint-disable-next-line
            value = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            cell = form.querySelector('[data-mappinguid=' + col.uid + ']') as HTMLElement;
            let temp: Function = col.edit.write as Function;
            if (!isNullOrUndefined(cell)) {
                if (typeof temp === 'string') {
                    temp = getObject(temp, window);
                    temp({
                        rowData: args.rowData, element: cell, column: col, requestType: args.requestType, row: args.row,
                        foreignKeyData: col.isForeignColumn() && getObject(col.field, args.foreignKeyData)
                    });
                } else {
                    (col.edit.write as Function)({
                        rowData: args.rowData, element: cell, column: col, requestType: args.requestType, row: args.row,
                        foreignKeyData: col.isForeignColumn() && getObject(col.field, args.foreignKeyData)
                    });
                }
                if (!isFocused && isNullOrUndefined(cell.getAttribute('disabled')) && !parentsUntil(cell, 'e-checkbox-disabled')) {
                    const isMultilineColumn: boolean = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.params) &&
                        (col.edit.params as { multiline?: boolean }).multiline;
                    if (cell.getAttribute('type') === 'hidden' && isMultilineColumn && cell.parentElement &&
                        cell.parentElement.classList.contains('e-multi-line-input')) {
                        const textareaElement: HTMLTextAreaElement = cell.parentElement.querySelector('textarea');
                        if (textareaElement) {
                            this.focusElement(textareaElement, args.type);
                        }
                    } else {
                        this.focusElement(cell as HTMLInputElement, args.type);
                    }
                    isFocused = true;
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private focusElement(elem: HTMLInputElement | HTMLTextAreaElement, type?: string): void {
        const chkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
        if (!isNullOrUndefined(chkBox) && chkBox.nextElementSibling) {
            chkBox.nextElementSibling.classList.add('e-focus');
        }
        if (this.parent.editSettings.mode === 'Batch') {
            this.focus.onClick({ target: closest(elem, 'td') }, true);
        } else {
            const isFocus: boolean = (this.parent.enableVirtualization || this.parent.enableColumnVirtualization) && this.parent.editSettings.mode === 'Normal' ? false : true;
            const focusElement: HTMLElement = elem.classList.contains('e-dropdownlist') ? elem.parentElement : elem;
            if ((isFocus || ((this.parent.enableVirtualization || this.parent.enableColumnVirtualization) && this.parent.editSettings.newRowPosition === 'Bottom'
                && parentsUntil(elem, literals.addedRow))) && (!this.parent.editSettings.showAddNewRow ||
                    (this.parent.editSettings.showAddNewRow && (!parentsUntil(elem, literals.addedRow)) || this.parent.addNewRowFocus))) {
                focusElement.focus();
                if (this.parent.enableVirtualization && this.parent.contentModule &&
                    (this.parent.contentModule as VirtualContentRenderer).content) {
                    (this.parent.contentModule as VirtualContentRenderer).content.scrollTop += this.parent.getRowHeight();
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (focusElement as any).focus({ preventScroll: true });
            }
        }
        if (elem.classList.contains('e-defaultcell')) {
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }
    }

    public getEditElements(args: {
        rowData?: Object, columnName?: string, requestType?: string, row?: Element,
        rowIndex?: number, isScroll?: boolean, isCustomFormValidation?: boolean
    }): Object {
        const gObj: IGrid = this.parent;
        const elements: Object = {};
        let cols: Column[] = gObj.editSettings.mode !== 'Batch' ? gObj.getColumns() as Column[] : [gObj.getColumnByField(args.columnName)];
        if (args.isCustomFormValidation) {
            cols = (<{ columnModel?: Column[] }>this.parent).columnModel;
        }
        if (this.parent.editSettings.template) {
            return {};
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            const col: Column = cols[parseInt(i.toString(), 10)];
            if (col.commands || col.commandsTemplate) {
                const cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
                const model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
                const cellRenderer: ICellRenderer<{}> = cellRendererFact.getCellRenderer(CellType.CommandColumn);
                const cells: Cell<Column>[] = model.generateRows(args.rowData)[0].cells;
                const cell: Cell<Column>[] = cells.filter((cell: Cell<Column>) => cell.rowID);
                const td: Element = cellRenderer.render(
                    cell[parseInt(i.toString(), 10)], args.rowData, <{ [x: string]: string }>{ 'data-index': args.row ? (parseInt(args.row.getAttribute(
                        literals.ariaRowIndex), 10) - 1).toString() : 0 }, this.parent.enableVirtualization);
                const div: Element = td.firstElementChild;
                div.setAttribute('textAlign', td.getAttribute('textAlign'));
                elements[col.uid] = div;
                continue;
            }
            if (col.type === 'dateonly' && args.rowData[col.field] instanceof Date) {
                const cellValue: Date = args.rowData[col.field];
                args.rowData[col.field] = cellValue.getFullYear() + '-' + padZero(cellValue.getMonth() + 1) + '-' + padZero(cellValue.getDate());
            }
            const value: string = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            const tArgs: Object = { column: col, value: value, type: args.requestType, data: args.rowData };
            let temp: Function = col.edit.create as Function;
            let input: Element;
            if (col.editTemplate) {
                input = this.parent.createElement('span', {attrs: {'data-mappinguid': col.uid}});
                const tempID: string = this.parent.element.id + col.uid + 'editTemplate';
                const tempData: object = extendObjWithFn({}, args.rowData, { column: col });
                const isReactCompiler: boolean = this.parent.isReact && typeof (col.editTemplate) !== 'string' &&
                    !(col.editTemplate.prototype && col.editTemplate.prototype.CSPTemplate);
                const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                    this.parent.parentDetails.parentInstObj.isReact;
                if (isReactCompiler || isReactChild) {
                    col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID, null, null, input);
                    this.parent.renderTemplates();
                } else {
                    const template: Element[] | NodeList = col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID, null, null, null, gObj.root);
                    appendChildren(input, template);
                }
            } else {
                if (typeof temp === 'string') {
                    temp = getObject(temp, window);
                    input = temp(tArgs);
                } else {
                    input = (col.edit.create as Function)(tArgs);
                }
                if (typeof input === 'string') {
                    const div: Element = this.parent.createElement('div');
                    div.innerHTML = input;
                    input = div.firstChild as Element;
                }
                const isInput: number = input.tagName !== 'input' && input.querySelectorAll('input').length;
                const complexFieldName: string = getComplexFieldID(col.field);
                attributes(isInput ? input.querySelector('input') : input, {
                    name: complexFieldName, 'data-mappinguid': col.uid,
                    id: gObj.element.id + complexFieldName
                });
                classList(input, ['e-input', 'e-field'], []);
                if (col.textAlign === 'Right') {
                    input.classList.add('e-ralign');
                }
                if ((col.isPrimaryKey || col.isIdentity) && args.requestType === 'beginEdit' ||
                    (col.isIdentity && args.requestType === 'add')) { // already disabled in cell plugins
                    input.setAttribute('disabled', '');
                }
            }
            elements[col.uid] = input;
        }
        return elements;
    }

    public destroy(): void {
        this.renderer.removeEventListener();
    }
}


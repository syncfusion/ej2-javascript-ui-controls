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
import { getComplexFieldID, getObject, appendChildren, parentsUntil, extendObjWithFn } from '../base/util';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';

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
        let fForm: Element;
        let frForm: Element;
        const frzCols: boolean = gObj.isFrozenGrid();
        const index: number = gObj.getFrozenMode() === 'Right' && gObj.editSettings.mode === 'Normal' ? 1 : 0;
        const form: Element = gObj.editSettings.mode === 'Dialog' ?
            select('#' + gObj.element.id + '_dialogEdit_wrapper .e-gridform', document) :
            gObj.element.getElementsByClassName('e-gridform')[index];
        const isVirtualFrozen: boolean = frzCols && this.parent.enableColumnVirtualization && args.isScroll;
        if (frzCols && gObj.editSettings.mode === 'Normal') {
            const rowIndex: number = parseInt(args.row.getAttribute(literals.ariaRowIndex), 10);
            if (gObj.frozenRows && ((args.requestType === 'add' && gObj.editSettings.newRowPosition === 'Top')
                || rowIndex < gObj.frozenRows)) {
                fForm = gObj.element.querySelector('.' + literals.movableHeader).querySelector('.e-gridform');
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    frForm = args.frozenRightForm;
                }
            } else {
                fForm = gObj.element.querySelector('.' + literals.movableContent).querySelector('.e-gridform');
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    frForm = args.frozenRightForm;
                }
            }
        }
        const cols: Column[] = gObj.editSettings.mode !== 'Batch' ? gObj.getColumns() as Column[] : [gObj.getColumnByField(args.columnName)];
        for (const col of cols) {
            if (isVirtualFrozen && col.getFreezeTableName() !== 'movable') {
                continue;
            }
            if (this.parent.editSettings.template && !isNullOrUndefined(col.field)) {
                const cellArgs: Object = extend({}, args);
                (<{element: Element}>cellArgs).element = form.querySelector('[name=' + getComplexFieldID(col.field) + ']');
                if (isNullOrUndefined((<{element: Element}>cellArgs).element) && frzCols) {
                    (<{element: Element}>cellArgs).element = fForm.querySelector('[name=' + getComplexFieldID(col.field) + ']');
                }
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
            if (col.getFreezeTableName() === 'movable' && gObj.editSettings.mode === 'Normal') {
                cell = fForm.querySelector('[e-mappinguid=' + col.uid + ']') as HTMLElement;
            } else if (frForm && col.getFreezeTableName() === literals.frozenRight && gObj.editSettings.mode === 'Normal') {
                cell = frForm.querySelector('[e-mappinguid=' + col.uid + ']') as HTMLElement;
            } else {
                cell = form.querySelector('[e-mappinguid=' + col.uid + ']') as HTMLElement;
            }
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
                if (!isFocused && !cell.getAttribute('disabled') && !parentsUntil(cell, 'e-checkbox-disabled')) {
                    this.focusElement(cell as HTMLInputElement, args.type);
                    isFocused = true;
                }
            }
        }
        if (frzCols && !this.parent.allowTextWrap && ((args.requestType === 'add') || args.requestType === 'beginEdit')
            && this.parent.editSettings.mode !== 'Dialog' && !isNullOrUndefined(form) && !isNullOrUndefined(fForm)) {
            const mTdElement: Element = (fForm.querySelector('tr').children[0]);
            const fTdElement: Element = (form.querySelector('tr').children[0]);
            if ((<HTMLElement>fTdElement).offsetHeight > (<HTMLElement>mTdElement).offsetHeight) {
                (<HTMLElement>mTdElement).style.height = (<HTMLElement>fTdElement).offsetHeight + 'px';
                if (frForm) {
                    const frTdElement: Element = fForm.querySelector('tr').children[0];
                    (<HTMLElement>frTdElement).style.height = (<HTMLElement>fTdElement).offsetHeight + 'px';
                }
            } else {
                (<HTMLElement>fTdElement).style.height = (<HTMLElement>mTdElement).offsetHeight + 'px';
                if (frForm) {
                    const frTdElement: Element = fForm.querySelector('tr').children[0];
                    (<HTMLElement>frTdElement).style.height = (<HTMLElement>mTdElement).offsetHeight + 'px';
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private focusElement(elem: HTMLInputElement, type?: string): void {
        const chkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
        if (!isNullOrUndefined(chkBox)) {
            chkBox.nextElementSibling.classList.add('e-focus');
        }
        if (this.parent.editSettings.mode === 'Batch') {
            this.focus.onClick({ target: closest(elem, 'td') }, true);
        } else {
            const isFocus: boolean = this.parent.enableVirtualization && this.parent.editSettings.mode === 'Normal' ? false : true;
            if (isFocus || (this.parent.enableVirtualization && this.parent.editSettings.newRowPosition === 'Bottom'
                && parentsUntil(elem, literals.addedRow))) {
                elem.focus();
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (elem as any).focus({ preventScroll: true });
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
        const isVirtualFrozen: boolean = gObj.isFrozenGrid() && gObj.enableColumnVirtualization && args.isScroll;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            const col: Column = cols[i];
            if (this.parent.editModule.checkColumnIsGrouped(col) || (isVirtualFrozen && cols[i].getFreezeTableName() !== 'movable')
                || (args.isCustomFormValidation && (col.commands || col.commandsTemplate || !col.field))) {
                continue;
            }
            if (col.commands || col.commandsTemplate) {
                const cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
                const model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
                const cellRenderer: ICellRenderer<{}> = cellRendererFact.getCellRenderer(CellType.CommandColumn);
                const cells: Cell<Column>[] = model.generateRows(args.rowData)[0].cells;
                const cell: Cell<Column>[] = cells.filter((cell: Cell<Column>) => cell.rowID);
                const td: Element = cellRenderer.render(
                    cell[i], args.rowData, <{ [x: string]: string }>{ 'index': args.row ? args.row.getAttribute(literals.ariaRowIndex) : 0 }, this.parent.enableVirtualization);
                const div: Element = td.firstElementChild;
                div.setAttribute('textAlign', td.getAttribute('textAlign'));
                elements[col.uid] = div;
                continue;
            }
            const value: string = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            const tArgs: Object = { column: col, value: value, type: args.requestType, data: args.rowData };
            let temp: Function = col.edit.create as Function;
            let input: Element;
            if (col.editTemplate) {
                input = this.parent.createElement('span', {attrs: {'e-mappinguid': col.uid}});
                const tempID: string = this.parent.element.id + col.uid + 'editTemplate';
                const tempData: object = extendObjWithFn({}, args.rowData, { column: col });
                const isReactCompiler: boolean = this.parent.isReact && typeof (col.editTemplate) !== 'string';
                if (isReactCompiler) {
                    col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID, null, null, input);
                    this.parent.renderTemplates();
                } else {
                    const template: Element[] | NodeList = col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID);
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
                    name: complexFieldName, 'e-mappinguid': col.uid,
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


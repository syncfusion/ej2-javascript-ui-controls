import { IGrid } from '../base/interface';
import { isNullOrUndefined, closest, extend, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { InlineEditRender } from './inline-edit-renderer';
import { BatchEditRender } from './batch-edit-renderer';
import { DialogEditRender } from './dialog-edit-renderer';
import { attributes, classList, isBlazor } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { CellType } from '../base/enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { RowModelGenerator } from '../services/row-model-generator';
import { IModelGenerator, ICellRenderer } from '../base/interface';
import { Cell } from '../models/cell';
import { FocusStrategy } from '../services/focus-strategy';
import { getComplexFieldID, getObject, appendChildren, parentsUntil, extendObjWithFn } from '../base/util';
import * as events from '../base/constant';
/**
 * Edit render module is used to render grid edit row.
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
        this.parent.notify(events.beforeStartEdit, args);
        this.convertWidget(args);
    }

    private convertWidget(args: {
        rowData?: Object, columnName?: string, requestType?: string, row?: Element, type?: string,
        foreignKeyData?: Object
    }): void {
        let gObj: IGrid = this.parent;
        let isFocused: boolean;
        let cell: HTMLElement;
        let value: string;
        let fForm: Element;
        let frzCols: number = gObj.getFrozenColumns();
        let form: Element = gObj.editSettings.mode === 'Dialog' ?
        document.querySelector('#' + gObj.element.id + '_dialogEdit_wrapper').querySelector('.e-gridform') :
        gObj.element.querySelector('.e-gridform');
        if (frzCols && gObj.editSettings.mode === 'Normal') {
            let rowIndex: number = parseInt(args.row.getAttribute('aria-rowindex'), 10);
            if (gObj.frozenRows && ((args.requestType === 'add' && gObj.editSettings.newRowPosition === 'Top')
                || rowIndex < gObj.frozenRows)) {
                fForm = gObj.element.querySelector('.e-movableheader').querySelector('.e-gridform');
            } else {
                fForm = gObj.element.querySelector('.e-movablecontent').querySelector('.e-gridform');
            }
        }
        let cols: Column[] = gObj.editSettings.mode !== 'Batch' ? gObj.getColumns() as Column[] : [gObj.getColumnByField(args.columnName)];
        for (let col of cols) {
            if (this.parent.editSettings.template && !isNullOrUndefined(col.field)) {
                let cellArgs: Object = extend({}, args);
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
            value = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            if (frzCols && cols.indexOf(col) >= frzCols && gObj.editSettings.mode === 'Normal') {
                cell = fForm.querySelector('[e-mappinguid=' + col.uid + ']') as HTMLElement;
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
                if (!isFocused && !cell.getAttribute('disabled')) {
                    this.focusElement(cell as HTMLInputElement, args.type);
                    isFocused = true;
                }
            }
        }
        if (frzCols !== 0 && !this.parent.allowTextWrap && ((args.requestType === 'add') || args.requestType === 'beginEdit')
            && this.parent.editSettings.mode !== 'Dialog' && !isNullOrUndefined(form) && !isNullOrUndefined(fForm)) {
            let mTdElement: Element = (fForm.querySelector('tr').children[0]);
            let fTdElement: Element = (form.querySelector('tr').children[0]);
            if ((<HTMLElement>fTdElement).offsetHeight > (<HTMLElement>mTdElement).offsetHeight) {
                (<HTMLElement>mTdElement).style.height = (<HTMLElement>fTdElement).offsetHeight + 'px';
            } else {
                (<HTMLElement>fTdElement).style.height = (<HTMLElement>mTdElement).offsetHeight + 'px';
            }
        }
    }

    private focusElement(elem: HTMLInputElement, type?: string): void {
        let chkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
        if (!isNullOrUndefined(chkBox)) {
            chkBox.nextElementSibling.classList.add('e-focus');
        }
        if (this.parent.editSettings.mode === 'Batch') {
            this.focus.onClick({ target: closest(elem, 'td') }, true);
        } else {
            let isFocus: boolean = this.parent.enableVirtualization && this.parent.editSettings.mode === 'Normal' ? false : true;
            if (isFocus || (this.parent.enableVirtualization && this.parent.editSettings.newRowPosition === 'Bottom'
                && parentsUntil(elem, 'e-addedrow'))) {
                elem.focus();
            } else {
                // tslint:disable-next-line:no-any
                (elem as any).focus({ preventScroll: true });
            }
        }
        if (elem.classList.contains('e-defaultcell')) {
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }
    }

    private getEditElements(args: { rowData?: Object, columnName?: string, requestType?: string, row?: Element,
                            rowIndex?: number }): Object {
        let gObj: IGrid = this.parent;
        let elements: Object = {};
        let cols: Column[] = gObj.editSettings.mode !== 'Batch' ? gObj.getColumns() as Column[] : [gObj.getColumnByField(args.columnName)];
        if (this.parent.editSettings.template) {
            return {};
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            let col: Column = cols[i];
            if (this.parent.editModule.checkColumnIsGrouped(col)) {
                continue;
            }
            if (col.commands || col.commandsTemplate) {
                let cells: Cell<Column>[];
                let cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
                let model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
                let cellRenderer: ICellRenderer<{}> = cellRendererFact.getCellRenderer(CellType.CommandColumn);
                cells = model.generateRows(args.rowData)[0].cells;
                let cell: Cell<Column>[] = cells.filter((cell: Cell<Column>) => cell.rowID);
                let td: Element = cellRenderer.render(
                    cell[i], args.rowData, <{ [x: string]: string }>{ 'index': args.row ? args.row.getAttribute('aria-rowindex') : 0 });
                let div: Element = td.firstElementChild;
                div.setAttribute('textAlign', td.getAttribute('textAlign'));
                elements[col.uid] = div;
                continue;
            }
            let value: string = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            let tArgs: Object = { column: col, value: value, type: args.requestType, data: args.rowData };
            let temp: Function = col.edit.create as Function;
            let input: Element;
            if (col.editTemplate) {
                input = this.parent.createElement('span', {attrs: {'e-mappinguid': col.uid}});
                let tempID: string = this.parent.element.id + col.uid + 'editTemplate';
                let tempData: object = extendObjWithFn({}, args.rowData, { column: col });
                let isReactCompiler: boolean = this.parent.isReact && typeof (col.editTemplate) !== 'string';
                if (isReactCompiler) {
                    col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID, null, null, input);
                    this.parent.renderTemplates();
                } else {
                    let template: Element[] | NodeList = col.getEditTemplate()(
                        extend({ 'index': args.rowIndex }, tempData), this.parent, 'editTemplate', tempID);
                    appendChildren(input, template);
                }
                if (isBlazor()) {
                    let setRules: Function = (ruleColumn: Column) => {
                        let column: Column = ruleColumn;
                        let func: Function = () => {
                            this.parent.editModule.formObj.rules[column.field] = column.validationRules as {[rule: string]: Object};
                        };
                        return func;
                    };
                    updateBlazorTemplate(tempID, 'EditTemplate', col, true, setRules(col));
                }
            } else {
                if (typeof temp === 'string') {
                    temp = getObject(temp, window);
                    input = temp(tArgs);
                } else {
                    input = (col.edit.create as Function)(tArgs);
                }
                if (typeof input === 'string') {
                    let div: Element = this.parent.createElement('div');
                    div.innerHTML = input;
                    input = div.firstChild as Element;
                }
                let isInput: number = input.tagName !== 'input' && input.querySelectorAll('input').length;
                let complexFieldName: string = getComplexFieldID(col.field);
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


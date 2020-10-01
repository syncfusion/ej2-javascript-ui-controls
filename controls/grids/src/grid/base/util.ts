import { ChildProperty, compile as baseTemplateComplier, setValue, Internationalization, isUndefined, closest } from '@syncfusion/ej2-base';
import { extend as baseExtend, isNullOrUndefined, getValue, classList, NumberFormatOptions } from '@syncfusion/ej2-base';
import { setStyleAttribute, addClass, attributes, remove, createElement, DateFormatOptions, removeClass } from '@syncfusion/ej2-base';
import { isObject, IKeyValue, isBlazor, Browser } from '@syncfusion/ej2-base';
import {
    IPosition, IGrid, IValueFormatter, IRow, ICell, IExpandedRow, PdfExportProperties,
    ExcelExportProperties, DataStateChangeEventArgs
} from './interface';
import { ServiceLocator } from '../services/service-locator';
import { DataUtil, Query, DataManager, Predicate, UrlAdaptor, Deferred } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ColumnModel, AggregateColumnModel } from '../models/models';
import { AggregateType, HierarchyGridPrintMode } from './enum';
import { Dialog, calculateRelativeBasedPosition, Popup, calculatePosition } from '@syncfusion/ej2-popups';
import { PredicateModel } from './grid-model';
import { Print } from '../actions/print';
import { IXLFilter, FilterStateObj } from '../common/filter-interface';

//https://typescript.codeplex.com/discussions/401501
/**
 * Function to check whether target object implement specific interface
 * @param  {Object} target
 * @param  {string} checkFor
 * @returns no
 * @hidden
 */
export function doesImplementInterface(target: Object, checkFor: string): boolean {
    /* tslint:disable:no-any */
    return (<any>target).prototype && checkFor in (<any>target).prototype;
}
/**
 * Function to get value from provided data 
 * @param  {string} field
 * @param  {Object} data
 * @param  {IColumn} column
 * @hidden
 */
export function valueAccessor(field: string, data: Object, column: ColumnModel): Object {
    return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, data);
}

/**
 * Defines the method used to apply custom header cell values from external function and display this on each header cell rendered.
 * @param  {string} field
 * @param  {IColumn} column
 * @hidden
 */
export function headerValueAccessor(field: string, column: ColumnModel): Object {
    return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, column);
}

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export function getUpdateUsingRaf<T>(updateFunction: Function, callBack: Function): void {
    requestAnimationFrame(() => {
        try {
            callBack(null, updateFunction());
        } catch (e) {
            callBack(e);
        }
    });
}

/**
 * @hidden
 */

export function isExportColumns(exportProperties: PdfExportProperties | ExcelExportProperties): boolean {

    return !isNullOrUndefined(exportProperties) &&
        !isNullOrUndefined(exportProperties.columns) && exportProperties.columns.length > 0;
}

/**
 * @hidden
 */
export function updateColumnTypeForExportColumns(exportProperties: PdfExportProperties | ExcelExportProperties, gObj: IGrid): void {
    let exportColumns: Column[] = exportProperties.columns;
    let gridColumns: Column[] = gObj.columns as Column[];
    for (let i: number = 0; i < exportColumns.length; i++) {
        if (gridColumns.length - 1 >= i) {
            if (gridColumns[i].columns) {
                for (let j: number = 0; j < gridColumns[i].columns.length; j++) {
                    (exportColumns[i].columns[j] as Column).type = (gridColumns[i].columns[j] as Column).type;
                }
            } else {
                exportColumns[i].type = gridColumns[i].type;
            }
        }
    }
}

/**
 * @hidden
 */
export function updatecloneRow(grid: IGrid): void {
    let nRows: Row<Column>[] = []; let actualRows: Row<Column>[] = grid.vRows;
    for (let i: number = 0; i < actualRows.length; i++) {
        if (actualRows[i].isDataRow) {
            nRows.push(actualRows[i]);
        } else if (!actualRows[i].isDataRow) {
            nRows.push(actualRows[i]);
            if (!actualRows[i].isExpand && actualRows[i].isCaptionRow) {
                i += getCollapsedRowsCount(actualRows[i], grid);
            }
        }
    }
    grid.vcRows = nRows;
}


/**
 * @hidden
 */
let count: number = 0;
export function getCollapsedRowsCount(val: Row<Column>, grid: IGrid): number {
    count = 0;
    let gSummary: string = 'gSummary'; let total: string = 'count';
    let gLen: number = grid.groupSettings.columns.length;
    let records: string = 'records';
    let items: string = 'items';
    let value: number = val[gSummary];
    let dataRowCnt: number = 0;
    let agrCnt: string = 'aggregatesCount';
    if (value === val.data[total]) {
        if (grid.groupSettings.columns.length && !isNullOrUndefined(val[agrCnt]) && val[agrCnt]) {
            if (grid.groupSettings.columns.length !== 1) {
                count += (val.indent !== 0 && (value) < 2) ? (val[gSummary] * ((gLen - val.indent) + (gLen - val.indent) * val[agrCnt])) :
                    (val[gSummary] * ((gLen - val.indent) + (gLen - val.indent - 1) * val[agrCnt])) + val[agrCnt];
            } else if (grid.groupSettings.columns.length === 1) {
                count += (val[gSummary] * (gLen - val.indent)) + val[agrCnt];
            }
        } else if (grid.groupSettings.columns.length) {
            if (grid.groupSettings.columns.length !== 1) {
                count += val[gSummary] * (grid.groupSettings.columns.length - val.indent);
            } else {
                count += val[gSummary];
            }
        }
        return count;
    } else {
        for (let i: number = 0, len: number = val.data[items].length; i < len; i++) {
            let gLevel: Object[] = val.data[items][i];
            count += gLevel[items].length + ((gLen !== grid.columns.length) &&
                !isNullOrUndefined(gLevel[items][records]) ? gLevel[items][records].length : 0);
            dataRowCnt += (!isNullOrUndefined(gLevel[items][records]) && !isNullOrUndefined(val[agrCnt])) ? gLevel[items][records].length :
                gLevel[items].length;
            if (gLevel[items].GroupGuid && gLevel[items].childLevels !== 0) {
                recursive(gLevel);
            }
        }
        count += val.data[items].length;
        if (!isNullOrUndefined(val[agrCnt])) {
            if (val[agrCnt] && count && dataRowCnt !== 0) {
                count += ((count - dataRowCnt) * val[agrCnt]) + val[agrCnt];
            }
        }
    }
    return count;
}

/**
 * @hidden
 */
export function recursive(row: Object[]): void {
    let items: string = 'items';
    let rCount: string = 'count';
    for (let j: number = 0, length: number = row[items].length; j < length; j++) {
        let nLevel: Object[] = row[items][j];
        count += nLevel[rCount];
        if (nLevel[items].childLevels !== 0) {
            recursive(nLevel);
        }
    }
}


/**
 * @hidden
 */
export function iterateArrayOrObject<T, U>(collection: U[], predicate: (item: Object, index: number) => T): T[] {
    let result: T[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        let pred: T = predicate(collection[i], i);
        if (!isNullOrUndefined(pred)) {
            result.push(<T>pred);
        }
    }
    return result;
}

/** @hidden */
export function iterateExtend(array: Object[]): Object[] {
    let obj: Object[] = [];
    for (let i: number = 0; i < array.length; i++) {
        obj.push(baseExtend({}, getActualProperties(array[i]), {}, true));
    }
    return obj;
}

/** @hidden */
export function templateCompiler(template: string): Function {
    if (template) {
        let e: Object;
        try {
            if (document.querySelectorAll(template).length) {
                return baseTemplateComplier(document.querySelector(template).innerHTML.trim());
            }
        } catch (e) {
            return baseTemplateComplier(template);
        }
    }
    return undefined;
}

/** @hidden */
export function setStyleAndAttributes(node: Element, customAttributes: { [x: string]: Object }): void {
    let copyAttr: { [x: string]: Object } = {}; let literals: string[] = ['style', 'class'];

    //Dont touch the original object - make a copy
    baseExtend(copyAttr, customAttributes, {});

    if ('style' in copyAttr) {
        setStyleAttribute(node as HTMLElement, copyAttr[literals[0]] as { [x: string]: Object });
        delete copyAttr[literals[0]];
    }

    if ('class' in copyAttr) {
        addClass([node], copyAttr[literals[1]] as string | string[]);
        delete copyAttr[literals[1]];
    }

    attributes(node, copyAttr as { [x: string]: string });
}
/** @hidden */
export function extend(copied: Object, first: Object, second?: Object, exclude?: string[]): Object {
    let moved: Object = baseExtend(copied, first, second);

    let values: string[] = Object.keys(moved);
    for (let i: number = 0; i < values.length; i++) {
        if (exclude && exclude.indexOf(values[i]) !== -1) {
            delete moved[values[i]];
        }
    }

    return moved;
}

/** @hidden */
export function setColumnIndex(columnModel: Column[], ind: number = 0): number {
    for (let i: number = 0, len: number = columnModel.length; i < len; i++) {
        if ((columnModel[i] as Column).columns) {
            (columnModel[i] as Column).index = isNullOrUndefined((columnModel[i] as Column).index) ? ind : (columnModel[i] as Column).index;
            ind++;
            ind = setColumnIndex(<Column[]>(columnModel[i] as Column).columns, ind);
        } else {
            (columnModel[i] as Column).index = isNullOrUndefined((columnModel[i] as Column).index) ? ind : (columnModel[i] as Column).index;
            ind++;

        }
    }
    return ind;
}

/** @hidden */
export function prepareColumns(columns: Column[] | string[] | ColumnModel[], autoWidth?: boolean): Column[] {
    for (let c: number = 0, len: number = columns.length; c < len; c++) {

        let column: Column;

        if (typeof columns[c] === 'string') {
            column = new Column({ field: <string>columns[c] });
        } else if (!(columns[c] instanceof Column)) {
            if (!(columns[c] as Column).columns) {
                column = new Column(columns[c] as Column);
            } else {
                (columns[c] as Column).columns = prepareColumns((columns[c] as Column).columns);
                column = new Column(columns[c] as Column);
            }
        } else {
            column = <Column>columns[c];
        }

        if (column.type && column.type.toLowerCase() === 'checkbox') {
            column.allowReordering = false;
        }

        column.headerText = isNullOrUndefined(column.headerText) ? column.foreignKeyValue || column.field || '' : column.headerText;

        column.foreignKeyField = column.foreignKeyField || column.field;

        column.valueAccessor = (typeof column.valueAccessor === 'string' ? getValue(<string>column.valueAccessor, window)
            : column.valueAccessor) || valueAccessor;

        column.width = autoWidth && isNullOrUndefined(column.width) ? 200 : column.width;

        if (isNullOrUndefined(column.visible)) {
            column.visible = true;
        }

        columns[c] = column;

    }
    return columns as Column[];
}

/** @hidden */
export function setCssInGridPopUp(popUp: HTMLElement, e: MouseEvent | TouchEvent, className: string): void {
    let popUpSpan: HTMLElement = popUp.querySelector('span');
    let position: { top: number, left: number, right: number } = popUp.parentElement.getBoundingClientRect();
    let targetPosition: { top: number, left: number, right: number } = (e.target as HTMLElement).getBoundingClientRect();
    let isBottomTail: boolean;
    popUpSpan.className = className;
    popUp.style.display = '';
    isBottomTail = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY) > popUp.offsetHeight + 10;
    popUp.style.top = targetPosition.top - position.top +
        (isBottomTail ? -(popUp.offsetHeight + 10) : popUp.offsetHeight + 10) + 'px'; //10px for tail element
    popUp.style.left = getPopupLeftPosition(popUp, e, targetPosition, position.left) + 'px';
    if (isBottomTail) {
        (popUp.querySelector('.e-downtail') as HTMLElement).style.display = '';
        (popUp.querySelector('.e-uptail') as HTMLElement).style.display = 'none';
    } else {
        (popUp.querySelector('.e-downtail') as HTMLElement).style.display = 'none';
        (popUp.querySelector('.e-uptail') as HTMLElement).style.display = '';
    }
}
/** @hidden */
function getPopupLeftPosition(
    popup: HTMLElement, e: MouseEvent | TouchEvent, targetPosition: { top: number, left: number, right: number }, left: number): number {
    let width: number = popup.offsetWidth / 2;
    let x: number = getPosition(e).x;
    if (x - targetPosition.left < width) {
        return targetPosition.left - left;
    } else if (targetPosition.right - x < width) {
        return targetPosition.right - left - width * 2;
    } else {
        return x - left - width;
    }
}
/** @hidden */
export function getActualProperties<T>(obj: T): T {
    if (obj instanceof ChildProperty) {
        return <T>getValue('properties', obj);
    } else {
        return obj;
    }
}
/** @hidden */
export function parentsUntil(elem: Element, selector: string, isID?: boolean): Element {
    let parent: Element = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}
/** @hidden */
export function getElementIndex(element: Element, elements: Element[]): number {
    let index: number = -1;
    for (let i: number = 0, len: number = elements.length; i < len; i++) {
        if (elements[i].isEqualNode(element)) {
            index = i;
            break;
        }
    }
    return index;
}
/** @hidden */
export function inArray(value: Object, collection: Object[]): number {
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}

/** @hidden */
export function getActualPropFromColl(collection: Object[]): Object[] {
    let coll: Object[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i].hasOwnProperty('properties')) {
            coll.push((collection[i] as { properties: Object }).properties);
        } else {
            coll.push(collection[i]);
        }
    }
    return coll;
}

/** @hidden */
export function removeElement(target: Element, selector: string): void {
    let elements: HTMLElement[] = [].slice.call(target.querySelectorAll(selector));
    for (let i: number = 0; i < elements.length; i++) {
        remove(elements[i]);
    }
}

/** @hidden */
export function getPosition(e: MouseEvent | TouchEvent): IPosition {
    let position: IPosition = {} as IPosition;
    position.x = (isNullOrUndefined((e as MouseEvent).clientX) ? (e as TouchEvent).changedTouches[0].clientX :
        (e as MouseEvent).clientX);
    position.y = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY);
    return position;
}


let uid: number = 0;
/** @hidden */
export function getUid(prefix: string): string {
    return prefix + uid++;
}

/** @hidden */
export function appendChildren(elem: Element | DocumentFragment, children: Element[] | NodeList): Element {
    for (let i: number = 0, len: number = children.length; i < len; i++) {
        if (len === children.length) {
            elem.appendChild(children[i]);
        } else {
            elem.appendChild(children[0]);
        }
    }
    return elem as Element;
}

/** @hidden */
export function parents(elem: Element, selector: string, isID?: boolean): Element[] {
    let parent: Element = elem;
    let parents: Element[] = [];
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
    }
    return parents;
}

/** @hidden */
export function calculateAggregate(type: AggregateType | string, data: Object, column?: AggregateColumnModel, context?: Object): Object {
    if (type === 'Custom') {
        let temp: Function = column.customAggregate as Function;
        if (typeof temp === 'string') {
            temp = getValue(temp, window);
        }
        return temp ? temp.call(context, data, column) : '';
    }
    return (column.field in data || data instanceof Array) ? DataUtil.aggregates[type.toLowerCase()](data, column.field) : null;
}
/** @hidden */
let scrollWidth: number = null;

/** @hidden */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    let divNode: HTMLDivElement = document.createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

/** @hidden */
let rowHeight: number;
/** @hidden */
export function getRowHeight(element?: HTMLElement): number {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    let table: HTMLTableElement = <HTMLTableElement>createElement('table', { className: 'e-table', styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    let rect: ClientRect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}

/** @hidden */
export function isComplexField(field: string): boolean {
    return field.split('.').length > 1;
}
/** @hidden */
export function getComplexFieldID(field: string = ''): string {
    return field.replace(/\./g, '___');
}
/** @hidden */
export function setComplexFieldID(field: string = ''): string {
    return field.replace(/___/g, '.');
}

/** @hidden */
export function isEditable(col: Column, type: string, elem: Element): boolean {
    let row: Element = parentsUntil(elem, 'e-row');
    let isOldRow: boolean = !row ? true : row && !row.classList.contains('e-insertedrow');
    if (type === 'beginEdit' && isOldRow) {
        if (col.isIdentity || col.isPrimaryKey || !col.allowEditing) {
            return false;
        }
        return true;
    } else if (type === 'add' && col.isIdentity) {
        return false;
    } else {
        if (isOldRow && !col.allowEditing && !col.isIdentity && !col.isPrimaryKey) {
            return false;
        }
        return true;
    }
}

/** @hidden */
export function isActionPrevent(inst: IGrid): boolean {
    let dlg: HTMLElement = inst.element.querySelector('#' + inst.element.id + 'EditConfirm') as HTMLElement;
    return inst.editSettings.mode === 'Batch' &&
        (inst.element.querySelectorAll('.e-updatedtd').length) && inst.editSettings.showConfirmDialog &&
        (dlg ? dlg.classList.contains('e-popup-close') : true);
}

/** @hidden */
export function wrap(elem: any, action: boolean): void {
    let clName: string = 'e-wrap';
    elem = elem instanceof Array ? elem : [elem];
    for (let i: number = 0; i < elem.length; i++) {
        action ? elem[i].classList.add(clName) : elem[i].classList.remove(clName);
    }
}

/** @hidden */
export function setFormatter(serviceLocator?: ServiceLocator, column?: Column, isServerRendered?: boolean): void {
    let fmtr: IValueFormatter = serviceLocator.getService<IValueFormatter>('valueFormatter');
    let format: string = 'format';
    let args: object;
    if (column.type === 'date' || column.type === 'datetime') {
        args = { type: column.type, skeleton: column.format };
        if (isBlazor() && isServerRendered) {
            let isServer: string = 'isServerRendered';
            args[isServer] = isServerRendered;
        }
        if ((typeof (column.format) === 'string') && column.format !== 'yMd') {
            args[format] = column.format;
        }
    }
    switch (column.type) {
        case 'date':
            column.setFormatter(
                fmtr.getFormatFunction(args as DateFormatOptions));
            column.setParser(
                fmtr.getParserFunction(args as DateFormatOptions));
            break;
        case 'datetime':
            column.setFormatter(
                fmtr.getFormatFunction(args as DateFormatOptions));
            column.setParser(
                fmtr.getParserFunction(args as DateFormatOptions));
            break;
        case 'number':
            column.setFormatter(
                fmtr.getFormatFunction({ format: column.format } as NumberFormatOptions));
            column.setParser(
                fmtr.getParserFunction({ format: column.format } as NumberFormatOptions));
            break;
    }
}

/** @hidden */
export function addRemoveActiveClasses(cells: Element[], add: boolean, ...args: string[]): void {
    for (let i: number = 0, len: number = cells.length; i < len; i++) {
        if (add) {
            classList(cells[i], [...args], []);
            cells[i].setAttribute('aria-selected', 'true');
        } else {
            classList(cells[i], [], [...args]);
            cells[i].removeAttribute('aria-selected');
        }
    }
}

/** @hidden */
export function distinctStringValues(result: string[]): string[] {
    let temp: Object = {};
    let res: string[] = [];
    for (let i: number = 0; i < result.length; i++) {
        if (!(result[i] in temp)) {
            res.push(result[i].toString());
            temp[result[i]] = 1;
        }
    }
    return res;
}

/** @hidden */

export function getFilterMenuPostion(target: Element, dialogObj: Dialog, grid: IXLFilter): void {
    let elementVisible: string = dialogObj.element.style.display;
    dialogObj.element.style.display = 'block';
    let dlgWidth: number = dialogObj.width as number;
    let newpos: { top: number, left: number };
    if (!grid.enableRtl) {
        newpos = calculateRelativeBasedPosition((<HTMLElement>target), dialogObj.element);
        dialogObj.element.style.display = elementVisible;
        dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 5 + 'px';
        let leftPos: number = ((newpos.left - dlgWidth) + target.clientWidth);
        if (leftPos < 1) {
            dialogObj.element.style.left = (dlgWidth + leftPos) - 16 + 'px'; // right calculation
        } else {
            dialogObj.element.style.left = leftPos + -4 + 'px';
        }
    } else {
        newpos = calculatePosition((<HTMLElement>target), 'left', 'bottom');
        dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 35 + 'px';
        dialogObj.element.style.display = elementVisible;
        let leftPos: number = ((newpos.left - dlgWidth) + target.clientWidth);
        if (leftPos < 1) {
            dialogObj.element.style.left = (dlgWidth + leftPos) + - 16 + 'px';
        } else {
            dialogObj.element.style.left = leftPos - 16 + 'px';
        }
    }
}

/** @hidden */
export function getZIndexCalcualtion(args: { popup: Popup }, dialogObj: Dialog): void {
    args.popup.element.style.zIndex = (dialogObj.zIndex + 1).toString();
}

/** @hidden */
export function toogleCheckbox(elem: Element): void {
    let span: Element = elem.querySelector('.e-frame');
    let input: HTMLInputElement = span.previousSibling as HTMLInputElement;
    if (span.classList.contains('e-check')) {
        input.checked = false;
        classList(span, ['e-uncheck'], ['e-check']);
    } else {
        input.checked = true;
        classList(span, ['e-check'], ['e-uncheck']);
    }
}

/** @hidden */
export function setChecked(elem: HTMLInputElement, checked: boolean): void {
    elem.checked = checked;
}

/** @hidden */
export function createCboxWithWrap(uid: string, elem: Element, className?: string): Element {
    let div: Element = createElement('div', { className: className });
    div.appendChild(elem);
    div.setAttribute('uid', uid);
    return div;
}

/** @hidden */
export function removeAddCboxClasses(elem: Element, checked: boolean): void {
    removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
    if (checked) {
        elem.classList.add('e-check');
    } else {
        elem.classList.add('e-uncheck');
    }
}

/**
 * Refresh the Row model's foreign data.
 * @param row - Grid Row model object.
 * @param columns - Foreign columns array.
 * @param data - Updated Row data.
 * @hidden
 */
export function refreshForeignData(row: IRow<Column>, columns: Column[], data: Object): void {
    for (let i: number = 0; i < columns.length; i++) {
        setValue(columns[i].field, getForeignData(columns[i], data), row.foreignKeyData);
    }

    let cells: ICell<Column>[] = row.cells;
    for (let i: number = 0; i < cells.length; i++) {
        if (cells[i].isForeignKey) {
            setValue('foreignKeyData', getValue(cells[i].column.field, row.foreignKeyData), cells[i]);
        }
    }
}

/**
 * Get the foreign data for the corresponding cell value.
 * @param column - Foreign Key column
 * @param data - Row data.
 * @param lValue - cell value.
 * @param foreignData - foreign data source.
 * @hidden
 */
export function getForeignData(column: Column, data?: Object, lValue?: string | number, foreignKeyData?: Object[]): Object[] {
    let fField: string = column.foreignKeyField;
    let key: string | Date = <string | Date>(!isNullOrUndefined(lValue) ? lValue : valueAccessor(column.field, data, column));
    key = isNullOrUndefined(key) ? '' : key;
    let query: Query = new Query();
    let fdata: Object[] = foreignKeyData || ((column.dataSource instanceof DataManager) && column.dataSource.dataSource.json.length ?
        (<DataManager>column.dataSource).dataSource.json : column.columnData);
    if ((<Date>key).getDay) {
        query.where(getDatePredicate({ field: fField, operator: 'equal', value: key, matchCase: false }));
    } else {
        query.where(fField, '==', key, false);
    }
    return new DataManager(fdata).executeLocal(query);
}

/**
 * To use to get the column's object by the foreign key value.
 * @param foreignKeyValue - Defines ForeignKeyValue.
 * @param columns - Array of column object.
 * @hidden
 */
export function getColumnByForeignKeyValue(foreignKeyValue: string, columns: Column[]): Column {
    let column: Column;
    return columns.some((col: Column) => {
        column = col;
        return col.foreignKeyValue === foreignKeyValue;
    }) && column;
}

/**
 * @hidden
 * @param filterObject - Defines predicate model object
 */
export function getDatePredicate(filterObject: PredicateModel, type?: string): Predicate {
    let datePredicate: Predicate;
    let prevDate: Date;
    let nextDate: Date;
    let prevObj: PredicateModel = baseExtend({}, getActualProperties(filterObject)) as PredicateModel;
    let nextObj: PredicateModel = baseExtend({}, getActualProperties(filterObject)) as PredicateModel;
    if (isNullOrUndefined(filterObject.value)) {
        datePredicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        return datePredicate;
    }
    let value: Date = new Date(filterObject.value as string);
    if (filterObject.operator === 'equal' || filterObject.operator === 'notequal') {
        if (type === 'datetime') {
            prevDate = new Date(value.setSeconds(value.getSeconds() - 1));
            nextDate = new Date(value.setSeconds(value.getSeconds() + 2));
            filterObject.value = new Date(value.setSeconds(nextDate.getSeconds() - 1));
        } else {
            prevDate = new Date(value.setHours(0) - 1);
            nextDate = new Date(value.setHours(24));
        }
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            prevObj.operator = 'greaterthan';
            nextObj.operator = 'lessthan';
        } else if (filterObject.operator === 'notequal') {
            prevObj.operator = 'lessthanorequal';
            nextObj.operator = 'greaterthanorequal';
        }
        let predicateSt: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        let predicateEnd: Predicate = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        datePredicate = filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
    } else {
        if (typeof (prevObj.value) === 'string') {
            prevObj.value = new Date(prevObj.value);
        }
        let predicates: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        datePredicate = predicates;
    }
    if ((<{ setProperties: Function }>filterObject).setProperties) {
        (<{ setProperties: Function }>filterObject).setProperties({ ejpredicate: datePredicate }, true);
    } else {
        filterObject.ejpredicate = datePredicate;
    }
    return datePredicate;
}

/**
 * @hidden
 */

export function renderMovable(ele: Element, frzCols: number, gObj?: IGrid): Element {
    frzCols = frzCols && gObj && gObj.isRowDragable() ? frzCols + 1 : frzCols;
    let mEle: Element = ele.cloneNode(true) as Element;
    for (let i: number = 0; i < frzCols; i++) {
        mEle.removeChild(mEle.children[0]);
    }
    for (let i: number = frzCols, len: number = ele.childElementCount; i < len; i++) {
        ele.removeChild(ele.children[ele.childElementCount - 1]);
    }
    return mEle;
}

/**
 * @hidden
 */
export function isGroupAdaptive(grid: IGrid): boolean {

    return grid.enableVirtualization && grid.groupSettings.columns.length > 0 && grid.isVirtualAdaptive;
}

/**
 * @hidden
 */
export function getObject(field: string = '', object?: Object): any {
    if (field) {
        let value: Object = object;
        let splits: string[] = field.split('.');
        for (let i: number = 0; i < splits.length && !isNullOrUndefined(value); i++) {
            value = value[splits[i]];
        }
        return value as string;
    }
}
/**
 * @hidden
 */
export function getCustomDateFormat(format: string | Object, colType: string): string {
    let intl: Internationalization = new Internationalization();
    let formatvalue: string;
    let formatter: string = 'format';
    let type: string = 'type';
    if (colType === 'date') {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'date', format: format[formatter] }, false) :
            isBlazor() ? intl.getDatePattern({ type: 'dateTime', format: format }, false) :
            intl.getDatePattern({ type: 'dateTime', skeleton: format }, false);
    } else {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'dateTime', format: format[formatter] }, false) :
            isBlazor() ? intl.getDatePattern({ type: 'dateTime', format: format }, false) :
            intl.getDatePattern({ type: 'dateTime', skeleton: format }, false);
    }
    return formatvalue;
}
/**
 * @hidden
 */
export function getExpandedState(gObj: IGrid, hierarchyPrintMode: HierarchyGridPrintMode): { [index: number]: IExpandedRow } {
    let rows: Row<Column>[] = gObj.getRowsObject();
    let obj: { [index: number]: IExpandedRow } = {};
    for (const row of rows) {
        if (row.isExpand && !row.isDetailRow) {
            let index: number = gObj.allowPaging && gObj.printMode === 'AllPages' ? row.index +
                (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize : row.index;
            obj[index] = {};
            obj[index].isExpand = true;
            obj[index].gridModel = getPrintGridModel(row.childGrid, hierarchyPrintMode);
            (<{ query: Query }>obj[index].gridModel).query = gObj.childGrid.query;
        }
    }
    return obj;
}
/**
 * @hidden
 */
export function getPrintGridModel(gObj: IGrid, hierarchyPrintMode: HierarchyGridPrintMode = 'Expanded'): IGrid {
    let printGridModel: IGrid = {} as IGrid;
    if (!gObj) {
        return printGridModel;
    }
    for (let key of Print.printGridProp) {
        if (key === 'columns') {
            printGridModel[key] = getActualPropFromColl(gObj[key]);
        } else if (key === 'allowPaging') {
            printGridModel[key] = gObj.printMode === 'CurrentPage';
        } else {
            printGridModel[key] = getActualProperties(gObj[key]);
        }
    }
    if (gObj.childGrid && hierarchyPrintMode !== 'None') {
        (<IGrid>printGridModel).expandedRows = getExpandedState(gObj, hierarchyPrintMode);
    }
    return printGridModel;
}
/**
 * @hidden
 */
export function extendObjWithFn(copied: Object, first: Object, second?: Object, deep?: boolean): Object {
    let res: IKeyValue = copied as IKeyValue || {} as IKeyValue;
    let len: number = arguments.length;
    if (deep) {
        len = len - 1;
    }
    for (let i: number = 1; i < len; i++) {
        if (!arguments[i]) {
            continue;
        }
        let obj1: { [key: string]: Object } = arguments[i];
        let keys: string[] = Object.keys(Object.getPrototypeOf(obj1)).length ?
            Object.keys(obj1).concat(getPrototypesOfObj(obj1)) : Object.keys(obj1);
        for (let i: number = 0; i < keys.length; i++) {
            let source: Object = res[keys[i]];
            let cpy: Object = obj1[keys[i]];
            let cln: Object;
            if (deep && (isObject(cpy) || Array.isArray(cpy))) {
                if (isObject(cpy)) {
                    cln = source ? source : {};
                    res[keys[i]] = baseExtend({}, cln, cpy, deep);
                } else {
                    cln = source ? source : [];
                    res[keys[i]] = baseExtend([], cln, cpy, deep);
                }
            } else {
                res[keys[i]] = cpy;
            }
        }
    }
    return res;
}
/**
 * @hidden
 */
function getPrototypesOfObj(obj: Object): string[] {
    let keys: string[] = [];
    while (Object.getPrototypeOf(obj) && Object.keys(Object.getPrototypeOf(obj)).length) {
        keys = keys.concat(Object.keys(Object.getPrototypeOf(obj)));
        obj = Object.getPrototypeOf(obj);
    }
    return keys;
}
/**
 * @hidden
 */
export function measureColumnDepth(column: Column[]): number {
    let max: number = 0;
    for (let i: number = 0; i < column.length; i++) {
        let depth: number = checkDepth(column[i], 0);
        if (max < depth) {
            max = depth;
        }
    }
    return max + 1;
}
/**
 * @hidden
 */
export function checkDepth(col: Column, index: number): number {
    let max: number = index;
    let indices: number[] = [];
    if (col.columns) {
        index++;
        for (let i: number = 0; i < col.columns.length; i++) {
            indices[i] = checkDepth((<Column>col.columns[i]), index);
        }
        for (let j: number = 0; j < indices.length; j++) {
            if (max < indices[j]) {
                max = indices[j];
            }
        }
        index = max;
    }
    return index;
}
/**
 * @hidden
 */
export function refreshFilteredColsUid(gObj: IGrid, filteredCols: PredicateModel[]): void {
    for (let i: number = 0; i < filteredCols.length; i++) {
        filteredCols[i].uid = filteredCols[i].isForeignKey ?
            getColumnByForeignKeyValue(filteredCols[i].field, gObj.getForeignKeyColumns()).uid
            : gObj.getColumnByField(filteredCols[i].field).uid;
    }
}

/** @hidden */
export namespace Global {
    export let timer: Object = null;
}
/**
 * @hidden
 */
export function getTransformValues(element: Element): { width: number, height: number } {
    let style: Object = document.defaultView.getComputedStyle(element, null);
    let transformV: string = (<{ getPropertyValue?: Function }>style).getPropertyValue('transform');
    let replacedTv: string = transformV.replace(/,/g, '');
    let translateX: number = parseFloat((replacedTv).split(' ')[4]);
    let translateY: number = parseFloat((replacedTv).split(' ')[5]);
    return { width: translateX, height: translateY };
}

/** @hidden */
export function applyBiggerTheme(rootElement: Element, element: Element): void {
    if (rootElement.classList.contains('e-bigger')) {
        element.classList.add('e-bigger');
    }
}

/** @hidden */
export function alignFrozenEditForm(mTD: HTMLElement, fTD: HTMLElement): void {
    if (mTD && fTD) {
        let mHeight: number = closest(mTD, '.e-row').getBoundingClientRect().height;
        let fHeight: number = closest(fTD, '.e-row').getBoundingClientRect().height;
        if (mHeight > fHeight) {
            fTD.style.height = mHeight + 'px';
        } else {
            mTD.style.height = fHeight + 'px';
        }
    }
}

/** @hidden */
export function ensureLastRow(row: Element, gridObj: IGrid): boolean {
    let cntOffset: number = (gridObj.getContent().firstElementChild as HTMLElement).offsetHeight;
    return row && row.getBoundingClientRect().top > cntOffset;
}

/** @hidden */
export function ensureFirstRow(row: Element, rowTop: number): boolean {
    return row && row.getBoundingClientRect().top < rowTop;
}

/** @hidden */
export function isRowEnteredInGrid(index: number, gObj: IGrid): boolean {
    let rowHeight: number = gObj.getRowHeight();
    let startIndex: number = gObj.getContent().firstElementChild.scrollTop / rowHeight;
    let endIndex: number = startIndex + ((gObj.getContent().firstElementChild as HTMLElement).offsetHeight / rowHeight);
    return index < endIndex && index > startIndex;
}

/** @hidden */
export function getEditedDataIndex(gObj: IGrid, data: Object): number {
    let keyField: string = gObj.getPrimaryKeyFieldNames()[0];
    let dataIndex: number;
    gObj.getCurrentViewRecords().filter((e: Object, index: number) => {
        if (e[keyField] === data[keyField]) {
            dataIndex = index;
        }
    });
    return dataIndex;
}

/** @hidden */
export function eventPromise(args: Object, query: Query): FilterStateObj {
    let state: DataStateChangeEventArgs;
    state = getStateEventArgument(query);
    let def: Deferred = new Deferred();
    state.dataSource = def.resolve;
    state.action = args;
    return {state: state, deffered: def};
}

/** @hidden */
export function getStateEventArgument(query: Query): Object {
    let adaptr: UrlAdaptor = new UrlAdaptor();
    let dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
    let state: { data?: string } = adaptr.processQuery(dm, query);
    let data: Object = JSON.parse(state.data);
    return data;
}

/** @hidden */
export function ispercentageWidth(gObj: IGrid): boolean {
    let columns: Column[] = gObj.getVisibleColumns();
    let percentageCol: number = 0;
    let undefinedWidthCol: number = 0;
    for (let i: number = 0; i < columns.length; i++) {
        if (isUndefined(columns[i].width)) {
            undefinedWidthCol++;
        } else if (columns[i].width.toString().indexOf('%') !== -1) {
            percentageCol++;
        }
    }
    return (gObj.width === 'auto' || typeof (gObj.width) === 'string' && gObj.width.indexOf('%') !== -1) && Browser.info.name !== 'chrome'
        && !gObj.groupSettings.showGroupedColumn && gObj.groupSettings.columns.length
        && percentageCol && !undefinedWidthCol;
}

/** @hidden */
export function resetRowIndex(gObj: IGrid, rows: Row<Column>[], rowElms: HTMLTableRowElement[], index?: number): void {
    let startIndex: number = index ? index : 0;
    for (let i: number = 0; i < rows.length; i++) {
        if (rows[i].isDataRow) {
            rows[i].index = startIndex;
            rows[i].isAltRow = gObj.enableAltRow ? startIndex % 2 !== 0 : false;
            rowElms[i].setAttribute('aria-rowindex', startIndex.toString());
            rows[i].isAltRow ? rowElms[i].classList.add('e-altrow') : rowElms[i].classList.remove('e-altrow');
            for (let j: number = 0; j < rowElms[i].cells.length; j++) {
                rowElms[i].cells[j].setAttribute('index', startIndex.toString());
            }
            startIndex++;
        }
    }
    if (!rows.length) {
        gObj.renderModule.emptyRow(true);
    }
}

/** @hidden */
export function compareChanges(gObj: IGrid, changes: Object, type: string, keyField: string): void {
    let newArray: Object[] = (<{ dataToBeUpdated?: Object }>gObj).dataToBeUpdated[type].concat(changes[type]).reduce(
        (r: Object, o: Object) => {
            r[o[keyField]] = r[o[keyField]] === undefined ? o : Object.assign(r[o[keyField]], o);
            return r;
        },
        {});
    (<{ dataToBeUpdated?: Object }>gObj).dataToBeUpdated[type] = Object.keys(newArray).map((k: string) => newArray[k]);
}

/** @hidden */
export function setRowElements(gObj: IGrid): void {
    if (gObj.getFrozenColumns()) {
        (<{ rowElements?: Element[] }>(gObj).contentModule).rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-movableheader .e-row, .e-movablecontent .e-row'));
        (<{ freezeRowElements?: Element[] }>(gObj).contentModule).freezeRowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-frozenheader .e-row, .e-frozencontent .e-row'));
    } else {
        (<{ rowElements?: Element[] }>(gObj).contentModule).rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-row:not(.e-addedrow)'));
    }
}
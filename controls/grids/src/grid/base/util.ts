import { ChildProperty, compile as baseTemplateComplier, setValue, Internationalization } from '@syncfusion/ej2-base';
import { extend as baseExtend, isNullOrUndefined, getValue, classList, NumberFormatOptions } from '@syncfusion/ej2-base';
import { setStyleAttribute, addClass, attributes, remove, createElement, DateFormatOptions, removeClass } from '@syncfusion/ej2-base';
import { isObject, IKeyValue} from '@syncfusion/ej2-base';
import { IPosition, IGrid, IValueFormatter, IRow, ICell } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { DataUtil, Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { ColumnModel, AggregateColumnModel } from '../models/models';
import { AggregateType } from './enum';
import { Dialog, calculateRelativeBasedPosition, Popup, calculatePosition } from '@syncfusion/ej2-popups';
import { PredicateModel } from './grid-model';


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
    field = isNullOrUndefined(field) ? '' : field;
    return DataUtil.getObject(field, data);
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

    Object.keys(moved).forEach((value: string, index: number) => {
        if (exclude.indexOf(value) !== -1) {
            delete moved[value];
        }
    });

    return moved;
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
                column = new Column(columns[c] as Column);
                (columns[c] as Column).columns = prepareColumns((columns[c] as Column).columns);
            }
        } else {
            column = <Column>columns[c];
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
    return field.replace(/\./g, '_');
}
/** @hidden */
export function setComplexFieldID(field: string = ''): string {
    return field.replace(/_/g, '.');
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
    } else if (type === 'add' && col.isIdentity && col.isPrimaryKey) {
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
export function setFormatter(serviceLocator?: ServiceLocator, column?: Column): void {
    let fmtr: IValueFormatter = serviceLocator.getService<IValueFormatter>('valueFormatter');
    switch (column.type) {
        case 'date':
            column.setFormatter(
                fmtr.getFormatFunction({ type: 'date', skeleton: column.format } as DateFormatOptions));
            column.setParser(
                fmtr.getParserFunction({ type: 'date', skeleton: column.format } as DateFormatOptions));
            break;
        case 'datetime':
            column.setFormatter(
                fmtr.getFormatFunction({ type: 'dateTime', skeleton: column.format } as DateFormatOptions));
            column.setParser(
                fmtr.getParserFunction({ type: 'dateTime', skeleton: column.format } as DateFormatOptions));
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

export function getFilterMenuPostion(target: Element, dialogObj: Dialog, grid: IGrid): void {
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
    span.classList.contains('e-check') ? classList(span, ['e-uncheck'], ['e-check']) :
        classList(span, ['e-check'], ['e-uncheck']);
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
    columns.forEach((col: Column) => {
        setValue(col.field, getForeignData(col, data), row.foreignKeyData);
    });

    row.cells.forEach((cell: ICell<Column>) => {
        if (cell.isForeignKey) {
            setValue('foreignKeyData', getValue(cell.column.field, row.foreignKeyData), cell);
        }
    });
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
    let key: string | Date = <string | Date>(lValue || valueAccessor(column.field, data, column));
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

export function renderMovable(ele: Element, frzCols: number): Element {
    let mEle: Element = ele.cloneNode(true) as Element;
    for (let i: number = 0; i < frzCols; i++) {
        mEle.removeChild(mEle.children[0]);
    }
    for (let i: number = frzCols, len: number = ele.childElementCount; i < len; i++) {
        ele.removeChild(ele.children[ele.childElementCount - 1]);
    }
    return mEle;
}


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

export function getCustomDateFormat(format: string | Object, colType: string): string {
    let intl: Internationalization = new Internationalization();
    let formatvalue: string;
    let formatter: string = 'format';
    let type: string = 'type';
    if (colType === 'date') {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'date', format: format[formatter] }, false) :
            intl.getDatePattern({ type: 'date', skeleton: format }, false);
    } else {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'dateTime', format: format[formatter] }, false) :
            intl.getDatePattern({ type: 'dateTime', skeleton: format }, false);
    }
    return formatvalue;
}

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
        Object.keys(obj1).concat(Object.keys(Object.getPrototypeOf(obj1))) : Object.keys(obj1);
        keys.forEach((key: string) => {
            let source: Object = res[key];
            let cpy: Object = obj1[key];
            let cln: Object;
            if (deep && (isObject(cpy) || Array.isArray(cpy))) {
                if (isObject(cpy)) {
                    cln = source ? source : {};
                    res[key] = baseExtend({}, cln, cpy, deep);
                } else {
                    cln = source ? source : [];
                    res[key] = baseExtend([], cln, cpy, deep);
                }
            } else {
                res[key] = cpy;
            }
        });
    }
    return res;
}
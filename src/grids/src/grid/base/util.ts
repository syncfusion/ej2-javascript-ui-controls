import { ChildProperty, compile as baseTemplateComplier, setValue, Internationalization, isUndefined, closest } from '@syncfusion/ej2-base';
import { extend as baseExtend, isNullOrUndefined, getValue, classList, NumberFormatOptions } from '@syncfusion/ej2-base';
import { setStyleAttribute, addClass, attributes, remove, createElement, DateFormatOptions, removeClass } from '@syncfusion/ej2-base';
import { isObject, IKeyValue, select, selectAll } from '@syncfusion/ej2-base';
import {
    IPosition, IGrid, IValueFormatter, IRow, ICell, IExpandedRow, PdfExportProperties,
    ExcelExportProperties, DataStateChangeEventArgs
} from './interface';
import { ServiceLocator } from '../services/service-locator';
import { DataUtil, Query, DataManager, Predicate, UrlAdaptor, Deferred } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ColumnModel, AggregateColumnModel } from '../models/models';
import { AggregateType, HierarchyGridPrintMode, freezeTable, freezeMode } from './enum';
import { Dialog, calculateRelativeBasedPosition, Popup } from '@syncfusion/ej2-popups';
import { PredicateModel } from './grid-model';
import { Print } from '../actions/print';
import { FilterStateObj, IXLFilter } from '../common/filter-interface';
import { Cell } from '../models/cell';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { GroupedData } from '../services/group-model-generator';
import * as literals from '../base/string-literals';

//https://typescript.codeplex.com/discussions/401501
/**
 * Function to check whether target object implement specific interface
 *
 * @param  {Object} target - specifies the target
 * @param  {string} checkFor - specifies the checkfors
 * @returns {boolean} returns the boolean
 * @hidden
 */
export function doesImplementInterface(target: Object, checkFor: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (<any>target).prototype && checkFor in (<any>target).prototype;
}

/**
 * Function to get value from provided data
 *
 * @param  {string} field - specifies the field
 * @param  {Object} data - specifies the data
 * @param  {ColumnModel} column - specifies the column
 * @returns {Object} returns the object
 * @hidden
 */
// eslint-disable-next-line
export function valueAccessor(field: string, data: Object, column: ColumnModel): Object {
    return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, data);
}

/**
 * Defines the method used to apply custom header cell values from external function and display this on each header cell rendered.
 *
 * @param  {string} field - specifies the field
 * @param  {ColumnModel} column - specifies the column
 * @returns {object} headerValueAccessor
 * @hidden
 */
export function headerValueAccessor(field: string, column: ColumnModel): Object {
    return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, column);
}

/**
 * The function used to update Dom using requestAnimationFrame.
 *
 * @param {Function} updateFunction - Function that contains the actual action
 * @param {object} callBack - defines the callback
 * @returns {void}
 * @hidden
 */
// eslint-disable-next-line
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
 * @param {PdfExportProperties | ExcelExportProperties} exportProperties - Defines the export properties
 * @returns {boolean} Returns isExportColumns
 */
export function isExportColumns(exportProperties: PdfExportProperties | ExcelExportProperties): boolean {

    return !isNullOrUndefined(exportProperties) &&
        !isNullOrUndefined(exportProperties.columns) && exportProperties.columns.length > 0;
}

/**
 * @param {PdfExportProperties | ExcelExportProperties} exportProperties - Defines the export properties
 * @param {IGrid} gObj - Defines the grid object
 * @returns {void}
 * @hidden
 */
export function updateColumnTypeForExportColumns(exportProperties: PdfExportProperties | ExcelExportProperties, gObj: IGrid): void {
    const exportColumns: Column[] = exportProperties.columns;
    const gridColumns: Column[] = gObj.columns as Column[];
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
 * @param {IGrid} grid - Defines the grid
 * @returns {void}
 */
export function updatecloneRow(grid: IGrid): void {
    const nRows: Row<Column>[] = []; const actualRows: Row<Column>[] = grid.vRows;
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


let count: number = 0;
/**
 * @hidden
 * @param {Row<Column>} val - Defines the value
 * @param {IGrid} grid - Defines the grid
 * @returns {number} Returns the collapsed row count
 */
export function getCollapsedRowsCount(val: Row<Column>, grid: IGrid): number {
    count = 0;
    const gSummary: string = 'gSummary'; const total: string = 'count';
    const gLen: number = grid.groupSettings.columns.length;
    const records: string = 'records';
    const items: string = 'items';
    const value: number = val[gSummary];
    let dataRowCnt: number = 0;
    const agrCnt: string = 'aggregatesCount';
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
            const gLevel: Object[] = val.data[items][i];
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
 * @param {Object[]} row - Defines the row
 * @returns {void}
 * @hidden
 */
export function recursive(row: Object[]): void {
    const items: string = 'items';
    const rCount: string = 'count';
    for (let j: number = 0, length: number = row[items].length; j < length; j++) {
        const nLevel: Object[] = row[items][j];
        count += nLevel[rCount];
        if (nLevel[items].childLevels !== 0) {
            recursive(nLevel);
        }
    }
}


/**
 * @param {Object[]} collection - Defines the array
 * @param {Object} predicate - Defines the predicate
 * @returns {Object} Returns the object
 * @hidden
 */
export function iterateArrayOrObject<T, U>(collection: U[], predicate: (item: Object, index: number) => T): T[] {
    const result: T[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        const pred: T = predicate(collection[i], i);
        if (!isNullOrUndefined(pred)) {
            result.push(<T>pred);
        }
    }
    return result;
}

/**
 * @param {Object[]} array - Defines the array
 * @returns {Object} Returns the object
 * @hidden
 */
export function iterateExtend(array: Object[]): Object[] {
    const obj: Object[] = [];
    for (let i: number = 0; i < array.length; i++) {
        obj.push(baseExtend({}, getActualProperties(array[i]), {}, true));
    }
    return obj;
}

/**
 * @param {string} template - Defines the template
 * @returns {Function} Returns the function
 * @hidden
 */
export function templateCompiler(template: string): Function {
    if (template) {
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

/**
 * @param {Element} node - Defines the column
 * @param {Object} customAttributes - Defines the index
 * @returns {void}
 * @hidden
 */
export function setStyleAndAttributes(node: Element, customAttributes: { [x: string]: Object }): void {
    const copyAttr: { [x: string]: Object } = {}; const literals: string[] = ['style', 'class'];

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

/**
 * @param {Object} copied - Defines the column
 * @param {Object} first - Defines the inndex
 * @param {Object} second - Defines the second object
 * @param {string[]} exclude - Defines the exclude
 * @returns {Object} Returns the object
 * @hidden
 */
export function extend(copied: Object, first: Object, second?: Object, exclude?: string[]): Object {
    const moved: Object = baseExtend(copied, first, second);
    const values: string[] = Object.keys(moved);
    for (let i: number = 0; i < values.length; i++) {
        if (exclude && exclude.indexOf(values[i]) !== -1) {
            delete moved[values[i]];
        }
    }

    return moved;
}

/**
 * @param {Column[]} columnModel - Defines the column
 * @param {number} ind - Defines the inndex
 * @returns {number} - Returns the columnindex
 * @hidden
 */
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

/**
 * @param {Column[] | string[] | ColumnModel[]} columns - Defines the column
 * @param {boolean} autoWidth - Defines the autowidth
 * @param {IGrid} gObj - Defines the class name
 * @returns {Column} - Returns the columns
 * @hidden
 */
export function prepareColumns(columns: Column[] | string[] | ColumnModel[], autoWidth?: boolean, gObj?: IGrid): Column[] {
    for (let c: number = 0, len: number = columns.length; c < len; c++) {

        let column: Column;

        if (typeof columns[c] === 'string') {
            column = new Column({ field: <string>columns[c] }, gObj);
        } else if (!(columns[c] instanceof Column) || (columns[c] as Column).columns) {
            if (!(columns[c] as Column).columns) {
                column = new Column(columns[c] as Column, gObj);
            } else {
                (columns[c] as Column).columns = prepareColumns((columns[c] as Column).columns, null, gObj);
                column = new Column(columns[c] as Column, gObj);
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

/**
 * @param {HTMLElement} popUp - Defines the popup element
 * @param {MouseEvent | TouchEvent} e - Defines the moouse event
 * @param {string} className - Defines the class name
 * @returns {void}
 * @hidden
 */
export function setCssInGridPopUp(popUp: HTMLElement, e: MouseEvent | TouchEvent, className: string): void {
    const popUpSpan: HTMLElement = popUp.querySelector('span');
    const position: { top: number, left: number, right: number } = popUp.parentElement.getBoundingClientRect();
    const targetPosition: { top: number, left: number, right: number } = (e.target as HTMLElement).getBoundingClientRect();
    popUpSpan.className = className;
    popUp.style.display = '';
    const isBottomTail: boolean = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
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

/**
 * @param {HTMLElement} popup - Defines the popup element
 * @param {MouseEvent | TouchEvent} e  - Defines the mouse event
 * @param {Object} targetPosition - Defines the target position
 * @param {number} targetPosition.top - Defines the top position
 * @param {number} targetPosition.left  - Defines the left position
 * @param {number} targetPosition.right  - Defines the right position
 * @param {number} left - Defines the left position
 * @returns {number} Returns the popup left position
 * @hidden
 */
function getPopupLeftPosition(
    popup: HTMLElement, e: MouseEvent | TouchEvent, targetPosition: { top: number, left: number, right: number }, left: number): number {
    const width: number = popup.offsetWidth / 2;
    const x: number = getPosition(e).x;
    if (x - targetPosition.left < width) {
        return targetPosition.left - left;
    } else if (targetPosition.right - x < width) {
        return targetPosition.right - left - width * 2;
    } else {
        return x - left - width;
    }
}

/**
 * @param {Object} obj - Defines the object
 * @returns {Object} Returns the Properties
 * @hidden
 */
export function getActualProperties<T>(obj: T): T {
    if (obj instanceof ChildProperty) {
        return <T>getValue('properties', obj);
    } else {
        return obj;
    }
}

/**
 * @param {Element} elem - Defines the element
 * @param {string} selector - Defines the string selector
 * @param {boolean} isID - Defines the isID
 * @returns {Element} Returns the element
 * @hidden
 */
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

/**
 * @param {Element} element - Defines the element
 * @param {Element} elements - Defines the element
 * @returns {number} Returns the element index
 * @hidden
 */
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

/**
 * @param {Object} value - Defines the value
 * @param {Object} collection - defines the collection
 * @returns {number} Returns the array
 * @hidden
 */
export function inArray(value: Object, collection: Object[]): number {
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}

/**
 * @param {Object} collection - Defines the collection
 * @returns {Object} Returns the object
 * @hidden
 */
export function getActualPropFromColl(collection: Object[]): Object[] {
    const coll: Object[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        // eslint-disable-next-line no-prototype-builtins
        if (collection[i].hasOwnProperty('properties')) {
            coll.push((collection[i] as { properties: Object }).properties);
        } else {
            coll.push(collection[i]);
        }
    }
    return coll;
}

/**
 * @param {Element} target - Defines the target element
 * @param {string} selector - Defines the selector
 * @returns {void}
 * @hidden
 */
export function removeElement(target: Element, selector: string): void {
    const elements: HTMLElement[] = [].slice.call(target.querySelectorAll(selector));
    for (let i: number = 0; i < elements.length; i++) {
        remove(elements[i]);
    }
}

/**
 * @param {MouseEvent | TouchEvent} e Defines the mouse event
 * @returns {IPosition} Returns the position
 * @hidden
 */
export function getPosition(e: MouseEvent | TouchEvent): IPosition {
    const position: IPosition = {} as IPosition;
    position.x = (isNullOrUndefined((e as MouseEvent).clientX) ? (e as TouchEvent).changedTouches[0].clientX :
        (e as MouseEvent).clientX);
    position.y = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY);
    return position;
}


let uid: number = 0;
/**
 * @param {string} prefix - Defines the prefix string
 * @returns {string} Returns the uid
 * @hidden
 */
export function getUid(prefix: string): string {
    return prefix + uid++;
}

/**
 * @param {Element | DocumentFragment} elem - Defines the element
 * @param {Element[] | NodeList} children - Defines the Element
 * @returns {Element} Returns the element
 * @hidden
 */
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

/**
 * @param {Element} elem - Defines the element
 * @param {string} selector - Defines the selector
 * @param {boolean} isID - Defines isID
 * @returns {Element} Return the element
 * @hidden
 */
export function parents(elem: Element, selector: string, isID?: boolean): Element[] {
    let parent: Element = elem;
    const parents: Element[] = [];
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
    }
    return parents;
}

/**
 * @param {AggregateType | string} type - Defines the type
 * @param {Object} data - Defines the data
 * @param {AggregateColumnModel} column - Defines the column
 * @param {Object} context - Defines the context
 * @returns {Object} Returns the calculated aggragate
 * @hidden
 */
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

/** @hidden
 * @returns {number} - Returns the scrollbarwidth
 */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    const divNode: HTMLDivElement = document.createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

/** @hidden */
let rowHeight: number;
/**
 * @param {HTMLElement} element - Defines the element
 * @returns {number} Returns the roww height
 * @hidden
 */
export function getRowHeight(element?: HTMLElement): number {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    const table: HTMLTableElement = <HTMLTableElement>createElement('table', { className: literals.table, styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    const rect: ClientRect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}

/** @hidden */
let actualRowHeight: number;
/**
 * @param {HTMLElement} element - Defines the HTMl element
 * @returns {number} Returns the row height
 * @hidden
 */
export function getActualRowHeight(element?: HTMLElement): number {
    if (actualRowHeight !== undefined) {
        return rowHeight;
    }
    const table: HTMLTableElement = <HTMLTableElement>createElement('table', { className: literals.table, styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    const rect: ClientRect = table.querySelector('tr').getBoundingClientRect();
    element.removeChild(table);
    return rect.height;
}

/**
 * @param {string} field - Defines the field
 * @returns {boolean} - Returns is complex field
 * @hidden
 */
export function isComplexField(field: string): boolean {
    return field.split('.').length > 1;
}

/**
 * @param {string} field - Defines the field
 * @returns {string} - Returns the get complex field ID
 * @hidden
 */
export function getComplexFieldID(field: string = ''): string {
    return field.replace(/\./g, '___');
}

/**
 * @param {string} field - Defines the field
 * @returns {string} - Returns the set complex field ID
 * @hidden
 */
export function setComplexFieldID(field: string = ''): string {
    return field.replace(/___/g, '.');
}

/**
 * @param {Column} col - Defines the column
 * @param {string} type - Defines the type
 * @param {Element} elem - Defines th element
 * @returns {boolean} Returns is Editable
 * @hidden
 */
export function isEditable(col: Column, type: string, elem: Element): boolean {
    const row: Element = parentsUntil(elem, literals.row);
    const isOldRow: boolean = !row ? true : row && !row.classList.contains('e-insertedrow');
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

/**
 * @param {IGrid} inst - Defines the IGrid
 * @returns {boolean} Returns is action prevent in boolean
 * @hidden
 */
export function isActionPrevent(inst: IGrid): boolean {
    const dlg: HTMLElement = select('#' + inst.element.id + 'EditConfirm', inst.element) as HTMLElement;
    return inst.editSettings.mode === 'Batch' &&
        (selectAll('.e-updatedtd', inst.element).length) && inst.editSettings.showConfirmDialog &&
        (dlg ? dlg.classList.contains('e-popup-close') : true);
}

/**
 * @param {any} elem - Defines the element
 * @param {boolean} action - Defines the boolean for action
 * @returns {void}
 * @hidden
 */
// eslint-disable-next-line
export function wrap(elem: any, action: boolean): void {
    const clName: string = 'e-wrap';
    elem = elem instanceof Array ? elem : [elem];
    for (let i: number = 0; i < elem.length; i++) {
        if (action) {
            elem[i].classList.add(clName);
        } else {
            elem[i].classList.remove(clName);
        }
    }
}

/**
 * @param {ServiceLocator} serviceLocator - Defines the service locator
 * @param {Column} column  - Defines the column
 * @returns {void}
 * @hidden
 */
export function setFormatter(serviceLocator?: ServiceLocator, column?: Column): void {
    const fmtr: IValueFormatter = serviceLocator.getService<IValueFormatter>('valueFormatter');
    const format: string = 'format';
    let args: object;
    if (column.type === 'date' || column.type === 'datetime') {
        args = { type: column.type, skeleton: column.format };
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

/**
 * @param {Element} cells - Defines the cell element
 * @param {boolean} add - Defines the add
 * @param {string} args - Defines the args
 * @returns {void}
 * @hidden
 */
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

/**
 * @param {string} result - Defines th string
 * @returns {string} Returns the distinct staing values
 * @hidden
 */
export function distinctStringValues(result: string[]): string[] {
    const temp: Object = {};
    const res: string[] = [];
    for (let i: number = 0; i < result.length; i++) {
        if (!(result[i] in temp)) {
            res.push(result[i].toString());
            temp[result[i]] = 1;
        }
    }
    return res;
}

/**
 * @param {Element} target - Defines the target
 * @param {Dialog} dialogObj - Defines the dialog
 * @returns {void}
 * @hidden
 */
export function getFilterMenuPostion(target: Element, dialogObj: Dialog): void {
    const elementVisible: string = dialogObj.element.style.display;
    dialogObj.element.style.display = 'block';
    const dlgWidth: number = dialogObj.width as number;
    const newpos: { top: number, left: number } = calculateRelativeBasedPosition((<HTMLElement>target), dialogObj.element);
    dialogObj.element.style.display = elementVisible;
    dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 5 + 'px';
    const leftPos: number = ((newpos.left - dlgWidth) + target.clientWidth);
    if (leftPos < 1) {
        dialogObj.element.style.left = (dlgWidth + leftPos) - 16 + 'px'; // right calculation
    } else {
        dialogObj.element.style.left = leftPos + -4 + 'px';
    }
}

/**
 * @param {Object} args - Defines the args
 * @param {Popup} args.popup - Defines the args for popup
 * @param {Dialog} dialogObj - Defines the dialog obj
 * @returns {void}
 * @hidden
 */
export function getZIndexCalcualtion(args: { popup: Popup }, dialogObj: Dialog): void {
    args.popup.element.style.zIndex = (dialogObj.zIndex + 1).toString();
}

/**
 * @param {Element} elem - Defines the element
 * @returns {void}
 * @hidden
 */
export function toogleCheckbox(elem: Element): void {
    const span: Element = elem.querySelector('.e-frame');
    const input: HTMLInputElement = span.previousSibling as HTMLInputElement;
    if (span.classList.contains('e-check')) {
        input.checked = false;
        classList(span, ['e-uncheck'], ['e-check']);
    } else {
        input.checked = true;
        classList(span, ['e-check'], ['e-uncheck']);
    }
}

/**
 * @param {HTMLInputElement} elem - Defines the element
 * @param {boolean} checked - Defines is checked
 * @returns {void}
 * @hidden
 */
export function setChecked(elem: HTMLInputElement, checked: boolean): void {
    elem.checked = checked;
}

/**
 * @param {string} uid - Defines the string
 * @param {Element} elem - Defines the Element
 * @param {string} className - Defines the classname
 * @returns {Element} Returns the box wrap
 * @hidden
 */
export function createCboxWithWrap(uid: string, elem: Element, className?: string): Element {
    const div: Element = createElement('div', { className: className });
    div.appendChild(elem);
    div.setAttribute('uid', uid);
    return div;
}

/**
 * @param {Element} elem - Defines the element
 * @param {boolean} checked - Defines is checked
 * @returns {void}
 * @hidden
 */
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
 *
 * @param {IRow<Column>} row - Grid Row model object.
 * @param {Column[]} columns - Foreign columns array.
 * @param {Object} data - Updated Row data.
 * @returns {void}
 * @hidden
 */
export function refreshForeignData(row: IRow<Column>, columns: Column[], data: Object): void {
    for (let i: number = 0; i < columns.length; i++) {
        setValue(columns[i].field, getForeignData(columns[i], data), row.foreignKeyData);
    }

    const cells: ICell<Column>[] = row.cells;
    for (let i: number = 0; i < cells.length; i++) {
        if (cells[i].isForeignKey) {
            setValue('foreignKeyData', getValue(cells[i].column.field, row.foreignKeyData), cells[i]);
        }
    }
}

/**
 * Get the foreign data for the corresponding cell value.
 *
 * @param {Column} column - Foreign Key column
 * @param {Object} data - Row data.
 * @param {string | number} lValue - cell value.
 * @param {Object} foreignKeyData - foreign data source.
 * @returns {Object} Returns the object
 * @hidden
 */
export function getForeignData(column: Column, data?: Object, lValue?: string | number, foreignKeyData?: Object[]): Object[] {
    const fField: string = column.foreignKeyField;
    let key: string | Date = <string | Date>(!isNullOrUndefined(lValue) ? lValue : valueAccessor(column.field, data, column));
    key = isNullOrUndefined(key) ? '' : key;
    const query: Query = new Query();
    const fdata: Object[] = foreignKeyData || ((column.dataSource instanceof DataManager) && column.dataSource.dataSource.json.length ?
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
 *
 * @param {string} foreignKeyValue - Defines ForeignKeyValue.
 * @param {Column[]} columns - Array of column object.
 * @returns {Column} Returns the element
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
 * @param {PredicateModel} filterObject - Defines the filterObject
 * @param {string} type - Defines the type
 * @returns {Predicate} Returns the Predicate
 * @hidden
 */
export function getDatePredicate(filterObject: PredicateModel, type?: string): Predicate {
    let datePredicate: Predicate;
    let prevDate: Date;
    let nextDate: Date;
    const prevObj: PredicateModel = baseExtend({}, getActualProperties(filterObject)) as PredicateModel;
    const nextObj: PredicateModel = baseExtend({}, getActualProperties(filterObject)) as PredicateModel;
    if (isNullOrUndefined(filterObject.value)) {
        datePredicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        return datePredicate;
    }
    const value: Date = new Date(filterObject.value as string);
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
        const predicateSt: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        const predicateEnd: Predicate = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        datePredicate = filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
    } else {
        if (type === 'date' && (filterObject.operator === 'lessthanorequal' || filterObject.operator === 'greaterthan')) {
            prevObj.value = new Date(value.setHours(24) - 1);
        }
        if (typeof (prevObj.value) === 'string') {
            prevObj.value = new Date(prevObj.value);
        }
        const predicates: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
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
 * @param {Element} ele - Defines the element
 * @param {number} frzCols - Defines the frozen columns
 * @param {IGrid} gObj - Defines the IGrid
 * @returns {Element} Returns the element
 * @hidden
 */
export function renderMovable(ele: Element, frzCols: number, gObj?: IGrid): Element {
    frzCols = frzCols && gObj && gObj.isRowDragable() ? frzCols + 1 : frzCols;
    const mEle: Element = ele.cloneNode(true) as Element;
    for (let i: number = 0; i < frzCols; i++) {
        mEle.removeChild(mEle.children[0]);
    }
    for (let i: number = frzCols, len: number = ele.childElementCount; i < len; i++) {
        ele.removeChild(ele.children[ele.childElementCount - 1]);
    }
    return mEle;
}

/**
 * @param {IGrid} grid - Defines the IGrid
 * @returns {boolean} Returns true if group adaptive is true
 * @hidden
 */
export function isGroupAdaptive(grid: IGrid): boolean {

    return grid.enableVirtualization && grid.groupSettings.columns.length > 0 && grid.isVirtualAdaptive;
}

/**
 * @param {string} field - Defines the Field
 * @param {Object} object - Defines the objec
 * @returns {any} Returns the object
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObject(field: string = '', object?: Object): any {
    if (field) {
        let value: Object = object;
        const splits: string[] = field.split('.');
        for (let i: number = 0; i < splits.length && !isNullOrUndefined(value); i++) {
            value = value[splits[i]];
        }
        return value as string;
    }
}

/**
 * @param {string | Object} format - defines the format
 * @param {string} colType - Defines the coltype
 * @returns {string} Returns the custom Data format
 * @hidden
 */
export function getCustomDateFormat(format: string | Object, colType: string): string {
    const intl: Internationalization = new Internationalization();
    let formatvalue: string;
    const formatter: string = 'format';
    const type: string = 'type';
    if (colType === 'date') {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'date', format: format[formatter] }, false) :
            intl.getDatePattern({ type: 'dateTime', skeleton: format }, false);
    } else {
        formatvalue = typeof (format) === 'object' ?
            intl.getDatePattern({ type: format[type] ? format[type] : 'dateTime', format: format[formatter] }, false) :
            intl.getDatePattern({ type: 'dateTime', skeleton: format }, false);
    }
    return formatvalue;
}

/**
 * @param {IGrid} gObj - Defines the IGrid
 * @param {HierarchyGridPrintMode} hierarchyPrintMode - Defines the hierarchyPrintMode
 * @returns {Object} Returns the object
 * @hidden
 */
export function getExpandedState(gObj: IGrid, hierarchyPrintMode: HierarchyGridPrintMode): { [index: number]: IExpandedRow } {
    const rows: Row<Column>[] = gObj.getRowsObject();
    const obj: { [index: number]: IExpandedRow } = {};
    for (const row of rows) {
        if (row.isExpand && !row.isDetailRow) {
            const index: number = gObj.allowPaging && gObj.printMode === 'AllPages' ? row.index +
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
 * @param {IGrid} gObj - Defines the grid objct
 * @param {HierarchyGridPrintMode} hierarchyPrintMode - Defines the hierarchyPrintMode
 * @returns {IGrid} Returns the IGrid
 * @hidden
 */
export function getPrintGridModel(gObj: IGrid, hierarchyPrintMode: HierarchyGridPrintMode = 'Expanded'): IGrid {
    const printGridModel: IGrid = {} as IGrid;
    if (!gObj) {
        return printGridModel;
    }
    const isFrozen: boolean = gObj.isFrozenGrid() && !gObj.getFrozenColumns();
    for (const key of Print.printGridProp) {
        if (key === 'columns') {
            printGridModel[key] = getActualPropFromColl(isFrozen ? gObj.getColumns() : gObj[key]);
        } else if (key === 'allowPaging') {
            printGridModel[key] = gObj.printMode === 'CurrentPage';
        } else {
            printGridModel[key] = getActualProperties(gObj[key]);
        }
    }
    printGridModel['enableHover'] = false;
    if (gObj.childGrid && hierarchyPrintMode !== 'None') {
        (<IGrid>printGridModel).expandedRows = getExpandedState(gObj, hierarchyPrintMode);
    }
    return printGridModel;
}

/**
 * @param {Object} copied - Defines the copied object
 * @param {Object} first - Defines the first object
 * @param {Object} second - Defines the second object
 * @param {boolean} deep - Defines the deep
 * @returns {Object} Returns the extended object
 * @hidden
 */
export function extendObjWithFn(copied: Object, first: Object, second?: Object, deep?: boolean): Object {
    const res: IKeyValue = copied as IKeyValue || {} as IKeyValue;
    let len: number = arguments.length;
    if (deep) {
        len = len - 1;
    }
    for (let i: number = 1; i < len; i++) {
        // eslint-disable-next-line prefer-rest-params
        if (!arguments[i]) {
            continue;
        }
        // eslint-disable-next-line prefer-rest-params
        const obj1: { [key: string]: Object } = arguments[i];
        const keys: string[] = Object.keys(Object.getPrototypeOf(obj1)).length ?
            Object.keys(obj1).concat(getPrototypesOfObj(obj1)) : Object.keys(obj1);
        for (let i: number = 0; i < keys.length; i++) {
            const source: Object = res[keys[i]];
            const cpy: Object = obj1[keys[i]];
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
 * @param {Object} obj - Defines the obj
 * @returns {string[]} Returns the string
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
 * @param {Column[]} column - Defines the Column
 * @returns {number} Returns the column Depth
 * @hidden
 */
export function measureColumnDepth(column: Column[]): number {
    let max: number = 0;
    for (let i: number = 0; i < column.length; i++) {
        const depth: number = checkDepth(column[i], 0);
        if (max < depth) {
            max = depth;
        }
    }
    return max + 1;
}

/**
 * @param {Column} col - Defines the Column
 * @param {number} index - Defines the index
 * @returns {number} Returns the depth
 * @hidden
 */
export function checkDepth(col: Column, index: number): number {
    let max: number = index;
    const indices: number[] = [];
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
 * @param {IGrid} gObj - Defines the IGrid
 * @param {PredicateModel[]} filteredCols - Defines the PredicateModel
 * @returns {void}
 * @hidden
 */
export function refreshFilteredColsUid(gObj: IGrid, filteredCols: PredicateModel[]): void {
    for (let i: number = 0; i < filteredCols.length; i++) {
        filteredCols[i].uid = filteredCols[i].isForeignKey ?
            getColumnByForeignKeyValue(filteredCols[i].field, gObj.getForeignKeyColumns()).uid
            : gObj.enableColumnVirtualization ? getColumnModelByFieldName(gObj, filteredCols[i].field).uid
                : gObj.getColumnByField(filteredCols[i].field).uid;
    }
}

/** @hidden */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Global {
    // eslint-disable-next-line prefer-const
    export let timer: Object = null;
}

/**
 * @param {Element} element - Defines the element
 * @returns {Object} Returns the transform values
 * @hidden
 */
export function getTransformValues(element: Element): { width: number, height: number } {
    const style: Object = document.defaultView.getComputedStyle(element, null);
    const transformV: string = (<{ getPropertyValue?: Function }>style).getPropertyValue('transform');
    const replacedTv: string = transformV.replace(/,/g, '');
    const translateX: number = parseFloat((replacedTv).split(' ')[4]);
    const translateY: number = parseFloat((replacedTv).split(' ')[5]);
    return { width: translateX, height: translateY };
}

/**
 * @param {Element} rootElement - Defines the root Element
 * @param {Element} element - Defines the element
 * @returns {void}
 * @hidden
 */
export function applyBiggerTheme(rootElement: Element, element: Element): void {
    if (rootElement.classList.contains('e-bigger')) {
        element.classList.add('e-bigger');
    }
}

/**
 * @param {HTMLElement} mTD - Defines the movable TD
 * @param {HTMLElement} fTD  - Defines the Frozen TD
 * @returns {void}
 * @hidden
 */
export function alignFrozenEditForm(mTD: HTMLElement, fTD: HTMLElement): void {
    if (mTD && fTD) {
        const mHeight: number = closest(mTD, '.' + literals.row).getBoundingClientRect().height;
        const fHeight: number = closest(fTD, '.' + literals.row).getBoundingClientRect().height;
        if (mHeight > fHeight) {
            fTD.style.height = mHeight + 'px';
        } else {
            mTD.style.height = fHeight + 'px';
        }
    }
}

/**
 * @param {Element} row - Defines row element
 * @param {IGrid} gridObj - Defines grid object
 * @returns {boolean} Returns isRowEnteredInGrid
 * @hidden
 */
export function ensureLastRow(row: Element, gridObj: IGrid): boolean {
    const cntOffset: number = (gridObj.getContent().firstElementChild as HTMLElement).offsetHeight;
    return row && row.getBoundingClientRect().top > cntOffset;
}

/**
 * @param {Element} row - Defines row element
 * @param {number} rowTop - Defines row top number
 * @returns {boolean} Returns first row is true
 * @hidden
 */
export function ensureFirstRow(row: Element, rowTop: number): boolean {
    return row && row.getBoundingClientRect().top < rowTop;
}

/**
 * @param {number} index - Defines index
 * @param {IGrid} gObj - Defines grid object
 * @returns {boolean} Returns isRowEnteredInGrid
 * @hidden
 */
export function isRowEnteredInGrid(index: number, gObj: IGrid): boolean {
    const rowHeight: number = gObj.getRowHeight();
    const startIndex: number = gObj.getContent().firstElementChild.scrollTop / rowHeight;
    const endIndex: number = startIndex + ((gObj.getContent().firstElementChild as HTMLElement).offsetHeight / rowHeight);
    return index < endIndex && index > startIndex;
}

/**
 * @param {IGrid} gObj - Defines the grid object
 * @param {Object} data - Defines the query
 * @returns {number} Returns the edited data index
 * @hidden
 */
export function getEditedDataIndex(gObj: IGrid, data: Object): number {
    const keyField: string = gObj.getPrimaryKeyFieldNames()[0];
    let dataIndex: number;
    gObj.getCurrentViewRecords().filter((e: Object, index: number) => {
        if (e[keyField] === data[keyField]) {
            dataIndex = index;
        }
    });
    return dataIndex;
}

/**
 * @param {Object} args - Defines the argument
 * @param {Query} query - Defines the query
 * @returns {FilterStateObj} Returns the filter state object
 * @hidden
 */
export function eventPromise(args: Object, query: Query): FilterStateObj {
    const state: DataStateChangeEventArgs = getStateEventArgument(query);
    const def: Deferred = new Deferred();
    state.dataSource = def.resolve;
    state.action = args;
    return {state: state, deffered: def};
}

/**
 * @param {Query} query - Defines the query
 * @returns {Object} Returns the state event argument
 * @hidden
 */
export function getStateEventArgument(query: Query): Object {
    const adaptr: UrlAdaptor = new UrlAdaptor();
    const dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
    const state: { data?: string } = adaptr.processQuery(dm, query);
    const data: Object = JSON.parse(state.data);
    return data;
}

/**
 * @param {IGrid} gObj - Defines the Igrid
 * @returns {boolean} Returns the ispercentageWidth
 * @hidden
 */
export function ispercentageWidth(gObj: IGrid): boolean {
    const columns: Column[] = gObj.getVisibleColumns();
    let percentageCol: number = 0;
    let undefinedWidthCol: number = 0;
    for (let i: number = 0; i < columns.length; i++) {
        if (isUndefined(columns[i].width)) {
            undefinedWidthCol++;
        } else if (columns[i].width.toString().indexOf('%') !== -1) {
            percentageCol++;
        }
    }
    return (gObj.width === 'auto' || typeof (gObj.width) === 'string' && gObj.width.indexOf('%') !== -1) &&
        !gObj.groupSettings.showGroupedColumn && gObj.groupSettings.columns.length
        && percentageCol && !undefinedWidthCol;
}

/**
 * @param {IGrid} gObj - Defines the IGrid
 * @param {Row<Column>[]} rows - Defines the row
 * @param {HTMLTableRowElement[]} rowElms - Row elements
 * @param {number} index - Row index
 * @returns {void}
 * @hidden
 */
export function resetRowIndex(gObj: IGrid, rows: Row<Column>[], rowElms: HTMLTableRowElement[], index?: number): void {
    let startIndex: number = index ? index : 0;
    for (let i: number = 0; i < rows.length; i++) {
        if (rows[i].isDataRow) {
            rows[i].index = startIndex;
            rows[i].isAltRow = gObj.enableAltRow ? startIndex % 2 !== 0 : false;
            rowElms[i].setAttribute(literals.ariaRowIndex, startIndex.toString());
            if (rows[i].isAltRow) {
                rowElms[i].classList.add('e-altrow');
            } else {
                rowElms[i].classList.remove('e-altrow');
            }
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

/**
 * @param {IGrid} gObj - Defines the grid object
 * @param {Object} changes - Defines the changes
 * @param {string} type - Defines the type
 * @param {string} keyField - Defines the keyfield
 * @returns {void}
 * @hidden
 */
export function compareChanges(gObj: IGrid, changes: Object, type: string, keyField: string): void {
    const newArray: Object[] = (<{ dataToBeUpdated?: Object }>gObj).dataToBeUpdated[type].concat(changes[type]).reduce(
        (r: Object, o: Object) => {
            r[o[keyField]] = r[o[keyField]] === undefined ? o : Object.assign(r[o[keyField]], o);
            return r;
        },
        {});
    (<{ dataToBeUpdated?: Object }>gObj).dataToBeUpdated[type] = Object.keys(newArray).map((k: string) => newArray[k]);
}

/**
 * @param {IGrid} gObj - Defines the grid object
 * @returns {void}
 * @hidden
 */
export function setRowElements(gObj: IGrid): void {
    if (gObj.isFrozenGrid()) {
        (<{ rowElements?: Element[] }>(gObj).contentModule).rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-movableheader .e-row, .e-movablecontent .e-row'));
        const cls: string = gObj.getFrozenMode() === literals.leftRight ? '.e-frozen-left-header .e-row, .e-frozen-left-content .e-row'
            : '.e-frozenheader .e-row, .e-frozencontent .e-row';
        (<{ freezeRowElements?: Element[] }>(gObj).contentModule).freezeRowElements =
            [].slice.call(gObj.element.querySelectorAll(cls));
        if (gObj.getFrozenMode() === literals.leftRight) {
            (<{ frozenRightRowElements?: Element[] }>gObj.contentModule).frozenRightRowElements =
                [].slice.call(gObj.element.querySelectorAll('.e-frozen-right-header .e-row, .e-frozen-right-content .e-row'));
        }
    } else {
        (<{ rowElements?: Element[] }>(gObj).contentModule).rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-row:not(.e-addedrow)'));
    }
}

/**
 * @param {IGrid} gObj - Defines the grid object
 * @param {Cell<Column>} cells - Defines the callback function
 * @param {freezeTable} tableName - Defines the row
 * @returns {Cell<Column>[]} Returns the cell
 * @hidden
 */
export function splitFrozenRowObjectCells(gObj: IGrid, cells: Cell<Column>[], tableName: freezeTable): Cell<Column>[] {
    const left: number = gObj.getFrozenLeftCount();
    const movable: number = gObj.getMovableColumnsCount();
    const right: number = gObj.getFrozenRightColumnsCount();
    const frozenMode: freezeMode = gObj.getFrozenMode();
    const drag: number = gObj.isRowDragable() ? 1 : 0;
    const rightIndex: number = frozenMode === 'Right' ? left + movable : left + movable + drag;
    const mvblIndex: number = frozenMode === 'Right' ? left : left + drag;
    const mvblEndIdx: number = frozenMode === 'Right' ? cells.length - right - drag
        : right ? cells.length - right : cells.length;
    if (tableName === literals.frozenLeft) {
        cells = cells.slice(0, left ? left + drag : cells.length);
    } else if (tableName === literals.frozenRight) {
        cells = cells.slice(rightIndex, cells.length);
    } else if (tableName === 'movable') {
        cells = cells.slice(mvblIndex, mvblEndIdx);
    }
    return cells;
}

// eslint-disable-next-line
/** @hidden */
export function gridActionHandler(
    gObj: IGrid, callBack: Function, rows: Row<Column>[][] | Element[][], force?: boolean, rowObj?: Row<Column>[][]): void {
    if (rows[0].length || force) {
        if (rowObj) {
            callBack(literals.frozenLeft, rows[0], rowObj[0]);
        } else {
            callBack(literals.frozenLeft, rows[0]);
        }
    }
    if (gObj.isFrozenGrid() && (rows[1].length || force)) {
        if (rowObj) {
            callBack('movable', rows[1], rowObj[1]);
        } else {
            callBack('movable', rows[1]);
        }
    }
    if ((gObj.getFrozenMode() === literals.leftRight || gObj.getFrozenMode() === 'Right') && (rows[2].length || force)) {
        if (rowObj) {
            callBack(literals.frozenRight, rows[2], rowObj[2]);
        } else {
            callBack(literals.frozenRight, rows[2]);
        }
    }
}

/**
 * @param {IGrid} gObj - Defines the grid
 * @returns {Row<Column>} Returns the row
 * @hidden
 */
export function getGridRowObjects(gObj: IGrid): Row<Column>[][] {
    return [gObj.getFrozenMode() !== 'Right' ? gObj.getRowsObject() : [], gObj.getMovableRowsObject(), gObj.getFrozenRightRowsObject()];
}

/**
 * @param {IGrid} gObj - Defines the grid
 * @returns {Element} Returns the element
 * @hidden
 */
export function getGridRowElements(gObj: IGrid): Element[][] {
    return [
        gObj.getFrozenMode() !== 'Right' ? gObj.getAllDataRows(true) : [],
        gObj.getAllMovableDataRows(true), gObj.getAllFrozenRightDataRows(true)
    ];
}

/**
 * @param {Element} row - Defines the row
 * @param {number} start - Defines the start index
 * @param {number} end - Defines the end index
 * @returns {void}
 * @hidden
 */
export function sliceElements(row: Element, start: number, end: number): void {
    const cells: HTMLCollection = row.children;
    const len: number = cells.length;
    let k: number = 0;
    for (let i: number = 0; i < len; i++, k++) {
        if (i >= start && i < end) {
            continue;
        }
        row.removeChild(row.children[k]);
        k--;
    }
}

/**
 * @param {IGrid} gObj - Defines the grid Object
 * @param {Column} col - Defines the column
 * @param {number} rowIndex - Defines the rowindex
 * @returns {Element} Returns the element
 * @hidden
 */
export function getCellsByTableName(gObj: IGrid, col: Column, rowIndex: number): Element[] {
    if (col.getFreezeTableName() === 'movable') {
        return [].slice.call(gObj.getMovableDataRows()[rowIndex].getElementsByClassName(literals.rowCell));
    } else if (col.getFreezeTableName() === literals.frozenRight) {
        return [].slice.call(gObj.getFrozenRightDataRows()[rowIndex].getElementsByClassName(literals.rowCell));
    } else {
        return [].slice.call(gObj.getDataRows()[rowIndex].getElementsByClassName(literals.rowCell));
    }
}

/**
 * @param {IGrid} gObj - Defines the column
 * @param {Column} col - Defines the index
 * @param {number} rowIndex - Defines the rules
 * @param {number} index - Defines the movable column rules
 * @returns {Element} Returns the Element
 * @hidden
 */
export function getCellByColAndRowIndex(gObj: IGrid, col: Column, rowIndex: number, index: number): Element {
    const left: number = gObj.getFrozenLeftCount();
    const movable: number = gObj.getMovableColumnsCount();
    index = col.getFreezeTableName() === 'movable' ? index - left : col.getFreezeTableName() === literals.frozenRight
        ? index - (left + movable) : index;
    return getCellsByTableName(gObj, col, rowIndex)[index];
}

/**
 * @param {Column} col - Defines the column
 * @param {number} index - Defines the index
 * @param {Object} rules - Defines the rules
 * @param {Object} mRules - Defines the movable column rules
 * @param {Object} frRules - Defines the Frozen rules
 * @param {number} len - Defines the length
 * @param {boolean} isCustom - Defines custom form validation
 * @returns {void}
 * @hidden
 */
export function setValidationRuels(
    col: Column, index: number, rules: Object, mRules: Object, frRules: Object,
    len: number, isCustom?: boolean
): void {
    if (isCustom) {
        rules[getComplexFieldID(col.field)] = col.validationRules;
    } else {
        if (col.getFreezeTableName() === literals.frozenLeft
            || (!index && col.getFreezeTableName() === literals.frozenRight) || len === 1) {
            rules[getComplexFieldID(col.field)] = col.validationRules;
        } else if (col.getFreezeTableName() === 'movable' || !col.getFreezeTableName()) {
            mRules[getComplexFieldID(col.field)] = col.validationRules;
        } else if (col.getFreezeTableName() === literals.frozenRight) {
            frRules[getComplexFieldID(col.field)] = col.validationRules;
        }
    }
}

/**
 * @param {IGrid} gObj - Defines the grid object
 * @returns {Element} Returns the Element
 * @hidden
 */
export function getMovableTbody(gObj: IGrid): Element {
    let tbody: Element;
    if (gObj.isFrozenGrid()) {
        tbody = gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top' ? gObj.getMovableHeaderTbody()
            : gObj.getMovableContentTbody();
    }
    return tbody;
}

/**
 * @param {IGrid} gObj - Defines the grid object
 * @returns {Element} Returns the Element
 * @hidden
 */
export function getFrozenRightTbody(gObj: IGrid): Element {
    let tbody: Element;
    if (gObj.getFrozenMode() === literals.leftRight) {
        tbody = gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top' ? gObj.getFrozenRightHeaderTbody()
            : gObj.getFrozenRightContentTbody();
    }
    return tbody;
}

/**
 * @param {Element} tbody - Table body
 * @param {Element} mTbody - Movanle table body
 * @param {Element} frTbody - Frozen right table body
 * @param {Element[]} tr - Table rows
 * @param {Element[]} mTr - Movable table rows
 * @param {Element[]} frTr - Frozen right table rows
 * @param {Function} callBack - Callback function
 * @returns {void}
 * @hidden
 */
export function setRowsInTbody(
    tbody: Element, mTbody: Element, frTbody: Element, tr: Element[], mTr: Element[], frTr: Element[], callBack: Function
): void {
    if (tbody && tr) {
        callBack(tbody, tr);
    }
    if (mTbody && mTr) {
        callBack(mTbody, mTr);
    }
    if (frTbody && frTr) {
        callBack(frTbody, frTr);
    }
}

/**
 * @param {string} numberFormat - Format
 * @param {string} type - Value type
 * @param {boolean} isExcel - Boolean property
 * @returns {string} returns formated value
 * @hidden
 */
export function getNumberFormat(numberFormat: string, type: string, isExcel: boolean): string {
    let format: string;
    const intl: Internationalization = new Internationalization();
    if (type === 'number') {
        try {
            format = intl.getNumberPattern({ format: numberFormat, currency: this.currency, useGrouping: true }, true);
        } catch (error) {
            format = numberFormat;
        }
    } else if (type === 'date' || type === 'time' || type === 'datetime') {
        try {
            format = intl.getDatePattern({ skeleton: numberFormat, type: type }, isExcel);
            if (isNullOrUndefined(format)) {
                // eslint-disable-next-line
                throw 'error';
            }
        } catch (error) {
            try {
                format = intl.getDatePattern({ format: numberFormat, type: type }, isExcel);
            } catch (error) {
                format = numberFormat;
            }
        }
    } else {
        format = numberFormat;
    }
    if (type !== 'number') {
        const patternRegex: RegExp = /G|H|c|'| a|yy|y|EEEE|E/g;
        const mtch: Object = { 'G': '', 'H': 'h', 'c': 'd', '\'': '"', ' a': ' AM/PM', 'yy': 'yy', 'y': 'yyyy', 'EEEE': 'dddd', 'E': 'ddd' };
        format = format.replace(patternRegex, (pattern: string): string => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (<any>mtch)[pattern];
        });
    }
    return format;
}

/**
 * @param {IGrid} gObj - Grid instance
 * @returns {void}
 * @hidden
 */
export function addBiggerDialog(gObj: IGrid): void {
    if (gObj.enableAdaptiveUI) {
        const dialogs: HTMLCollectionOf<Element> = document.getElementsByClassName('e-responsive-dialog');
        for (let i: number = 0; i < dialogs.length; i++) {
            dialogs[i].classList.add('e-bigger');
        }
    }
}

/**
 * @param {string} value - specifies the trr
 * @param {Object} mapObject - specifies the idx
 * @returns {Object | string} returns object or string
 * @hidden
 */
export function performComplexDataOperation(value: string, mapObject: Object): Object | string {
    let returnObj: Object | string;
    const length: number = value.split('.').length;
    const splits: string[] = value.split('.');
    let duplicateMap: Object | string = mapObject;
    for (let i: number = 0; i < length; i++) {
        returnObj = duplicateMap[splits[i]];
        duplicateMap = returnObj;
    }
    return returnObj;
}

/**
 * @param {Object} tr - specifies the trr
 * @param {number} idx - specifies the idx
 * @param {string} displayVal - specifies the displayval
 * @param {Row<Column>} rows - specifies the rows
 * @param {IGrid} parent - Grid instance
 * @param {boolean} isContent - check for content renderer
 * @returns {void}
 * @hidden
 */
export function setDisplayValue(tr: Object, idx: number, displayVal: string, rows: Row<Column>[], parent?: IGrid,
                                isContent?: boolean): void {
    const trs: string[] = Object.keys(tr);
    for (let i: number = 0; i < trs.length; i++) {
        const td: HTMLElement = tr[trs[i]].querySelectorAll('td.e-rowcell')[idx];
        if (tr[trs[i]].querySelectorAll('td.e-rowcell').length && td) {
            setStyleAttribute(<HTMLElement>tr[trs[i]].querySelectorAll('td.e-rowcell')[idx], { 'display': displayVal });
            if (tr[trs[i]].querySelectorAll('td.e-rowcell')[idx].classList.contains('e-hide')) {
                removeClass([tr[trs[i]].querySelectorAll('td.e-rowcell')[idx]], ['e-hide']);
            }
            if (isContent && parent.isRowDragable()) {
                const index: number = parent.getFrozenColumns() ? idx : idx + 1;
                rows[trs[i]].cells[index].visible = displayVal === '' ? true : false;
            } else {
                rows[trs[i]].cells[idx].visible = displayVal === '' ? true : false;
            }
        }
    }
}

// eslint-disable-next-line
/** @hidden */
export function addRemoveEventListener(parent: IGrid, evt: { event: string, handler: Function }[], isOn: boolean, module?: Object): void {
    for (const inst of evt) {
        if (isOn) {
            parent.on(inst.event, inst.handler, module);
        } else {
            parent.off(inst.event, inst.handler);
        }
    }
}

// eslint-disable-next-line
/** @hidden */
export function createEditElement(parent: IGrid, column: Column, classNames: string, attr: { [key: string]: string }): Element {
    const complexFieldName: string = getComplexFieldID(column.field);
    attr = Object.assign(attr, {
        id: parent.element.id + complexFieldName,
        name: complexFieldName, 'e-mappinguid': column.uid
    });
    return parent.createElement('input', {
        className: classNames, attrs: attr
    });
}

/**
 * @param {IGrid} gObj - Grid instance
 * @param {string} uid - Defines column's uid
 * @returns {Column} returns column model
 * @hidden
 */
export function getColumnModelByUid(gObj: IGrid, uid: string): Column {
    let column: Column;
    for (const col of ((<{ columnModel?: Column[] }>gObj).columnModel)) {
        if (col.uid === uid) {
            column = col;
            break;
        }
    }
    return column;
}

/**
 * @param {IGrid} gObj - Grid instance
 * @param {string} field - Defines column's uid
 * @returns {Column} returns column model
 * @hidden
 */
export function getColumnModelByFieldName(gObj: IGrid, field: string): Column {
    let column: Column;
    if (!(<{ columnModel?: Column[] }>gObj).columnModel) { <Column[]>gObj.getColumns(); }
    for (const col of ((<{ columnModel?: Column[] }>gObj).columnModel)) {
        if (col.field === field) {
            column = col;
            break;
        }
    }
    return column;
}

/**
 * @param {string} id - Defines component id
 * @param {string[]} evts - Defines events
 * @param {object} handlers - Defines event handlers
 * @param {any} instance - Defines class instance
 * @returns {void}
 * @hidden
 */
// eslint-disable-next-line
export function registerEventHandlers(id: string, evts: string[], handlers: object, instance: any): void {
    instance.eventHandlers[id] = {};
    for (let i: number = 0; i < evts.length; i++) {
        instance.eventHandlers[id][evts[i]] = handlers[evts[i]];
    }
}

/**
 * @param {any} component - Defines component instance
 * @param {string[]} evts - Defines events
 * @param {any} instance - Defines class instance
 * @returns {void}
 * @hidden
 */
// eslint-disable-next-line
export function removeEventHandlers(component: any, evts: string[], instance: any): void {
    for (let i: number = 0; i < evts.length; i++) {
        if (component.isDestroyed) { break; }
        component.removeEventListener(evts[i], instance.eventHandlers[component.element.id][evts[i]]);
    }
}

/**
 * @param {IGrid | IXLFilter} parent - Defines parent instance
 * @param {string[]} templates - Defines the templates name which are needs to clear
 * @returns {void}
 * @hidden
 */
export function clearReactVueTemplates(parent: IGrid | IXLFilter, templates: string[]): void {
    parent.destroyTemplate(templates);
    if (parent.isReact) {
        parent.renderTemplates();
    }
}

/**
 *
 * @param { Element } row - Defines row element
 * @returns { number } row index
 */
export function getRowIndexFromElement(row: Element): number {
    return parseInt(row.getAttribute(literals.ariaRowIndex), 10);
}

/**
 *
 * @param { string[] } fields - Defines grouped fields
 * @param { values } values - Defines caption keys
 * @param { any } instance - Defines dynamic class instance
 * @returns { Predicate } returns filter predicate
 */
// eslint-disable-next-line
export function generateExpandPredicates(fields: string[], values: string[], instance: any): Predicate {
    let filterCols: PredicateModel[] = [];
    for (let i: number = 0; i < fields.length; i++) {
        const column: Column = instance.parent.getColumnByField(fields[i]);
        const value: string = values[i] === 'null' ? null : values[i];
        const pred: {
            predicate?: string, field?: string, type?: string, uid?: string
            operator?: string, matchCase?: boolean, ignoreAccent?: boolean
        } = {
            field: fields[i], predicate: 'or', uid: column.uid, operator: 'equal', type: column.type,
            matchCase: instance.allowCaseSensitive, ignoreAccent: instance.parent.filterSettings.ignoreAccent
        };
        if (value === '' || isNullOrUndefined(value)) {
            filterCols = filterCols.concat(CheckBoxFilterBase.generateNullValuePredicates(pred));
        } else {
            filterCols.push(extend({}, { value: value }, pred));
        }
    }
    return CheckBoxFilterBase.getPredicate(filterCols);
}

/**
 *
 * @param { Predicate } pred - Defines filter predicate
 * @returns { Predicate[] } Returns formed predicate
 */
export function getPredicates(pred: Predicate): Predicate[] {
    const predicateList: Predicate[] = [];
    for (const prop of Object.keys(pred)) {
        predicateList.push(<Predicate>pred[prop]);
    }
    return predicateList;
}

/**
 *
 * @param { number } index - Defines group caption indent
 * @param { Row<Column>[] } rowsObject - Defines rows object
 * @returns { { fields: string[], keys: string[] } } Returns grouped keys and values
 */
export function getGroupKeysAndFields(index: number, rowsObject: Row<Column>[]): { fields: string[], keys: string[] } {
    const fields: string[] = [];
    const keys: string[] = [];
    for (let i: number = index; i >= 0; i--) {
        if (rowsObject[i].isCaptionRow && fields.indexOf((rowsObject[i].data as GroupedData).field) === -1
            && (rowsObject[i].indent < rowsObject[index].indent || i === index)) {
            fields.push((rowsObject[i].data as GroupedData).field);
            keys.push((rowsObject[i].data as GroupedData).key);
            if (rowsObject[i].indent === 0) {
                break;
            }
        }
    }
    return { fields: fields, keys: keys };
}

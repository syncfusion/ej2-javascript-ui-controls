/**
 * Common methods used in Gantt
 */
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { AdaptorOptions, DataManager, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { WebMethodAdaptor, CacheAdaptor, RemoteSaveAdaptor, ODataV4Adaptor, JsonAdaptor } from '@syncfusion/ej2-data';
import { ITaskData, IGanttData } from './interface';
import { Gantt } from './gantt';

/**
 * @param {Element} elem .
 * @param {string} selector .
 * @param {boolean} isID .
 * @returns {Element} .
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
 * @param {ITaskData} ganttProp .
 * @returns {boolean} .
 * @hidden
 */
export function isScheduledTask(ganttProp: ITaskData): boolean {
    if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.endDate) &&
        isNullOrUndefined(ganttProp.duration)) {
        return null;
    } else if (isNullOrUndefined(ganttProp.startDate) || isNullOrUndefined(ganttProp.endDate) ||
        isNullOrUndefined(ganttProp.duration)) {
        return false;
    } else {
        return true;
    }
}
/**
 * @param {Gantt} parent .
 * @returns {boolean} .
 * @hidden
 */
export function isCountRequired(parent: Gantt): boolean {
    if (parent.dataSource && !(parent.dataSource instanceof DataManager) &&
         'result' in parent.dataSource) {
        return true;
    }
    return false;
}
/**
 * @param {object} obj .
 * @returns {object} .
 * @hidden
 */
// eslint-disable-next-line
export function getSwapKey(obj: Object): object {
    // eslint-disable-next-line
    const temp: Object = {};
    for (const key of Object.keys(obj)) {
        temp[obj[key]] = key;
    }
    return temp;
}

/**
 * @param {object} dataSource .
 * @returns {boolean} .
 * @hidden
 */
// eslint-disable-next-line
export function isRemoteData(dataSource: object): boolean {
    if (dataSource instanceof DataManager) {
        const adaptor: AdaptorOptions = dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor || (adaptor instanceof ODataV4Adaptor) ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || (adaptor instanceof RemoteSaveAdaptor) ||
            (adaptor instanceof JsonAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}

/**
 * @param {IGanttData[]} records .
 * @param {boolean} isNotExtend .
 * @returns {object[]} .
 * @hidden
 */
// eslint-disable-next-line
export function getTaskData(records: IGanttData[], isNotExtend?: boolean): object[] {
    // eslint-disable-next-line
    const result: object[] = [];
    for (let i: number = 0; i < records.length; i++) {
        // eslint-disable-next-line
        const data: object = isNotExtend ? (records[i].taskData) : extend({}, records[i].taskData, {}, true);
        result.push(data);
    }
    return result;
}

/**
 * @param {string} str .
 * @param {string[]} args .
 * @returns {string} .
 * @hidden
 */
export function formatString(str: string, args: string[]): string {
    let regx: RegExp;
    for (let i: number = 0; i < args.length; i++) {
        regx = new RegExp('\\{' + (i) + '\\}', 'gm');
        str = str.replace(regx, args[i].toString());
    }
    return str;
}

/**
 * @param {any} value .
 * @param {string} key1 .
 * @param {any} collection .
 * @param {string} key2
 * @returns {number} .
 * @hidden
 */
/* eslint-disable-next-line */
export function getIndex(value: any, key1: string, collection: any, key2?: string ): number {
    let index: number = - 1;
    for (let i: number = 0; i < collection.length; i++) {
        if (getValue(key1, collection[i]) === getValue(key1, value) && isNullOrUndefined(key2)
            || (!isNullOrUndefined(key2) && getValue(key1, collection[i]) === getValue(key1, value)
                && getValue(key2, collection[i]) === getValue(key2, value))) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * @param {number} value .
 * @returns {number} .
 * @hidden
 */
export function pixelToPoint(value: number): number {
    return (value * 76) / 92;
}

/**
 * @param {number} value .
 * @returns {number} .
 * @hidden
 */
export function pointToPixel(value: number): number {
    return (value * 92) / 76;
}

let uid: number = 0;

/**
 * @returns {number} .
 * @hidden
 */
export function getUid(): number {
    return uid++;
}

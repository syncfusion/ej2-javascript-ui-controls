/**
 * Common methods used in Gantt
 */
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { AdaptorOptions, DataManager, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { WebMethodAdaptor, CacheAdaptor, RemoteSaveAdaptor, ODataV4Adaptor, JsonAdaptor } from '@syncfusion/ej2-data';
import { ITaskData, IGanttData, ITaskAddedEventArgs } from './interface';
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
export function getSwapKey(obj: Object): object {
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
 * @param {ITaskAddedEventArgs} eventArgs .
 * @param {Gantt} parent .
 * @returns {object[]} .
 * @hidden
 */
export function getTaskData(
    records: IGanttData[], isNotExtend?: boolean, eventArgs?: ITaskAddedEventArgs, parent?: Gantt): object[] | object {
    if (eventArgs)
    {
        let result: object;
        for (let i: number = 0; i < records.length; i++) {
            let data: object;
            // eslint-disable-next-line
            data = isNotExtend ? (records[i].taskData) : extend({}, records[i].taskData, {}, true);
            result = (data);
        }
        return result;
    }
    else {
        const result: object[] = [];
        for (let i: number = 0; i < records.length; i++) {
            let data: object;
            if (!isNullOrUndefined(parent) && parent.timezone) {
                updateDates(records[i], parent);
            }
            // eslint-disable-next-line
            data = isNotExtend ? (records[i].taskData) : extend({}, records[i].taskData, {}, true);
            result.push(data);
        }
        return result;
    }
}

/**
 * @param {IGanttData} record .
 * @param {Gantt} parent .
 * @returns {null} .
 * @hidden
 */
export function updateDates(record: IGanttData, parent: Gantt): void {
    // let startDate: Date = (record as IGanttData).taskData[parent.taskFields.startDate];
    (record as IGanttData).taskData[parent.taskFields.startDate] = parent.dateValidationModule.remove(
        (record as IGanttData).ganttProperties.startDate, parent.timezone);
    if (parent.taskFields.endDate != null) {
        (record as IGanttData).taskData[parent.taskFields.endDate] = parent.dateValidationModule.remove(
            (record as IGanttData).ganttProperties.endDate, parent.timezone);
    }
    if (parent.taskFields.baselineEndDate || parent.taskFields.baselineStartDate) {
        (record as IGanttData).taskData[parent.taskFields.baselineStartDate] = parent.dateValidationModule.remove(
            (record as IGanttData).ganttProperties.baselineStartDate, parent.timezone);

        (record as IGanttData).taskData[parent.taskFields.baselineEndDate] = parent.dateValidationModule.remove(
            (record as IGanttData).ganttProperties.baselineEndDate, parent.timezone);
    }
    return null;
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

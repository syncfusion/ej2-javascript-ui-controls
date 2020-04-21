/**
 * Common methods used in Gantt
 */
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { AdaptorOptions, DataManager, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { WebMethodAdaptor, CacheAdaptor } from '@syncfusion/ej2-data';
import { ITaskData, IGanttData } from './interface';

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

export function getSwapKey(obj: Object): object {
    let temp: Object = {};
    for (let key of Object.keys(obj)) {
        temp[obj[key]] = key;
    }
    return temp;
}

export function isRemoteData(dataSource: object): boolean {
    if (dataSource instanceof DataManager) {
        let adaptor: AdaptorOptions = dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}

export function getTaskData(records: IGanttData[]): object[] {
    let result: object[] = [];
    for (let i: number = 0; i < records.length; i++) {
        let data: object = extend({}, records[i].taskData, {}, true);
        result.push(data);
    }
    return result;
}

export function formatString(str: string, args: string[]): string {
    let regx: RegExp;
    for (let i: number = 0; i < args.length; i++) {
        regx = new RegExp('\\{' + (i) + '\\}', 'gm');
        str = str.replace(regx, args[i].toString());
    }
    return str;
}

/* tslint:disable-next-line */
export function getIndex(value: any, key1: string, collection: any, key2?: string, ): number {
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

export function pixelToPoint(value: number): number {
    return (value * 76) / 92;
}

export function pointToPixel(value: number): number {
    return (value * 92) / 76;
}

let uid: number = 0;
/** @hidden */
export function getUid(): number {
    return uid++;
}

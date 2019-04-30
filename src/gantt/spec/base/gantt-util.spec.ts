import { createElement, remove, getUniqueID, extend, EmitType } from '@syncfusion/ej2-base';
import { Gantt, GanttModel } from '../../src/index';
import { DataManager } from '@syncfusion/ej2-data';
/**
 * 
 */
export function createGantt(options: GanttModel, done: Function): Gantt {
    let id: string = getUniqueID('Gantt');
    if (!(options.dataSource instanceof DataManager)) {
        if (options.dataSource && options.dataSource.length > 0) {
            let data: Object[] = JSON.parse(JSON.stringify(options.dataSource));
            options.dataSource = data;
        }
        if(!options.height){
            options.height = '400px';
        }
    }
    let dataBound: EmitType<Object> = () => {
        done();
    };
    options.dataBound = dataBound;
    let gantt: Gantt = new Gantt(options);
    document.body.appendChild(createElement('div', { id: id }));
    gantt.appendTo('#' + id);
    return gantt;
}

export function destroyGantt(gantt: Gantt): void {
    if (gantt && !gantt.isDestroyed) {
        let id: string = gantt.element.id;
        gantt.destroy();
        remove(document.getElementById(id));
        //ensure once again, because sometimes element not removed from dom.
        if (document.getElementById(id)) {
           remove(document.getElementById(id));
        }
    }
}

export function triggerMouseEvent(
    node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void {
    let mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
}
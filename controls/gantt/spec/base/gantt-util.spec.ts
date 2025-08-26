import { createElement, remove, getUniqueID, extend, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt, GanttModel } from '../../src/index';
import { DataManager } from '@syncfusion/ej2-data';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
/**
 * 
 */
export function createGantt(options: GanttModel, done: Function): Gantt {
    let id: string = getUniqueID('Gantt');
    if (!(options.dataSource instanceof DataManager)) {
        if (options.dataSource && [options.dataSource as Object[]].length > 0) {
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
           document.getElementById(id).remove();
        }
    }
}

export function triggerMouseEvent(
    node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean, buttonArgs?: number): void {
    let mouseEve: MouseEvent = new MouseEvent(eventType);
    buttonArgs = isNullOrUndefined(buttonArgs) ? 0 : buttonArgs;
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, buttonArgs, null);
    if(!isNullOrUndefined(node)){
        node.dispatchEvent(mouseEve);
    }    
}

export function  triggerScrollEvent(target: HTMLElement, newScrollTop?: number, newScrollLeft?: number) {
    if(newScrollTop) {
    target.scrollTop = newScrollTop;
    } 
    if(newScrollLeft) {
        target.scrollLeft = newScrollLeft;
    }
    let e = new UIEvent("scroll", {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1
    });
    target.dispatchEvent(e);
}
export function triggerKeyboardEvent(target: Element, type: string, key: string): any {
    let keyboardEve = new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        key: key,
        location: 0,
        repeat: false,
    });
    target.dispatchEvent(keyboardEve);
}
export function getKeyUpObj(keyCode: string | number, target: Element): any {
    let preventDefault = () => { };
    return { target: target, keyCode: keyCode};
}
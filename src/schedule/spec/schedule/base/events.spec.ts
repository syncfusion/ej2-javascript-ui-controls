import { EventHandler, Ajax, loadCldr } from '@syncfusion/ej2-base';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { Schedule, EJ2Instance } from '../../../src/schedule/index';

/**
 * Trigger Mouse and Touch Events for spec documents
 */

/*tslint:disable */
let touchTestObj: any;
interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
    stopPropagation(): void;
}
/*tslint:enable */
let node: Element;
let startMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchstart',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
let moveMouseEventArs: CommonArgs = {
    clientX: 500, clientY: 200, target: node, type: 'touchmove',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
let endMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchend',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};

export function triggerSwipeEvent(target: Element, x?: number, y?: number): void {
    node = target;
    startMouseEventArs.target = node;
    moveMouseEventArs.target = node;
    endMouseEventArs.target = node;
    // tslint:disable-next-line:no-any
    touchTestObj = ((node as EJ2Instance).ej2_instances[0] as any);
    let movedEnd: CommonArgs = moveMouseEventArs;
    movedEnd.type = 'touchend';
    if (x) { movedEnd.clientX = x; }
    if (y) { movedEnd.clientY = y; }
    touchTestObj.startEvent(startMouseEventArs);
    touchTestObj.moveEvent(moveMouseEventArs);
    touchTestObj.endEvent(movedEnd);
    EventHandler.trigger(<HTMLElement>node, 'transitionend');
}

// export function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
//     let mouseEve: MouseEvent = new MouseEvent(eventType);
//     if (x && y) {
//         mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
//     } else {
//         mouseEve.initEvent(eventType, true, true);
//     }
//     node.dispatchEvent(mouseEve);
// }

export function triggerMouseEvent(
    node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void {
    let mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
}

export function triggerScrollEvent(target: HTMLElement, scrollTop: number): void {
    target.scrollTop = scrollTop;
    let e: UIEvent = document.createEvent('UIEvents');
    e.initUIEvent('scroll', true, true, window, 1);
    target.dispatchEvent(e);
}

export function disableScheduleAnimation(schObj: Schedule): void {
    disablePopupAnimation(schObj.quickPopup.quickPopup);
    disablePopupAnimation(schObj.quickPopup.morePopup);
    disableDialogAnimation(schObj.quickPopup.quickDialog);
    disableDialogAnimation(schObj.eventWindow.dialogObject);
    let resTree: Element = schObj.element.querySelector('.e-resource-tree-popup');
    if (resTree) {
        let resTreePopup: Popup = (resTree as EJ2Instance).ej2_instances[0] as Popup;
        disablePopupAnimation(resTreePopup);
    }
}

function disablePopupAnimation(popupObj: Popup): void {
    popupObj.showAnimation = null;
    popupObj.hideAnimation = null;
    popupObj.dataBind();
}

function disableDialogAnimation(dialogObject: Dialog): void {
    dialogObject.animationSettings = { effect: 'None' };
    dialogObject.dataBind();
    dialogObject.hide();
}

export function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('base/spec/cldr-data/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
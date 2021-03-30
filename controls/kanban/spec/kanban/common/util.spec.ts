/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, extend, EmitType, remove } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Tooltip } from '@syncfusion/ej2-popups';
import { Kanban, KanbanModel, ActionEventArgs } from '../../../src/kanban/base/index';

/** kanban spec utils */

/**
 * Generates the clone dataSource
 *
 * @param {Object[]} dataCollection Accepts the collection of objects
 * @returns {Object[]} Returns the collection of objects
 */
export function cloneDataSource(dataCollection: Record<string, any>[]): Record<string, any>[] {
    const dataSrc: Record<string, any>[] = [];
    dataCollection.forEach((data: Record<string, any>) => dataSrc.push(extend({}, data) as Record<string, any>));
    return dataSrc;
}

/**
 * Render the Kanban component
 *
 * @param {KanbanModel} options Accepts the KanbanMOdel
 * @param {Object[] | DataManager} dataSource Accepts the cpllection of objects or DataManager instance
 * @param {Function} done Accepts the done function
 * @param {HTMLElement} element Accepts the HTMLElement
 * @returns {Kanban} Returns the kanban instance
 */
// eslint-disable-next-line max-len
export function createKanban(options: KanbanModel, dataSource: Record<string, any>[] | DataManager, done?: DoneFn, element?: HTMLElement): Kanban {
    element = element || createElement('div', { id: 'Kanban' });
    document.body.appendChild(element);
    // eslint-disable-next-line no-console
    const actionFailure: EmitType<ActionEventArgs> = (args: ActionEventArgs) => console.log(args);
    const defaultOptions: KanbanModel = {
        width: '600px',
        dataSource: dataSource instanceof DataManager ? dataSource : cloneDataSource(dataSource),
        keyField: 'Status',
        columns: [
            { headerText: 'Backlog', keyField: 'Open' },
            { headerText: 'In Progress', keyField: 'InProgress' },
            { headerText: 'Testing', keyField: 'Testing' },
            { headerText: 'Done', keyField: 'Close' }
        ],
        cardSettings: {
            contentField: 'Summary',
            headerField: 'Id'
        },
        actionFailure: actionFailure
    };
    if (done) {
        defaultOptions.dataBound = () => done();
    }
    options = extend({}, defaultOptions, options, true);
    const kanbanObj: Kanban = new Kanban(options);
    kanbanObj.appendTo(element);
    return kanbanObj;
}

/**
 * Destroy the Kanban component
 *
 * @param {Kanban} instance Accepts the kanban instance
 * @returns {void}
 */
export function destroy(instance: Kanban): void {
    if (instance) {
        instance.destroy();
        remove(document.getElementById(instance.element.id));
    }
}

/**
 * Triggers the mouse event
 *
 * @param {Element} node Accepts the element
 * @param {string} type Accepts the event type
 * @param {number} x Accepts the pageX
 * @param {number} y Accepts the pageY
 * @param {boolean} isShift Accepts the boolean
 * @param {boolean} isCtrl Accepts the boolean
 * @returns {void}
 */
export function triggerMouseEvent(node: Element, type: string, x: number = 0, y: number = 0, isShift?: boolean, isCtrl?: boolean): void {
    const mouseEvent: MouseEvent = new MouseEvent(type);
    mouseEvent.initMouseEvent(type, true, true, window, 0, 0, 0, x, y, isCtrl, false, isShift, false, 0, null);
    node.dispatchEvent(mouseEvent);
}

/**
 * Triggers the mouse event
 *
 * @param {HTMLElement} target Accepts the element
 * @param {number} scrollTop Accepts the pageX
 * @param {number} scrollLeft Accepts the pageY
 * @returns {void} returns null
 */
export function triggerScrollEvent(target: HTMLElement, scrollTop: number, scrollLeft?: number): void {
    target.scrollTop = scrollTop;
    if (scrollLeft) {
        target.scrollLeft = scrollLeft;
    }
    const e: any = document.createEvent('UIEvents');
    e.initUIEvent('scroll', true, true, window, 1);
    target.dispatchEvent(e);
}

/**
 * Disable the animation
 *
 * @param {Tooltip} tooltipObj Accepts the tooltip instance
 * @returns {void}
 */
export function disableTooltipAnimation(tooltipObj: Tooltip): void {
    tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
    tooltipObj.dataBind();
}

/**
 * Gets the DOM element
 *
 * @param {Kanban} kanbanObj Accepts the kanban instance
 * @param {string} className Accepts the string
 * @returns {NodeList} Returns the collection of elements
 */
export function getElement(kanbanObj: Kanban, className: string): NodeList {
    return kanbanObj.element.querySelectorAll(className);
}

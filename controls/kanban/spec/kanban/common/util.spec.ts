import { createElement, extend, EmitType, remove } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Tooltip } from '@syncfusion/ej2-popups';
import { Kanban, KanbanModel, ActionEventArgs } from '../../../src/kanban/base/index';

/**
 * kanban spec utils
 */
export function cloneDataSource(dataCollection: Object[]): Object[] {
    let dataSrc: Object[] = [];
    dataCollection.forEach((data: Object) => dataSrc.push(extend({}, data)));
    return dataSrc;
}

export function createKanban(options: KanbanModel, dataSource: Object[] | DataManager, done?: DoneFn, element?: HTMLElement): Kanban {
    element = element || createElement('div', { id: 'Kanban' });
    document.body.appendChild(element);
    // tslint:disable-next-line:no-console
    let actionFailure: EmitType<ActionEventArgs> = (args: ActionEventArgs) => console.log(args);
    let defaultOptions: KanbanModel = {
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
    let kanbanObj: Kanban = new Kanban(options);
    kanbanObj.appendTo(element);
    return kanbanObj;
}

export function destroy(instance: Kanban): void {
    if (instance) {
        instance.destroy();
        remove(document.getElementById(instance.element.id));
    }
}

export function triggerMouseEvent(node: Element, type: string, x: number = 0, y: number = 0, isShift?: boolean, isCtrl?: boolean): void {
    let mouseEvent: MouseEvent = new MouseEvent(type);
    mouseEvent.initMouseEvent(type, true, true, window, 0, 0, 0, x, y, isCtrl, false, isShift, false, 0, null);
    node.dispatchEvent(mouseEvent);
}

export function disableTooltipAnimation(tooltipObj: Tooltip): void {
    tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
    tooltipObj.dataBind();
}

export function getElement(kanbanObj: Kanban, className: string): NodeList {
    return kanbanObj.element.querySelectorAll(className);
}

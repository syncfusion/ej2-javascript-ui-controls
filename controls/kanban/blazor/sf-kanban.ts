import { BlazorDotnetObject, isNullOrUndefined, MouseEventArgs } from '@syncfusion/ej2-base';
import { SfKanban } from './kanban/kanban';
import { BlazorKanbanElement } from './kanban/interface';
import * as cls from './kanban/constant';
/** 
 * Blazor kanban scripts
 */

// tslint:disable
let Kanban: object = {
    initialize(element: BlazorKanbanElement, options:  { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        if (element) {
            new SfKanban(element, options, dotnetRef);
        }
    },
    isDevice(dotnetRef: BlazorDotnetObject): void {
		dotnetRef.invokeMethodAsync(cls.WINDOW_WIDTH, ((window.innerWidth * 70) / 100));
	},
    updateScrollPosition(element: BlazorKanbanElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateScrollPosition();
        }
    },
    propertyChanged(element: BlazorKanbanElement, changedProps: string[]): void {
        if (!isNullOrUndefined(element)) {
            (element as BlazorKanbanElement).blazor__instance.onPropertyChanged(changedProps);
        }
    },
    swimlaneProperties(element: BlazorKanbanElement, isDrag: boolean, keyField: string): void {
        if (!isNullOrUndefined(element)) {
            (element as BlazorKanbanElement).blazor__instance.onSwimlaneProperties(isDrag, keyField);
        }
    },
    cardClick(element: BlazorKanbanElement, card: Element, e: MouseEventArgs) {
       (element as BlazorKanbanElement).blazor__instance.onCardClick(card, e);
    },
    menuClick(element: BlazorKanbanElement): void {
        (element as BlazorKanbanElement).blazor__instance.onMenuClick();
    },
    listViewClick(element: BlazorKanbanElement): void {
        (element as BlazorKanbanElement).blazor__instance.onListViewClick();
    },
    destroy(element: BlazorKanbanElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    }
}

export default Kanban;
// tslint:disable
import { BlazorDotnetObject, extend, KeyboardEvents, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
let calendarBase: object = {
    initialize(element: HTMLElement, dotnetRef: BlazorDotnetObject, keyConfig: { [key: string]: string },
        value: Date, multiSelection: boolean): void {
        let defaultKeyConfig: { [key: string]: string } = {
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            altUpArrow: 'alt+uparrow',
            spacebar: 'space',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow'
        };
        defaultKeyConfig = extend(defaultKeyConfig, keyConfig) as { [key: string]: string };
        new KeyboardEvents(element,
            {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this, value, multiSelection, dotnetRef),
                keyConfigs: defaultKeyConfig
            });
    },
    keyActionHandle(value?: Date, multiSelection?: boolean, dotnetRef?: BlazorDotnetObject, e?: KeyboardEventArgs) {
        e.preventDefault();
        let element: Element = closest(e.target as Element, '.' + 'e-calendar');
        let tableBodyElement: Element = element.querySelector('tbody');
        if (!tableBodyElement) { return; }
        multiSelection = false;
        let focusedDate: Element = tableBodyElement.querySelector('tr td.e-focused-date');
        let selectedDate: Element;
        if (multiSelection) {
            selectedDate = (!focusedDate && +value === parseInt(focusedDate.getAttribute('id').split('_')[0], 10)) ? focusedDate
                : tableBodyElement.querySelector('tr td.e-selected');
        } else { selectedDate = tableBodyElement.querySelector('tr td.e-selected'); }
        (tableBodyElement as HTMLElement).focus();
        let targetEle: Element = e.target as Element;
        let args: object = {
            Action: e.action, Key: e.key, Events: e, SelectDate: selectedDate ? selectedDate.id : null,
            FocusedDate: focusedDate ? focusedDate.id : null,
            classList: selectedDate ? selectedDate.classList.toString() : focusedDate ? focusedDate.classList.toString() : 'e-cell',
            Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
            TargetClassList: targetEle.classList.toString()
        };
        dotnetRef.invokeMethodAsync('OnCalendarKeyboardEvent', args);
        if (targetEle.classList.contains('e-today')) {
            (targetEle as HTMLElement).blur();
            (tableBodyElement as HTMLElement).focus();
        }
    }
}
export default calendarBase;
window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.CalendarBase = (function () {
'use strict';

// tslint:disable
var calendarBase = {
    initialize: function (element, dotnetRef, keyConfig, value, multiSelection) {
        var defaultKeyConfig = {
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
        defaultKeyConfig = sf.base.extend(defaultKeyConfig, keyConfig);
        new sf.base.KeyboardEvents(element, {
            eventName: 'keydown',
            keyAction: this.keyActionHandle.bind(this, value, multiSelection, dotnetRef),
            keyConfigs: defaultKeyConfig
        });
    },
    keyActionHandle: function (value, multiSelection, dotnetRef, e) {
        e.preventDefault();
        var element = sf.base.closest(e.target, '.' + 'e-calendar');
        var tableBodyElement = element.querySelector('tbody');
        if (!tableBodyElement) {
            return;
        }
        multiSelection = false;
        var focusedDate = tableBodyElement.querySelector('tr td.e-focused-date');
        var selectedDate;
        if (multiSelection) {
            selectedDate = (!focusedDate && +value === parseInt(focusedDate.getAttribute('id').split('_')[0], 10)) ? focusedDate
                : tableBodyElement.querySelector('tr td.e-selected');
        }
        else {
            selectedDate = tableBodyElement.querySelector('tr td.e-selected');
        }
        tableBodyElement.focus();
        var targetEle = e.target;
        var args = {
            Action: e.action, Key: e.key, Events: e, SelectDate: selectedDate ? selectedDate.id : null,
            FocusedDate: focusedDate ? focusedDate.id : null,
            classList: selectedDate ? selectedDate.classList.toString() : focusedDate ? focusedDate.classList.toString() : 'e-cell',
            Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
            TargetClassList: targetEle.classList.toString()
        };
        dotnetRef.invokeMethodAsync('OnCalendarKeyboardEvent', args);
        if (targetEle.classList.contains('e-today')) {
            targetEle.blur();
            tableBodyElement.focus();
        }
    }
};

return calendarBase;

}());

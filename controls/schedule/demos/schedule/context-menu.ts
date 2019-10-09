import { closest, isNullOrUndefined, removeClass, remove, extend } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { ContextMenu, MenuItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, CellClickEventArgs } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';

/**
 * Schedule Context Menu sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

let data: Object[] = <Object[]>extend([], defaultData, null, true);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    eventSettings: { dataSource: data }
});
scheduleObj.appendTo('#schedule');

let selectedTarget: Element;
let menuObj: ContextMenu;
let menuItems: MenuItemModel[] = [
    {
        text: 'New Event',
        iconCss: 'e-icons new',
        id: 'Add'
    }, {
        text: 'New Recurring Event',
        iconCss: 'e-icons recurrence',
        id: 'AddRecurrence'
    }, {
        text: 'Today',
        iconCss: 'e-icons today',
        id: 'Today'
    }, {
        text: 'Edit Event',
        iconCss: 'e-icons edit',
        id: 'Save'
    }, {
        text: 'Edit Event',
        id: 'EditRecurrenceEvent',
        iconCss: 'e-icons edit',
        items: [{
            text: 'Edit Occurrence',
            id: 'EditOccurrence'
        }, {
            text: 'Edit Series',
            id: 'EditSeries'
        }]
    }, {
        text: 'Delete Event',
        iconCss: 'e-icons delete',
        id: 'Delete'
    }, {
        text: 'Delete Event',
        id: 'DeleteRecurrenceEvent',
        iconCss: 'e-icons delete',
        items: [{
            text: 'Delete Occurrence',
            id: 'DeleteOccurrence'
        }, {
            text: 'Delete Series',
            id: 'DeleteSeries'
        }]
    }
];
menuObj = new ContextMenu({
    target: '.e-schedule',
    items: menuItems,
    beforeOpen: onContextMenuBeforeOpen,
    select: onMenuItemSelect,
    cssClass: 'schedule-context-menu'
});
menuObj.appendTo('#ContextMenu');

function onContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
    let newEventElement: HTMLElement = document.querySelector('.e-new-event') as HTMLElement;
    if (newEventElement) {
        remove(newEventElement);
        removeClass([document.querySelector('.e-selected-cell')], 'e-selected-cell');
    }
    let targetElement: HTMLElement = <HTMLElement>args.event.target;
    if (closest(targetElement, '.e-contextmenu')) {
        return;
    }
    selectedTarget = closest(targetElement, '.e-appointment,.e-work-cells,' +
        '.e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells');
    if (isNullOrUndefined(selectedTarget)) {
        args.cancel = true;
        return;
    }
    if (selectedTarget.classList.contains('e-appointment')) {
        let eventObj: { [key: string]: Object } = <{ [key: string]: Object }>scheduleObj.getEventDetails(selectedTarget);
        if (eventObj.RecurrenceRule) {
            menuObj.showItems(['EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
            menuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'Save', 'Delete'], true);
        } else {
            menuObj.showItems(['Save', 'Delete'], true);
            menuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
        }
        return;
    }
    menuObj.hideItems(['Save', 'Delete', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
    menuObj.showItems(['Add', 'AddRecurrence', 'Today'], true);
}

function onMenuItemSelect(args: MenuEventArgs): void {
    let selectedMenuItem: string = args.item.id;
    let eventObj: { [key: string]: Object };
    if (selectedTarget && selectedTarget.classList.contains('e-appointment')) {
        eventObj = <{ [key: string]: Object }>scheduleObj.getEventDetails(selectedTarget);
    }
    switch (selectedMenuItem) {
        case 'Today':
            scheduleObj.selectedDate = new Date();
            break;
        case 'Add':
        case 'AddRecurrence':
            let selectedCells: Element[] = scheduleObj.getSelectedElements();
            let activeCellsData: CellClickEventArgs = scheduleObj.getCellDetails(selectedCells.length > 0 ? selectedCells : selectedTarget);
            if (selectedMenuItem === 'Add') {
                scheduleObj.openEditor(activeCellsData, 'Add');
            } else {
                scheduleObj.openEditor(activeCellsData, 'Add', null, 1);
            }
            break;
        case 'Save':
        case 'EditOccurrence':
        case 'EditSeries':
            if (selectedMenuItem === 'EditSeries') {
                eventObj = <{ [key: string]: Object }>new DataManager(scheduleObj.eventsData).executeLocal(new Query().
                    where(scheduleObj.eventFields.id, 'equal', eventObj[scheduleObj.eventFields.recurrenceID] as string | number))[0];
            }
            scheduleObj.openEditor(eventObj, selectedMenuItem);
            break;
        case 'Delete':
            scheduleObj.deleteEvent(eventObj);
            break;
        case 'DeleteOccurrence':
        case 'DeleteSeries':
            scheduleObj.deleteEvent(eventObj, selectedMenuItem);
            break;
    }
}

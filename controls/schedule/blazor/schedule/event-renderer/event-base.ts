import { addClass, removeClass, isNullOrUndefined, EventHandler, closest, extend } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import * as cls from '../base/css-constant';
import { EventClickArgs } from '../base/interface';
import * as util from '../base/util';

/**
 * EventBase for appointment rendering
 */
export class EventBase {
    public parent: SfSchedule;
    public slots: Object[] = [];
    public cssClass: string;
    public groupOrder: string[];
    private isDoubleTapped: boolean = false;

    constructor(parent: SfSchedule) {
        this.parent = parent;
    }

    public getSelectedEventElements(target: Element): Element[] {
        this.removeSelectedAppointmentClass();
        if (this.parent.selectedElements.length <= 0) {
            this.parent.selectedElements.push(target);
        } else {
            let isAlreadySelected: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
                element.getAttribute('data-guid') === target.getAttribute('data-guid'));
            if (isAlreadySelected.length <= 0) {
                let elementSelector: string = 'div[data-guid="' + target.getAttribute('data-guid') + '"]';
                let focusElements: Element[] = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
                for (let element of focusElements) {
                    this.parent.selectedElements.push(element);
                }
            } else {
                let selectedElements: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
                    element.getAttribute('data-guid') !== target.getAttribute('data-guid'));
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    }

    public getSelectedEvents(): EventClickArgs {
        let eventSelect: string[] = [];
        let elementSelect: HTMLElement[] = [];
        let selectAppointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
        selectAppointments.filter((element: HTMLElement) => {
            let isAlreadyAdded: Object[] = eventSelect.filter((guid: string) => {
                return guid === element.getAttribute('data-guid');
            });
            if (isAlreadyAdded.length === 0) {
                eventSelect.push(element.getAttribute('data-guid'));
            }
            elementSelect.push(element);
        });
        return {
            //event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0],
            guid: eventSelect
        } as EventClickArgs;
    }

    public removeSelectedAppointmentClass(): void {
        let selectedAppointments: Element[] = this.getSelectedAppointments();
        for (let appointment of selectedAppointments) {
            appointment.setAttribute('aria-selected', 'false');
        }
        removeClass(selectedAppointments, cls.APPOINTMENT_BORDER);
        if (this.parent.options.currentView === 'Agenda' || this.parent.options.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, cls.AGENDA_SELECTED_CELL);
        }
    }

    public addSelectedAppointments(cells: Element[]): void {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        if (this.parent.options.currentView !== 'MonthAgenda') {
            this.parent.removeSelectedClass();
        }
        addClass(cells, cls.APPOINTMENT_BORDER);
    }

    public getSelectedAppointments(): Element[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER + ',.' + cls.APPOINTMENT_CLASS + ':focus'));
    }

    public focusElement(): void {
        let scheduleEditorDialog: HTMLElement = document.querySelector('#' + this.parent.element.id + '_dialog_wrapper');
        if (scheduleEditorDialog && scheduleEditorDialog.classList.contains('e-popup-open')) {
            return;
        }
        let selectedCell: Element[] = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                let target: HTMLTableCellElement = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]) as HTMLTableCellElement;
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
            }
            return;
        }
        let selectedAppointments: Element[] = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            (selectedAppointments[selectedAppointments.length - 1] as HTMLElement).focus();
            return;
        }
    }

    public splitEvent(event: { [key: string]: Object }, dateRender: Date[]): { [key: string]: Object }[] {
        let start: number = util.resetTime(new Date(event.startTime + '')).getTime();
        let end: number = util.resetTime(new Date(event.endTime + '')).getTime();
        if (util.getDateInMs(event.endTime as Date) <= 0) {
            let temp: number = util.addDays(util.resetTime(new Date(event.endTime + '')), -1).getTime();
            end = start > temp ? start : temp;
        }
        let orgStart: number = start;
        let orgEnd: number = end;
        let ranges: { [key: string]: Object }[] = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            let cStart: number = start;
            for (let level: number = 0; level < this.slots.length; level++) {
                let slot: number[] = <[number]>this.slots[level];
                if (this.parent.options.currentView === 'WorkWeek' || this.parent.options.currentView === 'TimelineWorkWeek'
                    || this.parent.activeViewOptions.group.byDate || this.parent.activeViewOptions.showWeekend) {
                    let slotDates: Date[] = [];
                    for (let s of slot) {
                        slotDates.push(new Date(s));
                    }
                    let renderedDates: Date[] = this.getRenderedDates(slotDates);
                    if (!isNullOrUndefined(renderedDates) && renderedDates.length > 0) {
                        slot = [];
                        for (let date of renderedDates) {
                            slot.push(date.getTime());
                        }
                    }
                }
                let firstSlot: number = <number>slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.options.currentView !== 'WorkWeek' && this.parent.options.currentView !== 'TimelineWorkWeek') {
                    let startIndex: number = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        let endIndex: number = slot.indexOf(end);
                        let hasBreak: boolean = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        let count: number = ((endIndex - startIndex) + 1);
                        let isLeft: boolean = (slot[startIndex] !== orgStart);
                        let isRight: boolean = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                } else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        let availSlot: number[] = [];
                        for (let i: number = 0; i < slot.length; i++) {
                            if (this.dateInRange(<number>slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                let isLeft: boolean = (availSlot[0] !== orgStart);
                                let isRight: boolean = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(
                                    event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            } else {
                                for (let slot of availSlot) {
                                    ranges.push(this.cloneEventObject(event, slot, slot, 1, (slot !== orgStart), (slot !== orgEnd)));
                                }
                            }
                        }
                    }
                }
            }
        } else {
            ranges.push(this.cloneEventObject(event, start, end, 1, false, false));
        }
        return ranges;
    }
    private dateInRange(date: number, start: number, end: number): boolean {
        return start <= date && date <= end;
    }
    public cloneEventObject(event: { [key: string]: Object }, start: number, end: number, count: number, isLeft: boolean, isRight: boolean)
        : { [key: string]: Object } {
        let e: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
        let data: { [key: string]: Object } = { count: count, isLeft: isLeft, isRight: isRight };
        data.startTime = event.startTime;
        data.endTime = event.endTime;
        e.data = data;
        e.startTime = new Date(start);
        e.endTime = new Date(end);
        return e;
    }

    public getRenderedDates(dateRender: Date[]): Date[] {
        let firstDate: number = 0;
        let lastDate: number = dateRender.length;
        let filteredDates: Date[];
        if ((dateRender[0] < this.parent.options.minDate) && dateRender[dateRender.length - 1] > this.parent.options.maxDate) {
            for (let i: number = 0; i < dateRender.length; i++) {
                if (dateRender[i].getTime() === this.parent.options.minDate.getTime()) {
                    firstDate = i;
                }
                if (dateRender[i].getTime() === this.parent.options.maxDate.getTime()) {
                    lastDate = i;
                }
            }
            filteredDates = dateRender.filter((date: Date) => {
                return ((date >= dateRender[firstDate]) && (date <= dateRender[lastDate]));
            });
        }
        return filteredDates;
    }

    public isValidEvent(eventObj: { [key: string]: Object }, start: Date, end: Date, schedule: { [key: string]: Date }): boolean {
        let isHourRange: boolean = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        let isSameRange: boolean = schedule.startHour.getTime() <= start.getTime() &&
            (<Date>eventObj.startTime).getTime() >= schedule.startHour.getTime() &&
            (<Date>eventObj.endTime).getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    }

    public getStEdHours(date: Date, startHour: Date, endHour: Date): { [key: string]: Date } {
        let date1: Date = new Date(date.getTime());
        date1.setHours(startHour.getHours());
        date1.setMinutes(startHour.getMinutes());
        date1.setSeconds(startHour.getSeconds());
        let date2: Date = new Date(date.getTime());
        if (endHour.getHours() === 0) {
            date2.setDate(date2.getDate() + 1);
        } else {
            date2.setHours(endHour.getHours());
            date2.setMinutes(endHour.getMinutes());
            date2.setSeconds(endHour.getSeconds());
        }
        return { startHour: date1, endHour: date2 };
    }

    // public selectWorkCellByTime(eventsData: Object[]): Element {
    //     let target: Element;
    //     if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
    //         return target;
    //     }
    //     if (eventsData.length > 0) {
    //         let selectedObject: { [key: string]: object } = eventsData[eventsData.length - 1] as { [key: string]: object };
    //         let eventStartTime: Date = <Date>selectedObject[this.parent.eventFields.startTime];
    //         let nearestTime: number = new Date(+eventStartTime).setMinutes(0, 0, 0);
    //         let isAllDay: boolean = this.isAllDayAppointment(selectedObject);
    //         if (this.parent.currentView === 'Month' || isAllDay) {
    //             nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
    //         }
    //         let targetArea: Element;
    //         if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
    //             targetArea = this.parent.getAllDayRow();
    //         } else {
    //             targetArea = this.parent.getContentTable();
    //         }
    //         let queryString: string = '[data-date="' + this.parent.getMsFromDate(new Date(nearestTime)) + '"]';
    //         if (this.parent.activeViewOptions.group.resources.length > 0) {
    //             queryString += '[data-group-index="' + this.getGroupIndexFromEvent(selectedObject) + '"]';
    //         }
    //         target = targetArea.querySelector(queryString) as Element;
    //         if (target) {
    //             this.parent.activeCellsData = this.parent.getCellDetails(target);
    //             if (this.parent.keyboardInteractionModule) {
    //                 this.parent.keyboardInteractionModule.selectCells(false, target as HTMLTableCellElement);
    //             }
    //             return target;
    //         }
    //     }
    //     return target;
    // }

    // public getGroupIndexFromEvent(eventData: { [key: string]: Object }): number {
    //     let levelName: string = this.parent.resourceCollection.slice(-1)[0].name;
    //     let levelIndex: number = this.parent.resourceCollection.length - 1;
    //     let idField: string = this.parent.resourceCollection.slice(-1)[0].field;
    //     let id: number = ((eventData[idField] instanceof Array) ?
    //         (eventData[idField] as { [key: string]: Object })[0] : eventData[idField]) as number;
    //     let resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel, index: number) => {
    //         if (e.name === levelName) {
    //             levelIndex = index;
    //             return e;
    //         }
    //         return null;
    //     })[0];
    //     if (levelIndex > 0) {
    //         let parentField: string = this.parent.resourceCollection[levelIndex - 1].field;
    //         return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource, eventData, parentField);
    //     } else {
    //         return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource);
    //     }
    // }


    public appointmentBorderRemove(event: Event): void {
        let element: HTMLElement = event.target as HTMLElement;
        if (closest(element as Element, '.' + cls.APPOINTMENT_CLASS)) {
            if (this.parent.options.currentView !== 'MonthAgenda') {
                this.parent.removeSelectedClass();
            }
        } else if (!closest(element as Element, '.' + cls.POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    }

    public applyResourceColor(ele: HTMLElement): void {
        let color: string = this.getResourceColor(ele);
        if (!isNullOrUndefined(color)) {
            ele.style.backgroundColor = color;
        }
    }

    public getResourceColor(ele: HTMLElement): string {
        return ele.getAttribute('data-color');
    }

    public wireAppointmentEvents(element: HTMLElement, isPreventCrud: Boolean = false): void {
        let isReadOnly: boolean = element.getAttribute('aria-readonly') === 'true';
        EventHandler.clearEvents(element);
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'touchstart', this.eventTouchClick, this);
        }
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
            EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
        }
        if (!this.parent.activeViewOptions.readonly && !isReadOnly && !isPreventCrud) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element);
            }
        }
    }

    private eventTouchClick(e: Event): void {
        setTimeout(() => this.isDoubleTapped = false, 250);
        e.preventDefault();
        if (this.isDoubleTapped) {
            this.eventDoubleClick(e);
        } else if (!this.isDoubleTapped) {
            this.isDoubleTapped = true;
            this.eventClick(e as Event & MouseEvent);
        }
    }

    private eventClick(eventData: Event & MouseEvent): void {
        let target: HTMLElement = eventData.target as HTMLElement;
        if (target.classList.contains(cls.DRAG_CLONE_CLASS) || target.classList.contains(cls.RESIZE_CLONE_CLASS) ||
            target.classList.contains(cls.BLOCK_APPOINTMENT_CLASS)) {
            return;
        }
        if (this.parent.isAdaptive && this.parent.isTapHold) {
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
            let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS) as Element;
            let selectedElements: Element[] = this.getSelectedEventElements(target);
            if (selectedElements.length > 0) {
                let titleContent: string = (selectedElements.length === 1) ?
                    selectedElements[0].querySelector('.' + cls.SUBJECT_CLASS).innerHTML :
                    '(' + selectedElements.length + ')' + '&nbsp;' + 'selected item(s)';
                this.parent.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS).innerHTML = titleContent;
                if (selectedElements.length > 1) {
                    addClass([this.parent.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
                } else {
                    removeClass([this.parent.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
                }
            } else {
                this.parent.selectedElements = [];
                this.parent.onQuickPopupClose();
            }
        }
        if (eventData.ctrlKey && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            //this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
            let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS) as Element;
            this.getSelectedEventElements(target);
            let guid: string = this.activeEventData(eventData, false);
            this.parent.dotNetRef.invokeMethodAsync('TriggerEventClick', guid, true);
        } else {
            this.removeSelectedAppointmentClass();
            let guid: string = this.activeEventData(eventData, true);
            this.parent.dotNetRef.invokeMethodAsync('TriggerEventClick', guid, false);
        }
    }

    private eventDoubleClick(e: Event): void {
        //this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        if ((this.parent.activeEventData.element as HTMLElement).classList.contains(cls.INLINE_APPOINTMENT_CLASS) ||
            (this.parent.activeEventData.element as HTMLElement).querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
            return;
        }
        let guid: string = this.activeEventData(e, false);
        this.parent.dotNetRef.invokeMethodAsync('TriggerEventDoubleClick', guid);
    }

    private activeEventData(eventData: Event, isMultiple: boolean): string {
        let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS);
        let guid: string = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
            (target as HTMLElement).focus();
        }
        // let eventObject: { [key: string]: Object } = this.getEventByGuid(guid) as { [key: string]: Object };
        // if (eventObject && eventObject.isSpanned) {
        //     eventObject = this.parent.eventsData.filter((obj: { [key: string]: Object }) =>
        //         obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0] as { [key: string]: Object };
        // }
        this.parent.activeEventData = { element: target, guid: [guid] } as EventClickArgs;
        return guid;
    }
}
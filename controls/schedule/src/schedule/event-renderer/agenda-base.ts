/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, addClass, createElement, append, EventHandler, extend, remove, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { ListBase } from '@syncfusion/ej2-lists';
import { EventFieldsMapping, EventRenderedArgs, TdData, CellTemplateArgs } from '../base/interface';
import { ResourcesModel } from '../models/resources-model';
import { ViewBase } from '../renderer/view-base';
import { Schedule } from '../base/schedule';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';

/**
 * AgendaBase for event rendering
 */
interface AgendaSlotData extends TdData {
    eventData?: Record<string, any>[];
}

export class AgendaBase extends ViewBase {

    constructor(parent: Schedule) {
        super(parent);
    }

    // eslint-disable-next-line max-len
    public createAgendaContentElement(type: string, listData: Record<string, any>[], aTd: Element, groupOrder?: string[], groupIndex?: number): Element {
        let listElement: HTMLElement;
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        if (type === 'noEvents') {
            const noEvents: Record<string, any>[] = [{ 'subject': this.parent.localeObj.getConstant('noEvents') }];
            listElement = ListBase.createList(this.parent.createElement, noEvents, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass,
                template: initializeCSPTemplate(() => `<div class="${cls.AGENDA_NO_EVENT_CLASS}">${this.parent.localeObj.getConstant('noEvents')}</div>`)
            });
            if (listElement.querySelector('.e-agenda-item').children.length === 0) {
                listElement.firstElementChild.appendChild(createElement('div', { className: cls.AGENDA_NO_EVENT_CLASS, innerHTML: this.parent.localeObj.getConstant('noEvents') }));
            }
        } else {
            listElement = ListBase.createList(this.parent.createElement, listData, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass
            });
            const listElements: HTMLElement[] = [].slice.call(listElement.children);
            listElements.forEach((element: HTMLElement, li: number) => {
                const appWrapper: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_CLASS, attrs: {
                        'data-id': 'Appointment_' + listData[parseInt(li.toString(), 10)][`${this.parent.eventFields.id}`],
                        'data-guid': listData[parseInt(li.toString(), 10)].Guid as string,
                        'role': 'button',
                        'tabindex': '0',
                        'aria-disabled': this.parent.eventBase.getReadonlyAttribute(listData[parseInt(li.toString(), 10)]),
                        'aria-label': this.parent.getAnnouncementString(listData[parseInt(li.toString(), 10)])
                    }
                });
                if (!isNullOrUndefined(groupIndex)) {
                    appWrapper.setAttribute('data-group-index', groupIndex.toString());
                }
                this.parent.eventBase.applyResourceColor(appWrapper, listData[parseInt(li.toString(), 10)], 'borderColor', groupOrder);
                let templateEle: HTMLElement[];
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    addClass([appWrapper], cls.EVENT_TEMPLATE);
                    const scheduleId: string = this.parent.element.id + '_';
                    const viewName: string = this.parent.activeViewOptions.eventTemplateName;
                    const templateId: string = scheduleId + viewName + 'eventTemplate';
                    templateEle =
                        this.parent.getAppointmentTemplate()(listData[parseInt(li.toString(), 10)], this.parent,
                                                             'eventTemplate', templateId, false, undefined, undefined, this.parent.root);
                    if (!isNullOrUndefined(listData[parseInt(li.toString(), 10)][fieldMapping.recurrenceRule])) {
                        const iconClass: string =
                            (listData[parseInt(li.toString(), 10)][fieldMapping.id] ===
                                listData[parseInt(li.toString(), 10)][fieldMapping.recurrenceID]) ?
                                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
                        appWrapper.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
                    }
                } else {
                    templateEle = this.createAppointment(listData[parseInt(li.toString(), 10)]);
                }
                append([].slice.call(templateEle), appWrapper);
                util.removeChildren(element);
                element.appendChild(appWrapper);
                const args: EventRenderedArgs = {
                    data: extend({}, listData[parseInt(li.toString(), 10)], null, true) as Record<string, any>,
                    element: element as HTMLElement, cancel: false
                };
                this.parent.trigger(event.eventRendered, args, (eventArgs: EventRenderedArgs) => {
                    if (eventArgs.cancel) {
                        remove(element);
                    }
                });
            });
        }
        aTd.appendChild(listElement);
        if ((this.parent.currentView === 'MonthAgenda' && this.parent.activeViewOptions.group.resources.length > 0)
            || this.parent.currentView === 'Agenda') {
            addClass([aTd], cls.AGENDA_DAY_BORDER_CLASS);
        }
        this.parent.renderTemplates();
        return aTd;
    }

    public createAppointment(event: Record<string, any>): HTMLElement[] {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let eventSubject: string = (event[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default
            || this.parent.localeObj.getConstant('addTitle')) as string;
        const eventLocation: string = (event[fieldMapping.location] || this.parent.eventSettings.fields.location.default) as string;
        const appSubjectWrap: HTMLElement = createElement('div', { className: cls.SUBJECT_WRAP });
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            eventSubject += ',';
        }
        const appSubjectText: HTMLElement = createElement('div', { className: cls.SUBJECT_CLASS });
        this.parent.sanitize(eventSubject, appSubjectText);
        appSubjectWrap.appendChild(appSubjectText);
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            const appLocation: HTMLElement = createElement('div', { className: cls.LOCATION_CLASS });
            this.parent.sanitize(eventLocation, appLocation);
            appSubjectWrap.appendChild(appLocation);
        }
        if (!isNullOrUndefined(event[fieldMapping.recurrenceRule])) {
            const iconClass: string = (event[fieldMapping.id] === event[fieldMapping.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appSubjectWrap.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
        }
        const strDate: Date = event[fieldMapping.startTime] as Date;
        const endDate: Date = event[fieldMapping.endTime] as Date;
        const isAllDay: boolean = event[fieldMapping.isAllDay] as boolean;
        let allDayStr: string = this.parent.localeObj.getConstant('allDay');
        const timeStr: string = this.parent.getTimeString(strDate) + ' - ' + this.parent.getTimeString(endDate);
        if (!isNullOrUndefined(event.data)) {
            const milliSeconds: number = (endDate.getTimezoneOffset() !== strDate.getTimezoneOffset()) ?
                (endDate.getTime() - strDate.getTime() + 3600000) : (endDate.getTime() - strDate.getTime());
            const eventString: string = (milliSeconds / util.MS_PER_DAY) >= 1 ? allDayStr : timeStr;
            allDayStr = eventString + ' (' + this.parent.localeObj.getConstant('day') + ' '
                + (event.data as Record<string, any>).index + '/' + (event.data as Record<string, any>).count + ')';
        }
        const displayStr: string = (!isNullOrUndefined(event.data) || isAllDay) ? allDayStr : timeStr;
        const appDateTime: HTMLElement = createElement('div', { className: cls.DATE_TIME_CLASS, innerHTML: displayStr });
        return [appSubjectWrap, appDateTime];
    }

    public processAgendaEvents(events: Record<string, any>[]): Record<string, any>[] {
        let eventsProcessed: Record<string, any>[] = [];
        if (isNullOrUndefined(events)) {
            return eventsProcessed;
        }
        for (const event of events) {
            const spanned: Record<string, any>[] = this.parent.eventBase.splitEventByDay(event);
            eventsProcessed = eventsProcessed.concat(spanned.length > 1 ? spanned : event);
        }
        return eventsProcessed;
    }

    public wireEventActions(): void {
        const eventElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        for (const element of eventElement) {
            this.parent.eventBase.wireAppointmentEvents(element, this.parent.getEventDetails(element), true);
        }
        const dateHeaderElement: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-m-date'));
        for (const element of dateHeaderElement) {
            EventHandler.add(element, 'click', this.parent.agendaModule.dayNavigationClick, this);
        }
    }

    public calculateResourceTableElement(tBody: Element, noOfDays: number, agendaDate: Date, agendaEnd: Date = null): void {
        if (isNullOrUndefined(this.parent.resourceBase.lastResourceLevel)) {
            const level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
            this.parent.resourceBase.generateResourceLevels(level);
        }
        let agendaLastDate: Date = util.addDays(new Date(agendaDate.getTime()), noOfDays);
        const days: number = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
        const resColl: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        const resData: TdData[] = this.parent.resourceBase.lastResourceLevel;
        const agendaStart: Date = agendaDate;
        let initialDate: Date = agendaDate;
        const showWeekend: boolean = this.parent.activeViewOptions.showWeekend;
        for (let i: number = 0; i < days; i++) {
            const lastLevelInfo: TdData[][] = []; const tempLastLevelInfo: TdData[] = []; let tempIndex: number = 0;
            let eventObj: AgendaSlotData; let dateObj: TdData;
            let firstDate: Date = util.addDays(initialDate, i);
            if (this.parent.currentView === 'Agenda' && this.parent.activeViewOptions.group.byDate &&
                this.parent.activeViewOptions.allowVirtualScrolling && !showWeekend && !this.isWorkDay(firstDate)) {
                do {
                    firstDate = util.addDays(firstDate, 1);
                    if (firstDate >= agendaEnd) { break; }
                } while (!this.isWorkDay(firstDate) ||
                    this.parent.eventBase.filterEvents(firstDate, util.addDays(firstDate, 1)).length < 1);
                if (firstDate >= agendaEnd) { break; }
                initialDate = util.addDays(firstDate, -i);
                agendaLastDate = util.addDays(firstDate, 1);
            }
            const finalDate: Date = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda')
                ? util.addDays(firstDate, 1) : agendaLastDate;
            const agendaCollection: Record<string, any>[] = this.parent.eventBase.filterEvents(firstDate, finalDate);
            if (agendaCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                for (let res: number = 0; res < resData.length; res++) {
                    noOfDays = (!this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
                    const data: Record<string, any>[] = [];
                    agendaDate = firstDate;
                    // eslint-disable-next-line max-len
                    const resDataCollection: Record<string, any>[] = this.parent.eventBase.filterEvents(agendaDate, agendaLastDate, agendaCollection, resData[parseInt(res.toString(), 10)]);
                    if (resDataCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                        for (let r: number = 0; r < noOfDays; r++) {
                            // eslint-disable-next-line max-len
                            const resDayCollection: Record<string, any>[] = this.parent.eventBase.filterEvents(agendaDate, util.addDays(agendaDate, 1), resDataCollection, undefined);
                            if (((showWeekend || !showWeekend && (this.parent.group.byDate ? this.isWorkDay(agendaDate) :
                                this.isWorkDay(agendaDate, resData[parseInt(res.toString(), 10)].workDays)))
                                && (resDayCollection.length > 0 || !this.parent.hideEmptyAgendaDays)) ||
                                this.parent.currentView === 'MonthAgenda') {
                                data.push(resDayCollection[0]);
                                eventObj = {
                                    rowSpan: 1, type: 'eventColumn', resource: resColl[resColl.length - 1],
                                    groupIndex: resData[parseInt(res.toString(), 10)].groupIndex,
                                    groupOrder: resData[parseInt(res.toString(), 10)].groupOrder,
                                    resourceData: resData[parseInt(res.toString(), 10)].resourceData,
                                    eventData: resDayCollection, date: agendaDate
                                };
                                dateObj = {
                                    rowSpan: 1, type: 'dateColumn', resource: resColl[parseInt((resColl.length - 1).toString(), 10)],
                                    groupOrder: resData[parseInt(res.toString(), 10)].groupOrder,
                                    resourceData: resData[parseInt(res.toString(), 10)].resourceData,
                                    date: agendaDate,
                                    groupIndex: resData[parseInt(res.toString(), 10)].groupIndex
                                };
                                if (!lastLevelInfo[parseInt(tempIndex.toString(), 10)]) {
                                    lastLevelInfo[parseInt(tempIndex.toString(), 10)] = [];
                                }
                                lastLevelInfo[parseInt(tempIndex.toString(), 10)].push(eventObj);
                                lastLevelInfo[parseInt(tempIndex.toString(), 10)].push(dateObj);
                                tempIndex++;
                            }
                            agendaDate = util.addDays(agendaDate, 1);
                            if (agendaDate.getTime() >= agendaLastDate.getTime() || this.parent.activeViewOptions.group.byDate
                                || this.parent.currentView === 'MonthAgenda') {
                                if (data.length > 0) {
                                    lastLevelInfo[lastLevelInfo.length - 1][1].cssClass = cls.AGENDA_DAY_BORDER_CLASS;
                                    const tempObj: TdData = {
                                        rowSpan: data.length, type: 'resourceColumn', resource: resColl[parseInt((resColl.length - 1).toString(), 10)],
                                        groupOrder: resData[parseInt(res.toString(), 10)].groupOrder.slice(0, -1),
                                        resourceData: resData[parseInt(res.toString(), 10)].resourceData,
                                        groupIndex: (lastLevelInfo.length - data.length), className: [cls.RESOURCE_NAME],
                                        date: agendaDate
                                    };
                                    lastLevelInfo[parseInt((lastLevelInfo.length - data.length).toString(), 10)].push(tempObj);
                                    tempLastLevelInfo.push(<TdData>extend({}, tempObj, null, true));
                                }
                                break;
                            }
                        }
                    }
                }
                const topResources: ResourcesModel[] = resColl.slice(0, -1); let tempGroupedData: TdData[] = [];
                let totalRowSpan: number = 0;
                for (let y: number = 0; y < topResources.length; y++) {
                    const data: Record<string, any>[] = topResources[topResources.length - (y + 1)].dataSource as Record<string, any>[];
                    for (let x: number = 0; x < data.length; x++) {
                        let z: number = 0;
                        for (let u: number = 0; u < tempLastLevelInfo.length; u++) {
                            // eslint-disable-next-line max-len
                            if (tempLastLevelInfo[parseInt(u.toString(), 10)].groupOrder[topResources.length - (y + 1)] === data[parseInt(x.toString(), 10)][topResources[topResources.length - (y + 1)].idField]) {
                                totalRowSpan = totalRowSpan + tempLastLevelInfo[parseInt(u.toString(), 10)].rowSpan;
                                tempGroupedData.push(<TdData>extend({}, tempLastLevelInfo[parseInt(u.toString(), 10)], null, true));
                            }
                            if (++z === tempLastLevelInfo.length && tempGroupedData.length > 0) {
                                tempGroupedData[0].rowSpan = totalRowSpan;
                                tempGroupedData[0].type = 'parentColumnLevel_' + (y + 1);
                                tempGroupedData[0].resource = topResources[topResources.length - (y + 1)];
                                tempGroupedData[0].resourceData = data[parseInt(x.toString(), 10)];
                                tempGroupedData[0].date = agendaDate;
                                lastLevelInfo[tempGroupedData[0].groupIndex].push(tempGroupedData[0]);
                                tempGroupedData = [];
                                totalRowSpan = 0;
                            }
                        }
                    }
                }
                this.createResourceTableRow(lastLevelInfo, tBody);
            }
        }
        const totalCollection: Record<string, any>[] = this.parent.eventBase.filterEvents(agendaStart, agendaLastDate);
        if (totalCollection.length === 0 && !this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            this.renderEmptyContent(tBody, agendaStart);
        }
    }

    private createResourceTableRow(tContent: TdData[][], tBody: Element): void {
        const tr: Element = createElement('tr');
        let ntr: Element;
        const td: Element = createElement('td');
        let tempData: AgendaSlotData;
        let rowSpan: number = 0;
        let level: string;
        if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
            let tContentCollection: TdData[] = [];
            const parentCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection.slice(0, -1);
            for (let w: number = 0; w < tContent.length; w++) {
                tContentCollection = tContentCollection.concat(tContent[parseInt(w.toString(), 10)]);
            }
            level = (parentCollection.length > 0) ? 'parentColumnLevel_' + parentCollection.length : 'resourceColumn';
            const rowSpanCollection: TdData[] = tContentCollection.filter((data: TdData) => data.type === level);
            for (let x: number = 0; x < rowSpanCollection.length; x++) {
                rowSpan = rowSpan + rowSpanCollection[parseInt(x.toString(), 10)].rowSpan;
            }
        }
        for (let row: number = 0; row < tContent.length; row++) {
            ntr = tr.cloneNode() as Element;
            for (let col: number = tContent[parseInt(row.toString(), 10)].length - 1; col >= 0; col--) {
                const data: AgendaSlotData = tContent[parseInt(row.toString(), 10)][parseInt(col.toString(), 10)];
                let ntd: Element = td.cloneNode() as Element;
                if (data.type === 'dateColumn') {
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        tempData = tContent[parseInt(row.toString(), 10)][parseInt(col.toString(), 10)];
                        continue;
                    }
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    ntd.appendChild(this.createDateHeaderElement(data.date, data.groupIndex));
                    const className: string[] = [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DATE_CLASS];
                    if (data.cssClass) {
                        className.push(data.cssClass);
                    }
                    addClass([ntd], className);
                    if (this.isCurrentDate(new Date( data.date.getTime()))) { addClass(ntd.childNodes, cls.AGENDA_CURRENT_DAY_CLASS); }
                    ntr.appendChild(ntd);
                } else if (data.type === 'eventColumn') {
                    const elementType: string = (data.eventData.length === 0) ? 'noEvents' : 'data';
                    for (let i: number = 0; i < ntr.childNodes.length; i++) {
                        const currentElement: HTMLElement = ntr.childNodes.item(i) as HTMLElement;
                        const renderCellElementType: string = currentElement.classList.contains('e-resource-column') ?
                            event.resourceHeader : event.dateHeader;
                        this.parent.trigger(event.renderCell, {
                            elementType: renderCellElementType, element: currentElement, date: data.date, groupIndex: data.groupIndex
                        });
                    }
                    ntd = this.createAgendaContentElement(elementType, data.eventData, ntd, data.groupOrder, data.groupIndex);
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        addClass([ntd], [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DAY_PADDING_CLASS]);
                    }
                    ntr.appendChild(ntd);
                    const renderCellType: string = (data.eventData.length === 0) ? event.noEvents : event.agendaCells;
                    this.parent.trigger(event.renderCell, {
                        elementType: renderCellType, element: ntd, date: data.date, groupIndex: data.groupIndex
                    });
                } else {
                    ntd.setAttribute('rowspan', data.rowSpan.toString());
                    addClass([ntd], cls.AGENDA_RESOURCE_CLASS);
                    this.setResourceHeaderContent(ntd, data, data.className[0]);
                    ntr.appendChild(ntd);
                }
            }
            if (this.parent.activeViewOptions.group.byDate && row === 0 && this.parent.currentView !== 'MonthAgenda') {
                const ntd: Element = td.cloneNode() as Element;
                ntd.setAttribute('data-date', tempData.date.getTime().toString());
                ntd.setAttribute('rowspan', rowSpan.toString());
                ntd.appendChild(this.createDateHeaderElement(tempData.date));
                addClass([ntd], [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DATE_CLASS, cls.DATE_BORDER_CLASS]);
                const daysCount: number = util.getDaysCount(this.parent.selectedDate.getTime(), tempData.date.getTime());
                ntr.setAttribute('data-row-index', daysCount.toString());
                if (this.parent.element.querySelector(`.e-agenda-view tr[data-row-index="${ daysCount }"]`)) { break; }
                ntr.insertBefore(ntd, ntr.childNodes[0]);
            }
            tBody.appendChild(ntr);
        }
    }

    public createDateHeaderElement(date: Date, groupIndex?: number): Element {
        let dateHeader: Element;
        if (this.parent.activeViewOptions.dateHeaderTemplate) {
            dateHeader = createElement('div', { className: cls.AGENDA_HEADER_CLASS });
            const args: CellTemplateArgs = { date: date, type: 'dateHeader', groupIndex: groupIndex };
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.dateHeaderTemplateName;
            const templateId: string = scheduleId + viewName + 'dateHeaderTemplate';
            const dateTemplate: HTMLElement[] =
                [].slice.call(this.parent.getDateHeaderTemplate()(args, this.parent, 'dateHeaderTemplate', templateId,
                                                                  false, undefined, undefined, this.parent.root));
            append(dateTemplate, dateHeader);
        } else {
            dateHeader = this.getMobileDateElement(date, cls.AGENDA_HEADER_CLASS);
        }
        return dateHeader;
    }

    public renderEmptyContent(tBody: Element, agendaDate: Date, hasNoEvents?: boolean): void {
        const eTr: Element = this.createTableRowElement(agendaDate, 'noEvents');
        const eTd: Element = eTr.children[0];
        const noEvents: Element = createElement('div', {
            className: cls.AGENDA_EMPTY_EVENT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noEvents')
        });
        eTd.appendChild(noEvents);
        tBody.appendChild(eTr);
        if (hasNoEvents) {
            this.parent.trigger(event.renderCell, { elementType: event.noEvents, element: eTd, date: agendaDate });
        }
    }

    public createTableRowElement(date: Date, type: string): Element {
        const daysCount: number = util.getDaysCount(this.parent.selectedDate.getTime(), date.getTime());
        const tr: Element = createElement('tr', { attrs: { 'data-row-index': daysCount.toString() } });
        const td: Element = createElement('td', {
            attrs: {
                'class': (type === 'monthHeader') ? cls.MONTH_HEADER_CLASS : cls.AGENDA_CELLS_CLASS,
                'aria-selected': 'false',
                'data-column-index': daysCount.toString(),
                'data-date': date.getTime().toString()
            }
        });
        const dTd: Element = td.cloneNode() as Element;
        const aTd: Element = td.cloneNode() as Element;
        tr.appendChild(dTd);
        if (type !== 'noEvents') {
            tr.appendChild(aTd);
        }
        return tr;
    }

    public destroy(): void {
        super.destroy();
    }

}

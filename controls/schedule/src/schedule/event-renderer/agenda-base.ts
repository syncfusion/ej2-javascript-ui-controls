import { isNullOrUndefined, addClass, createElement, append, EventHandler, extend, remove } from '@syncfusion/ej2-base';
import { ListBase } from '@syncfusion/ej2-lists';
import { EventFieldsMapping, EventRenderedArgs, TdData, CellTemplateArgs } from '../base/interface';
import { DataManager, Query } from '@syncfusion/ej2-data';
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
    eventData?: { [key: string]: Object }[];
}

export class AgendaBase {
    public parent: Schedule;
    public viewBase: ViewBase;
    /**
     * Constructor for AgendaBase
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.viewBase = new ViewBase(parent);
    }

    public createAgendaContentElement(
        type: string, listData: { [key: string]: Object }[], aTd: Element, groupOrder?: string[], groupIndex?: number): Element {
        let listElement: HTMLElement;
        if (type === 'noEvents') {
            let noEvents: { [key: string]: Object }[] = [{ 'subject': this.parent.localeObj.getConstant('noEvents') }];
            listElement = ListBase.createList(this.parent.createElement, noEvents, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass,
                template: '<div class=' + cls.AGENDA_NO_EVENT_CLASS + '>${subject}</div>'
            });
        } else {
            listElement = ListBase.createList(this.parent.createElement, listData, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass
            });
            for (let li: number = 0, length: number = listData.length; li < length; li++) {
                let appWrapper: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_CLASS, attrs: {
                        'data-id': 'Appointment_' + listData[li][this.parent.eventFields.id],
                        'data-guid': listData[li].Guid as string,
                        'role': 'button',
                        'tabindex': '0',
                        'aria-readonly': 'false',
                        'aria-selected': 'false',
                        'aria-grabbed': 'true',
                        'aria-label': (listData[li][this.parent.eventFields.subject]
                            || this.parent.eventSettings.fields.subject.default) as string
                    }
                });
                if (!isNullOrUndefined(groupIndex)) {
                    appWrapper.setAttribute('data-group-index', groupIndex.toString());
                }
                this.parent.eventBase.applyResourceColor(appWrapper, listData[li], 'borderColor', groupOrder);
                let templateEle: HTMLElement[];
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    templateEle = this.parent.getAppointmentTemplate()(listData[li]);
                } else {
                    templateEle = this.createAppointment(listData[li]);
                }
                append([].slice.call(templateEle), appWrapper);
                listElement.children[li].innerHTML = appWrapper.outerHTML;
                let args: EventRenderedArgs = { data: listData[li], element: listElement.children[li] as HTMLElement, cancel: false };
                this.parent.trigger(event.eventRendered, args);
                if (args.cancel) {
                    remove(listElement.children[li]);
                }
            }
        }
        aTd.appendChild(listElement);
        if ((this.parent.currentView === 'MonthAgenda' && this.parent.activeViewOptions.group.resources.length > 0)
            || this.parent.currentView === 'Agenda') {
            addClass([aTd], cls.AGENDA_DAY_BORDER_CLASS);
        }
        return aTd;
    }

    public createAppointment(event: { [key: string]: Object }): HTMLElement[] {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let eventSubject: string = (event[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let eventLocation: string = (event[fieldMapping.location] || this.parent.eventSettings.fields.location.default) as string;
        let appSubjectWrap: HTMLElement = createElement('div', { className: cls.SUBJECT_WRAP });
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            eventSubject += ',';
        }
        appSubjectWrap.appendChild(createElement('div', { className: cls.SUBJECT_CLASS, innerHTML: eventSubject }));
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            appSubjectWrap.appendChild(createElement('div', { className: cls.LOCATION_CLASS, innerHTML: eventLocation }));
        }
        if (!isNullOrUndefined(event[fieldMapping.recurrenceRule])) {
            let iconClass: string = (event[fieldMapping.id] === event[fieldMapping.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appSubjectWrap.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
        }
        let strDate: Date = event[fieldMapping.startTime] as Date;
        let endDate: Date = event[fieldMapping.endTime] as Date;
        let isAllDay: boolean = event[fieldMapping.isAllDay] as boolean;
        let allDayStr: string = this.parent.localeObj.getConstant('allDay');
        let timeStr: string = this.parent.getTimeString(strDate) + ' - ' + this.parent.getTimeString(endDate);
        if (!isNullOrUndefined(event.data)) {
            let eventString: string = (endDate.getTime() - strDate.getTime()) / util.MS_PER_DAY >= 1 ? allDayStr : timeStr;
            allDayStr = eventString + ' (' + this.parent.localeObj.getConstant('day') + ' '
                + (event.data as { [key: string]: Object }).index + '/' + (event.data as { [key: string]: Object }).count + ')';
        }
        let displayStr: string = (!isNullOrUndefined(event.data) || isAllDay) ? allDayStr : timeStr;
        let appDateTime: HTMLElement = createElement('div', { className: cls.DATE_TIME_CLASS, innerHTML: displayStr });
        return [appSubjectWrap, appDateTime];
    }

    public processAgendaEvents(events: Object[]): Object[] {
        let eventsProcessed: Object[] = [];
        for (let event of events) {
            let splited: Object[] = this.parent.eventBase.splitEventByDay(event as { [key: string]: Object });
            eventsProcessed = eventsProcessed.concat(splited.length > 1 ? splited : event);
        }
        return eventsProcessed;
    }

    public wireEventActions(): void {
        let eventElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        for (let element of eventElement) {
            this.parent.eventBase.wireAppointmentEvents(element);
        }
        let dateHeaderElement: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-m-date'));
        for (let element of dateHeaderElement) {
            EventHandler.add(element, 'click', this.parent.agendaModule.dayNavigationClick, this);
        }
    }

    public calculateResourceTableElement(tBody: Element, noOfDays: number, agendaDate: Date): void {
        if (isNullOrUndefined(this.parent.resourceBase.lastResourceLevel)) {
            let level: TdData[] = this.viewBase.getDateSlots(this.viewBase.renderDates, this.parent.activeViewOptions.workDays);
            this.parent.resourceBase.generateResourceLevels(level);
        }
        let agendaLastDate: Date = util.addDays(new Date(agendaDate.getTime()), noOfDays);
        let days: number = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
        let resColl: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        let resData: TdData[] = this.parent.resourceBase.lastResourceLevel;
        let initialDate: Date = agendaDate;
        for (let i: number = 0; i < days; i++) {
            let lastLevelInfo: TdData[][] = []; let tempLastLevelInfo: TdData[] = []; let tempIndex: number = 0;
            let eventObj: AgendaSlotData; let dateObj: TdData;
            let firstDate: Date = util.addDays(initialDate, i);
            let finalDate: Date = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda')
                ? util.addDays(firstDate, 1) : agendaLastDate;
            let agendaCollection: { [key: string]: Object }[] = this.parent.eventBase.filterEvents
                (firstDate, finalDate) as { [key: string]: Object }[];
            if (agendaCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                for (let res: number = 0; res < resData.length; res++) {
                    noOfDays = (!this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
                    let data: { [key: string]: Object }[] = [];
                    agendaDate = firstDate;
                    let resDataCollection: { [key: string]: Object }[] = this.parent.eventBase.filterEvents
                        (agendaDate, agendaLastDate, agendaCollection, resData[res]) as { [key: string]: Object }[];
                    if (resDataCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                        for (let r: number = 0; r < noOfDays; r++) {
                            let resDayCollection: { [key: string]: Object }[] = this.parent.eventBase.filterEvents
                                (agendaDate, util.addDays(agendaDate, 1), resDataCollection, undefined) as { [key: string]: Object }[];
                            if (resDayCollection.length > 0 || !this.parent.hideEmptyAgendaDays ||
                                this.parent.currentView === 'MonthAgenda') {
                                data.push(resDayCollection[0]);
                                eventObj = {
                                    rowSpan: 1, type: 'eventColumn', resource: resColl[resColl.length - 1],
                                    groupIndex: resData[res].groupIndex, groupOrder: resData[res].groupOrder,
                                    resourceData: resData[res].resourceData, eventData: resDayCollection, date: agendaDate
                                };
                                dateObj = {
                                    rowSpan: 1, type: 'dateColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder, resourceData: resData[res].resourceData,
                                    date: agendaDate
                                };
                                if (!lastLevelInfo[tempIndex]) {
                                    lastLevelInfo[tempIndex] = [];
                                }
                                lastLevelInfo[tempIndex].push(eventObj);
                                lastLevelInfo[tempIndex].push(dateObj);
                                tempIndex++;
                            }
                            agendaDate = util.addDays(agendaDate, 1);
                            if (agendaDate.getTime() >= agendaLastDate.getTime() || this.parent.activeViewOptions.group.byDate
                                || this.parent.currentView === 'MonthAgenda') {
                                lastLevelInfo[lastLevelInfo.length - 1][1].cssClass = cls.AGENDA_DAY_BORDER_CLASS;
                                let tempObj: TdData = {
                                    rowSpan: data.length, type: 'resourceColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder.slice(0, -1), resourceData: resData[res].resourceData,
                                    groupIndex: (lastLevelInfo.length - data.length), className: [cls.RESOURCE_NAME],
                                    date: agendaDate
                                };
                                lastLevelInfo[lastLevelInfo.length - data.length].push(tempObj);
                                tempLastLevelInfo.push(<TdData>extend({}, tempObj, null, true));
                                break;
                            }
                        }
                    }
                }
                let topResources: ResourcesModel[] = resColl.slice(0, -1); let tempGroupedData: TdData[] = [];
                let totalRowSpan: number = 0;
                for (let y: number = 0; y < topResources.length; y++) {
                    let data: { [key: string]: Object }[] = topResources[topResources.length - (y + 1)]
                        .dataSource as { [key: string]: Object }[];
                    for (let x: number = 0; x < data.length; x++) {
                        let z: number = 0;
                        for (let u: number = 0; u < tempLastLevelInfo.length; u++) {
                            if (tempLastLevelInfo[u].groupOrder[topResources.length - (y + 1)] === data[x]
                            [topResources[topResources.length - (y + 1)].idField]) {
                                totalRowSpan = totalRowSpan + tempLastLevelInfo[u].rowSpan;
                                tempGroupedData.push(<TdData>extend({}, tempLastLevelInfo[u], null, true));
                            }
                            if (++z === tempLastLevelInfo.length && tempGroupedData.length > 0) {
                                tempGroupedData[0].rowSpan = totalRowSpan;
                                tempGroupedData[0].type = 'parentColumnLevel_' + (y + 1);
                                tempGroupedData[0].resource = topResources[topResources.length - (y + 1)];
                                tempGroupedData[0].resourceData = data[x];
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
        let totalCollection: Object[] = this.parent.eventBase.filterEvents(initialDate, agendaLastDate);
        if (totalCollection.length === 0 && !this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            this.renderEmptyContent(tBody, initialDate);
        }
    }

    private createResourceTableRow(tContent: TdData[][], tBody: Element): void {
        let tr: Element = createElement('tr', { attrs: { role: 'row' } });
        let ntr: Element;
        let td: Element = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let tempData: AgendaSlotData;
        let rowSpan: number = 0;
        let level: string;
        if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
            let tContentCollection: TdData[] = [];
            let parentCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection.slice(0, -1);
            for (let w: number = 0; w < tContent.length; w++) {
                tContentCollection = tContentCollection.concat(tContent[w]);
            }
            level = (parentCollection.length > 0) ? 'parentColumnLevel_' + parentCollection.length : 'resourceColumn';
            let rowSpanCollection: TdData[] = new DataManager({ json: tContentCollection }).executeLocal(new Query()
                .where('type', 'equal', level)) as TdData[];
            for (let x: number = 0; x < rowSpanCollection.length; x++) {
                rowSpan = rowSpan + rowSpanCollection[x].rowSpan;
            }
        }
        for (let row: number = 0; row < tContent.length; row++) {
            ntr = tr.cloneNode() as Element;
            for (let col: number = tContent[row].length - 1; col >= 0; col--) {
                let data: AgendaSlotData = tContent[row][col];
                let ntd: Element = td.cloneNode() as Element;
                if (data.type === 'dateColumn') {
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        tempData = tContent[row][col];
                        continue;
                    }
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    ntd.appendChild(this.createDateHeaderElement(data.date));
                    let className: string[] = [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DATE_CLASS];
                    if (data.cssClass) {
                        className.push(data.cssClass);
                    }
                    addClass([ntd], className);
                    ntr.appendChild(ntd);
                } else if (data.type === 'eventColumn') {
                    let elementType: string = (data.eventData.length === 0) ? 'noEvents' : 'data';
                    ntd = this.createAgendaContentElement(elementType, data.eventData, ntd, data.groupOrder, data.groupIndex);
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        addClass([ntd], [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DAY_PADDING_CLASS]);
                    }
                    ntr.appendChild(ntd);
                } else {
                    ntd.setAttribute('rowspan', data.rowSpan.toString());
                    addClass([ntd], cls.AGENDA_RESOURCE_CLASS);
                    this.viewBase.setResourceHeaderContent(ntd, data, data.className[0]);
                    ntr.appendChild(ntd);
                }
            }
            if (this.parent.activeViewOptions.group.byDate && row === 0 && this.parent.currentView !== 'MonthAgenda') {
                let ntd: Element = td.cloneNode() as Element;
                ntd.setAttribute('data-date', tempData.date.getTime().toString());
                ntd.setAttribute('rowspan', rowSpan.toString());
                ntd.appendChild(this.createDateHeaderElement(tempData.date));
                addClass([ntd], [cls.AGENDA_CELLS_CLASS, cls.AGENDA_DATE_CLASS, cls.DATE_BORDER_CLASS]);
                let daysCount: number = util.getDaysCount(this.parent.selectedDate.getTime(), tempData.date.getTime());
                ntr.setAttribute('aria-rowindex', daysCount.toString());
                if (this.parent.element.querySelector(`.e-agenda-view tr[aria-rowindex="${daysCount}"]`)) { break; }
                ntr.insertBefore(ntd, ntr.childNodes[0]);
            }
            tBody.appendChild(ntr);
        }
    }

    public createDateHeaderElement(date: Date): Element {
        let dateHeader: Element;
        if (this.parent.activeViewOptions.dateHeaderTemplate) {
            dateHeader = createElement('div', { className: cls.AGENDA_HEADER_CLASS });
            let templateArgs: CellTemplateArgs = { date: date, type: 'dateHeader' };
            let template: HTMLCollection = this.parent.getDateHeaderTemplate()(templateArgs);
            append([].slice.call(template), dateHeader);
        } else {
            dateHeader = this.viewBase.getMobileDateElement(date, cls.AGENDA_HEADER_CLASS);
        }
        return dateHeader;
    }

    public renderEmptyContent(tBody: Element, agendaDate: Date): void {
        let eTr: Element = this.createTableRowElement(agendaDate, 'noEvents');
        let eTd: Element = eTr.children[0];
        let noEvents: Element = createElement('div', {
            className: cls.AGENDA_EMPTY_EVENT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noEvents')
        });
        eTd.appendChild(noEvents);
        tBody.appendChild(eTr);
    }

    public createTableRowElement(date: Date, type: string): Element {
        let daysCount: number = util.getDaysCount(this.parent.selectedDate.getTime(), date.getTime());
        let tr: Element = createElement('tr', { attrs: { 'role': 'row', 'aria-rowindex': daysCount.toString() } });
        let td: Element = createElement('td', {
            attrs: {
                'class': (type === 'monthHeader') ? cls.AGENDA_MONTH_HEADER_CLASS : cls.AGENDA_CELLS_CLASS,
                'role': 'gridcell',
                'aria-selected': 'false',
                'aria-colindex': daysCount.toString(),
                'data-date': date.getTime().toString()
            }
        });
        let dTd: Element = td.cloneNode() as Element;
        let aTd: Element = td.cloneNode() as Element;
        tr.appendChild(dTd);
        if (type !== 'noEvents') {
            tr.appendChild(aTd);
        }
        return tr;
    }
}
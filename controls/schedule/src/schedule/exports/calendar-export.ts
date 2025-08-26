/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend } from '@syncfusion/ej2-base';
import { EventFieldsMapping } from '../base/interface';
import { getDateFromRecurrenceDateString, getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';
import { Schedule } from '../base/schedule';

/**
 * ICalendar Export Module
 */

export class ICalendarExport {
    private parent: Schedule;
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public initializeCalendarExport(fileName: string, customData: Record<string, any>[]): void {
        const icsString: string = this.getCalendarString(fileName, customData);
        this.download(icsString, fileName);
    }

    public getCalendarString(fileName?: string, customData?: Record<string, any>[]): string {
        let eventsData: Record<string, any>[] = (customData) ? customData :
            extend([], this.parent.eventsData, null, true) as Record<string, any>[];
        eventsData = this.parent.eventBase.sortByTime(eventsData);
        const SEPARATOR: string = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
        const iCalendarEvents: string[] = [];
        const filterCollection: Record<string, any>[] = [];
        const timeZone: string = this.parent.timezone || this.parent.tzModule.getLocalTimezoneName();
        const fields: EventFieldsMapping = this.parent.eventFields;
        eventsData.forEach((eventObj: Record<string, any>) => {
            let uId: string = eventObj[fields.id] || eventObj.Guid || this.parent.eventBase.generateGuid();
            const editedExDate: string[] = [];
            if (eventObj[fields.recurrenceID]) {
                const filter: Record<string, any>[] =
                    this.filterEvents(filterCollection, fields.id, eventObj[fields.recurrenceID] as number);
                uId = filter.length > 0 ? filter[0].UID as string : uId;
            }
            if (!eventObj[fields.recurrenceID] && eventObj[fields.recurrenceRule] && eventObj[fields.recurrenceException]) {
                const exDate: string[] = ((eventObj[fields.recurrenceException]) as string).split(',');
                const editedObj: Record<string, any>[] =
                    this.filterEvents(eventsData, fields.recurrenceID, eventObj[fields.id] as number);
                editedObj.forEach((edited: Record<string, any>) => {
                    editedExDate.push(getRecurrenceStringFromDate(edited[fields.startTime] as Date));
                });
                const exceptionDateList: string[] = exDate.filter((value: string) => editedExDate.indexOf(value) === -1);
                eventObj[fields.recurrenceException] = (exceptionDateList.length > 0) ? (exceptionDateList.join(',') + ',') : '';
            }
            const startZone: string = (eventObj[fields.startTimezone] || timeZone) as string;
            const endZone: string = (eventObj[fields.endTimezone] || timeZone) as string;
            const readonly: boolean = (eventObj[fields.isReadonly]) ? (eventObj[fields.isReadonly]) : false;
            const calendarEvent: string[] = [
                'BEGIN:VEVENT',
                'LOCATION:' + (eventObj[fields.location] || ''),
                'SUMMARY:' + (eventObj[fields.subject] || ''),
                'UID:' + uId,
                'DESCRIPTION:' + (eventObj[fields.description] || ''),
                'ISREADONLY:' + readonly,
                'END:VEVENT'
            ];
            if (eventObj[fields.isAllDay]) {
                calendarEvent.splice(4, 0, 'DTEND;VALUE=DATE:' + this.convertDateToString(eventObj[fields.endTime] as Date, true));
                calendarEvent.splice(4, 0, 'DTSTART;VALUE=DATE:' + this.convertDateToString(eventObj[fields.startTime] as Date, true));
            } else if (!eventObj[fields.isAllDay] && !eventObj[fields.recurrenceRule]) {
                calendarEvent.splice(4, 0, 'DTEND:' + this.convertDateToString(eventObj[fields.endTime] as Date));
                calendarEvent.splice(4, 0, 'DTSTART:' + this.convertDateToString(eventObj[fields.startTime] as Date));
            } else {
                calendarEvent.splice(4, 0, 'DTEND;TZID="' + endZone + '":' + this.convertDateToString(eventObj[fields.endTime] as Date));
                calendarEvent.splice(4, 0, 'DTSTART;TZID="' + startZone + '":'
                    + this.convertDateToString(eventObj[fields.startTime] as Date));
            }
            if (eventObj[fields.recurrenceRule]) {
                calendarEvent.splice(4, 0, 'RRULE:' + eventObj[fields.recurrenceRule]);
            }
            if (eventObj[fields.recurrenceException]) {
                const exDate: string[] = (eventObj[fields.recurrenceException] as string).split(',');
                for (let i: number = 0; i < exDate.length - 1; i++) {
                    calendarEvent.splice(5, 0, 'EXDATE:' +
                        this.convertDateToString(
                            getDateFromRecurrenceDateString(exDate[parseInt(i.toString(), 10)]), eventObj[fields.isAllDay] as boolean));
                }
            }
            if (eventObj[fields.recurrenceID]) {
                calendarEvent.splice(4, 0, 'RECURRENCE-ID;TZID="' + startZone + '":'
                    + this.convertDateToString(eventObj[fields.startTime] as Date, eventObj[fields.isAllDay] as boolean));
            }
            const customFields: string[] = this.customFieldFilter(eventObj, fields);
            if (customFields.length > 0) {
                customFields.forEach((customField: string) =>
                    calendarEvent.splice(4, 0, customField + ':' + (eventObj[`${customField}`] || ''))
                );
            }
            const app: Record<string, any> = <Record<string, any>>extend({}, eventObj);
            app.UID = uId;
            filterCollection.push(app);
            iCalendarEvents.push(calendarEvent.join(SEPARATOR));

        });
        const iCalendar: string = [
            'BEGIN:VCALENDAR',
            'PRODID:-//Syncfusion Inc//Scheduler//EN',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:' + (fileName || 'Calendar'),
            'X-WR-TIMEZONE:' + timeZone
        ].join(SEPARATOR);
        const icsString: string = iCalendar + SEPARATOR + iCalendarEvents.join(SEPARATOR) + SEPARATOR + 'END:VCALENDAR';
        return icsString;
    }
    private customFieldFilter(eventObj: Record<string, any>, fields: EventFieldsMapping): string[] {
        const defaultFields: string[] = Object.keys(fields).map((key: string) => (fields as Record<string, any>)[`${key}`]) as string[];
        const eventFields: string[] = Object.keys(eventObj);
        return eventFields.filter((value: string) => (defaultFields.indexOf(value) === -1) && (value !== 'Guid'));
    }

    private convertDateToString(eventDate: Date, allDay?: boolean): string {
        const year: string = ('0000' + (eventDate.getFullYear().toString())).slice(-4);
        const month: string = ('00' + ((eventDate.getMonth() + 1).toString())).slice(-2);
        const date: string = ('00' + ((eventDate.getDate()).toString())).slice(-2);
        const hours: string = ('00' + (eventDate.getHours().toString())).slice(-2);
        const minutes: string = ('00' + (eventDate.getMinutes().toString())).slice(-2);
        const seconds: string = ('00' + (eventDate.getSeconds().toString())).slice(-2);
        const timeString: string = (allDay) ? year + month + date : year + month + date + 'T' + hours + minutes + seconds;
        return timeString;
    }

    private download(icsString: string, fileName: string): void {
        const buffer: Blob = new Blob([icsString], { type: 'data:text/calendar;charset=utf8' });
        fileName = (fileName || 'Calendar') + '.ics';
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(buffer, fileName);
        } else {
            const downloadLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            downloadLink.download = fileName;
            downloadLink.href = URL.createObjectURL(buffer);
            const event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout((): void => {
                URL.revokeObjectURL(downloadLink.href);
                downloadLink.href = undefined;
            });
        }
    }

    private filterEvents(data: Record<string, any>[], field: string, value: number): Record<string, any>[] {
        return data.filter((e: Record<string, any>) => e[`${field}`] === value);
    }

    protected getModuleName(): string {
        return 'iCalendarExport';
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent = null;
    }

}

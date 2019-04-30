import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { EventFieldsMapping } from '../base/interface';
import { getDateFromRecurrenceDateString, getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';
import { Schedule } from '../base/schedule';
import { Timezone } from '../timezone/timezone';

/**
 * ICalendar Export Module
 */

export class ICalendarExport {
    private parent: Schedule;
    private timezone: Timezone;
    constructor(parent: Schedule) {
        this.parent = parent;
        this.timezone = new Timezone();
    }

    public initializeCalendarExport(fileName?: string): void {
        let eventsData: Object[] = <Object[]>extend([], this.parent.eventsData, null, true);
        eventsData = this.parent.eventBase.sortByTime(eventsData);
        const SEPARATOR: string = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
        let iCalendarEvents: string[] = [];
        let filterCollection: { [key: string]: Object }[] = [];
        let timeZone: string = this.parent.timezone || this.timezone.getLocalTimezoneName();
        let fields: EventFieldsMapping = this.parent.eventFields;
        eventsData.forEach((eventObj: { [key: string]: Object }) => {
            let uId: string = this.parent.eventBase.generateGuid();
            let editedExDate: string[] = [];
            if (eventObj[fields.recurrenceID]) {
                let filter: { [key: string]: Object }[] =
                    this.filterEvents(filterCollection, fields.id, eventObj[fields.recurrenceID] as number);
                uId = (filter[0] as { [key: string]: Object }).UID as string;
            }
            if (!eventObj[fields.recurrenceID] && eventObj[fields.recurrenceRule] && eventObj[fields.recurrenceException]) {
                let exceptionDateList: string[];
                let exDate: string[] = ((eventObj[fields.recurrenceException]) as string).split(',');
                let editedObj: { [key: string]: Object }[] =
                    this.filterEvents(eventsData, fields.recurrenceID, eventObj[fields.id] as number);
                editedObj.forEach((edited: { [key: string]: Object }) => {
                    editedExDate.push(getRecurrenceStringFromDate(edited[fields.startTime] as Date));
                });
                exceptionDateList = exDate.filter((value: string) => (editedExDate.indexOf(value) === -1));
                eventObj[fields.recurrenceException] = (exceptionDateList.length > 0) ? (exceptionDateList.join(',') + ',') : '';
            }
            let startZone: string = (eventObj[fields.startTimezone] || timeZone) as string;
            let endZone: string = (eventObj[fields.endTimezone] || timeZone) as string;
            let calendarEvent: string[] = [
                'BEGIN:VEVENT',
                'LOCATION:' + (eventObj[fields.location] || ''),
                'SUMMARY:' + (eventObj[fields.subject] || ''),
                'UID:' + uId,
                'DESCRIPTION:' + (eventObj[fields.description] || ''),
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
                let exDate: string[] = (eventObj[fields.recurrenceException] as string).split(',');
                for (let i: number = 0; i < exDate.length - 1; i++) {
                    calendarEvent.splice(5, 0, 'EXDATE:' +
                        this.convertDateToString(getDateFromRecurrenceDateString(exDate[i]), eventObj[fields.isAllDay] as boolean));
                }
            }
            if (eventObj[fields.recurrenceID]) {
                calendarEvent.splice(4, 0, 'RECURRENCE-ID;TZID="' + startZone + '":'
                    + this.convertDateToString(eventObj[fields.startTime] as Date, eventObj[fields.isAllDay] as boolean));
            }
            let customFields: string[] = this.customFieldFilter(eventObj, fields);
            if (customFields.length > 0) {
                customFields.forEach((customField: string) =>
                    calendarEvent.splice(4, 0, customField + ':' + (eventObj[customField] || ''))
                );
            }
            let app: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, eventObj);
            app.UID = uId;
            filterCollection.push(app);
            iCalendarEvents.push(calendarEvent.join(SEPARATOR));
        });
        let iCalendar: string = [
            'BEGIN:VCALENDAR',
            'PRODID:-//Syncfusion Inc//Scheduler//EN',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:' + (fileName || 'Calendar'),
            'X-WR-TIMEZONE:' + timeZone,
        ].join(SEPARATOR);
        let icsString: string = iCalendar + SEPARATOR + iCalendarEvents.join(SEPARATOR) + SEPARATOR + 'END:VCALENDAR';
        this.download(icsString, fileName);
    }

    private customFieldFilter(eventObj: object, fields: EventFieldsMapping): string[] {
        let defaultFields: string[] = Object.keys(fields).map((key: string) => (fields as { [key: string]: Object })[key]) as string[];
        let eventFields: string[] = Object.keys(eventObj);
        return eventFields.filter((value: string) => (defaultFields.indexOf(value) === -1) && (value !== 'Guid'));
    }

    private convertDateToString(eventDate: Date, allDay?: boolean): string {
        let year: string = ('0000' + (eventDate.getFullYear().toString())).slice(-4);
        let month: string = ('00' + ((eventDate.getMonth() + 1).toString())).slice(-2);
        let date: string = ('00' + ((eventDate.getDate()).toString())).slice(-2);
        let hours: string = ('00' + (eventDate.getHours().toString())).slice(-2);
        let minutes: string = ('00' + (eventDate.getMinutes().toString())).slice(-2);
        let seconds: string = ('00' + (eventDate.getSeconds().toString())).slice(-2);
        let timeString: string = (allDay) ? year + month + date : year + month + date + 'T' + hours + minutes + seconds;
        return timeString;
    }

    private download(icsString: string, fileName: string): void {
        let buffer: Blob = new Blob([icsString], { type: 'data:text/calendar;charset=utf8' });
        fileName = (fileName || 'Calendar') + '.ics';
        if (!(!navigator.msSaveBlob)) {
            navigator.msSaveBlob(buffer, fileName);
        } else {
            let downloadLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            downloadLink.download = fileName;
            downloadLink.href = URL.createObjectURL(buffer);
            let event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout((): void => {
                URL.revokeObjectURL(downloadLink.href);
                downloadLink.href = undefined;
            });
        }
    }

    private filterEvents(data: object[], field: string, value: number): { [key: string]: Object }[] {
        return new DataManager({ json: data }).executeLocal
            (new Query().where(field, 'equal', value)) as { [key: string]: Object }[];
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'iCalendarExport';
    }

    /**
     * To destroy the ICalendarExport. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.timezone) {
            this.timezone = null;
        }
    }
}

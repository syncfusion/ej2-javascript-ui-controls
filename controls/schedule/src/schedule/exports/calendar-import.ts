import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { EventFieldsMapping } from '../base/interface';
import { getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';

/**
 * ICalendar Import Module
 */

export class ICalendarImport {
    private parent: Schedule;
    private allDay: Boolean = false;
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public initializeCalendarImport(fileContent: Blob | string): void {
        if (fileContent && fileContent instanceof Blob) {
            let fileReader: FileReader = new FileReader();
            fileReader.onload = (event: Event) => {
                let iCalString: string = fileReader.result as string;
                this.iCalendarParser(iCalString);
            };
            fileReader.readAsText(fileContent as Blob, 'ISO-8859-8');
        } else if (fileContent && typeof fileContent === 'string') {
            this.iCalendarParser(fileContent);
        }
    }

    private iCalendarParser(iCalString: string): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let events: Object[] = [];
        let uId: string = 'UID';
        let calArray: string[] = iCalString.replace(new RegExp('\\r', 'g'), '').split('\n');
        let isEvent: boolean = false;
        let curEvent: { [key: string]: Object } = null;
        let id: number | string = this.parent.eventBase.getEventMaxID();
        calArray.forEach((element: string) => {
            let index: number;
            let type: string;
            let value: string;
            if (!isEvent && element === 'BEGIN:VEVENT') {
                isEvent = true;
                curEvent = {};
            }
            if (isEvent && element === 'END:VEVENT') {
                isEvent = false;
                events.push(curEvent);
                curEvent = null;
            }
            if (isEvent) {
                index = element.indexOf(':');
                type = element.substr(0, index).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                value = element.substr(index + 1, element.length - (index + 1)).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if (element.indexOf('SUMMARY') !== -1) {
                    type = 'SUMMARY';
                }
                if (element.indexOf('DTSTART') !== -1) {
                    curEvent[fields.startTime] = this.dateParsing(element);
                    curEvent[fields.isAllDay] = this.allDay;
                    this.allDay = false;
                } else if (element.indexOf('DTEND') !== -1) {
                    curEvent[fields.endTime] = this.dateParsing(element);
                } else if (element.indexOf('EXDATE') !== -1) {
                    value = getRecurrenceStringFromDate(this.dateParsing(element));
                    curEvent[fields.recurrenceException] = (isNullOrUndefined(curEvent[fields.recurrenceException])) ?
                        value : curEvent[fields.recurrenceException] + ',' + value;
                } else if (element.indexOf('RECURRENCE-ID') !== -1) {
                    value = getRecurrenceStringFromDate(this.dateParsing(element));
                    curEvent[fields.recurrenceException] = value;
                    curEvent[fields.recurrenceID] = value;
                } else {
                    switch (type) {
                        case 'BEGIN':
                            break;
                        case 'UID':
                            curEvent[uId] = value;
                            curEvent[fields.id] = (id as number)++;
                            break;
                        case 'SUMMARY':
                            curEvent[fields.subject] = value;
                            break;
                        case 'LOCATION':
                            curEvent[fields.location] = value;
                            break;
                        case 'DESCRIPTION':
                            curEvent[fields.description] = value;
                            break;
                        case 'RRULE':
                            curEvent[fields.recurrenceRule] = value;
                            break;
                        default:
                            curEvent[type] = value;
                    }
                }
            }
        });
        let app: Object[] = <Object[]>extend([], events, null, true);
        this.parent.addEvent(this.processOccurrence(app));
    }

    private processOccurrence(app: Object[]): Object[] {
        let appoint: Object[] = [];
        let uId: string = 'UID';
        let fields: EventFieldsMapping = this.parent.eventFields;
        app.forEach((eventObj: { [key: string]: Object }) => {
            let parentObj: { [key: string]: Object };
            let id: string;
            if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                parentObj = eventObj;
                id = eventObj[fields.id] as string;
            }
            let data: { [key: string]: Object }[] = app.filter((data: { [key: string]: Object }) =>
                data.UID === eventObj[uId]) as { [key: string]: Object }[];
            if (data.length > 1 && isNullOrUndefined(eventObj[fields.recurrenceID])) {
                for (let i: number = 0; i < data.length; i++) {
                    if (data[i].hasOwnProperty(fields.recurrenceID)) {
                        let exdate: string = data[i][fields.recurrenceID] as string;
                        data[i][fields.recurrenceID] = id;
                        data[i][fields.recurrenceException] = null;
                        parentObj[fields.recurrenceException] = (isNullOrUndefined(parentObj[fields.recurrenceException])) ?
                            exdate : parentObj[fields.recurrenceException] + ',' + exdate;
                        appoint.push(data[i]);
                    }
                }
                appoint.push(parentObj);
            } else if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                appoint.push(eventObj);
            }
        });
        return appoint;
    }

    private getDateString(value: string): string {
        value = value || '';
        return (value
            .replace(/\\\,/g, ',')
            .replace(/\\\;/g, ';')
            .replace(/\\[nN]/g, '\n')
            .replace(/\\\\/g, '\\')
        );
    }

    private dateParsing(element: string): Date {
        let expression: RegExp = /([^':;]+)((?:;(?:[^':;]+)(?:=(?:(?:'[^']*')|(?:[^':;]+))))*):(.*)/;
        let split: string[] = (element.match(expression)).slice(1);
        let value: string = split[split.length - 1];
        let newDate: Date = new Date(this.getDateString(value));
        if (element && element.indexOf('VALUE=DATE') > -1) {
            let data: string[] = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
            if (data !== null) {
                newDate = new Date(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10));
            }
            if (element.indexOf('DTSTART') > -1) {
                this.allDay = true;
            }
        }
        let data: string[] = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
        if (data !== null) {
            if (data[7] === 'Z') {
                newDate = new Date(Date.UTC(
                    parseInt(data[1], 10),
                    parseInt(data[2], 10) - 1,
                    parseInt(data[3], 10),
                    parseInt(data[4], 10),
                    parseInt(data[5], 10),
                    parseInt(data[6], 10)
                ));
            } else {
                newDate = new Date(
                    parseInt(data[1], 10),
                    parseInt(data[2], 10) - 1,
                    parseInt(data[3], 10),
                    parseInt(data[4], 10),
                    parseInt(data[5], 10),
                    parseInt(data[6], 10)
                );
            }
        }
        return newDate;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'iCalendarImport';
    }

    /**
     * To destroy the ICalendarImport.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
    }
}

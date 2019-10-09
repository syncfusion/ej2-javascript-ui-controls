import { RecurrenceEditor, RecurrenceEditorChangeEventArgs } from '../../src/recurrence-editor/recurrence-editor';
import { generate } from '../../src/recurrence-editor/date-generator';
import { createElement, Ajax, loadCldr, HijriParser, setCulture, L10n } from '@syncfusion/ej2-base';
import { Islamic, Calendar } from '@syncfusion/ej2-calendars';

/**
 * Islamic Recurrence editor sample
 */

Calendar.Inject(Islamic);
function loadCultureFiles(name: string, base: boolean = false): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json', 'ca-islamic.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('../../spec/cldr-data/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('../../spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
loadCultureFiles('', true);
loadCultureFiles('ar');

// To load locale texts
let localeTexts: string;
let ajax: Ajax = new Ajax('../schedule/locale.json', 'GET', false);
ajax.onSuccess = (value: string) => {
    localeTexts = value;
};
ajax.send();
L10n.load(JSON.parse(<string>localeTexts));

//setCulture('ar');

function getHijriDates(dates: number[]): { [key: string]: Object }[] {
    let hijriDates: { [key: string]: Object }[] = [];
    for (let i: number = 0; i < dates.length; i++) {
        let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(new Date(dates[i])) as { [key: string]: Object };
        hijriDates.push(hijriObject);
    }
    return hijriDates;
}

let recObject: RecurrenceEditor = new RecurrenceEditor({
    calendarMode: 'Islamic',
    // locale: 'ar',
    change: (e: RecurrenceEditorChangeEventArgs) => {
        let datesContainder: HTMLInputElement = document.querySelector('.dates-container');
        datesContainder.innerHTML = '';
        let startDate: Date = new Date('Tue, 06 May 2014');
        let dates: number[] = generate(startDate, e.value, null, 0, undefined, null, 'Islamic');
        let hDates: { [key: string]: Object }[] = getHijriDates(dates);
        for (let date of hDates) {
            datesContainder.appendChild(createElement('div', { innerHTML: JSON.stringify(date) }));
        }
    }
});
recObject.appendTo('#editor');

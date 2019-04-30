import { Ajax, loadCldr, L10n } from '@syncfusion/ej2-base';
import { Calendar } from '../../src/calendar/calendar';

//Based on the locale object to set the localized text for today button
L10n.load({
    'en': {
        'calendar': {
            today: "Today"
        }
    },
    'de': {
        'calendar': {
            today: "heute"
        }
    },
    'zh': {
        'calendar': {
            today: "今天"
        }
    }
});
/*Load culturefiles from cldr main folder*/
function loadCultureFiles(name: string): void {
    let files: string[] =
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        ajax = new Ajax('../../spec/cldr/main/' + name + '/' + prop, 'GET', false);
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
loadCultureFiles('de');
/*Initialize the calender component with german culture*/
let calendar: Calendar = new Calendar({
    value: new Date('5/5/2017'),
    locale: 'de'
});
calendar.appendTo('#calendar');

document.getElementById('cultures').addEventListener('change', changeLocale);

function changeLocale(): void {
    let culture: string = (document.getElementById('cultures') as HTMLSelectElement).value;
    if (culture !== 'en') {
        loadCultureFiles(culture);
    }
    calendar.locale = culture;
}

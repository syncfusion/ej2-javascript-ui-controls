import { Ajax, loadCldr } from '@syncfusion/ej2-base';
import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, EmitType, L10n, setCulture } from '@syncfusion/ej2-base';

//Based on the locale object to set the localized text for today button and placeholder
L10n.load({
    'en': {
        'datetimepicker': {
            placeholder: "Select a date and time",
            today: "Today"
        }
    },
    'de': {
        'datetimepicker': {
            placeholder: "Wählen Sie Datum und Uhrzeit",
            today: "heute"
        }
    },
    'zh': {
        'datetimepicker': {
            placeholder: "选择日期和时间",
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
/*Initialize the datetimepicker component with german culture*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date(),
    locale: 'de',
});
datetimepicker.appendTo('#datetimepicker');

document.getElementById('cultures').addEventListener('change', changeLocale);
function changeLocale(): void {
    let culture: string = (document.getElementById('cultures') as HTMLSelectElement).value;
    if (culture !== 'en') {
        loadCultureFiles(culture);
    }
    datetimepicker.locale = culture;
}
import { Ajax, loadCldr } from '@syncfusion/ej2-base';
import { DatePicker } from '../../src/datepicker/datepicker';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, EmitType, L10n, setCulture } from '@syncfusion/ej2-base';

//Based on the locale object to set the localized text for today button and placeholder
L10n.load({
    'en': {
        'datepicker': {
            placeholder: "Choose a date",
            today: "Today"
        }
    },
    'de': {
        'datepicker': {
            placeholder: "Wählen Sie ein Datum",
            today: "heute"
        }
    },
    'zh': {
        'datepicker': {
            placeholder: "選擇一個日期",
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
/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width: "250px",
    locale: 'de',
    value: new Date('5/5/2017')
});
datepicker.appendTo('#datepicker');
document.getElementById('cultures').addEventListener('change', changeLocale);
function changeLocale(): void {
    let culture: string = (document.getElementById('cultures') as HTMLSelectElement).value;
    if (culture !== 'en') {
        loadCultureFiles(culture);
    }
    datepicker.locale = culture;
    datepicker.dataBind();
}

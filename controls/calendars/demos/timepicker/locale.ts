import { TimePicker } from '../../src/timepicker/timepicker';
import { Ajax, loadCldr, L10n } from '@syncfusion/ej2-base';

/*Load culturefiles from cldr main folder*/
function loadCultureFiles(name: string): void {
    let files: string[] =
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        ajax = new Ajax('/spec/cldr/main/' + name + '/' + prop, 'GET', false);
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
loadCultureFiles('de');

//Based on the locale object to set the localized text for placeholder
L10n.load({
    'en': {
        'timepicker': { placeholder: 'Enter the value' }
    },
    'de': {
        'timepicker': { placeholder: 'Geben Sie den Wert ein' }
    },
    'zh': {
        'timepicker': { placeholder: '輸入值' }
    }
});
/*Initialize the timepicker component with german culture*/
let timepicker: TimePicker = new TimePicker({
    locale: 'de',
    value: new Date("12/12/2016 14:00")
});
timepicker.appendTo('#timepicker');

document.getElementById('cultures').addEventListener('change', changeLocale);
function changeLocale(): void {
    let culture: string = (document.getElementById('cultures') as HTMLSelectElement).value;
    if (culture !== 'en') {
        loadCultureFiles(culture);
    }
    timepicker.locale = culture;
}

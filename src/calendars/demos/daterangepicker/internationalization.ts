import { Ajax, loadCldr } from '@syncfusion/ej2-base';
import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
import { ChangedEventArgs } from '../../src/calendar/calendar';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, EmitType, L10n, setCulture } from '@syncfusion/ej2-base';

//Based on the locale object to set the localized text for today button and placeholder
L10n.load({
    'ja': {
        'daterangepicker': {
            placeholder: '範囲を選択',
            startLabel: '開始日',
            endLabel: '終了日',
            applyText: '適用',
            cancelText: 'キャンセル',
            selectedDays: '選択した日数',
            days: '日々',
            customRange: 'カスタムレンジ'
        }
    },
    'de': {
        'daterangepicker': {
            placeholder: 'Einen Bereich auswählen',
            startLabel: 'Anfangsdatum',
            endLabel: 'Enddatum',
            applyText: 'Sich bewerben',
            cancelText: 'Stornieren',
            selectedDays: 'Ausgewählte Tage',
            days: 'Tage',
            customRange: 'benutzerdefinierten Bereich'
        }
    },
    'vi': {
        'daterangepicker': {
            placeholder: 'Chọn một phạm vi',
            startLabel: 'ngày bắt đầu',
            endLabel: 'ngày cuối',
            applyText: 'Ứng dụng',
            cancelText: 'Hủy',
            selectedDays: 'Những ngày được chọn',
            days: 'Ngày',
            customRange: 'phạm vi tùy chỉnh'
        }
    },
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
/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    locale: 'de'
});
daterangepicker.appendTo('#daterangepicker');

document.getElementById('cultures').addEventListener('change', changeLocale);
function changeLocale(): void {
    let culture: string = (document.getElementById('cultures') as HTMLSelectElement).value;
    if (culture !== 'en') {
        loadCultureFiles(culture);
    }
    daterangepicker.locale = culture;
}

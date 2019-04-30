import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
import { loadCldr, Ajax, L10n } from '@syncfusion/ej2-base';

function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('/node_modules/cldr-data/main/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('/node_modules/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}

L10n.load({
    'de': {
      'numerictextbox': { incrementTitle: 'Wert erhöhen', decrementTitle: 'Dekrementwert'}
    }
});

let numeric7: NumericTextBox = new NumericTextBox({
    value: 100,
    locale: 'de',
    floatLabelType: "Auto"
});
numeric7.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    value: 0.5,
    step: 0.01,
    format: 'p2',
    locale: 'de',
    floatLabelType: "Auto"
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    value: 100,
    format: 'c2',
    currency: 'EUR',
    locale: 'de',
    floatLabelType: "Auto"
});
currency.appendTo('#currency');

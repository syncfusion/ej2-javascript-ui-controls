import { NumericTextBox } from './../../src/numerictextbox/numerictextbox';
import { Ajax, loadCldr } from '@syncfusion/ej2-base';
import { FormValidator, FormValidatorModel } from './../../src/form-validator';;

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
//loadCultureFiles('en');
//loadCultureFiles('de');



let numeric7: NumericTextBox = new NumericTextBox({
    value: 100,
    format: 'c2',
    floatLabelType: "Auto"
});
numeric7.appendTo('#numeric7');

let numeric8: NumericTextBox = new NumericTextBox({
    value: 0.5,
    step: 0.01,
    format: 'p2',
    floatLabelType: "Auto"
});
numeric8.appendTo('#numeric8');

let numeric10: NumericTextBox = new NumericTextBox({
    value: 10000,
    floatLabelType: "Auto"
});
numeric10.appendTo('#numeric10');

let numeric11: NumericTextBox = new NumericTextBox({
    value: 100,
    format: 'c2',
    currency: 'EUR',
    floatLabelType: "Auto"
});
numeric11.appendTo('#numeric11');

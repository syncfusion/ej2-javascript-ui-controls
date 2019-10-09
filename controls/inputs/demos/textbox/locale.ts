import { TextBox } from '../../src/textbox/textbox';
import { L10n } from '@syncfusion/ej2-base';
/**
 * Default TextBox sample
 */
L10n.load({
    'fr-CH': {
        'textbox' : {
            "placeholder" : "fichier est trop petite"
        }
    },
    'de': {
        'textbox' : {
            "placeholder" : "Indtast et navn"
        }
    }
});
let inputObj: TextBox = new TextBox({
       // placeholder: 'Enter a name',
       floatLabelType: 'Auto',
       locale: 'fr-CH'
});
inputObj.appendTo('#default');

document.getElementById('btn').onclick = function() {
    inputObj.locale = 'de';
    inputObj.dataBind();
}

/**
 * Sample demonstrates custom characters, prompt character and floating label support.
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask1: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 PM",
    placeholder: "10:25 PM",
    customCharacters: {
        P: 'P,A,p,a',
        M: 'M,m'
    },
    floatLabelType: "Auto"
});
mask1.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "99 999 9999",
    placeholder: "94 888 3232",
    promptChar: "~",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "8973 8883 6633 8837",
	promptChar: "#",
    floatLabelType: "Auto"
});
mask3.appendTo('#mask3');
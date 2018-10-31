/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask1: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Mouse Mode",
    value: "2222 22",
    floatLabelType: "Auto"
});
mask1.appendTo('#mask1');
let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Touch Mode",
    value: "2222 22",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');


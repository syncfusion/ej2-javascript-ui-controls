/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask1: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Enter Credit/Debit Card Number",
    value: "2222 222",
    floatLabelType: "Auto",
    showClearButton: true
});
mask1.appendTo('#mask1');


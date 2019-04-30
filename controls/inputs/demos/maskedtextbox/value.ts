/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask1: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999 9999 9999 9999",
    placeholder: "Enter Card Number",
    value: "2222 2222 3213 2142 4124 2412 1241",
    floatLabelType: "Auto",
    showClearButton: false
});
mask1.appendTo('#mask1');

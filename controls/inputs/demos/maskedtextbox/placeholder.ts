/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: "+1(999) 9999-999",
    value: "00000000000",
    placeholder: "Enter phone number",
    floatLabelType: "Always"
});
mask.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Enter Credit/Debit Card Number",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 LL",
    value: "10:20 AM",
    placeholder: "Enter time value",
    floatLabelType: "Never"
});
mask3.appendTo('#mask3');

let mask4: MaskedTextBox = new MaskedTextBox({
    mask: ">LL / LLL",
    placeholder: "Enter country name",
    floatLabelType: "Auto"
});
mask4.appendTo('#mask4');

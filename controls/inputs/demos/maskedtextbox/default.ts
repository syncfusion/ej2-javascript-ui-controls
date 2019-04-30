/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: "+1(999) 9999-999",
    placeholder: "Enter phone number",
    floatLabelType: "Auto"
});
mask.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Enter Credit/Debit Card Number",
    value: "2222 222",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 LL",
    placeholder: "Enter time value",
    floatLabelType: "Auto"
});
mask3.appendTo('#mask3');

let mask4: MaskedTextBox = new MaskedTextBox({
    mask: ">LL / LLL",
    placeholder: "Enter country name",
    floatLabelType: "Auto"
});
mask4.appendTo('#mask4');

let mask5: MaskedTextBox = new MaskedTextBox({
    mask: "99/>A<AA/9999",
    placeholder: "Enter date value",
    floatLabelType: "Auto"
});
mask5.appendTo('#mask5');

let mask6: MaskedTextBox = new MaskedTextBox({
    mask: ">A|AA 9999",
    placeholder: "Enter date & year",
    floatLabelType: "Never"
});
mask6.appendTo('#mask6');

let mask7: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 \\AM",
    floatLabelType: "Auto"
});
mask7.appendTo('#mask7');
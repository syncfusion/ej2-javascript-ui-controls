/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: "+1(999) 9999-999",
    placeholder: "Enter phone number",
    enableRtl: true,
    floatLabelType:"Never"
});
mask.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    placeholder: "Enter Credit/Debit Card Number",
    enableRtl: true,
    promptChar:"#",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 LL",
    placeholder: "Enter time value",
    enableRtl: true,
    floatLabelType:"Always"
});
mask3.appendTo('#mask3');

let mask4: MaskedTextBox = new MaskedTextBox({
    mask: ">LL / LLL",
    placeholder: "Enter country name",
	enableRtl: true,
    floatLabelType: "Auto"
});
mask4.appendTo('#mask4');

let mask5: MaskedTextBox = new MaskedTextBox({
    mask: "99/>A<AA/9999",
    placeholder: "Enter date value",
	enableRtl: true,
    floatLabelType: "Auto"
});
mask5.appendTo('#mask5');

let mask6: MaskedTextBox = new MaskedTextBox({
    mask: ">A|AA 9999",
    placeholder: "Enter date & year",
	enableRtl: true,
    floatLabelType: "Auto"
});
mask6.appendTo('#mask6');

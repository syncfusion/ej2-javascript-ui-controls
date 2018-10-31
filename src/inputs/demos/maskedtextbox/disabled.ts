/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: "+1(999) 9999-999",
    enabled: false,
    floatLabelType: "Auto"
});
mask.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999 9999 9999",
    value: "2222 22",
    enabled:false,
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 LL",
    placeholder: "Enter time value",
    enabled:false,
    floatLabelType: "Auto"
});
mask3.appendTo('#mask3');

let mask4: MaskedTextBox = new MaskedTextBox({
    mask: ">LL / LLL",
    placeholder: "Enter country name",
	floatLabelType: "Always",
	enabled:false
});
mask4.appendTo('#mask4');
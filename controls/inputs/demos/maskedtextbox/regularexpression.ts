/**
 * MaskedTextboxes with Regular expression support
 */

import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask1: MaskedTextBox = new MaskedTextBox({
    mask: "[0-2][0-5][0-5].[0-2][0-5][0-5].[0-2][0-5][0-5].[0-2][0-5][0-5]",
    placeholder: "233.244.122.134",
    floatLabelType: "Auto"
});
mask1.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "[0-1][0-9]:[0-6][0-9]\\[PM\\]",
    placeholder: "10:20[PM]",
    floatLabelType: "Auto"
});
mask2.appendTo('#mask2');
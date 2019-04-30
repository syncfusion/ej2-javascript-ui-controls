import { MaskedTextBox } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: '0000',
    value: '1234',
    placeholder: "Enter pin",
    floatLabelType: "Always",
    width: '400px'
});

mask.appendTo('#mask1');

let mask2: MaskedTextBox = new MaskedTextBox({
    mask: "9999 9999",
    placeholder: "Enter value",
    floatLabelType: "Never",
    width: '400px'
});
mask2.appendTo('#mask2');

let mask3: MaskedTextBox = new MaskedTextBox({
    mask: "99:99 LL",
    placeholder: "Enter time",
    floatLabelType: "Auto",
    width: '400px'
});
mask3.appendTo('#mask3');

let mask4: MaskedTextBox = new MaskedTextBox({
    mask: ">LL / LLL",
    placeholder: "Enter country name",
    floatLabelType: "Always",
    width: '400px'
});
mask4.appendTo('#mask4');
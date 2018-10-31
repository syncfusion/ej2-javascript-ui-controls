/**
 * MaskedTextboxes with MSDN masking elements
 */

import { MaskedTextBox, MaskChangeEventArgs, MaskFocusEventArgs } from '../../src/maskedtextbox/maskedtextbox/maskedtextbox';

let mask: MaskedTextBox = new MaskedTextBox({
    mask: "(999) 9999-999",
    created: function(args: Object) {
        addEventLog('MaskedTextBox has been created.');
    },
    change: function(args: MaskChangeEventArgs) {
        addEventLog('MaskedTextBox value is changed.');
    },
    destroyed: function(args: Object) {
        addEventLog('MaskedTextBox has been destroyed.');
    },
    focus: function(args: MaskFocusEventArgs) {
        addEventLog('MaskedTextBox is in focused state.');
    }
});
mask.appendTo('#mask1');

function addEventLog(text: string) {
    let clog = document.getElementById('events');
    clog.innerHTML = text + '\n' + clog.innerHTML;
}
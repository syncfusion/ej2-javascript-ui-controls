/**
 * Multiple Dialogs sample
 */

import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'First Dialog',
    target: document.body,
    animationSettings: { effect: 'None' },
    showCloseIcon: true,
    height: 260,
    content: 'This is the first dialog and acts as a parent dialog, you can open the second (child) dialog by clicking "Next".',
    width: 330,
    buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'Next', isPrimary: true }
    }]
});
dialogObj.appendTo('#defaultDialog');

let dialogObj2: Dialog = new Dialog({
    header: 'Second Dialog',
    target: document.body,
    animationSettings: { effect: 'None' },
    height: 217,
    visible: false,
    content: 'This is the second dialog and act as a child dialog.',
    showCloseIcon: true,
    width: 285,
    buttons: [{ click: dlg2ButtonClick, buttonModel: { content: 'Close', isPrimary: true }}]
});
dialogObj2.appendTo('#secondDialog');

document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};

// Navigate to corresponding link
function dlgButtonClick(): void {
    dialogObj2.show();
}

function dlg2ButtonClick(): void {
    dialogObj2.hide();
}

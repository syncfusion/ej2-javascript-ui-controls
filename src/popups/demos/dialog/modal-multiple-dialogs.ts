/**
 * Multiple Dialogs sample
 */
import { Dialog } from '../../src/dialog/dialog';

let Docdialog: Dialog = new Dialog({
    header: 'Dialog 1',
    content: "Are you sure you want to permanently delete all of these items?",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: dlgBtnClick }, { buttonModel: { content: 'No' }, click: dlgBtnClick }],
    target: '.target',
    height: 'auto',
    width: '300px',
    animationSettings: { effect: 'Zoom' },
    created: onDialogCreate
});
Docdialog.appendTo('#Docdialog');

let MessageDialog: Dialog = new Dialog({
    header: 'Dialog 2',
    content: "MessageDialog content",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: secondModalDlgBtnClick }],
    target: '.target',
    height: 'auto',
    width: '300px',
    isModal: true,
    animationSettings: { effect: 'Zoom' },
    visible: false,
    created: onDialogCreate
});
MessageDialog.appendTo('#MessageDialog');

let lookDialog: Dialog = new Dialog({
    header: 'Dialog 3',
    content: "lookDialog content",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: firstModalBtnClick }],
    target: '.target',
    height: 'auto',
    width: '300px',
    isModal: true,
    animationSettings: { effect: 'Zoom' },
    visible: false,
    created: onDialogCreate
});
lookDialog.appendTo('#lookDialog');

document.getElementById('openBtn').onclick = (): void => {
    Docdialog.show();
};
function dlgBtnClick() {
  Docdialog.hide();
  lookDialog.show();
}

function firstModalBtnClick() {
    MessageDialog.show();
}

function secondModalDlgBtnClick() {
  MessageDialog.hide();
}

function onDialogCreate(args: any) {
    this.btnObj[0].element.setAttribute('id', this.element.id +'_Button');
}
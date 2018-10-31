/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete Multiple Items',
    content: "Are you sure you want to permanently delete all of these items?",
    // content: "Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: '#target',
    isModal: true,
    height: 'auto',
    width: '300px',
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');

document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
function btnClick() {
    dialogObj.hide();
}
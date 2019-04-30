/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    content: "Are you sure you want to permanently delete all of these items?",
    showCloseIcon: false,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,
    height: '150px',
    isModal: true,
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
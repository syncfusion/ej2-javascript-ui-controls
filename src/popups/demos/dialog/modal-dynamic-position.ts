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
    height: '200px',
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

document.getElementById('okBtn').onclick = (): void => {
    var Xvalue = (<HTMLInputElement>document.getElementById('Xnumber')).value;
    var Yvalue = (<HTMLInputElement>document.getElementById('Ynumber')).value;
    dialogObj.position.X = parseInt(Xvalue);
    dialogObj.position.Y = parseInt(Yvalue);
};
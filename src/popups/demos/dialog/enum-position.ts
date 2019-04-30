/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete Multiple Items',
    content: "Are you sure you want to permanently delete all of these items?",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: '#target',
    height: 'auto',
    width: '300px',
    isModal: true,
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
    let Xvalue = (<any>document.getElementById('Xnumber')).value;
    let Yvalue = (<any>document.getElementById('Ynumber')).value;
    let Xparsing = +Xvalue;
    let Yparsing = +Yvalue;
    if (isNaN(Xparsing)) {
        Xparsing = Xvalue;
    }
    if (isNaN(Yparsing)) {
        Yparsing = Yvalue;
    }
    dialogObj.position.X = Xparsing;
    dialogObj.position.Y = Yparsing;
};
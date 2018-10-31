/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete Multiple Items',
    content: "Are you sure you want to permanently delete all of these items?",    
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,    
    width: '300px',
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');
document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
document.getElementById('addBtn').onclick = (): void => {
    dialogObj.content='Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?';    
    dialogObj.position={ X: 'center', Y: 'center' };
};
function btnClick() {
    dialogObj.hide();
}
/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete Multiple Items',
    content: "<select id='positionselect'><option value='Left_Top'>Left_Top</option><option value='Center_Top'>Center_Top</option><option value='Right_Top'>Right_Top</option><option value='Left_Bottom'>Left_Bottom</option><option value='Center_Bottom'>Center_Bottom</option><option value='Right_Bottom'>Right_Bottom</option><option value='Left_Center'>Left_Center</option><option value='Center_Center'>Center_Center</option><option value='Right_Center'>Right_Center</option></select>",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,    
    position: { X: 'left', Y: 'top' },
    height: 'auto',
    width: '300px',
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');
document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
document.getElementById('positionselect').onchange = function (event: any) {
    switch (event.currentTarget.value) {
        case 'Left_Top':
            dialogObj.position = { X: 'left', Y: 'top' };
            break;
        case 'Right_Top':
            dialogObj.position = { X: 'right', Y: 'top' };
            break;
        case 'Center_Top':
            dialogObj.position = { X: 'center', Y: 'top' };
            break;
        case 'Left_Center':
            dialogObj.position = { X: 'left', Y: 'center' };
            break;
        case 'Right_Center':
            dialogObj.position = { X: 'right', Y: 'center' };
            break;
        case 'Center_Center':
            dialogObj.position = { X: 'center', Y: 'center' };
            break;
        case 'Left_Bottom':
            dialogObj.position = { X: 'left', Y: 'bottom' };
            break;
        case 'Right_Bottom':
            dialogObj.position = { X: 'right', Y: 'bottom' };
            break;
        case 'Center_Bottom':
            dialogObj.position = { X: 'center', Y: 'bottom' };
            break;
    }
};
function btnClick() {
    dialogObj.hide();
}
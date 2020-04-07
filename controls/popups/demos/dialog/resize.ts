/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete multiple items',
    content: "Are you sure you want to permanently delete all of these items?",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,
    height: '200px',
    enableResize: true,
    resizeStart: resizeBeginFun,
    resizeStop: resizeEndFun,
    resizing: resizeFun,
    width: '300px',
    allowDragging: true,
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');

let dialogObj1: Dialog = new Dialog({
    header: 'Second dialog',
    content: "Second dialog",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,
    height: '200px',
    width: '300px',
    enableResize: true,
    resizeStart: resizeBeginFun1,
    resizeStop: resizeEndFun1,
    resizing: resizeFun1,
    allowDragging: true,
    animationSettings: { effect: 'Zoom' },
});
dialogObj1.appendTo('#dialog1');

document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
function btnClick() {
    dialogObj.hide();
}

function resizeFun(args: any) {
    console.log('first dialog');
}

function resizeFun1(args: any) {
    console.log('Second dialog');
}

function resizeBeginFun(args: any) {
    console.log('first dialog start');
}

function resizeBeginFun1(args: any) {
    console.log('Second dialog start');
}

function resizeEndFun(args: any) {
    console.log('first dialog end');
}

function resizeEndFun1(args: any) {
    console.log('Second dialog end');
}
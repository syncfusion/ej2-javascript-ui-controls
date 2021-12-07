/**
 * Toast
 */
import { ToastUtility } from '../../src/toast/index';

document.getElementById('openBtn').onclick = (): void => {
    ToastUtility.show({
        title: 'Toast Title',
        content: 'Toast Content',
        timeOut: 0,
        showCloseButton: true,
        click: toastClick,
        buttons: [{
            model: { content: 'Button' }
        }],
        close: toastClose
    })
};

function toastClick() {
    console.log('toast click');
}

function toastClose() {
    console.log('toast closed');
 }
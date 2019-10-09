/**
 * Dialog
 */
import { Toast } from '../../src/toast/index';

let toast: Toast = new Toast ( {
    title: 'Sample Title',
    content: '#toast-content-template',
    extendedTimeout: 2000,
    timeOut: 5000,
    showCloseButton: true,
    showProgressBar: true,
    icon: 'e-info',
    buttons: [{
        model: { content: 'close Toast' },
        click: btnClick
    }]
});
toast.appendTo('#flex-container');
toast.show();



document.getElementById('openBtn').onclick = (): void => {
    toast.show( {content: "Sample Content"});
};
function btnClick() {
    toast.hide();
}
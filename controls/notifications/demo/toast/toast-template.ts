/**
 * Dialog
 */
import { Toast } from '../../src/toast/index';

let toast: Toast = new Toast ( {
    title: 'Sample Title',
    content: '#toast_content_template',
    extendedTimeout: 2000,
    timeOut: 5000,
    showProgressBar: true,
   // template: '#toast-template',
    icon: 'e-info',
    beforeOpen: onBeforeOpen,
});
toast.appendTo('#flex-container');

document.getElementById('openBtn').onclick = (): void => {
    toast.show();
};

function onBeforeOpen():void {
let audio = new Audio("toast_sound.mp3");
audio.play();
}
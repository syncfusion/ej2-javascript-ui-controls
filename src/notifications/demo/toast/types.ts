/**
 * Dialog
 */
import { Toast, ToastModel } from '../../src/toast/index';

let toasts: ToastModel[] = [
    { title: 'Warning !', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-infoIcon' },
    { title: 'Success !', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-infoIcon' },
    { title: 'Error !', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-infoIcon' },
    { title: 'Information !', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-infoIcon' } ];
let toastFlag: number = 0;

let toast: Toast = new Toast ( {
    showCloseButton: true,
    showProgressBar: true,
    position: {X: 'Right'}
});
toast.appendTo('#flex-container');
toast.show(toasts[0]);
toast.show(toasts[1]);
toast.show(toasts[2]);
toast.show(toasts[3]);
toastFlag = 4;
if (toastFlag === (toasts.length)) {
    toastFlag = 0;
}



document.getElementById('openBtn').onclick = (): void => {
    toast.show( toasts[toastFlag]);
    ++toastFlag;
    if (toastFlag === (toasts.length)) {
        toastFlag = 0;
    }
};
function btnClick() {
    toast.hide();
}

document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};
document.getElementById('btn_boot').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/bootstrap.css';
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/fabric.css';
};
document.getElementById('btn_hContract').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/highcontrast.css';
};
document.getElementById('btn_material').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/material.css';
};

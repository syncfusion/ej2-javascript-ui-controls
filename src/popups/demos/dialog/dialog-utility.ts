/**
 * Dialog Utility
 */
import {  DialogUtility } from '../../src/dialog/dialog';
document.getElementById('alertdlg').onclick= function(): void {
    DialogUtility.alert('This is an Alert Dialog!');
};

document.getElementById('confirmdlgbtn').onclick= function(): void {
    DialogUtility.confirm('This is a Confirmation Dialog!');
};

document.getElementById('alertdlg1').onclick= function(): void {
    DialogUtility.alert({
        title: 'Alert Dialog',
        showCloseIcon: true,
        closeOnEscape: true,
        content: 'This is an Alert Dialog!',
        okButton: {  text: 'OK', click: okClick }
    });
};
function okClick(): void {
    alert('you clicked OK button');
}

document.getElementById('confirmdlgbtn1').onclick= function(): void {
    DialogUtility.confirm({
        title: 'Confirmation Dialog',
        showCloseIcon: true,
        closeOnEscape: true,
        content: "This is a Confirmation Dialog!",
        okButton: {  text: 'OK', click: okClick },
        cancelButton: {  text: 'Cancel', click: cancelClick }
    });
};
function cancelClick(): void {
    alert('you clicked Cancel button');
}
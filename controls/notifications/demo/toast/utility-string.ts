/**
 * Dialog
 */
import { ToastUtility } from '../../src/toast/index';

document.getElementById('info').onclick = (): void => {
    ToastUtility.show('Toast Content Error Message', 'Information', 5000);
};

document.getElementById('success').onclick = (): void => {
    ToastUtility.show('Toast Content Error Message', 'Success', 5000);
};
document.getElementById('error').onclick = (): void => {
    ToastUtility.show('Toast Content Error Message', 'Error', 5000);
};
document.getElementById('warning').onclick = (): void => {
    ToastUtility.show('Toast Content Error Message', 'Warning', 5000);
};
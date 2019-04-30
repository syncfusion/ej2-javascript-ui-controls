/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'الحوار',
    content: "لون الجسم، وعجلات 20 بوصة، سقف قابلة للطي النسيج،وغطاء محرك السيارة التي تسيطر عليها كهربائيا طوانات م تصنيف حصانا كيلووحسناإلغاء",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: document.body,
    height: '200px',
    width: '300px',
    enableRtl: true,
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
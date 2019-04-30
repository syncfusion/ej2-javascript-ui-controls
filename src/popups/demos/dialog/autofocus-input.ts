/**
 * Dialog
 */
import { Dialog } from './../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Primary Button Action',
    content: "<form><div class='form-group'><label for='email'>Email address:</label>" +
    "<input type='email' value='user@gmail.com' class='form-control' id='email'>" +
    "</div><div class='form-group'><label for='pwd'>Password:</label>" +
    "<input type='password' autofocus='true' class='form-control' id='pwd'>" +
    "</div><div class='form-group'><label for='comment'>Comment:</label>" +
    "<textarea class='form-control' rows='5' id='comment'></textarea>" +
    "</div></form>",
    showCloseIcon: true,
    visible: false,
    buttons: [{
        buttonModel: { isPrimary: true, content: 'Yes' }, click: function () {
            this.hide();
        }
    }, { buttonModel: { content: 'No' } }],
    target: document.querySelector('body'),
    width: '400px',
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');
document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
import { Slider, SliderType } from '../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';


// Render the alert Dialog
let alertDialogObj: Dialog = new Dialog({
    header: "Slider",
    content: '<div id="default"></div>',
    showCloseIcon: false,
    buttons: [{
        click: alertDlgBtnClick, buttonModel: { content: 'Dismiss', cssClass: 'e-flat', isPrimary: true }
    }],
    closeOnEscape: false, width: '250px',
    target: document.getElementById('target'),
    animationSettings: { effect: 'None' },
    visible: false
});
alertDialogObj.appendTo('#alertDialog');

let defaultObj: Slider;

// Create Button to open the alert Dialog
let alertBtn: Button = new Button({});
alertBtn.appendTo('#alertBtn');
document.getElementById('alertBtn').onclick = (): void => {
    alertDialogObj.show();
    //Rendering slider
    if (!defaultObj) {
        defaultObj = new Slider({
            min: 10,
            value: 30,
            max: 90,
            step: 5,
            ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true },
            showButtons: true,
            tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' }
        });
        defaultObj.appendTo('#default');
    }
};

function alertDlgBtnClick(): void {
    alertDialogObj.hide();
}



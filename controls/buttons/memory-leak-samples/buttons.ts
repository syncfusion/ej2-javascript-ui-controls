/**
 * Button Default Sample
 */
import { Button } from '../src/button/button';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let btnObj: Button;
let btnObj1: Button;

document.getElementById('render').addEventListener('click', renderButton);
document.getElementById('destroy').addEventListener('click', destroyButton);

function renderButton(): void {
    btnObj = new Button({ isPrimary: true, content: 'Click Me' });
    btnObj.appendTo('#button1');
    btnObj1 = new Button({cssClass: 'e-flat'});
    btnObj1.appendTo('#button2');
    
}

document.getElementById('buttonAction').onclick = (): void => {
    alert('Button Clicked!');
};

function destroyButton(): void {
    if (btnObj) {
        btnObj.destroy();
        btnObj = null;
    }
    if (btnObj1) {
        btnObj1.destroy();
        btnObj1 = null;
    }
}

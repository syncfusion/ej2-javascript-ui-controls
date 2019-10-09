import { ColorPicker, OpenEventArgs } from './../../../src/color-picker/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

/**
 * Value switching ColorPicker sample
 */
let colorPicker: ColorPicker = new ColorPicker({
    cssClass: 'e-hide-switchable-value',
    open: (args: OpenEventArgs): void => {
        args.element.addEventListener('click', switchValue);
    },
    beforeClose: (args: OpenEventArgs): void => {
        args.element.removeEventListener('click', switchValue);
    }
}, '#picker');

function switchValue(e: MouseEvent): void {
    let trgt: HTMLElement = e.target as HTMLElement;
    if (trgt.classList.contains('e-value-switch-btn')) {
        if (trgt.parentElement.querySelector('.e-hex')) {
            colorPicker.cssClass = 'e-hide-hex-value';
        }
        if (trgt.previousElementSibling.children[0].querySelector('.e-float-text').textContent === 'R') {
            colorPicker.cssClass = 'e-hide-switchable-value';
        }
    }
}
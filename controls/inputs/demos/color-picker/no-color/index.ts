import { ColorPicker, ColorPickerEventArgs } from './../../../src/color-picker/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let preview: HTMLElement = document.getElementById('preview');

/**
 * No color sample
 */
let colorPicker: ColorPicker = new ColorPicker(
    {
        mode: 'Palette',
        modeSwitcher: false,
        showButtons: false,
        noColor: true,
        value: '#ef9a9a',
        change: (args: ColorPickerEventArgs): void => {
            preview.style.backgroundColor = args.currentValue.hex;
            if (args.currentValue.hex) {
                preview.textContent = args.currentValue.hex;
            } else {
                preview.textContent = 'No color';
            }
        }
    }
, '#picker');

preview.style.backgroundColor = '#ef9a9a';
preview.textContent = '#ef9a9a';
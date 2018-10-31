import { ColorPicker } from './../../../src/color-picker/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

/**
 * Color Palette sample
 */
new ColorPicker(
    {
        mode: 'Palette',
        modeSwitcher: false,
        showButtons: false,
        value: '#90caf9'

    },
    '#palette');
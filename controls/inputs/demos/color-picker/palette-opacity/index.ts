import { ColorPicker } from './../../../src/color-picker/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let colorPicker: ColorPicker = new ColorPicker({
    inline: true,
    mode: 'Palette',
    showButtons: false,
    value: '#0450c2CC',
    presetColors: { 'custom': ['#0450c21a', '#0450c233', '#0450c24D', '#0450c266', '#0450c280', '#0450c299', '#0450c2B3', '#0450c2CC', '#0450c2E6', '#0450c2FF',
                    '#0080001a', '#00800033', '#0080004D', '#00800066', '#00800080', '#00800099', '#008000B3', '#008000CC', '#008000E6', '#008000FF'] }
}, '#picker');
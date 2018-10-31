import { ColorPicker, ColorPickerEventArgs, PaletteTileEventArgs } from './../../../src/color-picker/index';
import { createElement, enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

/**
 * Flat Color Picker sample
 */
let colorPicker: ColorPicker = new ColorPicker(
    {
        mode: 'Palette',
        inline: true,
        columns: 5,
        modeSwitcher: false,
        showButtons: false,
        presetColors: {
            'custom1': ['#f0d0c9', '#e2a293', '#d4735e', '#65281a',
                '#eddfda', '#dcc0b6', '#cba092', '#7b4b3a',
                '#fcecd5', '#f9d9ab', '#f6c781', '#c87d0e',
                '#e1dca5', '#d0c974', '#a29a36', '#514d1b',
                '#c6d9f0', '#8db3e2', '#548dd4', '#17365d'],
            'custom2': ['#ffffff', '#292934', '#f3f2dc', '#d2533c',
                '#93a299', '#ad8f67', '#726056', '#4c5a6a',
                '#808da0', '#79463d', '#f2f2f2', '#e7e7ec',
                '#e7e5b9', '#f6dcd8', '#e9ecea', '#eee8e0',
                '#e4dedb', '#d8dde3', '#e5e8ec', '#e9d6d3'],
            'custom3': ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373',
                '#EF534F', '#F44436', '#E53934', '#D32E30', '#C62928',
                '#B71B1C', '#FF8A80', '#FF5252', '#FF1644', '#D50002',
                '#FCE4EB', '#F8BBD2', '#F48FB1', '#EF6190', '#EF3E7A',
                '#EC1965']
        },
        beforeTileRender: (args: PaletteTileEventArgs) => {
            args.element.classList.add('e-multiple-custom');
        },
        change: (args: ColorPickerEventArgs) => {
            document.body.style.backgroundColor = args.currentValue.hex;
        }
    },
    '#color-picker-flat');

/**
 * Flat Color Palette sample
 */
colorPicker = new ColorPicker(
    {
        mode: 'Palette',
        inline: true,
        columns: 5,
        showButtons: false,
        modeSwitcher: false,
        presetColors: {
            'custom': ['#f0d0c9', '#e2a293', '#d4735e', '#65281a',
                '#eddfda', '#dcc0b6', '#cba092', '#7b4b3a',
                '#fcecd5', '#f9d9ab', '#f6c781', '#c87d0e',
                '#e1dca5', '#d0c974', '#a29a36', '#514d1b',
                '#c6d9f0', '#8db3e2', '#548dd4', '#17365d']
        },
        beforeTileRender: (args: PaletteTileEventArgs) => {
            args.element.classList.add('e-custom-tiles');
            args.element.appendChild(createElement('span', { className: 'e-custom-selection' }));
        },
        change: (args: ColorPickerEventArgs) => {
            document.body.style.backgroundColor = args.currentValue.hex;
        }
    },
    '#color-palette-flat');
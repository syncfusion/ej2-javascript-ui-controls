import { ColorPicker, BeforeOpenCloseEventArgs } from './../../../src/color-picker/index';
import { enableRipple, closest } from '@syncfusion/ej2-base';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';

enableRipple(true);

/**
 * Value switching ColorPicker sample
 */
let colorPicker: ColorPicker = new ColorPicker(
    {
        beforeClose: (args: BeforeOpenCloseEventArgs) => {
            if (args.event.target === dropdownBtn.element || closest(args.event.target as Element, '#dropdownbtn-popup')) {
                args.cancel = true;
            }
        }
    },
    '#picker');

let items: ItemModel[] = [
    {
        text: 'Hide value'
    },
    {
        text: 'Hide-hex value'
    },
    {
        text: 'Hide-switchable value'
    },
    {
        text: 'Hide value-switcher'
    },
    {
        text: 'Show value'
    }
]

let dropdownBtn: DropDownButton = new DropDownButton({
    content: 'Hide input options',
    items: items,
    select: (args: MenuEventArgs): void => {
        switch (args.item.text) {
            case 'Hide value':
                colorPicker.cssClass = 'e-hide-value'
                break;
            case 'Hide-hex value':
                colorPicker.cssClass = 'e-hide-hex-value'
                break;
            case 'Hide-switchable value':
                colorPicker.cssClass = 'e-hide-switchable-value e-hide-valueswitcher'
                break;
            case 'Hide value-switcher':
                colorPicker.cssClass = 'e-hide-valueswitcher'
                break;
            case 'Show value':
                colorPicker.cssClass = 'e-show-value'
                break;
        }
    }
}, '#dropdownbtn');
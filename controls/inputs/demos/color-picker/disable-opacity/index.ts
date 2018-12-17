import { ColorPicker, BeforeOpenCloseEventArgs } from './../../../src/color-picker/index';
import { enableRipple, closest } from '@syncfusion/ej2-base';
import { ItemModel, DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';

enableRipple(true);

/**
 * Default ColorPicker sample
 */
let colorPicker: ColorPicker = new ColorPicker(
    { 
        enableOpacity: false,
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
        text: 'Hide hex and value-switcher'
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
            case 'Hide hex and value-switcher':
                colorPicker.cssClass = 'e-hide-valueswitcher e-hide-hex-value'
                break;
            case 'Show value':
                colorPicker.cssClass = 'e-show-value'
                break;
        }
    }
}, '#dropdownbtn');

document.getElementById('material').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/material.css');
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/fabric.css');
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/bootstrap.css');
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/highcontrast.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('materialdark').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/material-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('bootstrapdark').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/bootstrap-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('fabricdark').onclick = (e: Event) => {
    document.getElementById('theme').setAttribute('href', './../theme-files/fabric-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
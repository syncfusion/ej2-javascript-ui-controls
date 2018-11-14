/**
 * Split Button Default Sample
 */
import { SplitButton } from '../../../src/split-button/index';
import { MenuEventArgs, ItemModel } from '../../../src/common/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let data: ItemModel[] = [
    {
        text: 'Autosum'
    },
    {
        text: 'Average'
    },
    {
        text: 'Count numbers',
    },
    {
        text: 'Min'
    },
    {
        text: 'Max'
    }
];

let btnObj1: SplitButton = new SplitButton({
    items: data,
    content: 'Autosum'
});
btnObj1.appendTo('#textbtn');

let btnObj2: SplitButton = new SplitButton({
    items: data,
    content: 'Autosum',
    iconCss: 'e-icons e-sum',
    beforeItemRender: (args: MenuEventArgs) => {
        if (args.item.text === 'Count numbers') {
            args.element.classList.add('e-disabled');
        }
    }
});
btnObj2.appendTo('#icontextbtn');

let btnObj3: SplitButton = new SplitButton({
    items: data,
    content: 'Autosum',
    iconCss: 'e-icons e-sum',
    disabled: true
});
btnObj3.appendTo('#disabledbtn');

let btnObj4: SplitButton = new SplitButton({
    items: data,
    content: 'Autosum',
    iconCss: 'e-icons e-sum',
    enableRtl: true
});
btnObj4.appendTo('#rtlbtn');

document.getElementById('material').onclick = (e: Event) => {
    enableRipple(true);
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('fabric').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
    document.body.style.backgroundColor = 'black';
};
import { ProgressButton } from '../../../src/progress-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

new ProgressButton({ content: 'Spin Left' }, '#spinleft');
new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' }, isPrimary: true }, '#spinright');
new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' }, cssClass: 'e-success' }, '#spintop');
new ProgressButton({ content: 'Spin Down', spinSettings: { position: 'Bottom' }, cssClass: 'e-info' }, '#spinbottom');
new ProgressButton({ content: 'Spin Center', spinSettings: { position: 'Center' }, cssClass: 'e-danger' }, '#spincenter');

new ProgressButton({ content: 'Spin Left', cssClass: 'e-flat' }, '#flatspinleft');
new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' }, isPrimary: true, cssClass: 'e-flat' }, '#flatspinright');
new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' }, cssClass: 'e-success e-flat' }, '#flatspintop');
new ProgressButton({ content: 'Spin Down', spinSettings: { position: 'Bottom' }, cssClass: 'e-info e-flat' }, '#flatspinbottom');
new ProgressButton({ content: 'Spin Center', spinSettings: { position: 'Center' }, cssClass: 'e-danger e-flat' }, '#flatspincenter');

new ProgressButton({ content: 'Spin Left', cssClass: 'e-outline' }, '#outlinespinleft');
new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' }, isPrimary: true, cssClass: 'e-outline' }, '#outlinespinright');
new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' }, cssClass: 'e-success e-outline' }, '#outlinespintop');
new ProgressButton({ content: 'Spin Down', spinSettings: { position: 'Bottom' }, cssClass: 'e-info e-outline' }, '#outlinespinbottom');
new ProgressButton({ content: 'Spin Center', spinSettings: { position: 'Center' }, cssClass: 'e-danger e-outline' }, '#outlinespincenter');

new ProgressButton({ content: 'Spin Left', cssClass: 'e-round-corner' }, '#roundspinleft');
new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' }, isPrimary: true, cssClass: 'e-round-corner' }, '#roundspinright');
new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' }, cssClass: 'e-success e-round-corner' }, '#roundspintop');
new ProgressButton({ content: 'Spin Down', spinSettings: { position: 'Bottom' }, cssClass: 'e-info e-round-corner' }, '#roundspinbottom');
new ProgressButton({ content: 'Spin Center', spinSettings: { position: 'Center' }, cssClass: 'e-danger e-round-corner' }, '#roundspincenter');

new ProgressButton({ content: 'Spin Left', iconCss: 'e-icons e-caret', iconPosition: 'Right' }, '#iconspinleft');
new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' }, isPrimary: true, iconCss: 'e-icons e-caret' }, '#iconspinright');
new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' }, cssClass: 'e-success', iconCss: 'e-icons e-caret', iconPosition: 'Bottom' }, '#iconspintop');
new ProgressButton({ content: 'Spin Down', spinSettings: { position: 'Bottom' }, cssClass: 'e-info', iconCss: 'e-icons e-caret', iconPosition: 'Top' }, '#iconspinbottom');
new ProgressButton({ spinSettings: { position: 'Center' }, cssClass: 'e-danger', iconCss: 'e-icons e-caret' }, '#iconspincenter');


document.getElementById('material').onclick = (e: Event) => {
    enableRipple(true);
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
    document.body.style.backgroundColor = 'white';
    refresh();
};
document.getElementById('fabric').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    document.body.style.backgroundColor = 'white';
    refresh();
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    document.body.style.backgroundColor = 'white';
    refresh();
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    refresh();
};

function refresh() {
    setTimeout(() => {
        let ele: NodeListOf<HTMLButtonElement> = document.getElementById('control').getElementsByTagName('button');
        for (let i = 0; i < ele.length; i++) {
            (ele[i] as any).ej2_instances[0].refresh();
        }
    }, 1000);
}
import { ProgressButton } from '../../../src/progress-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

new ProgressButton({ content: 'Progress', duration: 2000, enableProgress: true, cssClass: 'e-hide-spinner' }, '#progress');
new ProgressButton({ content: 'Spin Left', duration: 2000 }, '#exp-left');
new ProgressButton({ content: 'Spin Right', duration: 2000, spinSettings: { position: 'Right' }, iconCss: 'e-icons e-caret' }, '#exp-right');
new ProgressButton({ content: 'Spin Up', duration: 2000, cssClass: 'e-vertical', spinSettings: { position: 'Top' } }, '#exp-up');
new ProgressButton({ content: 'Spin Down', duration: 2000, cssClass: 'e-vertical', spinSettings: { position: 'Bottom' } }, '#exp-down');

new ProgressButton({ content: 'Slide Left', duration: 2000, cssClass: 'e-primary', spinSettings: { position: 'Center' }, enableProgress: true, animationSettings: { duration: 500, effect: 'SlideLeft' } }, '#slide-left');
new ProgressButton({ content: 'Slide Right', duration: 2000, iconCss: 'e-icons e-caret', cssClass: 'e-success e-round-corner', enableProgress: true, spinSettings: { position: 'Center' }, animationSettings: { duration: 500, effect: 'SlideRight' } }, '#slide-right');
new ProgressButton({ content: 'Slide Up', duration: 2000, cssClass: 'e-warning', enableProgress: true, spinSettings: { position: 'Center' }, animationSettings: { duration: 500, effect: 'SlideUp' } }, '#slide-up');
new ProgressButton({ content: 'Slide Down', duration: 2000, cssClass: 'e-danger', spinSettings: { position: 'Center' }, enableProgress: true, animationSettings: { duration: 500, effect: 'SlideDown' } }, '#slide-down');

let contractProgressButton: ProgressButton = new ProgressButton({
    content: 'Contract', enableProgress: true, cssClass: 'e-success e-small',
    begin: () => {
        contractProgressButton.element.classList.add('e-contract');
        contractProgressButton.element.classList.add('e-round');
    },
    end: () => {
        contractProgressButton.element.classList.remove('e-round');
    }
}, '#contract');

new ProgressButton({ content: 'Zoom in', duration: 2000, spinSettings: { position: 'Center' }, cssClass: 'e-primary e-flat', enableProgress: true, iconCss: 'e-icons e-caret', animationSettings: { duration: 500, effect: 'ZoomIn' } }, '#zoomin');
new ProgressButton({ content: 'Zoom out', duration: 2000, spinSettings: { position: 'Center' }, cssClass: 'e-small', enableProgress: true, iconCss: 'e-icons e-caret', animationSettings: { duration: 500, effect: 'ZoomOut' } }, '#zoomout');


document.getElementById('material').onclick = (e: Event) => {
    enableRipple(true);
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
    document.body.style.backgroundColor = 'white';
    refresh()
};
document.getElementById('fabric').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    document.body.style.backgroundColor = 'white';
    refresh()
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    document.body.style.backgroundColor = 'white';
    refresh()
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    refresh()
};

function refresh() {
    setTimeout(() => {
        let ele: NodeListOf<HTMLButtonElement> = document.getElementById('frame').getElementsByTagName('button');
        for (let i = 0; i < ele.length; i++) {
            (ele[i] as any).ej2_instances[0].refresh();
        }
    }, 1000);
}
import { ProgressButton } from '../../../src/progress-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner' }, '#progress');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner', isPrimary: true }, '#progresspri');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-success' }, '#progresssuc');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-info' }, '#progressinfo');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-warning' }, '#progresswar');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-danger' }, '#progressdan');

new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-flat' }, '#flatprogress');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-flat', isPrimary: true }, '#flatprogresspri');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-success e-flat' }, '#flatprogresssuc');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-info e-flat' }, '#flatprogressinfo');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-warning e-flat' }, '#flatprogresswar');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-danger e-flat' }, '#flatprogressdan');

new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-outline' }, '#outlineprogress');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-outline', isPrimary: true }, '#outlineprogresspri');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-success e-outline' }, '#outlineprogresssuc');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-info e-outline' }, '#outlineprogressinfo');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-warning e-outline' }, '#outlineprogresswar');
new ProgressButton({ content: 'Progress', enableProgress: true, cssClass: 'e-hide-spinner e-danger e-outline' }, '#outlineprogressdan');


new ProgressButton({ content: 'Progress Top', enableProgress: true, cssClass: 'e-hide-spinner e-progress-top' }, '#progresstop');
new ProgressButton({ content: 'Progress Bottom', enableProgress: true, cssClass: 'e-hide-spinner e-progress-bottom', isPrimary: true }, '#progressbottom');
new ProgressButton({ content: 'Progress Up', enableProgress: true, iconCss: 'e-icons e-caret', iconPosition: 'Top', cssClass: 'e-hide-spinner e-success e-vertical' }, '#progressup');
new ProgressButton({ content: 'Progress Down', enableProgress: true, iconCss: 'e-icons e-caret', iconPosition: 'Bottom', cssClass: 'e-hide-spinner e-info e-vertical' }, '#progressdown');
new ProgressButton({ enableProgress: true, iconCss: 'e-icons e-caret', cssClass: 'e-hide-spinner e-warning e-round' }, '#roundprogress');



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
    document.body.style.color = 'white';
};
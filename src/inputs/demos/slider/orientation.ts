import { Slider, SliderType } from '../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Default Slider Orientation
 */

let defaultObj: Slider = new Slider({
    value: 30,
    tooltip: { placement: 'Before', isVisible: true ,showOn: 'Always'},
    orientation: 'Vertical',
});
defaultObj.appendTo('#default');

/**
 *  Range Slider with orientation 
 */

let rangeObj: Slider = new Slider({
    value: [30, 60],
    tooltip: { placement: 'After', isVisible: true ,showOn: 'Always'},
    type: 'Range',
    orientation: 'Vertical',
});
rangeObj.appendTo('#rangeslider');

/**
 *  MinRange Slider with orientation 
 */

let minrangetObj: Slider = new Slider({
    type: 'MinRange',
    value: 29,
    tooltip: { placement: 'Before', isVisible: true ,showOn: 'Always' },
    orientation: 'Vertical'
});
minrangetObj.appendTo('#minrange');


let button1: Button = new Button();
button1.appendTo('#ticks');

let toggleBtn: Button = new Button({ isToggle: true });
toggleBtn.appendTo('#disable');

let button8: Button = new Button();
button8.appendTo('#customvalue');

let button9: Button = new Button();
button9.appendTo('#customvaluewithlimit');

let button5: Button = new Button();
button5.appendTo('#material');

let button6: Button = new Button();
button6.appendTo('#fabric');

let button7: Button = new Button();
button7.appendTo('#bootstrap');

button1.element.onclick = (): void => {
    defaultObj.showButtons = true;
    rangeObj.showButtons = true;
    minrangetObj.showButtons = true;
    defaultObj.ticks = { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true };
    rangeObj.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    minrangetObj.ticks = { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true };
}

button8.element.onclick = (): void => {
    defaultObj.customValues = [10, 9, 90, 999, 908, 45, 89, 77, 78];
    defaultObj.value = 2;
    defaultObj.enabled=true;
    rangeObj.customValues = [1,3,5,6,88,90,2,4,7,9];
    rangeObj.value = [2, 7];
    rangeObj.enabled=true;
    minrangetObj.customValues = [2, 3, 6, 7, 9, 0, 37, 99, 20];
    minrangetObj.value = [3];
    minrangetObj.enabled=true;
}

button9.element.onclick = (): void => {
    defaultObj.limits ={ enabled: true, minStart: 2, minEnd: 4, maxStart: 5, maxEnd: 7 },
    rangeObj.limits = { enabled: true, minStart: 2, minEnd: 3, maxStart: 4, maxEnd: 5 },
    minrangetObj.limits =  { enabled: true, minEnd: 8}
}

toggleBtn.element.onclick = (): void => {
    if (toggleBtn.element.classList.contains('e-active')) {
        defaultObj.enabled = false;
        rangeObj.enabled = false;
        minrangetObj.enabled = false;
    } else {
        defaultObj.enabled = true;
        rangeObj.enabled = true;
        minrangetObj.enabled = true;
    }
}

document.getElementById('material').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/material.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/material.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/material.css');
    refresh();
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/fabric.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/fabric.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/fabric.css');
    refresh();
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/bootstrap.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/bootstrap.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/bootstrap.css');
    refresh();
};

function refresh() {
    defaultObj.refresh();
    rangeObj.refresh();
    minrangetObj.refresh();
}






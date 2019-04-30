import { Slider, SliderType } from '../../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Default Slider Orientation
 */

let defaultObj: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true },
    orientation: 'Vertical',
});
defaultObj.appendTo('#default');

/**
 *  Range Slider with orientation 
 */

let rangeObj: Slider = new Slider({
    value: [10, 30],
    tooltip: { placement: 'Before', isVisible: true },
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
    tooltip: { placement: 'Before', isVisible: true },
    orientation: 'Vertical'
});
minrangetObj.appendTo('#minrange');

let button: Button = new Button();
button.appendTo('#showbutton');

let button1: Button = new Button();
button1.appendTo('#bothticks');

let button2: Button = new Button();
button2.appendTo('#beforeticks');

let button3: Button = new Button();
button3.appendTo('#afterticks');

let button4: Button = new Button();
button4.appendTo('#disable');

let  hstyle= document.getElementsByClassName("e-slider-container");

for (let i:number=0;i < hstyle.length ;i++){
    hstyle[i].classList.add("e-slider-hover");
}

// button click event handler
button.element.onclick = (): void => {
    defaultObj.showButtons = true;
    rangeObj.showButtons = true;
    minrangetObj.showButtons = true;
}

button1.element.onclick = (): void => {
    defaultObj.ticks = { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true };
    rangeObj.ticks = { placement: 'Both', largeStep: 20, smallStep: 5, showSmallTicks: true };
    minrangetObj.ticks = { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true };
    defaultObj.tooltip = { placement: 'After', isVisible: true };
    rangeObj.tooltip = { placement: 'After', isVisible: true };
    minrangetObj.tooltip = { placement: 'After', isVisible: true };
}

button2.element.onclick = (): void => {
    defaultObj.ticks = { placement: 'Before', largeStep: 10, smallStep: 5, showSmallTicks: true };
    rangeObj.ticks = { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true };
    minrangetObj.ticks = { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true };
}

button3.element.onclick = (): void => {
    defaultObj.ticks = { placement: 'After', largeStep: 10, smallStep: 5, showSmallTicks: true };
    rangeObj.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    minrangetObj.ticks = { placement: 'After', largeStep: 15, smallStep: 5, showSmallTicks: true };
}

button4.element.onclick = (): void => {
    defaultObj.enabled = false;
    rangeObj.enabled = false;
    minrangetObj.enabled = false;
}

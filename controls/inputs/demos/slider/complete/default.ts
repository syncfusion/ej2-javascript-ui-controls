import { Slider, SliderType } from '../../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Default Slider sample
 */
let slider: Slider = new Slider({
    min: 0,
    max: 100,
    value: 45,
    tooltip: { placement: 'Before', isVisible: true }
});
slider.appendTo('#slider');

/**
 *  Slider with Range sample
 */

let slider1: Slider = new Slider({
    value: [25, 40],
    type: 'Range',
    tooltip: { placement: 'Before', isVisible: true }
});

/**
 * Slider with minrange sample
 */

slider1.appendTo('#slider-02');

let slider2: Slider = new Slider({
    type: 'MinRange',
    value: 32,
    tooltip: { placement: 'Before', isVisible: true }
});
slider2.appendTo('#slider-03');

let button: Button = new Button();
button.appendTo('#showbutton');

let button1: Button = new Button();
button1.appendTo('#bothticks');

let button2: Button = new Button();
button2.appendTo('#disable');

let button3: Button = new Button();
button3.appendTo('#afterticks');

let button4: Button = new Button();
button4.appendTo('#beforeticks');

let  hstyle= document.getElementsByClassName("e-slider-container");

for (let i:number=0;i < hstyle.length ;i++){
    hstyle[i].classList.add("e-slider-hover");
}

// button click event handler
button.element.onclick = (): void => {
    slider.showButtons = true;
    slider1.showButtons = true;
    slider2.showButtons = true;
}

button1.element.onclick = (): void => {
    slider.ticks = { placement: 'Both', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true };
}

button2.element.onclick = (): void => {
    slider.enabled = false;
    slider1.enabled = false;
    slider2.enabled = false;
}

button3.element.onclick = (): void => {
    slider.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'After', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'After', largeStep: 15, smallStep: 5, showSmallTicks: true };
}
button4.element.onclick = (): void => {
    slider.ticks = { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Before', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider.tooltip={ placement: 'After', isVisible: true };
    slider1.tooltip={ placement: 'After', isVisible: true };
    slider2.tooltip={ placement: 'After', isVisible: true };
}









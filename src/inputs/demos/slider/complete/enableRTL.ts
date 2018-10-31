import { Slider, SliderType } from '../../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';

/**
 *  Slider with RTL 
 */

let slider: Slider = new Slider({
    min: 0,
    max: 100,
    value: 45,
    enableRtl: true
});
slider.appendTo('#slider');

/**
 *  Range slider with RTL 
 */

let slider1: Slider = new Slider({
    value: [25, 40],
    type: 'Range',
    enableRtl: true
});
slider1.appendTo('#slider-02');

/**
 *  MinRange Slider with RTL 
 */
let slider2: Slider = new Slider({
    type: 'MinRange',
    value: 22,
    enableRtl: true
});
slider2.appendTo('#slider-03');

let button: Button = new Button();
button.appendTo('#bothticks');

let button1: Button = new Button();
button1.appendTo('#beforeticks');

let button2: Button = new Button();
button2.appendTo('#afterticks');

let  hstyle= document.getElementsByClassName("e-slider-container");

for (let i:number=0;i < hstyle.length ;i++){
    hstyle[i].classList.add("e-slider-hover");
}

// button click event handler
button.element.onclick = (): void => {
    slider.showButtons = true;
    slider1.showButtons = true;
    slider2.showButtons = true;
    slider.tooltip = { placement: 'After', isVisible: true };
    slider1.tooltip = { placement: 'After', isVisible: true };
    slider2.tooltip = { placement: 'After', isVisible: true };
    slider.ticks = { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Both', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true };
}
button1.element.onclick = (): void => {
    slider.tooltip = { placement: 'Before', isVisible: true };
    slider1.tooltip = { placement: 'Before', isVisible: true };
    slider2.tooltip = { placement: 'Before', isVisible: true };
    slider.ticks = { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Before', largeStep: 10, smallStep: 5, showSmallTicks: true };
}
button2.element.onclick = (): void => {
    slider.ticks = { placement: 'After', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'After', largeStep: 10, smallStep: 5, showSmallTicks: true };
}

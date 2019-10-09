import { Slider,SliderType } from '../../src/slider/slider';
/**
 * Default Slider sample
 */
let slider: Slider = new Slider({
    max:255,
    type: 'MinRange',
});
slider.appendTo('#slider');

let slider1: Slider = new Slider({
    max:255,
    type: 'MinRange',
    
});
slider1.appendTo('#slider-02');

let slider2: Slider = new Slider({
    max:255,
    type: 'MinRange',
    
});
slider2.appendTo('#slider-03');
slider.change = changeEvent;
slider1.change = changeEvent;
slider2.change = changeEvent;

function changeEvent(): void {

    let rgb: HTMLElement = document.getElementById('#color');
    rgb.style.backgroundColor = 'rgb(' + slider.value + ',' + slider1.value + ',' + slider2.value + ')';

}



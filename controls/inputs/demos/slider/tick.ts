import { Slider, SliderType } from '../../src/slider/slider';
/**
 * Default Slider sample
 */
let slider: Slider = new Slider({
    min: 0,
    max: 100,
    value: 45,
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider.appendTo('#slider');

let slider1: Slider = new Slider({
    value: [25, 40],
    type: 'Range',
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider1.appendTo('#slider-02');

let slider2: Slider = new Slider({
    type: 'MinRange',
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider2.appendTo('#slider-03');

let slider3: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true },
    showButtons: true,
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider3.appendTo('#slider-04');

let slider4: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'After', isVisible: true },
    showButtons: true,
    type: 'Range',
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider4.appendTo('#slider-05');

let slider5: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true },
    showButtons: true,
    ticks: { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider5.appendTo('#slider-06');

let slider6: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'After', isVisible: true },
    showButtons: true,
    type: 'Range',
    ticks: { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
slider6.appendTo('#slider-07');

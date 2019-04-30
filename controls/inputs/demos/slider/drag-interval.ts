import { Slider, SliderType } from '../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Drag Interval Slider sample
 */
let slider01: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 60],
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider01.appendTo('#slider01');

let slider02: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 60],
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    tooltip: { isVisible: true },
    type: 'Range'
});
slider02.appendTo('#slider02');

let slider03: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 60],
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    tooltip: { isVisible: true },
    type: 'Range',
    enableRtl: true
});
slider03.appendTo('#slider03');

let slider04: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 60],
    ticks: { placement: 'Both', largeStep: 25, smallStep: 5, showSmallTicks: true },
    type: 'Range',
    orientation: 'Vertical'
});
slider04.appendTo('#slider04');

let slider05: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 60],
    ticks: { placement: 'Both', largeStep: 25, smallStep: 5, showSmallTicks: true },
    tooltip: { isVisible: true },
    type: 'Range',
    orientation: 'Vertical'
});
slider05.appendTo('#slider05');

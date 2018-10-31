import { Slider, SliderType } from '../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Limits Slider sample
 */
let slider01: Slider = new Slider({
    min: 0,
    max: 100,
    value: 50,
    limits: { enabled: true, minStart: 20, minEnd: 80 },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'MinRange'
});
slider01.appendTo('#slider01');

let slider02: Slider = new Slider({
    min: 0,
    max: 100,
    value: 50,
    limits: { enabled: true, minStart: 20 },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'MinRange'
});
slider02.appendTo('#slider02');

let slider03: Slider = new Slider({
    min: 0,
    max: 100,
    value: 30,
    limits: { enabled: true, minEnd: 80 },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'MinRange'
});
slider03.appendTo('#slider03');

let slider04: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 70],
    limits: { enabled: true, minStart: 20, maxEnd: 80 },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider04.appendTo('#slider04');

let slider05: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 70],
    limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80 },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider05.appendTo('#slider05');

let slider06: Slider = new Slider({
    min: 0,
    max: 100,
    value: 50,
    limits: { enabled: true, minStart: 20, minEnd: 80, startHandleFixed: true },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
});
slider06.appendTo('#slider06');

let slider07: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 70],
    limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80, startHandleFixed: true },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider07.appendTo('#slider07');

let slider08: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 70],
    limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80, endHandleFixed: true },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider08.appendTo('#slider08');

let slider09: Slider = new Slider({
    min: 0,
    max: 100,
    value: [30, 70],
    limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80, startHandleFixed: true, endHandleFixed: true },
    ticks: { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true },
    type: 'Range'
});
slider09.appendTo('#slider09');

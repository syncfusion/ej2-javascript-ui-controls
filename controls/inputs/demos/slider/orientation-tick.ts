import { Slider,SliderType } from '../../src/slider/slider';
/**
 * Default Slider sample
 */

let defaultObj: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true },
    showButtons:true,
    orientation:'Vertical',
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
defaultObj.appendTo('#slidetool');

let rangeObj: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true },
    showButtons:true,
    type: 'Range',
    orientation:'Vertical',
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true }
});
rangeObj.appendTo('#rangeslidert');

let defaultObj1: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'After', isVisible: true },
    showButtons:true,
    ticks: { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true },
    orientation:'Vertical'
});
defaultObj1.appendTo('#slidetoolafter');

let rangeObj1: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'After', isVisible: true },
    showButtons:true,
    ticks: { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true },
    type: 'Range',
    orientation:'Vertical'
});
rangeObj1.appendTo('#rangeslidertafter');

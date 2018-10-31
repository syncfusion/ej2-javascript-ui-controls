import { Ajax, loadCldr, setCurrencyCode } from '@syncfusion/ej2-base';
import { Slider,SliderType, SliderTickEventArgs, SliderTooltipEventArgs } from '../../src/slider/slider';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, EmitType, L10n, setCulture } from '@syncfusion/ej2-base';
/**
 * Default Slider sample
 */

L10n.load({
    'de': {
        'slider': {
            incrementTitle: 'Erhöhen, ansteigen', decrementTitle: 'verringern'
        }
    }
});

let slider: Slider = new Slider({
    min: 0,
    max: 100,
    value: 45,
    tooltip: { placement: 'Before', isVisible: true, format:'c2' },
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true, format:'c3' }
});
slider.appendTo('#slider');

let slider1: Slider = new Slider({
    value: [25,40],
    type: 'Range',
    showButtons: true,
    tooltipChange: function(args: SliderTooltipEventArgs) {
    },
    tooltip: { placement: 'Before', isVisible: true, format:'$##.##' },
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true, format:'##.#00' }
});
slider1.appendTo('#slider-02');

let slider2: Slider = new Slider({
    type: 'MinRange',
    tooltip: { placement: 'Before', isVisible: true, format:'$00##.##' },
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true, format:'$00##.##' }
});
slider2.appendTo('#slider-03');

let slider3: Slider = new Slider({
    value: 10,
    tooltip: { placement: 'Before', isVisible: true, format:'00##.## Kms' },
    ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true, format:'00##.## Kms' }
});
slider3.appendTo('#slider-04');

let slider4: Slider = new Slider({
    value: 0,
    min: 0,
    max:6,
    step:1,
    tooltipChange: function (args: SliderTooltipEventArgs) {
        args.text =  'Day ' + (Number(args.text) + 1).toString();
    },
    tooltip: {
        placement: 'Before',
        isVisible: true,
        format:'n'
    },
    renderingTicks: function (args: SliderTickEventArgs) {
        let daysArr: string [] = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
        args.text = daysArr [parseFloat(args.text)];
    },
    ticks: {
        placement: 'After',
        largeStep: 1
    },
    showButtons: true
});
slider4.appendTo('#slider-05');

let slider5: Slider = new Slider({
    min: new Date("2013-06-13").getTime(),
    max: new Date("2013-06-21").getTime(),
    // 86400000 milliseconds for a day
    step: 86400000,
    tooltipChange: function (args: SliderTooltipEventArgs) {
        let totalMiliSeconds = Number(args.text);
        // Converting the current milliseconds to the respective date in desired format
        let custom = { year: "numeric", month: "short", day: "numeric" };
        args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", custom);
    },
    tooltip: {
        placement: 'Before',
        isVisible: true
    },
    renderingTicks: function (args: SliderTickEventArgs) {
        let totalMiliSeconds = Number(args.value);
        // Converting the current milliseconds to the respective date in desired format
        let custom = { year: "numeric", month: "short", day: "numeric" };
        args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", custom);
    },
    ticks: {
        placement: 'After',
        // 2 * 86400000 milliseconds for two days
        largeStep: 2 * 86400000
    },
    showButtons: true
});
slider5.appendTo('#slider-06');

let slider6: Slider = new Slider({
    // new Date(Year, Month, day, hours, minutes, seconds, millseconds)
    min: new Date(2013, 6, 13, 11).getTime(),
    max: new Date(2013, 6, 13, 17).getTime(),
    // 3600000 milliseconds = 1 Hour
    step: 3600000,
    tooltipChange: function (args: SliderTooltipEventArgs) {
        let totalMiliSeconds = Number(args.text);
        let custom = { hour: '2-digit', minute: '2-digit' };
        args.text = new Date(totalMiliSeconds).toLocaleTimeString("en-us", custom);
    },
    tooltip: {
        placement: 'Before',
        isVisible: true
    },
    renderingTicks: function (args: SliderTickEventArgs) {
        let totalMiliSeconds = Number(args.value);
        let custom = { hour: '2-digit', minute: '2-digit' };
        args.text = new Date(totalMiliSeconds).toLocaleTimeString("en-us", custom);
    },
    ticks: {
        placement: 'After',
        // 2 * 3600000 milliseconds = 2 Hour
        largeStep: 2 * 3600000
    },
    showButtons: true
});
slider6.appendTo('#slider-07');
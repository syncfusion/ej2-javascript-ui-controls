import { Slider, SliderType } from '../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';

let slider: Slider;
let slider1: Slider;
let slider2: Slider;

document.getElementById('render').addEventListener('click', renderSlider);
document.getElementById('destroy').addEventListener('click', destorySlider);

function renderSlider(): void {
    /**
     * Default Slider sample
     */
    slider = new Slider({
        min: 0,
        max: 100,
        value: 45,
        showButtons: true,
        ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true },
        tooltip: { isVisible: true, placement: 'Before', showOn: 'Always' },
        limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80 },
    });
    slider.appendTo('#slider');

    /**
     *  Slider with range sample
     */

    slider1 = new Slider({
        value: [25, 65],
        type: 'Range',
        showButtons: true,
        ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true },
        tooltip: { isVisible: true, placement: 'Before', showOn: 'Always' },
        limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80 },
    });

    /**
     * Slider with minrange sample
     */

    slider1.appendTo('#slider-02');

    slider2 = new Slider({
        type: 'MinRange',
        value: 32,
        showButtons: true,
        ticks: { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true },
        tooltip: { isVisible: true, placement: 'Before', showOn: 'Always' },
        limits: { enabled: true, minStart: 20, minEnd: 40, maxStart: 60, maxEnd: 80 },
    });
    slider2.appendTo('#slider-03');
}

function destorySlider(): void {
    if (slider && !slider.isDestroyed) {
        slider.destroy();
        slider = null;
    }
    if (slider1 && !slider1.isDestroyed) {
        slider1.destroy();
        slider1 = null;
    }
    if (slider2 && !slider2.isDestroyed) {
        slider2.destroy();
        slider2 = null;
    }
}








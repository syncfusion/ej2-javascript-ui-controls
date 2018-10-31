import { Slider, SliderType } from '../../src/slider/slider';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Default Slider sample
 */
let slider: Slider = new Slider({
    min: 0,
    max: 100,
    value: 45,
});
slider.appendTo('#slider');

/**
 *  Slider with range sample
 */

let slider1: Slider = new Slider({
    value: [25, 65],
    type: 'Range',
});

/**
 * Slider with minrange sample
 */

slider1.appendTo('#slider-02');

let slider2: Slider = new Slider({
    type: 'MinRange',
    value: 32,
});
slider2.appendTo('#slider-03');

let button: Button = new Button();
button.appendTo('#showbutton');


let button2: Button = new Button();
button2.appendTo('#disable');

let button3: Button = new Button();
button3.appendTo('#afterticks');

let button4: Button = new Button();
button4.appendTo('#beforeticks');

let button8: Button = new Button();
button8.appendTo('#customvalue');

let button9: Button = new Button();
button9.appendTo('#customvaluewithlimit');

let button5: Button = new Button();
button5.appendTo('#material');

let button6: Button = new Button();
button6.appendTo('#fabric');

let button7: Button = new Button();
button7.appendTo('#bootstrap');

// button click event handler
button.element.onclick = (): void => {
    slider.showButtons = true;
    slider1.showButtons = true;
    slider2.showButtons = true;
    slider.ticks = { placement: 'Both', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Both', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true };
}

button3.element.onclick = (): void => {
    slider.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'After', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'After', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider.tooltip = { placement: 'After', isVisible: true , showOn: 'Always' };
    slider1.tooltip = { placement: 'After', isVisible: true, showOn: 'Always' };
    slider2.tooltip = { placement: 'After', isVisible: true,showOn: 'Always' };
}
button4.element.onclick = (): void => {
    slider.ticks = { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'Before', largeStep: 10, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider.tooltip = { placement: 'Before', isVisible: true , showOn: 'Always'};
    slider1.tooltip = { placement: 'Before', isVisible: true, showOn: 'Always' };
    slider2.tooltip = { placement: 'Before', isVisible: true, showOn: 'Always' };
}

button8.element.onclick = (): void => {
    slider.customValues = [10, 9, 90, 999, 908, 45, 89, 77, 78];
    slider.value = 2;
    slider1.customValues = ["red", "yellow", "white", "green", "black", "pink"];
    slider1.value = [2, 4];
    slider2.customValues = [2, 3, 6, 7, 9, 0, 37, 99, 20];
    slider2.value = [3];
}

button9.element.onclick = (): void => {
    slider.limits = { enabled: true, minStart: 2, minEnd: 4, maxStart: 5, maxEnd: 7 },
    slider1.limits = { enabled: true, minStart: 2, minEnd: 3, maxStart: 4, maxEnd: 5 },
    slider2.limits = { enabled: true, minEnd: 8 }
}

document.getElementById('material').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/material.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/material.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/material.css');
    refresh();
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/fabric.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/fabric.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/fabric.css');
    refresh();
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../styles/slider/bootstrap.css');
    document.getElementById("theme1").setAttribute('href', '../../node_modules/@syncfusion/ej2-popups/styles/bootstrap.css');
    document.getElementById("theme2").setAttribute('href', '../../node_modules/@syncfusion/ej2-buttons/styles/bootstrap.css');
    refresh();
};

function refresh() {
    slider.refresh();
    slider1.refresh();
    slider2.refresh();
}









import { Slider, SliderType } from '../../src/slider/slider';
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
    value: [25, 65],
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
button.appendTo('#ticks');

let toggleBtn: Button = new Button({ isToggle: true });
toggleBtn.appendTo('#disable');

let button1: Button = new Button();
button1.appendTo('#customvalue');

let button9: Button = new Button();
button9.appendTo('#customvaluewithlimit');

let button5: Button = new Button();
button5.appendTo('#material');

let button6: Button = new Button();
button5.appendTo('#fabric');

let button7: Button = new Button();
button7.appendTo('#bootstrap');



// button click event handler
button.element.onclick = (): void => {
    slider.showButtons = true;
    slider1.showButtons = true;
    slider2.showButtons = true;
    slider.tooltip = { placement: 'After', isVisible: true ,showOn: 'Always' };
    slider1.tooltip = { placement: 'Before', isVisible: true , showOn: 'Always' };
    slider2.tooltip = { placement: 'After', isVisible: true , showOn: 'Always'};
    slider.ticks = { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true };
    slider1.ticks = { placement: 'After', largeStep: 20, smallStep: 5, showSmallTicks: true };
    slider2.ticks = { placement: 'Before', largeStep: 10, smallStep: 5, showSmallTicks: true };
}

button1.element.onclick = (): void => {
    slider.enabled=true;
    slider.customValues = [10, 9, 90, 999, 908, 45, 89, 77, 78];
    slider.value = 2;
    slider1.enabled=true;
    slider1.customValues = ["red", "yellow", "white", "green", "black", "pink"];
    slider1.value = [1, 4];
    slider2.enabled=true;
    slider2.customValues = [2, 3, 6, 7, 9, 0, 37, 99, 20];
    slider2.value = [3];
}

button9.element.onclick = (): void => {
    slider.limits ={ enabled: true, minStart: 2, minEnd: 4, maxStart: 5, maxEnd: 7 },
    slider1.limits = { enabled: true, minStart: 2, minEnd: 3, maxStart: 4, maxEnd: 5 },
    slider2.limits =  { enabled: true, minEnd: 8}
}

toggleBtn.element.onclick = (): void => {
    if (toggleBtn.element.classList.contains('e-active')) {
        slider.enabled = false;
        slider1.enabled = false;
        slider2.enabled = false;
    } else {
        slider.enabled = true;
        slider1.enabled = true;
        slider2.enabled = true;
    }
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




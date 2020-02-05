

import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition , GaugeTooltip} from '../../src/index';
CircularGauge.Inject(Annotations, Legend, GaugeTooltip);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: {
        visible: false,
    },
 
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', 
            font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
        }, majorTicks: { height: 10, offset: 5, color: '#9E9E9E' }, minorTicks: { height: 0 },
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120,
        ranges: [
            { start: 0, end: 20 },
            { start: 20, end: 40 },
            { start: 40, end: 60 },
            { start: 60, end: 80 },
            { start: 80, end: 100 },
            { start: 100, end: 120 }
        ],
        pointers: [{
            type : 'RangeBar',
            value : 45, animation: { enable: false },
            radius: '80%'
        }]
    }],

   
});
circulargauge.appendTo('#element');


document.getElementById('rangebarvalue').onchange = () => {
    let values = <HTMLInputElement>(document.getElementById('rangebarvalue'));
    circulargauge.axes[0].pointers[0].value = +values.value
    circulargauge.refresh();
 };


 document.getElementById('rangebarcolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('rangebarcolor'));
    circulargauge.axes[0].pointers[0].color = color.value
    circulargauge.refresh();
 };


 document.getElementById('pointerwidth').onchange = () => {
    let width  = <HTMLInputElement>(document.getElementById('pointerwidth'));
    circulargauge.axes[0].pointers[0].pointerWidth = +width.value;
    circulargauge.refresh();
 };

 document.getElementById('bordercolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('bordercolor'));
    circulargauge.axes[0].pointers[0].border.color = color.value;
    circulargauge.refresh();
 };


 document.getElementById('borderwidth').onchange = () => {
    let width  = <HTMLInputElement>(document.getElementById('borderwidth'));
    circulargauge.axes[0].pointers[0].border.width = +width.value;
    circulargauge.refresh();
 };


 document.getElementById('roundedcornerradius').onchange = () => {
    let roundedcorner = <HTMLInputElement>(document.getElementById('roundedcornerradius'));
    circulargauge.axes[0].pointers[0].roundedCornerRadius = +roundedcorner.value;
    circulargauge.refresh();
 };

 document.getElementById('enabletooltip').onchange = () => {
    let tooltip =  <HTMLInputElement>(document.getElementById('enabletooltip'));
    circulargauge.tooltip.enable = tooltip.checked;     
    circulargauge.refresh();
};

document.getElementById('tooltipborderwidth').onchange = () => {
  let tooltipwidth =  <HTMLInputElement>(document.getElementById('tooltipborderwidth'));
  circulargauge.tooltip.border.width = +tooltipwidth.value;
  circulargauge.tooltip.rangeSettings.border.width = +tooltipwidth.value;
  circulargauge.refresh();
};


document.getElementById('tooltipbordercolor').onchange = () => {
  let tooltipcolor =  <HTMLInputElement>(document.getElementById('tooltipbordercolor'));
  circulargauge.tooltip.border.color = tooltipcolor.value;
  circulargauge.tooltip.rangeSettings.border.color = tooltipcolor.value;
  circulargauge.refresh();
};


document.getElementById('tooltipfill').onchange = () => {
  let tooltipfill =  <HTMLInputElement>(document.getElementById('tooltipfill'));
  circulargauge.tooltip.fill = tooltipfill.value;
  circulargauge.tooltip.rangeSettings.fill = tooltipfill.value;
  circulargauge.refresh();
};


document.getElementById('mouseposition').onchange = () => {
    let mouse = <HTMLInputElement>(document.getElementById('mouseposition'));
    circulargauge.tooltip.showAtMousePosition = mouse.checked;
    circulargauge.tooltip.rangeSettings.showAtMousePosition = mouse.checked;
    circulargauge.refresh();
};
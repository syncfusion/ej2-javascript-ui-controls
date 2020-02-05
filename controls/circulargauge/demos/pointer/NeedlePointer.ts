

import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition, GaugeTooltip } from '../../src/index';
CircularGauge.Inject(Annotations, Legend, GaugeTooltip);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: {
        visible: false,
    },
    enablePointerDrag: true,
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', useRangeColor: false,
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
            value : 45, animation: { enable: false },
            radius: '80%'
        }]
    }],

    tooltip : {
        type : ['Pointer', 'Range'],
        enableAnimation : false        
    },

});
circulargauge.appendTo('#element');


document.getElementById('pointervalue').onchange = () => {
   let values = <HTMLInputElement>(document.getElementById('pointervalue'));
   circulargauge.axes[0].pointers[0].value = +values.value
   circulargauge.refresh();
};


 document.getElementById('pointercolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('pointercolor'));
    circulargauge.axes[0].pointers[0].color = color.value
    circulargauge.refresh();
 };


 document.getElementById('pointerwidth').onchange = () => {
    let width  = <HTMLInputElement>(document.getElementById('pointerwidth'));
    circulargauge.axes[0].pointers[0].pointerWidth = +width.value;
    circulargauge.refresh();
 };

 document.getElementById('pointercapcolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('pointercapcolor'));
    circulargauge.axes[0].pointers[0].cap.color = color.value;
    circulargauge.refresh();
 };


 document.getElementById('pointercapradius').onchange = () => {
    let radius  = <HTMLInputElement>(document.getElementById('pointercapradius'));
    circulargauge.axes[0].pointers[0].cap.radius = +radius.value;
    circulargauge.refresh();
 };


 document.getElementById('pointercapbordercolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('pointercapbordercolor'));
    circulargauge.axes[0].pointers[0].cap.border.color = color.value;
    circulargauge.refresh();
 };

 document.getElementById('pointercapborderwidth').onchange = () => {
    let width  = <HTMLInputElement>(document.getElementById('pointercapborderwidth'));
    circulargauge.axes[0].pointers[0].cap.border.width = +width.value;
    circulargauge.refresh();
 };


 document.getElementById('needletaillength').onchange = () => {
    let width  = <HTMLInputElement>(document.getElementById('needletaillength'));
    circulargauge.axes[0].pointers[0].needleTail.length = width.value+ '%' ;
    circulargauge.refresh();
 };

 document.getElementById('needletail').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('needletail'));
    circulargauge.axes[0].pointers[0].needleTail.color = color.value;
    circulargauge.refresh();
 };

 document.getElementById('needletailbordercolor').onchange = () => {
    let bordercolor = <HTMLInputElement>(document.getElementById('needletailbordercolor'));
    circulargauge.axes[0].pointers[0].needleTail.border.color = bordercolor.value;
    circulargauge.refresh();
 }

 document.getElementById('needletailborderwidth').onchange = () => {
    let borderwidth = <HTMLInputElement>(document.getElementById('needletailborderwidth'));
    circulargauge.axes[0].pointers[0].needleTail.border.width = +borderwidth.value;
    circulargauge.refresh();
 }

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


import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition,GaugeTooltip } from '../../src/index';
CircularGauge.Inject(Annotations, Legend, GaugeTooltip);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: {
        visible: false,
    },
 
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
            type:'Marker',
            animation: { enable: false },
            value: 85, radius: '100%', color: '#757575',
        }]
    }],
    tooltip : {
        type : ['Pointer', 'Range'],
        enableAnimation : false,
        
    },

});
circulargauge.appendTo('#element');


document.getElementById('markervalue').onchange = () => {
    let values = <HTMLInputElement>(document.getElementById('markervalue'));
    circulargauge.axes[0].pointers[0].value = +values.value
    circulargauge.refresh();
 };

document.getElementById('markershape').onchange = () => {
    let markers = <HTMLSelectElement>document.getElementById('markershape');
    circulargauge.axes[0].pointers[0].markerShape = <GaugeShape>markers.value;
    circulargauge.refresh();
};

document.getElementById('markerheight').onchange = () => {
    let height: HTMLInputElement = <HTMLInputElement>(document.getElementById('markerheight'));
    circulargauge.axes[0].pointers[0].markerHeight = +height.value;
    circulargauge.refresh();
 };

 document.getElementById('markerwidth').onchange = () => {
    let width: HTMLInputElement = <HTMLInputElement>(document.getElementById('markerwidth'));
    circulargauge.axes[0].pointers[0].markerWidth = +width.value
    circulargauge.refresh();
 };

 document.getElementById('markercolor').onchange = () => {
    let color: HTMLInputElement = <HTMLInputElement>(document.getElementById('markercolor'));
    circulargauge.axes[0].pointers[0].color = color.value
    circulargauge.refresh();
 };

 document.getElementById('markerbordercolor').onchange = () => {
    let bordercolor: HTMLInputElement = <HTMLInputElement>(document.getElementById('markerbordercolor'));
    circulargauge.axes[0].pointers[0].border.color = bordercolor.value
    circulargauge.refresh();
 };

 document.getElementById('markerborderwidth').onchange = () => {
    let width: HTMLInputElement = <HTMLInputElement>(document.getElementById('markerborderwidth'));
    circulargauge.axes[0].pointers[0].border.width = +width.value
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

 document.getElementById('tooltipformat').onchange = () => {
    let format = <HTMLInputElement>(document.getElementById('tooltipformat'));
      if(format.checked){
        circulargauge.tooltip.format = '${value}%';
    }else{
        circulargauge.tooltip.format = null;
    }
    circulargauge.refresh();
};


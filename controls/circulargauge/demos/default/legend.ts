/**
 * Range sample
 */
import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition } from '../../src/index';
CircularGauge.Inject(Annotations, Legend);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: {
        visible: true,
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
            animation: { enable: false },
            value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
            cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
        }]
    }]
});
circulargauge.appendTo('#legend-container');

document.getElementById('enable').onchange = () => {
    let enableLegend: boolean = (<HTMLInputElement>document.getElementById('enable')).checked;
    circulargauge.legendSettings.visible = enableLegend;
    circulargauge.refresh();
};

document.getElementById('toggle').onchange = () => {
    let toggle: boolean = (<HTMLInputElement>document.getElementById('toggle')).checked;
    circulargauge.legendSettings.toggleVisibility = toggle;
    circulargauge.refresh();
};
document.getElementById('shapeWidth').onchange = () => {
    let shapeWidth: number = parseInt((<HTMLInputElement>document.getElementById('shapeWidth')).value, 10);
    document.getElementById('legendShapeWidth').innerHTML = 'Shape Width <span>     ' + shapeWidth;
    circulargauge.legendSettings.shapeWidth = shapeWidth;
    circulargauge.refresh();
};

document.getElementById('shapeHeight').onchange = () => {
    let shapeHeight: number = parseInt((<HTMLInputElement>document.getElementById('shapeHeight')).value, 10);
    document.getElementById('legendShapeHeight').innerHTML = 'Shape Height <span>    ' + shapeHeight;
    circulargauge.legendSettings.shapeHeight = shapeHeight;
    circulargauge.refresh();
};
document.getElementById('alignment').onchange = (e: Event) => {
    let alignment: string = (e.target as HTMLSelectElement).value;
    circulargauge.legendSettings.alignment = alignment as Alignment;
    circulargauge.refresh();
};
document.getElementById('shape').onchange = (e: Event) => {
    let shape: string = (e.target as HTMLSelectElement).value;
    circulargauge.legendSettings.shape = shape as GaugeShape;
    circulargauge.refresh();
};
document.getElementById('position').onchange = (e: Event) => {
    let position: string = (e.target as HTMLSelectElement).value;
    circulargauge.legendSettings.position = position as LegendPosition;
    circulargauge.refresh();
};
document.getElementById('background').onchange = (e: Event) => {
    circulargauge.legendSettings.background = (document.getElementById('background') as HTMLSelectElement).value;
    circulargauge.refresh();
};
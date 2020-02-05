import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition ,ILegendRenderEventArgs} from '../../src/index';
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
    }],
    legendRender: function (args: ILegendRenderEventArgs) {
        args.shape = 'Rectangle';
    }
});
circulargauge.appendTo('#legend-container');
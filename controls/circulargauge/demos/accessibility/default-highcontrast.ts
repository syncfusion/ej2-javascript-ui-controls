import { CircularGauge, GaugeTheme, GaugeTooltip } from '../../src/index';
CircularGauge.Inject(GaugeTooltip)
let circulargauge: CircularGauge = new CircularGauge({
    title: 'Circular gauge',
    theme: 'HighContrast',
    axes: [{
        radius: '80%',
        startAngle: 230,
        endAngle: 130,
        majorTicks: {
            width: 2
        },
        lineStyle: { width: 8 },
        minorTicks: {
            width: 2
        },
        labelStyle: {
            offset: -5
        },
        pointers: [{
            animation: { enable: false },
            value: 60,
            radius: '60%',
            pointerWidth: 7,
            cap: {
                radius: 8,
                border: { width: 0 }
            },
            needleTail: {
                length: '25%'
            }
        }]
    }],
    tooltip: { enable: true }
});
circulargauge.appendTo('#container');
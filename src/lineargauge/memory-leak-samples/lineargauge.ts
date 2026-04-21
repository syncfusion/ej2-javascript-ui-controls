import { LinearGauge, Annotations, LinearGaugeTheme, GaugeTooltip, ITooltipRenderEventArgs, IAxisLabelRenderEventArgs, Gradient } from '../src/linear-gauge/index';
LinearGauge.Inject(Annotations, GaugeTooltip, Gradient);

let gauge: LinearGauge;

document.getElementById('render').addEventListener('click', renderLinearCauge);
document.getElementById('destroy').addEventListener('click', destroyLinearCauge);

function renderLinearCauge(): void {
gauge = new LinearGauge({
    title: 'Horizontal Gauge',
    theme: 'Material3',
    orientation: 'Horizontal',
    container: {
        width: 140,
        border: {
            width: 2,
            color: '#a6a6a6'
        }
    },
    tooltip: {
        enable: true
    },
    axes: [
        {
            isInversed: true,
            minimum: 0,
            maximum: 10,
            line: {
                offset: 140,
                width: 2,
                color: '#4286f4'
            },
            majorTicks: {
                interval: 1
            },
            minorTicks: {
                interval: 0.2
            },
            labelStyle: {
                useRangeColor: true,
                format: '{value} km',
                font: {
                    color: '#000000'
                }
            },
            pointers: [{
                animationDuration: 1000,
                type: 'Bar',
                value: 5.4,
                offset: 15,
                color: '#ff66b3',
                enableDrag: true
            },
            {
                value: 2,
                type: 'Marker',
                markerType: 'Circle',
                color: 'red',
                enableDrag: true
            },
            {
                value: 9,
                type: 'Marker',
                markerType: 'Circle',
                width: 50,
                height: 50,
                radialGradient: {
                    radius: '65%',
                    outerPosition: { x: '50%', y: '70%' },
                    innerPosition: { x: '60%', y: '60%' },
                    colorStop: [{ color: '#fff5f5', offset: '5%', opacity: 0.9 },
                    { color: '#f54ea2', offset: '100%', opacity: 0.9 }
                    ]
                }
            },
            {
                animationDuration: 1000,
                value: 10,
                width: 20,
                height: 50,
                type: 'Marker',
                markerType: 'Rectangle',
                linearGradient: {
                    startValue: '0%',
                    endValue: '100%',
                    colorStop: [{ color: '#fef3f9', offset: '0%', opacity: 1 },
                    { color: '#f54ea2', offset: '100%', opacity: 1 }
                    ]
                },
            },
            {
                value: 5.5,
                type: 'Marker',
                markerType: 'Text',
                text:'Marker Pointer type as text'
            }
            ],
            ranges: [{
                start: 7, end: 8,
                startWidth: 30, endWidth: 30,
                color: '#f54ea2', offset: 30,
                linearGradient: {
                    startValue: '0%',
                    endValue: '100%',
                    colorStop: [{ color: '#ff5d5d', offset: '0%', opacity: 1 },
                    { color: '#f54ea2', offset: '100%', opacity: 1 }
                    ]
                },
            }, {
                start: 3, end: 4, color: 'red'
            }
            ]
        },
        {
            opposedPosition: true,
            minimum: 0,
            maximum: 25,
            line: {
                offset: -140,
            },
            labelStyle: {
                position: 'Outside',
                font: {
                    color: '#000000'
                }
            },
            majorTicks: {
                interval: 1,
                position: 'Outside',
                color: 'red'
            },
            minorTicks: {
                interval: 0.2,
                position: 'Outside',
                color: 'green'
            },
            pointers: [{
                type: 'Bar',
                offset: -15,
                value: 16.5,
                color: '#4d94ff'
            }],
            ranges: [{
                start: 11, end: 16,
                startWidth: 10, endWidth: 15,
                offset: 1,
                radialGradient: {
                    radius: '65%',
                    outerPosition: { x: '50%', y: '70%' },
                    innerPosition: { x: '60%', y: '60%' },
                    colorStop: [{ color: '#fff5f5', offset: '5%', opacity: 0.9 },
                    { color: '#f54ea2', offset: '100%', opacity: 0.9 }
                    ]
                },
            }, {
                start: 17, end: 30, color: 'green'
            }
            ]

        }
    ],
    annotations: [
        {
            content: '<div id="first"><h1 style="font-size:15px">Inches</h1></div>',
            axisIndex: 0,
            axisValue: 5.4,
            x: 35,
            y: -58,
            zIndex: '1'
        },
        {
            content: '<div id="second"><h1 style="font-size:15px">Centimeters</h1></div>',
            axisIndex: 1,
            axisValue: 16.5,
            x: 50,
            y: 52,
            zIndex: '1'
        },
        {
            content: "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'><img src='https://ej2.syncfusion.com/demos/src/chart/images/male.png' alt='Annotation Image' /></div>",
            x:50,
            y:232,
            zIndex: '1'
        }
    ]
});
gauge.appendTo('#linear');}


function destroyLinearCauge(): void {
    if (gauge && !gauge.isDestroyed) {
        gauge.destroy();
    }
}
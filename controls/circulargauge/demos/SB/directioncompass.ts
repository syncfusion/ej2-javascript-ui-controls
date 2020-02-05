/**
 * Compass sample
 */
import { CircularGauge, IAxisLabelRenderEventArgs, ILoadedEventArgs, GaugeTheme } from '../../src/index';


    let value: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', ''];
   
    let circulargauge: CircularGauge = new CircularGauge({
        axisLabelRender: (args: IAxisLabelRenderEventArgs) => {
            args.text = value[args.value];
        },

        axes: [{
            radius: '70%',
            lineStyle: { width: 10 },
            labelStyle: {
                font: {
                    size: '12px', fontFamily: 'Roboto'
                },
                autoAngle: true,
                hiddenLabel: 'Last'
            }, majorTicks: {
                height: 15,
                interval: 1
            }, minorTicks: {
                height: 10,
                interval: 0.5
            },
            startAngle: 0,
            endAngle: 360,
            minimum: 0,
            maximum: 8,
            ranges: [{
                start: 7,
                end: 7
            }],
            pointers: [{
                value: 7,
                radius: '50%',
                color: '#f03e3e',
                pointerWidth: 20,
                cap: {
                    radius: 0
                },
                animation: { enable: false }
            }, {
                value: 3,
                radius: '50%',
                color: '#9E9E9E',
                pointerWidth: 20,
                cap: {
                    radius: 0
                },
                animation: { enable: false }
            }]
        }]
    });
    circulargauge.appendTo('#direction-container');


    document.getElementById('poiterColor').onchange = () => {
        let pointer = <HTMLInputElement>(document.getElementById('poiterColor'));
        circulargauge.axes[0].pointers[0].color = pointer.value;
        circulargauge.refresh();
    };

    document.getElementById('labelColor').onchange = () => {
        let fontcolor = <HTMLInputElement>(document.getElementById('labelColor'));
        circulargauge.axes[0].labelStyle.font.color = fontcolor.value;
        circulargauge.refresh();
    };
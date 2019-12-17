/**
 * Range sample
 */
import { CircularGauge, Annotations, ILoadedEventArgs, GaugeTheme } from '../../src/index';
// import { Slider, SliderChangeEventArgs  } from '@syncfusion/ej2-inputs';
CircularGauge.Inject(Annotations);
let sliderValue: number = 60;

let circulargauge: CircularGauge = new CircularGauge({
    load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    },
    loaded: (args: ILoadedEventArgs) => {
        let annotation: Element = document.getElementById(args.gauge.element.id + '_Annotations_0');
        if (annotation) {
        //    annotationRender('slider', circulargauge.axes[0].pointers[0].value);
        }
    },
    title: 'Progress Tracker',
        titleStyle: { size: '18px', },
        axes: [{
            annotations: [{
                    content: '<div id="pointervalue" style="color:#666666;font-size:35px;">' +
                    sliderValue.toString() + '/100</div>',
                    angle: 0,
                    zIndex: '1',
                    radius: '0%'
                },
                {
                    content: '<div id="slider" style="height:70px;width:250px;"></div>',
                    angle: 0,
                    zIndex: '1',
                    radius: '-100%'
                },
            ],
            lineStyle: { width: 0 },
            labelStyle: {
                position: 'Inside', useRangeColor: true,
                font: { size: '0px', color: 'white', fontFamily: 'Roboto', fontStyle: 'Regular' }
            }, majorTicks: { height: 10, }, minorTicks: { height: 5 },
            startAngle: 200, endAngle: 160, minimum: 0, maximum: 100, radius: '80%',
            ranges: [
                {
                    start: 0, end: 100,
                    radius: '90%',
                    startWidth: 30, endWidth: 30,
                    color: '#E0E0E0',
                    roundedCornerRadius: 20
                },
            ],
            pointers: [{
                roundedCornerRadius: 20,
                value: 60,
                type: 'RangeBar',
                radius: '90%',
                color: '#e5ce20',
                border: {
                    color: 'grey',
                    width: 2
                },
                animation: {
                    enable: false
                },
                pointerWidth: 30
            }]
        }]
});
circulargauge.appendTo('#range-container');
import { LinearGauge, ContainerType, Orientation, ILoadEventArgs, ILoadedEventArgs, IAxisLabelRenderEventArgs, IAnnotationRenderEventArgs } from '../../../src/linear-gauge/index';

let gauge: LinearGauge = new LinearGauge({
    loaded: (args: ILoadedEventArgs) => {
        args.gauge.setPointerValue(0, 0, 70);
    },
    title: 'Temperature Measure',
    container: {
        width: 13,
        roundedCornerRadius: 5,
        type: 'Thermometer'
    },
    axes: [{
        minimum: 0,
        maximum: 180,
        line: {
            width: 2
        },
        labelStyle: {
            font: {
                color: '#000000',
            }
        },
        majorTicks: {
            interval: 20,
        },
        pointers: [
            {
                value: 90,
                height: 13,
                width: 13,
                roundedCornerRadius: 5,
                type: 'Bar',
                color: '#f02828',
            }
        ],
    }]
});
gauge.appendTo('#container');
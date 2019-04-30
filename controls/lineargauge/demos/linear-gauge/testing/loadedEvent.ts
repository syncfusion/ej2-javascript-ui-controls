import { LinearGauge, ContainerType, Orientation, ILoadEventArgs, ILoadedEventArgs } from '../../../src/linear-gauge/index';

let gauge: LinearGauge = new LinearGauge({
    loaded: (args: ILoadedEventArgs) => {
        args.gauge.container.backgroundColor = 'pink';
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
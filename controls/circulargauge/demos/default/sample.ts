/**
 * Default sample
 */
import { CircularGauge, Gradient} from '../../src/index';
CircularGauge.Inject(Gradient);
let circulargauge: CircularGauge = new CircularGauge({
    axes: [{
        radius: '80%',
        startAngle: 230,
        endAngle: 130,
        majorTicks: {
            width: 0
        },
        lineStyle: { width: 8, color: '#E0E0E0' },
        minorTicks: {
            width: 0
        },
        labelStyle: {
            font: {
                color: '#424242',
                fontFamily: 'Roboto',
                size: '12px',
                fontWeight: 'Regular'
            },
            offset: -5
        },
        pointers: [{
            animation: { enable: false },
            value: 60,
            radius: '75%',
            color: '#F8C7FD',
            pointerWidth: 7,
            needleStartWidth: 6,
            needleEndWidth: 10,
            radialGradient: {
                radius: '50%',
                innerPosition:
                {
                    x: '50%', y: '50%'
                },
                outerPosition:
                {
                    x: '50%', y: '50%'
                },
                colorStop: [
                    {
                        color: 'orange',
                        offset: '0%',
                        opacity: 2
                    },
                    {
                        color: 'green',
                        offset: '100%',
                        opacity: 2
                    },
                ]
            },



            cap:
            {
                radius: 8,
                linearGradient: {
                    startValue: '0%',
                    endValue: '100%',
                    colorStop: [
                        {
                            color: 'yellow',
                            offset: '0%',
                            opacity: 2
                        },
                        {
                            color: 'pink',
                            offset: '100%',
                            opacity: 2
                        },
                    ]
                },
            },
            needleTail: {
                length: '25%',
                linearGradient: {
                    startValue: '0%',
                    endValue: '100%',
                    colorStop: [
                        {
                            color: 'black',
                            offset: '0%',
                            opacity: 2
                        },
                        {
                            color: 'blue',
                            offset: '100%',
                            opacity: 2
                        },
                    ]
                },

            }

        },
        {
            value: 90,
            type: 'Marker',
            markerShape: 'InvertedTriangle',
            radius: '100%',
            markerHeight: 15,
            markerWidth: 15,
            linearGradient: {
                startValue: '0%',
                endValue: '100%',
                colorStop: [
                    {
                        color: 'orange',
                        offset: '0%',
                        opacity: 2
                    },
                    {
                        color: 'red',
                        offset: '100%',
                        opacity: 2
                    },
                ]
            },

        },
        {
            value: 30,
            type: 'RangeBar',
            radius: '60%',
            linearGradient: {
                startValue: '0%',
                endValue: '100%',
                colorStop: [
                    {
                        color: '',
                        offset: '0%',
                        opacity: 2,
                        style: 'stop-color:green ;stop-opacity: 0.7;'
                    },
                    {
                        color: '',
                        offset: '100%',
                        style: 'stop-color:yellow ;stop-opacity: 0.7;'
                    },
                ]
            },

        }]
    }]
});
circulargauge.appendTo('#gauge');
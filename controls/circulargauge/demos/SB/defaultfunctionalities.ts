import { CircularGauge, ILoadedEventArgs, GaugeTheme } from '../../src/index';


    let circulargauge: CircularGauge = new CircularGauge({

        axes: [{
            radius: '80%',
            startAngle: 230,
            endAngle: 130,
            majorTicks: {
                width: 0
            },
            lineStyle: { width: 8 },
            minorTicks: {
                width: 0
            },
            labelStyle: {
                font: {
                    fontFamily: 'Roboto',
                    size: '12px',
                    fontWeight: 'Regular'
                },
                offset: -5
            },
            pointers: [{
                value: 60,
                radius: '60%',
                pointerWidth: 7,
                animation: {enable: false},
                cap: {
                    radius: 8,
                    border: { width: 0 }
                },
                needleTail: {
                    length: '25%'
                }
            }]
        }]
    });
    circulargauge.appendTo('#gauge');

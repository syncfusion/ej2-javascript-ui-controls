import { CircularGauge } from '../../src/index';
let gauge: CircularGauge = new CircularGauge({
    axes: [{
        pointers: [{
            value: 90,
            type: 'Marker',
            markerShape: 'InvertedTriangle',
            radius: '100%',
            markerHeight: 15,
            markerWidth: 15,
            animation:{enable: false}
        }, {
            value: 90,
            type: 'RangeBar',
            radius: '60%',
            pointerWidth: 10,
            animation:{enable: false}
        }, {
            value: 90,
            radius: '60%',
            cap: {
                radius: 15,
                border: {
                    width: 5
                }
            },
            needleTail: {
                length: '22%',
            },
            animation:{enable: false},
            pointerWidth: 25
        }]
    }]
}, '#element');
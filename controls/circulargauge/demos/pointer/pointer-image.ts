/**
 * Point Image Customization Sample
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        title: 'Short Put Distance',
        titleStyle: {
            size: '18px'
        },
        centerY: '57%',
        axes: [{
            annotations: [{
                content: '12 M', radius: '108%', angle: 98, zIndex: '1'
            }, {
                content: '11 M', radius: '80%', angle: 81, zIndex: '1'
            }, {
                content: '10 M', radius: '50%', angle: 69, zIndex: '1'
            }, {
                content: 'Doe', radius: '108%', angle: 190, zIndex: '1'
            }, {
                content: 'Almaida', radius: '80%', angle: 185, zIndex: '1'
            }, {
                content: 'John', radius: '50%', angle: 180, zIndex: '1'
            }],
            lineStyle: {
                width: 0, color: '#1d1d1d'
            },
            radius: '90%',
            labelStyle: {
                font: {
                    size: '0px'
                }
            }, majorTicks: {
                interval: 20, width: 0,
            }, minorTicks: {
                width: 0,
            },
            startAngle: 200, endAngle: 130,
            minimum: 0, maximum: 14,
            ranges: [{
                start: 0, end: 12, radius: '115%',
                color: '#01aebe', startWidth: 25, endWidth: 25
            }, {
                start: 0, end: 11, radius: '85%',
                color: '#3bceac', startWidth: 25, endWidth: 25
            }, {
                start: 0, end: 10, radius: '55%',
                color: '#ee4266', startWidth: 25, endWidth: 25
            }],
            pointers: [{
                type: 'Marker', value: 12, markerShape: 'Image',
                imageUrl: '../images/football.png',
                radius: '108%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 11, markerShape: 'Image',
                imageUrl: '../images/basketball.png',
                radius: '78%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 10, markerShape: 'Image',
                imageUrl: '../images/golfball.png',
                radius: '48%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 12, markerShape: 'Image',
                imageUrl: '../images/Athletics.png',
                radius: '0%', markerWidth: 90, markerHeight: 90,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 0.1, markerShape: 'Image',
                imageUrl: '../images/girl1.png',
                radius: '108%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 0.1, markerShape: 'Image',
                imageUrl: '../images/man1.png',
                radius: '78%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }, {
                type: 'Marker', value: 0.1, markerShape: 'Image',
                imageUrl: '../images/man2.png',
                radius: '48%', markerWidth: 28, markerHeight: 28,
                animation: { enable: false }
            }]
        }]
    });
    circulargauge.appendTo('#pointer-container');
};
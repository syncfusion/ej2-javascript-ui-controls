/**
 * Border sample
 */
import { CircularGauge, IAnnotationRenderEventArgs, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);


let circulargauge: CircularGauge = new CircularGauge({
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', useRangeColor: false,
            font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        annotations: [{
                content: 'Annotation',
                radius: '30%', angle: 0, zIndex: '1', autoAngle: true,
                textStyle: { color: 'blue'}
            }],
        majorTicks: { height: 10, offset: 5, color: '#9E9E9E' },
        minorTicks: { height: 0 },
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
        ranges: [
            { start: 0, end: 40, color: '#30B32D' },
            { start: 40, end: 80, color: '#FFDD00' },
            { start: 80, end: 120, color: '#F03E3E' }
        ],
        pointers: [{
                animation: { enable: false },
                value: 30,
            }]
    }],
    annotationRender: function (args: IAnnotationRenderEventArgs) {
        args.textStyle.color = "red";
        args.textStyle.fontFamily = "Times New Roman";
        args.textStyle.fontStyle = "italic";
        args.textStyle.fontWeight = "bold";
        args.textStyle.opacity = 0.5;
        args.textStyle.size = "25px";
    }
});
circulargauge.appendTo('#static-gauge');
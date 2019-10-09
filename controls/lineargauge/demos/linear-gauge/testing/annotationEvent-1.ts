import { LinearGauge, Annotations, ILoadEventArgs, IAnnotationRenderEventArgs } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

let gauge: LinearGauge = new LinearGauge({
    annotationRender: (args: IAnnotationRenderEventArgs) => {
        args.textStyle.size = '20px';
        args.textStyle.color = 'red';
        args.textStyle.fontFamily = "Times New Roman";
        args.textStyle.fontStyle = "italic";
        args.textStyle.fontWeight = "bold";
        args.textStyle.opacity = 0.5;
    },
    rangePalettes: ['#30b32d', '#ffdd00', '#f03e3e'],
    orientation: 'Vertical',
    annotations: [{
        content: 'Annotation',
        verticalAlignment: 'Center',
        x: 35, zIndex: '1',
        y: 50
    }],
    axes: [{
        maximum: 90,
        labelStyle: {
            font: {
                size: '0px'
            }
        },
        line: {
            width: 0
        },
        pointers: [
            {
                value: 35,
                height: 15,
                width: 15,
                color: '#757575',
                placement: 'Near',
                markerType: 'Triangle',
                offset: -50
            }
        ],
        majorTicks: {
            interval: 10,
            height: 0
        },
        minorTicks: {
            height: 0
        },
        ranges: [{
            start: 0,
            end: 30,
            startWidth: 50,
            endWidth: 50
        },
        {
            start: 30,
            end: 60,
            startWidth: 50,
            endWidth: 50
        },
        {
            start: 60,
            end: 90,
            startWidth: 50,
            endWidth: 50
        }]
    }],
});
gauge.appendTo('#container');
/**
 * default sample
 */
import { LinearGauge, Annotations, Print, ImageExport, PdfExport } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations, Print, ImageExport, PdfExport);

let gauge: LinearGauge = new LinearGauge({
    orientation: 'Horizontal',
    title: 'Speedometer',
    allowPrint : true,
    allowPdfExport : true,
    allowImageExport : true,
    axes: [{
        minimum: 0,
        maximum: 120,
        line:
        {
            width: 0
        },
        majorTicks: {
            height: 0,
            width: 0,
            interval: 20
        },
        minorTicks: {
            height: 7,
            width: 0,
            interval: 4
        },
        labelStyle: {
            position: 'Outside',
            offset: 4
        },
        ranges: [{
            start: 0,
            end: 20,
            startWidth: 15,
            endWidth: 25,
            color: '#82b944'
        },
        {
            start: 20, end: 40, startWidth: 25, endWidth: 35, color: '#a1cb43'
        },
        {
            start: 40, end: 60, startWidth: 35, endWidth: 45, color: '#ddec12'
        },
        {
            start: 60, end: 80, startWidth: 45, endWidth: 55, color: '#ffbc00'
        },
        {
            start: 80,
            end: 100,
            startWidth: 55,
            endWidth: 65,
            color: '#ff6000'
        },
        {
            start: 100,
            end: 120,
            startWidth: 65,
            endWidth: 75,
            color: 'red'
        },
        ],
        pointers: [{
            value: 80,
            height: 23,
            width: 35,
            offset: -55,
            markerType: 'Triangle',
            border:
            {
                width: 2,
                color: 'white'
            }
        }],
    }]
 });
gauge.appendTo('#container');

document.getElementById('togglebtn').onclick = () => {
    gauge.print();
};

document.getElementById('togglebtn1').onclick = () => {
 
    gauge.export('PDF','maps');
};

document.getElementById('togglebtn2').onclick = () => {
    gauge.export('SVG','maps');
};
document.getElementById('togglebtn3').onclick = () => {
    gauge.export('JPEG','maps');
};
document.getElementById('togglebtn4').onclick = () => {
    gauge.export('PNG','maps');
};
document.getElementById('togglebtn5').onclick = () => {
    gauge.export('JPEG', 'maps', 0, false).then((data: string)=>
    {
    let base64: string = data;
    document.writeln(base64);
    });
};
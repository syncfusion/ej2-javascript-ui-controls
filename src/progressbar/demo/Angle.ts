import { ProgressBar, ProgressAnnotation } from '../src/index';
ProgressBar.Inject(ProgressAnnotation);

let inverseSemiProgress: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle: 240,
    endAngle: 120,
    minimum: 0,
    width: '160px',
    height: '160px',
    maximum: 100,
    value: 100,
    cornerRadius: 'Round',
    trackThickness: 5,
    progressThickness: 5,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    annotations: [
        {
            content: '<div id="point1" style="font-size:24px;font-weight:bold;color:#0078D6;fill:#0078D6"><span>100%</span></div>'
        },
    ],
});
inverseSemiProgress.appendTo('#angle-container');

let verticalProgress: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle: 180,
    endAngle: 0,
    minimum: 0,
    width: '160px',
    height: '160px',
    maximum: 100,
    value: 100,
    cornerRadius: 'Round',
    trackThickness: 5,
    progressThickness: 5,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    annotations: [
        {
            content: '<div id="point1" style="font-size:24px;font-weight:bold;color:#0078D6;fill:#0078D6"><span>100%</span></div>'
        },
    ]
});
verticalProgress.appendTo('#vertical-container');
let verticalOppose: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle: 0,
    endAngle: 180,
    minimum: 0,
    width: '160px',
    height: '160px',
    maximum: 100,
    value: 100,
    cornerRadius: 'Round',
    trackThickness: 5,
    progressThickness: 5,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    annotations: [
        {
            content: '<div id="point1" style="font-size:24px;font-weight:bold;color:#0078D6;fill:#0078D6"><span>100%</span></div>'
        },
    ]
});
verticalOppose.appendTo('#vsemi-container');

let semiProgress: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle: 270,
    endAngle: 90,
    width: '160px',
    height: '160px',
    minimum: 0,
    maximum: 100,
    value: 100,
    cornerRadius: 'Round',
    trackThickness: 5,
    progressThickness: 5,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    annotations: [
        {
            content: '<div id="point1" style="font-size:24px;font-weight:bold;color:#0078D6;fill:#0078D6"><span>100%</span></div>'
        },
    ]
});
semiProgress.appendTo('#semi-container');

let fullBackground: ProgressBar = new ProgressBar({
    type: 'Circular',
    value: 60,
    width: '160px',
    height: '160px',
    enableRtl: false,
    radius: '100%',
    innerRadius: '190%',
    trackThickness: 80,
    cornerRadius: 'Round',
    progressThickness: 10,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    annotations: [
        {
            content: '<div id="point1" style="font-size:20px;font-weight:bold;color:red"><span>60%</span></div>',
        }
    ],
});
fullBackground.appendTo('#full-background');


let partBackground: ProgressBar = new ProgressBar({
    type: 'Circular',
    value: 60,
    width: '160px',
    height: '160px',
    radius: '73%',
    innerRadius: '80%',
    progressThickness: 62,
    trackThickness: 59,
    trackColor: 'lightgray',
});
partBackground.appendTo('#part-background');

let outerRadius: ProgressBar = new ProgressBar({
    type: 'Circular',
    value: 90,
    width: '160px',
    height: '160px',
    innerRadius: '72',
    progressThickness: 8,
    cornerRadius: 'Round',
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
});
outerRadius.appendTo('#outer-radius');

let onRadius: ProgressBar = new ProgressBar({
    type: 'Circular',
    value: 90,
    width: '160px',
    height: '160px',
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
    trackThickness: 3,
    progressThickness: 8,
});
onRadius.appendTo('#on-radius');

let pie: ProgressBar = new ProgressBar({
    type: 'Circular',
    value: 70,
    width: '160px',
    height: '160px',
    enablePieProgress: true,
    animation: {
        enable: true,
        duration: 2000,
        delay: 0,
    },
});
pie.appendTo('#pie');

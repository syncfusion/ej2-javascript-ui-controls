import { ProgressBar, ProgressAnnotation } from '../src/index';
ProgressBar.Inject(ProgressAnnotation);

/**
 * demo for progress bar
 */
let progress1: ProgressBar = new ProgressBar({
    type: 'Circular',
    minimum: 0,
    maximum: 100,
    value: 50,
    progressColor: '#4940fa',
    annotations: [
        {
            content: '<div id="point1" style="font-size:20px;font-weight:bold;color:#4940fa;fill:#4940fa"><span>50%</span></div>',
        },
    ],
});
progress1.appendTo('#container1');
let progress2: ProgressBar = new ProgressBar({
    type: 'Circular',
    minimum: 0,
    maximum: 100,
    value: 50,
    progressColor: '#4940fa',
    annotations: [
        {
            content: '<div id="point1" style="font-size:20px;font-weight:bold;color:#4940fa;fill:#4940fa"><span>50%</span></div>',
            annotationAngle: 180, annotationRadius: '70%'
        },
    ],
});
progress2.appendTo('#container2');
let progress3: ProgressBar = new ProgressBar({
    type: 'Circular',
    minimum: 0,
    maximum: 100,
    value: 50,
    progressColor: '#4940fa',
    annotations: [
        {
            content: '<div id="point1" style="font-size:20px;font-weight:bold;color:#4940fa;fill:#4940fa"><span>50%</span></div>',
        },
        {
            content: '<div id="point1" style="font-size:20px;font-weight:bold;color:#4940fa;fill:#4940fa"><span>used</span></div>',
            annotationAngle: 180, annotationRadius: '20%'
        },
    ],
});
progress3.appendTo('#container3');

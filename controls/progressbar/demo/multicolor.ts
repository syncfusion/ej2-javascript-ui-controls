import { ProgressBar } from '../src/index';
/**
 * demo for progress bar
 */
let linear: ProgressBar = new ProgressBar({
    type: 'Linear',
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
});
linear.appendTo('#linear');
let circular: ProgressBar = new ProgressBar({
    type: 'Circular',
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
});
circular.appendTo('#circular');
let semicircular: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle:270,
    endAngle:90,
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
});
semicircular.appendTo('#semicircle');
let linearround: ProgressBar = new ProgressBar({
    type: 'Linear',
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
    cornerRadius:'Round'
});
linearround.appendTo('#linearRound');
let circularround: ProgressBar = new ProgressBar({
    type: 'Circular',
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
    cornerRadius:'Round'
});
circularround.appendTo('#circularRound');
let semicircularround: ProgressBar = new ProgressBar({
    type: 'Circular',
    startAngle:270,
    endAngle:90,
    secondaryProgress:70,
    value: 65,
    segmentCount:4,
    gapWidth:5,
    segmentColor:['Green','Red','Blue','violet'],
    animation: {
        enable: true,
    },
    cornerRadius:'Round'
});
semicircularround.appendTo('#semicircleRound');
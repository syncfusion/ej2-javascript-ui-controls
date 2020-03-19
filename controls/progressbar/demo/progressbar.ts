import { ProgressBar } from '../src/index';
/**
 * demo for progress bar
 */
let linear: ProgressBar = new ProgressBar({
    type: 'Linear',
    minimum:10,
    maximum:80,
    secondaryProgress:70,
    value: 50,
    segmentCount:6,
    gapWidth:10,
    animation: {
        enable: true,
        duration:2000,
        delay:5,
    },
    enableRtl:false,
});
linear.appendTo('#linear');
let linearRtl: ProgressBar = new ProgressBar({
    type: 'Linear',
    minimum:10,
    maximum:80,
    secondaryProgress:70,
    value: 50,
    segmentCount:6,
    gapWidth:10,
    animation: {
        enable: true,
        duration:2000,
        delay:5,
    },
    enableRtl:true,
});
linearRtl.appendTo('#linearRtl');
let circular: ProgressBar = new ProgressBar({
    type: 'Circular',
    minimum:10,
    maximum:80,
    secondaryProgress:70,
    value: 50,
    segmentCount:6,
    gapWidth:10,
    animation: {
        enable: true,
        duration:2000,
        delay:5,
    },
    enableRtl:false,
});
circular.appendTo('#circular');
let circularRtl: ProgressBar = new ProgressBar({
    type: 'Circular',
    minimum:10,
    maximum:80,
    secondaryProgress:70,
    value: 50,
    segmentCount:6,
    gapWidth:10,
    animation: {
        enable: true,
        duration:2000,
        delay:5,
    },
    enableRtl:true,
});
circularRtl.appendTo('#circularRtl');
let semicircle: ProgressBar = new ProgressBar({
    type: 'Circular',
       startAngle:270,
        endAngle:90,
        minimum:10,
        maximum:80,
        value :70,
        secondaryProgress:75,
        segmentCount:6,
        gapWidth:10,
        animation:{
            enable:true,
            duration:2000,
            delay:5,
        },
        enableRtl:false,
});
semicircle.appendTo('#semicircle');
let semicircleRtl: ProgressBar = new ProgressBar({
    type: 'Circular',
        startAngle:270,
        endAngle:90,
        minimum:10,
        maximum:80,
        value :70,
        secondaryProgress:75,
        segmentCount:6,
        gapWidth:10,
        animation:{
            enable:true,
            duration:2000,
            delay:5,
        },
        enableRtl:true,
});
semicircleRtl.appendTo('#semicircleRtl');
let circleradius: ProgressBar = new ProgressBar({
    type: 'Circular',
    value:50,
    radius:'90%',
    innerRadius:'85%',
    animation:{
        enable:true,
    }
  
});
circleradius.appendTo('#circleradius');
let circleIndeterminate: ProgressBar = new ProgressBar({
    type: 'Circular',
    value:30,
    isIndeterminate:true,
  
});
circleIndeterminate.appendTo('#circleindeterminate');
let linearIndeterminate: ProgressBar = new ProgressBar({
    type: 'Linear',
    value:30,
    isIndeterminate:true,
  
});
linearIndeterminate.appendTo('#linearindeterminate');
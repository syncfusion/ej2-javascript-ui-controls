import { CircularGauge, Annotations, GaugeTooltip } from '../../src/index';
CircularGauge.Inject(Annotations, GaugeTooltip);
let gauge: CircularGauge = new CircularGauge({
    axes: [{
        annotations: [{
            content: '<div style="width: 30px; height: 40px">annotation-template</div>', zIndex:'1', 
        }],
        pointers:[{
            value: 50,
            animation: {enable:false},
        }]
    }],
    tooltip : {
        type : ['Pointer', 'Annotation'],
        enableAnimation : false,
        enable: true,
        annotationSettings: {
            format: "{value}"
        }
        
    },
}, '#element');

// document.getElementById('annotationcontent').onchange = () => {
//     let content = <HTMLInputElement>(document.getElementById('annotationcontent'));
//     gauge.axes[0].annotations[0].content = content.value;
//     gauge.refresh();
// }

document.getElementById('angle').onchange = () => {
    let angle = <HTMLInputElement>(document.getElementById('angle'));
    gauge.axes[0].annotations[0].angle = +angle.value;
    gauge.refresh();
};

document.getElementById('autoangle').onchange = () => {
    let angle =<HTMLInputElement>(document.getElementById('autoangle'));
  gauge.axes[0].annotations[0].autoAngle = angle.checked;
  gauge.refresh();
};

document.getElementById('annotationradius').onchange = () => {
    let annotationradius = <HTMLInputElement>(document.getElementById('annotationradius'));
    gauge.axes[0].annotations[0].radius = +annotationradius.value+ '%';
    gauge.refresh();
};

document.getElementById('annotationtextcolor').onchange = () => {
    let textcolor = <HTMLInputElement>(document.getElementById('annotationtextcolor'));
    gauge.axes[0].annotations[0].textStyle.color = textcolor.value;
    gauge.refresh();
};

document.getElementById('annotationfontfamily').onchange = () => {
    let family = <HTMLInputElement>(document.getElementById('annotationfontfamily'));
    gauge.axes[0].annotations[0].textStyle.fontFamily = family.value;
    gauge.refresh();
};

document.getElementById('annotationfontstyle').onchange = () => {
    let fontstyle = <HTMLInputElement>(document.getElementById('annotationfontstyle'));
    gauge.axes[0].annotations[0].textStyle.fontStyle = fontstyle.value;
    gauge.refresh();
};

// document.getElementById('annotationtextsize').onchange = () => {
//     let size = <HTMLInputElement>(document.getElementById('annotaiontextsize'));
//     gauge.axes[0].annotations[0].textStyle.size = size.value;
//     gauge.refresh();
// };

document.getElementById('annotationopacity').onchange = () => {
    let opacity = <HTMLInputElement>(document.getElementById('annotationopacity'));
    gauge.axes[0].annotations[0].textStyle.opacity = +opacity.value;
    gauge.refresh();
};

document.getElementById('zindex').onchange = () => {
    let zindex = <HTMLInputElement>(document.getElementById('zindex'));
    gauge.axes[0].annotations[0].zIndex = zindex.value;
    gauge.refresh();
};


document.getElementById('enabletooltip').onchange = () => {
    let tooltip =  <HTMLInputElement>(document.getElementById('enabletooltip'));
    gauge.tooltip.enable = tooltip.checked;     
    gauge.refresh();
};

document.getElementById('tooltipborderwidth').onchange = () => {
  let tooltipwidth =  <HTMLInputElement>(document.getElementById('tooltipborderwidth'));
  gauge.tooltip.annotationSettings.border.width = +tooltipwidth.value;
  gauge.refresh();
};


document.getElementById('tooltipbordercolor').onchange = () => {
  let tooltipcolor =  <HTMLInputElement>(document.getElementById('tooltipbordercolor'));
  gauge.tooltip.annotationSettings.border.color = tooltipcolor.value;
  gauge.refresh();
};


document.getElementById('tooltipfill').onchange = () => {
  let tooltipfill =  <HTMLInputElement>(document.getElementById('tooltipfill'));
  gauge.tooltip.annotationSettings.fill = tooltipfill.value;
  gauge.refresh();
};



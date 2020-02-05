

import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition,GaugeTooltip, HiddenLabel } from '../../src/index';
CircularGauge.Inject(Annotations, Legend, GaugeTooltip);

let circulargauge: CircularGauge = new CircularGauge({
    axes: [{

        annotations: [{
            content: '<div style="width: 30px; height: 40px">annotation-template</div>', zIndex:'1', 
        }],
        minimum : 0,
        maximum : 12,
        startAngle : 0,
        endAngle:360,
        // lineStyle: {
        //     width: 2,
        //     color: 'red'
        // },
         background: 'rgba(0, 128, 128, 0.3)'
    }]
});
circulargauge.appendTo('#element');

document.getElementById('backgroundcolor').onchange = () => {
    let background = <HTMLSelectElement>document.getElementById('backgroundcolor');
    circulargauge.axes[0].background = background.value;
    circulargauge.refresh();
};

document.getElementById('labelstyleformat').onchange = () => {
    let formats = <HTMLSelectElement>document.getElementById('labelstyleformat');
    circulargauge.axes[0].labelStyle.format = formats.value;
    circulargauge.refresh();
};

document.getElementById('linestylecolor').onchange = () => {
    let linecolor = <HTMLSelectElement>document.getElementById('linestylecolor');
    circulargauge.axes[0].lineStyle.color = linecolor.value;
    circulargauge.refresh();
};

document.getElementById('linestylewidth').onchange = () => {
    let linewidth = <HTMLInputElement>document.getElementById('linestylewidth');
    circulargauge.axes[0].lineStyle.width = +linewidth.value;
    circulargauge.refresh();
};

document.getElementById('dasharray').onchange = () => {
    let dasharray = <HTMLInputElement>(document.getElementById('dasharray'));
    circulargauge.axes[0].lineStyle.dashArray = dasharray.value;
    circulargauge.refresh();
};

document.getElementById('labelcolor').onchange = () => {
    let linecolor = <HTMLInputElement>document.getElementById('labelcolor');
    circulargauge.axes[0].labelStyle.font.color = linecolor.value;
    circulargauge.refresh();
};

document.getElementById('labelsize').onchange = () => {
    let labelsize = <HTMLInputElement>document.getElementById('labelsize');
    circulargauge.axes[0].labelStyle.font.size = labelsize.value;
    circulargauge.refresh();
};

document.getElementById('labelfontweight').onchange = () => {
    let labelfontweight = <HTMLInputElement>document.getElementById('labelfontweight');
    circulargauge.axes[0].labelStyle.font.fontWeight = labelfontweight.value;
    circulargauge.refresh();
};

document.getElementById('autoangle').onchange =  () => {
    let autoangle = <HTMLInputElement>document.getElementById('autoangle');
    circulargauge.axes[0].labelStyle.autoAngle = autoangle.checked;
    circulargauge.refresh();
};

document.getElementById('hiddenlabel').onchange = () => {
    let label = <HTMLSelectElement>document.getElementById('hiddenlabel');
    circulargauge.axes[0].labelStyle.hiddenLabel = <HiddenLabel>label.value;
    circulargauge.refresh();
};

document.getElementById('intersectinglabels').onchange = () => {
    let gap = <HTMLInputElement>(document.getElementById('intersectinglabels'));
         circulargauge.axes[0].hideIntersectingLabel = gap.checked;
         circulargauge.refresh();
};

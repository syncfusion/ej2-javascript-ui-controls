import { CircularGauge } from '../../src/index';
let gauge: CircularGauge = new CircularGauge({
    axes: [{
        minimum : 4,
        maximum : 104
    }],
    title: 'Speedometer',
    titleStyle: {
        color: '#27d5ff'
    }
}, '#element');

document.getElementById('title').onchange = () => {
    let title = <HTMLInputElement>(document.getElementById('title'));
    gauge.title = title.value;
    gauge.refresh();
};

document.getElementById('titlecolor').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('titlecolor'));
   gauge.titleStyle.color = color.value;
   gauge.refresh();
};


document.getElementById('fontfamily').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('fontfamily'));
   gauge.titleStyle.fontFamily = color.value;
   gauge.refresh();
};


document.getElementById('fontstyle').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('fontstyle'));
   gauge.titleStyle.fontStyle = color.value;
   gauge.refresh();
};


document.getElementById('fontweight').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('fontweight'));
   gauge.titleStyle.fontWeight = color.value;
   gauge.refresh();
};


document.getElementById('fontsize').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('fontsize'));
   gauge.titleStyle.size = color.value;
   gauge.refresh();
};


document.getElementById('titleopacity').onchange = () => {
    let color = <HTMLInputElement>(document.getElementById('titleopacity'));
   gauge.titleStyle.opacity = +color.value;
   gauge.refresh();
};

document.getElementById('gaugeheight').onchange = () => {
    let height = <HTMLInputElement>(document.getElementById('gaugeheight'));
    gauge.height = height.value+ 'px';
    gauge.refresh();
};

document.getElementById('gaugewidth').onchange = () => {
    let width = <HTMLInputElement>(document.getElementById('gaugewidth'));
    gauge.width = width.value+ 'px';
    gauge.refresh();
};

document.getElementById('gaugeradius').onchange = () => {
    let radius = <HTMLInputElement>(document.getElementById('gaugeradius'));
    gauge.axes[0].radius = radius.value+'%';
    gauge.refresh();
};

document.getElementById('minimum').onchange = () => {
    let minimum = <HTMLInputElement>(document.getElementById('minimum'));
    gauge.axes[0].minimum = +minimum.value;
    gauge.refresh();
};


document.getElementById('maximum').onchange = () => {
    let maximum = <HTMLInputElement>(document.getElementById('maximum'));
    gauge.axes[0].maximum = +maximum.value;
    gauge.refresh();
};
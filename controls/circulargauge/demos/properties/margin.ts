import { CircularGauge, ILoadedEventArgs, GaugeTheme } from '../../src/index';


    let circulargauge: CircularGauge = new CircularGauge({
        enablePersistence: true,
        axes: [{
            radius: '80%',
            startAngle: 230,
            endAngle: 130,
            majorTicks: {
                width: 0
            },
            lineStyle: { width: 8 },
            minorTicks: {
                width: 0
            },
            labelStyle: {
                font: {
                    fontFamily: 'Roboto',
                    size: '12px',
                    fontWeight: 'Regular'
                },
                offset: -5
            },
            pointers: [{
                value: 60,
                radius: '60%',
                pointerWidth: 7,
                animation: {enable: false},
                cap: {
                    radius: 8,
                    border: { width: 0 }
                },
                needleTail: {
                    length: '25%'
                }
            }]
        }]
    });
    circulargauge.appendTo('#gauge');

    document.getElementById('marginbottom').onchange = () => {
        let bottom = <HTMLInputElement>(document.getElementById('marginbottom'));
       circulargauge.margin.bottom = +bottom.value;
        circulargauge.refresh();
    };

    document.getElementById('margintop').onchange = () => {
        let top = <HTMLInputElement>(document.getElementById('margintop'));
       circulargauge.margin.top = +top.value;
        circulargauge.refresh();
    };

    document.getElementById('marginleft').onchange = () => {
        let right = <HTMLInputElement>(document.getElementById('marginleft'));
       circulargauge.margin.right = +right.value;
        circulargauge.refresh();
    };

    document.getElementById('marginright').onchange = () => {
        let left = <HTMLInputElement>(document.getElementById('marginright'));
       circulargauge.margin.left = +left.value;
        circulargauge.refresh();
    };
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

    document.getElementById('pointerdrag').onchange = () => {
        let pointerdrag = <HTMLInputElement>(document.getElementById('pointerdrag'));
        circulargauge.enablePointerDrag = pointerdrag.checked;
        circulargauge.refresh();
    };

    document.getElementById('pointervalue').onchange = () => {
        let pointerdrag = <HTMLInputElement>(document.getElementById('pointervalue'));
        circulargauge.axes[0].pointers[0].value = +pointerdrag.value;
        circulargauge.refresh();
    };

    document.getElementById('persistence').onchange = () => {
        let persistence = <HTMLInputElement>(document.getElementById('persistence'));
        circulargauge.enablePersistence = persistence.checked;
        circulargauge.refresh();
    };

    document.getElementById('rtl').onchange = () => {
        let rtl = <HTMLInputElement>(document.getElementById('rtl'));
        circulargauge.enableRtl = rtl.checked;
        circulargauge.refresh();
    };
import { LinearGauge, Annotations, LinearGaugeTheme, GaugeTooltip } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations, GaugeTooltip);

let gauge: LinearGauge = new LinearGauge({
        title: 'Linear gauge',
        orientation: 'Horizontal',
        axes: [{
            pointers: [{
                value: 10,
                height: 15,
                width: 15,
                placement: 'Near',
                offset: -50,
                markerType: 'Triangle'
            }],
            majorTicks: {
                interval: 10
            },
            minorTicks: {
                interval: 2
            },
            labelStyle: {
                offset: 48
            }
        }],
        tooltip: { enable: true }
 });
gauge.appendTo('#container');

document.getElementById('theme').onchange = (e: Event) => {
    let theme: string = (e.target as HTMLSelectElement).value.toString();
    gauge.theme = theme as LinearGaugeTheme;
    gauge.refresh();
}

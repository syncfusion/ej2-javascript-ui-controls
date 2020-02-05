/**
 * Range sample
 */
import { CircularGauge, Annotations,Legend } from '../../src/index';
CircularGauge.Inject(Annotations, Legend);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: {
        visible: true,
           },
    axes: [{  
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
        ranges: [{ start: 0, end: 40, color: '#30B32D',legendText: 'First' }, { start: 40, end: 80, color: '#FFDD00', legendText: 'Second' },
        { start: 80, end: 120, color: '#F03E3E' , legendText: 'last' }],
        pointers: [{
            animation: { enable: false },
            value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
            cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
        }]
    }]
});
circulargauge.appendTo('#range-container');

document.getElementById('rangeSelect').onchange = (e: Event) => {
    let index: number = +(e.target as HTMLSelectElement).value;
    (<HTMLInputElement>document.getElementById('opacity')).value = circulargauge.axes[0].ranges[index].opacity.toString();
        circulargauge.axes[0].ranges[index].opacity;
    (<HTMLInputElement>document.getElementById('radius')).value = circulargauge.axes[0].ranges[index].radius;
         circulargauge.axes[0].ranges[index].radius;
   };


    document.getElementById('opacity').onchange = () => {
        let opacity = <HTMLInputElement>(document.getElementById('opacity'));
        circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].opacity = +opacity.value;
        circulargauge.refresh();
    };


    document.getElementById('radius').onchange = () => {
        let radius = <HTMLInputElement>(document.getElementById('radius'));
        circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].radius = radius.value+'%';
        circulargauge.refresh();
    };


/**
 * Border sample
 */
import { CircularGauge, Annotations, ILoadedEventArgs } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
                    startAngle: 210, endAngle: 150, 
                     minimum: 0, maximum: 120, radius: '80%',
                     pointers: [{
                             animation: { enable: true,duration: 1000 },
                             value: 45, radius: '60%', color: 'green', 
                             type: 'RangeBar'
                         },
						 {
                             animation: { enable: true,duration: 1000 },
                             value: 90, radius: '60%', color: 'red',
                         }]
                 },]
    });
    circulargauge.appendTo('#static-gauge');
	document.getElementById('click').onclick = function() {
             circulargauge.setPointerValue(0, 0, 90);
			 circulargauge.setPointerValue(0, 1, 30);
         }
};

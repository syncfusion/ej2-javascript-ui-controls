/**
 * Default sample for smith chart
 */
import { Smithchart } from '../../src/smithchart/smithchart';
import { SmithchartLegend,  } from '../../src/smithchart/legend/legendrender';

Smithchart.Inject(SmithchartLegend);

let smithchart: Smithchart = new Smithchart({
    title: {
        visible: true,
        text: 'Transmission details'
    },
    renderType:'Admittance',
    series: [
         {
            points: [
                { resistance: 20, reactance: -50 }, { resistance: 10, reactance: -10 },
                { resistance: 9, reactance: -4.5 }, { resistance: 8, reactance: -3.5 },
                { resistance: 7, reactance: -2.5 }, { resistance: 6, reactance: -1.5 },
                { resistance: 5, reactance: -1 }, { resistance: 4.5, reactance: -0.5 },
                { resistance: 3.5, reactance: 0 }, { resistance: 2.5, reactance: 0.4 },
                { resistance: 2, reactance: 0.5 }, { resistance: 1.5, reactance: 0.5 },
                { resistance: 1, reactance: 0.4 }, { resistance: 0.5, reactance: 0.2 },
                { resistance: 0.3, reactance: 0.1 }, { resistance: 0, reactance: 0.05 },
            ],
            name: 'Transmission2'
        },
    ],
    legendSettings:{
        visible: true
    }
});
smithchart.appendTo('#container');
document.getElementById('labels').onchange = () => {
    var value =(<HTMLInputElement>(document.getElementById('labels'))).value;
    smithchart.legendSettings.position = value;
    smithchart.refresh();
} 


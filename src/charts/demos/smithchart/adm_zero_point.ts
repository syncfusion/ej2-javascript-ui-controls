/**
 * Default sample for smith chart
 */
import { Smithchart } from '../../src/smithchart/smithchart';

let smithchart: Smithchart = new Smithchart({
    renderType:'Admittance',
    series: [
        {
            points: [
                { resistance: 10, reactance: 0 }, { resistance: 8, reactance: 0 },
                { resistance: 6, reactance: 0 }, { resistance: 4.5, reactance: 0 },
                { resistance: 3.5, reactance: 0 }, { resistance: 2.5, reactance: 0 },
                { resistance: 2, reactance: 0 }, { resistance: 1.5, reactance: 0 },
                { resistance: 1, reactance: 0 }, { resistance: 0.5, reactance: 0 },
                { resistance: 0.3, reactance: 0 }, { resistance: 0, reactance: 0 },
            ],
            name: 'Transmission1'
        },
    ]
});
smithchart.appendTo('#container');

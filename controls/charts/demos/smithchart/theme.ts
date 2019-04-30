/**
 * Default sample for smith chart
 */
import { Smithchart } from '../../src/smithchart/smithchart';
import { SmithchartTheme } from '../../src';
import { SmithchartLegend } from '../../src/smithchart/legend/legendrender';
import { TooltipRender } from '../../src/smithchart/series/tooltip';
Smithchart.Inject(SmithchartLegend, TooltipRender);

let smithchart: Smithchart = new Smithchart({
    title: {
        visible: true,
        text: 'Transmission details',
        subtitle: { visible: true, text: '--radiation'}
    },
    series: [
        {
            points: [
                { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 },
            ],
            name: 'Transmission1',
            tooltip: { visible: true },
            marker: {
                dataLabel: {
                    visible: true
                },
                shape: 'Circle',
                visible: true
            }
        }, {
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
            name: 'Transmission2',
            tooltip: { visible: true },
            marker: {
                shape: 'Circle',
                visible: true
            }
        },
    ],
    legendSettings: {
        visible: true
    },
});
smithchart.appendTo('#container');
document.getElementById('theme').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('theme')).value;
    smithchart.theme= value as SmithchartTheme; 
    smithchart.refresh();
}
